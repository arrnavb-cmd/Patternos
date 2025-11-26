"""
Critical: Ad validation tests to prevent compliance issues
"""
import pytest
from app.ad_validation import validate_ad_content, check_compliance

class TestAdValidation:
    
    def test_reject_prohibited_content(self):
        """Reject ads with prohibited content"""
        prohibited_ad = {
            "content": "Buy illegal drugs now!",
            "target_age": "18+"
        }
        
        result = validate_ad_content(prohibited_ad)
        assert result.is_valid == False
        assert "prohibited_content" in result.errors
    
    def test_accept_valid_content(self):
        """Accept compliant ads"""
        valid_ad = {
            "content": "Shop organic groceries with 20% off",
            "target_age": "all"
        }
        
        result = validate_ad_content(valid_ad)
        assert result.is_valid == True
        assert len(result.errors) == 0
    
    def test_age_appropriate_content(self):
        """Validate age-appropriate targeting"""
        kids_ad = {
            "content": "Educational toys for children",
            "target_age": "under_13"
        }
        
        result = check_compliance(kids_ad)
        assert result.coppa_compliant == True
    
    def test_budget_limits(self):
        """Enforce budget limits"""
        overlimit_ad = {
            "budget": 1000000,  # Exceeds max
            "duration_days": 1
        }
        
        result = validate_ad_content(overlimit_ad)
        assert "budget_exceeded" in result.warnings
