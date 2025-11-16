# PHASE 3: CAMPAIGN MANAGEMENT

## Current State:
- Campaigns.jsx - Basic campaign list (needs redesign)
- AggregatorCampaigns.jsx - Shows Zepto + All brand campaigns
- CreateCampaign.jsx - Multi-step campaign creation

## What We Need to Build:

### 1. AGGREGATOR CAMPAIGN PAGE (/campaigns)
**Google Analytics + The Trade Desk inspired UI**
- List of ALL campaigns (Zepto's own + Brand campaigns)
- Filters: Brand, Channel, Status, Date Range
- Metrics: Spend, Revenue, ROAS, CTR, Conversions
- Actions: View, Pause/Resume, Download Report
- Real data from campaigns_master table

### 2. CREATE CAMPAIGN PAGE (/campaigns/create)
**Google Ads inspired multi-step wizard**

Step 1: SELECT PRODUCTS
- Search/browse products from sku_library
- Filter by category, brand
- Multi-select products
- Show product details (name, category, price)

Step 2: CAMPAIGN DETAILS (existing)
- Campaign name
- Budget & dates
- Objectives

Step 3: TARGETING (existing)
- Channels (YouTube, Google, OTT, etc.)
- Demographics
- Intent level

Step 4: CREATIVES (existing)
- Ad formats
- Upload assets
- AI-generated options

Step 5: REVIEW & LAUNCH
- Summary of all settings
- Budget breakdown
- Launch campaign

### 3. BRAND CAMPAIGN PAGE (/brand/{name}/campaigns)
- Show only brand's campaigns
- Same UI as aggregator but filtered
- Create campaign button

## Data Sources:
- campaigns_master table (297 campaigns)
- sku_library table (10,000 products)
- ad_spend_daily table (performance data)

Ready to build?
