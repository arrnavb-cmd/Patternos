# app/pricing.py
"""
Revenue and pricing calculation module for PatternOS.
Handles ARR calculations, CPM/CPC/CPA pricing, ROAS measurement, and budget validation.
"""

from typing import Dict, List, Optional
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)


# ============================================================================
# ARR (Annual Recurring Revenue) Calculations
# ============================================================================

def calculate_subscription_arr(
    subscription_fee: float,
    customer_count: int,
    billing_period_months: int = 12
) -> float:
    """
    Calculate Annual Recurring Revenue from subscription fees.
    
    Args:
        subscription_fee: Monthly or annual subscription fee per customer
        customer_count: Number of subscribing customers
        billing_period_months: Billing period in months (12 for annual, 1 for monthly)
    
    Returns:
        Annual recurring revenue in the same currency as subscription_fee
    
    Example:
        >>> calculate_subscription_arr(8_00_000, 10, 12)  # ₹8L/year × 10 customers
        80_00_000  # ₹80L ARR
    """
    if subscription_fee < 0 or customer_count < 0 or billing_period_months <= 0:
        raise ValueError("All inputs must be positive numbers")
    
    if billing_period_months not in [1, 3, 6, 12]:
        logger.warning(f"Unusual billing period: {billing_period_months} months")
    
    # Normalize to annual revenue
    annualization_factor = 12 / billing_period_months
    arr = subscription_fee * customer_count * annualization_factor
    
    return float(arr)


def calculate_cpm(impressions: int, cost: float) -> float:
    """Calculate Cost Per Mille (CPM) - cost per 1000 impressions."""
    if impressions <= 0:
        raise ValueError("Impressions must be positive")
    if cost < 0:
        raise ValueError("Cost must be non-negative")
    
    cpm = (cost / impressions) * 1000
    return round(cpm, 2)


def calculate_roas(revenue: float, ad_spend: float) -> float:
    """Calculate Return on Ad Spend (ROAS)."""
    if ad_spend <= 0:
        raise ValueError("Ad spend must be positive")
    if revenue < 0:
        raise ValueError("Revenue must be non-negative")
    
    roas = revenue / ad_spend
    return round(roas, 2)


def calculate_budget(
    target_conversions: int,
    target_cpa: float,
    buffer_percentage: float = 0.10
) -> float:
    """Calculate required budget to achieve target conversions at target CPA."""
    if target_conversions <= 0 or target_cpa <= 0:
        raise ValueError("Conversions and CPA must be positive")
    if not (0 <= buffer_percentage <= 1):
        raise ValueError("Buffer must be between 0-100%")
    
    base_budget = target_conversions * target_cpa
    budget_with_buffer = base_budget * (1 + buffer_percentage)
    
    return round(budget_with_buffer, 2)
