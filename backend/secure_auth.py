"""
SECURE AUTHENTICATION - FIXED
Separate Aggregator Admin vs Brand User access
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from datetime import datetime, timedelta
import jwt

router = APIRouter()
security = HTTPBearer()

SECRET_KEY = "PatternOS_Secure_Key_2024"
ALGORITHM = "HS256"

class LoginRequest(BaseModel):
    email: str
    password: str

# FIXED USER DATABASE - Separate roles and access
USERS = {
    # ZEPTO AGGREGATOR ADMINS
    "admin@zepto.com": {
        "id": "USR_001",
        "email": "admin@zepto.com", 
        "password": "zepto123",
        "role": "aggregator_admin",
        "name": "Zepto Admin",
        "aggregator_id": "AGG_001",
        "aggregator_name": "Zepto",
        "brand_id": None,  # Can see ALL brands
        "brand_name": "Zepto Platform",
        "permissions": [
            "view_all_brands",
            "intent_intelligence", 
            "approve_ads",
            "master_dashboard",
            "revenue_analytics"
        ]
    },
    
    # BRAND USERS - SEPARATE LOGINS
    "nike@zepto.com": {
        "id": "USR_002",
        "email": "nike@zepto.com",
        "password": "nike123", 
        "role": "brand_user",
        "name": "Nike Brand Manager",
        "aggregator_id": "AGG_001",
        "aggregator_name": "Zepto", 
        "brand_id": "BRD_003",
        "brand_name": "Nike India",
        "permissions": [
            "view_own_campaigns",
            "create_campaigns", 
            "basic_analytics"
        ]
    },
    
    "adidas@zepto.com": {
        "id": "USR_003", 
        "email": "adidas@zepto.com",
        "password": "adidas123",
        "role": "brand_user",
        "name": "Adidas Brand Manager",
        "aggregator_id": "AGG_001",
        "aggregator_name": "Zepto",
        "brand_id": "BRD_004", 
        "brand_name": "Adidas India",
        "permissions": ["view_own_campaigns", "create_campaigns", "basic_analytics"]
    },
    
    "hul@zepto.com": {
        "id": "USR_004",
        "email": "hul@zepto.com", 
        "password": "hul123",
        "role": "brand_user",
        "name": "HUL Brand Manager",
        "aggregator_id": "AGG_001",
        "aggregator_name": "Zepto",
        "brand_id": "BRD_005",
        "brand_name": "Hindustan Unilever",
        "permissions": ["view_own_campaigns", "create_campaigns", "basic_analytics"]
    }
}

def create_access_token(user_data: dict):
    to_encode = user_data.copy()
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/login")
async def login(request: LoginRequest):
    user = USERS.get(request.email)
    
    if not user or user["password"] != request.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create token with user data (excluding password)
    token_data = {k: v for k, v in user.items() if k != "password"}
    access_token = create_access_token(token_data)
    
    return {
        "access_token": access_token,
        "token_type": "bearer", 
        "expires_in": 86400,
        "user": token_data
    }

@router.get("/me")
async def get_current_user(current_user: dict = Depends(verify_token)):
    return current_user

@router.post("/logout") 
async def logout():
    return {"message": "Logged out successfully"}
