import { useState } from 'react';
import { Search, TrendingUp, Target, Users, Clock, MapPin, Calendar, ShoppingBag } from 'lucide-react';

export default function BehavioralIntelligence() {
  const [dateRange, setDateRange] = useState('last_30_days');
  
  // On-Platform Search Intelligence
  const searchIntents = [
    { keyword: 'nike running shoes', volume: 45000, intent: 'High Purchase', score: 92, trend: '+18%', conversions: 4140 },
    { keyword: 'nike air max price', volume: 38000, intent: 'Price Research', score: 78, trend: '+12%', conversions: 2660 },
    { keyword: 'nike shoes near me', volume: 32000, intent: 'Ready to Buy', score: 95, trend: '+25%', conversions: 3040 },
    { keyword: 'best nike shoes', volume: 28000, intent: 'Research', score: 65, trend: '+8%', conversions: 1820 },
    { keyword: 'nike shoes discount', volume: 25000, intent: 'Price Sensitive', score: 88, trend: '+31%', conversions: 2200 }
  ];

  // Shopper Journey Stages
  const journeyStages = [
    { 
      stage: 'Awareness', 
      users: 125000, 
      percentage: 40, 
      avgTime: '45s',
      topActions: ['Browse categories', 'View banners'],
      conversion: 0.5,
      nextStep: 'Push personalized content'
    },
    { 
      stage: 'Consideration', 
      users: 89000, 
      percentage: 28, 
      avgTime: '5:42',
      topActions: ['Compare products', 'Read reviews', 'Check prices'],
      conversion: 3.2,
      nextStep: 'Show social proof'
    },
    { 
      stage: 'Intent', 
      users: 62000, 
      percentage: 20, 
      avgTime: '3:18',
      topActions: ['Add to cart', 'Check delivery time'],
      conversion: 12.5,
      nextStep: 'Offer time-sensitive discount'
    },
    { 
      stage: 'Purchase', 
      users: 37000, 
      percentage: 12, 
      avgTime: '1:25',
      topActions: ['Complete checkout', 'Apply coupon'],
      conversion: 18.3,
      nextStep: 'Cross-sell complementary items'
    }
  ];

  // Cart Abandonment Insights
  const abandonmentReasons = [
    { reason: 'High delivery charges', percentage: 28, opportunity: 'Free shipping threshold campaign' },
    { reason: 'Product out of stock', percentage: 22, opportunity: 'Back-in-stock alerts' },
    { reason: 'Better price elsewhere', percentage: 18, opportunity: 'Price match guarantee' },
    { reason: 'Long delivery time', percentage: 15, opportunity: 'Express delivery promotion' },
    { reason: 'Payment issues', percentage: 12, opportunity: 'More payment options' },
    { reason: 'Just browsing', percentage: 5, opportunity: 'Retarget with social proof' }
  ];

  // Time-of-Day Intent Patterns
  const timePatterns = [
    { time: '6-9 AM', category: 'Breakfast items', intent: 'High', volume: 28000 },
    { time: '12-2 PM', category: 'Lunch essentials', intent: 'High', volume: 45000 },
    { time: '5-7 PM', category: 'Evening snacks', intent: 'Very High', volume: 62000 },
    { time: '8-11 PM', category: 'Dinner + impulse', intent: 'Peak', volume: 89000 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Behavioral Intelligence</h1>
              <p className="text-gray-400">On-platform search patterns & purchase intent signals</p>
            </div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-300 text-sm">
              🔒 <strong>Privacy-First:</strong> All data collected from user activity on Zepto platform with full consent. No external tracking.
            </p>
          </div>
        </div>

        {/* Date Filter */}
        <div className="bg-gray-800 rounded-xl p-4 mb-8 flex items-center gap-4">
          <Calendar className="text-gray-400" size={20} />
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            <option value="last_7_days">Last 7 Days</option>
            <option value="last_30_days">Last 30 Days</option>
            <option value="last_90_days">Last 90 Days</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <Search className="text-blue-400 mb-3" size={24} />
            <p className="text-gray-400 text-sm">On-Platform Searches</p>
            <p className="text-3xl font-bold text-white mt-1">2.8M</p>
            <p className="text-green-400 text-sm mt-2">+24.5% vs last period</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <Target className="text-purple-400 mb-3" size={24} />
            <p className="text-gray-400 text-sm">High-Intent Sessions</p>
            <p className="text-3xl font-bold text-white mt-1">892K</p>
            <p className="text-purple-400 text-sm mt-2">31.8% of all sessions</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <ShoppingBag className="text-green-400 mb-3" size={24} />
            <p className="text-gray-400 text-sm">Cart Additions</p>
            <p className="text-3xl font-bold text-white mt-1">456K</p>
            <p className="text-green-400 text-sm mt-2">16.3% conversion rate</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <Clock className="text-yellow-400 mb-3" size={24} />
            <p className="text-gray-400 text-sm">Avg Session Duration</p>
            <p className="text-3xl font-bold text-white mt-1">4:32</p>
            <p className="text-yellow-400 text-sm mt-2">+18% engagement</p>
          </div>
        </div>

        {/* Shopping Journey Analysis */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Shopping Journey Analysis</h2>
          <p className="text-gray-400 text-sm mb-6">Track user progression from awareness to purchase - optimize each stage</p>
          <div className="space-y-4">
            {journeyStages.map((stage, idx) => (
              <div key={idx} className="bg-gray-700 rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                      {stage.percentage}%
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{stage.stage}</h3>
                      <p className="text-sm text-gray-400">{stage.users.toLocaleString()} users • Avg time: {stage.avgTime}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-xl">{stage.conversion}%</p>
                    <p className="text-sm text-gray-400">Conversion rate</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-600">
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Top Actions:</p>
                    {stage.topActions.map((action, i) => (
                      <span key={i} className="inline-block px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded mr-2 mb-1">
                        {action}
                      </span>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Recommended Action:</p>
                    <p className="text-blue-400 text-sm font-medium">💡 {stage.nextStep}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search Intent Table */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Top Search Intent Signals</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-gray-400 pb-3 text-sm">Keyword</th>
                  <th className="text-left text-gray-400 pb-3 text-sm">Search Volume</th>
                  <th className="text-left text-gray-400 pb-3 text-sm">Intent Type</th>
                  <th className="text-left text-gray-400 pb-3 text-sm">Purchase Score</th>
                  <th className="text-left text-gray-400 pb-3 text-sm">Conversions</th>
                  <th className="text-left text-gray-400 pb-3 text-sm">Trend</th>
                </tr>
              </thead>
              <tbody>
                {searchIntents.map((signal, idx) => (
                  <tr key={idx} className="border-b border-gray-700">
                    <td className="py-4 text-white font-medium">{signal.keyword}</td>
                    <td className="py-4 text-gray-300">{signal.volume.toLocaleString()}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        signal.intent === 'Ready to Buy' || signal.intent === 'High Purchase' 
                          ? 'bg-green-500/20 text-green-400' :
                        signal.intent === 'Price Research' || signal.intent === 'Price Sensitive'
                          ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {signal.intent}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                            style={{ width: `${signal.score}%` }}
                          />
                        </div>
                        <span className="text-white font-medium text-sm">{signal.score}</span>
                      </div>
                    </td>
                    <td className="py-4 text-white font-medium">{signal.conversions.toLocaleString()}</td>
                    <td className="py-4 text-green-400 font-medium">{signal.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cart Abandonment Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Cart Abandonment Reasons</h2>
            <div className="space-y-4">
              {abandonmentReasons.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300 text-sm">{item.reason}</span>
                    <span className="text-white font-bold">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-blue-400 mt-1">→ {item.opportunity}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Peak Intent Times</h2>
            <div className="space-y-4">
              {timePatterns.map((pattern, idx) => (
                <div key={idx} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Clock className="text-blue-400" size={20} />
                      <div>
                        <h3 className="font-bold text-white">{pattern.time}</h3>
                        <p className="text-sm text-gray-400">{pattern.category}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      pattern.intent === 'Peak' ? 'bg-red-500/20 text-red-400' :
                      pattern.intent === 'Very High' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {pattern.intent} Intent
                    </span>
                  </div>
                  <p className="text-white font-bold text-lg">{pattern.volume.toLocaleString()} searches</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actionable Insights */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">🎯 Actionable Insights This Week</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white font-medium mb-2">High-Intent Window</p>
              <p className="text-2xl font-bold text-white">8-11 PM</p>
              <p className="text-blue-100 text-sm">Schedule ads for peak engagement</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white font-medium mb-2">Top Opportunity</p>
              <p className="text-2xl font-bold text-white">Free Shipping</p>
              <p className="text-blue-100 text-sm">28% of carts abandoned due to charges</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white font-medium mb-2">Trending Search</p>
              <p className="text-2xl font-bold text-white">+31% Growth</p>
              <p className="text-blue-100 text-sm">"nike shoes discount" queries</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
