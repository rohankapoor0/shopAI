import React, { useEffect, useState } from 'react';
import { 
  Store, 
  Save, 
  Check, 
  ExternalLink, 
  Sparkles,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';
import { storeService } from '../../services/storeService';

export const Settings = ({ navigate }) => {
  const [store, setStore] = useState(null);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    const load = async () => {
      const activeId = storeService.getActiveStoreId();
      const current = await storeService.getStoreById(activeId);
      setStore(current);
    };
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!store) return;
    await storeService.updateStore(store.id, store);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  if (!store) return null;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
          Store Settings
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 2 }}>
          Configure storefront branding, contact coordinates, handle URLs, and policies
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Brand identity */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 16 }}>
            Brand Identity & Appearance
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                Store Name
              </label>
              <input
                type="text"
                value={store.name}
                onChange={(e) => setStore({ ...store, name: e.target.value })}
                style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#ffffff' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                Tagline / Pitch
              </label>
              <input
                type="text"
                value={store.tagline || ''}
                onChange={(e) => setStore({ ...store, tagline: e.target.value })}
                style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#ffffff' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                Store Description
              </label>
              <textarea
                rows={3}
                value={store.description}
                onChange={(e) => setStore({ ...store, description: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#ffffff', resize: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                  Logo URL
                </label>
                <input
                  type="text"
                  value={store.logo}
                  onChange={(e) => setStore({ ...store, logo: e.target.value })}
                  style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#ffffff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                  Banner URL
                </label>
                <input
                  type="text"
                  value={store.banner}
                  onChange={(e) => setStore({ ...store, banner: e.target.value })}
                  style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#ffffff' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* URL Handle */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 16 }}>
            Storefront Domain & Handle
          </h2>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
              Store Handle
            </label>
            <input
              type="text"
              value={store.handle}
              onChange={(e) => setStore({ ...store, handle: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
              style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#ffffff', fontFamily: 'var(--font-mono)' }}
            />
          </div>

          <div style={{ marginTop: 12, fontSize: '0.85rem', color: '#60a5fa' }}>
            Store URL: <strong>shopai.com/store/{store.handle}</strong>
          </div>
        </div>

        {/* Dispatch Location */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 16 }}>
            Contact & Workshop Location
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                  Proprietor Name
                </label>
                <input
                  type="text"
                  value={store.owner.name}
                  onChange={(e) => setStore({ ...store, owner: { ...store.owner, name: e.target.value } })}
                  style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#ffffff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={store.owner.email}
                  onChange={(e) => setStore({ ...store, owner: { ...store.owner, email: e.target.value } })}
                  style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#ffffff' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                Street Address
              </label>
              <input
                type="text"
                value={store.location.address}
                onChange={(e) => setStore({ ...store, location: { ...store.location, address: e.target.value } })}
                style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#ffffff' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                  City
                </label>
                <input
                  type="text"
                  value={store.location.city}
                  onChange={(e) => setStore({ ...store, location: { ...store.location, city: e.target.value } })}
                  style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#ffffff' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                  State
                </label>
                <input
                  type="text"
                  value={store.location.state}
                  onChange={(e) => setStore({ ...store, location: { ...store.location, state: e.target.value } })}
                  style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#ffffff' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                  PIN Code
                </label>
                <input
                  type="text"
                  value={store.location.pincode}
                  onChange={(e) => setStore({ ...store, location: { ...store.location, pincode: e.target.value } })}
                  style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#ffffff' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            type="submit"
            className="btn-primary"
            style={{ padding: '12px 28px', fontSize: '0.95rem' }}
          >
            <Save size={16} />
            <span>Save Store Settings</span>
          </button>

          {savedMessage && (
            <span style={{ color: '#34d399', fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Check size={16} />
              <span>Settings updated successfully!</span>
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
