import React from "react";
import { useState } from 'react';
import { getCurrentBrand } from '../utils/brandUtils';
import { Package, Plus, Search, Filter, Upload, Download, Edit, Trash2, Eye } from 'lucide-react';

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const products = [
    {
      id: 'SKU001',
      name: 'Nike Air Max 270',
      category: 'Footwear',
      price: 12995,
      stock: 245,
      status: 'active',
      campaigns: 5,
      sales: 890,
      image: '👟'
    },
    {
      id: 'SKU002',
      name: 'Jordan 1 Retro High',
      category: 'Footwear',
      price: 14995,
      stock: 180,
      status: 'active',
      campaigns: 3,
      sales: 650,
      image: '👟'
    },
    {
      id: 'SKU003',
      name: 'Nike Dri-FIT T-Shirt',
      category: 'Apparel',
      price: 1999,
      stock: 520,
      status: 'active',
      campaigns: 4,
      sales: 1240,
      image: '👕'
    },
    {
      id: 'SKU004',
      name: 'Nike Pro Leggings',
      category: 'Apparel',
      price: 2495,
      stock: 380,
      status: 'active',
      campaigns: 3,
      sales: 890,
      image: '👖'
    },
    {
      id: 'SKU005',
      name: 'Nike Brasilia Backpack',
      category: 'Accessories',
      price: 2195,
      stock: 95,
      status: 'low_stock',
      campaigns: 2,
      sales: 340,
      image: '🎒'
    },
    {
      id: 'SKU006',
      name: 'Nike Revolution 6',
      category: 'Footwear',
      price: 4995,
      stock: 0,
      status: 'out_of_stock',
      campaigns: 0,
      sales: 0,
      image: '👟'
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    lowStock: products.filter(p => p.status === 'low_stock').length,
    outOfStock: products.filter(p => p.status === 'out_of_stock').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Product Catalog</h1>
            <p className="text-gray-400">Manage your products and SKUs</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => alert('Import products coming soon!')}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <Upload size={20} />
              Import
            </button>
            <button 
              onClick={() => alert('Export products coming soon!')}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <Download size={20} />
              Export
            </button>
            <button 
              onClick={() => alert('Add product coming soon!')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Add Product
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <Package className="text-blue-400 mb-3" size={24} />
            <p className="text-gray-400 text-sm">Total Products</p>
            <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <div className="w-3 h-3 bg-green-400 rounded-full mb-3"></div>
            <p className="text-gray-400 text-sm">Active</p>
            <p className="text-3xl font-bold text-green-400 mt-1">{stats.active}</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <div className="w-3 h-3 bg-yellow-400 rounded-full mb-3"></div>
            <p className="text-gray-400 text-sm">Low Stock</p>
            <p className="text-3xl font-bold text-yellow-400 mt-1">{stats.lowStock}</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <div className="w-3 h-3 bg-red-400 rounded-full mb-3"></div>
            <p className="text-gray-400 text-sm">Out of Stock</p>
            <p className="text-3xl font-bold text-red-400 mt-1">{stats.outOfStock}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-xl p-4 mb-6 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="Footwear">Footwear</option>
            <option value="Apparel">Apparel</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        {/* Products Table */}
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="text-left text-gray-400 px-6 py-4 text-sm font-medium">Product</th>
                  <th className="text-left text-gray-400 px-6 py-4 text-sm font-medium">SKU</th>
                  <th className="text-left text-gray-400 px-6 py-4 text-sm font-medium">Category</th>
                  <th className="text-left text-gray-400 px-6 py-4 text-sm font-medium">Price</th>
                  <th className="text-left text-gray-400 px-6 py-4 text-sm font-medium">Stock</th>
                  <th className="text-left text-gray-400 px-6 py-4 text-sm font-medium">Campaigns</th>
                  <th className="text-left text-gray-400 px-6 py-4 text-sm font-medium">Sales</th>
                  <th className="text-left text-gray-400 px-6 py-4 text-sm font-medium">Status</th>
                  <th className="text-left text-gray-400 px-6 py-4 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, idx) => (
                  <tr key={product.id} className="border-t border-gray-700 hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{product.image}</div>
                        <span className="text-white font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300 font-mono text-sm">{product.id}</td>
                    <td className="px-6 py-4 text-gray-300">{product.category}</td>
                    <td className="px-6 py-4 text-white font-medium">₹{product.price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${
                        product.stock === 0 ? 'text-red-400' :
                        product.stock < 100 ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{product.campaigns}</td>
                    <td className="px-6 py-4 text-white font-medium">{product.sales.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        product.status === 'low_stock' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {product.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => alert(`View ${product.name}`)}
                          className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <Eye className="text-gray-400 hover:text-white" size={16} />
                        </button>
                        <button 
                          onClick={() => alert(`Edit ${product.name}`)}
                          className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <Edit className="text-gray-400 hover:text-white" size={16} />
                        </button>
                        <button 
                          onClick={() => confirm(`Delete ${product.name}?`)}
                          className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="text-gray-400 hover:text-red-400" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto text-gray-600 mb-4" size={48} />
            <p className="text-gray-400">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}
