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
    if (amount >= 10000000) return '₹' + Math.round(amount / 10000000) + 'Cr';
    if (amount >= 100000) return '₹' + Math.round(amount / 100000) + 'L';
    return '₹' + Math.round(amount).toLocaleString();
  };

  const downloadCSV = (data, filename) => {
    const csv = [Object.keys(data[0]).join(','), ...data.map(row => Object.values(row).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
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
                <p className="text-3xl font-bold text-white">{Math.round(summary.avg_roas)}x</p>
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Campaign Performance</h2>
              <button onClick={() => downloadCSV(campaigns, `${brandName}_campaigns.csv`)} 
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Download size={20} /> Download Report
              </button>
            </div>
            
            {campaigns.length > 0 ? (
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-white mb-4">Top Campaigns by Spend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={campaigns.slice(0,10)} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis type="number" stroke="#9CA3AF" />
                        <YAxis type="category" dataKey="campaign_id" stroke="#9CA3AF" width={80} />
                        <Tooltip contentStyle={{backgroundColor:'#1F2937',border:'1px solid #374151'}} />
                        <Bar dataKey="spend" fill="#3B82F6" radius={[0,8,8,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-white mb-4">Intent Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie data={[
                          {name: 'High', value: campaigns.filter(c=>c.intent_level==='High').length},
                          {name: 'Medium', value: campaigns.filter(c=>c.intent_level==='Medium').length},
                          {name: 'Low', value: campaigns.filter(c=>c.intent_level==='Low').length}
                        ]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                          <Cell fill="#EF4444" />
                          <Cell fill="#F59E0B" />
                          <Cell fill="#10B981" />
                        </Pie>
                        <Tooltip contentStyle={{backgroundColor:'#1F2937',border:'1px solid #374151'}} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <table className="w-full">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Campaign</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Channel</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Intent</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Spend</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Conversions</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">CTR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {campaigns.map((c, idx) => (
                        <tr key={idx} className="hover:bg-gray-700/30">
                          <td className="px-6 py-4 text-sm font-medium text-white">{c.campaign_id}</td>
                          <td className="px-6 py-4 text-sm text-gray-300">{c.channel}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs ${c.intent_level==='High'?'bg-red-500/20 text-red-400':c.intent_level==='Medium'?'bg-yellow-500/20 text-yellow-400':'bg-gray-500/20 text-gray-400'}`}>
                              {c.intent_level}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">{formatCurrency(c.spend)}</td>
                          <td className="px-6 py-4 text-sm text-blue-400">{c.conversions?.toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm text-gray-300">{Math.round(c.ctr)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
                <p className="text-gray-400">No campaign data available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Product Performance</h2>
              <button onClick={() => downloadCSV(products, `${brandName}_products.csv`)} 
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Download size={20} /> Download Report
              </button>
            </div>

            {products.length > 0 ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {products.slice(0,3).map((p, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
                      <div className="text-sm text-gray-400 mb-2">#{idx+1} Top Product</div>
                      <h4 className="text-lg font-bold text-white mb-1">{p.sku_name}</h4>
                      <div className="text-2xl font-bold text-green-400">{formatCurrency(p.revenue)}</div>
                      <div className="text-sm text-gray-500">Revenue</div>
                      <div className="mt-2 text-xl font-bold text-orange-400">{Math.round(p.roas)}x</div>
                      <div className="text-xs text-gray-500">ROAS</div>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
                  <h3 className="text-lg font-bold text-white mb-4">Product Revenue</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={products.slice(0,10)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="sku_name" stroke="#9CA3AF" angle={-45} textAnchor="end" height={100} />
                      <YAxis stroke="#9CA3AF" tickFormatter={(v)=>formatCurrency(v)} />
                      <Tooltip contentStyle={{backgroundColor:'#1F2937',border:'1px solid #374151'}} />
                      <Bar dataKey="revenue" fill="#10B981" radius={[8,8,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <table className="w-full">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Product</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Category</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Spend</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Revenue</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">ROAS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {products.map((p, idx) => (
                        <tr key={idx} className="hover:bg-gray-700/30">
                          <td className="px-6 py-4 text-sm font-medium text-white">{p.sku_name}</td>
                          <td className="px-6 py-4 text-sm text-gray-300">{p.category_level_1 || '-'}</td>
                          <td className="px-6 py-4 text-sm text-gray-300">{formatCurrency(p.spend)}</td>
                          <td className="px-6 py-4 text-sm text-green-400">{formatCurrency(p.revenue)}</td>
                          <td className="px-6 py-4 text-sm text-orange-400 font-bold">{Math.round(p.roas)}x</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
                <p className="text-gray-400">No product data available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'channels' && channelData.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Channel Performance</h2>
              <button onClick={() => downloadCSV(channelData, `${brandName}_channels.csv`)} 
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Download size={20} /> Download Report
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4">Channel Mix</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={channelData} dataKey="spend" nameKey="channel" cx="50%" cy="50%" outerRadius={100} label>
                      {channelData.map((e,i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{backgroundColor:'#1F2937',border:'1px solid #374151'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4">Channel Conversions</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={channelData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="channel" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{backgroundColor:'#1F2937',border:'1px solid #374151'}} />
                    <Bar dataKey="conversions" fill="#10B981" radius={[8,8,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Channel</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Spend</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Revenue</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">ROAS</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Conversions</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">CTR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {channelData.map((ch, idx) => (
                    <tr key={idx} className="hover:bg-gray-700/30">
                      <td className="px-6 py-4 text-sm font-medium text-white">{ch.channel}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{formatCurrency(ch.spend)}</td>
                      <td className="px-6 py-4 text-sm text-green-400">{formatCurrency(ch.revenue)}</td>
                      <td className="px-6 py-4 text-sm text-orange-400 font-bold">{Math.round(ch.roas)}x</td>
                      <td className="px-6 py-4 text-sm text-blue-400">{ch.conversions?.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{ch.ctr}%</td>
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
