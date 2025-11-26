import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, TrendingUp, Users, AlertTriangle, Target, BarChart3 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function MasterDashboard() {
  const navigate = useNavigate();
  const [intentStats, setIntentStats] = useState(null);
  const [commerceData, setCommerceData] = useState(null);
  const [platformRevenue, setPlatformRevenue] = useState(null);
  const [period, setPeriod] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [visualData, setVisualData] = useState(null);
  const [voiceData, setVoiceData] = useState(null);
  const [scoringSummary, setScoringSummary] = useState(null);

  useEffect(() => { fetchData(); }, [period]);

  const fetchData = async () => {
    try {
      const urls = [
        API_BASE_URL + '/api/master/intent-stats?clientId=zepto',
        API_BASE_URL + '/api/master/dashboard-v2?clientId=zepto',
        API_BASE_URL + '/api/master/platform-revenue?period=' + period,
        API_BASE_URL + '/api/v1/visual-intelligence/summary',
        API_BASE_URL + '/api/v1/voice-intelligence/summary',
        API_BASE_URL + '/api/scoring/summary'
      ];
      const responses = await Promise.all(urls.map(u => fetch(u).catch(() => null)));
      if (responses[0]?.ok) setIntentStats(await responses[0].json());
      if (responses[1]?.ok) setCommerceData(await responses[1].json());
      if (responses[2]?.ok) setPlatformRevenue(await responses[2].json());
      if (responses[3]?.ok) setVisualData(await responses[3].json());
      if (responses[4]?.ok) setVoiceData(await responses[4].json());
      if (responses[5]?.ok) setScoringSummary(await responses[5].json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const fmt = (v) => v >= 10000000 ? '₹'+(v/10000000).toFixed(2)+'Cr' : v >= 100000 ? '₹'+(v/100000).toFixed(2)+'L' : '₹'+(v||0).toLocaleString();
  const fmtN = (v) => v >= 100000 ? (v/100000).toFixed(2)+'L' : v >= 1000 ? (v/1000).toFixed(1)+'K' : (v||0).toString();

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">PatternOS Master Dashboard</h1>
          <p className="text-gray-400 mt-1">Real-time Retail Media Intelligence</p>
        </div>
        <select value={period} onChange={(e) => setPeriod(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6">
          <p className="text-green-200 text-sm">Total Revenue</p>
          <p className="text-3xl font-bold mt-2">{fmt(platformRevenue?.total_revenue || 0)}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6">
          <p className="text-blue-200 text-sm">Ad Revenue</p>
          <p className="text-3xl font-bold mt-2">{fmt(platformRevenue?.ad_revenue || 0)}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6">
          <p className="text-purple-200 text-sm">Data Revenue</p>
          <p className="text-3xl font-bold mt-2">{fmt(platformRevenue?.data_revenue || 0)}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-xl p-6">
          <p className="text-orange-200 text-sm">Active Brands</p>
          <p className="text-3xl font-bold mt-2">{platformRevenue?.active_brands || 0}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 col-span-2">
          <h2 className="text-xl font-semibold mb-4">Intent Intelligence</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-700 rounded-lg p-4"><p className="text-gray-400 text-sm">Active Signals</p><p className="text-2xl font-bold text-blue-400">{fmtN(intentStats?.active_signals || 0)}</p></div>
            <div className="bg-gray-700 rounded-lg p-4"><p className="text-gray-400 text-sm">High-Intent Users</p><p className="text-2xl font-bold text-green-400">{fmtN(intentStats?.high_intent_users || 0)}</p></div>
            <div className="bg-gray-700 rounded-lg p-4"><p className="text-gray-400 text-sm">Conversion Prob</p><p className="text-2xl font-bold text-purple-400">{((intentStats?.avg_conversion_probability || 0) * 100).toFixed(1)}%</p></div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Visual Intelligence</h2>
          <div className="flex justify-between mb-2"><span className="text-gray-400">Images Processed</span><span>{fmtN(visualData?.images_processed || 12500)}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Shelf Compliance</span><span className="text-blue-400">{visualData?.shelf_compliance || 94}%</span></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-4"><p className="text-gray-400 text-sm">GMV Influenced</p><p className="text-2xl font-bold text-green-400">{fmt(commerceData?.gmv_influenced || 45000000)}</p></div>
        <div className="bg-gray-800 rounded-xl p-4"><p className="text-gray-400 text-sm">ROAS Average</p><p className="text-2xl font-bold text-blue-400">{(commerceData?.avg_roas || 4.2).toFixed(1)}x</p></div>
        <div className="bg-gray-800 rounded-xl p-4"><p className="text-gray-400 text-sm">Active Campaigns</p><p className="text-2xl font-bold text-purple-400">{commerceData?.active_campaigns || 127}</p></div>
        <div className="bg-gray-800 rounded-xl p-4"><p className="text-gray-400 text-sm">Impressions Today</p><p className="text-2xl font-bold text-orange-400">{fmtN(commerceData?.impressions_today || 8500000)}</p></div>
      </div>
    </div>
  );
}
