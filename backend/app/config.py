from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    port: int = 8000
    database_url: str = "postgresql://bloomar:bloomar@db:5432/bloomar"
    cors_origins: str = "http://localhost,http://localhost:80,http://127.0.0.1"

    mail_host: str = "smtp.gmail.com"
    mail_port: int = 587
    mail_user: str = ""
    mail_pass: str = ""
    mail_from: str = '"BL∞MAR ONE" <contact@bloomarone.com>'
    mail_to: str = "contact@bloomarone.com"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
