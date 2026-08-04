from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.modules.content.application.services import NavigationApplicationService
from app.modules.content.presentation.schemas import MenuItemCreate, MenuItemUpdate, ReorderBody
from app.shared.presentation.deps import require_permission

router = APIRouter(prefix="/api/v1/cms/navigation", tags=["cms-navigation"])


def _nav(db: Session = Depends(get_db)) -> NavigationApplicationService:
    return NavigationApplicationService(db)


@router.get("/menus", response_model=list[dict])
def list_menus(
    _: Annotated[tuple, Depends(require_permission("navigation.menu.read"))],
    service: Annotated[NavigationApplicationService, Depends(_nav)],
    locale: str | None = None,
):
    return service.list_menus(locale)


@router.get("/menus/{slug}", response_model=dict)
def get_menu(
    slug: str,
    _: Annotated[tuple, Depends(require_permission("navigation.menu.read"))],
    service: Annotated[NavigationApplicationService, Depends(_nav)],
    locale: str = "fr",
):
    return service.get_menu(slug, locale)


@router.post("/menus/{menu_id}/items", response_model=dict)
def create_menu_item(
    menu_id: int,
    payload: MenuItemCreate,
    _: Annotated[tuple, Depends(require_permission("navigation.menu.write"))],
    service: Annotated[NavigationApplicationService, Depends(_nav)],
):
    return service.create_item(menu_id, data=payload.model_dump())


@router.patch("/items/{item_id}", response_model=dict)
def update_menu_item(
    item_id: int,
    payload: MenuItemUpdate,
    _: Annotated[tuple, Depends(require_permission("navigation.menu.write"))],
    service: Annotated[NavigationApplicationService, Depends(_nav)],
):
    return service.update_item(item_id, data=payload.model_dump(exclude_unset=True))


@router.delete("/items/{item_id}")
def delete_menu_item(
    item_id: int,
    _: Annotated[tuple, Depends(require_permission("navigation.menu.write"))],
    service: Annotated[NavigationApplicationService, Depends(_nav)],
):
    service.delete_item(item_id)
    return {"success": True}


@router.put("/menus/{menu_id}/items/reorder", response_model=list[dict])
def reorder_menu_items(
    menu_id: int,
    payload: ReorderBody,
    _: Annotated[tuple, Depends(require_permission("navigation.menu.write"))],
    service: Annotated[NavigationApplicationService, Depends(_nav)],
):
    return service.reorder_items(menu_id, payload.ordered_ids)
