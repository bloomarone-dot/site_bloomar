from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.settings.models import Setting
from app.modules.settings.schemas import DEFAULT_SETTINGS, deserialize_value, serialize_value


class SettingsService:
    def __init__(self, db: Session):
        self.db = db

    def seed_defaults(self) -> None:
        for group, items in DEFAULT_SETTINGS.items():
            for key, value in items.items():
                exists = self.db.scalar(
                    select(Setting).where(Setting.group == group, Setting.key == key)
                )
                if exists:
                    continue
                self.db.add(
                    Setting(group=group, key=key, value=serialize_value(value))
                )
        self.db.commit()

    def get_group(self, group: str) -> dict:
        rows = self.db.scalars(select(Setting).where(Setting.group == group)).all()
        if not rows and group in DEFAULT_SETTINGS:
            return dict(DEFAULT_SETTINGS[group])
        return {row.key: deserialize_value(row.value) for row in rows}

    def list_groups(self) -> list[str]:
        rows = self.db.scalars(select(Setting.group).distinct()).all()
        groups = set(rows) | set(DEFAULT_SETTINGS.keys())
        return sorted(groups)

    def update_group(self, group: str, settings: dict, user_id: int | None) -> dict:
        for key, value in settings.items():
            row = self.db.scalar(select(Setting).where(Setting.group == group, Setting.key == key))
            if row:
                row.value = serialize_value(value)
                row.updated_by = user_id
            else:
                self.db.add(
                    Setting(group=group, key=key, value=serialize_value(value), updated_by=user_id)
                )
        self.db.commit()
        return self.get_group(group)
