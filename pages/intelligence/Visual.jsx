import { useState } from 'react';
import { Eye, Camera, Image, Scan, MapPin, TrendingUp, AlertCircle } from 'lucide-react';

export default function VisualIntelligence() {
  const shelfAnalytics = [
    { 
      location: 'Mumbai - Bandra Store', 
      products: 45, 
      visibility: 89, 
      share: 32, 
      sales: 280000,
      compliance: 92,
      outOfStock: 3,
      competitor: 'Adidas: 28%'
    },
    { 
      location: 'Delhi - Connaught Place', 
      products: 52, 
      visibility: 92, 
      share: 38, 
      sales: 350000,
      compliance: 96,
      outOfStock: 1,
      competitor: 'Puma: 24%'
    },
    { 
      location: 'Bangalore - Koramangala', 
      products: 48, 
      visibility: 87, 
      share: 35, 
      sales: 310000,
      compliance: 88,
      outOfStock: 5,
      competitor: 'Adidas: 30%'
    },
    { 
      location: 'Pune - Viman Nagar', 
      products: 40, 
      visibility: 85, 
      share: 30, 
      sales: 245000,
      compliance: 91,
      outOfStock: 2,
      competitor: 'Reebok: 26%'
    }
  ];

  const productRecognition = [
    { product: 'Nike Air Max 270', detected: 1250, accuracy: 98.5, engagement: 'High', clicks: 892 },
    { product: 'Jordan 1 Retro', detected: 980, accuracy: 97.2, engagement: 'High', clicks: 756 },
    { product: 'Nike Dri-FIT', detected: 850, accuracy: 99.1, engagement: 'Medium', clicks: 512 },
    { product: 'Nike Pro Leggings', detected: 720, accuracy: 96.8, engagement: 'High', clicks: 648 }
  ];

  const visualSearchData = [
    { query: 'Similar shoes uploaded', count: 5420, conversions: 1084, cvr: 20 },
    { query: 'Product image search', count: 4890, conversions: 782, cvr: 16 },
    { query: 'Style match request', count: 3650, conversions: 730, cvr: 20 },
    { query: 'Color variant search', count: 2980, conversions: 536, cvr: 18 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
              <Eye className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Visual Intelligence</h1>
              <p className="text-gray-400">Computer vision for shelf analytics & visual product search</p>
            </div>
          </div>
          <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4">
            <p className="text-pink-300 text-sm">
              🔒 <strong>User-Initiated Only:</strong> Visual search when users voluntarily upload images to find products. In-store cameras for shelf compliance only.
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <Camera className="text-pink-400 mb-3" size={24} />
            <p className="text-gray-400 text-sm">Products Tracked</p>
            <p className="text-3xl font-bold text-white mt-1">185</p>
            <p className="text-pink-400 text-sm mt-2">Across 124 stores</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <Scan className="text-purple-400 mb-3" size={24} />
            <p className="text-gray-400 text-sm">Avg Shelf Share</p>
            <p className="text-3xl font-bold text-white mt-1">34.2%</p>
            <p className="text-green-400 text-sm mt-2">+2.8% vs last month</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <Image className="text-blue-400 mb-3" size={24} />
            <p className="text-gray-400 text-sm">Visual Searches</p>
            <p className="text-3xl font-bold text-white mt-1">16.9K</p>
            <p className="text-blue-400 text-sm mt-2">User-uploaded images</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <Eye className="text-green-400" mb-3" size={24} />
            <p className="text-gray-400 text-sm">Recognition Accuracy</p>
            <p className="text-3xl font-bold text-white mt-1">97.9%</p>
            <p className="text-green-400 text-sm mt-2">AI confidence score</p>
          </div>
        </div>

        {/* In-Store Shelf Analytics */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-2">In-Store Shelf Analytics</h2>
          <p className="text-gray-400 text-sm mb-6">Computer vision monitoring of physical retail placement & compliance</p>
          <div className="space-y-4">
            {shelfAnalytics.map((shelf, idx) => (
              <div key={idx} className="bg-gray-700 rounded-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="text-pink-400" size={20} />
                    <div>
                      <h3 className="font-bold text-white text-lg">{shelf.location}</h3>
                      <p className="text-sm text-gray-400">{shelf.products} SKUs monitored</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-xl">₹{(shelf.sales / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-gray-400">Monthly sales</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Visibility</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-600 rounded-full h-1.5">
                        <div 
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: `${shelf.visibility}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-blue-400">{shelf.visibility}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Share of Shelf</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-600 rounded-full h-1.5">
                        <div 
                          className="bg-purple-500 h-1.5 rounded-full"
                          style={{ width: `${shelf.share}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-purple-400">{shelf.share}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Planogram Compliance</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-600 rounded-full h-1.5">
                        <div 
                          className="bg-green-500 h-1.5 rounded-full"
                          style={{ width: `${shelf.compliance}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-green-400">{shelf.compliance}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Out of Stock</p>
                    <div className="flex items-center gap-2">
                      <AlertCircle className={shelf.outOfStock > 3 ? 'text-red-400' : 'text-yellow-400'} size={14} />
                      <span className={`text-sm font-bold ${shelf.outOfStock > 3 ? 'text-red-400' : 'text-yellow-400'}`}>
                        {shelf.outOfStock} items
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-600">
                  <p className="text-xs text-gray-400">Top Competitor: <span className="text-white font-medium">{shelf.competitor}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Product Search */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">User Visual Search</h2>
            <p className="text-gray-400 text-sm mb-6">"Upload image to find similar products" feature performance</p>
            <div className="space-y-4">
              {visualSearchData.map((item, idx) => (
                <div key={idx} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-medium">{item.query}</h3>
                    <span className="text-green-400 font-bold">{item.cvr}% CVR</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{item.count.toLocaleString()} searches</span>
                    <span className="text-white font-medium">{item.conversions.toLocaleString()} conversions</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Product Recognition Performance</h2>
            <div className="space-y-4">
              {productRecognition.map((product, idx) => (
                <div key={idx} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-medium">{product.product}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.engagement === 'High' ? 'bg-green-500/20 text-green-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {product.engagement}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs">Detections</p>
                      <p className="text-white font-bold">{product.detected}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Accuracy</p>
                      <p className="text-green-400 font-bold">{product.accuracy}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Clicks</p>
                      <p className="text-blue-400 font-bold">{product.clicks}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actionable Insights */}
        <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">🎯 Visual Intelligence Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white font-medium mb-2">Visibility Opportunity</p>
              <p className="text-2xl font-bold text-white">Pune Store</p>
              <p className="text-pink-100 text-sm">85% visibility - improve placement</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white font-medium mb-2">Visual Search Win</p>
              <p className="text-2xl font-bold text-white">20% CVR</p>
              <p className="text-pink-100 text-sm">Promote "Find Similar" feature</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white font-medium mb-2">Stock Alert</p>
              <p className="text-2xl font-bold text-white">5 Items</p>
              <p className="text-pink-100 text-sm">Out of stock in Bangalore</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
