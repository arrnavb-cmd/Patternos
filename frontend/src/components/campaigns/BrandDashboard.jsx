import React from "react";
import { useState } from 'react';
import { TrendingUp, DollarSign, Users, Target, Eye, Play, Pause, Edit } from 'lucide-react';

export default function BrandDashboard() {
  const [campaigns] = useState([
    {
      id: 1,
      name: 'Nike Air Max 270 - Mumbai Launch',
      status: 'active',
      budget: 150000,
      spent: 87500,
      impressions: 2400000,
      clicks: 48000,
      conversions: 1824,
      roi: 4.2,
      platforms: ['Zepto', 'Facebook', 'Instagram']
    },
    {
      id: 2,
      name: 'Jordan 1 Retro - Bangalore',
      status: 'active',
      budget: 300000,
      spent: 156000,
      impressions: 1800000,
      clicks: 36000,
      conversions: 1440,
      roi: 3.8,
      platforms: ['Zepto', 'Google Ads']
    },
    {
      id: 3,
      name: 'Nike Pro Collection - Pan India',
      status: 'paused',
      budget: 200000,
      spent: 200000,
      impressions: 3200000,
      clicks: 64000,
      conversions: 2560,
      roi: 4.5,
      platforms: ['Zepto', 'Facebook', 'Instagram']
    }
  ]);

  const totalStats = {
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    totalSpent: campaigns.reduce((sum, c) => sum + c.spent, 0),
    totalConversions: campaigns.reduce((sum, c) => sum + c.conversions, 0),
    avgROI: (campaigns.reduce((sum, c) => sum + c.roi, 0) / campaigns.length).toFixed(1)
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Play className="text-green-400" size={24} />
            <p className="text-slate-400 text-sm">Active Campaigns</p>
          </div>
          <p className="text-4xl font-bold text-white">{totalStats.activeCampaigns}</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="text-blue-400" size={24} />
            <p className="text-slate-400 text-sm">Total Spent</p>
          </div>
          <p className="text-4xl font-bold text-white">₹{(totalStats.totalSpent / 1000).toFixed(0)}K</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="text-purple-400" size={24} />
            <p className="text-slate-400 text-sm">Total Conversions</p>
          </div>
          <p className="text-4xl font-bold text-white">{totalStats.totalConversions}</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-green-400" size={24} />
            <p className="text-slate-400 text-sm">Avg ROI</p>
          </div>
          <p className="text-4xl font-bold text-green-400">{totalStats.avgROI}x</p>
        </div>
      </div>

      {/* AI-Powered Insights */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <Eye className="text-white mt-1" size={24} />
          <div>
            <h3 className="text-white font-bold text-lg mb-2">🧠 AI-Powered Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
              <div>
                <p className="font-medium">Top Performing Platform</p>
                <p className="text-2xl font-bold">Zepto</p>
                <p className="text-sm text-purple-100">4.8x ROI • 35% higher conversion</p>
              </div>
              <div>
                <p className="font-medium">Best Time to Advertise</p>
                <p className="text-2xl font-bold">8-10 PM</p>
                <p className="text-sm text-purple-100">Peak user activity • 2.3x engagement</p>
              </div>
              <div>
                <p className="font-medium">High Intent Audience</p>
                <p className="text-2xl font-bold">2.4M users</p>
                <p className="text-sm text-purple-100">Ready to buy in next 48 hours</p>
              </div>
              <div>
                <p className="font-medium">Optimization Opportunity</p>
                <p className="text-2xl font-bold">+35% ROI</p>
                <p className="text-sm text-purple-100">Increase budget on Zepto by ₹50k</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Performance */}
      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Campaign Performance</h3>
        
        <div className="space-y-4">
          {campaigns.map(campaign => (
            <div key={campaign.id} className="bg-slate-700 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">{campaign.name}</h4>
                  <div className="flex gap-2">
                    {campaign.platforms.map(platform => (
                      <span key={platform} className={`text-xs px-2 py-1 rounded ${
                        platform === 'Zepto' 
                          ? 'bg-purple-500/20 text-purple-300' 
                          : platform === 'Facebook' 
                          ? 'bg-blue-500/20 text-blue-300'
                          : platform === 'Instagram'
                          ? 'bg-pink-500/20 text-pink-300'
                          : 'bg-green-500/20 text-green-300'
                      }`}>
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    campaign.status === 'active' 
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {campaign.status.toUpperCase()}
                  </span>
                  <button className="p-2 hover:bg-slate-600 rounded-lg">
                    <Edit size={16} className="text-slate-400" />
                  </button>
                  <button className="p-2 hover:bg-slate-600 rounded-lg">
                    {campaign.status === 'active' ? (
                      <Pause size={16} className="text-slate-400" />
                    ) : (
                      <Play size={16} className="text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Budget Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Budget Spent</span>
                  <span className="text-white font-medium">
                    ₹{campaign.spent.toLocaleString()} / ₹{campaign.budget.toLocaleString()}
                  </span>
                </div>
                <div className="bg-slate-600 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                  />
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-slate-400 text-xs mb-1">Impressions</p>
                  <p className="text-white font-bold">{(campaign.impressions / 1000000).toFixed(1)}M</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Clicks</p>
                  <p className="text-white font-bold">{(campaign.clicks / 1000).toFixed(1)}K</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">CTR</p>
                  <p className="text-white font-bold">{((campaign.clicks / campaign.impressions) * 100).toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Conversions</p>
                  <p className="text-white font-bold">{campaign.conversions}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">ROI</p>
                  <p className="text-green-400 font-bold">{campaign.roi}x</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
