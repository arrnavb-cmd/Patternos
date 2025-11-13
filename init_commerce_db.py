import sqlite3
from datetime import datetime, timedelta
import random
import json

# Connect to database
conn = sqlite3.connect('intent_intelligence.db')
cursor = conn.cursor()

# Create purchases table
cursor.execute('''
CREATE TABLE IF NOT EXISTS purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT UNIQUE,
    user_id TEXT,
    total_amount REAL,
    items TEXT,
    category TEXT,
    attributed_to_ad INTEGER,
    ad_campaign_id TEXT,
    ad_brand TEXT,
    ad_channel TEXT,
    location TEXT,
    timestamp TEXT,
    client_id TEXT
)
''')

# Create ad_impressions table
cursor.execute('''
CREATE TABLE IF NOT EXISTS ad_impressions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    campaign_id TEXT,
    brand TEXT,
    product_id TEXT,
    category TEXT,
    channel TEXT,
    placement TEXT,
    viewed INTEGER,
    clicked INTEGER,
    location TEXT,
    timestamp TEXT,
    client_id TEXT
)
''')

# Create ad_campaigns table
cursor.execute('''
CREATE TABLE IF NOT EXISTS ad_campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id TEXT UNIQUE,
    brand TEXT,
    name TEXT,
    total_budget REAL,
    spent REAL,
    channels TEXT,
    target_categories TEXT,
    target_locations TEXT,
    status TEXT,
    start_date TEXT,
    end_date TEXT,
    client_id TEXT
)
''')

print("✅ Commerce tables created!")

# Insert sample campaigns
campaigns = [
    {
        'campaign_id': 'nike_q4_2024',
        'brand': 'Nike',
        'name': 'Nike Q4 Footwear Campaign',
        'total_budget': 1800000,
        'spent': 1650000,
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
        'total_budget': 1520000,
        'spent': 1420000,
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
        'total_budget': 850000,
        'spent': 780000,
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
        INSERT OR IGNORE INTO ad_campaigns 
        (campaign_id, brand, name, total_budget, spent, channels, target_categories, 
         target_locations, status, start_date, client_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        camp['campaign_id'], camp['brand'], camp['name'], camp['total_budget'],
        camp['spent'], camp['channels'], camp['target_categories'],
        camp['target_locations'], camp['status'], camp['start_date'], camp['client_id']
    ))

print(f"✅ Inserted {len(campaigns)} campaigns!")

# Generate sample ad impressions and purchases
brands = ['Nike', 'Adidas', 'Lakme', 'Amul', 'Phoocl']
categories = ['footwear', 'apparel', 'beauty', 'groceries', 'electronics']
channels = ['zepto', 'google_display', 'instagram', 'facebook']
locations = ['mumbai', 'bangalore', 'delhi', 'pune', 'hyderabad']

# Generate 500 ad impressions
print("Generating ad impressions...")
for i in range(500):
    brand = random.choice(brands)
    category = random.choice(categories)
    channel = random.choice(channels)
    
    cursor.execute('''
        INSERT INTO ad_impressions 
        (user_id, campaign_id, brand, product_id, category, channel, placement, 
         viewed, clicked, location, timestamp, client_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        f'user_{str(random.randint(1, 50)).zfill(3)}',
        f'{brand.lower()}_campaign_001',
        brand,
        f'{brand.lower()}_product_{random.randint(1, 10)}',
        category,
        channel,
        'homepage' if random.random() > 0.5 else 'search',
        1,
        1 if random.random() > 0.7 else 0,
        random.choice(locations),
        (datetime.now() - timedelta(hours=random.randint(1, 720))).isoformat(),
        'zepto'
    ))

print("✅ Inserted 500 ad impressions!")

# Generate 200 purchases (60% attributed to ads, 40% organic)
print("Generating purchases...")
for i in range(200):
    is_attributed = random.random() > 0.4
    brand = random.choice(brands)
    category = random.choice(categories)
    amount = random.randint(500, 5000)
    
    items = json.dumps([{
        'product_id': f'{brand.lower()}_product_{random.randint(1, 10)}',
        'quantity': random.randint(1, 3),
        'price': amount / random.randint(1, 3)
    }])
    
    cursor.execute('''
        INSERT INTO purchases 
        (order_id, user_id, total_amount, items, category, attributed_to_ad, 
         ad_campaign_id, ad_brand, ad_channel, location, timestamp, client_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        f'ORD_{str(i+1).zfill(6)}',
        f'user_{str(random.randint(1, 50)).zfill(3)}',
        amount,
        items,
        category,
        1 if is_attributed else 0,
        f'{brand.lower()}_campaign_001' if is_attributed else None,
        brand if is_attributed else None,
        random.choice(channels) if is_attributed else None,
        random.choice(locations),
        (datetime.now() - timedelta(hours=random.randint(1, 720))).isoformat(),
        'zepto'
    ))

print("✅ Inserted 200 purchases!")

conn.commit()
conn.close()

print("\n🎉 Commerce database initialized successfully!")
print("\nDatabase contains:")
print("  - 3 ad campaigns")
print("  - 500 ad impressions")
print("  - 200 purchases (120 attributed to ads, 80 organic)")
