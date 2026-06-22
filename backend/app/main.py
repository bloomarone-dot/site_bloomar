from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import admin, capture, developpeur, lead

app = FastAPI(title="BL∞MAR ONE API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(lead.router)
app.include_router(capture.router)
app.include_router(developpeur.router)
app.include_router(admin.router)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
