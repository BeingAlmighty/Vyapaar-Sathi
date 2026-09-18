from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    APP_ENV: str = "development"
    PORT: int = 8000

    # PostgreSQL Database Configuration
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/paytm_growth_db"
    DB_MIN_POOL_SIZE: int = 2
    DB_MAX_POOL_SIZE: int = 10

    # External Service Integrations
    N8N_WEBHOOK_URL: str = "http://localhost:5678/webhook/merchant-ai"
    N8N_TIMEOUT_SECONDS: float = 10.0

    ML_SERVICE_URL: str = "http://localhost:8001"
    ML_SERVICE_TIMEOUT_SECONDS: float = 5.0

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
