import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, Pause, BarChart3, Download, Filter, Plus, TrendingUp, 
  DollarSign, Target, Users, ChevronDown, Search, Calendar,
  Activity, CheckCircle, Clock, XCircle
} from 'lucide-react';
import CampaignDetailModal from '../components/CampaignDetailModal';

export default function Campaigns() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [selectedIntent, setSelectedIntent] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('start_date');
  const [sortOrder, setSortOrder] = useState('desc');
  const itemsPerPage = 10;
  
  const brands = ['all', ...new Set(campaigns.map(c => c.brand))];
  const channels = ['all', ...new Set(campaigns.map(c => c.channel))];
  const intents = ['all', 'High', 'Medium', 'Low'];

  useEffect(() => {
    fetchCampaigns();
  }, [selectedBrand, selectedChannel, selectedIntent]);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:8000/api/v1/campaigns/all?';
      if (selectedBrand !== 'all') url += `brand=${selectedBrand}&`;
      if (selectedChannel !== 'all') url += `channel=${selectedChannel}&`;
      if (selectedIntent !== 'all') url += `intent_level=${selectedIntent}&`;
      
      const res = await fetch(url);
      const data = await res.json();
      setCampaigns(data.campaigns || []);
      setSummary(data.summary || {});
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns = campaigns.filter(c => {
    if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
    if (searchQuery && !c.campaign_id.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !c.brand.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    if (sortBy === 'start_date' || sortBy === 'end_date') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCampaigns = filteredCampaigns.slice(startIndex, startIndex + itemsPerPage);

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    if (amount >= 10000000) return '₹' + Math.round(amount / 10000000) + 'Cr';
    if (amount >= 100000) return '₹' + Math.round(amount / 100000) + 'L';
    return '₹' + Math.round(amount).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'Completed': return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      case 'Scheduled': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Active': return <Activity size={14} />;
      case 'Completed': return <CheckCircle size={14} />;
      case 'Scheduled': return <Clock size={14} />;
      default: return <XCircle size={14} />;
    }
  };

  const getIntentColor = (intent) => {
    switch(intent) {
      case 'High': return 'bg-red-500/20 text-red-400';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'Low': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const downloadCSV = () => {
    const csv = [
      ['Campaign ID', 'Brand', 'Channel', 'Status', 'Spend', 'Revenue', 'ROAS', 'Impressions', 'Clicks', 'Conversions', 'CTR'].join(','),
      ...filteredCampaigns.map(c => [
        c.campaign_id, c.brand, c.channel, c.status, 
        c.total_spend, c.revenue, c.roas, 
        c.impressions, c.clicks, c.conversions, c.ctr
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campaigns_report.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Campaign Management</h1>
            <p className="text-gray-400 mt-1">Retail Media Network Campaigns</p>
          </div>
          <button 
            onClick={() => navigate('/campaigns/create')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            <Plus size={20} /> Create Campaign
          </button>
        </div>

        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Target className="text-blue-400" size={28} />
                <div className="text-blue-400 text-xs font-semibold px-2 py-1 bg-blue-500/20 rounded">TOTAL</div>
              </div>
              <p className="text-3xl font-bold text-white">{summary.total_campaigns}</p>
              <p className="text-sm text-gray-400 mt-1">Total Campaigns</p>
              <p className="text-xs text-blue-400 mt-2">{summary.active_campaigns} Active</p>
            </div>

            <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="text-green-400" size={28} />
                <TrendingUp className="text-green-400" size={16} />
              </div>
              <p className="text-3xl font-bold text-white">{formatCurrency(summary.total_spend)}</p>
              <p className="text-sm text-gray-400 mt-1">Total Ad Spend</p>
              <p className="text-xs text-green-400 mt-2">Across all campaigns</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <BarChart3 className="text-purple-400" size={28} />
                <TrendingUp className="text-purple-400" size={16} />
              </div>
              <p className="text-3xl font-bold text-white">{formatCurrency(summary.total_revenue)}</p>
              <p className="text-sm text-gray-400 mt-1">Total Revenue</p>
              <p className="text-xs text-purple-400 mt-2">Attributed sales</p>
            </div>

            <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border border-orange-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="text-orange-400" size={28} />
                <div className="text-orange-400 text-xs font-semibold px-2 py-1 bg-orange-500/20 rounded">AVG</div>
              </div>
              <p className="text-3xl font-bold text-white">{Math.round(summary.avg_roas)}x</p>
              <p className="text-sm text-gray-400 mt-1">Average ROAS</p>
              <p className="text-xs text-orange-400 mt-2">Return on ad spend</p>
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Filter className="text-gray-400" size={20} />
              <h3 className="text-lg font-semibold text-white">Filters & Sort</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 bg-gray-900 border border-gray-700 rounded text-white text-sm">
                <option value="start_date">Start Date</option>
                <option value="end_date">End Date</option>
                <option value="total_spend">Spend</option>
                <option value="revenue">Revenue</option>
                <option value="roas">ROAS</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-1 bg-gray-900 border border-gray-700 rounded text-white text-sm hover:bg-gray-800">
                {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <select 
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
              {brands.map(b => <option key={b} value={b}>{b === 'all' ? 'All Brands' : b}</option>)}
            </select>

            <select 
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
              {channels.map(c => <option key={c} value={c}>{c === 'all' ? 'All Channels' : c}</option>)}
            </select>

            <select 
              value={selectedIntent}
              onChange={(e) => setSelectedIntent(e.target.value)}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
              {intents.map(i => <option key={i} value={i}>{i === 'all' ? 'All Intent Levels' : i + ' Intent'}</option>)}
            </select>

            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Scheduled">Scheduled</option>
            </select>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              Showing {filteredCampaigns.length} of {campaigns.length} campaigns
            </p>
            <button 
              onClick={downloadCSV}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Campaign Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Brand</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Channel</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Intent</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase">Spend</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase">Revenue</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase">ROAS</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase">CTR</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loading ? (
                  <tr><td colSpan="10" className="px-6 py-12 text-center text-gray-400">Loading...</td></tr>
                ) : filteredCampaigns.length === 0 ? (
                  <tr><td colSpan="10" className="px-6 py-12 text-center text-gray-400">No campaigns found</td></tr>
                ) : (
                  paginatedCampaigns.map((campaign, idx) => (
                    <tr key={idx} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-white">{campaign.campaign_name}</span>
                          <span className="text-xs text-gray-500">{campaign.campaign_id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">{campaign.brand}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">{campaign.channel}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-1 px-2 py-1 rounded border w-fit ${getStatusColor(campaign.status)}`}>
                          {getStatusIcon(campaign.status)}
                          <span className="text-xs font-medium">{campaign.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${getIntentColor(campaign.intent_level)}`}>
                          {campaign.intent_level}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-300">{formatCurrency(campaign.total_spend)}</td>
                      <td className="px-6 py-4 text-right text-sm text-green-400 font-medium">{formatCurrency(campaign.revenue)}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-bold text-orange-400">{Math.round(campaign.roas)}x</span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-300">{Math.round(campaign.ctr)}%</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => setSelectedCampaign(campaign)}
                            className="p-2 hover:bg-gray-700 rounded-lg"
                            title="View Report">
                            <BarChart3 size={16} className="text-blue-400" />
                          </button>
                          <button onClick={() => downloadCSV()} className="p-2 hover:bg-gray-700 rounded-lg">
                            <Download size={16} className="text-gray-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredCampaigns.length)} of {filteredCampaigns.length}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                  Previous
                </button>
                
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 rounded ${
                            currentPage === page 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}>
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="text-gray-500">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Campaign Detail Modal */}
      {selectedCampaign && (
        <CampaignDetailModal 
          campaign={selectedCampaign} 
          onClose={() => setSelectedCampaign(null)} 
        />
      )}
    </div>
  );
}
