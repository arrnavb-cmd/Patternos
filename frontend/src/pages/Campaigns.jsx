import React from "react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Sparkles, BarChart3, ArrowLeft } from 'lucide-react';
import BrandDashboard from '../components/campaigns/BrandDashboard';
import AIAdGenerator from '../components/campaigns/AIAdGenerator';

export default function Campaigns() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Campaign Management</h1>
            <p className="text-slate-400">Create, manage, and optimize your retail media campaigns</p>
          </div>
          <button
            onClick={() => navigate('/campaigns/create')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Plus size={20} />
            Create Campaign
          </button>
        </div>

        <div className="flex gap-2 bg-slate-800 p-2 rounded-xl mb-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Icon size={20} />
                {tab.name}
              </button>
            );
          })}
        </div>

        {activeTab === 'dashboard' && <BrandDashboard />}
        
      </div>
    </div>
  );
}
