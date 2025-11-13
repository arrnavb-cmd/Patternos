#!/usr/bin/env python3
"""
Simple Intent Intelligence ETL - Auto-detects your database schema
"""
import sqlite3
import pandas as pd
from datetime import datetime

print("🚀 PatternOS Intent Intelligence - Quick Setup")
print("=" * 60)

# Connect to your existing database
conn = sqlite3.connect('patternos.db')

print("\n1. Detecting database schema...")
# Get actual column names
cursor = conn.cursor()
cursor.execute("PRAGMA table_info(campaigns)")
columns = [row[1] for row in cursor.fetchall()]
print(f"   ✅ Found columns: {', '.join(columns)}")

print("\n2. Loading existing campaigns...")
# Load with actual columns
campaigns = pd.read_sql_query("SELECT * FROM campaigns WHERE status = 'ACTIVE'", conn)
print(f"   ✅ Loaded {len(campaigns)} active campaigns")

print("\n3. Calculating intent scores...")
# Calculate intent score based on available data
if 'revenue_generated' in campaigns.columns and 'spent_amount' in campaigns.columns:
    roas = campaigns['revenue_generated'] / campaigns['spent_amount'].replace(0, 1)
    intent_from_roas = (roas / 10).clip(0, 0.5)
else:
    intent_from_roas = 0.3

if 'conv_rate' in campaigns.columns:
    intent_from_conv = (campaigns['conv_rate'] / 100).clip(0, 0.5)
elif 'conversions' in campaigns.columns and 'impressions' in campaigns.columns:
    intent_from_conv = (campaigns['conversions'] / campaigns['impressions'].replace(0, 1)).clip(0, 0.5)
else:
    intent_from_conv = 0.2

campaigns['intent_score'] = (intent_from_roas + intent_from_conv).clip(0, 1.0).round(4)

# Classify intent levels
campaigns['intent_level'] = campaigns['intent_score'].apply(
    lambda x: 'high' if x >= 0.7 else ('medium' if x >= 0.4 else 'low')
)

# Add probability scores
campaigns['purchase_probability_7d'] = (campaigns['intent_score'] * 0.8).round(4)
campaigns['purchase_probability_30d'] = (campaigns['intent_score'] * 0.9).round(4)
campaigns['scoring_timestamp'] = datetime.now().isoformat()

print(f"   ✅ Intent scores calculated")
print(f"      - High intent: {len(campaigns[campaigns['intent_level']=='high'])}")
print(f"      - Medium intent: {len(campaigns[campaigns['intent_level']=='medium'])}")
print(f"      - Low intent: {len(campaigns[campaigns['intent_level']=='low'])}")

print("\n4. Creating intent_scores table...")
# Prepare columns to save
cols_to_save = ['id', 'intent_score', 'intent_level', 
                'purchase_probability_7d', 'purchase_probability_30d', 'scoring_timestamp']

# Add name column if it exists
if 'name' in campaigns.columns:
    cols_to_save.insert(1, 'name')
elif 'campaign_name' in campaigns.columns:
    cols_to_save.insert(1, 'campaign_name')

# Save to database
campaigns[cols_to_save].to_sql('intent_scores', conn, if_exists='replace', index=False)
print("   ✅ Table created: intent_scores")

print("\n5. Creating dashboard views...")

# Create view for Master Dashboard
conn.execute("""
    CREATE VIEW IF NOT EXISTS vw_master_intent_summary AS
    SELECT 
        COUNT(*) AS total_campaigns,
        COUNT(CASE WHEN intent_level = 'high' THEN 1 END) AS high_intent,
        COUNT(CASE WHEN intent_level = 'medium' THEN 1 END) AS medium_intent,
        COUNT(CASE WHEN intent_level = 'low' THEN 1 END) AS low_intent,
        AVG(intent_score) AS avg_intent_score,
        AVG(purchase_probability_7d) AS avg_purchase_prob_7d
    FROM intent_scores
""")

conn.commit()
print("   ✅ Views created")

print("\n6. Verification...")
result = pd.read_sql_query("SELECT * FROM vw_master_intent_summary", conn)
print("\n📊 Intent Summary:")
print(f"   Total Campaigns: {int(result['total_campaigns'].iloc[0])}")
print(f"   High Intent: {int(result['high_intent'].iloc[0])}")
print(f"   Medium Intent: {int(result['medium_intent'].iloc[0])}")
print(f"   Low Intent: {int(result['low_intent'].iloc[0])}")
print(f"   Avg Intent Score: {result['avg_intent_score'].iloc[0]:.3f}")

# Show sample
print("\n📋 Sample Intent Scores:")
sample = pd.read_sql_query("SELECT * FROM intent_scores LIMIT 5", conn)
print(sample.to_string(index=False))

conn.close()

print("\n" + "=" * 60)
print("✅ SETUP COMPLETE!")
print("=" * 60)
