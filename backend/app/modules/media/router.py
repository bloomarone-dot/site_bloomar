from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, Request, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.modules.audit.service import AuditService
from app.modules.media.schemas import MediaOut
from app.modules.media.service import MediaService
from app.shared.presentation.deps import get_audit_service, require_permission
from app.shared.presentation.pagination import PaginatedResponse, PaginationParams

router = APIRouter(prefix="/api/v1/cms/media", tags=["cms-media"])


def _service(db: Session = Depends(get_db)) -> MediaService:
    return MediaService(db)


@router.get("", response_model=PaginatedResponse[MediaOut])
def list_media(
    pagination: Annotated[PaginationParams, Depends()],
    _: Annotated[tuple, Depends(require_permission("media.read"))],
    service: Annotated[MediaService, Depends(_service)],
    folder: str | None = None,
):
    data, total = service.list_media(page=pagination.page, limit=pagination.limit, folder=folder)
    return PaginatedResponse.create(data, page=pagination.page, limit=pagination.limit, total=total)


@router.get("/{media_id}", response_model=MediaOut)
def get_media(
    media_id: int,
    _: Annotated[tuple, Depends(require_permission("media.read"))],
    service: Annotated[MediaService, Depends(_service)],
):
    return service.get_media(media_id)


@router.post("/upload", response_model=MediaOut)
async def upload_media(
    request: Request,
    current: Annotated[tuple, Depends(require_permission("media.write"))],
    service: Annotated[MediaService, Depends(_service)],
    audit: Annotated[AuditService, Depends(get_audit_service)],
    file: UploadFile = File(...),
    folder: str = Form(default="uploads"),
    alt_text: str | None = Form(default=None),
):
    user, _ = current
    content = await file.read()
    mime = file.content_type or "application/octet-stream"
    media = service.upload(
        filename=file.filename or "upload.bin",
        content=content,
        mime_type=mime,
        folder=folder,
        user_id=user.id,
        alt_text=alt_text,
    )
    audit.log(
        action="media.upload",
        user_id=user.id,
        entity_type="media",
        entity_id=str(media["id"]),
        payload={"filename": media["filename"], "folder": folder},
        ip_address=request.client.host if request.client else None,
    )
    return media


@router.delete("/{media_id}")
def delete_media(
    media_id: int,
    request: Request,
    current: Annotated[tuple, Depends(require_permission("media.write"))],
    service: Annotated[MediaService, Depends(_service)],
    audit: Annotated[AuditService, Depends(get_audit_service)],
):
    user, _ = current
    service.delete(media_id)
    audit.log(
        action="media.delete",
        user_id=user.id,
        entity_type="media",
        entity_id=str(media_id),
        ip_address=request.client.host if request.client else None,
    )
    return {"success": True}


files_router = APIRouter(prefix="/api/v1/cms/media/files", tags=["cms-media-files"])


@files_router.get("/{file_path:path}")
def serve_media_file(
    file_path: str,
    service: Annotated[MediaService, Depends(_service)],
):
    path = service.get_file_path(file_path)
    return FileResponse(path)
