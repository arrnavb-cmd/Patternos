import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, Brain, Target } from 'lucide-react';

export const IntentMetricsSummary = () => {
  const [intentData, setIntentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/master/intent-summary')
      .then(res => res.json())
      .then(data => {
        setIntentData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load intent data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-white">Loading...</div>;
  if (!intentData || intentData.error) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <Brain className="w-6 h-6 text-purple-400 mr-2" />
        <h2 className="text-xl font-bold text-white">Intent Intelligence</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700 rounded-xl p-6">
          <Users className="w-8 h-8 text-blue-400 mb-3" />
          <p className="text-3xl font-bold text-white mb-1">{intentData.total_campaigns || 0}</p>
          <p className="text-sm text-gray-400">Total Campaigns</p>
        </div>

        <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border border-orange-700 rounded-xl p-6">
          <Target className="w-8 h-8 text-orange-400 mb-3" />
          <p className="text-3xl font-bold text-white mb-1">{intentData.high_intent || 0}</p>
          <p className="text-sm text-gray-400">High Intent</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border border-yellow-700 rounded-xl p-6">
          <TrendingUp className="w-8 h-8 text-yellow-400 mb-3" />
          <p className="text-3xl font-bold text-white mb-1">{intentData.medium_intent || 0}</p>
          <p className="text-sm text-gray-400">Medium Intent</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-700 rounded-xl p-6">
          <Brain className="w-8 h-8 text-purple-400 mb-3" />
          <p className="text-3xl font-bold text-white mb-1">{intentData.avg_intent_score?.toFixed(3) || '0.000'}</p>
          <p className="text-sm text-gray-400">Avg Score</p>
        </div>
      </div>
    </div>
  );
};

export default IntentMetricsSummary;
