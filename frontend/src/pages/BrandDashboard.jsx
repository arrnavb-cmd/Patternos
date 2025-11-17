import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, TrendingUp, Target, Users, ArrowRight,
  Package, BarChart3
} from 'lucide-react';

export default function BrandDashboard() {
  const navigate = useNavigate();
  const brand = localStorage.getItem("brand") || "Himalaya";
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [metrics, setMetrics] = useState({
    totalGMV: 0,
    adSpend: 0,
    roas: 0,
    highIntentUsers: 0,
    totalCampaigns: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`📊 Fetching data for ${brand}...`);
        const response = await fetch(`http://localhost:8000/api/v1/campaigns/all?brand=${brand}`);
        
        if (!response.ok) {
          console.error('API Error:', response.status);
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        console.log('✅ Data received:', data);
        
        const summary = data.summary || {};
        const campaignsData = data.campaigns || [];
        
        // Calculate high intent users (campaigns with High intent)
        const highIntentCount = campaignsData.filter(c => c.intent_level === 'High').length;
        
        setMetrics({
          totalGMV: summary.total_revenue || 0,
          adSpend: summary.total_spend || 0,
          roas: summary.avg_roas || 0,
          highIntentUsers: highIntentCount * 156, // Mock calculation
          totalCampaigns: summary.total_campaigns || 0
        });
        
        setCampaigns(campaignsData);
        setLoading(false);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [brand]);

  // Aggregate products by category
  const productsByCategory = {};
  campaigns.forEach(c => {
    const cat = c.category || 'Other';
    if (!productsByCategory[cat]) {
      productsByCategory[cat] = {
        name: `${brand} ${cat}`,
        category: cat,
        campaigns: 0,
        spend: 0,
        revenue: 0,
        impressions: 0,
        clicks: 0,
        channel: c.channel
      };
    }
    productsByCategory[cat].campaigns += 1;
    productsByCategory[cat].spend += c.total_spend || 0;
    productsByCategory[cat].revenue += c.revenue || 0;
    productsByCategory[cat].impressions += c.impressions || 0;
    productsByCategory[cat].clicks += c.clicks || 0;
  });

  const topProducts = Object.values(productsByCategory)
    .map(p => ({
      ...p,
      roas: p.spend > 0 ? (p.revenue / p.spend).toFixed(2) : 0,
      ctr: p.impressions > 0 ? ((p.clicks / p.impressions) * 100).toFixed(2) : 0
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    if (amount >= 10000000) return '₹' + (amount / 10000000).toFixed(2) + 'Cr';
    if (amount >= 100000) return '₹' + (amount / 100000).toFixed(2) + 'L';
    return '₹' + Math.round(amount).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading {brand} dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Welcome back, {brand}! 🎯</h1>
          <p className="text-gray-400 mt-1">Your performance overview</p>
        </div>

        {/* Top Metrics - 4 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          
          <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="text-green-400" size={28} />
              <TrendingUp className="text-green-400" size={16} />
            </div>
            <p className="text-3xl font-bold text-white">{formatCurrency(metrics.totalGMV)}</p>
            <p className="text-sm text-gray-400 mt-1">Total GMV</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="text-purple-400" size={28} />
              <TrendingUp className="text-purple-400" size={16} />
            </div>
            <p className="text-3xl font-bold text-white">{formatCurrency(metrics.adSpend)}</p>
            <p className="text-sm text-gray-400 mt-1">Ad Spend</p>
          </div>

          <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border border-orange-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Target className="text-orange-400" size={28} />
            </div>
            <p className="text-3xl font-bold text-white">{metrics.roas}x</p>
            <p className="text-sm text-gray-400 mt-1">ROAS</p>
          </div>

          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="text-blue-400" size={28} />
            </div>
            <p className="text-3xl font-bold text-white">{metrics.highIntentUsers.toLocaleString()}</p>
            <p className="text-sm text-gray-400 mt-1">High Intent Users</p>
          </div>
        </div>

        {/* Top Performing Products Table */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">📦 Top Performing Products</h2>
                <p className="text-sm text-gray-400 mt-1">Performance by product category</p>
              </div>
              <button 
                onClick={() => navigate(`/brand/${brand}/campaigns`)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                View All Campaigns <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Product</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase">Campaigns</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase">ROAS</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase">CTR</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase">Spend</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase">Revenue</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Channel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {topProducts.map((product, idx) => (
                  <tr key={idx} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold">
                          #{idx + 1}
                        </div>
                        <div>
                          <p className="text-white font-medium">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-white">{product.campaigns}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-orange-400 font-bold">{product.roas}x</span>
                    </td>
                    <td className="px-6 py-4 text-right text-blue-400">{product.ctr}%</td>
                    <td className="px-6 py-4 text-right text-gray-300">{formatCurrency(product.spend)}</td>
                    <td className="px-6 py-4 text-right text-green-400 font-medium">{formatCurrency(product.revenue)}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">{product.channel}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {topProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto text-gray-600 mb-3" size={48} />
              <p className="text-gray-400">No product data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
