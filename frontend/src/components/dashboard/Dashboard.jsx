import React, { useState } from 'react';
import { BarChart3, Eye, Mic, Sparkles } from 'lucide-react';
import Header from '../layout/Header';
import BehavioralIntelligence from '../intelligence/behavioral/BehavioralIntelligence';
import VisualIntelligence from '../intelligence/visual/VisualIntelligence';
import VoiceIntelligence from '../intelligence/voice/VoiceIntelligence';
import PredictiveEngine from '../intelligence/predictive/PredictiveEngine';
import ArchitectureFlow from './ArchitectureFlow';

const Dashboard = () => {
  const [activeModule, setActiveModule] = useState('overview');

  const modules = [
    { id: 'behavioral', name: 'Behavioral', icon: BarChart3, component: BehavioralIntelligence, description: 'Search patterns & intent signals' },
    { id: 'visual', name: 'Visual', icon: Eye, component: VisualIntelligence, description: 'Computer vision & in-store analytics' },
    { id: 'voice', name: 'Voice', icon: Mic, component: VoiceIntelligence, description: '50+ languages, conversational commerce' },
    { id: 'predictive', name: 'Predictive', icon: Sparkles, component: PredictiveEngine, description: 'Pre-intent forecasting & GeoFlow' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <section className="text-center py-16 mb-12 bg-gradient-to-b from-cyan-500/10 to-transparent rounded-3xl">
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-wider mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent animate-pulse">
            PATTERNOS
          </h1>
          <p className="text-2xl text-white/90 mb-4">
            The Retail Media Intelligence OS
          </p>
          <p className="text-xl text-white/70 italic max-w-3xl mx-auto">
            "Understand what India searches, scrolls, and buys — before they do."
          </p>
        </section>

        {/* Module Navigation */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center text-white/95 mb-8">
            Four Intelligence Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <div
                  key={module.id}
                  onClick={() => setActiveModule(module.id)}
                  className={`bg-white/5 backdrop-blur-xl border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                    activeModule === module.id 
                      ? 'border-cyan-400 shadow-2xl shadow-cyan-500/30 bg-cyan-500/10' 
                      : 'border-white/10 hover:border-cyan-400/50'
                  }`}
                >
                  <Icon className={`w-12 h-12 mx-auto mb-4 ${activeModule === module.id ? 'text-cyan-400' : 'text-white/70'}`} />
                  <h3 className="text-xl font-bold text-white text-center mb-2">{module.name}</h3>
                  <p className="text-sm text-white/60 text-center">{module.description}</p>
                </div>
              );
            })}
          </div>

          {/* Overview Button */}
          <div className="text-center">
            <button
              onClick={() => setActiveModule('overview')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeModule === 'overview'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                  : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20'
              }`}
            >
              View Architecture Overview
            </button>
          </div>
        </section>

        {/* Active Module Display */}
        <section className="animate-fadeIn">
          {activeModule === 'overview' ? (
            <ArchitectureFlow />
          ) : (
            <>
              {modules.find(m => m.id === activeModule)?.component && 
                React.createElement(modules.find(m => m.id === activeModule).component)
              }
            </>
          )}
        </section>

        {/* Footer Stats */}
        <section className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">2.4M+</div>
            <div className="text-sm text-white/70">Active Users</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">50+</div>
            <div className="text-sm text-white/70">Languages</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">91%</div>
            <div className="text-sm text-white/70">Prediction Accuracy</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">2.8x</div>
            <div className="text-sm text-white/70">ROAS Improvement</div>
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
