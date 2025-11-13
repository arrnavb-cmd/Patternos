with open('app/main.py', 'r') as f:
    lines = f.readlines()

# Find and replace the dashboard stats endpoint
new_lines = []
skip_until_next_route = False

for i, line in enumerate(lines):
    if '@app.get("/api/v1/dashboard/stats")' in line:
        skip_until_next_route = True
        # Add new endpoint with real data
        new_lines.append('@app.get("/api/v1/dashboard/stats")\n')
        new_lines.append('async def dashboard_stats():\n')
        new_lines.append('    try:\n')
        new_lines.append('        # Get real campaign data from database\n')
        new_lines.append('        conn = sqlite3.connect("patternos_campaign_data.db")\n')
        new_lines.append('        \n')
        new_lines.append('        # Total ad spend and conversions\n')
        new_lines.append('        query = "SELECT SUM(spend_value) as total_spend, SUM(conversions) as total_conversions FROM ad_spend_daily"\n')
        new_lines.append('        df = pd.read_sql_query(query, conn)\n')
        new_lines.append('        \n')
        new_lines.append('        total_ad_spend = float(df["total_spend"].iloc[0])\n')
        new_lines.append('        total_conversions = int(df["total_conversions"].iloc[0])\n')
        new_lines.append('        \n')
        new_lines.append('        # Calculate revenue (avg order value ₹490)\n')
        new_lines.append('        total_revenue = total_conversions * 490\n')
        new_lines.append('        total_gmv = total_revenue * 1.15\n')
        new_lines.append('        \n')
        new_lines.append('        # Get user data from orders\n')
        new_lines.append('        orders_df = pd.read_csv("data/zepto_realistic_5lakh_orders.csv")\n')
        new_lines.append('        total_users = orders_df["customer_id"].nunique()\n')
        new_lines.append('        high_intent_users = orders_df[orders_df["high_intent_items"] > 0]["customer_id"].nunique()\n')
        new_lines.append('        \n')
        new_lines.append('        # Calculate PatternOS Revenue (6 months)\n')
        new_lines.append('        monthly_retainer = 300000 * 6  # ₹3L per month × 6 months\n')
        new_lines.append('        ad_commission = total_ad_spend * 0.10  # 10% of total ad spend\n')
        new_lines.append('        \n')
        new_lines.append('        # High-Intent Premium: 20% on high-intent campaigns (35% of spend)\n')
        new_lines.append('        high_intent_spend = total_ad_spend * 0.35\n')
        new_lines.append('        high_intent_premium = high_intent_spend * 0.20\n')
        new_lines.append('        \n')
        new_lines.append('        total_platform_revenue = monthly_retainer + ad_commission + high_intent_premium\n')
        new_lines.append('        \n')
        new_lines.append('        # Monthly breakdown\n')
        new_lines.append('        monthly_retainer_single = 300000\n')
        new_lines.append('        monthly_ad_commission = ad_commission / 6\n')
        new_lines.append('        monthly_high_intent = high_intent_premium / 6\n')
        new_lines.append('        monthly_total = monthly_retainer_single + monthly_ad_commission + monthly_high_intent\n')
        new_lines.append('        \n')
        new_lines.append('        conn.close()\n')
        new_lines.append('        \n')
        new_lines.append('        return {\n')
        new_lines.append('            "total_gmv": float(total_gmv),\n')
        new_lines.append('            "total_revenue": float(total_revenue),\n')
        new_lines.append('            "total_ad_spend": float(total_ad_spend),\n')
        new_lines.append('            "users_tracked": int(total_users),\n')
        new_lines.append('            "high_intent_users": int(high_intent_users),\n')
        new_lines.append('            "patternos_revenue": {\n')
        new_lines.append('                "monthly_retainer": float(monthly_retainer),\n')
        new_lines.append('                "ad_commission": float(ad_commission),\n')
        new_lines.append('                "ad_commission_pct": 10.0,\n')
        new_lines.append('                "high_intent_premium": float(high_intent_premium),\n')
        new_lines.append('                "high_intent_premium_pct": 20.0,\n')
        new_lines.append('                "total": float(total_platform_revenue)\n')
        new_lines.append('            },\n')
        new_lines.append('            "monthly_breakdown": {\n')
        new_lines.append('                "monthly_retainer": float(monthly_retainer_single),\n')
        new_lines.append('                "ad_commission": float(monthly_ad_commission),\n')
        new_lines.append('                "high_intent_premium": float(monthly_high_intent),\n')
        new_lines.append('                "total": float(monthly_total)\n')
        new_lines.append('            }\n')
        new_lines.append('        }\n')
        new_lines.append('    except Exception as e:\n')
        new_lines.append('        return {"error": str(e), "total_gmv": 0, "total_revenue": 0, "users_tracked": 0, "high_intent_users": 0}\n')
        new_lines.append('\n')
        continue
    
    if skip_until_next_route:
        if line.strip().startswith('@app.'):
            skip_until_next_route = False
            new_lines.append(line)
        continue
    
    new_lines.append(line)

with open('app/main.py', 'w') as f:
    f.writelines(new_lines)

print("✅ Updated endpoint with real campaign data")
