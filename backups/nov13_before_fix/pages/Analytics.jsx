import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Calendar, Download, Filter, MapPin, Tag, UserCircle } from 'lucide-react';

export default function Analytics() {
  const [activeTab, setActiveTab] = useState('platform');
  const [dateRange, setDateRange] = useState('last_30_days');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [compareBy, setCompareBy] = useState('location');

  const [platformSummary, setPlatformSummary] = useState(null);
  const [realChannelData, setRealChannelData] = useState([]);
  const [brandComparisonData, setBrandComparisonData] = useState([]);
  const [interactiveData, setInteractiveData] = useState([]);

  // Fetch interactive comparison data when tab or filter changes
  useEffect(() => {
    if (activeTab === "comparison" && (compareBy === "location" || compareBy === "category")) {
      fetchInteractiveData();
    }
  }, [activeTab, compareBy, dateRange]);

  const fetchInteractiveData = async () => {
    setLoading(true);
    try {
      let endpoint = "";
      if (compareBy === "location") {
        endpoint = `https://patternos-production.up.railway.app/api/v1/analytics/location-comparison?date_range=${dateRange}`;
      } else if (compareBy === "category") {
        endpoint = `https://patternos-production.up.railway.app/api/v1/analytics/category-comparison?date_range=${dateRange}`;
      }

      if (endpoint) {
        const response = await fetch(endpoint);
        const data = await response.json();
        setInteractiveData(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch interactive data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch interactive comparison data when tab changes
  useEffect(() => {
    if (activeTab === 'comparison') {
      fetchInteractiveData();
    }
  }, [activeTab, compareBy, dateRange]);

  // Get logged-in user info
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const brand = localStorage.getItem('brand') || user.username || 'nike';
  const isAggregator = user.role === 'admin' || user.username === 'zepto' || user.username === 'admin';

  // Brand-specific data

  // Fetch real data from API
  useEffect(() => {
    if (isAggregator && (activeTab === 'platform' || activeTab === 'brand')) {
      fetchAnalyticsData();
    }
  }, [dateRange, customStartDate, customEndDate, activeTab]);

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
      setRealChannelData(channels.channels || []);


      // Fetch brand comparison data if on brand tab
      if (activeTab === "brand") {
        const brandRes = await fetch(`https://patternos-production.up.railway.app/api/v1/analytics/brand-comparison?date_range=${dateRange}`);
        const brandData = await brandRes.json();
        setBrandComparisonData(brandData.brands || []);
      }
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

  // Platform Overview Data (for aggregators)
  const channelData = [
    { channel: 'Onsite Ads', impressions: 1200000, clicks: 36000, spend: '₹45L', revenue: '₹58L', roas: '1.29x' },
    { channel: 'Offsite Display', impressions: 980000, clicks: 29400, spend: '₹38L', revenue: '₹42L', roas: '1.11x' },
    { channel: 'Voice Commerce', impressions: 650000, clicks: 19500, spend: '₹28L', revenue: '₹35L', roas: '1.25x' },
    { channel: 'Social Media', impressions: 1500000, clicks: 45000, spend: '₹52L', revenue: '₹48L', roas: '0.92x' }
  ];

  // Interactive Comparison Data
  const locationData = [
    { dimension: 'Mumbai', spend: '₹65L', revenue: '₹78L', roas: '1.2x', conversions: 2850 },
    { dimension: 'Bangalore', spend: '₹58L', revenue: '₹71L', roas: '1.22x', conversions: 2640 },
    { dimension: 'Delhi', spend: '₹52L', revenue: '₹59L', roas: '1.13x', conversions: 2380 },
    { dimension: 'Hyderabad', spend: '₹38L', revenue: '₹45L', roas: '1.18x', conversions: 1820 },
    { dimension: 'Pune', spend: '₹32L', revenue: '₹37L', roas: '1.16x', conversions: 1540 },
    { dimension: 'Chennai', spend: '₹28L', revenue: '₹33L', roas: '1.18x', conversions: 1390 }
  ];

  const categoryData = [
    { dimension: 'Electronics', spend: '₹85L', revenue: '₹95L', roas: '1.12x', conversions: 3250 },
    { dimension: 'Fashion', spend: '₹72L', revenue: '₹88L', roas: '1.22x', conversions: 2980 },
    { dimension: 'Groceries', spend: '₹58L', revenue: '₹72L', roas: '1.24x', conversions: 2650 },
    { dimension: 'Beauty', spend: '₹45L', revenue: '₹54L', roas: '1.2x', conversions: 2140 },
    { dimension: 'Home & Kitchen', spend: '₹38L', revenue: '₹43L', roas: '1.13x', conversions: 1780 }
  ];

  const ageGroupData = [
    { dimension: '18-24', spend: '₹48L', revenue: '₹58L', roas: '1.21x', conversions: 2350 },
    { dimension: '25-34', spend: '₹92L', revenue: '₹115L', roas: '1.25x', conversions: 4280 },
    { dimension: '35-44', spend: '₹68L', revenue: '₹82L', roas: '1.21x', conversions: 3150 },
    { dimension: '45-54', spend: '₹45L', revenue: '₹51L', roas: '1.13x', conversions: 2080 },
    { dimension: '55+', spend: '₹28L', revenue: '₹32L', roas: '1.14x', conversions: 1340 }
  ];

  const getComparisonData = () => {
    // Use real data if available, otherwise fall back to dummy data
    if (interactiveData.length > 0) {
      return interactiveData;
    }
    // Fallback to dummy data for age groups
    switch(compareBy) {
      case 'location': return locationData;
      case 'category': return categoryData;
      case 'age_group': return ageGroupData;
      default: return locationData;
    }
  };


  const handleDateRangeChange = (value) => {
    setDateRange(value);
    if (value === 'custom') {
      setShowDatePicker(true);
    } else {
      setShowDatePicker(false);
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
          <div className="flex items-center gap-4">
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
              <div className="flex items-center gap-3">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                  placeholder="Start Date"
                />
                <span className="text-gray-400">to</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                  placeholder="End Date"
                />
                <button
                  onClick={() => {
                    console.log('Apply custom date range:', customStartDate, 'to', customEndDate);
                    // Add your date filter logic here
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Apply
                </button>
              </div>
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

        {/* Platform Overview Tab */}
        {activeTab === 'platform' && isAggregator && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Platform Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700 rounded-xl p-6">
                <BarChart3 className="w-8 h-8 text-blue-400 mb-3" />
                <p className="text-3xl font-bold text-white mb-1">{platformSummary ? formatCurrency(platformSummary.total_spend) : "₹163L"}</p>
                <p className="text-sm text-gray-400">Total Ad Spend</p>
              </div>
              <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-700 rounded-xl p-6">
                <TrendingUp className="w-8 h-8 text-green-400 mb-3" />
                <p className="text-3xl font-bold text-white mb-1">{platformSummary ? formatCurrency(platformSummary.total_revenue) : "₹183L"}</p>
                <p className="text-sm text-gray-400">Total Revenue</p>
              </div>
              <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border border-orange-700 rounded-xl p-6">
                <DollarSign className="w-8 h-8 text-orange-400 mb-3" />
                <p className="text-3xl font-bold text-white mb-1">{platformSummary ? platformSummary.avg_roas.toFixed(1) + "x" : "1.12x"}</p>
                <p className="text-sm text-gray-400">Avg ROAS</p>
              </div>
              <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-700 rounded-xl p-6">
                <Users className="w-8 h-8 text-purple-400 mb-3" />
                <p className="text-3xl font-bold text-white mb-1">{platformSummary ? (platformSummary?.total_clicks || 0).toLocaleString() : "129.9k"}</p>
                <p className="text-sm text-gray-400">Total Clicks</p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white">Channel Performance</h3>
                <p className="text-gray-400 text-sm mt-1">Performance breakdown by advertising channel</p>
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
                    {realChannelData.map((channel, idx) => (
                      <tr key={idx} className="hover:bg-gray-700/30">
                        <td className="px-6 py-4 text-sm font-medium text-white">{channel.channel}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{channel.impressions.toLocaleString("en-IN")}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{channel.clicks.toLocaleString("en-IN")}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{parseFloat(channel.spend).toFixed(1)}</td>
                        <td className="px-6 py-4 text-sm text-green-400 font-semibold">{parseFloat(channel.revenue).toFixed(1)}</td>
                        <td className="px-6 py-4 text-sm text-orange-400 font-bold">{parseFloat(channel.roas).toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Brand Analytics Tab */}
        {activeTab === 'brand' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {isAggregator ? 'Brand Comparison' : `${brand.charAt(0).toUpperCase() + brand.slice(1)} Performance`}
              </h2>
            </div>

            {!isAggregator && (
              <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-700 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Your Campaign Performance</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Spend</p>
                    <p className="text-2xl font-bold text-white">{currentBrandData.spend}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Revenue Generated</p>
                    <p className="text-2xl font-bold text-green-400">{currentBrandData.revenue}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">ROAS</p>
                    <p className="text-2xl font-bold text-orange-400">{parseFloat(currentBrandData.roas).toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Conversions</p>
                    <p className="text-2xl font-bold text-blue-400">{currentBrandData.purchases}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white">
                  {isAggregator ? 'Brand Comparison' : 'Detailed Metrics'}
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  {isAggregator ? 'Detailed performance metrics for each brand' : 'Your detailed performance breakdown'}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      {isAggregator && <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Brand</th>}
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Spend</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Revenue</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">ROAS</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Purchases</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Impressions</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">CTR</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Conv Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {isAggregator ? (
                      brandComparisonData.map((data, idx) => (
                        <tr key={idx} className="hover:bg-gray-700/30">
                          <td className="px-6 py-4 text-sm font-medium text-white">{data.brand}</td>
                          <td className="px-6 py-4 text-sm text-gray-300">{formatCurrency(data.spend)}</td>
                          <td className="px-6 py-4 text-sm text-green-400 font-semibold">{formatCurrency(data.revenue)}</td>
                          <td className="px-6 py-4 text-sm text-orange-400 font-bold">{parseFloat(data.roas).toFixed(1)}x</td>
                          <td className="px-6 py-4 text-sm text-gray-300">{data.purchases}</td>
                          <td className="px-6 py-4 text-sm text-gray-300">{data.impressions.toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm text-blue-400">{parseFloat(data.ctr).toFixed(1)}%</td>
                          <td className="px-6 py-4 text-sm text-gray-300">{parseFloat(data.conversion_rate).toFixed(1)}%</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="hover:bg-gray-700/30">
                        <td className="px-6 py-4 text-sm text-gray-300">{currentBrandData.spend}</td>
                        <td className="px-6 py-4 text-sm text-green-400 font-semibold">{currentBrandData.revenue}</td>
                        <td className="px-6 py-4 text-sm text-orange-400 font-bold">{parseFloat(currentBrandData.roas).toFixed(1)}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{currentBrandData.purchases}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{currentBrandData.impressions}</td>
                        <td className="px-6 py-4 text-sm text-blue-400">{parseFloat(currentBrandData.ctr).toFixed(1)}%</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{parseFloat(currentBrandData.convRate).toFixed(1)}%</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Comparison Tab */}
        {activeTab === 'comparison' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {isAggregator ? 'Interactive Comparison' : 'Detailed Analysis'}
              </h2>
              
              <div className="flex items-center gap-3">
                <Filter className="text-gray-400" size={20} />
                <select
                  value={compareBy}
                  onChange={(e) => setCompareBy(e.target.value)}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                >
                  <option value="location">By Location</option>
                  <option value="category">By Category</option>
                  <option value="age_group">By Age Group</option>
                </select>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  {compareBy === 'location' && <MapPin className="w-5 h-5 text-blue-400" />}
                  {compareBy === 'category' && <Tag className="w-5 h-5 text-purple-400" />}
                  {compareBy === 'age_group' && <UserCircle className="w-5 h-5 text-green-400" />}
                  <h3 className="text-xl font-semibold text-white">
                    {compareBy === 'location' && 'Location-wise Performance'}
                    {compareBy === 'category' && 'Category-wise Performance'}
                    {compareBy === 'age_group' && 'Age Group Performance'}
                  </h3>
                </div>
                <p className="text-gray-400 text-sm mt-1">
                  Detailed breakdown by {compareBy.replace('_', ' ')}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        {compareBy === 'location' && 'Location'}
                        {compareBy === 'category' && 'Category'}
                        {compareBy === 'age_group' && 'Age Group'}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Spend</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Revenue</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">ROAS</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Conversions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {getComparisonData().map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-700/30">
                        <td className="px-6 py-4 text-sm font-medium text-white">{item.dimension}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{item.spend}</td>
                        <td className="px-6 py-4 text-sm text-green-400 font-semibold">{item.revenue}</td>
                        <td className="px-6 py-4 text-sm text-orange-400 font-bold">{item.roas}</td>
                        <td className="px-6 py-4 text-sm text-blue-400">{item.conversions.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
