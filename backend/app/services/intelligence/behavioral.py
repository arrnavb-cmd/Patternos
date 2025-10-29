from typing import List, Dict, Optional
from datetime import datetime, timedelta
import random

class BehavioralIntelligence:
    """
    Tracks user behavior across platforms to identify intent signals
    """
    
    def analyze_user_journey(self, user_id: str, platforms: List[str]) -> Dict:
        """
        Analyze user journey across mobile, web, TV, and apps
        """
        journey = {
            "user_id": user_id,
            "platforms_tracked": platforms,
            "intent_signals": self._detect_intent_signals(user_id),
            "search_patterns": self._analyze_search_patterns(user_id),
            "device_usage": self._get_device_usage(user_id),
            "browsing_history": self._get_browsing_patterns(user_id),
            "social_signals": self._get_social_signals(user_id),
            "purchase_intent_score": self._calculate_intent_score(user_id),
            "recommended_products": self._get_product_recommendations(user_id)
        }
        return journey
    
    def _detect_intent_signals(self, user_id: str) -> List[Dict]:
        """Detect purchase intent signals"""
        signals = [
            {
                "signal_type": "search_frequency",
                "category": "wireless_earbuds",
                "frequency": 5,
                "last_searched": "2 hours ago",
                "intent_strength": "high",
                "predicted_purchase_window": "24-48 hours"
            },
            {
                "signal_type": "price_comparison",
                "product": "iPhone 15",
                "sites_visited": ["Flipkart", "Amazon", "Croma"],
                "intent_strength": "medium",
                "predicted_purchase_window": "3-7 days"
            },
            {
                "signal_type": "cart_abandonment",
                "product": "Nike Running Shoes",
                "platform": "Myntra",
                "abandoned_at": "yesterday",
                "intent_strength": "high",
                "predicted_purchase_window": "24 hours"
            }
        ]
        return signals
    
    def _analyze_search_patterns(self, user_id: str) -> Dict:
        """Analyze search behavior patterns"""
        return {
            "top_searches": [
                {"query": "wireless earbuds under 2000", "count": 12, "category": "electronics"},
                {"query": "best smartphones 2025", "count": 8, "category": "electronics"},
                {"query": "protein powder", "count": 5, "category": "health"}
            ],
            "search_evolution": [
                "generic search → brand research → price comparison → reviews → ready to buy"
            ],
            "current_stage": "price_comparison",
            "categories_of_interest": ["electronics", "fashion", "health"],
            "price_sensitivity": {
                "level": "medium",
                "preferred_range": "₹1500-₹3000"
            }
        }
    
    def _get_device_usage(self, user_id: str) -> Dict:
        """Track device usage patterns"""
        return {
            "primary_device": "mobile",
            "devices": {
                "mobile": {"usage": "65%", "peak_hours": ["9-11 AM", "8-10 PM"]},
                "laptop": {"usage": "25%", "peak_hours": ["2-5 PM"]},
                "tv": {"usage": "10%", "peak_hours": ["8-11 PM"]}
            },
            "preferred_shopping_device": "mobile",
            "conversion_device": "mobile"
        }
    
    def _get_browsing_patterns(self, user_id: str) -> Dict:
        """Analyze browsing behavior"""
        return {
            "platforms_visited": [
                {"platform": "Flipkart", "visits": 15, "avg_session": "12 min"},
                {"platform": "Amazon", "visits": 10, "avg_session": "8 min"},
                {"platform": "Myntra", "visits": 8, "avg_session": "15 min"},
                {"platform": "Zepto", "visits": 20, "avg_session": "5 min"}
            ],
            "category_engagement": {
                "electronics": {"time_spent": "45 min", "products_viewed": 23},
                "fashion": {"time_spent": "30 min", "products_viewed": 18},
                "groceries": {"time_spent": "15 min", "products_viewed": 12}
            },
            "scroll_depth": "85%",
            "product_page_visits": 45,
            "checkout_abandonment_rate": "40%"
        }
    
    def _get_social_signals(self, user_id: str) -> Dict:
        """Track social media behavior"""
        return {
            "instagram": {
                "fashion_interest": "high",
                "influenced_by": ["tech_reviewers", "fashion_bloggers"],
                "engagement": ["product_tags", "swipe_ups"]
            },
            "youtube": {
                "watch_history": ["unboxing_videos", "product_reviews", "comparisons"],
                "categories": ["tech", "fitness", "fashion"]
            },
            "pinterest": {
                "saved_boards": ["home_decor", "fashion_inspiration"],
                "intent_signal": "medium"
            }
        }
    
    def _calculate_intent_score(self, user_id: str) -> Dict:
        """Calculate purchase intent score 0-100"""
        return {
            "overall_score": 87,
            "breakdown": {
                "search_frequency": 90,
                "price_comparison": 85,
                "review_reading": 80,
                "social_engagement": 88,
                "cart_activity": 92
            },
            "confidence": "high",
            "ready_to_buy": True,
            "optimal_ad_timing": "next 24 hours"
        }
    
    def _get_product_recommendations(self, user_id: str) -> List[Dict]:
        """Get AI-powered product recommendations"""
        return [
            {
                "product_id": "PROD_001",
                "name": "boAt Airdopes 131",
                "category": "wireless_earbuds",
                "price": 1299,
                "match_score": 95,
                "reason": "Matches search history + price range",
                "platforms_available": ["Flipkart", "Amazon", "Zepto"],
                "predicted_conversion": "78%"
            },
            {
                "product_id": "PROD_002",
                "name": "Noise Buds VS104",
                "category": "wireless_earbuds",
                "price": 1499,
                "match_score": 92,
                "reason": "Similar to previously viewed products",
                "platforms_available": ["Flipkart", "Nykaa"],
                "predicted_conversion": "72%"
            }
        ]

# Global instance
behavioral_intelligence = BehavioralIntelligence()
