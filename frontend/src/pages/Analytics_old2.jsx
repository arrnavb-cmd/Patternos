import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Calendar, Download, Filter } from 'lucide-react';

export default function Analytics() {
  const [activeTab, setActiveTab] = useState('platform');
  const [dateRange, setDateRange] = useState('last_30_days');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const brand = localStorage.getItem('brand') || user.username?.replace('@brand.com', '') || 'himalaya';
  const isAggregator = user.role === 'admin' || user.username === 'zepto' || user.username === 'admin';

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/brand/analytics/${brand}`);
        const data = await res.json();
        if (!data.error) {
          setAnalyticsData(data);
        }
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [brand]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading analytics...</div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">Failed to load analytics data</div>
      </div>
    );
  }

  const overview = analyticsData.overview;

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">{brand.charAt(0).toUpperCase() + brand.slice(1)} Performance Metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="text-green-400" size={28} />
            </div>
            <p className="text-gray-400 text-sm">Total Ad Spend</p>
            <p className="text-3xl font-bold text-white mt-1">₹{(overview.total_spend / 100000).toFixed(1)}L</p>
            <p className="text-xs text-gray-500 mt-2">All campaigns</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="text-blue-400" size={28} />
            </div>
            <p className="text-gray-400 text-sm">Total Revenue</p>
            <p className="text-3xl font-bold text-white mt-1">₹{(overview.total_revenue / 10000000).toFixed(2)}Cr</p>
            <p className="text-xs text-blue-400 mt-2">From {overview.total_orders.toLocaleString()} orders</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="text-purple-400" size={28} />
            </div>
            <p className="text-gray-400 text-sm">ROAS</p>
            <p className="text-3xl font-bold text-white mt-1">{overview.roas.toFixed(2)}x</p>
            <p className="text-xs text-green-400 mt-2">Return on ad spend</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <Users className="text-orange-400" size={28} />
            </div>
            <p className="text-gray-400 text-sm">Conversions</p>
            <p className="text-3xl font-bold text-white mt-1">{overview.total_conversions.toLocaleString()}</p>
            <p className="text-xs text-orange-400 mt-2">{overview.conversion_rate.toFixed(2)}% conv rate</p>
          </div>
        </div>

        {/* Campaign Performance */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-6">Top Performing Campaigns</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-400 border-b border-gray-700">
                  <th className="pb-3">Campaign</th>
                  <th className="pb-3">Channel</th>
                  <th className="pb-3">Spend</th>
                  <th className="pb-3">Revenue</th>
                  <th className="pb-3">ROAS</th>
                  <th className="pb-3">Conversions</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.top_campaigns.slice(0, 10).map((campaign, idx) => (
                  <tr key={idx} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="py-3 text-white">{campaign.name}</td>
                    <td className="py-3 text-gray-400">{campaign.channel}</td>
                    <td className="py-3 text-gray-300">₹{(campaign.spend / 100000).toFixed(1)}L</td>
                    <td className="py-3 text-green-400">₹{(campaign.revenue / 100000).toFixed(1)}L</td>
                    <td className="py-3 text-blue-400 font-bold">{campaign.roas.toFixed(2)}x</td>
                    <td className="py-3 text-orange-400">{campaign.conversions.toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs ${campaign.status === 'active' ? 'bg-green-900/30 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                        {campaign.status}
                      </span>
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
