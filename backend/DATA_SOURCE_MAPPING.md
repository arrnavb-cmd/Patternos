# PatternOS - Data Source Mapping

## ✅ What Data Comes From Which Database

### 1. Master Dashboard (Zepto/Aggregator View)

#### Top Metrics Cards:
```
✅ Total GMV: ₹6.8Cr
   Source: purchase_database_100k.json
   Calculation: SUM(all purchases.price)

✅ Attributed Revenue: ₹4.8Cr (70.1%)
   Source: purchase_database_100k.json
   Calculation: SUM(purchases where ad_channel != 'organic')

✅ Users Tracked: 30,000
   Source: intent_database_30k.json
   Calculation: COUNT(all users)

✅ High Intent Users: 10,000
   Source: intent_database_30k.json
   Calculation: COUNT(users where intent_level = 'high')
```

#### Platform Revenue:
```
✅ Monthly Retainer: ₹3L
   Source: Hard-coded (contract value)

✅ Ad Commission: ₹7.1L
   Source: purchase_database_100k.json
   Calculation: SUM(purchases.ad_spend) × 0.10

✅ High-Intent Premium: ₹5.7L
   Source: purchase_database_100k.json
   Calculation: SUM(high_intent_purchases.ad_spend) × 0.40 × 0.20

✅ Total: ₹15.9L
   Source: Calculated (₹3L + ₹7.1L + ₹5.7L)
```

#### Revenue Opportunities by Category:
```
✅ Electronics: 1,733 users, ₹21.9L potential
   Source: intent_database_30k.json
   Calculation: 
   - userCount: COUNT(users where category='electronics' AND intent_level='high')
   - revenue: SUM(users.estimated_spend_inr)
   - score: AVG(user.events) normalized to 0.7-0.95

✅ Groceries: 1,679 users, ₹20.9L potential
   Source: intent_database_30k.json

✅ Beauty: 1,669 users, ₹20.8L potential
   Source: intent_database_30k.json

✅ Sports: 1,652 users, ₹20.7L potential
   Source: intent_database_30k.json

✅ Apparel: 1,631 users, ₹20.6L potential
   Source: intent_database_30k.json

✅ Footwear: 1,636 users, ₹20.5L potential
   Source: intent_database_30k.json
```

---

### 2. Analytics Dashboard

#### Platform Overview:
```
✅ Total Ad Spend: ₹163L
   Source: purchase_database_100k.json
   Calculation: SUM(purchases.ad_spend)

✅ Total Revenue: ₹183L
   Source: purchase_database_100k.json
   Calculation: SUM(ad_driven_purchases.price)

✅ Avg ROAS: 1.12x
   Source: Calculated (₹183L / ₹163L)

✅ Channel Performance (Zepto, Facebook, Instagram, Google):
   Source: purchase_database_100k.json
   Group by: purchase.ad_channel
```

#### Brand Analytics:
```
✅ Adidas: ₹12.1L spend, ₹115.3L revenue, 9.56x ROAS
   Source: purchase_database_100k.json
   Filter: purchases where brand = 'adidas'

✅ Lakmé: ₹12.0L spend, ₹115.1L revenue, 9.63x ROAS
   Source: purchase_database_100k.json
   Filter: purchases where brand = 'lakme'

✅ Amul, Nike, Britannia, ITC (same pattern)
   Source: purchase_database_100k.json
```

#### Interactive Comparison:
```
✅ Location (Mumbai, Bangalore, Delhi, etc.):
   Source: purchase_database_100k.json
   Group by: purchase.location

✅ Category (Electronics, Fashion, Groceries, etc.):
   Source: purchase_database_100k.json
   Group by: purchase.category

✅ Age Groups: Uses dummy data (not in database yet)
```

---

### 3. Intent Intelligence Dashboard
```
✅ Total Users: 30,000
   Source: intent_database_30k.json

✅ High Intent: 10,000 users
   Source: intent_database_30k.json
   Filter: intent_level = 'high'

✅ Medium Intent: 12,000 users
   Source: intent_database_30k.json
   Filter: intent_level = 'medium'

✅ Low Intent: 8,000 users
   Source: intent_database_30k.json
   Filter: intent_level = 'low'

✅ High-Intent User List (filtered view):
   Source: intent_database_30k.json
   Shows: user_id, category, estimated_spend, events, location
```

---

## 🔄 Data Flow Architecture
```
┌─────────────────────────────────────────┐
│   purchase_database_100k.json           │
│   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│   • 100,000 purchase records            │
│   • ₹6.83 Cr total GMV                  │
│   • Brand, category, location data      │
│   • Ad spend & channel info             │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│   Backend APIs (FastAPI)                │
│   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│   • /api/v1/analytics/...               │
│   • /api/v1/commerce/...                │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│   Frontend Dashboards (React)           │
│   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│   • Master Dashboard (Aggregator)       │
│   • Analytics Dashboard                 │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│   intent_database_30k.json              │
│   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│   • 30,000 intent user records          │
│   • 10,000 high-intent users            │
│   • Category & location data            │
│   • Estimated spend per user            │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│   Backend APIs (FastAPI)                │
│   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│   • /api/v1/intent/...                  │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│   Frontend Dashboards (React)           │
│   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│   • Master Dashboard (Opportunities)    │
│   • Intent Intelligence Dashboard       │
└─────────────────────────────────────────┘
```

---

## 🎯 For Brand Dashboards (Nike, Adidas, etc.)

When you integrate Brand Dashboards, they will use:

### Nike Dashboard Example:
```javascript
// Filter purchase data for Nike only
const nikeData = purchases.filter(p => p.brand === 'nike')

Metrics:
✅ Nike's Ad Spend: SUM(nikeData.ad_spend)
✅ Nike's Revenue: SUM(nikeData.price)
✅ Nike's ROAS: revenue / ad_spend
✅ Nike's Orders: COUNT(nikeData)
✅ Nike's Channels: GROUP BY nikeData.ad_channel

// Filter intent data for footwear/sports (Nike categories)
const nikeIntentUsers = intentUsers.filter(u => 
  (u.category === 'footwear' || u.category === 'sports') &&
  u.intent_level === 'high'
)

Opportunities:
✅ High-Intent Footwear Users: COUNT(nikeIntentUsers)
✅ Revenue Potential: SUM(nikeIntentUsers.estimated_spend_inr)
✅ Suggested Campaign Spend: Based on ROAS targets
```

---

## 📈 Summary

**ALL dashboard data comes from the 2 databases we created:**

1. **purchase_database_100k.json** (100K records)
   - Powers: GMV, Revenue, ROAS, Brand performance, Channel analytics
   
2. **intent_database_30k.json** (30K users)
   - Powers: Intent stats, Opportunities, High-intent users, Revenue potential

**No dummy data** except:
- ₹3L monthly retainer (contract value)
- Age group breakdown (not in database yet)

**Ready for brand dashboards!** Just filter by brand name. 🎯
