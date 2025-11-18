import React from 'react';
import { TrendingUp, DollarSign, Target, Users, Zap } from 'lucide-react';

export default function PricingSummary({ pricingData }) {
  if (!pricingData) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <p className="text-gray-400 text-center">Pricing data not available</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border-2 border-green-600 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-xl font-bold text-white mb-1">Pricing Strategy</h4>
          <p className="text-green-400 font-semibold">{pricingData.pricing_strategy}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-white">
            ₹{pricingData.total_budget?.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">{pricingData.duration_days} days</div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-gray-400 text-xs">CPM</span>
          </div>
          <div className="text-white text-lg font-bold">
            ₹{pricingData.effective_cpm?.toFixed(2)}
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-gray-400 text-xs">Reach</span>
          </div>
          <div className="text-white text-lg font-bold">
            {pricingData.estimated_reach?.toLocaleString()}
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-purple-400" />
            <span className="text-gray-400 text-xs">Conversions</span>
          </div>
          <div className="text-white text-lg font-bold">
            {pricingData.expected_conversions?.toLocaleString()}
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-yellow-400" />
            <span className="text-gray-400 text-xs">CPA</span>
          </div>
          <div className="text-white text-lg font-bold">
            ₹{pricingData.cost_per_conversion?.toFixed(0)}
          </div>
        </div>
      </div>

      {/* Value Intelligence Badge */}
      {pricingData.uses_value_intelligence && (
        <div className="mt-4 p-3 bg-purple-900/30 border border-purple-600 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-semibold text-sm">
              Value Intelligence Enabled
            </span>
          </div>
          <span className="text-purple-400 font-bold">
            +₹{pricingData.value_intelligence_premium?.toFixed(0)} CPM Premium
          </span>
        </div>
      )}

      {/* Performance Estimate */}
      <div className="mt-4 p-4 bg-gray-900/50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Expected CTR</span>
          <span className="text-white font-semibold">{pricingData.expected_ctr}%</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-gray-400">Expected Clicks</span>
          <span className="text-white font-semibold">
            {pricingData.expected_clicks?.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
