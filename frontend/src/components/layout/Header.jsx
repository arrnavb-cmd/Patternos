import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Settings, LogOut, ChevronDown, ArrowLeft } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const brand = localStorage.getItem('brand') || user.brand || user.username || 'Brand';
  console.log('🏷️ Current brand:', brand, 'User:', user);
  
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
              /* BRAND MENU ({brand}, Adidas, etc.) */
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
              </React.Fragment>
            )}
          </nav>

          <div className="relative">
            <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {brand ? brand[0].toUpperCase() : 'B'}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">{brand}</p>
                  <p className="text-xs text-slate-400">{user?.email || 'user@brand.com'}</p>
                </div>
              </button>

            {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
                  <div className="p-4 border-b border-slate-700">
                    <p className="text-sm font-medium text-white">{user?.email || brand + '@brand.com'}</p>
                    <p className="text-xs text-slate-400 mt-1">{brand}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded transition"
                    >
                      Profile Settings
                    </button>
                    <button
                      onClick={() => {
                        localStorage.clear();
                        navigate('/login');
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-slate-700 rounded transition"
                    >
                      Logout
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
