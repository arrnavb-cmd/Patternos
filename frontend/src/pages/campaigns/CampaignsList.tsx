import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  TrendingUp, 
  DollarSign, 
  Eye, 
  MousePointer, 
  Activity,
  Plus,
  Search,
  Filter
} from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  brand: string;
  status: 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  roas?: number;
  start_date: string;
  end_date: string;
}

export default function CampaignsList() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('https://patternos-production-1cca.up.railway.app/api/v1/campaigns/list');
      const data = await response.json();
      
      const campaignsWithStats = data.campaigns.map((c: any) => ({
        ...c,
        impressions: Math.floor(Math.random() * 100000) + 10000,
        clicks: Math.floor(Math.random() * 5000) + 500,
        conversions: Math.floor(Math.random() * 200) + 20,
        roas: (Math.random() * 5 + 1).toFixed(2)
      }));
      
      setCampaigns(campaignsWithStats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // CRITICAL: Filter campaigns by brand if user is a brand
  const brandFilteredCampaigns = user?.role === 'brand' 
    ? campaigns.filter(c => c.brand === user.brand)
    : campaigns;

  const filteredCampaigns = brandFilteredCampaigns.filter(c => {
    const matchesFilter = filter === 'all' || c.status === filter;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalBudget = brandFilteredCampaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = brandFilteredCampaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalImpressions = brandFilteredCampaigns.reduce((sum, c) => sum + (c.impressions || 0), 0);
  const totalClicks = brandFilteredCampaigns.reduce((sum, c) => sum + (c.clicks || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* PERSONALIZED WELCOME BANNER FOR BRANDS */}
        {user?.role === 'brand' && (
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 mb-8 shadow-2xl">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user.brand}! 👋
            </h1>
            <p className="text-purple-100">
              Manage your campaigns on Zepto Retail Media
            </p>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user?.role === 'brand' ? `${user.brand} Campaigns` : 'All Campaigns'}
            </h1>
            <p className="text-gray-600 mt-1">
              {user?.role === 'brand' 
                ? `Track and optimize your ${user.brand} advertising performance` 
                : 'Manage and track all advertising campaigns'}
            </p>
          </div>
          {user?.role === 'brand' && (
            <Link
              to="/campaigns/create"
              className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition"
            >
              <Plus size={20} />
              Create Campaign
            </Link>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ₹{(totalBudget / 100000).toFixed(1)}L
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <DollarSign className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ₹{(totalSpent / 100000).toFixed(1)}L
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {((totalSpent / totalBudget) * 100).toFixed(1)}% of budget
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Impressions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {(totalImpressions / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Eye className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {(totalClicks / 1000).toFixed(1)}K
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {((totalClicks / totalImpressions) * 100).toFixed(2)}% CTR
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <MousePointer className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-2">
              {(['all', 'active', 'paused', 'completed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition ${
                    filter === status
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Campaigns Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaign
                  </th>
                  {user?.role !== 'brand' && (
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Brand
                    </th>
                  )}
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Impressions
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ROAS
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{campaign.name}</p>
                    </td>
                    {user?.role !== 'brand' && (
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {campaign.brand}
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          ₹{(campaign.spent / 1000).toFixed(0)}K / ₹{(campaign.budget / 1000).toFixed(0)}K
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-purple-600 h-1.5 rounded-full"
                            style={{ width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {campaign.impressions?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">{campaign.clicks?.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">
                          {((campaign.clicks! / campaign.impressions!) * 100).toFixed(2)}% CTR
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${
                        parseFloat(campaign.roas!) > 3 ? 'text-green-600' : 
                        parseFloat(campaign.roas!) > 1 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {campaign.roas}x
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/campaigns/${campaign.id}`}
                        className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                      >
                        View Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCampaigns.length === 0 && (
            <div className="text-center py-12">
              <Activity className="mx-auto text-gray-400" size={48} />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No campaigns found</h3>
              <p className="mt-2 text-sm text-gray-500">
                {user?.role === 'brand' 
                  ? `Get started by creating your first ${user.brand} campaign.`
                  : 'No campaigns match your filters.'}
              </p>
              {user?.role === 'brand' && (
                <Link
                  to="/campaigns/create"
                  className="mt-4 inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700"
                >
                  <Plus size={20} />
                  Create Campaign
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
