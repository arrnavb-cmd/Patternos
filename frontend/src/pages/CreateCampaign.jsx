import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Search, Filter, Package, 
  CheckCircle, Circle, ShoppingCart, X, Info, Target
} from 'lucide-react';

export default function CreateCampaign() {
  const navigate = useNavigate();
  const { brandName } = useParams();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAggregator = user.role === 'platform_admin' || user.username === 'admin' || user.username === 'zepto';
  const userBrand = isAggregator ? 'Zepto' : (brandName || localStorage.getItem('brand') || user.username);
  
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

  // Step 2: Campaign Details State
  const [campaignName, setCampaignName] = useState('');
  const [totalBudget, setTotalBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [objective, setObjective] = useState('sales');

  // Step 3: Targeting State
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [intentLevel, setIntentLevel] = useState('High');
  const [ageGroups, setAgeGroups] = useState([]);
  const [locations, setLocations] = useState([]);
  
  const isStep3Valid = selectedChannels.length > 0 && intentLevel;


  const isStep2Valid = campaignName && totalBudget && startDate && endDate;

  const objectives = [
    { value: 'sales', label: '🎯 Drive Sales', description: 'Maximize conversions and revenue. Optimize for purchases and transactions.' },
    { value: 'awareness', label: '📢 Brand Awareness', description: 'Build brand visibility and reach. Increase impressions and brand recall.' }
  ];

  const indianCities = ['All India', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Surat', 'Jaipur', 
                       'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 
                       'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan', 'Vasai-Virar', 
                       'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad', 'Ranchi', 
                       'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 
                       'Kota', 'Chandigarh', 'Guwahati', 'Solapur', 'Hubli-Dharwad', 'Mysore', 'Tiruchirappalli', 
                       'Bareilly', 'Aligarh', 'Tiruppur', 'Moradabad', 'Jalandhar', 'Bhubaneswar', 'Salem', 'Warangal',
                       'Guntur', 'Bhiwandi', 'Saharanpur', 'Gorakhpur', 'Bikaner', 'Amravati', 'Noida', 'Jamshedpur',
                       'Bhilai', 'Cuttack', 'Firozabad', 'Kochi', 'Nellore', 'Bhavnagar', 'Dehradun', 'Durgapur',
                       'Asansol', 'Rourkela', 'Nanded', 'Kolhapur', 'Ajmer', 'Akola', 'Gulbarga', 'Jamnagar',
                       'Ujjain', 'Loni', 'Siliguri', 'Jhansi', 'Ulhasnagar', 'Jammu', 'Sangli-Miraj', 'Mangalore',
                       'Erode', 'Belgaum', 'Ambattur', 'Tirunelveli', 'Malegaon', 'Gaya', 'Jalgaon', 'Udaipur',
                       'Maheshtala', 'Davanagere', 'Kozhikode', 'Kurnool', 'Rajpur Sonarpur', 'Rajahmundry', 'Bokaro',
                       'South Dumdum', 'Bellary', 'Patiala', 'Gopalpur', 'Agartala', 'Bhagalpur', 'Muzaffarnagar',
                       'Bhatpara', 'Panihati', 'Latur', 'Dhule', 'Tirupati', 'Rohtak', 'Korba', 'Bhilwara',
                       'Berhampur', 'Muzaffarpur', 'Ahmednagar', 'Mathura', 'Kollam', 'Avadi', 'Kadapa',
                       'Kamarhati', 'Sambalpur', 'Bilaspur', 'Shahjahanpur', 'Satara', 'Bijapur', 'Rampur',
                       'Shivamogga', 'Chandrapur', 'Junagadh', 'Thrissur', 'Alwar', 'Bardhaman', 'Kulti',
                       'Kakinada', 'Nizamabad', 'Parbhani', 'Tumkur', 'Khammam', 'Ozhukarai', 'Bihar Sharif',
                       'Panipat', 'Darbhanga', 'Bally', 'Aizawl', 'Dewas', 'Ichalkaranji', 'Karnal', 'Bathinda',
                       'Jalna', 'Eluru', 'Kirari Suleman Nagar', 'Barasat', 'Purnia', 'Satna', 'Mau', 'Sonipat',
                       'Farrukhabad', 'Sagar', 'Durg', 'Imphal', 'Ratlam', 'Hapur', 'Arrah',
                       'Karimnagar', 'Anantapur', 'Etawah', 'Ambernath', 'North Dumdum', 'Bharatpur', 'Begusarai',
                       'New Delhi', 'Gandhidham', 'Baranagar', 'Tiruvottiyur', 'Puducherry', 'Sikar', 'Thoothukudi',
                       'Sri Ganganagar', 'Karawal Nagar', 'Mango', 'Thanjavur', 
                       'Bulandshahr', 'Uluberia', 'Murwara', 'Sambhal', 'Singrauli', 'Nadiad', 'Secunderabad',
                       'Naihati', 'Yamunanagar', 'Bidhan Nagar', 'Pallavaram', 'Bidar', 'Munger', 'Panchkula',
                       'Burhanpur', 'Kharagpur', 'Dindigul', 'Gandhinagar', 'Hospet', 'Nangloi Jat',
                       'Malda', 'Ongole', 'Deoghar', 'Chapra', 'Haldia', 'Khandwa', 'Nandyal', 'Morena', 'Amroha'];

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
              onClick={() => isAggregator ? navigate('/campaigns') : navigate(`/brand/${userBrand}/campaigns`)}
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
                onClick={() => isAggregator ? navigate('/campaigns') : navigate(`/brand/${userBrand}/campaigns`)}
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

        {/* Step 2: Campaign Details */}
        {currentStep === 2 && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            
            {/* Selected Products Panel */}
            {selectedProducts.length > 0 && (
              <div className="mb-6 p-4 bg-gray-900 border border-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Package className="text-blue-400" size={20} />
                    <span className="text-white font-medium">Selected Products ({selectedProducts.length})</span>
                  </div>
                  <button onClick={() => setCurrentStep(1)} className="text-sm text-blue-400 hover:text-blue-300">
                    Edit Products
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedProducts.slice(0, 5).map(p => (
                    <div key={p.sku_id} className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-sm text-gray-300">
                      {p.sku_name}
                    </div>
                  ))}
                  {selectedProducts.length > 5 && (
                    <div className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-sm text-gray-400">
                      +{selectedProducts.length - 5} more
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Campaign Details</h2>
              <p className="text-gray-400">Set up your campaign name, budget, and timeline</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Name *</label>
                <input type="text" value={campaignName} onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g., Summer Sale 2025" 
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Objective *</label>
                <div className="space-y-3">
                  {objectives.map(obj => (
                    <div key={obj.value} onClick={() => setObjective(obj.value)}
                      className={`p-5 rounded-lg border-2 cursor-pointer transition-all ${objective === obj.value ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700 bg-gray-900 hover:border-gray-600'}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-white font-semibold text-lg mb-2">{obj.label}</h4>
                          <p className="text-sm text-gray-400">{obj.description}</p>
                        </div>
                        <div className={objective === obj.value ? 'text-blue-400' : 'text-gray-600'}>
                          {objective === obj.value ? <CheckCircle size={24} /> : <Circle size={24} />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Total Budget (₹) *</label>
                <input type="number" value={totalBudget} onChange={(e) => setTotalBudget(e.target.value)}
                  placeholder="100000" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                <p className="text-xs text-gray-500 mt-1">Total campaign budget for the entire duration</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Date *</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">End Date *</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>

              {totalBudget && startDate && endDate && (
                <div className="p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                  <h4 className="text-white font-medium mb-3">Campaign Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Budget:</span>
                      <span className="text-white font-medium">₹{Number(totalBudget).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white font-medium">
                        {Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))} days
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Products:</span>
                      <span className="text-white font-medium">{selectedProducts.length}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-700">
              <button onClick={() => setCurrentStep(1)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
                <ArrowLeft size={20} /> Back
              </button>
              <button onClick={() => setCurrentStep(3)} disabled={!isStep2Valid}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                Continue <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Targeting */}
        {currentStep === 3 && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            
            {/* Selected Products Panel */}
            {selectedProducts.length > 0 && (
              <div className="mb-6 p-4 bg-gray-900 border border-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Package className="text-blue-400" size={20} />
                    <span className="text-white font-medium">Selected Products ({selectedProducts.length})</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedProducts.slice(0, 5).map(p => (
                    <div key={p.sku_id} className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-sm text-gray-300">
                      {p.sku_name}
                    </div>
                  ))}
                  {selectedProducts.length > 5 && (
                    <div className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-sm text-gray-400">
                      +{selectedProducts.length - 5} more
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Targeting & Channels</h2>
              <p className="text-gray-400">Choose where and how to reach your audience</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              
              {/* Channel Selection */}
              <div>
                <label className="block text-lg font-semibold text-white mb-4">Select Channels *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'Zepto App', desc: 'Homepage, Search, Product pages' },
                    { name: 'Google Display', desc: 'Banner ads across Google network' },
                    { name: 'Facebook', desc: 'Feed ads, Stories' },
                    { name: 'Instagram', desc: 'Feed, Stories, Reels' },
                    { name: 'YouTube', desc: 'Video ads, In-stream, Discovery' }
                  ].map(channel => {
                    const isSelected = selectedChannels.includes(channel.name);
                    return (
                      <div key={channel.name} onClick={() => {
                        if (isSelected) {
                          setSelectedChannels(selectedChannels.filter(c => c !== channel.name));
                        } else {
                          setSelectedChannels([...selectedChannels, channel.name]);
                        }
                      }}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                        }`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-white font-medium mb-1">{channel.name}</div>
                            <div className="text-xs text-gray-400">{channel.desc}</div>
                          </div>
                          {isSelected ? <CheckCircle className="text-blue-400" size={20} /> : <Circle className="text-gray-600" size={20} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Intent Level */}
              <div>
                <label className="block text-lg font-semibold text-white mb-4">Intent Level *</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['High', 'Medium', 'Low'].map(level => {
                    const colors = {
                      High: 'border-red-500 bg-red-900/20 text-red-400',
                      Medium: 'border-yellow-500 bg-yellow-900/20 text-yellow-400',
                      Low: 'border-blue-500 bg-blue-900/20 text-blue-400'
                    };
                    const descriptions = {
                      High: 'Ready to purchase - high conversion intent',
                      Medium: 'Considering options - mid-funnel',
                      Low: 'Early awareness - top-funnel'
                    };
                    return (
                      <div key={level} onClick={() => setIntentLevel(level)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          intentLevel === level ? colors[level] : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                        }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">{level} Intent</span>
                          {intentLevel === level && <CheckCircle className={intentLevel === level ? 'text-current' : 'text-gray-600'} size={20} />}
                        </div>
                        <p className="text-xs text-gray-400">{descriptions[level]}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Age Groups (Optional) */}
              <div>
                <label className="block text-lg font-semibold text-white mb-4">Age Groups (Optional)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['18-24', '25-34', '35-44', '45-54', '55+'].map(age => {
                    const isSelected = ageGroups.includes(age);
                    return (
                      <div key={age} onClick={() => {
                        if (isSelected) {
                          setAgeGroups(ageGroups.filter(a => a !== age));
                        } else {
                          setAgeGroups([...ageGroups, age]);
                        }
                      }}
                        className={`p-3 rounded-lg border cursor-pointer text-center ${
                          isSelected ? 'border-blue-500 bg-blue-900/20 text-blue-400' : 'border-gray-700 bg-gray-900 text-gray-400'
                        }`}>
                        {age}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Locations (Optional) */}
              <div>
                <label className="block text-lg font-semibold text-white mb-4">Target Locations (Optional)</label>
                <select 
                  multiple
                  value={locations}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    setLocations(selected);
                  }}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  size="8">
                  {indianCities.map(city => (
                    <option key={city} value={city} className="py-2">{city}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-2">Hold Ctrl/Cmd to select multiple cities</p>
                {locations.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {locations.map(loc => (
                      <div key={loc} className="px-3 py-1 bg-blue-900/20 border border-blue-700 rounded text-sm text-blue-400">
                        {loc}
                        <button onClick={() => setLocations(locations.filter(l => l !== loc))} className="ml-2 text-blue-300 hover:text-blue-100">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Summary */}
              {selectedChannels.length > 0 && (
                <div className="p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                  <h4 className="text-white font-medium mb-3">Targeting Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Channels:</span>
                      <span className="text-white font-medium">{selectedChannels.join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Intent Level:</span>
                      <span className="text-white font-medium">{intentLevel}</span>
                    </div>
                    {ageGroups.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Age Groups:</span>
                        <span className="text-white font-medium">{ageGroups.join(', ')}</span>
                      </div>
                    )}
                    {locations.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Locations:</span>
                        <span className="text-white font-medium">{locations.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-700">
              <button onClick={() => setCurrentStep(2)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
                <ArrowLeft size={20} /> Back
              </button>
              <button onClick={() => setCurrentStep(4)} disabled={!isStep3Valid}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                Continue <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review & Launch */}
        {currentStep === 4 && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Review & Launch Campaign</h2>
              <p className="text-gray-400">Review all details before submitting for approval</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Products Summary */}
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="text-blue-400" size={20} />
                  <h3 className="text-lg font-semibold text-white">Selected Products</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedProducts.slice(0, 10).map(p => (
                    <div key={p.sku_id} className="p-3 bg-gray-800 rounded flex items-start gap-3">
                      <div className="flex-1">
                        <p className="text-sm text-white font-medium">{p.sku_name}</p>
                        <p className="text-xs text-gray-500">{p.sku_id}</p>
                      </div>
                      <span className="text-sm text-green-400 font-medium">₹{Math.round(p.price)}</span>
                    </div>
                  ))}
                  {selectedProducts.length > 10 && (
                    <div className="p-3 bg-gray-800 rounded text-center text-gray-400">
                      +{selectedProducts.length - 10} more products
                    </div>
                  )}
                </div>
              </div>

              {/* Campaign Details Summary */}
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="text-purple-400" size={20} />
                  <h3 className="text-lg font-semibold text-white">Campaign Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Campaign Name</p>
                    <p className="text-white font-medium">{campaignName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Objective</p>
                    <p className="text-white font-medium">
                      {objectives.find(o => o.value === objective)?.label}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Budget</p>
                    <p className="text-green-400 font-bold text-lg">₹{Number(totalBudget).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Duration</p>
                    <p className="text-white font-medium">
                      {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                      <span className="text-gray-400 text-sm ml-2">
                        ({Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))} days)
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Targeting Summary */}
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="text-orange-400" size={20} />
                  <h3 className="text-lg font-semibold text-white">Targeting & Channels</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Selected Channels</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedChannels.map(channel => (
                        <span key={channel} className="px-3 py-1 bg-blue-900/20 border border-blue-700 rounded text-sm text-blue-400">
                          {channel}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Intent Level</p>
                    <span className={`px-3 py-1 rounded text-sm font-medium ${
                      intentLevel === 'High' ? 'bg-red-900/20 text-red-400' :
                      intentLevel === 'Medium' ? 'bg-yellow-900/20 text-yellow-400' :
                      'bg-blue-900/20 text-blue-400'
                    }`}>
                      {intentLevel} Intent
                    </span>
                  </div>
                  {ageGroups.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Target Age Groups</p>
                      <div className="flex flex-wrap gap-2">
                        {ageGroups.map(age => (
                          <span key={age} className="px-3 py-1 bg-gray-800 rounded text-sm text-gray-300">
                            {age}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {locations.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Target Locations</p>
                      <div className="flex flex-wrap gap-2">
                        {locations.slice(0, 10).map(loc => (
                          <span key={loc} className="px-3 py-1 bg-gray-800 rounded text-sm text-gray-300">
                            {loc}
                          </span>
                        ))}
                        {locations.length > 10 && (
                          <span className="px-3 py-1 bg-gray-800 rounded text-sm text-gray-400">
                            +{locations.length - 10} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-5">
                <div className="flex items-start gap-3">
                  <div className="text-yellow-400 mt-1">⚠️</div>
                  <div>
                    <h4 className="text-white font-medium mb-2">Campaign Approval Required</h4>
                    <p className="text-sm text-gray-300">
                      Your campaign will be submitted to the Aggregator for review. The approval process typically takes 24-48 hours. 
                      You'll be notified once your campaign is approved or if any changes are required.
                    </p>
                  </div>
                </div>
              </div>

              {/* Estimated Performance (Optional Preview) */}
              <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-700 rounded-lg p-5">
                <h4 className="text-white font-semibold mb-3">📊 Estimated Performance</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Est. Impressions</p>
                    <p className="text-xl font-bold text-white">
                      {(Number(totalBudget) * 100).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Est. Clicks</p>
                    <p className="text-xl font-bold text-white">
                      {(Number(totalBudget) * 5).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Est. Conversions</p>
                    <p className="text-xl font-bold text-white">
                      {(Number(totalBudget) * 0.5).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Target ROAS</p>
                    <p className="text-xl font-bold text-green-400">3-5x</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">* Estimates based on historical performance data</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-700">
              <button onClick={() => setCurrentStep(3)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
                <ArrowLeft size={20} /> Back
              </button>
              <button 
                onClick={() => {
                  // TODO: Submit campaign for approval
                  alert('Campaign submitted for approval! You will be redirected to campaigns list.');
                  isAggregator ? navigate('/campaigns') : navigate(`/brand/${userBrand}/campaigns`);
                }}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 font-semibold text-lg">
                Submit for Approval ✓
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
