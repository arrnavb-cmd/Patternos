import React from "react";
import { useState } from 'react';
import { Users, Target, Sparkles } from 'lucide-react';

export default function CreateAudience() {
  const [audience, setAudience] = useState({
    name: '',
    description: '',
    category: 'footwear',
    intentScoreMin: 0.7,
    location: ''
  });
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(null);

  const categories = ['footwear', 'apparel', 'groceries', 'electronics', 'beauty', 'sports'];
  const locations = ['mumbai', 'bangalore', 'delhi', 'hyderabad', 'chennai', 'pune', ''];

  const handleEstimate = async () => {
    setLoading(true);
    try {
      // For now, we'll create a mock estimate since we haven't built the backend endpoint
      setEstimate({
        estimatedSize: Math.floor(Math.random() * 50000) + 10000,
        meetsMinimum: true,
        avgIntentScore: (Math.random() * 0.2 + 0.7).toFixed(2)
      });
    } catch (error) {
      console.error('Failed to estimate:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Mock audience creation
      setCreated({
        id: `aud_${Date.now()}`,
        name: audience.name,
        size: estimate?.estimatedSize || 0,
        avgIntentScore: estimate?.avgIntentScore || 0.75
      });
    } catch (error) {
      console.error('Failed to create audience:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickFill = () => {
    setAudience({
      name: 'High Intent - Running Shoes - Mumbai',
      description: 'Users actively searching for running shoes in Mumbai with high purchase intent',
      category: 'footwear',
      intentScoreMin: 0.7,
      location: 'mumbai'
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Audience</h1>
          <p className="text-gray-400">Build targetable audience segments from high-intent users</p>
        </div>

        {created ? (
          /* Success State */
          <div className="bg-gray-800 rounded-xl p-8 border border-green-500/20">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="text-green-400" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Audience Created!</h2>
              <p className="text-gray-400">Your targetable audience is ready</p>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Audience Name</div>
                  <div className="text-white font-medium">{created.name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Audience ID</div>
                  <div className="text-white font-mono text-sm">{created.id}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Audience Size</div>
                  <div className="text-2xl font-bold text-purple-400">{created.size.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Avg Intent Score</div>
                  <div className="text-2xl font-bold text-orange-400">{created.avgIntentScore}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => window.location.href = '/intent/high-intent'}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition-colors"
              >
                View High Intent Users
              </button>
              <button
                onClick={() => {
                  setCreated(null);
                  setEstimate(null);
                  setAudience({
                    name: '',
                    description: '',
                    category: 'footwear',
                    intentScoreMin: 0.7,
                    location: ''
                  });
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors"
              >
                Create Another
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Quick Fill */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">Quick Start</h2>
                  <p className="text-sm text-gray-400">Use a pre-filled example</p>
                </div>
                <button
                  onClick={quickFill}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Fill Example
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleCreate} className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Audience Name *</label>
                <input
                  type="text"
                  value={audience.name}
                  onChange={(e) => setAudience({...audience, name: e.target.value})}
                  placeholder="High Intent - Running Shoes - Mumbai"
                  className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Description</label>
                <textarea
                  value={audience.description}
                  onChange={(e) => setAudience({...audience, description: e.target.value})}
                  placeholder="Users actively searching for running shoes in Mumbai..."
                  className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Category *</label>
                  <select
                    value={audience.category}
                    onChange={(e) => setAudience({...audience, category: e.target.value})}
                    className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Location (Optional)</label>
                  <select
                    value={audience.location}
                    onChange={(e) => setAudience({...audience, location: e.target.value})}
                    className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All Locations</option>
                    {locations.filter(l => l).map(loc => (
                      <option key={loc} value={loc}>{loc.charAt(0).toUpperCase() + loc.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Minimum Intent Score: {audience.intentScoreMin}
                </label>
                <input
                  type="range"
                  min="0.3"
                  max="1.0"
                  step="0.05"
                  value={audience.intentScoreMin}
                  onChange={(e) => setAudience({...audience, intentScoreMin: parseFloat(e.target.value)})}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0.3 (Low)</span>
                  <span>0.7 (High)</span>
                  <span>1.0 (Very High)</span>
                </div>
              </div>

              {/* Estimate */}
              {!estimate ? (
                <button
                  type="button"
                  onClick={handleEstimate}
                  disabled={loading || !audience.name}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Target size={20} />
                  Estimate Audience Size
                </button>
              ) : (
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6">
                  <h3 className="text-white font-bold mb-4">Estimated Audience</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Estimated Size</div>
                      <div className="text-2xl font-bold text-white">{estimate.estimatedSize.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Avg Intent Score</div>
                      <div className="text-2xl font-bold text-purple-400">{estimate.avgIntentScore}</div>
                    </div>
                  </div>
                  {estimate.meetsMinimum ? (
                    <div className="text-sm text-green-400">✓ Meets minimum audience size (1,000 users)</div>
                  ) : (
                    <div className="text-sm text-red-400">✗ Below minimum audience size</div>
                  )}
                </div>
              )}

              {/* Create Button */}
              {estimate && (
                <button
                  type="submit"
                  disabled={loading || !estimate.meetsMinimum}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Users size={20} />
                  Create Audience
                </button>
              )}
            </form>
          </>
        )}

        {/* Info */}
        <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
          <h3 className="text-white font-bold mb-2">💡 How Audiences Work:</h3>
          <ul className="text-sm text-gray-400 space-y-2">
            <li>• Audiences are built from users with high intent scores</li>
            <li>• Minimum 1,000 users required for a valid audience</li>
            <li>• Audiences auto-refresh daily with latest intent data</li>
            <li>• Use audiences to target ads to high-intent users only</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
