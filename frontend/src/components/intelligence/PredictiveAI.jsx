import React from "react";
import { useState, useEffect } from 'react';
import { Brain, Target, Users, MapPin } from 'lucide-react';
import api from '../../services/api';

export default function PredictiveAI() {
  const [predictions, setPredictions] = useState(null);
  const [persona, setPersona] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPredictions();
  }, []);

  const loadPredictions = async () => {
    setLoading(true);
    try {
      const [predData, personaData] = await Promise.all([
        api.getPurchasePrediction('user_12345'),
        api.getUserPersona('user_12345')
      ]);
      setPredictions(predData);
      setPersona(personaData);
    } catch (error) {
      console.error('Error loading predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-purple-400">Loading AI predictions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Predictive AI Engine</h2>
        <p className="text-purple-100">Pre-intent forecasting & audience intelligence</p>
      </div>

      <div className="bg-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="text-purple-400" size={28} />
          <div>
            <h3 className="text-xl font-bold text-white">Purchase Intent Predictions</h3>
            <p className="text-slate-400 text-sm">What users will buy before they search</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {predictions?.predictions?.map((pred, idx) => (
            <div key={idx} className="bg-slate-700 rounded-xl p-6 border-l-4 border-purple-400">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-2xl font-bold text-white mb-1">
                    {pred.product_category.replace('_', ' ')}
                  </p>
                  <p className="text-slate-400 text-sm">Purchase window: {pred.predicted_purchase_window}</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-purple-400">{pred.probability}%</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    pred.confidence === 'high' ? 'bg-green-500/20 text-green-400' :
                    pred.confidence === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {pred.confidence} confidence
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-slate-400 text-sm mb-2">Signals Used:</p>
                <div className="flex flex-wrap gap-2">
                  {pred.signals_used.map((signal, sidx) => (
                    <span key={sidx} className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded">
                      {signal}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-3">
                <p className="text-indigo-400 font-medium text-sm mb-1">Recommended Action</p>
                <p className="text-white">{pred.recommended_action.replace('_', ' ')}</p>
                {pred.optimal_ad_timing && (
                  <p className="text-xs text-slate-400 mt-1">Optimal timing: {pred.optimal_ad_timing}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {predictions?.geoflow_targeting && (
        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="text-green-400" size={24} />
            <h3 className="text-xl font-bold text-white">GeoFlow - Hyperlocal Targeting</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-700 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Current Location</p>
              <p className="text-white font-bold text-lg">{predictions.geoflow_targeting.current_location}</p>
            </div>
            
            <div className="bg-slate-700 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-2">Nearby Stores</p>
              {predictions.geoflow_targeting.nearby_stores.map((store, idx) => (
                <p key={idx} className="text-white text-sm">{store}</p>
              ))}
            </div>
            
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-400 font-medium text-sm mb-1">Quick Delivery</p>
              <p className="text-white">{predictions.geoflow_targeting.optimal_delivery}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Users className="text-blue-400" size={28} />
          <div>
            <h3 className="text-xl font-bold text-white">Persona Cloud</h3>
            <p className="text-slate-400 text-sm">Dynamic audience segmentation</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white">
            <p className="text-blue-200 text-sm mb-2">Primary Persona</p>
            <p className="text-3xl font-bold mb-4">{persona?.persona?.primary}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-blue-200">Age Range</span>
                <span className="font-bold">{persona?.persona?.demographics?.age_range}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Location</span>
                <span className="font-bold">{persona?.persona?.demographics?.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Income</span>
                <span className="font-bold">{persona?.persona?.demographics?.income_bracket}</span>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
              <p className="text-blue-200 text-sm mb-1">Secondary Persona</p>
              <p className="font-medium">{persona?.persona?.secondary}</p>
            </div>
          </div>
          
          <div>
            <p className="text-slate-400 text-sm mb-3">Behavioral Traits</p>
            <div className="space-y-3">
              {Object.entries(persona?.behavioral_traits || {}).map(([trait, level]) => (
                <div key={trait}>
                  <div className="flex justify-between mb-1">
                    <span className="text-white text-sm capitalize">{trait.replace('_', ' ')}</span>
                    <span className={`font-bold text-sm ${
                      level === 'high' ? 'text-green-400' :
                      level === 'medium' ? 'text-yellow-400' :
                      'text-gray-400'
                    }`}>
                      {level}
                    </span>
                  </div>
                  <div className="bg-slate-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        level === 'high' ? 'bg-green-400 w-full' :
                        level === 'medium' ? 'bg-yellow-400 w-2/3' :
                        'bg-gray-400 w-1/3'
                      }`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-2">Lookalike Audience</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-white">{persona?.lookalike_audience?.size}</p>
              <p className="text-sm text-slate-400">Similar users</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-400">
                {persona?.lookalike_audience?.similarity_score}%
              </p>
              <p className="text-sm text-slate-400">Similarity score</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Customer Lifetime Value (LTV)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-green-200 text-sm mb-1">Predicted LTV</p>
            <p className="text-4xl font-bold">{persona?.lifetime_value?.predicted_ltv}</p>
          </div>
          <div>
            <p className="text-green-200 text-sm mb-1">Current Spend</p>
            <p className="text-4xl font-bold">{persona?.lifetime_value?.current_spend}</p>
          </div>
          <div>
            <p className="text-green-200 text-sm mb-1">Retention Probability</p>
            <p className="text-4xl font-bold">{persona?.lifetime_value?.retention_probability}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Target className="text-yellow-400" size={28} />
          <div>
            <h3 className="text-xl font-bold text-white">AI-Powered Campaign Optimization</h3>
            <p className="text-slate-400 text-sm">Maximize ROAS with intelligent budget allocation</p>
          </div>
        </div>
        
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 mb-6">
          <p className="text-yellow-400 font-bold text-lg mb-2">Expected Results</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-slate-400 text-sm">Total Conversions</p>
              <p className="text-2xl font-bold text-white">450</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Avg CPA</p>
              <p className="text-2xl font-bold text-white">₹180</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">ROI</p>
              <p className="text-2xl font-bold text-green-400">350%</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Ad Spend Reduction</p>
              <p className="text-2xl font-bold text-green-400">35%</p>
            </div>
          </div>
        </div>
        
        <p className="text-slate-400 text-sm mb-3">Platform Budget Allocation</p>
        <div className="space-y-3">
          {[
            { platform: 'Flipkart', allocation: 40, reason: 'Highest intent' },
            { platform: 'Instagram', allocation: 30, reason: 'Visual engagement' },
            { platform: 'YouTube', allocation: 20, reason: 'Video research' },
            { platform: 'Google', allocation: 10, reason: 'Search intent' }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-white font-medium">{item.platform}</p>
                  <p className="text-xs text-slate-400">{item.reason}</p>
                </div>
                <p className="text-2xl font-bold text-blue-400">{item.allocation}%</p>
              </div>
              <div className="bg-slate-600 rounded-full h-2">
                <div 
                  className="bg-blue-400 h-2 rounded-full"
                  style={{width: `${item.allocation}%`}}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
