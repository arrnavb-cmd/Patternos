import sqlite3
import random
from datetime import datetime, timedelta

print("🚀 Starting data generation...")
print("This will take 5-10 minutes. Please wait...")

conn = sqlite3.connect("intent_intelligence.db")
cursor = conn.cursor()

# Generate 20,000 users
print("\n📊 Generating 20,000 users...")
user_ids = []
for i in range(20000):
    user_id = f"user_{i+1000:06d}"
    user_ids.append(user_id)
    if i % 5000 == 0:
        print(f"  Generated {i} users...")

# Generate 100,000 orders
print("\n💰 Generating 100,000 orders...")
brands = ['Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour', 'New Balance', 'Amul', 'ITC', 'Lakme', 'Britannia']
batch_size = 1000

for i in range(0, 100000, batch_size):
    orders = []
    for j in range(batch_size):
        user_id = random.choice(user_ids)
        brand = random.choice(brands)
        amount = round(random.uniform(500, 5000), 2)
        attributed = 1 if random.random() > 0.3 else 0
        date = (datetime.now() - timedelta(days=random.randint(0, 90))).isoformat()
        
        orders.append((f"order_{i+j+1:07d}", user_id, brand, amount, attributed, date))
    
    cursor.executemany("""
        INSERT OR IGNORE INTO purchases (order_id, user_id, brand, total_amount, attributed_to_ad, purchase_date)
        VALUES (?, ?, ?, ?, ?, ?)
    """, orders)
    
    if i % 10000 == 0:
        print(f"  Generated {i} orders...")
        conn.commit()

print("\n🎯 Generating intent scores for 20,000 users...")
for i in range(0, 20000, batch_size):
    scores = []
    for j in range(batch_size):
        user_id = user_ids[i+j]
        intent_score = random.uniform(0.1, 0.95)
        
        scores.append((user_id, 'zepto', intent_score))
    
    cursor.executemany("""
        INSERT OR IGNORE INTO intent_scores (user_id, client_id, intent_score)
        VALUES (?, ?, ?)
    """, scores)
    
    if i % 5000 == 0:
        print(f"  Generated {i} intent scores...")
        conn.commit()

conn.commit()
conn.close()

print("\n✅ Data generation complete!")
print("📈 Generated:")
print("   - 20,000 users")
print("   - 100,000 orders")
print("   - 20,000 intent scores")
