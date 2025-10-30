# PatternOS Retail Media SDK

Official SDK for integrating PatternOS Retail Media Network into your e-commerce platform.

## Installation
```bash
npm install @patternos/retail-media-sdk
```

## Quick Start

### For Aggregators (Zepto, Flipkart, Amazon)
```javascript
import PatternOS from '@patternos/retail-media-sdk';

// Initialize SDK
const patternos = new PatternOS({
  apiKey: 'your_api_key',
  aggregator: 'zepto',
  environment: 'production',
  branding: {
    name: 'Zepto Retail Media',
    logo: 'https://zepto.com/logo.png',
    primaryColor: '#7C3AED'
  }
});

// Enable automatic tracking
patternos.enableAutoTracking();

// Request ads for a page
const ads = await patternos.requestAds({
  user_id: 'user_12345',
  aggregator: 'zepto',
  page_context: {
    page_type: 'category',
    category: 'electronics'
  },
  ad_slots: [
    { id: 'hero', type: 'hero_banner', size: '1200x400' },
    { id: 'sidebar', type: 'sidebar', size: '300x250' }
  ]
});

// Render ads
ads.ads.forEach(ad => {
  renderAd(ad);
});

// Track conversion
await patternos.trackEvent({
  event_type: 'purchase',
  user_id: 'user_12345',
  campaign_id: 'CAMP_001',
  product_id: 'PROD_123',
  revenue: 1299
});
```

## API Reference

### `new PatternOS(config)`

Initialize the SDK.

**Config Options:**
- `apiKey` (string, required): Your API key
- `aggregator` (string, required): Your platform name (e.g., 'zepto')
- `environment` (string): 'production' | 'staging' | 'development'
- `branding` (object): Custom branding settings

### `requestAds(request)`

Request ads via real-time bidding.

**Returns:** Promise<AdResponse>

### `trackEvent(event)`

Track user events (impressions, clicks, conversions).

### `enableAutoTracking()`

Enable automatic event tracking.

## Examples

See `/examples` directory for complete integration examples.

## License

MIT
