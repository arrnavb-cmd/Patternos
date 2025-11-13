from fastapi import APIRouter, Query
import json

router = APIRouter()

def load_purchase_data():
    """Load 100K purchase database"""
    try:
        with open('purchase_database_100k.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

@router.get("/dashboard")
async def get_commerce_dashboard(clientId: str = Query('zepto')):
    """Get commerce dashboard - matches MasterDashboard.jsx expectations"""
    
    purchases = load_purchase_data()
    
    # Calculate metrics
    total_gmv = sum(p['price'] for p in purchases)
    
    # Ad-driven purchases
    ad_purchases = [p for p in purchases if p['ad_channel'] != 'organic']
    attributed_revenue = sum(p['price'] for p in ad_purchases)
    
    attribution_rate = (attributed_revenue / total_gmv * 100) if total_gmv > 0 else 0
    
    # Group by brand with detailed stats
    brands = {}
    for p in purchases:
        brand = p['brand']
        if brand not in brands:
            brands[brand] = {
                'brand': brand,
                'revenue': 0,
                'spend': 0,
                'orders': 0,
                'purchases': 0,
                'channels': {}
            }
        
        brands[brand]['revenue'] += p['price']
        brands[brand]['orders'] += 1
        brands[brand]['purchases'] += 1
        
        if p['ad_channel'] != 'organic':
            brands[brand]['spend'] += p['ad_spend']
            
            # Track channels
            channel = p['ad_channel']
            if channel not in brands[brand]['channels']:
                brands[brand]['channels'][channel] = 0
            brands[brand]['channels'][channel] += 1
    
    # Calculate ROAS, CTR, conversion rate for each brand
    for brand_data in brands.values():
        # ROAS
        if brand_data['spend'] > 0:
            brand_data['roas'] = round(brand_data['revenue'] / brand_data['spend'], 2)
        else:
            brand_data['roas'] = 0
        
        # CTR (rough estimate: 3%)
        brand_data['ctr'] = 3.0
        
        # Conversion rate (rough estimate: 2.5%)
        brand_data['conversion_rate'] = 2.5
    
    # Sort brands by revenue
    sorted_brands = sorted(brands.values(), key=lambda x: x['revenue'], reverse=True)
    
    return {
        'summary': {
            'totalRevenue': total_gmv,
            'attributedRevenue': attributed_revenue,
            'attributionRate': round(attribution_rate, 1),
            'totalOrders': len(purchases)
        },
        'brands': sorted_brands[:10]  # Top 10 brands
    }

@router.get("/platform-revenue")
async def get_platform_revenue(clientId: str = Query('zepto')):
    """
    Get platform revenue - CORRECTED MODEL
    Following Amazon/Walmart approach:
    1. Monthly retainer (₹3L)
    2. Ad commission (10% of ALL ad spend)
    3. High-intent premium (20% EXTRA on high-intent campaigns)
    """
    
    purchases = load_purchase_data()
    
    # Ad-driven purchases
    ad_purchases = [p for p in purchases if p['ad_channel'] != 'organic']
    
    # Total ad spend (brands pay this to run campaigns)
    total_ad_spend = sum(p['ad_spend'] for p in ad_purchases)
    
    # STREAM 1: Monthly Platform Access Fee (Fixed)
    monthly_retainer = 300000  # ₹3L
    
    # STREAM 2: Base Ad Commission (10% of ALL ad spend)
    ad_commission_rate = 0.10
    ad_commission_revenue = total_ad_spend * ad_commission_rate
    
    # STREAM 3: High-Intent Campaign Premium
    # Brands pay 20% ADDITIONAL commission for high-intent targeting
    # Assumption: 40% of ad campaigns target high-intent users
    high_intent_campaign_percentage = 0.40
    high_intent_campaign_spend = total_ad_spend * high_intent_campaign_percentage
    high_intent_premium_rate = 0.20  # 20% extra on high-intent campaigns
    high_intent_premium = high_intent_campaign_spend * high_intent_premium_rate
    
    # Total monthly revenue
    total_monthly_revenue = monthly_retainer + ad_commission_revenue + high_intent_premium
    
    # Legacy fields for backward compatibility
    high_intent_purchases = [p for p in ad_purchases if p.get('is_high_intent', False)]
    high_intent_sales = sum(p['price'] for p in high_intent_purchases)
    
    return {
        # New correct model
        "total_monthly_revenue": total_monthly_revenue,
        "monthly_retainer": monthly_retainer,
        "ad_commission_revenue": ad_commission_revenue,
        "ad_commission_rate_percent": ad_commission_rate * 100,
        "high_intent_premium": high_intent_premium,
        "high_intent_premium_rate_percent": high_intent_premium_rate * 100,
        "high_intent_campaign_spend": high_intent_campaign_spend,
        "total_ad_spend": total_ad_spend,
        
        # Legacy fields (for old dashboards)
        "platformAdFee": ad_commission_revenue,
        "platformIntentShare": high_intent_premium,
        "highIntentSales": high_intent_sales,
        "totalPlatformRevenue": ad_commission_revenue + high_intent_premium,
        "totalWithRetainer": total_monthly_revenue,
        
        # Breakdown for clarity
        "revenue_breakdown": {
            "stream_1_platform_fee": f"₹{monthly_retainer/100000:.1f}L",
            "stream_2_ad_commission": f"₹{ad_commission_revenue/100000:.2f}L (10% of ₹{total_ad_spend/100000:.1f}L)",
            "stream_3_high_intent_premium": f"₹{high_intent_premium/100000:.2f}L (20% of ₹{high_intent_campaign_spend/100000:.1f}L)",
            "total": f"₹{total_monthly_revenue/100000:.2f}L per month"
        }
    }

