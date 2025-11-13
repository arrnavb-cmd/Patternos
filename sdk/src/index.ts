/**
 * PatternOS Retail Media SDK
 * For Aggregators (Zepto, Flipkart, Amazon, etc.)
 */

import axios, { AxiosInstance } from 'axios';

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

export class PatternOS {
  private config: PatternOSConfig;
  private client: AxiosInstance;
  private autoTrackingEnabled: boolean = false;

  constructor(config: PatternOSConfig) {
    this.config = {
      environment: 'production',
      apiUrl: config.environment === 'development' 
        ? 'http://localhost:8001/api'
        : 'https://api.patternos.ai/api',
      ...config
    };

    this.client = axios.create({
      baseURL: this.config.apiUrl,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.config.apiKey,
        'X-Aggregator': this.config.aggregator,
      },
      timeout: 5000,
    });

    console.log(`🚀 PatternOS SDK initialized for ${this.config.aggregator}`);
  }

  async requestAds(request: AdRequest): Promise<AdResponse> {
    try {
      const response = await this.client.post<AdResponse>(
        '/v1/rtb/request-ads',
        { ...request, aggregator: this.config.aggregator }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to request ads: ${error.message}`);
    }
  }

  async trackEvent(event: TrackingEvent): Promise<void> {
    try {
      await this.client.post('/v1/events/track', {
        ...event,
        platform: this.config.aggregator,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('TrackEvent error:', error.message);
    }
  }

  async getUserIntent(userId: string): Promise<any> {
    const response = await this.client.get(`/v1/intelligence/predictive/intent/${userId}`);
    return response.data;
  }

  async getRecommendations(userId: string, limit: number = 10): Promise<any> {
    const response = await this.client.get(`/v1/intelligence/predictive/recommendations/${userId}?limit=${limit}`);
    return response.data;
  }

  async listCampaigns(): Promise<any> {
    const response = await this.client.get(`/v1/campaigns/list?aggregator=${this.config.aggregator}`);
    return response.data;
  }

  enableAutoTracking(): void {
    this.autoTrackingEnabled = true;
    console.log('✅ Auto-tracking enabled');
  }
}

// CommonJS export for Node.js
module.exports = PatternOS;
module.exports.PatternOS = PatternOS;
module.exports.default = PatternOS;
