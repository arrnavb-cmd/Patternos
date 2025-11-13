import React from "react";
import { useState } from 'react';
import { Eye, TrendingUp, Palette, ShoppingBag, Target, Sparkles } from 'lucide-react';

export default function VisualIntelligence() {
  const [userId] = useState('user_12345');
  
  const [visualData] = useState({
    total_interactions: 1247,
    style_profile: 'Contemporary Casual',
    top_colors: [
      { color: 'Black', percentage: 45, hex: '#000000' },
      { color: 'Navy', percentage: 28, hex: '#001f3f' },
      { color: 'Earth Tones', percentage: 27, hex: '#8B4513' }
    ],
    category_engagement: [
      { category: 'Electronics', score: 92, trend: 'up' },
      { category: 'Fashion', score: 78, trend: 'up' },
      { category: 'Home Decor', score: 65, trend: 'stable' },
      { category: 'Sports', score: 45, trend: 'down' }
    ],
    recent_interests: [
      {
        category: 'Wireless Earbuds',
        brand_affinity: ['boAt', 'Noise', 'OnePlus'],
        style_tags: ['minimalist', 'tech-savvy', 'modern'],
        price_range: '₹1500-₹2500',
        intent_score: 87,
        last_engagement: '2 hours ago',
        similar_products_viewed: 12
      },
      {
        category: 'Running Shoes',
        brand_affinity: ['Nike', 'Adidas', 'Puma'],
        style_tags: ['athletic', 'performance', 'colorful'],
        price_range: '₹3000-₹5000',
        intent_score: 73,
        last_engagement: '1 day ago',
        similar_products_viewed: 8
      }
    ],
    pattern_analysis: {
      shopping_style: 'Research-heavy buyer',
      decision_speed: 'Moderate (3-5 days)',
      price_sensitivity: 'Medium',
      brand_loyalty: 'Low - tries new brands',
      image_engagement: 'High - screenshots & saves frequently'
    },
    product_matches: [
      {
        product_id: 'PROD_001',
        name: 'boAt Airdopes 131',
        category: 'Wireless Earbuds',
        match_score: 95,
        match_reason: 'Color preference (Black) + Price range + Brand affinity',
        visual_similarity: 92,
        style_match: 'Contemporary minimalist',
        predicted_conversion: 78
      },
      {
        product_id: 'PROD_002',
        name: 'Noise Buds VS104',
        category: 'Wireless Earbuds',
        match_score: 89,
        match_reason: 'Similar to saved products + Budget match',
        visual_similarity: 88,
        style_match: 'Modern tech aesthetic',
        predicted_conversion: 72
      }
    ]
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Eye size={32} />
          <div>
            <h2 className="text-2xl font-bold">Visual Intelligence (VisionOS)</h2>
            <p className="text-pink-100">Privacy-first visual behavior analytics</p>
          </div>
        </div>
        <p className="text-pink-200 text-sm mt-3 bg-white/10 backdrop-blur rounded-lg p-3">
          �� <strong>Privacy Note:</strong> No user images are stored or displayed. We only analyze engagement patterns, 
          style preferences, and color affinities to provide better product recommendations.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-xl p-6">
          <Eye className="text-pink-400 mb-2" size={24} />
          <p className="text-slate-400 text-sm mb-1">Visual Interactions</p>
          <p className="text-4xl font-bold text-white">{visualData.total_interactions}</p>
          <p className="text-pink-400 text-sm mt-1">Last 30 days</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <Sparkles className="text-purple-400 mb-2" size={24} />
          <p className="text-slate-400 text-sm mb-1">Style Profile</p>
          <p className="text-2xl font-bold text-white">{visualData.style_profile}</p>
          <p className="text-slate-400 text-sm mt-1">AI-detected preference</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <Target className="text-blue-400 mb-2" size={24} />
          <p className="text-slate-400 text-sm mb-1">Top Category</p>
          <p className="text-2xl font-bold text-white">{visualData.category_engagement[0].category}</p>
          <p className="text-blue-400 text-sm mt-1">{visualData.category_engagement[0].score}% engagement</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <TrendingUp className="text-green-400 mb-2" size={24} />
          <p className="text-slate-400 text-sm mb-1">Purchase Intent</p>
          <p className="text-4xl font-bold text-green-400">{visualData.recent_interests[0].intent_score}%</p>
          <p className="text-slate-400 text-sm mt-1">High confidence</p>
        </div>
      </div>

      {/* Color Preferences */}
      <div className="bg-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="text-pink-400" size={24} />
          <h3 className="text-xl font-bold text-white">Color Preferences</h3>
        </div>
        <p className="text-slate-400 text-sm mb-4">Aggregated from visual engagement across all platforms</p>
        
        <div className="space-y-4">
          {visualData.top_colors.map(color => (
            <div key={color.color}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg border-2 border-slate-600"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-white font-medium">{color.color}</span>
                </div>
                <span className="text-slate-400 font-bold">{color.percentage}%</span>
              </div>
              <div className="bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full"
                  style={{ width: `${color.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Engagement */}
      <div className="bg-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingBag className="text-blue-400" size={24} />
          <h3 className="text-xl font-bold text-white">Category Engagement</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visualData.category_engagement.map(cat => (
            <div key={cat.category} className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">{cat.category}</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-white">{cat.score}</span>
                  {cat.trend === 'up' && <TrendingUp className="text-green-400" size={20} />}
                  {cat.trend === 'down' && <TrendingUp className="text-red-400 rotate-180" size={20} />}
                </div>
              </div>
              <div className="bg-slate-600 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    cat.score >= 80 ? 'bg-green-500' : 
                    cat.score >= 60 ? 'bg-blue-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${cat.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Visual Interests */}
      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Recent Visual Interests</h3>
        <p className="text-slate-400 text-sm mb-6">Based on products viewed, screenshots, and saved items</p>
        
        <div className="space-y-4">
          {visualData.recent_interests.map((interest, idx) => (
            <div key={idx} className="bg-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-white">{interest.category}</h4>
                <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  {interest.intent_score}% Intent
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-slate-400 text-xs mb-1">Price Range</p>
                  <p className="text-white font-medium">{interest.price_range}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Products Viewed</p>
                  <p className="text-white font-medium">{interest.similar_products_viewed}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Last Activity</p>
                  <p className="text-white font-medium">{interest.last_engagement}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Brand Affinity</p>
                  <p className="text-white font-medium">{interest.brand_affinity[0]}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-medium text-slate-400">Style Tags:</span>
                {interest.style_tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shopping Pattern Analysis */}
      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Visual Shopping Pattern</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(visualData.pattern_analysis).map(([key, value]) => (
            <div key={key} className="bg-slate-700 rounded-lg p-4">
              <p className="text-slate-400 text-xs mb-1 capitalize">{key.replace('_', ' ')}</p>
              <p className="text-white font-bold">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Product Matches */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">🎯 AI-Powered Product Matches</h3>
        <p className="text-purple-100 text-sm mb-6">
          Products that match this user's visual preferences and style profile
        </p>
        
        <div className="space-y-4">
          {visualData.product_matches.map(product => (
            <div key={product.product_id} className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-bold text-lg">{product.name}</h4>
                  <p className="text-purple-200 text-sm">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{product.match_score}</p>
                  <p className="text-purple-200 text-xs">Match Score</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-white/10 rounded-lg p-2">
                  <p className="text-purple-200 text-xs">Visual Similarity</p>
                  <p className="text-white font-bold">{product.visual_similarity}%</p>
                </div>
                <div className="bg-white/10 rounded-lg p-2">
                  <p className="text-purple-200 text-xs">Predicted Conversion</p>
                  <p className="text-white font-bold">{product.predicted_conversion}%</p>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-purple-200 text-xs mb-1">Why this matches:</p>
                <p className="text-white text-sm">{product.match_reason}</p>
                <p className="text-purple-200 text-xs mt-2">Style: {product.style_match}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">🔍 How Visual Intelligence Works</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-white font-bold mb-3">What We Track (Privacy-Safe)</h4>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>✅ Products viewed on Zepto/Flipkart/Amazon</li>
              <li>✅ Color preferences from browsing history</li>
              <li>✅ Style patterns (minimalist, bold, etc.)</li>
              <li>✅ Category engagement scores</li>
              <li>✅ Brand affinity signals</li>
              <li>✅ Price range preferences</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-3">What We DON'T Store</h4>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>❌ Actual user photos or images</li>
              <li>❌ Screenshots taken by users</li>
              <li>❌ Personal identifiable visual data</li>
              <li>❌ Social media posts/stories</li>
              <li>❌ Private conversations with images</li>
              <li>❌ Any personally identifiable information</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
