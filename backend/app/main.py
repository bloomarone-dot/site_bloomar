from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app import database
from app.modules.audit.router import router as audit_router
from app.modules.content.application.seed import seed_sprint1_content
from app.modules.media.application.services import MediaApplicationService
from app.modules.content.presentation.cms_router import router as content_router
from app.modules.identity.cms_router import router as cms_identity_router
from app.modules.identity.router import router as auth_router
from app.modules.identity.service import IdentityService
from app.modules.localization.presentation.cms_router import router as localization_router
from app.modules.media.router import files_router, router as media_router
from app.modules.media.presentation.cms_router import library_router
from app.modules.navigation.presentation.cms_router import router as navigation_router
from app.modules.public.presentation.router import router as public_router
from app.modules.settings.router import router as settings_router
from app.modules.settings.service import SettingsService
from app.routers import admin, capture, developpeur, lead
from app.shared.presentation.errors import register_exception_handlers


@asynccontextmanager
async def lifespan(app: FastAPI):
    db = database.SessionLocal()
    try:
        identity = IdentityService(db)
        identity.seed_roles_and_permissions()
        identity.seed_super_admin()
        SettingsService(db).seed_defaults()
        seed_sprint1_content(db)
        MediaApplicationService(db).seed_default_folders()
    finally:
        db.close()
    yield


app = FastAPI(title="BL∞MAR ONE API", version="2.1.0-sprint1", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)

# Legacy public site API
app.include_router(lead.router)
app.include_router(capture.router)
app.include_router(developpeur.router)
app.include_router(admin.router)

# Sprint 0 CMS API
app.include_router(auth_router)
app.include_router(cms_identity_router)
app.include_router(settings_router)
app.include_router(media_router)
app.include_router(library_router)
app.include_router(files_router)
app.include_router(audit_router)

# Sprint 1 — Content, Navigation, Localization, Public API
app.include_router(content_router)
app.include_router(navigation_router)
app.include_router(localization_router)
app.include_router(public_router)


@app.get("/api/health")
def health_check():
    return {"status": "ok", "cms": "sprint1"}


@app.get("/api/v1/cms/health")
def cms_health_check():
    return {"status": "ok", "module": "cms", "sprint": 1}
