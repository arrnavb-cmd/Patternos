import React, { useState, useEffect } from 'react';
import { Eye, Clock, MousePointer, Layers, TrendingUp, Activity } from 'lucide-react';

const BehavioralIntelligence = () => {
  const [userInsights, setUserInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState('user_123'); // Demo user
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    fetchUserInsights();
  }, [selectedUser, timeRange]);

  const fetchUserInsights = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/behavioral/insights/${selectedUser}?days=${timeRange}`);
      const data = await response.json();
      setUserInsights(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching insights:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white">Loading behavioral insights...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Behavioral Intelligence</h1>
        <p className="text-gray-400">Cross-platform user behavior tracking and insights</p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6 flex gap-3">
        {[7, 30, 90].map(days => (
          <button
            key={days}
            onClick={() => setTimeRange(days)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeRange === days
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Last {days} days
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Eye className="text-blue-400" size={24} />
            <span className="text-xs text-gray-500 uppercase">Page Views</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {userInsights?.total_page_views || 0}
          </p>
          <p className="text-sm text-gray-400">Total pages viewed</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Activity className="text-green-400" size={24} />
            <span className="text-xs text-gray-500 uppercase">Sessions</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {userInsights?.total_sessions || 0}
          </p>
          <p className="text-sm text-gray-400">Active sessions</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Clock className="text-purple-400" size={24} />
            <span className="text-xs text-gray-500 uppercase">Avg Time</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {Math.round(userInsights?.avg_session_time || 0)}s
          </p>
          <p className="text-sm text-gray-400">Per session</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Layers className="text-orange-400" size={24} />
            <span className="text-xs text-gray-500 uppercase">Platforms</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {userInsights?.platforms_used?.length || 0}
          </p>
          <p className="text-sm text-gray-400">Platforms used</p>
        </div>
      </div>

      {/* Platforms Used */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Active Platforms</h2>
        <div className="flex gap-3 flex-wrap">
          {userInsights?.platforms_used?.map((platform, idx) => (
            <span
              key={idx}
              className="px-4 py-2 bg-blue-900/30 text-blue-400 rounded-lg font-medium"
            >
              {platform}
            </span>
          ))}
        </div>
      </div>

      {/* Recent Browsing History */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Recent Browsing History</h2>
        <div className="space-y-3">
          {userInsights?.browsing_history?.length > 0 ? (
            userInsights.browsing_history.map((item, idx) => (
              <div key={idx} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-white font-medium mb-1">{item.page_title}</p>
                    <p className="text-sm text-gray-400 mb-2">{item.url}</p>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>Platform: {item.platform}</span>
                      <span>Device: {item.device_type}</span>
                      <span>Time: {item.time_spent}s</span>
                      <span>Scroll: {Math.round(item.scroll_depth)}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No browsing history available</p>
          )}
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Recent Sessions</h2>
        <div className="space-y-3">
          {userInsights?.recent_sessions?.length > 0 ? (
            userInsights.recent_sessions.map((session, idx) => (
              <div key={idx} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium mb-1">Session {session.session_id}</p>
                    <div className="flex gap-4 text-sm text-gray-400">
                      <span>Platform: {session.platform}</span>
                      <span>Pages: {session.page_views}</span>
                      <span>Duration: {session.total_time}s</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(session.start_time).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No recent sessions</p>
          )}
        </div>
      </div>

      {/* Cross-Platform Activity Note */}
      <div className="mt-8 bg-blue-900/20 border border-blue-700 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <TrendingUp className="text-blue-400 flex-shrink-0" size={24} />
          <div>
            <h3 className="text-white font-bold mb-2">Cross-Platform Tracking Active</h3>
            <p className="text-gray-300 text-sm">
              Tracking user behavior across {userInsights?.platforms_used?.length || 0} platforms with {userInsights?.cross_platform_activities || 0} cross-platform activities detected in the last {timeRange} days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BehavioralIntelligence;
