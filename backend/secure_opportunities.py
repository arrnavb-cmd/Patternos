"""
Intent Opportunity Detection & Alert System
For Zepto Brand Managers (Aggregator Side)
"""

from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, timedelta
from collections import defaultdict

router = APIRouter()

# Storage
opportunities = []  # Live opportunities
opportunity_actions = defaultdict(list)  # Brand manager actions

class Opportunity(BaseModel):
    id: str
    category: str
    userCount: int
    avgIntentScore: float
    revenueEstimate: int
    estimatedConversion: float
    timeWindow: str
    urgency: str
    detectedAt: str
    expiresAt: str
    status: str  # active, assigned, booked, expired
    suggestedBrands: List[str]
    assignedTo: Optional[str] = None
    bookedBy: Optional[str] = None

class OpportunityAction(BaseModel):
    opportunityId: str
    brandName: str
    action: str  # contacted, proposal_sent, negotiating, booked, rejected
    notes: str
    timestamp: str

# ============================================================================
# OPPORTUNITY DETECTION
# ============================================================================

def detect_opportunities():
    """Scan intent data and detect revenue opportunities"""
    from secure_intent import intent_scores, user_events
    
    opportunities_found = []
    
    # Analyze each category
    categories = ['footwear', 'apparel', 'electronics', 'groceries', 'beauty', 'sports']
    
    for category in categories:
        # Get high-intent users for this category
        high_intent_users = []
        
        for key, score in intent_scores.items():
            parts = key.split(':')
            if len(parts) == 3 and parts[2] == category:
                if score['intentScore'] >= 0.7:
                    high_intent_users.append(score)
        
        if len(high_intent_users) < 1000:  # Minimum threshold
            continue
        
        # Calculate metrics
        user_count = len(high_intent_users)
        avg_score = sum(u['intentScore'] for u in high_intent_users) / user_count
        
        # Revenue estimates (conservative)
        # Assume: ₹2,000 average order value, 4.5% conversion
        estimated_conversion = min(avg_score * 6, 0.05)  # Max 5%
        estimated_orders = int(user_count * estimated_conversion)
        revenue_estimate = estimated_orders * 2000  # ₹2K AOV
        
        # Campaign pricing (what brands should pay)
        campaign_price = int(user_count * 50)  # ₹50 per high-intent user
        
        # Determine urgency
        if user_count > 50000:
            urgency = 'critical'
        elif user_count > 30000:
            urgency = 'high'
        elif user_count > 10000:
            urgency = 'medium'
        else:
            urgency = 'low'
        
        # Suggest brands
        brand_mapping = {
            'footwear': ['Nike India', 'Adidas India', 'Puma', 'Reebok'],
            'apparel': ['Nike India', 'Adidas India', 'H&M', 'Zara'],
            'electronics': ['Samsung', 'Apple', 'Sony', 'OnePlus'],
            'groceries': ['Nestle', 'ITC', 'HUL', 'Amul'],
            'beauty': ['L\'Oreal', 'Maybelline', 'Lakme', 'MAC'],
            'sports': ['Decathlon', 'Nike India', 'Puma', 'Adidas India']
        }
        
        opportunity = {
            'id': f"opp_{category}_{int(datetime.now().timestamp())}",
            'category': category,
            'userCount': user_count,
            'avgIntentScore': round(avg_score, 4),
            'revenueEstimate': revenue_estimate,
            'campaignPrice': campaign_price,
            'estimatedConversion': round(estimated_conversion * 100, 2),
            'timeWindow': '72 hours',
            'urgency': urgency,
            'detectedAt': datetime.now().isoformat(),
            'expiresAt': (datetime.now() + timedelta(hours=72)).isoformat(),
            'status': 'active',
            'suggestedBrands': brand_mapping.get(category, []),
            'assignedTo': None,
            'bookedBy': None
        }
        
        opportunities_found.append(opportunity)
    
    return opportunities_found

# ============================================================================
# API ENDPOINTS
# ============================================================================

@router.get("/detect")
async def detect_live_opportunities(clientId: str = "zepto"):
    """Detect current high-intent opportunities"""
    
    opportunities_found = detect_opportunities()
    
    # Update global opportunities list
    global opportunities
    opportunities = opportunities_found
    
    return {
        'clientId': clientId,
        'totalOpportunities': len(opportunities_found),
        'totalRevenuePotential': sum(o['revenueEstimate'] for o in opportunities_found),
        'opportunities': opportunities_found
    }

@router.get("/list")
async def list_opportunities(
    clientId: str = "zepto",
    status: Optional[str] = None,
    urgency: Optional[str] = None
):
    """List all opportunities with filters"""
    
    filtered = opportunities
    
    if status:
        filtered = [o for o in filtered if o['status'] == status]
    
    if urgency:
        filtered = [o for o in filtered if o['urgency'] == urgency]
    
    return {
        'count': len(filtered),
        'opportunities': filtered
    }

@router.post("/action")
async def log_action(action: OpportunityAction):
    """Log brand manager action on opportunity"""
    
    action_data = {
        'opportunityId': action.opportunityId,
        'brandName': action.brandName,
        'action': action.action,
        'notes': action.notes,
        'timestamp': action.timestamp or datetime.now().isoformat()
    }
    
    opportunity_actions[action.opportunityId].append(action_data)
    
    # Update opportunity status
    for opp in opportunities:
        if opp['id'] == action.opportunityId:
            if action.action == 'booked':
                opp['status'] = 'booked'
                opp['bookedBy'] = action.brandName
            elif action.action in ['contacted', 'proposal_sent']:
                opp['status'] = 'assigned'
                opp['assignedTo'] = action.brandName
    
    return {
        'message': 'Action logged successfully',
        'action': action_data
    }

@router.get("/actions/{opportunityId}")
async def get_actions(opportunityId: str):
    """Get all actions for an opportunity"""
    
    actions = opportunity_actions.get(opportunityId, [])
    
    return {
        'opportunityId': opportunityId,
        'actionCount': len(actions),
        'actions': actions
    }

@router.get("/stats")
async def get_opportunity_stats(clientId: str = "zepto"):
    """Get opportunity statistics for dashboard"""
    
    total_active = len([o for o in opportunities if o['status'] == 'active'])
    total_assigned = len([o for o in opportunities if o['status'] == 'assigned'])
    total_booked = len([o for o in opportunities if o['status'] == 'booked'])
    
    total_revenue_potential = sum(o['revenueEstimate'] for o in opportunities)
    total_campaign_value = sum(o.get('campaignPrice', 0) for o in opportunities if o['status'] != 'expired')
    
    booked_value = sum(o.get('campaignPrice', 0) for o in opportunities if o['status'] == 'booked')
    
    urgency_breakdown = {
        'critical': len([o for o in opportunities if o['urgency'] == 'critical']),
        'high': len([o for o in opportunities if o['urgency'] == 'high']),
        'medium': len([o for o in opportunities if o['urgency'] == 'medium']),
        'low': len([o for o in opportunities if o['urgency'] == 'low'])
    }
    
    return {
        'clientId': clientId,
        'totalOpportunities': len(opportunities),
        'activeOpportunities': total_active,
        'assignedOpportunities': total_assigned,
        'bookedOpportunities': total_booked,
        'totalRevenuePotential': total_revenue_potential,
        'totalCampaignValue': total_campaign_value,
        'bookedRevenue': booked_value,
        'urgencyBreakdown': urgency_breakdown
    }
