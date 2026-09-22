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
  Watch
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
    { name: 'Fashion', icon: Shirt, count: '120+ items', color: '#6366f1' },
    { name: 'Electronics', icon: Cpu, count: '85+ items', color: '#3b82f6' },
    { name: 'Home', icon: HomeIcon, count: '64+ items', color: '#f59e0b' },
    { name: 'Beauty', icon: Heart, count: '92+ items', color: '#ec4899' },
    { name: 'Sports', icon: Dumbbell, count: '50+ items', color: '#10b981' },
    { name: 'Accessories', icon: Watch, count: '40+ items', color: '#8b5cf6' }
  ];

  return (
    <div className="animate-fade-in">
      {/* 1. Hero Section */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '70px 20px 90px',
        background: 'radial-gradient(ellipse at 50% 10%, rgba(59, 130, 246, 0.15), transparent 70%), radial-gradient(ellipse at 80% 50%, rgba(139, 92, 246, 0.1), transparent 60%)'
      }}>
        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          textAlign: 'center'
        }}>
          {/* Micro pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-full)',
            marginBottom: 24
          }}>
            <Sparkles size={14} color="#60a5fa" />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e2e8f0' }}>
              The Modern Multi-Vendor Commerce Experience
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.035em',
            marginBottom: 20,
            background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Everything you love, <br />
            from stores you'll love.
          </h1>

          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            color: 'var(--text-muted)',
            maxWidth: 680,
            margin: '0 auto 36px',
            lineHeight: 1.6
          }}>
            Discover independent brands, artisanal lifestyle essentials, and next-gen tech gear — all unified in one seamless marketplace.
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
              style={{ padding: '13px 28px', fontSize: '1rem', borderRadius: 14 }}
            >
              <Compass size={18} />
              <span>Explore Stores</span>
            </button>

            <button
              onClick={() => navigate('/sell')}
              className="btn-secondary"
              style={{ padding: '13px 28px', fontSize: '1rem', borderRadius: 14 }}
            >
              <StoreIcon size={18} color="#a78bfa" />
              <span>Start Selling</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Featured Stores */}
      <section style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '20px 20px 60px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 28
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#60a5fa', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
              <StoreIcon size={16} />
              <span>Curated Brands</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
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
              fontWeight: 600,
              color: '#60a5fa'
            }}
          >
            <span>View all stores</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20
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
        padding: '20px 20px 60px'
      }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Shop by Category
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Explore handpicked collections across independent merchants
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
                className="glass-card"
                style={{
                  padding: '22px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = cat.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              >
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: `${cat.color}15`,
                  color: cat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12
                }}>
                  <Icon size={24} />
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.98rem', color: '#ffffff' }}>
                  {cat.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: 2 }}>
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
        padding: '20px 20px 70px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 28
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f59e0b', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
              <Flame size={16} />
              <span>Community Favorites</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
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
              fontWeight: 600,
              color: '#60a5fa'
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
        padding: '0 20px 80px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: 24,
          padding: '50px 36px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 32,
          boxShadow: '0 20px 50px -10px rgba(99, 102, 241, 0.15)'
        }}>
          <div style={{ maxWidth: 640 }}>
            <span className="badge badge-purple" style={{ marginBottom: 12 }}>
              ShopAI For Merchants
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, lineHeight: 1.25, marginBottom: 12 }}>
              Have something to sell? <br />
              Create your own store on ShopAI.
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Join hundreds of independent artisans, apparel brands, and hardware creators. Full inventory control, automated order routing, and instant storefront activation.
            </p>
          </div>

          <div>
            <button
              onClick={() => navigate('/sell')}
              className="btn-sell"
              style={{
                padding: '14px 32px',
                fontSize: '1rem',
                borderRadius: 14,
                boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)'
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
