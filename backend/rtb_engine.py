"""
PatternOS Real-Time Bidding (RTB) Engine
Handles programmatic ad auctions in <100ms
"""

import asyncio
from datetime import datetime
from typing import List, Dict, Optional
import random
import hashlib
from collections import defaultdict

class RTBEngine:
    def __init__(self):
        self.active_campaigns = {}
        self.bid_history = defaultdict(list)
        self.auction_logs = []
        
    async def handle_ad_request(self, request: Dict) -> Dict:
        """
        Main entry point: When user visits page, run auction
        Response time: <100ms
        """
        start_time = datetime.now()
        
        user_id = request.get('user_id')
        page_context = request.get('page_context', {})
        ad_slots = request.get('ad_slots', [])
        aggregator = request.get('aggregator', 'unknown')
        
        # Step 1: Get user intent score (from intelligence engine)
        user_intent = await self.get_user_intent(user_id)
        
        # Step 2: Find eligible campaigns
        eligible_campaigns = await self.find_eligible_campaigns(
            user_intent=user_intent,
            page_context=page_context,
            aggregator=aggregator
        )
        
        # Step 3: Run auction for each ad slot
        winning_ads = []
        for slot in ad_slots:
            winner = await self.run_slot_auction(
                slot=slot,
                campaigns=eligible_campaigns,
                user_intent=user_intent
            )
            if winner:
                winning_ads.append(winner)
        
        # Calculate response time
        response_time = (datetime.now() - start_time).total_seconds() * 1000
        
        # Log auction
        auction_data = {
            'auction_id': self.generate_auction_id(),
            'user_id': user_id,
            'aggregator': aggregator,
            'eligible_campaigns': len(eligible_campaigns),
            'winning_ads': len(winning_ads),
            'response_time_ms': response_time,
            'timestamp': datetime.now().isoformat()
        }
        self.auction_logs.append(auction_data)
        
        return {
            'auction_id': auction_data['auction_id'],
            'ads': winning_ads,
            'response_time_ms': round(response_time, 2),
            'debug': {
                'eligible_campaigns': len(eligible_campaigns),
                'user_intent_score': user_intent.get('intent_score', 0)
            }
        }
    
    async def get_user_intent(self, user_id: str) -> Dict:
        """
        Get user's purchase intent from intelligence engine
        """
        # Mock for now - in production, call actual ML model
        return {
            'user_id': user_id,
            'intent_score': random.randint(60, 95),  # 0-100
            'predicted_category': random.choice(['electronics', 'fashion', 'groceries']),
            'ready_to_buy': True,
            'last_search': 'wireless earbuds',
            'visual_style': 'minimalist'
        }
    
    async def find_eligible_campaigns(
        self, 
        user_intent: Dict, 
        page_context: Dict,
        aggregator: str
    ) -> List[Dict]:
        """
        Find campaigns that match this user and context
        """
        eligible = []
        
        # Mock campaigns (in production, query from database)
        all_campaigns = self.get_mock_campaigns(aggregator)
        
        for campaign in all_campaigns:
            if self.is_eligible(campaign, user_intent, page_context):
                eligible.append(campaign)
        
        return eligible
    
    def is_eligible(
        self, 
        campaign: Dict, 
        user_intent: Dict, 
        page_context: Dict
    ) -> bool:
        """
        Check if campaign targeting matches user
        """
        targeting = campaign.get('targeting', {})
        
        # Check intent threshold
        min_intent = targeting.get('min_intent_score', 0)
        if user_intent['intent_score'] < min_intent:
            return False
        
        # Check category match
        target_categories = targeting.get('categories', [])
        if target_categories and user_intent['predicted_category'] not in target_categories:
            return False
        
        # Check page context
        target_pages = targeting.get('page_types', [])
        if target_pages and page_context.get('page_type') not in target_pages:
            return False
        
        # Check budget remaining
        if campaign['spent'] >= campaign['budget']:
            return False
        
        # Check schedule
        if not self.is_campaign_active(campaign):
            return False
        
        return True
    
    def is_campaign_active(self, campaign: Dict) -> bool:
        """Check if campaign is within schedule"""
        now = datetime.now()
        start = datetime.fromisoformat(campaign['start_date'])
        end = datetime.fromisoformat(campaign['end_date'])
        return start <= now <= end
    
    async def run_slot_auction(
        self,
        slot: Dict,
        campaigns: List[Dict],
        user_intent: Dict
    ) -> Optional[Dict]:
        """
        Run second-price auction for this ad slot
        """
        if not campaigns:
            return None
        
        # Collect bids from all campaigns
        bids = []
        for campaign in campaigns:
            bid = self.calculate_bid(
                campaign=campaign,
                slot=slot,
                user_intent=user_intent
            )
            if bid:
                bids.append(bid)
        
        if not bids:
            return None
        
        # Run second-price auction
        winning_bid = self.second_price_auction(bids)
        
        # Track bid
        self.bid_history[winning_bid['campaign_id']].append({
            'auction_id': self.generate_auction_id(),
            'bid_amount': winning_bid['bid_amount'],
            'actual_price': winning_bid['actual_price'],
            'timestamp': datetime.now().isoformat()
        })
        
        return winning_bid
    
    def calculate_bid(
        self,
        campaign: Dict,
        slot: Dict,
        user_intent: Dict
    ) -> Optional[Dict]:
        """
        Calculate bid amount based on campaign strategy
        """
        # Base bid (CPM - Cost Per Mille/1000 impressions)
        base_cpm = campaign.get('max_cpm', 100)  # ₹100 per 1000 impressions
        
        # Bid modifiers based on user intent
        intent_multiplier = 1.0
        if user_intent['intent_score'] > 80:
            intent_multiplier = 1.5  # Willing to pay 50% more for high-intent users
        elif user_intent['intent_score'] > 60:
            intent_multiplier = 1.2
        
        # Slot position modifier
        position_multiplier = {
            'hero_banner': 1.5,  # Premium position
            'sidebar': 1.0,
            'footer': 0.7
        }.get(slot.get('type'), 1.0)
        
        # Calculate final bid
        final_bid = base_cpm * intent_multiplier * position_multiplier
        
        # Don't bid more than max budget allows
        remaining_budget = campaign['budget'] - campaign['spent']
        if final_bid > remaining_budget:
            return None
        
        return {
            'campaign_id': campaign['id'],
            'campaign_name': campaign['name'],
            'brand': campaign['brand'],
            'bid_amount': round(final_bid, 2),
            'creative': campaign['creative'],
            'slot': slot,
            'click_url': campaign['click_url']
        }
    
    def second_price_auction(self, bids: List[Dict]) -> Dict:
        """
        Second-price auction: Winner pays second-highest bid + ₹0.01
        Same as Google Ads
        """
        if not bids:
            return None
        
        # Sort bids by amount (highest first)
        sorted_bids = sorted(bids, key=lambda x: x['bid_amount'], reverse=True)
        
        # Winner
        winner = sorted_bids[0].copy()
        
        # Winner pays second price (if exists)
        if len(sorted_bids) > 1:
            second_price = sorted_bids[1]['bid_amount']
            winner['actual_price'] = round(second_price + 0.01, 2)
        else:
            winner['actual_price'] = winner['bid_amount']
        
        winner['auction_type'] = 'second_price'
        winner['won_at'] = datetime.now().isoformat()
        
        return winner
    
    def get_mock_campaigns(self, aggregator: str) -> List[Dict]:
        """
        Mock campaigns for testing
        In production, fetch from database
        """
        return [
            {
                'id': 'CAMP_001',
                'name': 'boAt Airdopes - Electronics',
                'brand': 'boAt Lifestyle',
                'aggregator': aggregator,
                'max_cpm': 150,
                'budget': 500000,  # ₹5L
                'spent': 125000,   # ₹1.25L spent
                'status': 'active',
                'targeting': {
                    'min_intent_score': 60,
                    'categories': ['electronics', 'audio'],
                    'page_types': ['category', 'search', 'product']
                },
                'creative': {
                    'type': 'image',
                    'url': 'https://cdn.boat.com/ad_airdopes.jpg',
                    'headline': 'boAt Airdopes 131 - ₹1,299',
                    'description': '60H Playback • IPX4 Water Resistant'
                },
                'click_url': f'https://{aggregator}.com/product/boat-airdopes-131',
                'start_date': '2025-10-01T00:00:00',
                'end_date': '2025-11-30T23:59:59'
            },
            {
                'id': 'CAMP_002',
                'name': 'Mamaearth Face Wash - Beauty',
                'brand': 'Mamaearth',
                'aggregator': aggregator,
                'max_cpm': 120,
                'budget': 300000,
                'spent': 75000,
                'status': 'active',
                'targeting': {
                    'min_intent_score': 50,
                    'categories': ['beauty', 'skincare'],
                    'page_types': ['homepage', 'category']
                },
                'creative': {
                    'type': 'video',
                    'url': 'https://cdn.mamaearth.com/ad_facewash.mp4',
                    'headline': 'Mamaearth Vitamin C Face Wash',
                    'description': 'Natural • Toxin-Free • Gentle on Skin'
                },
                'click_url': f'https://{aggregator}.com/product/mamaearth-vitamin-c',
                'start_date': '2025-10-15T00:00:00',
                'end_date': '2025-12-15T23:59:59'
            },
            {
                'id': 'CAMP_003',
                'name': 'Nike Air Max - Shoes',
                'brand': 'Nike India',
                'aggregator': aggregator,
                'max_cpm': 200,
                'budget': 1000000,
                'spent': 450000,
                'status': 'active',
                'targeting': {
                    'min_intent_score': 70,
                    'categories': ['fashion', 'footwear'],
                    'page_types': ['product', 'category']
                },
                'creative': {
                    'type': 'carousel',
                    'images': [
                        'https://cdn.nike.com/ad_airmax_1.jpg',
                        'https://cdn.nike.com/ad_airmax_2.jpg',
                        'https://cdn.nike.com/ad_airmax_3.jpg'
                    ],
                    'headline': 'Nike Air Max 270 - New Colors',
                    'description': 'Ultimate Comfort • Premium Style'
                },
                'click_url': f'https://{aggregator}.com/product/nike-air-max-270',
                'start_date': '2025-10-01T00:00:00',
                'end_date': '2025-11-30T23:59:59'
            },
            {
                'id': 'CAMP_004',
                'name': 'HUL Dove - Personal Care',
                'brand': 'Hindustan Unilever',
                'aggregator': aggregator,
                'max_cpm': 180,
                'budget': 2000000,
                'spent': 800000,
                'status': 'active',
                'targeting': {
                    'min_intent_score': 40,
                    'categories': ['groceries', 'personal_care'],
                    'page_types': ['homepage', 'category', 'cart']
                },
                'creative': {
                    'type': 'native',
                    'url': 'https://cdn.hul.com/ad_dove.jpg',
                    'headline': 'Dove Nourishing Body Wash',
                    'description': '₹199 • Buy 2 Get 1 Free'
                },
                'click_url': f'https://{aggregator}.com/product/dove-body-wash',
                'start_date': '2025-09-01T00:00:00',
                'end_date': '2025-12-31T23:59:59'
            },
            {
                'id': 'CAMP_005',
                'name': 'OnePlus Nord - Smartphones',
                'brand': 'OnePlus',
                'aggregator': aggregator,
                'max_cpm': 250,
                'budget': 1500000,
                'spent': 600000,
                'status': 'active',
                'targeting': {
                    'min_intent_score': 75,
                    'categories': ['electronics', 'smartphones'],
                    'page_types': ['search', 'product']
                },
                'creative': {
                    'type': 'video',
                    'url': 'https://cdn.oneplus.com/ad_nord.mp4',
                    'headline': 'OnePlus Nord CE 3 - Now ₹26,999',
                    'description': '5G • 120Hz Display • Fast Charging'
                },
                'click_url': f'https://{aggregator}.com/product/oneplus-nord-ce3',
                'start_date': '2025-10-20T00:00:00',
                'end_date': '2025-11-30T23:59:59'
            }
        ]
    
    def generate_auction_id(self) -> str:
        """Generate unique auction ID"""
        timestamp = datetime.now().isoformat()
        return hashlib.md5(timestamp.encode()).hexdigest()[:12]
    
    async def get_auction_stats(self, campaign_id: Optional[str] = None) -> Dict:
        """Get auction statistics"""
        if campaign_id:
            bids = self.bid_history.get(campaign_id, [])
            if not bids:
                return {'error': 'No bids found for campaign'}
            
            total_bids = len(bids)
            avg_bid = sum(b['bid_amount'] for b in bids) / total_bids
            avg_price = sum(b['actual_price'] for b in bids) / total_bids
            total_spent = sum(b['actual_price'] for b in bids)
            
            return {
                'campaign_id': campaign_id,
                'total_auctions': total_bids,
                'avg_bid_amount': round(avg_bid, 2),
                'avg_actual_price': round(avg_price, 2),
                'total_spent': round(total_spent, 2),
                'savings': round(total_spent - sum(b['bid_amount'] for b in bids), 2)
            }
        else:
            return {
                'total_auctions': len(self.auction_logs),
                'campaigns': list(self.bid_history.keys())
            }

# Global instance
rtb_engine = RTBEngine()
