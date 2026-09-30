import React from 'react';
import { ShoppingBag } from 'lucide-react';

// Shared shell and field for the Login and Register screens
export const AuthField = ({ id, label, error, hint, ...inputProps }) => (
  <div>
    <label htmlFor={id} style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
      {label}
    </label>
    <input
      id={id}
      aria-invalid={!!error}
      style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, background: '#ffffff', border: `1px solid ${error ? '#ef4444' : '#d1d5db'}`, color: '#09090b' }}
      {...inputProps}
    />
    {error ? (
      <div style={{ color: '#dc2626', fontSize: '0.75rem', fontWeight: 600, marginTop: 4 }}>{error}</div>
    ) : hint && (
      <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: 4 }}>{hint}</div>
    )}
  </div>
);

export const AuthCard = ({ subtitle, onSubmit, children }) => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#f8fafc' }}>
    <form onSubmit={onSubmit} noValidate className="clean-card animate-fade-in" style={{ width: '100%', maxWidth: 380, padding: 28, borderRadius: 14 }}>
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
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{subtitle}</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {children}
      </div>
    </form>
  </div>
);
