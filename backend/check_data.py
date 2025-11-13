import json

# Load purchase data
with open('purchase_database_100k.json', 'r') as f:
    purchases = json.load(f)

print(f"Total Orders: {len(purchases):,}")

# Calculate GMV
total_gmv = sum(p['price'] for p in purchases)
print(f"Total GMV: ₹{total_gmv:,} (₹{total_gmv/10000000:.2f} Cr)")

# Ad purchases
ad_purchases = [p for p in purchases if p['ad_channel'] != 'organic']
ad_revenue = sum(p['price'] for p in ad_purchases)
print(f"Ad Revenue: ₹{ad_revenue:,} (₹{ad_revenue/10000000:.2f} Cr) ({ad_revenue/total_gmv*100:.1f}%)")

# High intent purchases
high_intent = [p for p in ad_purchases if p.get('is_high_intent', False)]
high_intent_revenue = sum(p['price'] for p in high_intent)
print(f"High Intent Revenue: ₹{high_intent_revenue:,} (₹{high_intent_revenue/10000000:.2f} Cr) ({high_intent_revenue/total_gmv*100:.1f}%)")

# Normal ad purchases (not high intent)
normal_ad = [p for p in ad_purchases if not p.get('is_high_intent', False)]
normal_ad_revenue = sum(p['price'] for p in normal_ad)
print(f"Normal Ad Revenue: ₹{normal_ad_revenue:,} (₹{normal_ad_revenue/10000000:.2f} Cr) ({normal_ad_revenue/total_gmv*100:.1f}%)")

print(f"\nBreakdown:")
print(f"- High Intent (40% of ad revenue): {high_intent_revenue/ad_revenue*100:.1f}%")
print(f"- Normal Ads (60% of ad revenue): {normal_ad_revenue/ad_revenue*100:.1f}%")

# Check intent data
with open('intent_database_30k.json', 'r') as f:
    intent_users = json.load(f)

high = [u for u in intent_users if u['intent_level'] == 'high']
print(f"\n\nIntent Users:")
print(f"Total: {len(intent_users):,}")
print(f"High Intent: {len(high):,}")

# Opportunities by category
categories = {}
for user in high:
    cat = user['category']
    if cat not in categories:
        categories[cat] = {'users': 0, 'revenue': 0}
    categories[cat]['users'] += 1
    categories[cat]['revenue'] += user['estimated_spend_inr']

print(f"\n\nRevenue Opportunities by Category:")
for cat, data in sorted(categories.items()):
    print(f"{cat}: {data['users']} users, ₹{data['revenue']/100000:.2f}L revenue")
