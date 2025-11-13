/**
 * PatternOS SDK Types
 */
export interface Campaign {
    id: string;
    name: string;
    brand: string;
    aggregator: string;
    max_cpm: number;
    budget: number;
    spent: number;
    status: 'active' | 'paused' | 'completed';
    targeting: CampaignTargeting;
    creative: CampaignCreative;
    click_url: string;
    start_date: string;
    end_date: string;
}
export interface CampaignTargeting {
    min_intent_score?: number;
    categories?: string[];
    page_types?: string[];
    cities?: string[];
    pincodes?: string[];
    demographics?: {
        age_range?: [number, number];
        gender?: 'male' | 'female' | 'all';
    };
}
export interface CampaignCreative {
    type: 'image' | 'video' | 'carousel' | 'native';
    url?: string;
    images?: string[];
    headline: string;
    description: string;
}
export interface UserIntent {
    user_id: string;
    intent_score: number;
    ready_to_buy: boolean;
    top_category: string;
    all_scores: Record<string, number>;
}
export interface Recommendation {
    product_id: string;
    name: string;
    category: string;
    match_score: number;
    visual_similarity: number;
    predicted_conversion: number;
}
