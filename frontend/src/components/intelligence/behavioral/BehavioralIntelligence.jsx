import React from 'react';
import { BarChart3, TrendingUp, Users, ShoppingCart } from 'lucide-react';

const BehavioralIntelligence = () => {
  const features = [
    'Search patterns',
    'Scroll behavior',
    'Purchase history',
    'Intent signals'
  ];

  const metrics = [
    { label: 'Active Users', value: '2.4M', trend: '+12%', icon: Users },
    { label: 'Search Queries', value: '18.5M', trend: '+8%', icon: BarChart3 },
    { label: 'Intent Score', value: '87%', trend: '+5%', icon: TrendingUp },
    { label: 'Conversion Rate', value: '4.2%', trend: '+15%', icon: ShoppingCart }
  ];

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4 flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-cyan-400" />
          Behavioral Intelligence
        </h2>
        <p className="text-white/70 text-lg leading-relaxed">
          Captures and analyzes search patterns, scroll behavior, and social intent signals 
          to understand customer journeys before they convert.
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
        <h3 className="text-xl font-semibold text-white/90 mb-4">Key Capabilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-cyan-500/10 border-l-4 border-cyan-400 px-4 py-3 rounded text-white/80">
              {feature}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white/90 mb-4">Real-time Insights</h3>
        <div className="flex gap-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-4">
          <span className="text-4xl">🔍</span>
          <div className="flex-1">
            <strong className="text-white">Trending Search:</strong> 
            <span className="text-white/80"> "wireless earbuds under 2000"</span>
            <div className="text-sm text-white/60 mt-1">+245% increase in last 2 hours</div>
          </div>
        </div>
        <div className="flex gap-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <span className="text-4xl">📱</span>
          <div className="flex-1">
            <strong className="text-white">High Intent Segment:</strong> 
            <span className="text-white/80"> Fashion accessories, Age 18-34</span>
            <div className="text-sm text-white/60 mt-1">Ready to purchase in next 24h</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BehavioralIntelligence;
