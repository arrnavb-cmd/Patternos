import sqlite3
import random
from datetime import datetime, timedelta
import json

conn = sqlite3.connect('intent_intelligence.db')
cursor = conn.cursor()

print("🔄 Creating final database with correct revenue model...")

# Clear all data
cursor.execute("DELETE FROM purchases")
cursor.execute("DELETE FROM ad_impressions")
cursor.execute("DELETE FROM intent_scores")
cursor.execute("DELETE FROM ad_campaigns")

# Product catalog
products = {
    'Nike': ['Nike Air Max 270', 'Nike React Infinity', 'Nike Pegasus 40', 'Nike Dri-FIT Tshirt', 'Nike Track Pants'],
    'Adidas': ['Adidas Ultraboost', 'Adidas NMD', 'Adidas Samba', 'Adidas Tiro Pants', 'Adidas Essential Tee'],
    'Lakme': ['Lakme 9to5 Lipstick', 'Lakme Foundation', 'Lakme Kajal', 'Lakme Eyeconic Liner', 'Lakme CC Cream'],
    'Amul': ['Amul Butter 500g', 'Amul Milk 1L', 'Amul Cheese', 'Amul Ice Cream', 'Amul Lassi'],
    'ITC': ['Aashirvaad Atta 5kg', 'Sunfeast Biscuits', 'Bingo Chips', 'YiPPee Noodles', 'Candyman']
}

categories_map = {
    'Nike': ['footwear', 'apparel'],
    'Adidas': ['footwear', 'apparel'],
    'Lakme': ['beauty'],
    'Amul': ['groceries'],
    'ITC': ['groceries']
}

channels = ['zepto', 'google_display', 'instagram', 'facebook']
locations = ['mumbai', 'bangalore', 'delhi', 'pune', 'hyderabad', 'chennai']

# Campaigns with total spend = 1.5 Cr
campaigns_data = [
    {'brand': 'Nike', 'spent': 5000000, 'target_roas': 4},      # 50L
    {'brand': 'Adidas', 'spent': 4200000, 'target_roas': 4},    # 42L
    {'brand': 'Lakme', 'spent': 3200000, 'target_roas': 5},     # 32L
    {'brand': 'Amul', 'spent': 1800000, 'target_roas': 3},      # 18L
    {'brand': 'ITC', 'spent': 1800000, 'target_roas': 3}        # 18L
]  # Total: 1.6 Cr

print("Creating campaigns...")
for camp in campaigns_data:
    cursor.execute('''
        INSERT INTO ad_campaigns 
        (campaign_id, brand, name, total_budget, spent, channels, target_categories, 
         target_locations, status, start_date, client_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        f"{camp['brand'].lower()}_q4_2024",
        camp['brand'],
        f"{camp['brand']} Q4 Campaign",
        camp['spent'] + 500000,
        camp['spent'],
        json.dumps(channels),
        json.dumps(categories_map[camp['brand']]),
        json.dumps(locations),
        'active',
        '2024-10-01',
        'zepto'
    ))

conn.commit()
total_spend = sum(c['spent'] for c in campaigns_data)
print(f"✅ Created campaigns with total spend: ₹{total_spend/10000000:.2f}Cr")

# Step 1: Generate impressions (1 million)
print("\nStep 1: Generating 1,000,000 impressions...")
clicks = []

for i in range(1000000):
    camp = random.choice(campaigns_data)
    brand = camp['brand']
    user_id = f'user_{random.randint(1, 100000):06d}'
    channel = random.choice(channels)
    location = random.choice(locations)
    product = random.choice(products[brand])
    category = random.choice(categories_map[brand])
    clicked = 1 if random.random() < 0.03 else 0  # 3% CTR
    
    cursor.execute('''
        INSERT INTO ad_impressions 
        (user_id, campaign_id, brand, product_id, category, channel, placement, 
         viewed, clicked, location, timestamp, client_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        user_id,
        f"{brand.lower()}_q4_2024",
        brand,
        product.lower().replace(' ', '_'),
        category,
        channel,
        random.choice(['homepage', 'search', 'category_page']),
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
            'product': product,
            'channel': channel,
            'location': location,
            'category': category,
            'campaign': camp
        })
    
    if (i + 1) % 200000 == 0:
        print(f"  {i+1:,}/1,000,000 | Clicks: {len(clicks):,}")
        conn.commit()

conn.commit()
print(f"✅ Generated 1M impressions, {len(clicks):,} clicks (CTR: {len(clicks)/10000:.2f}%)")

# Step 2: Generate purchases
# Need ₹2Cr total high-intent revenue so Zepto gets ₹40L (20% of ₹2Cr)
print("\nStep 2: Generating purchases...")

high_intent_target = 20000000  # ₹2Cr high-intent revenue needed
conversion_rate = 0.025  # 2.5% conversion from clicks
num_purchases = int(len(clicks) * conversion_rate)

purchase_id = 0
high_intent_revenue = 0
total_attributed = 0

# 70% of purchases from high-intent users
high_intent_purchases = int(num_purchases * 0.7)

for i, click in enumerate(random.sample(clicks, min(num_purchases, len(clicks)))):
    purchase_id += 1
    brand = click['brand']
    camp = click['campaign']
    
    # Calculate amount to hit revenue targets
    if i < high_intent_purchases:
        # High-intent purchase (higher value)
        amount = int(random.gauss(high_intent_target / high_intent_purchases, 1000))
        amount = max(2000, min(20000, amount))
        is_high_intent = True
        high_intent_revenue += amount
    else:
        # Regular purchase
        amount = random.randint(800, 3000)
        is_high_intent = False
    
    total_attributed += amount
    product = click['product']
    
    items = json.dumps([{
        'product_id': product.lower().replace(' ', '_'),
        'product_name': product,
        'quantity': random.randint(1, 3),
        'price': amount
    }])
    
    cursor.execute('''
        INSERT INTO purchases 
        (order_id, user_id, total_amount, items, category, attributed_to_ad, 
         ad_campaign_id, ad_brand, ad_channel, location, timestamp, client_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        f'ORD_{purchase_id:08d}',
        click['user_id'],
        amount,
        items,
        click['category'],
        1,
        f"{brand.lower()}_q4_2024",
        brand,
        click['channel'],
        click['location'],
        (datetime.now() - timedelta(hours=random.randint(1, 720))).isoformat(),
        'zepto'
    ))
    
    if purchase_id % 100 == 0:
        conn.commit()

# Organic purchases
organic_count = int(num_purchases * 0.3 / 0.7)
print(f"Adding {organic_count:,} organic purchases...")

for i in range(organic_count):
    purchase_id += 1
    brand = random.choice(list(products.keys()))
    amount = random.randint(500, 3000)
    product = random.choice(products[brand])
    category = random.choice(categories_map[brand])
    
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
        f'ORD_{purchase_id:08d}',
        f'user_{random.randint(1, 100000):06d}',
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
    
    if (i + 1) % 100 == 0:
        conn.commit()

conn.commit()
print(f"✅ {purchase_id:,} purchases | High-intent: ₹{high_intent_revenue/100000:.1f}L | Total: ₹{(high_intent_revenue + total_attributed)/100000:.1f}L")

# Step 3: Intent scores (30% high)
print("\nStep 3: Generating 100,000 intent scores...")
all_cats = ['footwear', 'apparel', 'beauty', 'groceries', 'electronics', 'sports']

for i in range(100000):
    user_id = f'user_{i+1:06d}'
    category = random.choice(all_cats)
    
    rand = random.random()
    if rand < 0.30:
        score = random.uniform(0.70, 0.95)
        level = 'high'
    elif rand < 0.60:
        score = random.uniform(0.50, 0.69)
        level = 'medium'
    elif rand < 0.85:
        score = random.uniform(0.30, 0.49)
        level = 'low'
    else:
        score = random.uniform(0.10, 0.29)
        level = 'minimal'
    
    cursor.execute('''
        INSERT INTO intent_scores
        (user_id, category, intent_score, intent_level, last_activity, client_id)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        user_id, category, round(score, 2), level,
        (datetime.now() - timedelta(hours=random.randint(1, 720))).isoformat(),
        'zepto'
    ))
    
    if (i + 1) % 20000 == 0:
        print(f"  {i+1:,}/100,000")
        conn.commit()

conn.commit()
conn.close()

print("\n🎉 Database complete!")
print("\n📊 Revenue Breakdown:")
print(f"  1. Retainer Fee: ₹3L/month")
print(f"  2. Ad Platform Fee (10%): ₹{total_spend * 0.1 / 100000:.1f}L")
print(f"  3. High-Intent Share (20%): ₹{high_intent_revenue * 0.2 / 100000:.1f}L")
print(f"  Total PatternOS Revenue: ₹{(300000 + total_spend * 0.1 + high_intent_revenue * 0.2) / 100000:.1f}L/month")
