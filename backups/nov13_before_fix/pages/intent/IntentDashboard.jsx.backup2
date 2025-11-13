import React, { useEffect, useState } from "react";
import { Users, TrendingUp, DollarSign, Activity, Filter, Package, Tag } from "lucide-react";

const BACKEND = import.meta.env.VITE_BACKEND_URL ?? "";

// Enhanced dummy data with product categories and prices (in Rupees)
const DUMMY_DATA = [
  { user_id: "user_001", events: 45, estimated_spend_inr: 98000, category: "Electronics", avg_product_price: 74000, interested_products: "Smartphones, Laptops" },
  { user_id: "user_002", events: 38, estimated_spend_inr: 80500, category: "Fashion", avg_product_price: 20000, interested_products: "Sneakers, Jackets" },
  { user_id: "user_003", events: 32, estimated_spend_inr: 62000, category: "Groceries", avg_product_price: 7000, interested_products: "Organic Foods, Snacks" },
  { user_id: "user_004", events: 28, estimated_spend_inr: 53500, category: "Beauty", avg_product_price: 9800, interested_products: "Skincare, Makeup" },
  { user_id: "user_005", events: 25, estimated_spend_inr: 44500, category: "Home & Kitchen", avg_product_price: 14800, interested_products: "Cookware, Appliances" },
  { user_id: "user_006", events: 42, estimated_spend_inr: 90500, category: "Electronics", avg_product_price: 98500, interested_products: "Tablets, Headphones" },
  { user_id: "user_007", events: 35, estimated_spend_inr: 73200, category: "Sports", avg_product_price: 28800, interested_products: "Gym Equipment, Shoes" },
  { user_id: "user_008", events: 29, estimated_spend_inr: 59200, category: "Books", avg_product_price: 3700, interested_products: "Novels, Educational" },
  { user_id: "user_009", events: 22, estimated_spend_inr: 39500, category: "Toys", avg_product_price: 5300, interested_products: "Educational Toys, Games" },
  { user_id: "user_010", events: 48, estimated_spend_inr: 111000, category: "Fashion", avg_product_price: 37000, interested_products: "Designer Clothes" },
  { user_id: "user_011", events: 31, estimated_spend_inr: 67500, category: "Groceries", avg_product_price: 7800, interested_products: "Premium Groceries" },
  { user_id: "user_012", events: 26, estimated_spend_inr: 48500, category: "Electronics", avg_product_price: 55900, interested_products: "Smart Watches" },
];

const CATEGORIES = ["All", "Electronics", "Fashion", "Groceries", "Beauty", "Home & Kitchen", "Sports", "Books", "Toys"];

export default function HighIntentUsers() {
  const [highIntentUsers, setHighIntentUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingDummyData, setUsingDummyData] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minProductPrice, setMinProductPrice] = useState(0);
  const [maxProductPrice, setMaxProductPrice] = useState(1000000);

  useEffect(() => {
    loadHighIntentUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [highIntentUsers, selectedCategory, minProductPrice, maxProductPrice]);

  async function loadHighIntentUsers() {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND}/api/intent/audience?min_events=20&limit=100`);
      
      if (!response.ok) {
        setHighIntentUsers(DUMMY_DATA);
        setUsingDummyData(true);
        setLoading(false);
        return;
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        setHighIntentUsers(DUMMY_DATA);
        setUsingDummyData(true);
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      const users = data.users || data.audience || data.results || data || [];
      setHighIntentUsers(Array.isArray(users) ? users : DUMMY_DATA);
      setUsingDummyData(false);
    } catch (err) {
      setHighIntentUsers(DUMMY_DATA);
      setUsingDummyData(true);
    } finally {
      setLoading(false);
    }
  }

  function filterUsers() {
    let filtered = [...highIntentUsers];
    
    if (selectedCategory !== "All") {
      filtered = filtered.filter(u => u.category === selectedCategory);
    }
    
    filtered = filtered.filter(u => {
      const price = Number(u?.avg_product_price || 0);
      return price >= minProductPrice && price <= maxProductPrice;
    });
    
    setFilteredUsers(filtered);
  }

  const total = filteredUsers.length;
  const readyToPurchase = filteredUsers.filter(u => Number(u?.events || 0) >= 30).length;
  const avgIntent = total > 0 
    ? String((filteredUsers.reduce((sum, u) => sum + Number(u?.events || 0), 0) / total).toFixed(1))
    : "0.0";
  const totalRevenue = String(filteredUsers.reduce((sum, u) => sum + Number(u?.estimated_spend_inr || 0), 0).toFixed(2));
  const avgProductPrice = total > 0
    ? String((filteredUsers.reduce((sum, u) => sum + Number(u?.avg_product_price || 0), 0) / total).toFixed(2))
    : "0.00";

  // Calculate suggested ad spend (10-15% of product price)
  const suggestedMinBid = (parseFloat(avgProductPrice) * 0.10).toFixed(2);
  const suggestedMaxBid = (parseFloat(avgProductPrice) * 0.15).toFixed(2);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-16 h-16 text-blue-400 animate-pulse mx-auto mb-4" />
          <p className="text-slate-300 text-lg">Loading high intent users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {usingDummyData && (
          <div className="mb-6 bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
            <p className="text-yellow-300 text-sm">
              ⚠️ Using demo data - Backend /audience endpoint not available
            </p>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white flex items-center gap-3 mb-2">
            <TrendingUp className="w-10 h-10 text-blue-400" />
            High Intent Users
          </h1>
          <p className="text-slate-400 text-lg">
            Users showing strong purchase signals (20+ behavioral events)
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-blue-400" />
            <h3 className="text-xl font-semibold text-white">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Product Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Min Price Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Min Product Price (₹)
              </label>
              <input
                type="number"
                value={minProductPrice}
                onChange={(e) => setMinProductPrice(Number(e.target.value))}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                min="0"
              />
            </div>

            {/* Max Price Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Max Product Price (₹)
              </label>
              <input
                type="number"
                value={maxProductPrice}
                onChange={(e) => setMaxProductPrice(Number(e.target.value))}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                min="0"
              />
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedCategory("All");
              setMinProductPrice(0);
              setMaxProductPrice(1000000);
            }}
            className="mt-4 text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2"
          >
            Clear Filters
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <StatCard icon={<Users className="w-8 h-8" />} label="Filtered Users" value={total.toLocaleString()} color="blue" />
          <StatCard icon={<TrendingUp className="w-8 h-8" />} label="Ready to Purchase" value={readyToPurchase.toLocaleString()} color="green" />
          <StatCard icon={<Activity className="w-8 h-8" />} label="Avg Intent Score" value={avgIntent} color="purple" />
          <StatCard icon={<Tag className="w-8 h-8" />} label="Avg Product Price" value={`₹${avgProductPrice}`} color="orange" />
          <StatCard icon={<DollarSign className="w-8 h-8" />} label="Total Revenue Potential" value={`₹${totalRevenue}`} color="emerald" />
        </div>

        {/* Auction Bid Suggestion */}
        <div className="mb-8 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-700 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Package className="w-6 h-6 text-purple-400" />
                Suggested Ad Auction Bid
              </h3>
              <p className="text-slate-300 text-sm mb-4">
                Based on average product price of <span className="font-bold text-white">₹{avgProductPrice}</span>
              </p>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-slate-400 text-xs mb-1">Minimum Bid (10%)</p>
                  <p className="text-2xl font-bold text-green-400">₹{suggestedMinBid}</p>
                </div>
                <div className="text-slate-600">→</div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Maximum Bid (15%)</p>
                  <p className="text-2xl font-bold text-blue-400">₹{suggestedMaxBid}</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-400 text-xs mb-2">Auction Formula</p>
              <p className="text-white text-sm font-mono">Bid = Product Price × (10-15)%</p>
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">User Details</h2>
              <p className="text-slate-400 text-sm mt-1">{total} users matching filters</p>
            </div>
            <button onClick={loadHighIntentUsers} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Refresh
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">#</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">User ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Products</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Avg Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Suggested Bid</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Events</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Intent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <Filter className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400">No users match the selected filters</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, idx) => {
                    const userId = user?.user_id || `user_${idx}`;
                    const events = Number(user?.events || 0);
                    const productPrice = Number(user?.avg_product_price || 0);
                    const suggestedBid = (productPrice * 0.125).toFixed(2);
                    
                    return (
                      <tr key={idx} className="hover:bg-slate-700/30 transition">
                        <td className="px-6 py-4 text-sm text-slate-500">{idx + 1}</td>
                        <td className="px-6 py-4 text-sm text-slate-300 font-mono">{userId}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-700">
                            {user?.category || "General"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400 max-w-xs truncate">
                          {user?.interested_products || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-emerald-400">
                          ₹{productPrice.toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-purple-400">
                          ₹{parseFloat(suggestedBid).toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-400">
                            <Activity className="w-4 h-4" />
                            {events}
                          </span>
                        </td>
                        <td className="px-6 py-4">{getIntentBadge(events)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const colorClasses = {
    blue: "bg-blue-900/30 border-blue-700 text-blue-400",
    green: "bg-green-900/30 border-green-700 text-green-400",
    purple: "bg-purple-900/30 border-purple-700 text-purple-400",
    orange: "bg-orange-900/30 border-orange-700 text-orange-400",
    emerald: "bg-emerald-900/30 border-emerald-700 text-emerald-400"
  };
  return (
    <div className={`${colorClasses[color]} border rounded-xl p-6`}>
      <div className="mb-3">{icon}</div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}

function getIntentBadge(events) {
  if (events >= 40) return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-900/50 text-red-300 border border-red-700">🔥 Very High</span>;
  if (events >= 30) return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-900/50 text-orange-300 border border-orange-700">⚡ High</span>;
  if (events >= 20) return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-900/50 text-yellow-300 border border-yellow-700">⭐ Medium</span>;
  return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-900/50 text-gray-300 border border-gray-700">Low</span>;
}
