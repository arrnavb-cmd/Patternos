import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Settings, LogOut, ChevronDown, ArrowLeft } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const brand = localStorage.getItem('brand') || user.username || 'Himalaya';
  
  // Check if user is Zepto admin (aggregator)
  const isAggregator = user?.username === 'zepto' || user?.username === 'admin' || user?.role === 'platform_admin';
  
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const canGoBack = location.pathname !== '/dashboard';

  return (
    <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {canGoBack && (
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="text-slate-400 hover:text-white" size={20} />
              </button>
            )}
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate(isAggregator ? '/dashboard' : `/brand/${brand}/dashboard`)}
            >
              <div className="text-2xl">⚡</div>
              <div>
                <h1 className="text-lg font-bold text-white">PatternOS</h1>
                <p className="text-xs text-slate-400">
                  {isAggregator ? 'Zepto Master' : (user.brand || 'Brand Dashboard')}
                </p>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {/* AGGREGATOR MENU (Zepto Admin) */}
            {isAggregator ? (
              <React.Fragment>
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === '/dashboard'
                      ? 'text-blue-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/intent')}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname.startsWith('/intent')
                      ? 'text-purple-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Intent Intelligence
                </button>
                <button
                  onClick={() => navigate('/analytics')}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === '/analytics'
                      ? 'text-blue-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Analytics
                </button>
                <button
                  onClick={() => navigate('/campaigns')}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname.startsWith('/campaigns')
                      ? 'text-green-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Campaigns
                </button>
                <button
                  onClick={() => navigate('/ad-approval')}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === '/ad-approval'
                      ? 'text-orange-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Ad Approval
                </button>
              </React.Fragment>
            ) : (
              /* BRAND MENU (Nike, Adidas, etc.) */
              <React.Fragment>
                <button
                  onClick={() => navigate(`/brand/${brand}/dashboard`)}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname.includes('/brand/') && location.pathname.includes('/dashboard')
                      ? 'text-blue-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate(`/brand/${brand}/campaigns`)}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname.includes('/campaigns')
                      ? 'text-blue-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Campaigns
                </button>
                <button
                  onClick={() => navigate(`/brand/${brand}/analytics`)}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname.includes('/brand/') && location.pathname.includes('/analytics')
                      ? 'text-blue-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Analytics
                </button>
                <button
                  onClick={() => navigate('/social')}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname.startsWith('/social')
                      ? 'text-blue-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Social Media
                </button>
              </React.Fragment>
            )}
          </nav>

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <div className={`w-8 h-8 rounded-full ${
                isAggregator 
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                  : 'bg-gradient-to-br from-blue-500 to-purple-500'
              } flex items-center justify-center`}>
                <span className="text-white font-bold text-sm">
                  {user.username?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-white">
                  {isAggregator ? 'Zepto Admin' : (user.brand || 'Nike')}
                </p>
                <p className="text-xs text-slate-400">{user.username || 'admin'}@zepto.com</p>
              </div>
              <ChevronDown className="text-slate-400" size={16} />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-2">
                <div className="px-4 py-3 border-b border-slate-700">
                  <p className="text-sm font-medium text-white">
                    {isAggregator ? 'Zepto Platform Admin' : user.brand}
                  </p>
                  <p className="text-xs text-slate-400">{user.username}@zepto.com</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {isAggregator ? 'Full Platform Access' : 'Brand Nike'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    navigate('/profile');
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-slate-700 transition-colors"
                >
                  <User className="text-slate-400" size={18} />
                  <span className="text-sm text-white">Profile Settings</span>
                </button>

                <button
                  onClick={() => {
                    navigate('/settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-slate-700 transition-colors"
                >
                  <Settings className="text-slate-400" size={18} />
                  <span className="text-sm text-white">Settings</span>
                </button>

                <div className="border-t border-slate-700 mt-2 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-slate-700 transition-colors text-red-400"
                  >
                    <LogOut size={18} />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
