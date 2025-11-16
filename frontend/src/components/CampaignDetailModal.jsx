import React from 'react';
import { X, TrendingUp, TrendingDown, Calendar, DollarSign, Eye, MousePointer, 
         ShoppingCart, Target, BarChart3, Users, Clock, MapPin } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';

export default function CampaignDetailModal({ campaign, onClose }) {
  if (!campaign) return null;

  // Sample performance data over time (you'll replace with real API data)
  const performanceData = [
    { date: 'Week 1', impressions: 45000, clicks: 2250, conversions: 180, spend: 15000 },
    { date: 'Week 2', impressions: 52000, clicks: 2600, conversions: 208, spend: 17000 },
    { date: 'Week 3', impressions: 48000, clicks: 2400, conversions: 192, spend: 16000 },
    { date: 'Week 4', impressions: 55000, clicks: 2750, conversions: 220, spend: 18000 },
  ];

  // Channel breakdown
  const channelData = [
    { name: 'Google Display', value: 35, color: '#3b82f6' },
    { name: 'Facebook', value: 25, color: '#8b5cf6' },
    { name: 'Instagram', value: 20, color: '#ec4899' },
    { name: 'YouTube', value: 15, color: '#ef4444' },
    { name: 'Zepto App', value: 5, color: '#10b981' },
  ];

  // Device breakdown
  const deviceData = [
    { name: 'Mobile', conversions: 450 },
    { name: 'Desktop', conversions: 320 },
    { name: 'Tablet', conversions: 150 },
  ];

  // Geographic data
  const geoData = [
    { city: 'Mumbai', revenue: 125000, conversions: 340 },
    { city: 'Delhi', revenue: 98000, conversions: 280 },
    { city: 'Bangalore', revenue: 87000, conversions: 250 },
    { city: 'Hyderabad', revenue: 65000, conversions: 190 },
    { city: 'Chennai', revenue: 54000, conversions: 160 },
  ];

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    if (amount >= 10000000) return '₹' + (amount / 10000000).toFixed(1) + 'Cr';
    if (amount >= 100000) return '₹' + (amount / 100000).toFixed(1) + 'L';
    return '₹' + amount.toLocaleString();
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-900 to-purple-900 p-6 border-b border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{campaign.campaign_name || campaign.campaign_id}</h2>
            <p className="text-blue-200 text-sm">{campaign.brand} • {campaign.category}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="text-white" size={24} />
          </button>
        </div>

        <div className="p-6">
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="text-blue-400" size={20} />
                <span className="text-xs text-gray-400 uppercase">Impressions</span>
              </div>
              <p className="text-2xl font-bold text-white">{formatNumber(campaign.impressions)}</p>
              <p className="text-xs text-green-400 mt-1">↑ 12.5%</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-700 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <MousePointer className="text-purple-400" size={20} />
                <span className="text-xs text-gray-400 uppercase">Clicks</span>
              </div>
              <p className="text-2xl font-bold text-white">{formatNumber(campaign.clicks)}</p>
              <p className="text-xs text-gray-400 mt-1">CTR: {campaign.ctr}%</p>
            </div>

            <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-700 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingCart className="text-green-400" size={20} />
                <span className="text-xs text-gray-400 uppercase">Conversions</span>
              </div>
              <p className="text-2xl font-bold text-white">{campaign.conversions}</p>
              <p className="text-xs text-green-400 mt-1">↑ 8.3%</p>
            </div>

            <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border border-orange-700 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-orange-400" size={20} />
                <span className="text-xs text-gray-400 uppercase">ROAS</span>
              </div>
              <p className="text-2xl font-bold text-white">{campaign.roas}x</p>
              <p className="text-xs text-orange-400 mt-1">Target: 3-5x</p>
            </div>
          </div>

          {/* Performance Over Time Chart */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Performance Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Area type="monotone" dataKey="impressions" stroke="#3b82f6" fillOpacity={1} fill="url(#colorImpressions)" />
                <Area type="monotone" dataKey="conversions" stroke="#10b981" fillOpacity={1} fill="url(#colorConversions)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            
            {/* Channel Performance */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Channel Breakdown</h3>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={channelData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value">
                      {channelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Device Performance */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Device Performance</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={deviceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  />
                  <Bar dataKey="conversions" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Geographic Performance */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Top Performing Cities</h3>
            <div className="space-y-3">
              {geoData.map((city, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MapPin className="text-blue-400" size={20} />
                    <div>
                      <p className="text-white font-medium">{city.city}</p>
                      <p className="text-sm text-gray-400">{city.conversions} conversions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold">{formatCurrency(city.revenue)}</p>
                    <p className="text-xs text-gray-500">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Campaign Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Campaign Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    campaign.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                    campaign.status === 'Completed' ? 'bg-gray-500/20 text-gray-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {campaign.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Channel</span>
                  <span className="text-white">{campaign.channel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Intent Level</span>
                  <span className="text-white">{campaign.intent_level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration</span>
                  <span className="text-white">{campaign.start_date} - {campaign.end_date}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Financial Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Spend</span>
                  <span className="text-white font-bold">{formatCurrency(campaign.total_spend)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Revenue</span>
                  <span className="text-green-400 font-bold">{formatCurrency(campaign.revenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">CPC</span>
                  <span className="text-white">₹{(campaign.total_spend / campaign.clicks).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">CPA</span>
                  <span className="text-white">₹{(campaign.total_spend / campaign.conversions).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
