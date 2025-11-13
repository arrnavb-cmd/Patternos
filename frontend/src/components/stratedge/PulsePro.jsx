import React from "react";
import { useState } from 'react';
import { Activity, TrendingUp, TrendingDown, AlertCircle, Users, Target, DollarSign, Zap } from 'lucide-react';

export default function PulsePro() {
  const [timeRange, setTimeRange] = useState('24h');
  
  const [liveMetrics] = useState({
    active_campaigns: 12,
    total_impressions: 2847653,
    live_users: 45823,
    current_spend: 87500,
    fill_rate: 94.5,
    avg_cpm: 125,
    conversion_rate: 3.8,
    revenue_today: 340000
  });

  const [campaignHealth] = useState([
    {
      id: 1,
      name: 'Diwali Sale - Wireless Earbuds',
      status: 'healthy',
      spend: 45000,
      budget: 50000,
      impressions: 1200000,
      conversions: 1824,
      roi: 4.2,
      alerts: []
    },
    {
      id: 2,
      name: 'Back to School - Laptops',
      status: 'warning',
      spend: 42500,
      budget: 40000,
      impressions: 980000,
      conversions: 1440,
      roi: 3.8,
      alerts: ['Budget exceeded', 'Low conversion rate']
    },
    {
      id: 3,
      name: 'Fashion Week Collection',
      status: 'critical',
      spend: 35000,
      budget: 60000,
      impressions: 450000,
      conversions: 234,
      roi: 1.9,
      alerts: ['Very low CTR', 'Poor targeting']
    }
  ]);

  const [demandSupply] = useState({
    available_inventory: 15000000,
    used_inventory: 12400000,
    wasted_inventory: 850000,
    fill_rate: 82.7,
    demand_shortage: [
      { category: 'Electronics', gap: '2.3M impressions' },
      { category: 'Fashion', gap: '1.8M impressions' },
      { category: 'Beauty', gap: '1.1M impressions' }
    ]
  });

  const [topAdvertisers] = useState([
    { name: 'Nike India', spend: 450000, roi: 5.8, health: 'excellent' },
    { name: 'boAt Lifestyle', spend: 380000, roi: 4.5, health: 'good' },
    { name: 'Mamaearth', spend: 290000, roi: 3.8, health: 'good' },
    { name: 'Noise', spend: 220000, roi: 3.2, health: 'average' },
    { name: 'Fire-Boltt', spend: 180000, roi: 2.9, health: 'warning' }
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity size={32} className="animate-pulse" />
            <div>
              <h2 className="text-2xl font-bold">Pulse Pro</h2>
              <p className="text-blue-100">Real-time retail media intelligence</p>
            </div>
          </div>
          <div className="flex gap-2">
            {['1h', '24h', '7d', '30d'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  timeRange === range
                    ? 'bg-white text-blue-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="text-green-400 animate-pulse" size={20} />
            <p className="text-slate-400 text-sm">Live Now</p>
          </div>
          <p className="text-3xl font-bold text-white">{liveMetrics.active_campaigns}</p>
          <p className="text-green-400 text-sm mt-1">Active Campaigns</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Users className="text-blue-400" size={20} />
            <p className="text-slate-400 text-sm">Active Users</p>
          </div>
          <p className="text-3xl font-bold text-white">{(liveMetrics.live_users / 1000).toFixed(1)}K</p>
          <p className="text-blue-400 text-sm mt-1">Shopping right now</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Target className="text-purple-400" size={20} />
            <p className="text-slate-400 text-sm">Impressions</p>
          </div>
          <p className="text-3xl font-bold text-white">{(liveMetrics.total_impressions / 1000000).toFixed(2)}M</p>
          <p className="text-purple-400 text-sm mt-1">Today</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="text-green-400" size={20} />
            <p className="text-slate-400 text-sm">Revenue</p>
          </div>
          <p className="text-3xl font-bold text-white">₹{(liveMetrics.revenue_today / 1000).toFixed(0)}K</p>
          <p className="text-green-400 text-sm mt-1">+15% vs yesterday</p>
        </div>
      </div>

      {/* Performance Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 rounded-xl p-6">
          <p className="text-slate-400 text-sm mb-2">Fill Rate</p>
          <div className="flex items-end gap-4">
            <p className="text-5xl font-bold text-white">{liveMetrics.fill_rate}%</p>
            <TrendingUp className="text-green-400 mb-2" size={32} />
          </div>
          <div className="bg-slate-700 rounded-full h-3 mt-4">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
              style={{ width: `${liveMetrics.fill_rate}%` }}
            />
          </div>
          <p className="text-slate-400 text-xs mt-2">+2.3% from last week</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <p className="text-slate-400 text-sm mb-2">Conversion Rate</p>
          <div className="flex items-end gap-4">
            <p className="text-5xl font-bold text-white">{liveMetrics.conversion_rate}%</p>
            <TrendingUp className="text-blue-400 mb-2" size={32} />
          </div>
          <div className="bg-slate-700 rounded-full h-3 mt-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full"
              style={{ width: `${liveMetrics.conversion_rate * 10}%` }}
            />
          </div>
          <p className="text-slate-400 text-xs mt-2">+0.5% from yesterday</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <p className="text-slate-400 text-sm mb-2">Avg CPM</p>
          <div className="flex items-end gap-4">
            <p className="text-5xl font-bold text-white">₹{liveMetrics.avg_cpm}</p>
            <TrendingDown className="text-yellow-400 mb-2" size={32} />
          </div>
          <div className="bg-slate-700 rounded-full h-3 mt-4">
            <div 
              className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full"
              style={{ width: '75%' }}
            />
          </div>
          <p className="text-slate-400 text-xs mt-2">-5% optimization working</p>
        </div>
      </div>

      {/* Campaign Health Monitor */}
      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Campaign Health Monitor</h3>
        
        <div className="space-y-4">
          {campaignHealth.map(campaign => (
            <div key={campaign.id} className={`rounded-lg p-6 border-2 ${
              campaign.status === 'healthy' ? 'bg-green-500/10 border-green-500/30' :
              campaign.status === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
              'bg-red-500/10 border-red-500/30'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    campaign.status === 'healthy' ? 'bg-green-400 animate-pulse' :
                    campaign.status === 'warning' ? 'bg-yellow-400 animate-pulse' :
                    'bg-red-400 animate-pulse'
                  }`} />
                  <h4 className="text-lg font-bold text-white">{campaign.name}</h4>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  campaign.status === 'healthy' ? 'bg-green-500/20 text-green-400' :
                  campaign.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {campaign.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div>
                  <p className="text-slate-400 text-xs mb-1">Spend / Budget</p>
                  <p className="text-white font-bold">₹{campaign.spend.toLocaleString()} / ₹{campaign.budget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Impressions</p>
                  <p className="text-white font-bold">{(campaign.impressions / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Conversions</p>
                  <p className="text-white font-bold">{campaign.conversions}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">ROI</p>
                  <p className={`font-bold ${campaign.roi >= 3 ? 'text-green-400' : campaign.roi >= 2 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {campaign.roi}x
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Budget Used</p>
                  <p className="text-white font-bold">{Math.round((campaign.spend / campaign.budget) * 100)}%</p>
                </div>
              </div>

              {campaign.alerts.length > 0 && (
                <div className="flex items-start gap-2 bg-slate-700/50 rounded-lg p-3">
                  <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={16} />
                  <div>
                    <p className="text-white font-medium text-sm mb-1">Alerts:</p>
                    <ul className="space-y-1">
                      {campaign.alerts.map((alert, idx) => (
                        <li key={idx} className="text-slate-300 text-xs">• {alert}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Demand-Supply Gap Analysis */}
      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Demand-Supply Gap Analysis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-2">Available Inventory</p>
            <p className="text-3xl font-bold text-white">{(demandSupply.available_inventory / 1000000).toFixed(1)}M</p>
            <p className="text-slate-400 text-xs mt-1">Total impressions/month</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-2">Utilized</p>
            <p className="text-3xl font-bold text-green-400">{(demandSupply.used_inventory / 1000000).toFixed(1)}M</p>
            <p className="text-slate-400 text-xs mt-1">{demandSupply.fill_rate}% fill rate</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-2">Opportunity</p>
            <p className="text-3xl font-bold text-yellow-400">{((demandSupply.available_inventory - demandSupply.used_inventory) / 1000000).toFixed(1)}M</p>
            <p className="text-slate-400 text-xs mt-1">Untapped revenue</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-6 text-white">
          <h4 className="font-bold text-lg mb-4">🎯 Growth Opportunities</h4>
          <div className="space-y-3">
            {demandSupply.demand_shortage.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between bg-white/10 backdrop-blur rounded-lg p-3">
                <span className="font-medium">{item.category}</span>
                <span className="text-orange-200">{item.gap} available</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Advertisers Performance */}
      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Top Advertisers</h3>
        
        <div className="space-y-3">
          {topAdvertisers.map((advertiser, idx) => (
            <div key={idx} className="bg-slate-700 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">#{idx + 1}</span>
                </div>
                <div>
                  <p className="text-white font-medium">{advertiser.name}</p>
                  <p className="text-slate-400 text-sm">Health: <span className={`font-medium ${
                    advertiser.health === 'excellent' ? 'text-green-400' :
                    advertiser.health === 'good' ? 'text-blue-400' :
                    advertiser.health === 'average' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>{advertiser.health}</span></p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">₹{(advertiser.spend / 1000).toFixed(0)}K</p>
                <p className="text-green-400 text-sm">{advertiser.roi}x ROI</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI-Powered Recommendations */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">🤖 AI Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="font-medium mb-2">💰 Revenue Opportunity</p>
            <p className="text-sm text-purple-100">Increase Electronics inventory by 30% to capture ₹2.3M additional revenue</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="font-medium mb-2">⚠️ Churn Risk</p>
            <p className="text-sm text-purple-100">3 advertisers showing low engagement. Recommend outreach with new offers</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="font-medium mb-2">📈 Upsell Opportunity</p>
            <p className="text-sm text-purple-100">5 Silver tier advertisers ready for Gold upgrade. Potential +₹1.5M revenue</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="font-medium mb-2">🎯 Targeting Optimization</p>
            <p className="text-sm text-purple-100">Fashion campaigns performing 40% better with 25-34 age group targeting</p>
          </div>
        </div>
      </div>
    </div>
  );
}
