import React from 'react';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw, Sparkles } from 'lucide-react';

export const Footer = ({ navigate }) => {
  return (
    <footer style={{
      backgroundColor: '#ffffff',
      borderTop: '1px solid var(--border-subtle)',
      paddingTop: 54,
      paddingBottom: 36,
      marginTop: 64
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 24px'
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
              background: 'var(--bg-muted)',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-subtle)'
            }}>
              <Truck size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>Free Direct Dispatch</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>On all orders above ₹1,500</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'var(--success-tint)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--success-border)'
            }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>100% Verified Stores</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Authentic independent labels</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'var(--primary-tint)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--primary-border)'
            }}>
              <RefreshCw size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>Hassle-Free Returns</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>7-day doorstep pickup guarantee</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: '#faf5ff',
              color: '#7c3aed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #e9d5ff'
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>Secure Checkout</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Signed-in accounts, server-verified orders</div>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: 32,
          paddingTop: 44,
          paddingBottom: 44
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShoppingBag size={15} color="#ffffff" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-main)' }}>ShopAI</span>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              The multi-vendor commerce marketplace connecting discerning shoppers with independent brands and studios across India.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-subtle)', marginBottom: 14 }}>
              Marketplace
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li><button onClick={() => navigate('/stores')} style={{ transition: 'color 0.15s' }}>All Stores</button></li>
              <li><button onClick={() => navigate('/products')} style={{ transition: 'color 0.15s' }}>Curated Catalog</button></li>
              <li><button onClick={() => navigate('/products?category=Fashion')} style={{ transition: 'color 0.15s' }}>Fashion & Apparel</button></li>
              <li><button onClick={() => navigate('/products?category=Electronics')} style={{ transition: 'color 0.15s' }}>Electronics & Audio</button></li>
              <li><button onClick={() => navigate('/products?category=Home')} style={{ transition: 'color 0.15s' }}>Home Living</button></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-subtle)', marginBottom: 14 }}>
              For Merchants
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li><button onClick={() => navigate('/sell')} style={{ color: 'var(--text-main)', fontWeight: 700 }}>Sell on ShopAI</button></li>
              <li><button onClick={() => navigate('/sell/create')} style={{ transition: 'color 0.15s' }}>Store Registration</button></li>
              <li><button onClick={() => navigate('/dashboard')} style={{ transition: 'color 0.15s' }}>Store Dashboard</button></li>
              <li><button onClick={() => navigate('/dashboard/products')} style={{ transition: 'color 0.15s' }}>Catalog Management</button></li>
              <li><button onClick={() => navigate('/dashboard/orders')} style={{ transition: 'color 0.15s' }}>Order Fulfillment</button></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-subtle)', marginBottom: 14 }}>
              Customer Care
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li><button onClick={() => navigate('/orders')} style={{ transition: 'color 0.15s' }}>Track Orders</button></li>
              <li><button onClick={() => navigate('/profile')} style={{ transition: 'color 0.15s' }}>Account Profile</button></li>
              <li><button onClick={() => navigate('/cart')} style={{ transition: 'color 0.15s' }}>Shopping Bag</button></li>
              <li><button onClick={() => navigate('/orders')} style={{ transition: 'color 0.15s' }}>Returns & Refunds</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          paddingTop: 24,
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          fontSize: '0.82rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} ShopAI Marketplace Technologies Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span>Made in India</span>
            <span>•</span>
            <span>Powered by AWS</span>
            <span>•</span>
            <span>Prices in INR</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
