import shutil
from pathlib import Path
from typing import BinaryIO
from uuid import uuid4

from app.config import settings
from app.modules.media.infrastructure.storage.provider import StorageProvider


class LocalStorageProvider(StorageProvider):
    def __init__(self, root: Path | None = None):
        self.root = (root or settings.media_root).resolve()
        self.root.mkdir(parents=True, exist_ok=True)

    def _full(self, relative_path: str) -> Path:
        full = (self.root / relative_path).resolve()
        if not str(full).startswith(str(self.root)):
            raise ValueError("Invalid storage path")
        return full

    def save(self, *, relative_path: str, content: bytes) -> str:
        dest = self._full(relative_path)
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(content)
        return self._normalize(relative_path)

    def save_stream(self, *, relative_path: str, stream: BinaryIO) -> str:
        dest = self._full(relative_path)
        dest.parent.mkdir(parents=True, exist_ok=True)
        with dest.open("wb") as f:
            shutil.copyfileobj(stream, f)
        return self._normalize(relative_path)

    def read(self, relative_path: str) -> bytes:
        return self._full(relative_path).read_bytes()

    def delete(self, relative_path: str) -> None:
        path = self._full(relative_path)
        if path.exists() and path.is_file():
            path.unlink()

    def exists(self, relative_path: str) -> bool:
        return self._full(relative_path).is_file()

    def resolve_path(self, relative_path: str) -> Path:
        return self._full(relative_path)

    def copy(self, source: str, destination: str) -> str:
        src = self._full(source)
        dst = self._full(destination)
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)
        return self._normalize(destination)

    def move(self, source: str, destination: str) -> str:
        src = self._full(source)
        dst = self._full(destination)
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(src), str(dst))
        return self._normalize(destination)

    def public_url(self, relative_path: str) -> str:
        return f"/api/v1/cms/media/files/{self._normalize(relative_path)}"

    def unique_filename(self, original: str) -> str:
        ext = Path(original).suffix.lower()
        return f"{uuid4().hex}{ext}"

    def build_path(self, *, folder: str, filename: str) -> Path:
        target_dir = self.root / folder
        target_dir.mkdir(parents=True, exist_ok=True)
        return target_dir / filename

    def relative_to_root(self, absolute: Path) -> str:
        return self._normalize(str(absolute.relative_to(self.root)))

    @staticmethod
    def _normalize(path: str) -> str:
        return path.replace("\\", "/")
