import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, DollarSign, Users, TrendingUp, ShoppingBag, 
  Settings, LogOut, Zap, Target, BarChart3, Palette 
} from 'lucide-react';

export default function AggregatorDashboard() {
  const navigate = useNavigate();
  const aggregator = JSON.parse(localStorage.getItem('aggregator') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const [metrics] = useState({
    total_revenue: 12500000,
    active_brands: 47,
    live_campaigns: 128,
    monthly_growth: 34.5,
    total_impressions: 45000000,
    avg_cpm: 125,
    fill_rate: 94.2,
    platform_fee_earned: 1875000
  });

  const [topBrands] = useState([
    { name: 'HUL', spend: 2500000, campaigns: 15, roi: 4.8, status: 'platinum' },
    { name: 'P&G', spend: 1800000, campaigns: 12, roi: 4.2, status: 'gold' },
    { name: 'Nike India', spend: 1500000, campaigns: 8, roi: 5.1, status: 'platinum' },
    { name: 'Mamaearth', spend: 950000, campaigns: 10, roi: 3.9, status: 'gold' },
    { name: 'boAt', spend: 850000, campaigns: 7, roi: 4.5, status: 'gold' }
  ]);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{aggregator.logo}</div>
              <div>
                <h1 className="text-xl font-bold text-white">{aggregator.name} Retail Media</h1>
                <p className="text-slate-400 text-xs">Powered by PatternOS</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/brands')}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Users size={20} />
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Settings size={20} />
              </button>
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-400 transition-colors"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 mb-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {aggregator.name}! 👋</h2>
          <p className="text-purple-100">Your retail media network is performing excellently</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="text-green-400" size={24} />
              <p className="text-slate-400 text-sm">Total Ad Revenue</p>
            </div>
            <p className="text-4xl font-bold text-white">₹{(metrics.total_revenue / 10000000).toFixed(1)}Cr</p>
            <p className="text-green-400 text-sm mt-2">+{metrics.monthly_growth}% this month</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="text-blue-400" size={24} />
              <p className="text-slate-400 text-sm">Active Brands</p>
            </div>
            <p className="text-4xl font-bold text-white">{metrics.active_brands}</p>
            <p className="text-blue-400 text-sm mt-2">Across all tiers</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="text-yellow-400" size={24} />
              <p className="text-slate-400 text-sm">Live Campaigns</p>
            </div>
            <p className="text-4xl font-bold text-white">{metrics.live_campaigns}</p>
            <p className="text-yellow-400 text-sm mt-2">Running right now</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-purple-400" size={24} />
              <p className="text-slate-400 text-sm">Fill Rate</p>
            </div>
            <p className="text-4xl font-bold text-white">{metrics.fill_rate}%</p>
            <p className="text-purple-400 text-sm mt-2">Inventory optimization</p>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Revenue Breakdown</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-400">Brand Ad Spend</span>
                  <span className="text-white font-bold">₹{(metrics.total_revenue / 100000).toFixed(0)}L</span>
                </div>
                <div className="bg-slate-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-400">Platform Fee (15%)</span>
                  <span className="text-green-400 font-bold">₹{(metrics.platform_fee_earned / 100000).toFixed(0)}L</span>
                </div>
                <div className="bg-slate-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '15%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-400">PatternOS Fee (8%)</span>
                  <span className="text-purple-400 font-bold">₹{(metrics.platform_fee_earned * 0.08 / 100000).toFixed(0)}L</span>
                </div>
                <div className="bg-slate-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '8%' }} />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <div className="flex justify-between">
                  <span className="text-white font-bold">Your Net Revenue</span>
                  <span className="text-green-400 font-bold text-xl">
                    ₹{((metrics.platform_fee_earned * 0.92) / 100000).toFixed(0)}L
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Performance Metrics</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700 rounded-lg p-4">
                <Target className="text-blue-400 mb-2" size={24} />
                <p className="text-slate-400 text-xs mb-1">Total Impressions</p>
                <p className="text-2xl font-bold text-white">{(metrics.total_impressions / 1000000).toFixed(0)}M</p>
              </div>

              <div className="bg-slate-700 rounded-lg p-4">
                <DollarSign className="text-green-400 mb-2" size={24} />
                <p className="text-slate-400 text-xs mb-1">Avg CPM</p>
                <p className="text-2xl font-bold text-white">₹{metrics.avg_cpm}</p>
              </div>

              <div className="bg-slate-700 rounded-lg p-4">
                <BarChart3 className="text-yellow-400 mb-2" size={24} />
                <p className="text-slate-400 text-xs mb-1">Fill Rate</p>
                <p className="text-2xl font-bold text-white">{metrics.fill_rate}%</p>
              </div>

              <div className="bg-slate-700 rounded-lg p-4">
                <TrendingUp className="text-purple-400 mb-2" size={24} />
                <p className="text-slate-400 text-xs mb-1">Growth Rate</p>
                <p className="text-2xl font-bold text-white">+{metrics.monthly_growth}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Brands */}
        <div className="bg-slate-800 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Top Performing Brands</h3>
          
          <div className="space-y-3">
            {topBrands.map((brand, idx) => (
              <div key={idx} className="bg-slate-700 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">#{idx + 1}</span>
                  </div>
                  <div>
                    <p className="text-white font-bold">{brand.name}</p>
                    <p className="text-slate-400 text-sm">
                      {brand.campaigns} campaigns • {brand.status} tier
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-white font-bold">₹{(brand.spend / 100000).toFixed(1)}L</p>
                  <p className="text-green-400 text-sm">{brand.roi}x ROI</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <button
            onClick={() => navigate('/brands')}
            className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-6 text-white hover:scale-105 transition-all"
          >
            <Users className="mb-3" size={32} />
            <p className="font-bold text-lg">Manage Brands</p>
            <p className="text-blue-100 text-sm">View & onboard advertisers</p>
          </button>

          <button
            onClick={() => navigate('/campaigns')}
            className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white hover:scale-105 transition-all"
          >
            <Target className="mb-3" size={32} />
            <p className="font-bold text-lg">Campaign Overview</p>
            <p className="text-purple-100 text-sm">Monitor all campaigns</p>
          </button>

          <button
            onClick={() => navigate('/revenue')}
            className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-6 text-white hover:scale-105 transition-all"
          >
            <DollarSign className="mb-3" size={32} />
            <p className="font-bold text-lg">Revenue Analytics</p>
            <p className="text-green-100 text-sm">Deep dive into earnings</p>
          </button>

          <button
            onClick={() => navigate('/settings')}
            className="bg-gradient-to-br from-orange-600 to-red-600 rounded-xl p-6 text-white hover:scale-105 transition-all"
          >
            <Palette className="mb-3" size={32} />
            <p className="font-bold text-lg">White-Label Settings</p>
            <p className="text-orange-100 text-sm">Customize branding</p>
          </button>
        </div>
      </div>
    </div>
  );
}
