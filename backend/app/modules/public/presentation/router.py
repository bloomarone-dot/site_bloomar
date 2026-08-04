import json
from typing import Annotated

from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.modules.content.application.services import (
    NavigationApplicationService,
    PageApplicationService,
)
from app.modules.settings.service import SettingsService
from app.shared.infrastructure.cache import get_cache

router = APIRouter(prefix="/api/v1/public", tags=["public"])


def _pages(db: Session = Depends(get_db)) -> PageApplicationService:
    return PageApplicationService(db)


def _nav(db: Session = Depends(get_db)) -> NavigationApplicationService:
    return NavigationApplicationService(db)


def _cached_json_response(
    request: Request,
    cache_key: str,
    payload: dict,
    *,
    max_age: int | None = None,
) -> Response:
    cache = get_cache()
    etag = cache.compute_etag(payload)
    if request.headers.get("if-none-match") == etag:
        return Response(status_code=304)

    cached = cache.get(cache_key)
    if cached:
        cached_etag = cache.compute_etag(json.loads(cached))
        if request.headers.get("if-none-match") == cached_etag:
            return Response(status_code=304)

    body = json.dumps(payload, ensure_ascii=False).encode()
    cache.set(cache_key, body, ttl=max_age or settings.cache_default_ttl)
    return Response(
        content=body,
        media_type="application/json",
        headers={
            "ETag": etag,
            "Cache-Control": f"public, max-age={max_age or settings.cache_default_ttl}",
        },
    )


@router.get("/pages/{slug}")
def get_public_page(
    slug: str,
    request: Request,
    service: Annotated[PageApplicationService, Depends(_pages)],
    locale: str = "fr",
):
    cache_key = f"public:page:{slug}:{locale}"
    page = service.get_published_page(slug, locale)
    if not page:
        return Response(status_code=404, content=json.dumps({"error": "Page not found"}))
    return _cached_json_response(request, cache_key, page)


@router.get("/menus")
def get_public_menus(
    request: Request,
    service: Annotated[NavigationApplicationService, Depends(_nav)],
    locale: str = "fr",
):
    cache_key = f"public:menus:{locale}"
    menus = {m["slug"]: m for m in service.list_menus(locale)}
    return _cached_json_response(request, cache_key, menus)


@router.get("/settings")
def get_public_settings(request: Request, db: Session = Depends(get_db)):
    cache_key = "public:settings"
    settings_svc = SettingsService(db)
    public_groups = ("company", "contact", "social", "analytics", "theme")
    payload = {group: settings_svc.get_group(group) for group in public_groups}
    return _cached_json_response(request, cache_key, payload)


@router.get("/navigation")
def get_public_navigation(
    request: Request,
    service: Annotated[NavigationApplicationService, Depends(_nav)],
    locale: str = "fr",
):
    from app.shared.domain.exceptions import NotFoundError

    cache_key = f"public:navigation:{locale}"
    payload: dict = {}
    for slug in ("header", "footer", "mobile"):
        try:
            payload[slug] = service.get_menu(slug, locale)
        except NotFoundError:
            payload[slug] = {"slug": slug, "locale": locale, "items": []}
    return _cached_json_response(request, cache_key, payload)


@router.get("/preview/{token}")
def get_preview(
    token: str,
    service: Annotated[PageApplicationService, Depends(_pages)],
):
    content = service.get_preview_content(token)
    return Response(
        content=json.dumps(content, ensure_ascii=False),
        media_type="application/json",
        headers={"Cache-Control": "no-store, no-cache, must-revalidate"},
    )
