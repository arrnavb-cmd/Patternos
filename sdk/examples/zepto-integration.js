/**
 * Example: Zepto Integration
 * How to integrate PatternOS SDK into Zepto app
 */

const PatternOS = require('@patternos/retail-media-sdk');

// Initialize
const patternos = new PatternOS({
  apiKey: process.env.PATTERNOS_API_KEY,
  aggregator: 'zepto',
  environment: 'production',
  branding: {
    name: 'Zepto Retail Media',
    logo: 'https://cdn.zepto.com/logo.png',
    primaryColor: '#7C3AED'
  },
  revenueShare: {
    aggregator: 85,  // Zepto keeps 85%
    patternos: 15    // PatternOS takes 15%
  }
});

// Enable auto-tracking
patternos.enableAutoTracking();

// Express.js route handler
app.get('/category/:category', async (req, res) => {
  const userId = req.cookies.user_id;
  const category = req.params.category;

  // Request ads
  const adResponse = await patternos.requestAds({
    user_id: userId,
    aggregator: 'zepto',
    page_context: {
      page_type: 'category',
      category: category
    },
    ad_slots: [
      { id: 'hero_banner', type: 'hero_banner', size: '1200x400' },
      { id: 'sponsored_1', type: 'sponsored', position: 1 },
      { id: 'sponsored_2', type: 'sponsored', position: 5 },
      { id: 'sidebar', type: 'sidebar', size: '300x250' }
    ]
  });

  // Render page with ads
  res.render('category', {
    category: category,
    ads: adResponse.ads,
    auctionId: adResponse.auction_id
  });
});

// Track purchase
app.post('/api/purchase', async (req, res) => {
  const { user_id, order_id, items, total } = req.body;

  // Track conversion
  await patternos.trackEvent({
    event_type: 'purchase',
    user_id: user_id,
    metadata: {
      order_id: order_id,
      items: items,
      total: total
    }
  });

  res.json({ success: true });
});

module.exports = patternos;
