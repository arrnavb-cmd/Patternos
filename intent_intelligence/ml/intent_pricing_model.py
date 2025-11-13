#!/usr/bin/env python3
"""
PatternOS Intent-Based Pricing Model
Calculates fees based on intent quality
"""

class IntentPricingEngine:
    """Calculate PatternOS fees based on intent distribution"""
    
    # Fee structure
    HIGH_INTENT_FEE = 0.20  # 20% for high intent users
    MEDIUM_LOW_INTENT_FEE = 0.10  # 10% for medium/low intent
    
    def calculate_campaign_fee(self, campaign_budget, target_intent_level):
        """
        Calculate PatternOS fee for a campaign
        
        Args:
            campaign_budget: Total campaign budget (what brand pays aggregator)
            target_intent_level: 'high', 'medium', or 'low'
        
        Returns:
            PatternOS fee amount
        """
        if target_intent_level == 'high':
            return campaign_budget * self.HIGH_INTENT_FEE
        else:
            return campaign_budget * self.MEDIUM_LOW_INTENT_FEE
    
    def recommend_targeting(self, campaign_budget, expected_conversions_by_intent):
        """
        Recommend which intent level to target based on ROI
        
        Args:
            campaign_budget: Total budget
            expected_conversions_by_intent: {
                'high': {'users': 5967, 'conversion_rate': 0.08},
                'medium': {'users': 7125, 'conversion_rate': 0.02},
                'low': {'users': 7155, 'conversion_rate': 0.007}
            }
        
        Returns:
            Recommendation with ROI analysis
        """
        results = {}
        
        for intent_level, data in expected_conversions_by_intent.items():
            fee = self.calculate_campaign_fee(campaign_budget, intent_level)
            net_budget = campaign_budget - fee
            expected_conversions = data['users'] * data['conversion_rate']
            
            results[intent_level] = {
                'patternos_fee': fee,
                'net_budget': net_budget,
                'users_reached': data['users'],
                'expected_conversions': expected_conversions,
                'cost_per_conversion': net_budget / expected_conversions if expected_conversions > 0 else 0,
                'roi_estimate': expected_conversions * 1000 / net_budget  # Assuming ₹1000 avg order value
            }
        
        # Find best option
        best = max(results.items(), key=lambda x: x[1]['roi_estimate'])
        
        return {
            'recommendation': best[0],
            'analysis': results,
            'reason': f"{best[0].capitalize()} intent provides best ROI: {best[1]['roi_estimate']:.2f}x"
        }

# Example usage
if __name__ == "__main__":
    engine = IntentPricingEngine()
    
    # Scenario: Nike campaign with ₹100,000 budget
    campaign_budget = 100000
    
    intent_data = {
        'high': {'users': 5967, 'conversion_rate': 0.08},
        'medium': {'users': 7125, 'conversion_rate': 0.02},
        'low': {'users': 7155, 'conversion_rate': 0.007}
    }
    
    recommendation = engine.recommend_targeting(campaign_budget, intent_data)
    
    print("=" * 70)
    print("PatternOS Intent-Based Pricing Analysis")
    print("=" * 70)
    print(f"\nCampaign Budget: ₹{campaign_budget:,}")
    print(f"\nRecommendation: {recommendation['recommendation'].upper()} INTENT")
    print(f"Reason: {recommendation['reason']}")
    
    print("\n" + "-" * 70)
    print("Detailed Analysis:")
    print("-" * 70)
    
    for intent, metrics in recommendation['analysis'].items():
        print(f"\n{intent.upper()} INTENT:")
        print(f"  PatternOS Fee: ₹{metrics['patternos_fee']:,.0f} ({engine.HIGH_INTENT_FEE*100 if intent=='high' else engine.MEDIUM_LOW_INTENT_FEE*100:.0f}%)")
        print(f"  Net Budget: ₹{metrics['net_budget']:,.0f}")
        print(f"  Users Reached: {metrics['users_reached']:,}")
        print(f"  Expected Conversions: {metrics['expected_conversions']:.0f}")
        print(f"  Cost per Conversion: ₹{metrics['cost_per_conversion']:,.0f}")
        print(f"  ROI Estimate: {metrics['roi_estimate']:.2f}x {'✅' if intent==recommendation['recommendation'] else ''}")
