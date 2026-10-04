import React, { useState, useEffect } from 'react';
import { authService } from './services/authService';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ReturnModal } from './components/ReturnModal';
import { ChatWidget } from './components/ChatWidget';

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
import { Login } from './pages/Login';
import { Register } from './pages/Register';

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
  // Query string is state too, so /products?search=a -> /products?search=b re-renders
  const [currentSearch, setCurrentSearch] = useState(window.location.search);
  const [activeReturnOrder, setActiveReturnOrder] = useState(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const isAdmin = authService.isAdmin(currentUser);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setCurrentSearch(window.location.search);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(window.location.pathname);
    setCurrentSearch(window.location.search);
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    navigate('/');
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
  const getQueryParam = (param) => new URLSearchParams(currentSearch).get(param);

  // Route Dispatcher
  const renderRoute = () => {
    // 0. Whole app is behind login; /register is the only public route
    if (!currentUser) {
      return currentPath === '/register'
        ? <Register navigate={navigate} onRegistered={setCurrentUser} />
        : <Login navigate={navigate} onLogin={setCurrentUser} />;
    }

    // 1. Dashboard Routes (/dashboard/*) - admin only
    if (currentPath.startsWith('/dashboard') && isAdmin) {
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
        <DashboardLayout activeTab={subTab} navigate={navigate} onLogout={handleLogout}>
          <ContentComponent navigate={navigate} />
        </DashboardLayout>
      );
    }

    // 2. Marketplace Routes (Wrapped in standard Navbar & Footer)
    let pageContent = null;

    if (currentPath.startsWith('/dashboard')) {
      pageContent = (
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h2>Admin access required</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: 6 }}>The Store Dashboard is only available to the admin account.</p>
          <button onClick={() => navigate('/')} className="btn-primary" style={{ marginTop: 16 }}>
            Back to Home
          </button>
        </div>
      );
    } else if (currentPath === '/') {
      pageContent = <Home navigate={navigate} />;
    } else if (currentPath === '/stores') {
      pageContent = <Stores navigate={navigate} />;
    } else if (currentPath.startsWith('/store/')) {
      const storeId = currentPath.replace('/store/', '');
      pageContent = <Storefront key={storeId} storeId={storeId} navigate={navigate} />;
    } else if (currentPath === '/products') {
      const categoryParam = getQueryParam('category') || 'All';
      const searchParam = getQueryParam('search') || '';
      pageContent = <Products key={currentSearch} initialCategory={categoryParam} initialSearch={searchParam} navigate={navigate} />;
    } else if (currentPath.startsWith('/product/')) {
      const productId = currentPath.replace('/product/', '');
      pageContent = <ProductDetails key={productId} productId={productId} navigate={navigate} />;
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
      pageContent = <OrderTracking key={orderId} orderId={orderId} navigate={navigate} onOpenReturnModal={openReturnModal} />;
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
        <Navbar currentPath={currentPath} navigate={navigate} onLogout={handleLogout} />
        <div className="main-content">
          {pageContent}
        </div>
        <Footer navigate={navigate} />

        {/* AI shopping assistant (POST /assistant on the Lambda -> Azure OpenAI) */}
        <ChatWidget navigate={navigate} />

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
