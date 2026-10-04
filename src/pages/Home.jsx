import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  Store as StoreIcon,
  Flame,
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

const CATEGORIES = [
  { name: 'Fashion', icon: Shirt, color: '#2F5BEA' },
  { name: 'Electronics', icon: Cpu, color: '#0EA5E9' },
  { name: 'Home', icon: HomeIcon, color: '#D97706' },
  { name: 'Beauty', icon: Heart, color: '#E11D48' },
  { name: 'Sports', icon: Dumbbell, color: '#16A34A' },
  { name: 'Accessories', icon: Watch, color: '#7C3AED' }
];

const sectionStyle = { maxWidth: 1280, margin: '0 auto', padding: '56px 24px 0' };

const SectionHeader = ({ eyebrow, eyebrowIcon: EyebrowIcon, eyebrowColor = 'var(--primary)', title, subtitle, linkLabel, onLink }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
    <div>
      {eyebrow && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: eyebrowColor, fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
          <EyebrowIcon size={15} />
          <span>{eyebrow}</span>
        </div>
      )}
      <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{title}</h2>
      {subtitle && <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</p>}
    </div>
    {linkLabel && (
      <button onClick={onLink} className="link-arrow" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>
        <span>{linkLabel}</span>
        <ArrowRight size={16} />
      </button>
    )}
  </div>
);

const SkeletonGrid = ({ count, height, min }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`, gap: 22 }}>
    {Array.from({ length: count }, (_, i) => <div key={i} className="skeleton" style={{ height, borderRadius: 14 }} />)}
  </div>
);

export const Home = ({ navigate }) => {
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([storeService.getStores(), productService.getProducts({ sortBy: 'popularity' })])
      .then(([allStores, allProducts]) => {
        setStores(allStores);
        setProducts(allProducts);
      })
      .finally(() => setLoading(false));
  }, []);

  const countFor = (category) => products.filter(p => p.category === category).length;

  return (
    <div>
      {/* Hero */}
      <section className="hero-surface" style={{ position: 'relative', overflow: 'hidden', padding: '84px 24px 88px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="stagger" style={{ position: 'relative', maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 15px',
              background: 'var(--primary-tint)',
              border: '1px solid var(--primary-border)',
              borderRadius: 'var(--radius-full)',
              marginBottom: 24
            }}>
              <Sparkles size={14} color="var(--primary)" />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary-dark)' }}>
                The Multi-Vendor Marketplace for Independent Stores
              </span>
            </div>
          </div>

          <h1 style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.035em', marginBottom: 20 }}>
            Everything you love, <br />
            <span className="gradient-text">from stores you'll cherish.</span>
          </h1>

          <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.2rem)', color: 'var(--text-muted)', maxWidth: 640, margin: '0 auto 36px', lineHeight: 1.6 }}>
            Discover {stores.length || 'curated'} independent brands and {products.length || 'hundreds of'} handpicked products, all in one seamless shopping experience.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <button onClick={() => navigate('/products')} className="btn-primary" style={{ padding: '13px 28px', fontSize: '0.98rem', borderRadius: 12 }}>
              <Compass size={18} />
              <span>Start Shopping</span>
            </button>
            <button onClick={() => navigate('/stores')} className="btn-secondary" style={{ padding: '13px 28px', fontSize: '0.98rem', borderRadius: 12 }}>
              <StoreIcon size={18} />
              <span>Explore Stores</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 28, marginTop: 48, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {['Verified merchants', 'Direct studio dispatch', 'Doorstep pickup returns'].map(label => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <CheckCircle2 size={16} color="var(--success)" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="reveal" style={sectionStyle}>
        <SectionHeader title="Shop by Category" subtitle="Handpicked collections from independent creators" />
        <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
          {CATEGORIES.map(({ name, icon: Icon, color }) => (
            <button
              key={name}
              onClick={() => navigate(`/products?category=${name}`)}
              className="clean-card lift"
              style={{ padding: '22px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
            >
              <div className="category-icon" style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: `color-mix(in srgb, ${color} 12%, white)`,
                color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12
              }}>
                <Icon size={22} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.96rem', color: 'var(--text-main)' }}>{name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                {loading ? ' ' : `${countFor(name)} products`}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="reveal" style={sectionStyle}>
        <SectionHeader
          eyebrow="Community Favorites"
          eyebrowIcon={Flame}
          eyebrowColor="var(--sale)"
          title="Trending Products"
          linkLabel="View full catalog"
          onLink={() => navigate('/products')}
        />
        {loading ? <SkeletonGrid count={8} height={380} min={260} /> : (
          <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 22 }}>
            {products.slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} navigate={navigate} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Stores */}
      <section className="reveal" style={sectionStyle}>
        <SectionHeader
          eyebrow="Curated Brands"
          eyebrowIcon={StoreIcon}
          title="Featured Stores"
          linkLabel="View all stores"
          onLink={() => navigate('/stores')}
        />
        {loading ? <SkeletonGrid count={6} height={300} min={280} /> : (
          <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 22 }}>
            {stores.slice(0, 6).map(store => (
              <StoreCard key={store.id} store={store} navigate={navigate} />
            ))}
          </div>
        )}
      </section>

      {/* Merchant CTA */}
      <section className="reveal" style={{ ...sectionStyle, paddingBottom: 80 }}>
        <div className="merchant-banner" style={{
          borderRadius: 20,
          padding: '54px 44px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 32,
          boxShadow: '0 24px 48px -16px rgba(30, 63, 176, 0.45)'
        }}>
          <div style={{ maxWidth: 640, position: 'relative' }}>
            <span style={{
              display: 'inline-block',
              background: 'rgba(255, 255, 255, 0.16)',
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
              Open your storefront on ShopAI.
            </h2>
            <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.82)', lineHeight: 1.6 }}>
              Join independent artisans, apparel brands and makers. Full inventory control, order fulfillment and automated returns.
            </p>
          </div>

          <button onClick={() => navigate('/sell')} className="btn-on-dark" style={{ position: 'relative' }}>
            <span>Start Selling Today</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
};
