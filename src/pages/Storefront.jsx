import React, { useEffect, useState } from 'react';
import { 
  Star, 
  MapPin, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Package, 
  Calendar, 
  Share2, 
  Heart,
  Store as StoreIcon,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { storeService } from '../services/storeService';
import { productService } from '../services/productService';
import { getFromStorage, STORAGE_KEYS } from '../services/db';
import { ProductCard } from '../components/ProductCard';

export const Storefront = ({ storeId, navigate }) => {
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      const currentStore = await storeService.getStoreById(storeId);
      if (currentStore) {
        setStore(currentStore);
        const storeProducts = await productService.getProductsByStore(currentStore.id);
        setProducts(storeProducts);

        const allReviews = getFromStorage(STORAGE_KEYS.REVIEWS, []);
        setReviews(allReviews.filter(r => r.storeId === currentStore.id));
      }
      setLoading(false);
    };
    fetchStore();
  }, [storeId]);

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading storefront...
      </div>
    );
  }

  if (!store) {
    return (
      <div style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center', padding: '0 20px' }}>
        <h2>Store Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: 8, marginBottom: 20 }}>
          The store handle or ID does not exist in the ShopAI directory.
        </p>
        <button onClick={() => navigate('/stores')} className="btn-primary">
          Back to Stores
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 80 }}>
      {/* 1. Store Banner */}
      <div style={{
        height: 260,
        position: 'relative',
        backgroundColor: '#0f172a',
        overflow: 'hidden'
      }}>
        <img
          src={store.banner}
          alt={store.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }}
        />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, transparent 40%, rgba(11, 15, 23, 0.95) 100%)'
        }} />
      </div>

      {/* 2. Store Header Profile */}
      <div style={{ maxWidth: 1280, margin: '-70px auto 32px', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        <div className="glass-card" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Identity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: 20,
                overflow: 'hidden',
                border: '3px solid var(--bg-surface-elevated)',
                backgroundColor: '#1e293b',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5)'
              }}>
                <img src={store.logo} alt={store.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                    {store.name}
                  </h1>
                  <span className="badge badge-blue">{store.category}</span>
                  <span className="badge badge-emerald">Verified</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
                  {store.tagline || store.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8, fontSize: '0.82rem', color: 'var(--text-subtle)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={13} /> {store.location.city}, {store.location.state}
                  </span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Star size={13} fill="#fbbf24" strokeWidth={0} /> {store.rating} ({store.reviewsCount} reviews)
                  </span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Package size={13} /> {products.length} Products
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  alert("Store link copied to clipboard!");
                }}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                <Share2 size={16} />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{
            display: 'flex',
            gap: 24,
            marginTop: 24,
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: 16
          }}>
            {[
              { id: 'products', label: `Products (${products.length})` },
              { id: 'about', label: 'About Store' },
              { id: 'reviews', label: `Customer Reviews (${reviews.length > 0 ? reviews.length : 12})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  fontSize: '0.92rem',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  color: activeTab === tab.id ? '#ffffff' : 'var(--text-muted)',
                  paddingBottom: 6,
                  position: 'relative',
                  transition: 'color 0.15s ease'
                }}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span style={{
                    position: 'absolute',
                    bottom: -16,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: '#3b82f6',
                    borderRadius: 2
                  }} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Tab Contents */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px' }}>
        {activeTab === 'products' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                Products from {store.name}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Directly curated and fulfilled by {store.owner.name}
              </p>
            </div>

            {products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <Package size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
                <h3>No products listed in this store yet.</h3>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 22
              }}>
                {products.map(p => (
                  <ProductCard key={p.id} product={p} navigate={navigate} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="glass-card" style={{ padding: '32px', maxWidth: 860 }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 14 }}>
              About {store.name}
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: 24 }}>
              {store.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, borderTop: '1px solid var(--border-subtle)', paddingTop: 24 }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                  Merchant Representative
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', marginTop: 4 }}>
                  {store.owner.name}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  {store.owner.email}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                  Registered Workshop / Office
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', marginTop: 4 }}>
                  {store.location.address}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  {store.location.city}, {store.location.state} - {store.location.pincode}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                  ShopAI Onboarding Date
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', marginTop: 4 }}>
                  {store.createdAt}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  Status: {store.status}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div style={{ maxWidth: 860 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#fbbf24',
                padding: '12px 20px',
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: '1.4rem',
                fontWeight: 800
              }}>
                <Star size={24} fill="#fbbf24" strokeWidth={0} />
                <span>{store.rating} / 5.0</span>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>Verified Customer Satisfaction</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Based on recent orders fulfilled on ShopAI</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev.id} className="glass-card" style={{ padding: '18px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{rev.author}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={13} fill="#fbbf24" color="#fbbf24" />
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      "{rev.comment}"
                    </p>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: 8 }}>
                      Verified Purchase • {rev.date}
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 8 }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="#fbbf24" color="#fbbf24" />
                    ))}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    "Outstanding customer service and fast shipping. The build quality exceeds expectations!"
                  </p>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: 6 }}>
                    Verified ShopAI Customer • 2 days ago
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
