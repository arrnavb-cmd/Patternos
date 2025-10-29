import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');
    
    if (!token || !storedUser) {
      navigate('/login', { replace: true });
      return;
    }
    
    try {
      setUser(JSON.parse(storedUser));
    } catch (e) {
      localStorage.clear();
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    navigate('/login', { replace: true });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header user={user} onLogout={handleLogout} />
      
      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome, {user.company_name}!</h1>
          <p className="text-slate-400">Retail Media Intelligence Dashboard</p>
        </div>

        {/* Four Intelligence Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Behavioral */}
          <div className="bg-slate-800 border border-blue-500 rounded-xl p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="text-blue-400 text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-2">Behavioral</h3>
            <p className="text-slate-400 text-sm">Search patterns & intent signals</p>
          </div>

          {/* Visual */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="text-slate-400 text-4xl mb-4">👁️</div>
            <h3 className="text-xl font-bold text-white mb-2">Visual</h3>
            <p className="text-slate-400 text-sm">Computer vision & in-store analytics</p>
          </div>

          {/* Voice */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="text-slate-400 text-4xl mb-4">🎤</div>
            <h3 className="text-xl font-bold text-white mb-2">Voice</h3>
            <p className="text-slate-400 text-sm">50+ languages, conversational commerce</p>
          </div>

          {/* Predictive */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="text-slate-400 text-4xl mb-4">✨</div>
            <h3 className="text-xl font-bold text-white mb-2">Predictive</h3>
            <p className="text-slate-400 text-sm">Pre-intent forecasting & GeoFlow</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800 rounded-xl p-6">
            <h4 className="text-slate-400 text-sm mb-2">Active Campaigns</h4>
            <p className="text-3xl font-bold text-white">12</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-6">
            <h4 className="text-slate-400 text-sm mb-2">Total Impressions</h4>
            <p className="text-3xl font-bold text-white">2.4M</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-6">
            <h4 className="text-slate-400 text-sm mb-2">Conversion Rate</h4>
            <p className="text-3xl font-bold text-white">3.8%</p>
          </div>
        </div>
      </main>
    </div>
  );
}
