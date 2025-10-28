from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
import time

class Event(BaseModel):
    tenant_id: str
    user_id: str
    event_type: str
    product_id: Optional[str] = None
    properties: Dict[str, Any] = Field(default_factory=dict)
    timestamp: float = Field(default_factory=lambda: time.time())

class PredictRequest(BaseModel):
    features: Dict[str, float]

class PredictResponse(BaseModel):
    probability: float
    model_version: str
