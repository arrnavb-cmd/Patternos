import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="PatternOS API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import engines
from rtb_engine import rtb_engine
from attribution_engine import attribution_engine

@app.get("/")
async def root():
    return {"service": "PatternOS API", "version": "2.0", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/api/v1/rtb/request-ads")
async def request_ads(request: dict):
    result = await rtb_engine.handle_ad_request(request)
    return result

@app.get("/api/v1/campaigns/list")
async def list_campaigns(aggregator: str = None):
    campaigns = rtb_engine.get_mock_campaigns(aggregator or 'zepto')
    return {'total': len(campaigns), 'campaigns': campaigns}

@app.post("/api/v1/attribution/touchpoint")
async def track_touchpoint(data: dict):
    result = attribution_engine.track_touchpoint(data)
    return result

@app.post("/api/v1/attribution/conversion")
async def track_conversion(data: dict):
    result = attribution_engine.track_conversion(data)
    return result

@app.get("/api/v1/attribution/roas/{campaign_id}")
async def get_roas(campaign_id: str, model: str = "last_click"):
    return attribution_engine.calculate_roas(campaign_id, model)

@app.post("/api/v1/attribution/simulate")
async def simulate():
    user_id = "demo_user_001"
    attribution_engine.track_touchpoint({'user_id': user_id, 'campaign_id': 'CAMP_001', 'type': 'impression'})
    attribution_engine.track_touchpoint({'user_id': user_id, 'campaign_id': 'CAMP_001', 'type': 'click'})
    conversion = attribution_engine.track_conversion({'user_id': user_id, 'revenue': 2599})
    return {'user_id': user_id, 'conversion': conversion}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)
