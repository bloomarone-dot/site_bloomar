from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Server
    port: int = 8000
    environment: str = "development"

    # Database
    database_url: str = "postgresql://bloomar:bloomar@db:5432/bloomar"

    # CORS
    cors_origins: str = (
        "http://localhost,http://localhost:80,http://127.0.0.1,"
        "http://localhost:5173,http://127.0.0.1:5173"
    )

    # JWT
    jwt_secret_key: str = "change-me-in-production-use-long-random-string"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 15
    jwt_refresh_token_expire_days: int = 7

    # Bootstrap super admin (first run seed)
    bootstrap_admin_email: str = "admin@bloomarone.com"
    bootstrap_admin_password: str = "BloomarCMS2026!"
    bootstrap_admin_name: str = "Super Admin"

    # Media storage
    media_root: Path = Path("storage/media")
    media_max_upload_mb: int = 50
    media_allowed_mime_types: str = (
        "image/jpeg,image/png,image/webp,image/gif,image/svg+xml,"
        "application/pdf"
    )

    # Mail (legacy site forms)
    mail_host: str = "smtp.gmail.com"
    mail_port: int = 587
    mail_user: str = ""
    mail_pass: str = ""
    mail_from: str = '"BL∞MAR ONE" <contact@bloomarone.com>'
    mail_to: str = "contact@bloomarone.com"

    # Cache (Sprint 1)
    redis_url: str = ""
    cache_default_ttl: int = 300
    preview_token_expire_hours: int = 24

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def media_allowed_mime_list(self) -> list[str]:
        return [m.strip() for m in self.media_allowed_mime_types.split(",") if m.strip()]

    @property
    def media_max_upload_bytes(self) -> int:
        return self.media_max_upload_mb * 1024 * 1024


settings = Settings()
