from contextlib import asynccontextmanager

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import app.database as database
from app.database import Base, get_db

SQLALCHEMY_DATABASE_URL = "sqlite://"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

database.engine = engine
database.SessionLocal = TestingSessionLocal

import app.models  # noqa: F401 — register all tables on Base.metadata
from app.main import app  # noqa: E402
from app.modules.content.application.seed import seed_sprint1_content
from app.modules.media.application.services import MediaApplicationService
from app.modules.identity.service import IdentityService
from app.modules.settings.service import SettingsService


@asynccontextmanager
async def _noop_lifespan(_app):
    yield


app.router.lifespan_context = _noop_lifespan


@pytest.fixture()
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        identity = IdentityService(db)
        identity.seed_roles_and_permissions()
        identity.seed_super_admin()
        SettingsService(db).seed_defaults()
        seed_sprint1_content(db)
        MediaApplicationService(db).seed_default_folders()
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def client(db_session):
    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app, raise_server_exceptions=True) as test_client:
        yield test_client
    app.dependency_overrides.clear()
