"""Backward-compatible facade — delegates to MediaApplicationService (Sprint 2)."""

from sqlalchemy.orm import Session

from app.modules.media.application.services import MediaApplicationService
from app.modules.media.infrastructure.storage.local_storage import LocalStorageProvider


class MediaService:
    """Sprint 0 API surface preserved for existing routes and tests."""

    def __init__(self, db: Session, storage=None):
        self._app = MediaApplicationService(db, storage=storage or LocalStorageProvider())

    def list_media(self, *, page: int, limit: int, folder: str | None = None):
        return self._app.list_media(page=page, limit=limit, folder=folder)

    def get_media(self, media_id: int):
        return self._app.get_media(media_id, legacy=True)

    def get_file_path(self, relative_path: str):
        return self._app.get_file_path(relative_path)

    def upload(
        self,
        *,
        filename: str,
        content: bytes,
        mime_type: str,
        folder: str,
        user_id: int | None,
        alt_text: str | None = None,
    ):
        return self._app.upload(
            filename=filename,
            content=content,
            mime_type=mime_type,
            folder=folder,
            user_id=user_id,
            alt_text=alt_text,
        )

    def delete(self, media_id: int):
        return self._app.delete(media_id, force=True)
