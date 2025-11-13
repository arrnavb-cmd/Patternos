import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentBrand } from '../utils/brandUtils';

import { 
  DollarSign, TrendingUp, Eye, MousePointer, ShoppingCart, 
  Target, BarChart3, Zap, Mic, Brain, ArrowRight, Calendar
} from 'lucide-react';

export default function BrandDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(storedUser);
    
    // Fetch brand-specific metrics
    const fetchMetrics = async () => {
      try {
        const brandName = storedUser.username || 'himalaya';
        
        // Fetch analytics for ROAS
        const analyticsRes = await fetch(`http://localhost:8000/api/v1/brand/analytics/${brandName}`);
        const analyticsData = await analyticsRes.json();
        const res = await fetch(`http://localhost:8000/api/v1/brand/dashboard/${brandName}`);
        const data = await res.json();
        if (!data.error) {
          setMetrics({...data, roas: analyticsData.overview?.roas || 0});
        }
      } catch (err) {
        console.error('Failed to load metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMetrics();
  }, []);




  const intelligenceModules = [
    {
      id: 'behavioral',
      title: 'Behavioral',
      description: 'Search patterns & intent signals',
      icon: TrendingUp,
      gradient: 'from-blue-500 to-cyan-500',
      route: '/intelligence/behavioral'
    },
    {
      id: 'visual',
      title: 'Visual',
      description: 'Computer vision & shelf analytics',
      icon: Eye,
      gradient: 'from-pink-500 to-rose-500',
      route: '/intelligence/visual'
    },
    {
      id: 'voice',
      title: 'Voice',
      description: 'Conversational commerce',
      icon: Mic,
      gradient: 'from-red-500 to-orange-500',
      route: '/intelligence/voice'
    },
    {
      id: 'predictive',
      title: 'Predictive',
      description: 'Pre-intent forecasting',
      icon: Brain,
      gradient: 'from-purple-500 to-indigo-500',
      route: '/intelligence/predictive'
    }
  ];

  const topCampaigns = [
  ];

  if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  }
  
  if (!metrics) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-400">Failed to load data</div>;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      

      <div className="max-w-7xl mx-auto px-4">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 mb-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {getCurrentBrand().brandName}! 🚀
          </h1>
          <p className="text-orange-100">
            Managing ₹{((metrics.total_revenue || 0) / 10000000).toFixed(2)}Cr revenue from {(metrics.total_orders || 0).toLocaleString()} orders
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="text-green-400" size={28} />
              <span className="text-green-400 text-sm font-semibold">+18.3%</span>
            </div>
            <p className="text-gray-400 text-sm">Total Revenue</p>
            <p className="text-3xl font-bold text-white mt-1">
              ₹{((metrics.total_revenue || 0) / 10000000).toFixed(2)}Cr
            </p>
            <p className="text-xs text-gray-400 mt-2">All time revenue</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <Eye className="text-blue-400" size={28} />
            </div>
            <p className="text-gray-400 text-sm">Total Orders</p>
            <p className="text-3xl font-bold text-white mt-1">
              {(metrics.total_orders || 0).toLocaleString()}
            </p>
            <p className="text-xs text-blue-400 mt-2">Monthly: {(metrics.monthly_orders || 0).toLocaleString()}</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <ShoppingCart className="text-purple-400" size={28} />
            </div>
            <p className="text-gray-400 text-sm">Avg Order Value</p>
            <p className="text-3xl font-bold text-white mt-1">
              ₹{Math.round((metrics.avg_order_value || 0))}
            </p>
            <p className="text-xs text-green-400 mt-2">From {(metrics.total_orders || 0).toLocaleString()} orders</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="text-yellow-400" size={28} />
            </div>
            <p className="text-gray-400 text-sm">ROAS</p>
            <p className="text-3xl font-bold text-white mt-1">₹{((metrics.total_revenue || 0) / 10000000).toFixed(2)}Cr</p>
            <p className="text-xs text-yellow-400 mt-2">Last 30 days</p>
          </div>
        </div>

        {/* PatternOS Intelligence Modules */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">PatternOS Intelligence Modules</h2>
          <p className="text-gray-400 mb-6">
            Use our AI-powered modules to create and optimize your campaigns
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {intelligenceModules.map(module => {
              const Icon = module.icon;
              if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  }
  
  if (!metrics) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-400">Failed to load data</div>;
  }
  
  return (
                <div
                  key={module.id}
                  onClick={() => navigate(module.route)}
                  className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-blue-500 hover:scale-105 transition-all cursor-pointer shadow-xl"
                >
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${module.gradient} flex items-center justify-center mb-4`}>
                    <Icon className="text-white" size={32} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{module.description}</p>
                  
                  <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                    <span className="text-sm font-medium">Launch</span>
                    <ArrowRight className="ml-2" size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Campaign Performance */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Top Performing Campaigns</h2>
            <button
              onClick={() => navigate('/campaigns')}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-2"
            >
              View All
              <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="space-y-3">
            {topCampaigns.map((campaign, idx) => (
              <div
                key={idx}
                className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 hover:border-purple-500 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-purple-500 to-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold">
                    #{idx + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{campaign.name}</h3>
                    <p className="text-sm text-gray-400">
                      Spend: ₹{(campaign.spend / 100000).toFixed(1)}L • {campaign.status}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white">
                    ₹{(campaign.sales / 100000).toFixed(1)}L
                  </p>
                  <p className="text-sm text-green-400">{campaign.roas}x ROAS</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
