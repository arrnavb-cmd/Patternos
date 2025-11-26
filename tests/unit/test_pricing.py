"""
Critical: Pricing calculation tests to prevent revenue loss
"""
import pytest
from app.pricing import calculate_cpm, calculate_roas, calculate_budget

class TestPricingCalculations:
    
    def test_cpm_calculation_basic(self):
        """Test CPM = (Total Spend / Impressions) * 1000"""
        spend = 1000
        impressions = 50000
        expected_cpm = 20.0  # (1000/50000) * 1000
        
        result = calculate_cpm(spend, impressions)
        assert result == expected_cpm
    
    def test_cpm_zero_impressions(self):
        """Prevent division by zero"""
        with pytest.raises(ValueError):
            calculate_cpm(1000, 0)
    
    def test_roas_calculation(self):
        """Test ROAS = Revenue / Ad Spend"""
        revenue = 5000
        ad_spend = 1000
        expected_roas = 5.0
        
        result = calculate_roas(revenue, ad_spend)
        assert result == expected_roas
    
    def test_budget_allocation(self):
        """Test budget splits correctly across segments"""
        total_budget = 10000
        segments = ["premium", "mid-tier", "budget"]
        
        allocation = calculate_budget(total_budget, segments)
        
        # Sum should equal total
        assert sum(allocation.values()) == total_budget
        # All values should be positive
        assert all(v > 0 for v in allocation.values())

    @pytest.mark.parametrize("spend,impressions,expected", [
        (1000, 50000, 20.0),
        (2500, 100000, 25.0),
        (500, 10000, 50.0),
    ])
    def test_cpm_multiple_scenarios(self, spend, impressions, expected):
        """Test various pricing scenarios"""
        assert calculate_cpm(spend, impressions) == expected
