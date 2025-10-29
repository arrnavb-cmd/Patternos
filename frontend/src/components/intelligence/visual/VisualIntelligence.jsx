import React from 'react';
import { Eye, Camera, Users, Shield } from 'lucide-react';

const VisualIntelligence = () => {
  const features = [
    'Computer vision',
    'Image recognition',
    'In-store behavior analytics',
    'Anonymous demographic profiling'
  ];

  const metrics = [
    { label: 'In-Store Visitors', value: '124K', trend: '+18%', icon: Users },
    { label: 'Avg Dwell Time', value: '3.2min', trend: '+22%', icon: Eye },
    { label: 'Engagement Rate', value: '67%', trend: '+9%', icon: Camera },
    { label: 'Visual Searches', value: '45K', trend: '+31%', icon: Eye }
  ];

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4 flex items-center gap-3">
          <Eye className="w-8 h-8 text-cyan-400" />
          Visual Intelligence
        </h2>
        <p className="text-white/70 text-lg leading-relaxed">
          Computer vision, image recognition, and in-store behavior analytics 
          with privacy-first edge processing.
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
        <h3 className="text-xl font-semibold text-white/90 mb-4">VisionOS Capabilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-cyan-500/10 border-l-4 border-cyan-400 px-4 py-3 rounded text-white/80">
              {feature}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-8">
        <Shield className="w-12 h-12 text-green-400 flex-shrink-0" />
        <div>
          <strong className="text-white text-lg">Privacy-First Architecture</strong>
          <p className="text-white/70 mt-1">Edge processing • No PII storage • GDPR compliant</p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white/90 mb-4">In-Store Analytics</h3>
        <div className="flex gap-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-4">
          <span className="text-4xl">👥</span>
          <div className="flex-1">
            <strong className="text-white">Demographics:</strong> 
            <span className="text-white/80"> 65% Age 25-34, 45% Female</span>
            <div className="text-sm text-white/60 mt-1">Anonymous edge-based profiling</div>
          </div>
        </div>
        <div className="flex gap-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <span className="text-4xl">🛍️</span>
          <div className="flex-1">
            <strong className="text-white">Hot Zone:</strong> 
            <span className="text-white/80"> Electronics section - 2.8min avg dwell</span>
            <div className="text-sm text-white/60 mt-1">Premium products area</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualIntelligence;
