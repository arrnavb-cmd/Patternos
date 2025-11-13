from fastapi import APIRouter, HTTPException
import sqlite3
from typing import Optional

router = APIRouter()
DW_DB = "patternos_dw.db"
INTENT_DB = "intent_intelligence.db"

@router.get("/api/customers/stats")
async def get_customer_stats(brand: Optional[str] = None):
    """Get customer statistics from dim_customer table"""
    try:
        conn = sqlite3.connect(DW_DB)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Total customers
        cursor.execute("SELECT COUNT(*) as total FROM dim_customer")
        total = cursor.fetchone()['total']
        
        # By platform
        cursor.execute("""
            SELECT platforms_list, COUNT(*) as count 
            FROM dim_customer 
            GROUP BY platforms_list 
            ORDER BY count DESC 
            LIMIT 10
        """)
        platforms = [dict(row) for row in cursor.fetchall()]
        
        # By city
        cursor.execute("""
            SELECT primary_city, COUNT(*) as count 
            FROM dim_customer 
            GROUP BY primary_city 
            ORDER BY count DESC 
            LIMIT 10
        """)
        cities = [dict(row) for row in cursor.fetchall()]
        
        # By age group
        cursor.execute("""
            SELECT primary_age_group, COUNT(*) as count 
            FROM dim_customer 
            GROUP BY primary_age_group 
            ORDER BY count DESC
        """)
        age_groups = [dict(row) for row in cursor.fetchall()]
        
        # Revenue
        cursor.execute("SELECT SUM(lifetime_value) as total_revenue FROM dim_customer")
        revenue = cursor.fetchone()['total_revenue']
        
        cursor.execute("SELECT AVG(avg_order_value) as avg_order FROM dim_customer")
        avg_order = cursor.fetchone()['avg_order']
        
        conn.close()
        
        return {
            "total_customers": total,
            "total_revenue": round(revenue, 2),
            "avg_order_value": round(avg_order, 2),
            "platforms": platforms,
            "cities": cities,
            "age_groups": age_groups
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/customers/by-brand/{brand}")
async def get_customers_by_brand(brand: str):
    """Get customers for specific brand from intent_scores"""
    try:
        conn = sqlite3.connect(INTENT_DB)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT 
                COUNT(DISTINCT user_id) as total_customers,
                AVG(intent_score) as avg_intent,
                SUM(CASE WHEN intent_level = 'High' THEN 1 ELSE 0 END) as high_intent_count
            FROM intent_scores
            WHERE platform = ?
        """, (brand.lower(),))
        
        stats = dict(cursor.fetchone())
        conn.close()
        
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/intent/high-users")
async def get_high_intent_users(platform: Optional[str] = None):
    """Get high intent users"""
    try:
        conn = sqlite3.connect(INTENT_DB)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        query = """
            SELECT user_id, platform, category, intent_score, 
                   intent_level, city, device, email
            FROM intent_scores
            WHERE intent_level = 'High'
        """
        
        if platform:
            query += " AND platform = ?"
            cursor.execute(query, (platform,))
        else:
            cursor.execute(query)
        
        users = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return {"high_intent_users": users, "count": len(users)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
