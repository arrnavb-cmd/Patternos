import React from "react";
import { useNavigate } from 'react-router-dom';
import { DollarSign, TrendingUp, ShoppingCart, BarChart3, Zap, Target, Users, Percent, CreditCard } from 'lucide-react';

export default function DashboardContent() {
  const navigate = useNavigate();

  // Revenue Metrics
  const revenueMetrics = [
    { 
      label: 'Platform Ad Revenue', 
      value: '₹4.5L', 
      subtext: '10% from FB, Google, Instagram', 
      icon: DollarSign, 
      color: 'text-blue-400' 
    },
    { 
      label: 'Platform Fees (Brands)', 
      value: '₹35L', 
      subtext: '₹5L/month × 7 brands', 
      icon: CreditCard, 
      color: 'text-green-400' 
    },
    { 
      label: 'Brand Revenue Share', 
      value: '₹9.0L', 
      subtext: '20% from high-intent ads', 
      icon: Percent, 
      color: 'text-purple-400' 
    },
    { 
      label: 'Total Revenue', 
      value: '₹48.5L', 
      subtext: 'This month', 
      icon: TrendingUp, 
      color: 'text-orange-400' 
    }
  ];

  // Performance Metrics
  const performanceMetrics = [
    { label: 'Total Ad Spend', value: '₹45.0L', subtext: 'All brands this month', icon: ShoppingCart },
    { label: 'Average ROAS', value: '6.2x', subtext: '+12% vs last month', icon: TrendingUp },
    { label: 'Active Brands', value: '7', subtext: 'Nike, Lakme, Phoocl, Amul +3', icon: Users }
  ];

  // All Brands Data
  const brandsData = [
    { name: 'Nike', spend: '₹18.0L', revenue: '₹1.25Cr', roas: '6.9x', campaigns: 12, status: 'ACTIVE' },
    { name: 'Lakme', spend: '₹8.5L', revenue: '₹0.52Cr', roas: '6.1x', campaigns: 8, status: 'ACTIVE' },
    { name: 'Phoocl', spend: '₹6.2L', revenue: '₹0.38Cr', roas: '6.1x', campaigns: 5, status: 'ACTIVE' },
    { name: 'Amul', spend: '₹5.8L', revenue: '₹0.34Cr', roas: '5.9x', campaigns: 6, status: 'ACTIVE' },
    { name: 'Adidas', spend: '₹3.5L', revenue: '₹0.19Cr', roas: '5.4x', campaigns: 4, status: 'ACTIVE' },
    { name: "Pond's", spend: '₹2.0L', revenue: '₹0.10Cr', roas: '5.0x', campaigns: 3, status: 'ACTIVE' },
    { name: 'Indiggi', spend: '₹1.0L', revenue: '₹0.05Cr', roas: '5.0x', campaigns: 2, status: 'ACTIVE' }
  ];

  const topCampaigns = [
    { 
      name: 'Nike Air Max - Search Campaign', 
      brand: 'Nike',
      impressions: '8,500,000', 
      platform: 'Zepto', 
      spend: '₹18.0L', 
      revenue: '₹1.25Cr', 
      roas: '6.9x', 
      conversions: '4,200',
      status: 'ACTIVE'
    },
    { 
      name: 'Lakme Absolute - Display Ads', 
      brand: 'Lakme',
      impressions: '5,200,000', 
      platform: 'Facebook', 
      spend: '₹8.5L', 
      revenue: '₹0.52Cr', 
      roas: '6.1x', 
      conversions: '2,480',
      status: 'ACTIVE'
    },
    { 
      name: 'Phoocl Fresh - Instagram Campaign', 
      brand: 'Phoocl',
      impressions: '3,300,000', 
      platform: 'Instagram', 
      spend: '₹6.2L', 
      revenue: '₹0.38Cr', 
      roas: '6.1x', 
      conversions: '1,720',
      status: 'ACTIVE'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Powered By Banner */}
        <div className="mb-6 text-center">
          <p className="text-slate-500 text-sm">Powered by Zepto Retail Media Network</p>
        </div>

        {/* Revenue Metrics */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <DollarSign className="text-green-400" size={24} />
            Revenue Breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {revenueMetrics.map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <div key={idx} className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-lg ${metric.color.replace('text', 'bg').replace('400', '500/20')} flex items-center justify-center`}>
                      <Icon className={metric.color} size={24} />
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm mb-1">{metric.label}</p>
                  <p className="text-3xl font-bold text-white mb-1">{metric.value}</p>
                  <p className="text-sm text-slate-500">{metric.subtext}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {performanceMetrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div key={idx} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="text-blue-400" size={20} />
                  <p className="text-slate-400 text-sm">{metric.label}</p>
                </div>
                <p className="text-2xl font-bold text-white mb-1">{metric.value}</p>
                <p className="text-sm text-green-400">{metric.subtext}</p>
              </div>
            );
          })}
        </div>

        {/* Intelligence Modules */}
        <div className="mb-8 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="text-purple-400" size={20} />
                <h3 className="text-lg font-bold text-white">Intent Intelligence</h3>
              </div>
              <p className="text-slate-400 text-sm">
                Track high-intent users, behavioral patterns, and predictive analytics across all brands
              </p>
            </div>
            <button 
              onClick={() => navigate('/intent')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Target size={18} />
              View Intent Data
            </button>
          </div>
        </div>

        {/* All Brands Performance */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Users className="text-blue-400" size={24} />
            All Brands Performance
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Brand</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Ad Spend</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Revenue</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">ROAS</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Campaigns</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {brandsData.map((brand, idx) => (
                  <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td className="py-4 px-4">
                      <span className="text-white font-medium">{brand.name}</span>
                    </td>
                    <td className="py-4 px-4 text-slate-300">{brand.spend}</td>
                    <td className="py-4 px-4 text-green-400 font-medium">{brand.revenue}</td>
                    <td className="py-4 px-4 text-orange-400 font-bold">{brand.roas}</td>
                    <td className="py-4 px-4 text-slate-300">{brand.campaigns}</td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                        {brand.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Performing Campaigns */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="text-orange-400" size={24} />
              Top Performing Campaigns
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Campaign</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Brand</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Platform</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Spend</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Revenue</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">ROAS</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Conversions</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {topCampaigns.map((campaign, idx) => (
                  <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-white font-medium">{campaign.name}</p>
                        <p className="text-slate-500 text-xs mt-1">{campaign.impressions} impressions</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                        {campaign.brand}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-300">{campaign.platform}</td>
                    <td className="py-4 px-4 text-slate-300">{campaign.spend}</td>
                    <td className="py-4 px-4 text-green-400 font-medium">{campaign.revenue}</td>
                    <td className="py-4 px-4 text-orange-400 font-bold">{campaign.roas}</td>
                    <td className="py-4 px-4 text-slate-300">{campaign.conversions}</td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                        {campaign.status}
                      </span>
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
