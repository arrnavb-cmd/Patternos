import sqlite3
import random
from datetime import datetime, timedelta
import json

conn = sqlite3.connect('intent_intelligence.db')
cursor = conn.cursor()

print("🔄 Updating database with realistic values...")

# Clear existing data
cursor.execute("DELETE FROM purchases")
cursor.execute("DELETE FROM ad_impressions")
cursor.execute("DELETE FROM ad_campaigns")

# Insert realistic campaigns with lakhs spend
campaigns = [
    {
        'campaign_id': 'nike_q4_2024',
        'brand': 'Nike',
        'name': 'Nike Q4 Footwear Campaign',
        'total_budget': 1800000,  # 18L
        'spent': 1650000,  # 16.5L spent
        'channels': json.dumps(['zepto', 'google_display', 'instagram']),
        'target_categories': json.dumps(['footwear', 'apparel']),
        'target_locations': json.dumps(['mumbai', 'bangalore', 'delhi']),
        'status': 'active',
        'start_date': '2024-10-01',
        'client_id': 'zepto'
    },
    {
        'campaign_id': 'adidas_festive_2024',
        'brand': 'Adidas',
        'name': 'Adidas Festive Sale',
        'total_budget': 1520000,  # 15.2L
        'spent': 1420000,  # 14.2L spent
        'channels': json.dumps(['zepto', 'facebook', 'instagram']),
        'target_categories': json.dumps(['footwear', 'sports']),
        'target_locations': json.dumps(['mumbai', 'pune', 'bangalore']),
        'status': 'active',
        'start_date': '2024-10-15',
        'client_id': 'zepto'
    },
    {
        'campaign_id': 'lakme_beauty_2024',
        'brand': 'Lakme',
        'name': 'Lakme Beauty Fest',
        'total_budget': 850000,  # 8.5L
        'spent': 780000,  # 7.8L spent
        'channels': json.dumps(['zepto', 'instagram']),
        'target_categories': json.dumps(['beauty']),
        'target_locations': json.dumps(['mumbai', 'delhi', 'bangalore']),
        'status': 'active',
        'start_date': '2024-10-20',
        'client_id': 'zepto'
    }
]

for camp in campaigns:
    cursor.execute('''
        INSERT INTO ad_campaigns 
        (campaign_id, brand, name, total_budget, spent, channels, target_categories, 
         target_locations, status, start_date, client_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        camp['campaign_id'], camp['brand'], camp['name'], camp['total_budget'],
        camp['spent'], camp['channels'], camp['target_categories'],
        camp['target_locations'], camp['status'], camp['start_date'], camp['client_id']
    ))

print(f"✅ Inserted {len(campaigns)} campaigns with realistic spend")

# Generate ad impressions (2000 impressions)
brands_with_spend = {
    'Nike': 1650000,
    'Adidas': 1420000,
    'Lakme': 780000
}

categories = ['footwear', 'apparel', 'beauty', 'groceries', 'electronics', 'sports']
channels = ['zepto', 'google_display', 'instagram', 'facebook']
locations = ['mumbai', 'bangalore', 'delhi', 'pune', 'hyderabad']

print("Generating 2000 ad impressions...")
for i in range(2000):
    brand = random.choice(list(brands_with_spend.keys()))
    
    cursor.execute('''
        INSERT INTO ad_impressions 
        (user_id, campaign_id, brand, product_id, category, channel, placement, 
         viewed, clicked, location, timestamp, client_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        f'user_{str(random.randint(1, 100)).zfill(3)}',
        f'{brand.lower()}_q4_2024',
        brand,
        f'{brand.lower()}_product_{random.randint(1, 10)}',
        random.choice(categories),
        random.choice(channels),
        'homepage' if random.random() > 0.5 else 'search',
        1,
        1 if random.random() > 0.85 else 0,  # 15% CTR
        random.choice(locations),
        (datetime.now() - timedelta(hours=random.randint(1, 720))).isoformat(),
        'zepto'
    ))

print("✅ Inserted 2000 ad impressions")

# Generate purchases with good ROAS (3-5x)
# Target ROAS: Nike 4x, Adidas 4x, Lakme 5x
target_revenue = {
    'Nike': 1650000 * 4,  # 66L revenue
    'Adidas': 1420000 * 4,  # 56.8L revenue  
    'Lakme': 780000 * 5   # 39L revenue
}

print("Generating purchases with 3-5x ROAS...")

for brand, target_rev in target_revenue.items():
    # Calculate number of purchases needed
    avg_order_value = random.randint(2500, 4000)
    num_purchases = int(target_rev / avg_order_value)
    
    # 70% attributed to ads, 30% organic
    attributed_purchases = int(num_purchases * 0.7)
    
    for i in range(num_purchases):
        is_attributed = i < attributed_purchases
        amount = random.randint(2000, 5000)
        
        items = json.dumps([{
            'product_id': f'{brand.lower()}_product_{random.randint(1, 10)}',
            'quantity': random.randint(1, 2),
            'price': amount
        }])
        
        cursor.execute('''
            INSERT INTO purchases 
            (order_id, user_id, total_amount, items, category, attributed_to_ad, 
             ad_campaign_id, ad_brand, ad_channel, location, timestamp, client_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            f'ORD_{brand}_{str(i+1).zfill(6)}',
            f'user_{str(random.randint(1, 100)).zfill(3)}',
            amount,
            items,
            random.choice(categories),
            1 if is_attributed else 0,
            f'{brand.lower()}_q4_2024' if is_attributed else None,
            brand if is_attributed else None,
            random.choice(channels) if is_attributed else None,
            random.choice(locations),
            (datetime.now() - timedelta(hours=random.randint(1, 720))).isoformat(),
            'zepto'
        ))
    
    print(f"  ✅ {brand}: {num_purchases} purchases = {formatCurrency(target_rev)} revenue")

def formatCurrency(amount):
    if amount >= 10000000:
        return f"₹{amount/10000000:.1f}Cr"
    if amount >= 100000:
        return f"₹{amount/100000:.1f}L"
    return f"₹{amount:,}"

conn.commit()
conn.close()

print("\n🎉 Database updated successfully!")
print("\nExpected ROAS:")
print("  Nike: ~4.0x")
print("  Adidas: ~4.0x")
print("  Lakme: ~5.0x")
