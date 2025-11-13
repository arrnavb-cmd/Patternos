import React from "react";
import { useState, useEffect } from 'react';
import { TrendingUp, Search, Eye, ShoppingCart, Smartphone, Monitor, Tv } from 'lucide-react';
import api from '../../services/api';

export default function BehavioralIntelligence() {
  const [loading, setLoading] = useState(true);
  const [journeyData, setJourneyData] = useState(null);
  const [selectedUser] = useState('user_12345');

  useEffect(() => {
    loadUserJourney();
  }, []);

  const loadUserJourney = async () => {
    setLoading(true);
    try {
      const data = await api.getUserJourney(selectedUser);
      setJourneyData(data);
    } catch (error) {
      console.error('Error loading journey:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-blue-400">Loading behavioral data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Behavioral Intelligence</h2>
        <p className="text-blue-100">Cross-platform user journey tracking</p>
      </div>

      <div className="bg-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="text-green-400" size={24} />
          <h3 className="text-xl font-bold text-white">Purchase Intent Signals</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {journeyData?.intent_signals?.map((signal, idx) => (
            <div key={idx} className="bg-slate-700 rounded-lg p-4 border-l-4 border-green-400">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs text-slate-400 uppercase">{signal.signal_type}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  signal.intent_strength === 'high' ? 'bg-green-500/20 text-green-400' :
                  signal.intent_strength === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {signal.intent_strength}
                </span>
              </div>
              <p className="text-white font-semibold mb-1">{signal.category || signal.product}</p>
              <p className="text-sm text-slate-300 mb-2">
                Purchase window: <strong>{signal.predicted_purchase_window}</strong>
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Search className="text-blue-400" size={24} />
          <h3 className="text-xl font-bold text-white">Search Patterns</h3>
        </div>
        
        <div className="space-y-3">
          {journeyData?.search_patterns?.top_searches?.map((search, idx) => (
            <div key={idx} className="bg-slate-700 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{search.query}</p>
                <p className="text-sm text-slate-400">Category: {search.category}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-400">{search.count}</p>
                <p className="text-xs text-slate-400">searches</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Smartphone className="text-purple-400" size={24} />
          <h3 className="text-xl font-bold text-white">Device Usage Patterns</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-700 rounded-lg p-4">
            <Smartphone className="text-blue-400 mb-2" size={32} />
            <p className="text-slate-400 text-sm">Mobile</p>
            <p className="text-3xl font-bold text-white">{journeyData?.device_usage?.devices?.mobile?.usage}</p>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <Monitor className="text-green-400 mb-2" size={32} />
            <p className="text-slate-400 text-sm">Laptop</p>
            <p className="text-3xl font-bold text-white">{journeyData?.device_usage?.devices?.laptop?.usage}</p>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <Tv className="text-purple-400 mb-2" size={32} />
            <p className="text-slate-400 text-sm">TV</p>
            <p className="text-3xl font-bold text-white">{journeyData?.device_usage?.devices?.tv?.usage}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Overall Purchase Intent Score</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-6xl font-bold text-white">{journeyData?.purchase_intent_score?.overall_score}</p>
            <p className="text-green-200 text-lg">out of 100</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white mb-2">
              {journeyData?.purchase_intent_score?.ready_to_buy ? '✓ Ready to Buy' : 'Not Ready'}
            </p>
            <p className="text-green-200">
              Optimal timing: {journeyData?.purchase_intent_score?.optimal_ad_timing}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
