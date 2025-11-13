import sqlite3

# Test if the database queries work
conn = sqlite3.connect("intent_intelligence.db")
cursor = conn.cursor()

try:
    print("Testing dashboard-v2 query...")
    cursor.execute("SELECT SUM(total_amount) FROM purchases WHERE attributed_to_ad = 1")
    result = cursor.fetchone()[0]
    print(f"✅ Query works! Result: {result}")
except Exception as e:
    print(f"❌ Query failed: {e}")

try:
    cursor.execute("SELECT COUNT(DISTINCT user_id) FROM user_events")
    result = cursor.fetchone()[0]
    print(f"✅ User events query works! Result: {result}")
except Exception as e:
    print(f"❌ User events query failed: {e}")

try:
    cursor.execute("SELECT COUNT(DISTINCT user_id) FROM intent_scores WHERE intent_score >= 0.7")
    result = cursor.fetchone()[0]
    print(f"✅ Intent scores query works! Result: {result}")
except Exception as e:
    print(f"❌ Intent scores query failed: {e}")

conn.close()
