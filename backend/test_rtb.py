from fastapi import FastAPI
from rtb_engine import rtb_engine

app = FastAPI()

@app.post("/api/v1/rtb/request-ads")
async def request_ads(request: dict):
    """Request ads - RTB"""
    result = await rtb_engine.handle_ad_request(request)
    return result

@app.get("/test")
async def test():
    return {"status": "RTB test server working"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
