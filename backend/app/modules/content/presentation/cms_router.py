from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.modules.audit.service import AuditService
from app.modules.content.application.services import PageApplicationService
from app.modules.content.infrastructure.repositories import PageFilters
from app.modules.content.presentation.schemas import (
    PageCreate,
    PageUpdate,
    PreviewRequest,
    PublishNote,
    ReorderBody,
    SectionCreate,
    SectionUpdate,
)
from app.shared.presentation.deps import get_audit_service, require_permission
from app.shared.presentation.pagination import PaginatedResponse, PaginationParams

router = APIRouter(prefix="/api/v1/cms/content", tags=["cms-content"])


def _pages(db: Session = Depends(get_db)) -> PageApplicationService:
    return PageApplicationService(db)


@router.get("/pages", response_model=PaginatedResponse[dict])
def list_pages(
    pagination: Annotated[PaginationParams, Depends()],
    _: Annotated[tuple, Depends(require_permission("content.page.read"))],
    service: Annotated[PageApplicationService, Depends(_pages)],
    locale: str | None = None,
    status: str | None = None,
    search: str | None = None,
):
    filters = PageFilters(locale=locale, status=status, search=search)
    data, total = service.list_pages(page=pagination.page, limit=pagination.limit, filters=filters)
    return PaginatedResponse.create(data, page=pagination.page, limit=pagination.limit, total=total)


@router.post("/pages", response_model=dict)
def create_page(
    payload: PageCreate,
    current: Annotated[tuple, Depends(require_permission("content.page.write"))],
    service: Annotated[PageApplicationService, Depends(_pages)],
    audit: Annotated[AuditService, Depends(get_audit_service)],
):
    user, _ = current
    page = service.create_page(data=payload.model_dump(), user_id=user.id)
    audit.log(action="content.page.create", user_id=user.id, entity_type="page", entity_id=str(page["id"]))
    return page


@router.get("/pages/{page_id}", response_model=dict)
def get_page(
    page_id: int,
    _: Annotated[tuple, Depends(require_permission("content.page.read"))],
    service: Annotated[PageApplicationService, Depends(_pages)],
):
    return service.get_page(page_id)


@router.patch("/pages/{page_id}", response_model=dict)
def update_page(
    page_id: int,
    payload: PageUpdate,
    current: Annotated[tuple, Depends(require_permission("content.page.write"))],
    service: Annotated[PageApplicationService, Depends(_pages)],
    audit: Annotated[AuditService, Depends(get_audit_service)],
):
    user, _ = current
    page = service.update_page(page_id, data=payload.model_dump(exclude_unset=True), user_id=user.id)
    audit.log(action="content.page.update", user_id=user.id, entity_type="page", entity_id=str(page_id))
    return page


@router.delete("/pages/{page_id}")
def delete_page(
    page_id: int,
    current: Annotated[tuple, Depends(require_permission("content.page.write"))],
    service: Annotated[PageApplicationService, Depends(_pages)],
    audit: Annotated[AuditService, Depends(get_audit_service)],
):
    user, _ = current
    service.delete_page(page_id, user_id=user.id)
    audit.log(action="content.page.delete", user_id=user.id, entity_type="page", entity_id=str(page_id))
    return {"success": True}


@router.get("/section-types", response_model=list[dict])
def list_section_types(
    _: Annotated[tuple, Depends(require_permission("content.page.read"))],
    service: Annotated[PageApplicationService, Depends(_pages)],
):
    return service.list_section_types()


@router.post("/pages/{page_id}/sections", response_model=dict)
def create_section(
    page_id: int,
    payload: SectionCreate,
    current: Annotated[tuple, Depends(require_permission("content.page.write"))],
    service: Annotated[PageApplicationService, Depends(_pages)],
):
    user, _ = current
    return service.create_section(page_id, data=payload.model_dump(), user_id=user.id)


@router.patch("/sections/{section_id}", response_model=dict)
def update_section(
    section_id: int,
    payload: SectionUpdate,
    current: Annotated[tuple, Depends(require_permission("content.page.write"))],
    service: Annotated[PageApplicationService, Depends(_pages)],
):
    user, _ = current
    return service.update_section(section_id, data=payload.model_dump(exclude_unset=True), user_id=user.id)


@router.delete("/sections/{section_id}")
def delete_section(
    section_id: int,
    current: Annotated[tuple, Depends(require_permission("content.page.write"))],
    service: Annotated[PageApplicationService, Depends(_pages)],
):
    user, _ = current
    service.delete_section(section_id, user_id=user.id)
    return {"success": True}


@router.put("/pages/{page_id}/sections/reorder", response_model=list[dict])
def reorder_sections(
    page_id: int,
    payload: ReorderBody,
    current: Annotated[tuple, Depends(require_permission("content.page.write"))],
    service: Annotated[PageApplicationService, Depends(_pages)],
):
    user, _ = current
    return service.reorder_sections(page_id, payload.ordered_ids, user_id=user.id)


@router.post("/pages/{page_id}/submit-review", response_model=dict)
def submit_review(
    page_id: int,
    payload: PublishNote,
    current: Annotated[tuple, Depends(require_permission("content.page.write"))],
    service: Annotated[PageApplicationService, Depends(_pages)],
):
    user, _ = current
    return service.submit_for_review(page_id, user_id=user.id, note=payload.note)


@router.post("/pages/{page_id}/publish", response_model=dict)
def publish_page(
    page_id: int,
    payload: PublishNote,
    current: Annotated[tuple, Depends(require_permission("content.page.publish"))],
    service: Annotated[PageApplicationService, Depends(_pages)],
    audit: Annotated[AuditService, Depends(get_audit_service)],
):
    user, _ = current
    page = service.publish(page_id, user_id=user.id, note=payload.note)
    audit.log(action="content.page.publish", user_id=user.id, entity_type="page", entity_id=str(page_id))
    return page


@router.post("/pages/{page_id}/archive", response_model=dict)
def archive_page(
    page_id: int,
    current: Annotated[tuple, Depends(require_permission("content.page.publish"))],
    service: Annotated[PageApplicationService, Depends(_pages)],
):
    user, _ = current
    return service.archive(page_id, user_id=user.id)


@router.post("/pages/{page_id}/draft", response_model=dict)
def return_draft(
    page_id: int,
    current: Annotated[tuple, Depends(require_permission("content.page.write"))],
    service: Annotated[PageApplicationService, Depends(_pages)],
):
    user, _ = current
    return service.return_to_draft(page_id, user_id=user.id)


@router.post("/pages/{page_id}/rollback/{version_id}", response_model=dict)
def rollback_page(
    page_id: int,
    version_id: int,
    current: Annotated[tuple, Depends(require_permission("content.page.publish"))],
    service: Annotated[PageApplicationService, Depends(_pages)],
    audit: Annotated[AuditService, Depends(get_audit_service)],
):
    user, _ = current
    page = service.rollback(page_id, version_id, user_id=user.id)
    audit.log(action="content.page.rollback", user_id=user.id, entity_type="page", entity_id=str(page_id))
    return page


@router.get("/pages/{page_id}/versions", response_model=list[dict])
def list_versions(
    page_id: int,
    _: Annotated[tuple, Depends(require_permission("content.page.read"))],
    service: Annotated[PageApplicationService, Depends(_pages)],
):
    return service.list_versions(page_id)


@router.post("/pages/{page_id}/preview", response_model=dict)
def create_preview(
    page_id: int,
    payload: PreviewRequest,
    current: Annotated[tuple, Depends(require_permission("content.page.read"))],
    service: Annotated[PageApplicationService, Depends(_pages)],
):
    user, _ = current
    return service.create_preview_token(page_id, user_id=user.id, version_id=payload.version_id)
