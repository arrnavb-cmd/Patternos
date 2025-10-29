from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="PatternOS API",
    description="Retail Media Intelligence OS",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS - Allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "PatternOS API v1.0",
        "status": "operational",
        "docs": "/docs"
    }

@app.get("/api/v1/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "PatternOS API",
        "version": "1.0.0"
    }

# Import routers
from app.api.v1 import auth, behavioral, audience, campaigns

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(behavioral.router, prefix="/api/v1/behavioral", tags=["Behavioral"])
app.include_router(audience.router, prefix="/api/v1/audience", tags=["Audience"])
app.include_router(campaigns.router, prefix="/api/v1/campaigns", tags=["Campaigns"])
