import React, { useState, useEffect } from 'react';
import { Users, Activity, Brain, TrendingUp, Search, MousePointer, ShoppingCart, Eye, Clock, Target } from 'lucide-react';

export default function IntentDashboard() {
  const [stats, setStats] = useState(null);
  const [behavioralData, setBehavioralData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visualData, setVisualData] = useState(null);
  const [voiceData, setVoiceData] = useState(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, behavioralRes, visualRes, voiceRes] = await Promise.all([
        fetch('http://localhost:8000/api/scoring/summary'),
        fetch('http://localhost:8000/api/v1/intent/behavioral-deep-dive?clientId=zepto'),
        fetch('http://localhost:8000/api/v1/visual-intelligence/summary'),
        fetch('http://localhost:8000/api/v1/voice-intelligence/summary')
      ]);
      
      const statsData = await statsRes.json();
      const behavioralData = await behavioralRes.json();
      
      setStats(statsData);
      setBehavioralData(behavioralData);
      
      const visualData = await visualRes.json();
      const voiceData = await voiceRes.json();
      setVisualData(visualData);
      setVoiceData(voiceData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-white">Loading...</div>;
  if (!stats) return <div className="p-8 text-red-400">Failed to load data</div>;

  const StatCard = ({ icon: Icon, label, value, subtext, color }) => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center gap-3 mb-3">
        <Icon className={`text-${color}-400`} size={24} />
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value?.toLocaleString()}</div>
      {subtext && <div className="text-xs text-gray-500">{subtext}</div>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Intent Intelligence Dashboard</h1>
          <p className="text-gray-400">Real-time behavioral signals and intent tracking</p>
        </div>

        {/* Intelligence Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={Brain} 
            label="Behavioral Signals" 
            value={stats.totalScores} 
            subtext="Active intent tracking"
            color="blue" 
          />
          <StatCard 
            icon={Eye} 
            label="Visual Intelligence" 
            value={visualData?.totalImages?.toLocaleString() || "Loading..."} 
            subtext="Image recognition"
            color="green" 
          />
          <StatCard 
            icon={Activity} 
            label="Voice Commerce" 
            value={voiceData?.totalQueries?.toLocaleString() || "Loading..."} 
            subtext="Multilingual queries"
            color="orange" 
          />
          <StatCard 
            icon={Target} 
            label="Predictive AI" 
            value="94%" 
            subtext="Forecast accuracy"
            color="purple" 
          />
        </div>

        {/* Intent Distribution */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Intent Level Distribution</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-6 bg-red-500/10 rounded-lg border border-red-500/20">
              <div className="text-4xl font-bold text-red-400 mb-2">{(stats.intent_distribution?.High?.count || 0).toLocaleString()}</div>
              <div className="text-sm text-gray-300 font-medium">High Intent</div>
              <div className="text-xs text-gray-500 mt-1">≥ 0.70 score</div>
            </div>
            <div className="text-center p-6 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <div className="text-4xl font-bold text-yellow-400 mb-2">{(stats.intent_distribution?.Medium?.count || 0).toLocaleString()}</div>
              <div className="text-sm text-gray-300 font-medium">Medium Intent</div>
              <div className="text-xs text-gray-500 mt-1">0.50 - 0.69 score</div>
            </div>
            <div className="text-center p-6 bg-gray-500/10 rounded-lg border border-gray-500/20">
              <div className="text-4xl font-bold text-gray-400 mb-2">{(stats.intent_distribution?.Low?.count || 0).toLocaleString()}</div>
              <div className="text-sm text-gray-300 font-medium">Low Intent</div>
              <div className="text-xs text-gray-500 mt-1">&lt; 0.50 scorelt; 0.50 score</div>
            </div>
          </div>
        </div>

        {/* Behavioral Intelligence Deep Dive */}
        {behavioralData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Search Patterns */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Search className="text-blue-400" size={20} />
                <h3 className="text-lg font-bold text-white">Search Patterns</h3>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Search-to-Intent Score</span>
                  <span className="text-blue-400 font-semibold">{behavioralData.searchPatterns.searchToIntent}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-xs text-gray-500 mb-2">Top Categories by Search Volume</div>
                {behavioralData.searchPatterns.topSearches.slice(0, 5).map((search, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-gray-300">{search.category}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-400">{search.search_count.toLocaleString()}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        search.avg_intent >= 0.7 ? 'bg-red-500/20 text-red-400' :
                        search.avg_intent >= 0.5 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {search.avg_intent.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Behavior Statistics */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <MousePointer className="text-green-400" size={20} />
                <h3 className="text-lg font-bold text-white">Behavior Statistics</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Eye className="text-blue-400" size={18} />
                    <span className="text-gray-300">Avg Page Views</span>
                  </div>
                  <span className="text-xl font-bold text-white">{behavioralData.behaviorStats.avg_page_views.toFixed(1)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="text-purple-400" size={18} />
                    <span className="text-gray-300">Avg Time Spent</span>
                  </div>
                  <span className="text-xl font-bold text-white">{Math.round(behavioralData.behaviorStats.avg_time_spent / 60)}m</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="text-orange-400" size={18} />
                    <span className="text-gray-300">Avg Cart Additions</span>
                  </div>
                  <span className="text-xl font-bold text-white">{behavioralData.behaviorStats.avg_cart_adds.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Signals Heatmap */}
        {behavioralData && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Intent Signals by Category</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {behavioralData.categorySignals.map((cat, idx) => (
                <div key={idx} className="p-4 bg-gray-700/50 rounded-lg">
                  <div className="text-sm font-medium text-gray-300 mb-2">{cat.category}</div>
                  <div className="text-2xl font-bold text-white mb-2">{cat.total_signals.toLocaleString()}</div>
                  <div className="flex gap-2 text-xs">
                    <span className="text-red-400">{cat.high_intent}H</span>
                    <span className="text-yellow-400">{cat.medium_intent}M</span>
                    <span className="text-gray-400">{cat.low_intent}L</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Visual Intelligence Analytics */}
        {visualData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="text-green-400" size={20} />
                <h3 className="text-lg font-bold text-white">Visual Intelligence</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Images Analyzed</span>
                  <span className="text-xl font-bold text-white">{visualData.totalImages.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">SKUs Identified</span>
                  <span className="text-xl font-bold text-green-400">{visualData.skusIdentified.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Recognition Accuracy</span>
                  <span className="text-xl font-bold text-blue-400">{visualData.recognitionAccuracy}%</span>
                </div>
              </div>
              <div className="mt-6">
                <div className="text-sm text-gray-400 mb-3">Top Brands Detected</div>
                <div className="space-y-2">
                  {visualData.topBrands.slice(0, 5).map((brand, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">{brand.brand}</span>
                      <span className="text-green-400">{brand.appearances.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Voice Commerce Analytics */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="text-orange-400" size={20} />
                <h3 className="text-lg font-bold text-white">Voice Commerce</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Queries</span>
                  <span className="text-xl font-bold text-white">{voiceData.totalQueries.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-6">
                <div className="text-sm text-gray-400 mb-3">Language Distribution</div>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(voiceData.languages).slice(0, 4).map(([lang, count], idx) => {
                    const percentage = ((count / voiceData.totalQueries) * 100).toFixed(1);
                    return (
                      <div key={idx} className="bg-gray-700/30 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium text-gray-300">{lang}</span>
                          <span className="text-xs font-semibold text-orange-400">{percentage}%</span>
                        </div>
                        <div className="text-lg font-bold text-white">{count.toLocaleString()}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {voiceData.topIntents && (
                <div className="mt-6">
                  <div className="text-sm text-gray-400 mb-3">Top Voice Intents</div>
                  <div className="space-y-2">
                    {voiceData.topIntents.slice(0, 3).map((intent, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">{intent.intent.replace(/_/g, ' ')}</span>
                        <span className="text-orange-400">{intent.count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
