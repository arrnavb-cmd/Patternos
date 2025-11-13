import React from "react";
import { useState } from 'react';
import { TrendingUp, Eye, Users, ShoppingCart, Plus, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ZeptoAds() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [campaigns] = useState([
    {
      id: 'zep_001',
      name: 'Nike Air Max 270 - Summer Sale',
      status: 'active',
      budget: 1800000,
      spent: 1620000,
      impressions: 8500000,
      clicks: 125000,
      conversions: 4200,
      revenue: 12500000,
      roas: 7.7,
      startDate: '2025-10-15',
      endDate: '2025-11-15'
    },
    {
      id: 'zep_002',
      name: 'Jordan Brand - Display Campaign',
      status: 'active',
      budget: 1200000,
      spent: 980000,
      impressions: 5200000,
      clicks: 76000,
      conversions: 2480,
      revenue: 7800000,
      roas: 8.0,
      startDate: '2025-10-20',
      endDate: '2025-11-20'
    },
    {
      id: 'zep_003',
      name: 'Nike Pro - Sponsored Products',
      status: 'paused',
      budget: 950000,
      spent: 450000,
      impressions: 2100000,
      clicks: 31000,
      conversions: 980,
      revenue: 2900000,
      roas: 6.4,
      startDate: '2025-10-01',
      endDate: '2025-10-31'
    }
  ]);

  const totalMetrics = {
    totalBudget: campaigns.reduce((sum, c) => sum + c.budget, 0),
    totalSpent: campaigns.reduce((sum, c) => sum + c.spent, 0),
    totalImpressions: campaigns.reduce((sum, c) => sum + c.impressions, 0),
    totalClicks: campaigns.reduce((sum, c) => sum + c.clicks, 0),
    totalConversions: campaigns.reduce((sum, c) => sum + c.conversions, 0),
    totalRevenue: campaigns.reduce((sum, c) => sum + c.revenue, 0),
    avgRoas: campaigns.reduce((sum, c) => sum + c.roas, 0) / campaigns.length
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'paused': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'ended': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              ⚡ Zepto Ads - {user.brand_name}
            </h1>
            <p className="text-gray-400">Manage your campaigns on Zepto Retail Media Platform</p>
          </div>
          <button
            onClick={() => navigate('/campaigns/create')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
          >
            <Plus size={20} />
            Create Campaign
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center gap-3 mb-3">
              <Eye className="text-blue-400" size={24} />
              <div className="text-sm text-gray-400">Impressions</div>
            </div>
            <div className="text-2xl font-bold text-white">
              {(totalMetrics.totalImpressions / 1000000).toFixed(1)}M
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-green-500/20">
            <div className="flex items-center gap-3 mb-3">
              <Users className="text-green-400" size={24} />
              <div className="text-sm text-gray-400">Clicks</div>
            </div>
            <div className="text-2xl font-bold text-white">
              {(totalMetrics.totalClicks / 1000).toFixed(0)}K
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-3">
              <ShoppingCart className="text-purple-400" size={24} />
              <div className="text-sm text-gray-400">Conversions</div>
            </div>
            <div className="text-2xl font-bold text-white">
              {totalMetrics.totalConversions.toLocaleString()}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-orange-500/20">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="text-orange-400" size={24} />
              <div className="text-sm text-gray-400">Avg ROAS</div>
            </div>
            <div className="text-2xl font-bold text-orange-400">
              {totalMetrics.avgRoas.toFixed(1)}x
            </div>
          </div>
        </div>

        {/* Budget Overview */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Budget Overview</h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-400 mb-1">Total Budget</div>
              <div className="text-2xl font-bold text-white">
                ₹{(totalMetrics.totalBudget / 100000).toFixed(1)}L
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Total Spent</div>
              <div className="text-2xl font-bold text-blue-400">
                ₹{(totalMetrics.totalSpent / 100000).toFixed(1)}L
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {((totalMetrics.totalSpent / totalMetrics.totalBudget) * 100).toFixed(0)}% of budget
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Revenue Generated</div>
              <div className="text-2xl font-bold text-green-400">
                ₹{(totalMetrics.totalRevenue / 10000000).toFixed(2)}Cr
              </div>
              <div className="text-xs text-green-500 mt-1">
                {totalMetrics.avgRoas.toFixed(1)}x return
              </div>
            </div>
          </div>
        </div>

        {/* Campaigns Table */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Your Zepto Campaigns</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Campaign</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Budget</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Spent</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Impressions</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Conversions</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">ROAS</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-700/30">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{campaign.name}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(campaign.status)}`}>
                        {campaign.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white">₹{(campaign.budget / 100000).toFixed(1)}L</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="text-white font-medium">₹{(campaign.spent / 100000).toFixed(1)}L</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {((campaign.spent / campaign.budget) * 100).toFixed(0)}%
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white">{(campaign.impressions / 1000000).toFixed(1)}M</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-medium">{campaign.conversions.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-orange-400 font-bold text-lg">{campaign.roas.toFixed(1)}x</span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                        <BarChart3 size={16} />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
