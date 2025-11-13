import React from "react";
import { useState } from 'react';
import { CheckCircle, ExternalLink } from 'lucide-react';

export default function SocialMedia() {
  const [connectedAccounts] = useState({
    facebook: true,
    instagram: true,
    google: true,
    zepto: true
  });

  const platforms = [
    {
      id: 'facebook',
      name: 'Facebook Ads',
      icon: '📘',
      color: 'blue',
      description: 'Business Manager Connected',
      manageUrl: '/social/facebook-campaigns'
    },
    {
      id: 'instagram',
      name: 'Instagram Ads',
      icon: '📷',
      color: 'pink',
      description: 'Business Account Connected',
      manageUrl: '/social/instagram-campaigns'
    },
    {
      id: 'google',
      name: 'Google Ads',
      icon: '🔍',
      color: 'red',
      description: 'Google Ads Account Connected',
      manageUrl: '/social/google-campaigns'
    },
    {
      id: 'zepto',
      name: 'Zepto Ads',
      icon: '⚡',
      color: 'purple',
      description: 'Zepto Retail Media Platform',
      manageUrl: '/zepto-ads'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'border-blue-500',
      pink: 'border-pink-500',
      red: 'border-red-500',
      purple: 'border-purple-500'
    };
    return colors[color] || 'border-gray-500';
  };

  const getButtonColor = (color) => {
    const colors = {
      blue: 'bg-blue-600 hover:bg-blue-700',
      pink: 'bg-pink-600 hover:bg-pink-700',
      red: 'bg-red-600 hover:bg-red-700',
      purple: 'bg-purple-600 hover:bg-purple-700'
    };
    return colors[color] || 'bg-gray-600 hover:bg-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Social Media & Ad Platforms</h1>
          <p className="text-gray-400">Manage campaigns across Facebook, Instagram, Google & Zepto from PatternOS</p>
        </div>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {platforms.map((platform) => (
            <div
              key={platform.id}
              className={`bg-gray-800 rounded-xl p-6 border-2 ${getColorClasses(platform.color)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{platform.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{platform.name}</h3>
                    <p className="text-sm text-gray-400">{platform.description}</p>
                  </div>
                </div>
                {connectedAccounts[platform.id] && (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle size={20} />
                    <span className="text-sm font-medium">Connected</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => window.location.href = platform.manageUrl}
                className={`w-full ${getButtonColor(platform.color)} text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2`}
              >
                Manage {platform.name}
                <ExternalLink size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Stats Overview */}
        <div className="mt-8 bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Cross-Platform Performance</h2>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-gray-400 mb-1">Total Campaigns</div>
              <div className="text-3xl font-bold text-white">24</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Total Spend</div>
              <div className="text-3xl font-bold text-white">₹12.2L</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Avg ROAS</div>
              <div className="text-3xl font-bold text-green-400">6.15x</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Conversions</div>
              <div className="text-3xl font-bold text-white">11,540</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
