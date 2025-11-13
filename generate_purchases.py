import sqlite3
import random
from datetime import datetime, timedelta
import json

CAMPAIGNS = {
    'nike': ['NIKE-1-2024-Q4', 'NIKE-2-2024-Q4', 'NIKE-3-2024-Q4'],
    'adidas': ['ADIDAS-1-2024-Q4', 'ADIDAS-2-2024-Q4', 'ADIDAS-3-2024-Q4'],
    'maggi': ['MAGGI-1-2024-Q4', 'MAGGI-2-2024-Q4', 'MAGGI-3-2024-Q4'],
    'amul': ['AMUL-1-2024-Q4', 'AMUL-2-2024-Q4', 'AMUL-3-2024-Q4'],
    'britannia': ['BRITANNIA-1-2024-Q4', 'BRITANNIA-2-2024-Q4', 'BRITANNIA-3-2024-Q4']
}

PRODUCTS = {
    'nike': [
        {'id': 'nike_air_max', 'name': 'Nike Air Max 270', 'price_range': (300, 800)},
        {'id': 'nike_react', 'name': 'Nike React Infinity', 'price_range': (400, 700)},
    ],
    'adidas': [
        {'id': 'adidas_ultraboost', 'name': 'Adidas Ultraboost', 'price_range': (350, 750)},
        {'id': 'adidas_nmd', 'name': 'Adidas NMD', 'price_range': (300, 650)},
    ],
    'maggi': [
        {'id': 'maggi_masala', 'name': 'Maggi Masala Noodles', 'price_range': (150, 600)},
    ],
    'amul': [
        {'id': 'amul_butter', 'name': 'Amul Butter', 'price_range': (200, 500)},
    ],
    'britannia': [
        {'id': 'britannia_good_day', 'name': 'Britannia Good Day', 'price_range': (150, 550)},
    ]
}

LOCATIONS = ['mumbai', 'delhi', 'bangalore', 'chennai', 'hyderabad', 'pune']
CHANNELS = ['zepto', 'facebook', 'google_display', 'instagram']
CATEGORIES = {'nike': 'footwear', 'adidas': 'footwear', 'maggi': 'groceries', 'amul': 'groceries', 'britannia': 'groceries'}

def generate_order(order_num, start_id):
    attributed = random.random() < 0.7
    brand = random.choice(list(PRODUCTS.keys()))
    product = random.choice(PRODUCTS[brand])
    quantity = random.randint(1, 2)
    total = random.randint(250, 650)
    
    items = [{'product_id': product['id'], 'product_name': product['name'], 'quantity': quantity, 'price': total}]
    
    days_ago = random.randint(0, 90)
    timestamp = (datetime.now() - timedelta(days=days_ago)).isoformat()
    
    campaign_id = random.choice(CAMPAIGNS[brand]) if attributed else None
    ad_brand = brand.capitalize() if attributed else None
    
    return (
        start_id + order_num,
        f'ORD_{order_num:08d}',
        f'user_{random.randint(1, 100000):06d}',
        float(total),
        json.dumps(items),
        CATEGORIES[brand],
        1 if attributed else 0,
        campaign_id,
        ad_brand,
        random.choice(CHANNELS) if attributed else None,
        random.choice(LOCATIONS),
        timestamp,
        'zepto'
    )

conn = sqlite3.connect('intent_intelligence.db')
cursor = conn.cursor()

cursor.execute("SELECT MAX(CAST(SUBSTR(order_id, 5) AS INTEGER)) FROM purchases")
max_order = cursor.fetchone()[0] or 0

cursor.execute("SELECT MAX(id) FROM purchases")
max_id = cursor.fetchone()[0] or 100629

print(f"Generating 98,922 orders starting from order {max_order + 1}")

batch_size = 5000
total = 98922
generated = 0

while generated < total:
    batch = min(batch_size, total - generated)
    orders = [generate_order(max_order + generated + i + 1, max_id + generated + i + 1) for i in range(batch)]
    
    cursor.executemany('''
        INSERT INTO purchases (id, order_id, user_id, total_amount, items, category, 
                              attributed_to_ad, ad_campaign_id, ad_brand, ad_channel, 
                              location, timestamp, client_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', orders)
    
    generated += batch
    conn.commit()
    print(f"Progress: {generated:,}/{total:,} ({generated/total*100:.1f}%)")

conn.close()
print(f"\n✅ Done! Total orders: {1078 + generated:,}")
