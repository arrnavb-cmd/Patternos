from fastapi import APIRouter, Query
from datetime import datetime, timedelta
import json
from typing import Optional

router = APIRouter()

def load_purchase_data():
    """Load 100K purchase database"""
    try:
        with open('purchase_database_100k.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def filter_by_date_range(purchases, date_range: str, start_date: Optional[str] = None, end_date: Optional[str] = None):
    """Filter purchases by date range"""
    end = datetime.now()
    
    if date_range == 'custom' and start_date and end_date:
        start = datetime.fromisoformat(start_date)
        end = datetime.fromisoformat(end_date)
    elif date_range == 'last_7_days':
        start = end - timedelta(days=7)
    elif date_range == 'last_30_days':
        start = end - timedelta(days=30)
    elif date_range == 'last_90_days':
        start = end - timedelta(days=90)
    else:
        start = end - timedelta(days=30)
    
    filtered = []
    for purchase in purchases:
        purchase_date = datetime.fromisoformat(purchase['purchase_datetime'])
        if start <= purchase_date <= end:
            filtered.append(purchase)
    
    return filtered

@router.get("/channel-performance")
async def get_channel_performance(
    date_range: str = Query('last_30_days'),
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):
    """Get performance metrics by ad channel (Zepto, Facebook, Instagram, Google Display)"""
    
    purchases = load_purchase_data()
    filtered_purchases = filter_by_date_range(purchases, date_range, start_date, end_date)
    
    # Filter only ad-based purchases
    ad_purchases = [p for p in filtered_purchases if p['ad_channel'] != 'organic']
    
    # Aggregate by channel
    channel_data = {}
    
    for purchase in ad_purchases:
        channel = purchase['ad_channel']
        
        if channel not in channel_data:
            channel_data[channel] = {
                'channel': channel,
                'impressions': 0,
                'clicks': 0,
                'spend': 0,
                'revenue': 0,
                'purchases': 0
            }
        
        # Estimate impressions and clicks
        channel_data[channel]['impressions'] += random.randint(1, 3)
        channel_data[channel]['clicks'] += 1  # Each purchase = 1 click
        channel_data[channel]['spend'] += purchase['ad_spend']
        channel_data[channel]['revenue'] += purchase['price']
        channel_data[channel]['purchases'] += 1
    
    # Format results with proper channel names
    channel_names = {
        'zepto': 'Zepto Platform',
        'facebook': 'Facebook Ads',
        'instagram': 'Instagram Ads',
        'google_display': 'Google Display'
    }
    
    result = []
    for channel, data in channel_data.items():
        roas = data['revenue'] / data['spend'] if data['spend'] > 0 else 0
        result.append({
            'channel': channel_names.get(channel, channel),
            'impressions': data['impressions'],
            'clicks': data['clicks'],
            'spend': data['spend'],
            'revenue': data['revenue'],
            'purchases': data['purchases'],
            'roas': round(roas, 2)
        })
    
    return {
        'channels': result,
        'date_range': date_range,
        'total_purchases': len(ad_purchases)
    }

@router.get("/platform-summary")
async def get_platform_summary(
    date_range: str = Query('last_30_days'),
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):
    """Get overall platform summary from 100K purchase database"""
    
    purchases = load_purchase_data()
    filtered_purchases = filter_by_date_range(purchases, date_range, start_date, end_date)
    
    # Ad-based purchases only
    ad_purchases = [p for p in filtered_purchases if p['ad_channel'] != 'organic']
    
    total_spend = sum(p['ad_spend'] for p in ad_purchases)
    total_revenue = sum(p['price'] for p in ad_purchases)
    total_clicks = len(ad_purchases)  # Each purchase = 1 click
    total_impressions = total_clicks * 2  # Rough estimate
    
    avg_roas = total_revenue / total_spend if total_spend > 0 else 0
    
    # Total GMV (all purchases including organic)
    total_gmv = sum(p['price'] for p in filtered_purchases)
    
    return {
        'total_spend': total_spend,
        'total_revenue': total_revenue,
        'total_gmv': total_gmv,
        'total_clicks': total_clicks,
        'total_impressions': total_impressions,
        'avg_roas': round(avg_roas, 2),
        'total_purchases': len(filtered_purchases),
        'ad_purchases': len(ad_purchases)
    }

import random

@router.get("/brand-comparison")
async def get_brand_comparison(date_range: str = Query('last_30_days')):
    """Get performance comparison across all brands"""
    
    purchases = load_purchase_data()
    
    # Group by brand
    brands = {}
    for p in purchases:
        brand = p['brand']
        if brand not in brands:
            brands[brand] = {
                'brand': brand,
                'orders': 0,
                'revenue': 0,
                'spend': 0,
                'impressions': 0,
                'clicks': 0
            }
        
        brands[brand]['orders'] += 1
        brands[brand]['revenue'] += p['price']
        
        if p['ad_channel'] != 'organic':
            brands[brand]['spend'] += p['ad_spend']
            # Estimate impressions and clicks
            brands[brand]['impressions'] += int(p['ad_spend'] * 50)  # Rough CPM
            brands[brand]['clicks'] += int(p['ad_spend'] * 1.5)  # Rough CPC
    
    # Calculate metrics for each brand
    brand_list = []
    for brand_data in brands.values():
        spend = brand_data['spend']
        revenue = brand_data['revenue']
        impressions = brand_data['impressions']
        clicks = brand_data['clicks']
        
        roas = round(revenue / spend, 2) if spend > 0 else 0
        ctr = round((clicks / impressions * 100), 2) if impressions > 0 else 0
        conv_rate = round((brand_data['orders'] / clicks * 100), 2) if clicks > 0 else 0
        
        brand_list.append({
            'brand': brand_data['brand'],
            'spend': spend,
            'revenue': revenue,
            'roas': roas,
            'purchases': brand_data['orders'],
            'impressions': impressions,
            'ctr': ctr,
            'conversion_rate': conv_rate
        })
    
    # Sort by revenue
    brand_list.sort(key=lambda x: x['revenue'], reverse=True)
    
    return {
        'brands': brand_list,
        'total_brands': len(brand_list)
    }

@router.get("/location-comparison")
async def get_location_comparison(date_range: str = Query('last_30_days')):
    """Get performance comparison by location"""
    
    purchases = load_purchase_data()
    
    # Group by location
    locations = {}
    for p in purchases:
        loc = p['location']
        if loc not in locations:
            locations[loc] = {
                'location': loc.capitalize(),
                'spend': 0,
                'revenue': 0,
                'orders': 0
            }
        
        if p['ad_channel'] != 'organic':
            locations[loc]['spend'] += p['ad_spend']
        
        locations[loc]['revenue'] += p['price']
        locations[loc]['orders'] += 1
    
    # Calculate metrics
    result = []
    for loc_data in locations.values():
        spend = loc_data['spend']
        revenue = loc_data['revenue']
        orders = loc_data['orders']
        
        roas = round(revenue / spend, 2) if spend > 0 else 0
        
        result.append({
            'dimension': loc_data['location'],
            'spend': spend,
            'revenue': revenue,
            'roas': roas,
            'conversions': orders
        })
    
    # Sort by revenue
    result.sort(key=lambda x: x['revenue'], reverse=True)
    
    return {
        'data': result,
        'total_locations': len(result)
    }

@router.get("/category-comparison")
async def get_category_comparison(date_range: str = Query('last_30_days')):
    """Get performance comparison by category"""
    
    purchases = load_purchase_data()
    
    # Group by category
    categories = {}
    for p in purchases:
        cat = p['category']
        if cat not in categories:
            categories[cat] = {
                'category': cat.capitalize(),
                'spend': 0,
                'revenue': 0,
                'orders': 0
            }
        
        if p['ad_channel'] != 'organic':
            categories[cat]['spend'] += p['ad_spend']
        
        categories[cat]['revenue'] += p['price']
        categories[cat]['orders'] += 1
    
    # Calculate metrics
    result = []
    for cat_data in categories.values():
        spend = cat_data['spend']
        revenue = cat_data['revenue']
        orders = cat_data['orders']
        
        roas = round(revenue / spend, 2) if spend > 0 else 0
        
        result.append({
            'dimension': cat_data['category'],
            'spend': spend,
            'revenue': revenue,
            'roas': roas,
            'conversions': orders
        })
    
    # Sort by revenue
    result.sort(key=lambda x: x['revenue'], reverse=True)
    
    return {
        'data': result,
        'total_categories': len(result)
    }

@router.get("/brand-performance/{brand_name}")
async def get_brand_performance(brand_name: str, date_range: str = Query('last_30_days')):
    """Get complete performance data for a specific brand"""
    
    # Load ad campaigns data
    try:
        with open('ad_campaigns_database.json', 'r') as f:
            campaigns = json.load(f)
    except FileNotFoundError:
        return {"error": "Ad campaigns database not found"}
    
    # Filter for this brand
    brand_campaigns = [c for c in campaigns if c['brand'].lower() == brand_name.lower()]
    
    if not brand_campaigns:
        return {"error": f"No campaigns found for brand: {brand_name}"}
    
    # Aggregate metrics
    total_impressions = sum(c['impressions'] for c in brand_campaigns)
    total_clicks = sum(c['clicks'] for c in brand_campaigns)
    total_conversions = sum(c['conversions'] for c in brand_campaigns)
    total_ad_spend = sum(c['ad_spend'] for c in brand_campaigns)
    total_revenue = sum(c['revenue'] for c in brand_campaigns)
    
    # Calculate averages
    avg_ctr = (total_clicks / total_impressions * 100) if total_impressions > 0 else 0
    avg_conversion_rate = (total_conversions / total_clicks * 100) if total_clicks > 0 else 0
    roas = total_revenue / total_ad_spend if total_ad_spend > 0 else 0
    
    return {
        'brand': brand_name.capitalize(),
        'summary': {
            'total_ad_spend': total_ad_spend,
            'total_impressions': total_impressions,
            'total_clicks': total_clicks,
            'total_conversions': total_conversions,
            'total_revenue': total_revenue,
            'ctr': round(avg_ctr, 2),
            'conversion_rate': round(avg_conversion_rate, 2),
            'roas': round(roas, 2),
            'active_campaigns': len(brand_campaigns)
        },
        'campaigns_by_channel': brand_campaigns
    }
