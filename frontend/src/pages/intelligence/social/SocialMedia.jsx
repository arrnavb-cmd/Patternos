import React from "react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Facebook, Instagram, BarChart3, Users, DollarSign, TrendingUp, Link, Settings, Plus, CheckCircle, AlertCircle } from 'lucide-react';

export default function SocialMedia() {
  const navigate = useNavigate();
  const [connectedAccounts, setConnectedAccounts] = useState({
    facebook: true,
    instagram: true
  });

  const socialStats = {
    totalSpend: 450000,
    impressions: 8500000,
    clicks: 125000,
    conversions: 4200,
    roas: 6.2,
    activeCampaigns: 12
  };

  const campaigns = [
    {
      id: 1,
      name: 'Nike Air Max - Facebook Feed',
      platform: 'facebook',
      status: 'active',
      budget: 50000,
      spent: 28500,
      impressions: 1200000,
      clicks: 18500,
      conversions: 640,
      roas: 7.2
    },
    {
      id: 2,
      name: 'Jordan 1 - Instagram Stories',
      platform: 'instagram',
      status: 'active',
      budget: 65000,
      spent: 42000,
      impressions: 2100000,
      clicks: 32000,
      conversions: 1280,
      roas: 8.1
    },
    {
      id: 3,
      name: 'Summer Collection - Facebook Carousel',
      platform: 'facebook',
      status: 'active',
      budget: 40000,
      spent: 35000,
      impressions: 980000,
      clicks: 14200,
      conversions: 520,
      roas: 5.8
    },
    {
      id: 4,
      name: 'Nike Pro - Instagram Reels',
      platform: 'instagram',
      status: 'paused',
      budget: 30000,
      spent: 30000,
      impressions: 1500000,
      clicks: 22000,
      conversions: 880,
      roas: 6.9
    }
  ];

  const audienceSyncStatus = [
    { name: 'High-Intent Shoppers', size: 45000, synced: true, lastSync: '2 hours ago' },
    { name: 'Cart Abandoners', size: 12000, synced: true, lastSync: '4 hours ago' },
    { name: 'VIP Customers', size: 8500, synced: true, lastSync: '1 hour ago' },
    { name: 'New Visitors', size: 125000, synced: false, lastSync: 'Never' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Social Media Integration</h1>
          <p className="text-gray-400">Manage Facebook & Instagram campaigns from PatternOS</p>
        </div>

        {/* Connected Accounts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border-2 border-blue-500/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Facebook className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white">Facebook Ads</h3>
                  <p className="text-sm text-gray-400">Business Manager Connected</p>
                </div>
              </div>
              {connectedAccounts.facebook ? (
                <CheckCircle className="text-green-400" size={24} />
              ) : (
                <AlertCircle className="text-yellow-400" size={24} />
              )}
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Account ID:</span>
                <span className="text-white font-mono">act_1234567890</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Ad Account:</span>
                <span className="text-white">Nike India</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Campaigns:</span>
                <span className="text-blue-400 font-medium">8 active</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/social/facebook')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
            >
              Manage Facebook Campaigns
            </button>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border-2 border-pink-500/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <Instagram className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white">Instagram Ads</h3>
                  <p className="text-sm text-gray-400">Business Account Connected</p>
                </div>
              </div>
              {connectedAccounts.instagram ? (
                <CheckCircle className="text-green-400" size={24} />
              ) : (
                <AlertCircle className="text-yellow-400" size={24} />
              )}
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Username:</span>
                <span className="text-white font-medium">@nikeindia</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Followers:</span>
                <span className="text-white">2.4M</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Campaigns:</span>
                <span className="text-pink-400 font-medium">4 active</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/social/instagram')}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 rounded-lg transition-colors"
            >
              Manage Instagram Campaigns
            </button>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <DollarSign className="text-green-400 mb-3" size={24} />
            <p className="text-gray-400 text-sm">Total Spend</p>
            <p className="text-2xl font-bold text-white mt-1">₹{(socialStats.totalSpend / 1000).toFixed(0)}K</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <BarChart3 className="text-blue-400 mb-3" size={24} />
            <p className="text-gray-400 text-sm">Impressions</p>
            <p className="text-2xl font-bold text-white mt-1">{(socialStats.impressions / 1000000).toFixed(1)}M</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <Users className="text-purple-400 mb-3" size={24} />
            <p className="text-gray-400 text-sm">Clicks</p>
            <p className="text-2xl font-bold text-white mt-1">{(socialStats.clicks / 1000).toFixed(0)}K</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <TrendingUp className="text-yellow-400 mb-3" size={24} />
            <p className="text-gray-400 text-sm">Conversions</p>
            <p className="text-2xl font-bold text-white mt-1">{socialStats.conversions.toLocaleString()}</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <CheckCircle className="text-green-400 mb-3" size={24} />
            <p className="text-gray-400 text-sm">ROAS</p>
            <p className="text-2xl font-bold text-white mt-1">{socialStats.roas}x</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <Settings className="text-gray-400 mb-3" size={24} />
            <p className="text-gray-400 text-sm">Active</p>
            <p className="text-2xl font-bold text-white mt-1">{socialStats.activeCampaigns}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => navigate('/social/create-campaign')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Create Social Campaign
          </button>
          <button
            onClick={() => navigate('/social/audiences')}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Users size={20} />
            Manage Audiences
          </button>
          <button
            onClick={() => navigate('/social/analytics')}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <BarChart3 size={20} />
            Cross-Platform Analytics
          </button>
        </div>

        {/* Active Campaigns */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Active Social Media Campaigns</h2>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-gray-700 rounded-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {campaign.platform === 'facebook' ? (
                      <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                        <Facebook className="text-white" size={20} />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                        <Instagram className="text-white" size={20} />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-white">{campaign.name}</h3>
                      <p className="text-sm text-gray-400 capitalize">{campaign.platform}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    campaign.status === 'active'
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
                      className={`h-2 rounded-full ${
                        campaign.platform === 'facebook' ? 'bg-blue-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
                      }`}
                      style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Impressions</p>
                    <p className="text-white font-bold">{(campaign.impressions / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Clicks</p>
                    <p className="text-white font-bold">{campaign.clicks.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">CTR</p>
                    <p className="text-white font-bold">{((campaign.clicks / campaign.impressions) * 100).toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Conversions</p>
                    <p className="text-white font-bold">{campaign.conversions}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">ROAS</p>
                    <p className="text-green-400 font-bold">{campaign.roas}x</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audience Sync */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Audience Sync Status</h2>
              <p className="text-gray-400 text-sm mt-1">Zepto audiences synced to Facebook/Instagram</p>
            </div>
            <button
              onClick={() => navigate('/social/audiences')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
            >
              Manage Sync
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {audienceSyncStatus.map((audience, idx) => (
              <div key={idx} className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">{audience.name}</h3>
                  <p className="text-sm text-gray-400">{audience.size.toLocaleString()} users</p>
                </div>
                <div className="text-right">
                  {audience.synced ? (
                    <>
                      <CheckCircle className="text-green-400 mb-1" size={20} />
                      <p className="text-xs text-gray-400">{audience.lastSync}</p>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="text-yellow-400 mb-1" size={20} />
                      <p className="text-xs text-gray-400">Not synced</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
