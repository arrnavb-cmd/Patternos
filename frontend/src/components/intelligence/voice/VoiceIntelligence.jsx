import React from 'react';
import { Mic, Globe, TrendingUp, DollarSign } from 'lucide-react';

const VoiceIntelligence = () => {
  const languages = [
    'Hindi', 'English', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 
    'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', '+ 40 more'
  ];

  const metrics = [
    { label: 'Voice Queries', value: '892K', trend: '+42%', icon: Mic },
    { label: 'Languages', value: '50+', trend: 'stable', icon: Globe },
    { label: 'Accuracy', value: '94%', trend: '+3%', icon: TrendingUp },
    { label: 'Voice Commerce', value: '₹12.4Cr', trend: '+68%', icon: DollarSign }
  ];

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4 flex items-center gap-3">
          <Mic className="w-8 h-8 text-cyan-400" />
          Voice Intelligence
        </h2>
        <p className="text-white/70 text-lg leading-relaxed">
          Multilingual conversational commerce across 50+ Indian languages, 
          powering voice-first shopping experiences.
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
              <div className={`text-sm font-semibold ${metric.trend === 'stable' ? 'text-white/60' : 'text-green-400'}`}>
                {metric.trend}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white/90 mb-4">Supported Languages</h3>
        <div className="flex flex-wrap gap-3">
          {languages.map((lang, idx) => (
            <span key={idx} className="bg-cyan-500/20 border border-cyan-500/40 px-4 py-2 rounded-full text-sm text-cyan-300">
              {lang}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white/90 mb-4">Voice Commerce Insights</h3>
        <div className="flex gap-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-4">
          <span className="text-4xl">🗣️</span>
          <div className="flex-1">
            <strong className="text-white">Top Query:</strong> 
            <span className="text-white/80"> "mere liye best wireless earphones dikhao"</span>
            <div className="text-sm text-white/60 mt-1">Hindi - Electronics category</div>
          </div>
        </div>
        <div className="flex gap-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-4">
          <span className="text-4xl">🌐</span>
          <div className="flex-1">
            <strong className="text-white">Regional Trend:</strong> 
            <span className="text-white/80"> Voice adoption up 85% in Tier-2 cities</span>
            <div className="text-sm text-white/60 mt-1">Vernacular commerce leading growth</div>
          </div>
        </div>
        <div className="flex gap-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <span className="text-4xl">💬</span>
          <div className="flex-1">
            <strong className="text-white">Conversational Commerce:</strong> 
            <span className="text-white/80"> Avg 4.2 voice interactions per session</span>
            <div className="text-sm text-white/60 mt-1">Higher engagement vs text search</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceIntelligence;
