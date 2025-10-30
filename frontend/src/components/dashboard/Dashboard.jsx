import { useNavigate } from 'react-router-dom';
import { TrendingUp, Eye, Mic, Brain, ArrowRight } from 'lucide-react';

export default function DashboardContent() {
  const navigate = useNavigate();

  const modules = [
    {
      id: 'behavioral',
      title: 'Behavioral',
      description: 'Search patterns & intent signals',
      icon: TrendingUp,
      gradient: 'from-blue-500 to-cyan-500',
      stats: { signals: 45, accuracy: '87%' }
    },
    {
      id: 'visual',
      title: 'Visual',
      description: 'Computer vision & in-store analytics',
      icon: Eye,
      gradient: 'from-pink-500 to-rose-500',
      stats: { products: 1200, matches: '94%' }
    },
    {
      id: 'voice',
      title: 'Voice',
      description: '50+ languages, conversational commerce',
      icon: Mic,
      gradient: 'from-red-500 to-orange-500',
      stats: { languages: 50, conversion: '32%' }
    },
    {
      id: 'predictive',
      title: 'Predictive',
      description: 'Pre-intent forecasting & GeoFlow',
      icon: Brain,
      gradient: 'from-purple-500 to-indigo-500',
      stats: { predictions: 234, roas: '4.5x' }
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-4">
          PATTERNOS
        </h1>
        <p className="text-2xl text-slate-300 mb-2">
          The Retail Media Intelligence OS
        </p>
        <p className="text-xl text-slate-400 italic">
          Understand what India searches, scrolls, and buys — before they do.
        </p>
      </div>

      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Four Intelligence Modules
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {modules.map(module => {
          const Icon = module.icon;
          return (
            <div
              key={module.id}
              onClick={() => navigate('/intelligence')}
              className="group bg-slate-800 rounded-xl p-6 hover:scale-105 transition-all cursor-pointer border-2 border-slate-700 hover:border-blue-500"
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${module.gradient} flex items-center justify-center mb-4`}>
                <Icon className="text-white" size={32} />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">
                {module.title}
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                {module.description}
              </p>
              
              <div className="flex justify-between items-center text-sm">
                <div>
                  {Object.entries(module.stats).map(([key, value]) => (
                    <p key={key} className="text-slate-500">
                      {key}: <span className="text-white font-bold">{value}</span>
                    </p>
                  ))}
                </div>
                <ArrowRight className="text-slate-600 group-hover:text-blue-400 transition-colors" size={20} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 rounded-xl p-6">
          <p className="text-slate-400 text-sm mb-2">Active Campaigns</p>
          <p className="text-4xl font-bold text-white">12</p>
        </div>
        
        <div className="bg-slate-800 rounded-xl p-6">
          <p className="text-slate-400 text-sm mb-2">Total Impressions</p>
          <p className="text-4xl font-bold text-white">2.4M</p>
        </div>
        
        <div className="bg-slate-800 rounded-xl p-6">
          <p className="text-slate-400 text-sm mb-2">Conversion Rate</p>
          <p className="text-4xl font-bold text-green-400">3.8%</p>
        </div>
      </div>
    </div>
  );
}
