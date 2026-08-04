from typing import Annotated

from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.modules.audit.service import AuditService
from app.modules.settings.schemas import SettingsGroupOut, SettingsGroupUpdate
from app.modules.settings.service import SettingsService
from app.shared.presentation.deps import get_audit_service, require_permission

router = APIRouter(prefix="/api/v1/cms/settings", tags=["cms-settings"])


def _service(db: Session = Depends(get_db)) -> SettingsService:
    return SettingsService(db)


@router.get("", response_model=list[str])
def list_setting_groups(
    _: Annotated[tuple, Depends(require_permission("settings.read"))],
    service: Annotated[SettingsService, Depends(_service)],
):
    return service.list_groups()


@router.get("/{group}", response_model=SettingsGroupOut)
def get_settings_group(
    group: str,
    _: Annotated[tuple, Depends(require_permission("settings.read"))],
    service: Annotated[SettingsService, Depends(_service)],
):
    return SettingsGroupOut(group=group, settings=service.get_group(group))


@router.patch("/{group}", response_model=SettingsGroupOut)
def update_settings_group(
    group: str,
    payload: SettingsGroupUpdate,
    request: Request,
    current: Annotated[tuple, Depends(require_permission("settings.write"))],
    service: Annotated[SettingsService, Depends(_service)],
    audit: Annotated[AuditService, Depends(get_audit_service)],
):
    user, _ = current
    updated = service.update_group(group, payload.settings, user.id)
    audit.log(
        action="settings.update",
        user_id=user.id,
        entity_type="settings",
        entity_id=group,
        payload={"group": group, "keys": list(payload.settings.keys())},
        ip_address=request.client.host if request.client else None,
    )
    return SettingsGroupOut(group=group, settings=updated)
