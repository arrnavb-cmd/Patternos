import React from "react";
import { useState } from 'react';
import { Sparkles, Copy, Check, RefreshCw, Wand2, Image, Video, Grid3x3 } from 'lucide-react';

export default function AIAdGenerator({ products = [], targeting = {}, onSelectAd, adType = 'product' }) {
  const [generating, setGenerating] = useState(false);
  const [generatedAds, setGeneratedAds] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const getAdTypeConfig = () => {
    switch(adType) {
      case 'video':
        return {
          title: 'AI Video Script Generator',
          desc: 'Generate video scripts and storyboards',
          icon: Video,
          format: 'video'
        };
      case 'carousel':
        return {
          title: 'AI Carousel Generator',
          desc: 'Generate multiple product cards',
          icon: Grid3x3,
          format: 'carousel'
        };
      default:
        return {
          title: 'AI Ad Generator',
          desc: 'Generate ad copy with image mockups',
          icon: Sparkles,
          format: 'standard'
        };
    }
  };

  const config = getAdTypeConfig();

  const generateVideoAds = () => {
    const productName = products[0]?.name || 'Nike Shoes';
    const location = targeting.locations?.[0] || 'Mumbai';
    
    return [
      {
        id: 1,
        style: 'story',
        headline: `🎬 ${productName} Video Ad - Story Style`,
        script: `[Scene 1 - 0:00-0:03]
Close-up of ${productName} rotating on pedestal
Voiceover: "Step into greatness..."

[Scene 2 - 0:03-0:08]
Athlete wearing shoes, slow-motion action shots
Text overlay: "PERFORMANCE MEETS STYLE"

[Scene 3 - 0:08-0:12]
Product features with animated callouts
- Premium comfort
- Durable design
- Authentic quality

[Scene 4 - 0:12-0:15]
CTA: Shop now in ${location}
Fast delivery • 100% genuine`,
        duration: '15 seconds',
        cta: 'Shop Now',
        performance: { ctr: '4.5', cvr: '6.2', engagement: '85' }
      },
      {
        id: 2,
        style: 'testimonial',
        headline: `💬 ${productName} Video Ad - Customer Testimonial`,
        script: `[Scene 1 - 0:00-0:05]
Customer wearing ${productName}, urban setting
Customer: "I've tried many brands, but ${productName} changed my game"

[Scene 2 - 0:05-0:10]
Product close-ups with ratings overlay
⭐⭐⭐⭐⭐ 4.8/5 - 10K+ reviews

[Scene 3 - 0:10-0:15]
Multiple customers showing their shoes
Text: "Join 100K+ happy customers in ${location}"

[Scene 4 - 0:15-0:20]
Product shot with pricing
Special Offer: 20% OFF
Shop now - Fast delivery to ${location}`,
        duration: '20 seconds',
        cta: 'Get Yours',
        performance: { ctr: '5.2', cvr: '7.8', engagement: '92' }
      }
    ];
  };

  const generateCarouselAds = () => {
    return [
      {
        id: 1,
        style: 'multi-product',
        headline: '🎠 Premium Nike Collection Carousel',
        cards: [
          {
            product: 'Nike Air Max 270',
            headline: 'Air Max 270',
            desc: 'Maximum comfort, iconic style',
            price: '₹12,995',
            image: 'Product hero shot'
          },
          {
            product: 'Jordan 1 Retro High',
            headline: 'Jordan 1 Retro',
            desc: 'Legendary design, premium quality',
            price: '₹14,995',
            image: 'Product hero shot'
          },
          {
            product: 'Nike Dri-FIT',
            headline: 'Dri-FIT Collection',
            desc: 'Stay cool, stay fresh',
            price: '₹1,999',
            image: 'Product hero shot'
          }
        ],
        cta: 'Shop Collection',
        performance: { ctr: '3.8', cvr: '5.5', engagement: '88' }
      }
    ];
  };

  const generateStandardAds = () => {
    const productName = products[0]?.name || 'Nike Shoes';
    const location = targeting.locations?.[0] || 'Mumbai';
    const discount = Math.floor(Math.random() * 30) + 10;

    const templates = [
      {
        style: 'urgency',
        headline: `🔥 Limited Time: ${productName} at ${discount}% OFF!`,
        description: `Don't miss out on authentic ${productName}. Fast delivery to ${location}. Limited stock! ⏰`,
        image: `Hero shot of ${productName} on gradient background`,
        cta: 'Shop Now',
        performance: { ctr: '2.8', cvr: '4.2', engagement: '89' }
      },
      {
        style: 'benefit',
        headline: `✨ Upgrade Your Style with Premium ${productName}`,
        description: `Premium quality ${productName} designed for champions. Available now in ${location}! 🏆`,
        image: `Lifestyle shot - person wearing ${productName}`,
        cta: 'Learn More',
        performance: { ctr: '3.2', cvr: '4.8', engagement: '76' }
      },
      {
        style: 'social_proof',
        headline: `⭐ Rated 4.8/5: ${productName} - #1 in ${location}`,
        description: `Join thousands of happy customers. Authentic ${productName} with 100% genuine guarantee. Order today! 🌟`,
        image: `Product with customer review overlays`,
        cta: 'Shop Now',
        performance: { ctr: '2.9', cvr: '5.4', engagement: '82' }
      },
      {
        style: 'value',
        headline: `💰 Best Deal: ${productName} - ${discount}% OFF + Free Shipping!`,
        description: `Premium ${productName} without premium price. Save big in ${location}. Price match promise! 🏷️`,
        image: `Product with discount badge and free shipping icon`,
        cta: 'Get Started',
        performance: { ctr: '3.5', cvr: '6.1', engagement: '91' }
      }
    ];

    return templates.map((t, idx) => ({ ...t, id: idx }));
  };

  const generateAds = () => {
    setGenerating(true);
    
    setTimeout(() => {
      let ads;
      if (adType === 'video') {
        ads = generateVideoAds();
      } else if (adType === 'carousel') {
        ads = generateCarouselAds();
      } else {
        ads = generateStandardAds();
      }
      
      setGeneratedAds(ads);
      setGenerating(false);
    }, 2000);
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getStyleColor = (style) => {
    const colors = {
      urgency: 'from-red-500 to-orange-500',
      benefit: 'from-blue-500 to-purple-500',
      social_proof: 'from-green-500 to-emerald-500',
      value: 'from-yellow-500 to-orange-500',
      story: 'from-purple-500 to-pink-500',
      testimonial: 'from-blue-500 to-cyan-500',
      'multi-product': 'from-indigo-500 to-purple-500'
    };
    return colors[style] || 'from-gray-500 to-gray-600';
  };

  const IconComponent = config.icon;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <IconComponent className="text-white" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-white">{config.title}</h2>
            <p className="text-purple-100 text-sm">{config.desc}</p>
          </div>
        </div>

        <button
          onClick={generateAds}
          disabled={generating}
          className="w-full bg-white hover:bg-gray-100 disabled:bg-gray-300 text-purple-600 font-bold py-4 rounded-lg flex items-center justify-center gap-3 transition-colors"
        >
          {generating ? (
            <>
              <RefreshCw className="animate-spin" size={20} />
              Generating AI-Powered {config.format === 'video' ? 'Scripts' : config.format === 'carousel' ? 'Cards' : 'Ads'}...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Generate {config.format === 'video' ? 'Video Scripts' : config.format === 'carousel' ? 'Carousel Cards' : 'Ad Variations'}
            </>
          )}
        </button>
      </div>

      {generatedAds.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Generated {config.format === 'video' ? 'Video Scripts' : config.format === 'carousel' ? 'Carousels' : 'Ads'} ({generatedAds.length})</h3>
          
          {generatedAds.map((ad) => (
            <div key={ad.id} className="bg-gray-800 rounded-xl p-6 border-2 border-gray-700 hover:border-purple-500 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getStyleColor(ad.style)} flex items-center justify-center text-2xl`}>
                    {config.format === 'video' ? '🎬' : config.format === 'carousel' ? '🎠' : '✨'}
                  </div>
                  <div>
                    <h4 className="font-bold text-white capitalize">{ad.style.replace('_', ' ')} Style</h4>
                    <p className="text-xs text-gray-400">Optimized for {config.format}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(ad.script || `${ad.headline}\n\n${ad.description}`, ad.id)}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    {copiedIndex === ad.id ? <Check className="text-green-400" size={20} /> : <Copy className="text-gray-400" size={20} />}
                  </button>
                  {onSelectAd && !ad.script && (
                    <button
                      onClick={() => onSelectAd(ad)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Use This Ad
                    </button>
                  )}
                </div>
              </div>

              {/* Video Script */}
              {ad.script && (
                <div className="bg-gray-900 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-lg font-bold text-white">{ad.headline}</h5>
                    <span className="text-sm text-purple-400">{ad.duration}</span>
                  </div>
                  <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono">{ad.script}</pre>
                </div>
              )}

              {/* Carousel Cards */}
              {ad.cards && (
                <div className="space-y-3 mb-4">
                  <h5 className="text-lg font-bold text-white mb-3">{ad.headline}</h5>
                  <div className="grid grid-cols-3 gap-3">
                    {ad.cards.map((card, idx) => (
                      <div key={idx} className="bg-gray-900 rounded-lg p-4">
                        <div className="bg-gray-700 rounded h-32 mb-3 flex items-center justify-center text-gray-500 text-xs text-center p-2">
                          {card.image}
                        </div>
                        <h6 className="font-bold text-white text-sm mb-1">{card.headline}</h6>
                        <p className="text-xs text-gray-400 mb-2">{card.desc}</p>
                        <p className="text-blue-400 font-bold">{card.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Standard Ad */}
              {!ad.script && !ad.cards && (
                <div className="bg-gray-900 rounded-lg p-4 mb-4">
                  <div className="bg-gray-700 rounded h-48 mb-4 flex items-center justify-center text-gray-500 text-sm text-center p-4">
                    {ad.image}
                  </div>
                  <h5 className="text-lg font-bold text-white mb-2">{ad.headline}</h5>
                  <p className="text-gray-300 text-sm mb-4">{ad.description}</p>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium">
                    {ad.cta}
                  </button>
                </div>
              )}

              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="text-gray-400">Est. CTR:</span>
                  <span className="text-blue-400 font-bold ml-2">{ad.performance.ctr}%</span>
                </div>
                <div>
                  <span className="text-gray-400">Est. CVR:</span>
                  <span className="text-green-400 font-bold ml-2">{ad.performance.cvr}%</span>
                </div>
                <div>
                  <span className="text-gray-400">Engagement:</span>
                  <span className="text-purple-400 font-bold ml-2">{ad.performance.engagement}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {generatedAds.length === 0 && (
        <div className="bg-gray-800 rounded-xl p-12 text-center border-2 border-dashed border-gray-700">
          <IconComponent className="mx-auto text-gray-600 mb-4" size={48} />
          <h3 className="text-xl font-bold text-white mb-2">Ready to Generate</h3>
          <p className="text-gray-400">Click the button above to generate AI-powered {config.format} creative</p>
        </div>
      )}
    </div>
  );
}
