"""
PatternOS Data Warehouse ETL - Sample Data Loader
Loads CSV files from multiple platforms and creates unified customer identities
"""

import pandas as pd
import sqlite3
from datetime import datetime, timedelta
import hashlib
import json
import random
import numpy as np

# Configuration
DB_PATH = 'patternos_dw.db'

# Platform mapping
PLATFORM_CONFIG = {
    'Zepto_sample.csv': 'ZEPTO',
    'Swiggy_sample.csv': 'SWIGGY',
    'Amazon_sample.csv': 'AMAZON',
    'Nykaa_sample.csv': 'NYKAA',
    'Chumbak_sample.csv': 'CHUMBAK',
    'MMT_sample.csv': 'MMT',
    'CarWale_sample.csv': 'CARWALE'
}

# Category mapping for unified taxonomy
CATEGORY_MAPPING = {
    # Zepto & Swiggy - Food & Groceries
    'groceries': ('Groceries', 'Food & Beverages', 'FMCG'),
    'food': ('Food & Dining', 'Restaurant Food', 'Food Services'),
    'spices': ('Groceries', 'Spices & Seasonings', 'FMCG'),
    'dairy': ('Groceries', 'Dairy Products', 'FMCG'),
    'beverages': ('Groceries', 'Beverages', 'FMCG'),
    
    # Amazon - Electronics & Home
    'electronics': ('Electronics', 'Consumer Electronics', 'Electronics'),
    'home': ('Home & Kitchen', 'Home Appliances', 'Home'),
    'laptop': ('Electronics', 'Computers & Laptops', 'Electronics'),
    'smartphone': ('Electronics', 'Mobile Phones', 'Electronics'),
    
    # Nykaa - Beauty & Personal Care
    'skincare': ('Beauty & Personal Care', 'Skincare', 'Beauty'),
    'makeup': ('Beauty & Personal Care', 'Makeup & Cosmetics', 'Beauty'),
    'haircare': ('Beauty & Personal Care', 'Haircare', 'Beauty'),
    'fragrance': ('Beauty & Personal Care', 'Fragrances', 'Beauty'),
    
    # Chumbak - Home Decor
    'home_decor': ('Home & Living', 'Home Decor', 'Lifestyle'),
    'lifestyle': ('Lifestyle', 'Lifestyle Products', 'Lifestyle'),
    
    # MMT - Travel
    'travel': ('Travel & Hospitality', 'Travel Services', 'Travel'),
    'hotel': ('Travel & Hospitality', 'Hotel Bookings', 'Travel'),
    'flight': ('Travel & Hospitality', 'Flight Bookings', 'Travel'),
    
    # CarWale - Automotive
    'automotive': ('Automotive', 'Vehicles', 'Automotive'),
    'car': ('Automotive', 'Cars', 'Automotive')
}

def hash_pii(value):
    """Hash PII data for privacy"""
    if pd.isna(value):
        return None
    return hashlib.sha256(str(value).encode()).hexdigest()

def generate_global_customer_ids(all_customers, overlap_pct=0.3):
    """
    Create global customer IDs with simulated cross-platform overlap
    overlap_pct: percentage of customers that exist on multiple platforms
    """
    total_customers = len(all_customers)
    overlap_count = int(total_customers * overlap_pct)
    
    # Create global IDs
    global_ids = []
    used_global_ids = set()
    
    # First, assign unique IDs to non-overlapping customers
    for i in range(total_customers - overlap_count):
        global_id = f"GLOBAL{i+1:06d}"
        global_ids.append(global_id)
        used_global_ids.add(global_id)
    
    # Then, create overlapping customers (same global ID for multiple platforms)
    overlap_pool_size = overlap_count // 3  # Pool of global IDs to reuse
    overlap_pool = [f"GLOBAL{1000000+i:06d}" for i in range(overlap_pool_size)]
    
    for i in range(overlap_count):
        # Randomly pick from overlap pool
        global_id = random.choice(overlap_pool)
        global_ids.append(global_id)
    
    random.shuffle(global_ids)
    return global_ids

def infer_category_from_items(items_list, platform_id):
    """Infer category from items list"""
    if pd.isna(items_list):
        return None, None, None
    
    items_lower = items_list.lower()
    
    # Platform-specific inference
    if platform_id == 'ZEPTO':
        if any(x in items_lower for x in ['milk', 'curd', 'ghee', 'paneer']):
            return CATEGORY_MAPPING['dairy']
        elif any(x in items_lower for x in ['salt', 'spices', 'masala']):
            return CATEGORY_MAPPING['spices']
        else:
            return CATEGORY_MAPPING['groceries']
    
    elif platform_id == 'SWIGGY':
        return CATEGORY_MAPPING['food']
    
    elif platform_id == 'AMAZON':
        if any(x in items_lower for x in ['laptop', 'computer', 'macbook']):
            return CATEGORY_MAPPING['laptop']
        elif any(x in items_lower for x in ['phone', 'smartphone', 'mobile']):
            return CATEGORY_MAPPING['smartphone']
        elif any(x in items_lower for x in ['washing machine', 'refrigerator', 'ac']):
            return CATEGORY_MAPPING['home']
        else:
            return CATEGORY_MAPPING['electronics']
    
    elif platform_id == 'NYKAA':
        if 'skincare' in items_lower or any(x in items_lower for x in ['cream', 'serum', 'sunscreen', 'lotion']):
            return CATEGORY_MAPPING['skincare']
        elif 'haircare' in items_lower or any(x in items_lower for x in ['shampoo', 'conditioner', 'hair']):
            return CATEGORY_MAPPING['haircare']
        elif any(x in items_lower for x in ['lipstick', 'mascara', 'foundation', 'makeup']):
            return CATEGORY_MAPPING['makeup']
        else:
            return CATEGORY_MAPPING['skincare']
    
    elif platform_id == 'CHUMBAK':
        return CATEGORY_MAPPING['home_decor']
    
    elif platform_id == 'MMT':
        if 'hotel' in items_lower:
            return CATEGORY_MAPPING['hotel']
        elif 'flight' in items_lower:
            return CATEGORY_MAPPING['flight']
        else:
            return CATEGORY_MAPPING['travel']
    
    elif platform_id == 'CARWALE':
        return CATEGORY_MAPPING['automotive']
    
    return ('Unknown', 'Unknown', 'Unknown')

def load_platform_data(csv_path, platform_id):
    """Load and transform data from a platform CSV"""
    df = pd.read_csv(csv_path)
    
    # Standardize column names
    column_mapping = {
        'booking_date': 'date_of_order',
        'enquiry_date': 'date_of_order',
        'home_state': 'state',
        'home_city': 'city',
        'home_pincode': 'pincode',
        'travel_value': 'order_value',
        'purchase_value': 'order_value',
        'down_payment_value': 'discount_value',
        'repeat_purchase_flag': 'repeat_order',
        'preferred_payment_mode': 'payment_mode'
    }
    df.rename(columns=column_mapping, inplace=True)
    
    # Add platform ID
    df['platform_id'] = platform_id
    
    # Determine transaction type
    if platform_id == 'MMT':
        df['transaction_type'] = 'booking'
    elif platform_id == 'CARWALE':
        df['transaction_type'] = 'enquiry'
    else:
        df['transaction_type'] = 'order'
    
    # Parse dates
    df['transaction_datetime'] = pd.to_datetime(df['date_of_order'])
    
    # Handle repeat_order flag
    if 'repeat_order' in df.columns:
        df['is_repeat'] = df['repeat_order'].map({'Yes': True, 'No': False})
        if df['is_repeat'].isna().any():
            df['is_repeat'] = df['is_repeat'].fillna(False)
    else:
        df['is_repeat'] = False
    
    # Infer categories
    df[['category_l1', 'category_l2', 'unified_category']] = df.apply(
        lambda row: pd.Series(infer_category_from_items(row['items_list'], platform_id)),
        axis=1
    )
    
    return df

def create_customer_identities(all_platform_data):
    """
    Create unified customer identities with cross-platform mapping
    Simulates 30% of customers having accounts on multiple platforms
    """
    # Collect all unique platform customers
    all_customers = []
    for platform_id, df in all_platform_data.items():
        for customer_id in df['customer_id'].unique():
            all_customers.append({
                'platform_id': platform_id,
                'platform_customer_id': customer_id
            })
    
    # Generate global IDs with overlap
    global_ids = generate_global_customer_ids(all_customers, overlap_pct=0.3)
    
    # Create identity mapping
    identity_map = []
    for i, customer in enumerate(all_customers):
        identity_map.append({
            'identity_id': f"ID{i+1:08d}",
            'global_customer_id': global_ids[i],
            'platform_id': customer['platform_id'],
            'platform_customer_id': customer['platform_customer_id'],
            'mapping_method': 'deterministic' if global_ids[i].startswith('GLOBAL10') else 'simulated',
            'mapping_confidence': 1.0 if global_ids[i].startswith('GLOBAL10') else 0.95
        })
    
    return pd.DataFrame(identity_map)

def create_dim_customer(identity_df, all_platform_data):
    """Create unified customer dimension"""
    customers = []
    
    for global_id in identity_df['global_customer_id'].unique():
        # Get all platform identities for this customer
        identities = identity_df[identity_df['global_customer_id'] == global_id]
        
        # Aggregate data from all platforms
        customer_data = []
        for _, identity in identities.iterrows():
            platform_df = all_platform_data[identity['platform_id']]
            platform_customer = platform_df[platform_df['customer_id'] == identity['platform_customer_id']]
            if not platform_customer.empty:
                customer_data.append(platform_customer.iloc[0])
        
        if not customer_data:
            continue
        
        # Take most recent data
        primary_data = customer_data[0]
        
        # Calculate aggregates
        total_orders = sum(len(all_platform_data[identity['platform_id']][
            all_platform_data[identity['platform_id']]['customer_id'] == identity['platform_customer_id']
        ]) for _, identity in identities.iterrows())
        
        customers.append({
            'global_customer_id': global_id,
            'first_seen_date': datetime.now() - timedelta(days=random.randint(30, 730)),
            'last_seen_date': datetime.now() - timedelta(days=random.randint(0, 30)),
            'primary_age_group': primary_data['age_group'],
            'primary_state': primary_data['state'],
            'primary_city': primary_data['city'],
            'primary_pincode': primary_data['pincode'],
            'total_orders': total_orders,
            'total_platforms_used': len(identities),
            'lifetime_value': 0,  # Will be calculated later
            'customer_segment': 'Active'
        })
    
    return pd.DataFrame(customers)

def create_fact_transactions(all_platform_data, identity_df):
    """Create unified transaction fact table"""
    transactions = []
    transaction_lines = []
    
    for platform_id, df in all_platform_data.items():
        for idx, row in df.iterrows():
            # Get global customer ID
            identity = identity_df[
                (identity_df['platform_id'] == platform_id) &
                (identity_df['platform_customer_id'] == row['customer_id'])
            ]
            
            if identity.empty:
                continue
            
            global_customer_id = identity.iloc[0]['global_customer_id']
            
            transaction_id = f"{platform_id}_{row['customer_id']}_{idx}"
            
            # Create transaction
            transactions.append({
                'transaction_id': transaction_id,
                'platform_id': platform_id,
                'global_customer_id': global_customer_id,
                'platform_customer_id': row['customer_id'],
                'transaction_type': row['transaction_type'],
                'transaction_datetime': row['transaction_datetime'],
                'total_value': row['order_value'],
                'discount_value': row.get('discount_value', 0),
                'items_count': row['items_purchased_count'],
                'items_list': row['items_list'],
                'is_repeat': row['is_repeat'],
                'payment_mode': row['payment_mode'],
                'category_l1': row['category_l1'],
                'category_l2': row['category_l2'],
                'unified_category': row['unified_category']
            })
            
            # Create transaction lines (parse items)
            if pd.notna(row['items_list']):
                items = row['items_list'].split(', ')
                for item_idx, item in enumerate(items):
                    transaction_lines.append({
                        'transaction_id': transaction_id,
                        'line_number': item_idx + 1,
                        'item_name': item,
                        'quantity': 1,
                        'category_l1': row['category_l1'],
                        'category_l2': row['category_l2']
                    })
    
    return pd.DataFrame(transactions), pd.DataFrame(transaction_lines)

def calculate_rfm_features(transactions_df, identity_df):
    """Calculate RFM features for each customer"""
    rfm_features = []
    reference_date = datetime.now().date()
    
    for global_id in transactions_df['global_customer_id'].unique():
        customer_trans = transactions_df[transactions_df['global_customer_id'] == global_id].copy()
        customer_trans['transaction_date'] = pd.to_datetime(customer_trans['transaction_datetime']).dt.date
        
        # Overall RFM (cross-platform)
        recency = (reference_date - customer_trans['transaction_date'].max()).days
        frequency_30d = len(customer_trans[customer_trans['transaction_date'] >= reference_date - timedelta(days=30)])
        frequency_90d = len(customer_trans[customer_trans['transaction_date'] >= reference_date - timedelta(days=90)])
        monetary_30d = customer_trans[customer_trans['transaction_date'] >= reference_date - timedelta(days=30)]['total_value'].sum()
        monetary_90d = customer_trans[customer_trans['transaction_date'] >= reference_date - timedelta(days=90)]['total_value'].sum()
        
        rfm_features.append({
            'global_customer_id': global_id,
            'platform_id': None,  # Cross-platform
            'reference_date': reference_date,
            'recency_days': recency,
            'frequency_30d': frequency_30d,
            'frequency_90d': frequency_90d,
            'monetary_30d': float(monetary_30d),
            'monetary_90d': float(monetary_90d),
            'aov_30d': float(monetary_30d / frequency_30d) if frequency_30d > 0 else 0,
            'rfm_score': calculate_rfm_score(recency, frequency_90d, monetary_90d)
        })
        
        # Per-platform RFM
        for platform_id in customer_trans['platform_id'].unique():
            platform_trans = customer_trans[customer_trans['platform_id'] == platform_id]
            
            p_recency = (reference_date - platform_trans['transaction_date'].max()).days
            p_freq_30d = len(platform_trans[platform_trans['transaction_date'] >= reference_date - timedelta(days=30)])
            p_freq_90d = len(platform_trans[platform_trans['transaction_date'] >= reference_date - timedelta(days=90)])
            p_mon_30d = platform_trans[platform_trans['transaction_date'] >= reference_date - timedelta(days=30)]['total_value'].sum()
            p_mon_90d = platform_trans[platform_trans['transaction_date'] >= reference_date - timedelta(days=90)]['total_value'].sum()
            
            rfm_features.append({
                'global_customer_id': global_id,
                'platform_id': platform_id,
                'reference_date': reference_date,
                'recency_days': p_recency,
                'frequency_30d': p_freq_30d,
                'frequency_90d': p_freq_90d,
                'monetary_30d': float(p_mon_30d),
                'monetary_90d': float(p_mon_90d),
                'aov_30d': float(p_mon_30d / p_freq_30d) if p_freq_30d > 0 else 0,
                'rfm_score': calculate_rfm_score(p_recency, p_freq_90d, p_mon_90d)
            })
    
    return pd.DataFrame(rfm_features)

def calculate_rfm_score(recency, frequency, monetary):
    """Calculate RFM score (1-5 for each component)"""
    # Simple scoring logic
    r_score = 5 if recency <= 7 else (4 if recency <= 30 else (3 if recency <= 90 else 2))
    f_score = 5 if frequency >= 10 else (4 if frequency >= 5 else (3 if frequency >= 2 else 2))
    m_score = 5 if monetary >= 10000 else (4 if monetary >= 5000 else (3 if monetary >= 1000 else 2))
    
    return f"{r_score}{f_score}{m_score}"

def generate_simulated_intent_scores(customers_df, rfm_df, transactions_df):
    """Generate simulated intent scores based on RFM and behavioral patterns"""
    intent_scores = []
    
    for _, customer in customers_df.iterrows():
        global_id = customer['global_customer_id']
        
        # Get customer's RFM features
        customer_rfm = rfm_df[
            (rfm_df['global_customer_id'] == global_id) &
            (rfm_df['platform_id'].isna())
        ]
        
        if customer_rfm.empty:
            continue
        
        rfm_row = customer_rfm.iloc[0]
        
        # Calculate base intent score from RFM
        recency_score = 1.0 - min(rfm_row['recency_days'] / 180.0, 1.0)
        frequency_score = min(rfm_row['frequency_90d'] / 10.0, 1.0)
        monetary_score = min(rfm_row['monetary_90d'] / 50000.0, 1.0)
        
        base_intent = (recency_score * 0.4 + frequency_score * 0.3 + monetary_score * 0.3)
        
        # Add randomness
        intent_score = min(max(base_intent + random.uniform(-0.2, 0.2), 0.0), 1.0)
        
        # Determine intent level
        if intent_score >= 0.7:
            intent_level = 'high'
        elif intent_score >= 0.4:
            intent_level = 'medium'
        else:
            intent_level = 'low'
        
        # Generate for each platform the customer uses
        customer_platforms = transactions_df[transactions_df['global_customer_id'] == global_id]['platform_id'].unique()
        
        for platform_id in customer_platforms:
            intent_scores.append({
                'global_customer_id': global_id,
                'platform_id': platform_id,
                'scoring_timestamp': datetime.now(),
                'intent_score': round(intent_score, 4),
                'intent_level': intent_level,
                'purchase_probability_7d': round(intent_score * 0.8, 4),
                'purchase_probability_30d': round(intent_score * 0.9, 4),
                'model_version': 'v1.0_simulated',
                'model_type': 'rfm_based'
            })
    
    return pd.DataFrame(intent_scores)

def main():
    """Main ETL execution"""
    print("Starting PatternOS Data Warehouse ETL...")
    
    # Load all platform data
    print("\n1. Loading platform CSV files...")
    all_platform_data = {}
    for csv_file, platform_id in PLATFORM_CONFIG.items():
        file_path = f'data/csv_samples/{csv_file}'
        print(f"  - Loading {csv_file} ({platform_id})...")
        df = load_platform_data(file_path, platform_id)
        all_platform_data[platform_id] = df
        print(f"    Loaded {len(df)} records")
    
    # Create customer identities with cross-platform mapping
    print("\n2. Creating unified customer identities...")
    identity_df = create_customer_identities(all_platform_data)
    print(f"  - Created {len(identity_df)} identity mappings")
    print(f"  - Unique global customers: {identity_df['global_customer_id'].nunique()}")
    
    # Analyze overlap
    overlap_customers = identity_df.groupby('global_customer_id').size()
    multi_platform = overlap_customers[overlap_customers > 1]
    print(f"  - Customers on multiple platforms: {len(multi_platform)} ({len(multi_platform)/identity_df['global_customer_id'].nunique()*100:.1f}%)")
    
    # Create customer dimension
    print("\n3. Creating customer dimension...")
    customers_df = create_dim_customer(identity_df, all_platform_data)
    print(f"  - Created {len(customers_df)} unified customers")
    
    # Create transaction facts
    print("\n4. Creating transaction facts...")
    transactions_df, transaction_lines_df = create_fact_transactions(all_platform_data, identity_df)
    print(f"  - Created {len(transactions_df)} transactions")
    print(f"  - Created {len(transaction_lines_df)} transaction line items")
    
    # Calculate RFM features
    print("\n5. Calculating RFM features...")
    rfm_df = calculate_rfm_features(transactions_df, identity_df)
    print(f"  - Created {len(rfm_df)} RFM feature records")
    
    # Generate intent scores
    print("\n6. Generating intent scores...")
    intent_df = generate_simulated_intent_scores(customers_df, rfm_df, transactions_df)
    print(f"  - Generated {len(intent_df)} intent scores")
    print(f"  - High intent users: {len(intent_df[intent_df['intent_level'] == 'high'])}")
    print(f"  - Medium intent users: {len(intent_df[intent_df['intent_level'] == 'medium'])}")
    print(f"  - Low intent users: {len(intent_df[intent_df['intent_level'] == 'low'])}")
    
    # Save to database
    print("\n7. Saving to SQLite database...")
    conn = sqlite3.connect(DB_PATH)
    
    # Save all dataframes
    customers_df.to_sql('dim_customer', conn, if_exists='replace', index=False)
    identity_df.to_sql('dim_customer_identity', conn, if_exists='replace', index=False)
    transactions_df.to_sql('fact_transaction', conn, if_exists='replace', index=False)
    transaction_lines_df.to_sql('fact_transaction_line', conn, if_exists='replace', index=False)
    rfm_df.to_sql('feat_customer_rfm', conn, if_exists='replace', index=False)
    intent_df.to_sql('intent_score', conn, if_exists='replace', index=False)
    
    conn.close()
    print(f"  - Database saved to {DB_PATH}")
    
    print("\n✅ ETL Complete!")
    print(f"\nDatabase Summary:")
    print(f"  - Total Customers: {len(customers_df)}")
    print(f"  - Total Transactions: {len(transactions_df)}")
    print(f"  - Total Revenue: ₹{transactions_df['total_value'].sum():,.0f}")
    print(f"  - High Intent Users: {len(intent_df[intent_df['intent_level'] == 'high'])}")

if __name__ == "__main__":
    main()
