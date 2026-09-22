import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Store, 
  Search, 
  User, 
  ShoppingCart, 
  Sparkles, 
  Menu, 
  X, 
  LayoutDashboard,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { storeService } from '../services/storeService';

export const Navbar = ({ currentPath, navigate }) => {
  const { totalCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const activeStoreId = storeService.getActiveStoreId();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Stores', path: '/stores' },
    { label: 'Products', path: '/products' },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'rgba(11, 15, 23, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)'
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 20px',
        height: 72,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => navigate('/')} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 10, 
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)'
          }}>
            <ShoppingBag size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ 
                fontSize: '1.35rem', 
                fontWeight: 800, 
                letterSpacing: '-0.03em',
                background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                ShopAI
              </span>
              <span className="badge badge-blue" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                MARKETPLACE
              </span>
            </div>
          </div>
        </div>

        {/* Center Desktop Navigation */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: 28,
          margin: '0 10px'
        }} className="desktop-nav">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                style={{
                  fontSize: '0.92rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 0',
                  position: 'relative',
                  transition: 'color 0.15s ease'
                }}
              >
                {link.label}
                {isActive && (
                  <span style={{
                    position: 'absolute',
                    bottom: -2,
                    left: 0,
                    right: 0,
                    height: 2,
                    borderRadius: 2,
                    background: '#3b82f6'
                  }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{
          flex: 1,
          maxWidth: 380,
          position: 'relative',
          display: 'none'
        }} className="desktop-search">
          <Search size={17} style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-subtle)',
            pointerEvents: 'none'
          }} />
          <input
            type="text"
            placeholder="Search stores, products, brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: 40,
              paddingLeft: 42,
              paddingRight: 16,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              color: '#ffffff',
              fontSize: '0.88rem',
              outline: 'none',
              transition: 'border-color 0.2s ease, background 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.background = 'rgba(255, 255, 255, 0.08)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-subtle)';
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          />
        </form>

        {/* Right Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Sell on ShopAI or Dashboard CTA */}
          {activeStoreId ? (
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#60a5fa',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '7px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.84rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <LayoutDashboard size={15} />
              <span>Store Dashboard</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/sell')}
              className="btn-sell"
            >
              <Sparkles size={15} />
              <span>Sell on ShopAI</span>
            </button>
          )}

          {/* User Profile / Customer Orders */}
          <button
            onClick={() => navigate('/profile')}
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              transition: 'all 0.15s ease'
            }}
            title="Customer Profile & Orders"
          >
            <User size={18} />
          </button>

          {/* Cart Icon with Real Count */}
          <button
            onClick={() => navigate('/cart')}
            style={{
              position: 'relative',
              width: 40,
              height: 40,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-subtle)',
              color: '#ffffff',
              transition: 'all 0.15s ease'
            }}
            title="Shopping Cart"
          >
            <ShoppingCart size={19} />
            {totalCount > 0 && (
              <span style={{
                position: 'absolute',
                top: -4,
                right: -4,
                background: '#ef4444',
                color: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: 700,
                width: 20,
                height: 20,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.5)'
              }}>
                {totalCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 38,
              height: 38,
              borderRadius: 10,
              color: 'var(--text-main)',
              border: '1px solid var(--border-subtle)'
            }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          padding: '16px 20px 24px',
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}>
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
            <Search size={17} style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-subtle)'
            }} />
            <input
              type="text"
              placeholder="Search products or stores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: 42,
                paddingLeft: 42,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 10,
                color: '#ffffff',
                fontSize: '0.9rem'
              }}
            />
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setMobileMenuOpen(false);
                }}
                style={{
                  padding: '12px 14px',
                  borderRadius: 8,
                  textAlign: 'left',
                  fontSize: '0.95rem',
                  fontWeight: currentPath === link.path ? 600 : 500,
                  backgroundColor: currentPath === link.path ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  color: currentPath === link.path ? '#60a5fa' : 'var(--text-main)'
                }}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => {
                navigate('/orders');
                setMobileMenuOpen(false);
              }}
              style={{
                padding: '12px 14px',
                borderRadius: 8,
                textAlign: 'left',
                fontSize: '0.95rem',
                color: 'var(--text-main)'
              }}
            >
              My Orders & Returns
            </button>
            <button
              onClick={() => {
                navigate('/sell');
                setMobileMenuOpen(false);
              }}
              style={{
                padding: '12px 14px',
                borderRadius: 8,
                textAlign: 'left',
                fontSize: '0.95rem',
                color: '#a78bfa',
                fontWeight: 600
              }}
            >
              Sell on ShopAI →
            </button>
          </div>
        </div>
      )}

      {/* Global CSS media helpers for navbar */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .desktop-search { display: block !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
};
