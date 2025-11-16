import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, TrendingUp, DollarSign, Users, Download } from 'lucide-react';

export default function Analytics() {
  const [activeTab, setActiveTab] = useState('platform');
  const [dateRange, setDateRange] = useState('last_30_days');
  const [loading, setLoading] = useState(false);
  
  const [platformSummary, setPlatformSummary] = useState(null);
  const [channelData, setChannelData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const [summaryRes, channelRes, brandRes, trendsRes] = await Promise.all([
        fetch(`http://localhost:8000/api/v1/analytics/platform-summary?date_range=${dateRange}`),
        fetch(`http://localhost:8000/api/v1/analytics/channel-performance?date_range=${dateRange}`),
        fetch(`http://localhost:8000/api/v1/analytics/brand-comparison?date_range=${dateRange}`),
        fetch('http://localhost:8000/api/v1/analytics/monthly-trends')
      ]);

      const summary = await summaryRes.json();
      const channels = await channelRes.json();
      const brands = await brandRes.json();
      const trends = await trendsRes.json();

      setPlatformSummary(summary);
      setChannelData(channels.channels || []);
      setBrandData(brands.brands || []);
      setMonthlyTrends(trends.monthly_trends || []);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    if (amount >= 10000000) return '₹' + Math.round(amount / 10000000) + 'Cr';
    if (amount >= 100000) return '₹' + Math.round(amount / 100000) + 'L';
    return '₹' + Math.round(amount).toLocaleString();
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6'];

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
            <p className="text-gray-400 mt-1">Retail Media Network Performance</p>
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
            {['platform', 'brands'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`pb-4 px-2 text-sm font-medium ${activeTab === tab ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'platform' && (
          <div>
            {platformSummary && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700 rounded-xl p-6">
                  <BarChart3 className="w-8 h-8 text-blue-400 mb-3" />
                  <p className="text-3xl font-bold text-white">{formatCurrency(platformSummary.total_spend)}</p>
                  <p className="text-sm text-gray-400 mt-1">Total Ad Spend</p>
                </div>
                <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-700 rounded-xl p-6">
                  <TrendingUp className="w-8 h-8 text-green-400 mb-3" />
                  <p className="text-3xl font-bold text-white">{formatCurrency(platformSummary.total_revenue)}</p>
                  <p className="text-sm text-gray-400 mt-1">Total Revenue</p>
                </div>
                <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border border-orange-700 rounded-xl p-6">
                  <DollarSign className="w-8 h-8 text-orange-400 mb-3" />
                  <p className="text-3xl font-bold text-white">{Math.round(platformSummary.avg_roas)}x</p>
                  <p className="text-sm text-gray-400 mt-1">Avg ROAS</p>
                </div>
                <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-700 rounded-xl p-6">
                  <Users className="w-8 h-8 text-purple-400 mb-3" />
                  <p className="text-3xl font-bold text-white">{platformSummary.total_clicks?.toLocaleString()}</p>
                  <p className="text-sm text-gray-400 mt-1">Total Clicks</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {monthlyTrends.length > 0 && (
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">📈 Monthly Spend Trend</h3>
                    <Download size={20} className="text-blue-400 hover:text-blue-300 cursor-pointer" />
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" tickFormatter={(v) => `₹${(v/10000000)}Cr`} />
                      <Tooltip contentStyle={{backgroundColor:'#1F2937',border:'1px solid #374151',color:'#fff'}} />
                      <Line type="monotone" dataKey="spend" stroke="#3B82F6" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {channelData.length > 0 && (
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">📊 Channel Conversions</h3>
                    <Download size={20} className="text-blue-400 hover:text-blue-300 cursor-pointer" />
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={channelData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="channel" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip contentStyle={{backgroundColor:'#1F2937',border:'1px solid #374151',color:'#fff'}} />
                      <Bar dataKey="conversions" fill="#10B981" radius={[8,8,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {channelData.length > 0 && (
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">🥧 Channel Spend Mix</h3>
                    <Download size={20} className="text-blue-400 hover:text-blue-300 cursor-pointer" />
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={channelData} dataKey="spend" nameKey="channel" cx="50%" cy="50%" outerRadius={100}
                        label={(e) => `${e.channel}: ${((e.spend/channelData.reduce((s,c)=>s+c.spend,0))*100)}%`}>
                        {channelData.map((e,i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{backgroundColor:'#1F2937',border:'1px solid #374151',color:'#fff'}} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {monthlyTrends.length > 0 && (
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">📉 Engagement Trends</h3>
                    <Download size={20} className="text-blue-400 hover:text-blue-300 cursor-pointer" />
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" tickFormatter={(v) => `${(v/1000000)}M`} />
                      <Tooltip contentStyle={{backgroundColor:'#1F2937',border:'1px solid #374151',color:'#fff'}} />
                      <Legend />
                      <Area type="monotone" dataKey="impressions" stroke="#10B981" fill="#10B981" fillOpacity={0.3} name="Impressions" />
                      <Area type="monotone" dataKey="clicks" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} name="Clicks" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'brands' && brandData.length > 0 && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4">Brand Revenue Comparison</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={brandData.slice(0,10)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9CA3AF" tickFormatter={(v) => formatCurrency(v)} />
                    <YAxis type="category" dataKey="brand" stroke="#9CA3AF" width={100} />
                    <Tooltip contentStyle={{backgroundColor:'#1F2937',border:'1px solid #374151',color:'#fff'}} />
                    <Bar dataKey="revenue" fill="#10B981" radius={[0,8,8,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4">Brand Efficiency</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" dataKey="spend" stroke="#9CA3AF" name="Spend" />
                    <YAxis type="number" dataKey="roas" stroke="#9CA3AF" name="ROAS" />
                    <Tooltip contentStyle={{backgroundColor:'#1F2937',border:'1px solid #374151',color:'#fff'}} />
                    <Scatter data={brandData} fill="#8B5CF6" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Brand Performance Details</h3>
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Brand</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Spend</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Revenue</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">ROAS</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Conversions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {brandData.map((brand, idx) => (
                    <tr key={idx} className="hover:bg-gray-700/30">
                      <td className="px-6 py-4 text-sm font-medium text-white">{brand.brand}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{formatCurrency(brand.spend)}</td>
                      <td className="px-6 py-4 text-sm text-green-400">{formatCurrency(brand.revenue)}</td>
                      <td className="px-6 py-4 text-sm text-orange-400 font-bold">{Math.round(brand.roas)}x</td>
                      <td className="px-6 py-4 text-sm text-blue-400">{brand.conversions?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
