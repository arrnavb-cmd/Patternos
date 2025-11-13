import { useState } from 'react';
import { Users, Plus, Download, Upload, RefreshCw, CheckCircle, Clock, Settings } from 'lucide-react';

export default function Audiences() {
  const [syncing, setSyncing] = useState(false);

  const audiences = [
    {
      id: 1,
      name: 'High-Intent Shoppers',
      description: 'Users who viewed 3+ products in last 7 days',
      size: 45000,
      growth: '+12%',
      synced: true,
      lastSync: '2 hours ago',
      platforms: ['facebook', 'instagram'],
      performance: { reach: 38000, clicks: 2850, conversions: 456 }
    },
    {
      id: 2,
      name: 'Cart Abandoners',
      description: 'Added to cart but didn\'t purchase (24h)',
      size: 12000,
      growth: '+8%',
      synced: true,
      lastSync: '4 hours ago',
      platforms: ['facebook', 'instagram'],
      performance: { reach: 9800, clicks: 1470, conversions: 294 }
    },
    {
      id: 3,
      name: 'VIP Customers',
      description: 'Spent ₹50K+ in last 6 months',
      size: 8500,
      growth: '+5%',
      synced: true,
      lastSync: '1 hour ago',
      platforms: ['facebook', 'instagram'],
      performance: { reach: 7200, clicks: 1080, conversions: 648 }
    },
    {
      id: 4,
      name: 'Nike Enthusiasts',
      description: 'Purchased Nike products 3+ times',
      size: 18500,
      growth: '+15%',
      synced: true,
      lastSync: '3 hours ago',
      platforms: ['facebook'],
      performance: { reach: 15200, clicks: 2280, conversions: 570 }
    },
    {
      id: 5,
      name: 'New Visitors',
      description: 'First visit in last 7 days',
      size: 125000,
      growth: '+42%',
      synced: false,
      lastSync: 'Never',
      platforms: [],
      performance: { reach: 0, clicks: 0, conversions: 0 }
    }
  ];

  const handleSync = (audienceId) => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      alert('Audience synced successfully!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Audience Management</h1>
          <p className="text-gray-400">Sync Zepto audiences to Facebook & Instagram for targeted campaigns</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <Users className="text-blue-400 mb-3" size={24} />
            <p className="text-gray-400 text-sm">Total Audiences</p>
            <p className="text-3xl font-bold text-white mt-1">{audiences.length}</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <CheckCircle className="text-green-400 mb-3" size={24} />
            <p className="text-gray-400 text-sm">Synced</p>
            <p className="text-3xl font-bold text-white mt-1">{audiences.filter(a => a.synced).length}</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <Users className="text-purple-400 mb-3" size={24} />
            <p className="text-gray-400 text-sm">Total Reach</p>
            <p className="text-3xl font-bold text-white mt-1">209K</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <Clock className="text-yellow-400 mb-3" size={24} />
            <p className="text-gray-400 text-sm">Last Sync</p>
            <p className="text-3xl font-bold text-white mt-1">1h ago</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-8">
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors">
            <Plus size={20} />
            Create New Audience
          </button>
          <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2 transition-colors">
            <Upload size={20} />
            Import Audience
          </button>
          <button 
            onClick={() => handleSync('all')}
            disabled={syncing}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={syncing ? 'animate-spin' : ''} size={20} />
            Sync All
          </button>
        </div>

        {/* Audiences List */}
        <div className="space-y-4">
          {audiences.map((audience) => (
            <div key={audience.id} className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <Users className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{audience.name}</h3>
                    <p className="text-sm text-gray-400">{audience.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {audience.synced ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="text-green-400" size={20} />
                      <span className="text-sm text-gray-400">{audience.lastSync}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-yellow-400">Not synced</span>
                  )}
                  <button
                    onClick={() => handleSync(audience.id)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                  >
                    {audience.synced ? 'Re-sync' : 'Sync Now'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Audience Size</p>
                  <p className="text-white font-bold text-lg">{audience.size.toLocaleString()}</p>
                  <p className="text-green-400 text-xs">{audience.growth} this week</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Ad Reach</p>
                  <p className="text-white font-bold text-lg">{audience.performance.reach.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Clicks</p>
                  <p className="text-white font-bold text-lg">{audience.performance.clicks.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Conversions</p>
                  <p className="text-green-400 font-bold text-lg">{audience.performance.conversions.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Synced To</p>
                  <div className="flex gap-2">
                    {audience.platforms.map((platform, idx) => (
                      <span key={idx} className={`px-2 py-1 rounded text-xs font-medium ${
                        platform === 'facebook' ? 'bg-blue-500/20 text-blue-400' : 'bg-pink-500/20 text-pink-400'
                      }`}>
                        {platform}
                      </span>
                    ))}
                    {audience.platforms.length === 0 && (
                      <span className="text-gray-500 text-xs">None</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                  <Settings size={14} />
                  Edit Rules
                </button>
                <button className="text-gray-400 hover:text-gray-300 text-sm flex items-center gap-1">
                  <Download size={14} />
                  Export
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
