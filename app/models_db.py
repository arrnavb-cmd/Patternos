# app/models_db.py
from sqlalchemy import Column, Integer, String, Float, JSON, Text, TIMESTAMP, DateTime
from sqlalchemy.sql import func
from .db import Base  # import Base from db.py (Base already defined)

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
