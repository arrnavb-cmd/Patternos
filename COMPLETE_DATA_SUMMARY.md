# PatternOS - Complete Data Inventory

## 📊 DATABASE 1: patternos_dw.db (292MB)
**Table: dim_customer**
- **489,525 customers** across multiple platforms
- Columns: global_customer_id, platforms_list, primary_city, primary_age_group, total_platforms, total_transactions, lifetime_value, avg_order_value, purchase_count
- Platforms: SWIGGY, ZEPTO (comma-separated list)
- Sample LTV: ₹10,000 - ₹24,000 per customer

## 📊 DATABASE 2: intent_intelligence.db (183MB)
**Table: user_events** - 52,000 events
- Platforms: zepto, swiggy, bigbasket, blinkit, (Amazon, MMT, Nykaa, Chumbak, CarWale likely here too)
- Events: page_view, add_to_cart, purchase
- Categories: Fashion, Books, Electronics, Beauty
- Tracking: user_id, product_id, timestamp

**Table: intent_scores** - 21,000 scores
- Intent levels: Low (0.2), Medium (0.56, 0.66), High
- User details: email, device (mobile/desktop), city
- Categories tracked per user
- Event counts, page views, cart additions

**Other Tables:**
- ad_campaigns
- ad_impressions  
- campaigns
- opportunities
- purchases

## 📊 DATABASE 3: patternos_campaign_data.db (21MB)
- ad_attribution
- ad_spend_daily
- campaign_sku_targeting
- campaigns_master

## 📊 DATABASE 4: patternos.db (152KB)
- audience_segments
- campaigns
- campaign_performance_logs
- intent_scores
- user_profiles
- events
- vw_master_intent_summary (view)

## 🎯 PLATFORMS WITH DATA:
✅ Zepto
✅ Swiggy
✅ BigBasket
✅ Blinkit
❓ Amazon (check user_events table)
❓ MMT (check user_events table)
❓ Nykaa (check user_events table)
❓ Chumbak (check user_events table)
❓ CarWale (check user_events table)

## 💡 WHAT THIS ENABLES:

### Cross-Platform Customer Journey:
- Track user from Swiggy → Zepto → BigBasket
- 489K unified customer profiles
- Multi-platform purchase behavior

### Intent Intelligence:
- 21,000 users scored for purchase intent
- 52,000 behavioral events tracked
- Real-time intent calculation

### Campaign Attribution:
- Ad impressions tracked
- Spend by day
- SKU-level targeting
- Performance metrics

## 🔧 FRONTEND PAGES THAT NEED THIS DATA:

1. **Dashboard** → dim_customer (489K customers, LTV, platforms)
2. **Analytics** → dim_customer (revenue), ad_spend_daily
3. **Intent Dashboard** → intent_scores, user_events
4. **Campaigns** → campaigns_master, campaign_performance_logs
5. **High Intent Users** → intent_scores WHERE intent_level = 'High'
6. **Audience Segments** → audience_segments table

## ⚠️ CURRENT STATUS:
- ✅ All data intact in databases
- ❌ Frontend connections broken (overwritten at 6:01 PM)
- ❌ API routes may need rebuilding
- ✅ Intelligence pillars working (Visual, Voice, Behavioral)

## 🎯 NEXT STEPS:
1. Verify all platforms in user_events table
2. Check if backend API routes exist
3. Rebuild frontend connections to databases
4. Test cross-platform customer journey visualization
5. Ensure brand privacy filtering (brands see only their data)

---
**Total Data**: ~600K+ records across all databases
**Platforms**: 5-9 platforms (Swiggy, Zepto, BigBasket, Blinkit + more)
**Ready for**: Intent prediction, cross-platform attribution, customer journey mapping
