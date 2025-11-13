import React from "react";
import { Zap } from 'lucide-react';

export default function AudienceTargeting({ onNext, onBack }) {
  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-2">Audience Targeting</h2>
      <p className="text-gray-400 text-sm mb-6">Define who will see your ads using PatternOS intelligence</p>
      
      <div className="space-y-6">
        {/* Demographics */}
        <div className="bg-gray-700 rounded-xl p-5">
          <h3 className="text-lg font-bold text-white mb-4">Demographics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Age Range</label>
              <div className="flex gap-2">
                <input type="number" placeholder="18" defaultValue="18" className="w-full bg-gray-600 text-white rounded-lg p-2" />
                <input type="number" placeholder="65" defaultValue="65" className="w-full bg-gray-600 text-white rounded-lg p-2" />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Gender</label>
              <div className="flex gap-2">
                {['All', 'Male', 'Female'].map(g => (
                  <button key={g} className="flex-1 bg-gray-600 hover:bg-purple-600 text-white rounded-lg p-2 text-sm transition-colors">{g}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PatternOS Behavioral Segments */}
        <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-5 border-2 border-purple-500/30">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="text-purple-400" size={20} />
            <h3 className="text-lg font-bold text-white">PatternOS Behavioral Segments</h3>
            <span className="px-2 py-1 bg-purple-500 text-white text-xs rounded-full font-bold">PROPRIETARY</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'quick-buyers', name: 'Quick-Buyers', desc: 'Fast purchase cycles', size: '~125K' },
              { id: 'home-lovers', name: 'Home-Lovers', desc: 'Home décor enthusiasts', size: '~110K' },
              { id: 'eco-seekers', name: 'Eco-Seekers', desc: 'Sustainability-focused', size: '~95K' },
              { id: 'bargain-hunters', name: 'Bargain-Hunters', desc: 'Price-sensitive', size: '~130K' }
            ].map(seg => (
              <button key={seg.id} className="p-4 rounded-lg bg-gray-800 hover:bg-purple-600 border border-gray-700 hover:border-purple-400 text-left transition-all">
                <div className="font-bold text-white mb-1">{seg.name}</div>
                <div className="text-xs text-gray-400 mb-2">{seg.desc}</div>
                <div className="text-xs text-purple-300 font-mono">{seg.size} users</div>
              </button>
            ))}
          </div>
        </div>

        {/* GeoFlow Regional Targeting */}
        <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl p-5 border-2 border-blue-500/30">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-blue-400 text-xl">📍</span>
            <h3 className="text-lg font-bold text-white">GeoFlow Regional Targeting</h3>
            <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-bold">HYPERLOCAL</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[
              { code: 'IN-DL', name: 'Delhi', size: '~85K' },
              { code: 'IN-MH', name: 'Maharashtra', size: '~92K' },
              { code: 'IN-UP', name: 'Uttar Pradesh', size: '~78K' },
              { code: 'IN-TN', name: 'Tamil Nadu', size: '~71K' },
              { code: 'IN-KA', name: 'Karnataka', size: '~68K' }
            ].map(region => (
              <button key={region.code} className="p-3 rounded-lg bg-gray-800 hover:bg-blue-600 border border-gray-700 hover:border-blue-400 text-center transition-all">
                <div className="font-bold text-white text-sm mb-1">{region.name}</div>
                <div className="text-xs text-gray-400">{region.size}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Spending Tier */}
        <div className="bg-gray-700 rounded-xl p-5">
          <h3 className="text-lg font-bold text-white mb-4">Spending Tier</h3>
          <div className="grid grid-cols-4 gap-3">
            {[
              { id: 'budget', name: 'Budget', range: '₹0-500', size: '~140K' },
              { id: 'mid', name: 'Mid-tier', range: '₹501-1,200', size: '~180K' },
              { id: 'premium', name: 'Premium', range: '₹1,201-2,000', size: '~95K' },
              { id: 'luxury', name: 'Luxury', range: '₹2,000+', size: '~45K' }
            ].map(tier => (
              <button key={tier.id} className="p-3 rounded-lg bg-gray-800 hover:bg-green-600 border border-gray-700 hover:border-green-400 text-center transition-all">
                <div className="font-bold text-white text-sm mb-1">{tier.name}</div>
                <div className="text-xs text-gray-400 mb-1">{tier.range}</div>
                <div className="text-xs text-gray-500">{tier.size}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Estimated Reach */}
        <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-2 border-green-500/30 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Estimated Reach</h3>
              <p className="text-gray-400 text-sm">Based on PatternOS targeting</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-400">87,500</div>
              <div className="text-sm text-gray-400">potential users</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button onClick={onBack} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors">
          Back
        </button>
        <button onClick={onNext} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors">
          Next: Ad Type
        </button>
      </div>
    </div>
  );
}
