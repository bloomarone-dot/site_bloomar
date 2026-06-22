from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Capture, Developpeur, Lead
from app.schemas import CaptureOut, DeveloppeurOut, LeadOut

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/leads", response_model=list[LeadOut])
def list_leads(db: Session = Depends(get_db)):
    return db.query(Lead).order_by(Lead.created_at.desc()).all()


@router.get("/captures", response_model=list[CaptureOut])
def list_captures(db: Session = Depends(get_db)):
    return db.query(Capture).order_by(Capture.created_at.desc()).all()


@router.get("/developpeurs", response_model=list[DeveloppeurOut])
def list_developpeurs(db: Session = Depends(get_db)):
    return db.query(Developpeur).order_by(Developpeur.created_at.desc()).all()
