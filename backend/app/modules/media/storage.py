from pathlib import Path
from uuid import uuid4

from app.config import settings

from app.modules.media.infrastructure.storage.local_storage import LocalStorageProvider

# Sprint 0 alias
LocalMediaStorage = LocalStorageProvider

__all__ = ["LocalMediaStorage", "LocalStorageProvider"]
