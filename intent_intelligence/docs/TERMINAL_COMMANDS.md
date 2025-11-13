# PatternOS Intent Intelligence - Terminal Commands Cheat Sheet

## 🚀 Complete Installation (Copy & Paste)

### Step 1: Setup Directory Structure
```bash
cd /Users/arrnavb/Desktop/ARRNAVB/SaaS/PatternOS

# Create intent intelligence directory
mkdir -p intent_intelligence/{docs,schema,etl,ml,queries,integration}

echo "✅ Directory structure created"
```

### Step 2: Copy Files from Outputs
```bash
# Copy ETL script
cp /mnt/user-data/outputs/etl_load_sample_data.py intent_intelligence/etl/

# Copy SQL schema
cp /mnt/user-data/outputs/PatternOS_Unified_Schema.sql intent_intelligence/schema/

# Copy integration script
cp /mnt/user-data/outputs/integrate_intent_intelligence.py intent_intelligence/integration/

# Copy documentation
cp /mnt/user-data/outputs/PatternOS_Data_Warehouse_Documentation.md intent_intelligence/docs/
cp /mnt/user-data/outputs/Executive_Summary.md intent_intelligence/docs/
cp /mnt/user-data/outputs/Implementation_Checklist.md intent_intelligence/docs/
cp /mnt/user-data/outputs/SETUP_GUIDE.md intent_intelligence/docs/

# Copy queries
cp /mnt/user-data/outputs/PatternOS_Analytics_Queries.sql intent_intelligence/queries/

# Copy ML notebook
cp /mnt/user-data/outputs/PatternOS_ML_Training_Notebook.md intent_intelligence/ml/

echo "✅ All files copied"
```

### Step 3: Run ETL (Load Sample Data)
```bash
cd /Users/arrnavb/Desktop/ARRNAVB/SaaS/PatternOS

# Run ETL to create patternos_dw.db
python3 intent_intelligence/etl/etl_load_sample_data.py

# Expected: Creates patternos_dw.db with ~700 transactions
# Wait for: "✅ ETL Complete!" message
```

### Step 4: Integrate with Existing Dashboards
```bash
# Run integration script
python3 intent_intelligence/integration/integrate_intent_intelligence.py

# This creates:
# - intent_scores table in patternos.db
# - vw_master_dashboard_intent view
# - vw_brand_intent_summary view
# - api_intent_endpoints.py file
# - IntentMetrics.jsx component file
```

### Step 5: Add API Endpoints to Backend
```bash
# Open main.py
nano app/main.py

# OR use VS Code
code app/main.py

# Add the endpoints from api_intent_endpoints.py
# (Copy the content and paste before "if __name__ == '__main__'")
```

### Step 6: Create Frontend Component
```bash
# Copy the generated component
cp IntentMetrics.jsx frontend/src/components/

# OR create manually
nano frontend/src/components/IntentMetrics.jsx
# (Paste the component code)
```

### Step 7: Update Master Dashboard
```bash
# Edit Master Dashboard
nano frontend/src/pages/aggregator/MasterDashboard.jsx

# Add at top:
# import IntentMetricsSummary from '../../components/IntentMetrics';

# Add in render (after existing metrics):
# <IntentMetricsSummary />
```

### Step 8: Restart Services
```bash
cd /Users/arrnavb/Desktop/ARRNAVB/SaaS/PatternOS

# Kill existing services
pkill -f uvicorn
pkill -f "npm.*dev"

# Start backend
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &

# Start frontend
cd frontend
npm run dev &

# Wait for startup
sleep 5

echo "✅ Services restarted!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
```

## ✅ Verify Installation

### Test API Endpoints
```bash
# Test intent summary endpoint
curl http://localhost:8000/api/master/intent-summary | python3 -m json.tool

# Test high intent users
curl "http://localhost:8000/api/master/high-intent-users?limit=5" | python3 -m json.tool

# Test brand metrics (replace 'Nike' with your brand)
curl http://localhost:8000/api/brand/Nike/intent-metrics | python3 -m json.tool
```

### Check Database
```bash
# Open intent DW database
sqlite3 patternos_dw.db

# Run some queries
.tables
SELECT COUNT(*) FROM dim_customer;
SELECT COUNT(*) FROM intent_score;
SELECT intent_level, COUNT(*) FROM intent_score GROUP BY intent_level;
.exit

# Check main database for integration
sqlite3 patternos.db
.tables
SELECT COUNT(*) FROM intent_scores;
.exit
```

### Check Frontend
```bash
# Open browser
open http://localhost:3000

# You should see:
# - Master Dashboard with Intent Intelligence section
# - 4 new metric cards (Total Users, High Intent, Medium Intent, Avg Score)
```

## 🔧 Troubleshooting Commands

### If ETL fails
```bash
# Check if CSV files exist
ls -la /mnt/user-data/uploads/*.csv

# Check Python dependencies
pip3 list | grep -E "(pandas|numpy|sqlite)"

# Install if missing
pip3 install pandas numpy

# Re-run ETL
python3 intent_intelligence/etl/etl_load_sample_data.py
```

### If integration fails
```bash
# Check if patternos.db exists
ls -la patternos.db

# Check if patternos_dw.db was created
ls -la patternos_dw.db

# Re-run integration
python3 intent_intelligence/integration/integrate_intent_intelligence.py
```

### If API endpoints don't work
```bash
# Check if uvicorn is running
ps aux | grep uvicorn

# Check API logs
tail -f nohup.out

# Test basic endpoint
curl http://localhost:8000/docs

# Restart backend
pkill -f uvicorn
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
```

### If frontend doesn't show intent metrics
```bash
# Check if component file exists
ls -la frontend/src/components/IntentMetrics.jsx

# Check frontend console
# Open browser DevTools (F12) and check Console tab

# Restart frontend
cd frontend
pkill -f "npm.*dev"
npm run dev &
```

## 📊 Useful Database Queries

### Check Intent Data
```bash
sqlite3 patternos_dw.db << EOF
-- Intent distribution
SELECT 
    intent_level,
    COUNT(*) AS users,
    ROUND(AVG(intent_score), 3) AS avg_score
FROM intent_score
GROUP BY intent_level;

-- Top 10 high intent users
SELECT 
    global_customer_id,
    intent_score,
    purchase_probability_7d
FROM intent_score
WHERE intent_level = 'high'
ORDER BY intent_score DESC
LIMIT 10;

-- Cross-platform users
SELECT 
    global_customer_id,
    COUNT(DISTINCT platform_id) AS platforms
FROM dim_customer_identity
GROUP BY global_customer_id
HAVING platforms > 1
LIMIT 10;
EOF
```

### Check Integration
```bash
sqlite3 patternos.db << EOF
-- Check intent_scores table
SELECT COUNT(*) AS total_scores FROM intent_scores;

-- Check master dashboard view
SELECT * FROM vw_master_dashboard_intent LIMIT 5;

-- Check brand summary view
SELECT * FROM vw_brand_intent_summary LIMIT 5;
EOF
```

## 🎯 Quick Tests

### Full Stack Test
```bash
cd /Users/arrnavb/Desktop/ARRNAVB/SaaS/PatternOS

# 1. Check backend health
curl http://localhost:8000/health

# 2. Check intent API
curl http://localhost:8000/api/master/intent-summary

# 3. Check frontend
curl http://localhost:3000

# 4. Check database
sqlite3 patternos_dw.db "SELECT COUNT(*) FROM intent_score;"

echo "✅ All systems checked!"
```

## 📁 File Locations Summary

```
/Users/arrnavb/Desktop/ARRNAVB/SaaS/PatternOS/
├── intent_intelligence/
│   ├── etl/
│   │   └── etl_load_sample_data.py         ← Load sample data
│   ├── integration/
│   │   └── integrate_intent_intelligence.py ← Link with dashboards
│   ├── docs/
│   │   ├── SETUP_GUIDE.md                   ← This guide
│   │   ├── Executive_Summary.md             ← Business overview
│   │   └── PatternOS_Data_Warehouse_Documentation.md
│   ├── schema/
│   │   └── PatternOS_Unified_Schema.sql     ← Database schema
│   └── queries/
│       └── PatternOS_Analytics_Queries.sql  ← Sample queries
├── app/
│   └── main.py                              ← Add API endpoints here
├── frontend/
│   └── src/
│       ├── components/
│       │   └── IntentMetrics.jsx            ← New component
│       └── pages/aggregator/
│           └── MasterDashboard.jsx          ← Update this
├── patternos.db                             ← Existing database
└── patternos_dw.db                          ← NEW: Intent DW
```

## 🎉 All Done!

Run these commands in order and you'll have:
✅ Intent Intelligence data warehouse
✅ Cross-platform user linking
✅ Intent scores for all customers
✅ New API endpoints
✅ Updated Master Dashboard with intent metrics

**Next:** Open http://localhost:3000 and see your Intent Intelligence in action!

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| Start Backend | `python3 -m uvicorn app.main:app --reload` |
| Start Frontend | `cd frontend && npm run dev` |
| Check DB | `sqlite3 patternos_dw.db` |
| Test API | `curl http://localhost:8000/api/master/intent-summary` |
| View Logs | `tail -f nohup.out` |
| Kill Services | `pkill -f uvicorn && pkill -f npm` |

---

**Need help?** Check SETUP_GUIDE.md in intent_intelligence/docs/
