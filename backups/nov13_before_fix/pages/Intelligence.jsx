import React from "react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Eye, Mic, TrendingUp, ArrowLeft } from 'lucide-react';
import Header from '../components/layout/Header';
import BehavioralIntelligence from '../components/intelligence/BehavioralIntelligence';
import VisualIntelligence from '../components/intelligence/VisualIntelligence';
import VoiceIntelligence from '../components/intelligence/VoiceIntelligence';
import PredictiveAI from '../components/intelligence/PredictiveAI';

export default function Intelligence() {
  const [activeModule, setActiveModule] = useState('behavioral');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const modules = [
    { id: 'behavioral', name: 'Behavioral', icon: TrendingUp, color: 'blue' },
    { id: 'visual', name: 'Visual', icon: Eye, color: 'pink' },
    { id: 'voice', name: 'Voice', icon: Mic, color: 'red' },
    { id: 'predictive', name: 'Predictive AI', icon: Brain, color: 'purple' }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <Header user={user} onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {modules.map(module => {
            const Icon = module.icon;
            const isActive = activeModule === module.id;
            return (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`p-6 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg'
                    : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                <Icon className={`mx-auto mb-2 ${
                  isActive ? 'text-white' : 'text-blue-400'
                }`} size={32} />
                <p className={`font-bold ${
                  isActive ? 'text-white' : 'text-slate-300'
                }`}>
                  {module.name}
                </p>
              </button>
            );
          })}
        </div>

        <div>
          {activeModule === 'behavioral' && <BehavioralIntelligence />}
          {activeModule === 'visual' && <VisualIntelligence />}
          {activeModule === 'voice' && <VoiceIntelligence />}
          {activeModule === 'predictive' && <PredictiveAI />}
        </div>
      </div>
    </div>
  );
}
