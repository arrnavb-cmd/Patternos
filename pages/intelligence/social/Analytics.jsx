import { useState } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Target, Facebook, Instagram } from 'lucide-react';

export default function SocialAnalytics() {
  const platforms = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'blue',
      stats: {
        spend: 285000,
        impressions: 5200000,
        clicks: 76000,
        conversions: 2480,
        roas: 6.8,
        ctr: 1.46,
        cpc: 3.75,
        cpa: 115
      }
    },
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'pink',
      stats: {
        spend: 165000,
        impressions: 3300000,
        clicks: 49000,
        conversions: 1720,
        roas: 5.7,
        ctr: 1.48,
        cpc: 3.37,
        cpa: 96
      }
    }
  ];

  const comparativeMetrics = [
    { metric: 'Cost Per Click', facebook: '₹3.75', instagram: '₹3.37', winner: 'instagram' },
    { metric: 'Click-Through Rate', facebook: '1.46%', instagram: '1.48%', winner: 'instagram' },
    { metric: 'Conversion Rate', facebook: '3.26%', instagram: '3.51%', winner: 'instagram' },
    { metric: 'ROAS', facebook: '6.8x', instagram: '5.7x', winner: 'facebook' },
    { metric: 'Cost Per Acquisition', facebook: '₹115', instagram: '₹96', winner: 'instagram' }
  ];

  const topPerformingAds = [
    {
      name: 'Jordan 1 Retro - Video',
      platform: 'instagram',
      format: 'Video',
      impressions: 850000,
      clicks: 18500,
      conversions: 740,
      roas: 9.2
    },
    {
      name: 'Nike Air Max - Carousel',
      platform: 'facebook',
      format: 'Carousel',
      impressions: 720000,
      clicks: 14200,
      conversions: 568,
      roas: 8.1
    },
    {
      name: 'Summer Collection - Story',
      platform: 'instagram',
      format: 'Story',
      impressions: 980000,
      clicks: 22000,
      conversions: 880,
      roas: 7.8
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Cross-Platform Analytics</h1>
          <p className="text-gray-400">Unified reporting across Zepto, Facebook & Instagram</p>
        </div>

        {/* Platform Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {platforms.map((platform, idx) => {
            const Icon = platform.icon;
            return (
              <div key={idx} className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-${platform.color}-600 flex items-center justify-center`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{platform.name} Performance</h3>
                    <p className="text-gray-400 text-sm">Last 30 days</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Total Spend</p>
                    <p className="text-lg font-bold text-white">₹{(platform.stats.spend / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Impressions</p>
                    <p className="text-lg font-bold text-white">{(platform.stats.impressions / 1000000).toFixed(1)}M</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Clicks</p>
                    <p className="text-lg font-bold text-white">{(platform.stats.clicks / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Conversions</p>
                    <p className="text-lg font-bold text-white">{platform.stats.conversions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">ROAS</p>
                    <p className="text-lg font-bold text-green-400">{platform.stats.roas}x</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">CTR</p>
                    <p className="text-lg font-bold text-blue-400">{platform.stats.ctr}%</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparative Metrics */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Platform Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-gray-400 pb-3 text-sm">Metric</th>
                  <th className="text-left text-gray-400 pb-3 text-sm">Facebook</th>
                  <th className="text-left text-gray-400 pb-3 text-sm">Instagram</th>
                  <th className="text-left text-gray-400 pb-3 text-sm">Winner</th>
                </tr>
              </thead>
              <tbody>
                {comparativeMetrics.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-700">
                    <td className="py-4 text-white font-medium">{item.metric}</td>
                    <td className={`py-4 ${item.winner === 'facebook' ? 'text-green-400 font-bold' : 'text-gray-300'}`}>
                      {item.facebook}
                    </td>
                    <td className={`py-4 ${item.winner === 'instagram' ? 'text-green-400 font-bold' : 'text-gray-300'}`}>
                      {item.instagram}
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.winner === 'facebook' 
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-pink-500/20 text-pink-400'
                      }`}>
                        {item.winner === 'facebook' ? 'Facebook' : 'Instagram'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Performing Ads */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Top Performing Ads (All Platforms)</h2>
          <div className="space-y-4">
            {topPerformingAds.map((ad, idx) => (
              <div key={idx} className="bg-gray-700 rounded-lg p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold">
                    #{idx + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{ad.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        ad.platform === 'facebook' 
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-pink-500/20 text-pink-400'
                      }`}>
                        {ad.platform}
                      </span>
                      <span className="px-2 py-1 bg-gray-600 text-gray-300 rounded text-xs">
                        {ad.format}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 text-right">
                  <div>
                    <p className="text-xs text-gray-400">Impressions</p>
                    <p className="text-white font-bold">{(ad.impressions / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Clicks</p>
                    <p className="text-white font-bold">{ad.clicks.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Conversions</p>
                    <p className="text-white font-bold">{ad.conversions}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">ROAS</p>
                    <p className="text-green-400 font-bold text-xl">{ad.roas}x</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
