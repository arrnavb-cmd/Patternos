import sqlite3
import random
from datetime import datetime, timedelta

conn = sqlite3.connect('intent_intelligence.db')
cursor = conn.cursor()

print("Generating 50,000 intent scores...")
categories = ['footwear', 'apparel', 'beauty', 'groceries', 'electronics', 'sports']

for i in range(50000):
    user_id = f'user_{str(i+1).zfill(5)}'
    category = random.choice(categories)
    
    # 30% high intent
    rand = random.random()
    if rand < 0.30:
        intent_score = random.uniform(0.70, 0.95)
        intent_level = 'high'
    elif rand < 0.60:
        intent_score = random.uniform(0.50, 0.69)
        intent_level = 'medium'
    elif rand < 0.85:
        intent_score = random.uniform(0.30, 0.49)
        intent_level = 'low'
    else:
        intent_score = random.uniform(0.10, 0.29)
        intent_level = 'minimal'
    
    cursor.execute('''
        INSERT INTO intent_scores
        (user_id, category, intent_score, intent_level, last_activity, client_id)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        user_id,
        category,
        round(intent_score, 2),
        intent_level,
        (datetime.now() - timedelta(hours=random.randint(1, 720))).isoformat(),
        'zepto'
    ))
    
    if (i + 1) % 10000 == 0:
        print(f"  Progress: {i+1:,}/50,000")
        conn.commit()

conn.commit()
conn.close()

print("✅ Intent scores generated!")
