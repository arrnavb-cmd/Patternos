# Google Analytics Style Enhancement Plan

## Phase 1: Aggregator Analytics Enhancement (/analytics)
**Current:** 643 lines, 2 charts
**Target:** Google Analytics professional dashboard

### Enhancements:
1. **Overview Tab:**
   - Keep existing summary cards
   - Add: Time-series line chart (spend/revenue trend)
   - Add: Pie chart (channel distribution)
   - Add: Bar chart (top brands comparison)

2. **Brand Performance Tab:**
   - Existing brand comparison table
   - Add: Horizontal bar chart (brand revenue comparison)
   - Add: Scatter chart (spend vs ROAS by brand)
   - Add: Area chart (brand performance over time)

3. **Channel Analysis Tab:**
   - Existing channel table
   - Add: Donut chart (channel mix)
   - Add: Stacked bar chart (channel performance by brand)
   - Add: Line chart (channel trends)

4. **Attribution Tab:**
   - Multi-touch attribution summary cards
   - Channel contribution pie chart
   - Top conversion paths visualization
   - Brand attribution performance table

## Phase 2: Brand Analytics Enhancement (/brand/{name}/analytics)
**Current:** 369 lines, 11 charts
**Target:** Brand-specific Google Analytics dashboard

### Enhancements:
1. **Overview Tab:**
   - Existing summary cards ✓
   - Add: Revenue vs Spend line chart
   - Add: Performance trend area chart

2. **Campaigns Tab:**
   - Existing campaign table ✓
   - Add: Campaign performance bar chart
   - Add: Intent level distribution pie chart

3. **Products Tab:**
   - Existing top 3 products ✓
   - Existing product table ✓
   - Add: Product revenue treemap
   - Add: Category performance donut chart

4. **Channels Tab:**
   - Existing channel table ✓
   - Existing pie chart ✓
   - Add: Channel trend line chart
   - Add: Channel efficiency scatter chart

5. **Attribution Tab (NEW):**
   - Brand-specific attribution analysis
   - Customer journey visualization
   - Touchpoint analysis

