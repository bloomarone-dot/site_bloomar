"""Legacy public-site models + CMS model registration for Alembic."""

from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base

# CMS modules — register metadata with Alembic
from app.modules.audit.models import AuditLog  # noqa: F401
from app.modules.identity.models import (  # noqa: F401
    Permission,
    Role,
    User,
    UserSession,
)
from app.modules.media.models import MediaAsset, MediaVariant  # noqa: F401
from app.modules.media.infrastructure.models import (  # noqa: F401
    MediaCollection,
    MediaCollectionItem,
    MediaFolder,
    MediaTag,
    MediaUsage,
)
from app.modules.settings.models import Setting  # noqa: F401

# Sprint 1 — content, navigation, localization
from app.modules.content.infrastructure.models import (  # noqa: F401
    Page,
    PageVersion,
    PreviewToken,
    Publication,
    Section,
    SectionType,
)
from app.modules.localization.infrastructure.models import Locale, Translation  # noqa: F401
from app.modules.navigation.infrastructure.models import Menu, MenuItem  # noqa: F401


class Lead(Base):
    __tablename__ = "leads"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nom: Mapped[str] = mapped_column(String(100), nullable=False)
    entreprise: Mapped[str] = mapped_column(String(150), nullable=False)
    telephone: Mapped[str] = mapped_column(String(30), nullable=False)
    besoin: Mapped[str | None] = mapped_column(Text, nullable=True)
    source: Mapped[str] = mapped_column(String(50), default="formulaire_contact", server_default="formulaire_contact")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Capture(Base):
    __tablename__ = "captures"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nom: Mapped[str] = mapped_column(String(100), nullable=False)
    structure: Mapped[str] = mapped_column(String(150), nullable=False)
    telephone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    contexte: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Developpeur(Base):
    __tablename__ = "developpeurs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nom: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(150), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
