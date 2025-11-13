import React from "react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Crown, Activity, FileText, UserPlus, ArrowLeft } from 'lucide-react';
import Header from '../components/layout/Header';
import WalletWise from '../components/controlhub/WalletWise';
import BrandJukebox from '../components/controlhub/BrandJukebox';
import PulsePro from '../components/stratedge/PulsePro';

export default function ControlHub() {
  const [activeTab, setActiveTab] = useState('pulse');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const tabs = [
    { id: 'pulse', name: 'Pulse Pro', icon: Activity, desc: 'Real-time analytics' },
    { id: 'wallet', name: 'Wallet Wise', icon: Wallet, desc: 'Financial management' },
    { id: 'jukebox', name: 'Brand Jukebox', icon: Crown, desc: 'Tier management' },
    { id: 'content', name: 'Content Cop', icon: FileText, desc: 'Campaign review', comingSoon: true },
    { id: 'onboard', name: 'OnboardPro', icon: UserPlus, desc: 'Advertiser onboarding', comingSoon: true }
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

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">ControlHub</h1>
          <p className="text-slate-400">Automate retail media operations</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => !tab.comingSoon && setActiveTab(tab.id)}
                disabled={tab.comingSoon}
                className={`relative p-4 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : tab.comingSoon
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {tab.comingSoon && (
                  <span className="absolute -top-2 -right-2 px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full">
                    Soon
                  </span>
                )}
                <Icon className="mx-auto mb-2" size={24} />
                <p className="font-medium text-sm">{tab.name}</p>
              </button>
            );
          })}
        </div>

        <div>
          {activeTab === 'pulse' && <PulsePro />}
          {activeTab === 'wallet' && <WalletWise />}
          {activeTab === 'jukebox' && <BrandJukebox />}
        </div>
      </div>
    </div>
  );
}
