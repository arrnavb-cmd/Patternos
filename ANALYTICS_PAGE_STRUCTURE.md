# Aggregator Analytics Page Structure

## Data Sources (ALL from APIs):
1. Platform Summary: /api/v1/analytics/platform-summary
2. Channel Performance: /api/v1/analytics/channel-performance  
3. Brand Comparison: /api/v1/analytics/brand-comparison
4. Monthly Trends: /api/v1/analytics/monthly-trends
5. Category Comparison: /api/v1/analytics/category-comparison
6. Location Comparison: /api/v1/analytics/location-comparison

## Tabs:
1. Platform Overview (default)
   - 4 Summary Cards (Spend, Revenue, ROAS, Clicks)
   - Line Chart: Monthly Spend Trend
   - Bar Chart: Channel Conversions
   - Pie Chart: Channel Distribution
   - Area Chart: Impressions & Clicks
   
2. Brand Comparison
   - Brand comparison table with real data
   - Horizontal Bar Chart: Brand Revenue
   - Scatter Chart: Spend vs ROAS
   
3. Comparison (Location/Category/Age)
   - Interactive comparison with dropdowns
   - Existing functionality maintained

## State Variables Needed:
- platformSummary (from API)
- channelData (from API)
- brandData (from API)
- monthlyTrends (from API)
- categoryData (from API)
- locationData (from API)

## NO HARDCODED DATA - All from database via APIs
