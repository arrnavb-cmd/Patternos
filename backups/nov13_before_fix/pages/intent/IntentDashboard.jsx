import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Users, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function IntentDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalScores: 0,
    intentDistribution: { high: 0, medium: 0, low: 0, minimal: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('https://patternos-production.up.railway.app/api/v1/intent/stats?clientId=zepto');
      const data = await response.json();
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-${color}-500/10 flex items-center justify-center`}>
          <Icon className={`text-${color}-400`} size={24} />
        </div>
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      <p className="text-gray-400 text-sm">{label}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Intent Intelligence Dashboard</h1>
          <p className="text-gray-400">Real-time purchase intent tracking and scoring</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={Users} label="Total Users Tracked" value={stats.totalUsers} color="blue" />
          <StatCard icon={Activity} label="Total Events" value={stats.totalEvents} color="green" />
          <StatCard icon={Brain} label="Intent Scores" value={stats.totalScores} color="purple" />
          <StatCard icon={TrendingUp} label="High Intent Users" value={stats.intentDistribution.high} color="orange" />
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Intent Level Distribution</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">{stats.intentDistribution.high}</div>
              <div className="text-sm text-gray-400">High Intent</div>
              <div className="text-xs text-gray-500">≥ 0.70</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.intentDistribution.medium}</div>
              <div className="text-sm text-gray-400">Medium Intent</div>
              <div className="text-xs text-gray-500">0.50 - 0.69</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">{stats.intentDistribution.low}</div>
              <div className="text-sm text-gray-400">Low Intent</div>
              <div className="text-xs text-gray-500">0.30 - 0.49</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-400 mb-2">{stats.intentDistribution.minimal}</div>
              <div className="text-sm text-gray-400">Minimal</div>
              <div className="text-xs text-gray-500">&lt; 0.30</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            onClick={() => navigate('/intent/events')}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors text-left"
          >
            <Activity className="text-blue-400 mb-4" size={32} />
            <h3 className="text-lg font-bold text-white mb-2">Event Ingestion</h3>
            <p className="text-gray-400 text-sm">Track user behavior and events</p>
          </button>
          
          <button 
            onClick={() => navigate('/intent/high-intent')}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-orange-500 transition-colors text-left"
          >
            <TrendingUp className="text-orange-400 mb-4" size={32} />
            <h3 className="text-lg font-bold text-white mb-2">High Intent Users</h3>
            <p className="text-gray-400 text-sm">View users ready to purchase</p>
          </button>
          
          <button 
            onClick={() => navigate('/intent/audiences')}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-colors text-left"
          >
            <Users className="text-purple-400 mb-4" size={32} />
            <h3 className="text-lg font-bold text-white mb-2">Create Audiences</h3>
            <p className="text-gray-400 text-sm">Build targetable segments</p>
          </button>
        </div>
      </div>
    </div>
  );
}
