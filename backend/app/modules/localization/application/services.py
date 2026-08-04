from sqlalchemy.orm import Session

from app.modules.localization.infrastructure.models import Locale, Translation
from app.modules.localization.infrastructure.repositories import LocaleRepository, TranslationRepository


class LocalizationApplicationService:
    def __init__(self, session: Session):
        self.session = session
        self.locales = LocaleRepository(session)
        self.translations = TranslationRepository(session)

    def list_locales(self) -> list[dict]:
        return [
            {
                "id": loc.id,
                "code": loc.code,
                "name": loc.name,
                "is_default": loc.is_default,
                "is_active": loc.is_active,
            }
            for loc in self.locales.list_active()
        ]

    def get_translations(self, entity_type: str, entity_id: int, locale: str | None = None) -> list[dict]:
        rows = self.translations.get_translations(entity_type, entity_id, locale)
        return [
            {
                "id": r.id,
                "entity_type": r.entity_type,
                "entity_id": r.entity_id,
                "field_key": r.field_key,
                "locale": r.locale,
                "value": r.value,
            }
            for r in rows
        ]

    def upsert_translations(
        self, entity_type: str, entity_id: int, items: list[dict]
    ) -> list[dict]:
        result = []
        for item in items:
            row = self.translations.upsert(
                entity_type=entity_type,
                entity_id=entity_id,
                field_key=item["field_key"],
                locale=item["locale"],
                value=item["value"],
            )
            result.append(
                {
                    "id": row.id,
                    "field_key": row.field_key,
                    "locale": row.locale,
                    "value": row.value,
                }
            )
        self.session.commit()
        return result
