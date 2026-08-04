from typing import Annotated, Callable

from fastapi import Depends, Header
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.modules.audit.service import AuditService
from app.modules.identity.models import User
from app.modules.identity.service import IdentityService
from app.shared.domain.exceptions import ForbiddenError, UnauthorizedError
from app.shared.security.jwt import decode_access_token

bearer_scheme = HTTPBearer(auto_error=False)


def get_identity_service(db: Session = Depends(get_db)) -> IdentityService:
    return IdentityService(db)


def get_audit_service(db: Session = Depends(get_db)) -> AuditService:
    return AuditService(db)


def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    service: Annotated[IdentityService, Depends(get_identity_service)],
) -> tuple[User, list[str]]:
    if not credentials or not credentials.credentials:
        raise UnauthorizedError("Authentication required")
    payload = decode_access_token(credentials.credentials)
    user = service.get_user_by_id(int(payload["sub"]))
    if not user or not user.is_active:
        raise UnauthorizedError("User not found or inactive")
    permissions = service.get_user_permissions(user)
    return user, permissions


def require_permission(code: str) -> Callable:
    def dependency(current: Annotated[tuple[User, list[str]], Depends(get_current_user)]) -> tuple[User, list[str]]:
        user, permissions = current
        role_slugs = {r.slug for r in user.roles}
        if "super_admin" in role_slugs or code in permissions:
            return user, permissions
        raise ForbiddenError(f"Missing permission: {code}")

    return dependency


def get_request_id(x_request_id: Annotated[str | None, Header()] = None) -> str | None:
    return x_request_id
