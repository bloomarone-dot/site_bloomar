import re
from pathlib import Path

from sqlalchemy.orm import Session

from app.config import settings
from app.modules.media.domain.enums import (
    ALLOWED_MIME_TYPES,
    EXTENSION_TO_MIME,
    LEGACY_VARIANT_MAP,
    MediaStatus,
    StorageProvider,
)
from app.modules.media.infrastructure.image_processor import ImageProcessor, detect_mime
from app.modules.media.infrastructure.models import (
    MediaAsset,
    MediaCollection,
    MediaCollectionItem,
    MediaFolder,
    MediaUsage,
    MediaVariant,
)
from app.modules.media.infrastructure.repositories import (
    MediaCollectionRepository,
    MediaFileRepository,
    MediaFolderRepository,
    MediaSearchFilters,
    MediaTagRepository,
    MediaUsageRepository,
    sha256_checksum,
    slugify,
)
from app.modules.media.infrastructure.storage.factory import get_storage_provider
from app.modules.media.infrastructure.storage.local_storage import LocalStorageProvider
from app.shared.domain.events import (
    CacheInvalidationRequested,
    CollectionCreated,
    FolderCreated,
    FolderDeleted,
    MediaDeleted,
    MediaMoved,
    MediaRestored,
    MediaUploaded,
    VariantGenerated,
)
from app.shared.domain.exceptions import BusinessRuleError, NotFoundError, ValidationError
from app.shared.infrastructure.uow import UnitOfWork


def _safe_filename(name: str) -> str:
    base = Path(name).name
    return re.sub(r"[^a-zA-Z0-9._-]", "_", base) or "file"


class MediaApplicationService:
    def __init__(self, session: Session, storage=None):
        self.session = session
        self.storage = storage or get_storage_provider(StorageProvider.LOCAL)
        self.local = self.storage if isinstance(self.storage, LocalStorageProvider) else LocalStorageProvider()
        self.files = MediaFileRepository(session)
        self.folders = MediaFolderRepository(session)
        self.tags = MediaTagRepository(session)
        self.collections = MediaCollectionRepository(session)
        self.usages = MediaUsageRepository(session)
        self.processor = ImageProcessor()
        self.uow = UnitOfWork(session)

    def _public_url(self, relative_path: str) -> str:
        return self.storage.public_url(relative_path)

    def _to_legacy_variant_name(self, name: str) -> str:
        for new, old in LEGACY_VARIANT_MAP.items():
            if name == new:
                return old
        return name

    def _asset_to_dict(self, asset: MediaAsset, *, legacy: bool = False) -> dict:
        return {
            "id": asset.id,
            "uuid": asset.uuid,
            "filename": asset.filename,
            "original_filename": asset.original_filename,
            "extension": asset.extension,
            "mime_type": asset.mime_type,
            "size_bytes": asset.size_bytes,
            "checksum": asset.checksum,
            "storage_provider": asset.storage_provider,
            "url": asset.public_url or self._public_url(asset.storage_path),
            "width": asset.width,
            "height": asset.height,
            "duration": asset.duration,
            "alt_text": asset.alt_text,
            "caption": asset.caption,
            "description": asset.description,
            "dominant_color": asset.dominant_color,
            "status": asset.status,
            "folder": asset.folder,
            "folder_id": asset.folder_id,
            "is_public": asset.is_public,
            "uploaded_by": asset.uploaded_by,
            "created_at": asset.created_at.isoformat() if asset.created_at else None,
            "updated_at": asset.updated_at.isoformat() if asset.updated_at else None,
            "deleted_at": asset.deleted_at.isoformat() if asset.deleted_at else None,
            "tags": [{"id": t.id, "name": t.name, "slug": t.slug} for t in asset.tags],
            "variants": [
                {
                    "id": v.id,
                    "variant_name": self._to_legacy_variant_name(v.variant_name) if legacy else v.variant_name,
                    "url": self._public_url(v.storage_path),
                    "width": v.width,
                    "height": v.height,
                    "size_bytes": v.size_bytes,
                    "format": v.format,
                }
                for v in asset.variants
            ],
        }

    def _validate_upload(self, *, filename: str, content: bytes, declared_mime: str) -> str:
        safe = _safe_filename(filename)
        ext = Path(safe).suffix.lower()
        detected = detect_mime(content, safe) or EXTENSION_TO_MIME.get(ext)
        mime = detected or declared_mime
        if mime not in ALLOWED_MIME_TYPES and mime not in settings.media_allowed_mime_list:
            raise ValidationError(f"MIME type not allowed: {mime}")
        if ext and ext in EXTENSION_TO_MIME and EXTENSION_TO_MIME[ext] != mime:
            if not (ext in (".jpg", ".jpeg") and mime == "image/jpeg"):
                raise ValidationError("Extension does not match file content")
        if len(content) > settings.media_max_upload_bytes:
            raise ValidationError("File too large")
        return mime

    def _resolve_folder_path(self, folder_id: int | None, folder: str) -> tuple[str, int | None]:
        if folder_id:
            f = self.folders.get_by_id(folder_id)
            if not f:
                raise NotFoundError("Folder not found")
            return f.path, f.id
        return folder or "uploads", None

    def upload(
        self,
        *,
        filename: str,
        content: bytes,
        mime_type: str,
        folder: str = "uploads",
        folder_id: int | None = None,
        user_id: int | None = None,
        alt_text: str | None = None,
        caption: str | None = None,
        description: str | None = None,
        tag_names: list[str] | None = None,
    ) -> dict:
        mime = self._validate_upload(filename=filename, content=content, declared_mime=mime_type)
        folder_path, resolved_folder_id = self._resolve_folder_path(folder_id, folder)
        unique_name = self.storage.unique_filename(filename)
        ext = Path(unique_name).suffix.lower()
        dest = self.local.build_path(folder=folder_path, filename=unique_name)
        relative = self.local.relative_to_root(dest)
        dest.write_bytes(content)

        width = height = None
        dominant = None
        variants: list[MediaVariant] = []

        if mime.startswith("image/") and mime != "image/svg+xml":
            try:
                width, height, dominant, variant_specs = self.processor.process(
                    content,
                    base_name=Path(unique_name).stem,
                    folder=folder_path,
                    storage=self.local,
                )
                for spec in variant_specs:
                    variants.append(
                        MediaVariant(
                            variant_name=spec["variant_name"],
                            storage_path=spec["storage_path"],
                            width=spec["width"],
                            height=spec["height"],
                            size_bytes=spec["size_bytes"],
                            format=spec.get("format"),
                        )
                    )
                self.uow.add_event(VariantGenerated(media_id=0, variant_count=len(variants)))
            except ValueError as exc:
                raise ValidationError(str(exc)) from exc

        asset = MediaAsset(
            filename=unique_name,
            original_filename=_safe_filename(filename),
            extension=ext.lstrip("."),
            mime_type=mime,
            size_bytes=len(content),
            checksum=sha256_checksum(content),
            storage_provider=str(StorageProvider.LOCAL),
            storage_path=relative,
            public_url=self._public_url(relative),
            width=width,
            height=height,
            alt_text=alt_text,
            caption=caption,
            description=description,
            dominant_color=dominant,
            status=MediaStatus.ACTIVE,
            folder=folder_path,
            folder_id=resolved_folder_id,
            uploaded_by=user_id,
            variants=variants,
        )
        if tag_names:
            asset.tags = [self.tags.get_or_create(n) for n in tag_names]

        self.files.add(asset)
        self.uow.add_event(MediaUploaded(media_id=asset.id, uuid=asset.uuid, folder=folder_path))
        self.uow.add_event(CacheInvalidationRequested(patterns=["media:*"]))
        self.uow.commit()
        self.session.refresh(asset)
        return self._asset_to_dict(asset)

    def upload_multiple(self, files: list[tuple[str, bytes, str]], **kwargs) -> list[dict]:
        return [self.upload(filename=f[0], content=f[1], mime_type=f[2], **kwargs) for f in files]

    # --- Legacy Sprint 0 API ---
    def list_media(self, *, page: int, limit: int, folder: str | None = None) -> tuple[list[dict], int]:
        filters = MediaSearchFilters(folder_path=folder, status="active")
        rows, total = self.files.list_files(page=page, limit=limit, filters=filters)
        return [self._asset_to_dict(r, legacy=True) for r in rows], total

    def get_media(self, media_id: int, *, legacy: bool = False) -> dict:
        asset = self.files.get_by_id(media_id, with_relations=True)
        if not asset:
            raise NotFoundError("Media not found")
        return self._asset_to_dict(asset, legacy=legacy)

    def get_file_path(self, relative_path: str) -> Path:
        return self.storage.resolve_path(relative_path)

    def delete(self, media_id: int, *, force: bool = False) -> None:
        asset = self.files.get_by_id(media_id, with_relations=True)
        if not asset:
            raise NotFoundError("Media not found")
        usages = self.usages.list_by_media(media_id)
        if usages and not force:
            labels = ", ".join(u.entity_label for u in usages[:5])
            raise BusinessRuleError(f"Media is in use: {labels}")
        if force:
            self._purge_files(asset)
            self.session.delete(asset)
        else:
            self.files.soft_delete(asset)
        self.uow.add_event(MediaDeleted(media_id=media_id, uuid=asset.uuid, force=force))
        self.uow.add_event(CacheInvalidationRequested(patterns=[f"media:{media_id}", "media:*"]))
        self.uow.commit()

    def restore(self, media_id: int) -> dict:
        asset = self.files.get_by_id(media_id, with_relations=True)
        if not asset:
            raise NotFoundError("Media not found")
        self.files.restore(asset)
        self.uow.add_event(MediaRestored(media_id=media_id, uuid=asset.uuid))
        self.uow.add_event(CacheInvalidationRequested(patterns=["media:*"]))
        self.uow.commit()
        return self._asset_to_dict(asset)

    def search(
        self, *, page: int, limit: int, filters: MediaSearchFilters
    ) -> tuple[list[dict], int]:
        rows, total = self.files.list_files(page=page, limit=limit, filters=filters)
        return [self._asset_to_dict(r) for r in rows], total

    def update_metadata(self, media_id: int, data: dict) -> dict:
        asset = self.files.get_by_id(media_id, with_relations=True)
        if not asset:
            raise NotFoundError("Media not found")
        for field in ("alt_text", "caption", "description", "is_public"):
            if field in data:
                setattr(asset, field, data[field])
        if "tag_names" in data and data["tag_names"] is not None:
            asset.tags = [self.tags.get_or_create(n) for n in data["tag_names"]]
        self.uow.commit()
        return self._asset_to_dict(asset)

    def rename(self, media_id: int, new_name: str) -> dict:
        asset = self.files.get_by_id(media_id, with_relations=True)
        if not asset:
            raise NotFoundError("Media not found")
        asset.original_filename = _safe_filename(new_name)
        self.uow.commit()
        return self._asset_to_dict(asset)

    def move(self, media_id: int, *, folder_id: int | None = None, folder: str | None = None) -> dict:
        asset = self.files.get_by_id(media_id, with_relations=True)
        if not asset:
            raise NotFoundError("Media not found")
        folder_path, fid = self._resolve_folder_path(folder_id, folder or asset.folder)
        new_path = f"{folder_path}/{asset.filename}"
        self.storage.move(asset.storage_path, new_path)
        for v in asset.variants:
            old = v.storage_path
            new_v = old.replace(asset.folder, folder_path, 1)
            self.storage.move(old, new_v)
            v.storage_path = new_v
        old_folder = asset.folder
        asset.storage_path = new_path
        asset.folder = folder_path
        asset.folder_id = fid
        asset.public_url = self._public_url(new_path)
        self.uow.add_event(MediaMoved(media_id=media_id, from_folder=old_folder, to_folder=folder_path))
        self.uow.add_event(CacheInvalidationRequested(patterns=["media:*"]))
        self.uow.commit()
        return self._asset_to_dict(asset)

    def copy(self, media_id: int, *, folder_id: int | None = None, folder: str | None = None) -> dict:
        original = self.files.get_by_id(media_id, with_relations=True)
        if not original:
            raise NotFoundError("Media not found")
        content = self.storage.read(original.storage_path)
        return self.upload(
            filename=f"copy_{original.original_filename}",
            content=content,
            mime_type=original.mime_type,
            folder=folder or original.folder,
            folder_id=folder_id or original.folder_id,
            alt_text=original.alt_text,
            caption=original.caption,
            description=original.description,
        )

    def _purge_files(self, asset: MediaAsset) -> None:
        self.storage.delete(asset.storage_path)
        for v in asset.variants:
            self.storage.delete(v.storage_path)

    def list_folders(self, parent_id: int | None = None) -> list[dict]:
        return [
            {"id": f.id, "uuid": f.uuid, "name": f.name, "slug": f.slug, "path": f.path, "parent_id": f.parent_id}
            for f in self.folders.list_all(parent_id)
        ]

    def create_folder(self, *, name: str, parent_id: int | None = None) -> dict:
        slug = slugify(name)
        parent_path = ""
        if parent_id:
            parent = self.folders.get_by_id(parent_id)
            if not parent:
                raise NotFoundError("Parent folder not found")
            parent_path = parent.path + "/"
        path = f"{parent_path}{slug}"
        if self.folders.get_by_path(path):
            raise ValidationError("Folder already exists")
        folder = MediaFolder(name=name, slug=slug, parent_id=parent_id, path=path)
        self.folders.add(folder)
        self.uow.add_event(FolderCreated(folder_id=folder.id, path=path))
        self.uow.commit()
        return {"id": folder.id, "uuid": folder.uuid, "name": folder.name, "path": folder.path}

    def delete_folder(self, folder_id: int) -> None:
        from datetime import UTC, datetime

        folder = self.folders.get_by_id(folder_id)
        if not folder:
            raise NotFoundError("Folder not found")
        folder.deleted_at = datetime.now(UTC)
        self.uow.add_event(FolderDeleted(folder_id=folder_id, path=folder.path))
        self.uow.commit()

    def list_tags(self) -> list[dict]:
        return [{"id": t.id, "name": t.name, "slug": t.slug} for t in self.tags.list_all()]

    def create_tag(self, name: str) -> dict:
        tag = self.tags.get_or_create(name)
        self.uow.commit()
        return {"id": tag.id, "name": tag.name, "slug": tag.slug}

    def rename_tag(self, tag_id: int, name: str) -> dict:
        from app.modules.media.infrastructure.models import MediaTag

        tag = self.session.get(MediaTag, tag_id)
        if not tag:
            raise NotFoundError("Tag not found")
        tag.name = name
        tag.slug = slugify(name)
        self.uow.commit()
        return {"id": tag.id, "name": tag.name, "slug": tag.slug}

    def delete_tag(self, tag_id: int) -> None:
        from app.modules.media.infrastructure.models import MediaTag

        tag = self.session.get(MediaTag, tag_id)
        if not tag:
            raise NotFoundError("Tag not found")
        self.session.delete(tag)
        self.uow.commit()

    def list_collections(self) -> list[dict]:
        return [
            {
                "id": c.id,
                "uuid": c.uuid,
                "name": c.name,
                "slug": c.slug,
                "description": c.description,
                "item_count": len(c.items),
            }
            for c in self.collections.list_all()
        ]

    def create_collection(self, *, name: str, description: str | None = None) -> dict:
        slug = slugify(name)
        col = MediaCollection(name=name, slug=slug, description=description)
        self.collections.add(col)
        self.uow.add_event(CollectionCreated(collection_id=col.id, slug=slug))
        self.uow.commit()
        return {"id": col.id, "uuid": col.uuid, "name": col.name, "slug": col.slug}

    def add_to_collection(self, collection_id: int, media_id: int) -> dict:
        col = self.collections.get_by_id(collection_id)
        if not col:
            raise NotFoundError("Collection not found")
        if not self.files.get_by_id(media_id):
            raise NotFoundError("Media not found")
        item = MediaCollectionItem(collection_id=collection_id, media_id=media_id, sort_order=len(col.items))
        self.session.add(item)
        self.uow.commit()
        return {"success": True}

    def get_usage(self, media_id: int) -> list[dict]:
        return [
            {
                "id": u.id,
                "entity_type": u.entity_type,
                "entity_id": u.entity_id,
                "entity_label": u.entity_label,
                "field_key": u.field_key,
            }
            for u in self.usages.list_by_media(media_id)
        ]

    def register_usage(
        self, media_id: int, *, entity_type: str, entity_id: int, entity_label: str, field_key: str | None = None
    ) -> dict:
        if not self.files.get_by_id(media_id):
            raise NotFoundError("Media not found")
        usage = MediaUsage(
            media_id=media_id,
            entity_type=entity_type,
            entity_id=entity_id,
            entity_label=entity_label,
            field_key=field_key,
        )
        self.usages.add(usage)
        self.uow.commit()
        return {"id": usage.id}

    def seed_default_folders(self) -> None:
        defaults = [
            ("Images", "images", [("Hero", "hero"), ("Blog", "blog"), ("Produits", "produits")]),
            ("Documents", "documents", [("PDF", "pdf")]),
            ("Brand", "brand", [("Logos", "logos")]),
        ]
        for name, slug, children in defaults:
            path = slug
            if not self.folders.get_by_path(path):
                parent = MediaFolder(name=name, slug=slug, path=path)
                self.folders.add(parent)
                self.session.flush()
                for child_name, child_slug in children:
                    child_path = f"{path}/{child_slug}"
                    if not self.folders.get_by_path(child_path):
                        self.folders.add(
                            MediaFolder(name=child_name, slug=child_slug, parent_id=parent.id, path=child_path)
                        )
        self.uow.commit()
