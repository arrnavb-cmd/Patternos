import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CampaignFormData {
  name: string;
  brand: string;
  budget: number;
  maxCpm: number;
  startDate: string;
  endDate: string;
  targeting: {
    minIntentScore: number;
    categories: string[];
    pageTypes: string[];
    cities: string[];
  };
  creative: {
    type: 'image' | 'video' | 'carousel' | 'native';
    headline: string;
    description: string;
    imageUrl?: string;
  };
  clickUrl: string;
}

export default function CreateCampaign() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    brand: '',
    budget: 100000,
    maxCpm: 150,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    targeting: {
      minIntentScore: 60,
      categories: [],
      pageTypes: [],
      cities: []
    },
    creative: {
      type: 'image',
      headline: '',
      description: '',
      imageUrl: ''
    },
    clickUrl: ''
  });

  const categories = [
    'Electronics', 'Fashion', 'Groceries', 'Beauty', 'Home & Kitchen',
    'Sports', 'Books', 'Toys', 'Automotive', 'Health'
  ];

  const pageTypes = [
    'Homepage', 'Category', 'Search', 'Product', 'Cart', 'Checkout'
  ];

  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://patternos-production-1cca.up.railway.app/api/v1/campaigns/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        alert('Campaign created successfully!');
        navigate('/campaigns');
      } else {
        alert('Failed to create campaign');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating campaign');
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateTargeting = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      targeting: { ...prev.targeting, [field]: value }
    }));
  };

  const updateCreative = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      creative: { ...prev.creative, [field]: value }
    }));
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Campaign</h1>
          <p className="text-gray-600 mt-2">Launch your retail media campaign in minutes</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Basic Info' },
              { num: 2, label: 'Targeting' },
              { num: 3, label: 'Creative' },
              { num: 4, label: 'Review' }
            ].map((s) => (
              <div key={s.num} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= s.num ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {s.num}
                </div>
                <span className={`ml-2 text-sm ${step >= s.num ? 'text-purple-600 font-semibold' : 'text-gray-500'}`}>
                  {s.label}
                </span>
                {s.num < 4 && <div className="w-16 h-1 bg-gray-200 mx-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Campaign Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="e.g., Diwali Sale 2025 - Electronics"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.brand}
                  onChange={(e) => updateFormData('brand', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="e.g., Samsung India"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Budget (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.budget}
                    onChange={(e) => updateFormData('budget', parseFloat(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    min="10000"
                    step="1000"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum: ₹10,000</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max CPM (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.maxCpm}
                    onChange={(e) => updateFormData('maxCpm', parseFloat(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    min="50"
                    step="10"
                  />
                  <p className="text-xs text-gray-500 mt-1">Cost per 1000 impressions</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => updateFormData('startDate', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => updateFormData('endDate', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Targeting */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Audience Targeting</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Purchase Intent Score: {formData.targeting.minIntentScore}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.targeting.minIntentScore}
                  onChange={(e) => updateTargeting('minIntentScore', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low Intent (0)</span>
                  <span>High Intent (100)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Categories
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => updateTargeting('categories', 
                        toggleArrayItem(formData.targeting.categories, cat.toLowerCase())
                      )}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        formData.targeting.categories.includes(cat.toLowerCase())
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Types
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {pageTypes.map(page => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => updateTargeting('pageTypes', 
                        toggleArrayItem(formData.targeting.pageTypes, page.toLowerCase())
                      )}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        formData.targeting.pageTypes.includes(page.toLowerCase())
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Cities
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {cities.map(city => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => updateTargeting('cities', 
                        toggleArrayItem(formData.targeting.cities, city)
                      )}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        formData.targeting.cities.includes(city)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Creative */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Ad Creative</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Creative Type *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['image', 'video', 'carousel', 'native'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => updateCreative('type', type)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium capitalize transition ${
                        formData.creative.type === type
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.creative.imageUrl}
                  onChange={(e) => updateCreative('imageUrl', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="https://cdn.example.com/ad-image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Headline *
                </label>
                <input
                  type="text"
                  required
                  value={formData.creative.headline}
                  onChange={(e) => updateCreative('headline', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="e.g., Get 50% Off on Samsung Galaxy"
                  maxLength={60}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.creative.headline.length}/60 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.creative.description}
                  onChange={(e) => updateCreative('description', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  rows={3}
                  placeholder="e.g., Limited time offer! Shop the latest Samsung Galaxy with amazing features."
                  maxLength={150}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.creative.description.length}/150 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Click URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.clickUrl}
                  onChange={(e) => updateFormData('clickUrl', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="https://zepto.com/product/samsung-galaxy"
                />
              </div>

              {/* Preview */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Ad Preview</h3>
                <div className="bg-white rounded-lg shadow p-4 max-w-sm">
                  {formData.creative.imageUrl && (
                    <img
                      src={formData.creative.imageUrl}
                      alt="Ad preview"
                      className="w-full h-48 object-cover rounded-lg mb-3"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Ad+Image';
                      }}
                    />
                  )}
                  <h4 className="font-bold text-gray-900">{formData.creative.headline || 'Your Headline'}</h4>
                  <p className="text-sm text-gray-600 mt-1">{formData.creative.description || 'Your description'}</p>
                  <button
                    type="button"
                    className="mt-3 w-full bg-purple-600 text-white py-2 rounded-lg font-medium"
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Review & Launch</h2>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="font-bold text-purple-900 mb-4">Campaign Summary</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Campaign Name</p>
                    <p className="font-medium text-gray-900">{formData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Brand</p>
                    <p className="font-medium text-gray-900">{formData.brand}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Budget</p>
                    <p className="font-medium text-gray-900">₹{formData.budget.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Max CPM</p>
                    <p className="font-medium text-gray-900">₹{formData.maxCpm}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium text-gray-900">{formData.startDate} to {formData.endDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Targeting</p>
                    <p className="font-medium text-gray-900">
                      {formData.targeting.categories.length} categories, {formData.targeting.cities.length} cities
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-purple-200">
                  <p className="text-sm text-gray-600 mb-2">Estimated Reach</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.floor((formData.budget / formData.maxCpm) * 1000).toLocaleString()} impressions
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ By launching this campaign, you agree to the PatternOS Terms of Service and will be charged based on actual impressions delivered.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(Math.min(4, step + 1))}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-8 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
              >
                🚀 Launch Campaign
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
