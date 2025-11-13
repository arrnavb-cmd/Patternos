import React from 'react';
import { ArrowRight, BarChart3, Eye, Mic, Brain, Users, MapPin, Shield } from 'lucide-react';

export default function LandingPage({ onEnterDashboard }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800">
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-6">
              PATTERNOS
            </h1>
            <p className="text-2xl text-blue-200 mb-4">
              The Retail Media Intelligence OS
            </p>
            <p className="text-xl text-blue-100 italic mb-12 max-w-4xl mx-auto">
              "Understand what India searches, scrolls, and buys — before they do."
            </p>
            <button
              onClick={onEnterDashboard}
              className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 inline-flex items-center gap-2"
            >
              Enter Dashboard
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white opacity-20"
              style={{
                width: Math.random() * 6 + 2 + 'px',
                height: Math.random() * 6 + 2 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out`
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Four Intelligence Modules
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ModuleCard
            icon={<BarChart3 size={48} />}
            title="Behavioral"
            color="blue"
            description="Search patterns, scroll behavior, purchase history and intent signals"
          />
          
          <ModuleCard
            icon={<Eye size={48} />}
            title="Visual"
            color="green"
            description="Computer vision, image recognition, in-store behavior analytics"
          />
          
          <ModuleCard
            icon={<Mic size={48} />}
            title="Voice"
            color="red"
            description="Multilingual conversational commerce across 50+ languages"
          />
          
          <ModuleCard
            icon={<Brain size={48} />}
            title="Predictive"
            color="yellow"
            description="Pre-intent demand forecasting and audience prediction"
          />
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Core Capabilities
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureItem
              icon={<Users size={32} />}
              title="Persona Cloud"
              description="Dynamic audience segmentation and lookalike modeling"
            />
            <FeatureItem
              icon={<MapPin size={32} />}
              title="GeoFlow"
              description="Hyperlocal microzone targeting for precision messaging"
            />
            <FeatureItem
              icon={<Brain size={32} />}
              title="Predictive Purchase Engine"
              description="AI-powered pre-intent prediction before they search"
            />
            <FeatureItem
              icon={<Shield size={32} />}
              title="Privacy First"
              description="GDPR/CCPA compliant edge-computing with no PII storage"
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}

function ModuleCard({ icon, title, color, description }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    yellow: 'from-yellow-500 to-yellow-600'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-2xl`}>
      <div className="mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-white/90 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function FeatureItem({ icon, title, description }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="text-blue-300 flex-shrink-0">{icon}</div>
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-blue-200 text-sm">{description}</p>
      </div>
    </div>
  );
}
