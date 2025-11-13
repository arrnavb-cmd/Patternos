# app/auth.py
import time
import jwt 
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from .config import settings

security = HTTPBearer()

def create_jwt(payload: dict, expires_in: Optional[int] = None) -> str:
    """
    Create a JWT. In dev we default to long expiry; in prod use shorter expiry.
    Returns a string token (handles PyJWT bytes case).
    """
    if expires_in is None:
        expires_in = 30 * 24 * 3600 if getattr(settings, "ENV", "dev") == "dev" else 3600

    payload = payload.copy()
    payload["exp"] = int(time.time()) + int(expires_in)

    token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGO)
    # PyJWT may return bytes in some older environments — ensure str
    if isinstance(token, bytes):
        token = token.decode("utf-8")
    return token

def require_auth(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Decode and validate JWT. Raises HTTPException(401) on invalid/expired token.
    Returns the token payload (dict) on success.
    """
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGO])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
