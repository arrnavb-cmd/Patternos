import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  DollarSign,
  Users,
  Zap,
  TrendingUp,
  Eye,
  BarChart3,
  Palette
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // FORCE REDIRECT brands to campaigns
  useEffect(() => {
    if (user?.role === 'brand') {
      navigate('/campaigns', { replace: true });
    }
  }, [user, navigate]);

  // If brand, show nothing (will redirect)
  if (user?.role === 'brand') {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <p className="text-white">Redirecting...</p>
    </div>;
  }

  const stats = {
    totalRevenue: 13000000,
    activeBrands: 47,
    liveCampaigns: 128,
    fillRate: 94.2,
    totalImpressions: 45000000,
    avgCpm: 125,
    growthRate: 34.5
  };

  const topBrands = [
    { name: 'HUL', campaigns: 15, tier: 'platinum', revenue: 2500000, roi: 4.8 },
    { name: 'P&G', campaigns: 12, tier: 'gold', revenue: 1800000, roi: 4.2 },
    { name: 'Nike India', campaigns: 8, tier: 'platinum', revenue: 1500000, roi: 5.1 },
    { name: 'Mamaearth', campaigns: 10, tier: 'gold', revenue: 950000, roi: 3.9 },
    { name: 'boAt', campaigns: 7, tier: 'gold', revenue: 850000, roi: 4.5 },
  ];

  const revenueBreakdown = {
    brandAdSpend: 12500000,
    platformFee: 1900000,
    patternOSFee: 200000,
    netRevenue: 1700000
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 mb-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, Zepto! 👋
          </h1>
          <p className="text-purple-100">
            Your retail media network is performing excellently
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="text-green-400" size={28} />
              <span className="text-green-400 text-sm font-semibold">+34.5%</span>
            </div>
            <p className="text-gray-400 text-sm">Total Ad Revenue</p>
            <p className="text-3xl font-bold text-white mt-1">₹1.3Cr</p>
            <p className="text-xs text-green-400 mt-2">+34.5% this month</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <Users className="text-blue-400" size={28} />
            </div>
            <p className="text-gray-400 text-sm">Active Brands</p>
            <p className="text-3xl font-bold text-white mt-1">{stats.activeBrands}</p>
            <p className="text-xs text-gray-400 mt-2">Across all tiers</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <Zap className="text-yellow-400" size={28} />
            </div>
            <p className="text-gray-400 text-sm">Live Campaigns</p>
            <p className="text-3xl font-bold text-white mt-1">{stats.liveCampaigns}</p>
            <p className="text-xs text-yellow-400 mt-2">Running right now</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="text-purple-400" size={28} />
            </div>
            <p className="text-gray-400 text-sm">Fill Rate</p>
            <p className="text-3xl font-bold text-white mt-1">{stats.fillRate}%</p>
            <p className="text-xs text-gray-400 mt-2">Inventory optimization</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6">Revenue Breakdown</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">Brand Ad Spend</span>
                  <span className="text-white font-bold">₹{(revenueBreakdown.brandAdSpend / 100000).toFixed(0)}L</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">Platform Fee (15%)</span>
                  <span className="text-green-400 font-bold">₹{(revenueBreakdown.platformFee / 100000).toFixed(0)}L</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">PatternOS Fee (8%)</span>
                  <span className="text-purple-400 font-bold">₹{(revenueBreakdown.patternOSFee / 100000).toFixed(0)}L</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '8%' }}></div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Your Net Revenue</span>
                  <span className="text-2xl font-bold text-green-400">₹{(revenueBreakdown.netRevenue / 100000).toFixed(0)}L</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6">Performance Metrics</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <Eye className="text-blue-400 mb-2" size={24} />
                <p className="text-gray-400 text-xs">Total Impressions</p>
                <p className="text-2xl font-bold text-white mt-1">45M</p>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <DollarSign className="text-green-400 mb-2" size={24} />
                <p className="text-gray-400 text-xs">Avg CPM</p>
                <p className="text-2xl font-bold text-white mt-1">₹{stats.avgCpm}</p>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <BarChart3 className="text-yellow-400 mb-2" size={24} />
                <p className="text-gray-400 text-xs">Fill Rate</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.fillRate}%</p>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <TrendingUp className="text-purple-400 mb-2" size={24} />
                <p className="text-gray-400 text-xs">Growth Rate</p>
                <p className="text-2xl font-bold text-white mt-1">+{stats.growthRate}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Top Performing Brands</h2>
          
          <div className="space-y-3">
            {topBrands.map((brand, idx) => (
              <div
                key={idx}
                className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 hover:border-purple-500 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-purple-500 to-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold">
                    #{idx + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{brand.name}</h3>
                    <p className="text-sm text-gray-400">
                      {brand.campaigns} campaigns • {brand.tier} tier
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">
                    ₹{(brand.revenue / 100000).toFixed(1)}L
                  </p>
                  <p className="text-sm text-green-400">{brand.roi}x ROI</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
            href="/brands/manage"
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 hover:shadow-2xl transition cursor-pointer"
          >
            <Users className="text-white mb-3" size={32} />
            <h3 className="text-white font-bold text-lg">Manage Brands</h3>
            <p className="text-blue-100 text-sm mt-1">View & onboard advertisers</p>
          </a>

          
            href="/campaigns/overview"
            className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 hover:shadow-2xl transition cursor-pointer"
          >
            <Zap className="text-white mb-3" size={32} />
            <h3 className="text-white font-bold text-lg">Campaign Overview</h3>
            <p className="text-purple-100 text-sm mt-1">Monitor all campaigns</p>
          </a>

          
            href="/revenue/analytics"
            className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 hover:shadow-2xl transition cursor-pointer"
          >
            <DollarSign className="text-white mb-3" size={32} />
            <h3 className="text-white font-bold text-lg">Revenue Analytics</h3>
            <p className="text-green-100 text-sm mt-1">Deep dive into earnings</p>
          </a>

          
            href="/settings/white-label"
            className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-6 hover:shadow-2xl transition cursor-pointer"
          >
            <Palette className="text-white mb-3" size={32} />
            <h3 className="text-white font-bold text-lg">White-Label Settings</h3>
            <p className="text-orange-100 text-sm mt-1">Customize branding</p>
          </a>
        </div>
      </div>
    </div>
  );
}
