import { useState } from 'react';
import { Play, TrendingUp, Target, DollarSign, Plus, Sparkles } from 'lucide-react';

export default function Campaigns() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const campaigns = [
    {
      name: 'Diwali Sale - Wireless Earbuds',
      status: 'ACTIVE',
      platforms: ['Flipkart', 'Amazon', 'Zepto'],
      budget: 150000,
      spent: 87600,
      impressions: '2.4M',
      clicks: '48.0K',
      ctr: '2.00%',
      conversions: 1824,
      roi: '4.2x'
    },
    {
      name: 'Back to School - Laptops',
      status: 'ACTIVE',
      platforms: ['Flipkart', 'Amazon', 'Croma'],
      budget: 300000,
      spent: 156000,
      impressions: '1.8M',
      clicks: '36.0K',
      ctr: '2.00%',
      conversions: 1440,
      roi: '3.8x'
    },
    {
      name: 'Summer Fashion Collection',
      status: 'PAUSED',
      platforms: ['Myntra', 'Ajio', 'Flipkart'],
      budget: 200000,
      spent: 200000,
      impressions: '3.2M',
      clicks: '64.0K',
      ctr: '2.00%',
      conversions: 2560,
      roi: '4.5x'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Campaign Management</h1>
          <p className="text-gray-400">Create, manage, and optimize your retail media campaigns</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <TrendingUp size={20} />
            Dashboard
          </button>
          <button
            onClick={() => alert('Create campaign coming soon!')}
            className="px-6 py-3 bg-gray-800 text-gray-400 hover:bg-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Create Campaign
          </button>
          <button
            onClick={() => alert('AI Ad Generator coming soon!')}
            className="px-6 py-3 bg-gray-800 text-gray-400 hover:bg-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Sparkles size={20} />
            AI Ad Generator
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Play className="text-blue-400" size={20} />
              <p className="text-gray-400 text-sm">Active Campaigns</p>
            </div>
            <p className="text-3xl font-bold text-white">2</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="text-green-400" size={20} />
              <p className="text-gray-400 text-sm">Total Spent</p>
            </div>
            <p className="text-3xl font-bold text-white">₹444K</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Target className="text-purple-400" size={20} />
              <p className="text-gray-400 text-sm">Total Conversions</p>
            </div>
            <p className="text-3xl font-bold text-white">5824</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-yellow-400" size={20} />
              <p className="text-gray-400 text-sm">Avg ROI</p>
            </div>
            <p className="text-3xl font-bold text-green-400">4.2x</p>
          </div>
        </div>

        {/* Campaign Performance */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Campaign Performance</h2>
          
          <div className="space-y-6">
            {campaigns.map((campaign, idx) => (
              <div key={idx} className="bg-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{campaign.name}</h3>
                    <div className="flex items-center gap-2">
                      {campaign.platforms.map((platform, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    campaign.status === 'ACTIVE'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {campaign.status}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Budget Spent</span>
                    <span className="text-white font-medium">
                      ₹{campaign.spent.toLocaleString()} / ₹{campaign.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Impressions</p>
                    <p className="text-white font-bold">{campaign.impressions}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Clicks</p>
                    <p className="text-white font-bold">{campaign.clicks}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">CTR</p>
                    <p className="text-white font-bold">{campaign.ctr}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Conversions</p>
                    <p className="text-white font-bold">{campaign.conversions}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">ROI</p>
                    <p className="text-green-400 font-bold">{campaign.roi}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="text-white" size={24} />
            <h2 className="text-xl font-bold text-white">AI-Powered Insights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white font-medium mb-1">Top Performing Platform</p>
              <p className="text-2xl font-bold text-white">Flipkart</p>
              <p className="text-purple-100 text-sm">4.8x ROI • 35% higher conversion</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white font-medium mb-1">Best Time to Advertise</p>
              <p className="text-2xl font-bold text-white">8-10 PM</p>
              <p className="text-purple-100 text-sm">Peak user activity • 7.3x engagement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
