from dataclasses import dataclass, field
from datetime import UTC, datetime
from uuid import uuid4


@dataclass
class DomainEvent:
    event_id: str = field(default_factory=lambda: str(uuid4()))
    occurred_at: datetime = field(default_factory=lambda: datetime.now(UTC))

    @property
    def event_type(self) -> str:
        return self.__class__.__name__


@dataclass
class PagePublished(DomainEvent):
    page_id: int = 0
    version_id: int = 0
    slug: str = ""
    locale: str = ""


@dataclass
class PageArchived(DomainEvent):
    page_id: int = 0
    slug: str = ""


@dataclass
class PageRolledBack(DomainEvent):
    page_id: int = 0
    version_id: int = 0


@dataclass
class CacheInvalidationRequested(DomainEvent):
    patterns: list[str] = field(default_factory=list)


@dataclass
class MediaUploaded(DomainEvent):
    media_id: int = 0
    uuid: str = ""
    folder: str = ""


@dataclass
class MediaDeleted(DomainEvent):
    media_id: int = 0
    uuid: str = ""
    force: bool = False


@dataclass
class MediaRestored(DomainEvent):
    media_id: int = 0
    uuid: str = ""


@dataclass
class MediaMoved(DomainEvent):
    media_id: int = 0
    from_folder: str = ""
    to_folder: str = ""


@dataclass
class FolderCreated(DomainEvent):
    folder_id: int = 0
    path: str = ""


@dataclass
class FolderDeleted(DomainEvent):
    folder_id: int = 0
    path: str = ""


@dataclass
class CollectionCreated(DomainEvent):
    collection_id: int = 0
    slug: str = ""


@dataclass
class VariantGenerated(DomainEvent):
    media_id: int = 0
    variant_count: int = 0
