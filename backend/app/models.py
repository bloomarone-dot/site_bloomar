from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


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
