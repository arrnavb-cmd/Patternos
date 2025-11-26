# app/ad_validation.py
"""
Ad content validation and compliance checking for PatternOS.
Ensures ads meet legal, ethical, and platform standards.
"""

import re
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)


def validate_ad_content(
    ad_title: str,
    ad_description: str,
    ad_type: str,
    target_audience: Optional[str] = None
) -> Dict[str, any]:
    """
    Validate ad content for compliance with PatternOS policies.
    
    Args:
        ad_title: Ad headline/title
        ad_description: Ad body text
        ad_type: Type of ad
        target_audience: Target audience segment (optional)
    
    Returns:
        Dictionary with validation results
    """
    errors = []
    warnings = []
    score = 100.0
    
    # Validate title
    if not ad_title or len(ad_title.strip()) == 0:
        errors.append("Ad title cannot be empty")
        score -= 50
    elif len(ad_title) > 100:
        warnings.append(f"Title too long ({len(ad_title)} chars) - recommend <60 chars")
        score -= 5
    
    # Validate description
    if not ad_description or len(ad_description.strip()) == 0:
        errors.append("Ad description cannot be empty")
        score -= 50
    elif len(ad_description) > 500:
        warnings.append(f"Description too long ({len(ad_description)} chars) - recommend <300 chars")
        score -= 5
    
    # Check for prohibited content
    prohibited_patterns = [
        (r'\b(viagra|cialis|rx)\b', "Pharmaceutical products not allowed"),
        (r'\b(betting|gambling|casino)\b', "Gambling content not allowed"),
        (r'\b(miracle cure|guaranteed)\b', "Misleading health claims not allowed"),
    ]
    
    combined_text = f"{ad_title} {ad_description}".lower()
    
    for pattern, message in prohibited_patterns:
        if re.search(pattern, combined_text, re.IGNORECASE):
            errors.append(message)
            score -= 20
    
    score = max(0.0, min(100.0, score))
    
    return {
        'valid': len(errors) == 0,
        'errors': errors,
        'warnings': warnings,
        'score': round(score, 1)
    }


def check_compliance(
    ad_content: Dict[str, str],
    target_region: str = "IN",
    category: Optional[str] = None
) -> Dict[str, any]:
    """
    Check ad compliance with regional regulations and industry standards.
    
    Args:
        ad_content: Dictionary with 'title', 'description', 'category' keys
        target_region: ISO country code (default: IN for India)
        category: Product category
    
    Returns:
        Dictionary with compliance check results
    """
    violations = []
    required_disclosures = []
    
    title = ad_content.get('title', '').lower()
    description = ad_content.get('description', '').lower()
    ad_category = category or ad_content.get('category', '').lower()
    
    # India-specific compliance checks
    if target_region == "IN":
        if ad_category == 'food':
            if any(term in title + description for term in ['health', 'diet', 'weight loss']):
                required_disclosures.append("FSSAI license number must be displayed")
            
            if 'organic' in title + description:
                required_disclosures.append("Organic certification details required")
        
        if ad_category in ['electronics', 'appliances']:
            required_disclosures.append("BIS certification mark required for electronics")
    
    # Universal compliance checks
    if any(term in title + description for term in ['kids', 'children', 'baby']):
        if any(term in title + description for term in ['junk food', 'sugar', 'candy']):
            violations.append("Restricted advertising to children for unhealthy products")
        
        required_disclosures.append("Parental guidance statement may be required")
    
    return {
        'compliant': len(violations) == 0,
        'violations': violations,
        'required_disclosures': required_disclosures,
        'region': target_region,
        'category': ad_category
    }


def sanitize_input(text: str, max_length: int = 1000) -> str:
    """
    Sanitize user input to prevent injection attacks and malicious content.
    
    Args:
        text: Input text to sanitize
        max_length: Maximum allowed length
    
    Returns:
        Sanitized text
    """
    if not text:
        return ""
    
    # Truncate to max length
    text = text[:max_length]
    
    # Remove HTML/script tags
    text = re.sub(r'<script[^>]*>.*?</script>', '', text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r'<[^>]+>', '', text)
    
    # Remove SQL injection patterns
    sql_patterns = [
        r"(\bOR\b.*?=.*?)",
        r"(\bUNION\b.*?\bSELECT\b)",
        r"(--\s*$)",
    ]
    
    for pattern in sql_patterns:
        text = re.sub(pattern, '', text, flags=re.IGNORECASE)
    
    # Remove dangerous special characters
    text = text.replace('\\', '').replace('`', '').replace('$', '')
    
    # Normalize whitespace
    text = ' '.join(text.split())
    
    return text.strip()
