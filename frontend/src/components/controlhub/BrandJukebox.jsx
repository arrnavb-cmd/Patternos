import React from "react";
import { useState } from 'react';
import { Crown, Star, Trophy, Zap, Lock, Unlock, ChevronRight } from 'lucide-react';

export default function BrandJukebox() {
  const [advertisers] = useState([
    {
      id: 1,
      name: 'Nike India',
      tier: 'platinum',
      spend: 2500000,
      campaigns: 45,
      roi: 5.8,
      features_unlocked: 25,
      next_tier_spend: null
    },
    {
      id: 2,
      name: 'boAt Lifestyle',
      tier: 'gold',
      spend: 850000,
      campaigns: 28,
      roi: 4.5,
      features_unlocked: 18,
      next_tier_spend: 1500000
    },
    {
      id: 3,
      name: 'Mamaearth',
      tier: 'silver',
      spend: 450000,
      campaigns: 15,
      roi: 3.8,
      features_unlocked: 12,
      next_tier_spend: 500000
    },
    {
      id: 4,
      name: 'Local Bakery Co',
      tier: 'bronze',
      spend: 75000,
      campaigns: 5,
      roi: 3.2,
      features_unlocked: 6,
      next_tier_spend: 100000
    }
  ]);

  const tiers = [
    {
      id: 'platinum',
      name: 'Platinum',
      icon: Crown,
      color: 'from-purple-500 to-pink-500',
      min_spend: 1500000,
      features: [
        'All ad formats unlocked',
        'Dedicated account manager',
        'Priority support 24/7',
        'Custom audience targeting',
        'Advanced analytics dashboard',
        'API access',
        'Beta features early access',
        'Quarterly business reviews',
        'White-label reporting',
        'Custom integrations'
      ],
      perks: [
        '10% cashback on spend',
        'Free A/B testing',
        'Premium placements',
        'Volume discounts'
      ]
    },
    {
      id: 'gold',
      name: 'Gold',
      icon: Trophy,
      color: 'from-yellow-500 to-orange-500',
      min_spend: 500000,
      features: [
        'All standard ad formats',
        'Email support',
        'Advanced targeting',
        'Custom reporting',
        'Multi-channel campaigns',
        'Conversion tracking',
        'Audience insights',
        'Campaign automation'
      ],
      perks: [
        '5% cashback on spend',
        'Priority ad review',
        'Extended reach'
      ]
    },
    {
      id: 'silver',
      name: 'Silver',
      icon: Star,
      color: 'from-slate-400 to-slate-600',
      min_spend: 100000,
      features: [
        'Product ads',
        'Display ads',
        'Video ads',
        'Basic targeting',
        'Standard reporting',
        'Email support',
        'Self-serve dashboard'
      ],
      perks: [
        '2% cashback on spend',
        'Standard support'
      ]
    },
    {
      id: 'bronze',
      name: 'Bronze',
      icon: Zap,
      color: 'from-orange-700 to-red-700',
      min_spend: 25000,
      features: [
        'Product ads only',
        'Basic targeting',
        'Basic reporting',
        'Community support',
        'Self-serve tools'
      ],
      perks: [
        'Getting started guide',
        'Free training'
      ]
    }
  ];

  const getTierData = (tierId) => tiers.find(t => t.id === tierId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Crown size={32} />
          <div>
            <h2 className="text-2xl font-bold">Brand Jukebox</h2>
            <p className="text-indigo-100">Tiered advertiser experience management</p>
          </div>
        </div>
      </div>

      {/* Tier Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {tiers.map(tier => {
          const Icon = tier.icon;
          const tierAdvertisers = advertisers.filter(a => a.tier === tier.id);
          return (
            <div key={tier.id} className="bg-slate-800 rounded-xl p-6 hover:scale-105 transition-all cursor-pointer">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-4`}>
                <Icon className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
              <p className="text-slate-400 text-sm mb-4">
                Min. ₹{(tier.min_spend / 100000).toFixed(1)}L/month
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">{tierAdvertisers.length}</p>
                  <p className="text-slate-400 text-xs">Advertisers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-400">
                    {tier.features.length}
                  </p>
                  <p className="text-slate-400 text-xs">Features</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advertiser Management */}
      <div className="bg-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Active Advertisers</h3>
          <select className="px-4 py-2 bg-slate-700 text-white rounded-lg text-sm">
            <option>All Tiers</option>
            <option>Platinum</option>
            <option>Gold</option>
            <option>Silver</option>
            <option>Bronze</option>
          </select>
        </div>

        <div className="space-y-4">
          {advertisers.map(advertiser => {
            const tierData = getTierData(advertiser.tier);
            const TierIcon = tierData.icon;
            return (
              <div key={advertiser.id} className="bg-slate-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${tierData.color} flex items-center justify-center`}>
                      <TierIcon className="text-white" size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{advertiser.name}</h4>
                      <p className="text-slate-400 text-sm">{tierData.name} Tier</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium">
                    Manage Access
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Total Spend</p>
                    <p className="text-white font-bold">₹{(advertiser.spend / 100000).toFixed(1)}L</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Campaigns</p>
                    <p className="text-white font-bold">{advertiser.campaigns}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs mb-1">ROI</p>
                    <p className="text-green-400 font-bold">{advertiser.roi}x</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Features Unlocked</p>
                    <p className="text-white font-bold">{advertiser.features_unlocked}/{tierData.features.length}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Next Tier</p>
                    {advertiser.next_tier_spend ? (
                      <p className="text-yellow-400 font-bold">
                        ₹{((advertiser.next_tier_spend - advertiser.spend) / 100000).toFixed(1)}L away
                      </p>
                    ) : (
                      <p className="text-purple-400 font-bold">Max Tier</p>
                    )}
                  </div>
                </div>

                {advertiser.next_tier_spend && (
                  <div className="bg-slate-600 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-slate-300 text-sm">Progress to next tier</p>
                      <p className="text-white text-sm font-medium">
                        {Math.round((advertiser.spend / advertiser.next_tier_spend) * 100)}%
                      </p>
                    </div>
                    <div className="bg-slate-500 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                        style={{ width: `${(advertiser.spend / advertiser.next_tier_spend) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature Matrix */}
      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Feature Access Matrix</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 font-medium py-3 px-4">Feature</th>
                {tiers.map(tier => (
                  <th key={tier.id} className="text-center text-slate-400 font-medium py-3 px-4">
                    {tier.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {['Product Ads', 'Display Ads', 'Video Ads', 'Story Ads', 'In-Store Ads', 'API Access', 'Custom Reporting', 'Dedicated Manager', 'Beta Features', 'White-label Reports'].map((feature, idx) => (
                <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="py-3 px-4 text-white">{feature}</td>
                  <td className="py-3 px-4 text-center">
                    <Unlock className="inline text-green-400" size={20} />
                  </td>
                  <td className="py-3 px-4 text-center">
                    {idx < 8 ? <Unlock className="inline text-green-400" size={20} /> : <Lock className="inline text-slate-600" size={20} />}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {idx < 5 ? <Unlock className="inline text-green-400" size={20} /> : <Lock className="inline text-slate-600" size={20} />}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {idx < 3 ? <Unlock className="inline text-green-400" size={20} /> : <Lock className="inline text-slate-600" size={20} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Beta Testing Program */}
      <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">🧪 Beta Testing Program</h3>
        <p className="text-blue-100 mb-4">Test new features with select advertisers before full rollout</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-blue-200 text-sm mb-1">In Beta</p>
            <p className="text-2xl font-bold">3 Features</p>
            <p className="text-blue-200 text-xs mt-1">AI Ad Generator, Voice Ads, AR Try-on</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-blue-200 text-sm mb-1">Beta Testers</p>
            <p className="text-2xl font-bold">5 Brands</p>
            <p className="text-blue-200 text-xs mt-1">Platinum tier only</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-blue-200 text-sm mb-1">Feedback Received</p>
            <p className="text-2xl font-bold">87%</p>
            <p className="text-blue-200 text-xs mt-1">Positive response rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
