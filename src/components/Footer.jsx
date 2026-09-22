import React from 'react';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw, Sparkles, Heart } from 'lucide-react';

export const Footer = ({ navigate }) => {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-surface)',
      borderTop: '1px solid var(--border-subtle)',
      paddingTop: 48,
      paddingBottom: 32,
      marginTop: 64
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 20px'
      }}>
        {/* Value Prop Badges */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 24,
          paddingBottom: 40,
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'rgba(59, 130, 246, 0.12)',
              color: '#60a5fa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Truck size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>Free Express Delivery</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>On all orders above ₹1,500</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'rgba(16, 185, 129, 0.12)',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>100% Genuine Brands</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verified independent sellers</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'rgba(139, 92, 246, 0.12)',
              color: '#a78bfa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <RefreshCw size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>Hassle-Free Returns</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>7-day seamless doorstep pickup</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'rgba(245, 158, 11, 0.12)',
              color: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>Shopify-Grade Architecture</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Engineered for hyperscale</div>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 32,
          paddingTop: 40,
          paddingBottom: 40
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShoppingBag size={15} color="#ffffff" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>ShopAI</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              India's premier multi-vendor commerce platform connecting independent boutique brands with discerning customers.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-subtle)', marginBottom: 14 }}>
              Marketplace
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li><button onClick={() => navigate('/stores')}>All Stores</button></li>
              <li><button onClick={() => navigate('/products')}>Featured Catalog</button></li>
              <li><button onClick={() => navigate('/products?category=Fashion')}>Fashion & Apparel</button></li>
              <li><button onClick={() => navigate('/products?category=Electronics')}>Electronics & Audio</button></li>
              <li><button onClick={() => navigate('/products?category=Home')}>Home & Lighting</button></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-subtle)', marginBottom: 14 }}>
              For Sellers
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li><button onClick={() => navigate('/sell')} style={{ color: '#818cf8', fontWeight: 600 }}>Sell on ShopAI</button></li>
              <li><button onClick={() => navigate('/sell/create')}>Store Onboarding</button></li>
              <li><button onClick={() => navigate('/dashboard')}>Merchant Dashboard</button></li>
              <li><button onClick={() => navigate('/dashboard/products')}>Product Inventory</button></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-subtle)', marginBottom: 14 }}>
              Customer Support
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li><button onClick={() => navigate('/orders')}>Track Your Order</button></li>
              <li><button onClick={() => navigate('/orders')}>Request Return / Refund</button></li>
              <li><button onClick={() => navigate('/profile')}>Saved Addresses</button></li>
              <li><button onClick={() => navigate('/profile')}>Customer Profile</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: 24,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          fontSize: '0.82rem',
          color: 'var(--text-subtle)'
        }}>
          <div>
            © 2026 ShopAI Multi-Vendor Prototype. Crafted with precision for high-performance e-commerce.
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <span>Local Storage Mock Mode</span>
            <span>•</span>
            <span>INR Pricing Engine</span>
            <span>•</span>
            <span>Cloud Service Decoupled</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
