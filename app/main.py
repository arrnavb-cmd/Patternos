from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import os

app = FastAPI(title="PatternOS API")


# Get absolute database path
DB_PATH = os.path.join(os.getcwd(), "intent_intelligence.db")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"service": "PatternOS API", "status": "operational", "db_exists": os.path.exists(DB_PATH)}

@app.get("/health")
async def health():
    return {"status": "healthy", "db": os.path.exists(DB_PATH)}

@app.get("/api/master/dashboard-v2")
async def master_dashboard_v2(clientId: str = "zepto"):
    try:
        conn = sqlite3.connect(DB_PATH, timeout=10)
        cursor = conn.cursor()
        
        cursor.execute("SELECT COALESCE(SUM(total_amount), 0) FROM purchases WHERE attributed_to_ad = 1")
        total_gmv = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(DISTINCT user_id) FROM user_events")
        users_tracked = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(DISTINCT user_id) FROM intent_scores WHERE intent_score >= 0.7")
        high_intent_users = cursor.fetchone()[0]
        
        conn.close()
        
        return {
            "total_gmv": round(total_gmv, 2),
            "attributed_revenue": round(total_gmv * 0.7, 2),
            "users_tracked": users_tracked,
            "high_intent_users": high_intent_users,
            "platform_revenue": round(total_gmv * 0.7 * 0.07, 2)
        }
    except Exception as e:
        return {"error": str(e), "total_gmv": 0}

@app.get("/api/master/intent-stats")
async def intent_stats():
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(DISTINCT user_id) FROM intent_scores")
        total = cursor.fetchone()[0]
        
        cursor.execute("SELECT intent_level, COUNT(*) as count FROM intent_scores GROUP BY intent_level")
        results = cursor.fetchall()
        conn.close()
        
        dist = {"high": 0, "medium": 0, "low": 0}
        for level, count in results:
            if level:
                dist[level.lower()] = count
        
        return {
            "totalUsers": total,
            "intentDistribution": dist
        }
    except Exception as e:
        return {"totalUsers": 0, "intentDistribution": {"high": 0, "medium": 0, "low": 0}}

@app.get("/api/master/platform-revenue")
async def platform_revenue():
    try:
        import sqlite3
        conn = sqlite3.connect("patternos_campaign_data.db")
        cursor = conn.cursor()
        
        cursor.execute("SELECT SUM(spend_value) FROM ad_spend_daily")
        total_ad_spend = cursor.fetchone()[0] or 0
        
        cursor.execute("SELECT SUM(spend_value) FROM ad_spend_daily WHERE intent_level='High'")
        high_intent_spend = cursor.fetchone()[0] or 0
        
        cursor.execute("SELECT SUM(spend_value) FROM ad_spend_daily WHERE intent_level IN ('Medium', 'Low')")
        other_ad_spend = cursor.fetchone()[0] or 0
        
        conn.close()
        
        monthly_retainer = 300000
        high_intent_commission = high_intent_spend * 0.20
        other_commission = other_ad_spend * 0.10
        total_revenue = monthly_retainer + high_intent_commission + other_commission
        
        return {
            "monthly_retainer": round(monthly_retainer, 2),
            "total_ad_spend": round(total_ad_spend, 2),
            "high_intent_campaign_spend": round(high_intent_spend, 2),
            "high_intent_premium": round(high_intent_commission, 2),
            "other_ad_spend": round(other_ad_spend, 2),
            "other_commission": round(other_commission, 2), "ad_commission": round(other_commission, 2),
            "total": round(total_revenue, 2), "total_revenue": round(total_revenue, 2)
        }
    except Exception as e:
        return {"monthly_retainer": 300000, "total": 300000, "error": str(e)}

@app.get("/api/master/revenue-opportunities")
async def revenue_opportunities(minScore: float = 0.7):
    try:
        import sqlite3
        conn = sqlite3.connect("patternos_campaign_data.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT 
                category,
                SUM(spend_value) as revenue,
                COUNT(*) as campaigns,
                SUM(conversions) as conversions
            FROM ad_spend_daily
            GROUP BY category
            ORDER BY revenue DESC
        """)
        
        opportunities = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return {"opportunities": opportunities}
    except Exception as e:
        return {"opportunities": [], "error": str(e)}

@app.get("/api/master/brand-performance-v2")
async def brand_performance():
    try:
        import sqlite3
        conn = sqlite3.connect("patternos_campaign_data.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT 
                brand,
                SUM(spend_value) as revenue,
                COUNT(DISTINCT campaign_id) as campaigns,
                SUM(impressions) as impressions,
                SUM(clicks) as clicks,
                SUM(conversions) as orders
            FROM ad_spend_daily
            GROUP BY brand
            ORDER BY revenue DESC
            LIMIT 5
        """)
        
        brands = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return {"brands": brands}
    except Exception as e:
        return {"brands": [], "error": str(e)}
