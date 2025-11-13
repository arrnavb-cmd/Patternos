import React from "react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { 
  DollarSign, TrendingUp, Users, MousePointer, Download, 
  Calendar, BarChart3, PieChart, LineChart
} from 'lucide-react';

export default function Analytics() {
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    navigate('/login', { replace: true });
  };

  const metrics = {
    totalSpend: 1220000,
    impressions: 23800000,
    clicks: 348000,
    conversions: 11540,
    avgRoas: 6.15
  };

  const platformData = [
    { platform: 'Zepto', spend: 450000, impressions: '8.5M', clicks: '125K', ctr: '1.47%', conversions: 4200, roas: '6.2x' },
    { platform: 'Facebook', spend: 285000, impressions: '5.2M', clicks: '76K', ctr: '1.46%', conversions: 2480, roas: '6.8x' },
    { platform: 'Instagram', spend: 165000, impressions: '3.3M', clicks: '49K', ctr: '1.48%', conversions: 1720, roas: '5.7x' },
    { platform: 'Google', spend: 320000, impressions: '6.8M', clicks: '98K', ctr: '1.44%', conversions: 3140, roas: '5.9x' }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <Header user={user} onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-gray-400">Cross-platform performance metrics</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
              <Download size={16} />
              Download PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
              <Download size={16} />
              Download Excel
            </button>
          </div>
        </div>

        {/* Time Period Selector */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <Calendar className="text-gray-400" size={20} />
            <select className="bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>Last 90 Days</option>
              <option>Custom Range</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="text-green-400" size={24} />
              <p className="text-gray-400 text-sm">Total Spend</p>
            </div>
            <p className="text-3xl font-bold text-white">₹{(metrics.totalSpend / 100000).toFixed(1)}L</p>
            <p className="text-green-400 text-sm">+18.3% vs last month</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="text-blue-400" size={24} />
              <p className="text-gray-400 text-sm">Impressions</p>
            </div>
            <p className="text-3xl font-bold text-white">{(metrics.impressions / 1000000).toFixed(1)}M</p>
            <p className="text-blue-400 text-sm">+12.7% vs last month</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <Users className="text-purple-400" size={24} />
              <p className="text-gray-400 text-sm">Clicks</p>
            </div>
            <p className="text-3xl font-bold text-white">{(metrics.clicks / 1000).toFixed(0)}K</p>
            <p className="text-purple-400 text-sm">+15.2% vs last month</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <MousePointer className="text-orange-400" size={24} />
              <p className="text-gray-400 text-sm">Conversions</p>
            </div>
            <p className="text-3xl font-bold text-white">{metrics.conversions.toLocaleString()}</p>
            <p className="text-orange-400 text-sm">+22.1% vs last month</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-green-400" size={24} />
              <p className="text-gray-400 text-sm">Avg ROAS</p>
            </div>
            <p className="text-3xl font-bold text-green-400">{metrics.avgRoas}x</p>
            <p className="text-green-400 text-sm">+8.9% vs last month</p>
          </div>
        </div>

        {/* Platform Performance Table */}
        <div className="bg-slate-800 rounded-xl border border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <h3 className="text-xl font-bold text-white">Platform Performance</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-4 text-gray-400 font-medium">Platform</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Spend</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Impressions</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Clicks</th>
                  <th className="text-left p-4 text-gray-400 font-medium">CTR</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Conversions</th>
                  <th className="text-left p-4 text-gray-400 font-medium">ROAS</th>
                </tr>
              </thead>
              <tbody>
                {platformData.map((row, index) => (
                  <tr key={index} className="border-b border-slate-700 hover:bg-slate-700/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          row.platform === 'Zepto' ? 'bg-purple-500' :
                          row.platform === 'Facebook' ? 'bg-blue-500' :
                          row.platform === 'Instagram' ? 'bg-pink-500' :
                          'bg-red-500'
                        }`} />
                        <span className="text-white font-medium">{row.platform}</span>
                      </div>
                    </td>
                    <td className="p-4 text-white">₹{(row.spend / 1000).toFixed(0)}K</td>
                    <td className="p-4 text-white">{row.impressions}</td>
                    <td className="p-4 text-white">{row.clicks}</td>
                    <td className="p-4">
                      <span className="text-blue-400 font-medium">{row.ctr}</span>
                    </td>
                    <td className="p-4 text-white">{row.conversions.toLocaleString()}</td>
                    <td className="p-4">
                      <span className="text-green-400 font-bold">{row.roas}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
