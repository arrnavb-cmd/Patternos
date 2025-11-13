import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://patternos-production.up.railway.app/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error('Invalid credentials');

      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Determine dashboard based on username
      if (username === 'admin' || username === 'zepto') {
        navigate('/dashboard');
      } else {
        // Brand login - store brand info
        localStorage.setItem('brand', username);
        navigate(`/brand/${username}/dashboard`);
      }
    } catch (err) {
      // Fallback: Demo login
      const validLogins = {
        'admin': 'admin123',
        'zepto': 'zepto123',
        'nike': 'nike123',
        'adidas': 'adidas123',
        'britannia': 'britannia123',
        'lakme': 'lakme123',
        'itc': 'itc123',
        'amul': 'amul123',
      };

      if (validLogins[username] === password) {
        const demoUser = {
          username: username,
          role: (username === 'admin' || username === 'zepto') ? 'admin' : 'brand_admin',
          name: username.charAt(0).toUpperCase() + username.slice(1)
        };
        
        localStorage.setItem('access_token', 'demo_token_' + username);
        localStorage.setItem('user', JSON.stringify(demoUser));
        
        if (username === 'admin' || username === 'zepto') {
          navigate('/dashboard');
        } else {
          localStorage.setItem('brand', username);
          navigate(`/brand/${username}/dashboard`);
        }
      } else {
        setError('Invalid username or password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ background: 'white', padding: '48px', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1a202c' }}>PatternOS</h1>
          <p style={{ color: '#718096', fontSize: '14px' }}>Retail Media Intelligence</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Username</label>
            <input 
              type="text" 
              autoComplete="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px', boxSizing: 'border-box' }} 
            />
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Password</label>
            <input 
              type="password" 
              autoComplete="current-password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px', boxSizing: 'border-box' }} 
            />
          </div>
          
          {error && <div style={{ padding: '12px', marginBottom: '20px', background: '#fee', borderRadius: '8px', color: '#c33', fontSize: '14px' }}>{error}</div>}
          
          <button 
            type="submit" 
            disabled={loading} 
            style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div style={{ marginTop: '20px', padding: '16px', background: '#f7fafc', borderRadius: '8px', fontSize: '12px', color: '#4a5568' }}>
          <div style={{ fontWeight: '600', marginBottom: '8px' }}>Test Credentials:</div>
          <div><strong>Aggregator:</strong> admin / admin123 or zepto / zepto123</div>
          <div><strong>Brands:</strong> nike / nike123, adidas / adidas123, etc.</div>
        </div>
      </div>
    </div>
  );
};

export default Login;
