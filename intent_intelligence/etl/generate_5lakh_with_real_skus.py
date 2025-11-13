#!/usr/bin/env python3
"""
Generate 5 Lakh Realistic Zepto Orders using REAL SKU Library
With Ad Attribution & ROAS Tracking
"""
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

print("🚀 Generating 5 Lakh Zepto Orders with Real SKU Library")
print("=" * 70)

# Load real Zepto SKU library
print("\n📚 Loading Zepto SKU Library...")
sku_df = pd.read_csv('data/zepto_sku_library_10000.csv')
print(f"   ✅ Loaded {len(sku_df):,} SKUs")
print(f"   Categories: {sku_df['category_level_1'].nunique()}")
print(f"   Brands: {sku_df['brand'].nunique()}")

# Configuration
TOTAL_ORDERS = 500000
AVG_ORDER_VALUE = 490
REPEAT_ORDER_RATE = 0.25
START_DATE = datetime(2025, 5, 1)
END_DATE = datetime(2025, 10, 31)
DAYS = (END_DATE - START_DATE).days

# Cities
CITIES = {
    'Mumbai': {'state': 'Maharashtra', 'weight': 0.25},
    'Delhi': {'state': 'Delhi', 'weight': 0.20},
    'Bangalore': {'state': 'Karnataka', 'weight': 0.18},
    'Hyderabad': {'state': 'Telangana', 'weight': 0.12},
    'Chennai': {'state': 'Tamil Nadu', 'weight': 0.10},
    'Pune': {'state': 'Maharashtra', 'weight': 0.08},
    'Kolkata': {'state': 'West Bengal', 'weight': 0.07}
}

# Filter in-stock SKUs
available_skus = sku_df[sku_df['availability_status'] == 'In Stock'].copy()
print(f"   Available SKUs: {len(available_skus):,}")

# Weight SKUs by popularity (rating * review_count)
available_skus['popularity'] = available_skus['rating'] * np.log1p(available_skus['review_count'])
available_skus['weight'] = available_skus['popularity'] / available_skus['popularity'].sum()

# Generate customers
print(f"\n👥 Generating customers...")
total_customers = int(TOTAL_ORDERS / (1 + REPEAT_ORDER_RATE))
customers = []

for i in range(total_customers):
    city = np.random.choice(list(CITIES.keys()), p=[c['weight'] for c in CITIES.values()])
    customers.append({
        'customer_id': f"ZEP{i+1:07d}",
        'city': city,
        'state': CITIES[city]['state'],
        'pincode': random.randint(400001, 700160),
        'age_group': np.random.choice(['18-24', '25-34', '35-44', '45-54', '55+'], 
                                      p=[0.15, 0.40, 0.30, 0.10, 0.05]),
        'order_count': 1
    })

# Mark repeat customers
repeat_indices = random.sample(range(len(customers)), int(len(customers) * REPEAT_ORDER_RATE))
for idx in repeat_indices:
    customers[idx]['order_count'] = random.randint(2, 5)

print(f"   ✅ {len(customers):,} customers ({len(repeat_indices):,} repeat)")

# Generate orders
print(f"\n📦 Generating {TOTAL_ORDERS:,} orders...")

orders = []
order_id = 1

for cust_idx, customer in enumerate(customers):
    for order_num in range(customer['order_count']):
        # Random date/time
        random_day = random.randint(0, DAYS)
        order_date = START_DATE + timedelta(
            days=random_day,
            hours=random.randint(8, 23),
            minutes=random.randint(0, 59)
        )
        
        # Number of items (2-8, weighted toward 3-4)
        num_items = np.random.choice([2, 3, 4, 5, 6, 7, 8], 
                                    p=[0.10, 0.25, 0.30, 0.20, 0.10, 0.03, 0.02])
        
        # Select SKUs (weighted by popularity)
        selected_skus = available_skus.sample(n=num_items, weights='weight', replace=False)
        
        # Calculate order value
        order_value = selected_skus['selling_price'].sum()
        
        # Add variance (±15%)
        order_value *= random.uniform(0.85, 1.15)
        
        # Discount
        discount = order_value * random.uniform(0.05, 0.25)
        
        # Build items list
        items_list = ', '.join([
            f"{row['brand']} {row['sku_name']} {row['size_variant']}"
            for _, row in selected_skus.iterrows()
        ])
        
        # Categories
        categories = selected_skus['category_level_1'].unique()
        dominant_cat = selected_skus['category_level_1'].mode()[0]
        
        orders.append({
            'order_id': f"ZORD{order_id:09d}",
            'customer_id': customer['customer_id'],
            'order_date': order_date.strftime('%Y-%m-%d %H:%M:%S'),
            'city': customer['city'],
            'state': customer['state'],
            'pincode': customer['pincode'],
            'age_group': customer['age_group'],
            'items_purchased_count': num_items,
            'items_list': items_list,
            'sku_ids': ','.join(selected_skus['sku_id'].astype(str)),
            'categories': ','.join(categories),
            'dominant_category': dominant_cat,
            'brands': ','.join(selected_skus['brand'].unique()),
            'order_value': round(order_value, 2),
            'discount_value': round(discount, 2),
            'final_amount': round(order_value - discount, 2),
            'payment_mode': np.random.choice(['UPI', 'Wallet', 'Card', 'COD'], 
                                            p=[0.65, 0.20, 0.12, 0.03]),
            'repeat_order': 'Yes' if order_num > 0 else 'No',
            'delivery_time_minutes': random.randint(10, 30),
            'high_intent_items': int((selected_skus['high_intent_flag'] == True).sum()),
            'avg_item_rating': round(selected_skus['rating'].mean(), 2)
        })
        
        order_id += 1
        
        if order_id % 50000 == 0:
            print(f"   Progress: {order_id:,} orders...")
    
    if (cust_idx + 1) % 50000 == 0:
        print(f"   Processed {cust_idx + 1:,} customers...")

orders_df = pd.DataFrame(orders)

# Adjust to hit target AOV
current_aov = orders_df['order_value'].mean()
adjustment_factor = AVG_ORDER_VALUE / current_aov
orders_df['order_value'] = orders_df['order_value'] * adjustment_factor
orders_df['discount_value'] = orders_df['discount_value'] * adjustment_factor
orders_df['final_amount'] = orders_df['order_value'] - orders_df['discount_value']

print(f"\n✅ Generated {len(orders_df):,} orders")
print(f"   Target AOV: ₹{AVG_ORDER_VALUE}")
print(f"   Actual AOV: ₹{orders_df['order_value'].mean():.2f}")
print(f"   Repeat Rate: {(orders_df['repeat_order']=='Yes').sum()/len(orders_df)*100:.1f}%")

# Save
output_file = 'data/zepto_realistic_5lakh_orders.csv'
orders_df.to_csv(output_file, index=False)

file_size_mb = orders_df.memory_usage(deep=True).sum() / (1024*1024)
print(f"\n💾 Saved: {output_file}")
print(f"   Size: {file_size_mb:.1f} MB")

print("\n📊 Dataset Summary:")
print(f"   Date Range: {orders_df['order_date'].min()} → {orders_df['order_date'].max()}")
print(f"   Total GMV: ₹{orders_df['order_value'].sum()/10000000:.2f} Cr")
print(f"   Unique Customers: {orders_df['customer_id'].nunique():,}")
print(f"   Avg Items per Order: {orders_df['items_purchased_count'].mean():.1f}")

print(f"\n🏙️  Top 5 Cities:")
print(orders_df['city'].value_counts().head())

print(f"\n📦 Top 5 Categories:")
print(orders_df['dominant_category'].value_counts().head())

print(f"\n💳 Payment Distribution:")
print(orders_df['payment_mode'].value_counts())

print("\n" + "=" * 70)
print("✅ DATASET GENERATION COMPLETE!")
print("=" * 70)
print("\n🎯 Next: Generate Ad Spend & Attribution layer")
