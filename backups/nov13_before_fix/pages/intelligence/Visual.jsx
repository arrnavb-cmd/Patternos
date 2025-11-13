import React, { useState, useEffect } from 'react';

const VisualIntelligence = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Fetching data...');
    fetch('/intelligence_dashboards.json')
      .then(res => {
        console.log('Response:', res);
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(json => {
        console.log('Data loaded:', json);
        setData(json.visual);
      })
      .catch(err => {
        console.error('Error loading data:', err);
        setError(err.message);
      });
  }, []);

  if (error) {
    return (
      <div className="p-8 bg-gray-900 min-h-screen">
        <div className="text-red-400 text-xl">Error: {error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 bg-gray-900 min-h-screen">
        <div className="text-white text-xl">Loading Visual Intelligence...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-white mb-8">
        Visual Intelligence - Real Indian Brands
      </h1>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="text-gray-400 text-sm mb-2">Total Images</div>
          <div className="text-3xl font-bold text-white">{data.total_images?.toLocaleString()}</div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="text-gray-400 text-sm mb-2">Customers</div>
          <div className="text-3xl font-bold text-white">{data.unique_customers?.toLocaleString()}</div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="text-gray-400 text-sm mb-2">Customer Photos</div>
          <div className="text-3xl font-bold text-white">{data.customer_images?.toLocaleString()}</div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="text-gray-400 text-sm mb-2">Store Images</div>
          <div className="text-3xl font-bold text-white">{data.store_images?.toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Top Brands Detected</h2>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(data.top_brands || {}).map(([brand, count]) => (
            <div key={brand} className="bg-gray-700 p-4 rounded text-center">
              <div className="text-white font-bold text-lg">{brand}</div>
              <div className="text-gray-400 text-sm">{count.toLocaleString()} images</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold text-white mb-4">Categories</h2>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(data.categories || {}).map(([cat, count]) => (
            <div key={cat} className="bg-gray-700 p-4 rounded text-center">
              <div className="text-white font-bold">{cat}</div>
              <div className="text-gray-400 text-sm">{count.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VisualIntelligence;
