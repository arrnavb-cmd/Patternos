/**
 * PatternOS Retail Media SDK
 * For Aggregators (Zepto, Flipkart, Amazon, etc.)
 */
export interface PatternOSConfig {
    apiKey: string;
    aggregator: string;
    environment?: 'production' | 'staging' | 'development';
    apiUrl?: string;
    branding?: {
        name: string;
        logo: string;
        primaryColor: string;
    };
    revenueShare?: {
        aggregator: number;
        patternos: number;
    };
    privacy?: {
        storeImages: boolean;
        anonymizeUsers: boolean;
        gdprCompliant: boolean;
        dataRetentionDays: number;
    };
}
export interface AdSlot {
    id: string;
    type: 'hero_banner' | 'sidebar' | 'footer' | 'native' | 'product_listing' | 'sponsored';
    size?: string;
    position?: number;
}
export interface AdRequest {
    user_id: string;
    aggregator: string;
    page_context: {
        page_type: string;
        category?: string;
        search_query?: string;
        product_id?: string;
    };
    ad_slots: AdSlot[];
}
export interface Ad {
    campaign_id: string;
    campaign_name: string;
    brand: string;
    bid_amount: number;
    actual_price: number;
    creative: {
        type: string;
        url?: string;
        headline: string;
        description: string;
        images?: string[];
    };
    slot: AdSlot;
    click_url: string;
    auction_type: string;
    won_at: string;
}
export interface AdResponse {
    auction_id: string;
    ads: Ad[];
    response_time_ms: number;
    debug?: {
        eligible_campaigns: number;
        user_intent_score: number;
    };
}
export interface TrackingEvent {
    event_type: 'impression' | 'click' | 'conversion' | 'view' | 'cart_add' | 'purchase';
    user_id: string;
    ad_id?: string;
    campaign_id?: string;
    product_id?: string;
    revenue?: number;
    metadata?: Record<string, any>;
}
export declare class PatternOS {
    private config;
    private client;
    private autoTrackingEnabled;
    constructor(config: PatternOSConfig);
    requestAds(request: AdRequest): Promise<AdResponse>;
    trackEvent(event: TrackingEvent): Promise<void>;
    getUserIntent(userId: string): Promise<any>;
    getRecommendations(userId: string, limit?: number): Promise<any>;
    listCampaigns(): Promise<any>;
    enableAutoTracking(): void;
}
