import React from "react";
import { useState } from 'react';
import { Mic, Globe, ShoppingCart, TrendingUp, Volume2 } from 'lucide-react';

export default function VoiceIntelligence() {
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('hindi');

  const languages = [
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'en', name: 'English', native: 'English' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Voice Intelligence (VoiceOS)</h2>
        <p className="text-red-100">Multilingual voice commerce across 50+ languages</p>
      </div>

      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Voice Shopping Assistant</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <p className="text-slate-400 text-sm mb-3">Select Language</p>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`p-3 rounded-lg text-left transition-all ${
                    selectedLanguage === lang.code
                      ? 'bg-red-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <p className="font-medium">{lang.native}</p>
                  <p className="text-xs opacity-70">{lang.name}</p>
                </button>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => setIsListening(!isListening)}
                className={`relative w-24 h-24 rounded-full mx-auto mb-4 transition-all ${
                  isListening
                    ? 'bg-red-500 animate-pulse'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                <Mic className="absolute inset-0 m-auto text-white" size={40} />
              </button>
              <p className="text-slate-400">
                {isListening ? 'Listening...' : 'Tap to speak'}
              </p>
            </div>
          </div>

          <div className="bg-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Volume2 className="text-red-400" size={20} />
              <p className="text-slate-400 text-sm">Sample Query</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-slate-600 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-1">Original Query</p>
                <p className="text-white text-lg">मुझे 2000 रुपये से कम में वायरलेस ईयरबड्स दिखाओ</p>
              </div>
              
              <div className="bg-slate-600 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-1">Understood</p>
                <p className="text-white">Show me wireless earbuds under ₹2000</p>
              </div>
              
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-400 font-medium mb-2">Voice Response</p>
                <p className="text-white text-sm">
                  मैंने 2000 रुपये से कम में 5 वायरलेस ईयरबड्स ढूंढे हैं। सबसे लोकप्रिय boAt Airdopes है।
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 rounded-xl p-6">
          <Globe className="text-blue-400 mb-3" size={32} />
          <p className="text-slate-400 text-sm mb-1">Languages Supported</p>
          <p className="text-4xl font-bold text-white">50+</p>
          <p className="text-xs text-slate-400 mt-2">Including all major Indian languages</p>
        </div>
        
        <div className="bg-slate-800 rounded-xl p-6">
          <TrendingUp className="text-green-400 mb-3" size={32} />
          <p className="text-slate-400 text-sm mb-1">Conversion Rate</p>
          <p className="text-4xl font-bold text-green-400">32%</p>
          <p className="text-xs text-green-400 mt-2">+28% vs text-only</p>
        </div>
        
        <div className="bg-slate-800 rounded-xl p-6">
          <ShoppingCart className="text-purple-400 mb-3" size={32} />
          <p className="text-slate-400 text-sm mb-1">Avg Basket Size</p>
          <p className="text-4xl font-bold text-white">₹2,847</p>
          <p className="text-xs text-purple-400 mt-2">+32% higher than text</p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Voice Shopping Patterns</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-slate-400 text-sm mb-3">Query Types</p>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-white text-sm">Product Search</span>
                  <span className="text-blue-400 font-bold">60%</span>
                </div>
                <div className="bg-slate-700 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-white text-sm">Price Inquiry</span>
                  <span className="text-green-400 font-bold">25%</span>
                </div>
                <div className="bg-slate-700 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{width: '25%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-white text-sm">Order Tracking</span>
                  <span className="text-purple-400 font-bold">15%</span>
                </div>
                <div className="bg-slate-700 rounded-full h-2">
                  <div className="bg-purple-400 h-2 rounded-full" style={{width: '15%'}}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-slate-400 text-sm mb-3">Accessibility Impact</p>
            <div className="space-y-3">
              <div className="bg-slate-700 rounded-lg p-4">
                <p className="text-white font-medium mb-1">Market Expansion</p>
                <p className="text-2xl font-bold text-green-400">+40%</p>
                <p className="text-xs text-slate-400">Reached underserved demographics</p>
              </div>
              
              <div className="bg-slate-700 rounded-lg p-4">
                <p className="text-white font-medium mb-1">User Retention</p>
                <p className="text-2xl font-bold text-blue-400">+28%</p>
                <p className="text-xs text-slate-400">Higher engagement with voice</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-2">Voice-Enabled Checkout</h3>
        <p className="text-orange-100 mb-4">Complete purchases using voice commands with UPI integration</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
            <p className="text-orange-200 text-sm mb-1">Step 1</p>
            <p className="font-medium">Voice Cart Review</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
            <p className="text-orange-200 text-sm mb-1">Step 2</p>
            <p className="font-medium">Voice Confirmation</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
            <p className="text-orange-200 text-sm mb-1">Step 3</p>
            <p className="font-medium">UPI Payment</p>
          </div>
        </div>
      </div>
    </div>
  );
}
