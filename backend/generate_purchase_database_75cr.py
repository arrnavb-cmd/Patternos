"""
Generate 100,000 purchases with ₹7.5 Cr GMV
Average order value: ₹750
"""
import json
import random
from datetime import datetime, timedelta

# Ad Channels
AD_CHANNELS = ['zepto', 'facebook', 'instagram', 'google_display']
CHANNEL_WEIGHTS = [0.45, 0.25, 0.20, 0.10]

BRANDS = ['Nike', 'Adidas', 'Britannia', 'Lakmé', 'ITC', 'Amul']
CATEGORIES = ['footwear', 'apparel', 'electronics', 'beauty', 'groceries', 'sports']
LOCATIONS = ['mumbai', 'bangalore', 'delhi', 'hyderabad', 'chennai', 'pune', 'kolkata', 'ahmedabad']

def generate_purchase_database():
    """Generate 100,000 purchases with ₹7.5Cr total GMV"""
    print("📦 Generating Purchase Database (100,000 orders)...")
    
    purchases = []
    end_date = datetime.now()
    start_date = end_date - timedelta(days=90)
    
    # Target: ₹7.5 Cr = 75,000,000
    # 100,000 orders = average ₹750 per order
    
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
            ad_channel = random.choices(AD_CHANNELS, weights=CHANNEL_WEIGHTS)[0]
        else:
            is_high_intent = False
            ad_channel = 'organic'
        
        # Adjusted price ranges to achieve ₹750 average
        price_ranges = {
            'footwear': (200, 1200),      # Avg ~600
            'apparel': (150, 800),        # Avg ~400
            'electronics': (500, 3000),   # Avg ~1500
            'beauty': (100, 600),         # Avg ~300
            'groceries': (50, 400),       # Avg ~200
            'sports': (200, 1000)         # Avg ~500
        }
        
        min_price, max_price = price_ranges.get(category, (150, 800))
        price = random.randint(min_price, max_price)
        
        # Ad spend only if from ads (10-20% of price)
        if is_from_ad:
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

def main():
    """Generate and save purchase data"""
    purchases = generate_purchase_database()
    
    # Save to JSON file
    with open('purchase_database_100k.json', 'w') as f:
        json.dump(purchases, f, indent=2)
    
    # Calculate actual stats
    total_gmv = sum(p['price'] for p in purchases)
    ad_purchases = [p for p in purchases if p['ad_channel'] != 'organic']
    ad_revenue = sum(p['price'] for p in ad_purchases)
    high_intent_revenue = sum(p['price'] for p in ad_purchases if p['is_high_intent'])
    normal_ad_revenue = sum(p['price'] for p in ad_purchases if not p['is_high_intent'])
    total_ad_spend = sum(p['ad_spend'] for p in purchases)
    
    print(f"\n✅ Purchase Database Complete!")
    print(f"   Total Orders: {len(purchases):,}")
    print(f"   Total GMV: ₹{total_gmv/10000000:.2f}Cr (₹{total_gmv:,})")
    print(f"   Average Order Value: ₹{total_gmv/len(purchases):.2f}")
    print(f"\n   Ad Revenue: ₹{ad_revenue/10000000:.2f}Cr ({ad_revenue/total_gmv*100:.1f}%)")
    print(f"   - High-Intent: ₹{high_intent_revenue/10000000:.2f}Cr ({high_intent_revenue/ad_revenue*100:.1f}% of ad revenue)")
    print(f"   - Normal Ads: ₹{normal_ad_revenue/10000000:.2f}Cr ({normal_ad_revenue/ad_revenue*100:.1f}% of ad revenue)")
    print(f"   Total Ad Spend: ₹{total_ad_spend/10000000:.2f}Cr")
    
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
        roas = stats['revenue'] / stats['spend'] if stats['spend'] > 0 else 0
        print(f"      {ch}: {stats['count']:,} orders, ₹{stats['revenue']/10000000:.2f}Cr revenue, ROAS: {roas:.2f}x")
    
    print(f"\n📁 File Updated: purchase_database_100k.json")

if __name__ == "__main__":
    main()
