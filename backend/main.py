from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime, timedelta
import json
import hashlib
from jose import JWTError, jwt
from passlib.context import CryptContext

# Import RTB Engine
from rtb_engine import rtb_engine

app = FastAPI(title="PatternOS API", version="2.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
SECRET_KEY = "patternos-secret-key-change-in-production"
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# In-memory databases
users_db = {}
events_db = []
visual_profiles_db = {}
intent_scores_db = {}

# Models (keeping your existing models)
class User(BaseModel):
    email: str
    password: str
    company_name: Optional[str] = None
    role: str = "advertiser"

class UserLogin(BaseModel):
    email: str
    password: str

class Event(BaseModel):
    event_type: str
    user_id: str
    platform: Optional[str] = "web"
    product_id: Optional[str] = None
    category: Optional[str] = None
    metadata: Optional[Dict] = {}

# Helper functions
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

# ============================================
# RTB ENDPOINTS (PRIORITY)
# ============================================

@app.post("/api/v1/rtb/request-ads")
async def request_ads(request: dict):
    """Request ads for a page (Real-Time Bidding)"""
    result = await rtb_engine.handle_ad_request(request)
    return result

@app.get("/api/v1/rtb/auction-stats/{campaign_id}")
async def get_auction_stats(campaign_id: str):
    """Get auction statistics for a campaign"""
    stats = await rtb_engine.get_auction_stats(campaign_id)
    return stats

@app.get("/api/v1/rtb/auction-stats")
async def get_all_auction_stats():
    """Get overall auction statistics"""
    stats = await rtb_engine.get_auction_stats()
    return stats

@app.post("/api/v1/campaigns/create")
async def create_campaign(campaign: dict):
    """Create a new ad campaign"""
    campaign_id = f"CAMP_{len(rtb_engine.active_campaigns) + 1:03d}"
    campaign_data = {
        'id': campaign_id,
        'name': campaign['name'],
        'brand': campaign['brand'],
        'aggregator': campaign.get('aggregator', 'all'),
        'max_cpm': campaign.get('max_cpm', 100),
        'budget': campaign['budget'],
        'spent': 0,
        'status': 'active',
        'targeting': campaign.get('targeting', {}),
        'creative': campaign.get('creative', {}),
        'click_url': campaign.get('click_url', ''),
        'start_date': campaign.get('start_date'),
        'end_date': campaign.get('end_date'),
        'created_at': datetime.utcnow().isoformat()
    }
    rtb_engine.active_campaigns[campaign_id] = campaign_data
    return {'status': 'created', 'campaign': campaign_data}

@app.get("/api/v1/campaigns/list")
async def list_campaigns(aggregator: Optional[str] = None):
    """List all campaigns"""
    campaigns = rtb_engine.get_mock_campaigns(aggregator or 'zepto')
    return {'total': len(campaigns), 'campaigns': campaigns}

@app.get("/api/v1/campaigns/{campaign_id}")
async def get_campaign(campaign_id: str):
    """Get campaign details"""
    campaigns = rtb_engine.get_mock_campaigns('zepto')
    campaign = next((c for c in campaigns if c['id'] == campaign_id), None)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    stats = await rtb_engine.get_auction_stats(campaign_id)
    return {'campaign': campaign, 'stats': stats}

# ============================================
# HEALTH & ROOT
# ============================================

@app.get("/")
async def root():
    return {
        "service": "PatternOS API",
        "version": "2.0",
        "status": "running",
        "endpoints": {
            "rtb": "/api/v1/rtb/request-ads",
            "campaigns": "/api/v1/campaigns/list",
            "health": "/health"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "rtb_engine": "active",
        "campaigns": len(rtb_engine.get_mock_campaigns('zepto'))
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
