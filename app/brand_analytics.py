import pandas as pd
from datetime import datetime, timedelta

def get_brand_analytics(brand_name: str):
    """Calculate real ROAS, campaigns, analytics from datasets"""
    try:
        brand = brand_name.replace('@brand.com', '').lower()
        
        # Load all datasets
        orders_df = pd.read_csv('data/zepto_realistic_5lakh_orders.csv')
        campaigns_df = pd.read_csv('data/campaigns_master.csv')
        ad_spend_df = pd.read_csv('data/zepto_ad_spend_daily.csv')
        
        # Filter for this brand
        brand_orders = orders_df[orders_df['brands'].str.lower().str.contains(brand, na=False)].copy()
        brand_campaigns = campaigns_df[campaigns_df['brand'].str.lower() == brand].copy()
        brand_ad_spend = ad_spend_df[ad_spend_df['brand'].str.lower() == brand].copy()
        
        # Calculate ROAS
        total_ad_spend = float(brand_ad_spend['spend_value'].sum())
        total_revenue = float(brand_orders['order_value'].sum())
        roas = (total_revenue / total_ad_spend) if total_ad_spend > 0 else 0
        
        # Campaign performance
        campaign_performance = []
        for _, campaign in brand_campaigns.iterrows():
            campaign_id = campaign['campaign_id']
            campaign_spend_data = brand_ad_spend[brand_ad_spend['campaign_id'] == campaign_id]
            
            campaign_spend = float(campaign_spend_data['spend_value'].sum())
            campaign_impressions = int(campaign_spend_data['impressions'].sum())
            campaign_clicks = int(campaign_spend_data['clicks'].sum())
            campaign_conversions = int(campaign_spend_data['conversions'].sum())
            
            # Estimate revenue from conversions
            campaign_revenue = campaign_conversions * float(brand_orders['order_value'].mean())
            campaign_roas = (campaign_revenue / campaign_spend) if campaign_spend > 0 else 0
            
            campaign_performance.append({
                'campaign_id': campaign_id,
                'name': f"{brand.title()} {campaign['category']} - {campaign['channel']}",
                'channel': campaign['channel'],
                'spend': campaign_spend,
                'impressions': campaign_impressions,
                'clicks': campaign_clicks,
                'conversions': campaign_conversions,
                'revenue': campaign_revenue,
                'roas': campaign_roas,
                'status': 'active' if pd.to_datetime(campaign['end_date']) > datetime.now() else 'completed'
            })
        
        # Sort by ROAS
        campaign_performance = sorted(campaign_performance, key=lambda x: x['roas'], reverse=True)
        
        # Analytics metrics
        total_impressions = int(brand_ad_spend['impressions'].sum())
        total_clicks = int(brand_ad_spend['clicks'].sum())
        total_conversions = int(brand_ad_spend['conversions'].sum())
        ctr = (total_clicks / total_impressions * 100) if total_impressions > 0 else 0
        conversion_rate = (total_conversions / total_clicks * 100) if total_clicks > 0 else 0
        
        return {
            'brand': brand_name,
            'overview': {
                'total_spend': total_ad_spend,
                'total_revenue': total_revenue,
                'roas': roas,
                'total_orders': len(brand_orders),
                'total_impressions': total_impressions,
                'total_clicks': total_clicks,
                'total_conversions': total_conversions,
                'ctr': ctr,
                'conversion_rate': conversion_rate
            },
            'top_campaigns': campaign_performance[:10],
            'all_campaigns': campaign_performance
        }
        
    except Exception as e:
        return {'error': str(e)}
