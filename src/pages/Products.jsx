import React, { useEffect, useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Filter, 
  X, 
  Check, 
  Sparkles,
  ShoppingBag,
  Star
} from 'lucide-react';
import { productService } from '../services/productService';
import { ProductCard } from '../components/ProductCard';

export const Products = ({ initialSearch = '', initialCategory = 'All', navigate }) => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [maxPrice, setMaxPrice] = useState(15000);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('popularity');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Fashion', 'Electronics', 'Home', 'Beauty', 'Sports', 'Accessories'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await productService.getProducts({
        category: selectedCategory,
        search,
        maxPrice: Number(maxPrice),
        minRating: Number(minRating),
        sortBy
      });
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, [search, selectedCategory, maxPrice, minRating, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setMaxPrice(15000);
    setMinRating(0);
    setSortBy('popularity');
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: 30, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#2563eb', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
            <ShoppingBag size={15} />
            <span>Curated Marketplace Catalog</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#09090b' }}>
            Browse All Products
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: 4 }}>
            Showing {products.length} verified items from independent storefronts
          </p>
        </div>

        {/* Mobile Filter Trigger */}
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="btn-secondary mobile-filter-btn"
          style={{ display: 'none', alignItems: 'center', gap: 8 }}
        >
          <Filter size={16} />
          <span>Filters & Sort</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 32 }} className="catalog-layout">
        {/* Left Filters Sidebar */}
        <aside className="filters-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="clean-card" style={{ padding: '22px', borderRadius: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 6, color: '#09090b' }}>
                <Filter size={15} color="#09090b" />
                <span>Refine Search</span>
              </div>
              <button
                onClick={resetFilters}
                style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 600 }}
              >
                Reset All
              </button>
            </div>

            {/* Keyword Search */}
            <div style={{ marginBottom: 22 }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>
                Search Keyword
              </label>
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type="text"
                  placeholder="Hoodie, Keyboard..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: '100%',
                    height: 38,
                    paddingLeft: 34,
                    paddingRight: 12,
                    background: '#f4f4f6',
                    border: '1px solid transparent',
                    borderRadius: 8,
                    color: '#09090b',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div style={{ marginBottom: 22 }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 10 }}>
                Category
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '7px 10px',
                      borderRadius: 6,
                      fontSize: '0.86rem',
                      background: selectedCategory === cat ? '#09090b' : 'transparent',
                      color: selectedCategory === cat ? '#ffffff' : '#52525b',
                      fontWeight: selectedCategory === cat ? 600 : 400,
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.82rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Max Price</span>
                <span style={{ fontWeight: 700, color: '#09090b' }}>₹{Number(maxPrice).toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="500"
                max="15000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                style={{ width: '100%', accentColor: '#09090b', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#9ca3af', marginTop: 4 }}>
                <span>₹500</span>
                <span>₹15,000</span>
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>
                Minimum Rating
              </label>
              <div style={{ display: 'flex', gap: 6 }}>
                {[0, 4.0, 4.5, 4.8].map(r => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    style={{
                      flex: 1,
                      padding: '6px 4px',
                      borderRadius: 6,
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      border: '1px solid',
                      borderColor: minRating === r ? '#09090b' : '#e5e7eb',
                      background: minRating === r ? '#09090b' : '#f4f4f6',
                      color: minRating === r ? '#ffffff' : '#52525b'
                    }}
                  >
                    {r === 0 ? 'All' : `${r}★`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Catalog Content */}
        <main>
          {/* Top Sort & Summary */}
          <div className="clean-card" style={{ padding: '12px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 12 }}>
            <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              Showing <strong style={{ color: '#09090b' }}>{products.length}</strong> results
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: 8,
                  padding: '6px 12px',
                  fontSize: '0.84rem',
                  color: '#09090b',
                  outline: 'none'
                }}
              >
                <option value="popularity">Popularity / Bestsellers</option>
                <option value="rating">Customer Rating</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '70px 20px', color: 'var(--text-muted)' }} className="clean-card">
              <ShoppingBag size={42} style={{ opacity: 0.3, marginBottom: 12, margin: '0 auto' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#09090b', fontWeight: 700 }}>No matching products found</h3>
              <p style={{ fontSize: '0.88rem', marginTop: 4, marginBottom: 18 }}>
                Try relaxing your price filters or searching for another term.
              </p>
              <button onClick={resetFilters} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 20
            }}>
              {products.map(product => (
                <ProductCard key={product.id} product={product} navigate={navigate} />
              ))}
            </div>
          )}
        </main>
      </div>

      <style>{`
        @media (max-width: 840px) {
          .catalog-layout { grid-template-columns: 1fr !important; }
          .filters-sidebar { display: none !important; }
          .mobile-filter-btn { display: inline-flex !important; }
        }
      `}</style>
    </div>
  );
};
