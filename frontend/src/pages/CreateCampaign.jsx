import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Search, Filter, Package, 
  CheckCircle, Circle, ShoppingCart, X, Info
} from 'lucide-react';

export default function CreateCampaign() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAggregator = user.role === 'platform_admin' || user.username === 'admin' || user.username === 'zepto';
  const userBrand = isAggregator ? 'Zepto' : (localStorage.getItem('brand') || user.username);
  
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1: Product Selection
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedBrand, selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:8000/api/v1/products/search?limit=50';
      
      // CRITICAL: Everyone only sees their OWN brand products
      // Aggregator = Zepto products only
      // Himalaya = Himalaya products only
      // Amul = Amul products only, etc.
      url += `&brand=${userBrand}`;
      
      if (searchQuery) url += `&search=${searchQuery}`;
      if (selectedCategory !== 'all') url += `&category=${selectedCategory}`;
      
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data.products || []);
      setCategories(data.categories || []);
      setBrands(data.brands || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleProductSelection = (product) => {
    setSelectedProducts(prev => {
      const exists = prev.find(p => p.sku_id === product.sku_id);
      if (exists) {
        return prev.filter(p => p.sku_id !== product.sku_id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isProductSelected = (product) => {
    return selectedProducts.some(p => p.sku_id === product.sku_id);
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    return '₹' + Math.round(amount).toLocaleString();
  };

  const steps = [
    { number: 1, name: 'Select Products', icon: Package },
    { number: 2, name: 'Campaign Details', icon: Info },
    { number: 3, name: 'Targeting', icon: Filter },
    { number: 4, name: 'Review & Launch', icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/campaigns')}
              className="text-gray-400 hover:text-white">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Create Campaign</h1>
              <p className="text-gray-400 mt-1">Launch your retail media campaign</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      isCompleted ? 'bg-green-600 border-green-600' :
                      isActive ? 'bg-blue-600 border-blue-600' :
                      'bg-gray-800 border-gray-700'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="text-white" size={24} />
                      ) : (
                        <Icon className="text-white" size={24} />
                      )}
                    </div>
                    <p className={`mt-2 text-sm font-medium ${
                      isActive ? 'text-blue-400' : 'text-gray-400'
                    }`}>
                      {step.name}
                    </p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-700'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step 1: Product Selection */}
        {currentStep === 1 && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Select Products for Campaign</h2>
              <p className="text-gray-400">Choose which products you want to advertise in this campaign</p>
              <div className="mt-3 p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
                <p className="text-sm text-blue-400">
                  📦 Showing {userBrand} products only ({products.length} available). You can only create campaigns for your own products.
                </p>
              </div>
            </div>

            {/* Selected Products Summary */}
            {selectedProducts.length > 0 && (
              <div className="mb-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="text-blue-400" size={20} />
                    <span className="text-white font-medium">
                      {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <button 
                    onClick={() => setSelectedProducts([])}
                    className="text-sm text-red-400 hover:text-red-300">
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedProducts.map(p => (
                    <div key={p.sku_id} className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-lg">
                      <span className="text-sm text-white">{p.sku_name}</span>
                      <button onClick={() => toggleProductSelection(p)} className="text-gray-400 hover:text-red-400">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
                <option value="all">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="text-center py-12 text-gray-400">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 text-gray-400">No products found</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {products.map(product => {
                  const isSelected = isProductSelected(product);
                  return (
                    <div 
                      key={product.sku_id}
                      onClick={() => toggleProductSelection(product)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-900/20' 
                          : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                      }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-white font-medium text-sm mb-1">{product.sku_name}</h3>
                          <p className="text-xs text-gray-500">{product.sku_id}</p>
                        </div>
                        <div className={`${isSelected ? 'text-blue-400' : 'text-gray-600'}`}>
                          {isSelected ? <CheckCircle size={20} /> : <Circle size={20} />}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Brand:</span>
                          <span className="text-xs text-gray-300">{product.brand}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Category:</span>
                          <span className="text-xs text-gray-300">{product.category_level_1}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Price:</span>
                          <span className="text-sm font-bold text-green-400">{formatCurrency(product.price)}</span>
                        </div>
                        {product.rating && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Rating:</span>
                            <span className="text-xs text-yellow-400">★ {product.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-700">
              <button 
                onClick={() => navigate('/campaigns')}
                className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
                <ArrowLeft size={20} /> Cancel
              </button>
              <button 
                onClick={() => setCurrentStep(2)}
                disabled={selectedProducts.length === 0}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                Continue <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2-4: Placeholder for now */}
        {currentStep > 1 && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Step {currentStep} - Coming Soon</h2>
            <p className="text-gray-400 mb-6">This step will be implemented next</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
                Back
              </button>
              {currentStep < 4 && (
                <button 
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Continue
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
