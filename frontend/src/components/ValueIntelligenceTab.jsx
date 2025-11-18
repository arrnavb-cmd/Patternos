import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Target, Sparkles } from 'lucide-react';

export default function ValueIntelligenceTab({ onTargetingChange }) {
  const [identityFilter, setIdentityFilter] = useState('all');
  const [premiumLevel, setPremiumLevel] = useState('all'); // high, medium, low, all
  const [valueData, setValueData] = useState(null);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchValueIntelligenceData();
  }, []);

  const fetchValueIntelligenceData = async () => {
    try {
      const [distRes, premiumRes] = await Promise.all([
        fetch('http://localhost:8000/api/v1/superego/distribution'),
        fetch('http://localhost:8000/api/v1/superego/premium-ready?min_score=0')
      ]);

      const distData = await distRes.json();
      const premiumData = await premiumRes.json();

      setValueData({
        distribution: distData,
        customers: premiumData.premium_ready_customers || []
      });
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch Value Intelligence data:', error);
      setLoading(false);
    }
  };

  const getFilteredCustomers = () => {
    if (!valueData) return [];

    let filtered = valueData.customers;

    // Filter by identity
    if (identityFilter !== 'all') {
      filtered = filtered.filter(c => c.primary_identity === identityFilter);
    }

    // Filter by premium level
    if (premiumLevel === 'high') {
      filtered = filtered.filter(c => c.premium_readiness_score >= 70);
    } else if (premiumLevel === 'medium') {
      filtered = filtered.filter(c => c.premium_readiness_score >= 40 && c.premium_readiness_score < 70);
    } else if (premiumLevel === 'low') {
      filtered = filtered.filter(c => c.premium_readiness_score < 40);
    }

    return filtered;
  };

  const filteredCustomers = getFilteredCustomers();

  const handleSelectAll = () => {
    const customerIds = filteredCustomers.map(c => c.customer_id);
    setSelectedCustomers(customerIds);
    onTargetingChange?.({
      type: 'value_intelligence',
      identities: identityFilter !== 'all' ? [identityFilter] : [],
      premiumLevel,
      customerIds,
      estimatedReach: filteredCustomers.length
    });
  };

  const getPremiumLevelColor = (level) => {
    if (level === 'high') return 'text-green-400';
    if (level === 'medium') return 'text-yellow-400';
    return 'text-gray-400';
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
        <p className="text-gray-400 mt-4">Loading Value Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-700 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">Value Intelligence Targeting</h3>
        </div>
        <p className="text-gray-300 text-sm">
          Target customers based on their identity profiles, premium readiness, and value alignment.
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-6">
        {/* Identity Filter */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Customer Identity
          </h4>
          <div className="space-y-2">
            {['all', 'aspirational', 'health', 'eco', 'minimalist', 'parenting', 'fitness'].map(identity => {
              const count = identity === 'all' 
                ? valueData.customers.length 
                : valueData.customers.filter(c => c.primary_identity === identity).length;
              
              return (
                <button
                  key={identity}
                  onClick={() => setIdentityFilter(identity)}
                  className={`w-full px-3 py-2 rounded text-sm text-left flex justify-between items-center ${
                    identityFilter === identity
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <span className="capitalize">{identity}</span>
                  <span className="text-xs">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Premium Level Filter */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Premium Readiness Level
          </h4>
          <div className="space-y-2">
            {[
              { key: 'all', label: 'All Levels', min: 0, max: 100 },
              { key: 'high', label: 'High (70-100%)', min: 70, max: 100 },
              { key: 'medium', label: 'Medium (40-69%)', min: 40, max: 69 },
              { key: 'low', label: 'Low (0-39%)', min: 0, max: 39 }
            ].map(level => {
              const count = valueData.customers.filter(c => 
                c.premium_readiness_score >= level.min && 
                c.premium_readiness_score <= level.max
              ).length;
              
              return (
                <button
                  key={level.key}
                  onClick={() => setPremiumLevel(level.key)}
                  className={`w-full px-3 py-2 rounded text-sm text-left flex justify-between items-center ${
                    premiumLevel === level.key
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <span>{level.label}</span>
                  <span className="text-xs">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-white font-semibold mb-1">Targeting Results</h4>
            <p className="text-sm text-gray-400">
              {filteredCustomers.length} customers match your criteria
            </p>
          </div>
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <Target className="w-4 h-4" />
            Target These Customers
          </button>
        </div>

        {/* Customer Preview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Avg Premium Readiness</div>
            <div className="text-2xl font-bold text-purple-400">
              {filteredCustomers.length > 0
                ? (filteredCustomers.reduce((sum, c) => sum + c.premium_readiness_score, 0) / filteredCustomers.length).toFixed(0)
                : 0}%
            </div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Avg Current AOV</div>
            <div className="text-2xl font-bold text-white">
              ₹{filteredCustomers.length > 0
                ? (filteredCustomers.reduce((sum, c) => sum + c.current_aov, 0) / filteredCustomers.length).toFixed(0)
                : 0}
            </div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Potential Revenue Increase</div>
            <div className="text-2xl font-bold text-green-400">
              ₹{filteredCustomers.reduce((sum, c) => sum + (c.potential_aov - c.current_aov), 0).toFixed(0)}
            </div>
          </div>
        </div>

        {/* Top Customers Preview */}
        {filteredCustomers.length > 0 && (
          <div className="mt-4">
            <h5 className="text-sm font-semibold text-gray-400 mb-2">Top 5 Customers:</h5>
            <div className="space-y-2">
              {filteredCustomers.slice(0, 5).map((customer, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-700/30 p-3 rounded">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-mono text-sm">{customer.customer_id}</span>
                    <span className="px-2 py-1 bg-purple-900/50 text-purple-300 rounded text-xs capitalize">
                      {customer.primary_identity}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`font-semibold ${getPremiumLevelColor(premiumLevel)}`}>
                      {customer.premium_readiness_score.toFixed(0)}%
                    </span>
                    <span className="text-gray-400">
                      ₹{customer.current_aov.toFixed(0)} → ₹{customer.potential_aov.toFixed(0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
