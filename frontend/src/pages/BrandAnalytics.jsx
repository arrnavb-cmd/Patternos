import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, TrendingUp, DollarSign, Users, ArrowLeft, Download } from 'lucide-react';

export default function BrandAnalytics() {
  const { brandName } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('last_30_days');
  const [loading, setLoading] = useState(false);
  
  const [summary, setSummary] = useState(null);
  const [channelData, setChannelData] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [products, setProducts] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);

  useEffect(() => {
    fetchBrandData();
  }, [brandName, dateRange]);

  const fetchBrandData = async () => {
    setLoading(true);
    try {
      const [summaryRes, channelRes, campaignsRes, productsRes, trendsRes] = await Promise.all([
        fetch(`http://localhost:8000/api/v1/brand/${brandName}/analytics/summary?date_range=${dateRange}`),
        fetch(`http://localhost:8000/api/v1/brand/${brandName}/analytics/channel-performance?date_range=${dateRange}`),
        fetch(`http://localhost:8000/api/v1/brand/${brandName}/analytics/campaigns?date_range=${dateRange}`),
        fetch(`http://localhost:8000/api/v1/brand/${brandName}/analytics/products?date_range=${dateRange}`),
        fetch(`http://localhost:8000/api/v1/brand/${brandName}/analytics/monthly-trends`)
      ]);

      const summaryData = await summaryRes.json();
      const channelsData = await channelRes.json();
      const campaignsData = await campaignsRes.json();
      const productsData = await productsRes.json();
      const trendsData = await trendsRes.json();

      setSummary(summaryData);
      setChannelData(channelsData.channels || []);
      setCampaigns(campaignsData.campaigns || []);
      setProducts(productsData.products || []);
      setMonthlyTrends(trendsData.monthly_trends || []);
    } catch (error) {
      console.error('Failed to fetch brand analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    if (amount >= 10000000) return '₹' + (amount / 10000000).toFixed(1) + 'Cr';
    if (amount >= 100000) return '₹' + (amount / 100000).toFixed(1) + 'L';
    return '₹' + amount.toLocaleString();
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6'];

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
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
          
          <div className="flex gap-2">
            {['last_7_days', 'last_30_days', 'last_60_days', 'last_90_days'].map((range) => (
              <button key={range} onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${dateRange === range ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                {range.replace('last_', '').replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 border-b border-gray-700">
          <div className="flex gap-8">
            {['overview', 'campaigns', 'products', 'channels'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`pb-4 px-2 text-sm font-medium ${activeTab === tab ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && summary && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700 rounded-xl p-6">
                <BarChart3 className="w-8 h-8 text-blue-400 mb-3" />
                <p className="text-3xl font-bold text-white">{formatCurrency(summary.total_spend)}</p>
                <p className="text-sm text-gray-400 mt-1">Total Ad Spend</p>
              </div>
              <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-700 rounded-xl p-6">
                <TrendingUp className="w-8 h-8 text-green-400 mb-3" />
                <p className="text-3xl font-bold text-white">{formatCurrency(summary.total_revenue)}</p>
                <p className="text-sm text-gray-400 mt-1">Total Revenue</p>
              </div>
              <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border border-orange-700 rounded-xl p-6">
                <DollarSign className="w-8 h-8 text-orange-400 mb-3" />
                <p className="text-3xl font-bold text-white">{summary.avg_roas?.toFixed(2)}x</p>
                <p className="text-sm text-gray-400 mt-1">Avg ROAS</p>
              </div>
              <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-700 rounded-xl p-6">
                <Users className="w-8 h-8 text-purple-400 mb-3" />
                <p className="text-3xl font-bold text-white">{summary.total_clicks?.toLocaleString()}</p>
                <p className="text-sm text-gray-400 mt-1">Total Clicks</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {monthlyTrends.length > 0 && (
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-bold text-white mb-4">Monthly Performance</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip contentStyle={{backgroundColor:'#1F2937',border:'1px solid #374151',color:'#fff'}} />
                      <Line type="monotone" dataKey="spend" stroke="#3B82F6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {channelData.length > 0 && (
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-bold text-white mb-4">Channel Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={channelData} dataKey="spend" nameKey="channel" cx="50%" cy="50%" outerRadius={100} label>
                        {channelData.map((e,i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{backgroundColor:'#1F2937',border:'1px solid #374151',color:'#fff'}} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div>
            {loading && <div className="text-white text-center py-8">Loading campaigns...</div>}
            {!loading && campaigns.length === 0 && (
              <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
                <p className="text-gray-400">No campaign data available for this period</p>
              </div>
            )}
            {!loading && campaigns.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Campaign Performance</h3>
            <p className="text-gray-400">Campaign details will be displayed here</p>
          </div>
        )}

            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Product Performance</h3>
            <p className="text-gray-400">Product details will be displayed here</p>
          </div>
        )}

        {activeTab === 'channels' && channelData.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Channel Performance</h3>
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Channel</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Spend</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Revenue</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">ROAS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {channelData.map((ch, idx) => (
                  <tr key={idx} className="hover:bg-gray-700/30">
                    <td className="px-6 py-4 text-sm font-medium text-white">{ch.channel}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{formatCurrency(ch.spend)}</td>
                    <td className="px-6 py-4 text-sm text-green-400">{formatCurrency(ch.revenue)}</td>
                    <td className="px-6 py-4 text-sm text-orange-400 font-bold">{ch.roas?.toFixed(2)}x</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
