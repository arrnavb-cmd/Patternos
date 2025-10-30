"""
PatternOS Attribution Engine
Track conversions and calculate ROAS across all touchpoints
"""

from datetime import datetime, timedelta
from typing import List, Dict, Optional
from collections import defaultdict
import hashlib

class AttributionEngine:
    def __init__(self):
        # Store all touchpoints (ad impressions, clicks)
        self.touchpoints = defaultdict(list)
        
        # Store conversions (purchases)
        self.conversions = []
        
        # Attribution models
        self.models = {
            'last_click': self.last_click_attribution,
            'first_click': self.first_click_attribution,
            'linear': self.linear_attribution,
            'time_decay': self.time_decay_attribution,
            'position_based': self.position_based_attribution
        }
        
        # Campaign performance cache
        self.campaign_performance = {}
    
    def track_touchpoint(self, data: Dict) -> Dict:
        """
        Track ad touchpoint (impression or click)
        """
        touchpoint = {
            'touchpoint_id': self.generate_id(),
            'user_id': data['user_id'],
            'campaign_id': data.get('campaign_id'),
            'ad_id': data.get('ad_id'),
            'type': data.get('type', 'impression'),  # impression, click, view
            'timestamp': datetime.now().isoformat(),
            'page_type': data.get('page_type'),
            'device': data.get('device', 'mobile'),
            'platform': data.get('platform', 'web'),
        }
        
        # Add to user's journey
        self.touchpoints[data['user_id']].append(touchpoint)
        
        return {
            'status': 'tracked',
            'touchpoint_id': touchpoint['touchpoint_id']
        }
    
    def track_conversion(self, data: Dict) -> Dict:
        """
        Track conversion (purchase, signup, etc.)
        """
        conversion = {
            'conversion_id': self.generate_id(),
            'user_id': data['user_id'],
            'order_id': data.get('order_id'),
            'revenue': data.get('revenue', 0),
            'products': data.get('products', []),
            'timestamp': datetime.now().isoformat(),
            'conversion_type': data.get('conversion_type', 'purchase'),
        }
        
        self.conversions.append(conversion)
        
        # Attribute this conversion to campaigns
        attribution = self.attribute_conversion(
            user_id=data['user_id'],
            conversion=conversion,
            model=data.get('attribution_model', 'last_click')
        )
        
        return {
            'status': 'tracked',
            'conversion_id': conversion['conversion_id'],
            'attribution': attribution
        }
    
    def attribute_conversion(
        self, 
        user_id: str, 
        conversion: Dict,
        model: str = 'last_click',
        lookback_days: int = 30
    ) -> Dict:
        """
        Attribute a conversion to campaigns using specified model
        """
        # Get user's touchpoints within lookback window
        conversion_time = datetime.fromisoformat(conversion['timestamp'])
        lookback_start = conversion_time - timedelta(days=lookback_days)
        
        user_touchpoints = [
            tp for tp in self.touchpoints.get(user_id, [])
            if lookback_start <= datetime.fromisoformat(tp['timestamp']) <= conversion_time
        ]
        
        if not user_touchpoints:
            return {
                'model': model,
                'attributed_campaigns': [],
                'revenue': conversion['revenue']
            }
        
        # Apply attribution model
        attribution_func = self.models.get(model, self.last_click_attribution)
        attributed_revenue = attribution_func(user_touchpoints, conversion['revenue'])
        
        return {
            'model': model,
            'attributed_campaigns': attributed_revenue,
            'total_touchpoints': len(user_touchpoints),
            'revenue': conversion['revenue']
        }
    
    def last_click_attribution(self, touchpoints: List[Dict], revenue: float) -> List[Dict]:
        """
        Last Click: 100% credit to last touchpoint before conversion
        """
        if not touchpoints:
            return []
        
        last_touchpoint = touchpoints[-1]
        return [{
            'campaign_id': last_touchpoint.get('campaign_id'),
            'ad_id': last_touchpoint.get('ad_id'),
            'credit': 1.0,
            'revenue': revenue
        }]
    
    def first_click_attribution(self, touchpoints: List[Dict], revenue: float) -> List[Dict]:
        """
        First Click: 100% credit to first touchpoint
        """
        if not touchpoints:
            return []
        
        first_touchpoint = touchpoints[0]
        return [{
            'campaign_id': first_touchpoint.get('campaign_id'),
            'ad_id': first_touchpoint.get('ad_id'),
            'credit': 1.0,
            'revenue': revenue
        }]
    
    def linear_attribution(self, touchpoints: List[Dict], revenue: float) -> List[Dict]:
        """
        Linear: Equal credit to all touchpoints
        """
        if not touchpoints:
            return []
        
        credit_per_touchpoint = 1.0 / len(touchpoints)
        revenue_per_touchpoint = revenue / len(touchpoints)
        
        # Group by campaign
        campaign_credits = defaultdict(lambda: {'credit': 0, 'revenue': 0})
        for tp in touchpoints:
            campaign_id = tp.get('campaign_id')
            campaign_credits[campaign_id]['credit'] += credit_per_touchpoint
            campaign_credits[campaign_id]['revenue'] += revenue_per_touchpoint
        
        return [
            {
                'campaign_id': cid,
                'credit': round(data['credit'], 3),
                'revenue': round(data['revenue'], 2)
            }
            for cid, data in campaign_credits.items()
        ]
    
    def time_decay_attribution(self, touchpoints: List[Dict], revenue: float) -> List[Dict]:
        """
        Time Decay: More credit to recent touchpoints
        Decay factor: 2^(-days_ago/7)
        """
        if not touchpoints:
            return []
        
        conversion_time = datetime.now()
        
        # Calculate weights
        weights = []
        for tp in touchpoints:
            tp_time = datetime.fromisoformat(tp['timestamp'])
            days_ago = (conversion_time - tp_time).days
            weight = 2 ** (-days_ago / 7)  # Half-life of 7 days
            weights.append(weight)
        
        total_weight = sum(weights)
        
        # Distribute revenue
        campaign_credits = defaultdict(lambda: {'credit': 0, 'revenue': 0})
        for tp, weight in zip(touchpoints, weights):
            campaign_id = tp.get('campaign_id')
            credit = weight / total_weight
            campaign_credits[campaign_id]['credit'] += credit
            campaign_credits[campaign_id]['revenue'] += revenue * credit
        
        return [
            {
                'campaign_id': cid,
                'credit': round(data['credit'], 3),
                'revenue': round(data['revenue'], 2)
            }
            for cid, data in campaign_credits.items()
        ]
    
    def position_based_attribution(self, touchpoints: List[Dict], revenue: float) -> List[Dict]:
        """
        Position-Based (U-shaped): 40% first, 40% last, 20% middle
        """
        if not touchpoints:
            return []
        
        if len(touchpoints) == 1:
            return self.first_click_attribution(touchpoints, revenue)
        
        campaign_credits = defaultdict(lambda: {'credit': 0, 'revenue': 0})
        
        # First touchpoint: 40%
        first_tp = touchpoints[0]
        campaign_credits[first_tp.get('campaign_id')]['credit'] += 0.4
        campaign_credits[first_tp.get('campaign_id')]['revenue'] += revenue * 0.4
        
        # Last touchpoint: 40%
        last_tp = touchpoints[-1]
        campaign_credits[last_tp.get('campaign_id')]['credit'] += 0.4
        campaign_credits[last_tp.get('campaign_id')]['revenue'] += revenue * 0.4
        
        # Middle touchpoints: 20% split equally
        if len(touchpoints) > 2:
            middle_touchpoints = touchpoints[1:-1]
            credit_per_middle = 0.2 / len(middle_touchpoints)
            revenue_per_middle = (revenue * 0.2) / len(middle_touchpoints)
            
            for tp in middle_touchpoints:
                campaign_credits[tp.get('campaign_id')]['credit'] += credit_per_middle
                campaign_credits[tp.get('campaign_id')]['revenue'] += revenue_per_middle
        
        return [
            {
                'campaign_id': cid,
                'credit': round(data['credit'], 3),
                'revenue': round(data['revenue'], 2)
            }
            for cid, data in campaign_credits.items()
        ]
    
    def calculate_roas(self, campaign_id: str, model: str = 'last_click') -> Dict:
        """
        Calculate ROAS (Return on Ad Spend) for a campaign
        ROAS = Revenue / Ad Spend
        """
        # Get all attributed revenue for this campaign
        attributed_revenue = 0
        conversions_count = 0
        
        for conversion in self.conversions:
            attribution = self.attribute_conversion(
                user_id=conversion['user_id'],
                conversion=conversion,
                model=model
            )
            
            for attr in attribution.get('attributed_campaigns', []):
                if attr.get('campaign_id') == campaign_id:
                    attributed_revenue += attr['revenue']
                    conversions_count += 1
        
        # Mock ad spend (in production, get from campaign data)
        ad_spend = self.get_campaign_spend(campaign_id)
        
        # Calculate ROAS
        roas = (attributed_revenue / ad_spend) if ad_spend > 0 else 0
        
        return {
            'campaign_id': campaign_id,
            'model': model,
            'revenue': round(attributed_revenue, 2),
            'ad_spend': round(ad_spend, 2),
            'roas': round(roas, 2),
            'conversions': conversions_count,
            'cost_per_conversion': round(ad_spend / conversions_count, 2) if conversions_count > 0 else 0
        }
    
    def get_campaign_spend(self, campaign_id: str) -> float:
        """
        Get total ad spend for campaign
        In production, query from campaign database
        """
        # Mock data for now
        mock_spends = {
            'CAMP_001': 125000,  # ₹1.25L spent
            'CAMP_002': 75000,   # ₹75K
            'CAMP_003': 450000,  # ₹4.5L
            'CAMP_004': 800000,  # ₹8L
            'CAMP_005': 600000,  # ₹6L
        }
        return mock_spends.get(campaign_id, 0)
    
    def get_multi_touch_report(
        self, 
        campaign_id: str,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> Dict:
        """
        Get comprehensive attribution report across all models
        """
        models = ['last_click', 'first_click', 'linear', 'time_decay', 'position_based']
        
        report = {
            'campaign_id': campaign_id,
            'period': {
                'start': start_date or 'all_time',
                'end': end_date or 'now'
            },
            'models': {}
        }
        
        for model in models:
            roas_data = self.calculate_roas(campaign_id, model)
            report['models'][model] = roas_data
        
        # Calculate average ROAS across models
        avg_roas = sum(r['roas'] for r in report['models'].values()) / len(models)
        report['average_roas'] = round(avg_roas, 2)
        
        return report
    
    def get_user_journey(self, user_id: str) -> Dict:
        """
        Get complete user journey with all touchpoints and conversions
        """
        user_touchpoints = self.touchpoints.get(user_id, [])
        user_conversions = [c for c in self.conversions if c['user_id'] == user_id]
        
        return {
            'user_id': user_id,
            'touchpoints': user_touchpoints,
            'conversions': user_conversions,
            'total_touchpoints': len(user_touchpoints),
            'total_conversions': len(user_conversions),
            'total_revenue': sum(c['revenue'] for c in user_conversions)
        }
    
    def generate_id(self) -> str:
        """Generate unique ID"""
        timestamp = datetime.now().isoformat()
        return hashlib.md5(timestamp.encode()).hexdigest()[:12]

# Global instance
attribution_engine = AttributionEngine()
