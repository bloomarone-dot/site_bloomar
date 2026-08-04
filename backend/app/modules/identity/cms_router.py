from typing import Annotated

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.modules.identity.models import Role, User
from app.shared.presentation.deps import require_permission

router = APIRouter(prefix="/api/v1/cms", tags=["cms-identity"])


class RoleOut(BaseModel):
    id: int
    slug: str
    name: str
    description: str | None
    permissions: list[str]

    model_config = {"from_attributes": True}


class UserListOut(BaseModel):
    id: int
    email: str
    full_name: str
    is_active: bool
    roles: list[str]

    model_config = {"from_attributes": True}


@router.get("/users", response_model=list[UserListOut])
def list_users(
    _: Annotated[tuple, Depends(require_permission("identity.user.read"))],
    db: Session = Depends(get_db),
):
    users = db.scalars(select(User).options(selectinload(User.roles))).all()
    return [
        UserListOut(
            id=u.id,
            email=u.email,
            full_name=u.full_name,
            is_active=u.is_active,
            roles=[r.slug for r in u.roles],
        )
        for u in users
    ]


@router.get("/roles", response_model=list[RoleOut])
def list_roles(
    _: Annotated[tuple, Depends(require_permission("identity.user.read"))],
    db: Session = Depends(get_db),
):
    roles = db.scalars(select(Role).options(selectinload(Role.permissions))).all()
    return [
        RoleOut(
            id=r.id,
            slug=r.slug,
            name=r.name,
            description=r.description,
            permissions=[p.code for p in r.permissions],
        )
        for r in roles
    ]
