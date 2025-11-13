"""
Intent Intelligence API Routes
Captures user behavior and calculates purchase intent scores
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, timedelta
from collections import defaultdict

router = APIRouter()

# In-memory storage (replace with Redis/MongoDB in production)
user_events = defaultdict(list)  # {client_id:user_id: [events]}
intent_scores = {}  # {client_id:user_id:category: score}

# ============================================================================
# DATA MODELS
# ============================================================================

class UserEvent(BaseModel):
    userId: str
    eventType: str  # search, product_view, cart_add, wishlist_add, purchase
    category: str
    productId: Optional[str] = None
    searchQuery: Optional[str] = None
    location: Optional[str] = None
    timestamp: Optional[str] = None

class BulkEventsRequest(BaseModel):
    clientId: str
    events: List[UserEvent]

class IntentScoreRequest(BaseModel):
    clientId: str
    userId: str
    category: str

# ============================================================================
# INTENT SCORING ENGINE
# ============================================================================

SCORING_WEIGHTS = {
    'search_frequency': 0.35,
    'cart_wishlist': 0.30,
    'product_views': 0.20,
    'recency': 0.15
}

def calculate_intent_score(client_id: str, user_id: str, category: str):
    """Calculate intent score based on user behavior"""
    
    key = f"{client_id}:{user_id}"
    events = user_events.get(key, [])
    
    if not events:
        return None
    
    # Filter by category and last 30 days
    cutoff = datetime.now() - timedelta(days=30)
    relevant_events = [
        e for e in events 
        if e['category'] == category and 
        datetime.fromisoformat(e['timestamp'].replace('Z', '+00:00')) >= cutoff
    ]
    
    if len(relevant_events) < 2:
        return None
    
    # Calculate signals
    signals = []
    total_score = 0
    
    # Signal 1: Search Frequency
    search_events = [e for e in relevant_events if e['eventType'] == 'search']
    if search_events:
        value = min(len(search_events) / 3.0, 1.0)
        signals.append({
            'type': 'search_frequency',
            'value': value,
            'weight': SCORING_WEIGHTS['search_frequency'],
            'count': len(search_events)
        })
        total_score += value * SCORING_WEIGHTS['search_frequency']
    
    # Signal 2: Cart/Wishlist
    cart_events = [e for e in relevant_events if e['eventType'] in ['cart_add', 'wishlist_add']]
    if cart_events:
        signals.append({
            'type': 'cart_wishlist',
            'value': 1.0,
            'weight': SCORING_WEIGHTS['cart_wishlist'],
            'count': len(cart_events)
        })
        total_score += SCORING_WEIGHTS['cart_wishlist']
    
    # Signal 3: Product Views
    view_events = [e for e in relevant_events if e['eventType'] == 'product_view']
    if view_events:
        value = min(len(view_events) / 2.0, 1.0)
        signals.append({
            'type': 'product_views',
            'value': value,
            'weight': SCORING_WEIGHTS['product_views'],
            'count': len(view_events)
        })
        total_score += value * SCORING_WEIGHTS['product_views']
    
    # Signal 4: Recency
    last_event = max(relevant_events, key=lambda e: e['timestamp'])
    hours_ago = (datetime.now() - datetime.fromisoformat(last_event['timestamp'].replace('Z', '+00:00'))).total_seconds() / 3600
    
    if hours_ago < 24:
        recency_value = 1.0
    elif hours_ago < 48:
        recency_value = 0.8
    elif hours_ago < 168:
        recency_value = 0.6
    else:
        recency_value = 0.4
    
    signals.append({
        'type': 'recency',
        'value': recency_value,
        'weight': SCORING_WEIGHTS['recency'],
        'hours_ago': round(hours_ago, 2)
    })
    total_score += recency_value * SCORING_WEIGHTS['recency']
    
    # Apply recency multiplier
    recency_multiplier = 1.0 if hours_ago < 48 else (0.7 if hours_ago < 168 else 0.5)
    final_score = min(total_score * recency_multiplier, 1.0)
    
    # Classify intent level
    if final_score >= 0.70:
        intent_level = 'high'
    elif final_score >= 0.50:
        intent_level = 'medium'
    elif final_score >= 0.30:
        intent_level = 'low'
    else:
        intent_level = 'minimal'
    
    score_data = {
        'clientId': client_id,
        'userId': user_id,
        'category': category,
        'intentScore': round(final_score, 4),
        'intentLevel': intent_level,
        'confidence': round(min(len(signals) / 4.0, 1.0), 4),
        'signals': signals,
        'lastActivity': last_event['timestamp'],
        'signalCount': len(signals),
        'scoredAt': datetime.now().isoformat()
    }
    
    # Store score
    score_key = f"{client_id}:{user_id}:{category}"
    intent_scores[score_key] = score_data
    
    return score_data

# ============================================================================
# API ENDPOINTS
# ============================================================================

@router.post("/ingest")
async def ingest_event(event: UserEvent, clientId: str = "zepto"):
    """Ingest single user event"""
    
    key = f"{clientId}:{event.userId}"
    
    event_data = {
        'eventId': f"evt_{datetime.now().timestamp()}",
        'userId': event.userId,
        'eventType': event.eventType,
        'category': event.category,
        'productId': event.productId,
        'searchQuery': event.searchQuery,
        'location': event.location,
        'timestamp': event.timestamp or datetime.now().isoformat()
    }
    
    user_events[key].append(event_data)
    
    # Trigger intent calculation asynchronously
    calculate_intent_score(clientId, event.userId, event.category)
    
    return {
        'message': 'Event ingested successfully',
        'eventId': event_data['eventId']
    }

@router.post("/ingest/bulk")
async def bulk_ingest(request: BulkEventsRequest):
    """Bulk ingest events"""
    
    processed = 0
    for event in request.events:
        key = f"{request.clientId}:{event.userId}"
        
        event_data = {
            'eventId': f"evt_{datetime.now().timestamp()}_{processed}",
            'userId': event.userId,
            'eventType': event.eventType,
            'category': event.category,
            'productId': event.productId,
            'searchQuery': event.searchQuery,
            'location': event.location,
            'timestamp': event.timestamp or datetime.now().isoformat()
        }
        
        user_events[key].append(event_data)
        processed += 1
    
    return {
        'message': 'Bulk events ingested',
        'processedCount': processed
    }

@router.post("/score")
async def score_intent(request: IntentScoreRequest):
    """Calculate intent score for user in category"""
    
    score = calculate_intent_score(request.clientId, request.userId, request.category)
    
    if not score:
        raise HTTPException(
            status_code=404,
            detail="Insufficient signals to calculate intent score (minimum 2 required)"
        )
    
    return score

@router.get("/user/{userId}")
async def get_user_profile(userId: str, clientId: str = "zepto"):
    """Get user intent profile across all categories"""
    
    key = f"{clientId}:{userId}"
    events = user_events.get(key, [])
    
    if not events:
        return {
            'userId': userId,
            'clientId': clientId,
            'categories': {},
            'totalEvents': 0
        }
    
    # Get unique categories
    categories = list(set(e['category'] for e in events))
    
    category_scores = {}
    for category in categories:
        score = calculate_intent_score(clientId, userId, category)
        if score:
            category_scores[category] = score
    
    return {
        'userId': userId,
        'clientId': clientId,
        'categories': category_scores,
        'totalEvents': len(events),
        'lastActivity': events[-1]['timestamp'] if events else None
    }

@router.get("/high-intent/{category}")
async def get_high_intent_users(
    category: str,
    clientId: str = "zepto",
    minScore: float = 0.7,
    limit: int = 100
):
    """Get users with high intent for a category"""
    
    high_intent = []
    
    for score_key, score in intent_scores.items():
        parts = score_key.split(':')
        if len(parts) == 3 and parts[0] == clientId and parts[2] == category:
            if score['intentScore'] >= minScore:
                high_intent.append({
                    'userId': score['userId'],
                    'intentScore': score['intentScore'],
                    'intentLevel': score['intentLevel'],
                    'lastActivity': score['lastActivity']
                })
    
    # Sort by score descending
    high_intent.sort(key=lambda x: x['intentScore'], reverse=True)
    
    return {
        'category': category,
        'minIntentScore': minScore,
        'count': len(high_intent[:limit]),
        'users': high_intent[:limit]
    }

@router.get("/stats")
async def get_stats(clientId: str = "zepto"):
    """Get intent intelligence statistics"""
    
    total_users = len(set(key.split(':')[1] for key in user_events.keys() if key.startswith(clientId)))
    total_events = sum(len(events) for key, events in user_events.items() if key.startswith(clientId))
    total_scores = len([k for k in intent_scores.keys() if k.startswith(clientId)])
    
    # Count by intent level
    intent_distribution = {'high': 0, 'medium': 0, 'low': 0, 'minimal': 0}
    for key, score in intent_scores.items():
        if key.startswith(clientId):
            intent_distribution[score['intentLevel']] += 1
    
    return {
        'clientId': clientId,
        'totalUsers': total_users,
        'totalEvents': total_events,
        'totalScores': total_scores,
        'intentDistribution': intent_distribution
    }
