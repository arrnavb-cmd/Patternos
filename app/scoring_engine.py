"""
PatternOS Unified Intent Scoring Engine
Calculates intent scores from Behavioral, Visual, Voice, and Predictive AI
"""
import sqlite3
from datetime import datetime
from typing import Dict, Tuple

class IntentScoringEngine:
    def __init__(self, db_path: str = "intent_intelligence.db"):
        self.db_path = db_path
    
    def calculate_behavioral_score(self, customer_id: str) -> float:
        """Calculate behavioral score (0-100) from user events and intent data"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get behavioral metrics
        cursor.execute("""
            SELECT 
                COALESCE(page_views, 0) as page_views,
                COALESCE(cart_additions, 0) as cart_additions,
                COALESCE(search_queries, 0) as search_queries,
                COALESCE(time_spent, 0) as time_spent
            FROM intent_scores
            WHERE user_id = ?
        """, (customer_id,))
        
        result = cursor.fetchone()
        if not result:
            conn.close()
            return 0.0
        
        page_views, cart_additions, search_queries, time_spent = result
        
        # Calculate points
        page_view_points = min(page_views * 2, 20)
        cart_points = min(cart_additions * 10, 30)
        search_points = min(search_queries * 3, 15)
        time_points = min(time_spent / 100, 20)
        
        # Product views from events
        cursor.execute("""
            SELECT COUNT(*) FROM user_events 
            WHERE user_id = ? AND event_type = 'product_view'
        """, (customer_id,))
        product_views = cursor.fetchone()[0]
        product_points = min(product_views * 5, 15)
        
        conn.close()
        
        total = page_view_points + cart_points + search_points + time_points + product_points
        return min(total, 100.0)
    
    def calculate_visual_score(self, customer_id: str) -> float:
        """Calculate visual intelligence score (0-100)"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Count images captured
        cursor.execute("""
            SELECT COUNT(*), AVG(confidence_score)
            FROM visual_intelligence
            WHERE customer_id = ?
        """, (customer_id,))
        
        result = cursor.fetchone()
        if not result or result[0] == 0:
            conn.close()
            return 0.0
        
        image_count, avg_confidence = result
        
        # High confidence detections
        cursor.execute("""
            SELECT COUNT(*) FROM visual_intelligence
            WHERE customer_id = ? AND confidence_score > 0.8
        """, (customer_id,))
        high_conf_count = cursor.fetchone()[0]
        
        # Brand interactions
        cursor.execute("""
            SELECT COUNT(DISTINCT brand_detected)
            FROM visual_intelligence
            WHERE customer_id = ?
        """, (customer_id,))
        brand_count = cursor.fetchone()[0]
        
        # In-basket scenes
        cursor.execute("""
            SELECT COUNT(*) FROM visual_intelligence
            WHERE customer_id = ? AND scene_type = 'Customer Basket'
        """, (customer_id,))
        basket_count = cursor.fetchone()[0]
        
        conn.close()
        
        # Calculate points
        image_points = min(image_count * 5, 25)
        high_conf_points = min(high_conf_count * 15, 30)
        brand_points = min(brand_count * 3, 25)
        basket_points = 20 if basket_count > 0 else 0
        
        total = image_points + high_conf_points + brand_points + basket_points
        return min(total, 100.0)
    
    def calculate_voice_score(self, customer_id: str) -> float:
        """Calculate voice commerce score (0-100)"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Count voice queries
        cursor.execute("""
            SELECT COUNT(*) FROM voice_intelligence
            WHERE customer_id = ?
        """, (customer_id,))
        query_count = cursor.fetchone()[0]
        
        # High intent phrases
        cursor.execute("""
            SELECT COUNT(*) FROM voice_intelligence
            WHERE customer_id = ? 
            AND (intent_label LIKE '%Order%' OR intent_label LIKE '%Buy%')
        """, (customer_id,))
        high_intent_count = cursor.fetchone()[0]
        
        # Language diversity
        cursor.execute("""
            SELECT COUNT(DISTINCT language_code)
            FROM voice_intelligence
            WHERE customer_id = ?
        """, (customer_id,))
        lang_count = cursor.fetchone()[0]
        
        conn.close()
        
        # Calculate points
        query_points = min(query_count * 8, 40)
        intent_points = min(high_intent_count * 25, 50)
        lang_points = 10 if lang_count > 1 else 0
        
        total = query_points + intent_points + lang_points
        return min(total, 100.0)
    
    def calculate_predictive_score(self, customer_id: str) -> float:
        """Calculate predictive AI score (0-100) - placeholder for ML model"""
        # TODO: Replace with actual ML model predictions
        # For now, use heuristics based on existing data
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Check purchase history from intent_scores
        cursor.execute("""
            SELECT cart_additions, search_queries, page_views
            FROM intent_scores
            WHERE user_id = ?
        """, (customer_id,))
        
        result = cursor.fetchone()
        if not result:
            conn.close()
            return 50.0  # Neutral score
        
        cart_adds, searches, page_views = result
        
        # Simple predictive heuristics
        purchase_probability = min((cart_adds * 10) + (searches * 3), 40)
        category_affinity = min(page_views * 0.5, 20)
        engagement_score = 15 if (cart_adds > 2 or searches > 5) else 5
        
        conn.close()
        
        total = purchase_probability + category_affinity + engagement_score
        return min(total, 100.0)
    
    def calculate_unified_score(self, customer_id: str) -> Dict:
        """Calculate final unified intent score"""
        # Get individual scores
        behavioral = self.calculate_behavioral_score(customer_id)
        visual = self.calculate_visual_score(customer_id)
        voice = self.calculate_voice_score(customer_id)
        predictive = self.calculate_predictive_score(customer_id)
        
        # Apply weights
        behavioral_weighted = behavioral * 0.40
        visual_weighted = visual * 0.30
        voice_weighted = voice * 0.10
        predictive_weighted = predictive * 0.20
        
        # Final score
        final_score = behavioral_weighted + visual_weighted + voice_weighted + predictive_weighted
        
        # Determine intent level
        if final_score >= 70:
            intent_level = "High"
            action = "Push targeted ads immediately"
        elif final_score >= 50:
            intent_level = "Medium"
            action = "Nurture with product info"
        else:
            intent_level = "Low"
            action = "Brand awareness campaigns"
        
        # Data completeness
        signals_present = sum([behavioral > 0, visual > 0, voice > 0, predictive > 0])
        completeness = (signals_present / 4.0) * 100
        
        return {
            "customer_id": customer_id,
            "behavioral_score": round(behavioral, 2),
            "visual_score": round(visual, 2),
            "voice_score": round(voice, 2),
            "predictive_ai_score": round(predictive, 2),
            "behavioral_weighted": round(behavioral_weighted, 2),
            "visual_weighted": round(visual_weighted, 2),
            "voice_weighted": round(voice_weighted, 2),
            "predictive_weighted": round(predictive_weighted, 2),
            "final_intent_score": round(final_score, 2),
            "intent_level": intent_level,
            "confidence_level": round(completeness, 2),
            "recommended_action": action,
            "last_updated": datetime.now().isoformat()
        }
    
    def save_score(self, score_data: Dict):
        """Save unified score to database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT OR REPLACE INTO unified_intent_scores VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        """, (
            score_data['customer_id'],
            score_data['behavioral_score'],
            score_data['visual_score'],
            score_data['voice_score'],
            score_data['predictive_ai_score'],
            score_data['behavioral_weighted'],
            score_data['visual_weighted'],
            score_data['voice_weighted'],
            score_data['predictive_weighted'],
            score_data['final_intent_score'],
            score_data['intent_level'],
            score_data['confidence_level'],
            score_data['last_updated'],
            score_data['confidence_level'],
            score_data['recommended_action'],
            None  # suggested_category
        ))
        
        conn.commit()
        conn.close()

# Create singleton instance
scoring_engine = IntentScoringEngine()
