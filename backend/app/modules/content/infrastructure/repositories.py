import json
from dataclasses import dataclass
from datetime import UTC, datetime

from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.modules.content.infrastructure.models import Page, PageVersion, Section, SectionType
from app.shared.domain.exceptions import NotFoundError


@dataclass
class PageFilters:
    locale: str | None = None
    status: str | None = None
    include_deleted: bool = False
    search: str | None = None


class PageRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_id(self, page_id: int, *, with_sections: bool = False) -> Page | None:
        query = select(Page).where(Page.id == page_id)
        if with_sections:
            query = query.options(selectinload(Page.sections))
        return self.session.scalar(query)

    def get_by_slug(self, slug: str, locale: str, *, with_sections: bool = False) -> Page | None:
        query = select(Page).where(Page.slug == slug, Page.locale == locale, Page.deleted_at.is_(None))
        if with_sections:
            query = query.options(selectinload(Page.sections))
        return self.session.scalar(query)

    def get_published_by_slug(self, slug: str, locale: str) -> Page | None:
        return self.session.scalar(
            select(Page)
            .options(selectinload(Page.sections))
            .where(
                Page.slug == slug,
                Page.locale == locale,
                Page.status == "published",
                Page.deleted_at.is_(None),
            )
        )

    def list_pages(self, *, page: int, limit: int, filters: PageFilters) -> tuple[list[Page], int]:
        query = select(Page)
        count_q = select(func.count()).select_from(Page)
        if not filters.include_deleted:
            query = query.where(Page.deleted_at.is_(None))
            count_q = count_q.where(Page.deleted_at.is_(None))
        if filters.locale:
            query = query.where(Page.locale == filters.locale)
            count_q = count_q.where(Page.locale == filters.locale)
        if filters.status:
            query = query.where(Page.status == filters.status)
            count_q = count_q.where(Page.status == filters.status)
        if filters.search:
            like = f"%{filters.search}%"
            query = query.where((Page.title.ilike(like)) | (Page.slug.ilike(like)))
            count_q = count_q.where((Page.title.ilike(like)) | (Page.slug.ilike(like)))
        total = self.session.scalar(count_q) or 0
        rows = self.session.scalars(
            query.order_by(Page.updated_at.desc()).offset((page - 1) * limit).limit(limit)
        ).all()
        return list(rows), total

    def add(self, page: Page) -> Page:
        self.session.add(page)
        self.session.flush()
        return page

    def soft_delete(self, page: Page) -> None:
        page.deleted_at = datetime.now(UTC)
        page.status = "archived"


class SectionRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_id(self, section_id: int) -> Section | None:
        return self.session.get(Section, section_id)

    def list_by_page(self, page_id: int) -> list[Section]:
        return list(
            self.session.scalars(
                select(Section).where(Section.page_id == page_id).order_by(Section.sort_order)
            ).all()
        )

    def add(self, section: Section) -> Section:
        self.session.add(section)
        self.session.flush()
        return section

    def delete(self, section: Section) -> None:
        self.session.delete(section)

    def reorder(self, page_id: int, ordered_ids: list[int]) -> list[Section]:
        sections = {s.id: s for s in self.list_by_page(page_id)}
        for idx, sid in enumerate(ordered_ids):
            if sid in sections:
                sections[sid].sort_order = idx
        self.session.flush()
        return self.list_by_page(page_id)


class SectionTypeRepository:
    def __init__(self, session: Session):
        self.session = session

    def list_active(self) -> list[SectionType]:
        return list(self.session.scalars(select(SectionType).where(SectionType.is_active.is_(True))).all())

    def get_by_slug(self, slug: str) -> SectionType | None:
        return self.session.scalar(select(SectionType).where(SectionType.slug == slug))

    def add(self, section_type: SectionType) -> SectionType:
        self.session.add(section_type)
        self.session.flush()
        return section_type


class PageVersionRepository:
    def __init__(self, session: Session):
        self.session = session

    def add(self, version: PageVersion) -> PageVersion:
        self.session.add(version)
        self.session.flush()
        return version

    def get_by_id(self, version_id: int) -> PageVersion | None:
        return self.session.get(PageVersion, version_id)

    def list_by_page(self, page_id: int) -> list[PageVersion]:
        return list(
            self.session.scalars(
                select(PageVersion).where(PageVersion.page_id == page_id).order_by(PageVersion.version_number.desc())
            ).all()
        )

    def next_version_number(self, page_id: int) -> int:
        current = self.session.scalar(
            select(func.max(PageVersion.version_number)).where(PageVersion.page_id == page_id)
        )
        return (current or 0) + 1


def page_to_snapshot(page: Page, sections: list[Section]) -> dict:
    return {
        "page": {
            "slug": page.slug,
            "locale": page.locale,
            "title": page.title,
            "meta_title": page.meta_title,
            "meta_description": page.meta_description,
            "template": page.template,
            "status": page.status,
        },
        "sections": [
            {
                "id": s.id,
                "section_type_slug": s.section_type_slug,
                "sort_order": s.sort_order,
                "content": json.loads(s.content_json or "{}"),
                "is_visible": s.is_visible,
                "locale": s.locale,
            }
            for s in sections
        ],
    }


def apply_snapshot(page: Page, sections: list[Section], snapshot: dict) -> None:
    page_data = snapshot.get("page", {})
    page.title = page_data.get("title", page.title)
    page.meta_title = page_data.get("meta_title")
    page.meta_description = page_data.get("meta_description")
    page.template = page_data.get("template", page.template)
