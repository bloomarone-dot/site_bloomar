from datetime import datetime
from uuid import uuid4

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Table,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class MediaFolder(Base):
    __tablename__ = "media_folders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    uuid: Mapped[str] = mapped_column(String(36), unique=True, nullable=False, default=lambda: str(uuid4()))
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    slug: Mapped[str] = mapped_column(String(120), nullable=False)
    parent_id: Mapped[int | None] = mapped_column(ForeignKey("media_folders.id", ondelete="CASCADE"), nullable=True)
    path: Mapped[str] = mapped_column(String(512), nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    parent: Mapped["MediaFolder | None"] = relationship(remote_side=[id])
    files: Mapped[list["MediaAsset"]] = relationship(back_populates="media_folder")


class MediaTag(Base):
    __tablename__ = "media_tags"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


media_file_tags = Table(
    "media_file_tags",
    Base.metadata,
    Column("media_id", ForeignKey("media_assets.id", ondelete="CASCADE"), primary_key=True),
    Column("tag_id", ForeignKey("media_tags.id", ondelete="CASCADE"), primary_key=True),
)


class MediaCollection(Base):
    __tablename__ = "media_collections"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    uuid: Mapped[str] = mapped_column(String(36), unique=True, nullable=False, default=lambda: str(uuid4()))
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    slug: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    items: Mapped[list["MediaCollectionItem"]] = relationship(back_populates="collection", cascade="all, delete-orphan")


class MediaCollectionItem(Base):
    __tablename__ = "media_collection_items"
    __table_args__ = (UniqueConstraint("collection_id", "media_id", name="uq_collection_media"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    collection_id: Mapped[int] = mapped_column(ForeignKey("media_collections.id", ondelete="CASCADE"))
    media_id: Mapped[int] = mapped_column(ForeignKey("media_assets.id", ondelete="CASCADE"))
    sort_order: Mapped[int] = mapped_column(Integer, default=0, server_default="0")

    collection: Mapped["MediaCollection"] = relationship(back_populates="items")
    media: Mapped["MediaAsset"] = relationship(back_populates="collection_items")


class MediaUsage(Base):
    __tablename__ = "media_usages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    media_id: Mapped[int] = mapped_column(ForeignKey("media_assets.id", ondelete="CASCADE"), index=True)
    entity_type: Mapped[str] = mapped_column(String(50), nullable=False)
    entity_id: Mapped[int] = mapped_column(Integer, nullable=False)
    entity_label: Mapped[str] = mapped_column(String(200), nullable=False)
    field_key: Mapped[str | None] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    media: Mapped["MediaAsset"] = relationship(back_populates="usages")


class MediaAsset(Base):
    """Aggregate root MediaFile — table name kept for Sprint 0 compatibility."""

    __tablename__ = "media_assets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    uuid: Mapped[str] = mapped_column(String(36), unique=True, nullable=False, default=lambda: str(uuid4()))
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    original_filename: Mapped[str] = mapped_column(String(255), nullable=False)
    extension: Mapped[str] = mapped_column(String(20), nullable=False, default="")
    mime_type: Mapped[str] = mapped_column(String(100), nullable=False)
    size_bytes: Mapped[int] = mapped_column(Integer, nullable=False)
    checksum: Mapped[str] = mapped_column(String(64), nullable=False, default="")
    storage_provider: Mapped[str] = mapped_column(String(20), default="local", server_default="local")
    storage_path: Mapped[str] = mapped_column(String(512), nullable=False)
    public_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    width: Mapped[int | None] = mapped_column(Integer, nullable=True)
    height: Mapped[int | None] = mapped_column(Integer, nullable=True)
    duration: Mapped[float | None] = mapped_column(Float, nullable=True)
    alt_text: Mapped[str | None] = mapped_column(String(255), nullable=True)
    caption: Mapped[str | None] = mapped_column(String(500), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    dominant_color: Mapped[str | None] = mapped_column(String(7), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="active", server_default="active", index=True)
    folder: Mapped[str] = mapped_column(String(100), default="uploads", server_default="uploads")
    folder_id: Mapped[int | None] = mapped_column(ForeignKey("media_folders.id"), nullable=True)
    uploaded_by: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    is_public: Mapped[bool] = mapped_column(Boolean, default=True, server_default="true")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    variants: Mapped[list["MediaVariant"]] = relationship(back_populates="media", cascade="all, delete-orphan")
    media_folder: Mapped["MediaFolder | None"] = relationship(back_populates="files")
    tags: Mapped[list["MediaTag"]] = relationship(secondary=media_file_tags)
    collection_items: Mapped[list["MediaCollectionItem"]] = relationship(back_populates="media")
    usages: Mapped[list["MediaUsage"]] = relationship(back_populates="media", cascade="all, delete-orphan")


# Domain alias
MediaFile = MediaAsset


class MediaVariant(Base):
    __tablename__ = "media_variants"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    media_id: Mapped[int] = mapped_column(ForeignKey("media_assets.id", ondelete="CASCADE"))
    variant_name: Mapped[str] = mapped_column(String(50), nullable=False)
    storage_path: Mapped[str] = mapped_column(String(512), nullable=False)
    width: Mapped[int | None] = mapped_column(Integer, nullable=True)
    height: Mapped[int | None] = mapped_column(Integer, nullable=True)
    size_bytes: Mapped[int] = mapped_column(Integer, nullable=False)
    format: Mapped[str | None] = mapped_column(String(20), nullable=True)

    media: Mapped["MediaAsset"] = relationship(back_populates="variants")
