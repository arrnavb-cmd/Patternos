-- ============================================================================
-- PatternOS Analytics Query Library
-- Sample queries demonstrating cross-platform intelligence capabilities
-- ============================================================================

-- Dashboard Summary Metrics (matches your Intent Intelligence screenshot)
SELECT 
    -- Total users tracked
    (SELECT COUNT(DISTINCT global_customer_id) FROM dim_customer) AS total_users_tracked,
    
    -- Total events (transactions)
    (SELECT COUNT(*) FROM fact_transaction) AS total_events,
    
    -- Total intent scores calculated
    (SELECT COUNT(DISTINCT global_customer_id) FROM intent_score 
     WHERE scoring_timestamp >= DATE('now', '-24 hours')) AS intent_scores,
    
    -- High intent users
    (SELECT COUNT(DISTINCT global_customer_id) FROM intent_score 
     WHERE intent_level = 'high' 
     AND scoring_timestamp >= DATE('now', '-24 hours')) AS high_intent_users,
    
    -- Intent level distribution
    (SELECT COUNT(DISTINCT global_customer_id) FROM intent_score 
     WHERE intent_level = 'high') AS high_intent_total,
    (SELECT COUNT(DISTINCT global_customer_id) FROM intent_score 
     WHERE intent_level = 'medium') AS medium_intent_total,
    (SELECT COUNT(DISTINCT global_customer_id) FROM intent_score 
     WHERE intent_level = 'low') AS low_intent_total;


-- High Intent Users for Campaign Targeting
SELECT 
    i.global_customer_id,
    c.primary_city,
    i.platform_id,
    i.intent_score,
    i.purchase_probability_7d,
    rfm.monetary_30d AS recent_value
FROM intent_score i
JOIN dim_customer c ON i.global_customer_id = c.global_customer_id
LEFT JOIN feat_customer_rfm rfm 
    ON i.global_customer_id = rfm.global_customer_id 
    AND i.platform_id = rfm.platform_id
WHERE i.intent_level = 'high'
    AND c.consent_marketing = 1
ORDER BY i.intent_score DESC
LIMIT 1000;


-- Cross-Platform Customer Journey
SELECT 
    c.global_customer_id,
    c.total_platforms_used,
    GROUP_CONCAT(DISTINCT p.platform_name) AS platforms,
    COUNT(DISTINCT t.transaction_id) AS total_orders,
    SUM(t.total_value) AS lifetime_value,
    MAX(i.intent_score) AS max_intent_score
FROM dim_customer c
JOIN dim_customer_identity ci ON c.global_customer_id = ci.global_customer_id
JOIN fact_transaction t ON ci.platform_customer_id = t.platform_customer_id
JOIN dim_platform p ON t.platform_id = p.platform_id
LEFT JOIN intent_score i ON c.global_customer_id = i.global_customer_id
WHERE c.total_platforms_used >= 2
GROUP BY c.global_customer_id
ORDER BY lifetime_value DESC
LIMIT 100;
