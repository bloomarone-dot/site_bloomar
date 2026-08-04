import hashlib
import re
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, selectinload

from app.modules.media.infrastructure.models import (
    MediaAsset,
    MediaCollection,
    MediaCollectionItem,
    MediaFolder,
    MediaTag,
    MediaUsage,
    MediaVariant,
)


def slugify(value: str) -> str:
    value = value.lower().strip()
    value = re.sub(r"[^\w\s-]", "", value)
    return re.sub(r"[\s_-]+", "-", value).strip("-") or "item"


def sha256_checksum(content: bytes) -> str:
    return hashlib.sha256(content).hexdigest()


@dataclass
class MediaSearchFilters:
    q: str | None = None
    folder_id: int | None = None
    folder_path: str | None = None
    tag: str | None = None
    collection_id: int | None = None
    mime_type: str | None = None
    status: str = "active"
    sort: str = "created_at"
    order: str = "desc"


class MediaFileRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_id(self, media_id: int, *, with_relations: bool = False) -> MediaAsset | None:
        query = select(MediaAsset).where(MediaAsset.id == media_id)
        if with_relations:
            query = query.options(
                selectinload(MediaAsset.variants),
                selectinload(MediaAsset.tags),
                selectinload(MediaAsset.usages),
                selectinload(MediaAsset.media_folder),
            )
        return self.session.scalar(query)

    def get_by_uuid(self, uuid: str) -> MediaAsset | None:
        return self.session.scalar(select(MediaAsset).where(MediaAsset.uuid == uuid))

    def list_files(
        self, *, page: int, limit: int, filters: MediaSearchFilters
    ) -> tuple[list[MediaAsset], int]:
        query = select(MediaAsset).options(selectinload(MediaAsset.variants), selectinload(MediaAsset.tags))
        count_q = select(func.count()).select_from(MediaAsset)

        if filters.status == "active":
            query = query.where(MediaAsset.status == "active", MediaAsset.deleted_at.is_(None))
            count_q = count_q.where(MediaAsset.status == "active", MediaAsset.deleted_at.is_(None))
        elif filters.status == "trashed":
            query = query.where(or_(MediaAsset.status == "trashed", MediaAsset.deleted_at.is_not(None)))
            count_q = count_q.where(or_(MediaAsset.status == "trashed", MediaAsset.deleted_at.is_not(None)))

        if filters.folder_id:
            query = query.where(MediaAsset.folder_id == filters.folder_id)
            count_q = count_q.where(MediaAsset.folder_id == filters.folder_id)
        if filters.folder_path:
            query = query.where(MediaAsset.folder == filters.folder_path)
            count_q = count_q.where(MediaAsset.folder == filters.folder_path)
        if filters.mime_type:
            query = query.where(MediaAsset.mime_type == filters.mime_type)
            count_q = count_q.where(MediaAsset.mime_type == filters.mime_type)
        if filters.q:
            like = f"%{filters.q}%"
            cond = or_(
                MediaAsset.original_filename.ilike(like),
                MediaAsset.filename.ilike(like),
                MediaAsset.alt_text.ilike(like),
            )
            query = query.where(cond)
            count_q = count_q.where(cond)
        if filters.tag:
            query = query.join(MediaAsset.tags).where(MediaTag.slug == filters.tag)
            count_q = count_q.join(MediaAsset.tags).where(MediaTag.slug == filters.tag)
        if filters.collection_id:
            query = query.join(MediaCollectionItem).where(MediaCollectionItem.collection_id == filters.collection_id)
            count_q = count_q.join(MediaCollectionItem).where(
                MediaCollectionItem.collection_id == filters.collection_id
            )

        sort_col = getattr(MediaAsset, filters.sort, MediaAsset.created_at)
        order = sort_col.desc() if filters.order == "desc" else sort_col.asc()
        total = self.session.scalar(count_q) or 0
        rows = self.session.scalars(query.order_by(order).offset((page - 1) * limit).limit(limit)).all()
        return list(rows), total

    def add(self, asset: MediaAsset) -> MediaAsset:
        self.session.add(asset)
        self.session.flush()
        return asset

    def soft_delete(self, asset: MediaAsset) -> None:
        asset.status = "trashed"
        asset.deleted_at = datetime.now(UTC)

    def restore(self, asset: MediaAsset) -> None:
        asset.status = "active"
        asset.deleted_at = None


class MediaFolderRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_id(self, folder_id: int) -> MediaFolder | None:
        return self.session.get(MediaFolder, folder_id)

    def get_by_path(self, path: str) -> MediaFolder | None:
        return self.session.scalar(select(MediaFolder).where(MediaFolder.path == path, MediaFolder.deleted_at.is_(None)))

    def list_all(self, parent_id: int | None = None) -> list[MediaFolder]:
        query = select(MediaFolder).where(MediaFolder.deleted_at.is_(None))
        if parent_id is None:
            query = query.where(MediaFolder.parent_id.is_(None))
        else:
            query = query.where(MediaFolder.parent_id == parent_id)
        return list(self.session.scalars(query.order_by(MediaFolder.name)).all())

    def add(self, folder: MediaFolder) -> MediaFolder:
        self.session.add(folder)
        self.session.flush()
        return folder


class MediaTagRepository:
    def __init__(self, session: Session):
        self.session = session

    def list_all(self) -> list[MediaTag]:
        return list(self.session.scalars(select(MediaTag).order_by(MediaTag.name)).all())

    def get_by_slug(self, slug: str) -> MediaTag | None:
        return self.session.scalar(select(MediaTag).where(MediaTag.slug == slug))

    def get_or_create(self, name: str) -> MediaTag:
        slug = slugify(name)
        tag = self.get_by_slug(slug)
        if tag:
            return tag
        tag = MediaTag(name=name, slug=slug)
        self.session.add(tag)
        self.session.flush()
        return tag


class MediaCollectionRepository:
    def __init__(self, session: Session):
        self.session = session

    def list_all(self) -> list[MediaCollection]:
        return list(
            self.session.scalars(
                select(MediaCollection).options(selectinload(MediaCollection.items)).order_by(MediaCollection.name)
            ).all()
        )

    def get_by_id(self, collection_id: int) -> MediaCollection | None:
        return self.session.scalar(
            select(MediaCollection)
            .options(selectinload(MediaCollection.items))
            .where(MediaCollection.id == collection_id)
        )

    def add(self, collection: MediaCollection) -> MediaCollection:
        self.session.add(collection)
        self.session.flush()
        return collection


class MediaUsageRepository:
    def __init__(self, session: Session):
        self.session = session

    def list_by_media(self, media_id: int) -> list[MediaUsage]:
        return list(self.session.scalars(select(MediaUsage).where(MediaUsage.media_id == media_id)).all())

    def add(self, usage: MediaUsage) -> MediaUsage:
        self.session.add(usage)
        self.session.flush()
        return usage

    def delete_for_media(self, media_id: int) -> None:
        for row in self.list_by_media(media_id):
            self.session.delete(row)
