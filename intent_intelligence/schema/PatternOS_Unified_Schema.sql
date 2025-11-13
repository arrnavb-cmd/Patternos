-- ============================================================================
-- PatternOS Unified Data Warehouse Schema
-- Purpose: Pre-Intent Intelligence & Cross-Platform User Journey Analysis
-- ============================================================================
-- Platforms: Zepto, Swiggy, Amazon, Nykaa, Chumbak, MakeMyTrip, CarWale
-- ============================================================================

-- ============================================================================
-- 1. DIMENSION TABLES
-- ============================================================================

-- dim_customer: Unified customer dimension with global_customer_id
CREATE TABLE dim_customer (
  global_customer_id VARCHAR(50) PRIMARY KEY,
  first_seen_date TIMESTAMP NOT NULL,
  last_seen_date TIMESTAMP,
  primary_age_group VARCHAR(20),
  primary_state VARCHAR(100),
  primary_city VARCHAR(100),
  primary_pincode VARCHAR(10),
  gender VARCHAR(10),
  email_hash VARCHAR(64),          -- SHA256 hashed
  mobile_hash VARCHAR(64),         -- SHA256 hashed
  customer_segment VARCHAR(50),    -- High-Value, Regular, Occasional, New
  lifetime_value DECIMAL(12,2) DEFAULT 0,
  total_orders INT DEFAULT 0,
  total_platforms_used INT DEFAULT 0,
  consent_marketing BOOLEAN DEFAULT TRUE,
  consent_personalization BOOLEAN DEFAULT TRUE,
  anonymized BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customer_segment ON dim_customer(customer_segment);
CREATE INDEX idx_customer_location ON dim_customer(primary_state, primary_city);
CREATE INDEX idx_customer_age ON dim_customer(primary_age_group);

-- dim_customer_identity: Maps platform-specific IDs to global_customer_id
CREATE TABLE dim_customer_identity (
  identity_id VARCHAR(50) PRIMARY KEY,
  global_customer_id VARCHAR(50) NOT NULL,
  platform_id VARCHAR(20) NOT NULL,
  platform_customer_id VARCHAR(50) NOT NULL,
  mapping_method VARCHAR(20),      -- 'deterministic', 'probabilistic', 'manual'
  mapping_confidence DECIMAL(5,4) DEFAULT 1.0,
  match_attributes JSON,           -- e.g., {"email":true, "mobile":true, "address":false}
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_matched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (global_customer_id) REFERENCES dim_customer(global_customer_id),
  UNIQUE(platform_id, platform_customer_id)
);

CREATE INDEX idx_identity_global ON dim_customer_identity(global_customer_id);
CREATE INDEX idx_identity_platform ON dim_customer_identity(platform_id, platform_customer_id);

-- dim_platform: Platform metadata
CREATE TABLE dim_platform (
  platform_id VARCHAR(20) PRIMARY KEY,
  platform_name VARCHAR(100) NOT NULL,
  platform_type VARCHAR(50),       -- 'q-commerce', 'food-delivery', 'marketplace', 'beauty', 'lifestyle', 'travel', 'automotive'
  industry_vertical VARCHAR(50),   -- 'retail', 'travel', 'automotive'
  region VARCHAR(50),
  launch_date DATE,
  is_active BOOLEAN DEFAULT TRUE
);

INSERT INTO dim_platform VALUES
('ZEPTO', 'Zepto', 'q-commerce', 'retail', 'India', '2021-01-01', TRUE),
('SWIGGY', 'Swiggy', 'food-delivery', 'retail', 'India', '2014-08-01', TRUE),
('AMAZON', 'Amazon India', 'marketplace', 'retail', 'India', '2013-06-01', TRUE),
('NYKAA', 'Nykaa', 'beauty', 'retail', 'India', '2012-01-01', TRUE),
('CHUMBAK', 'Chumbak', 'lifestyle', 'retail', 'India', '2010-01-01', TRUE),
('MMT', 'MakeMyTrip', 'travel', 'travel', 'India', '2000-04-01', TRUE),
('CARWALE', 'CarWale', 'automotive', 'automotive', 'India', '2007-01-01', TRUE);

-- dim_product_category: Hierarchical category dimension
CREATE TABLE dim_product_category (
  category_id INT PRIMARY KEY AUTO_INCREMENT,
  category_level_1 VARCHAR(100),   -- 'Groceries', 'Electronics', 'Beauty', 'Travel', 'Automotive'
  category_level_2 VARCHAR(100),   -- 'Fresh Produce', 'Smartphones', 'Skincare'
  category_level_3 VARCHAR(100),   -- 'Organic Vegetables', 'Android Phones'
  unified_category VARCHAR(100),   -- Standardized category across platforms
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_category_l1 ON dim_product_category(category_level_1);
CREATE INDEX idx_category_unified ON dim_product_category(unified_category);

-- dim_sku: Product/SKU dimension
CREATE TABLE dim_sku (
  sku_id VARCHAR(100) PRIMARY KEY,
  platform_id VARCHAR(20) NOT NULL,
  sku_name VARCHAR(500),
  brand VARCHAR(200),
  category_id INT,
  price_band VARCHAR(20),          -- 'budget', 'mid-range', 'premium', 'luxury'
  average_price DECIMAL(10,2),
  unit_of_measure VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (platform_id) REFERENCES dim_platform(platform_id),
  FOREIGN KEY (category_id) REFERENCES dim_product_category(category_id)
);

CREATE INDEX idx_sku_platform ON dim_sku(platform_id);
CREATE INDEX idx_sku_category ON dim_sku(category_id);
CREATE INDEX idx_sku_brand ON dim_sku(brand);

-- dim_location: Geographic dimension
CREATE TABLE dim_location (
  location_id INT PRIMARY KEY AUTO_INCREMENT,
  pincode VARCHAR(10),
  city VARCHAR(100),
  state VARCHAR(100),
  region VARCHAR(50),              -- 'North', 'South', 'East', 'West', 'Central'
  metro_flag BOOLEAN,              -- TRUE for metro cities
  tier VARCHAR(10),                -- 'Tier-1', 'Tier-2', 'Tier-3'
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  
  UNIQUE(pincode)
);

CREATE INDEX idx_location_city ON dim_location(city, state);
CREATE INDEX idx_location_tier ON dim_location(tier);

-- dim_time: Time dimension for temporal analysis
CREATE TABLE dim_time (
  date_id INT PRIMARY KEY,         -- YYYYMMDD format
  full_date DATE NOT NULL UNIQUE,
  year INT,
  quarter INT,
  month INT,
  month_name VARCHAR(20),
  week_of_year INT,
  day_of_month INT,
  day_of_week INT,
  day_name VARCHAR(20),
  is_weekend BOOLEAN,
  is_holiday BOOLEAN,
  holiday_name VARCHAR(100),
  fiscal_year INT,
  fiscal_quarter INT
);

-- ============================================================================
-- 2. FACT TABLES
-- ============================================================================

-- fact_transaction: Unified transaction fact (orders/bookings/enquiries)
CREATE TABLE fact_transaction (
  transaction_id VARCHAR(100) PRIMARY KEY,
  platform_id VARCHAR(20) NOT NULL,
  global_customer_id VARCHAR(50) NOT NULL,
  platform_customer_id VARCHAR(50) NOT NULL,
  transaction_type VARCHAR(20),    -- 'order', 'booking', 'enquiry'
  transaction_datetime TIMESTAMP NOT NULL,
  date_id INT,
  
  -- Transaction Details
  total_value DECIMAL(12,2) NOT NULL,
  discount_value DECIMAL(12,2) DEFAULT 0,
  net_value DECIMAL(12,2) GENERATED ALWAYS AS (total_value - discount_value) STORED,
  items_count INT,
  items_list TEXT,                 -- Comma-separated or JSON
  
  -- Customer Behavior
  is_repeat BOOLEAN,
  is_first_purchase BOOLEAN,
  days_since_last_transaction INT,
  
  -- Payment & Delivery
  payment_mode VARCHAR(50),
  delivery_speed VARCHAR(50),      -- 'instant', 'same-day', 'fast', 'standard'
  fulfillment_time_hours INT,
  
  -- Platform-Specific Flags
  prime_member BOOLEAN,            -- Amazon
  loyalty_member BOOLEAN,          -- MMT, Nykaa
  
  -- Location
  location_id INT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (platform_id) REFERENCES dim_platform(platform_id),
  FOREIGN KEY (global_customer_id) REFERENCES dim_customer(global_customer_id),
  FOREIGN KEY (date_id) REFERENCES dim_time(date_id),
  FOREIGN KEY (location_id) REFERENCES dim_location(location_id)
);

-- Partitioning for performance
PARTITION BY RANGE (YEAR(transaction_datetime)) (
  PARTITION p2024 VALUES LESS THAN (2025),
  PARTITION p2025 VALUES LESS THAN (2026),
  PARTITION p2026 VALUES LESS THAN (2027)
);

CREATE INDEX idx_trans_customer ON fact_transaction(global_customer_id, transaction_datetime);
CREATE INDEX idx_trans_platform ON fact_transaction(platform_id, transaction_datetime);
CREATE INDEX idx_trans_datetime ON fact_transaction(transaction_datetime);
CREATE INDEX idx_trans_value ON fact_transaction(net_value);

-- fact_transaction_line: Line items for each transaction
CREATE TABLE fact_transaction_line (
  line_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  transaction_id VARCHAR(100) NOT NULL,
  sku_id VARCHAR(100),
  item_name VARCHAR(500),
  category_id INT,
  quantity INT DEFAULT 1,
  unit_price DECIMAL(10,2),
  line_total DECIMAL(10,2),
  discount_applied DECIMAL(10,2),
  
  FOREIGN KEY (transaction_id) REFERENCES fact_transaction(transaction_id),
  FOREIGN KEY (sku_id) REFERENCES dim_sku(sku_id),
  FOREIGN KEY (category_id) REFERENCES dim_product_category(category_id)
);

CREATE INDEX idx_line_transaction ON fact_transaction_line(transaction_id);
CREATE INDEX idx_line_sku ON fact_transaction_line(sku_id);
CREATE INDEX idx_line_category ON fact_transaction_line(category_id);

-- fact_event: Behavioral events (page views, searches, clicks, add-to-cart)
CREATE TABLE fact_event (
  event_id VARCHAR(100) PRIMARY KEY,
  platform_id VARCHAR(20) NOT NULL,
  global_customer_id VARCHAR(50),
  platform_customer_id VARCHAR(50),
  session_id VARCHAR(100),
  
  event_type VARCHAR(50),          -- 'page_view', 'search', 'click', 'add_to_cart', 'remove_from_cart', 'wishlist_add'
  event_timestamp TIMESTAMP NOT NULL,
  
  -- Event Context
  page_url VARCHAR(500),
  referrer_url VARCHAR(500),
  search_term VARCHAR(200),
  product_id VARCHAR(100),
  category_id INT,
  
  -- Device & Location
  device_type VARCHAR(50),         -- 'mobile', 'desktop', 'tablet'
  browser VARCHAR(100),
  os VARCHAR(100),
  ip_hash VARCHAR(64),             -- Hashed IP
  location_id INT,
  
  -- Session Context
  session_duration_seconds INT,
  pages_viewed_in_session INT,
  
  -- Event Properties (JSON for flexibility)
  event_properties JSON,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (platform_id) REFERENCES dim_platform(platform_id),
  FOREIGN KEY (global_customer_id) REFERENCES dim_customer(global_customer_id),
  FOREIGN KEY (category_id) REFERENCES dim_product_category(category_id),
  FOREIGN KEY (location_id) REFERENCES dim_location(location_id)
);

PARTITION BY RANGE (UNIX_TIMESTAMP(event_timestamp)) (
  PARTITION p202410 VALUES LESS THAN (UNIX_TIMESTAMP('2024-11-01')),
  PARTITION p202411 VALUES LESS THAN (UNIX_TIMESTAMP('2024-12-01')),
  PARTITION p202412 VALUES LESS THAN (UNIX_TIMESTAMP('2025-01-01'))
);

CREATE INDEX idx_event_customer ON fact_event(global_customer_id, event_timestamp);
CREATE INDEX idx_event_session ON fact_event(session_id);
CREATE INDEX idx_event_type ON fact_event(event_type, event_timestamp);

-- ============================================================================
-- 3. FEATURE TABLES (Pre-computed for ML)
-- ============================================================================

-- feat_customer_rfm: Recency, Frequency, Monetary features
CREATE TABLE feat_customer_rfm (
  feature_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  global_customer_id VARCHAR(50) NOT NULL,
  platform_id VARCHAR(20),         -- NULL for cross-platform aggregation
  reference_date DATE NOT NULL,
  
  -- Recency Features
  recency_days INT,                -- Days since last purchase
  recency_score INT,               -- 1-5 score
  
  -- Frequency Features (multiple windows)
  frequency_7d INT DEFAULT 0,
  frequency_30d INT DEFAULT 0,
  frequency_90d INT DEFAULT 0,
  frequency_365d INT DEFAULT 0,
  frequency_lifetime INT DEFAULT 0,
  
  -- Monetary Features
  monetary_7d DECIMAL(12,2) DEFAULT 0,
  monetary_30d DECIMAL(12,2) DEFAULT 0,
  monetary_90d DECIMAL(12,2) DEFAULT 0,
  monetary_365d DECIMAL(12,2) DEFAULT 0,
  monetary_lifetime DECIMAL(12,2) DEFAULT 0,
  
  -- Average Order Value
  aov_30d DECIMAL(10,2),
  aov_90d DECIMAL(10,2),
  aov_lifetime DECIMAL(10,2),
  
  -- Purchase Patterns
  avg_days_between_purchases DECIMAL(8,2),
  purchase_consistency_score DECIMAL(5,4),  -- Variance in purchase intervals
  
  -- RFM Combined Score
  rfm_score VARCHAR(3),            -- e.g., '555' for best customers
  customer_segment VARCHAR(50),    -- 'Champions', 'Loyal', 'At Risk', 'Lost'
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (global_customer_id) REFERENCES dim_customer(global_customer_id),
  FOREIGN KEY (platform_id) REFERENCES dim_platform(platform_id),
  UNIQUE(global_customer_id, platform_id, reference_date)
);

CREATE INDEX idx_rfm_customer ON feat_customer_rfm(global_customer_id, reference_date);
CREATE INDEX idx_rfm_segment ON feat_customer_rfm(customer_segment);

-- feat_customer_affinity: Category & Brand Affinity Scores
CREATE TABLE feat_customer_affinity (
  affinity_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  global_customer_id VARCHAR(50) NOT NULL,
  reference_date DATE NOT NULL,
  
  -- Category Affinity
  category_id INT,
  category_purchase_count INT,
  category_purchase_value DECIMAL(12,2),
  category_recency_days INT,
  category_affinity_score DECIMAL(5,4),  -- 0.0 - 1.0
  category_rank INT,                      -- Rank within customer's preferences
  
  -- Brand Affinity
  brand VARCHAR(200),
  brand_purchase_count INT,
  brand_purchase_value DECIMAL(12,2),
  brand_affinity_score DECIMAL(5,4),
  
  -- Time Period
  window_days INT,                        -- 30, 90, 365
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (global_customer_id) REFERENCES dim_customer(global_customer_id),
  FOREIGN KEY (category_id) REFERENCES dim_product_category(category_id)
);

CREATE INDEX idx_affinity_customer ON feat_customer_affinity(global_customer_id);
CREATE INDEX idx_affinity_category ON feat_customer_affinity(category_id, category_affinity_score);

-- feat_customer_behavior: Behavioral features
CREATE TABLE feat_customer_behavior (
  behavior_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  global_customer_id VARCHAR(50) NOT NULL,
  platform_id VARCHAR(20),
  reference_date DATE NOT NULL,
  
  -- Session Behavior (last 30 days)
  total_sessions INT,
  avg_session_duration_seconds INT,
  total_page_views INT,
  avg_pages_per_session DECIMAL(6,2),
  
  -- Search Behavior
  total_searches INT,
  unique_search_terms INT,
  search_to_purchase_ratio DECIMAL(5,4),
  
  -- Cart Behavior
  add_to_cart_count INT,
  remove_from_cart_count INT,
  cart_abandonment_count INT,
  cart_abandonment_rate DECIMAL(5,4),
  
  -- Engagement Indicators
  wishlist_adds INT,
  product_views INT,
  category_exploration_score DECIMAL(5,4),  -- Diversity of categories viewed
  
  -- Time Patterns
  preferred_shopping_hour INT,             -- 0-23
  weekend_shopping_ratio DECIMAL(5,4),
  night_shopping_flag BOOLEAN,             -- Shops between 10 PM - 6 AM
  
  -- Device Preferences
  mobile_sessions_pct DECIMAL(5,4),
  desktop_sessions_pct DECIMAL(5,4),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (global_customer_id) REFERENCES dim_customer(global_customer_id),
  FOREIGN KEY (platform_id) REFERENCES dim_platform(platform_id),
  UNIQUE(global_customer_id, platform_id, reference_date)
);

CREATE INDEX idx_behavior_customer ON feat_customer_behavior(global_customer_id, reference_date);

-- feat_cross_platform: Cross-platform behavior features
CREATE TABLE feat_cross_platform (
  cross_platform_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  global_customer_id VARCHAR(50) NOT NULL,
  reference_date DATE NOT NULL,
  
  -- Platform Usage
  platforms_used_count INT,
  platforms_list JSON,                     -- ["ZEPTO", "AMAZON", "NYKAA"]
  
  -- Cross-Platform Purchase Patterns
  cross_platform_purchase_count_30d INT,
  cross_platform_value_30d DECIMAL(12,2),
  
  -- Category Overlap
  common_categories JSON,                  -- Categories purchased across platforms
  category_overlap_score DECIMAL(5,4),
  
  -- Platform Switching Patterns
  platform_switching_frequency DECIMAL(6,2),  -- Switches per month
  dominant_platform VARCHAR(20),
  dominant_platform_share DECIMAL(5,4),
  
  -- Loyalty Indicators
  platform_diversity_score DECIMAL(5,4),   -- Higher = uses many platforms
  platform_loyalty_score DECIMAL(5,4),     -- Higher = loyal to one platform
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (global_customer_id) REFERENCES dim_customer(global_customer_id),
  UNIQUE(global_customer_id, reference_date)
);

CREATE INDEX idx_cross_customer ON feat_cross_platform(global_customer_id, reference_date);

-- ============================================================================
-- 4. INTENT SCORING TABLES
-- ============================================================================

-- intent_score: Pre-intent predictions
CREATE TABLE intent_score (
  score_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  global_customer_id VARCHAR(50) NOT NULL,
  platform_id VARCHAR(20) NOT NULL,
  scoring_timestamp TIMESTAMP NOT NULL,
  
  -- Intent Score
  intent_score DECIMAL(5,4) NOT NULL,      -- 0.0000 - 1.0000
  intent_level VARCHAR(20),                 -- 'high' (>= 0.7), 'medium' (0.4-0.7), 'low' (< 0.4)
  
  -- Category-Specific Intent
  predicted_category_id INT,
  category_intent_score DECIMAL(5,4),
  
  -- Predicted Purchase Window
  predicted_purchase_days INT,             -- Expected days until purchase
  purchase_probability_7d DECIMAL(5,4),
  purchase_probability_30d DECIMAL(5,4),
  
  -- Model Metadata
  model_version VARCHAR(50),
  model_type VARCHAR(50),                  -- 'gradient_boost', 'neural_network', 'ensemble'
  feature_importance JSON,
  
  -- Ground Truth (for validation)
  actual_purchased BOOLEAN,
  actual_purchase_date DATE,
  days_to_purchase INT,
  
  -- Serving Metadata
  served_to_campaign BOOLEAN DEFAULT FALSE,
  served_timestamp TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (global_customer_id) REFERENCES dim_customer(global_customer_id),
  FOREIGN KEY (platform_id) REFERENCES dim_platform(platform_id),
  FOREIGN KEY (predicted_category_id) REFERENCES dim_product_category(category_id)
);

CREATE INDEX idx_intent_customer ON intent_score(global_customer_id, scoring_timestamp);
CREATE INDEX idx_intent_level ON intent_score(intent_level, platform_id);
CREATE INDEX idx_intent_score_value ON intent_score(intent_score DESC);

-- intent_training_labels: Labels for model training
CREATE TABLE intent_training_labels (
  label_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  global_customer_id VARCHAR(50) NOT NULL,
  platform_id VARCHAR(20) NOT NULL,
  label_timestamp TIMESTAMP NOT NULL,
  
  -- Label Window
  lookback_days INT NOT NULL,              -- Feature lookback: 30, 60, 90
  label_window_days INT NOT NULL,          -- Prediction window: 7, 14, 30
  
  -- Label
  purchased BOOLEAN NOT NULL,              -- Did customer purchase?
  purchase_value DECIMAL(12,2),
  category_id INT,
  days_to_purchase INT,
  
  -- Feature Snapshot (for reproducibility)
  features_json JSON,
  
  -- Split Assignment
  dataset_split VARCHAR(10),               -- 'train', 'validation', 'test'
  fold_number INT,                         -- For cross-validation
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (global_customer_id) REFERENCES dim_customer(global_customer_id),
  FOREIGN KEY (platform_id) REFERENCES dim_platform(platform_id),
  FOREIGN KEY (category_id) REFERENCES dim_product_category(category_id)
);

CREATE INDEX idx_label_customer ON intent_training_labels(global_customer_id, label_timestamp);
CREATE INDEX idx_label_split ON intent_training_labels(dataset_split, fold_number);

-- ============================================================================
-- 5. MATERIALIZED VIEWS FOR ANALYTICS
-- ============================================================================

-- View: Customer 360° Summary
CREATE VIEW vw_customer_360 AS
SELECT 
  c.global_customer_id,
  c.primary_age_group,
  c.primary_city,
  c.primary_state,
  c.customer_segment,
  c.lifetime_value,
  c.total_orders,
  c.total_platforms_used,
  
  -- Recent RFM
  rfm.recency_days,
  rfm.frequency_30d,
  rfm.monetary_30d,
  rfm.rfm_score,
  
  -- Latest Intent Score
  i.intent_score AS latest_intent_score,
  i.intent_level,
  i.predicted_category_id,
  
  -- Cross-Platform
  cp.platforms_used_count,
  cp.dominant_platform,
  
  -- Behavioral
  b.cart_abandonment_rate,
  b.preferred_shopping_hour
  
FROM dim_customer c
LEFT JOIN feat_customer_rfm rfm 
  ON c.global_customer_id = rfm.global_customer_id 
  AND rfm.platform_id IS NULL 
  AND rfm.reference_date = CURRENT_DATE
LEFT JOIN intent_score i 
  ON c.global_customer_id = i.global_customer_id 
  AND i.scoring_timestamp = (
    SELECT MAX(scoring_timestamp) 
    FROM intent_score 
    WHERE global_customer_id = c.global_customer_id
  )
LEFT JOIN feat_cross_platform cp 
  ON c.global_customer_id = cp.global_customer_id 
  AND cp.reference_date = CURRENT_DATE
LEFT JOIN feat_customer_behavior b 
  ON c.global_customer_id = b.global_customer_id 
  AND b.platform_id IS NULL 
  AND b.reference_date = CURRENT_DATE;

-- View: High Intent Users Dashboard
CREATE VIEW vw_high_intent_users AS
SELECT 
  i.global_customer_id,
  c.primary_age_group,
  c.primary_city,
  i.platform_id,
  p.platform_name,
  i.intent_score,
  i.predicted_category_id,
  cat.unified_category AS predicted_category,
  i.purchase_probability_7d,
  i.purchase_probability_30d,
  i.scoring_timestamp,
  rfm.monetary_90d AS recent_value,
  rfm.frequency_30d AS recent_frequency
FROM intent_score i
JOIN dim_customer c ON i.global_customer_id = c.global_customer_id
JOIN dim_platform p ON i.platform_id = p.platform_id
LEFT JOIN dim_product_category cat ON i.predicted_category_id = cat.category_id
LEFT JOIN feat_customer_rfm rfm 
  ON i.global_customer_id = rfm.global_customer_id 
  AND i.platform_id = rfm.platform_id
  AND rfm.reference_date = DATE(i.scoring_timestamp)
WHERE i.intent_level = 'high'
  AND i.scoring_timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR);

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
