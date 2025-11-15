import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Users, BarChart3, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BrandAnalytics() {
  const { brandName } = useParams();
  const [dateRange, setDateRange] = useState('last_30_days');
  const [loading, setLoading] = useState(false);
  
  const [platformSummary, setPlatformSummary] = useState(null);
  const [channelData, setChannelData] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange, brandName]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const [summaryRes, channelsRes, trendsRes, campaignsRes, productsRes] = await Promise.all([
        fetch(`http://localhost:8000/api/v1/brand/${brandName}/analytics/summary?date_range=${dateRange}`),
        fetch(`http://localhost:8000/api/v1/brand/${brandName}/analytics/channel-performance?date_range=${dateRange}`),
        fetch(`http://localhost:8000/api/v1/brand/${brandName}/analytics/monthly-trends`),
        fetch(`http://localhost:8000/api/v1/brand/${brandName}/analytics/campaigns?date_range=${dateRange}`),
        fetch(`http://localhost:8000/api/v1/brand/${brandName}/analytics/products?date_range=${dateRange}`)
      ]);
      
      const summary = await summaryRes.json();
      const channels = await channelsRes.json();
      const trends = await trendsRes.json();
      const campaignsData = await campaignsRes.json();
      const productsData = await productsRes.json();
      
      setPlatformSummary(summary);
      setChannelData(channels.channels || []);
      setMonthlyTrends(trends.monthly_trends || []);
      setCampaigns(campaignsData.campaigns || []);
      setProducts(productsData.products || []);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (amount >= 10000000) return '₹' + (amount / 10000000).toFixed(1) + 'Cr';
    if (amount >= 100000) return '₹' + (amount / 100000).toFixed(1) + 'L';
    return '₹' + amount.toFixed(0);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={`/brand/${brandName}/dashboard`} className="text-gray-400 hover:text-white">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">{brandName} Analytics</h1>
              <p className="text-gray-400 mt-1">Performance metrics and insights</p>
            </div>
          </div>
          
          {/* Date Range Filter */}
          <div className="flex gap-2">
            {['last_7_days', 'last_30_days', 'last_60_days', 'last_90_days', 'last_180_days'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  dateRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {range.replace('last_', '').replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-700">
          <div className="flex gap-8">
            {['overview', 'campaigns', 'products', 'channels'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-2 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
        {/* Summary Cards */}
        {platformSummary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700 rounded-xl p-6">
              <BarChart3 className="w-8 h-8 text-blue-400 mb-3" />
              <p className="text-3xl font-bold text-white mb-1">{formatCurrency(platformSummary.total_spend)}</p>
              <p className="text-sm text-gray-400">Total Ad Spend</p>
            </div>
            <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-700 rounded-xl p-6">
              <TrendingUp className="w-8 h-8 text-green-400 mb-3" />
              <p className="text-3xl font-bold text-white mb-1">{formatCurrency(platformSummary.total_revenue)}</p>
              <p className="text-sm text-gray-400">Total Revenue</p>
            </div>
            <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border border-orange-700 rounded-xl p-6">
              <DollarSign className="w-8 h-8 text-orange-400 mb-3" />
              <p className="text-3xl font-bold text-white mb-1">{platformSummary.avg_roas.toFixed(1)}x</p>
              <p className="text-sm text-gray-400">Avg ROAS</p>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-700 rounded-xl p-6">
              <Users className="w-8 h-8 text-purple-400 mb-3" />
              <p className="text-3xl font-bold text-white mb-1">{platformSummary.total_clicks.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Total Clicks</p>
            </div>
          </div>
        )}



        {/* Monthly Trends */}
        {monthlyTrends.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Monthly Performance Trends</h3>
            
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-4">Monthly Ad Spend</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', color: '#fff' }}
                    formatter={(value) => [`₹${(value / 100000).toFixed(1)}L`, 'Spend']}
                  />
                  <Bar dataKey="spend" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-4">Monthly Clicks</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', color: '#fff' }}
                      formatter={(value) => [value.toLocaleString(), 'Clicks']}
                    />
                    <Bar dataKey="clicks" fill="#10B981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-4">Monthly Conversions</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', color: '#fff' }}
                      formatter={(value) => [value.toLocaleString(), 'Conversions']}
                    />
                    <Bar dataKey="conversions" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
          </>
        )}

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && campaigns.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Campaign Performance</h3>
            
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Campaign ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Channel</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Intent</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Spend</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Conversions</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">CTR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {campaigns.map((campaign, idx) => (
                      <tr key={idx} className="hover:bg-gray-700/30">
                        <td className="px-6 py-4 text-sm font-medium text-white">{campaign.campaign_id}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{campaign.category}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{campaign.channel}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            campaign.intent_level === 'High' ? 'bg-red-500/20 text-red-400' :
                            campaign.intent_level === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {campaign.intent_level}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">{formatCurrency(campaign.spend)}</td>
                        <td className="px-6 py-4 text-sm text-green-400">{campaign.conversions.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-blue-400">{campaign.ctr}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && products.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Product Performance</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {products.slice(0, 3).map((product, idx) => (
                <div key={idx} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
                  <div className="text-sm text-gray-400 mb-2">#{idx + 1} Top Product</div>
                  <h4 className="text-lg font-bold text-white mb-1">{product.sku_name}</h4>
                  <div className="text-sm text-gray-400 mb-4">{product.category_level_1}</div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-2xl font-bold text-green-400">{formatCurrency(product.revenue)}</div>
                      <div className="text-xs text-gray-500">Revenue</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-orange-400">{product.roas.toFixed(1)}x</div>
                      <div className="text-xs text-gray-500">ROAS</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Product</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Spend</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Revenue</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">ROAS</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Conversions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {products.map((product, idx) => (
                      <tr key={idx} className="hover:bg-gray-700/30">
                        <td className="px-6 py-4 text-sm font-medium text-white">{product.sku_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{product.category_level_1}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{formatCurrency(product.spend)}</td>
                        <td className="px-6 py-4 text-sm text-green-400 font-semibold">{formatCurrency(product.revenue)}</td>
                        <td className="px-6 py-4 text-sm text-orange-400 font-bold">{product.roas.toFixed(1)}x</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{product.conversions.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Channels Tab - Move existing channel content here */}
        {activeTab === 'channels' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Channel Analysis</h3>
            
            {/* Channel Performance Table */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Channel</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Spend</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Revenue</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">ROAS</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Impressions</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">CTR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {channelData.map((channel, idx) => (
                      <tr key={idx} className="hover:bg-gray-700/30">
                        <td className="px-6 py-4 text-sm font-medium text-white">{channel.channel}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{formatCurrency(channel.spend)}</td>
                        <td className="px-6 py-4 text-sm text-green-400 font-semibold">{formatCurrency(channel.revenue)}</td>
                        <td className="px-6 py-4 text-sm text-orange-400 font-bold">{channel.roas.toFixed(1)}x</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{channel.impressions.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-blue-400">{channel.ctr}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Channel Distribution Pie Chart */}
            {channelData.length > 0 && (
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-4">Channel Spend Distribution</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={channelData}
                      dataKey="spend"
                      nameKey="channel"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry) => `${entry.channel}: ${((entry.spend / channelData.reduce((sum, ch) => sum + ch.spend, 0)) * 100).toFixed(1)}%`}
                    >
                      {channelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'][index % 5]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', color: '#fff' }}
                      formatter={(value) => [formatCurrency(value), 'Spend']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
