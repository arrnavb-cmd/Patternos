from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()

class CampaignCreate(BaseModel):
    name: str
    advertiser_id: str
    retailer_id: str
    budget: dict
    duration: dict
    targeting: dict

class CampaignResponse(BaseModel):
    campaign_id: str
    name: str
    status: str
    estimated_reach: int
    estimated_roas: float
    created_at: datetime

@router.post("/create", response_model=CampaignResponse, status_code=201)
async def create_campaign(campaign_data: CampaignCreate):
    """Create new campaign"""
    return {
        "campaign_id": "camp_abc123",
        "name": campaign_data.name,
        "status": "pending_review",
        "estimated_reach": 450000,
        "estimated_roas": 3.2,
        "created_at": datetime.now()
    }

@router.get("/{campaign_id}", response_model=CampaignResponse)
async def get_campaign(campaign_id: str):
    """Get campaign details"""
    return {
        "campaign_id": campaign_id,
        "name": "Diwali Electronics Sale 2025",
        "status": "active",
        "estimated_reach": 450000,
        "estimated_roas": 3.2,
        "created_at": datetime.now()
    }

@router.get("/list", response_model=List[CampaignResponse])
async def list_campaigns(limit: int = 50):
    """List all campaigns"""
    return [
        {
            "campaign_id": "camp_001",
            "name": "Diwali Electronics Sale",
            "status": "active",
            "estimated_reach": 450000,
            "estimated_roas": 3.2,
            "created_at": datetime.now()
        },
        {
            "campaign_id": "camp_002",
            "name": "Fashion Week Special",
            "status": "active",
            "estimated_reach": 320000,
            "estimated_roas": 2.8,
            "created_at": datetime.now()
        }
    ]

@router.post("/{campaign_id}/activate")
async def activate_campaign(campaign_id: str):
    """Activate campaign"""
    return {
        "campaign_id": campaign_id,
        "status": "active",
        "message": "Campaign activated successfully"
    }

@router.get("/{campaign_id}/performance")
async def get_campaign_performance(campaign_id: str, timeframe: str = "7d"):
    """Get campaign performance metrics"""
    return {
        "campaign_id": campaign_id,
        "performance": {
            "impressions": 2450000,
            "clicks": 98000,
            "ctr": 0.04,
            "conversions": 4200,
            "conversion_rate": 0.043,
            "spend": 175000,
            "revenue": 490000,
            "roas": 2.8
        },
        "channel_breakdown": {
            "display": {"conversions": 1800, "roas": 2.5},
            "voice": {"conversions": 1600, "roas": 3.4},
            "in_store": {"conversions": 800, "roas": 3.1}
        }
    }
