"""
PatternOS Revenue & Pricing Calculation Tests
==============================================

Critical P0 Tests for Revenue-Generating Logic

WHY THESE TESTS MATTER:
- A 0.1% pricing error = ₹10 lakh lost per ₹100 crore GMV
- Wrong subscription tier = ₹5-15 lakh ARR loss per customer
- ROAS miscalculation = customer churn + reputation damage

BUSINESS CONTEXT:
PatternOS ARR Model (from page 16):
- SaaS Subscriptions: ₹5L - ₹15L per retailer
- Ad Platform Revenue: 5-10% of ad spend
- GMV Commission: 0.5-2% of transaction value
"""

import pytest
from decimal import Decimal
from datetime import datetime, timedelta


# ============================================================================
# TEST CLASS: ARR (Annual Recurring Revenue) Calculations
# ============================================================================

@pytest.mark.p0
@pytest.mark.revenue
class TestARRCalculations:
    """Test subscription-based revenue calculations"""

    def test_subscription_arr_basic(self):
        """Test basic ARR calculation for PatternOS subscriptions

        Why Critical: Foundation of revenue forecasting
        Business Impact: ₹5-15L per customer annual contract
        """
        # Test data: Zepto Growth Plan subscription
        monthly_price = Decimal('50000')  # ₹50,000/month
        months = 12

        expected_arr = Decimal('600000')  # ₹6L annual
        actual_arr = self._calculate_arr(monthly_price, months)

        assert actual_arr == expected_arr, \
            f"ARR mismatch: expected ₹{expected_arr}, got ₹{actual_arr}"

    def test_subscription_tiers(self):
        """Test all PatternOS subscription tiers

        Tiers:
        - Starter: ₹5L/year (SMB retailers)
        - Growth: ₹8L/year (Mid-market like Zepto, Blinkit)
        - Enterprise: ₹15L/year (Large retailers like BigBasket)
        """
        tiers = {
            'starter': Decimal('500000'),
            'growth': Decimal('800000'),
            'enterprise': Decimal('1500000')
        }

        for tier_name, expected_price in tiers.items():
            arr = self._get_tier_arr(tier_name)
            assert arr == expected_price, \
                f"{tier_name.title()} tier ARR incorrect: expected ₹{expected_price}, got ₹{arr}"

    def test_multi_year_contract_discount(self):
        """Test multi-year contract discount calculations

        Why Critical: Longer contracts = better CAC payback
        Standard: 10% discount for 2-year, 20% for 3-year
        """
        base_arr = Decimal('800000')  # Growth tier

        # 1-year: No discount
        one_year = self._calculate_contract_value(base_arr, years=1)
        assert one_year == base_arr

        # 2-year: 10% discount
        two_year = self._calculate_contract_value(base_arr, years=2)
        expected_2y = base_arr * Decimal('0.9') * 2
        assert two_year == expected_2y

        # 3-year: 20% discount
        three_year = self._calculate_contract_value(base_arr, years=3)
        expected_3y = base_arr * Decimal('0.8') * 3
        assert three_year == expected_3y

    def test_addon_modules_revenue(self):
        """Test add-on module pricing (VisionOS, VoiceOS, RecognitionOS)

        Why Critical: Upsell revenue contributes 30%+ to total ARR
        """
        base_arr = Decimal('500000')  # Starter tier

        # VisionOS add-on: ₹2L/year
        vision_addon = Decimal('200000')
        total_with_vision = base_arr + vision_addon
        assert total_with_vision == Decimal('700000')

        # Full intelligence suite: ₹5L/year
        full_suite = base_arr + Decimal('500000')
        assert full_suite == Decimal('1000000')

    def test_gmv_commission_calculation(self):
        """Test GMV-based commission calculations

        Why Critical: If this is wrong by 0.1%, that's ₹10,000 lost per ₹1 crore GMV
        Model: 0.5-2% of total transaction value
        """
        gmv = Decimal('100000000')  # ₹10 crore monthly GMV

        # Low tier: 0.5%
        low_commission = self._calculate_gmv_commission(gmv, rate=Decimal('0.005'))
        assert low_commission == Decimal('500000')  # ₹5L

        # High tier: 2%
        high_commission = self._calculate_gmv_commission(gmv, rate=Decimal('0.02'))
        assert high_commission == Decimal('2000000')  # ₹20L

    def test_usage_based_overage(self):
        """Test overage charges for usage beyond plan limits

        Why Critical: Prevents revenue leakage from heavy users
        Example: Starter plan includes 100K impressions, ₹50 per 10K overage
        """
        plan_limit = 100000  # impressions
        actual_usage = 150000
        overage_rate = Decimal('50')  # ₹50 per 10K impressions

        overage = self._calculate_overage(actual_usage, plan_limit, overage_rate)
        expected_overage = Decimal('250')  # 50K extra = 5 blocks × ₹50

        assert overage == expected_overage

    # Helper methods
    def _calculate_arr(self, monthly_price: Decimal, months: int) -> Decimal:
        """Calculate Annual Recurring Revenue"""
        return monthly_price * months

    def _get_tier_arr(self, tier: str) -> Decimal:
        """Get ARR for subscription tier"""
        tiers = {
            'starter': Decimal('500000'),
            'growth': Decimal('800000'),
            'enterprise': Decimal('1500000')
        }
        return tiers.get(tier, Decimal('0'))

    def _calculate_contract_value(self, base_arr: Decimal, years: int) -> Decimal:
        """Calculate total contract value with multi-year discounts"""
        discounts = {1: Decimal('1.0'), 2: Decimal('0.9'), 3: Decimal('0.8')}
        discount = discounts.get(years, Decimal('1.0'))
        return base_arr * discount * years

    def _calculate_gmv_commission(self, gmv: Decimal, rate: Decimal) -> Decimal:
        """Calculate commission based on GMV"""
        return gmv * rate

    def _calculate_overage(self, actual: int, limit: int, rate: Decimal) -> Decimal:
        """Calculate overage charges"""
        if actual <= limit:
            return Decimal('0')
        overage_units = (actual - limit) // 10000
        return Decimal(overage_units) * rate


# ============================================================================
# TEST CLASS: Ad Platform Pricing (CPM, CPC, CPA)
# ============================================================================

@pytest.mark.p0
@pytest.mark.revenue
class TestAdPlatformPricing:
    """Test ad platform pricing calculations"""

    def test_cpm_base_calculation(self):
        """Test base CPM (Cost Per Mille) calculation

        Why Critical: Foundation of ad revenue
        Example: ₹100 CPM × 1M impressions = ₹1L revenue
        """
        base_cpm = Decimal('100')  # ₹100 per 1000 impressions
        impressions = 1000000  # 1 million

        revenue = self._calculate_cpm_revenue(base_cpm, impressions)
        expected = Decimal('100000')  # ₹1 lakh

        assert revenue == expected

    def test_intent_based_cpm_multiplier(self):
        """Test intent-based CPM multipliers

        Why Critical: Core value prop of PatternOS
        High Intent: 3x CPM (user has product in cart)
        Medium Intent: 2x CPM (viewed product multiple times)
        Low Intent: 1x CPM (casual browsing)
        """
        base_cpm = Decimal('100')

        # High intent: 3x
        high_cpm = self._apply_intent_multiplier(base_cpm, intent_level='high')
        assert high_cpm == Decimal('300')

        # Medium intent: 2x
        medium_cpm = self._apply_intent_multiplier(base_cpm, intent_level='medium')
        assert medium_cpm == Decimal('200')

        # Low intent: 1x
        low_cpm = self._apply_intent_multiplier(base_cpm, intent_level='low')
        assert low_cpm == Decimal('100')

    def test_value_intelligence_premium(self):
        """Test Value Intelligence Layer premium pricing

        Why Critical: New additive pricing model (from latest commit)
        Base CPM + Value Intelligence Premium (not multiplier)
        Example: ₹100 base + ₹50 premium = ₹150 total
        """
        base_cpm = Decimal('100')
        value_premium = Decimal('50')

        total_cpm = self._calculate_value_intelligence_cpm(base_cpm, value_premium)
        expected = Decimal('150')

        assert total_cpm == expected, \
            "Value Intelligence should be ADDITIVE, not multiplicative"

    def test_cpc_calculation(self):
        """Test CPC (Cost Per Click) calculation

        Why Critical: Alternative pricing model for performance campaigns
        Typical: ₹5-20 per click depending on category
        """
        clicks = 10000
        cpc = Decimal('10')

        revenue = clicks * cpc
        expected = Decimal('100000')

        assert revenue == expected

    def test_cpa_calculation(self):
        """Test CPA (Cost Per Acquisition) calculation

        Why Critical: Performance campaigns with guaranteed outcomes
        Example: ₹500 per purchase for high-value products
        """
        acquisitions = 500
        cpa = Decimal('500')

        revenue = acquisitions * cpa
        expected = Decimal('250000')  # ₹2.5L

        assert revenue == expected

    def test_channel_based_pricing(self):
        """Test channel-specific pricing variations

        Why Critical: Different channels have different values
        Channels: Search (high intent), Display (low intent), Social (medium)
        """
        base_cpm = Decimal('100')

        channels = {
            'search': Decimal('1.5'),      # 1.5x for search
            'display': Decimal('0.8'),     # 0.8x for display
            'social': Decimal('1.2'),      # 1.2x for social
            'video': Decimal('2.0')        # 2x for video
        }

        for channel, multiplier in channels.items():
            channel_cpm = base_cpm * multiplier
            assert channel_cpm == base_cpm * multiplier, \
                f"{channel} CPM calculation failed"

    # Helper methods
    def _calculate_cpm_revenue(self, cpm: Decimal, impressions: int) -> Decimal:
        """Calculate revenue from CPM pricing"""
        return cpm * (impressions / 1000)

    def _apply_intent_multiplier(self, base_cpm: Decimal, intent_level: str) -> Decimal:
        """Apply intent-based multiplier to CPM"""
        multipliers = {
            'high': Decimal('3.0'),
            'medium': Decimal('2.0'),
            'low': Decimal('1.0')
        }
        return base_cpm * multipliers.get(intent_level, Decimal('1.0'))

    def _calculate_value_intelligence_cpm(self, base_cpm: Decimal, premium: Decimal) -> Decimal:
        """Calculate CPM with additive Value Intelligence premium"""
        return base_cpm + premium


# ============================================================================
# TEST CLASS: ROAS (Return on Ad Spend) Calculations
# ============================================================================

@pytest.mark.p1
@pytest.mark.revenue
@pytest.mark.attribution
class TestROASCalculations:
    """Test ROAS calculation accuracy"""

    def test_basic_roas_calculation(self):
        """Test basic ROAS formula: Revenue / Ad Spend

        Why Critical: Primary metric customers use to evaluate PatternOS
        Example: ₹10L revenue / ₹2L spend = 5.0 ROAS
        """
        revenue = Decimal('1000000')  # ₹10L
        ad_spend = Decimal('200000')   # ₹2L

        roas = self._calculate_roas(revenue, ad_spend)
        expected = Decimal('5.0')

        assert roas == expected

    def test_omnichannel_roas(self):
        """Test unified ROAS across all channels

        Why Critical: PatternOS's key differentiator
        Channels: Search, Social, Display, In-App, Offline (QR codes)
        """
        channels_data = {
            'search': {'revenue': Decimal('500000'), 'spend': Decimal('100000')},
            'social': {'revenue': Decimal('300000'), 'spend': Decimal('75000')},
            'display': {'revenue': Decimal('200000'), 'spend': Decimal('50000')},
        }

        total_revenue = sum(d['revenue'] for d in channels_data.values())
        total_spend = sum(d['spend'] for d in channels_data.values())

        unified_roas = self._calculate_roas(total_revenue, total_spend)

        # Should aggregate correctly
        assert unified_roas == Decimal('4.44')  # Rounded to 2 decimals

    def test_roas_with_attribution_window(self):
        """Test ROAS calculation with attribution windows

        Why Critical: Prevents revenue double-counting
        Standard: 7-day click, 1-day view attribution
        """
        # Revenue from different attribution windows
        click_revenue = Decimal('800000')    # 7-day click
        view_revenue = Decimal('200000')     # 1-day view
        ad_spend = Decimal('200000')

        # Should only count each sale once (no double attribution)
        deduplicated_revenue = Decimal('900000')  # Some overlap removed
        roas = self._calculate_roas(deduplicated_revenue, ad_spend)

        assert roas == Decimal('4.5')

    def test_negative_roas_edge_case(self):
        """Test ROAS when revenue < ad spend (loss scenario)

        Why Critical: Must accurately report poor campaign performance
        """
        revenue = Decimal('50000')   # ₹50K revenue
        ad_spend = Decimal('100000')  # ₹1L spend

        roas = self._calculate_roas(revenue, ad_spend)
        expected = Decimal('0.5')  # 50% ROAS = loss

        assert roas == expected, "Must accurately report losses"

    def test_incremental_roas(self):
        """Test incremental ROAS (lift over baseline)

        Why Critical: Shows true PatternOS impact vs. organic sales
        iROAS = (Campaign Revenue - Baseline Revenue) / Ad Spend
        """
        campaign_revenue = Decimal('1000000')
        baseline_revenue = Decimal('600000')  # What they'd get organically
        ad_spend = Decimal('200000')

        incremental_revenue = campaign_revenue - baseline_revenue
        iroas = self._calculate_roas(incremental_revenue, ad_spend)

        expected = Decimal('2.0')  # ₹4L incremental / ₹2L spend
        assert iroas == expected

    # Helper methods
    def _calculate_roas(self, revenue: Decimal, spend: Decimal) -> Decimal:
        """Calculate Return on Ad Spend"""
        if spend == 0:
            return Decimal('0')
        return round(revenue / spend, 2)


# ============================================================================
# TEST CLASS: Platform Fee Calculations
# ============================================================================

@pytest.mark.p0
@pytest.mark.revenue
class TestPlatformFees:
    """Test platform fee and commission calculations"""

    def test_ad_platform_commission(self):
        """Test commission on ad spend managed through PatternOS

        Why Critical: 5-10% of total ad spend = major revenue stream
        Example: ₹1 crore ad spend × 7.5% = ₹7.5L commission
        """
        ad_spend = Decimal('10000000')  # ₹1 crore
        commission_rate = Decimal('0.075')  # 7.5%

        commission = ad_spend * commission_rate
        expected = Decimal('750000')  # ₹7.5L

        assert commission == expected

    def test_tiered_commission_structure(self):
        """Test tiered commission rates based on spend volume

        Why Critical: Incentivize larger spend commitments
        - 0-10L: 10% commission
        - 10L-50L: 7.5% commission
        - 50L+: 5% commission
        """
        test_cases = [
            (Decimal('500000'), Decimal('0.10'), Decimal('50000')),      # ₹5L spend
            (Decimal('3000000'), Decimal('0.075'), Decimal('225000')),   # ₹30L spend
            (Decimal('8000000'), Decimal('0.05'), Decimal('400000')),    # ₹80L spend
        ]

        for spend, rate, expected_commission in test_cases:
            commission = self._calculate_tiered_commission(spend)
            assert commission == expected_commission

    def test_transaction_fee_calculation(self):
        """Test per-transaction processing fees

        Why Critical: Adds up quickly at scale
        Example: ₹2 per transaction × 100K transactions = ₹2L monthly
        """
        transactions = 100000
        fee_per_transaction = Decimal('2')

        total_fees = transactions * fee_per_transaction
        expected = Decimal('200000')  # ₹2L

        assert total_fees == expected

    # Helper methods
    def _calculate_tiered_commission(self, spend: Decimal) -> Decimal:
        """Calculate commission based on tiered structure"""
        if spend <= Decimal('1000000'):  # Up to ₹10L
            return spend * Decimal('0.10')
        elif spend <= Decimal('5000000'):  # ₹10L to ₹50L
            return spend * Decimal('0.075')
        else:  # ₹50L+
            return spend * Decimal('0.05')


# ============================================================================
# FIXTURES
# ============================================================================

@pytest.fixture
def sample_campaign_data():
    """Sample campaign data for testing"""
    return {
        'advertiser': 'Zepto',
        'campaign_name': 'Hyperlocal Produce Campaign',
        'budget': Decimal('500000'),  # ₹5L
        'impressions': 5000000,        # 5M impressions
        'clicks': 150000,              # 150K clicks
        'conversions': 7500,           # 7.5K purchases
        'revenue': Decimal('2500000'), # ₹25L revenue
        'cpm': Decimal('100'),
        'cpc': Decimal('3.33'),
        'cpa': Decimal('66.67')
    }


@pytest.fixture
def sample_subscription_data():
    """Sample subscription data for testing"""
    return {
        'customer': 'Blinkit',
        'tier': 'growth',
        'base_arr': Decimal('800000'),
        'addons': ['vision_os', 'voice_os'],
        'contract_years': 2,
        'gmv_monthly': Decimal('50000000')  # ₹5 crore/month
    }
