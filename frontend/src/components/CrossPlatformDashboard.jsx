import React, { useEffect, useState } from 'react';
import { Users, Target, TrendingUp, Layers, DollarSign, BarChart3 } from 'lucide-react';

export const CrossPlatformDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [intent, setIntent] = useState(null);
  
  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8000/api/cross-platform/summary').then(r => r.json()),
      fetch('http://localhost:8000/api/cross-platform/intent-summary').then(r => r.json())
    ]).then(([summaryData, intentData]) => {
      setSummary(summaryData);
      setIntent(intentData);
    }).catch(console.error);
  }, []);

  if (!summary || !intent) {
    return <div className="text-white">Loading cross-platform intelligence...</div>;
  }

  const crossPlatformPct = ((summary.two_platforms + summary.three_plus_platforms) / summary.total_customers * 100).toFixed(1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Layers className="w-8 h-8 text-purple-400 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-white">Cross-Platform Intelligence</h2>
            <p className="text-gray-400">Unified view of 700K+ customers across 7 platforms</p>
          </div>
        </div>
      </div>

      {/* Customer Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700 rounded-xl p-6">
          <Users className="w-8 h-8 text-blue-400 mb-3" />
          <p className="text-3xl font-bold text-white mb-1">
            {summary.total_customers?.toLocaleString() || '0'}
          </p>
          <p className="text-sm text-gray-400">Total Unified Customers</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-700 rounded-xl p-6">
          <Layers className="w-8 h-8 text-purple-400 mb-3" />
          <p className="text-3xl font-bold text-white mb-1">
            {crossPlatformPct}%
          </p>
          <p className="text-sm text-gray-400">Cross-Platform Users</p>
          <p className="text-xs text-purple-400 mt-2">
            {(summary.two_platforms + summary.three_plus_platforms)?.toLocaleString()} users on 2+ platforms
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-700 rounded-xl p-6">
          <DollarSign className="w-8 h-8 text-green-400 mb-3" />
          <p className="text-3xl font-bold text-white mb-1">
            ₹{(summary.avg_ltv || 0).toLocaleString(undefined, {maximumFractionDigits: 0})}
          </p>
          <p className="text-sm text-gray-400">Avg Customer LTV</p>
        </div>

        <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border border-orange-700 rounded-xl p-6">
          <BarChart3 className="w-8 h-8 text-orange-400 mb-3" />
          <p className="text-3xl font-bold text-white mb-1">
            ₹{((summary.total_revenue || 0) / 10000000).toFixed(1)}Cr
          </p>
          <p className="text-sm text-gray-400">Total Revenue</p>
        </div>
      </div>

      {/* Intent Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-orange-400" />
          Intent Intelligence
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border border-orange-700 rounded-xl p-6">
            <Target className="w-8 h-8 text-orange-400 mb-3" />
            <p className="text-3xl font-bold text-white mb-1">
              {intent.high_intent?.toLocaleString() || '0'}
            </p>
            <p className="text-sm text-gray-400">High Intent Users</p>
            <p className="text-xs text-orange-400 mt-2">≥ 0.7 score</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border border-yellow-700 rounded-xl p-6">
            <TrendingUp className="w-8 h-8 text-yellow-400 mb-3" />
            <p className="text-3xl font-bold text-white mb-1">
              {intent.medium_intent?.toLocaleString() || '0'}
            </p>
            <p className="text-sm text-gray-400">Medium Intent</p>
            <p className="text-xs text-yellow-400 mt-2">0.4 - 0.7 score</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-900/30 to-indigo-800/20 border border-indigo-700 rounded-xl p-6">
            <Users className="w-8 h-8 text-indigo-400 mb-3" />
            <p className="text-3xl font-bold text-white mb-1">
              {(intent.avg_purchase_prob_7d * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-400">7-Day Purchase Probability</p>
          </div>

          <div className="bg-gradient-to-br from-pink-900/30 to-pink-800/20 border border-pink-700 rounded-xl p-6">
            <BarChart3 className="w-8 h-8 text-pink-400 mb-3" />
            <p className="text-3xl font-bold text-white mb-1">
              {intent.avg_intent_score?.toFixed(3) || '0.000'}
            </p>
            <p className="text-sm text-gray-400">Avg Intent Score</p>
          </div>
        </div>
      </div>

      {/* Platform Distribution */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Platform Distribution</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{summary.single_platform?.toLocaleString()}</p>
            <p className="text-sm text-gray-400">Single Platform</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">{summary.two_platforms?.toLocaleString()}</p>
            <p className="text-sm text-gray-400">Two Platforms</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-400">{summary.three_plus_platforms?.toLocaleString()}</p>
            <p className="text-sm text-gray-400">3+ Platforms</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrossPlatformDashboard;
