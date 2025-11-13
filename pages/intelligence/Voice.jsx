import { useState } from 'react';
import { Mic, Globe, MessageCircle, TrendingUp, Languages, Volume2, Clock } from 'lucide-react';

export default function VoiceIntelligence() {
  const languageData = [
    { language: 'Hindi', queries: 145000, conversion: 3.8, growth: '+32%', topQuery: 'Nike ke running shoes' },
    { language: 'English', queries: 128000, conversion: 4.2, growth: '+18%', topQuery: 'Nike Air Max price' },
    { language: 'Tamil', queries: 89000, conversion: 3.5, growth: '+45%', topQuery: 'Nike joota vilai' },
    { language: 'Telugu', queries: 76000, conversion: 3.2, growth: '+38%', topQuery: 'Nike shoes price' },
    { language: 'Marathi', queries: 65000, conversion: 3.6, growth: '+28%', topQuery: 'Nike shoes kitne ka hai' },
    { language: 'Bengali', queries: 54000, conversion: 3.4, growth: '+22%', topQuery: 'Nike juto dam' },
    { language: 'Kannada', queries: 48000, conversion: 3.9, growth: '+35%', topQuery: 'Nike shoes price' },
    { language: 'Malayalam', queries: 42000, conversion: 3.7, growth: '+29%', topQuery: 'Nike shoes vila' }
  ];

  const voiceQueries = [
    { 
      query: 'Nike ke running shoes dikhao', 
      language: 'Hindi',
      count: 8500, 
      intent: 'Product Search',
      conversions: 680,
      avgOrderValue: 8500
    },
    { 
      query: 'Best Nike shoes under 5000', 
      language: 'English',
      count: 7200, 
      intent: 'Price Research',
      conversions: 504,
      avgOrderValue: 4200
    },
    { 
      query: 'Nike Air Max kahan milega', 
      language: 'Hindi',
      count: 6800, 
      intent: 'Location Query',
      conversions: 578,
      avgOrderValue: 9800
    },
    { 
      query: 'Nike ka sabse accha shoe', 
      language: 'Hindi',
      count: 5900, 
      intent: 'Recommendation',
      conversions: 472,
      avgOrderValue: 11200
    },
    {
      query: 'Black Nike shoes',
      language: 'English',
      count: 5400,
      intent: 'Specific Search',
      conversions: 648,
      avgOrderValue: 7800
    }
  ];

  const voiceAssistantIntegration = [
    { platform: 'Alexa', commands: 45000, orders: 2700, aov: 890, satisfaction: 4.2 },
    { platform: 'Google Assistant', commands: 38000, orders: 2280, aov: 920, satisfaction: 4.3 },
    { platform: 'Siri', commands: 28000, orders: 1680, aov: 1050, satisfaction: 4.1 }
  ];

  const timeBasedPatterns = [
    { time: '6-9 AM', queries: 28000, topIntent: 'Quick breakfast items', language: 'Hindi/English Mix' },
    { time: '12-2 PM', queries: 45000, topIntent: 'Lunch essentials', language: 'Regional preference' },
    { time: '5-7 PM', queries: 62000, topIntent: 'Evening snacks', language: 'Mixed languages' },
    { time: '8-11 PM', queries: 89000, topIntent: 'Dinner + impulse', language: 'Native languages' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <Mic className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Voice Intelligence</h1>
              <p className="text-gray-400">In-app voice search & smart assistant integration - 50+ languages</p>
            </div>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-300 text-sm">
              🔒 <strong>User-Triggered Only:</strong> Voice search activated when user taps microphone button. Smart assistant integration for "Hey Alexa, add to Zepto cart". No background listening.
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <Mic className="text-red-400 mb-3" size={24} />
            <p className="text-gray-400 text-sm">Voice Queries (In-App)</p>
            <p className="text-3xl font-bold text-white mt-1">503K</p>
            <p className="text-green-400 text-sm mt-2">+32% this month</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <Languages className="text-orange-400 mb-3" size={24} />
            <p className="text-gray-400 text-sm">Active Languages</p>
            <p className="text-3xl font-bold text-white mt-1">12</p>
            <p className="text-orange-400 text-sm mt-2">Covering 85% of India</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <MessageCircle className="text-purple-400 mb-3" size={24} />
            <p className="text-gray-400 text-sm">Voice-to-Purchase</p>
            <p className="text-3xl font-bold text-white mt-1">3.7%</p>
            <p className="text-purple-400 text-sm mt-2">Avg conversion rate</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <Volume2 className="text-blue-400 mb-3" size={24} />
            <p className="text-gray-400 text-sm">Smart Assistant Orders</p>
            <p className="text-3xl font-bold text-white mt-1">6.7K</p>
            <p className="text-blue-400 text-sm mt-2">Alexa/Google/Siri</p>
          </div>
        </div>

        {/* Language Performance */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-2">Multi-Language Voice Search Performance</h2>
          <p className="text-gray-400 text-sm mb-6">India's linguistic diversity as competitive advantage - 50+ language support</p>
          <div className="space-y-3">
            {languageData.map((lang, idx) => (
              <div key={idx} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{lang.language}</h3>
                      <p className="text-sm text-gray-400">{lang.queries.toLocaleString()} voice queries</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-xl">{lang.conversion}% CVR</p>
                    <p className="text-green-400 text-sm font-medium">{lang.growth} growth</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-600">
                  <p className="text-xs text-gray-400">Most common query: <span className="text-blue-400 font-medium">"{lang.topQuery}"</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Voice Queries */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Top Voice Search Queries</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-gray-400 pb-3 text-sm">Query</th>
                  <th className="text-left text-gray-400 pb-3 text-sm">Language</th>
                  <th className="text-left text-gray-400 pb-3 text-sm">Volume</th>
                  <th className="text-left text-gray-400 pb-3 text-sm">Intent</th>
                  <th className="text-left text-gray-400 pb-3 text-sm">Conversions</th>
                  <th className="text-left text-gray-400 pb-3 text-sm">Avg Order Value</th>
                </tr>
              </thead>
              <tbody>
                {voiceQueries.map((query, idx) => (
                  <tr key={idx} className="border-b border-gray-700">
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Mic className="text-orange-400" size={16} />
                        <span className="text-white font-medium">"{query.query}"</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded font-medium">
                        {query.language}
                      </span>
                    </td>
                    <td className="py-4 text-gray-300">{query.count.toLocaleString()}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        query.intent === 'Product Search' || query.intent === 'Specific Search' 
                          ? 'bg-green-500/20 text-green-400' :
                        query.intent === 'Price Research'
                          ? 'bg-yellow-500/20 text-yellow-400' :
                        query.intent === 'Recommendation'
                          ? 'bg-purple-500/20 text-purple-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {query.intent}
                      </span>
                    </td>
                    <td className="py-4 text-white font-medium">{query.conversions}</td>
                    <td className="py-4 text-green-400 font-bold">₹{query.avgOrderValue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Smart Assistant Integration & Time Patterns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-2">Smart Assistant Integration</h2>
            <p className="text-gray-400 text-sm mb-6">"Hey Alexa, add milk to Zepto cart" - Voice commerce beyond the app</p>
            <div className="space-y-4">
              {voiceAssistantIntegration.map((assistant, idx) => (
                <div key={idx} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-bold text-lg">{assistant.platform}</h3>
                    <span className="text-yellow-400 text-sm">★ {assistant.satisfaction}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-gray-400">Commands</p>
                      <p className="text-white font-bold">{assistant.commands.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Orders</p>
                      <p className="text-green-400 font-bold">{assistant.orders.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">AOV</p>
                      <p className="text-blue-400 font-bold">₹{assistant.aov}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Voice Search Time Patterns</h2>
            <div className="space-y-4">
              {timeBasedPatterns.map((pattern, idx) => (
                <div key={idx} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Clock className="text-orange-400" size={20} />
                      <div>
                        <h3 className="font-bold text-white">{pattern.time}</h3>
                        <p className="text-sm text-gray-400">{pattern.topIntent}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-lg">{pattern.queries.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">queries</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-600 mt-2">
                    <p className="text-xs text-gray-400">Language preference: <span className="text-blue-400">{pattern.language}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actionable Insights */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">🎯 Voice Intelligence Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white font-medium mb-2">Fastest Growing</p>
              <p className="text-2xl font-bold text-white">Tamil +45%</p>
              <p className="text-red-100 text-sm">Invest in regional voice ads</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white font-medium mb-2">Peak Voice Hour</p>
              <p className="text-2xl font-bold text-white">8-11 PM</p>
              <p className="text-red-100 text-sm">89K queries - optimize inventory</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white font-medium mb-2">Best AOV</p>
              <p className="text-2xl font-bold text-white">₹11,200</p>
              <p className="text-red-100 text-sm">Recommendation queries convert best</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
