import React from 'react';
import { Sparkles, Target, MapPin, TrendingUp } from 'lucide-react';

const PredictiveEngine = () => {
  const features = [
    'Pre-intent demand forecasting',
    'Predictive Purchase Engine',
    'Persona Cloud segmentation',
    'GeoFlow hyperlocal targeting',
    'Contextual AI recommendations'
  ];

  const metrics = [
    { label: 'Prediction Accuracy', value: '91%', trend: '+7%', icon: Target },
    { label: 'Pre-Intent Signals', value: '3.2M', trend: '+24%', icon: Sparkles },
    { label: 'Active Personas', value: '847K', trend: '+19%', icon: Target },
    { label: 'ROAS Improvement', value: '2.8x', trend: '+34%', icon: TrendingUp }
  ];

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-cyan-400" />
          Predictive Engine
        </h2>
        <p className="text-white/70 text-lg leading-relaxed">
          AI-powered pre-intent prediction identifies likely buyers before they start searching, 
          enabling proactive engagement and precision targeting.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-6 text-center">
              <Icon className="w-8 h-8 mb-3 mx-auto text-cyan-400" />
              <div className="text-sm text-white/60 mb-2">{metric.label}</div>
              <div className="text-3xl font-bold text-cyan-400 mb-2">{metric.value}</div>
              <div className="text-sm font-semibold text-green-400">{metric.trend}</div>
            </div>
          );
        })}
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white/90 mb-4">Core Capabilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-cyan-500/10 border-l-4 border-cyan-400 px-4 py-3 rounded text-white/80">
              {feature}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white/90 mb-4">Active Predictions</h3>
        
        <div className="bg-green-500/10 border-2 border-green-500/40 rounded-xl p-6 mb-4">
          <div className="flex justify-between items-center mb-4">
            <span className="bg-green-500/30 text-green-300 px-4 py-1 rounded-full text-sm font-bold">
              High Intent
            </span>
            <span className="text-white/60 text-sm">94% confidence</span>
          </div>
          <div>
            <strong className="text-white text-lg">Segment: Premium Smartphone Shoppers</strong>
            <div className="text-white/70 mt-2">
              142K users • Likely to purchase in 48-72 hours
            </div>
            <button className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform">
              Activate Campaign
            </button>
          </div>
        </div>

        <div className="bg-yellow-500/10 border-2 border-yellow-500/40 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="bg-yellow-500/30 text-yellow-300 px-4 py-1 rounded-full text-sm font-bold">
              Medium Intent
            </span>
            <span className="text-white/60 text-sm">78% confidence</span>
          </div>
          <div>
            <strong className="text-white text-lg">Segment: Fashion Accessories - Female 25-35</strong>
            <div className="text-white/70 mt-2">
              89K users • Nurture for next 5-7 days
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white/90 mb-4">GeoFlow Insights</h3>
        <div className="flex items-start gap-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
          <MapPin className="w-12 h-12 text-yellow-400 flex-shrink-0" />
          <div>
            <strong className="text-white text-lg">Microzone Alert: High traffic near Inorbit Mall, Mumbai</strong>
            <div className="text-white/70 mt-2">
              8,234 users within 500m radius • Electronics intent
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveEngine;
