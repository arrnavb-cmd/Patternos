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
  
  useEffect(() => {
    fetchData();
  }, [brandPeriod]);
  
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
      
      const intentData = await intentRes.json();
      const commerceData = await commerceRes.json();
      const platformData = await platformRes.json();
      const brandsData = await brandsRes.json();
      const oppsData = await oppsRes.json();
      const visualData = await visualRes.json();
      const voiceData = await voiceRes.json();
      const scoringData = await scoringRes.json();
      
      setIntentStats(intentData);
      setCommerceData(commerceData);
      setPlatformRevenue(platformData);
      setOpportunities(oppsData.opportunities || []);
      setVisualData(visualData);
      setVoiceData(voiceData);
      setScoringSummary(scoringData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">PatternOS Master Dashboard</h1>
        <p className="text-gray-600">Retail Media Intelligence Overview</p>
      </div>

      {/* Period Selector */}
      <div className="mb-6 flex gap-4">
        <select 
          value={period} 
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Platform Revenue</p>
              <p className="text-2xl font-bold">₹{platformRevenue?.totalRevenue?.toLocaleString() || '0'}</p>
            </div>
            <DollarSign className="h-10 w-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Intents</p>
              <p className="text-2xl font-bold">{intentStats?.totalIntents?.toLocaleString() || '0'}</p>
            </div>
            <Target className="h-10 w-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">High Intent Users</p>
              <p className="text-2xl font-bold">{intentStats?.highIntentUsers?.toLocaleString() || '0'}</p>
            </div>
            <Users className="h-10 w-10 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Conversion Rate</p>
              <p className="text-2xl font-bold">{commerceData?.conversionRate?.toFixed(2) || '0'}%</p>
            </div>
            <TrendingUp className="h-10 w-10 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Intelligence Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Visual Intelligence
          </h3>
          <div className="space-y-2">
            <p>Total Scans: {visualData?.totalScans?.toLocaleString() || '0'}</p>
            <p>Products Identified: {visualData?.productsIdentified?.toLocaleString() || '0'}</p>
            <p>Accuracy: {visualData?.accuracy?.toFixed(1) || '0'}%</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Wallet className="h-5 w-5 text-green-600" />
            Voice Intelligence
          </h3>
          <div className="space-y-2">
            <p>Voice Queries: {voiceData?.totalQueries?.toLocaleString() || '0'}</p>
            <p>Languages: {voiceData?.languagesSupported || '0'}</p>
            <p>Success Rate: {voiceData?.successRate?.toFixed(1) || '0'}%</p>
          </div>
        </div>
      </div>

      {/* Revenue Opportunities */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          Revenue Opportunities
        </h3>
        {opportunities.length > 0 ? (
          <div className="space-y-3">
            {opportunities.slice(0, 5).map((opp, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span>{opp.description}</span>
                <span className="font-semibold text-green-600">₹{opp.value?.toLocaleString()}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No opportunities at this time</p>
        )}
      </div>
    </div>
  );
}
