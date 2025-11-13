# CRITICAL: Frontend Files Overwritten - Restoration Guide

## ✅ GOOD NEWS: DATA IS SAFE!

### Database Status:
- **patternos_dw.db**: 292MB - INTACT ✓
- **489,525 customers** in dim_customer table ✓
- Columns: customer_id, platform, city, age_group, brands, categories, total_spent, avg_order_value, order_count
- Sample: GLOBAL000001, GLOBAL000002, etc.

### Other Databases:
- intent_intelligence.db (183MB) ✓
- patternos_campaign_data.db (21MB) ✓
- patternos.db (152KB) ✓

## ❌ PROBLEM: Frontend Files Overwritten at 6:01 PM

All .jsx files in frontend/src/pages/ were modified at Nov 13 18:01
Lost connections to:
- Dashboard with 489K customers
- Analytics with revenue data
- Campaigns management
- Ad Approval workflow
- Create Campaign flow

## �� WHAT NEEDS TO BE REBUILT:

### 1. Dashboard.jsx
Must fetch from: http://localhost:8000/api/customers/stats
Show: 489,525 total customers, brands, cities, age groups

### 2. Analytics.jsx  
Must fetch from: patternos_dw.db via API
Show: Revenue, orders, customer segments

### 3. BrandDashboard.jsx
Filter by brand from localStorage
Show only that brand's customers/revenue

### 4. Campaigns.jsx
Connect to patternos_campaign_data.db
Show active/completed campaigns

### 5. CreateCampaign.jsx
Full campaign creation flow
Target audience from dim_customer table

### 6. Intelligence Pages (COMPLETED - DON'T TOUCH):
- Behavioral.jsx ✓
- Visual.jsx ✓  
- Voice.jsx ✓
- Data file: frontend/public/intelligence_dashboards.json ✓

## 🔧 BACKEND API ENDPOINTS NEEDED:
```python
# app/main.py or app/routes/customers.py
@app.get("/api/customers/stats")
async def get_customer_stats():
    # Query dim_customer table
    total = db.execute("SELECT COUNT(*) FROM dim_customer").fetchone()[0]
    return {"total_customers": total, ...}

@app.get("/api/customers/by-brand/{brand}")
async def get_customers_by_brand(brand: str):
    # Filter by brand column
    
@app.get("/api/revenue/summary")
async def get_revenue_summary():
    # Aggregate total_spent from dim_customer
```

## 📝 BACKUP FILES FOUND (but all from 18:01):
- Dashboard.jsx.backup
- Dashboard.jsx.backup2
- Analytics.jsx.backup
- BrandDashboard.jsx (multiple backups)
- All modified at same time :(

## 🎯 NEXT CHAT INSTRUCTIONS:

1. **Check backend**: Does app/main.py have customer API routes?
2. **Create API routes** if missing to query patternos_dw.db
3. **Rebuild Dashboard.jsx** to connect to API
4. **Rebuild Analytics.jsx** to show revenue data
5. **Rebuild BrandDashboard.jsx** with brand filtering
6. **Test with brand login**: Should only show that brand's data
7. **DON'T TOUCH** intelligence pages - they work!

## 💾 DATABASE SCHEMA:
```sql
-- dim_customer table
customer_id TEXT (GLOBAL000001, GLOBAL000002...)
platform TEXT (SWIGGY,ZEPTO comma-separated)
city TEXT (Warangal, Bengaluru, Mumbai...)
age_group TEXT (25-34, 35-44, 55+...)
brands INTEGER (number of brands purchased from)
categories INTEGER (number of categories)
total_spent REAL (total revenue from customer)
avg_order_value REAL
order_count INTEGER
```

## 🔑 KEY POINTS:
- Database has 489K customers, NOT 1.1M (maybe we calculated wrong earlier)
- All data has brand, city, age, revenue info
- Backend API must filter by brand for privacy
- Aggregator sees all, brands see only their data
- Intelligence pillars are separate and WORKING

---
**Status**: Data safe, frontend needs API reconnection
**Priority**: Backend API → Dashboard → Analytics → Campaigns
**Time**: Should take 2-3 hours to rebuild connections
