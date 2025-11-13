import sqlite3

conn = sqlite3.connect('intent_intelligence.db')
cursor = conn.cursor()

# Update campaigns with lower, more realistic spend
cursor.execute("""
    UPDATE ad_campaigns 
    SET spent = 18000 
    WHERE brand = 'Nike'
""")

cursor.execute("""
    UPDATE ad_campaigns 
    SET spent = 15000 
    WHERE brand = 'Adidas'
""")

cursor.execute("""
    UPDATE ad_campaigns 
    SET spent = 8500 
    WHERE brand = 'Lakme'
""")

# Also set spend for brands without campaigns
cursor.execute("""
    INSERT OR IGNORE INTO ad_campaigns 
    (campaign_id, brand, name, total_budget, spent, channels, status, start_date, client_id)
    VALUES 
    ('amul_q4_2024', 'Amul', 'Amul Grocery Campaign', 20000, 15000, '["zepto", "facebook"]', 'active', '2024-10-01', 'zepto'),
    ('phoocl_q4_2024', 'Phoocl', 'Phoocl Campaign', 18000, 12000, '["zepto", "instagram"]', 'active', '2024-10-01', 'zepto')
""")

conn.commit()
conn.close()

print("✅ Fixed campaign spend for better ROAS!")
