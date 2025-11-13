from sqlalchemy import Column, Integer, String, DateTime, JSON, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class BrowsingHistory(Base):
    __tablename__ = "browsing_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    session_id = Column(String, index=True)
    url = Column(Text)
    page_title = Column(String)
    referrer = Column(Text, nullable=True)
    device_type = Column(String)
    platform = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    time_spent = Column(Integer)
    scroll_depth = Column(Float)
    interactions = Column(JSON)
    metadata = Column(JSON, nullable=True)

class CacheData(Base):
    __tablename__ = "cache_data"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    platform = Column(String)
    data_type = Column(String)
    data_key = Column(String)
    data_value = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)

class UserSession(Base):
    __tablename__ = "user_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    session_id = Column(String, unique=True, index=True)
    platform = Column(String)
    device_info = Column(JSON)
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    page_views = Column(Integer, default=0)
    total_time = Column(Integer, default=0)
    actions = Column(JSON)

class CrossPlatformActivity(Base):
    __tablename__ = "cross_platform_activity"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    activity_type = Column(String)
    platform_source = Column(String)
    platform_target = Column(String, nullable=True)
    activity_data = Column(JSON)
    timestamp = Column(DateTime, default=datetime.utcnow)
