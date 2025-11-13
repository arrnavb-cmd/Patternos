import React from "react";
import { useState } from 'react';
import { Target, Users, MapPin, DollarSign, Calendar, Zap } from 'lucide-react';

export default function CampaignCreator() {
  const [step, setStep] = useState(1);
  const [campaign, setCampaign] = useState({
    name: '',
    objective: '',
    budget: '',
    platforms: [],
    targeting: {
      age_range: '',
      location: '',
      interests: [],
      intent_score: 70
    },
    creative: {
      headline: '',
      description: '',
      cta: ''
    }
  });

  const objectives = [
    { id: 'awareness', name: 'Brand Awareness', icon: Users, desc: 'Reach new customers' },
    { id: 'consideration', name: 'Product Consideration', icon: Target, desc: 'Drive interest' },
    { id: 'conversion', name: 'Sales Conversion', icon: Zap, desc: 'Drive purchases' }
  ];

  const platforms = [
    { id: 'flipkart', name: 'Flipkart', logo: '🛒', cost: '₹50k min' },
    { id: 'amazon', name: 'Amazon', logo: '📦', cost: '₹75k min' },
    { id: 'zepto', name: 'Zepto', logo: '⚡', cost: '₹30k min' },
    { id: 'blinkit', name: 'Blinkit', logo: '🏃', cost: '₹30k min' },
    { id: 'bigbasket', name: 'BigBasket', logo: '🛍️', cost: '₹40k min' },
    { id: 'myntra', name: 'Myntra', logo: '👗', cost: '₹60k min' },
    { id: 'nykaa', name: 'Nykaa', logo: '💄', cost: '₹50k min' },
    { id: 'swiggy', name: 'Swiggy', logo: '🍔', cost: '₹45k min' }
  ];

  const handlePlatformToggle = (platformId) => {
    setCampaign(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="bg-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className="flex items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= s ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'
              }`}>
                {s}
              </div>
              {s < 4 && (
                <div className={`flex-1 h-1 mx-2 ${
                  step > s ? 'bg-blue-500' : 'bg-slate-700'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm">
          <span className={step >= 1 ? 'text-blue-400' : 'text-slate-400'}>Basic Info</span>
          <span className={step >= 2 ? 'text-blue-400' : 'text-slate-400'}>Platforms</span>
          <span className={step >= 3 ? 'text-blue-400' : 'text-slate-400'}>Targeting</span>
          <span className={step >= 4 ? 'text-blue-400' : 'text-slate-400'}>Creative</span>
        </div>
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="text-2xl font-bold text-white mb-6">Campaign Basics</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-slate-400 text-sm mb-2">Campaign Name</label>
              <input
                type="text"
                value={campaign.name}
                onChange={(e) => setCampaign({...campaign, name: e.target.value})}
                placeholder="e.g., Diwali Sale - Wireless Earbuds"
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-2">Campaign Objective</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {objectives.map(obj => {
                  const Icon = obj.icon;
                  return (
                    <button
                      key={obj.id}
                      onClick={() => setCampaign({...campaign, objective: obj.id})}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        campaign.objective === obj.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <Icon className={`mx-auto mb-2 ${
                        campaign.objective === obj.id ? 'text-blue-400' : 'text-slate-400'
                      }`} size={32} />
                      <p className="text-white font-medium mb-1">{obj.name}</p>
                      <p className="text-slate-400 text-xs">{obj.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-2">Total Budget</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 text-slate-400" size={20} />
                <input
                  type="number"
                  value={campaign.budget}
                  onChange={(e) => setCampaign({...campaign, budget: e.target.value})}
                  placeholder="Enter budget in rupees"
                  className="w-full pl-10 pr-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-slate-500 text-xs mt-2">Minimum ₹30,000 recommended</p>
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!campaign.name || !campaign.objective || !campaign.budget}
            className="mt-6 w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next: Select Platforms
          </button>
        </div>
      )}

      {/* Step 2: Platform Selection */}
      {step === 2 && (
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="text-2xl font-bold text-white mb-6">Select Platforms</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {platforms.map(platform => (
              <button
                key={platform.id}
                onClick={() => handlePlatformToggle(platform.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  campaign.platforms.includes(platform.id)
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="text-4xl mb-2">{platform.logo}</div>
                <p className="text-white font-medium mb-1">{platform.name}</p>
                <p className="text-slate-400 text-xs">{platform.cost}</p>
              </button>
            ))}
          </div>

          {campaign.platforms.length > 0 && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-400 font-medium mb-2">Budget Allocation Preview</p>
              <div className="space-y-2">
                {campaign.platforms.map(pid => {
                  const platform = platforms.find(p => p.id === pid);
                  const allocation = Math.floor(campaign.budget / campaign.platforms.length);
                  return (
                    <div key={pid} className="flex justify-between text-sm">
                      <span className="text-white">{platform?.name}</span>
                      <span className="text-blue-400 font-bold">₹{allocation.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={campaign.platforms.length === 0}
              className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50"
            >
              Next: Targeting
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Audience Targeting */}
      {step === 3 && (
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="text-2xl font-bold text-white mb-6">Audience Targeting</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-slate-400 text-sm mb-2">Age Range</label>
              <select
                value={campaign.targeting.age_range}
                onChange={(e) => setCampaign({
                  ...campaign,
                  targeting: {...campaign.targeting, age_range: e.target.value}
                })}
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select age range</option>
                <option value="18-24">18-24 years</option>
                <option value="25-34">25-34 years</option>
                <option value="35-44">35-44 years</option>
                <option value="45+">45+ years</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-2">Location Targeting</label>
              <select
                value={campaign.targeting.location}
                onChange={(e) => setCampaign({
                  ...campaign,
                  targeting: {...campaign.targeting, location: e.target.value}
                })}
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All India</option>
                <option value="metros">Metro Cities Only</option>
                <option value="tier1">Tier 1 Cities</option>
                <option value="tier2">Tier 2 Cities</option>
                <option value="custom">Custom Locations</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-2">
                Minimum Intent Score: {campaign.targeting.intent_score}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={campaign.targeting.intent_score}
                onChange={(e) => setCampaign({
                  ...campaign,
                  targeting: {...campaign.targeting, intent_score: parseInt(e.target.value)}
                })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Show to everyone (0%)</span>
                <span>Only high-intent users (100%)</span>
              </div>
              <p className="text-slate-500 text-xs mt-2">
                Higher intent score = Better conversion but smaller audience
              </p>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-400 font-medium mb-2">Estimated Reach</p>
              <p className="text-3xl font-bold text-white">2.4M users</p>
              <p className="text-slate-400 text-sm mt-1">Based on your targeting criteria</p>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
            >
              Next: Creative
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Creative */}
      {step === 4 && (
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="text-2xl font-bold text-white mb-6">Campaign Creative</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-slate-400 text-sm mb-2">Headline</label>
              <input
                type="text"
                value={campaign.creative.headline}
                onChange={(e) => setCampaign({
                  ...campaign,
                  creative: {...campaign.creative, headline: e.target.value}
                })}
                placeholder="e.g., Get 40% OFF on Wireless Earbuds"
                maxLength={60}
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-slate-500 text-xs mt-1">
                {campaign.creative.headline.length}/60 characters
              </p>
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-2">Description</label>
              <textarea
                value={campaign.creative.description}
                onChange={(e) => setCampaign({
                  ...campaign,
                  creative: {...campaign.creative, description: e.target.value}
                })}
                placeholder="Describe your offer..."
                maxLength={150}
                rows={3}
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-slate-500 text-xs mt-1">
                {campaign.creative.description.length}/150 characters
              </p>
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-2">Call-to-Action</label>
              <select
                value={campaign.creative.cta}
                onChange={(e) => setCampaign({
                  ...campaign,
                  creative: {...campaign.creative, cta: e.target.value}
                })}
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select CTA</option>
                <option value="shop_now">Shop Now</option>
                <option value="buy_now">Buy Now</option>
                <option value="learn_more">Learn More</option>
                <option value="get_offer">Get Offer</option>
                <option value="order_now">Order Now</option>
              </select>
            </div>

            <div className="bg-slate-700 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-3">Preview</p>
              <div className="bg-slate-600 rounded-lg p-4">
                <p className="text-white font-bold text-lg mb-2">
                  {campaign.creative.headline || 'Your headline here'}
                </p>
                <p className="text-slate-300 text-sm mb-3">
                  {campaign.creative.description || 'Your description here'}
                </p>
                <button className="px-6 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium">
                  {campaign.creative.cta?.replace('_', ' ').toUpperCase() || 'SHOP NOW'}
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium"
            >
              Back
            </button>
            <button
              onClick={() => alert('Campaign created successfully!')}
              className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
            >
              Launch Campaign
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
