import { useState } from 'react';
import { Brain, Zap, Target, TrendingUp, MapPin, CloudRain, Calendar, Users } from 'lucide-react';

export default function PredictiveIntelligence() {
  const demandPredictions = [
    { 
      product: 'Nike Air Max 270', 
      demand: 'Very High', 
      confidence: 94, 
      forecast: '+45%', 
      timeframe: '7 days',
      reason: 'IPL season spike + payday cycle',
      recommendedAction: 'Increase inventory by 40%'
    },
    { 
      product: 'Jordan 1 Retro', 
      demand: 'Very High', 
      confidence: 91, 
      forecast: '+62%', 
      timeframe: '5 days',
      reason: 'Upcoming product launch trending',
      recommendedAction: 'Premium pricing window'
    },
    { 
      product: 'Nike Dri-FIT', 
      demand: 'Medium', 
      confidence: 87, 
      forecast: '+28%', 
      timeframe: '14 days',
      reason: 'Summer season approaching',
      recommendedAction: 'Maintain current levels'
    },
    { 
      product: 'Nike Pro Leggings', 
      demand: 'High', 
      confidence: 89, 
      forecast: '+38%', 
      timeframe: '10 days',
      reason: 'Fitness resolution cycle',
      recommendedAction: 'Bundle with sports bras'
    }
  ];

  const geoFlow = [
    { 
      region: 'Mumbai Metro', 
      score: 92, 
      buyers: 45000, 
      trend: 'rising',
      topCategory: 'Premium Footwear',
      peakTime: '7-10 PM',
      avgBasket: 8500
    },
    { 
      region: 'Delhi NCR', 
      score: 88, 
      buyers: 38000, 
      trend: 'rising',
      topCategory: 'Winter Apparel',
      peakTime: '6-9 PM',
      avgBasket: 7200
    },
    { 
      region: 'Bangalore Tech Belt', 
      score: 85, 
      buyers: 32000, 
      trend: 'stable',
      topCategory: 'Sports Accessories',
      peakTime: '8-11 PM',
      avgBasket: 6800
    },
    { 
      region: 'Pune Central', 
      score: 82, 
      buyers: 28000, 
      trend: 'rising',
      topCategory: 'Running Shoes',
      peakTime: '6-8 AM',
      avgBasket: 5900
    }
  ];

  const weatherBasedPredictions = [
    { 
      city: 'Mumbai', 
      weather: 'Heavy Rain', 
      predictedDemand: 'Umbrellas +180%, Indoor shoes +45%',
      timeframe: 'Next 48 hours',
      confidence: 91
    },
    { 
      city: 'Delhi', 
      weather: 'Cold Wave', 
      predictedDemand: 'Jackets +95%, Winter wear +60%',
      timeframe: 'Next 5 days',
      confidence: 88
    },
    { 
      city: 'Bangalore', 
      weather: 'Pleasant', 
      predictedDemand: 'Running gear +35%, Outdoor wear +28%',
      timeframe: 'Next 7 days',
      confidence: 85
    }
  ];

  const cohortPredictions = [
    {
      cohort: 'Recent Air Max buyers',
      size: 8500,
      prediction: '65% likely to buy Jordan 1 within 14 days',
      confidence: 87,
      aov: 12500,
      action: 'Cross-sell campaign'
    },
    {
      cohort: 'Cart abandoners (last 24h)',
      size: 3200,
      prediction: '40% will convert with 10% discount',
      confidence: 82,
      aov: 6800,
      action: 'Time-limited offer'
    },
    {
      cohort: 'High-value customers',
      size: 1850,
      prediction: '78% will purchase new collection',
      confidence: 91,
      aov: 18500,
      action: 'VIP early access'
    },
    {
      cohort: 'Fitness category browsers',
      size: 12400,
      prediction: '22% will buy within 7 days',
      confidence: 79,
      aov: 4200,
      action: 'Bundle deals'
    }
  ];

  const eventBasedForecasts = [
    { 
      event: 'IPL Finals', 
      date: 'May 28', 
      daysAway: 15,
      predictedImpact: '+140% sports merchandise',
      categories: ['Jerseys', 'Sports shoes', 'Accessories']
    },
    { 
      event: 'Diwali', 
      date: 'Nov 1', 
      daysAway: 180,
      predictedImpact: '+220% festive wear',
      categories: ['Ethnic wear', 'Gifts', 'Premium items']
    },
    { 
      event: 'Month-end Payday', 
      date: 'May 31', 
      daysAway: 3,
      predictedImpact: '+85% premium products',
      categories: ['High-ticket items', 'Electronics']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
              <Brain className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Predictive Intelligence</h1>
              <p className="text-gray-400">AI-powered pre-intent forecasting & demand prediction</p>
            </div>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <p className="text-purple-300 text-sm">
              🔒 <strong>Aggregated Pattern Analysis:</strong> Predictions based on cohort behavior, seasonal patterns, weather data, and events. No individual tracking.
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <Brain className="text-purple-400 mb-3" size={24} />
            <p className="text-gray-400 text-sm">Active Predictions</p>
            <p className="text-3xl font-bold text-white mt-1">234</p>
            <p className="text-purple-400 text-sm mt-2">This month</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <Target className="text-blue-400 mb-3" size={24} />
            <p className="text-gray-400 text-sm">Prediction Accuracy</p>
            <p className="text-3xl font-bold text-white mt-1">89.2%</p>
            <p className="text-green-400 text-sm mt-2">+2.4% improvement</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <Zap className="text-yellow-400 mb-3" size={24} />
            <p className="text-gray-400 text-sm">Predicted ROAS</p>
            <p className="text-3xl font-bold text-white mt-1">4.5x</p>
            <p className="text-yellow-400 text-sm mt-2">From AI recommendations</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <MapPin className="text-green-400 mb-3" size={24} />
            <p className="text-gray-400 text-sm">GeoFlow Zones</p>
            <p className="text-3xl font-bold text-white mt-1">24</p>
            <p className="text-green-400 text-sm mt-2">High-potential areas</p>
          </div>
        </div>

        {/* Demand Forecast */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-2">AI Demand Forecast (Next 30 Days)</h2>
          <p className="text-gray-400 text-sm mb-6">Time-series analysis + behavioral patterns + external factors</p>
          <div className="space-y-4">
            {demandPredictions.map((pred, idx) => (
              <div key={idx} className="bg-gray-700 rounded-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-white text-lg mb-2">{pred.product}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        pred.demand === 'Very High' ? 'bg-red-500/20 text-red-400' :
                        pred.demand === 'High' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {pred.demand} Demand
                      </span>
                      <span className="text-sm text-gray-400">Peak in {pred.timeframe}</span>
                      <span className="text-xs text-gray-500">• {pred.confidence}% confidence</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold text-2xl">{pred.forecast}</p>
                    <p className="text-sm text-gray-400">Predicted growth</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-600">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Why:</p>
                    <p className="text-white text-sm">{pred.reason}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Action:</p>
                    <p className="text-blue-400 text-sm font-medium">→ {pred.recommendedAction}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GeoFlow & Weather Predictions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">GeoFlow: High-Intent Neighborhoods</h2>
            <div className="space-y-4">
              {geoFlow.map((geo, idx) => (
                <div key={idx} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                        <MapPin className="text-white" size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{geo.region}</h3>
                        <p className="text-sm text-gray-400">{geo.buyers.toLocaleString()} potential buyers</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-xl">{geo.score}</p>
                      <TrendingUp className={`ml-auto mt-1 ${
                        geo.trend === 'rising' ? 'text-green-400' : 'text-gray-400'
                      }`} size={16} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-600 text-xs">
                    <div>
                      <p className="text-gray-400">Top Category</p>
                      <p className="text-white font-medium">{geo.topCategory}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Peak Time</p>
                      <p className="text-blue-400 font-medium">{geo.peakTime}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Avg Basket</p>
                      <p className="text-green-400 font-medium">₹{geo.avgBasket}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Weather-Based Demand Prediction</h2>
            <div className="space-y-4">
              {weatherBasedPredictions.map((weather, idx) => (
                <div key={idx} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <CloudRain className="text-blue-400" size={24} />
                      <div>
                        <h3 className="font-bold text-white">{weather.city}</h3>
                        <p className="text-sm text-gray-400">{weather.weather}</p>
                      </div>
                    </div>
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded font-medium">
                      {weather.confidence}% confidence
                    </span>
                  </div>
                  <div className="pt-3 border-t border-gray-600">
                    <p className="text-white font-medium text-sm mb-1">{weather.predictedDemand}</p>
                    <p className="text-xs text-gray-400">{weather.timeframe}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cohort-Based Predictions */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-2">Cohort-Based Purchase Predictions</h2>
          <p className="text-gray-400 text-sm mb-6">"Users who bought X are Y% likely to buy Z" - behavioral clustering</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cohortPredictions.map((cohort, idx) => (
              <div key={idx} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-white">{cohort.cohort}</h3>
                  <span className="text-blue-400 text-sm font-medium">{cohort.size.toLocaleString()} users</span>
                </div>
                <p className="text-gray-300 text-sm mb-3">{cohort.prediction}</p>
                <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                  <div>
                    <p className="text-gray-400">Confidence</p>
                    <p className="text-green-400 font-bold">{cohort.confidence}%</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Predicted AOV</p>
                    <p className="text-white font-bold">₹{cohort.aov.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Action</p>
                    <p className="text-purple-400 font-bold">{cohort.action}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Event-Based Forecasts */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Event-Based Demand Forecasts</h2>
          <div className="space-y-3">
            {eventBasedForecasts.map((event, idx) => (
              <div key={idx} className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <Calendar className="text-yellow-400 mb-1" size={24} />
                    <span className="text-xs text-gray-400">{event.daysAway}d</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{event.event}</h3>
                    <p className="text-sm text-gray-400">{event.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold">{event.predictedImpact}</p>
                  <p className="text-xs text-gray-400">{event.categories.join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Insights */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">🎯 AI Recommendations This Week</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white font-medium mb-2">Highest Confidence</p>
              <p className="text-2xl font-bold text-white">94%</p>
              <p className="text-purple-100 text-sm">Nike Air Max surge in 7 days</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white font-medium mb-2">Top GeoFlow</p>
              <p className="text-2xl font-bold text-white">Mumbai</p>
              <p className="text-purple-100 text-sm">Score 92 - prime for campaign</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white font-medium mb-2">Weather Opportunity</p>
              <p className="text-2xl font-bold text-white">+180%</p>
              <p className="text-purple-100 text-sm">Mumbai rain - umbrellas spike</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white font-medium mb-2">Best Cohort</p>
              <p className="text-2xl font-bold text-white">78% CVR</p>
              <p className="text-purple-100 text-sm">VIP customers - early access</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
