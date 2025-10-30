/**
 * Test PatternOS SDK locally
 */

const PatternOS = require('./dist/index.js');

// Initialize SDK
const patternos = new PatternOS({
  apiKey: 'test_key_12345',
  aggregator: 'zepto',
  environment: 'development',
  apiUrl: 'http://localhost:8001/api',
  branding: {
    name: 'Zepto Retail Media',
    logo: 'https://zepto.com/logo.png',
    primaryColor: '#7C3AED'
  }
});

async function testSDK() {
  console.log('\n🧪 Testing PatternOS SDK...\n');

  try {
    // Test 1: Request Ads
    console.log('📊 Test 1: Requesting ads...');
    const adResponse = await patternos.requestAds({
      user_id: 'test_user_123',
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

    console.log('✅ Received ads:', adResponse.ads.length);
    console.log('⚡ Response time:', adResponse.response_time_ms + 'ms');
    console.log('🎯 Auction ID:', adResponse.auction_id);
    
    adResponse.ads.forEach((ad, i) => {
      console.log(`\n  Ad ${i + 1}:`);
      console.log(`    Brand: ${ad.brand}`);
      console.log(`    Campaign: ${ad.campaign_name}`);
      console.log(`    Bid: ₹${ad.bid_amount}`);
      console.log(`    Price: ₹${ad.actual_price}`);
      console.log(`    Headline: ${ad.creative.headline}`);
    });

    // Test 2: Track Event
    console.log('\n📈 Test 2: Tracking impression...');
    await patternos.trackEvent({
      event_type: 'impression',
      user_id: 'test_user_123',
      campaign_id: adResponse.ads[0].campaign_id
    });
    console.log('✅ Event tracked successfully');

    // Test 3: Get User Intent
    console.log('\n🎯 Test 3: Getting user intent...');
    const intent = await patternos.getUserIntent('test_user_123');
    console.log('✅ Intent Score:', intent.intent_score);
    console.log('   Ready to buy:', intent.ready_to_buy);
    console.log('   Top category:', intent.top_category);

    // Test 4: List Campaigns
    console.log('\n📋 Test 4: Listing campaigns...');
    const campaigns = await patternos.listCampaigns();
    console.log('✅ Total campaigns:', campaigns.total);
    campaigns.campaigns.slice(0, 3).forEach(c => {
      console.log(`   - ${c.name} (${c.brand})`);
    });

    console.log('\n�� All tests passed!\n');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run tests
testSDK();
