import React from "react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Users, Crown, Star, Trophy, Zap, Plus, 
  Search, Filter, TrendingUp, DollarSign, Mail, Phone 
} from 'lucide-react';

export default function BrandManagement() {
  const navigate = useNavigate();
  const aggregator = JSON.parse(localStorage.getItem('aggregator') || '{}');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState('all');

  const [brands] = useState([
    {
      id: 'BRD_001',
      name: 'Hindustan Unilever (HUL)',
      logo: '🧴',
      tier: 'platinum',
      total_spend: 2500000,
      monthly_spend: 250000,
      campaigns: 15,
      roi: 4.8,
      status: 'active',
      contact: {
        name: 'Rajesh Kumar',
        email: 'rajesh.k@hul.com',
        phone: '+91 98765 43210'
      },
      joined: '2024-01-15',
      last_campaign: '2 hours ago'
    },
    {
      id: 'BRD_002',
      name: 'Procter & Gamble India',
      logo: '🧼',
      tier: 'platinum',
      total_spend: 1800000,
      monthly_spend: 180000,
      campaigns: 12,
      roi: 4.2,
      status: 'active',
      contact: {
        name: 'Priya Singh',
        email: 'priya.s@pg.com',
        phone: '+91 98765 43211'
      },
      joined: '2024-02-10',
      last_campaign: '1 day ago'
    },
    {
      id: 'BRD_003',
      name: 'Nike India',
      logo: '👟',
      tier: 'gold',
      total_spend: 1500000,
      monthly_spend: 150000,
      campaigns: 8,
      roi: 5.1,
      status: 'active',
      contact: {
        name: 'Amit Patel',
        email: 'amit.p@nike.com',
        phone: '+91 98765 43212'
      },
      joined: '2024-03-05',
      last_campaign: '5 hours ago'
    },
    {
      id: 'BRD_004',
      name: 'Mamaearth',
      logo: '🌿',
      tier: 'gold',
      total_spend: 950000,
      monthly_spend: 95000,
      campaigns: 10,
      roi: 3.9,
      status: 'active',
      contact: {
        name: 'Neha Sharma',
        email: 'neha@mamaearth.in',
        phone: '+91 98765 43213'
      },
      joined: '2024-04-12',
      last_campaign: '3 days ago'
    },
    {
      id: 'BRD_005',
      name: 'boAt Lifestyle',
      logo: '🎧',
      tier: 'silver',
      total_spend: 850000,
      monthly_spend: 85000,
      campaigns: 7,
      roi: 4.5,
      status: 'active',
      contact: {
        name: 'Karan Mehta',
        email: 'karan@boat-lifestyle.com',
        phone: '+91 98765 43214'
      },
      joined: '2024-05-20',
      last_campaign: '1 week ago'
    },
    {
      id: 'BRD_006',
      name: 'Noise',
      logo: '⌚',
      tier: 'silver',
      total_spend: 650000,
      monthly_spend: 65000,
      campaigns: 6,
      roi: 3.8,
      status: 'active',
      contact: {
        name: 'Sanjay Gupta',
        email: 'sanjay@gonoise.com',
        phone: '+91 98765 43215'
      },
      joined: '2024-06-08',
      last_campaign: '2 days ago'
    },
    {
      id: 'BRD_007',
      name: 'Fire-Boltt',
      logo: '⚡',
      tier: 'bronze',
      total_spend: 450000,
      monthly_spend: 45000,
      campaigns: 4,
      roi: 3.2,
      status: 'active',
      contact: {
        name: 'Vikram Reddy',
        email: 'vikram@fire-boltt.com',
        phone: '+91 98765 43216'
      },
      joined: '2024-07-15',
      last_campaign: '1 week ago'
    },
    {
      id: 'BRD_008',
      name: 'Local Bakery Co',
      logo: '🍞',
      tier: 'bronze',
      total_spend: 75000,
      monthly_spend: 7500,
      campaigns: 2,
      roi: 2.8,
      status: 'inactive',
      contact: {
        name: 'Ravi Kumar',
        email: 'ravi@localbakery.com',
        phone: '+91 98765 43217'
      },
      joined: '2024-08-20',
      last_campaign: '3 weeks ago'
    }
  ]);

  const getTierIcon = (tier) => {
    switch(tier) {
      case 'platinum': return { icon: Crown, color: 'from-purple-500 to-pink-500' };
      case 'gold': return { icon: Trophy, color: 'from-yellow-500 to-orange-500' };
      case 'silver': return { icon: Star, color: 'from-slate-400 to-slate-600' };
      case 'bronze': return { icon: Zap, color: 'from-orange-700 to-red-700' };
      default: return { icon: Users, color: 'from-blue-500 to-cyan-500' };
    }
  };

  const filteredBrands = brands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = filterTier === 'all' || brand.tier === filterTier;
    return matchesSearch && matchesTier;
  });

  const tierStats = {
    platinum: brands.filter(b => b.tier === 'platinum').length,
    gold: brands.filter(b => b.tier === 'gold').length,
    silver: brands.filter(b => b.tier === 'silver').length,
    bronze: brands.filter(b => b.tier === 'bronze').length
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-slate-400 hover:text-white"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center gap-3">
                <Users className="text-blue-400" size={24} />
                <h1 className="text-xl font-bold text-white">Brand Management</h1>
              </div>
            </div>

            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium flex items-center gap-2">
              <Plus size={20} />
              Onboard New Brand
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tier Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white">
            <Crown className="mb-3" size={32} />
            <p className="text-purple-100 text-sm mb-1">Platinum Tier</p>
            <p className="text-4xl font-bold">{tierStats.platinum}</p>
            <p className="text-purple-200 text-xs mt-2">₹15L+ monthly spend</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl p-6 text-white">
            <Trophy className="mb-3" size={32} />
            <p className="text-yellow-100 text-sm mb-1">Gold Tier</p>
            <p className="text-4xl font-bold">{tierStats.gold}</p>
            <p className="text-yellow-200 text-xs mt-2">₹5L-₹15L monthly</p>
          </div>

          <div className="bg-gradient-to-br from-slate-500 to-slate-700 rounded-xl p-6 text-white">
            <Star className="mb-3" size={32} />
            <p className="text-slate-100 text-sm mb-1">Silver Tier</p>
            <p className="text-4xl font-bold">{tierStats.silver}</p>
            <p className="text-slate-200 text-xs mt-2">₹1L-₹5L monthly</p>
          </div>

          <div className="bg-gradient-to-br from-orange-700 to-red-700 rounded-xl p-6 text-white">
            <Zap className="mb-3" size={32} />
            <p className="text-orange-100 text-sm mb-1">Bronze Tier</p>
            <p className="text-4xl font-bold">{tierStats.bronze}</p>
            <p className="text-orange-200 text-xs mt-2">Below ₹1L monthly</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800 rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search brands..."
                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFilterTier('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterTier === 'all' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                All Tiers
              </button>
              <button
                onClick={() => setFilterTier('platinum')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterTier === 'platinum' ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                Platinum
              </button>
              <button
                onClick={() => setFilterTier('gold')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterTier === 'gold' ? 'bg-yellow-500 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                Gold
              </button>
              <button
                onClick={() => setFilterTier('silver')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterTier === 'silver' ? 'bg-slate-500 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                Silver
              </button>
            </div>
          </div>
        </div>

        {/* Brands List */}
        <div className="space-y-4">
          {filteredBrands.map(brand => {
            const tierInfo = getTierIcon(brand.tier);
            const TierIcon = tierInfo.icon;

            return (
              <div key={brand.id} className="bg-slate-800 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{brand.logo}</div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-white">{brand.name}</h3>
                        <div className={`flex items-center gap-1 px-2 py-1 bg-gradient-to-r ${tierInfo.color} rounded-full`}>
                          <TierIcon size={14} className="text-white" />
                          <span className="text-white text-xs font-medium capitalize">{brand.tier}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          brand.status === 'active' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {brand.status}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm">Joined {brand.joined} • ID: {brand.id}</p>
                    </div>
                  </div>

                  <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium">
                    View Details
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div className="bg-slate-700 rounded-lg p-3">
                    <p className="text-slate-400 text-xs mb-1">Total Spend</p>
                    <p className="text-white font-bold">₹{(brand.total_spend / 100000).toFixed(1)}L</p>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-3">
                    <p className="text-slate-400 text-xs mb-1">Monthly Spend</p>
                    <p className="text-white font-bold">₹{(brand.monthly_spend / 100000).toFixed(1)}L</p>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-3">
                    <p className="text-slate-400 text-xs mb-1">Active Campaigns</p>
                    <p className="text-white font-bold">{brand.campaigns}</p>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-3">
                    <p className="text-slate-400 text-xs mb-1">ROI</p>
                    <p className="text-green-400 font-bold">{brand.roi}x</p>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-3">
                    <p className="text-slate-400 text-xs mb-1">Last Campaign</p>
                    <p className="text-white font-bold">{brand.last_campaign}</p>
                  </div>
                </div>

                <div className="bg-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-xs mb-3">Primary Contact</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="text-blue-400" size={16} />
                      <span className="text-white text-sm">{brand.contact.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="text-green-400" size={16} />
                      <span className="text-white text-sm">{brand.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="text-purple-400" size={16} />
                      <span className="text-white text-sm">{brand.contact.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
