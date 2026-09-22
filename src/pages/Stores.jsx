import React, { useEffect, useState } from 'react';
import { Store, Search, Filter, SlidersHorizontal } from 'lucide-react';
import { storeService } from '../services/storeService';
import { StoreCard } from '../components/StoreCard';

export const Stores = ({ navigate }) => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('rating');

  const categories = ['All', 'Fashion', 'Electronics', 'Home', 'Sports', 'Beauty'];

  useEffect(() => {
    const load = async () => {
      const data = await storeService.getStores();
      setStores(data);
    };
    load();
  }, []);

  const filteredStores = stores
    .filter(store => {
      const matchesCategory = selectedCategory === 'All' || store.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = store.name.toLowerCase().includes(search.toLowerCase()) ||
                            store.description.toLowerCase().includes(search.toLowerCase()) ||
                            store.location.city.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'products') return b.productsCount - a.productsCount;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="animate-fade-in" style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#2563eb', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
          <Store size={15} />
          <span>Independent Brands Directory</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#09090b' }}>
          Explore Verified Stores
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: 6, maxWidth: 640 }}>
          Discover curated boutique storefronts, directly support independent creators across India, and inspect their full inventory.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="clean-card" style={{ padding: '16px 20px', marginBottom: 32, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between', borderRadius: 14 }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: 380 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input
            type="text"
            placeholder="Search store name, city, tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              height: 40,
              paddingLeft: 40,
              paddingRight: 16,
              background: '#f4f4f6',
              border: '1px solid transparent',
              borderRadius: 10,
              color: '#09090b',
              fontSize: '0.88rem'
            }}
          />
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 600,
                background: selectedCategory === cat ? '#09090b' : '#f4f4f6',
                color: selectedCategory === cat ? '#ffffff' : '#52525b',
                border: '1px solid',
                borderColor: selectedCategory === cat ? '#09090b' : '#e5e7eb',
                transition: 'all 0.15s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SlidersHorizontal size={15} color="#71717a" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              background: '#ffffff',
              border: '1px solid #d1d5db',
              borderRadius: 8,
              padding: '8px 12px',
              fontSize: '0.85rem',
              color: '#09090b',
              outline: 'none'
            }}
          >
            <option value="rating">Highest Rated</option>
            <option value="products">Most Products</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Store Grid */}
      {filteredStores.length === 0 ? (
        <div className="clean-card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <Store size={40} style={{ opacity: 0.3, marginBottom: 12, margin: '0 auto' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#09090b', marginBottom: 4 }}>No stores found</h3>
          <p style={{ fontSize: '0.9rem' }}>Try adjusting your search terms or category filter.</p>
          <button
            onClick={() => { setSearch(''); setSelectedCategory('All'); }}
            className="btn-secondary"
            style={{ marginTop: 16 }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 22
        }}>
          {filteredStores.map(store => (
            <StoreCard key={store.id} store={store} navigate={navigate} />
          ))}
        </div>
      )}
    </div>
  );
};
