from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.localization.infrastructure.models import Locale, Translation


class LocaleRepository:
    def __init__(self, session: Session):
        self.session = session

    def list_active(self) -> list[Locale]:
        return list(self.session.scalars(select(Locale).where(Locale.is_active.is_(True))).all())

    def get_by_code(self, code: str) -> Locale | None:
        return self.session.scalar(select(Locale).where(Locale.code == code))

    def add(self, locale: Locale) -> Locale:
        self.session.add(locale)
        self.session.flush()
        return locale


class TranslationRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_translations(self, entity_type: str, entity_id: int, locale: str | None = None) -> list[Translation]:
        query = select(Translation).where(
            Translation.entity_type == entity_type,
            Translation.entity_id == entity_id,
        )
        if locale:
            query = query.where(Translation.locale == locale)
        return list(self.session.scalars(query).all())

    def upsert(self, entity_type: str, entity_id: int, field_key: str, locale: str, value: str) -> Translation:
        row = self.session.scalar(
            select(Translation).where(
                Translation.entity_type == entity_type,
                Translation.entity_id == entity_id,
                Translation.field_key == field_key,
                Translation.locale == locale,
            )
        )
        if row:
            row.value = value
        else:
            row = Translation(
                entity_type=entity_type,
                entity_id=entity_id,
                field_key=field_key,
                locale=locale,
                value=value,
            )
            self.session.add(row)
        self.session.flush()
        return row

    def delete_for_entity(self, entity_type: str, entity_id: int) -> None:
        rows = self.session.scalars(
            select(Translation).where(
                Translation.entity_type == entity_type,
                Translation.entity_id == entity_id,
            )
        ).all()
        for row in rows:
            self.session.delete(row)
