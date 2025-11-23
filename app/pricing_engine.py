"""
Dynamic Pricing Engine - CORRECTED MODEL
Base CPM: ₹100
Multipliers: High=1.0x, Medium=0.7x, Low=0.4x
Value Intelligence: +0.5x ADDITIVE premium
"""

from typing import Dict, List
from datetime import datetime

class PricingEngine:
    
    # Base CPM (starting point for all calculations)
    BASE_CPM = 100  # ₹100 per 1000 impressions
    
    # Intent multipliers (applied to base)
    INTENT_MULTIPLIERS = {
        'High': 1.0,      # ₹100 × 1.0 = ₹100
        'Medium': 0.7,    # ₹100 × 0.7 = ₹70
        'Low': 0.4        # ₹100 × 0.4 = ₹40
    }
    
    # Value Intelligence premium (ADDITIVE, not multiplicative)
    VALUE_INTELLIGENCE_PREMIUM = 0.5  # +₹50 when base is ₹100
    
    # Channel-specific multipliers (same as before)
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
        Calculate campaign costs with CORRECTED additive VI model
        
        Formula:
        Effective CPM = (BASE_CPM × Intent_Multiplier + VI_Premium) × Channel_Multiplier
        
        Examples:
        High Intent + VI + Zepto:
        (₹100 × 1.0 + ₹50) × 1.2 = ₹180
        
        Medium Intent + VI:
        (₹100 × 0.7 + ₹50) × 1.0 = ₹120
        
        Low Intent only:
        (₹100 × 0.4 + ₹0) × 1.0 = ₹40
        """
        
        # Step 1: Get intent multiplier
        intent_multiplier = cls.INTENT_MULTIPLIERS.get(intent_level, 0.7)
        base_with_intent = cls.BASE_CPM * intent_multiplier
        
        # Step 2: Add Value Intelligence premium (ADDITIVE)
        if use_value_intelligence:
            vi_premium = cls.BASE_CPM * cls.VALUE_INTELLIGENCE_PREMIUM
            pricing_strategy = f"{intent_level} Intent + Value Intelligence"
        else:
            vi_premium = 0
            pricing_strategy = f"{intent_level} Intent"
        
        # Effective CPM before channel multipliers
        base_effective_cpm = base_with_intent + vi_premium
        
        # Step 3: Calculate channel-specific costs
        channel_breakdown = []
        total_weighted_cpm = 0
        
        for channel_config in channels:
            channel_name = channel_config.get('name')
            ad_types = channel_config.get('ad_types', ['default'])
            
            # Get channel multipliers
            channel_multipliers = cls.CHANNEL_MULTIPLIERS.get(channel_name, {})
            if channel_multipliers:
                avg_multiplier = sum(
                    channel_multipliers.get(ad_type, 1.0) for ad_type in ad_types
                ) / len(ad_types)
            else:
                avg_multiplier = 1.0
            
            # Final CPM for this channel
            channel_cpm = base_effective_cpm * avg_multiplier
            total_weighted_cpm += channel_cpm
            
            channel_breakdown.append({
                'channel': channel_name,
                'ad_types': ad_types,
                'cpm': round(channel_cpm, 2),
                'multiplier': round(avg_multiplier, 2),
                'base_cpm': round(base_effective_cpm, 2)
            })
        
        # Average CPM across all channels
        num_channels = len(channels)
        avg_cpm = total_weighted_cpm / num_channels if num_channels > 0 else base_effective_cpm
        
        # Step 4: Calculate estimated performance metrics
        estimated_impressions = int((budget / avg_cpm) * 1000)
        estimated_reach = int(estimated_impressions * 0.7)  # 70% unique reach
        
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
            'base_cpm': cls.BASE_CPM,
            'intent_multiplier': intent_multiplier,
            'intent_cpm': round(base_with_intent, 2),
            'vi_premium': round(vi_premium, 2),
            'effective_cpm_base': round(base_effective_cpm, 2),
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
            'pricing_breakdown': {
                'base': f"₹{cls.BASE_CPM}",
                'intent': f"₹{cls.BASE_CPM} × {intent_multiplier} = ₹{base_with_intent:.0f}",
                'vi_premium': f"+ ₹{vi_premium:.0f}" if use_value_intelligence else "+ ₹0",
                'total': f"= ₹{base_effective_cpm:.0f}"
            }
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
        """Get all available pricing tiers with corrected model"""
        return {
            'base_cpm': cls.BASE_CPM,
            'model': 'additive',
            'formula': '(BASE_CPM × Intent_Multiplier) + VI_Premium',
            'intent_tiers': [
                {
                    'level': 'High',
                    'multiplier': cls.INTENT_MULTIPLIERS['High'],
                    'cpm_without_vi': cls.BASE_CPM * cls.INTENT_MULTIPLIERS['High'],
                    'cpm_with_vi': cls.BASE_CPM * (cls.INTENT_MULTIPLIERS['High'] + cls.VALUE_INTELLIGENCE_PREMIUM),
                    'description': 'Ready to buy - highest conversion',
                    'best_for': 'Direct sales, conversions, retargeting'
                },
                {
                    'level': 'Medium',
                    'multiplier': cls.INTENT_MULTIPLIERS['Medium'],
                    'cpm_without_vi': cls.BASE_CPM * cls.INTENT_MULTIPLIERS['Medium'],
                    'cpm_with_vi': cls.BASE_CPM * (cls.INTENT_MULTIPLIERS['Medium'] + cls.VALUE_INTELLIGENCE_PREMIUM),
                    'description': 'Considering - good engagement',
                    'best_for': 'Brand awareness, consideration'
                },
                {
                    'level': 'Low',
                    'multiplier': cls.INTENT_MULTIPLIERS['Low'],
                    'cpm_without_vi': cls.BASE_CPM * cls.INTENT_MULTIPLIERS['Low'],
                    'cpm_with_vi': cls.BASE_CPM * (cls.INTENT_MULTIPLIERS['Low'] + cls.VALUE_INTELLIGENCE_PREMIUM),
                    'description': 'Browsing - mass reach',
                    'best_for': 'Top of funnel, brand discovery'
                }
            ],
            'value_intelligence': {
                'premium': cls.VALUE_INTELLIGENCE_PREMIUM,
                'type': 'additive',
                'amount': f"₹{cls.BASE_CPM * cls.VALUE_INTELLIGENCE_PREMIUM}",
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
            'base_cpm': cls.BASE_CPM,
            'model': 'additive (VI is added, not multiplied)',
            'strategies': comparisons
        }

