"""
PatternOS Intent Prediction Model - Training Script
Trains XGBoost model to predict purchase intent across platforms
"""

import pandas as pd
import numpy as np
import sqlite3
from datetime import datetime, timedelta
import json
import pickle

# ML Libraries
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import (
    roc_auc_score, precision_recall_curve, average_precision_score,
    confusion_matrix, classification_report, roc_curve
)
import xgboost as xgb
import lightgbm as lgb
import matplotlib.pyplot as plt
import seaborn as sns

# Configuration
DB_PATH = 'patternos_dw.db'
MODEL_PATH = 'intent_model_v1.pkl'
FEATURE_IMPORTANCE_PATH = 'feature_importance.png'
ROC_CURVE_PATH = 'roc_curve.png'

class IntentPredictionModel:
    """
    Intent prediction model that forecasts likelihood of purchase
    within next 7 days based on RFM and behavioral features
    """
    
    def __init__(self, db_path=DB_PATH):
        self.db_path = db_path
        self.model = None
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.feature_names = []
        self.model_version = "1.0"
        
    def create_training_dataset(self, lookback_days=90, label_window_days=7):
        """
        Create training dataset with features and labels
        
        Parameters:
        - lookback_days: Historical window for feature calculation (default 90)
        - label_window_days: Future window for label (did they purchase?) (default 7)
        """
        print(f"\n📊 Creating training dataset...")
        print(f"   Lookback: {lookback_days} days")
        print(f"   Label window: {label_window_days} days")
        
        conn = sqlite3.connect(self.db_path)
        
        # Feature query: Get all features for each customer-platform pair
        feature_query = """
        WITH customer_features AS (
            SELECT 
                c.global_customer_id,
                'ZEPTO' as platform_id,  -- Will do for each platform
                
                -- Customer Demographics
                c.primary_age_group,
                c.primary_city,
                c.primary_state,
                c.total_platforms_used,
                
                -- RFM Features
                rfm.recency_days,
                rfm.frequency_7d,
                rfm.frequency_30d,
                rfm.frequency_90d,
                rfm.monetary_30d,
                rfm.monetary_90d,
                rfm.aov_30d,
                
                -- Purchase Patterns
                CASE WHEN rfm.frequency_30d > 0 THEN 1 ELSE 0 END as active_last_30d,
                CASE WHEN rfm.frequency_7d > 0 THEN 1 ELSE 0 END as active_last_7d,
                
                -- Cross-Platform Features
                cp.platforms_used_count,
                cp.platform_diversity_score,
                
                -- Behavioral Features (if available)
                b.cart_abandonment_rate,
                b.search_to_purchase_ratio,
                b.preferred_shopping_hour,
                b.weekend_shopping_ratio,
                
                -- Time features
                CAST(strftime('%w', 'now') AS INTEGER) as day_of_week,
                CAST(strftime('%H', 'now') AS INTEGER) as hour_of_day,
                CAST(strftime('%m', 'now') AS INTEGER) as month
                
            FROM dim_customer c
            LEFT JOIN feat_customer_rfm rfm 
                ON c.global_customer_id = rfm.global_customer_id
                AND rfm.platform_id = 'ZEPTO'
            LEFT JOIN feat_cross_platform cp 
                ON c.global_customer_id = cp.global_customer_id
            LEFT JOIN feat_customer_behavior b 
                ON c.global_customer_id = b.global_customer_id
                AND b.platform_id = 'ZEPTO'
        )
        SELECT * FROM customer_features;
        """
        
        df_features = pd.read_sql_query(feature_query, conn)
        print(f"   Loaded {len(df_features)} customer-platform records")
        
        # Label query: Did customer purchase within next 7 days?
        label_query = f"""
        SELECT DISTINCT
            global_customer_id,
            platform_id,
            1 as purchased_within_window
        FROM fact_transaction
        WHERE transaction_datetime >= date('now', '-{label_window_days} days')
            AND transaction_datetime <= date('now')
        """
        
        df_labels = pd.read_sql_query(label_query, conn)
        print(f"   Found {len(df_labels)} positive labels (purchases)")
        
        # Merge features with labels
        df = df_features.merge(
            df_labels[['global_customer_id', 'platform_id', 'purchased_within_window']],
            on=['global_customer_id', 'platform_id'],
            how='left'
        )
        df['purchased_within_window'] = df['purchased_within_window'].fillna(0).astype(int)
        
        # Balance dataset (optional: undersample negatives or oversample positives)
        positive_samples = df[df['purchased_within_window'] == 1]
        negative_samples = df[df['purchased_within_window'] == 0].sample(
            n=len(positive_samples) * 3,  # 1:3 ratio
            random_state=42
        )
        df_balanced = pd.concat([positive_samples, negative_samples]).sample(frac=1, random_state=42)
        
        print(f"   Balanced dataset: {len(df_balanced)} samples")
        print(f"   Positive class: {len(positive_samples)} ({len(positive_samples)/len(df_balanced)*100:.1f}%)")
        print(f"   Negative class: {len(negative_samples)} ({len(negative_samples)/len(df_balanced)*100:.1f}%)")
        
        conn.close()
        return df_balanced
    
    def preprocess_features(self, df):
        """
        Preprocess features: encoding, scaling, handling nulls
        """
        print("\n🔧 Preprocessing features...")
        
        df = df.copy()
        
        # Fill nulls
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        df[numeric_cols] = df[numeric_cols].fillna(0)
        
        categorical_cols = ['primary_age_group', 'primary_city', 'primary_state', 'platform_id']
        for col in categorical_cols:
            df[col] = df[col].fillna('Unknown')
        
        # Encode categorical variables
        for col in categorical_cols:
            if col not in self.label_encoders:
                self.label_encoders[col] = LabelEncoder()
                df[col] = self.label_encoders[col].fit_transform(df[col].astype(str))
            else:
                # Handle unseen labels
                df[col] = df[col].apply(lambda x: x if x in self.label_encoders[col].classes_ else 'Unknown')
                df[col] = self.label_encoders[col].transform(df[col].astype(str))
        
        # Feature engineering: Derived features
        df['recency_x_frequency'] = df['recency_days'] * df['frequency_90d']
        df['aov_x_frequency'] = df['aov_30d'] * df['frequency_30d']
        df['is_weekend'] = df['day_of_week'].isin([0, 6]).astype(int)
        df['is_evening'] = df['hour_of_day'].between(18, 22).astype(int)
        
        print(f"   Preprocessed {len(df)} rows with {len(df.columns)} features")
        
        return df
    
    def train_model(self, df, model_type='xgboost'):
        """
        Train intent prediction model
        
        Parameters:
        - df: Preprocessed dataframe
        - model_type: 'xgboost' or 'lightgbm'
        """
        print(f"\n🚀 Training {model_type.upper()} model...")
        
        # Separate features and target
        feature_cols = [col for col in df.columns if col not in 
                       ['global_customer_id', 'purchased_within_window']]
        
        X = df[feature_cols]
        y = df['purchased_within_window']
        
        self.feature_names = feature_cols
        
        # Train-test split
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        print(f"   Training set: {len(X_train)} samples")
        print(f"   Test set: {len(X_test)} samples")
        
        # Train model
        if model_type == 'xgboost':
            self.model = xgb.XGBClassifier(
                n_estimators=500,
                max_depth=6,
                learning_rate=0.05,
                subsample=0.8,
                colsample_bytree=0.8,
                objective='binary:logistic',
                eval_metric='auc',
                random_state=42,
                tree_method='hist'
            )
        elif model_type == 'lightgbm':
            self.model = lgb.LGBMClassifier(
                n_estimators=500,
                max_depth=6,
                learning_rate=0.05,
                subsample=0.8,
                colsample_bytree=0.8,
                objective='binary',
                metric='auc',
                random_state=42
            )
        
        # Fit model
        self.model.fit(
            X_train, y_train,
            eval_set=[(X_test, y_test)],
            verbose=50
        )
        
        # Evaluate
        y_pred_proba = self.model.predict_proba(X_test)[:, 1]
        y_pred = (y_pred_proba >= 0.5).astype(int)
        
        auc = roc_auc_score(y_test, y_pred_proba)
        
        print(f"\n✅ Model Training Complete!")
        print(f"   Test AUC: {auc:.4f}")
        print(f"\nClassification Report:")
        print(classification_report(y_test, y_pred, target_names=['No Purchase', 'Purchase']))
        
        # Save predictions for calibration analysis
        self.X_test = X_test
        self.y_test = y_test
        self.y_pred_proba = y_pred_proba
        
        return self.model
    
    def evaluate_model(self, save_plots=True):
        """
        Comprehensive model evaluation
        """
        print("\n📈 Model Evaluation...")
        
        # ROC Curve
        fpr, tpr, thresholds = roc_curve(self.y_test, self.y_pred_proba)
        auc = roc_auc_score(self.y_test, self.y_pred_proba)
        
        if save_plots:
            plt.figure(figsize=(10, 6))
            plt.plot(fpr, tpr, label=f'ROC Curve (AUC = {auc:.4f})', linewidth=2)
            plt.plot([0, 1], [0, 1], 'k--', label='Random Classifier')
            plt.xlabel('False Positive Rate')
            plt.ylabel('True Positive Rate')
            plt.title('ROC Curve - Intent Prediction Model')
            plt.legend()
            plt.grid(alpha=0.3)
            plt.savefig(ROC_CURVE_PATH, dpi=300, bbox_inches='tight')
            print(f"   Saved ROC curve to {ROC_CURVE_PATH}")
            plt.close()
        
        # Precision-Recall Curve
        precision, recall, pr_thresholds = precision_recall_curve(self.y_test, self.y_pred_proba)
        avg_precision = average_precision_score(self.y_test, self.y_pred_proba)
        
        print(f"   Average Precision: {avg_precision:.4f}")
        
        # Feature Importance
        if hasattr(self.model, 'feature_importances_'):
            importance_df = pd.DataFrame({
                'feature': self.feature_names,
                'importance': self.model.feature_importances_
            }).sort_values('importance', ascending=False).head(20)
            
            if save_plots:
                plt.figure(figsize=(10, 8))
                plt.barh(importance_df['feature'], importance_df['importance'])
                plt.xlabel('Importance')
                plt.title('Top 20 Feature Importances')
                plt.gca().invert_yaxis()
                plt.tight_layout()
                plt.savefig(FEATURE_IMPORTANCE_PATH, dpi=300, bbox_inches='tight')
                print(f"   Saved feature importance to {FEATURE_IMPORTANCE_PATH}")
                plt.close()
            
            print("\n🎯 Top 10 Most Important Features:")
            for idx, row in importance_df.head(10).iterrows():
                print(f"   {row['feature']}: {row['importance']:.4f}")
        
        # Calibration Analysis
        print("\n📊 Calibration Analysis (Predicted vs Actual):")
        score_buckets = pd.cut(self.y_pred_proba, bins=[0, 0.3, 0.5, 0.7, 0.9, 1.0], 
                               labels=['0-0.3', '0.3-0.5', '0.5-0.7', '0.7-0.9', '0.9-1.0'])
        calibration = pd.DataFrame({
            'predicted_bucket': score_buckets,
            'actual': self.y_test
        }).groupby('predicted_bucket')['actual'].agg(['mean', 'count'])
        
        print(calibration)
    
    def save_model(self, model_path=MODEL_PATH):
        """
        Save trained model and preprocessors
        """
        print(f"\n💾 Saving model to {model_path}...")
        
        model_package = {
            'model': self.model,
            'scaler': self.scaler,
            'label_encoders': self.label_encoders,
            'feature_names': self.feature_names,
            'model_version': self.model_version,
            'trained_at': datetime.now().isoformat()
        }
        
        with open(model_path, 'wb') as f:
            pickle.dump(model_package, f)
        
        print(f"   Model saved successfully!")
    
    def load_model(self, model_path=MODEL_PATH):
        """
        Load trained model
        """
        print(f"\n📂 Loading model from {model_path}...")
        
        with open(model_path, 'rb') as f:
            model_package = pickle.load(f)
        
        self.model = model_package['model']
        self.scaler = model_package['scaler']
        self.label_encoders = model_package['label_encoders']
        self.feature_names = model_package['feature_names']
        self.model_version = model_package['model_version']
        
        print(f"   Model loaded (version {self.model_version})")
    
    def predict_intent_scores(self, customer_df):
        """
        Predict intent scores for new customers
        
        Parameters:
        - customer_df: DataFrame with customer features
        
        Returns:
        - DataFrame with intent scores
        """
        df = self.preprocess_features(customer_df)
        X = df[self.feature_names]
        
        intent_scores = self.model.predict_proba(X)[:, 1]
        
        df['intent_score'] = intent_scores
        df['intent_level'] = pd.cut(intent_scores, 
                                     bins=[0, 0.4, 0.7, 1.0], 
                                     labels=['low', 'medium', 'high'])
        
        return df[['global_customer_id', 'platform_id', 'intent_score', 'intent_level']]
    
    def batch_score_customers(self, output_table='intent_score_predictions'):
        """
        Score all customers in database and save to new table
        """
        print(f"\n🎯 Batch scoring all customers...")
        
        conn = sqlite3.connect(self.db_path)
        
        # Load all customers
        df_customers = self.create_training_dataset(lookback_days=90, label_window_days=0)
        df_customers = df_customers.drop('purchased_within_window', axis=1)
        
        # Predict
        predictions = self.predict_intent_scores(df_customers)
        predictions['scoring_timestamp'] = datetime.now()
        predictions['model_version'] = self.model_version
        
        # Save to database
        predictions.to_sql(output_table, conn, if_exists='replace', index=False)
        
        print(f"   Scored {len(predictions)} customers")
        print(f"   Saved to table: {output_table}")
        
        # Summary
        print(f"\n📊 Score Distribution:")
        print(predictions['intent_level'].value_counts())
        print(f"\n   Average Score: {predictions['intent_score'].mean():.4f}")
        print(f"   Median Score: {predictions['intent_score'].median():.4f}")
        
        conn.close()


def main():
    """
    Main training pipeline
    """
    print("="*70)
    print("  PatternOS Intent Prediction Model - Training Pipeline")
    print("="*70)
    
    # Initialize model
    model = IntentPredictionModel()
    
    # Step 1: Create training dataset
    df = model.create_training_dataset(lookback_days=90, label_window_days=7)
    
    # Step 2: Preprocess features
    df_processed = model.preprocess_features(df)
    
    # Step 3: Train model
    model.train_model(df_processed, model_type='xgboost')
    
    # Step 4: Evaluate model
    model.evaluate_model(save_plots=True)
    
    # Step 5: Save model
    model.save_model()
    
    # Step 6: Batch score all customers
    model.batch_score_customers()
    
    print("\n" + "="*70)
    print("  ✅ Training Complete!")
    print("="*70)
    print(f"\nModel artifacts saved:")
    print(f"  - Model: {MODEL_PATH}")
    print(f"  - ROC Curve: {ROC_CURVE_PATH}")
    print(f"  - Feature Importance: {FEATURE_IMPORTANCE_PATH}")
    print(f"\nPredictions saved to database table: intent_score_predictions")


if __name__ == "__main__":
    main()
