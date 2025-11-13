import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, ShoppingCart, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/customers/stats');
      const data = await res.json();
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-white">Loading...</div>;
  if (!stats) return <div className="p-8 text-red-400">Failed to load data</div>;

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6">
          <Users className="text-blue-400 mb-3" size={24} />
          <p className="text-gray-400 text-sm">Total Customers</p>
          <p className="text-3xl font-bold text-white">{stats.total_customers?.toLocaleString()}</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <DollarSign className="text-green-400 mb-3" size={24} />
          <p className="text-gray-400 text-sm">Total Revenue</p>
          <p className="text-3xl font-bold text-white">₹{(stats.total_revenue / 10000000).toFixed(2)}Cr</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <ShoppingCart className="text-purple-400 mb-3" size={24} />
          <p className="text-gray-400 text-sm">Avg Order Value</p>
          <p className="text-3xl font-bold text-white">₹{stats.avg_order_value?.toFixed(0)}</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <TrendingUp className="text-orange-400 mb-3" size={24} />
          <p className="text-gray-400 text-sm">Platforms</p>
          <p className="text-3xl font-bold text-white">{stats.platforms?.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Top Cities</h2>
          <div className="space-y-3">
            {stats.cities?.map((city, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-gray-300">{city.primary_city}</span>
                <span className="text-white font-semibold">{city.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Age Groups</h2>
          <div className="space-y-3">
            {stats.age_groups?.map((age, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-gray-300">{age.primary_age_group}</span>
                <span className="text-white font-semibold">{age.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
