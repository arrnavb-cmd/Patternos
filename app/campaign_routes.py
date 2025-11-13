from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.db import SessionLocal
from app.models_db import Campaign, Organization

router = APIRouter(prefix="/api", tags=["campaigns"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/campaigns")
async def get_campaigns(organization_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(Campaign)
    if organization_id:
        query = query.filter(Campaign.organization_id == organization_id)
    campaigns = query.all()
    result = []
    for c in campaigns:
        result.append({
            "id": c.id,
            "name": c.name,
            "campaign_code": c.campaign_code,
            "organization_id": c.organization_id,
            "status": c.status.value if hasattr(c.status, 'value') else str(c.status),
            "total_budget": c.total_budget,
            "spent_amount": c.spent_amount,
            "impressions": c.impressions,
            "clicks": c.clicks,
            "roas": c.roas,
            "revenue_generated": c.revenue_generated
        })
    return result

@router.get("/organizations")
async def get_organizations(db: Session = Depends(get_db)):
    orgs = db.query(Organization).all()
    result = []
    for o in orgs:
        result.append({
            "id": o.id,
            "name": o.name,
            "slug": o.slug,
            "dashboard_type": org.dashboard_type.value if hasattr(org.dashboard_type, 'value') else str(org.dashboard_type),
            "annual_contract_value": o.annual_contract_value
        })
    return result

@router.get("/organizations/{slug}")
async def get_organization(slug: str, db: Session = Depends(get_db)):
    org = db.query(Organization).filter(Organization.slug == slug).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return {
        "id": org.id,
        "name": org.name,
        "slug": org.slug,
        "dashboard_type": org.dashboard_type.value if hasattr(org.dashboard_type, 'value') else str(org.dashboard_type)
    }

# Master Dashboard Endpoints
@router.get("/master/dashboard")
async def get_master_dashboard(db: Session = Depends(get_db)):
    """Aggregated metrics for Zepto master dashboard"""
    campaigns = db.query(Campaign).all()
    orgs = db.query(Organization).filter(Organization.dashboard_type != 'master').all()
    
    total_gmv = sum(c.revenue_generated or 0 for c in campaigns)
    total_ad_revenue = sum(c.spent_amount or 0 for c in campaigns)
    total_impressions = sum(c.impressions or 0 for c in campaigns)
    total_clicks = sum(c.clicks or 0 for c in campaigns)
    
    active_campaigns = len([c for c in campaigns if c.status.value == 'active' or str(c.status) == 'active'])
    
    return {
        "summary": {
            "totalRevenue": total_gmv,
            "attributedRevenue": total_ad_revenue * 0.15,
            "attributionRate": 15.0
        }
    }

@router.get("/master/brand-performance")
async def get_brand_performance(db: Session = Depends(get_db)):
    """Top performing brands for master dashboard"""
    brands = db.query(Organization).filter(Organization.dashboard_type != 'master').all()
    
    brand_stats = []
    for brand in brands:
        campaigns = db.query(Campaign).filter(Campaign.organization_id == brand.id).all()
        
        total_spend = sum(c.spent_amount or 0 for c in campaigns)
        total_revenue = sum(c.revenue_generated or 0 for c in campaigns)
        total_impressions = sum(c.impressions or 0 for c in campaigns)
        total_clicks = sum(c.clicks or 0 for c in campaigns)
        total_conversions = sum(c.conversions or 0 for c in campaigns)
        
        roas = (total_revenue / total_spend) if total_spend > 0 else 0
        ctr = (total_clicks / total_impressions * 100) if total_impressions > 0 else 0
        conv_rate = (total_conversions / total_clicks * 100) if total_clicks > 0 else 0
        
        brand_stats.append({
            "rank": 0,  # Will be set after sorting
            "brand": brand.name,
            "ad_spend": total_spend,
            "revenue": total_revenue,
            "roas": roas,
            "purchases": total_conversions,
            "ctr": ctr,
            "conv_rate": conv_rate,
            "channels": len(campaigns)
        })
    
    # Sort by revenue and assign ranks
    brand_stats.sort(key=lambda x: x['revenue'], reverse=True)
    for i, brand in enumerate(brand_stats):
        brand['rank'] = i + 1
    
    return brand_stats[:5]  # Top 5 brands

@router.get("/master/intent-stats")
async def get_intent_stats(db: Session = Depends(get_db)):
    campaigns = db.query(Campaign).all()
    total_impressions = sum(c.impressions or 0 for c in campaigns)
    total_clicks = sum(c.clicks or 0 for c in campaigns)
    return {
        "totalUsers": total_impressions,
        "intentDistribution": {
            "high": int(total_clicks * 0.12)
        }
    }

# Analytics v1 API endpoints
@router.get("/v1/analytics/platform-summary")
async def platform_summary_v1(date_range: str = "last_30_days", db: Session = Depends(get_db)):
    campaigns = db.query(Campaign).all()
    total_spend = sum(c.spent_amount or 0 for c in campaigns)
    total_revenue = sum(c.revenue_generated or 0 for c in campaigns)
    return {
        "total_revenue": total_revenue,
        "total_spend": total_spend,
        "avg_roas": (total_revenue / total_spend) if total_spend > 0 else 0,
        "total_clicks": sum(c.clicks or 0 for c in campaigns),
        "total_impressions": sum(c.impressions or 0 for c in campaigns),
        "total_conversions": sum(c.conversions or 0 for c in campaigns)
    }

@router.get("/v1/analytics/channel-performance")
async def channel_perf_v1(date_range: str = "last_30_days", db: Session = Depends(get_db)):
    channels_data = [
        {"channel": "zepto", "spend": 0, "revenue": 0, "impressions": 0, "clicks": 0},
        {"channel": "facebook", "spend": 0, "revenue": 0, "impressions": 0, "clicks": 0},
        {"channel": "google_display", "spend": 0, "revenue": 0, "impressions": 0, "clicks": 0},
        {"channel": "instagram", "spend": 0, "revenue": 0, "impressions": 0, "clicks": 0}
    ]
    
    campaigns = db.query(Campaign).all()
    total_spend = sum(c.spent_amount or 0 for c in campaigns)
    total_revenue = sum(c.revenue_generated or 0 for c in campaigns)
    total_impressions = sum(c.impressions or 0 for c in campaigns)
    total_clicks = sum(c.clicks or 0 for c in campaigns)
    
    for ch in channels_data:
        ch["spend"] = total_spend / 4
        ch["revenue"] = total_revenue / 4
        ch["impressions"] = total_impressions // 4
        ch["clicks"] = total_clicks // 4
        ch["roas"] = (total_revenue / total_spend) if total_spend > 0 else 0
    
    return {"channels": channels_data}

@router.get("/v1/analytics/brand-comparison")
async def brand_comp_v1(date_range: str = "last_30_days", db: Session = Depends(get_db)):
    brands = db.query(Organization).filter(Organization.dashboard_type != 'master').all()
    result = []
    for brand in brands:
        campaigns = db.query(Campaign).filter(Campaign.organization_id == brand.id).all()
        spend = sum(c.spent_amount or 0 for c in campaigns)
        revenue = sum(c.revenue_generated or 0 for c in campaigns)
        result.append({
            "brand": brand.name,
            "spend": spend,
            "revenue": revenue,
            "impressions": sum(c.impressions or 0 for c in campaigns),
            "purchases": sum(c.conversions or 0 for c in campaigns),
            "roas": (revenue / spend) if spend > 0 else 0,
            "ctr": 0
        })
    return {"brands": result}
