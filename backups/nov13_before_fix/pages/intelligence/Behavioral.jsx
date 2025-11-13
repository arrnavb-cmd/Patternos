import React from "react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { Search, TrendingUp, Target, Users, ArrowRight, Filter, Calendar, Brain } from 'lucide-react';

export default function BehavioralIntelligence() {
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [dateRange, setDateRange] = useState('last_30_days');

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    navigate('/login', { replace: true });
  };
  
  const intentSignals = [
    { keyword: 'nike air max', volume: 45000, intent: 'transactional', score: 92, trend: '+18%' },
    { keyword: 'best running shoes', volume: 38000, intent: 'informational', score: 68, trend: '+12%' },
    { keyword: 'nike shoes near me', volume: 32000, intent: 'navigational', score: 88, trend: '+25%' },
    { keyword: 'buy jordan 1', volume: 28000, intent: 'transactional', score: 95, trend: '+31%' }
  ];

  const shopperMindframes = [
    { type: 'Casual Browsers', count: 125000, percentage: 35, avgTime: '2:15', conversion: 0.8 },
    { type: 'Explorers', count: 89000, percentage: 25, avgTime: '5:42', conversion: 2.3 },
    { type: 'Spearfishers', count: 71000, percentage: 20, avgTime: '3:28', conversion: 8.7 },
    { type: 'Snipers', count: 71000, percentage: 20, avgTime: '1:45', conversion: 15.2 }
  ];

  const trendingSearches = [
    { query: 'sustainable sneakers', growth: 145, category: 'Footwear' },
    { query: 'nike pro leggings', growth: 89, category: 'Apparel' },
    { query: 'basketball shoes under 5000', growth: 72, category: 'Footwear' },
    { query: 'nike dri-fit', growth: 58, category: 'Apparel' }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <Header user={user} onLogout={handleLogout} />
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="text-purple-400" size={32} />
              <h1 className="text-3xl font-bold text-white">Behavioral Intelligence</h1>
            </div>
            <p className="text-gray-400">Search patterns & intent signals for your products</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <Search className="text-blue-400 mb-3" size={24} />
              <p className="text-gray-400 text-sm mb-1">Total Search Volume</p>
              <p className="text-3xl font-bold text-white">2.8M</p>
              <p className="text-sm text-green-400">+24.5% vs last period</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <Target className="text-purple-400 mb-3" size={24} />
              <p className="text-gray-400 text-sm mb-1">Active Searches</p>
              <p className="text-3xl font-bold text-white">892K</p>
              <p className="text-sm text-gray-500">31.6% of total</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <Users className="text-green-400 mb-3" size={24} />
              <p className="text-gray-400 text-sm mb-1">Unique Searchers</p>
              <p className="text-3xl font-bold text-white">1.2M</p>
              <p className="text-sm text-green-400">2.3 searches/user</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <TrendingUp className="text-orange-400 mb-3" size={24} />
              <p className="text-gray-400 text-sm mb-1">Avg Intent Score</p>
              <p className="text-3xl font-bold text-white">78.5</p>
              <p className="text-sm text-green-400">+5.2 pts</p>
            </div>
          </div>

          {/* Shopper Mindframes */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
            <h2 className="text-xl font-bold text-white mb-6">Shopper Mindframes Analysis</h2>
            <div className="space-y-4">
              {shopperMindframes.map((frame, idx) => (
                <div key={idx} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-white">{frame.type}</h3>
                      <p className="text-sm text-gray-400">{frame.count.toLocaleString()} users</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{frame.conversion}% CVR</p>
                      <p className="text-sm text-gray-400">Avg time: {frame.avgTime}</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${frame.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Intent Signals */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
            <h2 className="text-xl font-bold text-white mb-6">Top Intent Signals</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Keyword</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Volume</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Intent Type</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Score</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {intentSignals.map((signal, idx) => (
                    <tr key={idx} className="border-b border-slate-700">
                      <td className="py-4 px-4 text-white font-medium">{signal.keyword}</td>
                      <td className="py-4 px-4 text-gray-300">{signal.volume.toLocaleString()}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          signal.intent === 'transactional' ? 'bg-green-500/20 text-green-400' : 
                          signal.intent === 'informational' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {signal.intent}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-white font-medium">{signal.score}</td>
                      <td className="py-4 px-4 text-green-400 font-medium">{signal.trend}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Trending Searches */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-6">Trending Searches (Last 7 Days)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trendingSearches.map((search, idx) => (
                <div key={idx} className="bg-slate-700 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{search.query}</p>
                    <p className="text-sm text-gray-400">{search.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold">+{search.growth}%</p>
                    <TrendingUp className="text-green-400 ml-auto mt-1" size={16} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
