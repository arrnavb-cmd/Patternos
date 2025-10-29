from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "PatternOS API"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = "patternos-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "https://*.netlify.app"]
    
    # Database (we'll add PostgreSQL later)
    DATABASE_URL: str = "sqlite:///./patternos.db"
    
    class Config:
        case_sensitive = True

settings = Settings()
