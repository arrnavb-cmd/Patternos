"""
Generate Two Separate Databases:
1. Purchase Database (100,000 completed orders)
2. Intent Intelligence Database (30,000 potential customers)
"""
import json
import random
from datetime import datetime, timedelta

# Configuration
AD_CHANNELS = ['zepto', 'facebook', 'instagram', 'google_display']
BRANDS = ['Nike', 'Adidas', 'Britannia', 'Lakmé', 'ITC', 'Amul']
CATEGORIES = ['footwear', 'apparel', 'electronics', 'beauty', 'groceries', 'sports']
LOCATIONS = ['mumbai', 'bangalore', 'delhi', 'hyderabad', 'chennai', 'pune', 'kolkata', 'ahmedabad']

def generate_purchase_database():
    """Generate 100,000 completed purchases"""
    print("📦 Generating Purchase Database (100,000 orders)...")
    
    purchases = []
    end_date = datetime.now()
    start_date = end_date - timedelta(days=90)
    
    # Total GMV: ₹1.2Cr = 12,000,000
    # 70% from ads = 8,400,000
    # 40% from high-intent ads = 3,360,000
    # 60% from normal ads = 5,040,000
    # 30% organic = 3,600,000
    
    for i in range(100000):
        # Random date in last 90 days
        days_ago = random.randint(0, 90)
        purchase_date = end_date - timedelta(
            days=days_ago,
            hours=random.randint(0, 23),
            minutes=random.randint(0, 59)
        )
        
        brand = random.choice(BRANDS)
        category = random.choice(CATEGORIES)
        
        # Determine source: 70% ads, 30% organic
        is_from_ad = random.random() < 0.70
        
        if is_from_ad:
            # 40% high-intent, 60% normal targeting
            is_high_intent = random.random() < 0.40
            ad_channel = random.choice(AD_CHANNELS)
        else:
            is_high_intent = False
            ad_channel = 'organic'
        
        # Average order value: ₹120 (12,000,000 / 100,000)
        # Vary between ₹50 to ₹5000
        base_price = 120
        price = int(random.gauss(base_price, base_price * 0.8))
        price = max(50, min(5000, price))  # Clamp between 50-5000
        
        # Ad spend only if from ads
        if is_from_ad:
            # Ad spend is 10-20% of price
            ad_spend = int(price * random.uniform(0.10, 0.20))
        else:
            ad_spend = 0
        
        purchase = {
            'order_id': f"ORD_{str(i+1).zfill(6)}",
            'user_id': f"user_{str(random.randint(1, 100000)).zfill(6)}",
            'product_id': f"SKU_{random.randint(1000, 9999)}",
            'brand': brand,
            'category': category,
            'price': price,
            'ad_channel': ad_channel,
            'is_high_intent': is_high_intent,
            'ad_spend': ad_spend,
            'purchase_date': purchase_date.strftime('%Y-%m-%d'),
            'purchase_datetime': purchase_date.isoformat(),
            'location': random.choice(LOCATIONS)
        }
        
        purchases.append(purchase)
    
    return purchases

def generate_intent_database():
    """Generate ~30,000 users with purchase intent"""
    print("🎯 Generating Intent Intelligence Database (30,000 potential customers)...")
    
    intent_users = []
    
    # High Intent: 10,000 users
    for i in range(10000):
        user = generate_intent_user(i, 'high')
        intent_users.append(user)
    
    # Medium Intent: 12,000 users
    for i in range(10000, 22000):
        user = generate_intent_user(i, 'medium')
        intent_users.append(user)
    
    # Low Intent: 8,000 users
    for i in range(22000, 30000):
        user = generate_intent_user(i, 'low')
        intent_users.append(user)
    
    return intent_users

def generate_intent_user(index, intent_level):
    """Generate a single intent user"""
    
    # Events count based on intent level
    if intent_level == 'high':
        events = random.randint(20, 60)
        estimated_spend = random.randint(500, 2000)
    elif intent_level == 'medium':
        events = random.randint(10, 25)
        estimated_spend = random.randint(200, 800)
    else:  # low
        events = random.randint(5, 15)
        estimated_spend = random.randint(50, 300)
    
    category = random.choice(CATEGORIES)
    
    return {
        'user_id': f"intent_user_{str(index+1).zfill(5)}",
        'intent_level': intent_level,
        'events': events,
        'category': category,
        'estimated_spend_inr': estimated_spend,
        'location': random.choice(LOCATIONS),
        'last_activity': (datetime.now() - timedelta(hours=random.randint(1, 72))).isoformat()
    }

def main():
    """Generate both databases"""
    
    # Generate Purchase Database
    purchases = generate_purchase_database()
    with open('purchase_database_100k.json', 'w') as f:
        json.dump(purchases, f, indent=2)
    
    # Calculate stats
    total_gmv = sum(p['price'] for p in purchases)
    ad_purchases = [p for p in purchases if p['ad_channel'] != 'organic']
    ad_revenue = sum(p['price'] for p in ad_purchases)
    high_intent_revenue = sum(p['price'] for p in ad_purchases if p['is_high_intent'])
    total_ad_spend = sum(p['ad_spend'] for p in purchases)
    
    print(f"\n✅ Purchase Database Complete!")
    print(f"   Total Orders: {len(purchases):,}")
    print(f"   Total GMV: ₹{total_gmv/100000:.2f}L")
    print(f"   Ad Revenue: ₹{ad_revenue/100000:.2f}L ({ad_revenue/total_gmv*100:.1f}%)")
    print(f"   High-Intent Revenue: ₹{high_intent_revenue/100000:.2f}L")
    print(f"   Total Ad Spend: ₹{total_ad_spend/100000:.2f}L")
    
    # Channel breakdown
    channel_stats = {}
    for p in ad_purchases:
        ch = p['ad_channel']
        if ch not in channel_stats:
            channel_stats[ch] = {'count': 0, 'revenue': 0, 'spend': 0}
        channel_stats[ch]['count'] += 1
        channel_stats[ch]['revenue'] += p['price']
        channel_stats[ch]['spend'] += p['ad_spend']
    
    print(f"\n   📊 Channel Breakdown:")
    for ch, stats in sorted(channel_stats.items()):
        print(f"      {ch}: {stats['count']:,} orders, ₹{stats['revenue']/100000:.2f}L revenue")
    
    # Generate Intent Database
    intent_users = generate_intent_database()
    with open('intent_database_30k.json', 'w') as f:
        json.dump(intent_users, f, indent=2)
    
    high_intent = len([u for u in intent_users if u['intent_level'] == 'high'])
    medium_intent = len([u for u in intent_users if u['intent_level'] == 'medium'])
    low_intent = len([u for u in intent_users if u['intent_level'] == 'low'])
    
    print(f"\n✅ Intent Database Complete!")
    print(f"   Total Users: {len(intent_users):,}")
    print(f"   High Intent: {high_intent:,}")
    print(f"   Medium Intent: {medium_intent:,}")
    print(f"   Low Intent: {low_intent:,}")
    
    print(f"\n📁 Files Created:")
    print(f"   1. purchase_database_100k.json (100,000 orders)")
    print(f"   2. intent_database_30k.json (30,000 potential customers)")

if __name__ == "__main__":
    main()
