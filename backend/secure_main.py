"""
SECURE PATTERNOS API
Multi-Tenant Retail Media Platform + Intent Intelligence + Opportunities
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from secure_auth import router as auth_router
from secure_campaigns import router as campaigns_router
from secure_intent import router as intent_router
from secure_opportunities import router as opportunities_router

app = FastAPI(
    title="PatternOS Secure API",
    description="Multi-Tenant Retail Media Intelligence Platform with Intent Intelligence & Opportunity Detection",
    version="2.0.0-secure"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3004", "http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(campaigns_router, prefix="/api/v1/campaigns", tags=["Campaigns"])
app.include_router(intent_router, prefix="/api/v1/intent", tags=["Intent Intelligence"])
app.include_router(opportunities_router, prefix="/api/v1/opportunities", tags=["Opportunities"])

@app.get("/")
async def root():
    return {
        "service": "PatternOS Secure API",
        "version": "2.0.0-secure",
        "status": "operational",
        "features": ["campaigns", "intent-intelligence", "opportunities", "audiences"]
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "version": "2.0.0-secure"}

if __name__ == "__main__":
    import uvicorn
    print("=" * 80)
    print("🔒 PatternOS Secure API Starting...")
    print("=" * 80)
    print("✅ Multi-tenant isolation: ENABLED")
    print("✅ JWT authentication: ENABLED")
    print("✅ Role-based access control: ENABLED")
    print("🧠 Intent Intelligence System: ENABLED")
    print("💰 Opportunity Detection: ENABLED")
    print("=" * 80)
    print("📝 API Docs: http://localhost:8001/docs")
    print("=" * 80)
    print("\n🧪 DEMO CREDENTIALS:")
    print("-" * 80)
    print("📊 AGGREGATOR: admin@zepto.com / demo123 (sees all brands)")
    print("👟 NIKE: nike@zepto.com / demo123 (sees only Nike)")
    print("🧴 HUL: hul@zepto.com / demo123 (sees only HUL)")
    print("-" * 80)
    uvicorn.run(app, host="0.0.0.0", port=8001)
