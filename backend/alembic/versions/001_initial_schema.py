"""Initial schema

Revision ID: 001
Revises:
Create Date: 2026-06-19
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "leads",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("nom", sa.String(length=100), nullable=False),
        sa.Column("entreprise", sa.String(length=150), nullable=False),
        sa.Column("telephone", sa.String(length=30), nullable=False),
        sa.Column("besoin", sa.Text(), nullable=True),
        sa.Column("source", sa.String(length=50), server_default="formulaire_contact", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "captures",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("nom", sa.String(length=100), nullable=False),
        sa.Column("structure", sa.String(length=150), nullable=False),
        sa.Column("telephone", sa.String(length=30), nullable=True),
        sa.Column("contexte", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "developpeurs",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("nom", sa.String(length=100), nullable=False),
        sa.Column("email", sa.String(length=150), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("developpeurs")
    op.drop_table("captures")
    op.drop_table("leads")
