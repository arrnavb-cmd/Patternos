import React from "react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Book, Zap, CheckCircle, Copy, ArrowLeft, Download } from 'lucide-react';
import Header from '../components/layout/Header';

export default function SDKIntegration() {
  const [copiedCode, setCopiedCode] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const copyToClipboard = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const installCode = `npm install @patternos/sdk
# or
yarn add @patternos/sdk`;

  const initCode = `import PatternOS from '@patternos/sdk';

// Initialize SDK
PatternOS.init({
  apiKey: 'your_api_key_here',
  platform: 'zepto', // or 'flipkart', 'amazon', etc.
  environment: 'production'
});`;

  const trackImageViewCode = `// Automatically track when user views product images
PatternOS.trackImageView({
  user_id: 'USER_12345',
  image_url: 'https://cdn.zepto.com/product_123.jpg',
  product_id: 'PROD_123',
  category: 'electronics',
  metadata: {
    brand: 'boAt',
    price: 1299,
    color: 'black',
    style_tags: ['minimalist', 'tech']
  }
});`;

  const getRecommendationsCode = `// Get AI-powered product recommendations
const recommendations = await PatternOS.getVisualRecommendations({
  user_id: 'USER_12345',
  limit: 10
});

// Response:
{
  "recommendations": [
    {
      "product_id": "PROD_456",
      "name": "boAt Airdopes 131",
      "match_score": 95,
      "visual_similarity": 92,
      "predicted_conversion": 78,
      "reason": "Matches user's color preference and style"
    }
  ],
  "intent_score": 87,
  "optimal_timing": "next_24_hours"
}`;

  const autoTrackingCode = `// Auto-track all product interactions (recommended)
PatternOS.enableAutoTracking({
  trackImageViews: true,
  trackProductClicks: true,
  trackScreenshots: true, // requires permission
  trackScrollDepth: true,
  trackSearchQueries: true
});

// SDK will automatically capture:
// - Product images viewed
// - Time spent on each product
// - Color preferences from browsing
// - Style patterns from engagement`;

  const realTimeAdsCode = `// Show targeted ads based on visual intelligence
async function showTargetedAd() {
  const intent = await PatternOS.getUserIntent('USER_12345');
  
  if (intent.ready_to_buy && intent.intent_score > 80) {
    // User is high-intent, show premium placement
    const ad = await PatternOS.getOptimalAd({
      user_id: 'USER_12345',
      placement: 'homepage_banner',
      format: 'native'
    });
    
    // Display ad in your UI
    displayAd(ad);
  }
}`;

  const privacyCode = `// Privacy-first approach
PatternOS.setPrivacyConfig({
  storeImages: false,           // Never store actual images
  extractMetadataOnly: true,    // Only colors, tags, categories
  anonymizeUserData: true,      // Hash user IDs
  respectDoNotTrack: true,      // Honor DNT headers
  gdprCompliant: true,          // EU compliance
  dataRetention: 90             // Days to keep data
});`;

  return (
    <div className="min-h-screen bg-slate-900">
      <Header user={user} onLogout={handleLogout} />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Code size={48} />
            <div>
              <h1 className="text-4xl font-bold mb-2">PatternOS SDK Integration</h1>
              <p className="text-blue-100">Integrate visual intelligence in under 10 minutes</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <Zap className="mb-2" size={24} />
              <p className="font-bold">Quick Setup</p>
              <p className="text-blue-100 text-sm">5 lines of code</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <CheckCircle className="mb-2" size={24} />
              <p className="font-bold">Privacy-First</p>
              <p className="text-blue-100 text-sm">GDPR compliant</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <Book className="mb-2" size={24} />
              <p className="font-bold">Full Documentation</p>
              <p className="text-blue-100 text-sm">API references</p>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <div className="bg-slate-800 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">🚀 Quick Start</h2>
          
          {/* Step 1 */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm">1</span>
              Install SDK
            </h3>
            <div className="bg-slate-900 rounded-lg p-4 relative">
              <pre className="text-green-400 font-mono text-sm overflow-x-auto">
                {installCode}
              </pre>
              <button
                onClick={() => copyToClipboard(installCode, 'install')}
                className="absolute top-2 right-2 p-2 bg-slate-700 hover:bg-slate-600 rounded"
              >
                {copiedCode === 'install' ? (
                  <CheckCircle className="text-green-400" size={16} />
                ) : (
                  <Copy className="text-slate-400" size={16} />
                )}
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm">2</span>
              Initialize SDK
            </h3>
            <div className="bg-slate-900 rounded-lg p-4 relative">
              <pre className="text-green-400 font-mono text-sm overflow-x-auto">
                {initCode}
              </pre>
              <button
                onClick={() => copyToClipboard(initCode, 'init')}
                className="absolute top-2 right-2 p-2 bg-slate-700 hover:bg-slate-600 rounded"
              >
                {copiedCode === 'init' ? (
                  <CheckCircle className="text-green-400" size={16} />
                ) : (
                  <Copy className="text-slate-400" size={16} />
                )}
              </button>
            </div>
          </div>

          {/* Step 3 */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm">3</span>
              Track Image Views
            </h3>
            <div className="bg-slate-900 rounded-lg p-4 relative">
              <pre className="text-green-400 font-mono text-sm overflow-x-auto">
                {trackImageViewCode}
              </pre>
              <button
                onClick={() => copyToClipboard(trackImageViewCode, 'track')}
                className="absolute top-2 right-2 p-2 bg-slate-700 hover:bg-slate-600 rounded"
              >
                {copiedCode === 'track' ? (
                  <CheckCircle className="text-green-400" size={16} />
                ) : (
                  <Copy className="text-slate-400" size={16} />
                )}
              </button>
            </div>
          </div>

          {/* Step 4 */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm">4</span>
              Get Recommendations
            </h3>
            <div className="bg-slate-900 rounded-lg p-4 relative">
              <pre className="text-green-400 font-mono text-sm overflow-x-auto">
                {getRecommendationsCode}
              </pre>
              <button
                onClick={() => copyToClipboard(getRecommendationsCode, 'recommend')}
                className="absolute top-2 right-2 p-2 bg-slate-700 hover:bg-slate-600 rounded"
              >
                {copiedCode === 'recommend' ? (
                  <CheckCircle className="text-green-400" size={16} />
                ) : (
                  <Copy className="text-slate-400" size={16} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Auto-Tracking */}
        <div className="bg-slate-800 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">⚡ Auto-Tracking (Recommended)</h2>
          <p className="text-slate-400 mb-4">Let the SDK automatically capture all visual interactions</p>
          
          <div className="bg-slate-900 rounded-lg p-4 relative">
            <pre className="text-green-400 font-mono text-sm overflow-x-auto">
              {autoTrackingCode}
            </pre>
            <button
              onClick={() => copyToClipboard(autoTrackingCode, 'auto')}
              className="absolute top-2 right-2 p-2 bg-slate-700 hover:bg-slate-600 rounded"
            >
              {copiedCode === 'auto' ? (
                <CheckCircle className="text-green-400" size={16} />
              ) : (
                <Copy className="text-slate-400" size={16} />
              )}
            </button>
          </div>
        </div>

        {/* Real-Time Targeting */}
        <div className="bg-slate-800 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">🎯 Real-Time Ad Targeting</h2>
          <p className="text-slate-400 mb-4">Show the right ad at the right time based on visual intelligence</p>
          
          <div className="bg-slate-900 rounded-lg p-4 relative">
            <pre className="text-green-400 font-mono text-sm overflow-x-auto">
              {realTimeAdsCode}
            </pre>
            <button
              onClick={() => copyToClipboard(realTimeAdsCode, 'realtime')}
              className="absolute top-2 right-2 p-2 bg-slate-700 hover:bg-slate-600 rounded"
            >
              {copiedCode === 'realtime' ? (
                <CheckCircle className="text-green-400" size={16} />
              ) : (
                <Copy className="text-slate-400" size={16} />
              )}
            </button>
          </div>
        </div>

        {/* Privacy Configuration */}
        <div className="bg-slate-800 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">🔒 Privacy Configuration</h2>
          <p className="text-slate-400 mb-4">Privacy-first by default. No images stored, only metadata.</p>
          
          <div className="bg-slate-900 rounded-lg p-4 relative">
            <pre className="text-green-400 font-mono text-sm overflow-x-auto">
              {privacyCode}
            </pre>
            <button
              onClick={() => copyToClipboard(privacyCode, 'privacy')}
              className="absolute top-2 right-2 p-2 bg-slate-700 hover:bg-slate-600 rounded"
            >
              {copiedCode === 'privacy' ? (
                <CheckCircle className="text-green-400" size={16} />
              ) : (
                <Copy className="text-slate-400" size={16} />
              )}
            </button>
          </div>
        </div>

        {/* Platform-Specific Integration */}
        <div className="bg-slate-800 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">📱 Platform-Specific Integration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Zepto */}
            <div className="bg-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                ⚡ Zepto Integration
              </h3>
              <ul className="space-y-2 text-slate-300 text-sm mb-4">
                <li>✅ 10-min delivery + instant targeting</li>
                <li>✅ Real-time inventory sync</li>
                <li>✅ Location-based recommendations</li>
                <li>✅ Quick commerce optimized</li>
              </ul>
              <button className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium">
                View Zepto Guide
              </button>
            </div>

            {/* Flipkart */}
            <div className="bg-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                🛒 Flipkart Integration
              </h3>
              <ul className="space-y-2 text-slate-300 text-sm mb-4">
                <li>✅ Full catalog integration</li>
                <li>✅ Festival sale optimization</li>
                <li>✅ Category-wise targeting</li>
                <li>✅ SuperCoins rewards tracking</li>
              </ul>
              <button className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium">
                View Flipkart Guide
              </button>
            </div>

            {/* Amazon */}
            <div className="bg-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                📦 Amazon Integration
              </h3>
              <ul className="space-y-2 text-slate-300 text-sm mb-4">
                <li>✅ Prime member targeting</li>
                <li>✅ Cross-category recommendations</li>
                <li>✅ Review sentiment analysis</li>
                <li>✅ Deal of the day optimization</li>
              </ul>
              <button className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium">
                View Amazon Guide
              </button>
            </div>

            {/* Myntra */}
            <div className="bg-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                👗 Myntra Integration
              </h3>
              <ul className="space-y-2 text-slate-300 text-sm mb-4">
                <li>✅ Fashion style detection</li>
                <li>✅ Outfit recommendations</li>
                <li>✅ Size & fit predictions</li>
                <li>✅ Trend-based targeting</li>
              </ul>
              <button className="w-full py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium">
                View Myntra Guide
              </button>
            </div>
          </div>
        </div>

        {/* Resources */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-4">📚 Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="#" className="bg-white/10 backdrop-blur rounded-lg p-4 hover:bg-white/20 transition-all">
              <Download className="mb-2" size={24} />
              <p className="font-bold mb-1">SDK Documentation</p>
              <p className="text-purple-100 text-sm">Complete API reference</p>
            </a>
            <a href="#" className="bg-white/10 backdrop-blur rounded-lg p-4 hover:bg-white/20 transition-all">
              <Code className="mb-2" size={24} />
              <p className="font-bold mb-1">Code Examples</p>
              <p className="text-purple-100 text-sm">GitHub repository</p>
            </a>
            <a href="#" className="bg-white/10 backdrop-blur rounded-lg p-4 hover:bg-white/20 transition-all">
              <Book className="mb-2" size={24} />
              <p className="font-bold mb-1">Integration Guides</p>
              <p className="text-purple-100 text-sm">Step-by-step tutorials</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
