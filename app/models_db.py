from sqlalchemy import Column, Integer, String, Float, JSON, Text, TIMESTAMP, DateTime, Boolean, ForeignKey, Enum as SQLEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from .db import Base

class EventDB(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    tenant_id = Column(String, index=True, nullable=True)
    event_type = Column(String, index=True, nullable=True)
    timestamp = Column(Float, nullable=False)

class ExportLog(Base):
    __tablename__ = "export_logs"
    id = Column(Integer, primary_key=True, index=True)
    requested_by = Column(String, nullable=True)
    role = Column(String, nullable=True)
    tenant_id = Column(String, nullable=True)
    params = Column(JSON, nullable=True)
    format = Column(String, nullable=True)
    row_count = Column(Integer, nullable=True)
    note = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())

class DashboardType(enum.Enum):
    MASTER = "master"
    BRAND = "brand"

class CampaignStatus(enum.Enum):
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class CampaignType(enum.Enum):
    CONTEXTUAL_PRODUCT_LISTING = "contextual_product_listing"
    INTERACTIVE_STORYTELLING = "interactive_storytelling"
    SHOPPABLE_VIDEO = "shoppable_video"
    INSTORE_VIDEO_AUDIO = "instore_video_audio"
    QR_AR_ENABLED = "qr_ar_enabled"
    LOYALTY_REWARDS = "loyalty_rewards"
    VOICE_MULTILINGUAL = "voice_multilingual"

class Organization(Base):
    __tablename__ = "organizations"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True, index=True)
    slug = Column(String(100), nullable=False, unique=True, index=True)
    dashboard_type = Column(SQLEnum(DashboardType), nullable=False)
    logo_url = Column(String(500), nullable=True)
    primary_color = Column(String(7), nullable=True)
    contact_email = Column(String(255), nullable=True)
    parent_aggregator_id = Column(Integer, ForeignKey('organizations.id'), nullable=True)
    annual_contract_value = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    campaigns = relationship("Campaign", back_populates="organization")
    parent = relationship("Organization", remote_side=[id], backref="child_brands")

class Campaign(Base):
    __tablename__ = "campaigns"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    campaign_code = Column(String(100), nullable=False, unique=True)
    organization_id = Column(Integer, ForeignKey('organizations.id'), nullable=False)
    campaign_type = Column(SQLEnum(CampaignType), nullable=False)
    status = Column(SQLEnum(CampaignStatus), default=CampaignStatus.DRAFT)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    total_budget = Column(Float, nullable=False)
    spent_amount = Column(Float, default=0.0)
    impressions = Column(Integer, default=0)
    clicks = Column(Integer, default=0)
    conversions = Column(Integer, default=0)
    revenue_generated = Column(Float, default=0.0)
    cpm = Column(Float, nullable=True)
    cpc = Column(Float, nullable=True)
    ctr = Column(Float, nullable=True)
    roas = Column(Float, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    organization = relationship("Organization", back_populates="campaigns")

class AudienceSegment(Base):
    __tablename__ = "audience_segments"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    estimated_size = Column(Integer, nullable=True)
    avg_spend = Column(Float, nullable=True)
