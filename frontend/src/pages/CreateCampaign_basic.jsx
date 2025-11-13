import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Package, Target, Image as ImageIcon, Calendar, DollarSign, Eye } from 'lucide-react';
import { getCurrentBrand } from '../utils/brandUtils';

export default function CreateCampaign() {
  const navigate = useNavigate();
  const brand = getCurrentBrand();
  const [currentStep, setCurrentStep] = useState(1);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    brand: brand.brandKey,
    products: [],
    campaign_name: '',
    objective: 'conversions',
    budget: '',
    duration_days: '',
    start_date: '',
    target_audience: {
      age_groups: [],
      locations: [],
      interests: []
    },
    ad_copy: '',
    headline: '',
    description: '',
    channels: [],
    call_to_action: 'shop_now',
    ad_images: []
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/brand/dashboard/${brand.username}`);
        const data = await res.json();
        if (!data.error && data.top_products) {
          setAvailableProducts(data.top_products);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };
    fetchProducts();
  }, []);

  const steps = [
    { id: 1, title: 'Products', icon: Package, desc: 'Select products' },
    { id: 2, title: 'Campaign goal', icon: Target, desc: 'Choose objective' },
    { id: 3, title: 'Audience', icon: Target, desc: 'Target customers' },
    { id: 4, title: 'Budget', icon: DollarSign, desc: 'Set spending' },
    { id: 5, title: 'Ad creative', icon: ImageIcon, desc: 'Design ads' },
    { id: 6, title: 'Review', icon: Eye, desc: 'Finalize campaign' }
  ];

  const validateStep = () => {
    switch(currentStep) {
      case 1: return formData.products.length > 0;
      case 2: return formData.campaign_name && formData.objective;
      case 3: return formData.target_audience.age_groups.length > 0;
      case 4: return formData.budget > 0 && formData.duration_days > 0 && formData.start_date;
      case 5: return formData.headline && formData.ad_copy && formData.channels.length > 0;
      default: return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/campaigns/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      if (result.success) {
        setTimeout(() => navigate('/campaigns'), 1500);
      }
    } catch (err) {
      console.error('Failed to submit:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Bar */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/campaigns')} className="text-gray-400 hover:text-white">
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-medium text-white">New campaign</h1>
                <p className="text-sm text-gray-400">{brand.brandName}</p>
              </div>
            </div>
            <button onClick={() => navigate('/campaigns')} className="text-sm text-gray-400 hover:text-white">
              Exit
            </button>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                      isActive ? 'bg-blue-600 text-white' :
                      isCompleted ? 'bg-green-600 text-white' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                    </div>
                    <p className={`text-xs font-medium ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-8">
          
          {/* Step 1: Products */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-medium text-white mb-2">Which products do you want to advertise?</h2>
              <p className="text-gray-400 mb-8">Select the products you want to promote in this campaign</p>

              <div className="space-y-3">
                {availableProducts.map((product, idx) => {
                  const isSelected = formData.products.includes(product.name);
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          products: isSelected 
                            ? prev.products.filter(p => p !== product.name)
                            : [...prev.products, product.name]
                        }));
                      }}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected ? 'border-blue-600 bg-blue-900/20' : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-blue-600' : 'bg-gray-100'
                          }`}>
                            <Package className={isSelected ? 'text-white' : 'text-gray-400'} size={24} />
                          </div>
                          <div>
                            <p className="font-medium text-white">{product.name}</p>
                            <p className="text-sm text-gray-400">₹{Math.round(product.avg_price)} • {product.orders} orders</p>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <Check className="text-white" size={16} />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {formData.products.length > 0 && (
                <div className="mt-6 p-4 bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-900">
                    ✓ {formData.products.length} product{formData.products.length > 1 ? 's' : ''} selected
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Campaign Goal */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-medium text-white mb-2">What's your campaign goal?</h2>
              <p className="text-gray-400 mb-8">Choose the main objective for your campaign</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Campaign name</label>
                  <input
                    type="text"
                    value={formData.campaign_name}
                    onChange={(e) => setFormData({...formData, campaign_name: e.target.value})}
                    placeholder="e.g., Summer Sale 2025"
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Campaign objective</label>
                  <div className="space-y-3">
                    {[
                      { value: 'conversions', label: 'Sales', desc: 'Drive purchases and sales' },
                      { value: 'awareness', label: 'Brand awareness', desc: 'Reach more people' },
                      { value: 'consideration', label: 'Consideration', desc: 'Get more engagement' }
                    ].map(obj => (
                      <button
                        key={obj.value}
                        onClick={() => setFormData({...formData, objective: obj.value})}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          formData.objective === obj.value ? 'border-blue-600 bg-blue-900/20' : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <p className="font-medium text-white">{obj.label}</p>
                        <p className="text-sm text-gray-400 mt-1">{obj.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Audience */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-medium text-white mb-2">Who do you want to reach?</h2>
              <p className="text-gray-400 mb-8">Define your target audience</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Age groups</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['18-24', '25-34', '35-44', '45-54', '55+'].map(age => (
                      <button
                        key={age}
                        onClick={() => {
                          const current = formData.target_audience.age_groups;
                          setFormData({
                            ...formData,
                            target_audience: {
                              ...formData.target_audience,
                              age_groups: current.includes(age) ? current.filter(a => a !== age) : [...current, age]
                            }
                          });
                        }}
                        className={`p-3 rounded-lg border-2 font-medium transition-all ${
                          formData.target_audience.age_groups.includes(age)
                            ? 'border-blue-600 bg-blue-900/20 text-blue-900'
                            : 'border-gray-700 hover:border-gray-600 text-gray-300'
                        }`}
                      >
                        {age}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Locations (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., Mumbai, Delhi, Bangalore"
                    onChange={(e) => setFormData({
                      ...formData,
                      target_audience: {
                        ...formData.target_audience,
                        locations: e.target.value.split(',').map(s => s.trim())
                      }
                    })}
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Budget */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-medium text-white mb-2">Set your budget</h2>
              <p className="text-gray-400 mb-8">Choose how much you want to spend</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Total budget</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                      placeholder="50000"
                      className="w-full pl-8 pr-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-sm text-gray-400 mt-2">Minimum: ₹50,000</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Duration (days)</label>
                    <input
                      type="number"
                      value={formData.duration_days}
                      onChange={(e) => setFormData({...formData, duration_days: e.target.value})}
                      placeholder="30"
                      className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Start date</label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {formData.budget > 0 && formData.duration_days > 0 && (
                  <div className="p-4 bg-blue-900/20 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">
                      Daily budget: ₹{Math.round(formData.budget / formData.duration_days).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Ad Creative */}
          {currentStep === 5 && (
            <div>
              <h2 className="text-2xl font-medium text-white mb-2">Create your ad</h2>
              <p className="text-gray-400 mb-8">Write your ad copy and select channels</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Headline</label>
                  <input
                    type="text"
                    maxLength={40}
                    value={formData.headline}
                    onChange={(e) => setFormData({...formData, headline: e.target.value})}
                    placeholder="Attention-grabbing headline"
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-400 mt-1">{formData.headline.length}/40</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    maxLength={250}
                    rows={4}
                    value={formData.ad_copy}
                    onChange={(e) => setFormData({...formData, ad_copy: e.target.value})}
                    placeholder="Tell people about your products..."
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-400 mt-1">{formData.ad_copy.length}/250</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Where do you want your ads to appear?</label>
                  <div className="space-y-2">
                    {[
                      { value: 'Zepto_App', label: 'Zepto App' },
                      { value: 'Meta', label: 'Facebook & Instagram' },
                      { value: 'Google', label: 'Google Search & Display' },
                      { value: 'YouTube', label: 'YouTube' },
                      { value: 'OTT', label: 'OTT Platforms' }
                    ].map(channel => (
                      <button
                        key={channel.value}
                        onClick={() => {
                          const current = formData.channels;
                          setFormData({
                            ...formData,
                            channels: current.includes(channel.value)
                              ? current.filter(c => c !== channel.value)
                              : [...current, channel.value]
                          });
                        }}
                        className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                          formData.channels.includes(channel.value)
                            ? 'border-blue-600 bg-blue-900/20'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-white">{channel.label}</span>
                          {formData.channels.includes(channel.value) && (
                            <Check className="text-blue-600" size={20} />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Review */}
          {currentStep === 6 && (
            <div>
              <h2 className="text-2xl font-medium text-white mb-2">Review your campaign</h2>
              <p className="text-gray-400 mb-8">Make sure everything looks good before submitting</p>

              <div className="space-y-6">
                <div className="p-4 bg-gray-900 rounded-lg">
                  <p className="text-sm font-medium text-gray-300 mb-1">Campaign name</p>
                  <p className="text-white">{formData.campaign_name}</p>
                </div>

                <div className="p-4 bg-gray-900 rounded-lg">
                  <p className="text-sm font-medium text-gray-300 mb-2">Products ({formData.products.length})</p>
                  {formData.products.map((p, i) => (
                    <p key={i} className="text-sm text-white">• {p}</p>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-900 rounded-lg">
                    <p className="text-sm font-medium text-gray-300 mb-1">Budget</p>
                    <p className="text-white">₹{parseInt(formData.budget).toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-gray-900 rounded-lg">
                    <p className="text-sm font-medium text-gray-300 mb-1">Duration</p>
                    <p className="text-white">{formData.duration_days} days</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-900 rounded-lg">
                  <p className="text-sm font-medium text-gray-300 mb-1">Channels</p>
                  <p className="text-white">{formData.channels.join(', ')}</p>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-900">
                    Your campaign will be reviewed for compliance. You'll be notified within 24-48 hours.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          {currentStep > 1 ? (
            <button
              onClick={handleBack}
              className="px-6 py-3 text-blue-600 hover:bg-blue-900/20 rounded-lg font-medium transition-colors"
            >
              Back
            </button>
          ) : <div />}

          {currentStep < 6 ? (
            <button
              onClick={handleNext}
              disabled={!validateStep()}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit campaign'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
