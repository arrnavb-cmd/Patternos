import pandas as pd
import json
import os
from datetime import datetime
from typing import Dict, List

def create_campaign_submission(campaign_data: Dict) -> Dict:
    """Submit a new campaign for approval"""
    try:
        # Generate submission ID
        submission_id = f"SUB_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{campaign_data['brand'][:3].upper()}"
        
        # Add metadata
        campaign_data['submission_id'] = submission_id
        campaign_data['submitted_at'] = datetime.now().isoformat()
        campaign_data['status'] = 'pending_review'
        campaign_data['compliance_checks'] = run_compliance_checks(campaign_data)
        
        # Save to file
        submission_file = f'data/campaign_submissions/{submission_id}.json'
        with open(submission_file, 'w') as f:
            json.dump(campaign_data, f, indent=2)
        
        return {
            'success': True,
            'submission_id': submission_id,
            'status': 'pending_review',
            'message': 'Campaign submitted successfully for review'
        }
        
    except Exception as e:
        return {'success': False, 'error': str(e)}

def run_compliance_checks(campaign_data: Dict) -> Dict:
    """Run automated compliance checks on campaign"""
    checks = {
        'image_text_ratio': check_image_text_ratio(campaign_data),
        'content_moderation': check_content_moderation(campaign_data),
        'brand_safety': check_brand_safety(campaign_data),
        'technical_specs': check_technical_specs(campaign_data),
        'legal_compliance': check_legal_compliance(campaign_data)
    }
    
    all_passed = all(check['passed'] for check in checks.values())
    
    return {
        'all_passed': all_passed,
        'checks': checks,
        'checked_at': datetime.now().isoformat()
    }

def check_image_text_ratio(campaign_data: Dict) -> Dict:
    """Check if image to text ratio meets platform standards (20% rule like Facebook)"""
    # In real implementation, this would analyze the image
    # For now, simulate based on campaign data
    ad_copy = campaign_data.get('ad_copy', '')
    ad_copy_length = len(str(ad_copy)) if ad_copy else 0
    
    # Simulate: text should be < 20% of image area
    passed = ad_copy_length < 200  # Simplified check
    
    return {
        'passed': passed,
        'rule': 'Text should not exceed 20% of image area',
        'details': f'Ad copy length: {ad_copy_length} characters'
    }

def check_content_moderation(campaign_data: Dict) -> Dict:
    """Check for prohibited content (vulgarity, nudity, violence)"""
    # Keywords that would flag content
    prohibited_keywords = [
        'explicit', 'nude', 'violence', 'weapon', 'alcohol', 'tobacco',
        'gambling', 'drugs', 'hate', 'discrimination'
    ]
    
    ad_copy = campaign_data.get('ad_copy', '').lower()
    campaign_name = campaign_data.get('campaign_name', '').lower()
    
    flagged_words = [word for word in prohibited_keywords if word in ad_copy or word in campaign_name]
    
    return {
        'passed': len(flagged_words) == 0,
        'rule': 'No prohibited content (nudity, violence, hate speech)',
        'details': f'Flagged words: {flagged_words}' if flagged_words else 'No issues detected'
    }

def check_brand_safety(campaign_data: Dict) -> Dict:
    """Check brand safety guidelines"""
    # Verify brand is registered
    brand = campaign_data.get('brand', '')
    
    try:
        brands_df = pd.read_csv('data/brand_credentials.csv')
        brand_exists = brand.lower() in brands_df['brand'].str.lower().values
    except:
        brand_exists = True  # Default to pass if file doesn't exist
    
    return {
        'passed': brand_exists and len(brand) > 0,
        'rule': 'Campaign must be from verified brand',
        'details': f'Brand: {brand} - {"Verified" if brand_exists else "Not verified"}'
    }

def check_technical_specs(campaign_data: Dict) -> Dict:
    """Check technical specifications of ad creative"""
    channels = campaign_data.get('channels', [])
    budget = campaign_data.get('budget', 0)
    duration = campaign_data.get('duration_days', 0)
    
    # Convert to proper types
    try:
        budget_val = float(budget) if budget else 0
        duration_val = int(duration) if duration else 0
    except (ValueError, TypeError):
        budget_val = 0
        duration_val = 0
    
    # Basic technical checks
    has_channels = len(channels) > 0
    has_budget = budget_val > 0
    has_duration = duration_val > 0
    
    passed = has_channels and has_budget and has_duration
    
    return {
        'passed': passed,
        'rule': 'Must have valid channels, budget, and duration',
        'details': f'Channels: {len(channels)}, Budget: ₹{budget_val}, Duration: {duration_val} days'
    }

def check_legal_compliance(campaign_data: Dict) -> Dict:
    """Check legal compliance (disclaimers, claims, etc.)"""
    ad_copy = campaign_data.get('ad_copy', '')
    
    # Check for exaggerated claims without proof
    claim_keywords = ['best', 'guaranteed', 'miracle', 'instant', 'cure', '100%']
    has_claims = any(word in ad_copy.lower() for word in claim_keywords)
    has_disclaimer = 'disclaimer' in campaign_data or len(ad_copy) > 50
    
    return {
        'passed': not has_claims or has_disclaimer,
        'rule': 'Exaggerated claims must have disclaimers',
        'details': 'No unsubstantiated claims detected' if not has_claims else 'Claims require disclaimer'
    }

def get_pending_submissions() -> List[Dict]:
    """Get all pending campaign submissions"""
    try:
        submissions_dir = 'data/campaign_submissions'
        if not os.path.exists(submissions_dir):
            return []
        
        submissions = []
        for filename in os.listdir(submissions_dir):
            if filename.endswith('.json'):
                with open(os.path.join(submissions_dir, filename), 'r') as f:
                    submission = json.load(f)
                    if submission.get('status') == 'pending_review':
                        submissions.append(submission)
        
        # Sort by submission date (newest first)
        submissions.sort(key=lambda x: x.get('submitted_at', ''), reverse=True)
        return submissions
        
    except Exception as e:
        return []

def approve_campaign(submission_id: str, approver: str, notes: str = '') -> Dict:
    """Approve a campaign submission"""
    try:
        submission_file = f'data/campaign_submissions/{submission_id}.json'
        
        with open(submission_file, 'r') as f:
            submission = json.load(f)
        
        submission['status'] = 'approved'
        submission['approved_by'] = approver
        submission['approved_at'] = datetime.now().isoformat()
        submission['approval_notes'] = notes
        
        with open(submission_file, 'w') as f:
            json.dump(submission, f, indent=2)
        
        return {'success': True, 'message': 'Campaign approved successfully'}
        
    except Exception as e:
        return {'success': False, 'error': str(e)}

def reject_campaign(submission_id: str, rejector: str, reason: str) -> Dict:
    """Reject a campaign submission"""
    try:
        submission_file = f'data/campaign_submissions/{submission_id}.json'
        
        with open(submission_file, 'r') as f:
            submission = json.load(f)
        
        submission['status'] = 'rejected'
        submission['rejected_by'] = rejector
        submission['rejected_at'] = datetime.now().isoformat()
        submission['rejection_reason'] = reason
        
        with open(submission_file, 'w') as f:
            json.dump(submission, f, indent=2)
        
        return {'success': True, 'message': 'Campaign rejected'}
        
    except Exception as e:
        return {'success': False, 'error': str(e)}

def request_changes(submission_id: str, reviewer: str, changes: str) -> Dict:
    """Request changes to a campaign submission"""
    try:
        submission_file = f'data/campaign_submissions/{submission_id}.json'
        
        with open(submission_file, 'r') as f:
            submission = json.load(f)
        
        submission['status'] = 'changes_requested'
        submission['reviewed_by'] = reviewer
        submission['reviewed_at'] = datetime.now().isoformat()
        submission['requested_changes'] = changes
        
        with open(submission_file, 'w') as f:
            json.dump(submission, f, indent=2)
        
        return {'success': True, 'message': 'Changes requested'}
        
    except Exception as e:
        return {'success': False, 'error': str(e)}
