from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Capture
from app.schemas import CaptureCreate, CaptureResponse
from app.services.email import send_notification

router = APIRouter(prefix="/api", tags=["captures"])


@router.post("/capture", response_model=CaptureResponse)
async def create_capture(
    payload: CaptureCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    capture = Capture(
        nom=payload.nom,
        structure=payload.structure,
        telephone=payload.telephone or "",
        contexte=payload.contexte or "",
    )
    db.add(capture)
    db.commit()

    background_tasks.add_task(
        send_notification,
        subject=f"[BL∞MAR ONE] Capture : {payload.contexte or 'ressource'}",
        body=f"""
            <h2>Nouvelle capture de ressource</h2>
            <table>
                <tr><td><strong>Nom :</strong></td><td>{payload.nom}</td></tr>
                <tr><td><strong>Structure :</strong></td><td>{payload.structure}</td></tr>
                <tr><td><strong>Téléphone :</strong></td><td>{payload.telephone or ''}</td></tr>
                <tr><td><strong>Contexte :</strong></td><td>{payload.contexte or ''}</td></tr>
            </table>
        """,
    )

    redirect_url = "https://bloomarone.com/" if payload.contexte == "bloomarone_caisse" else None

    return CaptureResponse(
        success=True,
        message=f"Accès accordé, {payload.nom} !",
        redirect=redirect_url,
    )
