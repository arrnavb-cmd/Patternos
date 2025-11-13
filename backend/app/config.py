from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "PatternOS API"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = "patternos-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS - Allow all origins for now
    ALLOWED_ORIGINS: List[str] = ["*"]
    
    # Database
    DATABASE_URL: str = "sqlite:///./patternos.db"
    
    class Config:
        case_sensitive = True

settings = Settings()
