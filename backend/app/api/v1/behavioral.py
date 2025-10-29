from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()

class TrackEvent(BaseModel):
    event_type: str
    user_id: str
    session_id: str
    timestamp: Optional[datetime] = None
    data: dict

class IntentSignal(BaseModel):
    signal_id: str
    query: str
    intent_score: float
    volume: int
    trend: str
    category: str
    predicted_purchase_window: str
    demographics: dict

@router.post("/track", status_code=201)
async def track_event(event: TrackEvent):
    """Track behavioral events"""
    return {
        "status": "tracked",
        "event_id": f"evt_{event.session_id}_001",
        "message": "Event tracked successfully"
    }

@router.get("/intent-signals", response_model=List[IntentSignal])
async def get_intent_signals(timeframe: str = "24h", category: Optional[str] = None):
    """Get real-time intent signals"""
    # Mock data
    return [
        {
            "signal_id": "sig_001",
            "query": "wireless earbuds under 2000",
            "intent_score": 0.87,
            "volume": 12450,
            "trend": "+245%",
            "category": "electronics",
            "predicted_purchase_window": "24-48h",
            "demographics": {
                "age_range": "18-34",
                "gender_split": {"male": 0.65, "female": 0.35}
            }
        },
        {
            "signal_id": "sig_002",
            "query": "best smartphones under 15000",
            "intent_score": 0.82,
            "volume": 8900,
            "trend": "+180%",
            "category": "electronics",
            "predicted_purchase_window": "48-72h",
            "demographics": {
                "age_range": "25-35",
                "gender_split": {"male": 0.58, "female": 0.42}
            }
        }
    ]

@router.get("/patterns")
async def get_patterns(timeframe: str = "7d"):
    """Get behavioral patterns"""
    return {
        "patterns": [
            {
                "pattern_id": "pat_001",
                "type": "search_spike",
                "category": "electronics",
                "volume_increase": "+245%",
                "timeframe": "24h"
            }
        ],
        "total": 1,
        "timeframe": timeframe
    }
