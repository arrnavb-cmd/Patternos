import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      if (!response.ok) throw new Error('Invalid credentials');
      
      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Check role and redirect accordingly
      if (data.user.role === 'brand') {
        // Brand login - use brand name from API response
        const brandName = data.user.username; // This will be "Himalaya", not email
        localStorage.setItem('brand', brandName);
        navigate(`/brand/${brandName}/dashboard`);
      } else {
        // Aggregator login
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '32px', backgroundColor: '#1e293b', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: '24px' }}>PatternOS Login</h2>
        {error && <div style={{ padding: '12px', backgroundColor: '#7f1d1d', color: '#fecaca', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#94a3b8', marginBottom: '8px' }}>Email / Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px', border: '2px solid #334155', borderRadius: '8px', backgroundColor: '#0f172a', color: 'white', boxSizing: 'border-box' }} 
            />
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#94a3b8', marginBottom: '8px' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px', border: '2px solid #334155', borderRadius: '8px', backgroundColor: '#0f172a', color: 'white', boxSizing: 'border-box' }} 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', padding: '14px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#334155', borderRadius: '8px' }}>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', fontWeight: '600' }}>Demo Credentials:</p>
          <p style={{ fontSize: '11px', color: '#cbd5e1', marginBottom: '4px' }}>Aggregator: admin / admin123</p>
          <p style={{ fontSize: '11px', color: '#cbd5e1' }}>Brand: himalaya@brand.com / Himalaya@2025</p>
        </div>
      </div>
    </div>
  );
}
