import sqlite3
import random
from datetime import datetime, timedelta
import json

conn = sqlite3.connect('intent_intelligence.db')
cursor = conn.cursor()

print("🔄 Scaling up database to 1 Lakh purchases...")

# Clear existing purchase data
cursor.execute("DELETE FROM purchases")
cursor.execute("DELETE FROM ad_impressions")

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

# Campaign info with scaled spend (in lakhs)
campaigns = {
    'Nike': {'spend': 1650000, 'target_revenue_multiplier': 4},
    'Adidas': {'spend': 1420000, 'target_revenue_multiplier': 4},
    'Lakme': {'spend': 780000, 'target_revenue_multiplier': 5}
}

total_purchases = 100000
print(f"Generating {total_purchases:,} purchases...")

# Distribute purchases across brands
brand_distribution = {
    'Nike': 0.40,
    'Adidas': 0.35,
    'Lakme': 0.25
}

for brand, ratio in brand_distribution.items():
    num_purchases = int(total_purchases * ratio)
    campaign_info = campaigns[brand]
    target_revenue = campaign_info['spend'] * campaign_info['target_revenue_multiplier']
    avg_order_value = target_revenue / num_purchases
    
    attributed_purchases = int(num_purchases * 0.7)
    
    print(f"\n{brand}:")
    print(f"  Purchases: {num_purchases:,}")
    print(f"  Target Revenue: ₹{target_revenue/100000:.1f}L")
    print(f"  Avg Order Value: ₹{int(avg_order_value)}")
    
    for i in range(num_purchases):
        is_attributed = i < attributed_purchases
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
            f'ORD_{brand}_{str(i+1).zfill(8)}',
            f'user_{str(random.randint(1, 10000)).zfill(5)}',
            amount,
            items,
            category,
            1 if is_attributed else 0,
            f'{brand.lower()}_q4_2024' if is_attributed else None,
            brand if is_attributed else None,
            random.choice(channels) if is_attributed else None,
            random.choice(locations),
            (datetime.now() - timedelta(hours=random.randint(1, 720))).isoformat(),
            'zepto'
        ))
        
        if (i + 1) % 10000 == 0:
            print(f"  Progress: {i+1:,}/{num_purchases:,}")
            conn.commit()

print("\n✅ Generating 50,000 ad impressions...")
for i in range(50000):
    brand = random.choice(list(campaigns.keys()))
    
    cursor.execute('''
        INSERT INTO ad_impressions 
        (user_id, campaign_id, brand, product_id, category, channel, placement, 
         viewed, clicked, location, timestamp, client_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        f'user_{str(random.randint(1, 10000)).zfill(5)}',
        f'{brand.lower()}_q4_2024',
        brand,
        random.choice(products[brand]).lower().replace(' ', '_'),
        random.choice(categories_map[brand]),
        random.choice(channels),
        random.choice(['homepage', 'search', 'pdp']),
        1,
        1 if random.random() > 0.85 else 0,
        random.choice(locations),
        (datetime.now() - timedelta(hours=random.randint(1, 720))).isoformat(),
        'zepto'
    ))
    
    if (i + 1) % 10000 == 0:
        print(f"  Progress: {i+1:,}/50,000")
        conn.commit()

conn.commit()
conn.close()

print("\n🎉 Database scaled successfully!")
print("\nFinal Stats:")
print(f"  Total Purchases: 1,00,000")
print(f"  Ad Impressions: 50,000")
