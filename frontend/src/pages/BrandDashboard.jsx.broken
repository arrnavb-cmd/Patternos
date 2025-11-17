import React from "react";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, TrendingUp, Eye, MousePointer, ShoppingCart, 
  Target, BarChart3, Zap, Mic, Brain, ArrowRight, Calendar
, Package } from 'lucide-react';

export default function BrandDashboard() {
  const [loading, setLoading] = useState(true);
  const [brandData, setBrandData] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const brand = localStorage.getItem("brand") || "Himalaya";
  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount) || amount === 0) return '₹0';
    if (amount >= 10000000) return '₹' + (amount / 10000000).toFixed(1) + 'Cr';
    if (amount >= 100000) return '₹' + (amount / 100000).toFixed(1) + 'L';
    if (amount >= 1000) return '₹' + (amount / 1000).toFixed(1) + 'K';
    return '₹' + Math.round(amount).toLocaleString();
  };

  const formatNumber = (num) => {
    if (!num || isNaN(num) || num === 0) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.round(num).toLocaleString();
  };

  const formatPercentage = (num) => {
    if (!num || isNaN(num)) return '0%';
    return num.toFixed(2) + '%';
  };

  const [user, setUser] = useState(null);
  const [metrics, setMetrics] = useState({
    totalSpend: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    attributedSales: 0,
    roas: 0,
    activeCampaigns: 0,
    ctr: 0,
    conversionRate: 0
  });
  const [intentData, setIntentData] = useState({
    highIntent: 0,
    mediumIntent: 0,
    lowIntent: 0
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(storedUser);
    
    // Fetch real metrics from API
    const fetchMetrics = async () => {
      try {
        console.log(`�� Fetching ${brand} metrics from API...`);
        const response = await fetch(`http://localhost:8000/api/v1/campaigns/all?brand=${brand}`);
        console.log('📡 Response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('✅ API data received:', data);
          const summary = data.summary || {};
          console.log('📊 Summary data:', summary);
          setMetrics({
            totalSpend: summary.total_spend || 0,
            impressions: summary.total_impressions || 0,
            clicks: summary.total_clicks || 0,
            ctr: summary.avg_ctr || 0,
            conversionRate: summary.avg_conversion_rate || 0,
            attributedSales: summary.total_revenue || 0,
            roas: summary.avg_roas || 0,
            activeCampaigns: summary.active_campaigns || summary.total_campaigns || 0
          });
          setCampaigns(data.campaigns || []);
        }
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      }
    };
    
    fetchMetrics();
    
    // Fetch brand performance data
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    navigate("/login", { replace: true });
  };
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
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Performance insights & reports',
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-500',
      route: `/brand/${brand}/analytics`
    }
  ];

  // Use real campaigns from API, sorted by spend
  // Aggregate product data by category (treating each category as product line)
  const productsByCategory = {};
  campaigns.forEach(c => {
    const cat = c.category || 'Other';
    if (!productsByCategory[cat]) {
      productsByCategory[cat] = {
        name: `${brand} ${cat}`,
        category: cat,
        spend: 0,
        revenue: 0,
        conversions: 0,
        impressions: 0,
        clicks: 0,
        campaigns: 0
      };
    }
    productsByCategory[cat].spend += c.total_spend || 0;
    productsByCategory[cat].revenue += c.revenue || 0;
    productsByCategory[cat].conversions += c.conversions || 0;
    productsByCategory[cat].impressions += c.impressions || 0;
    productsByCategory[cat].clicks += c.clicks || 0;
    productsByCategory[cat].campaigns += 1;
  });

  const topProducts = Object.values(productsByCategory)
    .map(p => ({
      ...p,
      roas: p.spend > 0 ? (p.revenue / p.spend).toFixed(2) : 0,
      ctr: p.impressions > 0 ? ((p.clicks / p.impressions) * 100).toFixed(2) : 0,
      conversionRate: p.clicks > 0 ? ((p.conversions / p.clicks) * 100).toFixed(2) : 0
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">

      <div className="max-w-7xl mx-auto px-4">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 mb-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {brand}! 👟
          </h1>
          <p className="text-orange-100">
            Your campaigns are performing {metrics.roas > 5 ? 'excellently' : 'well'} - {metrics.roas ? metrics.roas.toFixed(1) : "0"}x ROAS
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="text-green-400" size={28} />
              <span className="text-green-400 text-sm font-semibold">+18.3%</span>
            </div>
            <p className="text-gray-400 text-sm">Total Ad Spend</p>
            <p className="text-3xl font-bold text-white mt-1">
              {formatCurrency(metrics.totalSpend)}
            </p>
            <p className="text-xs text-gray-400 mt-2">This month</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <Eye className="text-blue-400" size={28} />
            </div>
            <p className="text-gray-400 text-sm">Total Impressions</p>
            <p className="text-3xl font-bold text-white mt-1">
              {formatNumber(metrics.impressions)}
            </p>
            <p className="text-xs text-blue-400 mt-2">CTR: {metrics.ctr}%</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <ShoppingCart className="text-purple-400" size={28} />
            </div>
            <p className="text-gray-400 text-sm">Attributed Sales</p>
            <p className="text-3xl font-bold text-white mt-1">
              {formatCurrency(metrics.attributedSales)}
            </p>
            <p className="text-xs text-green-400 mt-2">Conv: {metrics.conversionRate}%</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="text-yellow-400" size={28} />
            </div>
            <p className="text-gray-400 text-sm">ROAS</p>
            <p className="text-3xl font-bold text-white mt-1">{metrics.roas ? metrics.roas.toFixed(1) : "0"}x</p>
            <p className="text-xs text-yellow-400 mt-2">{metrics.activeCampaigns} active campaigns</p>
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
            <h2 className="text-xl font-bold text-white">Top Performing Products</h2>
            <button
              onClick={() => navigate('/campaigns')}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-2"
            >
              View All
              <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="space-y-3">
            {topProducts.map((product, idx) => (
              <div
                key={idx}
                className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 hover:border-purple-500 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-purple-500 to-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold">
                    #{idx + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{product.name}</h3>
                    <p className="text-sm text-gray-400">
                      Spend: ₹{(product.spend / 100000).toFixed(1)}L • {product.status}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white">
                    ₹{(product.sales / 100000).toFixed(1)}L
                  </p>
                  <p className="text-sm text-green-400">{product.roas}x ROAS</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
