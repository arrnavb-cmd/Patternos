import React from 'react';
import { Database, Shield, Brain, Megaphone, BarChart } from 'lucide-react';

const ArchitectureFlow = () => {
  const architecture = [
    {
      stage: 'Data Sources',
      icon: Database,
      items: [
        'Search & social signals capturing pre-intent patterns',
        'In-store sensors for physical retail behavior',
        'Voice interactions in 50+ languages',
        'Purchase data from online and offline channels'
      ]
    },
    {
      stage: 'Ingestion & Edge',
      icon: Shield,
      items: [
        'Privacy-first processing at the source',
        'On-device CV processing for anonymous profiling',
        'Privacy safeguards with no PII storage',
        'Real-time processing for instant activation'
      ]
    },
    {
      stage: 'Intelligence',
      icon: Brain,
      items: [
        'Predictive Purchase Engine with pre-intent signals',
        'Persona Cloud for dynamic segmentation',
        'Pre-Intent Pattern recognition across modalities',
        'Contextual AI for situational relevance'
      ]
    },
    {
      stage: 'Activation',
      icon: Megaphone,
      items: [
        'GeoFlow for hyperlocal microzone targeting',
        'Onsite/offsite media across digital channels',
        'In-store displays and digital signage',
        'Voice channels for conversational commerce'
      ]
    },
    {
      stage: 'Measurement',
      icon: BarChart,
      items: [
        'Online attribution for digital touchpoints',
        'Offline conversion tracking in physical retail',
        'Voice measurement for conversational ads',
        'Unified ROAS across all channels'
      ]
    }
  ];

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent text-center mb-4">
        Integrated Product Architecture
      </h2>
      <p className="text-center text-white/70 text-lg mb-12">
        PatternOS combines behavioral, visual, and voice intelligence through a seamless multi-layered platform
      </p>

      <div className="space-y-8">
        {architecture.map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <div key={idx} className="flex items-center gap-6">
              <div className="flex-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/40 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-bold text-white">{stage.stage}</h3>
                </div>
                <ul className="space-y-2">
                  {stage.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="text-white/80 text-sm flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {idx < architecture.length - 1 && (
                <div className="text-4xl text-cyan-400 font-bold">↓</div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-12 pt-8 border-t border-white/10">
        <div className="text-center">
          <strong className="text-white text-lg">Value Proposition: </strong>
          <span className="text-white/80">
            Pre-intent precision + omnichannel activation + comprehensive attribution across the customer journey
          </span>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureFlow;
