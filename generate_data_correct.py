import sqlite3
import random
from datetime import datetime, timedelta

print("🚀 Starting data generation with correct schema...")

conn = sqlite3.connect("intent_intelligence.db")
cursor = conn.cursor()

# Generate 20,000 user IDs
print("\n📊 Preparing 20,000 users...")
user_ids = [f"user_{i+1000:06d}" for i in range(20000)]

# Generate 100,000 purchases
print("\n💰 Generating 100,000 purchases...")
categories = ['Electronics', 'Fashion', 'Groceries', 'Home', 'Beauty', 'Sports']
products = ['Product_A', 'Product_B', 'Product_C', 'Product_D', 'Product_E']
batch_size = 5000

for i in range(0, 100000, batch_size):
    purchases = []
    for j in range(batch_size):
        user_id = random.choice(user_ids)
        product_id = random.choice(products)
        category = random.choice(categories)
        amount = round(random.uniform(500, 5000), 2)
        attributed = 1 if random.random() > 0.3 else 0
        campaign_id = random.randint(1, 15)
        timestamp = (datetime.now() - timedelta(days=random.randint(0, 90))).strftime('%Y-%m-%d %H:%M:%S')
        
        purchases.append((user_id, product_id, f"Product {j%100}", category, amount, attributed, campaign_id, timestamp, 'zepto'))
    
    cursor.executemany("""
        INSERT INTO purchases (user_id, product_id, product_name, category, total_amount, attributed_to_ad, campaign_id, timestamp, client_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, purchases)
    
    print(f"  ✓ Generated {i+batch_size} purchases...")
    conn.commit()

# Generate user_events for 20,000 users
print("\n📱 Generating 50,000 user events...")
event_types = ['view', 'click', 'add_to_cart', 'search', 'wishlist']

for i in range(0, 50000, batch_size):
    events = []
    for j in range(batch_size):
        user_id = random.choice(user_ids)
        event = random.choice(event_types)
        category = random.choice(categories)
        product_id = random.choice(products)
        timestamp = (datetime.now() - timedelta(days=random.randint(0, 90))).strftime('%Y-%m-%d %H:%M:%S')
        
        events.append(('zepto', user_id, event, category, product_id, timestamp, '{}'))
    
    cursor.executemany("""
        INSERT INTO user_events (client_id, user_id, event_type, category, product_id, timestamp, metadata)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, events)
    
    if (i+batch_size) % 10000 == 0:
        print(f"  ✓ Generated {i+batch_size} events...")
    conn.commit()

# Generate intent_scores for all 20,000 users
print("\n🎯 Generating intent scores for 20,000 users...")
for i in range(0, 20000, batch_size):
    scores = []
    for j in range(min(batch_size, 20000-i)):
        user_id = user_ids[i+j]
        intent_score = round(random.uniform(0.1, 0.95), 3)
        
        if intent_score >= 0.7:
            level = 'high'
        elif intent_score >= 0.4:
            level = 'medium'
        else:
            level = 'low'
        
        last_activity = (datetime.now() - timedelta(days=random.randint(0, 30))).strftime('%Y-%m-%d %H:%M:%S')
        category = random.choice(categories)
        
        scores.append(('zepto', user_id, category, intent_score, level, last_activity, 
                      random.randint(5, 50), random.randint(300, 3000), 
                      random.randint(0, 10), random.randint(1, 20),
                      f"{user_id}@example.com", random.choice(['mobile', 'desktop', 'tablet']),
                      random.choice(['Mumbai', 'Delhi', 'Bangalore', 'Chennai'])))
    
    cursor.executemany("""
        INSERT INTO intent_scores (client_id, user_id, category, intent_score, intent_level, last_activity,
                                   page_views, time_spent, cart_additions, search_queries, email, device_type, location)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, scores)
    
    print(f"  ✓ Generated {i+len(scores)} intent scores...")
    conn.commit()

conn.close()

print("\n✅ Data generation complete!")
print("📈 Final counts:")
cursor = sqlite3.connect("intent_intelligence.db").cursor()
cursor.execute("SELECT COUNT(*) FROM purchases")
print(f"   - Purchases: {cursor.fetchone()[0]:,}")
cursor.execute("SELECT COUNT(*) FROM user_events")
print(f"   - User Events: {cursor.fetchone()[0]:,}")
cursor.execute("SELECT COUNT(*) FROM intent_scores")
print(f"   - Intent Scores: {cursor.fetchone()[0]:,}")
cursor.execute("SELECT COUNT(DISTINCT user_id) FROM intent_scores WHERE intent_score >= 0.7")
print(f"   - High-intent users: {cursor.fetchone()[0]:,}")
