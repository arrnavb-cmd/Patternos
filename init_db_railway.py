import sqlite3
import random
import json
from datetime import datetime, timedelta

print("🚀 Initializing database...")

# First, let SQLAlchemy create the proper schema
from app.database import Base, engine
Base.metadata.create_all(bind=engine)
print("✅ SQLAlchemy tables created")

# Now seed with raw SQL
conn = sqlite3.connect("intent_intelligence.db")
c = conn.cursor()

# Check if data already exists
c.execute("SELECT COUNT(*) FROM intent_scores")
if c.fetchone()[0] > 0:
    print("✅ Database already seeded")
    conn.close()
    exit(0)

clients = ['zepto','blinkit','swiggy','bigbasket']
cats = ['Electronics','Fashion','Home & Kitchen','Beauty','Sports','Books']

# Seed intent_scores (matching SQLAlchemy schema)
print("📊 Seeding intent scores...")
d = []
for i in range(1,1001):
    s = round(random.uniform(0.1,0.99),2)
    level = 'high' if s>=0.7 else 'medium' if s>=0.4 else 'low'
    signals = json.dumps({
        'page_views': random.randint(1,50),
        'time_spent': random.randint(60,3600),
        'cart_adds': random.randint(0,10),
        'searches': random.randint(0,20)
    })
    d.append((
        random.choice(clients),
        f"user_{i:05d}",
        random.choice(cats),
        s,
        level,
        round(random.uniform(0.7,0.99),2),  # confidence
        signals,
        datetime.now()-timedelta(days=random.randint(0,30)),
        random.randint(3,20),  # signal_count
        datetime.now()
    ))

c.executemany("""INSERT INTO intent_scores 
    (client_id, user_id, category, intent_score, intent_level, confidence, 
     signals, last_activity, signal_count, scored_at)
    VALUES (?,?,?,?,?,?,?,?,?,?)""", d)

# Seed user_events
print("📊 Seeding user events...")
d = []
for i in range(2000):
    event_type = random.choice(['search','product_view','cart_add','purchase'])
    d.append((
        random.choice(clients),
        f"user_{random.randint(1,1000):05d}",
        event_type,
        random.choice(cats),
        f"prod_{random.randint(1000,9999)}" if event_type != 'search' else None,
        f"search_{random.randint(1,100)}" if event_type == 'search' else None,
        random.choice(['Mumbai','Delhi','Bangalore']),
        datetime.now()-timedelta(days=random.randint(0,30)),
        datetime.now()
    ))

c.executemany("""INSERT INTO user_events 
    (client_id, user_id, event_type, category, product_id, search_query, 
     location, timestamp, created_at)
    VALUES (?,?,?,?,?,?,?,?,?)""", d)

# Seed opportunities
print("📊 Seeding opportunities...")
d = []
for i, cat in enumerate(cats):
    for j, client in enumerate(clients):
        opp_id = f"OPP-{i*len(clients)+j+1:04d}"
        d.append((
            opp_id,
            client,
            cat,
            random.randint(50,500),
            round(random.uniform(0.6,0.95),2),
            random.randint(10000,500000),
            random.randint(5000,50000),
            round(random.uniform(0.05,0.15),2),
            random.choice(['critical','high','medium']),
            'active',
            json.dumps([f"Brand_{k}" for k in range(1,4)]),
            None,
            None,
            datetime.now(),
            datetime.now()+timedelta(days=random.randint(7,30))
        ))

c.executemany("""INSERT INTO opportunities 
    (opportunity_id, client_id, category, user_count, avg_intent_score, 
     revenue_estimate, campaign_price, estimated_conversion, urgency, status,
     suggested_brands, assigned_to, booked_by, detected_at, expires_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""", d)

conn.commit()

# Verify
c.execute("SELECT COUNT(*) FROM intent_scores WHERE client_id='zepto' AND intent_score>=0.7")
print(f"✅ Created {c.fetchone()[0]} high-intent users (zepto)")
conn.close()
print("✅ Database ready!")
