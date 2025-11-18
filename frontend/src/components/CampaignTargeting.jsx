import React, { useState } from 'react';
import { Target, Brain, TrendingUp } from 'lucide-react';
import ValueIntelligenceTab from './ValueIntelligenceTab';

export default function CampaignTargeting({ onTargetingChange, initialConfig = {} }) {
  const [targetingType, setTargetingType] = useState(initialConfig.type || 'intent');
  const [intentConfig, setIntentConfig] = useState(initialConfig.intent || {});
  const [valueConfig, setValueConfig] = useState(initialConfig.value || {});

  const handleTargetingTypeChange = (type) => {
    setTargetingType(type);
    onTargetingChange?.({ type });
  };

  const handleValueIntelligenceChange = (config) => {
    setValueConfig(config);
    onTargetingChange?.({ 
      type: 'value_intelligence',
      config 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Campaign Targeting</h2>
        <p className="text-gray-400">Choose how you want to target your audience</p>
      </div>

      {/* Targeting Strategy Selector */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleTargetingTypeChange('intent')}
          className={`p-6 rounded-xl border-2 transition-all text-left ${
            targetingType === 'intent'
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-gray-700 bg-gray-800 hover:border-gray-600'
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${
              targetingType === 'intent' ? 'bg-blue-500/20' : 'bg-gray-700'
            }`}>
              <Brain className={`w-6 h-6 ${
                targetingType === 'intent' ? 'text-blue-400' : 'text-gray-400'
              }`} />
            </div>
            <h3 className="text-lg font-semibold text-white">Intent-Based</h3>
          </div>
          <p className="text-sm text-gray-400">
            Target customers based on search behavior, browsing patterns, and purchase intent signals
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded">High Intent</span>
            <span className="px-2 py-1 bg-yellow-900/30 text-yellow-300 rounded">Medium Intent</span>
            <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded">Low Intent</span>
          </div>
        </button>

        <button
          onClick={() => handleTargetingTypeChange('value_intelligence')}
          className={`p-6 rounded-xl border-2 transition-all text-left ${
            targetingType === 'value_intelligence'
              ? 'border-purple-500 bg-purple-500/10'
              : 'border-gray-700 bg-gray-800 hover:border-gray-600'
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${
              targetingType === 'value_intelligence' ? 'bg-purple-500/20' : 'bg-gray-700'
            }`}>
              <TrendingUp className={`w-6 h-6 ${
                targetingType === 'value_intelligence' ? 'text-purple-400' : 'text-gray-400'
              }`} />
            </div>
            <h3 className="text-lg font-semibold text-white">Value Intelligence</h3>
          </div>
          <p className="text-sm text-gray-400">
            Target by customer identity, values, premium readiness, and aspirational behavior
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="px-2 py-1 bg-purple-900/30 text-purple-300 rounded">Aspirational</span>
            <span className="px-2 py-1 bg-green-900/30 text-green-300 rounded">Health</span>
            <span className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded">Eco</span>
          </div>
        </button>
      </div>

      {/* Targeting Configuration */}
      <div className="bg-gray-900 rounded-xl p-1 border border-gray-800">
        {targetingType === 'intent' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Brain className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-semibold text-white">Intent-Based Targeting</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Intent Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {['high', 'medium', 'low'].map(level => (
                    <button
                      key={level}
                      onClick={() => setIntentConfig({ ...intentConfig, level })}
                      className={`p-4 rounded-lg border-2 capitalize ${
                        intentConfig.level === level
                          ? level === 'high' ? 'border-green-500 bg-green-500/10'
                          : level === 'medium' ? 'border-yellow-500 bg-yellow-500/10'
                          : 'border-gray-500 bg-gray-500/10'
                          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-white font-semibold">{level} Intent</div>
                      <div className="text-gray-400 text-sm mt-1">
                        {level === 'high' && '≥ 0.70 score'}
                        {level === 'medium' && '0.50 - 0.69'}
                        {level === 'low' && '< 0.50'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                <p className="text-sm text-blue-200">
                  💡 Intent-based targeting uses behavioral signals like search patterns, 
                  page views, and cart additions to identify ready-to-buy customers.
                </p>
              </div>
            </div>
          </div>
        )}

        {targetingType === 'value_intelligence' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <ValueIntelligenceTab onTargetingChange={handleValueIntelligenceChange} />
          </div>
        )}
      </div>

      {/* Summary */}
      {(targetingType && (intentConfig.level || valueConfig.estimatedReach)) && (
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-700 rounded-lg p-6">
          <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Targeting Summary
          </h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-gray-400 text-sm">Strategy</div>
              <div className="text-white font-semibold capitalize mt-1">
                {targetingType.replace('_', ' ')}
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Estimated Reach</div>
              <div className="text-white font-semibold mt-1">
                {valueConfig.estimatedReach || 'TBD'}
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Potential Revenue</div>
              <div className="text-green-400 font-semibold mt-1">
                {valueConfig.estimatedReach 
                  ? `₹${(valueConfig.estimatedReach * 800).toLocaleString()}`
                  : 'TBD'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
