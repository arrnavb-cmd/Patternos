import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Calendar, Download, Filter, MapPin, Tag, UserCircle } from 'lucide-react';

export default function Analytics() {
  const [activeTab, setActiveTab] = useState('platform');
  const [dateRange, setDateRange] = useState('last_30_days');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [compareBy, setCompareBy] = useState('location');
  
  // Real data from API
  const [platformSummary, setPlatformSummary] = useState(null);
  const [channelData, setChannelData] = useState([]);

  // Get logged-in user info
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const brand = localStorage.getItem('brand') || user.username || 'nike';
  const isAggregator = user.role === 'admin' || user.username === 'zepto' || user.username === 'admin';

  // Brand-specific dummy data (for brand analytics tab)
  const brandData = {
    nike: { spend: '₹50.0L', revenue: '₹23.9L', roas: '0.48x', purchases: 158, impressions: '199,996', ctr: '3.01%', convRate: '2.62%' },
    adidas: { spend: '₹42.0L', revenue: '₹20.2L', roas: '0.48x', purchases: 150, impressions: '200,100', ctr: '3.05%', convRate: '2.46%' },
    britannia: { spend: '₹35.0L', revenue: '₹18.5L', roas: '0.53x', purchases: 145, impressions: '195,500', ctr: '3.10%', convRate: '2.55%' },
    lakme: { spend: '₹32.0L', revenue: '₹22.5L', roas: '0.7x', purchases: 152, impressions: '199,593', ctr: '3.02%', convRate: '2.53%' },
    itc: { spend: '₹18.0L', revenue: '₹22.3L', roas: '1.24x', purchases: 145, impressions: '200,385', ctr: '3.01%', convRate: '2.4%' },
    amul: { spend: '₹18.0L', revenue: '₹21.1L', roas: '1.17x', purchases: 150, impressions: '199,926', ctr: '3.02%', convRate: '2.48%' }
  };

  const allBrandsData = [
    { brand: 'Nike', ...brandData.nike },
    { brand: 'Adidas', ...brandData.adidas },
    { brand: 'Britannia', ...brandData.britannia },
    { brand: 'Lakmé', ...brandData.lakme },
    { brand: 'ITC', ...brandData.itc },
    { brand: 'Amul', ...brandData.amul }
  ];

  const currentBrandData = brandData[brand] || brandData.nike;

  // Fetch real data from API
  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange, customStartDate, customEndDate]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      let url = `https://patternos-production.up.railway.app/api/v1/analytics/platform-summary?date_range=${dateRange}`;
      
      if (dateRange === 'custom' && customStartDate && customEndDate) {
        url += `&start_date=${customStartDate}&end_date=${customEndDate}`;
      }
      
      const [summaryRes, channelRes] = await Promise.all([
        fetch(url),
        fetch(`https://patternos-production.up.railway.app/api/v1/analytics/channel-performance?date_range=${dateRange}`)
      ]);
      
      const summary = await summaryRes.json();
      const channels = await channelRes.json();
      
      setPlatformSummary(summary);
      setChannelData(channels.channels || []);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    if (amount >= 10000000) return '₹' + (amount / 10000000).toFixed(1) + 'Cr';
    if (amount >= 100000) return '₹' + (amount / 100000).toFixed(1) + 'L';
    return '₹' + amount.toLocaleString();
  };

  const handleDateRangeChange = (value) => {
    setDateRange(value);
    if (value === 'custom') {
      setShowDatePicker(true);
    } else {
      setShowDatePicker(false);
    }
  };

  const handleApplyCustomDate = () => {
    if (customStartDate && customEndDate) {
      fetchAnalyticsData();
    }
  };

  // Interactive Comparison Data (dummy for now)
  const locationData = [
    { dimension: 'Mumbai', spend: '₹65L', revenue: '₹78L', roas: '1.2x', conversions: 2850 },
    { dimension: 'Bangalore', spend: '₹58L', revenue: '₹71L', roas: '1.22x', conversions: 2640 },
    { dimension: 'Delhi', spend: '₹52L', revenue: '₹59L', roas: '1.13x', conversions: 2380 },
  ];

  const categoryData = [
    { dimension: 'Electronics', spend: '₹85L', revenue: '₹95L', roas: '1.12x', conversions: 3250 },
    { dimension: 'Fashion', spend: '₹72L', revenue: '₹88L', roas: '1.22x', conversions: 2980 },
  ];

  const ageGroupData = [
    { dimension: '18-24', spend: '₹48L', revenue: '₹58L', roas: '1.21x', conversions: 2350 },
    { dimension: '25-34', spend: '₹92L', revenue: '₹115L', roas: '1.25x', conversions: 4280 },
  ];

  const getComparisonData = () => {
    switch(compareBy) {
      case 'location': return locationData;
      case 'category': return categoryData;
      case 'age_group': return ageGroupData;
      default: return locationData;
    }
  };

  const tabs = isAggregator ? [
    { id: 'platform', label: 'Platform Overview', desc: 'Channel performance' },
    { id: 'brand', label: 'Brand Analytics', desc: 'Brand comparison' },
    { id: 'comparison', label: 'Interactive Comparison', desc: 'Location/Category/Age' }
  ] : [
    { id: 'brand', label: 'My Performance', desc: 'Your brand analytics' },
    { id: 'comparison', label: 'Detailed Analysis', desc: 'Location/Category/Age' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-blue-400 animate-pulse mx-auto mb-4" />
          <p className="text-slate-300 text-lg">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-gray-400">
              {isAggregator ? 'Real-time performance analytics from Intent Intelligence' : `Performance analytics for ${brand.charAt(0).toUpperCase() + brand.slice(1)}`}
            </p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
            <Download size={18} />
            Export Report
          </button>
        </div>

        {/* Date Range Selector */}
        <div className="bg-gray-800 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <Calendar className="text-gray-400" size={20} />
            <select 
              value={dateRange}
              onChange={(e) => handleDateRangeChange(e.target.value)}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
            >
              <option value="last_7_days">Last 7 Days</option>
              <option value="last_30_days">Last 30 Days</option>
              <option value="last_90_days">Last 90 Days</option>
              <option value="custom">Custom Range</option>
            </select>

            {showDatePicker && (
              <>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                />
                <span className="text-gray-400">to</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleApplyCustomDate}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Apply
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-700">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 transition-all ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <div className="font-medium">{tab.label}</div>
              <div className="text-xs mt-1 opacity-75">{tab.desc}</div>
            </button>
          ))}
        </div>

        {/* Platform Overview Tab - REAL DATA */}
        {activeTab === 'platform' && isAggregator && platformSummary && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Platform Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700 rounded-xl p-6">
                <BarChart3 className="w-8 h-8 text-blue-400 mb-3" />
                <p className="text-3xl font-bold text-white mb-1">{formatCurrency(platformSummary.total_spend)}</p>
                <p className="text-sm text-gray-400">Total Ad Spend</p>
              </div>
              <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-700 rounded-xl p-6">
                <TrendingUp className="w-8 h-8 text-green-400 mb-3" />
                <p className="text-3xl font-bold text-white mb-1">{formatCurrency(platformSummary.total_revenue)}</p>
                <p className="text-sm text-gray-400">Total Revenue (Ads)</p>
              </div>
              <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border border-orange-700 rounded-xl p-6">
                <DollarSign className="w-8 h-8 text-orange-400 mb-3" />
                <p className="text-3xl font-bold text-white mb-1">{platformSummary.avg_roas}x</p>
                <p className="text-sm text-gray-400">Avg ROAS</p>
              </div>
              <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-700 rounded-xl p-6">
                <Users className="w-8 h-8 text-purple-400 mb-3" />
                <p className="text-3xl font-bold text-white mb-1">{platformSummary.total_clicks.toLocaleString()}</p>
                <p className="text-sm text-gray-400">Total Clicks</p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white">Channel Performance</h3>
                <p className="text-gray-400 text-sm mt-1">Real data from 100K purchase database</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Channel</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Impressions</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Clicks</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Spend</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Revenue</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">ROAS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {channelData.map((channel, idx) => (
                      <tr key={idx} className="hover:bg-gray-700/30">
                        <td className="px-6 py-4 text-sm font-medium text-white">{channel.channel}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{channel.impressions.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{channel.clicks.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{formatCurrency(channel.spend)}</td>
                        <td className="px-6 py-4 text-sm text-green-400 font-semibold">{formatCurrency(channel.revenue)}</td>
                        <td className="px-6 py-4 text-sm text-orange-400 font-bold">{channel.roas}x</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Brand Analytics Tab - Keep existing code */}
        {activeTab === 'brand' && (
          <div>
            {/* ... existing brand analytics code ... */}
          </div>
        )}

        {/* Interactive Comparison Tab - Keep existing code */}
        {activeTab === 'comparison' && (
          <div>
            {/* ... existing comparison code ... */}
          </div>
        )}
      </div>
    </div>
  );
}
