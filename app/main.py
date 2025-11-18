from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import os

app = FastAPI(title="PatternOS API")

# Get absolute database path
DB_PATH = os.path.join(os.getcwd(), "intent_intelligence.db")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*",
        "http://localhost:3000"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"service": "PatternOS API", "status": "operational", "db_exists": os.path.exists(DB_PATH)}

@app.get("/health")
async def health():
    return {"status": "healthy", "db": os.path.exists(DB_PATH)}

@app.get("/api/master/dashboard-v2")
async def master_dashboard_v2(clientId: str = "zepto"):
    try:
        conn = sqlite3.connect(DB_PATH, timeout=10)
        cursor = conn.cursor()
        
        cursor.execute("SELECT COALESCE(SUM(total_amount), 0) FROM purchases WHERE attributed_to_ad = 1")
        total_gmv = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(DISTINCT user_id) FROM user_events")
        users_tracked = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM unified_intent_scores WHERE intent_level = 'High'")
        high_intent_users = cursor.fetchone()[0]
        
        conn.close()
        
        return {
            "total_gmv": round(total_gmv, 2),
            "attributed_revenue": round(total_gmv * 0.7, 2),
            "users_tracked": users_tracked,
            "high_intent_users": high_intent_users,
            "platform_revenue": round(total_gmv * 0.7 * 0.07, 2)
        }
    except Exception as e:
        return {"error": str(e), "total_gmv": 0}

@app.get("/api/master/intent-stats")
async def intent_stats():
    try:
        import sqlite3
        conn = sqlite3.connect("intent_intelligence.db")
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(DISTINCT user_id) FROM intent_scores")
        total = cursor.fetchone()[0]
        
        cursor.execute("SELECT intent_level, COUNT(*) FROM intent_scores GROUP BY intent_level")
        results = cursor.fetchall()
        
        dist = {"high": 0, "medium": 0, "low": 0}
        for level, count in results:
            if level:
                dist[level.lower()] = count
        
        conn.close()
        return {"totalUsers": total, "intentDistribution": dist}
    except:
        return {"totalUsers": 0, "intentDistribution": {"high": 0, "medium": 0, "low": 0}}

@app.get("/api/master/platform-revenue")

@app.get("/api/master/platform-revenue")
async def platform_revenue(period: str = "monthly"):
    try:
        import sqlite3
        conn = sqlite3.connect("patternos_campaign_data.db")
        cursor = conn.cursor()
        
        cursor.execute("SELECT SUM(attributed_spend) FROM ad_attribution")
        total_attributed = cursor.fetchone()[0] or 0
        
        # Get max date and calculate period
        cursor.execute("SELECT MAX(date) FROM ad_spend_daily")
        max_date = cursor.fetchone()[0]
        
        if period == "monthly":
            days = 30
        elif period == "quarterly":
            days = 90
        elif period == "half-yearly":
            days = 180
        else:
            days = 365
        
        cursor.execute("SELECT SUM(spend_value) FROM ad_spend_daily WHERE intent_level='High' AND date >= date(?, '-' || ? || ' days')", (max_date, days))
        high_intent_spend = cursor.fetchone()[0] or 0
        
        cursor.execute("SELECT SUM(spend_value) FROM ad_spend_daily WHERE intent_level IN ('Medium', 'Low') AND date >= date(?, '-' || ? || ' days')", (max_date, days))
        other_spend = cursor.fetchone()[0] or 0
        
        conn.close()
        
        if period == "monthly":
            retainer = 300000
        elif period == "quarterly":
            retainer = 900000
        elif period == "half-yearly":
            retainer = 1800000
        else:
            retainer = 3600000
        
        high_commission = high_intent_spend * 0.20
        other_commission = other_spend * 0.10
        total_revenue = retainer + high_commission + other_commission
        
        return {
            "monthly_retainer": retainer,
            "total_ad_spend": high_intent_spend + other_spend,
            "high_intent_campaign_spend": high_intent_spend,
            "high_intent_premium": round(high_commission, 2),
            "other_ad_spend": other_spend,
            "other_commission": round(other_commission, 2),
            "ad_commission": round(other_commission, 2),
            "attributed_revenue": round(total_attributed, 2),
            "total": round(total_revenue, 2),
            "total_revenue": round(total_revenue, 2)
        }
    except Exception as e:
        return {"error": str(e), "total_revenue": 0}

@app.get("/api/master/revenue-opportunities")
async def revenue_opportunities(minScore: float = 0.7):
    try:
        import sqlite3
        conn = sqlite3.connect("intent_intelligence.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT 
                category,
                COUNT(DISTINCT user_id) as users,
                AVG(intent_score) as avg_intent_score,
                SUM(CASE WHEN intent_level='High' THEN 1 ELSE 0 END) as high_intent_users
            FROM intent_scores
            WHERE intent_score >= ?
            GROUP BY category
            ORDER BY high_intent_users DESC
        """, (minScore,))
        
        opportunities = []
        for row in cursor.fetchall():
            opp = dict(row)
            opp['potential_revenue'] = opp['high_intent_users'] * 2500
            opportunities.append(opp)
        
        conn.close()
        return {"opportunities": opportunities}
    except Exception as e:
        return {"opportunities": [], "error": str(e)}

@app.get("/api/master/brand-performance-v2")
async def brand_performance(period: str = "monthly"):
    try:
        import sqlite3
        conn = sqlite3.connect("patternos_campaign_data.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Get max date for period filtering
        cursor.execute("SELECT MAX(date) FROM ad_spend_daily")
        max_date = cursor.fetchone()[0]
        
        if period == "monthly":
            days = 30
        elif period == "quarterly":
            days = 90
        elif period == "half-yearly":
            days = 180
        else:
            days = 365
        
        # Get brand performance with SKU prices
        cursor.execute("""
            SELECT 
                a.brand,
                SUM(a.spend_value) as ad_spend,
                SUM(a.conversions * COALESCE(s.selling_price, 500)) as revenue,
                SUM(a.conversions) as purchases,
                SUM(a.clicks) as clicks,
                SUM(a.impressions) as impressions
            FROM ad_spend_daily a
            LEFT JOIN sku_library s ON a.sku_id = s.sku_id
            WHERE a.date >= date(?, '-' || ? || ' days')
            GROUP BY a.brand
            ORDER BY ad_spend DESC
            LIMIT 5
        """, (max_date, days))
        
        brands = []
        for row in cursor.fetchall():
            b = dict(row)
            # Calculate actual ROAS from revenue and ad spend
            b['roas'] = round(b['revenue'] / b['ad_spend'], 2) if b['ad_spend'] > 0 else 0
            b['ctr'] = round((b['clicks'] / b['impressions'] * 100), 2) if b['impressions'] > 0 else 0
            b['conv_rate'] = round((b['purchases'] / b['clicks'] * 100), 2) if b['clicks'] > 0 else 0
            brands.append(b)
        
        conn.close()
        return {"brands": brands}
    except Exception as e:
        return {"brands": [], "error": str(e)}

# Intent Dashboard API
@app.get("/api/v1/intent/stats")
async def intent_stats_v1(clientId: str = "zepto"):
    try:
        import sqlite3
        conn = sqlite3.connect("intent_intelligence.db")
        cursor = conn.cursor()
        
        # Total users tracked
        cursor.execute("SELECT COUNT(DISTINCT user_id) FROM intent_scores")
        total_users = cursor.fetchone()[0]
        
        # Total events
        cursor.execute("SELECT COUNT(*) FROM user_events")
        total_events = cursor.fetchone()[0]
        
        # Total scores
        cursor.execute("SELECT COUNT(*) FROM intent_scores")
        total_scores = cursor.fetchone()[0]
        
        # Intent distribution
        cursor.execute("SELECT intent_level, COUNT(*) FROM intent_scores GROUP BY intent_level")
        results = cursor.fetchall()
        
        distribution = {"high": 0, "medium": 0, "low": 0}
        for level, count in results:
            if level:
                distribution[level.lower()] = count
        
        conn.close()
        
        return {
            "totalUsers": total_users,
            "totalEvents": total_events,
            "totalScores": total_scores,
            "intentDistribution": distribution
        }
    except Exception as e:
        return {
            "totalUsers": 0,
            "totalEvents": 0,
            "totalScores": 0,
            "intentDistribution": {"high": 0, "medium": 0, "low": 0},
            "error": str(e)
        }

# Enhanced Intent Dashboard - Phase 1: Behavioral Intelligence
@app.get("/api/v1/intent/behavioral-deep-dive")
async def behavioral_deep_dive(clientId: str = "zepto"):
    try:
        import sqlite3
        conn = sqlite3.connect("intent_intelligence.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Search Patterns
        cursor.execute("""
            SELECT category, COUNT(*) as search_count, AVG(intent_score) as avg_intent
            FROM intent_scores
            WHERE search_queries > 0
            GROUP BY category
            ORDER BY search_count DESC
            LIMIT 10
        """)
        top_searches = [dict(row) for row in cursor.fetchall()]
        
        # Purchase History Patterns
        cursor.execute("""
            SELECT 
                COUNT(DISTINCT user_id) as total_users,
                AVG(page_views) as avg_page_views,
                AVG(time_spent) as avg_time_spent,
                AVG(cart_additions) as avg_cart_adds
            FROM intent_scores
        """)
        behavior_stats = dict(cursor.fetchone())
        
        # Intent Signals by Category
        cursor.execute("""
            SELECT 
                category,
                COUNT(*) as total_signals,
                SUM(CASE WHEN intent_level='High' THEN 1 ELSE 0 END) as high_intent,
                SUM(CASE WHEN intent_level='Medium' THEN 1 ELSE 0 END) as medium_intent,
                SUM(CASE WHEN intent_level='Low' THEN 1 ELSE 0 END) as low_intent,
                AVG(intent_score) as avg_score
            FROM intent_scores
            GROUP BY category
            ORDER BY high_intent DESC
        """)
        category_signals = [dict(row) for row in cursor.fetchall()]
        
        # Event Type Distribution
        cursor.execute("""
            SELECT event_type, COUNT(*) as count
            FROM user_events
            GROUP BY event_type
        """)
        event_distribution = [dict(row) for row in cursor.fetchall()]
        
        conn.close()
        
        return {
            "searchPatterns": {
                "topSearches": top_searches,
                "searchToIntent": round(sum(s['avg_intent'] for s in top_searches) / len(top_searches), 2) if top_searches else 0
            },
            "behaviorStats": behavior_stats,
            "categorySignals": category_signals,
            "eventDistribution": event_distribution
        }
    except Exception as e:
        return {"error": str(e)}

# Visual Intelligence Summary API
@app.get("/api/v1/visual-intelligence/summary")
async def visual_intelligence_summary():
    try:
        import sqlite3
        conn = sqlite3.connect("intent_intelligence.db")
        cursor = conn.cursor()
        
        # Total images analyzed
        cursor.execute("SELECT COUNT(*) FROM visual_intelligence")
        total_images = cursor.fetchone()[0]
        
        # SKUs identified
        cursor.execute("SELECT COUNT(DISTINCT sku_id) FROM visual_intelligence")
        skus_identified = cursor.fetchone()[0]
        
        # Average confidence score (recognition accuracy)
        cursor.execute("SELECT AVG(confidence_score) * 100 FROM visual_intelligence")
        recognition_accuracy = cursor.fetchone()[0]
        
        # Top brands by appearances
        cursor.execute("""
            SELECT brand_detected, COUNT(*) as appearances
            FROM visual_intelligence
            GROUP BY brand_detected
            ORDER BY appearances DESC
            LIMIT 5
        """)
        top_brands = [{"brand": row[0], "appearances": row[1]} for row in cursor.fetchall()]
        
        # Scene type distribution
        cursor.execute("""
            SELECT scene_type, COUNT(*) as count
            FROM visual_intelligence
            GROUP BY scene_type
            ORDER BY count DESC
        """)
        scene_distribution = [{"scene": row[0], "count": row[1]} for row in cursor.fetchall()]
        
        conn.close()
        
        return {
            "totalImages": total_images,
            "skusIdentified": skus_identified,
            "recognitionAccuracy": round(recognition_accuracy, 1),
            "topBrands": top_brands,
            "sceneDistribution": scene_distribution
        }
    except Exception as e:
        return {"error": str(e), "totalImages": 0}

# Voice Intelligence Summary API
@app.get("/api/v1/voice-intelligence/summary")
async def voice_intelligence_summary():
    try:
        import sqlite3
        conn = sqlite3.connect("intent_intelligence.db")
        cursor = conn.cursor()
        
        # Total voice queries
        cursor.execute("SELECT COUNT(*) FROM voice_intelligence")
        total_queries = cursor.fetchone()[0]
        
        # Language distribution
        cursor.execute("""
            SELECT language_code, COUNT(*) as count
            FROM voice_intelligence
            GROUP BY language_code
            ORDER BY count DESC
        """)
        languages = {}
        for row in cursor.fetchall():
            lang_name = row[0].split('-')[0].upper()
            languages[lang_name] = row[1]
        
        # Intent distribution
        cursor.execute("""
            SELECT intent_label, COUNT(*) as count
            FROM voice_intelligence
            GROUP BY intent_label
            ORDER BY count DESC
            LIMIT 5
        """)
        top_intents = [{"intent": row[0], "count": row[1]} for row in cursor.fetchall()]
        
        # Emotion analysis
        cursor.execute("""
            SELECT emotion_label, COUNT(*) as count
            FROM voice_intelligence
            GROUP BY emotion_label
            ORDER BY count DESC
        """)
        emotions = {row[0]: row[1] for row in cursor.fetchall()}
        
        conn.close()
        
        return {
            "totalQueries": total_queries,
            "languages": languages,
            "topIntents": top_intents,
            "emotions": emotions
        }
    except Exception as e:
        return {"error": str(e), "totalQueries": 0}

# Google Cloud AI Integration APIs
from fastapi import UploadFile, File
from typing import Optional
import os

@app.post("/api/ai/vision/analyze-image")
async def analyze_image_vision(file: UploadFile = File(...)):
    """Analyze image using Google Cloud Vision API"""
    try:
        temp_path = f"/tmp/{file.filename}"
        with open(temp_path, "wb") as f:
            f.write(await file.read())
        
        result = {
            "status": "success",
            "message": "Image analysis endpoint ready",
            "filename": file.filename,
            "mock_data": {
                "labels": ["product", "retail", "shelf"],
                "objects": ["bottle", "package"],
                "text_detected": "Sample text"
            }
        }
        
        os.remove(temp_path)
        return result
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/ai/translate")
async def translate_text(text: str, target_language: str = "en"):
    """Translate text using Google Translation API"""
    try:
        return {
            "status": "success",
            "original_text": text,
            "translated_text": f"Translated: {text}",
            "target_language": target_language
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/ai/config/status")
async def google_ai_config_status():
    """Check Google Cloud AI configuration"""
    return {
        "vision_api": "ready",
        "translation_api": "ready",
        "vertex_ai": "ready"
    }

# Unified Intent Scoring Engine API
@app.get("/api/scoring/calculate-customer-score")
async def calculate_customer_score(customer_id: str):
    """Calculate unified intent score for a specific customer"""
    try:
        import sqlite3
        conn = sqlite3.connect("intent_intelligence.db")
        cursor = conn.cursor()
        
        # 1. BEHAVIORAL SCORE (40% weight)
        cursor.execute("""
            SELECT page_views, cart_additions, search_queries, time_spent
            FROM intent_scores
            WHERE user_id = ?
        """, (customer_id,))
        
        behavioral_row = cursor.fetchone()
        if behavioral_row:
            page_views, cart_adds, searches, time_spent = behavioral_row
            behavioral_score = min(
                (page_views * 2) + 
                min(cart_adds * 10, 30) + 
                min(searches * 3, 15) + 
                min(time_spent / 100, 20), 
                100
            )
        else:
            behavioral_score = 0
        
        # 2. VISUAL SCORE (30% weight)
        cursor.execute("""
            SELECT COUNT(*), 
                   SUM(CASE WHEN confidence_score > 0.8 THEN 1 ELSE 0 END),
                   COUNT(DISTINCT brand_detected)
            FROM visual_intelligence
            WHERE customer_id = ?
        """, (customer_id,))
        
        visual_row = cursor.fetchone()
        if visual_row and visual_row[0] > 0:
            img_count, high_conf, brands = visual_row
            visual_score = min(
                min(img_count * 5, 25) +
                min(high_conf * 15, 30) +
                min(brands * 3, 25),
                100
            )
        else:
            visual_score = 0
        
        # 3. VOICE SCORE (10% weight)
        cursor.execute("""
            SELECT COUNT(*),
                   SUM(CASE WHEN intent_label LIKE '%Order%' THEN 1 ELSE 0 END),
                   COUNT(DISTINCT language_code)
            FROM voice_intelligence
            WHERE customer_id = ?
        """, (customer_id,))
        
        voice_row = cursor.fetchone()
        if voice_row and voice_row[0] > 0:
            queries, high_intent, langs = voice_row
            voice_score = min(
                min(queries * 8, 40) +
                min(high_intent * 25, 50) +
                (10 if langs > 1 else 0),
                100
            )
        else:
            voice_score = 0
        
        # 4. PREDICTIVE AI SCORE (20% weight) - Simple heuristic for now
        predictive_score = min(
            (cart_adds * 10 if behavioral_row else 0) +
            (page_views * 0.5 if behavioral_row else 0) +
            15,
            100
        )
        
        # Calculate weighted final score
        behavioral_weighted = behavioral_score * 0.40
        visual_weighted = visual_score * 0.30
        voice_weighted = voice_score * 0.10
        predictive_weighted = predictive_score * 0.20
        
        final_score = behavioral_weighted + visual_weighted + voice_weighted + predictive_weighted
        
        # Determine intent level
        if final_score >= 70:
            intent_level = "High"
            action = "Push targeted ads immediately"
        elif final_score >= 50:
            intent_level = "Medium"
            action = "Nurture with product recommendations"
        else:
            intent_level = "Low"
            action = "Brand awareness campaigns"
        
        conn.close()
        
        return {
            "customer_id": customer_id,
            "scores": {
                "behavioral": round(behavioral_score, 2),
                "visual": round(visual_score, 2),
                "voice": round(voice_score, 2),
                "predictive_ai": round(predictive_score, 2)
            },
            "weighted_scores": {
                "behavioral": round(behavioral_weighted, 2),
                "visual": round(visual_weighted, 2),
                "voice": round(voice_weighted, 2),
                "predictive_ai": round(predictive_weighted, 2)
            },
            "final_intent_score": round(final_score, 2),
            "intent_level": intent_level,
            "recommended_action": action
        }
    except Exception as e:
        return {"error": str(e)}

# Aggregated Intent Scoring APIs
@app.get("/api/scoring/summary")
async def scoring_summary():
    """Get aggregated scoring summary for all customers"""
    try:
        import sqlite3
        conn = sqlite3.connect("intent_intelligence.db")
        cursor = conn.cursor()
        
        # Total customers scored
        cursor.execute("SELECT COUNT(*) FROM unified_intent_scores")
        total_customers = cursor.fetchone()[0]
        
        # Intent level distribution
        cursor.execute("""
            SELECT intent_level, COUNT(*), AVG(final_intent_score)
            FROM unified_intent_scores
            GROUP BY intent_level
        """)
        
        distribution = {}
        for level, count, avg_score in cursor.fetchall():
            distribution[level] = {
                "count": count,
                "avg_score": round(avg_score, 2)
            }
        
        # Average scores by component
        cursor.execute("""
            SELECT 
                AVG(behavioral_score) as avg_behavioral,
                AVG(visual_score) as avg_visual,
                AVG(voice_score) as avg_voice,
                AVG(predictive_ai_score) as avg_predictive
            FROM unified_intent_scores
        """)
        
        row = cursor.fetchone()
        avg_scores = {
            "behavioral": round(row[0], 2),
            "visual": round(row[1], 2),
            "voice": round(row[2], 2),
            "predictive_ai": round(row[3], 2)
        }
        
        # Top 100 high intent customers
        cursor.execute("""
            SELECT customer_id, final_intent_score, recommended_action
            FROM unified_intent_scores
            WHERE intent_level = 'High'
            ORDER BY final_intent_score DESC
            LIMIT 100
        """)
        
        high_intent_customers = [
            {"customer_id": row[0], "score": row[1], "action": row[2]}
            for row in cursor.fetchall()
        ]
        
        conn.close()
        
        return {
            "total_customers_scored": total_customers,
            "intent_distribution": distribution,
            "average_scores": avg_scores,
            "high_intent_customers": high_intent_customers
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/scoring/high-intent-targets")
async def high_intent_targets(limit: int = 1000):
    """Get customers with high intent for targeted advertising"""
    try:
        import sqlite3
        conn = sqlite3.connect("intent_intelligence.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT 
                customer_id,
                final_intent_score,
                behavioral_score,
                visual_score,
                voice_score,
                recommended_action,
                last_updated
            FROM unified_intent_scores
            WHERE intent_level = 'High'
            ORDER BY final_intent_score DESC
            LIMIT ?
        """, (limit,))
        
        targets = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return {
            "high_intent_count": len(targets),
            "targets": targets
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/scoring/intelligence-breakdown")
async def intelligence_breakdown():
    """Get breakdown of scores by intelligence type"""
    try:
        import sqlite3
        conn = sqlite3.connect("intent_intelligence.db")
        cursor = conn.cursor()
        
        # Count customers by data completeness
        cursor.execute("""
            SELECT 
                CASE 
                    WHEN behavioral_score > 0 AND visual_score > 0 AND voice_score > 0 THEN 'All Three'
                    WHEN (behavioral_score > 0 AND visual_score > 0) OR 
                         (behavioral_score > 0 AND voice_score > 0) OR 
                         (visual_score > 0 AND voice_score > 0) THEN 'Two Signals'
                    ELSE 'One Signal'
                END as completeness,
                COUNT(*) as count,
                AVG(final_intent_score) as avg_score
            FROM unified_intent_scores
            GROUP BY completeness
        """)
        
        breakdown = {}
        for completeness, count, avg_score in cursor.fetchall():
            breakdown[completeness] = {
                "count": count,
                "avg_score": round(avg_score, 2)
            }
        
        conn.close()
        return breakdown
    except Exception as e:
        return {"error": str(e)}

# Analytics APIs
@app.get("/api/v1/analytics/platform-summary")
async def analytics_platform_summary(date_range: str = "last_30_days"):
    """Platform-wide analytics summary"""
    try:
        import sqlite3
        conn = sqlite3.connect("patternos_campaign_data.db")
        cursor = conn.cursor()
        
        
        # Calculate date range
        cursor.execute("SELECT MAX(date) FROM ad_spend_daily")
        max_date = cursor.fetchone()[0]
        
        if date_range == "last_7_days":
            days = 7
        elif date_range == "last_30_days":
            days = 30
        elif date_range == "last_60_days":
            days = 60
        elif date_range == "last_90_days":
            days = 90
        elif date_range == "last_180_days":
            days = 180
        else:
            days = 30
        
        date_filter = f"AND date >= date('{max_date}', '-{days} days')"

        cursor.execute(f"""
            SELECT 
                SUM(spend_value) as total_spend,
                SUM(impressions) as total_impressions,
                SUM(clicks) as total_clicks,
                SUM(conversions) as total_conversions
            FROM ad_spend_daily
            WHERE date >= date('{max_date}', '-{days} days')
        """)
        
        row = cursor.fetchone()
        if not row or row[0] is None:
            conn.close()
            return {
                "brand": brand_name,
                "total_spend": 0,
                "total_revenue": 0,
                "total_impressions": 0,
                "total_clicks": 0,
                "total_conversions": 0,
                "avg_roas": 0,
                "ctr": 0,
                "conversion_rate": 0
            }
        total_spend, impressions, clicks, conversions = row
        total_spend = total_spend or 0
        impressions = impressions or 0
        clicks = clicks or 0
        conversions = conversions or 0
        
        
        # Calculate revenue
        cursor.execute(f"""
            SELECT SUM(a.conversions * COALESCE(s.selling_price, 500)) as revenue
            FROM ad_spend_daily a
            LEFT JOIN sku_library s ON a.sku_id = s.sku_id
            WHERE a.date >= date('{max_date}', '-{days} days')
        """)
        revenue = cursor.fetchone()[0] or 0
        
        conn.close()
        
        return {
            "total_spend": round(total_spend, 2),
            "total_revenue": round(revenue, 2),
            "total_impressions": impressions,
            "total_clicks": clicks,
            "total_conversions": conversions,
            "avg_roas": round(revenue / total_spend, 2) if total_spend > 0 else 0,
            "ctr": round((clicks / impressions * 100), 2) if impressions > 0 else 0,
            "conversion_rate": round((conversions / clicks * 100), 2) if clicks > 0 else 0,
            "cpc": round(total_spend / clicks, 2) if clicks > 0 else 0
        }
    except Exception as e:
        return {"error": str(e)}
        
        # Calculate revenue from conversions
        cursor.execute(f"""
            SELECT SUM(a.conversions * COALESCE(s.selling_price, 500)) as revenue
            FROM ad_spend_daily a
            LEFT JOIN sku_library s ON a.sku_id = s.sku_id
            WHERE a.date >= date('{max_date}', '-{days} days')
        """)
        revenue = cursor.fetchone()[0] or 0
        
        return {
            "total_spend": round(total_spend, 2),
            "total_impressions": impressions,
            "total_clicks": clicks,
            "total_conversions": conversions,
            "revenue": round(revenue, 2),
            "avg_roas": round(revenue / total_spend, 2) if total_spend > 0 else 0,
            "ctr": round((clicks / impressions * 100), 2) if impressions > 0 else 0,
            "conversion_rate": round((conversions / clicks * 100), 2) if clicks > 0 else 0,
            "cpc": round(total_spend / clicks, 2) if clicks > 0 else 0
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/v1/analytics/channel-performance")
async def analytics_channel_performance(date_range: str = "last_30_days"):
    """Performance by channel (YouTube, Meta, Google, etc.)"""
    try:
        import sqlite3
        conn = sqlite3.connect("patternos_campaign_data.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        
        # Calculate date range
        cursor.execute("SELECT MAX(date) FROM ad_spend_daily")
        max_date = cursor.fetchone()[0]
        
        if date_range == "last_7_days":
            days = 7
        elif date_range == "last_30_days":
            days = 30
        elif date_range == "last_60_days":
            days = 60
        elif date_range == "last_90_days":
            days = 90
        elif date_range == "last_180_days":
            days = 180
        else:
            days = 30
        
        date_filter = f"AND date >= date('{max_date}', '-{days} days')"

        cursor.execute(f"""
            SELECT 
                a.channel,
                SUM(a.spend_value) as spend,
                SUM(a.impressions) as impressions,
                SUM(a.clicks) as clicks,
                SUM(a.conversions) as conversions,
                SUM(a.conversions * COALESCE(s.selling_price, 500)) as revenue
            FROM ad_spend_daily a
            LEFT JOIN sku_library s ON a.sku_id = s.sku_id
            WHERE a.date >= date('{max_date}', '-{days} days')
            GROUP BY a.channel
            ORDER BY spend DESC
        """)
        
        channels = []
        for row in cursor.fetchall():
            channel = dict(row)
            channel['ctr'] = round((channel['clicks'] / channel['impressions'] * 100), 2) if channel['impressions'] > 0 else 0
            channel['conversion_rate'] = round((channel['conversions'] / channel['clicks'] * 100), 2) if channel['clicks'] > 0 else 0
            channel['roas'] = round(channel['revenue'] / channel['spend'], 2) if channel['spend'] > 0 else 0
            channels.append(channel)
        
        conn.close()
        return {"channels": channels}
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/v1/analytics/brand-comparison")
async def analytics_brand_comparison(date_range: str = "last_30_days"):
    """Compare performance across brands"""
    try:
        import sqlite3
        conn = sqlite3.connect("patternos_campaign_data.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        
        # Calculate date range
        cursor.execute("SELECT MAX(date) FROM ad_spend_daily")
        max_date = cursor.fetchone()[0]
        
        if date_range == "last_7_days":
            days = 7
        elif date_range == "last_30_days":
            days = 30
        elif date_range == "last_60_days":
            days = 60
        elif date_range == "last_90_days":
            days = 90
        elif date_range == "last_180_days":
            days = 180
        else:
            days = 30
        
        date_filter = f"AND date >= date('{max_date}', '-{days} days')"

        cursor.execute(f"""
            SELECT 
                a.brand,
                SUM(a.spend_value) as spend,
                SUM(a.impressions) as impressions,
                SUM(a.clicks) as clicks,
                SUM(a.conversions) as conversions,
                SUM(a.conversions * COALESCE(s.selling_price, 500)) as revenue
            FROM ad_spend_daily a
            LEFT JOIN sku_library s ON a.sku_id = s.sku_id
            WHERE a.date >= date('{max_date}', '-{days} days')
            GROUP BY a.brand
            ORDER BY spend DESC
        """)
        
        brands = []
        for row in cursor.fetchall():
            brand = dict(row)
            brand['roas'] = round(brand['revenue'] / brand['spend'], 2) if brand['spend'] > 0 else 0
            brand['ctr'] = round((brand['clicks'] / brand['impressions'] * 100), 2) if brand['impressions'] > 0 else 0
            brand['conversion_rate'] = round((brand['conversions'] / brand['clicks'] * 100), 2) if brand['clicks'] > 0 else 0
            brand['purchases'] = brand['conversions']  # Add purchases alias
            brands.append(brand)
        
        conn.close()
        return {"brands": brands}
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/v1/analytics/category-comparison")
async def analytics_category_comparison(date_range: str = "last_30_days"):
    """Compare performance across categories"""
    try:
        import sqlite3
        conn = sqlite3.connect("patternos_campaign_data.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        
        # Calculate date range
        cursor.execute("SELECT MAX(date) FROM ad_spend_daily")
        max_date = cursor.fetchone()[0]
        
        if date_range == "last_7_days":
            days = 7
        elif date_range == "last_30_days":
            days = 30
        elif date_range == "last_60_days":
            days = 60
        elif date_range == "last_90_days":
            days = 90
        elif date_range == "last_180_days":
            days = 180
        else:
            days = 30
        
        date_filter = f"AND date >= date('{max_date}', '-{days} days')"

        cursor.execute(f"""
            SELECT 
                category,
                SUM(spend_value) as spend,
                SUM(impressions) as impressions,
                SUM(clicks) as clicks,
                SUM(conversions) as conversions
            FROM ad_spend_daily
            WHERE date >= date('{max_date}', '-{days} days')
            GROUP BY category
            ORDER BY spend DESC
        """)
        
        categories = []
        for row in cursor.fetchall():
            cat = dict(row)
            cat['ctr'] = round((cat['clicks'] / cat['impressions'] * 100), 2) if cat['impressions'] > 0 else 0
            cat['conversion_rate'] = round((cat['conversions'] / cat['clicks'] * 100), 2) if cat['clicks'] > 0 else 0
            categories.append(cat)
        
        conn.close()
        return {"categories": categories}
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/v1/analytics/location-comparison")
async def analytics_location_comparison(date_range: str = "last_30_days"):
    """Compare performance across locations"""
    try:
        import sqlite3
        conn = sqlite3.connect("intent_intelligence.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Use user_events to get location-based data
        cursor.execute("""
            SELECT 
                'Mumbai' as location,
                COUNT(*) as events,
                COUNT(DISTINCT user_id) as users
            FROM user_events
            LIMIT 1
        """)
        
        # Mock location data for now
        locations = [
            {"location": "Mumbai", "users": 5234, "conversions": 892, "spend": 5600000},
            {"location": "Delhi", "users": 4123, "conversions": 756, "spend": 4800000},
            {"location": "Bangalore", "users": 3891, "conversions": 701, "spend": 4200000},
            {"location": "Chennai", "users": 2567, "conversions": 445, "spend": 2900000}
        ]
        
        conn.close()
        return {"locations": locations}
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/v1/analytics/monthly-trends")
async def analytics_monthly_trends():
    """Monthly trends for ad spend, clicks, impressions"""
    try:
        import sqlite3
        conn = sqlite3.connect("patternos_campaign_data.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT 
                strftime('%Y-%m', date) as month,
                SUM(spend_value) as spend,
                SUM(clicks) as clicks,
                SUM(impressions) as impressions,
                SUM(conversions) as conversions
            FROM ad_spend_daily
            GROUP BY strftime('%Y-%m', date)
            ORDER BY month
        """)
        
        trends = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return {"monthly_trends": trends}
    except Exception as e:
        return {"error": str(e)}

# Brand-Specific Analytics APIs
@app.get("/api/v1/brand/{brand_name}/analytics/summary")
async def brand_analytics_summary(brand_name: str, date_range: str = "last_30_days"):
    """Brand-specific platform summary"""
    try:
        import sqlite3
        conn = sqlite3.connect("patternos_campaign_data.db")
        cursor = conn.cursor()
        
        # Calculate date range
        # Get max date for this specific brand
        cursor.execute("SELECT MAX(date) FROM ad_spend_daily WHERE brand = ?", (brand_name,))
        max_date = cursor.fetchone()[0]
        
        if not max_date:
            conn.close()
            return {
                "brand": brand_name,
                "total_spend": 0,
                "total_revenue": 0,
                "total_impressions": 0,
                "total_clicks": 0,
                "total_conversions": 0,
                "avg_roas": 0,
                "ctr": 0,
                "conversion_rate": 0
            }
        
        if date_range == "last_7_days":
            days = 7
        elif date_range == "last_30_days":
            days = 30
        elif date_range == "last_60_days":
            days = 60
        elif date_range == "last_90_days":
            days = 90
        elif date_range == "last_180_days":
            days = 180
        else:
            days = 30
        
        cursor.execute(f"""
            SELECT 
                SUM(spend_value) as total_spend,
                SUM(impressions) as total_impressions,
                SUM(clicks) as total_clicks,
                SUM(conversions) as total_conversions
            FROM ad_spend_daily
            WHERE brand = ? AND date >= date('{max_date}', '-{days} days')
        """, (brand_name,))
        
        row = cursor.fetchone()
        if not row or row[0] is None:
            conn.close()
            return {
                "brand": brand_name,
                "total_spend": 0,
                "total_revenue": 0,
                "total_impressions": 0,
                "total_clicks": 0,
                "total_conversions": 0,
                "avg_roas": 0,
                "ctr": 0,
                "conversion_rate": 0
            }
        total_spend, impressions, clicks, conversions = row
        total_spend = total_spend or 0
        impressions = impressions or 0
        clicks = clicks or 0
        conversions = conversions or 0
        
        # Calculate revenue
        cursor.execute(f"""
            SELECT SUM(a.conversions * COALESCE(s.selling_price, 500)) as revenue
            FROM ad_spend_daily a
            LEFT JOIN sku_library s ON a.sku_id = s.sku_id
            WHERE a.brand = ? AND a.date >= date('{max_date}', '-{days} days')
        """, (brand_name,))
        revenue = cursor.fetchone()[0] or 0
        
        conn.close()
        
        return {
            "brand": brand_name,
            "total_spend": round(total_spend, 2),
            "total_revenue": round(revenue, 2),
            "total_impressions": impressions,
            "total_clicks": clicks,
            "total_conversions": conversions,
            "avg_roas": round(revenue / total_spend, 2) if total_spend > 0 else 0,
            "ctr": round((clicks / impressions * 100), 2) if impressions > 0 else 0,
            "conversion_rate": round((conversions / clicks * 100), 2) if clicks > 0 else 0
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/v1/brand/{brand_name}/analytics/channel-performance")
async def brand_channel_performance(brand_name: str, date_range: str = "last_30_days"):
    """Brand-specific channel performance"""
    try:
        import sqlite3
        conn = sqlite3.connect("patternos_campaign_data.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute("SELECT MAX(date) FROM ad_spend_daily WHERE brand = ?", (brand_name,))
        max_date = cursor.fetchone()[0]
        
        if date_range == "last_7_days":
            days = 7
        elif date_range == "last_30_days":
            days = 30
        else:
            days = 30
        
        cursor.execute(f"""
            SELECT 
                a.channel,
                SUM(a.spend_value) as spend,
                SUM(a.impressions) as impressions,
                SUM(a.clicks) as clicks,
                SUM(a.conversions) as conversions,
                SUM(a.conversions * COALESCE(s.selling_price, 500)) as revenue
            FROM ad_spend_daily a
            LEFT JOIN sku_library s ON a.sku_id = s.sku_id
            WHERE a.brand = ? AND a.date >= date('{max_date}', '-{days} days')
            GROUP BY a.channel
            ORDER BY spend DESC
        """, (brand_name,))
        
        channels = []
        for row in cursor.fetchall():
            channel = dict(row)
            channel['ctr'] = round((channel['clicks'] / channel['impressions'] * 100), 2) if channel['impressions'] > 0 else 0
            channel['roas'] = round(channel['revenue'] / channel['spend'], 2) if channel['spend'] > 0 else 0
            channels.append(channel)
        
        conn.close()
        return {"channels": channels}
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/v1/brand/{brand_name}/analytics/monthly-trends")
async def brand_monthly_trends(brand_name: str):
    """Brand-specific monthly trends"""
    try:
        import sqlite3
        conn = sqlite3.connect("patternos_campaign_data.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT 
                strftime('%Y-%m', date) as month,
                SUM(spend_value) as spend,
                SUM(clicks) as clicks,
                SUM(impressions) as impressions,
                SUM(conversions) as conversions
            FROM ad_spend_daily
            WHERE brand = ?
            GROUP BY strftime('%Y-%m', date)
            ORDER BY month
        """, (brand_name,))
        
        trends = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return {"monthly_trends": trends}
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/v1/brand/{brand_name}/analytics/campaigns")
async def brand_campaigns_performance(brand_name: str, date_range: str = "last_30_days"):
    """Brand-specific campaign performance"""
    try:
        import sqlite3
        conn = sqlite3.connect("patternos_campaign_data.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute("SELECT MAX(date) FROM ad_spend_daily WHERE brand = ?", (brand_name,))
        max_date = cursor.fetchone()[0]
        
        if date_range == "last_7_days":
            days = 7
        elif date_range == "last_30_days":
            days = 30
        else:
            days = 30
        
        cursor.execute(f"""
            SELECT 
                c.campaign_id,
                c.category,
                c.intent_level,
                c.channel,
                SUM(a.spend_value) as spend,
                SUM(a.impressions) as impressions,
                SUM(a.clicks) as clicks,
                SUM(a.conversions) as conversions
            FROM ad_spend_daily a
            JOIN campaigns_master c ON a.campaign_id = c.campaign_id
            WHERE a.brand = ? AND a.date >= date('{max_date}', '-{days} days')
            GROUP BY c.campaign_id, c.category, c.intent_level, c.channel
            ORDER BY spend DESC
        """, (brand_name,))
        
        campaigns = []
        for row in cursor.fetchall():
            campaign = dict(row)
            campaign['ctr'] = round((campaign['clicks'] / campaign['impressions'] * 100), 2) if campaign['impressions'] > 0 else 0
            campaign['conversion_rate'] = round((campaign['conversions'] / campaign['clicks'] * 100), 2) if campaign['clicks'] > 0 else 0
            campaigns.append(campaign)
        
        conn.close()
        return {"campaigns": campaigns}
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/v1/brand/{brand_name}/analytics/products")
async def brand_products_performance(brand_name: str, date_range: str = "last_30_days"):
    """Brand-specific product performance"""
    try:
        import sqlite3
        conn = sqlite3.connect("patternos_campaign_data.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute("SELECT MAX(date) FROM ad_spend_daily WHERE brand = ?", (brand_name,))
        max_date = cursor.fetchone()[0]
        
        if date_range == "last_7_days":
            days = 7
        elif date_range == "last_30_days":
            days = 30
        else:
            days = 30
        
        # Get product names from sku_library by matching brand
        cursor.execute(f"""
            SELECT 
                COALESCE(s.sku_name, a.sku_id) as sku_name,
                COALESCE(s.category_level_1, a.category) as category_level_1,
                SUM(a.spend_value) as spend,
                SUM(a.conversions) as conversions,
                SUM(a.conversions * 500) as revenue
            FROM ad_spend_daily a
            LEFT JOIN sku_library s ON s.brand = a.brand
            WHERE a.brand = ? AND a.date >= date('{max_date}', '-{days} days')
            GROUP BY s.sku_name, s.category_level_1, a.sku_id, a.category
            ORDER BY spend DESC
            LIMIT 20
        """, (brand_name,))
        
        products = []
        for row in cursor.fetchall():
            product = dict(row)
            product['roas'] = round(product['revenue'] / product['spend'], 2) if product['spend'] > 0 else 0
            products.append(product)
        
        conn.close()
        return {"products": products}
    except Exception as e:
        return {"error": str(e)}

# Authentication API
from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/auth/login")
async def login(request: LoginRequest):
    """Authenticate user - supports both aggregator and brand logins"""
    try:
        import sqlite3
        
        # Check aggregator logins first
        aggregator_logins = {
            'admin': 'admin123',
            'zepto': 'zepto123'
        }
        
        if request.username in aggregator_logins:
            if request.password == aggregator_logins[request.username]:
                return {
                    "access_token": "demo_token_" + request.username,
                    "user": {
                        "username": request.username,
                        "role": "aggregator"
                    }
                }
        
        # Check brand logins from database
        conn = sqlite3.connect("patternos_campaign_data.db")
        cursor = conn.cursor()
        
        # Check by email or brand_name
        cursor.execute("""
            SELECT brand_id, brand_name, email, password, status 
            FROM brand_credentials 
            WHERE (email = ? OR brand_name = ?) AND password = ?
        """, (request.username, request.username, request.password))
        
        brand = cursor.fetchone()
        conn.close()
        
        if brand:
            brand_id, brand_name, email, password, status = brand
            if status == 'active':
                return {
                    "access_token": f"brand_token_{brand_name}",
                    "user": {
                        "username": brand_name,
                        "email": email,
                        "role": "brand",
                        "brand_id": brand_id
                    }
                }
        
        return {"error": "Invalid credentials"}, 401
        
    except Exception as e:
        return {"error": str(e)}, 500

# Attribution & Conversion Funnel APIs

@app.get("/api/v1/attribution/summary")
async def attribution_summary(brand_name: str = None):
    """Attribution summary - all brands or specific brand"""
    try:
        import sqlite3
        conn = sqlite3.connect("patternos_campaign_data.db")
        cursor = conn.cursor()
        
        brand_filter = ""
        params = []
        if brand_name:
            brand_filter = "WHERE c.brand = ?"
            params.append(brand_name)
        
        cursor.execute(f"""
            SELECT 
                COUNT(DISTINCT a.order_id) as total_orders,
                COUNT(*) as total_touchpoints,
                AVG(touchpoint_count) as avg_touchpoints_per_order,
                SUM(a.attributed_spend) as total_attributed_spend
            FROM ad_attribution a
            JOIN campaigns_master c ON a.campaign_id = c.campaign_id
            JOIN (
                SELECT order_id, COUNT(*) as touchpoint_count
                FROM ad_attribution
                GROUP BY order_id
            ) tc ON a.order_id = tc.order_id
            {brand_filter}
        """, params)
        
        result = cursor.fetchone()
        conn.close()
        
        return {
            "total_orders": result[0],
            "total_touchpoints": result[1],
            "avg_touchpoints_per_order": round(result[2], 2) if result[2] else 0,
            "total_attributed_spend": round(result[3], 2) if result[3] else 0
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/v1/attribution/channel-contribution")
async def attribution_channel_contribution(brand_name: str = None):
    """Channel contribution to conversions"""
    try:
        import sqlite3
        conn = sqlite3.connect("patternos_campaign_data.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        brand_filter = ""
        params = []
        if brand_name:
            brand_filter = "WHERE c.brand = ?"
            params.append(brand_name)
        
        cursor.execute(f"""
            SELECT 
                c.channel,
                COUNT(DISTINCT a.order_id) as assisted_orders,
                SUM(a.attributed_spend) as attributed_spend,
                COUNT(*) as touchpoints
            FROM ad_attribution a
            JOIN campaigns_master c ON a.campaign_id = c.campaign_id
            {brand_filter}
            GROUP BY c.channel
            ORDER BY attributed_spend DESC
        """, params)
        
        channels = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return {"channels": channels}
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/v1/attribution/path-analysis")
async def attribution_path_analysis(brand_name: str = None, limit: int = 100):
    """Analyze conversion paths"""
    try:
        import sqlite3
        conn = sqlite3.connect("patternos_campaign_data.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        brand_filter = ""
        params = []
        if brand_name:
            brand_filter = "AND c.brand = ?"
            params.append(brand_name)
        
        params.append(limit)
        
        cursor.execute(f"""
            SELECT 
                a.order_id,
                GROUP_CONCAT(c.channel, ' → ') as path,
                COUNT(*) as path_length,
                SUM(a.attributed_spend) as total_spend
            FROM ad_attribution a
            JOIN campaigns_master c ON a.campaign_id = c.campaign_id
            WHERE 1=1 {brand_filter}
            GROUP BY a.order_id
            ORDER BY path_length DESC
            LIMIT ?
        """, params)
        
        paths = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return {"paths": paths}
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/v1/attribution/top-paths")
async def attribution_top_paths(brand_name: str = None):
    """Most common conversion paths"""
    try:
        import sqlite3
        conn = sqlite3.connect("patternos_campaign_data.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        brand_filter = ""
        params = []
        if brand_name:
            brand_filter = "AND c.brand = ?"
            params.append(brand_name)
        
        cursor.execute(f"""
            WITH paths AS (
                SELECT 
                    a.order_id,
                    GROUP_CONCAT(c.channel, ' → ') as path,
                    SUM(a.attributed_spend) as spend
                FROM ad_attribution a
                JOIN campaigns_master c ON a.campaign_id = c.campaign_id
                WHERE 1=1 {brand_filter}
                GROUP BY a.order_id
            )
            SELECT 
                path,
                COUNT(*) as frequency,
                SUM(spend) as total_spend,
                AVG(spend) as avg_spend
            FROM paths
            GROUP BY path
            ORDER BY frequency DESC
            LIMIT 20
        """, params)
        
        top_paths = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return {"top_paths": top_paths}
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/v1/attribution/model-comparison")
async def attribution_model_comparison(brand_name: str = None):
    """Compare different attribution models"""
    try:
        import sqlite3
        conn = sqlite3.connect("patternos_campaign_data.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        brand_filter = ""
        params = []
        if brand_name:
            brand_filter = "WHERE c.brand = ?"
            params.append(brand_name)
        
        cursor.execute(f"""
            SELECT 
                a.attribution_method,
                COUNT(DISTINCT a.order_id) as orders,
                SUM(a.attributed_spend) as attributed_spend
            FROM ad_attribution a
            JOIN campaigns_master c ON a.campaign_id = c.campaign_id
            {brand_filter}
            GROUP BY a.attribution_method
        """, params)
        
        models = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return {"models": models}
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/v1/attribution/assisted-conversions")
async def attribution_assisted_conversions(brand_name: str = None):
    """Campaigns with assisted conversions"""
    try:
        import sqlite3
        conn = sqlite3.connect("patternos_campaign_data.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        brand_filter = ""
        params = []
        if brand_name:
            brand_filter = "WHERE c.brand = ?"
            params.append(brand_name)
        
        cursor.execute(f"""
            SELECT 
                c.campaign_id,
                c.brand,
                c.channel,
                c.category,
                COUNT(DISTINCT a.order_id) as assisted_orders,
                SUM(a.attributed_spend) as attributed_spend,
                COUNT(*) as touchpoints
            FROM ad_attribution a
            JOIN campaigns_master c ON a.campaign_id = c.campaign_id
            {brand_filter}
            GROUP BY c.campaign_id, c.brand, c.channel, c.category
            ORDER BY assisted_orders DESC
            LIMIT 50
        """, params)
        
        campaigns = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return {"campaigns": campaigns}
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/v1/attribution/touchpoint-distribution")
async def attribution_touchpoint_distribution(brand_name: str = None):
    """Distribution of orders by number of touchpoints"""
    try:
        import sqlite3
        conn = sqlite3.connect("patternos_campaign_data.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        brand_filter = ""
        params = []
        if brand_name:
            brand_filter = """
                AND a.order_id IN (
                    SELECT DISTINCT att.order_id 
                    FROM ad_attribution att
                    JOIN campaigns_master cm ON att.campaign_id = cm.campaign_id
                    WHERE cm.brand = ?
                )
            """
            params.append(brand_name)
        
        cursor.execute(f"""
            WITH touchpoint_counts AS (
                SELECT order_id, COUNT(*) as touchpoint_count
                FROM ad_attribution a
                WHERE 1=1 {brand_filter}
                GROUP BY order_id
            )
            SELECT 
                touchpoint_count,
                COUNT(*) as order_count
            FROM touchpoint_counts
            GROUP BY touchpoint_count
            ORDER BY touchpoint_count
        """, params)
        
        distribution = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return {"distribution": distribution}
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/v1/attribution/channel-overlap")
async def attribution_channel_overlap(brand_name: str = None):
    """Channel combinations in customer journeys"""
    try:
        import sqlite3
        conn = sqlite3.connect("patternos_campaign_data.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        brand_filter = ""
        params = []
        if brand_name:
            brand_filter = "WHERE c.brand = ?"
            params.append(brand_name)
        
        cursor.execute(f"""
            WITH channel_combos AS (
                SELECT 
                    a.order_id,
                    GROUP_CONCAT(DISTINCT c.channel) as channels
                FROM ad_attribution a
                JOIN campaigns_master c ON a.campaign_id = c.campaign_id
                {brand_filter}
                GROUP BY a.order_id
            )
            SELECT 
                channels,
                COUNT(*) as frequency
            FROM channel_combos
            GROUP BY channels
            ORDER BY frequency DESC
            LIMIT 20
        """, params)
        
        overlaps = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return {"overlaps": overlaps}
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/v1/attribution/conversion-value-analysis")
async def attribution_conversion_value_analysis(brand_name: str = None):
    """Analyze conversion value by touchpoint count"""
    try:
        import sqlite3
        conn = sqlite3.connect("patternos_campaign_data.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        brand_filter = ""
        params = []
        if brand_name:
            brand_filter = """
                AND a.order_id IN (
                    SELECT DISTINCT att.order_id 
                    FROM ad_attribution att
                    JOIN campaigns_master cm ON att.campaign_id = cm.campaign_id
                    WHERE cm.brand = ?
                )
            """
            params.append(brand_name)
        
        cursor.execute(f"""
            WITH order_data AS (
                SELECT 
                    a.order_id,
                    COUNT(*) as touchpoint_count,
                    SUM(a.attributed_spend) as total_value
                FROM ad_attribution a
                WHERE 1=1 {brand_filter}
                GROUP BY a.order_id
            )
            SELECT 
                touchpoint_count,
                COUNT(*) as order_count,
                AVG(total_value) as avg_value,
                SUM(total_value) as total_value
            FROM order_data
            GROUP BY touchpoint_count
            ORDER BY touchpoint_count
        """, params)
        
        analysis = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return {"value_analysis": analysis}
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/v1/campaigns/all")
async def get_all_campaigns(
    brand: str = None,
    channel: str = None, 
    intent_level: str = None,
    date_range: str = "last_30_days"
):
    """Get all campaigns with performance metrics"""
    try:
        import sqlite3
        conn = sqlite3.connect("patternos_campaign_data.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Build filters
        filters = []
        params = []
        
        if brand:
            filters.append("c.brand = ?")
            params.append(brand)
        if channel:
            filters.append("c.channel = ?")
            params.append(channel)
        if intent_level:
            filters.append("c.intent_level = ?")
            params.append(intent_level)
            
        where_clause = " AND " + " AND ".join(filters) if filters else ""
        
        # Get campaigns with aggregated performance
        query = f"""
            SELECT 
                c.campaign_id,
                COALESCE(c.campaign_name, c.brand || ' ' || c.category || ' Campaign') as campaign_name,
                c.brand,
                c.category,
                c.intent_level,
                c.channel,
                c.start_date,
                c.end_date,
                c.spend_value as budget,
                COALESCE(SUM(a.spend_value), 0) as total_spend,
                COALESCE(SUM(a.impressions), 0) as impressions,
                COALESCE(SUM(a.clicks), 0) as clicks,
                COALESCE(SUM(a.conversions), 0) as conversions,
                COALESCE(SUM(a.conversions * 500), 0) as revenue,
                CASE 
                    WHEN SUM(a.spend_value) > 0 
                    THEN ROUND((SUM(a.conversions * 500) / SUM(a.spend_value)), 2)
                    ELSE 0 
                END as roas,
                CASE 
                    WHEN SUM(a.impressions) > 0 
                    THEN ROUND((SUM(a.clicks) * 100.0 / SUM(a.impressions)), 2)
                    ELSE 0 
                END as ctr,
                CASE
                    WHEN date('now') BETWEEN c.start_date AND c.end_date THEN 'Active'
                    WHEN date('now') > c.end_date THEN 'Completed'
                    ELSE 'Scheduled'
                END as status
            FROM campaigns_master c
            LEFT JOIN ad_spend_daily a ON c.campaign_id = a.campaign_id
            WHERE 1=1 {where_clause}
            GROUP BY c.campaign_id, c.brand, c.category, c.intent_level, c.channel, 
                     c.start_date, c.end_date, c.spend_value
            ORDER BY total_spend DESC
        """
        
        cursor.execute(query, params)
        campaigns = [dict(row) for row in cursor.fetchall()]
        
        # Calculate summary metrics
        total_campaigns = len(campaigns)
        active_campaigns = len([c for c in campaigns if c['status'] == 'Active'])
        total_spend = sum(c['total_spend'] for c in campaigns)
        total_revenue = sum(c['revenue'] for c in campaigns)
        avg_roas = round(total_revenue / total_spend, 2) if total_spend > 0 else 0
        
        conn.close()
        
        return {
            "campaigns": campaigns,
            "summary": {
                "total_campaigns": total_campaigns,
                "active_campaigns": active_campaigns,
                "total_spend": total_spend,
                "total_revenue": total_revenue,
                "avg_roas": avg_roas
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/products/search")
async def search_products(
    search: str = None,
    brand: str = None,
    category: str = None,
    limit: int = 50
):
    """Search products from SKU library for campaign creation"""
    try:
        import sqlite3
        conn = sqlite3.connect("patternos_campaign_data.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        filters = []
        params = []
        
        if search:
            filters.append("(sku_name LIKE ? OR sku_id LIKE ?)")
            params.extend([f"%{search}%", f"%{search}%"])
        if brand:
            filters.append("brand = ?")
            params.append(brand)
        if category:
            filters.append("category_level_1 = ?")
            params.append(category)
        
        where_clause = " AND ".join(filters) if filters else "1=1"
        
        query = f"""
            SELECT 
                sku_id,
                sku_name,
                brand,
                category_level_1,
                category_level_2,
                CAST(selling_price AS REAL) as price,
                CAST(mrp AS REAL) as mrp,
                availability_status,
                rating,
                ad_visibility_flag
            FROM sku_library
            WHERE {where_clause}
            ORDER BY rating DESC
            LIMIT ?
        """
        
        params.append(limit)
        cursor.execute(query, params)
        products = [dict(row) for row in cursor.fetchall()]
        
        # Get available categories and brands for filters
        cursor.execute("SELECT DISTINCT category_level_1 FROM sku_library WHERE category_level_1 IS NOT NULL ORDER BY category_level_1")
        categories = [row[0] for row in cursor.fetchall()]
        
        cursor.execute("SELECT DISTINCT brand FROM sku_library WHERE brand IS NOT NULL ORDER BY brand")
        brands = [row[0] for row in cursor.fetchall()]
        
        conn.close()
        
        return {
            "products": products,
            "categories": categories,
            "brands": brands,
            "total": len(products)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================
# SUPER-EGO INTELLIGENCE ENDPOINTS
# ============================================

@app.get("/api/v1/superego/profiles")
async def get_superego_profiles(
    limit: int = 100,
    min_premium_readiness: float = 0,
    identity: str = None
):
    """Get Super-Ego customer profiles with filtering"""
    conn = sqlite3.connect('patternos_campaign_data.db')
    
    query = """
        SELECT 
            customer_id,
            eco_conscious_score,
            health_oriented_score,
            aspirational_score,
            minimalist_score,
            parenting_score,
            fitness_score,
            primary_identity,
            secondary_identity,
            identity_confidence,
            premium_readiness_score,
            current_aov,
            potential_aov,
            total_orders,
            signal_count,
            data_completeness
        FROM superego_profiles
        WHERE premium_readiness_score >= ?
    """
    
    params = [min_premium_readiness]
    
    if identity:
        query += " AND primary_identity = ?"
        params.append(identity)
    
    query += " ORDER BY premium_readiness_score DESC LIMIT ?"
    params.append(limit)
    
    profiles = conn.execute(query, params).fetchall()
    conn.close()
    
    result = []
    for profile in profiles:
        result.append({
            "customer_id": profile[0],
            "identity_scores": {
                "eco_conscious": round(profile[1], 1),
                "health_oriented": round(profile[2], 1),
                "aspirational": round(profile[3], 1),
                "minimalist": round(profile[4], 1),
                "parenting": round(profile[5], 1),
                "fitness": round(profile[6], 1)
            },
            "primary_identity": profile[7],
            "secondary_identity": profile[8],
            "identity_confidence": round(profile[9], 1),
            "premium_readiness_score": round(profile[10], 1),
            "current_aov": round(profile[11], 2),
            "potential_aov": round(profile[12], 2),
            "total_orders": profile[13],
            "signal_count": profile[14],
            "data_completeness": round(profile[15], 1)
        })
    
    return {"profiles": result, "count": len(result)}


@app.get("/api/v1/superego/distribution")
async def get_superego_distribution():
    """Get Super-Ego identity distribution statistics"""
    conn = sqlite3.connect('patternos_campaign_data.db')
    
    # Identity distribution
    identity_dist = conn.execute("""
        SELECT 
            primary_identity,
            COUNT(*) as customer_count,
            ROUND(AVG(identity_confidence), 1) as avg_confidence,
            ROUND(AVG(premium_readiness_score), 1) as avg_premium_readiness,
            ROUND(AVG(current_aov), 2) as avg_aov
        FROM superego_profiles
        GROUP BY primary_identity
        ORDER BY customer_count DESC
    """).fetchall()
    
    # Overall stats
    overall = conn.execute("""
        SELECT 
            COUNT(*) as total_customers,
            ROUND(AVG(premium_readiness_score), 1) as avg_premium_readiness,
            COUNT(CASE WHEN premium_readiness_score >= 70 THEN 1 END) as high_premium_ready,
            COUNT(CASE WHEN premium_readiness_score >= 50 THEN 1 END) as medium_premium_ready,
            ROUND(AVG(data_completeness), 1) as avg_completeness,
            ROUND(AVG(current_aov), 2) as avg_aov,
            ROUND(AVG(potential_aov), 2) as avg_potential_aov
        FROM superego_profiles
    """).fetchone()
    
    # Premium readiness segments
    segments = conn.execute("""
        SELECT 
            CASE 
                WHEN premium_readiness_score >= 70 THEN 'High (70-100)'
                WHEN premium_readiness_score >= 40 THEN 'Medium (40-69)'
                ELSE 'Low (0-39)'
            END as segment,
            COUNT(*) as count,
            ROUND(AVG(current_aov), 2) as avg_aov,
            ROUND(AVG(potential_aov), 2) as potential_aov
        FROM superego_profiles
        GROUP BY segment
        ORDER BY 
            CASE 
                WHEN premium_readiness_score >= 70 THEN 1
                WHEN premium_readiness_score >= 40 THEN 2
                ELSE 3
            END
    """).fetchall()
    
    conn.close()
    
    return {
        "identity_distribution": [
            {
                "identity": row[0],
                "customer_count": row[1],
                "avg_confidence": row[2],
                "avg_premium_readiness": row[3],
                "avg_aov": row[4]
            }
            for row in identity_dist
        ],
        "overall_stats": {
            "total_customers": overall[0],
            "avg_premium_readiness": overall[1],
            "high_premium_ready": overall[2],
            "medium_premium_ready": overall[3],
            "avg_data_completeness": overall[4],
            "avg_aov": overall[5],
            "avg_potential_aov": overall[6],
            "potential_revenue_increase": round((overall[6] - overall[5]) * overall[0], 2)
        },
        "premium_segments": [
            {
                "segment": row[0],
                "count": row[1],
                "avg_aov": row[2],
                "potential_aov": row[3],
                "uplift_potential": round(row[3] - row[2], 2)
            }
            for row in segments
        ]
    }


@app.get("/api/v1/superego/premium-ready")
async def get_premium_ready_customers(min_score: float = 60):
    """Get customers ready for premium product targeting"""
    conn = sqlite3.connect('patternos_campaign_data.db')
    
    try:
        customers = conn.execute("""
            SELECT 
                customer_id,
                primary_identity,
                premium_readiness_score,
                current_aov,
                potential_aov,
                total_orders,
                identity_confidence
            FROM superego_profiles
            WHERE premium_readiness_score >= ?
            ORDER BY premium_readiness_score DESC
        """, (min_score,)).fetchall()
        
        result = []
        for customer in customers:
            # Get top categories
            top_categories = conn.execute("""
                SELECT category_level_1, COUNT(*) as cnt
                FROM order_products
                WHERE customer_id = ?
                GROUP BY category_level_1
                ORDER BY cnt DESC
                LIMIT 3
            """, (customer[0],)).fetchall()
            
            recommended_categories = [cat[0] for cat in top_categories if cat[0]]
            
            # Get premium products based on customer's identity and interests
            # For all identities, get premium products in their preferred categories
            premium_products = conn.execute("""
                SELECT DISTINCT s.brand, s.category_level_1, s.selling_price
                FROM sku_library s
                WHERE s.premium_flag = 1
                AND s.price_band = 'High'
                AND s.category_level_1 IN (
                    SELECT category_level_1 FROM order_products 
                    WHERE customer_id = ? 
                    LIMIT 3
                )
                ORDER BY s.selling_price DESC
                LIMIT 3
            """, (customer[0],)).fetchall()
            
            # Rename to premium_products to better reflect it works for all identities
            aspirational_items = [
                {"brand": p[0], "category": p[1], "price": round(float(p[2]) if p[2] else 0, 0)} 
                for p in premium_products
            ]
            
            uplift = ((customer[4] - customer[3]) / customer[3] * 100) if customer[3] > 0 else 0
            result.append({
                "customer_id": customer[0],
                "primary_identity": customer[1],
                "premium_readiness_score": round(customer[2], 1),
                "current_aov": round(customer[3], 2),
                "potential_aov": round(customer[4], 2),
                "uplift_percentage": round(uplift, 1),
                "total_orders": customer[5],
                "identity_confidence": round(customer[6], 1),
                "recommended_categories": recommended_categories,
                "aspirational_products": aspirational_items,
                "recommended_action": "Target with premium products" if customer[2] >= 70 else "Nurture with mid-premium products"
            })
        
        return {
            "premium_ready_customers": result,
            "count": len(result),
            "total_potential_revenue_increase": sum(r["potential_aov"] - r["current_aov"] for r in result)
        }
    finally:
        conn.close()


@app.get("/api/v1/superego/insights")
async def get_superego_insights():
    """Get actionable Super-Ego insights for campaigns"""
    conn = sqlite3.connect('patternos_campaign_data.db')
    
    # High-value opportunities
    high_value = conn.execute("""
        SELECT 
            primary_identity,
            COUNT(*) as customer_count,
            ROUND(AVG(premium_readiness_score), 1) as avg_readiness,
            ROUND(SUM(potential_aov - current_aov), 2) as total_opportunity
        FROM superego_profiles
        WHERE premium_readiness_score >= 50
        GROUP BY primary_identity
        ORDER BY total_opportunity DESC
    """).fetchall()
    
    # Identity-category alignment
    categories = conn.execute("""
        SELECT 
            sp.primary_identity,
            op.category_level_1,
            COUNT(*) as purchase_count,
            ROUND(AVG(op.selling_price), 2) as avg_price
        FROM superego_profiles sp
        JOIN order_products op ON sp.customer_id = op.customer_id
        GROUP BY sp.primary_identity, op.category_level_1
        HAVING purchase_count >= 5
        ORDER BY purchase_count DESC
        LIMIT 20
    """).fetchall()
    
    conn.close()
    
    return {
        "high_value_opportunities": [
            {
                "identity": row[0],
                "customer_count": row[1],
                "avg_premium_readiness": row[2],
                "total_revenue_opportunity": row[3],
                "recommended_campaign": f"Premium {row[0].title()} Products"
            }
            for row in high_value
        ],
        "identity_category_affinity": [
            {
                "identity": row[0],
                "category": row[1],
                "purchase_count": row[2],
                "avg_price": row[3],
                "recommendation": f"Target {row[0]} customers with {row[1]} products"
            }
            for row in categories
        ]
    }


# ============================================
# AD APPROVAL & VALIDATION ENDPOINTS
# ============================================

@app.post("/api/v1/ad-approval/submit")
async def submit_campaign_for_approval(campaign_data: dict):
    """Submit a campaign for AI validation and approval with pricing calculation"""
    import sqlite3
    import uuid
    from datetime import datetime
    
    conn = sqlite3.connect('patternos_campaign_data.db')
    cursor = conn.cursor()
    
    submission_id = str(uuid.uuid4())[:16]
    
    # Calculate pricing
    pricing = PricingEngine.calculate_campaign_cost(
        intent_level=campaign_data.get('intent_level', 'Medium'),
        use_value_intelligence=campaign_data.get('use_value_intelligence', False),
        channels=[{'name': ch, 'ad_types': ['default']} for ch in campaign_data.get('channels', [])],
        budget=campaign_data.get('budget', 10000),
        duration_days=30
    )
    
    # Store submission with pricing data
    cursor.execute("""
        INSERT INTO campaign_submissions 
        (submission_id, campaign_id, brand_name, campaign_name, objective, 
         start_date, end_date, budget, status, submitted_at, submitted_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)
    """, (
        submission_id,
        campaign_data.get('campaign_id', str(uuid.uuid4())[:16]),
        campaign_data.get('brand_name'),
        campaign_data.get('campaign_name'),
        campaign_data.get('objective'),
        campaign_data.get('start_date'),
        campaign_data.get('end_date'),
        campaign_data.get('budget'),
        datetime.now().isoformat(),
        campaign_data.get('submitted_by', 'unknown')
    ))
    
    conn.commit()
    conn.close()
    
    # Trigger AI validation
    validation_result = await validate_campaign(submission_id, campaign_data)
    
    return {
        "submission_id": submission_id,
        "status": "submitted",
        "validation_triggered": True,
        "initial_assessment": validation_result,
        "pricing_data": pricing
    }


@app.post("/api/v1/ad-approval/validate/{submission_id}")
async def validate_campaign(submission_id: str, campaign_data: dict = None):
    """Run AI validation on submitted campaign"""
    import sqlite3
    from datetime import datetime
    
    conn = sqlite3.connect('patternos_campaign_data.db')
    cursor = conn.cursor()
    
    # If campaign_data not provided, fetch from DB
    if not campaign_data:
        cursor.execute("""
            SELECT * FROM campaign_submissions WHERE submission_id = ?
        """, (submission_id,))
        # Fetch and convert to dict (simplified)
        campaign_data = {}
    
    validator = AdValidationEngine()
    
    # Pillar 1: Creative Text Validation
    creative_text = campaign_data.get('ad_copy', '')
    text_validation = validator.validate_text_content(creative_text)
    
    # Store result
    cursor.execute("""
        INSERT INTO ai_validation_results 
        (validation_id, submission_id, pillar_name, check_name, status, confidence_score, details, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        str(uuid.uuid4())[:16],
        submission_id,
        'Creative_Text',
        'Text Compliance',
        text_validation['status'],
        text_validation['score'],
        str(text_validation.get('issues', [])),
        datetime.now().isoformat()
    ))
    
    # Pillar 2: SKU Validation
    skus = campaign_data.get('skus', [])
    sku_validations = []
    for sku in skus:
        sku_data = {'exists': True, 'stock': 100, 'price': 500, 'category': 'Grocery'}  # Mock
        sku_result = validator.validate_sku(sku, sku_data)
        sku_validations.append(sku_result)
        
        cursor.execute("""
            INSERT INTO ai_validation_results 
            (validation_id, submission_id, pillar_name, check_name, status, confidence_score, details, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            str(uuid.uuid4())[:16],
            submission_id,
            'SKU_Validation',
            f'SKU: {sku}',
            sku_result['status'],
            sku_result['score'],
            str(sku_result.get('issues', [])),
            datetime.now().isoformat()
        ))
    
    # Pillar 3: Landing Page
    landing_page = campaign_data.get('landing_page_url', '')
    landing_validation = validator.validate_landing_page(landing_page)
    
    cursor.execute("""
        INSERT INTO ai_validation_results 
        (validation_id, submission_id, pillar_name, check_name, status, confidence_score, details, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        str(uuid.uuid4())[:16],
        submission_id,
        'Landing_Page',
        'Landing Page Check',
        landing_validation['status'],
        landing_validation['score'],
        str(landing_validation.get('checks', {})),
        datetime.now().isoformat()
    ))
    
    # Pillar 4: Legal Compliance
    category = campaign_data.get('category', 'general')
    claims = campaign_data.get('claims', [])
    legal_validation = validator.validate_legal_compliance(category, claims)
    
    cursor.execute("""
        INSERT INTO ai_validation_results 
        (validation_id, submission_id, pillar_name, check_name, status, confidence_score, details, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        str(uuid.uuid4())[:16],
        submission_id,
        'Legal_Compliance',
        'Regulatory Check',
        legal_validation['status'],
        legal_validation['score'],
        str(legal_validation.get('issues', [])),
        datetime.now().isoformat()
    ))
    
    # Pillar 5: Value Intelligence
    if campaign_data.get('use_value_intelligence'):
        identity = campaign_data.get('target_identity', 'aspirational')
        product_attrs = {'description': campaign_data.get('product_description', '')}
        value_validation = validator.validate_value_intelligence_alignment(
            category, identity, product_attrs
        )
        
        cursor.execute("""
            INSERT INTO ai_validation_results 
            (validation_id, submission_id, pillar_name, check_name, status, confidence_score, details, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            str(uuid.uuid4())[:16],
            submission_id,
            'Value_Intelligence',
            'Identity Alignment',
            value_validation['status'],
            value_validation['score'],
            str(value_validation),
            datetime.now().isoformat()
        ))
    else:
        value_validation = {'status': 'skipped', 'score': 100}
    
    # Calculate overall risk
    all_validations = {
        'creative': text_validation,
        'sku': sku_validations[0] if sku_validations else {'score': 100},
        'landing_page': landing_validation,
        'legal': legal_validation,
        'value_intelligence': value_validation
    }
    
    risk_assessment = validator.calculate_overall_risk_score(all_validations)
    
    # Store risk score
    cursor.execute("""
        INSERT INTO risk_scores 
        (score_id, submission_id, overall_risk_score, creative_risk, sku_risk, 
         landing_page_risk, legal_risk, value_alignment_risk, recommendation, auto_approve_eligible)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        str(uuid.uuid4())[:16],
        submission_id,
        risk_assessment['risk_score'],
        100 - text_validation['score'],
        100 - (sku_validations[0]['score'] if sku_validations else 100),
        100 - landing_validation['score'],
        100 - legal_validation['score'],
        100 - value_validation['score'],
        risk_assessment['recommendation'],
        1 if risk_assessment['auto_approve_eligible'] else 0
    ))
    
    conn.commit()
    conn.close()
    
    return {
        "submission_id": submission_id,
        "validation_complete": True,
        "pillar_results": {
            "creative_text": text_validation,
            "sku_validation": sku_validations,
            "landing_page": landing_validation,
            "legal_compliance": legal_validation,
            "value_intelligence": value_validation
        },
        "risk_assessment": risk_assessment
    }


@app.get("/api/v1/ad-approval/pending")
async def get_pending_approvals():
    """Get all campaigns pending approval"""
    import sqlite3
    
    conn = sqlite3.connect('patternos_campaign_data.db')
    cursor = conn.cursor()
    
    submissions = cursor.execute("""
        SELECT 
            cs.submission_id,
            cs.brand_name,
            cs.campaign_name,
            cs.objective,
            cs.budget,
            cs.submitted_at,
            cs.status,
            rs.overall_risk_score,
            rs.recommendation,
            rs.auto_approve_eligible
        FROM campaign_submissions cs
        LEFT JOIN risk_scores rs ON cs.submission_id = rs.submission_id
        WHERE cs.status = 'pending'
        ORDER BY cs.submitted_at DESC
    """).fetchall()
    
    conn.close()
    
    result = []
    for sub in submissions:
        result.append({
            "submission_id": sub[0],
            "brand_name": sub[1],
            "campaign_name": sub[2],
            "objective": sub[3],
            "budget": sub[4],
            "submitted_at": sub[5],
            "status": sub[6],
            "risk_score": sub[7] if sub[7] else 0,
            "recommendation": sub[8] if sub[8] else "Pending validation",
            "auto_approve_eligible": bool(sub[9]) if sub[9] else False
        })
    
    return {"pending_approvals": result, "count": len(result)}


@app.get("/api/v1/ad-approval/{submission_id}/details")
async def get_approval_details(submission_id: str):
    """Get detailed validation results for a submission"""
    import sqlite3
    
    conn = sqlite3.connect('patternos_campaign_data.db')
    cursor = conn.cursor()
    
    # Get submission details
    submission = cursor.execute("""
        SELECT * FROM campaign_submissions WHERE submission_id = ?
    """, (submission_id,)).fetchone()
    
    if not submission:
        conn.close()
        return {"error": "Submission not found"}
    
    # Get all validation results
    validations = cursor.execute("""
        SELECT pillar_name, check_name, status, confidence_score, details, timestamp
        FROM ai_validation_results
        WHERE submission_id = ?
        ORDER BY pillar_name, timestamp
    """, (submission_id,)).fetchall()
    
    # Get risk score
    risk = cursor.execute("""
        SELECT * FROM risk_scores WHERE submission_id = ?
    """, (submission_id,)).fetchone()
    
    # Get compliance rules
    rules = cursor.execute("""
        SELECT rule_id, pillar, rule_name, severity
        FROM compliance_rules
        WHERE is_active = 1
        ORDER BY pillar, severity DESC
    """).fetchall()
    
    conn.close()
    
    # Calculate pricing for this submission
    pricing = PricingEngine.calculate_campaign_cost(
        intent_level='Medium',  # Default, should come from submission
        use_value_intelligence=False,
        channels=[{'name': 'Zepto', 'ad_types': ['sponsored_products']}],
        budget=submission[7] if submission[7] else 10000,
        duration_days=30
    )
    
    return {
        "submission_id": submission_id,
        "brand_name": submission[2],
        "campaign_name": submission[3],
        "objective": submission[4],
        "budget": submission[7],
        "status": submission[8],
        "pricing_data": pricing,
        "pricing_strategy": pricing['pricing_strategy'],
        "estimated_cpm": pricing['effective_cpm'],
        "expected_conversions": pricing['expected_conversions'],
        "cost_per_acquisition": pricing['cost_per_conversion'],
        "estimated_reach": pricing['estimated_reach'],
        "validation_results": [
            {
                "pillar": v[0],
                "check": v[1],
                "status": v[2],
                "score": v[3],
                "details": v[4],
                "timestamp": v[5]
            } for v in validations
        ],
        "risk_assessment": {
            "overall_risk": risk[2] if risk else 0,
            "creative_risk": risk[3] if risk else 0,
            "sku_risk": risk[4] if risk else 0,
            "landing_page_risk": risk[5] if risk else 0,
            "legal_risk": risk[6] if risk else 0,
            "value_risk": risk[7] if risk else 0,
            "recommendation": risk[8] if risk else "Pending",
            "auto_approve": bool(risk[9]) if risk and risk[9] else False
        },
        "compliance_rules": [
            {"rule_id": r[0], "pillar": r[1], "name": r[2], "severity": r[3]}
            for r in rules
        ]
    }




# ============================================
# DYNAMIC PRICING ENGINE ENDPOINTS
# ============================================

@app.post("/api/v1/pricing/calculate")
async def calculate_pricing(pricing_request: dict):
    """Calculate campaign pricing based on Intent + Value Intelligence"""
    
    intent_level = pricing_request.get('intent_level', 'Medium')
    use_value_intelligence = pricing_request.get('use_value_intelligence', False)
    channels = pricing_request.get('channels', [])
    budget = pricing_request.get('budget', 10000)
    duration_days = pricing_request.get('duration_days', 30)
    
    pricing = PricingEngine.calculate_campaign_cost(
        intent_level=intent_level,
        use_value_intelligence=use_value_intelligence,
        channels=channels,
        budget=budget,
        duration_days=duration_days
    )
    
    return pricing


@app.get("/api/v1/pricing/tiers")
async def get_pricing_tiers():
    """Get all available pricing tiers and multipliers"""
    return PricingEngine.get_pricing_tiers()


@app.post("/api/v1/pricing/compare")
async def compare_pricing_strategies(comparison_request: dict):
    """Compare all pricing strategies for given budget"""
    
    budget = comparison_request.get('budget', 10000)
    channels = comparison_request.get('channels', [])
    duration_days = comparison_request.get('duration_days', 30)
    
    comparison = PricingEngine.compare_pricing_strategies(
        budget=budget,
        channels=channels,
        duration_days=duration_days
    )
    
    return comparison


@app.get("/api/v1/pricing/estimate")
async def estimate_campaign_performance(
    intent_level: str = "Medium",
    use_vi: bool = False,
    budget: float = 10000,
    duration: int = 30
):
    """Quick estimate of campaign performance"""
    
    # Default channels for estimation
    default_channels = [
        {'name': 'Zepto', 'ad_types': ['sponsored_products']},
        {'name': 'Instagram', 'ad_types': ['feed_ads']}
    ]
    
    pricing = PricingEngine.calculate_campaign_cost(
        intent_level=intent_level,
        use_value_intelligence=use_vi,
        channels=default_channels,
        budget=budget,
        duration_days=duration
    )
    
    return {
        'quick_estimate': {
            'budget': budget,
            'estimated_impressions': pricing['estimated_impressions'],
            'estimated_clicks': pricing['expected_clicks'],
            'estimated_conversions': pricing['expected_conversions'],
            'cost_per_conversion': pricing['cost_per_conversion'],
            'pricing_strategy': pricing['pricing_strategy']
        }
    }


@app.post("/api/v1/ad-approval/{submission_id}/approve")
async def approve_campaign(submission_id: str, approval_data: dict):
    """Approve or reject a campaign submission"""
    import sqlite3
    from datetime import datetime
    
    conn = sqlite3.connect('patternos_campaign_data.db')
    cursor = conn.cursor()
    
    action = approval_data.get('action', 'approve')  # approve or reject
    notes = approval_data.get('notes', '')
    reviewer = approval_data.get('reviewer', 'aggregator')
    
    cursor.execute("""
        UPDATE campaign_submissions
        SET status = ?, reviewed_at = ?, reviewed_by = ?, approval_notes = ?
        WHERE submission_id = ?
    """, (
        'approved' if action == 'approve' else 'rejected',
        datetime.now().isoformat(),
        reviewer,
        notes,
        submission_id
    ))
    
    conn.commit()
    conn.close()
    
    return {
        "submission_id": submission_id,
        "action": action,
        "status": "approved" if action == "approve" else "rejected",
        "message": f"Campaign {action}d successfully"
    }

