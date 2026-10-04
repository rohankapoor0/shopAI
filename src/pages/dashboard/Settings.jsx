import React, { useEffect, useState } from 'react';
import {
  Save,
  Check
} from 'lucide-react';
import { storeService } from '../../services/storeService';

export const Settings = ({ navigate }) => {
  const [store, setStore] = useState(null);
  const [savedMessage, setSavedMessage] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const activeId = storeService.getActiveStoreId();
      const current = await storeService.getStoreById(activeId);
      setStore(current);
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!store) return;
    try {
      setStore(await storeService.updateStore(store.id, store));
      setSaveError('');
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 2500);
    } catch (err) {
      setSaveError(err.message);
    }
  };

  if (loading) return <div style={{ padding: 40, color: 'var(--text-muted)' }}>Loading settings...</div>;
  if (!store) return <div style={{ padding: 40, color: 'var(--text-muted)' }}>Store not found.</div>;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 860 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          Store Settings
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 2 }}>
          Configure storefront branding, contact coordinates, handle URLs, and policies
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Brand identity */}
        <div className="clean-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 16 }}>
            Brand Identity & Appearance
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 6 }}>
                Store Name
              </label>
              <input
                type="text"
                value={store.name}
                onChange={(e) => setStore({ ...store, name: e.target.value })}
                style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 6 }}>
                Tagline / Pitch
              </label>
              <input
                type="text"
                value={store.tagline || ''}
                onChange={(e) => setStore({ ...store, tagline: e.target.value })}
                style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 6 }}>
                Store Description
              </label>
              <textarea
                rows={3}
                value={store.description}
                onChange={(e) => setStore({ ...store, description: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-subtle)', color: 'var(--text-main)', resize: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 6 }}>
                  Logo URL
                </label>
                <input
                  type="text"
                  value={store.logo}
                  onChange={(e) => setStore({ ...store, logo: e.target.value })}
                  style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 6 }}>
                  Banner URL
                </label>
                <input
                  type="text"
                  value={store.banner}
                  onChange={(e) => setStore({ ...store, banner: e.target.value })}
                  style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* URL Handle */}
        <div className="clean-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 16 }}>
            Storefront Domain & Handle
          </h2>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 6 }}>
              Store Handle
            </label>
            <input
              type="text"
              value={store.handle}
              onChange={(e) => setStore({ ...store, handle: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
              style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, border: '1px solid var(--border-subtle)', color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}
            />
          </div>

          <div style={{ marginTop: 12, fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Store URL: <strong style={{ color: 'var(--text-main)' }}>shopai.com/store/{store.handle}</strong>
          </div>
        </div>

        {/* Dispatch Location */}
        <div className="clean-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 16 }}>
            Contact & Workshop Location
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 6 }}>
                  Proprietor Name
                </label>
                <input
                  type="text"
                  value={store.owner?.name || ''}
                  onChange={(e) => setStore({ ...store, owner: { ...store.owner, name: e.target.value } })}
                  style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 6 }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={store.owner?.email || ''}
                  onChange={(e) => setStore({ ...store, owner: { ...store.owner, email: e.target.value } })}
                  style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 6 }}>
                Street Address
              </label>
              <input
                type="text"
                value={store.location?.address || ''}
                onChange={(e) => setStore({ ...store, location: { ...store.location, address: e.target.value } })}
                style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 6 }}>
                  City
                </label>
                <input
                  type="text"
                  value={store.location?.city || ''}
                  onChange={(e) => setStore({ ...store, location: { ...store.location, city: e.target.value } })}
                  style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 6 }}>
                  State
                </label>
                <input
                  type="text"
                  value={store.location?.state || ''}
                  onChange={(e) => setStore({ ...store, location: { ...store.location, state: e.target.value } })}
                  style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 6 }}>
                  PIN Code
                </label>
                <input
                  type="text"
                  value={store.location?.pincode || ''}
                  onChange={(e) => setStore({ ...store, location: { ...store.location, pincode: e.target.value } })}
                  style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
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
            style={{ padding: '10px 24px', fontSize: '0.9rem' }}
          >
            <Save size={16} />
            <span>Save Store Settings</span>
          </button>

          {savedMessage && (
            <span style={{ color: 'var(--success)', fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Check size={16} />
              <span>Settings updated successfully!</span>
            </span>
          )}
          {saveError && (
            <span role="alert" style={{ color: 'var(--error)', fontSize: '0.88rem', fontWeight: 600 }}>
              {saveError}
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
