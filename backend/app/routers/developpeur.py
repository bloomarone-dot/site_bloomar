from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Developpeur
from app.schemas import DeveloppeurCreate, DeveloppeurResponse
from app.services.email import send_notification

router = APIRouter(prefix="/api", tags=["developpeurs"])


@router.post("/developpeur", response_model=DeveloppeurResponse)
async def create_developpeur(
    payload: DeveloppeurCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    dev = Developpeur(nom=payload.nom, email=str(payload.email))
    db.add(dev)
    db.commit()

    background_tasks.add_task(
        send_notification,
        subject=f"[BL∞MAR ONE] Nouveau développeur BETA : {payload.nom}",
        body=f"""
            <h2>Inscription Espace Développeurs</h2>
            <table>
                <tr><td><strong>Nom :</strong></td><td>{payload.nom}</td></tr>
                <tr><td><strong>Email :</strong></td><td>{payload.email}</td></tr>
            </table>
        """,
        reply_to=str(payload.email),
    )

    return DeveloppeurResponse(
        success=True,
        message=f"Enregistrement réussi, {payload.nom} ! Invitation Sandbox BETA envoyée sous peu.",
    )
