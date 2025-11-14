# DATA CONNECTION PLAN - ONE SECTION AT A TIME

## SECTION 1: PatternOS Platform Revenue
**Current Status:** Using ad_spend_daily (4,069 records)
**Should Use:** ad_spend_daily for ad spend tracking
**Calculation:**
- Monthly Retainer: ₹3L fixed
- High-Intent Premium (20%): SUM(spend_value WHERE intent_level='High') * 0.20
- Ad Commission (10%): SUM(spend_value WHERE intent_level IN ('Medium','Low')) * 0.10
**Period Filter:** WHERE date >= date(max_date, '-X days')
**Status:** ✅ Correct dataset, needs period filtering

## SECTION 2: Revenue Opportunities by Category
**Current Status:** Using intent_intelligence.db → intent_scores
**Dataset:** intent_scores (21,000 users)
**Query:**
```sql
SELECT 
    category,
    COUNT(DISTINCT user_id) as users,
    AVG(intent_score) as avg_intent_score,
    SUM(CASE WHEN intent_level='High' THEN 1 ELSE 0 END) as high_intent_users
FROM intent_scores
WHERE intent_score >= 0.7
GROUP BY category
```
**Status:** ✅ Already using correct dataset!

## SECTION 3: Top 5 Brand Performance
**Current Status:** Using ad_spend_daily JOIN sku_library
**Dataset:** ad_spend_daily (4,069 records) + sku_library (10,000 SKUs)
**Query:**
```sql
SELECT 
    a.brand,
    SUM(a.spend_value) as ad_spend,
    SUM(a.conversions * COALESCE(s.selling_price, 500)) as revenue,
    SUM(a.conversions) as purchases,
    SUM(a.clicks) as clicks,
    SUM(a.impressions) as impressions
FROM ad_spend_daily a
LEFT JOIN sku_library s ON a.sku_id = s.sku_id
WHERE a.date >= date(max_date, '-X days')
GROUP BY a.brand
ORDER BY ad_spend DESC
LIMIT 5
```
**Status:** ✅ Correct datasets, has period filtering

## WHAT'S MISSING:
Only Section 1 (Platform Revenue) needs period filtering added to queries.

## NEXT STEP:
Shall I add period filtering to Platform Revenue API only?
