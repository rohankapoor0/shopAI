import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { authService } from '../services/authService';

export const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (authService.login(username, password)) {
      onLogin();
    } else {
      setError('Invalid username or password');
    }
  };

  const inputStyle = { width: '100%', height: 42, padding: '0 14px', borderRadius: 8, background: '#ffffff', border: '1px solid #d1d5db', color: '#09090b' };
  const labelStyle = { fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#f8fafc' }}>
      <form onSubmit={handleSubmit} className="clean-card animate-fade-in" style={{ width: '100%', maxWidth: 380, padding: 28, borderRadius: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 20 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShoppingBag size={16} />
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#09090b', letterSpacing: '-0.02em' }}>ShopAI</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Admin sign in</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label htmlFor="login-username" style={labelStyle}>Username</label>
            <input
              id="login-username"
              type="text"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              style={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="login-password" style={labelStyle}>Password</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              style={inputStyle}
            />
          </div>

          {error && (
            <div role="alert" style={{ color: '#dc2626', fontSize: '0.82rem', fontWeight: 600 }}>{error}</div>
          )}

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
};
