from typing import Annotated

from fastapi import APIRouter, Depends, Request, Response

from app.config import settings
from app.modules.audit.service import AuditService
from app.modules.identity.schemas import AuthResponse, LoginRequest, MeResponse, UserOut
from app.modules.identity.service import IdentityService
from app.shared.domain.exceptions import UnauthorizedError
from app.shared.presentation.deps import get_audit_service, get_current_user, get_identity_service
from app.shared.security.jwt import decode_access_token

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

REFRESH_COOKIE = "bloomar_refresh_token"


def _set_refresh_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=REFRESH_COOKIE,
        value=token,
        httponly=True,
        secure=settings.environment != "development",
        samesite="lax",
        max_age=settings.jwt_refresh_token_expire_days * 86400,
        path="/api/v1/auth",
    )


def _clear_refresh_cookie(response: Response) -> None:
    response.delete_cookie(key=REFRESH_COOKIE, path="/api/v1/auth")


@router.post("/login", response_model=AuthResponse)
def login(
    payload: LoginRequest,
    request: Request,
    response: Response,
    service: Annotated[IdentityService, Depends(get_identity_service)],
    audit: Annotated[AuditService, Depends(get_audit_service)],
):
    access_token, refresh_token, user, permissions = service.login(
        email=payload.email,
        password=payload.password,
        user_agent=request.headers.get("user-agent"),
        ip_address=request.client.host if request.client else None,
    )
    _set_refresh_cookie(response, refresh_token)
    audit.log(
        action="auth.login",
        user_id=user["id"],
        entity_type="user",
        entity_id=str(user["id"]),
        ip_address=request.client.host if request.client else None,
    )
    return AuthResponse(
        access_token=access_token,
        user=UserOut(**user),
        permissions=permissions,
    )


@router.post("/refresh", response_model=AuthResponse)
def refresh_token(
    request: Request,
    response: Response,
    service: Annotated[IdentityService, Depends(get_identity_service)],
):
    token = request.cookies.get(REFRESH_COOKIE)
    if not token:
        raise UnauthorizedError("Refresh token missing")
    access_token, new_refresh = service.refresh(refresh_token=token)
    _set_refresh_cookie(response, new_refresh)

    payload = decode_access_token(access_token)
    user = service.get_user_by_id(int(payload["sub"]))
    if not user:
        raise UnauthorizedError("User not found")

    return AuthResponse(
        access_token=access_token,
        user=UserOut(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            is_active=user.is_active,
            roles=[r.slug for r in user.roles],
        ),
        permissions=service.get_user_permissions(user),
    )


@router.post("/logout")
def logout(
    request: Request,
    response: Response,
    service: Annotated[IdentityService, Depends(get_identity_service)],
    audit: Annotated[AuditService, Depends(get_audit_service)],
):
    token = request.cookies.get(REFRESH_COOKIE)
    user_id = None
    if token:
        user_id = service.logout(refresh_token=token)
    _clear_refresh_cookie(response)
    audit.log(
        action="auth.logout",
        user_id=user_id,
        entity_type="user",
        entity_id=str(user_id) if user_id else None,
        ip_address=request.client.host if request.client else None,
    )
    return {"success": True}


@router.get("/me", response_model=MeResponse)
def me(
    current: Annotated[tuple, Depends(get_current_user)],
):
    user, permissions = current
    return MeResponse(
        user=UserOut(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            is_active=user.is_active,
            roles=[r.slug for r in user.roles],
        ),
        permissions=permissions,
    )
