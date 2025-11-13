from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# Database setup
DATABASE_URL = "sqlite:///./intent_intelligence.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models
class UserEvent(Base):
    __tablename__ = "user_events"
    
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(String, index=True)
    user_id = Column(String, index=True)
    event_type = Column(String)  # search, product_view, cart_add, etc.
    category = Column(String, index=True)
    product_id = Column(String, nullable=True)
    search_query = Column(String, nullable=True)
    location = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

class IntentScore(Base):
    __tablename__ = "intent_scores"
    
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(String, index=True)
    user_id = Column(String, index=True)
    category = Column(String, index=True)
    intent_score = Column(Float)
    intent_level = Column(String)  # high, medium, low, minimal
    confidence = Column(Float)
    signals = Column(JSON)  # Store signals as JSON
    last_activity = Column(DateTime)
    signal_count = Column(Integer)
    scored_at = Column(DateTime, default=datetime.utcnow)

class Opportunity(Base):
    __tablename__ = "opportunities"
    
    id = Column(Integer, primary_key=True, index=True)
    opportunity_id = Column(String, unique=True, index=True)
    client_id = Column(String, index=True)
    category = Column(String)
    user_count = Column(Integer)
    avg_intent_score = Column(Float)
    revenue_estimate = Column(Integer)
    campaign_price = Column(Integer)
    estimated_conversion = Column(Float)
    urgency = Column(String)  # critical, high, medium, low
    status = Column(String, default='active')  # active, assigned, booked, expired
    suggested_brands = Column(JSON)
    assigned_to = Column(String, nullable=True)
    booked_by = Column(String, nullable=True)
    detected_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime)

# Create tables
def init_db():
    Base.metadata.create_all(bind=engine)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
