import requests
import random
from datetime import datetime, timedelta

BASE_URL = "http://localhost:8000/api/v1/intent"

# Sample data
USER_IDS = [f"user_{str(i).zfill(3)}" for i in range(1, 101)]
CATEGORIES = ['footwear', 'apparel', 'electronics', 'groceries', 'beauty', 'sports']
PRODUCTS = {
    'footwear': ['nike_air_max_270', 'adidas_ultraboost', 'puma_rs_x'],
    'apparel': ['nike_hoodie', 'adidas_tshirt', 'levis_jeans'],
    'electronics': ['iphone_15', 'samsung_tv', 'sony_headphones'],
    'groceries': ['bread', 'milk', 'eggs'],
    'beauty': ['loreal_shampoo', 'maybelline_lipstick'],
    'sports': ['cricket_bat', 'football', 'yoga_mat']
}
SEARCH_QUERIES = {
    'footwear': ['running shoes', 'sneakers', 'nike shoes'],
    'apparel': ['winter jacket', 'jeans', 'tshirt'],
    'electronics': ['smartphone', 'laptop', 'headphones'],
    'groceries': ['fresh vegetables', 'organic milk'],
    'beauty': ['face cream', 'lipstick', 'shampoo'],
    'sports': ['gym equipment', 'cricket gear']
}
LOCATIONS = ['mumbai', 'bangalore', 'delhi', 'hyderabad']

print("🎲 Generating test data for Intent Intelligence database...")
print("=" * 60)

success_count = 0
total_events = 0

# Generate events for 50 users
for user_id in USER_IDS[:50]:
    category = random.choice(CATEGORIES)
    location = random.choice(LOCATIONS)
    
    # High intent users (60% chance)
    is_high_intent = random.random() > 0.4
    num_events = random.randint(4, 8) if is_high_intent else random.randint(2, 3)
    
    # Generate events for this user
    for _ in range(num_events):
        event_type = random.choice(['search', 'search', 'product_view', 'cart_add', 'wishlist_add'])
        
        event = {
            'userId': user_id,
            'eventType': event_type,
            'category': category,
            'location': location,
            'timestamp': (datetime.now() - timedelta(hours=random.randint(1, 72))).isoformat()
        }
        
        if event_type == 'search':
            event['searchQuery'] = random.choice(SEARCH_QUERIES[category])
        else:
            event['productId'] = random.choice(PRODUCTS[category])
        
        try:
            response = requests.post(f"{BASE_URL}/ingest?clientId=zepto", json=event, timeout=5)
            if response.status_code == 200:
                success_count += 1
            total_events += 1
            
            if total_events % 50 == 0:
                print(f"✓ Ingested {total_events} events...")
                
        except Exception as e:
            print(f"✗ Error: {e}")

print("=" * 60)
print(f"✅ Successfully ingested {success_count}/{total_events} events!")
print("\n📊 Checking statistics...")

try:
    stats_response = requests.get(f"{BASE_URL}/stats?clientId=zepto")
    stats = stats_response.json()
    
    print("=" * 60)
    print("📊 INTENT INTELLIGENCE STATS")
    print("=" * 60)
    print(f"Total Users: {stats['totalUsers']}")
    print(f"Total Events: {stats['totalEvents']}")
    print(f"Total Scores: {stats['totalScores']}")
    print(f"\nIntent Distribution:")
    print(f"  🔴 High:    {stats['intentDistribution']['high']}")
    print(f"  🟡 Medium:  {stats['intentDistribution']['medium']}")
    print(f"  🔵 Low:     {stats['intentDistribution']['low']}")
    print(f"  ⚪ Minimal: {stats['intentDistribution']['minimal']}")
    print("=" * 60)
    print("\n✨ Database populated! Refresh your browser to see the data!")
    
except Exception as e:
    print(f"✗ Error fetching stats: {e}")
