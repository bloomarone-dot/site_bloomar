import json

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.modules.content.infrastructure.models import PreviewToken, Publication
from app.modules.navigation.infrastructure.models import Menu, MenuItem


class MenuRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_slug(self, slug: str, locale: str) -> Menu | None:
        return self.session.scalar(
            select(Menu)
            .options(selectinload(Menu.items))
            .where(Menu.slug == slug, Menu.locale == locale)
        )

    def list_all(self, locale: str | None = None) -> list[Menu]:
        query = select(Menu).options(selectinload(Menu.items))
        if locale:
            query = query.where(Menu.locale == locale)
        return list(self.session.scalars(query.order_by(Menu.slug)).all())

    def add(self, menu: Menu) -> Menu:
        self.session.add(menu)
        self.session.flush()
        return menu

    def get_item(self, item_id: int) -> MenuItem | None:
        return self.session.get(MenuItem, item_id)

    def add_item(self, item: MenuItem) -> MenuItem:
        self.session.add(item)
        self.session.flush()
        return item

    def delete_item(self, item: MenuItem) -> None:
        self.session.delete(item)

    def reorder_items(self, menu_id: int, ordered_ids: list[int]) -> list[MenuItem]:
        items = {
            i.id: i
            for i in self.session.scalars(select(MenuItem).where(MenuItem.menu_id == menu_id)).all()
        }
        for idx, iid in enumerate(ordered_ids):
            if iid in items:
                items[iid].sort_order = idx
        self.session.flush()
        return list(
            self.session.scalars(
                select(MenuItem).where(MenuItem.menu_id == menu_id).order_by(MenuItem.sort_order)
            ).all()
        )


def menu_items_tree(items: list[MenuItem]) -> list[dict]:
    by_parent: dict[int | None, list[MenuItem]] = {}
    for item in items:
        by_parent.setdefault(item.parent_id, []).append(item)

    def build(parent_id: int | None) -> list[dict]:
        nodes = sorted(by_parent.get(parent_id, []), key=lambda x: x.sort_order)
        return [
            {
                "id": n.id,
                "label": n.label,
                "url": n.url,
                "is_external": n.is_external,
                "sort_order": n.sort_order,
                "children": build(n.id),
            }
            for n in nodes
        ]

    return build(None)


class PreviewTokenRepository:
    def __init__(self, session: Session):
        self.session = session

    def add(self, token: PreviewToken) -> PreviewToken:
        self.session.add(token)
        self.session.flush()
        return token

    def get_valid(self, token: str) -> PreviewToken | None:
        from datetime import UTC, datetime

        row = self.session.scalar(select(PreviewToken).where(PreviewToken.token == token))
        if not row:
            return None
        expires = row.expires_at
        if expires.tzinfo is None:
            expires = expires.replace(tzinfo=UTC)
        if expires < datetime.now(UTC):
            return None
        return row


class PublicationRepository:
    def __init__(self, session: Session):
        self.session = session

    def add(self, publication: Publication) -> Publication:
        self.session.add(publication)
        self.session.flush()
        return publication

    def list_by_page(self, page_id: int) -> list[Publication]:
        return list(
            self.session.scalars(
                select(Publication).where(Publication.page_id == page_id).order_by(Publication.published_at.desc())
            ).all()
        )
