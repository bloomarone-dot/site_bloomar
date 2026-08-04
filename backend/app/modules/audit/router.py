from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.modules.audit.service import AuditService
from app.shared.presentation.deps import require_permission
from app.shared.presentation.pagination import PaginatedResponse, PaginationParams

router = APIRouter(prefix="/api/v1/cms/audit", tags=["cms-audit"])


def _service(db: Session = Depends(get_db)) -> AuditService:
    return AuditService(db)


@router.get("", response_model=PaginatedResponse[dict])
def list_audit_logs(
    pagination: Annotated[PaginationParams, Depends()],
    _: Annotated[tuple, Depends(require_permission("audit.read"))],
    service: Annotated[AuditService, Depends(_service)],
):
    data, total = service.list_logs(page=pagination.page, limit=pagination.limit)
    return PaginatedResponse.create(data, page=pagination.page, limit=pagination.limit, total=total)
