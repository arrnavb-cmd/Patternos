import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import CreateCampaign from './pages/campaigns/CreateCampaign';
import CampaignsList from './pages/campaigns/CampaignsList';
import Analytics from './pages/campaigns/Analytics';
import Dashboard from './pages/Dashboard';
import { Layout, LogOut, User } from 'lucide-react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
}

function Navigation() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-2 rounded-lg">
                <Layout className="text-white" size={24} />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">Zepto Retail Media</span>
                <p className="text-xs text-gray-500">Powered by PatternOS</p>
              </div>
            </div>
            
            <div className="flex gap-1">
              
                href="/"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition"
              >
                {user.role === 'aggregator' ? 'Dashboard' : 'My Campaigns'}
              </a>
              {user.role === 'brand' && (
                <>
                  
                    href="/campaigns/create"
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition"
                  >
                    Create Campaign
                  </a>
                  
                    href="/analytics"
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition"
                  >
                    Analytics
                  </a>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg">
              <User size={18} className="text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">
                  {user.role === 'aggregator' ? 'Admin' : user.brand}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {user?.role === 'aggregator' ? <Dashboard /> : <CampaignsList />}
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/campaigns"
          element={
            <ProtectedRoute>
              <CampaignsList />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/campaigns/create"
          element={
            <ProtectedRoute>
              <CreateCampaign />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
