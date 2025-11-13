from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="PatternOS API",
    description="Retail Media Intelligence OS",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "PatternOS API v1.0", "status": "operational", "docs": "/docs"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.get("/api/v1/health")
async def health_check():
    return {"status": "healthy", "service": "PatternOS API", "version": "1.0.0"}

# Core routers
try:
    from app.api.v1 import auth, behavioral, audience, campaigns
    app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
    app.include_router(behavioral.router, prefix="/api/v1/behavioral", tags=["Behavioral"])
    app.include_router(audience.router, prefix="/api/v1/audience", tags=["Audience"])
    app.include_router(campaigns.router, prefix="/api/v1/campaigns", tags=["Campaigns"])
    print("✅ Core routers loaded")
except Exception as e:
    print(f"⚠️  Core routers error: {e}")

# Analytics router (100K purchase database)
try:
    from app.api.v1 import analytics
    app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Analytics"])
    print("✅ Analytics router loaded")
except Exception as e:
    print(f"⚠️  Analytics router error: {e}")

# Intent Intelligence router (30K intent database)
try:
    from app.api.v1 import intent_intelligence
    app.include_router(intent_intelligence.router, prefix="/api/v1/intent", tags=["Intent Intelligence"])
    print("✅ Intent Intelligence router loaded")
except Exception as e:
    print(f"⚠️  Intent Intelligence router error: {e}")

# Commerce router (Dashboard metrics)
try:
    from app.api.v1 import commerce
    app.include_router(commerce.router, prefix="/api/v1/commerce", tags=["Commerce"])
    print("✅ Commerce router loaded")
except Exception as e:
    print(f"⚠️  Commerce router error: {e}")
