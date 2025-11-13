from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class UserRegister(BaseModel):
    email: str
    password: str
    company_name: str
    role: str = "advertiser"

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister):
    """Register a new user/advertiser"""
    return {
        "access_token": "mock_access_token_abc123",
        "refresh_token": "mock_refresh_token_xyz789",
        "token_type": "bearer",
        "user": {
            "id": "usr_001",
            "email": user_data.email,
            "company_name": user_data.company_name,
            "role": user_data.role
        }
    }

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    """Login and get access token"""
    # Simple demo check
    if credentials.email == "demo@patternos.ai" and credentials.password == "demo123":
        return {
            "access_token": "mock_access_token_abc123",
            "refresh_token": "mock_refresh_token_xyz789",
            "token_type": "bearer",
            "user": {
                "id": "usr_001",
                "email": credentials.email,
                "company_name": "Demo Company",
                "role": "advertiser"
            }
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

@router.get("/me")
async def get_current_user():
    """Get current user info"""
    return {
        "id": "usr_001",
        "email": "demo@patternos.ai",
        "company_name": "Demo Company",
        "role": "advertiser",
        "created_at": "2025-10-29T20:00:00Z"
    }
