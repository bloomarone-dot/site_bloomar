from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.modules.content.presentation.schemas import TranslationsUpdate
from app.modules.localization.application.services import LocalizationApplicationService
from app.shared.presentation.deps import require_permission

router = APIRouter(prefix="/api/v1/cms/localization", tags=["cms-localization"])


def _service(db: Session = Depends(get_db)) -> LocalizationApplicationService:
    return LocalizationApplicationService(db)


@router.get("/locales", response_model=list[dict])
def list_locales(
    _: Annotated[tuple, Depends(require_permission("localization.read"))],
    service: Annotated[LocalizationApplicationService, Depends(_service)],
):
    return service.list_locales()


@router.get("/translations/{entity_type}/{entity_id}", response_model=list[dict])
def get_translations(
    entity_type: str,
    entity_id: int,
    _: Annotated[tuple, Depends(require_permission("localization.read"))],
    service: Annotated[LocalizationApplicationService, Depends(_service)],
    locale: str | None = None,
):
    return service.get_translations(entity_type, entity_id, locale)


@router.put("/translations/{entity_type}/{entity_id}", response_model=list[dict])
def upsert_translations(
    entity_type: str,
    entity_id: int,
    payload: TranslationsUpdate,
    _: Annotated[tuple, Depends(require_permission("localization.write"))],
    service: Annotated[LocalizationApplicationService, Depends(_service)],
):
    items = [t.model_dump() for t in payload.translations]
    return service.upsert_translations(entity_type, entity_id, items)
