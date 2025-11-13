import React from "react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { Brain, Zap, Target, TrendingUp, MapPin } from 'lucide-react';

export default function PredictiveIntelligence() {
  const predictions = [
    { product: 'Nike Air Max 270', demand: 'High', confidence: 94, forecast: '+45%', timeframe: '7 days' },
    { product: 'Jordan 1 Retro', demand: 'Very High', confidence: 91, forecast: '+62%', timeframe: '5 days' },
    { product: 'Nike Dri-FIT', demand: 'Medium', confidence: 87, forecast: '+28%', timeframe: '14 days' },
    { product: 'Nike Pro Leggings', demand: 'High', confidence: 89, forecast: '+38%', timeframe: '10 days' }
  ];

  const geoFlow = [
    { region: 'Mumbai Metro', score: 92, buyers: 45000, trend: 'rising' },
    { region: 'Delhi NCR', score: 88, buyers: 38000, trend: 'rising' },
    { region: 'Bangalore Tech', score: 85, buyers: 32000, trend: 'stable' },
    { region: 'Pune Central', score: 82, buyers: 28000, trend: 'rising' }
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
              <p className="text-gray-400">Pre-intent forecasting & GeoFlow analysis</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <Brain className="text-purple-400 mb-3" size={24} />
            <p className="text-gray-400 text-sm">Predictions Made</p>
            <p className="text-3xl font-bold text-white mt-1">234</p>
            <p className="text-purple-400 text-sm mt-2">This month</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <Target className="text-blue-400 mb-3" size={24} />
            <p className="text-gray-400 text-sm">Accuracy Rate</p>
            <p className="text-3xl font-bold text-white mt-1">89.2%</p>
            <p className="text-green-400 text-sm mt-2">+2.4% improvement</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <Zap className="text-yellow-400 mb-3" size={24} />
            <p className="text-gray-400 text-sm">Avg ROAS</p>
            <p className="text-3xl font-bold text-white mt-1">4.5x</p>
            <p className="text-yellow-400 text-sm mt-2">From predictions</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <MapPin className="text-green-400 mb-3" size={24} />
            <p className="text-gray-400 text-sm">GeoFlow Zones</p>
            <p className="text-3xl font-bold text-white mt-1">24</p>
            <p className="text-green-400 text-sm mt-2">High-potential areas</p>
          </div>
        </div>

        {/* Demand Predictions */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Demand Forecast (Next 30 Days)</h2>
          <div className="space-y-4">
            {predictions.map((pred, idx) => (
              <div key={idx} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-white">{pred.product}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        pred.demand === 'Very High' ? 'bg-red-500/20 text-red-400' :
                        pred.demand === 'High' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {pred.demand} Demand
                      </span>
                      <span className="text-sm text-gray-400">Peak in {pred.timeframe}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold text-xl">{pred.forecast}</p>
                    <p className="text-sm text-gray-400">{pred.confidence}% confidence</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GeoFlow Analysis */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">GeoFlow: High-Intent Regions</h2>
          <div className="space-y-4">
            {geoFlow.map((geo, idx) => (
              <div key={idx} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
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
                    <p className="text-sm text-gray-400">Intent score</p>
                    <TrendingUp className={`ml-auto mt-1 ${
                      geo.trend === 'rising' ? 'text-green-400' : 'text-gray-400'
                    }`} size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
