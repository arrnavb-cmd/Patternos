import React from "react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { Mic, Globe, MessageCircle, TrendingUp, Languages } from 'lucide-react';

export default function VoiceIntelligence() {
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    navigate('/login', { replace: true });
  };

  const languagePerformance = [
    { language: 'Hindi', queries: 183000, cvr: 3.8, growth: '+42%' },
    { language: 'English', queries: 125000, cvr: 4.2, growth: '+16%' },
    { language: 'Tamil', queries: 89000, cvr: 3.5, growth: '+45%' },
    { language: 'Telugu', queries: 76000, cvr: 3.2, growth: '+38%' },
    { language: 'Marathi', queries: 65000, cvr: 3.6, growth: '+28%' }
  ];

  const topQueries = [
    { query: '"Nike ke running shoes dikhao"', language: 'Hindi', count: 8500, intent: 'product search' },
    { query: '"Best Nike shoes under 5000"', language: 'English', count: 7200, intent: 'price research' },
    { query: '"Nike Air Max kahan milega"', language: 'Hindi', count: 6800, intent: 'location' },
    { query: '"Nike ka sabse accha shoe"', language: 'Hindi', count: 5900, intent: 'recommendation' }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <Header user={user} onLogout={handleLogout} />
      
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Mic className="text-red-400" size={32} />
              <h1 className="text-3xl font-bold text-white">Voice Intelligence</h1>
            </div>
            <p className="text-gray-400">50+ languages, conversational commerce insights</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <Mic className="text-red-400 mb-3" size={24} />
              <p className="text-gray-400 text-sm mb-1">Voice Queries</p>
              <p className="text-3xl font-bold text-white">503K</p>
              <p className="text-sm text-green-400">+32% this month</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <Languages className="text-orange-400 mb-3" size={24} />
              <p className="text-gray-400 text-sm mb-1">Languages</p>
              <p className="text-3xl font-bold text-white">12</p>
              <p className="text-sm text-gray-500">Active markets</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <MessageCircle className="text-purple-400 mb-3" size={24} />
              <p className="text-gray-400 text-sm mb-1">Avg Conversion</p>
              <p className="text-3xl font-bold text-white">3.7%</p>
              <p className="text-sm text-gray-500">Voice-to-purchase</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <Globe className="text-blue-400 mb-3" size={24} />
              <p className="text-gray-400 text-sm mb-1">Market Reach</p>
              <p className="text-3xl font-bold text-white">85%</p>
              <p className="text-sm text-gray-500">Of Indian shoppers</p>
            </div>
          </div>

          {/* Language Performance */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
            <h2 className="text-xl font-bold text-white mb-6">Performance by Language</h2>
            <div className="space-y-4">
              {languagePerformance.map((lang, idx) => (
                <div key={idx} className="bg-slate-700 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">{idx + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{lang.language}</h3>
                      <p className="text-sm text-gray-400">{lang.queries.toLocaleString()} queries</p>
                    </div>
                  </div>
                  <div className="flex gap-8 items-center">
                    <div className="text-right">
                      <p className="text-white font-bold">{lang.cvr}% CVR</p>
                      <p className="text-sm text-green-400">{lang.growth} growth</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Voice Queries */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-6">Top Voice Queries</h2>
            <div className="space-y-4">
              {topQueries.map((query, idx) => (
                <div key={idx} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-medium">"{query.query}"</p>
                    <div className="text-right">
                      <p className="text-white font-bold">{query.count.toLocaleString()}</p>
                      <p className="text-sm text-gray-400">queries</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">{query.intent}</span>
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs">{query.language}</span>
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
