import React, { useState, useEffect } from 'react';
import { initDB } from './services/db';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ReturnModal } from './components/ReturnModal';

// Pages
import { Home } from './pages/Home';
import { Stores } from './pages/Stores';
import { Storefront } from './pages/Storefront';
import { Products } from './pages/Products';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { Orders } from './pages/Orders';
import { OrderTracking } from './pages/OrderTracking';
import { Profile } from './pages/Profile';
import { SellLanding } from './pages/SellLanding';
import { StoreRegister } from './pages/StoreRegister';

// Dashboard Pages
import { DashboardLayout } from './pages/dashboard/DashboardLayout';
import { Overview } from './pages/dashboard/Overview';
import { Products as DashboardProducts } from './pages/dashboard/Products';
import { Orders as DashboardOrders } from './pages/dashboard/Orders';
import { Inventory } from './pages/dashboard/Inventory';
import { Customers } from './pages/dashboard/Customers';
import { Returns as DashboardReturns } from './pages/dashboard/Returns';
import { Settings as DashboardSettings } from './pages/dashboard/Settings';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const [activeReturnOrder, setActiveReturnOrder] = useState(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  useEffect(() => {
    initDB();

    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path.split('?')[0]);
    window.scrollTo(0, 0);
  };

  const openReturnModal = (order) => {
    setActiveReturnOrder(order);
    setIsReturnModalOpen(true);
  };

  const closeReturnModal = () => {
    setIsReturnModalOpen(false);
    setActiveReturnOrder(null);
  };

  // Extract Route and Params
  const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  };

  // Route Dispatcher
  const renderRoute = () => {
    // 1. Dashboard Routes (/dashboard/*)
    if (currentPath.startsWith('/dashboard')) {
      let subTab = 'overview';
      let ContentComponent = Overview;

      if (currentPath === '/dashboard/products') {
        subTab = 'products';
        ContentComponent = DashboardProducts;
      } else if (currentPath === '/dashboard/orders') {
        subTab = 'orders';
        ContentComponent = DashboardOrders;
      } else if (currentPath === '/dashboard/inventory') {
        subTab = 'inventory';
        ContentComponent = Inventory;
      } else if (currentPath === '/dashboard/customers') {
        subTab = 'customers';
        ContentComponent = Customers;
      } else if (currentPath === '/dashboard/returns') {
        subTab = 'returns';
        ContentComponent = DashboardReturns;
      } else if (currentPath === '/dashboard/settings') {
        subTab = 'settings';
        ContentComponent = DashboardSettings;
      }

      return (
        <DashboardLayout activeTab={subTab} navigate={navigate}>
          <ContentComponent navigate={navigate} />
        </DashboardLayout>
      );
    }

    // 2. Marketplace Routes (Wrapped in standard Navbar & Footer)
    let pageContent = null;

    if (currentPath === '/') {
      pageContent = <Home navigate={navigate} />;
    } else if (currentPath === '/stores') {
      pageContent = <Stores navigate={navigate} />;
    } else if (currentPath.startsWith('/store/')) {
      const storeId = currentPath.replace('/store/', '');
      pageContent = <Storefront storeId={storeId} navigate={navigate} />;
    } else if (currentPath === '/products') {
      const categoryParam = getQueryParam('category') || 'All';
      const searchParam = getQueryParam('search') || '';
      pageContent = <Products initialCategory={categoryParam} initialSearch={searchParam} navigate={navigate} />;
    } else if (currentPath.startsWith('/product/')) {
      const productId = currentPath.replace('/product/', '');
      pageContent = <ProductDetails productId={productId} navigate={navigate} />;
    } else if (currentPath === '/cart') {
      pageContent = <Cart navigate={navigate} />;
    } else if (currentPath === '/checkout') {
      pageContent = <Checkout navigate={navigate} />;
    } else if (currentPath === '/order-success') {
      const orderId = getQueryParam('orderId');
      pageContent = <OrderSuccess orderId={orderId} navigate={navigate} />;
    } else if (currentPath === '/orders') {
      pageContent = <Orders navigate={navigate} onOpenReturnModal={openReturnModal} />;
    } else if (currentPath.startsWith('/orders/')) {
      const orderId = currentPath.replace('/orders/', '');
      pageContent = <OrderTracking orderId={orderId} navigate={navigate} onOpenReturnModal={openReturnModal} />;
    } else if (currentPath === '/profile') {
      pageContent = <Profile navigate={navigate} onOpenReturnModal={openReturnModal} />;
    } else if (currentPath === '/sell') {
      pageContent = <SellLanding navigate={navigate} />;
    } else if (currentPath === '/sell/create') {
      pageContent = <StoreRegister navigate={navigate} />;
    } else {
      pageContent = (
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h2>Page Not Found</h2>
          <button onClick={() => navigate('/')} className="btn-primary" style={{ marginTop: 16 }}>
            Back to Home
          </button>
        </div>
      );
    }

    return (
      <div className="app-container">
        {/* Prototype Demo Banner Switcher Helper */}
        <div style={{
          backgroundColor: '#09090b',
          borderBottom: '1px solid #27272a',
          padding: '6px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.76rem',
          color: '#a1a1aa',
          gap: 10,
          zIndex: 60,
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ background: '#27272a', color: '#ffffff', padding: '2px 7px', borderRadius: 4, fontWeight: 700, letterSpacing: '0.02em', fontSize: '0.7rem' }}>
              ShopAI Prototype
            </span>
            <span style={{ color: '#71717a' }}>• Multi-Vendor Local Demo</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ color: '#71717a', fontWeight: 500 }}>Quick Nav:</span>
            <button onClick={() => navigate('/store/STORE-1001')} style={{ color: '#e4e4e7', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Urban Threads</button>
            <button onClick={() => navigate('/store/STORE-1002')} style={{ color: '#e4e4e7', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>TechHub</button>
            <button onClick={() => navigate('/orders/ORD-10452')} style={{ color: '#e4e4e7', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Track Order</button>
            <button onClick={() => navigate('/sell/create')} style={{ color: '#e4e4e7', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 600 }}>+ Create Store</button>
            <button onClick={() => navigate('/dashboard')} style={{ color: '#10b981', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 700 }}>Merchant Dashboard →</button>
          </div>
        </div>

        <Navbar currentPath={currentPath} navigate={navigate} />
        <div className="main-content">
          {pageContent}
        </div>
        <Footer navigate={navigate} />

        {/* Global Return / Refund Modal */}
        <ReturnModal
          order={activeReturnOrder}
          isOpen={isReturnModalOpen}
          onClose={closeReturnModal}
          onSuccess={() => {
            // refresh data if needed
          }}
        />
      </div>
    );
  };

  return (
    <CartProvider>
      {renderRoute()}
    </CartProvider>
  );
}
