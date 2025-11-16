# Brand Analytics Page Structure (e.g., Himalaya)

## Data Sources (Brand-Specific APIs):
1. Summary: /api/v1/brand/{brand}/analytics/summary
2. Channel Performance: /api/v1/brand/{brand}/analytics/channel-performance
3. Campaigns: /api/v1/brand/{brand}/analytics/campaigns
4. Products: /api/v1/brand/{brand}/analytics/products
5. Monthly Trends: /api/v1/brand/{brand}/analytics/monthly-trends

## Tabs:
1. Overview
   - 4 Summary Cards (Spend, Revenue, ROAS, Clicks)
   - Line Chart: Monthly Performance
   - Pie Chart: Channel Distribution
   - Area Chart: Engagement Trends
   
2. Campaigns
   - Campaign performance table
   - Bar Chart: Top Campaigns
   - Pie Chart: Intent Level Distribution
   
3. Products
   - Top 3 product highlights
   - Product table
   - Bar Chart: Product Revenue
   
4. Channels
   - Channel performance table
   - Pie Chart: Channel Mix
   - Bar Chart: Channel Conversions

## Brand Name from Route:
- URL: /brand/Himalaya/analytics
- useParams() -> brandName = "Himalaya"
- All APIs filtered by brandName

## NO HARDCODED DATA
