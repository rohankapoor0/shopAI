import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  User, 
  ShoppingCart, 
  Sparkles, 
  Menu, 
  X, 
  LayoutDashboard,
  LogOut
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { authService } from '../services/authService';

export const Navbar = ({ currentPath, navigate, onLogout }) => {
  const { totalCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // The dashboard is admin-only
  const isAdmin = authService.isAdmin(authService.getCurrentUser());

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
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-primary)'
          }}>
            <ShoppingBag size={20} color="#ffffff" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ 
              fontSize: '1.3rem', 
              fontWeight: 800, 
              letterSpacing: '-0.03em',
              color: 'var(--text-main)',
              fontFamily: 'var(--font-display)'
            }}>
              ShopAI
            </span>
            <span className="brand-tag" style={{
              fontSize: '0.66rem',
              fontWeight: 700,
              padding: '2px 7px',
              borderRadius: 20,
              background: 'var(--primary-tint)',
              color: 'var(--primary-dark)',
              border: '1px solid var(--primary-border)',
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
                className={isActive ? 'nav-link active' : 'nav-link'}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
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
              background: 'var(--bg-muted)',
              border: '1px solid transparent',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-main)',
              fontSize: '0.86rem',
              outline: 'none',
              transition: 'all 0.15s ease'
            }}
            className="nav-search"
          />
        </form>

        {/* Right Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Sell on ShopAI or Dashboard CTA (desktop; the mobile drawer has both) */}
          {isAdmin ? (
            <button onClick={() => navigate('/dashboard')} className="btn-sell desktop-only">
              <LayoutDashboard size={14} />
              <span>Dashboard</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/sell')}
              className="btn-sell desktop-only"
            >
              <Sparkles size={14} />
              <span>Sell on ShopAI</span>
            </button>
          )}

          {/* User Profile / Customer Orders */}
          <button
            onClick={() => navigate('/profile')}
            className={currentPath === '/profile' ? 'icon-btn active' : 'icon-btn'}
            style={{ borderRadius: '50%' }}
            title="Customer Profile & Orders"
            aria-label="Profile and orders"
          >
            <User size={18} />
          </button>

          {/* Cart Icon with Real Count */}
          <button
            onClick={() => navigate('/cart')}
            className={currentPath === '/cart' ? 'icon-btn active' : 'icon-btn'}
            style={{ position: 'relative', color: 'var(--text-main)' }}
            title="Shopping Cart"
            aria-label={`Cart, ${totalCount} items`}
          >
            <ShoppingCart size={18} />
            {totalCount > 0 && (
              // Re-keyed on every count change so the badge pops when something is added
              <span key={totalCount} className="pop" style={{
                position: 'absolute',
                top: -5,
                right: -5,
                background: 'var(--primary)',
                color: '#ffffff',
                fontSize: '0.68rem',
                fontWeight: 700,
                width: 19,
                height: 19,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 0 2px #ffffff'
              }}>
                {totalCount}
              </span>
            )}
          </button>

          {/* Log out (desktop; the mobile drawer has its own) */}
          <button
            onClick={onLogout}
            className="icon-btn icon-btn-danger desktop-logout"
            style={{ display: 'none' }}
            title="Log out"
            aria-label="Log out"
          >
            <LogOut size={17} />
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
        <div className="animate-fade-in" style={{
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
                background: 'var(--bg-muted)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 10,
                color: 'var(--text-main)',
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
                  backgroundColor: currentPath === link.path ? 'var(--primary-tint)' : 'transparent',
                  color: currentPath === link.path ? 'var(--primary-dark)' : 'var(--text-muted)'
                }}
              >
                {link.label}
              </button>
            ))}
            {isAdmin && (
              <button
                onClick={() => {
                  navigate('/dashboard');
                  setMobileMenuOpen(false);
                }}
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  textAlign: 'left',
                  fontSize: '0.92rem',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <LayoutDashboard size={16} />
                Store Dashboard
              </button>
            )}
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
                color: 'var(--text-muted)'
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
                color: 'var(--primary)',
                fontWeight: 700
              }}
            >
              Sell on ShopAI →
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              style={{
                padding: '10px 12px',
                borderRadius: 8,
                textAlign: 'left',
                fontSize: '0.92rem',
                color: 'var(--error)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <LogOut size={16} />
              Log out
            </button>
          </div>
        </div>
      )}

      {/* Media helpers */}
      <style>{`
        @media (max-width: 767px) {
          .desktop-only { display: none !important; }
        }
        @media (max-width: 420px) {
          .brand-tag { display: none !important; }
        }
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .desktop-search { display: block !important; }
          .desktop-logout { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
};
