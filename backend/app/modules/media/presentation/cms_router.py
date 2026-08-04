from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, UploadFile
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.modules.audit.service import AuditService
from app.modules.media.application.services import MediaApplicationService
from app.modules.media.infrastructure.repositories import MediaSearchFilters
from app.shared.presentation.deps import get_audit_service, require_permission
from app.shared.presentation.pagination import PaginatedResponse, PaginationParams

library_router = APIRouter(prefix="/api/v1/cms/media-library", tags=["cms-media-library"])


def _app(db: Session = Depends(get_db)) -> MediaApplicationService:
    return MediaApplicationService(db)


class MediaUpdateBody(BaseModel):
    alt_text: str | None = None
    caption: str | None = None
    description: str | None = None
    is_public: bool | None = None
    tag_names: list[str] | None = None


class RenameBody(BaseModel):
    name: str


class MoveBody(BaseModel):
    folder_id: int | None = None
    folder: str | None = None


class FolderCreateBody(BaseModel):
    name: str
    parent_id: int | None = None


class TagCreateBody(BaseModel):
    name: str


class CollectionCreateBody(BaseModel):
    name: str
    description: str | None = None


class UsageRegisterBody(BaseModel):
    entity_type: str
    entity_id: int
    entity_label: str
    field_key: str | None = None


# --- Static paths first (avoid /{media_id} capture) ---

@library_router.get("/folders/tree", response_model=list[dict])
def list_folders(
    _: Annotated[tuple, Depends(require_permission("media.read"))],
    service: Annotated[MediaApplicationService, Depends(_app)],
    parent_id: int | None = None,
):
    return service.list_folders(parent_id)


@library_router.post("/folders", response_model=dict)
def create_folder(
    payload: FolderCreateBody,
    _: Annotated[tuple, Depends(require_permission("folder.manage"))],
    service: Annotated[MediaApplicationService, Depends(_app)],
):
    return service.create_folder(name=payload.name, parent_id=payload.parent_id)


@library_router.delete("/folders/{folder_id}")
def delete_folder(
    folder_id: int,
    _: Annotated[tuple, Depends(require_permission("folder.manage"))],
    service: Annotated[MediaApplicationService, Depends(_app)],
):
    service.delete_folder(folder_id)
    return {"success": True}


@library_router.get("/tags", response_model=list[dict])
def list_tags(
    _: Annotated[tuple, Depends(require_permission("media.read"))],
    service: Annotated[MediaApplicationService, Depends(_app)],
):
    return service.list_tags()


@library_router.post("/tags", response_model=dict)
def create_tag(
    payload: TagCreateBody,
    _: Annotated[tuple, Depends(require_permission("media.manage"))],
    service: Annotated[MediaApplicationService, Depends(_app)],
):
    return service.create_tag(payload.name)


@library_router.patch("/tags/{tag_id}", response_model=dict)
def rename_tag(
    tag_id: int,
    payload: TagCreateBody,
    _: Annotated[tuple, Depends(require_permission("media.manage"))],
    service: Annotated[MediaApplicationService, Depends(_app)],
):
    return service.rename_tag(tag_id, payload.name)


@library_router.delete("/tags/{tag_id}")
def delete_tag(
    tag_id: int,
    _: Annotated[tuple, Depends(require_permission("media.manage"))],
    service: Annotated[MediaApplicationService, Depends(_app)],
):
    service.delete_tag(tag_id)
    return {"success": True}


@library_router.get("/collections", response_model=list[dict])
def list_collections(
    _: Annotated[tuple, Depends(require_permission("media.read"))],
    service: Annotated[MediaApplicationService, Depends(_app)],
):
    return service.list_collections()


@library_router.post("/collections", response_model=dict)
def create_collection(
    payload: CollectionCreateBody,
    _: Annotated[tuple, Depends(require_permission("collection.manage"))],
    service: Annotated[MediaApplicationService, Depends(_app)],
):
    return service.create_collection(name=payload.name, description=payload.description)


@library_router.post("/collections/{collection_id}/items/{media_id}")
def add_to_collection(
    collection_id: int,
    media_id: int,
    _: Annotated[tuple, Depends(require_permission("collection.manage"))],
    service: Annotated[MediaApplicationService, Depends(_app)],
):
    return service.add_to_collection(collection_id, media_id)


@library_router.post("/upload", response_model=dict)
async def upload_single(
    current: Annotated[tuple, Depends(require_permission("media.upload"))],
    service: Annotated[MediaApplicationService, Depends(_app)],
    audit: Annotated[AuditService, Depends(get_audit_service)],
    file: UploadFile = File(...),
    folder: str = Form(default="uploads"),
    folder_id: int | None = Form(default=None),
    alt_text: str | None = Form(default=None),
):
    user, _ = current
    content = await file.read()
    media = service.upload(
        filename=file.filename or "upload.bin",
        content=content,
        mime_type=file.content_type or "application/octet-stream",
        folder=folder,
        folder_id=folder_id,
        user_id=user.id,
        alt_text=alt_text,
    )
    audit.log(action="media.upload", user_id=user.id, entity_type="media", entity_id=str(media["id"]))
    return media


@library_router.post("/upload/multiple", response_model=list[dict])
async def upload_multiple(
    current: Annotated[tuple, Depends(require_permission("media.upload"))],
    service: Annotated[MediaApplicationService, Depends(_app)],
    files: list[UploadFile] = File(...),
    folder: str = Form(default="uploads"),
):
    user, _ = current
    batch = []
    for f in files:
        content = await f.read()
        batch.append((f.filename or "upload.bin", content, f.content_type or "application/octet-stream"))
    return service.upload_multiple(batch, folder=folder, user_id=user.id)


@library_router.get("", response_model=PaginatedResponse[dict])
def search_media(
    pagination: Annotated[PaginationParams, Depends()],
    _: Annotated[tuple, Depends(require_permission("media.read"))],
    service: Annotated[MediaApplicationService, Depends(_app)],
    q: str | None = None,
    folder_id: int | None = None,
    tag: str | None = None,
    collection_id: int | None = None,
    mime_type: str | None = None,
    status: str = "active",
    sort: str = "created_at",
    order: str = "desc",
):
    filters = MediaSearchFilters(
        q=q,
        folder_id=folder_id,
        tag=tag,
        collection_id=collection_id,
        mime_type=mime_type,
        status=status,
        sort=sort,
        order=order,
    )
    data, total = service.search(page=pagination.page, limit=pagination.limit, filters=filters)
    return PaginatedResponse.create(data, page=pagination.page, limit=pagination.limit, total=total)


@library_router.get("/{media_id}", response_model=dict)
def get_media_detail(
    media_id: int,
    _: Annotated[tuple, Depends(require_permission("media.read"))],
    service: Annotated[MediaApplicationService, Depends(_app)],
):
    return service.get_media(media_id)


@library_router.patch("/{media_id}", response_model=dict)
def update_media(
    media_id: int,
    payload: MediaUpdateBody,
    _: Annotated[tuple, Depends(require_permission("media.update"))],
    service: Annotated[MediaApplicationService, Depends(_app)],
):
    return service.update_metadata(media_id, payload.model_dump(exclude_unset=True))


@library_router.post("/{media_id}/rename", response_model=dict)
def rename_media(
    media_id: int,
    payload: RenameBody,
    _: Annotated[tuple, Depends(require_permission("media.update"))],
    service: Annotated[MediaApplicationService, Depends(_app)],
):
    return service.rename(media_id, payload.name)


@library_router.post("/{media_id}/move", response_model=dict)
def move_media(
    media_id: int,
    payload: MoveBody,
    _: Annotated[tuple, Depends(require_permission("media.update"))],
    service: Annotated[MediaApplicationService, Depends(_app)],
):
    return service.move(media_id, folder_id=payload.folder_id, folder=payload.folder)


@library_router.post("/{media_id}/copy", response_model=dict)
def copy_media(
    media_id: int,
    payload: MoveBody,
    _: Annotated[tuple, Depends(require_permission("media.create"))],
    service: Annotated[MediaApplicationService, Depends(_app)],
):
    return service.copy(media_id, folder_id=payload.folder_id, folder=payload.folder)


@library_router.delete("/{media_id}")
def delete_media_lib(
    media_id: int,
    current: Annotated[tuple, Depends(require_permission("media.delete"))],
    service: Annotated[MediaApplicationService, Depends(_app)],
    audit: Annotated[AuditService, Depends(get_audit_service)],
    force: bool = False,
):
    user, _ = current
    service.delete(media_id, force=force)
    audit.log(action="media.delete", user_id=user.id, entity_type="media", entity_id=str(media_id))
    return {"success": True}


@library_router.post("/{media_id}/restore", response_model=dict)
def restore_media(
    media_id: int,
    _: Annotated[tuple, Depends(require_permission("media.restore"))],
    service: Annotated[MediaApplicationService, Depends(_app)],
):
    return service.restore(media_id)


@library_router.get("/{media_id}/usage", response_model=list[dict])
def media_usage(
    media_id: int,
    _: Annotated[tuple, Depends(require_permission("media.read"))],
    service: Annotated[MediaApplicationService, Depends(_app)],
):
    return service.get_usage(media_id)


@library_router.post("/{media_id}/usage", response_model=dict)
def register_usage(
    media_id: int,
    payload: UsageRegisterBody,
    _: Annotated[tuple, Depends(require_permission("media.update"))],
    service: Annotated[MediaApplicationService, Depends(_app)],
):
    return service.register_usage(
        media_id,
        entity_type=payload.entity_type,
        entity_id=payload.entity_id,
        entity_label=payload.entity_label,
        field_key=payload.field_key,
    )
