import React, { useEffect, useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Store as StoreIcon, 
  ShoppingBag, 
  Flame, 
  TrendingUp, 
  Compass,
  Cpu,
  Shirt,
  Home as HomeIcon,
  Heart,
  Dumbbell,
  Watch,
  CheckCircle2
} from 'lucide-react';
import { storeService } from '../services/storeService';
import { productService } from '../services/productService';
import { StoreCard } from '../components/StoreCard';
import { ProductCard } from '../components/ProductCard';

export const Home = ({ navigate }) => {
  const [stores, setStores] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const allStores = await storeService.getStores();
      const allProducts = await productService.getProducts({ sortBy: 'popularity' });
      setStores(allStores);
      setTrendingProducts(allProducts.slice(0, 8));
      setLoading(false);
    };
    fetchData();
  }, []);

  const categories = [
    { name: 'Fashion', icon: Shirt, count: '120+ items', color: '#09090b' },
    { name: 'Electronics', icon: Cpu, count: '85+ items', color: '#2563eb' },
    { name: 'Home', icon: HomeIcon, count: '64+ items', color: '#d97706' },
    { name: 'Beauty', icon: Heart, count: '92+ items', color: '#e11d48' },
    { name: 'Sports', icon: Dumbbell, count: '50+ items', color: '#059669' },
    { name: 'Accessories', icon: Watch, count: '40+ items', color: '#7c3aed' }
  ];

  return (
    <div className="animate-fade-in">
      {/* 1. Hero Section (Editorial Commerce Aesthetic) */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '76px 24px 84px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{
          maxWidth: 960,
          margin: '0 auto',
          textAlign: 'center'
        }}>
          {/* Micro pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '5px 15px',
            background: '#f4f4f5',
            border: '1px solid #e4e4e7',
            borderRadius: 'var(--radius-full)',
            marginBottom: 24
          }}>
            <Sparkles size={14} color="#2563eb" />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#09090b' }}>
              The Multi-Vendor Marketplace for Independent Stores
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: '-0.035em',
            marginBottom: 20,
            color: '#09090b',
            fontFamily: 'var(--font-display)'
          }}>
            Everything you love, <br />
            from stores you'll cherish.
          </h1>

          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            color: 'var(--text-muted)',
            maxWidth: 680,
            margin: '0 auto 36px',
            lineHeight: 1.6
          }}>
            Discover curated independent brands, verified boutique creators, and high-quality products — all unified in one seamless shopping experience.
          </p>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16
          }}>
            <button
              onClick={() => navigate('/stores')}
              className="btn-primary"
              style={{ padding: '13px 30px', fontSize: '0.98rem', borderRadius: 12 }}
            >
              <Compass size={18} />
              <span>Explore Verified Stores</span>
            </button>

            <button
              onClick={() => navigate('/sell')}
              className="btn-secondary"
              style={{ padding: '13px 30px', fontSize: '0.98rem', borderRadius: 12 }}
            >
              <StoreIcon size={18} color="#09090b" />
              <span>Start Selling on ShopAI</span>
            </button>
          </div>

          {/* Trust Metrics Bar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 28,
            marginTop: 48,
            paddingTop: 32,
            borderTop: '1px solid #f4f4f6',
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <CheckCircle2 size={16} color="#059669" />
              <span><strong>100%</strong> Verified Merchants</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <CheckCircle2 size={16} color="#059669" />
              <span>Direct Studio Dispatch</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <CheckCircle2 size={16} color="#059669" />
              <span>Doorstep Pickup Returns</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Stores */}
      <section style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '50px 24px 60px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 28
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#2563eb', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
              <StoreIcon size={15} />
              <span>Curated Brands</span>
            </div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#09090b' }}>
              Featured Stores
            </h2>
          </div>
          <button
            onClick={() => navigate('/stores')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#09090b'
            }}
          >
            <span>View all stores</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 22
        }}>
          {stores.slice(0, 5).map(store => (
            <StoreCard key={store.id} store={store} navigate={navigate} />
          ))}
        </div>
      </section>

      {/* 3. Categories Grid */}
      <section style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '20px 24px 60px'
      }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#09090b' }}>
            Shop by Category
          </h2>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
            Explore handpicked collections across independent creators
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: 16
        }}>
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                onClick={() => navigate(`/products?category=${cat.name}`)}
                className="clean-card"
                style={{
                  padding: '22px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  borderRadius: 14,
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = '#09090b';
                  e.currentTarget.style.boxShadow = '0 8px 16px -4px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  backgroundColor: '#f4f4f6',
                  color: '#09090b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12
                }}>
                  <Icon size={22} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.96rem', color: '#09090b' }}>
                  {cat.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  {cat.count}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Trending Products */}
      <section style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '20px 24px 70px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 28
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#d97706', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
              <Flame size={15} />
              <span>Community Favorites</span>
            </div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#09090b' }}>
              Trending Products
            </h2>
          </div>
          <button
            onClick={() => navigate('/products')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#09090b'
            }}
          >
            <span>View full catalog</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 22
        }}>
          {trendingProducts.map(product => (
            <ProductCard key={product.id} product={product} navigate={navigate} />
          ))}
        </div>
      </section>

      {/* 5. Merchant CTA Banner */}
      <section style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 24px 80px'
      }}>
        <div style={{
          background: '#09090b',
          borderRadius: 20,
          padding: '54px 44px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 32,
          boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.25)'
        }}>
          <div style={{ maxWidth: 640 }}>
            <span style={{
              display: 'inline-block',
              background: 'rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              fontSize: '0.74rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              padding: '3px 10px',
              borderRadius: 20,
              marginBottom: 14
            }}>
              ShopAI For Merchants
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: 12, color: '#ffffff' }}>
              Have products to sell? <br />
              Open your independent storefront on ShopAI.
            </h2>
            <p style={{ fontSize: '1rem', color: '#a1a1aa', lineHeight: 1.6 }}>
              Join independent artisans, apparel brands, and makers. Complete inventory control, multi-status order fulfillment, and automated return processing.
            </p>
          </div>

          <div>
            <button
              onClick={() => navigate('/sell')}
              style={{
                background: '#ffffff',
                color: '#09090b',
                padding: '14px 32px',
                fontSize: '0.98rem',
                fontWeight: 700,
                borderRadius: 12,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 16px rgba(255, 255, 255, 0.15)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f4f4f5';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>Start Selling Today</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
