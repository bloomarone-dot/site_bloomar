import hashlib
from datetime import UTC, datetime, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.config import settings
from app.modules.identity.models import Permission, Role, User, UserSession
from app.shared.domain.exceptions import UnauthorizedError
from app.shared.security.jwt import create_access_token, generate_refresh_token
from app.shared.security.password import hash_password, verify_password
from app.shared.security.rbac import PERMISSIONS, ROLE_DEFINITIONS


def _hash_refresh_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


class IdentityService:
    def __init__(self, db: Session):
        self.db = db

    def seed_roles_and_permissions(self) -> None:
        perm_by_code: dict[str, Permission] = {}
        for item in PERMISSIONS:
            existing = self.db.scalar(select(Permission).where(Permission.code == item["code"]))
            if existing:
                perm_by_code[item["code"]] = existing
                continue
            perm = Permission(
                code=item["code"],
                resource=item["resource"],
                action=item["action"],
                description=item["description"],
            )
            self.db.add(perm)
            perm_by_code[item["code"]] = perm
        self.db.flush()

        for slug, perm_codes in ROLE_DEFINITIONS.items():
            role = self.db.scalar(select(Role).where(Role.slug == slug))
            if not role:
                role = Role(
                    slug=slug,
                    name=slug.replace("_", " ").title(),
                    description=f"System role {slug}",
                    is_system=True,
                )
                self.db.add(role)
                self.db.flush()
            role.permissions = [perm_by_code[c] for c in perm_codes if c in perm_by_code]

        self.db.commit()

    def seed_super_admin(self) -> None:
        user = self.db.scalar(select(User).where(User.email == settings.bootstrap_admin_email))
        if user:
            return
        role = self.db.scalar(select(Role).where(Role.slug == "super_admin"))
        if not role:
            self.seed_roles_and_permissions()
            role = self.db.scalar(select(Role).where(Role.slug == "super_admin"))
        user = User(
            email=settings.bootstrap_admin_email,
            password_hash=hash_password(settings.bootstrap_admin_password),
            full_name=settings.bootstrap_admin_name,
            is_active=True,
            roles=[role] if role else [],
        )
        self.db.add(user)
        self.db.commit()

    def get_user_permissions(self, user: User) -> list[str]:
        codes: set[str] = set()
        for role in user.roles:
            for perm in role.permissions:
                codes.add(perm.code)
        return sorted(codes)

    def _user_to_out(self, user: User) -> dict:
        return {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "is_active": user.is_active,
            "roles": [r.slug for r in user.roles],
        }

    def login(
        self,
        *,
        email: str,
        password: str,
        user_agent: str | None,
        ip_address: str | None,
    ) -> tuple[str, str, dict, list[str]]:
        user = self.db.scalar(
            select(User)
            .options(selectinload(User.roles).selectinload(Role.permissions))
            .where(User.email == email)
        )
        if not user or not user.is_active or not verify_password(password, user.password_hash):
            raise UnauthorizedError("Invalid email or password")

        permissions = self.get_user_permissions(user)
        access_token = create_access_token(
            subject=str(user.id),
            claims={"email": user.email, "roles": [r.slug for r in user.roles]},
        )

        refresh_token = generate_refresh_token()
        session = UserSession(
            user_id=user.id,
            refresh_token_hash=_hash_refresh_token(refresh_token),
            user_agent=user_agent,
            ip_address=ip_address,
            expires_at=datetime.now(UTC) + timedelta(days=settings.jwt_refresh_token_expire_days),
        )
        self.db.add(session)
        self.db.commit()

        return access_token, refresh_token, self._user_to_out(user), permissions

    def refresh(self, *, refresh_token: str) -> tuple[str, str]:
        token_hash = _hash_refresh_token(refresh_token)
        session = self.db.scalar(
            select(UserSession)
            .options(selectinload(UserSession.user).selectinload(User.roles).selectinload(Role.permissions))
            .where(UserSession.refresh_token_hash == token_hash)
        )
        if not session or session.revoked_at or session.expires_at < datetime.now(UTC):
            raise UnauthorizedError("Invalid or expired refresh token")

        user = session.user
        if not user.is_active:
            raise UnauthorizedError("User inactive")

        session.revoked_at = datetime.now(UTC)
        new_refresh = generate_refresh_token()
        new_session = UserSession(
            user_id=user.id,
            refresh_token_hash=_hash_refresh_token(new_refresh),
            user_agent=session.user_agent,
            ip_address=session.ip_address,
            expires_at=datetime.now(UTC) + timedelta(days=settings.jwt_refresh_token_expire_days),
        )
        self.db.add(new_session)

        access_token = create_access_token(
            subject=str(user.id),
            claims={"email": user.email, "roles": [r.slug for r in user.roles]},
        )
        self.db.commit()
        return access_token, new_refresh

    def logout(self, *, refresh_token: str) -> int | None:
        token_hash = _hash_refresh_token(refresh_token)
        session = self.db.scalar(select(UserSession).where(UserSession.refresh_token_hash == token_hash))
        if session and not session.revoked_at:
            user_id = session.user_id
            session.revoked_at = datetime.now(UTC)
            self.db.commit()
            return user_id
        return None

    def get_user_by_id(self, user_id: int) -> User | None:
        return self.db.scalar(
            select(User)
            .options(selectinload(User.roles).selectinload(Role.permissions))
            .where(User.id == user_id)
        )
