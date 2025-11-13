"""
SECURE CAMPAIGNS - FIXED IMPORTS
Role-based campaign access
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
from secure_auth import verify_token

router = APIRouter()

# Mock campaign data
CAMPAIGNS = [
    {
        "id": "CAMP_001",
        "name": "Nike Air Max Launch - Mumbai",
        "brand_id": "BRD_003",
        "brand_name": "Nike India",
        "status": "active",
        "budget": 500000,
        "spent": 125000,
        "impressions": 2500000,
        "clicks": 45000,
        "conversions": 850,
        "start_date": "2024-10-01",
        "end_date": "2024-11-30",
        "target_audience": "High Intent Footwear - Mumbai",
        "platform": "zepto"
    },
    {
        "id": "CAMP_002", 
        "name": "Adidas Ultraboost Campaign",
        "brand_id": "BRD_004",
        "brand_name": "Adidas India",
        "status": "active",
        "budget": 750000,
        "spent": 320000,
        "impressions": 3200000,
        "clicks": 58000,
        "conversions": 1250,
        "start_date": "2024-10-15",
        "end_date": "2024-12-15",
        "target_audience": "Sports Enthusiasts - All India",
        "platform": "zepto"
    },
    {
        "id": "CAMP_003",
        "name": "HUL Dove Campaign", 
        "brand_id": "BRD_005",
        "brand_name": "Hindustan Unilever",
        "status": "paused",
        "budget": 300000,
        "spent": 89000,
        "impressions": 1800000,
        "clicks": 22000,
        "conversions": 420,
        "start_date": "2024-09-01",
        "end_date": "2024-11-01",
        "target_audience": "Beauty & Personal Care",
        "platform": "zepto"
    }
]

@router.get("/list")
async def list_campaigns(current_user: dict = Depends(verify_token)):
    """Get campaigns based on user role"""
    
    if current_user["role"] == "aggregator_admin":
        # Admin sees ALL campaigns
        return {
            "total": len(CAMPAIGNS),
            "campaigns": CAMPAIGNS
        }
    else:
        # Brand users see only their campaigns
        user_campaigns = [c for c in CAMPAIGNS if c["brand_id"] == current_user.get("brand_id")]
        return {
            "total": len(user_campaigns),
            "campaigns": user_campaigns
        }

@router.get("/stats")
async def get_campaign_stats(current_user: dict = Depends(verify_token)):
    """Get campaign statistics based on user role"""
    
    if current_user["role"] == "aggregator_admin":
        # Admin sees platform-wide stats
        total_budget = sum(c["budget"] for c in CAMPAIGNS)
        total_spent = sum(c["spent"] for c in CAMPAIGNS)
        total_impressions = sum(c["impressions"] for c in CAMPAIGNS)
        total_clicks = sum(c["clicks"] for c in CAMPAIGNS)
        total_conversions = sum(c["conversions"] for c in CAMPAIGNS)
        
        active_campaigns = len([c for c in CAMPAIGNS if c["status"] == "active"])
        
        return {
            "total_campaigns": len(CAMPAIGNS),
            "active_campaigns": active_campaigns,
            "total_budget": total_budget,
            "total_spent": total_spent,
            "total_impressions": total_impressions,
            "total_clicks": total_clicks,
            "total_conversions": total_conversions,
            "avg_ctr": round((total_clicks / total_impressions) * 100, 2) if total_impressions > 0 else 0,
            "avg_cvr": round((total_conversions / total_clicks) * 100, 2) if total_clicks > 0 else 0
        }
    else:
        # Brand users see only their stats
        user_campaigns = [c for c in CAMPAIGNS if c["brand_id"] == current_user.get("brand_id")]
        
        if not user_campaigns:
            return {
                "total_campaigns": 0,
                "active_campaigns": 0,
                "total_budget": 0,
                "total_spent": 0,
                "total_impressions": 0,
                "total_clicks": 0,
                "total_conversions": 0,
                "avg_ctr": 0,
                "avg_cvr": 0
            }
        
        total_budget = sum(c["budget"] for c in user_campaigns)
        total_spent = sum(c["spent"] for c in user_campaigns)
        total_impressions = sum(c["impressions"] for c in user_campaigns)
        total_clicks = sum(c["clicks"] for c in user_campaigns)
        total_conversions = sum(c["conversions"] for c in user_campaigns)
        
        active_campaigns = len([c for c in user_campaigns if c["status"] == "active"])
        
        return {
            "total_campaigns": len(user_campaigns),
            "active_campaigns": active_campaigns,
            "total_budget": total_budget,
            "total_spent": total_spent,
            "total_impressions": total_impressions,
            "total_clicks": total_clicks,
            "total_conversions": total_conversions,
            "avg_ctr": round((total_clicks / total_impressions) * 100, 2) if total_impressions > 0 else 0,
            "avg_cvr": round((total_conversions / total_clicks) * 100, 2) if total_clicks > 0 else 0
        }

@router.get("/{campaign_id}")
async def get_campaign(campaign_id: str, current_user: dict = Depends(verify_token)):
    """Get specific campaign"""
    
    campaign = next((c for c in CAMPAIGNS if c["id"] == campaign_id), None)
    
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    # Check access permissions
    if current_user["role"] != "aggregator_admin" and campaign["brand_id"] != current_user.get("brand_id"):
        raise HTTPException(status_code=403, detail="Access denied")
    
    return campaign
