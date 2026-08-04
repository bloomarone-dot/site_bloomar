from abc import ABC, abstractmethod
from pathlib import Path
from typing import BinaryIO


class StorageProvider(ABC):
    """Abstract storage backend — domain/application depend on this interface only."""

    @abstractmethod
    def save(self, *, relative_path: str, content: bytes) -> str:
        """Persist bytes at relative_path; return normalized path."""

    @abstractmethod
    def save_stream(self, *, relative_path: str, stream: BinaryIO) -> str:
        """Persist stream at relative_path; return normalized path."""

    @abstractmethod
    def read(self, relative_path: str) -> bytes:
        """Read file contents."""

    @abstractmethod
    def delete(self, relative_path: str) -> None:
        """Delete file if exists."""

    @abstractmethod
    def exists(self, relative_path: str) -> bool:
        """Check if file exists."""

    @abstractmethod
    def resolve_path(self, relative_path: str) -> Path:
        """Resolve to absolute path (local) or logical key."""

    @abstractmethod
    def copy(self, source: str, destination: str) -> str:
        """Copy file; return destination path."""

    @abstractmethod
    def move(self, source: str, destination: str) -> str:
        """Move file; return destination path."""

    @abstractmethod
    def public_url(self, relative_path: str) -> str:
        """Return public URL for the asset."""

    @abstractmethod
    def unique_filename(self, original: str) -> str:
        """Generate safe unique filename preserving extension."""
