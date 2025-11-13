#!/usr/bin/env python3
"""
Load real Zepto campaign data into PatternOS database
"""
import pandas as pd
import sqlite3

print("🚀 Loading Real Campaign Data into PatternOS")
print("=" * 70)

# Load all datasets
print("\n📂 Loading datasets...")
ad_spend_df = pd.read_csv('data/zepto_ad_spend_daily.csv')
campaigns_df = pd.read_csv('data/campaigns_master.csv')
attribution_df = pd.read_csv('data/ad_attribution_allocations.csv')
sku_targeting_df = pd.read_csv('data/campaign_sku_targeting.csv')

print(f"  ✅ Ad Spend: {len(ad_spend_df):,} daily records")
print(f"  ✅ Campaigns: {len(campaigns_df):,} campaigns")
print(f"  ✅ Attributions: {len(attribution_df):,} order attributions")
print(f"  ✅ SKU Targeting: {len(sku_targeting_df):,} campaign-SKU mappings")

# Calculate key metrics
print("\n📊 Campaign Metrics:")
total_spend = campaigns_df['spend_value'].sum()
total_impressions = ad_spend_df['impressions'].sum()
total_clicks = ad_spend_df['clicks'].sum()
total_conversions = ad_spend_df['conversions'].sum()

print(f"  Total Ad Spend: ₹{total_spend:,.2f} ({total_spend/10000000:.2f} Cr)")
print(f"  Total Impressions: {total_impressions:,}")
print(f"  Total Clicks: {total_clicks:,}")
print(f"  Total Conversions: {total_conversions:,}")
print(f"  Avg CTR: {(total_clicks/total_impressions*100):.2f}%")
print(f"  Avg CVR: {(total_conversions/total_clicks*100):.2f}%")

# Load into database
print("\n💾 Loading into PatternOS database...")
conn = sqlite3.connect('patternos_campaign_data.db')

# Create tables
conn.execute('''
CREATE TABLE IF NOT EXISTS ad_spend_daily (
    spend_id TEXT PRIMARY KEY,
    date TEXT,
    campaign_id TEXT,
    brand TEXT,
    category TEXT,
    channel TEXT,
    sku_id TEXT,
    impressions INTEGER,
    clicks INTEGER,
    conversions INTEGER,
    spend_value REAL,
    intent_level TEXT
)
''')

conn.execute('''
CREATE TABLE IF NOT EXISTS campaigns_master (
    campaign_id TEXT PRIMARY KEY,
    brand TEXT,
    category TEXT,
    intent_level TEXT,
    channel TEXT,
    start_date TEXT,
    end_date TEXT,
    spend_value REAL
)
''')

conn.execute('''
CREATE TABLE IF NOT EXISTS ad_attribution (
    order_id TEXT,
    campaign_id TEXT,
    attributed_spend REAL,
    attribution_method TEXT
)
''')

conn.execute('''
CREATE TABLE IF NOT EXISTS campaign_sku_targeting (
    campaign_id TEXT,
    sku_id TEXT
)
''')

# Load data
ad_spend_df.to_sql('ad_spend_daily', conn, if_exists='replace', index=False)
campaigns_df.to_sql('campaigns_master', conn, if_exists='replace', index=False)
attribution_df.to_sql('ad_attribution', conn, if_exists='replace', index=False)
sku_targeting_df.to_sql('campaign_sku_targeting', conn, if_exists='replace', index=False)

conn.commit()
conn.close()

print("  ✅ All data loaded into database")

# Calculate ROAS by brand
print("\n🎯 ROAS by Brand:")
brand_performance = ad_spend_df.groupby('brand').agg({
    'spend_value': 'sum',
    'conversions': 'sum',
    'impressions': 'sum',
    'clicks': 'sum'
}).round(2)

# Estimate revenue (assuming avg order value of ₹500)
brand_performance['estimated_revenue'] = brand_performance['conversions'] * 500
brand_performance['roas'] = (brand_performance['estimated_revenue'] / brand_performance['spend_value']).round(2)
brand_performance = brand_performance.sort_values('roas', ascending=False)

print(brand_performance.head(10).to_string())

print("\n" + "=" * 70)
print("✅ DATA LOAD COMPLETE!")
print("=" * 70)
