import React from 'react';

export default function SuperEgoSection({ superEgoData, premiumReadyCustomers }) {
  if (!superEgoData) {
    return (
      <div className="mt-8 bg-purple-900/20 border border-purple-700 rounded-xl p-8">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading Super-Ego Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-2 border-purple-500 rounded-xl p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            🧠 Super-Ego Intelligence
          </h2>
          <p className="text-purple-200">
            Customer Identity & Values - World's First Freudian Layer
          </p>
        </div>
        <div className="px-4 py-2 bg-purple-600 rounded-lg">
          <span className="text-white font-semibold">Layer 3: Super-Ego</span>
        </div>
      </div>

      {/* Three Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Identity Distribution */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-purple-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            Identity Distribution
          </h3>
          <div className="space-y-3">
            {superEgoData.identity_distribution?.map((identity, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      identity.identity === 'aspirational'
                        ? 'bg-purple-500'
                        : identity.identity === 'health'
                        ? 'bg-green-500'
                        : identity.identity === 'eco'
                        ? 'bg-blue-500'
                        : 'bg-gray-500'
                    }`}
                  ></div>
                  <span className="text-gray-300 capitalize">
                    {identity.identity}
                  </span>
                </div>
                <span className="text-white font-bold">
                  {identity.customer_count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Readiness */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-purple-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            Premium Readiness
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm">Average Readiness</p>
              <p className="text-3xl font-bold text-purple-400">
                {superEgoData.overall_stats?.avg_premium_readiness}%
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-xs text-gray-400">High Ready</p>
                <p className="text-xl font-bold text-green-400">
                  {superEgoData.overall_stats?.high_premium_ready || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Medium Ready</p>
                <p className="text-xl font-bold text-yellow-400">
                  {superEgoData.overall_stats?.medium_premium_ready || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Opportunity */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-purple-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            Revenue Opportunity
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm">Current AOV</p>
              <p className="text-2xl font-bold text-white">
                ₹{superEgoData.overall_stats?.avg_aov?.toFixed(0)}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Potential AOV</p>
              <p className="text-2xl font-bold text-green-400">
                ₹{superEgoData.overall_stats?.avg_potential_aov?.toFixed(0)}
              </p>
            </div>
            <div className="pt-3 border-t border-gray-700">
              <p className="text-xs text-gray-400">Total Opportunity</p>
              <p className="text-xl font-bold text-purple-400">
                ₹
                {(
                  (superEgoData.overall_stats?.potential_revenue_increase || 0) /
                  1000
                ).toFixed(1)}
                K
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Premium-Ready Customers */}
      {premiumReadyCustomers && premiumReadyCustomers.length > 0 && (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-purple-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            💎 Premium-Ready Customers ({premiumReadyCustomers.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900 border-b border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                    Identity
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">
                    Readiness
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">
                    Current AOV
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">
                    Potential
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">
                    Uplift
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                    Recommended
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {premiumReadyCustomers.map((customer, idx) => (
                  <tr key={idx} className="hover:bg-gray-700/30">
                    <td className="px-4 py-3 text-sm text-white">
                      {customer.customer_id}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-purple-900/50 text-purple-300 rounded text-xs capitalize">
                        {customer.primary_identity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-bold text-purple-400">
                        {customer.premium_readiness_score?.toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-white">
                      ₹{customer.current_aov?.toFixed(0)}
                    </td>
                    <td className="px-4 py-3 text-right text-green-400 font-semibold">
                      ₹{customer.potential_aov?.toFixed(0)}
                    </td>
                    <td className="px-4 py-3 text-right text-purple-400 font-bold">
                      +{customer.uplift_percentage?.toFixed(0)}%
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {customer.recommended_categories?.slice(0, 2).map((cat, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded text-xs">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Three-Layer Visualization */}
      <div className="mt-6 bg-gray-800/50 rounded-xl p-6 border border-purple-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          Freudian Intelligence Layers
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
            <div className="text-red-400 font-bold mb-2">
              Layer 1: ID (Impulse)
            </div>
            <p className="text-xs text-gray-300">
              Quick purchases, immediate needs
            </p>
          </div>
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
            <div className="text-blue-400 font-bold mb-2">
              Layer 2: EGO (Intent)
            </div>
            <p className="text-xs text-gray-300">Rational search, preferences</p>
          </div>
          <div className="bg-purple-900/20 border-2 border-purple-500 rounded-lg p-4">
            <div className="text-purple-400 font-bold mb-2">
              Layer 3: SUPER-EGO (Values)
            </div>
            <p className="text-xs text-gray-300">
              Identity, aspirations, premium readiness
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
