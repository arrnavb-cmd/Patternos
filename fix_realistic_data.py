import sqlite3
import random
from datetime import datetime, timedelta
import json

conn = sqlite3.connect('intent_intelligence.db')
cursor = conn.cursor()

print("🔄 Fixing database with realistic conversion rates...")

# Clear existing data
cursor.execute("DELETE FROM purchases")
cursor.execute("DELETE FROM ad_impressions")
cursor.execute("DELETE FROM intent_scores")

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

channels = ['zepto', 'google_display', 'instagram', 'facebook']
locations = ['mumbai', 'bangalore', 'delhi', 'pune', 'hyderabad', 'chennai']

campaigns = {
    'Nike': {'spend': 1650000, 'target_revenue_multiplier': 4},
    'Adidas': {'spend': 1420000, 'target_revenue_multiplier': 4},
    'Lakme': {'spend': 780000, 'target_revenue_multiplier': 5}
}

# Step 1: Generate 500,000 ad impressions first
print("Step 1: Generating 500,000 ad impressions...")
impression_count = 500000
clicks = []

for i in range(impression_count):
    brand = random.choice(list(campaigns.keys()))
    user_id = f'user_{str(random.randint(1, 50000)).zfill(5)}'
    channel = random.choice(channels)
    location = random.choice(locations)
    clicked = 1 if random.random() < 0.03 else 0  # 3% CTR
    
    cursor.execute('''
        INSERT INTO ad_impressions 
        (user_id, campaign_id, brand, product_id, category, channel, placement, 
         viewed, clicked, location, timestamp, client_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        user_id,
        f'{brand.lower()}_q4_2024',
        brand,
        random.choice(products[brand]).lower().replace(' ', '_'),
        random.choice(categories_map[brand]),
        channel,
        random.choice(['homepage', 'search', 'pdp']),
        1,
        clicked,
        location,
        (datetime.now() - timedelta(hours=random.randint(1, 720))).isoformat(),
        'zepto'
    ))
    
    if clicked:
        clicks.append({
            'user_id': user_id,
            'brand': brand,
            'channel': channel,
            'location': location,
            'category': random.choice(categories_map[brand])
        })
    
    if (i + 1) % 100000 == 0:
        print(f"  Impressions: {i+1:,}/{impression_count:,}")
        conn.commit()

conn.commit()
print(f"✅ Generated {impression_count:,} impressions with {len(clicks):,} clicks (CTR: {len(clicks)/impression_count*100:.2f}%)")

# Step 2: Generate purchases (2% of clicks convert = realistic conversion rate)
print("\nStep 2: Generating purchases with 2% conversion rate...")
conversion_rate = 0.02
num_conversions = int(len(clicks) * conversion_rate)

print(f"  Attributed purchases from ads: {num_conversions:,}")

purchase_id = 0
for click in random.sample(clicks, num_conversions):
    purchase_id += 1
    brand = click['brand']
    campaign_info = campaigns[brand]
    target_revenue = campaign_info['spend'] * campaign_info['target_revenue_multiplier']
    
    # Calculate proper avg order value based on target
    brand_purchases = num_conversions * (0.40 if brand == 'Nike' else 0.35 if brand == 'Adidas' else 0.25)
    avg_order_value = (target_revenue * 0.7) / brand_purchases  # 70% from attributed
    
    amount = int(random.gauss(avg_order_value, avg_order_value * 0.3))
    amount = max(500, min(10000, amount))
    
    product = random.choice(products[brand])
    
    items = json.dumps([{
        'product_id': product.lower().replace(' ', '_'),
        'product_name': product,
        'quantity': random.randint(1, 2),
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
        click['category'],
        1,
        f'{brand.lower()}_q4_2024',
        brand,
        click['channel'],
        click['location'],
        (datetime.now() - timedelta(hours=random.randint(1, 720))).isoformat(),
        'zepto'
    ))
    
    if purchase_id % 1000 == 0:
        print(f"  Progress: {purchase_id:,}/{num_conversions:,}")
        conn.commit()

# Step 3: Add organic purchases (30% of total)
print("\nStep 3: Adding organic purchases...")
organic_count = int(num_conversions * 0.3 / 0.7)  # 30% organic, 70% attributed

for i in range(organic_count):
    purchase_id += 1
    brand = random.choice(list(campaigns.keys()))
    
    campaign_info = campaigns[brand]
    target_revenue = campaign_info['spend'] * campaign_info['target_revenue_multiplier']
    brand_purchases = num_conversions * (0.40 if brand == 'Nike' else 0.35 if brand == 'Adidas' else 0.25)
    avg_order_value = (target_revenue * 0.3) / organic_count  # 30% from organic
    
    amount = int(random.gauss(avg_order_value, avg_order_value * 0.3))
    amount = max(500, min(10000, amount))
    
    product = random.choice(products[brand])
    category = random.choice(categories_map[brand])
    
    items = json.dumps([{
        'product_id': product.lower().replace(' ', '_'),
        'product_name': product,
        'quantity': random.randint(1, 2),
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
        random.choice(locations),
        (datetime.now() - timedelta(hours=random.randint(1, 720))).isoformat(),
        'zepto'
    ))
    
    if (i + 1) % 1000 == 0:
        print(f"  Progress: {i+1:,}/{organic_count:,}")
        conn.commit()

# Step 4: Generate intent scores with realistic distribution
print("\nStep 4: Generating intent scores (30% high, 70% other)...")
total_users = 50000
categories = list(set([cat for cats in categories_map.values() for cat in cats]))

for i in range(total_users):
    user_id = f'user_{str(i+1).zfill(5)}'
    category = random.choice(categories)
    
    # 30% high intent (>= 0.7), 70% lower intent
    if random.random() < 0.30:
        intent_score = random.uniform(0.70, 0.95)
        intent_level = 'high'
    elif random.random() < 0.50:
        intent_score = random.uniform(0.50, 0.69)
        intent_level = 'medium'
    elif random.random() < 0.30:
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
        print(f"  Progress: {i+1:,}/{total_users:,}")
        conn.commit()

conn.commit()
conn.close()

print("\n🎉 Database fixed with realistic metrics!")
print("\nExpected Results:")
print(f"  Impressions: 500,000")
print(f"  Clicks: ~15,000 (3% CTR)")
print(f"  Conversions: ~300 (2% conversion rate)")
print(f"  Intent Distribution: 30% high, 40% medium, 20% low, 10% minimal")
