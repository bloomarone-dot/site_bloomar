"""Sprint 2 — Enterprise Media Library schema

Revision ID: 004
Revises: 003
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "004"
down_revision: Union[str, None] = "003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "media_folders",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("uuid", sa.String(length=36), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("slug", sa.String(length=120), nullable=False),
        sa.Column("parent_id", sa.Integer(), nullable=True),
        sa.Column("path", sa.String(length=512), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["parent_id"], ["media_folders.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("uuid"),
    )
    op.create_index("ix_media_folders_path", "media_folders", ["path"])

    op.create_table(
        "media_tags",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("name", sa.String(length=80), nullable=False),
        sa.Column("slug", sa.String(length=80), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
        sa.UniqueConstraint("slug"),
    )

    op.create_table(
        "media_collections",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("uuid", sa.String(length=36), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("slug", sa.String(length=120), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("slug"),
        sa.UniqueConstraint("uuid"),
    )

    # Extend media_assets
    op.add_column("media_assets", sa.Column("uuid", sa.String(length=36), nullable=True))
    op.add_column("media_assets", sa.Column("extension", sa.String(length=20), server_default="", nullable=False))
    op.add_column("media_assets", sa.Column("checksum", sa.String(length=64), server_default="", nullable=False))
    op.add_column("media_assets", sa.Column("storage_provider", sa.String(length=20), server_default="local", nullable=False))
    op.add_column("media_assets", sa.Column("public_url", sa.String(length=512), nullable=True))
    op.add_column("media_assets", sa.Column("duration", sa.Float(), nullable=True))
    op.add_column("media_assets", sa.Column("caption", sa.String(length=500), nullable=True))
    op.add_column("media_assets", sa.Column("description", sa.Text(), nullable=True))
    op.add_column("media_assets", sa.Column("dominant_color", sa.String(length=7), nullable=True))
    op.add_column("media_assets", sa.Column("status", sa.String(length=20), server_default="active", nullable=False))
    op.add_column("media_assets", sa.Column("folder_id", sa.Integer(), nullable=True))
    op.add_column("media_assets", sa.Column("is_public", sa.Boolean(), server_default="true", nullable=False))
    op.add_column("media_assets", sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False))
    op.add_column("media_assets", sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True))
    op.create_foreign_key("fk_media_assets_folder", "media_assets", "media_folders", ["folder_id"], ["id"])
    op.create_index("ix_media_assets_status", "media_assets", ["status"])
    op.create_index("ix_media_assets_uuid", "media_assets", ["uuid"], unique=True)

    op.add_column("media_variants", sa.Column("format", sa.String(length=20), nullable=True))

    op.create_table(
        "media_file_tags",
        sa.Column("media_id", sa.Integer(), nullable=False),
        sa.Column("tag_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["media_id"], ["media_assets.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["tag_id"], ["media_tags.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("media_id", "tag_id"),
    )

    op.create_table(
        "media_collection_items",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("collection_id", sa.Integer(), nullable=False),
        sa.Column("media_id", sa.Integer(), nullable=False),
        sa.Column("sort_order", sa.Integer(), server_default="0", nullable=False),
        sa.ForeignKeyConstraint(["collection_id"], ["media_collections.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["media_id"], ["media_assets.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("collection_id", "media_id", name="uq_collection_media"),
    )

    op.create_table(
        "media_usages",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("media_id", sa.Integer(), nullable=False),
        sa.Column("entity_type", sa.String(length=50), nullable=False),
        sa.Column("entity_id", sa.Integer(), nullable=False),
        sa.Column("entity_label", sa.String(length=200), nullable=False),
        sa.Column("field_key", sa.String(length=100), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["media_id"], ["media_assets.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_media_usages_media_id", "media_usages", ["media_id"])


def downgrade() -> None:
    op.drop_index("ix_media_usages_media_id", "media_usages")
    op.drop_table("media_usages")
    op.drop_table("media_collection_items")
    op.drop_table("media_file_tags")
    op.drop_column("media_variants", "format")
    op.drop_index("ix_media_assets_uuid", "media_assets")
    op.drop_index("ix_media_assets_status", "media_assets")
    op.drop_constraint("fk_media_assets_folder", "media_assets", type_="foreignkey")
    for col in (
        "deleted_at", "updated_at", "is_public", "folder_id", "status", "dominant_color",
        "description", "caption", "duration", "public_url", "storage_provider",
        "checksum", "extension", "uuid",
    ):
        op.drop_column("media_assets", col)
    op.drop_table("media_collections")
    op.drop_table("media_tags")
    op.drop_index("ix_media_folders_path", "media_folders")
    op.drop_table("media_folders")
