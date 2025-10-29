from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()

class AudienceCreate(BaseModel):
    name: str
    description: Optional[str] = None
    algebra: dict
    retailer_id: str

class AudienceResponse(BaseModel):
    audience_id: str
    name: str
    size: int
    created_at: datetime
    status: str
    estimated_reach: dict

@router.post("/create", response_model=AudienceResponse, status_code=201)
async def create_audience(audience_data: AudienceCreate):
    """Create audience segment"""
    return {
        "audience_id": "aud_abc123",
        "name": audience_data.name,
        "size": 245000,
        "created_at": datetime.now(),
        "status": "active",
        "estimated_reach": {
            "display": 220000,
            "voice": 98000,
            "in_store": 156000
        }
    }

@router.get("/{audience_id}", response_model=AudienceResponse)
async def get_audience(audience_id: str):
    """Get audience details"""
    return {
        "audience_id": audience_id,
        "name": "High-Intent Electronics Buyers",
        "size": 245000,
        "created_at": datetime.now(),
        "status": "active",
        "estimated_reach": {
            "display": 220000,
            "voice": 98000,
            "in_store": 156000
        }
    }

@router.get("/search", response_model=List[AudienceResponse])
async def search_audiences(query: Optional[str] = None, limit: int = 50):
    """Search audiences"""
    return [
        {
            "audience_id": "aud_001",
            "name": "High-Intent Electronics Buyers",
            "size": 245000,
            "created_at": datetime.now(),
            "status": "active",
            "estimated_reach": {"display": 220000, "voice": 98000, "in_store": 156000}
        },
        {
            "audience_id": "aud_002",
            "name": "Fashion Enthusiasts",
            "size": 189000,
            "created_at": datetime.now(),
            "status": "active",
            "estimated_reach": {"display": 170000, "voice": 75000, "in_store": 120000}
        }
    ]
