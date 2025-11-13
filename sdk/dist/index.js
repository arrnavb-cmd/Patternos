"use strict";
/**
 * PatternOS Retail Media SDK
 * For Aggregators (Zepto, Flipkart, Amazon, etc.)
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatternOS = void 0;
const axios_1 = __importDefault(require("axios"));
class PatternOS {
    constructor(config) {
        this.autoTrackingEnabled = false;
        this.config = {
            environment: 'production',
            apiUrl: config.environment === 'development'
                ? 'http://localhost:8001/api'
                : 'https://api.patternos.ai/api',
            ...config
        };
        this.client = axios_1.default.create({
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
    async requestAds(request) {
        try {
            const response = await this.client.post('/v1/rtb/request-ads', { ...request, aggregator: this.config.aggregator });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to request ads: ${error.message}`);
        }
    }
    async trackEvent(event) {
        try {
            await this.client.post('/v1/events/track', {
                ...event,
                platform: this.config.aggregator,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            console.error('TrackEvent error:', error.message);
        }
    }
    async getUserIntent(userId) {
        const response = await this.client.get(`/v1/intelligence/predictive/intent/${userId}`);
        return response.data;
    }
    async getRecommendations(userId, limit = 10) {
        const response = await this.client.get(`/v1/intelligence/predictive/recommendations/${userId}?limit=${limit}`);
        return response.data;
    }
    async listCampaigns() {
        const response = await this.client.get(`/v1/campaigns/list?aggregator=${this.config.aggregator}`);
        return response.data;
    }
    enableAutoTracking() {
        this.autoTrackingEnabled = true;
        console.log('✅ Auto-tracking enabled');
    }
}
exports.PatternOS = PatternOS;
// CommonJS export for Node.js
module.exports = PatternOS;
module.exports.PatternOS = PatternOS;
module.exports.default = PatternOS;
