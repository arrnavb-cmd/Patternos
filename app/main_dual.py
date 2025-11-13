from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_business_db():
    return sqlite3.connect("patternos.db")

def get_intent_db():
    return sqlite3.connect("intent_intelligence.db")

@app.get("/")
async def root():
    return {"status": "ok", "databases": ["patternos.db", "intent_intelligence.db"]}

@app.get("/api/master/dashboard-v2")
async def dashboard(clientId: str = "zepto"):
    intent_db = get_intent_db()
    business_db = get_business_db()
    
    intent_cursor = intent_db.cursor()
    business_cursor = business_db.cursor()
    
    # Get GMV from intent database
    intent_cursor.execute("SELECT COALESCE(SUM(total_amount), 0) FROM purchases WHERE attributed_to_ad = 1")
    total_gmv = intent_cursor.fetchone()[0]
    
    # Get users from intent database
    intent_cursor.execute("SELECT COUNT(DISTINCT user_id) FROM user_events WHERE client_id = 'zepto'")
    users = intent_cursor.fetchone()[0]
    
    # Get high intent users from intent database
    intent_cursor.execute("SELECT COUNT(DISTINCT user_id) FROM intent_scores WHERE intent_score >= 0.7 AND client_id = 'zepto'")
    high_intent = intent_cursor.fetchone()[0]
    
    # Get campaign spend from business database
    business_cursor.execute("SELECT COALESCE(SUM(total_spent), 0) FROM campaigns WHERE is_active = 1")
    total_ad_spend = business_cursor.fetchone()[0]
    
    # Get Zepto's contract value from business database
    business_cursor.execute("SELECT annual_contract_value FROM organizations WHERE slug = 'zepto'")
    result = business_cursor.fetchone()
    annual_contract = result[0] if result else 5000000
    
    intent_db.close()
    business_db.close()
    
    attributed_revenue = total_gmv * 0.7
    monthly_retainer = annual_contract / 12
    ad_commission = total_ad_spend * 0.10
    platform_revenue = monthly_retainer + ad_commission
    
    return {
        "total_gmv": round(total_gmv, 2),
        "attributed_revenue": round(attributed_revenue, 2),
        "users_tracked": users,
        "high_intent_users": high_intent,
        "platform_revenue": round(platform_revenue, 2),
        "monthly_retainer": round(monthly_retainer, 2),
        "ad_spend": round(total_ad_spend, 2)
    }

@app.get("/api/master/brand-performance-v2")
async def brands(clientId: str = "zepto"):
    intent_db = get_intent_db()
    business_db = get_business_db()
    
    business_cursor = business_db.cursor()
    
    # Get brands from business database
    business_cursor.execute("""
        SELECT id, name, slug, annual_contract_value
        FROM organizations 
        WHERE dashboard_type = 'BRAND' AND is_active = 1
        ORDER BY annual_contract_value DESC
        LIMIT 10
    """)
    
    brands = []
    for row in business_cursor.fetchall():
        org_id, name, slug, acv = row
        
        # Get campaign data for this brand
        business_cursor.execute("""
            SELECT 
                COALESCE(SUM(total_spent), 0),
                COALESCE(SUM(total_impressions), 0),
                COALESCE(SUM(total_clicks), 0),
                COALESCE(SUM(total_revenue), 0)
            FROM campaigns 
            WHERE organization_id = ? AND is_active = 1
        """, (org_id,))
        
        camp = business_cursor.fetchone()
        spent = float(camp[0]) if camp[0] > 0 else 1000000
        impressions = int(camp[1]) if camp[1] > 0 else 200000
        clicks = int(camp[2]) if camp[2] > 0 else 6000
        revenue = float(camp[3]) if camp[3] > 0 else spent * 3.2
        
        brands.append({
            "name": name,
            "impressions": impressions,
            "clicks": clicks,
            "spent": round(spent, 2),
            "revenue": round(revenue, 2),
            "roas": round(revenue / spent, 2) if spent > 0 else 3.2,
            "conv_rate": round((clicks / impressions * 100) if impressions > 0 else 3.0, 2),
            "channels": {"Instagram": 45, "Facebook": 35, "Google": 20}
        })
    
    intent_db.close()
    business_db.close()
    
    return {"brands": brands}

@app.get("/api/master/intent-stats")
async def intent(clientId: str = "zepto"):
    return {"high": 353, "medium": 312, "low": 200}

@app.get("/api/master/platform-revenue")
async def platform_rev(clientId: str = "zepto"):
    return {"monthly_retainer": 416666, "total": 416666}

@app.get("/api/master/revenue-opportunities")
async def opps(clientId: str = "zepto"):
    return {"opportunities": []}

@app.get("/api/master/brand/{brand}/metrics")
async def brand_metrics(brand: str):
    return {"revenue": 125000, "impressions": 500000, "clicks": 25000, "roas": 3.5}

@app.post("/api/auth/login")
async def login():
    return {"token": "ok", "user": {"name": "Admin"}}

@app.get("/api/organizations/{org}")
async def org(org: str):
    return {"id": org, "name": org}

@app.get("/api/campaigns")
async def campaigns():
    return {"campaigns": []}
