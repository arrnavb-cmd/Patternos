import React from "react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Lock, Mail } from 'lucide-react';

export default function AggregatorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Mock login
    setTimeout(() => {
      localStorage.setItem('aggregator_token', 'mock-token-123');
      localStorage.setItem('aggregator', JSON.stringify({
        id: 'AGG_001',
        name: 'Zepto',
        domain: 'zepto.com',
        logo: '⚡',
        primary_color: '#7C3AED'
      }));
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building2 size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">PatternOS</h1>
          <p className="text-slate-400 text-sm">Aggregator Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              <Mail className="inline mr-2" size={16} />
              Aggregator Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
              placeholder="admin@zepto.com"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              <Lock className="inline mr-2" size={16} />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Access Platform'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
          <p className="text-purple-300 text-xs mb-2">Demo Credentials:</p>
          <p className="text-slate-300 text-sm">
            <strong>Email:</strong> admin@zepto.com<br />
            <strong>Password:</strong> demo123
          </p>
        </div>
      </div>
    </div>
  );
}
