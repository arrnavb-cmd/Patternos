import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, DollarSign, Users, Target, Zap, 
  ArrowRight, Info, Calculator, BarChart3
} from 'lucide-react';

export default function PricingCalculator({ 
  intentLevel, 
  useValueIntelligence, 
  selectedChannels,
  budget,
  duration,
  onPricingCalculated 
}) {
  const [pricingData, setPricingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonData, setComparisonData] = useState(null);

  useEffect(() => {
    if (budget > 0 && selectedChannels.length > 0) {
      calculatePricing();
    }
  }, [intentLevel, useValueIntelligence, selectedChannels, budget, duration]);

  const calculatePricing = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/pricing/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intent_level: intentLevel,
          use_value_intelligence: useValueIntelligence,
          channels: selectedChannels.map(ch => ({
            name: ch,
            ad_types: ['default']
          })),
          budget: budget,
          duration_days: duration
        })
      });

      const data = await response.json();
      setPricingData(data);
      
      if (onPricingCalculated) {
        onPricingCalculated(data);
      }
    } catch (error) {
      console.error('Pricing calculation failed:', error);
    }
    setLoading(false);
  };

  const loadComparison = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/pricing/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budget: budget,
          channels: selectedChannels.map(ch => ({ name: ch, ad_types: ['default'] })),
          duration_days: duration
        })
      });

      const data = await response.json();
      setComparisonData(data);
      setShowComparison(true);
    } catch (error) {
      console.error('Comparison failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-400">Calculating pricing...</span>
        </div>
      </div>
    );
  }

  if (!pricingData) {
    return (
      <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
        <Calculator className="w-12 h-12 mx-auto mb-3 text-gray-600" />
        <p className="text-gray-400">Set budget and channels to see pricing</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Pricing Card */}
      <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 border-2 border-blue-500">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Campaign Pricing</h3>
            <p className="text-blue-300 text-sm">{pricingData.pricing_strategy}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">
              ₹{pricingData.total_budget.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">{duration} days</div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <MetricCard
            icon={<Users className="w-5 h-5 text-blue-400" />}
            label="Est. Reach"
            value={pricingData.estimated_reach.toLocaleString()}
            subtext="unique users"
          />
          <MetricCard
            icon={<Target className="w-5 h-5 text-green-400" />}
            label="Est. Clicks"
            value={pricingData.expected_clicks.toLocaleString()}
            subtext={`${pricingData.expected_ctr}% CTR`}
          />
          <MetricCard
            icon={<TrendingUp className="w-5 h-5 text-purple-400" />}
            label="Est. Conversions"
            value={pricingData.expected_conversions.toLocaleString()}
            subtext="purchases"
          />
          <MetricCard
            icon={<DollarSign className="w-5 h-5 text-yellow-400" />}
            label="Cost per Conv."
            value={`₹${pricingData.cost_per_conversion.toFixed(0)}`}
            subtext="CPA"
          />
        </div>

        {/* Value Intelligence Premium */}
        {useValueIntelligence && pricingData.value_intelligence_premium > 0 && (
          <div className="mt-4 p-4 bg-purple-900/30 border border-purple-600 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 font-semibold text-sm">Value Intelligence Premium</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-300 text-sm">
                Enhanced targeting based on customer identity & values
              </p>
              <div className="text-purple-400 font-bold">
                +₹{pricingData.value_intelligence_premium.toFixed(0)} CPM
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CPM Breakdown */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          CPM Breakdown by Channel
        </h4>
        
        <div className="space-y-3">
          {pricingData.channel_breakdown.map((channel, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
              <div>
                <div className="text-white font-medium">{channel.channel}</div>
                <div className="text-xs text-gray-400">
                  {channel.ad_types.join(', ')}
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold">₹{channel.cpm}</div>
                <div className="text-xs text-gray-500">{channel.multiplier}x</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-blue-300 font-medium">Average CPM</span>
            <span className="text-blue-400 font-bold text-lg">
              ₹{pricingData.average_cpm.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Performance Estimates */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h4 className="text-white font-semibold mb-4">Expected Performance</h4>
        
        <div className="space-y-3">
          <ProgressBar
            label="Impressions"
            value={pricingData.estimated_impressions}
            total={pricingData.estimated_impressions * 1.2}
            color="blue"
            format="number"
          />
          <ProgressBar
            label="Clicks"
            value={pricingData.expected_clicks}
            total={pricingData.estimated_impressions * 0.05}
            color="green"
            format="number"
          />
          <ProgressBar
            label="Conversions"
            value={pricingData.expected_conversions}
            total={pricingData.expected_clicks * 0.2}
            color="purple"
            format="number"
          />
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
          <Info className="w-4 h-4" />
          <span>Estimates based on historical performance data</span>
        </div>
      </div>

      {/* Compare Strategies Button */}
      <button
        onClick={loadComparison}
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
      >
        <Calculator className="w-5 h-5" />
        Compare All Pricing Strategies
        <ArrowRight className="w-5 h-5" />
      </button>

      {/* Comparison Modal */}
      {showComparison && comparisonData && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className="bg-gray-900 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-700">
            <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">Pricing Strategy Comparison</h3>
              <button
                onClick={() => setShowComparison(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg"
              >
                Close
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {comparisonData.strategies.map((strategy, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-2 ${
                      strategy.pricing_strategy === pricingData.pricing_strategy
                        ? 'border-blue-500 bg-blue-900/20'
                        : 'border-gray-700 bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-white text-sm">
                        {strategy.pricing_strategy}
                      </h4>
                      {strategy.pricing_strategy === pricingData.pricing_strategy && (
                        <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded">
                          Current
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">CPM:</span>
                        <span className="text-white font-medium">₹{strategy.effective_cpm}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Reach:</span>
                        <span className="text-white">{strategy.estimated_reach.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Conversions:</span>
                        <span className="text-white">{strategy.expected_conversions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">CPA:</span>
                        <span className="text-white font-semibold">
                          ₹{strategy.cost_per_conversion.toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components
function MetricCard({ icon, label, value, subtext }) {
  return (
    <div className="bg-gray-900/50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-gray-400 text-xs">{label}</span>
      </div>
      <div className="text-white text-xl font-bold">{value}</div>
      {subtext && <div className="text-gray-500 text-xs mt-1">{subtext}</div>}
    </div>
  );
}

function ProgressBar({ label, value, total, color, format = "number" }) {
  const percentage = (value / total) * 100;
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500'
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-gray-400 text-sm">{label}</span>
        <span className="text-white font-medium">
          {format === 'number' ? value.toLocaleString() : `${value}%`}
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${colors[color]}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}
