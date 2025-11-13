import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, TrendingUp, Users, AlertTriangle, Target, BarChart3, Wallet } from 'lucide-react';

export default function MasterDashboard() {
  const navigate = useNavigate();
  const [intentStats, setIntentStats] = useState(null);
  const [commerceData, setCommerceData] = useState(null);
  const [platformRevenue, setPlatformRevenue] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [intentRes, commerceRes, platformRes, brandsRes, oppsRes] = await Promise.all([
        fetch('http://localhost:8000/api/master/intent-stats?clientId=zepto'),
        fetch('http://localhost:8000/api/master/dashboard-v2?clientId=zepto'),
        fetch('http://localhost:8000/api/master/platform-revenue?clientId=zepto'),
        fetch('http://localhost:8000/api/master/brand-performance-v2'),
        fetch('http://localhost:8000/api/master/revenue-opportunities?clientId=zepto&minScore=0.7')
      ]);
      
      const intentData = await intentRes.json();
      const commerceData = await commerceRes.json();
      const platformData = await platformRes.json();
      const brandsData = await brandsRes.json();
      const oppsData = await oppsRes.json();
      
      const transformedCommerce = {
        summary: {
          totalRevenue: commerceData.total_gmv || 0,
          attributedRevenue: commerceData.attributed_revenue || 0,
          attributionRate: commerceData.total_gmv > 0 ? Math.round((commerceData.attributed_revenue / commerceData.total_gmv) * 100) : 0
        },
        brands: brandsData.brands || []
      };
      
      setIntentStats(intentData);
      setCommerceData(transformedCommerce);
      setPlatformRevenue(platformData);
      setOpportunities(oppsData.opportunities || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return '₹0';
    if (amount >= 10000000) return '₹' + (amount / 10000000).toFixed(1) + 'Cr';
    if (amount >= 100000) return '₹' + (amount / 100000).toFixed(1) + 'L';
    return '₹' + amount.toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading dashboard...</div>
      </div>
    );
  }

  const platformMetrics = [
    { 
      label: 'Total GMV', 
      value: formatCurrency(commerceData?.summary?.totalRevenue || 0), 
      subtext: 'All purchases', 
      icon: DollarSign, 
      color: 'text-blue-400' 
    },
    { 
      label: 'Attributed Revenue', 
      value: formatCurrency(commerceData?.summary?.attributedRevenue || 0), 
      subtext: `${commerceData?.summary?.attributionRate || 0}% from ads`, 
      icon: TrendingUp, 
      color: 'text-green-400' 
    },
    { 
      label: 'Users Tracked', 
      value: intentStats?.totalUsers || 0, 
      subtext: 'Active shoppers', 
      icon: Users, 
      color: 'text-purple-400' 
    },
    { 
      label: 'High Intent Users', 
      value: intentStats?.intentDistribution?.high || 0, 
      subtext: 'Ready to purchase', 
      icon: Target, 
      color: 'text-orange-400' 
    }
  ];

  const highIntentCount = intentStats?.intentDistribution?.high || 0;
  
  // Get top 5 brands by revenue
  const topBrands = (Array.isArray(commerceData?.brands) ? commerceData.brands : []).sort((a, b) => (b.revenue || 0) - (a.revenue || 0)).slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Zepto Master Dashboard</h1>
          <p className="text-slate-400">Real-time commerce & advertising intelligence</p>
        </div>

        {/* Platform Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {platformMetrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div key={idx} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-lg ${metric.color.replace('text', 'bg').replace('400', '500/20')} flex items-center justify-center`}>
                    <Icon className={metric.color} size={24} />
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-1">{metric.label}</p>
                <p className="text-3xl font-bold text-white mb-1">{metric.value}</p>
                <p className="text-sm text-green-400">{metric.subtext}</p>
              </div>
            );
          })}
        </div>

        {/* Platform Revenue Section */}
        {platformRevenue && (
          <div className="mb-8 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Wallet className="text-purple-400" size={24} />
              <div>
                <h3 className="text-lg font-bold text-white">PatternOS Platform Revenue</h3>
                <p className="text-slate-400 text-sm">Zepto's earnings from advertising platform</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-1">Monthly Retainer</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(platformRevenue.monthly_retainer || 300000)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Fixed platform fee
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-1">Ad Commission (10%)</p>
                <p className="text-2xl font-bold text-purple-400">
                  {formatCurrency(platformRevenue.ad_commission)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  From {formatCurrency(platformRevenue.total_ad_spend || platformRevenue.totalAdSpend)} ad spend
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-1">High-Intent Premium (20%)</p>
                <p className="text-2xl font-bold text-blue-400">
                  {formatCurrency(platformRevenue.high_intent_premium || platformRevenue.platformIntentShare)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  From {formatCurrency(platformRevenue.high_intent_campaign_spend || 0)} high-intent campaigns
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border-2 border-purple-500/50">
                <p className="text-slate-400 text-sm mb-1">Total Platform Revenue</p>
                <p className="text-3xl font-bold text-white">
                  {formatCurrency(platformRevenue.total_revenue)}
                </p>
                <p className="text-xs text-green-400 mt-1">Per month (incl. retainer)</p>
              </div>
            </div>
          </div>
        )}

        {/* High Intent Alert */}
        <div className="mb-8 bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="text-orange-400" size={24} />
            <div>
              <h3 className="text-lg font-bold text-white">{highIntentCount} High-Intent Users Detected</h3>
              <p className="text-slate-400 text-sm">Contact brands immediately to capture revenue</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/intent')}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
          >
            View Intent Intelligence →
          </button>
        </div>

        {/* Revenue Opportunities by Category */}
        <div className="mb-8 bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Revenue Opportunities by Category</h2>
              <p className="text-sm text-slate-400">Real-time data from Intent Intelligence database</p>
            </div>
          </div>
          {opportunities.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              No high-intent opportunities detected yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(Array.isArray(opportunities) ? opportunities : []).map((opp, idx) => (
                <div key={idx} className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-bold capitalize">{opp.category}</h3>
                    <span className="text-green-400 font-bold text-sm">{opp.campaigns} campaigns</span>
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="text-sm text-slate-400">
                      Revenue: <span className="text-white font-medium">{formatCurrency(opp.revenue)}</span>
                    </div>
                    <div className="text-sm text-slate-400">
                      Conversions: <span className="text-white font-medium">{opp.conversions?.toLocaleString()}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate('/intent/high-intent')}
                    className="w-full text-sm text-blue-400 hover:text-blue-300 text-center py-2 border border-slate-600 rounded hover:border-blue-500 transition-colors"
                  >
                    View all {opp.users} users →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top 5 Brands Performance */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="text-blue-400" size={24} />
            <div>
              <h2 className="text-xl font-bold text-white">Top 5 Brand Performance</h2>
              <p className="text-sm text-slate-400">Highest revenue generating brands</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Rank</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Brand</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Ad Spend</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Revenue</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">ROAS</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Purchases</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">CTR</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Conv Rate</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Channels</th>
                </tr>
              </thead>
              <tbody>
                {topBrands.map((brand, idx) => (
                  <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td className="py-4 px-4">
                      <span className="text-white font-bold text-lg">#{idx + 1}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-white font-medium">{brand.brand}</span>
                    </td>
                    <td className="py-4 px-4 text-slate-300">{formatCurrency(brand.revenue)}</td>
                    <td className="py-4 px-4 text-green-400 font-medium">{brand.campaigns}</td>
                    <td className="py-4 px-4 text-blue-400">{brand.impressions?.toLocaleString()}</td>
                    <td className="py-4 px-4 text-purple-400">{brand.clicks?.toLocaleString()}</td>
                    <td className="py-4 px-4 text-orange-400">{brand.orders?.toLocaleString()}</td>
                    <td className="py-4 px-4 text-slate-300">{brand.clicks && brand.impressions ? ((brand.clicks/brand.impressions)*100).toFixed(2) : 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-center">
            <button 
              onClick={() => navigate('/analytics')}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              View all brands →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
