import React from "react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Palette, Save, Eye, Building2, Globe, 
  Image, Type, Sparkles, Check 
} from 'lucide-react';

export default function WhiteLabelSettings() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    company_name: 'Zepto',
    domain: 'zepto.com',
    logo_emoji: '⚡',
    primary_color: '#7C3AED',
    secondary_color: '#3B82F6',
    accent_color: '#10B981',
    font_family: 'Inter',
    platform_name: 'Zepto Retail Media',
    tagline: 'Advertise on India\'s fastest delivery platform',
    support_email: 'ads@zepto.com',
    homepage_banner: 'Reach millions of shoppers in 10 minutes',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    language: 'English'
  });

  const [previewMode, setPreviewMode] = useState(false);

  const handleSave = () => {
    localStorage.setItem('aggregator', JSON.stringify({
      id: 'AGG_001',
      name: settings.company_name,
      domain: settings.domain,
      logo: settings.logo_emoji,
      primary_color: settings.primary_color
    }));
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const colorPresets = [
    { name: 'Purple', primary: '#7C3AED', secondary: '#3B82F6' },
    { name: 'Blue', primary: '#3B82F6', secondary: '#06B6D4' },
    { name: 'Green', primary: '#10B981', secondary: '#059669' },
    { name: 'Orange', primary: '#F97316', secondary: '#EA580C' },
    { name: 'Pink', primary: '#EC4899', secondary: '#DB2777' },
    { name: 'Red', primary: '#EF4444', secondary: '#DC2626' }
  ];

  const emojiOptions = ['⚡', '🛒', '📦', '🚀', '🎯', '💎', '🔥', '⭐', '🌟', '💫'];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-slate-400 hover:text-white"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center gap-3">
                <Palette className="text-purple-400" size={24} />
                <h1 className="text-xl font-bold text-white">White-Label Settings</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium flex items-center gap-2"
              >
                <Eye size={20} />
                {previewMode ? 'Edit Mode' : 'Preview'}
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium flex items-center gap-2"
              >
                <Save size={20} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {saved && (
          <div className="mb-6 bg-green-500/20 border border-green-500 rounded-lg p-4 flex items-center gap-3">
            <Check className="text-green-400" size={24} />
            <p className="text-green-400 font-medium">Settings saved successfully!</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Brand Identity */}
            <div className="bg-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Building2 className="text-blue-400" size={24} />
                <h2 className="text-xl font-bold text-white">Brand Identity</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={settings.company_name}
                    onChange={(e) => setSettings({...settings, company_name: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Platform Name
                  </label>
                  <input
                    type="text"
                    value={settings.platform_name}
                    onChange={(e) => setSettings({...settings, platform_name: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => setSettings({...settings, tagline: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Domain
                  </label>
                  <input
                    type="text"
                    value={settings.domain}
                    onChange={(e) => setSettings({...settings, domain: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Logo Emoji
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {emojiOptions.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => setSettings({...settings, logo_emoji: emoji})}
                        className={`w-16 h-16 text-3xl rounded-lg transition-all ${
                          settings.logo_emoji === emoji
                            ? 'bg-blue-500 scale-110'
                            : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Color Scheme */}
            <div className="bg-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Palette className="text-purple-400" size={24} />
                <h2 className="text-xl font-bold text-white">Color Scheme</h2>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Primary Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settings.primary_color}
                      onChange={(e) => setSettings({...settings, primary_color: e.target.value})}
                      className="w-16 h-12 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.primary_color}
                      onChange={(e) => setSettings({...settings, primary_color: e.target.value})}
                      className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Secondary Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settings.secondary_color}
                      onChange={(e) => setSettings({...settings, secondary_color: e.target.value})}
                      className="w-16 h-12 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.secondary_color}
                      onChange={(e) => setSettings({...settings, secondary_color: e.target.value})}
                      className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Accent Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settings.accent_color}
                      onChange={(e) => setSettings({...settings, accent_color: e.target.value})}
                      className="w-16 h-12 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.accent_color}
                      onChange={(e) => setSettings({...settings, accent_color: e.target.value})}
                      className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-3">
                  Color Presets
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {colorPresets.map(preset => (
                    <button
                      key={preset.name}
                      onClick={() => setSettings({
                        ...settings,
                        primary_color: preset.primary,
                        secondary_color: preset.secondary
                      })}
                      className="p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all"
                    >
                      <div className="flex gap-2 mb-2">
                        <div
                          className="w-8 h-8 rounded-lg"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <div
                          className="w-8 h-8 rounded-lg"
                          style={{ backgroundColor: preset.secondary }}
                        />
                      </div>
                      <p className="text-white text-sm font-medium">{preset.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact & Support */}
            <div className="bg-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Globe className="text-green-400" size={24} />
                <h2 className="text-xl font-bold text-white">Contact & Support</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={settings.support_email}
                    onChange={(e) => setSettings({...settings, support_email: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Homepage Banner Text
                  </label>
                  <input
                    type="text"
                    value={settings.homepage_banner}
                    onChange={(e) => setSettings({...settings, homepage_banner: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-xl p-6 sticky top-8">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="text-yellow-400" size={24} />
                <h2 className="text-xl font-bold text-white">Live Preview</h2>
              </div>

              {/* Preview */}
              <div className="bg-slate-900 rounded-xl p-6 border-2 border-slate-700">
                {/* Header Preview */}
                <div 
                  className="rounded-lg p-4 mb-4"
                  style={{ 
                    background: `linear-gradient(135deg, ${settings.primary_color}, ${settings.secondary_color})` 
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-3xl">{settings.logo_emoji}</div>
                    <div>
                      <p className="text-white font-bold">{settings.platform_name}</p>
                      <p className="text-white text-xs opacity-80">{settings.tagline}</p>
                    </div>
                  </div>
                </div>

                {/* Button Preview */}
                <div className="space-y-3">
                  <button
                    className="w-full py-3 rounded-lg font-medium text-white transition-all"
                    style={{ backgroundColor: settings.primary_color }}
                  >
                    Primary Button
                  </button>
                  <button
                    className="w-full py-3 rounded-lg font-medium text-white transition-all"
                    style={{ backgroundColor: settings.secondary_color }}
                  >
                    Secondary Button
                  </button>
                  <button
                    className="w-full py-3 rounded-lg font-medium text-white transition-all"
                    style={{ backgroundColor: settings.accent_color }}
                  >
                    Accent Button
                  </button>
                </div>

                {/* Color Palette */}
                <div className="mt-6">
                  <p className="text-slate-400 text-xs mb-3">Color Palette</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <div
                        className="w-full h-12 rounded-lg mb-1"
                        style={{ backgroundColor: settings.primary_color }}
                      />
                      <p className="text-slate-400 text-xs">Primary</p>
                    </div>
                    <div>
                      <div
                        className="w-full h-12 rounded-lg mb-1"
                        style={{ backgroundColor: settings.secondary_color }}
                      />
                      <p className="text-slate-400 text-xs">Secondary</p>
                    </div>
                    <div>
                      <div
                        className="w-full h-12 rounded-lg mb-1"
                        style={{ backgroundColor: settings.accent_color }}
                      />
                      <p className="text-slate-400 text-xs">Accent</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-blue-300 text-sm">
                  💡 <strong>Tip:</strong> Changes are applied instantly. Click "Save Changes" to persist your customization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
