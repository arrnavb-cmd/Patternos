"""
Dynamic Pricing Engine
Calculates campaign costs based on Intent Level + Value Intelligence
"""

from typing import Dict, List
from datetime import datetime

class PricingEngine:
    
    # Base CPM rates (Cost Per Mille/1000 impressions)
    BASE_RATES = {
        'intent': {
            'High': 150,      # ₹150 per 1000 impressions
            'Medium': 80,     # ₹80 per 1000 impressions
            'Low': 40         # ₹40 per 1000 impressions
        },
        'value_intelligence': {
            'multiplier': 1.5  # 50% premium for Value Intelligence targeting
        }
    }
    
    # Channel-specific multipliers
    CHANNEL_MULTIPLIERS = {
        'Zepto': {
            'sponsored_products': 1.2,
            'banner_ads': 1.0,
            'featured_store': 1.5,
            'flash_sale': 1.3
        },
        'Facebook': {
            'feed_ads': 1.0,
            'story_ads': 1.1,
            'reels_ads': 1.3,
            'messenger_ads': 0.9
        },
        'Instagram': {
            'feed_ads': 1.1,
            'story_ads': 1.2,
            'reels_ads': 1.4,
            'shopping_ads': 1.3
        },
        'YouTube': {
            'skippable': 1.0,
            'non_skippable': 1.5,
            'bumper': 1.2,
            'discovery': 0.9
        },
        'Google Display': {
            'responsive': 1.0,
            'image': 0.9,
            'native': 1.1,
            'gmail': 1.2
        },
        'Email': {'promotional': 0.3, 'newsletter': 0.2},
        'SMS': {'promotional': 0.4},
        'WhatsApp': {'business': 0.5, 'catalog': 0.4}
    }
    
    @classmethod
    def calculate_campaign_cost(cls, 
                               intent_level: str,
                               use_value_intelligence: bool,
                               channels: List[Dict],
                               budget: float,
                               duration_days: int) -> Dict:
        """
        Calculate campaign costs with detailed breakdown
        
        Args:
            intent_level: 'High', 'Medium', or 'Low'
            use_value_intelligence: True if using Super-Ego targeting
            channels: List of dicts with {channel_name, ad_types}
            budget: Total campaign budget
            duration_days: Campaign duration
            
        Returns:
            Dict with pricing breakdown
        """
        
        # Get base CPM rate
        base_cpm = cls.BASE_RATES['intent'].get(intent_level, 80)
        
        # Apply Value Intelligence premium
        if use_value_intelligence:
            vi_multiplier = cls.BASE_RATES['value_intelligence']['multiplier']
            effective_cpm = base_cpm * vi_multiplier
            pricing_strategy = f"{intent_level} Intent + Value Intelligence"
        else:
            effective_cpm = base_cpm
            pricing_strategy = f"{intent_level} Intent"
        
        # Calculate channel-specific costs
        channel_breakdown = []
        total_weighted_multiplier = 0
        
        for channel_config in channels:
            channel_name = channel_config.get('name')
            ad_types = channel_config.get('ad_types', [])
            
            if not ad_types:
                ad_types = ['default']
            
            # Calculate average multiplier for this channel
            channel_multipliers = cls.CHANNEL_MULTIPLIERS.get(channel_name, {})
            if channel_multipliers:
                avg_multiplier = sum(
                    channel_multipliers.get(ad_type, 1.0) for ad_type in ad_types
                ) / len(ad_types)
            else:
                avg_multiplier = 1.0
            
            channel_cpm = effective_cpm * avg_multiplier
            total_weighted_multiplier += avg_multiplier
            
            channel_breakdown.append({
                'channel': channel_name,
                'ad_types': ad_types,
                'cpm': round(channel_cpm, 2),
                'multiplier': round(avg_multiplier, 2)
            })
        
        # Calculate estimated reach
        num_channels = len(channels)
        avg_cpm = effective_cpm * (total_weighted_multiplier / num_channels if num_channels > 0 else 1)
        estimated_impressions = int((budget / avg_cpm) * 1000)
        estimated_reach = int(estimated_impressions * 0.7)  # Assuming 70% unique reach
        
        # Calculate estimated performance metrics
        expected_ctr = cls._estimate_ctr(intent_level, use_value_intelligence)
        expected_clicks = int(estimated_impressions * expected_ctr)
        expected_conversions = int(expected_clicks * cls._estimate_conversion_rate(intent_level, use_value_intelligence))
        
        # Cost per action
        cost_per_click = budget / expected_clicks if expected_clicks > 0 else 0
        cost_per_conversion = budget / expected_conversions if expected_conversions > 0 else 0
        
        return {
            'pricing_strategy': pricing_strategy,
            'intent_level': intent_level,
            'uses_value_intelligence': use_value_intelligence,
            'base_cpm': round(base_cpm, 2),
            'effective_cpm': round(effective_cpm, 2),
            'average_cpm': round(avg_cpm, 2),
            'total_budget': budget,
            'duration_days': duration_days,
            'estimated_impressions': estimated_impressions,
            'estimated_reach': estimated_reach,
            'expected_clicks': expected_clicks,
            'expected_conversions': expected_conversions,
            'expected_ctr': round(expected_ctr * 100, 2),
            'cost_per_click': round(cost_per_click, 2),
            'cost_per_conversion': round(cost_per_conversion, 2),
            'channel_breakdown': channel_breakdown,
            'value_intelligence_premium': round((effective_cpm - base_cpm), 2) if use_value_intelligence else 0
        }
    
    @classmethod
    def _estimate_ctr(cls, intent_level: str, use_vi: bool) -> float:
        """Estimate Click-Through Rate"""
        base_ctr = {
            'High': 0.035,    # 3.5%
            'Medium': 0.020,  # 2.0%
            'Low': 0.010      # 1.0%
        }
        ctr = base_ctr.get(intent_level, 0.020)
        
        if use_vi:
            ctr *= 1.4  # 40% boost from Value Intelligence
        
        return ctr
    
    @classmethod
    def _estimate_conversion_rate(cls, intent_level: str, use_vi: bool) -> float:
        """Estimate Conversion Rate"""
        base_cvr = {
            'High': 0.12,     # 12%
            'Medium': 0.05,   # 5%
            'Low': 0.02       # 2%
        }
        cvr = base_cvr.get(intent_level, 0.05)
        
        if use_vi:
            cvr *= 1.6  # 60% boost from Value Intelligence
        
        return cvr
    
    @classmethod
    def get_pricing_tiers(cls) -> Dict:
        """Get all available pricing tiers"""
        return {
            'intent_tiers': [
                {
                    'level': 'High',
                    'base_cpm': cls.BASE_RATES['intent']['High'],
                    'description': 'Ready to buy - highest conversion',
                    'best_for': 'Direct sales, conversions, retargeting'
                },
                {
                    'level': 'Medium',
                    'base_cpm': cls.BASE_RATES['intent']['Medium'],
                    'description': 'Considering - good engagement',
                    'best_for': 'Brand awareness, consideration'
                },
                {
                    'level': 'Low',
                    'base_cpm': cls.BASE_RATES['intent']['Low'],
                    'description': 'Browsing - mass reach',
                    'best_for': 'Top of funnel, brand discovery'
                }
            ],
            'value_intelligence': {
                'premium': cls.BASE_RATES['value_intelligence']['multiplier'],
                'description': 'Identity-based targeting for higher ROI',
                'benefit': '40-60% higher conversion rates'
            }
        }
    
    @classmethod
    def compare_pricing_strategies(cls, budget: float, channels: List[Dict], duration_days: int) -> Dict:
        """Compare all pricing strategies"""
        comparisons = []
        
        for intent in ['High', 'Medium', 'Low']:
            for use_vi in [False, True]:
                pricing = cls.calculate_campaign_cost(
                    intent, use_vi, channels, budget, duration_days
                )
                comparisons.append(pricing)
        
        return {
            'budget': budget,
            'duration_days': duration_days,
            'strategies': comparisons
        }

