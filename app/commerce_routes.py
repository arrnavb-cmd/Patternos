from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from app.database import get_db
import sqlite3
from typing import Optional
import json

router = APIRouter(prefix="/api/v1/commerce", tags=["commerce"])

def get_sqlite_db():
    conn = sqlite3.connect('intent_intelligence.db')
    conn.row_factory = sqlite3.Row
    return conn

@router.get("/dashboard")
async def get_commerce_dashboard(
    clientId: str = "zepto",
    channel: Optional[str] = None,
    brand: Optional[str] = None
):
    """Get unified commerce dashboard with real attribution data"""
    
    conn = get_sqlite_db()
    cursor = conn.cursor()
    
    # Total metrics
    cursor.execute("""
        SELECT 
            COUNT(*) as total_purchases,
            SUM(total_amount) as total_revenue,
            SUM(CASE WHEN attributed_to_ad = 1 THEN total_amount ELSE 0 END) as attributed_revenue,
            SUM(CASE WHEN attributed_to_ad = 1 THEN 1 ELSE 0 END) as attributed_purchases
        FROM purchases
        WHERE client_id = ?
    """, (clientId,))
    
    totals = dict(cursor.fetchone())
    
    # Ad spend by brand
    cursor.execute("""
        SELECT brand, SUM(spent) as total_spend
        FROM ad_campaigns
        WHERE client_id = ? AND status = 'active'
        GROUP BY brand
    """, (clientId,))
    
    spend_by_brand = {row['brand']: row['total_spend'] for row in cursor.fetchall()}
    
    # Revenue by brand (attributed)
    cursor.execute("""
        SELECT 
            ad_brand as brand,
            COUNT(*) as purchases,
            SUM(total_amount) as revenue,
            ad_channel as channel
        FROM purchases
        WHERE client_id = ? AND attributed_to_ad = 1
        GROUP BY ad_brand, ad_channel
    """, (clientId,))
    
    revenue_data = cursor.fetchall()
    
    # Build brand performance
    brand_performance = {}
    for row in revenue_data:
        brand = row['brand']
        if brand not in brand_performance:
            brand_performance[brand] = {
                'brand': brand,
                'spend': spend_by_brand.get(brand, 0),
                'revenue': 0,
                'purchases': 0,
                'channels': {}
            }
        
        brand_performance[brand]['revenue'] += row['revenue']
        brand_performance[brand]['purchases'] += row['purchases']
        brand_performance[brand]['channels'][row['channel']] = row['revenue']
    
    # Calculate ROAS
    for brand, data in brand_performance.items():
        if data['spend'] > 0:
            data['roas'] = round(data['revenue'] / data['spend'], 2)
        else:
            data['roas'] = 0
    
    # Get impressions and clicks
    cursor.execute("""
        SELECT 
            brand,
            channel,
            COUNT(*) as impressions,
            SUM(clicked) as clicks
        FROM ad_impressions
        WHERE client_id = ?
        GROUP BY brand, channel
    """, (clientId,))
    
    impression_data = {}
    for row in cursor.fetchall():
        key = f"{row['brand']}_{row['channel']}"
        impression_data[key] = {
            'impressions': row['impressions'],
            'clicks': row['clicks']
        }
    
    # Add impression data to brand performance
    for brand, data in brand_performance.items():
        total_impressions = 0
        total_clicks = 0
        for channel in data['channels'].keys():
            key = f"{brand}_{channel}"
            if key in impression_data:
                total_impressions += impression_data[key]['impressions']
                total_clicks += impression_data[key]['clicks']
        
        data['impressions'] = total_impressions
        data['clicks'] = total_clicks
        data['ctr'] = round((total_clicks / total_impressions * 100), 2) if total_impressions > 0 else 0
        data['conversion_rate'] = round((data['purchases'] / total_clicks * 100), 2) if total_clicks > 0 else 0
    
    conn.close()
    
    return {
        'summary': {
            'totalRevenue': totals['total_revenue'],
            'attributedRevenue': totals['attributed_revenue'],
            'organicRevenue': totals['total_revenue'] - totals['attributed_revenue'],
            'totalPurchases': totals['total_purchases'],
            'attributedPurchases': totals['attributed_purchases'],
            'attributionRate': round(totals['attributed_purchases'] / totals['total_purchases'] * 100, 1) if totals['total_purchases'] > 0 else 0
        },
        'brands': list(brand_performance.values())
    }


@router.get("/attribution/by-channel")
async def get_attribution_by_channel(clientId: str = "zepto"):
    """Get revenue attribution breakdown by channel"""
    
    conn = get_sqlite_db()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT 
            ad_channel as channel,
            COUNT(*) as purchases,
            SUM(total_amount) as revenue,
            COUNT(DISTINCT user_id) as unique_users
        FROM purchases
        WHERE client_id = ? AND attributed_to_ad = 1
        GROUP BY ad_channel
        ORDER BY revenue DESC
    """, (clientId,))
    
    results = [dict(row) for row in cursor.fetchall()]
    
    # Get impressions by channel
    cursor.execute("""
        SELECT 
            channel,
            COUNT(*) as impressions,
            SUM(clicked) as clicks
        FROM ad_impressions
        WHERE client_id = ?
        GROUP BY channel
    """, (clientId,))
    
    impression_map = {row['channel']: dict(row) for row in cursor.fetchall()}
    
    # Combine data
    for item in results:
        channel = item['channel']
        if channel in impression_map:
            item['impressions'] = impression_map[channel]['impressions']
            item['clicks'] = impression_map[channel]['clicks']
            item['ctr'] = round((item['clicks'] / item['impressions'] * 100), 2) if item['impressions'] > 0 else 0
            item['conversion_rate'] = round((item['purchases'] / item['clicks'] * 100), 2) if item['clicks'] > 0 else 0
    
    conn.close()
    
    return {'channels': results}


@router.get("/campaigns")
async def get_campaigns(clientId: str = "zepto", brand: Optional[str] = None):
    """Get all campaigns with performance metrics"""
    
    conn = get_sqlite_db()
    cursor = conn.cursor()
    
    query = "SELECT * FROM ad_campaigns WHERE client_id = ?"
    params = [clientId]
    
    if brand:
        query += " AND brand = ?"
        params.append(brand)
    
    cursor.execute(query, params)
    campaigns = [dict(row) for row in cursor.fetchall()]
    
    # Get performance for each campaign
    for campaign in campaigns:
        # Get revenue
        cursor.execute("""
            SELECT 
                COUNT(*) as purchases,
                SUM(total_amount) as revenue
            FROM purchases
            WHERE ad_campaign_id = ? AND attributed_to_ad = 1
        """, (campaign['campaign_id'],))
        
        perf = dict(cursor.fetchone())
        campaign['purchases'] = perf['purchases']
        campaign['revenue'] = perf['revenue'] or 0
        campaign['roas'] = round(campaign['revenue'] / campaign['spent'], 2) if campaign['spent'] > 0 else 0
        
        # Parse JSON fields
        campaign['channels'] = json.loads(campaign['channels']) if campaign['channels'] else []
        campaign['target_categories'] = json.loads(campaign['target_categories']) if campaign['target_categories'] else []
        campaign['target_locations'] = json.loads(campaign['target_locations']) if campaign['target_locations'] else []
    
    conn.close()
    
    return {'campaigns': campaigns}

@router.get("/platform-revenue")
async def get_platform_revenue(clientId: str = "zepto"):
    """Calculate Zepto's platform revenue"""
    
    conn = get_sqlite_db()
    cursor = conn.cursor()
    
    # Get total ad spend (Zepto earns 10% fee)
    cursor.execute("""
        SELECT SUM(spent) as total_ad_spend
        FROM ad_campaigns
        WHERE client_id = ? AND status = 'active'
    """, (clientId,))
    
    result = cursor.fetchone()
    ad_spend = result['total_ad_spend'] if result and result['total_ad_spend'] else 0
    platform_ad_fee = ad_spend * 0.10  # 10% fee
    
    # Get high-intent attributed purchases (Zepto gets 20% share)
    cursor.execute("""
        SELECT SUM(p.total_amount) as high_intent_revenue
        FROM purchases p
        WHERE p.client_id = ? 
        AND p.attributed_to_ad = 1
    """, (clientId,))
    
    result2 = cursor.fetchone()
    high_intent_rev = result2['high_intent_revenue'] if result2 and result2['high_intent_revenue'] else 0
    platform_intent_share = high_intent_rev * 0.20  # 20% share
    
    conn.close()
    
    return {
        'totalAdSpend': ad_spend,
        'platformAdFee': platform_ad_fee,
        'platformAdFeeRate': 10,
        'highIntentRevenue': high_intent_rev,
        'platformIntentShare': platform_intent_share,
        'platformIntentShareRate': 20,
        'totalPlatformRevenue': platform_ad_fee + platform_intent_share
    }

@router.get("/master/dashboard-v2")
async def master_dashboard_v2():
    """Master dashboard with all metrics"""
    import sqlite3
    intent_db = sqlite3.connect('intent_intelligence.db')
    cursor = intent_db.cursor()
    
    # Get total GMV from purchases
    cursor.execute("SELECT SUM(total_amount) FROM purchases WHERE attributed_to_ad = 1")
    total_gmv = cursor.fetchone()[0] or 0
    
    # Get attributed revenue (70% of GMV)
    attributed_revenue = total_gmv * 0.7
    
    # Get user counts
    cursor.execute("SELECT COUNT(DISTINCT user_id) FROM user_events")
    users_tracked = cursor.fetchone()[0] or 0
    
    cursor.execute("SELECT COUNT(DISTINCT user_id) FROM intent_scores WHERE intent_score >= 0.7")
    high_intent_users = cursor.fetchone()[0] or 0
    
    intent_db.close()
    
    # Platform revenue = 7% of attributed revenue
    platform_revenue = attributed_revenue * 0.07
    
    return {
        "total_gmv": total_gmv,
        "attributed_revenue": attributed_revenue,
        "users_tracked": users_tracked,
        "high_intent_users": high_intent_users,
        "platform_revenue": platform_revenue
    }

@router.get("/master/platform-revenue")
async def master_platform_revenue():
    """Platform revenue breakdown"""
    import sqlite3
    intent_db = sqlite3.connect('intent_intelligence.db')
    cursor = intent_db.cursor()
    
    cursor.execute("SELECT SUM(total_amount) FROM purchases WHERE attributed_to_ad = 1")
    total_gmv = cursor.fetchone()[0] or 0
    intent_db.close()
    
    attributed_revenue = total_gmv * 0.7
    platform_revenue = attributed_revenue * 0.07
    
    return {
        "monthly_retainer": platform_revenue * 0.4,
        "ad_commission": platform_revenue * 0.6,
        "high_intent_premium": 0,
        "total_revenue": platform_revenue
    }

@router.get("/master/brand-performance-v2")
async def master_brand_performance_v2():
    """Top 5 brands by revenue"""
    import sqlite3
    from collections import defaultdict
    
    intent_db = sqlite3.connect('intent_intelligence.db')
    cursor = intent_db.cursor()
    
    cursor.execute("""
        SELECT brand, SUM(total_amount) as revenue, COUNT(*) as purchases
        FROM purchases 
        WHERE attributed_to_ad = 1 AND brand IS NOT NULL
        GROUP BY brand
        ORDER BY revenue DESC
        LIMIT 5
    """)
    
    brands = []
    for row in cursor.fetchall():
        brands.append({
            "brand": row[0],
            "ad_spend": 0,
            "revenue": row[1],
            "roas": 0,
            "purchases": row[2],
            "ctr": 0,
            "conv_rate": 0,
            "channels": {"zepto": row[1]}
        })
    
    intent_db.close()
    return brands
