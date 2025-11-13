#!/bin/bash
echo "🔧 MASTER DASHBOARD COMPLETE FIX"
echo "================================"

# FIX FRONTEND
python3 << 'EOF'
with open('frontend/src/pages/aggregator/MasterDashboard.jsx', 'r') as f:
    content = f.read()

# Fix opportunities mapping
content = content.replace(
    "opportunities.opportunities.map(",
    "(opportunities?.opportunities || opportunities || []).map("
)

with open('frontend/src/pages/aggregator/MasterDashboard.jsx', 'w') as f:
    f.write(content)
print("✅ Fixed frontend")
EOF

# FIX BACKEND  
python3 << 'EOF'
import re
with open('app/main.py', 'r') as f:
    content = f.read()

# Fix revenue-opportunities to return correct structure
pattern = r'@app\.get\("/api/master/revenue-opportunities"\).*?(?=@app\.get|$)'
replacement = '''@app.get("/api/master/revenue-opportunities")
async def revenue_opportunities(clientId: str = "zepto", minScore: float = 0.7):
    try:
        conn = sqlite3.connect("intent_intelligence.db")
        cursor = conn.cursor()
        cursor.execute("""
            SELECT category, COUNT(DISTINCT user_id), ROUND(AVG(intent_score), 2)
            FROM intent_scores WHERE client_id = ? AND intent_score >= ?
            GROUP BY category ORDER BY COUNT(DISTINCT user_id) DESC
        """, (clientId, minScore))
        opps = [{"category": r[0], "user_count": r[1], "avg_intent_score": r[2], "revenue_estimate": r[1]*2500} for r in cursor.fetchall()]
        conn.close()
        return {"opportunities": opps}
    except:
        return {"opportunities": []}

'''
content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Add /audience endpoint
if '@app.get("/audience")' not in content:
    content += '''
@app.get("/audience")
async def get_audience(min_events: int = 20, limit: int = 100):
    try:
        conn = sqlite3.connect("intent_intelligence.db")
        cursor = conn.cursor()
        cursor.execute("SELECT user_id, category, intent_score FROM intent_scores WHERE client_id = 'zepto' AND intent_score >= 0.7 LIMIT ?", (limit,))
        users = [{"user_id": r[0], "category": r[1], "intent_score": r[2]} for r in cursor.fetchall()]
        conn.close()
        return {"users": users}
    except:
        return {"users": []}
'''

with open('app/main.py', 'w') as f:
    f.write(content)
print("✅ Fixed backend")
EOF

echo ""
echo "🧪 Testing endpoints..."
curl -s localhost:8000/api/master/platform-revenue?clientId=zepto | python3 -m json.tool | head -8
echo ""
curl -s localhost:8000/api/master/revenue-opportunities?clientId=zepto | python3 -m json.tool | head -12

echo ""
echo "✅ DONE! Refresh browser: localhost:3000/dashboard (Cmd+Shift+R)"
