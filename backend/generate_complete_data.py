"""
Complete Data Generator for PatternOS
Generates realistic data for Intent Intelligence testing
"""
import requests
import random
from datetime import datetime, timedelta
import time

BASE_URL = "http://localhost:8001/api/v1/intent"

# User pools by category
USER_POOLS = {
    'footwear': [f"user_fw_{str(i).zfill(4)}" for i in range(1, 501)],  # 500 users
    'apparel': [f"user_ap_{str(i).zfill(4)}" for i in range(1, 401)],   # 400 users
    'electronics': [f"user_el_{str(i).zfill(4)}" for i in range(1, 351)],
    'groceries': [f"user_gr_{str(i).zfill(4)}" for i in range(1, 301)],
    'beauty': [f"user_be_{str(i).zfill(4)}" for i in range(1, 281)],
    'sports': [f"user_sp_{str(i).zfill(4)}" for i in range(1, 201)]
}

PRODUCTS = {
    'footwear': {
        'nike': ['nike_air_max_270', 'nike_react_infinity', 'nike_pegasus_40', 'nike_jordan_1'],
        'adidas': ['adidas_ultraboost', 'adidas_nmd', 'adidas_yeezy', 'adidas_superstar'],
        'puma': ['puma_rs_x', 'puma_future_rider', 'puma_suede_classic']
    },
    'apparel': {
        'nike': ['nike_dri_fit_tshirt', 'nike_tech_fleece_hoodie', 'nike_sportswear_jacket'],
        'adidas': ['adidas_essentials_hoodie', 'adidas_training_pants', 'adidas_tshirt']
    },
    'electronics': {
        'samsung': ['samsung_galaxy_s24', 'samsung_tv_55inch', 'samsung_buds_pro'],
        'apple': ['iphone_15_pro', 'apple_watch_series_9', 'airpods_pro_2']
    },
    'beauty': {
        'lakme': ['lakme_9to5_lipstick', 'lakme_absolute_foundation', 'lakme_kajal'],
        'ponds': ['ponds_white_beauty_cream', 'ponds_age_miracle', 'ponds_pure_detox']
    },
    'groceries': {
        'amul': ['amul_butter', 'amul_milk', 'amul_cheese'],
        'maggi': ['maggi_masala_noodles', 'maggi_sauces', 'maggi_pasta']
    },
    'sports': {
        'nike': ['nike_football', 'nike_gym_bag', 'nike_water_bottle']
    }
}

SEARCH_QUERIES = {
    'footwear': ['running shoes', 'sneakers', 'sports shoes', 'nike shoes', 'casual footwear', 'gym shoes'],
    'apparel': ['winter jacket', 'hoodies', 'sportswear', 'activewear', 'track pants'],
    'electronics': ['smartphone', 'smart tv', 'wireless earbuds', 'smartwatch', 'tablet'],
    'beauty': ['lipstick', 'foundation', 'face cream', 'kajal', 'moisturizer'],
    'groceries': ['milk', 'butter', 'noodles', 'cheese', 'pasta sauce'],
    'sports': ['football', 'gym equipment', 'sports accessories', 'water bottle']
}

LOCATIONS = ['mumbai', 'bangalore', 'delhi', 'hyderabad', 'chennai', 'pune', 'kolkata', 'ahmedabad']

def generate_user_journey(user_id, category):
    """Generate realistic user journey with multiple events"""
    events = []
    
    # Determine user intent level
    intent_type = random.choices(
        ['high', 'medium', 'low'],
        weights=[0.25, 0.45, 0.30]  # 25% high intent, 45% medium, 30% low
    )[0]
    
    location = random.choice(LOCATIONS)
    base_time = datetime.now() - timedelta(hours=random.randint(1, 72))
    
    # Event counts based on intent
    if intent_type == 'high':
        num_searches = random.randint(3, 6)
        num_views = random.randint(3, 6)
        num_cart_adds = random.randint(1, 2)
    elif intent_type == 'medium':
        num_searches = random.randint(2, 3)
        num_views = random.randint(1, 3)
        num_cart_adds = random.randint(0, 1)
    else:
        num_searches = random.randint(1, 2)
        num_views = random.randint(0, 1)
        num_cart_adds = 0
    
    # Generate searches
    for i in range(num_searches):
        events.append({
            'userId': user_id,
            'eventType': 'search',
            'category': category,
            'searchQuery': random.choice(SEARCH_QUERIES[category]),
            'location': location,
            'timestamp': (base_time + timedelta(minutes=i*15)).isoformat()
        })
    
    # Generate product views
    brand = random.choice(list(PRODUCTS[category].keys()))
    for i in range(num_views):
        events.append({
            'userId': user_id,
            'eventType': 'product_view',
            'category': category,
            'productId': random.choice(PRODUCTS[category][brand]),
            'location': location,
            'timestamp': (base_time + timedelta(minutes=30 + i*20)).isoformat()
        })
    
    # Generate cart adds for high intent users
    for i in range(num_cart_adds):
        events.append({
            'userId': user_id,
            'eventType': 'cart_add',
            'category': category,
            'productId': random.choice(PRODUCTS[category][brand]),
            'location': location,
            'timestamp': (base_time + timedelta(minutes=120 + i*30)).isoformat()
        })
    
    return events

def ingest_events(events):
    """Send events to backend"""
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
                if (i + 1) % 100 == 0:
                    print(f"✓ Ingested {i + 1}/{len(events)} events...")
        except Exception as e:
            continue
    
    return success_count

def generate_all_data():
    """Generate complete dataset"""
    print("=" * 80)
    print("�� PATTERNOS COMPLETE DATA GENERATOR")
    print("=" * 80)
    print()
    
    all_events = []
    
    # Generate events for each category
    for category, users in USER_POOLS.items():
        print(f"📦 Generating {category} events...")
        
        # Sample users (not all, to make it realistic)
        active_users = random.sample(users, int(len(users) * 0.6))  # 60% active
        
        for user_id in active_users:
            events = generate_user_journey(user_id, category)
            all_events.extend(events)
    
    print(f"\n✅ Generated {len(all_events)} total events")
    print(f"📊 Users: {sum(len(users) for users in USER_POOLS.values())}")
    print(f"📍 Categories: {len(USER_POOLS)}")
    print()
    
    # Ingest events
    print("📤 Ingesting events to backend...")
    success_count = ingest_events(all_events)
    
    print()
    print("=" * 80)
    print(f"✅ Successfully ingested {success_count}/{len(all_events)} events")
    print("=" * 80)
    print()
    
    # Show stats
    print("📊 Fetching Intent Intelligence stats...")
    time.sleep(2)
    
    try:
        response = requests.get(f"{BASE_URL}/stats?clientId=zepto")
        stats = response.json()
        
        print()
        print("=" * 80)
        print("📊 INTENT INTELLIGENCE STATS")
        print("=" * 80)
        print(f"Total Users: {stats['totalUsers']}")
        print(f"Total Events: {stats['totalEvents']}")
        print(f"Total Scores: {stats['totalScores']}")
        print()
        print("Intent Distribution:")
        print(f"  🔴 High:    {stats['intentDistribution']['high']} users")
        print(f"  🟡 Medium:  {stats['intentDistribution']['medium']} users")
        print(f"  🔵 Low:     {stats['intentDistribution']['low']} users")
        print(f"  ⚪ Minimal: {stats['intentDistribution']['minimal']} users")
        print("=" * 80)
        print()
        print("✨ Data generation complete!")
        print()
        print("🎯 Next Steps:")
        print("   1. Visit: http://localhost:3000/intent")
        print("   2. Login as: admin@zepto.com")
        print("   3. Explore Intent Intelligence Dashboard")
        print("=" * 80)
    except Exception as e:
        print(f"⚠️  Could not fetch stats: {e}")

if __name__ == "__main__":
    generate_all_data()
