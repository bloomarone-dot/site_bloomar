from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class SectionType(Base):
    __tablename__ = "content_section_types"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    schema_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    icon: Mapped[str | None] = mapped_column(String(40), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, server_default="true")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Page(Base):
    __tablename__ = "content_pages"
    __table_args__ = (UniqueConstraint("slug", "locale", name="uq_page_slug_locale"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    locale: Mapped[str] = mapped_column(String(10), nullable=False, default="fr", server_default="fr")
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    meta_title: Mapped[str | None] = mapped_column(String(255), nullable=True)
    meta_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    template: Mapped[str] = mapped_column(String(80), default="default", server_default="default")
    status: Mapped[str] = mapped_column(String(20), default="draft", server_default="draft", index=True)
    published_version_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("content_page_versions.id", use_alter=True, name="fk_page_published_version"), nullable=True
    )
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_by: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
    updated_by: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    sections: Mapped[list["Section"]] = relationship(
        "Section", back_populates="page", cascade="all, delete-orphan", order_by="Section.sort_order"
    )
    versions: Mapped[list["PageVersion"]] = relationship(
        "PageVersion", back_populates="page", foreign_keys="PageVersion.page_id"
    )


class Section(Base):
    __tablename__ = "content_sections"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    page_id: Mapped[int] = mapped_column(Integer, ForeignKey("content_pages.id", ondelete="CASCADE"), nullable=False)
    section_type_slug: Mapped[str] = mapped_column(String(80), nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, server_default="0")
    content_json: Mapped[str] = mapped_column(Text, default="{}", server_default="{}")
    is_visible: Mapped[bool] = mapped_column(Boolean, default=True, server_default="true")
    locale: Mapped[str] = mapped_column(String(10), default="fr", server_default="fr")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    page: Mapped["Page"] = relationship("Page", back_populates="sections")


class PageVersion(Base):
    __tablename__ = "content_page_versions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    page_id: Mapped[int] = mapped_column(Integer, ForeignKey("content_pages.id", ondelete="CASCADE"), nullable=False)
    version_number: Mapped[int] = mapped_column(Integer, nullable=False)
    snapshot_json: Mapped[str] = mapped_column(Text, nullable=False)
    status_at_creation: Mapped[str] = mapped_column(String(20), nullable=False)
    change_note: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_by: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    page: Mapped["Page"] = relationship("Page", back_populates="versions", foreign_keys=[page_id])


class Publication(Base):
    __tablename__ = "content_publications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    page_id: Mapped[int] = mapped_column(Integer, ForeignKey("content_pages.id", ondelete="CASCADE"), nullable=False)
    version_id: Mapped[int] = mapped_column(Integer, ForeignKey("content_page_versions.id"), nullable=False)
    action: Mapped[str] = mapped_column(String(30), nullable=False)
    published_by: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
    published_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class PreviewToken(Base):
    __tablename__ = "content_preview_tokens"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    page_id: Mapped[int] = mapped_column(Integer, ForeignKey("content_pages.id", ondelete="CASCADE"), nullable=False)
    version_id: Mapped[int] = mapped_column(Integer, ForeignKey("content_page_versions.id"), nullable=False)
    token: Mapped[str] = mapped_column(String(128), unique=True, nullable=False, index=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    created_by: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
