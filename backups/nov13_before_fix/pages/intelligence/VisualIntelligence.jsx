import React, { useState, useEffect } from 'react';
import { Camera, TrendingUp, Eye, Users, Package, Award, Image as ImageIcon, Sparkles } from 'lucide-react';

const VisualIntelligence = () => {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [selectedUser, setSelectedUser] = useState('user_123');
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch dashboard summary
      const summaryRes = await fetch('http://localhost:8000/api/visual/dashboard/summary?days=30');
      const summaryData = await summaryRes.json();
      setSummary(summaryData);

      // Fetch visual trends
      const trendsRes = await fetch('http://localhost:8000/api/visual/trends/visual?min_users=5');
      const trendsData = await trendsRes.json();
      setTrends(trendsData.trends || []);

      // Fetch user lifestyle profile
      const profileRes = await fetch(`http://localhost:8000/api/visual/lifestyle/profile/${selectedUser}`);
      const profileData = await profileRes.json();
      setUserProfile(profileData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching visual intelligence data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white">Loading visual intelligence...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Camera className="text-purple-400" size={36} />
          Visual Intelligence
        </h1>
        <p className="text-gray-400">Social media image analysis and visual trend detection</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <ImageIcon className="text-blue-400" size={24} />
            <span className="text-xs text-gray-500 uppercase">Images</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {summary?.total_images_collected?.toLocaleString() || 0}
          </p>
          <p className="text-sm text-gray-400">Collected & analyzed</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Package className="text-green-400" size={24} />
            <span className="text-xs text-gray-500 uppercase">Products</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {summary?.total_products_detected?.toLocaleString() || 0}
          </p>
          <p className="text-sm text-gray-400">Detected in images</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Award className="text-purple-400" size={24} />
            <span className="text-xs text-gray-500 uppercase">Brands</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {summary?.top_brands?.length || 0}
          </p>
          <p className="text-sm text-gray-400">Top brands identified</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Eye className="text-orange-400" size={24} />
            <span className="text-xs text-gray-500 uppercase">Analysis Rate</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {Math.round(summary?.analysis_rate || 0)}%
          </p>
          <p className="text-sm text-gray-400">Processing accuracy</p>
        </div>
      </div>

      {/* Top Brands Detected */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Award className="text-purple-400" size={24} />
          Top Brands in Social Media
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {summary?.top_brands?.slice(0, 10).map((item, idx) => (
            <div key={idx} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 text-center">
              <p className="text-white font-bold text-lg mb-1">{item.brand}</p>
              <p className="text-gray-400 text-sm">{item.count} appearances</p>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Trends */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="text-green-400" size={24} />
          Trending Visual Patterns
        </h2>
        
        {trends.length > 0 ? (
          <div className="space-y-4">
            {trends.map((trend, idx) => (
              <div key={idx} className="bg-gray-900/50 rounded-lg p-5 border border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg mb-1">{trend.trend_name}</h3>
                    <p className="text-gray-400 text-sm mb-2">{trend.description}</p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1 bg-blue-900/30 text-blue-400 rounded-full text-xs font-medium">
                        {trend.category}
                      </span>
                      <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-xs font-medium">
                        {trend.user_count} users
                      </span>
                      <span className="px-3 py-1 bg-purple-900/30 text-purple-400 rounded-full text-xs font-medium">
                        +{Math.round(trend.growth_rate)}% growth
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">{trend.trending_score?.toFixed(1)}</div>
                    <p className="text-xs text-gray-500">Trend Score</p>
                  </div>
                </div>
                
                {trend.associated_products && trend.associated_products.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <p className="text-gray-400 text-xs mb-2">Associated Products:</p>
                    <div className="flex gap-2 flex-wrap">
                      {trend.associated_products.slice(0, 5).map((product, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs">
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No visual trends detected yet</p>
        )}
      </div>

      {/* User Lifestyle Profile */}
      {userProfile && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Users className="text-blue-400" size={24} />
            User Lifestyle Analysis
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lifestyle Categories */}
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-semibold mb-3">Lifestyle Categories</h3>
              <div className="space-y-2">
                {Object.entries(userProfile.lifestyle_categories || {}).map(([category, count], idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-gray-300 capitalize">{category.replace('_', ' ')}</span>
                    <span className="px-3 py-1 bg-blue-900/30 text-blue-400 rounded-full text-sm font-medium">
                      {count} mentions
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Brands */}
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-semibold mb-3">Brand Preferences</h3>
              <div className="flex flex-wrap gap-2">
                {userProfile.top_brands?.map((brand, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-purple-900/30 text-purple-400 rounded-lg text-sm font-medium">
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-700 text-center">
            <p className="text-gray-400 text-sm">
              Based on analysis of {userProfile.total_images_analyzed} social media images
            </p>
          </div>
        </div>
      )}

      {/* AI Capability Notice */}
      <div className="mt-8 bg-purple-900/20 border border-purple-700 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Sparkles className="text-purple-400 flex-shrink-0" size={24} />
          <div>
            <h3 className="text-white font-bold mb-2">AI-Powered Visual Recognition</h3>
            <p className="text-gray-300 text-sm mb-3">
              Our computer vision system analyzes consumer social media images to detect:
            </p>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Product placements and brand visibility</li>
              <li>• Lifestyle indicators and consumer behavior patterns</li>
              <li>• Visual trends and emerging market opportunities</li>
              <li>• Contextual usage scenarios for products</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualIntelligence;
