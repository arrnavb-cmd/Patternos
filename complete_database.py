import sqlite3
import random
from datetime import datetime, timedelta
import json

conn = sqlite3.connect('intent_intelligence.db')
cursor = conn.cursor()

print("🔄 Completing database setup...")

# Get clicks from impressions
cursor.execute("SELECT user_id, brand, channel, location FROM ad_impressions WHERE clicked = 1")
clicks = []
for row in cursor.fetchall():
    clicks.append({
        'user_id': row[0],
        'brand': row[1],
        'channel': row[2],
        'location': row[3]
    })

print(f"Found {len(clicks):,} clicks from impressions")

# Product catalog
products = {
    'Nike': ['Nike Air Max 270', 'Nike React Infinity', 'Nike Pegasus 40', 'Nike Dri-FIT Tshirt', 'Nike Track Pants'],
    'Adidas': ['Adidas Ultraboost', 'Adidas NMD', 'Adidas Samba', 'Adidas Tiro Pants', 'Adidas Essential Tee'],
    'Lakme': ['Lakme 9to5 Lipstick', 'Lakme Perfecting Foundation', 'Lakme Kajal', 'Lakme Eyeconic Liner', 'Lakme CC Cream']
}

categories_map = {
    'Nike': ['footwear', 'apparel'],
    'Adidas': ['footwear', 'apparel'],
    'Lakme': ['beauty']
}

campaigns = {
    'Nike': {'spend': 1650000, 'target_revenue_multiplier': 4},
    'Adidas': {'spend': 1420000, 'target_revenue_multiplier': 4},
    'Lakme': {'spend': 780000, 'target_revenue_multiplier': 5}
}

# Generate purchases from 2% of clicks
conversion_rate = 0.02
num_conversions = int(len(clicks) * conversion_rate)
print(f"\nGenerating {num_conversions:,} attributed purchases (2% conversion)...")

purchase_id = 0
for click in random.sample(clicks, min(num_conversions, len(clicks))):
    purchase_id += 1
    brand = click['brand']
    category = random.choice(categories_map.get(brand, ['apparel']))
    
    # Average order value
    amount = random.randint(1500, 4000)
    product = random.choice(products.get(brand, products['Nike']))
    
    items = json.dumps([{
        'product_id': product.lower().replace(' ', '_'),
        'product_name': product,
        'quantity': 1,
        'price': amount
    }])
    
    cursor.execute('''
        INSERT INTO purchases 
        (order_id, user_id, total_amount, items, category, attributed_to_ad, 
         ad_campaign_id, ad_brand, ad_channel, location, timestamp, client_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        f'ORD_{str(purchase_id).zfill(8)}',
        click['user_id'],
        amount,
        items,
        category,
        1,
        f'{brand.lower()}_q4_2024',
        brand,
        click['channel'],
        click['location'],
        (datetime.now() - timedelta(hours=random.randint(1, 720))).isoformat(),
        'zepto'
    ))
    
    if purchase_id % 50 == 0:
        conn.commit()

# Add organic purchases (30% of total)
organic_count = int(num_conversions * 0.3 / 0.7)
print(f"Generating {organic_count:,} organic purchases...")

for i in range(organic_count):
    purchase_id += 1
    brand = random.choice(list(campaigns.keys()))
    category = random.choice(categories_map[brand])
    amount = random.randint(1500, 4000)
    product = random.choice(products[brand])
    
    items = json.dumps([{
        'product_id': product.lower().replace(' ', '_'),
        'product_name': product,
        'quantity': 1,
        'price': amount
    }])
    
    cursor.execute('''
        INSERT INTO purchases 
        (order_id, user_id, total_amount, items, category, attributed_to_ad, 
         ad_campaign_id, ad_brand, ad_channel, location, timestamp, client_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        f'ORD_{str(purchase_id).zfill(8)}',
        f'user_{str(random.randint(1, 50000)).zfill(5)}',
        amount,
        items,
        category,
        0,
        None,
        None,
        None,
        random.choice(['mumbai', 'bangalore', 'delhi', 'pune', 'hyderabad']),
        (datetime.now() - timedelta(hours=random.randint(1, 720))).isoformat(),
        'zepto'
    ))
    
    if (i + 1) % 50 == 0:
        conn.commit()

conn.commit()
print(f"✅ Generated {purchase_id:,} total purchases")

# Generate intent scores
print("\nGenerating 50,000 intent scores (30% high intent)...")
categories = ['footwear', 'apparel', 'beauty', 'groceries', 'electronics', 'sports']
locations = ['mumbai', 'bangalore', 'delhi', 'pune', 'hyderabad', 'chennai']

for i in range(50000):
    user_id = f'user_{str(i+1).zfill(5)}'
    category = random.choice(categories)
    
    # 30% high intent
    rand = random.random()
    if rand < 0.30:
        intent_score = random.uniform(0.70, 0.95)
        intent_level = 'high'
    elif rand < 0.60:
        intent_score = random.uniform(0.50, 0.69)
        intent_level = 'medium'
    elif rand < 0.85:
        intent_score = random.uniform(0.30, 0.49)
        intent_level = 'low'
    else:
        intent_score = random.uniform(0.10, 0.29)
        intent_level = 'minimal'
    
    cursor.execute('''
        INSERT INTO intent_scores
        (user_id, category, intent_score, intent_level, last_activity, location, client_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        user_id,
        category,
        round(intent_score, 2),
        intent_level,
        (datetime.now() - timedelta(hours=random.randint(1, 720))).isoformat(),
        random.choice(locations),
        'zepto'
    ))
    
    if (i + 1) % 10000 == 0:
        print(f"  Progress: {i+1:,}/50,000")
        conn.commit()

conn.commit()
conn.close()

print("\n🎉 Database completed!")
print("\nMetrics:")
print(f"  Impressions: 500,000")
print(f"  Clicks: {len(clicks):,}")
print(f"  Purchases: {purchase_id:,}")
print(f"  Users with intent scores: 50,000")
