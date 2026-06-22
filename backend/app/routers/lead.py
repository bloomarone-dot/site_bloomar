from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Lead
from app.schemas import LeadCreate, LeadOut, LeadResponse
from app.services.email import send_notification

router = APIRouter(prefix="/api", tags=["leads"])


@router.post("/lead", response_model=LeadResponse)
async def create_lead(
    payload: LeadCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    lead = Lead(
        nom=payload.nom,
        entreprise=payload.entreprise,
        telephone=payload.telephone,
        besoin=payload.besoin or "",
        source="formulaire_contact",
    )
    db.add(lead)
    db.commit()

    background_tasks.add_task(
        send_notification,
        subject=f"[BL∞MAR ONE] Nouveau lead : {payload.entreprise}",
        body=f"""
            <h2>Nouvelle demande d'audit reçue</h2>
            <table>
                <tr><td><strong>Nom :</strong></td><td>{payload.nom}</td></tr>
                <tr><td><strong>Entreprise :</strong></td><td>{payload.entreprise}</td></tr>
                <tr><td><strong>Téléphone :</strong></td><td>{payload.telephone}</td></tr>
                <tr><td><strong>Besoin :</strong></td><td>{payload.besoin or ''}</td></tr>
            </table>
        """,
    )

    return LeadResponse(
        success=True,
        message=f"Merci {payload.nom}. Votre demande pour {payload.entreprise} est enregistrée.",
    )
