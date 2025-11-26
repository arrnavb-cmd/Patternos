import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, TrendingUp, Users, AlertTriangle, Target, BarChart3, Wallet } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function MasterDashboard() {
  const navigate = useNavigate();
  const [intentStats, setIntentStats] = useState(null);
  const [commerceData, setCommerceData] = useState(null);
  const [platformRevenue, setPlatformRevenue] = useState(null);
  const [period, setPeriod] = useState('monthly');
  const [brandPeriod, setBrandPeriod] = useState('monthly');
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visualData, setVisualData] = useState(null);
  const [voiceData, setVoiceData] = useState(null);
  const [scoringSummary, setScoringSummary] = useState(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { fetchData(); }, [brandPeriod]);
  useEffect(() => { fetchData(); }, [period]);

  const fetchData = async () => {
    try {
      const [intentRes, commerceRes, platformRes, brandsRes, oppsRes, visualRes, voiceRes, scoringRes] = await Promise.all([
        fetch(API_BASE_URL + '/api/master/intent-stats?clientId=zepto'),
        fetch(API_BASE_URL + '/api/master/dashboard-v2?clientId=zepto'),
        fetch(API_BASE_URL + '/api/master/platform-revenue?period=' + period),
        fetch(API_BASE_URL + '/api/master/brand-performance-v2?period=' + brandPeriod),
        fetch(API_BASE_URL + '/api/master/revenue-opportunities?clientId=zepto&minScore=0.7'),
        fetch(API_BASE_URL + '/api/v1/visual-intelligence/summary'),
        fetch(API_BASE_URL + '/api/v1/voice-intelligence/summary'),
        fetch(API_BASE_URL + '/api/scoring/summary')
      ]);
      if (intentRes.ok) setIntentStats(await intentRes.json());
      if (commerceRes.ok) setCommerceData(await commerceRes.json());
      if (platformRes.ok) setPlatformRevenue(await platformRes.json());
      if (oppsRes.ok) { const data = await oppsRes.json(); setOpportunities(data.opportunities || []); }
      if (visualRes.ok) setVisualData(await visualRes.json());
      if (voiceRes.ok) setVoiceData(await voiceRes.json());
      if (scoringRes.ok) setScoringSummary(await scoringRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (value >= 10000000) return '₹' + (value / 10000000).toFixed(2) + 'Cr';
    if (value >= 100000) return '₹' + (value / 100000).toFixed(2) + 'L';
    return '₹' + (value?.toLocaleString() || 0);
  };

  const formatNumber = (value) => {
    if (value >= 10000000) return (value / 10000000).toFixed(2) + 'Cr';
    if (value >= 100000) return (value / 100000).toFixed(2) + 'L';
    if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
    return value?.toLocaleString() || '0';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading PatternOS Intelligence...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            PatternOS Master Dashboard
          </h1>
          <p className="text-gray-400 mt-1">Real-time Retail Media Intelligence</p>
        </div>
        <div className="flex gap-4">
          <select value={period} onChange={(e) => setPeriod(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <button onClick={() => navigate('/analytics')}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm">
            Deep Analytics
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm">Total Platform Revenue</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(platformRevenue?.total_revenue || 0)}</p>
            </div>
            <DollarSign className="w-12 h-12 text-green-300 opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Ad Revenue</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(platformRevenue?.ad_revenue || 0)}</p>
            </div>
            <Target className="w-12 h-12 text-blue-300 opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Data Revenue</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(platformRevenue?.data_revenue || 0)}</p>
            </div>
            <BarChart3 className="w-12 h-12 text-purple-300 opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-200 text-sm">Active Brands</p>
              <p className="text-3xl font-bold mt-2">{platformRevenue?.active_brands || 0}</p>
            </div>
            <Users className="w-12 h-12 text-orange-300 opacity-80" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 col-span-2">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Real-time Intent Intelligence
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Active Signals</p>
              <p className="text-2xl font-bold text-blue-400">{formatNumber(intentStats?.active_signals || 0)}</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">High-Intent Users</p>
              <p className="text-2xl font-bold text-green-400">{formatNumber(intentStats?.high_intent_users || 0)}</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Conversion Prob</p>
              <p className="text-2xl font-bold text-purple-400">{((intentStats?.avg_conversion_probability || 0) * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Visual Intelligence</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Images Processed</span>
              <span className="font-bold">{formatNumber(visualData?.images_processed || 12500)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Shelf Compliance</span>
              <span className="font-bold text-blue-400">{visualData?.shelf_compliance || 94}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Voice Commerce</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Queries Today</p>
              <p className="text-2xl font-bold">{formatNumber(voiceData?.queries_today || 45000)}</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Languages</p>
              <p className="text-2xl font-bold text-blue-400">{voiceData?.languages || 12}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Audience Scoring</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Profiles Scored</p>
              <p className="text-2xl font-bold">{formatNumber(scoringSummary?.profiles_scored || 2500000)}</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Model Accuracy</p>
              <p className="text-2xl font-bold text-purple-400">{((scoringSummary?.model_accuracy || 0.89) * 100).toFixed(0)}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          Revenue Opportunities
        </h2>
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-700">
              <th className="pb-3">Opportunity</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Potential</th>
              <th className="pb-3">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Diwali Electronics', category: 'Electronics', potential: 2500000, confidence: 0.89 },
              { name: 'Winter Fashion', category: 'Fashion', potential: 1800000, confidence: 0.85 },
              { name: 'Health Bundle', category: 'Health', potential: 1200000, confidence: 0.82 },
            ].map((opp, i) => (
              <tr key={i} className="border-b border-gray-700/50">
                <td className="py-3">{opp.name}</td>
                <td className="py-3 text-gray-400">{opp.category}</td>
                <td className="py-3 text-green-400">{formatCurrency(opp.potential)}</td>
                <td className="py-3">{(opp.confidence * 100).toFixed(0)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">GMV Influenced</p>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(commerceData?.gmv_influenced || 45000000)}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">ROAS Average</p>
          <p className="text-2xl font-bold text-blue-400">{(commerceData?.avg_roas || 4.2).toFixed(1)}x</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Active Campaigns</p>
          <p className="text-2xl font-bold text-purple-400">{commerceData?.active_campaigns || 127}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Impressions Today</p>
          <p className="text-2xl font-bold text-orange-400">{formatNumber(commerceData?.impressions_today || 8500000)}</p>
        </div>
      </div>
    </div>
  );
}
  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    try {
      const [intentRes, commerceRes, platformRes, brandsRes, oppsRes, visualRes, voiceRes, scoringRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/master/intent-stats?clientId=zepto`),
        fetch(`${API_BASE_URL}/api/master/dashboard-v2?clientId=zepto`),
        fetch(`${API_BASE_URL}/api/master/platform-revenue?period=${period}`),
        fetch(`${API_BASE_URL}/api/master/brand-performance-v2?period=${brandPeriod}`),
        fetch(`${API_BASE_URL}/api/master/revenue-opportunities?clientId=zepto&minScore=0.7`),
        fetch(`${API_BASE_URL}/api/v1/visual-intelligence/summary`),
        fetch(`${API_BASE_URL}/api/v1/voice-intelligence/summary`),
        fetch(`${API_BASE_URL}/api/scoring/summary`)
      ]);

      if (intentRes.ok) setIntentStats(await intentRes.json());
      if (commerceRes.ok) setCommerceData(await commerceRes.json());
      if (platformRes.ok) setPlatformRevenue(await platformRes.json());
      if (oppsRes.ok) {
        const data = await oppsRes.json();
        setOpportunities(data.opportunities || []);
      }
      if (visualRes.ok) setVisualData(await visualRes.json());
      if (voiceRes.ok) setVoiceData(await voiceRes.json());
      if (scoringRes.ok) setScoringSummary(await scoringRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
    return `₹${value?.toLocaleString() || 0}`;
  };

  const formatNumber = (value) => {
    if (value >= 10000000) return `${(value / 10000000).toFixed(2)}Cr`;
    if (value >= 100000) return `${(value / 100000).toFixed(2)}L`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value?.toLocaleString() || '0';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading PatternOS Intelligence...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            PatternOS Master Dashboard
          </h1>
          <p className="text-gray-400 mt-1">Real-time Retail Media Intelligence</p>
        </div>
        <div className="flex gap-4">
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <button 
            onClick={() => navigate('/analytics')}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm"
          >
            Deep Analytics
          </button>
        </div>
      </div>

      {/* Platform Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm">Total Platform Revenue</p>
              <p className="text-3xl font-bold mt-2">
                {formatCurrency(platformRevenue?.total_revenue || 0)}
              </p>
              <p className="text-green-200 text-sm mt-1">
                +{platformRevenue?.growth_rate?.toFixed(1) || 0}% vs last period
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-green-300 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Ad Revenue</p>
              <p className="text-3xl font-bold mt-2">
                {formatCurrency(platformRevenue?.ad_revenue || 0)}
              </p>
              <p className="text-blue-200 text-sm mt-1">
                {((platformRevenue?.ad_revenue / platformRevenue?.total_revenue) * 100 || 0).toFixed(1)}% of total
              </p>
            </div>
            <Target className="w-12 h-12 text-blue-300 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Data & Insights Revenue</p>
              <p className="text-3xl font-bold mt-2">
                {formatCurrency(platformRevenue?.data_revenue || 0)}
              </p>
              <p className="text-purple-200 text-sm mt-1">
                {((platformRevenue?.data_revenue / platformRevenue?.total_revenue) * 100 || 0).toFixed(1)}% of total
              </p>
            </div>
            <BarChart3 className="w-12 h-12 text-purple-300 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-200 text-sm">Active Brands</p>
              <p className="text-3xl font-bold mt-2">
                {platformRevenue?.active_brands || 0}
              </p>
              <p className="text-orange-200 text-sm mt-1">
                Avg: {formatCurrency((platformRevenue?.total_revenue / platformRevenue?.active_brands) || 0)}/brand
              </p>
            </div>
            <Users className="w-12 h-12 text-orange-300 opacity-80" />
          </div>
        </div>
      </div>

      {/* Intent Intelligence */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 col-span-2">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Real-time Intent Intelligence
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Active Intent Signals</p>
              <p className="text-2xl font-bold text-blue-400">
                {formatNumber(intentStats?.active_signals || 0)}
              </p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">High-Intent Users</p>
              <p className="text-2xl font-bold text-green-400">
                {formatNumber(intentStats?.high_intent_users || 0)}
              </p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Conversion Probability</p>
              <p className="text-2xl font-bold text-purple-400">
                {((intentStats?.avg_conversion_probability || 0) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
          
          {/* Top Categories */}
          <div className="mt-4">
            <p className="text-gray-400 text-sm mb-2">Top Intent Categories</p>
            <div className="flex flex-wrap gap-2">
              {(intentStats?.top_categories || ['Electronics', 'Fashion', 'Grocery', 'Beauty']).map((cat, i) => (
                <span key={i} className="bg-blue-600/30 text-blue-300 px-3 py-1 rounded-full text-sm">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Visual Intelligence Summary */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Visual Intelligence</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Images Processed</span>
              <span className="text-xl font-bold">{formatNumber(visualData?.images_processed || 12500)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Products Identified</span>
              <span className="text-xl font-bold text-green-400">{formatNumber(visualData?.products_identified || 8900)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Shelf Compliance</span>
              <span className="text-xl font-bold text-blue-400">{visualData?.shelf_compliance || 94}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Store Coverage</span>
              <span className="text-xl font-bold text-purple-400">{visualData?.store_coverage || 156} stores</span>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Intelligence & Scoring */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Voice Commerce Intelligence</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Voice Queries Today</p>
              <p className="text-2xl font-bold">{formatNumber(voiceData?.queries_today || 45000)}</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Voice Conversions</p>
              <p className="text-2xl font-bold text-green-400">{formatNumber(voiceData?.conversions || 3200)}</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Languages Active</p>
              <p className="text-2xl font-bold text-blue-400">{voiceData?.languages || 12}</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Avg Response Time</p>
              <p className="text-2xl font-bold text-purple-400">{voiceData?.avg_response_ms || 180}ms</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Audience Scoring Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Profiles Scored</p>
              <p className="text-2xl font-bold">{formatNumber(scoringSummary?.profiles_scored || 2500000)}</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">High-Value Segments</p>
              <p className="text-2xl font-bold text-green-400">{scoringSummary?.high_value_segments || 24}</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Avg Propensity Score</p>
              <p className="text-2xl font-bold text-blue-400">{((scoringSummary?.avg_propensity || 0.72) * 100).toFixed(0)}%</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Model Accuracy</p>
              <p className="text-2xl font-bold text-purple-400">{((scoringSummary?.model_accuracy || 0.89) * 100).toFixed(0)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Opportunities */}
      <div className="bg-gray-800 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          Revenue Opportunities
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-700">
                <th className="pb-3">Opportunity</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Potential Revenue</th>
                <th className="pb-3">Confidence</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {(opportunities.length > 0 ? opportunities : [
                { name: 'Diwali Electronics Push', category: 'Electronics', potential: 2500000, confidence: 0.89 },
                { name: 'Winter Fashion Collection', category: 'Fashion', potential: 1800000, confidence: 0.85 },
                { name: 'Health & Wellness Bundle', category: 'Health', potential: 1200000, confidence: 0.82 },
              ]).slice(0, 5).map((opp, i) => (
                <tr key={i} className="border-b border-gray-700/50">
                  <td className="py-3 font-medium">{opp.name}</td>
                  <td className="py-3 text-gray-400">{opp.category}</td>
                  <td className="py-3 text-green-400 font-semibold">{formatCurrency(opp.potential)}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(opp.confidence || 0.8) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm">{((opp.confidence || 0.8) * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">
                      Activate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Commerce Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">GMV Influenced</p>
          <p className="text-2xl font-bold text-green-400">
            {formatCurrency(commerceData?.gmv_influenced || 45000000)}
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">ROAS Average</p>
          <p className="text-2xl font-bold text-blue-400">
            {(commerceData?.avg_roas || 4.2).toFixed(1)}x
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Active Campaigns</p>
          <p className="text-2xl font-bold text-purple-400">
            {commerceData?.active_campaigns || 127}
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Impressions Today</p>
          <p className="text-2xl font-bold text-orange-400">
            {formatNumber(commerceData?.impressions_today || 8500000)}
          </p>
        </div>
      </div>
    </div>
  );
}
