from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel
import json
from app.database import get_db
from app.intelligence.visual.vision_service import vision_service
from app.intelligence.visual.models import (
    SocialMediaImage, ImageAnalysis, ProductInImage,
    LifestyleAnalysis, BrandAffinity, ContextualInsights, VisualTrends
)

router = APIRouter()

# Pydantic schemas
class SocialImageCreate(BaseModel):
    user_id: str
    platform: str
    image_url: str
    post_url: Optional[str] = None
    caption: Optional[str] = None
    hashtags: Optional[List[str]] = None
    posted_at: datetime

class ImageAnalysisResult(BaseModel):
    image_id: int
    detected_products: List[dict]
    detected_brands: List[str]
    scene_description: str
    lifestyle_indicators: List[str]
    dominant_colors: List[str]

class ProductDetection(BaseModel):
    image_id: int
    product_category: str
    brand: Optional[str]
    confidence_score: float
    context: str

# Collect social media image
@router.post("/social-media/collect")
async def collect_social_image(image: SocialImageCreate, db: Session = Depends(get_db)):
    social_image = SocialMediaImage(
        user_id=image.user_id,
        platform=image.platform,
        image_url=image.image_url,
        post_url=image.post_url,
        caption=image.caption,
        hashtags=image.hashtags,
        posted_at=image.posted_at
    )
    db.add(social_image)
    db.commit()
    db.refresh(social_image)
    
    return {"status": "collected", "image_id": social_image.id}

# Analyze image (would integrate with AI vision API)
@router.post("/analyze/image/{image_id}")
async def analyze_image(image_id: int, db: Session = Depends(get_db)):
    # Get image
    image = db.query(SocialMediaImage).filter(SocialMediaImage.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    # Use Google Vision API for real analysis
    vision_results = vision_service.analyze_image(image.image_url)
    
    mock_analysis = {
        "detected_products": vision_results.get('detected_products', []),
        "detected_brands": vision_results.get('detected_brands', []),
        "scene_description": vision_results.get('scene_description', ''),
        "lifestyle_indicators": vision_results.get('lifestyle_categories', []),
        "dominant_colors": [c['hex'] for c in vision_results.get('dominant_colors', [])[:5]],
        "labels": vision_results.get('labels', []),
        "confidence": vision_results.get('analysis_confidence', 0)
    }
    
    # Store analysis
    analysis = ImageAnalysis(
        image_id=image_id,
        analysis_type="product_detection",
        detected_products=mock_analysis["detected_products"],
        detected_brands=mock_analysis["detected_brands"],
        scene_description=mock_analysis["scene_description"],
        objects_detected=[],
        lifestyle_indicators=mock_analysis["lifestyle_indicators"],
        dominant_colors=mock_analysis["dominant_colors"],
        image_quality_score=0.9
    )
    db.add(analysis)
    
    # Store individual product detections
    for product in mock_analysis["detected_products"]:
        product_in_image = ProductInImage(
            image_id=image_id,
            product_category=product["category"],
            brand=product.get("name", "").split()[0],
            confidence_score=product["confidence"],
            bounding_box={"x": 100, "y": 100, "width": 200, "height": 200},
            context="in_use"
        )
        db.add(product_in_image)
    
    db.commit()
    return {"status": "analyzed", "analysis": mock_analysis}

# Get user lifestyle profile from images
@router.get("/lifestyle/profile/{user_id}")
async def get_lifestyle_profile(user_id: str, db: Session = Depends(get_db)):
    # Get all images for user
    images = db.query(SocialMediaImage).filter(SocialMediaImage.user_id == user_id).all()
    
    # Get all analyses
    image_ids = [img.id for img in images]
    analyses = db.query(ImageAnalysis).filter(ImageAnalysis.image_id.in_(image_ids)).all()
    
    # Aggregate lifestyle indicators
    lifestyle_counts = {}
    all_brands = []
    all_products = []
    
    for analysis in analyses:
        for indicator in analysis.lifestyle_indicators or []:
            lifestyle_counts[indicator] = lifestyle_counts.get(indicator, 0) + 1
        all_brands.extend(analysis.detected_brands or [])
        all_products.extend(analysis.detected_products or [])
    
    # Determine primary lifestyle categories
    sorted_lifestyles = sorted(lifestyle_counts.items(), key=lambda x: x[1], reverse=True)
    
    return {
        "user_id": user_id,
        "total_images_analyzed": len(images),
        "lifestyle_categories": dict(sorted_lifestyles[:5]),
        "top_brands": list(set(all_brands))[:10],
        "product_categories": list(set([p.get("category") for p in all_products if isinstance(p, dict)]))[:10],
        "last_updated": datetime.utcnow()
    }

# Get brand affinity for user
@router.get("/brand-affinity/{user_id}")
async def get_brand_affinity(user_id: str, db: Session = Depends(get_db)):
    affinities = db.query(BrandAffinity).filter(BrandAffinity.user_id == user_id).all()
    
    return {
        "user_id": user_id,
        "brand_affinities": [
            {
                "brand": aff.brand,
                "visual_appearances": aff.visual_appearances,
                "engagement_level": aff.engagement_level,
                "sentiment_score": aff.sentiment_score
            }
            for aff in affinities
        ]
    }

# Get contextual insights
@router.get("/context/insights/{user_id}")
async def get_contextual_insights(user_id: str, db: Session = Depends(get_db)):
    insights = db.query(ContextualInsights).filter(ContextualInsights.user_id == user_id).all()
    
    return {
        "user_id": user_id,
        "contexts": [
            {
                "type": ins.context_type,
                "frequency": ins.frequency,
                "associated_brands": ins.associated_brands,
                "associated_products": ins.associated_products
            }
            for ins in insights
        ]
    }

# Detect visual trends
@router.get("/trends/visual")
async def get_visual_trends(
    category: Optional[str] = None,
    min_users: int = 10,
    db: Session = Depends(get_db)
):
    query = db.query(VisualTrends).filter(VisualTrends.user_count >= min_users)
    
    if category:
        query = query.filter(VisualTrends.category == category)
    
    trends = query.order_by(VisualTrends.trending_score.desc()).limit(20).all()
    
    return {
        "trends": [
            {
                "trend_name": trend.trend_name,
                "category": trend.category,
                "description": trend.description,
                "user_count": trend.user_count,
                "growth_rate": trend.growth_rate,
                "trending_score": trend.trending_score,
                "associated_products": trend.associated_products
            }
            for trend in trends
        ]
    }

# Get product visibility in social media
@router.get("/products/visibility/{product_id}")
async def get_product_visibility(product_id: str, days: int = 30, db: Session = Depends(get_db)):
    cutoff = datetime.utcnow() - timedelta(days=days)
    
    # Get all detections of this product
    detections = db.query(ProductInImage).filter(
        ProductInImage.product_id == product_id,
        ProductInImage.timestamp >= cutoff
    ).all()
    
    # Get associated images
    image_ids = [d.image_id for d in detections]
    images = db.query(SocialMediaImage).filter(SocialMediaImage.id.in_(image_ids)).all()
    
    # Calculate metrics
    platforms = {}
    contexts = {}
    for det in detections:
        contexts[det.context] = contexts.get(det.context, 0) + 1
    
    for img in images:
        platforms[img.platform] = platforms.get(img.platform, 0) + 1
    
    return {
        "product_id": product_id,
        "period_days": days,
        "total_appearances": len(detections),
        "unique_users": len(set([img.user_id for img in images])),
        "platforms": platforms,
        "contexts": contexts,
        "avg_confidence": sum([d.confidence_score for d in detections]) / len(detections) if detections else 0
    }

# Dashboard summary
@router.get("/dashboard/summary")
async def visual_intelligence_summary(days: int = 30, db: Session = Depends(get_db)):
    cutoff = datetime.utcnow() - timedelta(days=days)
    
    total_images = db.query(SocialMediaImage).filter(SocialMediaImage.collected_at >= cutoff).count()
    total_analyses = db.query(ImageAnalysis).filter(ImageAnalysis.timestamp >= cutoff).count()
    total_products = db.query(ProductInImage).filter(ProductInImage.timestamp >= cutoff).count()
    
    # Top brands
    all_analyses = db.query(ImageAnalysis).filter(ImageAnalysis.timestamp >= cutoff).all()
    brand_counts = {}
    for analysis in all_analyses:
        for brand in analysis.detected_brands or []:
            brand_counts[brand] = brand_counts.get(brand, 0) + 1
    
    top_brands = sorted(brand_counts.items(), key=lambda x: x[1], reverse=True)[:10]
    
    return {
        "period_days": days,
        "total_images_collected": total_images,
        "total_analyses_completed": total_analyses,
        "total_products_detected": total_products,
        "top_brands": [{"brand": b, "count": c} for b, c in top_brands],
        "analysis_rate": (total_analyses / total_images * 100) if total_images > 0 else 0
    }
