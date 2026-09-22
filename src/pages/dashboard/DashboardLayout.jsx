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
  LogOut,
  Sparkles,
  Home
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
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* 1. Left Shopify-style Sidebar */}
      <aside
        className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}
        style={{
          width: 260,
          backgroundColor: '#0d131f',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 40
        }}
      >
        {/* Store Brand / Switcher Header */}
        <div style={{
          padding: '16px 18px',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'relative'
        }}>
          <button
            onClick={() => setStoreSwitcherOpen(!storeSwitcherOpen)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 8px',
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              color: '#ffffff'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <img
                src={currentStore.logo}
                alt={currentStore.name}
                style={{ width: 30, height: 30, borderRadius: 8, objectFit: 'cover' }}
              />
              <div style={{ textAlign: 'left', minWidth: 0 }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentStore.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: 4 }}>
                  ● Active Store
                </div>
              </div>
            </div>
            <ChevronDown size={16} color="var(--text-subtle)" />
          </button>

          {/* Switcher Dropdown (Multi-vendor demonstration support) */}
          {storeSwitcherOpen && (
            <div style={{
              position: 'absolute',
              top: 68,
              left: 18,
              right: 18,
              backgroundColor: '#161f30',
              border: '1px solid var(--border-strong)',
              borderRadius: 10,
              boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
              zIndex: 50,
              padding: '6px 0',
              maxHeight: 260,
              overflowY: 'auto'
            }}>
              <div style={{ padding: '6px 12px', fontSize: '0.72rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>
                Switch Store (Multi-Vendor)
              </div>
              {stores.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleSelectStore(s.id)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    textAlign: 'left',
                    fontSize: '0.84rem',
                    color: s.id === currentStore.id ? '#60a5fa' : 'var(--text-main)',
                    background: s.id === currentStore.id ? 'rgba(59, 130, 246, 0.15)' : 'transparent'
                  }}
                >
                  <img src={s.logo} alt={s.name} style={{ width: 22, height: 22, borderRadius: 6, objectFit: 'cover' }} />
                  <span style={{ fontWeight: 600 }}>{s.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Navigation Items */}
        <div style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
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
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                  border: isActive ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={18} color={isActive ? '#60a5fa' : 'var(--text-subtle)'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer Link */}
        <div style={{
          padding: '16px 14px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: 10
        }}>
          <button
            onClick={() => navigate(`/store/${currentStore.id}`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.04)',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 600
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Store size={15} color="#60a5fa" />
              <span>View Public Store</span>
            </span>
            <ExternalLink size={13} color="var(--text-subtle)" />
          </button>

          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 10px',
              color: 'var(--text-muted)',
              fontSize: '0.82rem',
              textAlign: 'left'
            }}
          >
            <Home size={15} />
            <span>Return to Marketplace</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Navbar */}
        <header style={{
          height: 64,
          backgroundColor: 'rgba(13, 19, 31, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 30
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Mobile menu trigger */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                display: 'none',
                color: '#ffffff',
                padding: 4
              }}
              className="dashboard-menu-btn"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>
                Merchant Portal
              </span>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
                {currentStore.name}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span className="badge badge-emerald">
              ● Store Active
            </span>
            <button
              onClick={() => navigate(`/store/${currentStore.id}`)}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.82rem' }}
            >
              <Store size={14} color="#60a5fa" />
              <span>Visit Storefront</span>
            </button>
          </div>
        </header>

        {/* Dynamic Nested Content */}
        <main style={{ flex: 1, padding: '28px 24px 80px', maxWidth: 1240, width: '100%', margin: '0 auto' }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dashboard-sidebar {
            position: fixed !important;
            left: -280px;
            top: 0;
            bottom: 0;
            transition: left 0.25s ease;
          }
          .dashboard-sidebar.open {
            left: 0;
          }
          .dashboard-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};
