"""
Generate Dummy Intent Data for Testing
"""
import requests
import random
from datetime import datetime, timedelta

BASE_URL = "http://localhost:8001/api/v1/intent"

# Sample data
USER_IDS = [f"user_{str(i).zfill(3)}" for i in range(1, 101)]
CATEGORIES = ['footwear', 'apparel', 'groceries', 'electronics', 'beauty', 'sports']
PRODUCTS = {
    'footwear': ['nike_air_max_270', 'adidas_ultraboost', 'puma_rs_x', 'reebok_classic'],
    'apparel': ['nike_hoodie', 'adidas_tshirt', 'levis_jeans', 'hm_jacket'],
    'electronics': ['iphone_15', 'samsung_tv', 'sony_headphones', 'apple_watch'],
    'groceries': ['bread', 'milk', 'eggs', 'rice'],
    'beauty': ['loreal_shampoo', 'maybelline_lipstick', 'nivea_cream'],
    'sports': ['cricket_bat', 'football', 'yoga_mat', 'dumbbells']
}
SEARCH_QUERIES = {
    'footwear': ['running shoes', 'sneakers', 'nike shoes', 'sports shoes'],
    'apparel': ['winter jacket', 'jeans', 'tshirt', 'hoodie'],
    'electronics': ['smartphone', 'laptop', 'headphones', 'smartwatch'],
    'groceries': ['fresh vegetables', 'organic milk', 'brown rice'],
    'beauty': ['face cream', 'lipstick', 'shampoo', 'moisturizer'],
    'sports': ['gym equipment', 'cricket gear', 'yoga accessories']
}
LOCATIONS = ['mumbai', 'bangalore', 'delhi', 'hyderabad', 'chennai', 'pune']

def generate_events():
    """Generate realistic user behavior events"""
    events = []
    
    print("🎲 Generating dummy events...")
    
    # Generate 500 events across 100 users
    for user_id in USER_IDS[:50]:  # Use 50 users
        category = random.choice(CATEGORIES)
        location = random.choice(LOCATIONS)
        
        # Each user gets 3-8 events
        num_events = random.randint(3, 8)
        
        # Search event (high intent users search more)
        is_high_intent = random.random() > 0.6
        searches = random.randint(2, 5) if is_high_intent else random.randint(1, 2)
        
        for _ in range(searches):
            events.append({
                'userId': user_id,
                'eventType': 'search',
                'category': category,
                'searchQuery': random.choice(SEARCH_QUERIES[category]),
                'location': location,
                'timestamp': (datetime.now() - timedelta(hours=random.randint(1, 48))).isoformat()
            })
        
        # Product views
        views = random.randint(1, 3) if is_high_intent else random.randint(0, 1)
        for _ in range(views):
            events.append({
                'userId': user_id,
                'eventType': 'product_view',
                'category': category,
                'productId': random.choice(PRODUCTS[category]),
                'location': location,
                'timestamp': (datetime.now() - timedelta(hours=random.randint(1, 36))).isoformat()
            })
        
        # Cart/Wishlist (only high intent users)
        if is_high_intent and random.random() > 0.5:
            event_type = random.choice(['cart_add', 'wishlist_add'])
            events.append({
                'userId': user_id,
                'eventType': event_type,
                'category': category,
                'productId': random.choice(PRODUCTS[category]),
                'location': location,
                'timestamp': (datetime.now() - timedelta(hours=random.randint(1, 24))).isoformat()
            })
    
    return events

def ingest_events(events):
    """Send events to backend"""
    print(f"\n📤 Ingesting {len(events)} events to backend...")
    
    success_count = 0
    
    for i, event in enumerate(events):
        try:
            response = requests.post(
                f"{BASE_URL}/ingest?clientId=zepto",
                json=event,
                timeout=5
            )
            if response.status_code == 200:
                success_count += 1
                if (i + 1) % 50 == 0:
                    print(f"✓ Ingested {i + 1}/{len(events)} events...")
        except Exception as e:
            print(f"✗ Error: {e}")
            continue
    
    print(f"\n✅ Successfully ingested {success_count}/{len(events)} events!")

def check_stats():
    """Check intent intelligence stats"""
    try:
        response = requests.get(f"{BASE_URL}/stats?clientId=zepto")
        stats = response.json()
        
        print("\n" + "="*60)
        print("📊 INTENT INTELLIGENCE STATS")
        print("="*60)
        print(f"Total Users: {stats['totalUsers']}")
        print(f"Total Events: {stats['totalEvents']}")
        print(f"Total Scores: {stats['totalScores']}")
        print(f"\nIntent Distribution:")
        print(f"  🔴 High:    {stats['intentDistribution']['high']}")
        print(f"  🟡 Medium:  {stats['intentDistribution']['medium']}")
        print(f"  🔵 Low:     {stats['intentDistribution']['low']}")
        print(f"  ⚪ Minimal: {stats['intentDistribution']['minimal']}")
        print("="*60)
    except Exception as e:
        print(f"✗ Error fetching stats: {e}")

if __name__ == "__main__":
    print("🚀 Intent Intelligence Dummy Data Generator")
    print("="*60)
    
    # Generate events
    events = generate_events()
    
    # Ingest to backend
    ingest_events(events)
    
    # Show stats
    check_stats()
    
    print("\n✨ Done! Check the frontend:")
    print("   - Intent Dashboard: http://localhost:3000/intent")
    print("   - High Intent Users: http://localhost:3000/intent/high-intent")
