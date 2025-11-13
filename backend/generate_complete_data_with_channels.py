"""
Enhanced Data Generator with Ad Channels and Purchase Dates
"""
import json
import random
from datetime import datetime, timedelta

# Ad Channels
AD_CHANNELS = ['zepto', 'facebook', 'instagram', 'google_display']
CHANNEL_WEIGHTS = [0.45, 0.25, 0.20, 0.10]  # Zepto 45%, Facebook 25%, Instagram 20%, Google 10%

BRANDS = ['Nike', 'Adidas', 'Britannia', 'Lakmé', 'ITC', 'Amul']
CATEGORIES = ['footwear', 'apparel', 'electronics', 'beauty', 'groceries', 'sports']
LOCATIONS = ['mumbai', 'bangalore', 'delhi', 'hyderabad', 'chennai', 'pune']

def generate_purchase_data():
    """Generate purchase data with dates and ad channels"""
    purchases = []
    
    # Generate purchases for last 90 days
    end_date = datetime.now()
    start_date = end_date - timedelta(days=90)
    
    # Generate 1000 purchases
    num_purchases = 1000
    
    for i in range(num_purchases):
        # Random date in last 90 days
        days_ago = random.randint(0, 90)
        purchase_date = end_date - timedelta(
            days=days_ago,
            hours=random.randint(0, 23),
            minutes=random.randint(0, 59)
        )
        
        brand = random.choice(BRANDS)
        category = random.choice(CATEGORIES)
        
        # Select ad channel
        ad_channel = random.choices(AD_CHANNELS, weights=CHANNEL_WEIGHTS)[0]
        
        # Generate price based on category
        price_ranges = {
            'footwear': (2000, 15000),
            'apparel': (500, 5000),
            'electronics': (10000, 80000),
            'beauty': (200, 3000),
            'groceries': (50, 500),
            'sports': (500, 8000)
        }
        
        price = random.randint(*price_ranges.get(category, (500, 5000)))
        
        # Ad spend is roughly 10-20% of price
        ad_spend = int(price * random.uniform(0.10, 0.20))
        
        purchase = {
            'user_id': f"user_{str(i).zfill(4)}",
            'product_id': f"product_{random.randint(1000, 9999)}",
            'brand': brand,
            'category': category,
            'price': price,
            'ad_spend': ad_spend,
            'ad_channel': ad_channel,
            'purchase_date': purchase_date.strftime('%Y-%m-%d'),
            'purchase_datetime': purchase_date.isoformat(),
            'location': random.choice(LOCATIONS),
            'clicked_ad': random.random() < 0.7,  # 70% clicked an ad
            'impressions': random.randint(1, 5)
        }
        
        purchases.append(purchase)
    
    return purchases

def main():
    """Generate and save purchase data"""
    purchases = generate_purchase_data()
    
    # Save to JSON file (current directory since we're in backend/)
    with open('purchase_data_with_channels.json', 'w') as f:
        json.dump(purchases, f, indent=2)
    
    print(f"✅ Generated {len(purchases)} purchases with ad channels and dates")
    print(f"📁 Saved to: purchase_data_with_channels.json")
    
    # Print summary by channel
    channel_summary = {}
    total_spend = 0
    total_revenue = 0
    
    for purchase in purchases:
        channel = purchase['ad_channel']
        if channel not in channel_summary:
            channel_summary[channel] = {
                'count': 0,
                'spend': 0,
                'revenue': 0,
                'impressions': 0,
                'clicks': 0
            }
        
        channel_summary[channel]['count'] += 1
        channel_summary[channel]['spend'] += purchase['ad_spend']
        channel_summary[channel]['revenue'] += purchase['price']
        channel_summary[channel]['impressions'] += purchase['impressions']
        if purchase['clicked_ad']:
            channel_summary[channel]['clicks'] += 1
        
        total_spend += purchase['ad_spend']
        total_revenue += purchase['price']
    
    print("\n📊 Summary by Ad Channel:")
    print(f"{'Channel':<20} {'Purchases':<12} {'Ad Spend':<15} {'Revenue':<15} {'ROAS':<8} {'CTR':<8}")
    print("-" * 85)
    
    for channel, data in sorted(channel_summary.items()):
        roas = data['revenue'] / data['spend'] if data['spend'] > 0 else 0
        ctr = (data['clicks'] / data['impressions'] * 100) if data['impressions'] > 0 else 0
        
        print(f"{channel:<20} {data['count']:<12} ₹{data['spend']:>12,} ₹{data['revenue']:>12,} {roas:>6.2f}x {ctr:>6.1f}%")
    
    print("-" * 85)
    overall_roas = total_revenue / total_spend if total_spend > 0 else 0
    print(f"{'TOTAL':<20} {len(purchases):<12} ₹{total_spend:>12,} ₹{total_revenue:>12,} {overall_roas:>6.2f}x")

if __name__ == "__main__":
    main()
