import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, DollarSign, Users, Calendar, Download, 
  Filter, Eye, MousePointer, ShoppingCart, ArrowUpRight, ArrowDownRight,
  Clock, MapPin, Smartphone, Target, Package, TrendingDown
} from 'lucide-react';

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('last_30_days');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [compareMode, setCompareMode] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const brand = localStorage.getItem('brand') || user.username?.replace('@brand.com', '') || 'himalaya';

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
  }, [brand, dateRange]);

  const downloadReport = (format) => {
    if (!analyticsData) return;
    
    const reportData = {
      brand: brand,
      dateRange: dateRange,
      overview: analyticsData.overview,
      campaigns: analyticsData.all_campaigns,
      generatedAt: new Date().toISOString()
    };

    const dataStr = format === 'json' 
      ? JSON.stringify(reportData, null, 2)
      : convertToCSV(reportData);
    
    const blob = new Blob([dataStr], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${brand}_analytics_${dateRange}.${format === 'json' ? 'json' : 'csv'}`;
    link.click();
  };

  const convertToCSV = (data) => {
    const campaigns = data.campaigns;
    const headers = 'Campaign Name,Channel,Spend,Revenue,ROAS,Impressions,Clicks,Conversions,CTR,Conv Rate,Status\n';
    const rows = campaigns.map(c => 
      `"${c.name}",${c.channel},${c.spend},${c.revenue},${c.roas},${c.impressions},${c.clicks},${c.conversions},${(c.clicks/c.impressions*100).toFixed(2)},${(c.conversions/c.clicks*100).toFixed(2)},${c.status}`
    ).join('\n');
    return headers + rows;
  };

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
  const campaigns = analyticsData.all_campaigns;

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Actions */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Retail Media Analytics</h1>
            <p className="text-gray-400">{brand.charAt(0).toUpperCase() + brand.slice(1)} Performance Dashboard</p>
          </div>
          <div className="flex gap-3">
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
            >
              <option value="last_7_days">Last 7 Days</option>
              <option value="last_30_days">Last 30 Days</option>
              <option value="last_90_days">Last 90 Days</option>
              <option value="all_time">All Time</option>
            </select>
            <button 
              onClick={() => downloadReport('csv')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              <Download size={18} />
              Export CSV
            </button>
            <button 
              onClick={() => downloadReport('json')}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              <Download size={18} />
              Export JSON
            </button>
          </div>
        </div>

        {/* Key Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="text-blue-400" size={28} />
              <span className="text-green-400 flex items-center text-sm">
                <ArrowUpRight size={16} /> 12%
              </span>
            </div>
            <p className="text-gray-400 text-sm">Total Ad Spend</p>
            <p className="text-3xl font-bold text-white mt-1">₹{(overview.total_spend / 10000000).toFixed(2)}Cr</p>
            <p className="text-xs text-gray-500 mt-2">Across {campaigns.length} campaigns</p>
          </div>

          <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="text-green-400" size={28} />
              <span className="text-green-400 flex items-center text-sm">
                <ArrowUpRight size={16} /> 18%
              </span>
            </div>
            <p className="text-gray-400 text-sm">Total Revenue</p>
            <p className="text-3xl font-bold text-white mt-1">₹{(overview.total_revenue / 10000000).toFixed(2)}Cr</p>
            <p className="text-xs text-gray-500 mt-2">From {overview.total_orders.toLocaleString()} orders</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="text-purple-400" size={28} />
              <span className="text-green-400 flex items-center text-sm">
                <ArrowUpRight size={16} /> 23%
              </span>
            </div>
            <p className="text-gray-400 text-sm">ROAS</p>
            <p className="text-3xl font-bold text-white mt-1">{overview.roas.toFixed(2)}x</p>
            <p className="text-xs text-gray-500 mt-2">Return on ad spend</p>
          </div>

          <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border border-orange-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <ShoppingCart className="text-orange-400" size={28} />
              <span className="text-green-400 flex items-center text-sm">
                <ArrowUpRight size={16} /> 15%
              </span>
            </div>
            <p className="text-gray-400 text-sm">Conversions</p>
            <p className="text-3xl font-bold text-white mt-1">{overview.total_conversions.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">{overview.conversion_rate.toFixed(2)}% conv rate</p>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="text-blue-400" size={20} />
              <p className="text-gray-400 text-sm">Impressions</p>
            </div>
            <p className="text-2xl font-bold text-white">{(overview.total_impressions / 1000000).toFixed(1)}M</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <MousePointer className="text-purple-400" size={20} />
              <p className="text-gray-400 text-sm">Clicks</p>
            </div>
            <p className="text-2xl font-bold text-white">{(overview.total_clicks / 1000).toFixed(0)}K</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Target className="text-green-400" size={20} />
              <p className="text-gray-400 text-sm">CTR</p>
            </div>
            <p className="text-2xl font-bold text-white">{overview.ctr.toFixed(2)}%</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Package className="text-orange-400" size={20} />
              <p className="text-gray-400 text-sm">Conv Rate</p>
            </div>
            <p className="text-2xl font-bold text-white">{overview.conversion_rate.toFixed(2)}%</p>
          </div>
        </div>

        {/* Campaign Performance Table */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Campaign Performance Analysis</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white">
                Filter
              </button>
              <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white">
                Sort
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-400 border-b border-gray-700">
                  <th className="pb-3 pr-4">Campaign</th>
                  <th className="pb-3 pr-4">Channel</th>
                  <th className="pb-3 pr-4 text-right">Spend</th>
                  <th className="pb-3 pr-4 text-right">Revenue</th>
                  <th className="pb-3 pr-4 text-right">ROAS</th>
                  <th className="pb-3 pr-4 text-right">Impressions</th>
                  <th className="pb-3 pr-4 text-right">Clicks</th>
                  <th className="pb-3 pr-4 text-right">CTR</th>
                  <th className="pb-3 pr-4 text-right">Conversions</th>
                  <th className="pb-3 pr-4 text-right">Conv Rate</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign, idx) => {
                  const ctr = (campaign.clicks / campaign.impressions * 100).toFixed(2);
                  const convRate = (campaign.conversions / campaign.clicks * 100).toFixed(2);
                  
                  return (
                    <tr key={idx} className="border-b border-gray-700/50 hover:bg-gray-700/30 cursor-pointer">
                      <td className="py-4 pr-4 text-white font-medium">{campaign.name}</td>
                      <td className="py-4 pr-4 text-gray-400">{campaign.channel}</td>
                      <td className="py-4 pr-4 text-right text-gray-300">₹{(campaign.spend / 100000).toFixed(1)}L</td>
                      <td className="py-4 pr-4 text-right text-green-400 font-semibold">₹{(campaign.revenue / 100000).toFixed(1)}L</td>
                      <td className="py-4 pr-4 text-right">
                        <span className={`font-bold ${
                          campaign.roas > 5 ? 'text-green-400' : 
                          campaign.roas > 2 ? 'text-blue-400' : 
                          campaign.roas > 1 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {campaign.roas.toFixed(2)}x
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-right text-gray-300">{(campaign.impressions / 1000).toFixed(0)}K</td>
                      <td className="py-4 pr-4 text-right text-gray-300">{campaign.clicks.toLocaleString()}</td>
                      <td className="py-4 pr-4 text-right text-blue-400">{ctr}%</td>
                      <td className="py-4 pr-4 text-right text-orange-400">{campaign.conversions.toLocaleString()}</td>
                      <td className="py-4 pr-4 text-right text-purple-400">{convRate}%</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          campaign.status === 'active' 
                            ? 'bg-green-900/30 text-green-400' 
                            : 'bg-gray-700 text-gray-400'
                        }`}>
                          {campaign.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Channel Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Performance by Channel</h3>
            {Object.entries(
              campaigns.reduce((acc, c) => {
                if (!acc[c.channel]) acc[c.channel] = { spend: 0, revenue: 0, count: 0 };
                acc[c.channel].spend += c.spend;
                acc[c.channel].revenue += c.revenue;
                acc[c.channel].count += 1;
                return acc;
              }, {})
            ).map(([channel, data]) => {
              const roas = data.revenue / data.spend;
              return (
                <div key={channel} className="mb-4 p-4 bg-gray-900/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-semibold">{channel}</p>
                    <span className={`font-bold ${roas > 3 ? 'text-green-400' : 'text-blue-400'}`}>
                      {roas.toFixed(2)}x ROAS
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Campaigns</p>
                      <p className="text-white">{data.count}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Spend</p>
                      <p className="text-white">₹{(data.spend / 100000).toFixed(1)}L</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Revenue</p>
                      <p className="text-green-400">₹{(data.revenue / 100000).toFixed(1)}L</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Top Insights</h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
                <div className="flex items-start gap-3">
                  <TrendingUp className="text-green-400 mt-1" size={20} />
                  <div>
                    <p className="text-white font-semibold mb-1">Best Performing Channel</p>
                    <p className="text-gray-400 text-sm">
                      {Object.entries(
                        campaigns.reduce((acc, c) => {
                          if (!acc[c.channel]) acc[c.channel] = 0;
                          acc[c.channel] += c.roas;
                          return acc;
                        }, {})
                      ).sort((a, b) => b[1] - a[1])[0]?.[0]} with highest average ROAS
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                <div className="flex items-start gap-3">
                  <Target className="text-blue-400 mt-1" size={20} />
                  <div>
                    <p className="text-white font-semibold mb-1">Conversion Leader</p>
                    <p className="text-gray-400 text-sm">
                      {campaigns.sort((a, b) => b.conversion_rate - a.conversion_rate)[0]?.name.split(' - ')[0]} 
                      {' '}has the best conversion rate
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-orange-900/20 border border-orange-700 rounded-lg">
                <div className="flex items-start gap-3">
                  <Clock className="text-orange-400 mt-1" size={20} />
                  <div>
                    <p className="text-white font-semibold mb-1">Active Campaigns</p>
                    <p className="text-gray-400 text-sm">
                      {campaigns.filter(c => c.status === 'active').length} campaigns currently running
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
