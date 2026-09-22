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
      backgroundColor: 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 24px',
        height: 70,
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
            width: 38,
            height: 38,
            borderRadius: 10,
            background: '#09090b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
          }}>
            <ShoppingBag size={20} color="#ffffff" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ 
              fontSize: '1.3rem', 
              fontWeight: 800, 
              letterSpacing: '-0.03em',
              color: '#09090b',
              fontFamily: 'var(--font-display)'
            }}>
              ShopAI
            </span>
            <span style={{
              fontSize: '0.66rem',
              fontWeight: 700,
              padding: '2px 7px',
              borderRadius: 20,
              background: '#f4f4f5',
              color: '#52525b',
              border: '1px solid #e4e4e7',
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              Marketplace
            </span>
          </div>
        </div>

        {/* Center Desktop Navigation */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: 32,
          margin: '0 12px'
        }} className="desktop-nav">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                style={{
                  fontSize: '0.92rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#09090b' : '#52525b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 0',
                  position: 'relative',
                  transition: 'color 0.15s ease'
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = '#09090b'; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = '#52525b'; }}
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
                    background: '#09090b'
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
          <Search size={16} style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            pointerEvents: 'none'
          }} />
          <input
            type="text"
            placeholder="Search verified stores, products, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: 38,
              paddingLeft: 40,
              paddingRight: 16,
              background: '#f4f4f6',
              border: '1px solid transparent',
              borderRadius: 'var(--radius-full)',
              color: '#09090b',
              fontSize: '0.86rem',
              outline: 'none',
              transition: 'all 0.15s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.background = '#ffffff';
              e.target.style.boxShadow = '0 0 0 3px rgba(0, 0, 0, 0.04)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'transparent';
              e.target.style.background = '#f4f4f6';
              e.target.style.boxShadow = 'none';
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
                background: '#09090b',
                color: '#ffffff',
                padding: '7px 15px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.84rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)'
              }}
            >
              <LayoutDashboard size={14} />
              <span>Dashboard</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/sell')}
              className="btn-sell"
            >
              <Sparkles size={14} />
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
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              color: '#52525b',
              boxShadow: 'var(--shadow-xs)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.color = '#09090b';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.color = '#52525b';
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
              width: 38,
              height: 38,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              color: '#09090b',
              boxShadow: 'var(--shadow-xs)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
            title="Shopping Cart"
          >
            <ShoppingCart size={18} />
            {totalCount > 0 && (
              <span style={{
                position: 'absolute',
                top: -5,
                right: -5,
                background: '#09090b',
                color: '#ffffff',
                fontSize: '0.68rem',
                fontWeight: 700,
                width: 19,
                height: 19,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
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
              border: '1px solid var(--border-subtle)',
              background: '#ffffff'
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
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--border-subtle)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14
        }}>
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
            <Search size={16} style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }} />
            <input
              type="text"
              placeholder="Search products or stores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: 40,
                paddingLeft: 40,
                background: '#f4f4f6',
                border: '1px solid var(--border-subtle)',
                borderRadius: 10,
                color: '#09090b',
                fontSize: '0.9rem'
              }}
            />
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setMobileMenuOpen(false);
                }}
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  textAlign: 'left',
                  fontSize: '0.92rem',
                  fontWeight: currentPath === link.path ? 700 : 500,
                  backgroundColor: currentPath === link.path ? '#f4f4f6' : 'transparent',
                  color: currentPath === link.path ? '#09090b' : '#52525b'
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
                padding: '10px 12px',
                borderRadius: 8,
                textAlign: 'left',
                fontSize: '0.92rem',
                color: '#52525b'
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
                padding: '10px 12px',
                borderRadius: 8,
                textAlign: 'left',
                fontSize: '0.92rem',
                color: '#09090b',
                fontWeight: 700
              }}
            >
              Sell on ShopAI →
            </button>
          </div>
        </div>
      )}

      {/* Media helpers */}
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
