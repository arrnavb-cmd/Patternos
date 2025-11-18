"""
AI-Powered Ad Validation Engine
5 Pillars: Creative, SKU, Landing Page, Legal, Value Intelligence
"""

import re
from typing import Dict, List, Tuple

class AdValidationEngine:
    
    @staticmethod
    def validate_text_content(text: str) -> Dict:
        """Pillar 1: Text compliance validation"""
        issues = []
        score = 100.0
        
        # Check for banned words/phrases
        banned_keywords = ['hate', 'fake', 'scam', 'guaranteed cure', 'miracle']
        for keyword in banned_keywords:
            if keyword.lower() in text.lower():
                issues.append(f"Contains banned keyword: {keyword}")
                score -= 20
        
        # Check for unverified superlatives
        superlatives = ['#1', 'best', 'top', 'leading', 'number one']
        for sup in superlatives:
            if sup.lower() in text.lower():
                issues.append(f"Unverified superlative: {sup}")
                score -= 10
        
        # Check discount claims
        discount_pattern = r'\d+%\s*(?:off|discount)'
        if re.search(discount_pattern, text, re.IGNORECASE):
            issues.append("Discount claim detected - requires verification")
            score -= 5
        
        # Grammar check (basic)
        if len(text.split()) < 3:
            issues.append("Text too short")
            score -= 5
        
        return {
            'status': 'pass' if score >= 70 else 'fail',
            'score': max(0, score),
            'issues': issues,
            'checks_passed': len(issues) == 0
        }
    
    @staticmethod
    def validate_sku(sku_id: str, sku_data: Dict) -> Dict:
        """Pillar 2: SKU validation"""
        checks = {
            'exists': sku_data.get('exists', False),
            'in_stock': sku_data.get('stock', 0) > 0,
            'price_valid': sku_data.get('price', 0) > 0,
            'category_valid': sku_data.get('category') is not None,
            'legal_category': sku_data.get('category') not in ['tobacco', 'alcohol', 'weapons'],
            'fssai_check': True  # Placeholder
        }
        
        score = (sum(checks.values()) / len(checks)) * 100
        
        return {
            'status': 'pass' if score >= 80 else 'fail',
            'score': score,
            'checks': checks,
            'issues': [k for k, v in checks.items() if not v]
        }
    
    @staticmethod
    def validate_landing_page(url: str) -> Dict:
        """Pillar 3: Landing page validation"""
        # Placeholder - would do actual URL check
        checks = {
            'url_loads': True,
            'no_redirect': True,
            'price_visible': True,
            'product_match': True
        }
        
        score = (sum(checks.values()) / len(checks)) * 100
        
        return {
            'status': 'pass' if score >= 75 else 'fail',
            'score': score,
            'checks': checks
        }
    
    @staticmethod
    def validate_legal_compliance(category: str, claims: List[str]) -> Dict:
        """Pillar 4: Legal compliance"""
        regulated_categories = {
            'food': ['fat-free', 'sugar-free', 'calories', 'organic'],
            'cosmetics': ['anti-aging', 'fairness', 'skin whitening'],
            'pharma': ['cure', 'treatment', 'medical'],
            'baby': ['safe', 'certified', 'tested']
        }
        
        issues = []
        if category.lower() in regulated_categories:
            restricted = regulated_categories[category.lower()]
            for claim in claims:
                if any(r in claim.lower() for r in restricted):
                    issues.append(f"Restricted claim for {category}: {claim}")
        
        score = 100 - (len(issues) * 15)
        
        return {
            'status': 'pass' if score >= 70 else 'fail',
            'score': max(0, score),
            'issues': issues,
            'category': category
        }
    
    @staticmethod
    def validate_value_intelligence_alignment(
        product_category: str,
        customer_identity: str,
        product_attributes: Dict
    ) -> Dict:
        """Pillar 5: Value Intelligence alignment"""
        
        alignment_rules = {
            'eco': ['organic', 'sustainable', 'eco-friendly', 'natural'],
            'health': ['healthy', 'nutritious', 'low-fat', 'vitamin'],
            'aspirational': ['premium', 'luxury', 'exclusive', 'designer'],
            'parenting': ['safe', 'baby', 'kids', 'family'],
            'fitness': ['protein', 'energy', 'workout', 'sports']
        }
        
        if customer_identity not in alignment_rules:
            return {'status': 'pass', 'score': 100, 'aligned': True}
        
        required_attrs = alignment_rules[customer_identity]
        product_desc = ' '.join(str(v) for v in product_attributes.values()).lower()
        
        matches = sum(1 for attr in required_attrs if attr in product_desc)
        score = (matches / len(required_attrs)) * 100
        
        return {
            'status': 'pass' if score >= 40 else 'warning',
            'score': score,
            'aligned': score >= 40,
            'identity': customer_identity,
            'matches_found': matches
        }
    
    @staticmethod
    def calculate_overall_risk_score(validations: Dict) -> Dict:
        """Calculate overall risk and recommendation"""
        
        weights = {
            'creative': 0.25,
            'sku': 0.25,
            'landing_page': 0.20,
            'legal': 0.20,
            'value_intelligence': 0.10
        }
        
        weighted_score = sum(
            validations.get(key, {}).get('score', 0) * weight
            for key, weight in weights.items()
        )
        
        risk_score = 100 - weighted_score
        
        if risk_score < 20:
            recommendation = "AUTO-APPROVE: Low risk, all checks passed"
            auto_approve = True
        elif risk_score < 40:
            recommendation = "REVIEW RECOMMENDED: Medium risk, manual review suggested"
            auto_approve = False
        else:
            recommendation = "REJECT: High risk, significant issues found"
            auto_approve = False
        
        return {
            'overall_score': weighted_score,
            'risk_score': risk_score,
            'recommendation': recommendation,
            'auto_approve_eligible': auto_approve,
            'pillar_scores': {k: v.get('score', 0) for k, v in validations.items()}
        }

