import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, BarChart3, Calendar, DollarSign, TrendingUp, Download, Filter, Plus } from 'lucide-react';

export default function AggregatorCampaigns() {
  const [zeptoCampaigns, setZeptoCampaigns] = useState([]);
  const [allPlatformCampaigns, setAllPlatformCampaigns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApprovedCampaigns = async () => {
      try {
        console.log('🔍 Fetching all approved campaigns');
        const res = await fetch('http://localhost:8000/api/v1/campaigns/approved');
        const data = await res.json();
        console.log('📦 All campaigns response:', data);
        
        if (data.campaigns) {
          const zepto = data.campaigns.filter(c => c.brand.toLowerCase() === 'zepto');
          const all = data.campaigns;
          
          console.log('✅ Zepto campaigns:', zepto.length);
          console.log('✅ All platform campaigns:', all.length);
          
          setZeptoCampaigns(zepto);
          setAllPlatformCampaigns(all);
        }
      } catch (err) {
        console.error('❌ Failed to fetch campaigns:', err);
      }
    };
    fetchApprovedCampaigns();
  }, []);

  
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('zepto'); // 'zepto' or 'all'
  const [filterChannel, setFilterChannel] = useState('all');
  const [sortBy, setSortBy] = useState('roas');
  const [sortOrder, setSortOrder] = useState('desc');
  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  useEffect(() => {
    fetchCampaigns();
  }, [viewMode]);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      let url;
      if (viewMode === 'zepto') {
        // Fetch only Zepto's campaigns
        url = 'http://localhost:8000/api/v1/brand/analytics/zepto';
      } else {
        // Fetch all brands' campaigns
        url = 'http://localhost:8000/api/v1/aggregator/all-campaigns';
      }
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (!data.error) {
        if (viewMode === 'zepto') {
          setCampaigns(data.all_campaigns || []);
        } else {
          setCampaigns(data.campaigns || []);
        }
      }
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch campaigns:', err);
      setLoading(false);
    }
  };

  const getFilteredAndSortedCampaigns = () => {
    let filtered = [...campaigns];
    
    // Filter by channel
    if (filterChannel !== 'all') {
      filtered = filtered.filter(c => c.channel === filterChannel);
    }
    
    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'name') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });
    
    return filtered;
  };

  const downloadReport = () => {
    const filteredCampaigns = getFilteredAndSortedCampaigns();
    const csvContent = [
      ['Campaign', 'Brand', 'Channel', 'Spend', 'Revenue', 'ROAS', 'Conversions', 'Status'],
      ...filteredCampaigns.map(c => [
        c.name,
        c.brand || 'Zepto',
        c.channel,
        c.spend,
        c.revenue,
        c.roas.toFixed(2),
        c.conversions,
        c.status
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${viewMode}_campaigns_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading campaigns...</div>
      </div>
    );
  }

  const filteredCampaigns = getFilteredAndSortedCampaigns();
  const channels = [...new Set(campaigns.map(c => c.channel))];

  // Calculate stats
  const totalSpend = filteredCampaigns.reduce((sum, c) => sum + c.spend, 0);
  const totalRevenue = filteredCampaigns.reduce((sum, c) => sum + c.revenue, 0);
  const avgRoas = filteredCampaigns.length > 0 
    ? filteredCampaigns.reduce((sum, c) => sum + c.roas, 0) / filteredCampaigns.length 
    : 0;
  const activeCampaigns = allPlatformCampaigns.length;

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Campaign Management</h1>
            <p className="text-gray-400">
              {viewMode === 'zepto' ? 'Zepto Brand Campaigns' : 'All Platform Campaigns'}
            </p>
          </div>
          <div className="flex gap-3">
            {viewMode === 'zepto' && (
              <button onClick={() => navigate('/campaigns/create')} className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold">
                <Plus size={18} />
                Create Campaign
              </button>
            )}
            <button 
              onClick={downloadReport}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setViewMode('zepto')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              viewMode === 'zepto'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Zepto Campaigns
          </button>
          <button
            onClick={() => setViewMode('all')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              viewMode === 'all'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            All Platform Campaigns
          </button>
        </div>


        {/* Live Campaigns - Zepto's Own */}
        {zeptoCampaigns.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">🎯 Zepto Campaigns</h2>
                <p className="text-gray-400 text-sm">Campaigns created by Zepto</p>
              </div>
              <span className="px-4 py-2 bg-orange-900/30 text-orange-400 rounded-lg font-semibold">
                {zeptoCampaigns.length} Live
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {zeptoCampaigns.map((campaign, idx) => (
                <div key={idx} className="bg-gray-800 rounded-xl p-6 border-2 border-orange-600">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-orange-600 text-white text-xs rounded-full font-bold">
                          ZEPTO
                        </span>
                        <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded">
                          ✓ Live
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white">{campaign.campaign_name}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs">Budget</p>
                      <p className="text-2xl font-bold text-white">₹{(parseInt(campaign.budget) / 1000).toFixed(0)}K</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-gray-900/50 rounded-lg p-3">
                      <p className="text-gray-500 text-xs">Duration</p>
                      <p className="text-white font-semibold">{campaign.duration_days}d</p>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-3">
                      <p className="text-gray-500 text-xs">Products</p>
                      <p className="text-white font-semibold">{campaign.products?.length || 0}</p>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-3">
                      <p className="text-gray-500 text-xs">Channels</p>
                      <p className="text-white font-semibold">{campaign.channels?.length || 0}</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-900/20 to-yellow-900/20 rounded-lg p-4 border border-orange-700/30">
                    <p className="text-white font-semibold mb-1">{campaign.headline}</p>
                    <p className="text-gray-400 text-sm">{campaign.ad_copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Platform Campaigns */}
        {allPlatformCampaigns.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-white">🌐 All Platform Campaigns</h2>
                <p className="text-sm text-gray-400">{allPlatformCampaigns.length} total campaigns</p>
              </div>
            </div>
            
            {/* Table layout */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-900/50 border-b border-gray-700 text-xs font-medium text-gray-400 uppercase">
                <div className="col-span-3">Campaign</div>
                <div className="col-span-2">Brand</div>
                <div className="col-span-2">Budget</div>
                <div className="col-span-2">Schedule</div>
                <div className="col-span-2">Performance</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>
              
              {/* Rows */}
              {allPlatformCampaigns.map((campaign, idx) => (
                <div 
                  key={idx} 
                  className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-700 last:border-b-0 hover:bg-gray-750 transition-colors"
                >
                  {/* Campaign Name & Details */}
                  <div className="col-span-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium mb-1">{campaign.campaign_name}</p>
                        <p className="text-xs text-gray-400 mb-2 line-clamp-1">{campaign.headline}</p>
                        <div className="flex gap-1.5 flex-wrap">
                          {campaign.channels?.slice(0, 2).map((ch, i) => (
                            <span key={i} className="px-2 py-0.5 bg-gray-700/50 text-gray-300 text-xs rounded">
                              {ch.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Brand */}
                  <div className="col-span-2 flex flex-col justify-center">
                    <span className="px-2.5 py-1 bg-purple-900/30 text-purple-400 text-xs font-semibold rounded uppercase w-fit">
                      {campaign.brand}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{campaign.products?.length || 0} products</p>
                  </div>
                  
                  {/* Budget */}
                  <div className="col-span-2 flex flex-col justify-center">
                    <p className="text-white font-semibold text-sm">₹{(parseInt(campaign.budget) / 1000).toFixed(1)}K</p>
                    <p className="text-xs text-gray-500">₹{Math.round(campaign.budget / campaign.duration_days).toLocaleString()}/day</p>
                  </div>
                  
                  {/* Schedule */}
                  <div className="col-span-2 flex flex-col justify-center">
                    <p className="text-white text-sm">{campaign.start_date}</p>
                    <p className="text-xs text-gray-500">{campaign.duration_days} days</p>
                  </div>
                  
                  {/* Performance */}
                  <div className="col-span-2 flex flex-col justify-center">
                    <p className="text-gray-500 text-sm">—</p>
                    <p className="text-xs text-gray-600">No data</p>
                  </div>
                  
                  {/* Actions - 3-Dot Menu Only */}
                  <div className="col-span-1 flex items-center justify-end relative">
                    <button
                      onClick={() => setOpenMenuIndex(openMenuIndex === `all-${idx}` ? null : `all-${idx}`)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                    
                    {/* Dropdown Menu */}
                    {openMenuIndex === `all-${idx}` && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setOpenMenuIndex(null)}
                        ></div>
                        <div className="absolute right-0 top-10 z-20 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1">
                          <button className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-gray-700 flex items-center gap-3 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit campaign
                          </button>
                          <button className="w-full px-4 py-2.5 text-left text-sm text-yellow-400 hover:bg-gray-700 flex items-center gap-3 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Pause campaign
                          </button>
                          <button className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-gray-700 flex items-center gap-3 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Stop campaign
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
        )}

          </div>
        )}


        {/* Campaign History */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Campaign History</h2>
          
          {filteredCampaigns.length === 0 ? (
            <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
              <BarChart3 className="mx-auto text-gray-600 mb-4" size={48} />
              <p className="text-gray-400">No campaign history yet</p>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-900/50 border-b border-gray-700 text-xs font-medium text-gray-400 uppercase">
                <div className="col-span-3">Campaign</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Budget</div>
                <div className="col-span-2">Schedule</div>
                <div className="col-span-2">Performance</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>
              
              {/* Rows */}
              {filteredCampaigns.map((campaign, idx) => (
                <div 
                  key={idx} 
                  className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-700 last:border-b-0 hover:bg-gray-750 transition-colors"
                >
                  <div className="col-span-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium mb-1">{campaign.name}</p>
                        <div className="flex gap-1.5 flex-wrap mt-1">
                          {campaign.channels?.split(',').slice(0, 2).map((ch, i) => (
                            <span key={i} className="px-2 py-0.5 bg-gray-700/50 text-gray-300 text-xs rounded">
                              {ch.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-2 flex flex-col justify-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-700 text-gray-400 text-xs font-medium rounded w-fit">
                      {campaign.status}
                    </span>
                  </div>
                  
                  <div className="col-span-2 flex flex-col justify-center">
                    <p className="text-white font-semibold text-sm">₹{(campaign.budget / 1000).toFixed(1)}K</p>
                    <p className="text-xs text-gray-500">Spent: ₹{(campaign.spend / 1000).toFixed(1)}K</p>
                  </div>
                  
                  <div className="col-span-2 flex flex-col justify-center">
                    <p className="text-white text-sm">{campaign.start_date}</p>
                    <p className="text-xs text-gray-500">{campaign.duration} days</p>
                  </div>
                  
                  <div className="col-span-2 flex flex-col justify-center">
                    <p className="text-white font-semibold text-sm">{campaign.impressions?.toLocaleString() || '—'}</p>
                    <p className="text-xs text-gray-500">{campaign.clicks?.toLocaleString() || 0} clicks</p>
                  </div>
                  
                  {/* Actions - Download + Menu */}
                  <div className="col-span-1 flex items-center justify-end gap-2 relative">
                    {/* Download Button */}
                    <button
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-gray-700 rounded transition-colors"
                      title="Download report"
                    >
                      <Download size={18} />
                    </button>
                    
                    {/* 3-Dot Menu */}
                    <button
                      onClick={() => setOpenMenuIndex(openMenuIndex === `history-${idx}` ? null : `history-${idx}`)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                    
                    {/* Dropdown Menu */}
                    {openMenuIndex === `history-${idx}` && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setOpenMenuIndex(null)}
                        ></div>
                        <div className="absolute right-0 top-10 z-20 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1">
                          <button className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-gray-700 flex items-center gap-3 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View details
                          </button>
                          <button className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-gray-700 flex items-center gap-3 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                            Duplicate
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Campaign Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <BarChart3 className="text-blue-400 mb-2" size={24} />
            <p className="text-gray-400 text-sm">Total Campaigns</p>
            <p className="text-2xl font-bold text-white">{filteredCampaigns.length}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <Play className="text-green-400 mb-2" size={24} />
            <p className="text-gray-400 text-sm">Active</p>
            <p className="text-2xl font-bold text-white">{activeCampaigns}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <DollarSign className="text-purple-400 mb-2" size={24} />
            <p className="text-gray-400 text-sm">Total Spend</p>
            <p className="text-2xl font-bold text-white">₹{(totalSpend / 100000).toFixed(1)}L</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <TrendingUp className="text-orange-400 mb-2" size={24} />
            <p className="text-gray-400 text-sm">Avg ROAS</p>
            <p className="text-2xl font-bold text-white">{avgRoas.toFixed(2)}x</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Channel</label>
              <select 
                value={filterChannel}
                onChange={(e) => setFilterChannel(e.target.value)}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded"
              >
                <option value="all">All Channels</option>
                {channels.map(ch => (
                  <option key={ch} value={ch}>{ch}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Sort By</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded"
              >
                <option value="roas">ROAS</option>
                <option value="revenue">Revenue</option>
                <option value="spend">Spend</option>
                <option value="conversions">Conversions</option>
                <option value="name">Name</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Order</label>
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Campaigns Table */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-6">
            {viewMode === 'zepto' ? 'Zepto Campaign Performance' : 'Platform-wide Campaigns'}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-400 border-b border-gray-700">
                  <th className="pb-3 pr-4">Campaign Name</th>
                  {viewMode === 'all' && <th className="pb-3 pr-4">Brand</th>}
                  <th className="pb-3 pr-4">Channel</th>
                  <th className="pb-3 pr-4 text-right">Spend</th>
                  <th className="pb-3 pr-4 text-right">Revenue</th>
                  <th className="pb-3 pr-4 text-right">ROAS</th>
                  <th className="pb-3 pr-4 text-right">Conversions</th>
                  <th className="pb-3 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign, idx) => (
                  <tr key={idx} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="py-4 pr-4 text-white font-medium">{campaign.name}</td>
                    {viewMode === 'all' && (
                      <td className="py-4 pr-4 text-gray-400">{campaign.brand || 'Zepto'}</td>
                    )}
                    <td className="py-4 pr-4 text-gray-400">{campaign.channel}</td>
                    <td className="py-4 pr-4 text-right text-gray-300">₹{(campaign.spend / 100000).toFixed(1)}L</td>
                    <td className="py-4 pr-4 text-right text-green-400">₹{(campaign.revenue / 100000).toFixed(1)}L</td>
                    <td className="py-4 pr-4 text-right">
                      <span className={`font-bold ${
                        campaign.roas > 5 ? 'text-green-400' : 
                        campaign.roas > 2 ? 'text-blue-400' : 
                        'text-yellow-400'
                      }`}>
                        {campaign.roas.toFixed(2)}x
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-right text-orange-400">{campaign.conversions.toLocaleString()}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded text-xs ${
                        campaign.status === 'active' 
                          ? 'bg-green-900/30 text-green-400' 
                          : 'bg-gray-700 text-gray-400'
                      }`}>
                        {campaign.status}
                      </span>
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
