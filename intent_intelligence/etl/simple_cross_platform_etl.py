#!/usr/bin/env python3
"""
Simplified Cross-Platform ETL - Works with any CSV structure
"""
import pandas as pd
import sqlite3
from datetime import datetime
import random

print("🚀 PatternOS Cross-Platform ETL (Simplified)")
print("=" * 60)

# Load all CSV files
csv_files = {
    'ZEPTO': 'data/csv_samples/Zepto_sample.csv',
    'SWIGGY': 'data/csv_samples/Swiggy_sample.csv',
    'AMAZON': 'data/csv_samples/Amazon_sample.csv',
    'NYKAA': 'data/csv_samples/Nykaa_sample.csv',
    'CHUMBAK': 'data/csv_samples/Chumbak_sample.csv',
    'MMT': 'data/csv_samples/MMT_sample.csv',
    'CARWALE': 'data/csv_samples/CarWale_sample.csv'
}

all_data = []
for platform_id, file_path in csv_files.items():
    try:
        df = pd.read_csv(file_path)
        df['platform_id'] = platform_id
        all_data.append(df)
        print(f"✅ Loaded {platform_id}: {len(df)} records")
    except Exception as e:
        print(f"⚠️  Skipped {platform_id}: {e}")

# Combine all data
combined_df = pd.concat(all_data, ignore_index=True)
print(f"\n📊 Total records: {len(combined_df)}")

# Create database
conn = sqlite3.connect('patternos_dw.db')

# Create global customer IDs with cross-platform linking
unique_customers = []
global_ids = []

for i in range(len(combined_df)):
    # Simulate customer linking - 30% chance to be multi-platform
    if random.random() < 0.3 and len(unique_customers) > 0:
        # Link to existing customer
        global_id = random.choice(unique_customers)
    else:
        # New customer
        global_id = f"GLOBAL{len(unique_customers)+1:06d}"
        unique_customers.append(global_id)
    
    global_ids.append(global_id)

combined_df['global_customer_id'] = global_ids

# Save to database
combined_df.to_sql('raw_transactions', conn, if_exists='replace', index=False)

# Create customer dimension - CONVERT LIST TO STRING
customers_temp = combined_df.groupby('global_customer_id').agg({
    'platform_id': lambda x: list(x.unique())
}).reset_index()

# Convert list to comma-separated string
customers = pd.DataFrame({
    'global_customer_id': customers_temp['global_customer_id'],
    'platforms_list': customers_temp['platform_id'].apply(lambda x: ','.join(x)),
    'total_platforms': customers_temp['platform_id'].apply(len)
})

customers.to_sql('dim_customer', conn, if_exists='replace', index=False)

# Create intent scores
intent_scores = []
for _, customer in customers.iterrows():
    score = 0.3 + (customer['total_platforms'] * 0.15)
    score = min(score, 1.0)
    
    intent_scores.append({
        'global_customer_id': customer['global_customer_id'],
        'intent_score': round(score, 4),
        'intent_level': 'high' if score >= 0.7 else ('medium' if score >= 0.4 else 'low'),
        'purchase_probability_7d': round(score * 0.8, 4),
        'purchase_probability_30d': round(score * 0.9, 4),
        'scoring_timestamp': datetime.now().isoformat()
    })

intent_df = pd.DataFrame(intent_scores)
intent_df.to_sql('intent_score', conn, if_exists='replace', index=False)

conn.commit()

# Summary
multi_platform = customers[customers['total_platforms'] > 1]

print("\n" + "=" * 60)
print("✅ ETL COMPLETE!")
print("=" * 60)
print(f"\n📊 Summary:")
print(f"  - Total Transactions: {len(combined_df)}")
print(f"  - Unique Customers: {len(unique_customers)}")
print(f"  - Single Platform: {len(customers[customers['total_platforms']==1])}")
print(f"  - Multi-Platform: {len(multi_platform)} ({len(multi_platform)/len(customers)*100:.1f}%)")
print(f"  - High Intent: {len(intent_df[intent_df['intent_level']=='high'])}")
print(f"  - Medium Intent: {len(intent_df[intent_df['intent_level']=='medium'])}")
print(f"  - Low Intent: {len(intent_df[intent_df['intent_level']=='low'])}")

# Show sample cross-platform customers
print(f"\n📋 Sample Cross-Platform Customers:")
for _, row in multi_platform.head(5).iterrows():
    print(f"  {row['global_customer_id']}: {row['platforms_list']}")

conn.close()
print(f"\n💾 Database created: patternos_dw.db")
print("\n🎉 Ready to use!")
