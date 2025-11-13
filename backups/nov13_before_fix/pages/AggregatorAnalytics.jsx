import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingCart, Users, Building2, BarChart3, Download } from 'lucide-react';

export default function AggregatorAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/aggregator/analytics');
      const result = await res.json();
      if (!result.error) {
        setData(result);
      }
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!data) return;
    
    const csvContent = [
      ['Brand', 'Revenue', 'Orders', 'Ad Spend', 'Conversions', 'ROAS', 'Campaigns'],
      ...data.brands.map(b => [
        b.brand,
        b.revenue.toFixed(2),
        b.orders,
        b.ad_spend.toFixed(2),
        b.conversions,
        b.roas.toFixed(2),
        b.campaigns_count
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `platform_analytics_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading platform analytics...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">Failed to load analytics</div>
      </div>
    );
  }

  const overview = data.platform_overview;

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Platform Analytics</h1>
            <p className="text-gray-400">All Brands Performance Overview</p>
          </div>
          <button
            onClick={downloadReport}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            <Download size={18} />
            Export Report
          </button>
        </div>

        {/* Platform Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-700 rounded-xl p-6">
            <DollarSign className="text-green-400 mb-2" size={28} />
            <p className="text-gray-400 text-sm">Total Platform Revenue</p>
            <p className="text-3xl font-bold text-white mt-1">
              ₹{(overview.total_revenue / 10000000).toFixed(2)}Cr
            </p>
            <p className="text-xs text-gray-500 mt-2">Across all brands</p>
          </div>

          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700 rounded-xl p-6">
            <TrendingUp className="text-blue-400 mb-2" size={28} />
            <p className="text-gray-400 text-sm">Total Ad Spend</p>
            <p className="text-3xl font-bold text-white mt-1">
              ₹{(overview.total_spend / 10000000).toFixed(2)}Cr
            </p>
            <p className="text-xs text-gray-500 mt-2">Platform investment</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-700 rounded-xl p-6">
            <BarChart3 className="text-purple-400 mb-2" size={28} />
            <p className="text-gray-400 text-sm">Platform ROAS</p>
            <p className="text-3xl font-bold text-white mt-1">
              {overview.platform_roas.toFixed(2)}x
            </p>
            <p className="text-xs text-gray-500 mt-2">Average return</p>
          </div>

          <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border border-orange-700 rounded-xl p-6">
            <Building2 className="text-orange-400 mb-2" size={28} />
            <p className="text-gray-400 text-sm">Active Brands</p>
            <p className="text-3xl font-bold text-white mt-1">{overview.total_brands}</p>
            <p className="text-xs text-gray-500 mt-2">On platform</p>
          </div>
        </div>

        {/* Brand Performance Table */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-6">Brand Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-400 border-b border-gray-700">
                  <th className="pb-3 pr-4">Rank</th>
                  <th className="pb-3 pr-4">Brand</th>
                  <th className="pb-3 pr-4 text-right">Revenue</th>
                  <th className="pb-3 pr-4 text-right">Orders</th>
                  <th className="pb-3 pr-4 text-right">Ad Spend</th>
                  <th className="pb-3 pr-4 text-right">ROAS</th>
                  <th className="pb-3 pr-4 text-right">Conversions</th>
                  <th className="pb-3 pr-4 text-right">Campaigns</th>
                </tr>
              </thead>
              <tbody>
                {data.brands.map((brand, idx) => (
                  <tr key={idx} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="py-4 pr-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        idx === 0 ? 'bg-yellow-600 text-white' :
                        idx === 1 ? 'bg-gray-400 text-white' :
                        idx === 2 ? 'bg-orange-600 text-white' :
                        'bg-gray-700 text-gray-400'
                      }`}>
                        {idx + 1}
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center font-bold text-white">
                          {brand.brand[0]}
                        </div>
                        <span className="text-white font-semibold">{brand.brand}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-right text-green-400 font-semibold">
                      ₹{(brand.revenue / 10000000).toFixed(2)}Cr
                    </td>
                    <td className="py-4 pr-4 text-right text-white">
                      {brand.orders.toLocaleString()}
                    </td>
                    <td className="py-4 pr-4 text-right text-blue-400">
                      ₹{(brand.ad_spend / 10000000).toFixed(2)}Cr
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <span className={`font-bold ${
                        brand.roas > 3 ? 'text-green-400' :
                        brand.roas > 2 ? 'text-blue-400' :
                        'text-yellow-400'
                      }`}>
                        {brand.roas.toFixed(2)}x
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-right text-orange-400">
                      {brand.conversions.toLocaleString()}
                    </td>
                    <td className="py-4 pr-4 text-right text-gray-300">
                      {brand.campaigns_count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
