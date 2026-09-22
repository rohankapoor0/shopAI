import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Boxes, 
  Users, 
  RotateCcw, 
  Settings, 
  Store, 
  ExternalLink, 
  ChevronDown, 
  Menu, 
  X,
  Sparkles,
  ArrowLeft,
  ShoppingBag
} from 'lucide-react';
import { storeService } from '../../services/storeService';

export const DashboardLayout = ({ activeTab = 'overview', navigate, children }) => {
  const [stores, setStores] = useState([]);
  const [currentStore, setCurrentStore] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [storeSwitcherOpen, setStoreSwitcherOpen] = useState(false);

  useEffect(() => {
    const loadStores = async () => {
      const all = await storeService.getStores();
      setStores(all);
      const activeId = storeService.getActiveStoreId() || all[0]?.id;
      const found = all.find(s => s.id === activeId) || all[0];
      setCurrentStore(found);
    };
    loadStores();
  }, []);

  const handleSelectStore = (storeId) => {
    storeService.setActiveStoreId(storeId);
    const selected = stores.find(s => s.id === storeId);
    setCurrentStore(selected);
    setStoreSwitcherOpen(false);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'products', label: 'Products', icon: Package, path: '/dashboard/products' },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, path: '/dashboard/orders' },
    { id: 'inventory', label: 'Inventory', icon: Boxes, path: '/dashboard/inventory' },
    { id: 'customers', label: 'Customers', icon: Users, path: '/dashboard/customers' },
    { id: 'returns', label: 'Returns', icon: RotateCcw, path: '/dashboard/returns' },
    { id: 'settings', label: 'Store Settings', icon: Settings, path: '/dashboard/settings' },
  ];

  if (!currentStore) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Backdrop for mobile drawer */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 49
          }}
        />
      )}

      {/* 1. Left SaaS Sidebar */}
      <aside
        className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}
        style={{
          width: 260,
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 50,
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Logo / ShopAI Merchant Header */}
        <div style={{
          padding: '18px 20px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              textAlign: 'left',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.18)'
            }}>
              <ShoppingBag size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#09090b', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 4 }}>
                ShopAI
                <span style={{ fontSize: '0.62rem', background: '#e0e7ff', color: '#4338ca', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>
                  MERCHANT
                </span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                Multi-Vendor Portal
              </div>
            </div>
          </button>

          {/* Close button on mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="dashboard-close-btn"
            style={{
              display: 'none',
              padding: 6,
              color: '#64748b',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 6
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Store Switcher Card */}
        <div style={{
          padding: '14px 16px',
          borderBottom: '1px solid #f1f5f9',
          position: 'relative'
        }}>
          <button
            onClick={() => setStoreSwitcherOpen(!storeSwitcherOpen)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              borderRadius: 10,
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <img
                src={currentStore.logo}
                alt={currentStore.name}
                style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover', border: '1px solid #e2e8f0' }}
              />
              <div style={{ textAlign: 'left', minWidth: 0 }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#09090b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentStore.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#059669', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
                  Live Storefront
                </div>
              </div>
            </div>
            <ChevronDown size={15} color="#64748b" />
          </button>

          {/* Switcher Dropdown */}
          {storeSwitcherOpen && (
            <div style={{
              position: 'absolute',
              top: 68,
              left: 16,
              right: 16,
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              boxShadow: '0 12px 30px rgba(15, 23, 42, 0.12)',
              zIndex: 60,
              padding: '6px 0',
              maxHeight: 260,
              overflowY: 'auto'
            }}>
              <div style={{ padding: '6px 14px', fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                Select Storefront
              </div>
              {stores.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleSelectStore(s.id)}
                  style={{
                    width: '100%',
                    padding: '8px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    textAlign: 'left',
                    fontSize: '0.84rem',
                    color: s.id === currentStore.id ? '#0f172a' : '#475569',
                    backgroundColor: s.id === currentStore.id ? '#f1f5f9' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease'
                  }}
                >
                  <img src={s.logo} alt={s.name} style={{ width: 24, height: 24, borderRadius: 6, objectFit: 'cover' }} />
                  <span style={{ fontWeight: s.id === currentStore.id ? 700 : 500 }}>{s.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Navigation Items */}
        <div style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 3, overflowY: 'auto' }}>
          <div style={{ padding: '0 10px 8px', fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Store Management
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '9px 12px',
                  borderRadius: 8,
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#09090b' : '#64748b',
                  backgroundColor: isActive ? '#f1f5f9' : 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={18} color={isActive ? '#0f172a' : '#94a3b8'} strokeWidth={isActive ? 2.3 : 1.8} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer Link */}
        <div style={{
          padding: '14px 16px',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          backgroundColor: '#fafaf9'
        }}>
          <button
            onClick={() => navigate(`/store/${currentStore.id}`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '9px 12px',
              borderRadius: 8,
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              color: '#09090b',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <Store size={15} color="#475569" />
              <span>View Public Store</span>
            </span>
            <ExternalLink size={13} color="#94a3b8" />
          </button>

          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 12px',
              color: '#64748b',
              fontSize: '0.82rem',
              textAlign: 'left',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 6
            }}
          >
            <ArrowLeft size={14} />
            <span>Return to Marketplace</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Navbar */}
        <header style={{
          height: 60,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
          position: 'sticky',
          top: 0,
          zIndex: 30
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Mobile menu trigger */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="dashboard-menu-btn"
              style={{
                display: 'none',
                color: '#09090b',
                padding: 6,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <Menu size={22} />
            </button>

            <div>
              <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#09090b', letterSpacing: '-0.01em' }}>
                {currentStore.name}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                {currentStore.category} • {currentStore.location?.city || 'India'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="badge badge-emerald" style={{ fontWeight: 600 }}>
              Live Store
            </span>
            <button
              onClick={() => navigate(`/store/${currentStore.id}`)}
              className="btn-secondary"
              style={{ padding: '7px 14px', fontSize: '0.82rem', fontWeight: 600 }}
            >
              <Store size={14} />
              <span>Visit Storefront</span>
            </button>
          </div>
        </header>

        {/* Dynamic Nested Content */}
        <main style={{ flex: 1, padding: '28px 28px 80px', maxWidth: 1280, width: '100%', margin: '0 auto' }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dashboard-sidebar {
            position: fixed !important;
            left: 0;
            top: 0;
            bottom: 0;
            transform: translateX(-100%);
            box-shadow: 0 0 30px rgba(0,0,0,0.25);
          }
          .dashboard-sidebar.open {
            transform: translateX(0);
          }
          .dashboard-menu-btn {
            display: block !important;
          }
          .dashboard-close-btn {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};
