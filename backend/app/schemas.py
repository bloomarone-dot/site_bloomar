from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class LeadCreate(BaseModel):
    nom: str = Field(..., min_length=1, max_length=100)
    entreprise: str = Field(..., min_length=1, max_length=150)
    telephone: str = Field(..., min_length=1, max_length=30)
    besoin: str | None = Field(None, max_length=200)


class LeadResponse(BaseModel):
    success: bool
    message: str


class CaptureCreate(BaseModel):
    nom: str = Field(..., min_length=1, max_length=100)
    structure: str = Field(..., min_length=1, max_length=150)
    telephone: str | None = Field(None, max_length=30)
    contexte: str | None = Field(None, max_length=200)


class CaptureResponse(BaseModel):
    success: bool
    message: str
    redirect: str | None = None


class DeveloppeurCreate(BaseModel):
    nom: str = Field(..., min_length=1, max_length=100)
    email: EmailStr


class DeveloppeurResponse(BaseModel):
    success: bool
    message: str


class LeadOut(BaseModel):
    id: int
    nom: str
    entreprise: str
    telephone: str
    besoin: str | None
    source: str
    created_at: datetime

    model_config = {"from_attributes": True}


class CaptureOut(BaseModel):
    id: int
    nom: str
    structure: str
    telephone: str | None
    contexte: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class DeveloppeurOut(BaseModel):
    id: int
    nom: str
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}
