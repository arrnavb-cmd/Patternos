import sqlite3
import random
from datetime import datetime, timedelta

print("🔧 Initializing database...")

# Create connection
conn = sqlite3.connect('intent_intelligence.db')
cursor = conn.cursor()

# Create all tables
cursor.execute('''CREATE TABLE IF NOT EXISTS intent_scores (
    id INTEGER PRIMARY KEY,
    client_id VARCHAR,
    user_id VARCHAR,
    category VARCHAR,
    intent_score FLOAT,
    intent_level VARCHAR,
    confidence FLOAT,
    signals TEXT,
    last_activity DATETIME,
    signal_count INTEGER,
    scored_at DATETIME
)''')

cursor.execute('''CREATE TABLE IF NOT EXISTS purchases (
    id INTEGER PRIMARY KEY,
    user_id VARCHAR,
    product_id VARCHAR,
    total_amount FLOAT,
    attributed_to_ad INTEGER,
    timestamp DATETIME
)''')

cursor.execute('''CREATE TABLE IF NOT EXISTS opportunities (
    id INTEGER PRIMARY KEY,
    client_id VARCHAR,
    category VARCHAR,
    user_count INTEGER,
    avg_intent_score FLOAT,
    revenue_estimate INTEGER
)''')

cursor.execute('''CREATE TABLE IF NOT EXISTS campaigns (
    id INTEGER PRIMARY KEY,
    name VARCHAR,
    status VARCHAR,
    budget FLOAT,
    spent FLOAT
)''')

cursor.execute('''CREATE TABLE IF NOT EXISTS user_events (
    id INTEGER PRIMARY KEY,
    client_id VARCHAR,
    user_id VARCHAR,
    event_type VARCHAR,
    category VARCHAR,
    product_id VARCHAR,
    timestamp DATETIME
)''')

# Generate seed data
categories = ['electronics', 'fashion', 'groceries', 'beauty', 'sports']

print("📊 Generating seed data...")
# Generate 1000 intent scores
for i in range(1000):
    cursor.execute('''INSERT INTO intent_scores VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
        (i+1, 'zepto', f'user_{str(i+1).zfill(6)}', random.choice(categories),
         random.uniform(0.3, 0.95), 'high', random.uniform(0.7, 0.99), '{}',
         (datetime.now() - timedelta(days=random.randint(0, 30))).isoformat(),
         random.randint(5, 50), datetime.now().isoformat()))

# Generate purchases
for i in range(500):
    cursor.execute('''INSERT INTO purchases VALUES (?, ?, ?, ?, ?, ?)''',
        (i+1, f'user_{str(random.randint(1,1000)).zfill(6)}', f'prod_{i}',
         random.uniform(100, 50000), random.randint(0,1),
         (datetime.now() - timedelta(days=random.randint(0, 60))).isoformat()))

conn.commit()
conn.close()

print("✅ Database initialized successfully!")
