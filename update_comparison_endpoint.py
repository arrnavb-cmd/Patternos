# Read the current intent_routes file
with open('app/intent_routes.py', 'r') as f:
    content = f.read()

# Find and replace the analytics/comparison endpoint
old_endpoint = '''@router.get("/analytics/comparison")
async def get_analytics_comparison(
    clientId: str = "zepto",
    compareBy: str = "location"
):
    """Get analytics comparison by location or category"""
    conn = get_sqlite_db()
    cursor = conn.cursor()
    
    if compareBy == "location":
        cursor.execute("""
            SELECT 
                location as dimension,
                COUNT(DISTINCT user_id) as userCount,
                COUNT(*) as eventCount,
                AVG(intent_score) as avgIntentScore,
                COUNT(DISTINCT CASE WHEN intent_score >= 0.7 THEN user_id END) as highIntentUsers
            FROM intent_scores
            WHERE client_id = ? AND location IS NOT NULL
            GROUP BY location
            ORDER BY userCount DESC
        """, (clientId,))
    elif compareBy == "category":
        cursor.execute("""
            SELECT 
                category as dimension,
                COUNT(DISTINCT user_id) as userCount,
                COUNT(*) as eventCount,
                AVG(intent_score) as avgIntentScore,
                COUNT(DISTINCT CASE WHEN intent_score >= 0.7 THEN user_id END) as highIntentUsers
            FROM intent_scores
            WHERE client_id = ? AND category IS NOT NULL
            GROUP BY category
            ORDER BY userCount DESC
        """, (clientId,))
    else:
        return {'compareBy': compareBy, 'data': []}
    
    results = []
    for row in cursor.fetchall():
        results.append({
            'dimension': row[0],
            'userCount': row[1],
            'eventCount': row[2],
            'avgIntentScore': round(row[3], 2) if row[3] else 0,
            'highIntentUsers': row[4]
        })
    
    conn.close()
    
    return {
        'compareBy': compareBy,
        'data': results
    }'''

new_endpoint = '''@router.get("/analytics/comparison")
async def get_analytics_comparison(
    clientId: str = "zepto",
    compareBy: str = "location"
):
    """Get analytics comparison by location or category with products sold"""
    import json
    conn = get_sqlite_db()
    cursor = conn.cursor()
    
    results = []
    
    if compareBy == "location":
        # Get location stats
        cursor.execute("""
            SELECT 
                location,
                COUNT(*) as purchases,
                SUM(total_amount) as revenue
            FROM purchases
            WHERE client_id = ? AND location IS NOT NULL
            GROUP BY location
            ORDER BY revenue DESC
        """, (clientId,))
        
        for row in cursor.fetchall():
            location = row[0]
            
            # Get top products in this location
            cursor.execute("""
                SELECT items, COUNT(*) as count
                FROM purchases
                WHERE client_id = ? AND location = ?
                GROUP BY items
                ORDER BY count DESC
                LIMIT 5
            """, (clientId, location))
            
            top_products = []
            for prod_row in cursor.fetchall():
                try:
                    items = json.loads(prod_row[0])
                    if items and len(items) > 0:
                        top_products.append(items[0].get('product_name', 'Unknown'))
                except:
                    pass
            
            results.append({
                'dimension': location,
                'purchases': row[1],
                'revenue': row[2],
                'topProducts': top_products[:3]
            })
    
    elif compareBy == "category":
        # Get category stats
        cursor.execute("""
            SELECT 
                category,
                COUNT(*) as purchases,
                SUM(total_amount) as revenue
            FROM purchases
            WHERE client_id = ? AND category IS NOT NULL
            GROUP BY category
            ORDER BY revenue DESC
        """, (clientId,))
        
        for row in cursor.fetchall():
            category = row[0]
            
            # Get top products in this category
            cursor.execute("""
                SELECT items, COUNT(*) as count
                FROM purchases
                WHERE client_id = ? AND category = ?
                GROUP BY items
                ORDER BY count DESC
                LIMIT 5
            """, (clientId, category))
            
            top_products = []
            for prod_row in cursor.fetchall():
                try:
                    items = json.loads(prod_row[0])
                    if items and len(items) > 0:
                        top_products.append(items[0].get('product_name', 'Unknown'))
                except:
                    pass
            
            results.append({
                'dimension': category,
                'purchases': row[1],
                'revenue': row[2],
                'topProducts': top_products[:3]
            })
    
    conn.close()
    
    return {
        'compareBy': compareBy,
        'data': results
    }'''

content = content.replace(old_endpoint, new_endpoint)

with open('app/intent_routes.py', 'w') as f:
    f.write(content)

print("✅ Updated comparison endpoint to include products!")
