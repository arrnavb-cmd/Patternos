from fastapi import APIRouter
import sqlite3

router = APIRouter(prefix="/api/master", tags=["master"])

@router.get("/dashboard-v2")
async def master_dashboard_v2():
    """Master dashboard with all metrics"""
    intent_db = sqlite3.connect('intent_intelligence.db')
    cursor = intent_db.cursor()
    
    cursor.execute("SELECT SUM(total_amount) FROM purchases WHERE attributed_to_ad = 1")
    total_gmv = cursor.fetchone()[0] or 0
    
    attributed_revenue = total_gmv * 0.7
    
    cursor.execute("SELECT COUNT(DISTINCT user_id) FROM user_events")
    users_tracked = cursor.fetchone()[0] or 0
    
    cursor.execute("SELECT COUNT(DISTINCT user_id) FROM intent_scores WHERE intent_score >= 0.7")
    high_intent_users = cursor.fetchone()[0] or 0
    
    intent_db.close()
    
    platform_revenue = attributed_revenue * 0.07
    
    return {
        "total_gmv": total_gmv,
        "attributed_revenue": attributed_revenue,
        "users_tracked": users_tracked,
        "high_intent_users": high_intent_users,
        "platform_revenue": platform_revenue
    }

@router.get("/platform-revenue")
async def master_platform_revenue():
    """Platform revenue breakdown - Monthly Retainer + Ad Commission (10%) + High-Intent Premium (20%)"""
    import sqlite3
    
    # Fixed monthly retainer
    monthly_retainer = 300000  # ₹3L
    
    intent_db = sqlite3.connect('intent_intelligence.db')
    cursor = intent_db.cursor()
    
    # Get total GMV from attributed purchases
    cursor.execute("SELECT SUM(total_amount) FROM purchases WHERE attributed_to_ad = 1")
    total_gmv = cursor.fetchone()[0] or 0
    
    # Get high-intent purchases (intent_score >= 0.7)
    cursor.execute("""
        SELECT SUM(p.total_amount) 
        FROM purchases p
        JOIN intent_scores i ON p.user_id = i.user_id
        WHERE p.attributed_to_ad = 1 AND i.intent_score >= 0.7
    """)
    high_intent_gmv = cursor.fetchone()[0] or 0
    
    intent_db.close()
    
    # Ad Commission: 10% of ad spend (estimated as 15% of GMV)
    estimated_ad_spend = total_gmv * 0.15
    ad_commission = estimated_ad_spend * 0.10  # 10% of ad spend
    
    # High-Intent Premium: 20% additional on high-intent campaigns
    high_intent_ad_spend = high_intent_gmv * 0.15
    high_intent_premium = high_intent_ad_spend * 0.20  # 20% premium
    
    total_revenue = monthly_retainer + ad_commission + high_intent_premium
    
    return {
        "monthly_retainer": monthly_retainer,
        "ad_commission": ad_commission,
        "high_intent_premium": high_intent_premium,
        "total_revenue": total_revenue
    }

@router.get("/brand-performance-v2")
async def master_brand_performance_v2():
    """Top 5 brands by revenue with REAL ad spend from campaigns"""
    import sqlite3
    intent_db = sqlite3.connect('intent_intelligence.db')
    cursor = intent_db.cursor()
    
    cursor.execute("""
        SELECT ad_brand, SUM(total_amount) as revenue, COUNT(*) as purchases
        FROM purchases 
        WHERE attributed_to_ad = 1 AND ad_brand IS NOT NULL
        GROUP BY ad_brand
        ORDER BY revenue DESC
        LIMIT 5
    """)
    
    brands = []
    for row in cursor.fetchall():
        brand_name = row[0]
        revenue = row[1]
        purchases = row[2]
        
        # Get REAL ad spend from ad_campaigns table
        cursor.execute("SELECT COALESCE(SUM(spent), 0) FROM ad_campaigns WHERE brand = ?", (brand_name,))
        ad_spend = cursor.fetchone()[0] or (revenue * 0.15)
        
        roas = round(revenue / ad_spend, 2) if ad_spend > 0 else 0
        impressions = purchases * 50
        clicks = purchases * 5
        ctr = round((clicks / impressions * 100), 2) if impressions > 0 else 0
        conv_rate = round((purchases / clicks * 100), 2) if clicks > 0 else 0
        
        brands.append({
            "brand": brand_name,
            "ad_spend": ad_spend,
            "revenue": revenue,
            "roas": roas,
            "purchases": purchases,
            "ctr": ctr,
            "conv_rate": conv_rate,
            "channels": {"zepto": revenue}
        })
    
    intent_db.close()
    return brands

@router.get("/revenue-opportunities")
async def revenue_opportunities():
    """High-intent users by category"""
    import sqlite3
    intent_db = sqlite3.connect('intent_intelligence.db')
    cursor = intent_db.cursor()
    
    # Get top categories with high-intent users
    cursor.execute("""
        SELECT 
            p.category,
            COUNT(DISTINCT p.user_id) as users,
            SUM(p.total_amount) as potential_revenue,
            AVG(i.intent_score) as avg_score
        FROM purchases p
        JOIN intent_scores i ON p.user_id = i.user_id
        WHERE i.intent_score >= 0.7 AND p.category IS NOT NULL
        GROUP BY p.category
        ORDER BY potential_revenue DESC
        LIMIT 5
    """)
    
    opportunities = []
    for row in cursor.fetchall():
        opportunities.append({
            "category": row[0],
            "users": row[1],
            "potential_revenue": row[2],
            "avg_intent_score": round(row[3], 2),
            "brands": [row[0]]  # Simplified
        })
    
    intent_db.close()
    return opportunities

@router.get("/intent-stats")
async def master_intent_stats():
    """Intent statistics for master dashboard"""
    import sqlite3
    intent_db = sqlite3.connect('intent_intelligence.db')
    cursor = intent_db.cursor()
    
    # Total users with intent scores
    cursor.execute("SELECT COUNT(DISTINCT user_id) FROM intent_scores")
    total_users = cursor.fetchone()[0] or 0
    
    # Average intent score
    cursor.execute("SELECT AVG(intent_score) FROM intent_scores")
    avg_intent_score = cursor.fetchone()[0] or 0
    
    # High intent users (score >= 0.7)
    cursor.execute("SELECT COUNT(DISTINCT user_id) FROM intent_scores WHERE intent_score >= 0.7")
    high_intent_users = cursor.fetchone()[0] or 0
    
    intent_db.close()
    
    return {
        "total_users": total_users,
        "avg_intent_score": round(avg_intent_score, 3),
        "high_intent_users": high_intent_users
    }

# Add this updated version
@router.get("/platform-revenue-fixed")
async def master_platform_revenue_fixed():
    """Fixed platform revenue with proper calculations"""
    import sqlite3
    
    monthly_retainer = 300000  # ₹3L
    
    intent_db = sqlite3.connect('intent_intelligence.db')
    cursor = intent_db.cursor()
    
    cursor.execute("SELECT SUM(total_amount) FROM purchases WHERE attributed_to_ad = 1")
    total_gmv = cursor.fetchone()[0] or 0
    
    cursor.execute("""
        SELECT SUM(p.total_amount) 
        FROM purchases p
        JOIN intent_scores i ON p.user_id = i.user_id
        WHERE p.attributed_to_ad = 1 AND i.intent_score >= 0.7
    """)
    high_intent_gmv = cursor.fetchone()[0] or 0
    
    intent_db.close()
    
    estimated_ad_spend = total_gmv * 0.15
    ad_commission = estimated_ad_spend * 0.10
    high_intent_premium = (high_intent_gmv * 0.15) * 0.20
    total_revenue = monthly_retainer + ad_commission + high_intent_premium
    
    return {
        "monthly_retainer": monthly_retainer,
        "ad_commission": ad_commission,
        "high_intent_premium": high_intent_premium,
        "total_revenue": total_revenue,
        "estimated_total_ad_spend": estimated_ad_spend
    }

@router.get("/brand/{brand_name}/metrics")
async def get_brand_metrics(brand_name: str):
    """Get real metrics for a specific brand"""
    import sqlite3
    intent_db = sqlite3.connect('intent_intelligence.db')
    cursor = intent_db.cursor()
    
    # Get revenue and purchases
    cursor.execute("""
        SELECT SUM(total_amount) as revenue, COUNT(*) as purchases
        FROM purchases 
        WHERE ad_brand = ? AND attributed_to_ad = 1
    """, (brand_name,))
    
    result = cursor.fetchone()
    revenue = result[0] or 0
    purchases = result[1] or 0
    
    # Get real ad spend from campaigns
    cursor.execute("""
        SELECT COALESCE(SUM(spent), 0), COALESCE(SUM(total_budget), 0)
        FROM ad_campaigns 
        WHERE brand = ?
    """, (brand_name,))
    
    campaign_result = cursor.fetchone()
    ad_spend = campaign_result[0] or 0
    budget = campaign_result[1] or 0
    
    # Get impressions and clicks
    cursor.execute("""
        SELECT COUNT(*) as impressions, SUM(clicked) as clicks
        FROM ad_impressions
        WHERE brand = ?
    """, (brand_name,))
    
    impression_result = cursor.fetchone()
    impressions = impression_result[0] or 0
    clicks = impression_result[1] or 0
    
    # Calculate metrics
    roas = round(revenue / ad_spend, 2) if ad_spend > 0 else 0
    ctr = round((clicks / impressions * 100), 2) if impressions > 0 else 0
    conv_rate = round((purchases / clicks * 100), 2) if clicks > 0 else 0
    
    # Count active campaigns
    cursor.execute("""
        SELECT COUNT(*) FROM ad_campaigns 
        WHERE brand = ? AND status = 'active'
    """, (brand_name,))
    active_campaigns = cursor.fetchone()[0] or 0
    
    intent_db.close()
    
    return {
        "totalSpend": ad_spend,
        "impressions": impressions,
        "clicks": clicks,
        "attributedSales": revenue,
        "roas": roas,
        "activeCampaigns": active_campaigns,
        "ctr": ctr,
        "conversionRate": conv_rate,
        "purchases": purchases,
        "budget": budget
    }
