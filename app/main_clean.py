from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import os

app = FastAPI()
DB_PATH = "intent_intelligence.db"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

@app.get("/")
async def root():
    return {"status": "ok"}

@app.get("/api/master/dashboard-v2")
async def dashboard(clientId: str = "zepto"):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT COALESCE(SUM(total_amount), 0) FROM purchases WHERE attributed_to_ad = 1")
    total_gmv = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(DISTINCT user_id) FROM user_events WHERE client_id = 'zepto'")
    users = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(DISTINCT user_id) FROM intent_scores WHERE intent_score >= 0.7 AND client_id = 'zepto'")
    high_intent = cursor.fetchone()[0]
    
    conn.close()
    
    return {
        "total_gmv": round(total_gmv, 2),
        "attributed_revenue": round(total_gmv * 0.7, 2),
        "users_tracked": users,
        "high_intent_users": high_intent,
        "platform_revenue": round(total_gmv * 0.049, 2)
    }

@app.get("/api/master/brand-performance-v2")
async def brands(clientId: str = "zepto"):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT brand, COUNT(*) as impr, SUM(clicked) as clicks
        FROM ad_impressions 
        WHERE client_id = 'zepto'
        GROUP BY brand
        LIMIT 10
    """)
    
    brands = []
    for row in cursor.fetchall():
        spent = 1000000
        revenue = spent * 3.2
        brands.append({
            "name": row[0],
            "impressions": row[1],
            "clicks": row[2],
            "spent": spent,
            "revenue": revenue,
            "roas": 3.2,
            "conv_rate": round((row[2] / row[1] * 100) if row[1] > 0 else 0, 2),
            "channels": {"Instagram": 45, "Facebook": 35, "Google": 20}
        })
    
    conn.close()
    return {"brands": brands}

@app.get("/api/master/intent-stats")
async def intent(clientId: str = "zepto"):
    conn = sqlite3.connect("intent_intelligence.db")
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(DISTINCT user_id) FROM user_events WHERE client_id = 'zepto'")
    total_users = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(DISTINCT user_id) FROM intent_scores WHERE intent_score >= 0.7 AND client_id = 'zepto'")
    high_intent = cursor.fetchone()[0]
    
    conn.close()
    
    return {
        "totalUsers": total_users,
        "intentDistribution": {
            "high": high_intent,
            "medium": 312,
            "low": 200
        }
    }

@app.get("/api/master/platform-revenue")
async def platform_rev(clientId: str = "zepto"):
    intent_db = sqlite3.connect("intent_intelligence.db")
    business_db = sqlite3.connect("patternos.db")
    
    intent_cursor = intent_db.cursor()
    business_cursor = business_db.cursor()
    
    # Get total GMV
    intent_cursor.execute("SELECT COALESCE(SUM(total_amount), 0) FROM purchases WHERE attributed_to_ad = 1")
    total_gmv = intent_cursor.fetchone()[0]
    
    # Get campaign spend
    business_cursor.execute("SELECT COALESCE(SUM(total_spent), 0) FROM campaigns WHERE is_active = 1")
    total_ad_spend = business_cursor.fetchone()[0]
    
    # Get annual contract
    business_cursor.execute("SELECT annual_contract_value FROM organizations WHERE slug = 'zepto'")
    result = business_cursor.fetchone()
    annual_contract = result[0] if result else 5000000
    
    intent_db.close()
    business_db.close()
    
    monthly_retainer = annual_contract / 12
    ad_commission = total_ad_spend * 0.10
    high_intent_premium = (total_gmv * 0.7) * 0.20
    total_revenue = monthly_retainer + ad_commission + high_intent_premium
    
    return {
        "monthly_retainer": round(monthly_retainer, 2),
        "ad_commission": round(ad_commission, 2),
        "high_intent_premium": round(high_intent_premium, 2),
        "total_revenue": round(total_revenue, 2),
        "total_ad_spend": round(total_ad_spend, 2),
        "high_intent_campaign_spend": round(total_ad_spend * 0.6, 2)
    }

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
    conn = sqlite3.connect("patternos.db")
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, name, campaign_code, status, total_spent, total_revenue, 
               total_impressions, total_clicks, total_conversions
        FROM campaigns 
        WHERE is_active = 1
        ORDER BY total_revenue DESC
        LIMIT 20
    """)
    
    campaigns_list = []
    for row in cursor.fetchall():
        campaigns_list.append({
            "id": row[0],
            "name": row[1],
            "code": row[2],
            "status": row[3],
            "spent": float(row[4]) if row[4] else 0,
            "revenue": float(row[5]) if row[5] else 0,
            "impressions": int(row[6]) if row[6] else 0,
            "clicks": int(row[7]) if row[7] else 0,
            "conversions": int(row[8]) if row[8] else 0
        })
    
    conn.close()
    return campaigns_list
