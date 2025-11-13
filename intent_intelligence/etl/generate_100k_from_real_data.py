#!/usr/bin/env python3
"""
Generate 100,000 records per platform based on YOUR actual data structure
"""
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

print("🚀 Generating 1 Lakh Records Per Platform (Based on Your Data)")
print("=" * 70)

RECORDS_PER_PLATFORM = 100000

def generate_records(sample_df, platform_name, id_prefix, records_count=100000):
    """Generate records based on sample structure - handles any schema"""
    print(f"\n📊 Generating {platform_name} ({records_count:,} records)...")
    
    # Detect column names (flexible for different schemas)
    city_col = None
    age_col = None
    state_col = None
    
    for col in sample_df.columns:
        col_lower = col.lower()
        if 'city' in col_lower and city_col is None:
            city_col = col
        if 'age' in col_lower and age_col is None:
            age_col = col
        if 'state' in col_lower and state_col is None:
            state_col = col
    
    # Extract unique values
    cities = sample_df[city_col].unique().tolist() if city_col else ['Mumbai', 'Delhi', 'Bangalore']
    age_groups = sample_df[age_col].unique().tolist() if age_col else ['25-34', '35-44']
    states = sample_df[state_col].unique().tolist() if state_col else ['Maharashtra']
    
    new_records = []
    
    for i in range(records_count):
        record = {}
        
        # Copy structure from sample and generate data
        for col in sample_df.columns:
            if 'customer_id' in col.lower() or col.lower().endswith('_id'):
                record[col] = f"{id_prefix}{i+1:07d}"
            elif 'date' in col.lower():
                days_ago = random.randint(0, 365)
                record[col] = (datetime.now() - timedelta(days=days_ago)).strftime('%Y-%m-%d %H:%M:%S')
            elif col == city_col:
                record[col] = random.choice(cities)
            elif col == age_col:
                record[col] = random.choice(age_groups)
            elif col == state_col:
                record[col] = random.choice(states)
            elif 'pincode' in col.lower() or 'pin' in col.lower():
                record[col] = random.randint(100000, 999999)
            elif 'value' in col.lower() or 'amount' in col.lower() or 'budget' in col.lower() or 'price' in col.lower():
                sample_values = sample_df[col].dropna()
                if len(sample_values) > 0:
                    mean_val = float(sample_values.mean())
                    std_val = float(sample_values.std()) if len(sample_values) > 1 else mean_val * 0.3
                    record[col] = abs(np.random.normal(mean_val, std_val))
                else:
                    record[col] = random.uniform(500, 5000)
            elif 'count' in col.lower():
                record[col] = random.randint(1, 10)
            elif sample_df[col].dtype == 'object':
                unique_vals = sample_df[col].dropna().unique()
                if len(unique_vals) > 0:
                    record[col] = random.choice(unique_vals)
                else:
                    record[col] = 'NA'
            elif sample_df[col].dtype in ['int64', 'float64']:
                sample_values = sample_df[col].dropna()
                if len(sample_values) > 0:
                    record[col] = np.random.choice(sample_values)
                else:
                    record[col] = 0
            else:
                record[col] = None
        
        new_records.append(record)
    
    df = pd.DataFrame(new_records)
    print(f"   ✅ Generated {len(df):,} records with {len(df.columns)} columns")
    return df

# Load samples
zepto_sample = pd.read_csv('data/csv_samples/Zepto_sample.csv')
swiggy_sample = pd.read_csv('data/csv_samples/Swiggy_sample.csv')
amazon_sample = pd.read_csv('data/csv_samples/Amazon_sample.csv')
nykaa_sample = pd.read_csv('data/csv_samples/Nykaa_sample.csv')
chumbak_sample = pd.read_csv('data/csv_samples/Chumbak_sample.csv')
mmt_sample = pd.read_csv('data/csv_samples/MMT_sample.csv')
carwale_sample = pd.read_csv('data/csv_samples/CarWale_sample.csv')

print("\n" + "=" * 70)

# Generate all platforms
zepto_large = generate_records(zepto_sample, "Zepto", "ZEP", RECORDS_PER_PLATFORM)
zepto_large.to_csv('data/csv_samples/Zepto_large.csv', index=False)

swiggy_large = generate_records(swiggy_sample, "Swiggy", "SWG", RECORDS_PER_PLATFORM)
swiggy_large.to_csv('data/csv_samples/Swiggy_large.csv', index=False)

amazon_large = generate_records(amazon_sample, "Amazon", "AMZ", RECORDS_PER_PLATFORM)
amazon_large.to_csv('data/csv_samples/Amazon_large.csv', index=False)

nykaa_large = generate_records(nykaa_sample, "Nykaa", "NYK", RECORDS_PER_PLATFORM)
nykaa_large.to_csv('data/csv_samples/Nykaa_large.csv', index=False)

chumbak_large = generate_records(chumbak_sample, "Chumbak", "CHM", RECORDS_PER_PLATFORM)
chumbak_large.to_csv('data/csv_samples/Chumbak_large.csv', index=False)

mmt_large = generate_records(mmt_sample, "MakeMyTrip", "MMT", RECORDS_PER_PLATFORM)
mmt_large.to_csv('data/csv_samples/MMT_large.csv', index=False)

carwale_large = generate_records(carwale_sample, "CarWale", "CWL", RECORDS_PER_PLATFORM)
carwale_large.to_csv('data/csv_samples/CarWale_large.csv', index=False)

print("\n" + "=" * 70)
print("✅ DATASET GENERATION COMPLETE!")
print("=" * 70)
print(f"\n📊 Total: 700,000 records (100K per platform)")
print(f"\n💾 Saved to data/csv_samples/:")
print("   ✓ Zepto_large.csv")
print("   ✓ Swiggy_large.csv")
print("   ✓ Amazon_large.csv")
print("   ✓ Nykaa_large.csv")
print("   ✓ Chumbak_large.csv")
print("   ✓ MMT_large.csv")
print("   ✓ CarWale_large.csv")

# Show file sizes
import os
total_size = 0
for file in ['Zepto_large.csv', 'Swiggy_large.csv', 'Amazon_large.csv', 
             'Nykaa_large.csv', 'Chumbak_large.csv', 'MMT_large.csv', 'CarWale_large.csv']:
    size = os.path.getsize(f'data/csv_samples/{file}') / (1024*1024)
    total_size += size
    print(f"   {file}: {size:.1f} MB")

print(f"\n📦 Total size: {total_size:.1f} MB")
print("\n🎉 Ready to unify with cross-platform intelligence!")
