"""
Integration tests for API endpoints
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

class TestCampaignAPI:
    
    def test_create_campaign_success(self):
        """Test successful campaign creation"""
        campaign_data = {
            "brand_name": "TestBrand",
            "budget": 5000,
            "objective": "awareness",
            "targeting": {"age": "25-34", "geo": "IN-KA"}
        }
        
        response = client.post("/campaigns", json=campaign_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["brand_name"] == "TestBrand"
        assert "id" in data
    
    def test_create_campaign_invalid_budget(self):
        """Test campaign rejection with invalid budget"""
        campaign_data = {
            "brand_name": "TestBrand",
            "budget": -100,  # Negative budget
            "objective": "awareness"
        }
        
        response = client.post("/campaigns", json=campaign_data)
        assert response.status_code == 422  # Validation error
    
    def test_pricing_endpoint(self):
        """Test pricing calculation endpoint"""
        pricing_request = {
            "impressions": 100000,
            "clicks": 5000,
            "conversions": 200,
            "spend": 1000
        }
        
        response = client.post("/pricing/calculate", json=pricing_request)
        
        assert response.status_code == 200
        data = response.json()
        assert "cpm" in data
        assert "cpc" in data
        assert "cpa" in data
        assert data["cpm"] == 10.0  # (1000/100000)*1000
