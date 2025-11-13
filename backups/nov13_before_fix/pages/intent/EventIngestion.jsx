import React from "react";
import { useState } from 'react';
import { Activity, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function EventIngestion() {
  const [event, setEvent] = useState({
    userId: '',
    eventType: 'search',
    category: 'footwear',
    productId: '',
    searchQuery: '',
    location: 'mumbai'
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const eventTypes = ['search', 'product_view', 'cart_add', 'wishlist_add', 'purchase'];
  const categories = ['footwear', 'apparel', 'groceries', 'electronics', 'beauty', 'sports'];
  const locations = ['mumbai', 'bangalore', 'delhi', 'hyderabad', 'chennai', 'pune'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('https://patternos-production.up.railway.app/api/v1/intent/ingest?clientId=zepto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });

      const data = await response.json();
      
      if (response.ok) {
        setStatus({ type: 'success', message: `Event ingested successfully! ID: ${data.eventId}` });
        // Don't reset form so user can quickly add more events
      } else {
        setStatus({ type: 'error', message: 'Failed to ingest event' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Network error. Check if backend is running.' });
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (preset) => {
    const presets = {
      search: {
        userId: 'demo_user_001',
        eventType: 'search',
        category: 'footwear',
        searchQuery: 'running shoes',
        productId: '',
        location: 'mumbai'
      },
      view: {
        userId: 'demo_user_001',
        eventType: 'product_view',
        category: 'footwear',
        productId: 'nike_air_max_270',
        searchQuery: '',
        location: 'mumbai'
      },
      cart: {
        userId: 'demo_user_001',
        eventType: 'cart_add',
        category: 'footwear',
        productId: 'nike_air_max_270',
        searchQuery: '',
        location: 'mumbai'
      }
    };
    setEvent(presets[preset]);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Event Ingestion</h1>
          <p className="text-gray-400">Simulate user behavior events for intent tracking</p>
        </div>

        {/* Quick Fill Buttons */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">Quick Fill</h2>
          <div className="flex gap-4">
            <button
              onClick={() => quickFill('search')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Search Event
            </button>
            <button
              onClick={() => quickFill('view')}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Product View
            </button>
            <button
              onClick={() => quickFill('cart')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Cart Add
            </button>
          </div>
        </div>

        {/* Status Message */}
        {status.message && (
          <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${
            status.type === 'success' 
              ? 'bg-green-500/10 border-green-500 text-green-400' 
              : 'bg-red-500/10 border-red-500 text-red-400'
          }`}>
            {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>{status.message}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">User ID *</label>
              <input
                type="text"
                value={event.userId}
                onChange={(e) => setEvent({...event, userId: e.target.value})}
                placeholder="demo_user_001"
                className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Event Type *</label>
              <select
                value={event.eventType}
                onChange={(e) => setEvent({...event, eventType: e.target.value})}
                className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {eventTypes.map(type => (
                  <option key={type} value={type}>{type.replace('_', ' ').toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Category *</label>
              <select
                value={event.category}
                onChange={(e) => setEvent({...event, category: e.target.value})}
                className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Location</label>
              <select
                value={event.location}
                onChange={(e) => setEvent({...event, location: e.target.value})}
                className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc.charAt(0).toUpperCase() + loc.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Product ID</label>
              <input
                type="text"
                value={event.productId}
                onChange={(e) => setEvent({...event, productId: e.target.value})}
                placeholder="nike_air_max_270"
                className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Search Query</label>
              <input
                type="text"
                value={event.searchQuery}
                onChange={(e) => setEvent({...event, searchQuery: e.target.value})}
                placeholder="running shoes"
                className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Activity className="animate-spin" size={20} />
                Ingesting...
              </>
            ) : (
              <>
                <Send size={20} />
                Ingest Event
              </>
            )}
          </button>
        </form>

        {/* Info Box */}
        <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
          <h3 className="text-white font-bold mb-2">💡 How it works:</h3>
          <ul className="text-sm text-gray-400 space-y-2">
            <li>• Events are processed in real-time to calculate intent scores</li>
            <li>• Use the same User ID for multiple events to build intent history</li>
            <li>• Minimum 2 events required to generate an intent score</li>
            <li>• Check "High Intent Users" to see scored users</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
