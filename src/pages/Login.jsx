import React, { useState } from 'react';
import { authService } from '../services/authService';
import { AuthCard, AuthField } from '../components/AuthCard';

export const Login = ({ navigate, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = await authService.login(username, password);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError(err.message || 'Could not reach the server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard subtitle="Sign in" onSubmit={handleSubmit}>
      <AuthField
        id="login-username"
        label="Username or email"
        type="text"
        autoComplete="username"
        autoFocus
        value={username}
        onChange={(e) => { setUsername(e.target.value); setError(''); }}
      />
      <AuthField
        id="login-password"
        label="Password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => { setPassword(e.target.value); setError(''); }}
      />

      {error && (
        <div role="alert" style={{ color: '#dc2626', fontSize: '0.82rem', fontWeight: 600 }}>{error}</div>
      )}

      <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
        {submitting ? 'Signing in...' : 'Sign in'}
      </button>

      <div style={{ fontSize: '0.82rem', color: '#64748b', textAlign: 'center' }}>
        New to ShopAI?{' '}
        <button type="button" onClick={() => navigate('/register')} style={{ color: '#09090b', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          Create an account
        </button>
      </div>
    </AuthCard>
  );
};
