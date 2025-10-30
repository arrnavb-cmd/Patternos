import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Zap } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const users = {
    'admin@zepto.com': { role: 'aggregator', brand: null, name: 'Zepto Admin' },
    'hul@zepto.com': { role: 'brand', brand: 'HUL', name: 'HUL Marketing' },
    'nike@zepto.com': { role: 'brand', brand: 'Nike', name: 'Nike India' },
    'pg@zepto.com': { role: 'brand', brand: 'P&G', name: 'P&G Marketing' },
    'boat@zepto.com': { role: 'brand', brand: 'boAt', name: 'boAt Team' },
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const user = users[email as keyof typeof users];
      
      if (user && password === 'demo123') {
        localStorage.setItem('user', JSON.stringify({
          email,
          role: user.role,
          brand: user.brand,
          name: user.name
        }));
        
        if (user.role === 'aggregator') {
          navigate('/');
        } else {
          navigate('/campaigns');
        }
      } else {
        setError('Invalid credentials. Try: admin@zepto.com / demo123');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-4 shadow-xl">
            <Zap className="text-purple-600" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Zepto Retail Media</h1>
          <p className="text-purple-200">Powered by PatternOS</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-700 mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p>🏢 Admin: <code className="bg-white px-2 py-0.5 rounded">admin@zepto.com</code></p>
              <p>🎨 HUL: <code className="bg-white px-2 py-0.5 rounded">hul@zepto.com</code></p>
              <p>Password: <code className="bg-white px-2 py-0.5 rounded">demo123</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
