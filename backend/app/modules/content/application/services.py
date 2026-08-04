import json
import secrets
from datetime import UTC, datetime, timedelta

from sqlalchemy.orm import Session

from app.config import settings
from app.modules.content.domain.enums import ALLOWED_TRANSITIONS, PageStatus, PublicationAction
from app.modules.content.infrastructure.models import Page, PageVersion, PreviewToken, Publication, Section
from app.modules.content.infrastructure.repositories import (
    PageFilters,
    PageRepository,
    PageVersionRepository,
    SectionRepository,
    SectionTypeRepository,
    apply_snapshot,
    page_to_snapshot,
)
from app.modules.navigation.infrastructure.models import Menu, MenuItem
from app.modules.navigation.infrastructure.repositories import (
    MenuRepository,
    PreviewTokenRepository,
    PublicationRepository,
    menu_items_tree,
)
from app.shared.domain.events import PageArchived, PagePublished, PageRolledBack
from app.shared.domain.exceptions import BusinessRuleError, NotFoundError, ValidationError
from app.shared.infrastructure.uow import UnitOfWork


def _parse_json(raw: str | None) -> dict:
    if not raw:
        return {}
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return {}


def _section_to_dict(section: Section) -> dict:
    return {
        "id": section.id,
        "section_type_slug": section.section_type_slug,
        "sort_order": section.sort_order,
        "content": _parse_json(section.content_json),
        "is_visible": section.is_visible,
        "locale": section.locale,
    }


def _page_to_dict(page: Page, sections: list[Section] | None = None) -> dict:
    visible = [s for s in (sections or page.sections or []) if s.is_visible]
    return {
        "id": page.id,
        "slug": page.slug,
        "locale": page.locale,
        "title": page.title,
        "meta_title": page.meta_title,
        "meta_description": page.meta_description,
        "template": page.template,
        "status": page.status,
        "published_version_id": page.published_version_id,
        "created_at": page.created_at.isoformat() if page.created_at else None,
        "updated_at": page.updated_at.isoformat() if page.updated_at else None,
        "sections": [_section_to_dict(s) for s in sorted(visible, key=lambda x: x.sort_order)],
    }


class PageApplicationService:
    def __init__(self, session: Session):
        self.session = session
        self.pages = PageRepository(session)
        self.sections = SectionRepository(session)
        self.section_types = SectionTypeRepository(session)
        self.versions = PageVersionRepository(session)
        self.publications = PublicationRepository(session)
        self.preview_tokens = PreviewTokenRepository(session)
        self.uow = UnitOfWork(session)

    def _get_page_or_404(self, page_id: int, *, with_sections: bool = False) -> Page:
        page = self.pages.get_by_id(page_id, with_sections=with_sections)
        if not page or page.deleted_at:
            raise NotFoundError("Page not found")
        return page

    def _ensure_transition(self, page: Page, target: PageStatus) -> None:
        current = PageStatus(page.status)
        allowed = ALLOWED_TRANSITIONS.get(current, set())
        if target not in allowed:
            raise BusinessRuleError(f"Transition {current.value} → {target.value} not allowed")

    def _create_version(self, page: Page, user_id: int | None, note: str | None = None) -> PageVersion:
        sections = self.sections.list_by_page(page.id)
        snapshot = page_to_snapshot(page, sections)
        version = PageVersion(
            page_id=page.id,
            version_number=self.versions.next_version_number(page.id),
            snapshot_json=json.dumps(snapshot, ensure_ascii=False),
            status_at_creation=page.status,
            change_note=note,
            created_by=user_id,
        )
        return self.versions.add(version)

    def list_pages(self, *, page: int, limit: int, filters: PageFilters) -> tuple[list[dict], int]:
        rows, total = self.pages.list_pages(page=page, limit=limit, filters=filters)
        return [
            {
                "id": p.id,
                "slug": p.slug,
                "locale": p.locale,
                "title": p.title,
                "status": p.status,
                "template": p.template,
                "updated_at": p.updated_at.isoformat() if p.updated_at else None,
            }
            for p in rows
        ], total

    def create_page(self, *, data: dict, user_id: int) -> dict:
        existing = self.pages.get_by_slug(data["slug"], data.get("locale", "fr"))
        if existing and not existing.deleted_at:
            raise ValidationError("Page slug already exists for this locale")
        page = Page(
            slug=data["slug"],
            locale=data.get("locale", "fr"),
            title=data["title"],
            meta_title=data.get("meta_title"),
            meta_description=data.get("meta_description"),
            template=data.get("template", "default"),
            status=PageStatus.DRAFT.value,
            created_by=user_id,
            updated_by=user_id,
        )
        self.pages.add(page)
        self.uow.commit()
        return _page_to_dict(page, [])

    def get_page(self, page_id: int) -> dict:
        page = self._get_page_or_404(page_id, with_sections=True)
        return _page_to_dict(page, page.sections)

    def update_page(self, page_id: int, *, data: dict, user_id: int) -> dict:
        page = self._get_page_or_404(page_id, with_sections=True)
        if "slug" in data and data["slug"] != page.slug:
            conflict = self.pages.get_by_slug(data["slug"], page.locale)
            if conflict and conflict.id != page.id:
                raise ValidationError("Slug already in use")
            page.slug = data["slug"]
        for field in ("title", "meta_title", "meta_description", "template"):
            if field in data:
                setattr(page, field, data[field])
        page.updated_by = user_id
        self.uow.commit()
        return _page_to_dict(page, page.sections)

    def delete_page(self, page_id: int, *, user_id: int) -> None:
        page = self._get_page_or_404(page_id)
        page.updated_by = user_id
        self.pages.soft_delete(page)
        self.uow.commit()

    def list_section_types(self) -> list[dict]:
        return [
            {
                "id": st.id,
                "slug": st.slug,
                "name": st.name,
                "description": st.description,
                "icon": st.icon,
                "schema": _parse_json(st.schema_json),
            }
            for st in self.section_types.list_active()
        ]

    def create_section(self, page_id: int, *, data: dict, user_id: int) -> dict:
        page = self._get_page_or_404(page_id)
        if not self.section_types.get_by_slug(data["section_type_slug"]):
            raise ValidationError("Unknown section type")
        sections = self.sections.list_by_page(page_id)
        sort_order = data.get("sort_order")
        if sort_order is None:
            sort_order = len(sections)
        section = Section(
            page_id=page.id,
            section_type_slug=data["section_type_slug"],
            sort_order=sort_order,
            content_json=json.dumps(data.get("content", {}), ensure_ascii=False),
            is_visible=data.get("is_visible", True),
            locale=data.get("locale", page.locale),
        )
        self.sections.add(section)
        page.updated_by = user_id
        self.uow.commit()
        return _section_to_dict(section)

    def update_section(self, section_id: int, *, data: dict, user_id: int) -> dict:
        section = self.sections.get_by_id(section_id)
        if not section:
            raise NotFoundError("Section not found")
        page = self._get_page_or_404(section.page_id)
        if "section_type_slug" in data and data["section_type_slug"]:
            if not self.section_types.get_by_slug(data["section_type_slug"]):
                raise ValidationError("Unknown section type")
            section.section_type_slug = data["section_type_slug"]
        if "content" in data and data["content"] is not None:
            section.content_json = json.dumps(data["content"], ensure_ascii=False)
        if "sort_order" in data and data["sort_order"] is not None:
            section.sort_order = data["sort_order"]
        if "is_visible" in data and data["is_visible"] is not None:
            section.is_visible = data["is_visible"]
        page.updated_by = user_id
        self.uow.commit()
        return _section_to_dict(section)

    def delete_section(self, section_id: int, *, user_id: int) -> None:
        section = self.sections.get_by_id(section_id)
        if not section:
            raise NotFoundError("Section not found")
        page = self._get_page_or_404(section.page_id)
        self.sections.delete(section)
        page.updated_by = user_id
        self.uow.commit()

    def reorder_sections(self, page_id: int, ordered_ids: list[int], *, user_id: int) -> list[dict]:
        page = self._get_page_or_404(page_id)
        sections = self.sections.reorder(page_id, ordered_ids)
        page.updated_by = user_id
        self.uow.commit()
        return [_section_to_dict(s) for s in sections]

    def submit_for_review(self, page_id: int, *, user_id: int, note: str | None = None) -> dict:
        page = self._get_page_or_404(page_id, with_sections=True)
        self._ensure_transition(page, PageStatus.REVIEW)
        version = self._create_version(page, user_id, note)
        page.status = PageStatus.REVIEW.value
        page.updated_by = user_id
        self.publications.add(
            Publication(
                page_id=page.id,
                version_id=version.id,
                action=PublicationAction.SUBMIT_REVIEW.value,
                published_by=user_id,
            )
        )
        self.uow.commit()
        return _page_to_dict(page, page.sections)

    def publish(self, page_id: int, *, user_id: int, note: str | None = None) -> dict:
        page = self._get_page_or_404(page_id, with_sections=True)
        if page.status == PageStatus.DRAFT.value:
            self._ensure_transition(page, PageStatus.REVIEW)
            page.status = PageStatus.REVIEW.value
        self._ensure_transition(page, PageStatus.PUBLISHED)
        version = self._create_version(page, user_id, note)
        page.status = PageStatus.PUBLISHED.value
        page.published_version_id = version.id
        page.updated_by = user_id
        self.publications.add(
            Publication(
                page_id=page.id,
                version_id=version.id,
                action=PublicationAction.PUBLISH.value,
                published_by=user_id,
            )
        )
        self.uow.add_event(
            PagePublished(page_id=page.id, version_id=version.id, slug=page.slug, locale=page.locale)
        )
        self.uow.commit()
        return _page_to_dict(page, page.sections)

    def archive(self, page_id: int, *, user_id: int) -> dict:
        page = self._get_page_or_404(page_id, with_sections=True)
        self._ensure_transition(page, PageStatus.ARCHIVED)
        page.status = PageStatus.ARCHIVED.value
        page.updated_by = user_id
        self.uow.add_event(PageArchived(page_id=page.id, slug=page.slug))
        self.uow.commit()
        return _page_to_dict(page, page.sections)

    def return_to_draft(self, page_id: int, *, user_id: int) -> dict:
        page = self._get_page_or_404(page_id, with_sections=True)
        self._ensure_transition(page, PageStatus.DRAFT)
        version = self._create_version(page, user_id, "Return to draft")
        page.status = PageStatus.DRAFT.value
        page.updated_by = user_id
        self.publications.add(
            Publication(
                page_id=page.id,
                version_id=version.id,
                action=PublicationAction.RETURN_DRAFT.value,
                published_by=user_id,
            )
        )
        self.uow.commit()
        return _page_to_dict(page, page.sections)

    def rollback(self, page_id: int, version_id: int, *, user_id: int) -> dict:
        page = self._get_page_or_404(page_id, with_sections=True)
        version = self.versions.get_by_id(version_id)
        if not version or version.page_id != page.id:
            raise NotFoundError("Version not found")
        snapshot = json.loads(version.snapshot_json)
        apply_snapshot(page, page.sections, snapshot)
        for section in self.sections.list_by_page(page.id):
            self.sections.delete(section)
        self.session.flush()
        for idx, s_data in enumerate(snapshot.get("sections", [])):
            self.sections.add(
                Section(
                    page_id=page.id,
                    section_type_slug=s_data["section_type_slug"],
                    sort_order=idx,
                    content_json=json.dumps(s_data.get("content", {}), ensure_ascii=False),
                    is_visible=s_data.get("is_visible", True),
                    locale=s_data.get("locale", page.locale),
                )
            )
        new_version = self._create_version(page, user_id, f"Rollback to v{version.version_number}")
        page.status = PageStatus.PUBLISHED.value
        page.published_version_id = new_version.id
        page.updated_by = user_id
        self.publications.add(
            Publication(
                page_id=page.id,
                version_id=new_version.id,
                action=PublicationAction.ROLLBACK.value,
                published_by=user_id,
            )
        )
        self.uow.add_event(PageRolledBack(page_id=page.id, version_id=new_version.id))
        self.uow.add_event(
            PagePublished(page_id=page.id, version_id=new_version.id, slug=page.slug, locale=page.locale)
        )
        self.uow.commit()
        page = self._get_page_or_404(page_id, with_sections=True)
        return _page_to_dict(page, page.sections)

    def list_versions(self, page_id: int) -> list[dict]:
        self._get_page_or_404(page_id)
        return [
            {
                "id": v.id,
                "version_number": v.version_number,
                "status_at_creation": v.status_at_creation,
                "change_note": v.change_note,
                "created_by": v.created_by,
                "created_at": v.created_at.isoformat() if v.created_at else None,
            }
            for v in self.versions.list_by_page(page_id)
        ]

    def create_preview_token(
        self, page_id: int, *, user_id: int, version_id: int | None = None
    ) -> dict:
        page = self._get_page_or_404(page_id, with_sections=True)
        if version_id:
            version = self.versions.get_by_id(version_id)
            if not version or version.page_id != page.id:
                raise NotFoundError("Version not found")
        else:
            version = self._create_version(page, user_id, "Preview snapshot")
            self.uow.commit()
        token = secrets.token_urlsafe(32)
        expires = datetime.now(UTC) + timedelta(hours=settings.preview_token_expire_hours)
        preview = PreviewToken(
            page_id=page.id,
            version_id=version.id,
            token=token,
            expires_at=expires,
            created_by=user_id,
        )
        self.preview_tokens.add(preview)
        self.uow.commit()
        return {
            "token": token,
            "expires_at": expires.isoformat(),
            "preview_url": f"/api/v1/public/preview/{token}",
        }

    def get_published_page(self, slug: str, locale: str) -> dict | None:
        page = self.pages.get_published_by_slug(slug, locale)
        if not page:
            return None
        return _page_to_dict(page, page.sections)

    def get_preview_content(self, token: str) -> dict:
        row = self.preview_tokens.get_valid(token)
        if not row:
            raise NotFoundError("Preview token invalid or expired")
        version = self.versions.get_by_id(row.version_id)
        if not version:
            raise NotFoundError("Preview version not found")
        snapshot = json.loads(version.snapshot_json)
        page_data = snapshot.get("page", {})
        return {
            "slug": page_data.get("slug"),
            "locale": page_data.get("locale"),
            "title": page_data.get("title"),
            "meta_title": page_data.get("meta_title"),
            "meta_description": page_data.get("meta_description"),
            "template": page_data.get("template"),
            "status": "preview",
            "sections": snapshot.get("sections", []),
        }


class NavigationApplicationService:
    def __init__(self, session: Session):
        self.session = session
        self.menus = MenuRepository(session)
        self.uow = UnitOfWork(session)

    def _menu_to_dict(self, menu: Menu) -> dict:
        return {
            "id": menu.id,
            "slug": menu.slug,
            "name": menu.name,
            "locale": menu.locale,
            "items": menu_items_tree(menu.items),
        }

    def list_menus(self, locale: str | None = None) -> list[dict]:
        return [self._menu_to_dict(m) for m in self.menus.list_all(locale)]

    def get_menu(self, slug: str, locale: str) -> dict:
        menu = self.menus.get_by_slug(slug, locale)
        if not menu:
            raise NotFoundError("Menu not found")
        return self._menu_to_dict(menu)

    def create_item(self, menu_id: int, *, data: dict) -> dict:
        menu = self.session.get(Menu, menu_id)
        if not menu:
            raise NotFoundError("Menu not found")
        items = menu.items
        sort_order = data.get("sort_order")
        if sort_order is None:
            sort_order = len(items)
        item = MenuItem(
            menu_id=menu_id,
            parent_id=data.get("parent_id"),
            label=data["label"],
            url=data["url"],
            sort_order=sort_order,
            is_external=data.get("is_external", False),
            locale=menu.locale,
        )
        self.menus.add_item(item)
        self.uow.commit()
        return {
            "id": item.id,
            "label": item.label,
            "url": item.url,
            "parent_id": item.parent_id,
            "sort_order": item.sort_order,
            "is_external": item.is_external,
        }

    def update_item(self, item_id: int, *, data: dict) -> dict:
        item = self.menus.get_item(item_id)
        if not item:
            raise NotFoundError("Menu item not found")
        for field in ("label", "url", "parent_id", "is_external", "sort_order"):
            if field in data and data[field] is not None:
                setattr(item, field, data[field])
        self.uow.commit()
        return {
            "id": item.id,
            "label": item.label,
            "url": item.url,
            "parent_id": item.parent_id,
            "sort_order": item.sort_order,
            "is_external": item.is_external,
        }

    def delete_item(self, item_id: int) -> None:
        item = self.menus.get_item(item_id)
        if not item:
            raise NotFoundError("Menu item not found")
        self.menus.delete_item(item)
        self.uow.commit()

    def reorder_items(self, menu_id: int, ordered_ids: list[int]) -> list[dict]:
        menu = self.session.get(Menu, menu_id)
        if not menu:
            raise NotFoundError("Menu not found")
        items = self.menus.reorder_items(menu_id, ordered_ids)
        self.uow.commit()
        return [
            {
                "id": i.id,
                "label": i.label,
                "url": i.url,
                "sort_order": i.sort_order,
                "is_external": i.is_external,
            }
            for i in items
        ]
