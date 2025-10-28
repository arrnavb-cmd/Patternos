import os
from dataclasses import dataclass

@dataclass
class Settings:
    SERVICE_NAME: str = os.getenv("SERVICE_NAME", "patternos-api")
    KAFKA_BOOTSTRAP: str = os.getenv("KAFKA_BOOTSTRAP", "localhost:9092")
    KAFKA_TOPIC: str = os.getenv("KAFKA_TOPIC", "events")
    FALLBACK_EVENTS_FILE: str = os.getenv("FALLBACK_EVENTS_FILE", "/tmp/events_fallback.log")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "patternos-dev-secret")
    JWT_ALGO: str = os.getenv("JWT_ALGO", "HS256")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./patternos.db")
    MODEL_PATH: str = os.getenv("MODEL_PATH", "models/conv_model_dummy.joblib")
    ENV: str = os.getenv("ENV", "dev")
    POSTGRES_DSN: str = os.getenv("POSTGRES_DSN", "postgresql://postgres:postgres@localhost:5432/patternos")
class Config:
    env_file = ".env"
    case_sensitive = True

settings = Settings()
