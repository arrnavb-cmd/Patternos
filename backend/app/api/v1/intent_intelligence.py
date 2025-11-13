from fastapi import APIRouter, Query
import json
from typing import Optional

router = APIRouter()

def load_intent_data():
    """Load 30K intent database"""
    try:
        with open('intent_database_30k.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def load_purchase_data():
    """Load 100K purchase database"""
    try:
        with open('purchase_database_100k.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

@router.get("/stats")
async def get_intent_stats(clientId: str = Query('zepto')):
    """Get intent statistics - matches IntentDashboard.jsx expectations"""
    
    users = load_intent_data()
    
    high = [u for u in users if u['intent_level'] == 'high']
    medium = [u for u in users if u['intent_level'] == 'medium']
    low = [u for u in users if u['intent_level'] == 'low']
    
    # Total events across all users
    total_events = sum(u['events'] for u in users)
    
    # Intent scores
    total_scores = sum(u['events'] for u in high)
    
    return {
        'totalUsers': len(users),
        'totalEvents': total_events,
        'totalScores': total_scores,
        'intentDistribution': {
            'high': len(high),
            'medium': len(medium),
            'low': len(low),
            'minimal': 0
        }
    }

@router.get("/high-intent-users")
async def get_high_intent_users(min_events: int = Query(20)):
    """Get high intent users (ready to purchase)"""
    
    users = load_intent_data()
    
    # Filter high intent users with minimum events
    high_intent = [u for u in users if u['intent_level'] == 'high' and u['events'] >= min_events]
    
    return {
        'users': high_intent,
        'total_count': len(high_intent)
    }

@router.get("/opportunities/by-category")
async def get_opportunities_by_category(
    clientId: str = Query('zepto'),
    minScore: float = Query(0.7)
):
    """Get revenue opportunities by category with suggested brands"""
    
    users = load_intent_data()
    
    # Filter high intent users
    high_intent = [u for u in users if u['intent_level'] == 'high']
    
    # Mapping of categories to relevant brands
    category_brands = {
        'footwear': ['Nike', 'Adidas', 'Puma'],
        'apparel': ['Nike', 'Adidas', 'H&M'],
        'electronics': ['Samsung', 'Apple', 'Sony'],
        'beauty': ['Lakmé', 'L\'Oréal', 'Maybelline'],
        'groceries': ['Amul', 'Britannia', 'ITC'],
        'sports': ['Nike', 'Adidas', 'Puma']
    }
    
    # Group by category
    categories = {}
    
    for user in high_intent:
        cat = user['category']
        if cat not in categories:
            categories[cat] = {
                'category': cat,
                'userCount': 0,
                'revenueEstimate': 0,
                'suggestedBrands': category_brands.get(cat, ['Nike', 'Adidas', 'Puma']),
                'totalEvents': 0
            }
        
        categories[cat]['userCount'] += 1
        categories[cat]['revenueEstimate'] += user['estimated_spend_inr']
        categories[cat]['totalEvents'] += user['events']
    
    # Calculate average intent scores based on events (normalize to 0.7-0.95 range)
    opportunities = []
    for cat, data in categories.items():
        avg_events = data['totalEvents'] / data['userCount']
        # Normalize: 15-50 events maps to 0.70-0.95 score
        normalized_score = 0.70 + (min(avg_events, 50) - 15) * (0.25 / 35)
        normalized_score = max(0.70, min(0.95, normalized_score))
        data['avgIntentScore'] = round(normalized_score, 2)
        del data['totalEvents']
        opportunities.append(data)
    
    # Sort by revenue estimate
    opportunities.sort(key=lambda x: x['revenueEstimate'], reverse=True)
    
    return {
        'opportunities': opportunities,
        'total_categories': len(categories)
    }


