#!/usr/bin/env python3
"""
PatternOS Intent Intelligence Integration
Links the unified data warehouse with Master Dashboard and Brand Dashboard
"""

import sqlite3
import pandas as pd
from datetime import datetime, timedelta
import json

# Configuration
PATTERNOS_DB = 'patternos.db'  # Your existing database
INTENT_DW_DB = 'patternos_dw.db'  # New intent intelligence database

def integrate_intent_with_master_dashboard():
    """
    Create view/table in patternos.db linking campaigns to intent scores
    """
    print("🔗 Integrating Intent Intelligence with Master Dashboard...")
    
    # Connect to both databases
    conn_main = sqlite3.connect(PATTERNOS_DB)
    conn_dw = sqlite3.connect(INTENT_DW_DB)
    
    # Load intent scores from DW
    intent_df = pd.read_sql_query("""
        SELECT 
            global_customer_id,
            platform_id,
            intent_score,
            intent_level,
            purchase_probability_7d,
            purchase_probability_30d,
            scoring_timestamp
        FROM intent_score
        WHERE scoring_timestamp >= date('now', '-7 days')
    """, conn_dw)
    
    # Load customer identity mapping
    identity_df = pd.read_sql_query("""
        SELECT 
            global_customer_id,
            platform_id,
            platform_customer_id
        FROM dim_customer_identity
    """, conn_dw)
    
    # Merge to get platform-specific customer IDs
    intent_with_ids = intent_df.merge(
        identity_df,
        on=['global_customer_id', 'platform_id'],
        how='left'
    )
    
    # Create intent_scores table in main database
    intent_with_ids.to_sql('intent_scores', conn_main, if_exists='replace', index=False)
    
    # Create view for Master Dashboard
    conn_main.execute("""
        CREATE VIEW IF NOT EXISTS vw_master_dashboard_intent AS
        SELECT 
            c.brand_name,
            c.campaign_name,
            c.spent_amount,
            c.revenue_generated,
            c.clicks,
            c.impressions,
            c.conversions,
            c.ctr,
            c.conv_rate,
            
            -- Intent metrics
            AVG(i.intent_score) AS avg_intent_score,
            COUNT(CASE WHEN i.intent_level = 'high' THEN 1 END) AS high_intent_users,
            COUNT(CASE WHEN i.intent_level = 'medium' THEN 1 END) AS medium_intent_users,
            COUNT(CASE WHEN i.intent_level = 'low' THEN 1 END) AS low_intent_users,
            AVG(i.purchase_probability_7d) AS avg_purchase_prob_7d
            
        FROM campaigns c
        LEFT JOIN intent_scores i ON c.platform_customer_id = i.platform_customer_id
        WHERE c.status = 'ACTIVE'
        GROUP BY c.brand_name, c.campaign_name
    """)
    
    conn_main.commit()
    conn_main.close()
    conn_dw.close()
    
    print("✅ Master Dashboard integration complete!")
    print(f"   - Created 'intent_scores' table with {len(intent_with_ids)} records")
    print("   - Created 'vw_master_dashboard_intent' view")

def integrate_intent_with_brand_dashboard():
    """
    Add intent intelligence to brand-specific views
    """
    print("\n🔗 Integrating Intent Intelligence with Brand Dashboard...")
    
    conn_main = sqlite3.connect(PATTERNOS_DB)
    conn_dw = sqlite3.connect(INTENT_DW_DB)
    
    # Create brand-level intent summary
    conn_main.execute("""
        CREATE VIEW IF NOT EXISTS vw_brand_intent_summary AS
        SELECT 
            c.brand_name,
            
            -- Campaign performance
            COUNT(DISTINCT c.id) AS total_campaigns,
            SUM(c.spent_amount) AS total_spent,
            SUM(c.revenue_generated) AS total_revenue,
            
            -- Intent metrics
            COUNT(DISTINCT i.global_customer_id) AS total_users_scored,
            COUNT(CASE WHEN i.intent_level = 'high' THEN 1 END) AS high_intent_users,
            COUNT(CASE WHEN i.intent_level = 'medium' THEN 1 END) AS medium_intent_users,
            COUNT(CASE WHEN i.intent_level = 'low' THEN 1 END) AS low_intent_users,
            
            AVG(i.intent_score) AS avg_intent_score,
            AVG(i.purchase_probability_7d) AS avg_purchase_prob_7d,
            
            -- Intent-driven revenue
            SUM(CASE WHEN i.intent_level = 'high' THEN c.revenue_generated ELSE 0 END) AS high_intent_revenue,
            SUM(CASE WHEN i.intent_level = 'high' THEN c.spent_amount ELSE 0 END) AS high_intent_spend
            
        FROM campaigns c
        LEFT JOIN intent_scores i ON c.platform_customer_id = i.platform_customer_id
        WHERE c.status = 'ACTIVE'
        GROUP BY c.brand_name
    """)
    
    conn_main.commit()
    conn_main.close()
    conn_dw.close()
    
    print("✅ Brand Dashboard integration complete!")
    print("   - Created 'vw_brand_intent_summary' view")

def create_intent_api_endpoints():
    """
    Create API endpoints for Master and Brand dashboards
    """
    print("\n📡 Creating API endpoints...")
    
    api_code = '''
# Add these endpoints to app/main.py

from fastapi import FastAPI, HTTPException
import sqlite3
import pandas as pd

@app.get("/api/master/intent-summary")
async def get_master_intent_summary():
    """Get intent metrics for Master Dashboard"""
    conn = sqlite3.connect("patternos.db")
    
    query = """
        SELECT 
            COUNT(DISTINCT global_customer_id) AS total_users,
            COUNT(CASE WHEN intent_level = 'high' THEN 1 END) AS high_intent,
            COUNT(CASE WHEN intent_level = 'medium' THEN 1 END) AS medium_intent,
            COUNT(CASE WHEN intent_level = 'low' THEN 1 END) AS low_intent,
            AVG(intent_score) AS avg_intent_score
        FROM intent_scores
        WHERE scoring_timestamp >= date('now', '-7 days')
    """
    
    result = pd.read_sql_query(query, conn)
    conn.close()
    
    return result.to_dict('records')[0]

@app.get("/api/master/high-intent-users")
async def get_high_intent_users(limit: int = 1000):
    """Get list of high intent users for targeting"""
    conn = sqlite3.connect("patternos.db")
    
    query = """
        SELECT 
            i.global_customer_id,
            i.platform_id,
            i.platform_customer_id,
            i.intent_score,
            i.purchase_probability_7d,
            i.purchase_probability_30d,
            i.scoring_timestamp
        FROM intent_scores i
        WHERE i.intent_level = 'high'
        ORDER BY i.intent_score DESC
        LIMIT ?
    """
    
    result = pd.read_sql_query(query, conn, params=(limit,))
    conn.close()
    
    return result.to_dict('records')

@app.get("/api/brand/{brand_name}/intent-metrics")
async def get_brand_intent_metrics(brand_name: str):
    """Get intent metrics for a specific brand"""
    conn = sqlite3.connect("patternos.db")
    
    query = """
        SELECT 
            brand_name,
            total_users_scored,
            high_intent_users,
            medium_intent_users,
            low_intent_users,
            avg_intent_score,
            avg_purchase_prob_7d,
            high_intent_revenue,
            high_intent_spend
        FROM vw_brand_intent_summary
        WHERE brand_name = ?
    """
    
    result = pd.read_sql_query(query, conn, params=(brand_name,))
    conn.close()
    
    if result.empty:
        raise HTTPException(status_code=404, message=f"Brand {brand_name} not found")
    
    return result.to_dict('records')[0]

@app.get("/api/brand/{brand_name}/high-intent-customers")
async def get_brand_high_intent_customers(brand_name: str, limit: int = 500):
    """Get high intent customers for a specific brand"""
    conn = sqlite3.connect("patternos.db")
    
    query = """
        SELECT 
            i.global_customer_id,
            i.platform_customer_id,
            i.intent_score,
            i.purchase_probability_7d,
            c.campaign_name
        FROM intent_scores i
        JOIN campaigns c ON i.platform_customer_id = c.platform_customer_id
        WHERE c.brand_name = ?
        AND i.intent_level = 'high'
        ORDER BY i.intent_score DESC
        LIMIT ?
    """
    
    result = pd.read_sql_query(query, conn, params=(brand_name, limit))
    conn.close()
    
    return result.to_dict('records')
'''
    
    with open('api_intent_endpoints.py', 'w') as f:
        f.write(api_code)
    
    print("✅ Created 'api_intent_endpoints.py'")
    print("   Copy these endpoints to app/main.py")

def update_frontend_components():
    """
    Create React components for displaying intent metrics
    """
    print("\n🎨 Creating frontend components...")
    
    component_code = '''
// Add to frontend/src/components/IntentMetrics.jsx

import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, Brain } from 'lucide-react';

export const IntentMetricsSummary = () => {
  const [intentData, setIntentData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/master/intent-summary')
      .then(res => res.json())
      .then(data => setIntentData(data));
  }, []);

  if (!intentData) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border border-orange-700 rounded-xl p-6">
        <Brain className="w-8 h-8 text-orange-400 mb-3" />
        <p className="text-3xl font-bold text-white mb-1">{intentData.high_intent}</p>
        <p className="text-sm text-gray-400">High Intent Users</p>
        <p className="text-xs text-orange-400 mt-2">Ready to purchase (≥0.7 score)</p>
      </div>

      <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border border-yellow-700 rounded-xl p-6">
        <Users className="w-8 h-8 text-yellow-400 mb-3" />
        <p className="text-3xl font-bold text-white mb-1">{intentData.medium_intent}</p>
        <p className="text-sm text-gray-400">Medium Intent Users</p>
        <p className="text-xs text-yellow-400 mt-2">Considering purchase (0.4-0.7 score)</p>
      </div>

      <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700 rounded-xl p-6">
        <TrendingUp className="w-8 h-8 text-blue-400 mb-3" />
        <p className="text-3xl font-bold text-white mb-1">{intentData.avg_intent_score.toFixed(3)}</p>
        <p className="text-sm text-gray-400">Average Intent Score</p>
        <p className="text-xs text-blue-400 mt-2">Across all users</p>
      </div>
    </div>
  );
};

// Use in Master Dashboard:
// import { IntentMetricsSummary } from './components/IntentMetrics';
// <IntentMetricsSummary />
'''
    
    with open('IntentMetrics.jsx', 'w') as f:
        f.write(component_code)
    
    print("✅ Created 'IntentMetrics.jsx'")
    print("   Copy to frontend/src/components/")

def main():
    """
    Main integration script
    """
    print("=" * 70)
    print("PatternOS Intent Intelligence Integration")
    print("=" * 70)
    
    # Step 1: Integrate with Master Dashboard
    integrate_intent_with_master_dashboard()
    
    # Step 2: Integrate with Brand Dashboard
    integrate_intent_with_brand_dashboard()
    
    # Step 3: Create API endpoints
    create_intent_api_endpoints()
    
    # Step 4: Create frontend components
    update_frontend_components()
    
    print("\n" + "=" * 70)
    print("✅ Integration Complete!")
    print("=" * 70)
    
    print("\nNext Steps:")
    print("1. Copy API endpoints from 'api_intent_endpoints.py' to 'app/main.py'")
    print("2. Copy 'IntentMetrics.jsx' to 'frontend/src/components/'")
    print("3. Restart FastAPI server: pkill uvicorn && uvicorn app.main:app --reload")
    print("4. Refresh your frontend")
    print("\n🎉 Your dashboards now have Intent Intelligence!")

if __name__ == "__main__":
    main()
