from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel
from app.database import get_db
from app.intelligence.behavioral.models import (
    BrowsingHistory, CacheData, UserSession, CrossPlatformActivity
)

router = APIRouter()

# Pydantic schemas
class BrowsingEvent(BaseModel):
    user_id: str
    session_id: str
    url: str
    page_title: str
    referrer: Optional[str] = None
    device_type: str
    platform: str
    time_spent: int
    scroll_depth: float
    interactions: dict

class CacheDataCreate(BaseModel):
    user_id: str
    platform: str
    data_type: str
    data_key: str
    data_value: dict
    expires_at: Optional[datetime] = None

class SessionStart(BaseModel):
    user_id: str
    session_id: str
    platform: str
    device_info: dict

# Track browsing event
@router.post("/browsing/track")
async def track_browsing(event: BrowsingEvent, db: Session = Depends(get_db)):
    browsing_record = BrowsingHistory(
        user_id=event.user_id,
        session_id=event.session_id,
        url=event.url,
        page_title=event.page_title,
        referrer=event.referrer,
        device_type=event.device_type,
        platform=event.platform,
        time_spent=event.time_spent,
        scroll_depth=event.scroll_depth,
        interactions=event.interactions
    )
    db.add(browsing_record)
    db.commit()
    return {"status": "tracked", "id": browsing_record.id}

# Get user browsing history
@router.get("/browsing/history/{user_id}")
async def get_browsing_history(
    user_id: str, 
    platform: Optional[str] = None,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(BrowsingHistory).filter(BrowsingHistory.user_id == user_id)
    if platform:
        query = query.filter(BrowsingHistory.platform == platform)
    
    history = query.order_by(BrowsingHistory.timestamp.desc()).limit(limit).all()
    return {"user_id": user_id, "history": history}

# Store cache data
@router.post("/cache/store")
async def store_cache(data: CacheDataCreate, db: Session = Depends(get_db)):
    # Check if key exists, update or create
    existing = db.query(CacheData).filter(
        CacheData.user_id == data.user_id,
        CacheData.platform == data.platform,
        CacheData.data_key == data.data_key
    ).first()
    
    if existing:
        existing.data_value = data.data_value
        existing.updated_at = datetime.utcnow()
        existing.expires_at = data.expires_at
    else:
        cache_record = CacheData(
            user_id=data.user_id,
            platform=data.platform,
            data_type=data.data_type,
            data_key=data.data_key,
            data_value=data.data_value,
            expires_at=data.expires_at
        )
        db.add(cache_record)
    
    db.commit()
    return {"status": "stored"}

# Get cache data
@router.get("/cache/retrieve/{user_id}")
async def retrieve_cache(
    user_id: str,
    platform: Optional[str] = None,
    data_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(CacheData).filter(CacheData.user_id == user_id)
    if platform:
        query = query.filter(CacheData.platform == platform)
    if data_type:
        query = query.filter(CacheData.data_type == data_type)
    
    # Filter out expired cache
    query = query.filter(
        (CacheData.expires_at.is_(None)) | (CacheData.expires_at > datetime.utcnow())
    )
    
    cache_data = query.all()
    return {"user_id": user_id, "cache": cache_data}

# Start session
@router.post("/session/start")
async def start_session(session: SessionStart, db: Session = Depends(get_db)):
    user_session = UserSession(
        user_id=session.user_id,
        session_id=session.session_id,
        platform=session.platform,
        device_info=session.device_info,
        actions=[]
    )
    db.add(user_session)
    db.commit()
    return {"status": "session_started", "session_id": session.session_id}

# End session
@router.post("/session/end/{session_id}")
async def end_session(session_id: str, db: Session = Depends(get_db)):
    session = db.query(UserSession).filter(UserSession.session_id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session.end_time = datetime.utcnow()
    session.total_time = int((session.end_time - session.start_time).total_seconds())
    db.commit()
    return {"status": "session_ended", "total_time": session.total_time}

# Track cross-platform activity
@router.post("/cross-platform/track")
async def track_cross_platform(
    user_id: str,
    activity_type: str,
    platform_source: str,
    platform_target: Optional[str] = None,
    activity_data: dict = {},
    db: Session = Depends(get_db)
):
    activity = CrossPlatformActivity(
        user_id=user_id,
        activity_type=activity_type,
        platform_source=platform_source,
        platform_target=platform_target,
        activity_data=activity_data
    )
    db.add(activity)
    db.commit()
    return {"status": "tracked", "id": activity.id}

# Get user insights
@router.get("/insights/{user_id}")
async def get_user_insights(user_id: str, days: int = 30, db: Session = Depends(get_db)):
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    # Browsing patterns
    browsing = db.query(BrowsingHistory).filter(
        BrowsingHistory.user_id == user_id,
        BrowsingHistory.timestamp >= cutoff_date
    ).all()
    
    # Sessions
    sessions = db.query(UserSession).filter(
        UserSession.user_id == user_id,
        UserSession.start_time >= cutoff_date
    ).all()
    
    # Cross-platform activity
    cross_platform = db.query(CrossPlatformActivity).filter(
        CrossPlatformActivity.user_id == user_id,
        CrossPlatformActivity.timestamp >= cutoff_date
    ).all()
    
    return {
        "user_id": user_id,
        "period_days": days,
        "total_page_views": len(browsing),
        "total_sessions": len(sessions),
        "platforms_used": list(set([b.platform for b in browsing])),
        "avg_session_time": sum([s.total_time for s in sessions if s.total_time]) / len(sessions) if sessions else 0,
        "cross_platform_activities": len(cross_platform),
        "browsing_history": browsing[:10],  # Last 10
        "recent_sessions": sessions[:5]  # Last 5
    }
