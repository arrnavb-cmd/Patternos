import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, Zap, AlertCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = login(email, password);
    
    if (success) {
      // Navigate based on role (the context will have updated user)
      const storedSession = localStorage.getItem('patternos_session');
      if (storedSession) {
        const session = JSON.parse(storedSession);
        if (session.role === 'aggregator') {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/campaigns', { replace: true });
        }
      }
    } else {
      setError('Invalid credentials. Password must be exactly: demo123');
      setLoading(false);
    }
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
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-700 text-sm">{error}</p>
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
            <p className="text-xs font-semibold text-purple-900 mb-3">📋 Demo Accounts:</p>
            <div className="space-y-2 text-xs">
              <div className="bg-white p-2 rounded border border-purple-100">
                <p className="font-medium text-gray-700">🏢 Aggregator (Admin)</p>
                <p className="text-gray-600 mt-1">
                  Email: <code className="bg-purple-100 px-2 py-0.5 rounded text-purple-900">admin@zepto.com</code>
                </p>
              </div>
              <div className="bg-white p-2 rounded border border-purple-100">
                <p className="font-medium text-gray-700">👟 Brand (Nike)</p>
                <p className="text-gray-600 mt-1">
                  Email: <code className="bg-purple-100 px-2 py-0.5 rounded text-purple-900">nike@zepto.com</code>
                </p>
              </div>
              <div className="bg-white p-2 rounded border border-purple-100">
                <p className="font-medium text-gray-700">🔐 Password (All accounts)</p>
                <p className="text-gray-600 mt-1">
                  <code className="bg-red-100 px-2 py-0.5 rounded text-red-900 font-bold">demo123</code>
                  <span className="text-red-600 ml-2">(exact match required)</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
