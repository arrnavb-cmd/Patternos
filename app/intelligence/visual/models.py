from sqlalchemy import Column, Integer, String, DateTime, JSON, Float, Text, Boolean
from datetime import datetime
from app.database import Base

class SocialMediaImage(Base):
    __tablename__ = "social_media_images"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    platform = Column(String)  # instagram, facebook, twitter, etc.
    image_url = Column(Text)
    post_url = Column(Text, nullable=True)
    caption = Column(Text, nullable=True)
    hashtags = Column(JSON, nullable=True)
    posted_at = Column(DateTime)
    collected_at = Column(DateTime, default=datetime.utcnow)
    metadata = Column(JSON, nullable=True)

class ImageAnalysis(Base):
    __tablename__ = "image_analysis"
    
    id = Column(Integer, primary_key=True, index=True)
    image_id = Column(Integer, index=True)  # FK to social_media_images
    analysis_type = Column(String)  # product_detection, lifestyle, context
    detected_products = Column(JSON)  # Products visible in image
    detected_brands = Column(JSON)  # Brands identified
    scene_description = Column(Text)  # AI description of scene
    objects_detected = Column(JSON)  # All objects in image
    lifestyle_indicators = Column(JSON)  # home, outdoor, gym, restaurant, etc.
    dominant_colors = Column(JSON)
    image_quality_score = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)

class ProductInImage(Base):
    __tablename__ = "products_in_images"
    
    id = Column(Integer, primary_key=True, index=True)
    image_id = Column(Integer, index=True)
    product_id = Column(String, nullable=True)
    product_category = Column(String)
    brand = Column(String, nullable=True)
    confidence_score = Column(Float)
    bounding_box = Column(JSON)  # x, y, width, height
    context = Column(String)  # in_use, display, background
    timestamp = Column(DateTime, default=datetime.utcnow)

class LifestyleAnalysis(Base):
    __tablename__ = "lifestyle_analysis"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    lifestyle_category = Column(String)  # fitness, luxury, family, eco_conscious, etc.
    indicators = Column(JSON)  # Array of lifestyle signals
    confidence_score = Column(Float)
    image_count = Column(Integer)  # Based on how many images
    last_updated = Column(DateTime, default=datetime.utcnow)

class BrandAffinity(Base):
    __tablename__ = "brand_affinity"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    brand = Column(String, index=True)
    mention_count = Column(Integer, default=0)
    visual_appearances = Column(Integer, default=0)
    sentiment_score = Column(Float)  # -1 to 1
    engagement_level = Column(String)  # low, medium, high
    last_seen = Column(DateTime)
    first_seen = Column(DateTime)

class ContextualInsights(Base):
    __tablename__ = "contextual_insights"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    context_type = Column(String)  # home_decor, travel, food, fashion, fitness
    frequency = Column(Integer)
    associated_brands = Column(JSON)
    associated_products = Column(JSON)
    time_of_day_patterns = Column(JSON, nullable=True)
    seasonal_patterns = Column(JSON, nullable=True)
    last_updated = Column(DateTime, default=datetime.utcnow)

class VisualTrends(Base):
    __tablename__ = "visual_trends"
    
    id = Column(Integer, primary_key=True, index=True)
    trend_name = Column(String, index=True)
    category = Column(String)
    description = Column(Text)
    example_images = Column(JSON)  # Array of image URLs
    user_count = Column(Integer, default=0)
    growth_rate = Column(Float)
    associated_products = Column(JSON)
    detected_at = Column(DateTime, default=datetime.utcnow)
    trending_score = Column(Float)
