import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, TrendingUp, Users, Target, BarChart3, ShoppingCart, Package, Calendar } from 'lucide-react';
import { getCurrentBrand } from '../utils/brandUtils';

export default function BrandDashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(90); // Default 90 days
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const brand = getCurrentBrand();

  useEffect(() => {
    fetchMetrics();
  }, [dateRange]);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const brandName = user.username || brand.username;
      let url = `http://localhost:8000/api/v1/brand/metrics-filtered/${brandName}?days=${dateRange}`;
      
      if (showCustomDate && startDate && endDate) {
        url = `http://localhost:8000/api/v1/brand/metrics-filtered/${brandName}?start_date=${startDate}&end_date=${endDate}`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (!data.error) {
        setMetrics(data);
      }
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
      setLoading(false);
    }
  };

  const handleCustomDateApply = () => {
    if (startDate && endDate) {
      fetchMetrics();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">Failed to load metrics</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {brand.brandName}! 🚀
              </h1>
              <p className="text-orange-100">
                Managing ₹{(metrics.total_revenue / 10000000).toFixed(2)}Cr revenue from {metrics.total_orders.toLocaleString()} orders
              </p>
            </div>
            
            {/* Date Filter */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="text-white" size={20} />
                <span className="text-white font-semibold">Date Range</span>
              </div>
              <div className="flex gap-2 mb-2">
                {[30, 60, 90, 120, 180, 360].map(days => (
                  <button
                    key={days}
                    onClick={() => {setDateRange(days); setShowCustomDate(false);}}
                    className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                      dateRange === days && !showCustomDate
                        ? 'bg-white text-orange-600'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {days}d
                  </button>
                ))}
                <button
                  onClick={() => setShowCustomDate(!showCustomDate)}
                  className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                    showCustomDate
                      ? 'bg-white text-orange-600'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Custom
                </button>
              </div>
              
              {showCustomDate && (
                <div className="flex gap-2 mt-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-white/20 text-white px-2 py-1 rounded text-sm"
                  />
                  <span className="text-white">to</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-white/20 text-white px-2 py-1 rounded text-sm"
                  />
                  <button
                    onClick={handleCustomDateApply}
                    className="bg-white text-orange-600 px-3 py-1 rounded text-sm font-semibold hover:bg-gray-100"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="text-green-400" size={28} />
            </div>
            <p className="text-gray-400 text-sm">Total Revenue</p>
            <p className="text-3xl font-bold text-white mt-1">₹{(metrics.total_revenue / 10000000).toFixed(2)}Cr</p>
            <p className="text-xs text-gray-500 mt-2">Last {dateRange} days</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <ShoppingCart className="text-blue-400" size={28} />
            </div>
            <p className="text-gray-400 text-sm">Total Orders</p>
            <p className="text-3xl font-bold text-white mt-1">{metrics.total_orders.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">Period orders</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="text-purple-400" size={28} />
            </div>
            <p className="text-gray-400 text-sm">ROAS (Return on Ad Spend)</p>
            <p className="text-3xl font-bold text-white mt-1">
              {metrics.roas > 0 ? `${metrics.roas.toFixed(2)}x` : 'N/A'}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {metrics.total_spend > 0 
                ? `₹${(metrics.total_spend / 100000).toFixed(1)}L ad spend`
                : 'No ad spend in period'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <Users className="text-orange-400" size={28} />
            </div>
            <p className="text-gray-400 text-sm">Unique Customers</p>
            <p className="text-3xl font-bold text-white mt-1">{metrics.unique_customers.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">Active customers</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate('/campaigns')}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white p-6 rounded-xl shadow-xl transition-all transform hover:scale-105"
          >
            <Package className="mb-2" size={32} />
            <h3 className="text-xl font-bold mb-1">Manage Campaigns</h3>
            <p className="text-orange-100 text-sm">View and optimize your ad campaigns</p>
          </button>

          <button
            onClick={() => navigate('/analytics')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-6 rounded-xl shadow-xl transition-all transform hover:scale-105"
          >
            <BarChart3 className="mb-2" size={32} />
            <h3 className="text-xl font-bold mb-1">View Analytics</h3>
            <p className="text-blue-100 text-sm">Deep dive into performance metrics</p>
          </button>

          <button
            onClick={() => navigate('/products')}
            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white p-6 rounded-xl shadow-xl transition-all transform hover:scale-105"
          >
            <Target className="mb-2" size={32} />
            <h3 className="text-xl font-bold mb-1">Product Insights</h3>
            <p className="text-green-100 text-sm">See top performing products</p>
          </button>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Performance Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Avg Order Value</span>
                <span className="text-white font-semibold">₹{Math.round(metrics.avg_order_value)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Conversions</span>
                <span className="text-white font-semibold">{metrics.total_conversions.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Ad Spend</span>
                <span className="text-white font-semibold">₹{(metrics.total_spend / 100000).toFixed(1)}L</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
