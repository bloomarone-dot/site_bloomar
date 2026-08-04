from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Menu(Base):
    __tablename__ = "navigation_menus"
    __table_args__ = (UniqueConstraint("slug", "locale", name="uq_menu_slug_locale"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    locale: Mapped[str] = mapped_column(String(10), default="fr", server_default="fr")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    items: Mapped[list["MenuItem"]] = relationship(
        "MenuItem", back_populates="menu", cascade="all, delete-orphan", order_by="MenuItem.sort_order"
    )


class MenuItem(Base):
    __tablename__ = "navigation_menu_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    menu_id: Mapped[int] = mapped_column(Integer, ForeignKey("navigation_menus.id", ondelete="CASCADE"), nullable=False)
    parent_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("navigation_menu_items.id", ondelete="CASCADE"), nullable=True
    )
    label: Mapped[str] = mapped_column(String(200), nullable=False)
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, server_default="0")
    is_external: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
    locale: Mapped[str] = mapped_column(String(10), default="fr", server_default="fr")

    menu: Mapped["Menu"] = relationship("Menu", back_populates="items")
    children: Mapped[list["MenuItem"]] = relationship("MenuItem", back_populates="parent")
    parent: Mapped["MenuItem | None"] = relationship("MenuItem", back_populates="children", remote_side=[id])
