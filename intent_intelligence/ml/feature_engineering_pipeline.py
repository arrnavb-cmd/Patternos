"""
PatternOS Feature Engineering & Intent Scoring Pipeline
Computes RFM, behavioral features, and generates intent scores
"""

import sqlite3
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import json

# ============================================================================
# CONFIGURATION
# ============================================================================

DB_PATH = "patternos_intent.db"
MODEL_PATH = "intent_model.pkl"
SCALER_PATH = "feature_scaler.pkl"

# Intent thresholds
HIGH_INTENT_THRESHOLD = 0.7
MEDIUM_INTENT_THRESHOLD = 0.4

# ============================================================================
# FEATURE ENGINEERING
# ============================================================================

def compute_rfm_features(conn, reference_date=None):
    """Compute RFM (Recency, Frequency, Monetary) features"""
    
    if reference_date is None:
        reference_date = datetime.now().date()
    
    print(f"\nComputing RFM features as of {reference_date}...")
    
    query = f"""
    SELECT 
        global_customer_id,
        platform_id,
        
        -- Recency: days since last transaction
        JULIANDAY('{reference_date}') - JULIANDAY(MAX(transaction_datetime)) as recency_days,
        
        -- Frequency: transaction counts by time window
        SUM(CASE WHEN transaction_datetime >= DATE('{reference_date}', '-7 days') THEN 1 ELSE 0 END) as frequency_7d,
        SUM(CASE WHEN transaction_datetime >= DATE('{reference_date}', '-30 days') THEN 1 ELSE 0 END) as frequency_30d,
        SUM(CASE WHEN transaction_datetime >= DATE('{reference_date}', '-90 days') THEN 1 ELSE 0 END) as frequency_90d,
        SUM(CASE WHEN transaction_datetime >= DATE('{reference_date}', '-365 days') THEN 1 ELSE 0 END) as frequency_365d,
        COUNT(*) as frequency_lifetime,
        
        -- Monetary: transaction value by time window
        SUM(CASE WHEN transaction_datetime >= DATE('{reference_date}', '-7 days') THEN total_value ELSE 0 END) as monetary_7d,
        SUM(CASE WHEN transaction_datetime >= DATE('{reference_date}', '-30 days') THEN total_value ELSE 0 END) as monetary_30d,
        SUM(CASE WHEN transaction_datetime >= DATE('{reference_date}', '-90 days') THEN total_value ELSE 0 END) as monetary_90d,
        SUM(CASE WHEN transaction_datetime >= DATE('{reference_date}', '-365 days') THEN total_value ELSE 0 END) as monetary_365d,
        SUM(total_value) as monetary_lifetime,
        
        -- Average Order Value
        AVG(CASE WHEN transaction_datetime >= DATE('{reference_date}', '-30 days') THEN total_value END) as aov_30d,
        AVG(CASE WHEN transaction_datetime >= DATE('{reference_date}', '-90 days') THEN total_value END) as aov_90d,
        AVG(total_value) as aov_lifetime,
        
        -- Last transaction date
        MAX(transaction_datetime) as last_transaction_dt
        
    FROM fact_transaction
    GROUP BY global_customer_id, platform_id
    """
    
    rfm_df = pd.read_sql_query(query, conn)
    
    # Compute RFM scores (1-5 scale)
    def score_column(col, ascending=True):
        return pd.qcut(col, q=5, labels=[1,2,3,4,5], duplicates='drop')
    
    # Recency: lower is better (inverse scoring)
    rfm_df['recency_score'] = score_column(rfm_df['recency_days'], ascending=True).astype(float)
    rfm_df['recency_score'] = 6 - rfm_df['recency_score']  # Invert so higher recency score = more recent
    
    # Frequency: higher is better
    rfm_df['frequency_score'] = score_column(rfm_df['frequency_90d'], ascending=False).astype(float)
    
    # Monetary: higher is better
    rfm_df['monetary_score'] = score_column(rfm_df['monetary_90d'], ascending=False).astype(float)
    
    # Combined RFM score
    rfm_df['rfm_score'] = (
        rfm_df['recency_score'].astype(str) +
        rfm_df['frequency_score'].astype(str) +
        rfm_df['monetary_score'].astype(str)
    )
    
    # Customer segmentation based on RFM
    def segment_customer(row):
        r, f, m = int(row['recency_score']), int(row['frequency_score']), int(row['monetary_score'])
        
        if r >= 4 and f >= 4 and m >= 4:
            return 'Champions'
        elif r >= 3 and f >= 3:
            return 'Loyal'
        elif r >= 4:
            return 'Potential'
        elif f >= 4:
            return 'Frequent'
        elif r <= 2 and f <= 2:
            return 'At Risk'
        elif r <= 2:
            return 'Hibernating'
        else:
            return 'Regular'
    
    rfm_df['customer_segment'] = rfm_df.apply(segment_customer, axis=1)
    
    # Add reference date
    rfm_df['reference_date'] = reference_date
    
    # Save to database
    rfm_df.to_sql('feat_customer_rfm', conn, if_exists='replace', index=False)
    
    print(f"  Computed RFM features for {len(rfm_df)} customer-platform combinations")
    print(f"\n  Segment Distribution:")
    print(rfm_df['customer_segment'].value_counts())
    
    return rfm_df

def compute_cross_platform_features(conn, reference_date=None):
    """Compute cross-platform behavior features"""
    
    if reference_date is None:
        reference_date = datetime.now().date()
    
    print(f"\nComputing cross-platform features...")
    
    query = f"""
    SELECT 
        global_customer_id,
        COUNT(DISTINCT platform_id) as platforms_used_count,
        GROUP_CONCAT(DISTINCT platform_id) as platforms_list,
        
        SUM(CASE WHEN transaction_datetime >= DATE('{reference_date}', '-30 days') THEN 1 ELSE 0 END) as cross_platform_purchase_count_30d,
        SUM(CASE WHEN transaction_datetime >= DATE('{reference_date}', '-30 days') THEN total_value ELSE 0 END) as cross_platform_value_30d,
        
        -- Platform with most transactions
        (SELECT platform_id FROM fact_transaction t2 
         WHERE t2.global_customer_id = t1.global_customer_id 
         GROUP BY platform_id 
         ORDER BY COUNT(*) DESC 
         LIMIT 1) as dominant_platform
        
    FROM fact_transaction t1
    GROUP BY global_customer_id
    """
    
    cross_df = pd.read_sql_query(query, conn)
    
    # Calculate platform switching frequency (transactions per platform)
    cross_df['platform_switching_frequency'] = cross_df['cross_platform_purchase_count_30d'] / cross_df['platforms_used_count']
    
    # Platform diversity score (0-1, higher = more diverse)
    cross_df['platform_diversity_score'] = 1 - (1 / cross_df['platforms_used_count'])
    
    # Dominant platform share
    cross_df['dominant_platform_share'] = 1 / cross_df['platforms_used_count']  # Simplified
    
    # Platform loyalty score (inverse of diversity)
    cross_df['platform_loyalty_score'] = 1 - cross_df['platform_diversity_score']
    
    cross_df['reference_date'] = reference_date
    
    # Save to database
    cross_df.to_sql('feat_cross_platform', conn, if_exists='replace', index=False)
    
    print(f"  Computed cross-platform features for {len(cross_df)} customers")
    print(f"  Avg platforms per customer: {cross_df['platforms_used_count'].mean():.2f}")
    print(f"  Customers using 2+ platforms: {len(cross_df[cross_df['platforms_used_count'] >= 2])}")
    
    return cross_df

def compute_behavioral_features(conn, reference_date=None):
    """Compute behavioral features from transactions"""
    
    if reference_date is None:
        reference_date = datetime.now().date()
    
    print(f"\nComputing behavioral features...")
    
    query = f"""
    SELECT 
        global_customer_id,
        platform_id,
        
        -- Transaction patterns
        AVG(items_count) as avg_items_per_transaction,
        AVG(total_value) as avg_transaction_value,
        AVG(discount_value * 1.0 / NULLIF(total_value, 0)) as avg_discount_rate,
        
        -- Repeat behavior
        SUM(CASE WHEN is_repeat = 1 THEN 1 ELSE 0 END) * 1.0 / COUNT(*) as repeat_rate,
        
        -- Time patterns
        strftime('%H', transaction_datetime) as transaction_hour,
        CASE WHEN CAST(strftime('%w', transaction_datetime) AS INTEGER) IN (0, 6) THEN 1 ELSE 0 END as is_weekend,
        
        -- Payment preferences
        payment_mode as preferred_payment_mode,
        
        COUNT(*) as total_transactions
        
    FROM fact_transaction
    WHERE transaction_datetime >= DATE('{reference_date}', '-90 days')
    GROUP BY global_customer_id, platform_id
    """
    
    behavior_df = pd.read_sql_query(query, conn)
    
    # Aggregate transaction hour to preferred shopping hour
    behavior_grouped = behavior_df.groupby(['global_customer_id', 'platform_id']).agg({
        'avg_items_per_transaction': 'mean',
        'avg_transaction_value': 'mean',
        'avg_discount_rate': 'mean',
        'repeat_rate': 'mean',
        'transaction_hour': lambda x: x.mode()[0] if len(x) > 0 else 12,
        'is_weekend': 'mean',
        'total_transactions': 'sum'
    }).reset_index()
    
    behavior_grouped = behavior_grouped.rename(columns={
        'transaction_hour': 'preferred_shopping_hour',
        'is_weekend': 'weekend_shopping_ratio'
    })
    
    # Night shopping flag (10 PM - 6 AM)
    behavior_grouped['night_shopping_flag'] = (
        (behavior_grouped['preferred_shopping_hour'] >= 22) |
        (behavior_grouped['preferred_shopping_hour'] <= 6)
    )
    
    behavior_grouped['reference_date'] = reference_date
    
    # Save to database
    behavior_grouped.to_sql('feat_customer_behavior', conn, if_exists='replace', index=False)
    
    print(f"  Computed behavioral features for {len(behavior_grouped)} customer-platform combinations")
    
    return behavior_grouped

# ============================================================================
# INTENT SCORING
# ============================================================================

def prepare_training_data(conn, label_window_days=7, lookback_days=90):
    """Prepare training dataset with labels"""
    
    print(f"\nPreparing training data...")
    print(f"  Label window: {label_window_days} days")
    print(f"  Lookback window: {lookback_days} days")
    
    # Get historical transactions to create labels
    query = """
    SELECT 
        t1.global_customer_id,
        t1.platform_id,
        t1.transaction_datetime as reference_datetime,
        
        -- Check if customer purchased within label window
        EXISTS(
            SELECT 1 FROM fact_transaction t2
            WHERE t2.global_customer_id = t1.global_customer_id
            AND t2.platform_id = t1.platform_id
            AND t2.transaction_datetime > t1.transaction_datetime
            AND t2.transaction_datetime <= DATE(t1.transaction_datetime, '+7 days')
        ) as purchased_within_window
        
    FROM fact_transaction t1
    WHERE DATE(t1.transaction_datetime) <= DATE('now', '-14 days')
    ORDER BY RANDOM()
    LIMIT 10000
    """
    
    labels_df = pd.read_sql_query(query, conn)
    labels_df['label'] = labels_df['purchased_within_window'].astype(int)
    
    # Join with features
    features_query = """
    SELECT 
        rfm.*,
        cp.platforms_used_count,
        cp.platform_diversity_score,
        cp.cross_platform_purchase_count_30d,
        b.avg_items_per_transaction,
        b.avg_discount_rate,
        b.repeat_rate,
        b.weekend_shopping_ratio
    FROM feat_customer_rfm rfm
    LEFT JOIN feat_cross_platform cp ON rfm.global_customer_id = cp.global_customer_id
    LEFT JOIN feat_customer_behavior b ON rfm.global_customer_id = b.global_customer_id 
        AND rfm.platform_id = b.platform_id
    """
    
    features_df = pd.read_sql_query(features_query, conn)
    
    # Merge labels with features
    training_df = labels_df.merge(
        features_df,
        on=['global_customer_id', 'platform_id'],
        how='inner'
    )
    
    print(f"  Created training dataset with {len(training_df)} samples")
    print(f"  Positive samples: {training_df['label'].sum()} ({training_df['label'].mean()*100:.1f}%)")
    
    return training_df

def train_intent_model(training_df):
    """Train gradient boosting model for intent prediction"""
    
    print(f"\nTraining intent prediction model...")
    
    # Feature columns
    feature_cols = [
        'recency_days', 'frequency_30d', 'frequency_90d',
        'monetary_30d', 'monetary_90d', 'aov_30d',
        'platforms_used_count', 'platform_diversity_score',
        'cross_platform_purchase_count_30d',
        'avg_items_per_transaction', 'avg_discount_rate',
        'repeat_rate', 'weekend_shopping_ratio'
    ]
    
    # Filter available features
    available_features = [col for col in feature_cols if col in training_df.columns]
    
    # Prepare data
    X = training_df[available_features].fillna(0)
    y = training_df['label']
    
    # Split train/test (80/20)
    from sklearn.model_selection import train_test_split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    model = GradientBoostingClassifier(
        n_estimators=100,
        learning_rate=0.1,
        max_depth=5,
        random_state=42
    )
    
    model.fit(X_train_scaled, y_train)
    
    # Evaluate
    from sklearn.metrics import roc_auc_score, precision_recall_fscore_support
    
    y_pred_proba = model.predict_proba(X_test_scaled)[:, 1]
    auc = roc_auc_score(y_test, y_pred_proba)
    
    y_pred = model.predict(X_test_scaled)
    precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='binary')
    
    print(f"  Model Performance:")
    print(f"    AUC-ROC: {auc:.4f}")
    print(f"    Precision: {precision:.4f}")
    print(f"    Recall: {recall:.4f}")
    print(f"    F1-Score: {f1:.4f}")
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': available_features,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print(f"\n  Top 5 Features:")
    print(feature_importance.head().to_string(index=False))
    
    # Save model and scaler
    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    print(f"\n  Model saved to {MODEL_PATH}")
    
    return model, scaler, available_features

def generate_intent_scores(conn, model, scaler, feature_cols):
    """Generate intent scores for all customers"""
    
    print(f"\nGenerating intent scores for all customers...")
    
    # Get features for all customers
    features_query = """
    SELECT 
        rfm.global_customer_id,
        rfm.platform_id,
        rfm.*,
        cp.platforms_used_count,
        cp.platform_diversity_score,
        cp.cross_platform_purchase_count_30d,
        b.avg_items_per_transaction,
        b.avg_discount_rate,
        b.repeat_rate,
        b.weekend_shopping_ratio
    FROM feat_customer_rfm rfm
    LEFT JOIN feat_cross_platform cp ON rfm.global_customer_id = cp.global_customer_id
    LEFT JOIN feat_customer_behavior b ON rfm.global_customer_id = b.global_customer_id 
        AND rfm.platform_id = b.platform_id
    """
    
    customers_df = pd.read_sql_query(features_query, conn)
    
    # Prepare features
    X = customers_df[feature_cols].fillna(0)
    X_scaled = scaler.transform(X)
    
    # Predict
    intent_scores = model.predict_proba(X_scaled)[:, 1]
    
    # Add scores to dataframe
    customers_df['intent_score'] = intent_scores
    customers_df['intent_level'] = pd.cut(
        intent_scores,
        bins=[0, MEDIUM_INTENT_THRESHOLD, HIGH_INTENT_THRESHOLD, 1.0],
        labels=['low', 'medium', 'high']
    )
    
    customers_df['scoring_timestamp'] = datetime.now()
    customers_df['model_version'] = 'v1.0_gbm'
    customers_df['model_type'] = 'gradient_boosting'
    
    # Purchase probability windows
    customers_df['purchase_probability_7d'] = intent_scores
    customers_df['purchase_probability_30d'] = intent_scores * 1.2  # Simplified
    customers_df['purchase_probability_30d'] = customers_df['purchase_probability_30d'].clip(0, 1)
    
    # Predicted purchase days (inverse of score)
    customers_df['predicted_purchase_days'] = (7 / (intent_scores + 0.1)).clip(1, 30).astype(int)
    
    # Select columns for insert
    intent_cols = [
        'global_customer_id', 'platform_id', 'scoring_timestamp',
        'intent_score', 'intent_level', 'predicted_purchase_days',
        'purchase_probability_7d', 'purchase_probability_30d',
        'model_version', 'model_type'
    ]
    
    intent_df = customers_df[intent_cols]
    
    # Save to database
    intent_df.to_sql('intent_score', conn, if_exists='replace', index=False)
    
    print(f"  Generated {len(intent_df)} intent scores")
    print(f"\n  Intent Distribution:")
    print(intent_df['intent_level'].value_counts())
    print(f"\n  High Intent Customers: {len(intent_df[intent_df['intent_level'] == 'high'])}")
    
    return intent_df

# ============================================================================
# MAIN PIPELINE
# ============================================================================

def run_feature_pipeline():
    """Run complete feature engineering and intent scoring pipeline"""
    
    print("=" * 80)
    print("PatternOS Feature Engineering & Intent Scoring Pipeline")
    print("=" * 80)
    
    # Connect to database
    conn = sqlite3.connect(DB_PATH)
    
    # Step 1: Compute features
    rfm_df = compute_rfm_features(conn)
    cross_df = compute_cross_platform_features(conn)
    behavior_df = compute_behavioral_features(conn)
    
    # Step 2: Prepare training data
    training_df = prepare_training_data(conn)
    
    # Step 3: Train model
    model, scaler, feature_cols = train_intent_model(training_df)
    
    # Step 4: Generate intent scores
    intent_df = generate_intent_scores(conn, model, scaler, feature_cols)
    
    conn.close()
    
    print("\n" + "=" * 80)
    print("Feature Pipeline Completed Successfully!")
    print("=" * 80)
    
    # Summary statistics
    print("\n📊 Summary:")
    print(f"  ✅ RFM features computed")
    print(f"  ✅ Cross-platform features computed")
    print(f"  ✅ Behavioral features computed")
    print(f"  ✅ Intent model trained (AUC: available in logs)")
    print(f"  ✅ Intent scores generated for all customers")
    print(f"\n  🎯 High Intent Users: {len(intent_df[intent_df['intent_level'] == 'high'])}")
    print(f"  📈 Medium Intent Users: {len(intent_df[intent_df['intent_level'] == 'medium'])}")
    print(f"  📉 Low Intent Users: {len(intent_df[intent_df['intent_level'] == 'low'])}")

# ============================================================================
# RUN
# ============================================================================

if __name__ == "__main__":
    run_feature_pipeline()
