import React from "react";
import { useState } from 'react';
import { Sparkles, Wand2, Download, Copy, RefreshCw, Image, Video, Type } from 'lucide-react';

export default function AIAdGenerator() {
  const [generating, setGenerating] = useState(false);
  const [step, setStep] = useState(1);
  const [adConfig, setAdConfig] = useState({
    productName: '',
    category: '',
    targetAudience: '',
    adType: '',
    tone: '',
    keyFeatures: '',
    offer: '',
    language: 'english'
  });
  const [generatedAds, setGeneratedAds] = useState(null);

  const categories = [
    'Electronics', 'Fashion', 'Beauty', 'Groceries', 'Home & Kitchen',
    'Sports & Fitness', 'Books', 'Toys', 'Health', 'Automotive'
  ];

  const tones = [
    { id: 'professional', name: 'Professional', desc: 'Formal and trustworthy' },
    { id: 'casual', name: 'Casual', desc: 'Friendly and relatable' },
    { id: 'urgent', name: 'Urgent', desc: 'Create FOMO' },
    { id: 'luxury', name: 'Luxury', desc: 'Premium and exclusive' },
    { id: 'fun', name: 'Fun', desc: 'Playful and entertaining' }
  ];

  const languages = [
    { code: 'english', name: 'English' },
    { code: 'hindi', name: 'Hindi (हिन्दी)' },
    { code: 'hinglish', name: 'Hinglish' },
    { code: 'tamil', name: 'Tamil (தமிழ்)' },
    { code: 'bengali', name: 'Bengali (বাংলা)' }
  ];

  const adTypes = [
    { id: 'product_ads', name: 'Product Ads', icon: '🛍️' },
    { id: 'video_script', name: 'Video Script', icon: '🎬' },
    { id: 'story_ads', name: 'Story Ads', icon: '📱' },
    { id: 'email_ads', name: 'Email Ads', icon: '📧' },
    { id: 'display_banner', name: 'Display Banner', icon: '🖼️' },
    { id: 'social_media', name: 'Social Media', icon: '📲' }
  ];

  const generateAds = async () => {
    setGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate sample ads based on inputs
    const ads = {
      headlines: [
        `${adConfig.offer} on ${adConfig.productName} - Limited Time!`,
        `Discover the Best ${adConfig.productName} for ${adConfig.targetAudience}`,
        `${adConfig.productName}: ${adConfig.keyFeatures.split(',')[0]} & More!`,
        `Get Your ${adConfig.productName} Today - ${adConfig.offer}`,
        `Why ${adConfig.targetAudience} Love Our ${adConfig.productName}`
      ],
      descriptions: [
        `Shop premium ${adConfig.productName} with ${adConfig.keyFeatures}. ${adConfig.offer}. Perfect for ${adConfig.targetAudience}. Order now with free delivery!`,
        `Experience unmatched quality with our ${adConfig.productName}. Features include ${adConfig.keyFeatures}. Don't miss ${adConfig.offer}!`,
        `Designed for ${adConfig.targetAudience}, our ${adConfig.productName} offers ${adConfig.keyFeatures}. ${adConfig.offer}. Shop now!`,
        `Premium ${adConfig.category} products at unbeatable prices. Get ${adConfig.offer} on ${adConfig.productName}. Limited stock available!`
      ],
      ctas: [
        'Shop Now',
        'Buy Now - Limited Stock',
        'Get Offer',
        'Claim Your Discount',
        'Add to Cart'
      ],
      videoScript: `
[Opening Shot: Product showcase]
Narrator: "Looking for the perfect ${adConfig.productName}?"

[Scene 2: Features highlight]
"Introducing our ${adConfig.productName} - designed specifically for ${adConfig.targetAudience}"

[Scene 3: Key features]
"With ${adConfig.keyFeatures}, it's everything you need and more"

[Scene 4: Offer reveal]
"And for a limited time, ${adConfig.offer}"

[Closing: CTA]
"Order now on Flipkart/Amazon and get it delivered in 10 minutes!"
[End with product shot and logo]
      `.trim(),
      emailTemplate: `
Subject: ${adConfig.offer} on ${adConfig.productName} - Just For You! 🎁

Hi [Customer Name],

We noticed you were looking at ${adConfig.category} products...

Great news! Our bestselling ${adConfig.productName} is now available with ${adConfig.offer}!

✨ Why customers love it:
${adConfig.keyFeatures.split(',').map(f => `• ${f.trim()}`).join('\n')}

Perfect for ${adConfig.targetAudience} like you!

[Shop Now Button]

Limited time offer. Stock running out fast!

Happy Shopping,
The Team
      `.trim(),
      socialMediaPosts: [
        {
          platform: 'Instagram',
          content: `🔥 ${adConfig.offer} Alert!\n\n${adConfig.productName} is here!\n\n✨ ${adConfig.keyFeatures}\n\n👉 Tap link in bio\n\n#${adConfig.category} #Sale #Shopping`
        },
        {
          platform: 'Facebook',
          content: `Attention ${adConfig.targetAudience}! 🎯\n\nOur ${adConfig.productName} is flying off the shelves!\n\n${adConfig.offer} - Today Only!\n\nFeatures:\n${adConfig.keyFeatures.split(',').map(f => `✓ ${f.trim()}`).join('\n')}\n\nShop Now → [Link]`
        },
        {
          platform: 'Twitter',
          content: `${adConfig.offer} on ${adConfig.productName}! 🎉\n\nPerfect for ${adConfig.targetAudience}\n\n${adConfig.keyFeatures.split(',')[0]}\n\n🛒 Shop: [link]\n\n#Sale #${adConfig.category}`
        }
      ]
    };

    // Add Hindi translations if Hindi selected
    if (adConfig.language === 'hindi') {
      ads.headlines = ads.headlines.map(h => 
        `${adConfig.productName} पर ${adConfig.offer} - सीमित समय के लिए!`
      );
    }

    setGeneratedAds(ads);
    setGenerating(false);
    setStep(3);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles size={32} />
          <h2 className="text-2xl font-bold">AI Ad Generator</h2>
        </div>
        <p className="text-purple-100">Create professional ads in seconds with AI</p>
      </div>

      {/* Progress */}
      <div className="bg-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-purple-400' : 'text-slate-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-purple-500 text-white' : 'bg-slate-700'
            }`}>1</div>
            <span className="text-sm font-medium">Product Info</span>
          </div>
          <div className="flex-1 h-1 mx-4 bg-slate-700">
            <div className={`h-1 ${step >= 2 ? 'bg-purple-500' : 'bg-slate-700'}`} 
                 style={{width: step >= 2 ? '100%' : '0%', transition: 'width 0.3s'}} />
          </div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-purple-400' : 'text-slate-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-purple-500 text-white' : 'bg-slate-700'
            }`}>2</div>
            <span className="text-sm font-medium">Ad Details</span>
          </div>
          <div className="flex-1 h-1 mx-4 bg-slate-700">
            <div className={`h-1 ${step >= 3 ? 'bg-purple-500' : 'bg-slate-700'}`}
                 style={{width: step >= 3 ? '100%' : '0%', transition: 'width 0.3s'}} />
          </div>
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-purple-400' : 'text-slate-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 3 ? 'bg-purple-500 text-white' : 'bg-slate-700'
            }`}>3</div>
            <span className="text-sm font-medium">Generated Ads</span>
          </div>
        </div>
      </div>

      {/* Step 1: Product Info */}
      {step === 1 && (
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Product Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-slate-400 text-sm mb-2">Product Name *</label>
              <input
                type="text"
                value={adConfig.productName}
                onChange={(e) => setAdConfig({...adConfig, productName: e.target.value})}
                placeholder="e.g., boAt Airdopes 131 Wireless Earbuds"
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-2">Category *</label>
              <select
                value={adConfig.category}
                onChange={(e) => setAdConfig({...adConfig, category: e.target.value})}
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-2">Target Audience *</label>
              <input
                type="text"
                value={adConfig.targetAudience}
                onChange={(e) => setAdConfig({...adConfig, targetAudience: e.target.value})}
                placeholder="e.g., Young professionals aged 25-35"
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-2">Key Features (comma-separated) *</label>
              <textarea
                value={adConfig.keyFeatures}
                onChange={(e) => setAdConfig({...adConfig, keyFeatures: e.target.value})}
                placeholder="e.g., 40hrs battery, Bluetooth 5.3, IPX5 waterproof, Deep bass"
                rows={3}
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-2">Special Offer *</label>
              <input
                type="text"
                value={adConfig.offer}
                onChange={(e) => setAdConfig({...adConfig, offer: e.target.value})}
                placeholder="e.g., 40% OFF - Limited Time"
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!adConfig.productName || !adConfig.category || !adConfig.targetAudience || !adConfig.keyFeatures || !adConfig.offer}
            className="mt-6 w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next: Ad Details
          </button>
        </div>
      )}

      {/* Step 2: Ad Details */}
      {step === 2 && (
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Ad Configuration</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-slate-400 text-sm mb-3">Select Ad Type *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {adTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setAdConfig({...adConfig, adType: type.id})}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      adConfig.adType === type.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-3xl mb-2">{type.icon}</div>
                    <p className="text-white text-sm font-medium">{type.name}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-3">Tone of Voice *</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {tones.map(tone => (
                  <button
                    key={tone.id}
                    onClick={() => setAdConfig({...adConfig, tone: tone.id})}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      adConfig.tone === tone.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <p className="text-white font-medium mb-1">{tone.name}</p>
                    <p className="text-slate-400 text-xs">{tone.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-3">Language *</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setAdConfig({...adConfig, language: lang.code})}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      adConfig.language === lang.code
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <p className="text-white text-sm font-medium">{lang.name}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium"
            >
              Back
            </button>
            <button
              onClick={generateAds}
              disabled={!adConfig.adType || !adConfig.tone || generating}
              className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <RefreshCw className="animate-spin" size={20} />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 size={20} />
                  Generate Ads with AI
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Generated Ads */}
      {step === 3 && generatedAds && (
        <div className="space-y-6">
          {/* Headlines */}
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Type className="text-blue-400" size={24} />
                <h3 className="text-xl font-bold text-white">Headlines</h3>
              </div>
              <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm flex items-center gap-2">
                <RefreshCw size={16} />
                Regenerate
              </button>
            </div>
            <div className="space-y-3">
              {generatedAds.headlines.map((headline, idx) => (
                <div key={idx} className="bg-slate-700 rounded-lg p-4 flex items-center justify-between">
                  <p className="text-white flex-1">{headline}</p>
                  <button className="ml-4 p-2 hover:bg-slate-600 rounded">
                    <Copy size={16} className="text-slate-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Descriptions */}
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Ad Descriptions</h3>
              <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm flex items-center gap-2">
                <RefreshCw size={16} />
                Regenerate
              </button>
            </div>
            <div className="space-y-3">
              {generatedAds.descriptions.map((desc, idx) => (
                <div key={idx} className="bg-slate-700 rounded-lg p-4 flex items-start justify-between">
                  <p className="text-white flex-1 text-sm">{desc}</p>
                  <button className="ml-4 p-2 hover:bg-slate-600 rounded">
                    <Copy size={16} className="text-slate-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Video Script */}
          {adConfig.adType === 'video_script' && (
            <div className="bg-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Video className="text-purple-400" size={24} />
                  <h3 className="text-xl font-bold text-white">Video Script</h3>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm flex items-center gap-2">
                    <Download size={16} />
                    Download
                  </button>
                  <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm flex items-center gap-2">
                    <Copy size={16} />
                    Copy
                  </button>
                </div>
              </div>
              <div className="bg-slate-700 rounded-lg p-6">
                <pre className="text-white text-sm whitespace-pre-wrap font-mono">
                  {generatedAds.videoScript}
                </pre>
              </div>
            </div>
          )}

          {/* Email Template */}
          {adConfig.adType === 'email_ads' && (
            <div className="bg-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Email Template</h3>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm flex items-center gap-2">
                    <Download size={16} />
                    Download HTML
                  </button>
                  <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm flex items-center gap-2">
                    <Copy size={16} />
                    Copy
                  </button>
                </div>
              </div>
              <div className="bg-slate-700 rounded-lg p-6">
                <pre className="text-white text-sm whitespace-pre-wrap">
                  {generatedAds.emailTemplate}
                </pre>
              </div>
            </div>
          )}

          {/* Social Media Posts */}
          {adConfig.adType === 'social_media' && (
            <div className="bg-slate-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Social Media Posts</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {generatedAds.socialMediaPosts.map((post, idx) => (
                  <div key={idx} className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-white font-bold">{post.platform}</p>
                      <button className="p-2 hover:bg-slate-600 rounded">
                        <Copy size={16} className="text-slate-400" />
                      </button>
                    </div>
                    <p className="text-slate-300 text-sm whitespace-pre-wrap">{post.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Ready to Launch?</h3>
                <p className="text-green-100 text-sm">Use these AI-generated ads in your campaigns</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium"
                >
                  Create New
                </button>
                <button className="px-6 py-3 bg-white text-green-600 hover:bg-green-50 rounded-lg font-medium">
                  Use in Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
