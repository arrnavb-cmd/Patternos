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
        import sqlite3
        conn = sqlite3.connect("intent_intelligence.db")
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(DISTINCT user_id) FROM intent_scores")
        total = cursor.fetchone()[0]
        
        cursor.execute("SELECT intent_level, COUNT(*) FROM intent_scores GROUP BY intent_level")
        results = cursor.fetchall()
        
        dist = {"high": 0, "medium": 0, "low": 0}
        for level, count in results:
            if level:
                dist[level.lower()] = count
        
        conn.close()
        return {"totalUsers": total, "intentDistribution": dist}
    except:
        return {"totalUsers": 0, "intentDistribution": {"high": 0, "medium": 0, "low": 0}}

@app.get("/api/master/platform-revenue")

@app.get("/api/master/platform-revenue")
async def platform_revenue(period: str = "monthly"):
    try:
        import sqlite3
        conn = sqlite3.connect("patternos_campaign_data.db")
        cursor = conn.cursor()
        
        cursor.execute("SELECT SUM(attributed_spend) FROM ad_attribution")
        total_attributed = cursor.fetchone()[0] or 0
        
        # Get max date and calculate period
        cursor.execute("SELECT MAX(date) FROM ad_spend_daily")
        max_date = cursor.fetchone()[0]
        
        if period == "monthly":
            days = 30
        elif period == "quarterly":
            days = 90
        elif period == "half-yearly":
            days = 180
        else:
            days = 365
        
        cursor.execute("SELECT SUM(spend_value) FROM ad_spend_daily WHERE intent_level='High' AND date >= date(?, '-' || ? || ' days')", (max_date, days))
        high_intent_spend = cursor.fetchone()[0] or 0
        
        cursor.execute("SELECT SUM(spend_value) FROM ad_spend_daily WHERE intent_level IN ('Medium', 'Low') AND date >= date(?, '-' || ? || ' days')", (max_date, days))
        other_spend = cursor.fetchone()[0] or 0
        
        conn.close()
        
        if period == "monthly":
            retainer = 300000
        elif period == "quarterly":
            retainer = 900000
        elif period == "half-yearly":
            retainer = 1800000
        else:
            retainer = 3600000
        
        high_commission = high_intent_spend * 0.20
        other_commission = other_spend * 0.10
        total_revenue = retainer + high_commission + other_commission
        
        return {
            "monthly_retainer": retainer,
            "total_ad_spend": high_intent_spend + other_spend,
            "high_intent_campaign_spend": high_intent_spend,
            "high_intent_premium": round(high_commission, 2),
            "other_ad_spend": other_spend,
            "other_commission": round(other_commission, 2),
            "ad_commission": round(other_commission, 2),
            "attributed_revenue": round(total_attributed, 2),
            "total": round(total_revenue, 2),
            "total_revenue": round(total_revenue, 2)
        }
    except Exception as e:
        return {"error": str(e), "total_revenue": 0}

@app.get("/api/master/revenue-opportunities")
async def revenue_opportunities(minScore: float = 0.7):
    try:
        import sqlite3
        conn = sqlite3.connect("intent_intelligence.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT 
                category,
                COUNT(DISTINCT user_id) as users,
                AVG(intent_score) as avg_intent_score,
                SUM(CASE WHEN intent_level='High' THEN 1 ELSE 0 END) as high_intent_users
            FROM intent_scores
            WHERE intent_score >= ?
            GROUP BY category
            ORDER BY high_intent_users DESC
        """, (minScore,))
        
        opportunities = []
        for row in cursor.fetchall():
            opp = dict(row)
            opp['potential_revenue'] = opp['high_intent_users'] * 2500
            opportunities.append(opp)
        
        conn.close()
        return {"opportunities": opportunities}
    except Exception as e:
        return {"opportunities": [], "error": str(e)}

@app.get("/api/master/brand-performance-v2")
async def brand_performance(period: str = "monthly"):
    try:
        import sqlite3
        conn = sqlite3.connect("patternos_campaign_data.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Get max date for period filtering
        cursor.execute("SELECT MAX(date) FROM ad_spend_daily")
        max_date = cursor.fetchone()[0]
        
        if period == "monthly":
            days = 30
        elif period == "quarterly":
            days = 90
        elif period == "half-yearly":
            days = 180
        else:
            days = 365
        
        # Get brand performance with SKU prices
        cursor.execute("""
            SELECT 
                a.brand,
                SUM(a.spend_value) as ad_spend,
                SUM(a.conversions * COALESCE(s.selling_price, 500)) as revenue,
                SUM(a.conversions) as purchases,
                SUM(a.clicks) as clicks,
                SUM(a.impressions) as impressions
            FROM ad_spend_daily a
            LEFT JOIN sku_library s ON a.sku_id = s.sku_id
            WHERE a.date >= date(?, '-' || ? || ' days')
            GROUP BY a.brand
            ORDER BY ad_spend DESC
            LIMIT 5
        """, (max_date, days))
        
        brands = []
        for row in cursor.fetchall():
            b = dict(row)
            # Calculate actual ROAS from revenue and ad spend
            b['roas'] = round(b['revenue'] / b['ad_spend'], 2) if b['ad_spend'] > 0 else 0
            b['ctr'] = round((b['clicks'] / b['impressions'] * 100), 2) if b['impressions'] > 0 else 0
            b['conv_rate'] = round((b['purchases'] / b['clicks'] * 100), 2) if b['clicks'] > 0 else 0
            brands.append(b)
        
        conn.close()
        return {"brands": brands}
    except Exception as e:
        return {"brands": [], "error": str(e)}
