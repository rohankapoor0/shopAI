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
    <div className="animate-fade-in" style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 20px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#60a5fa', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
          <Store size={16} />
          <span>Independent Brands Directory</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
          Explore Verified Stores
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: 6, maxWidth: 640 }}>
          Browse boutique storefronts, directly support independent creators across India, and inspect their full inventory.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: 32, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: 400 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
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
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 10,
              color: '#ffffff',
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
                background: selectedCategory === cat ? '#3b82f6' : 'rgba(255, 255, 255, 0.05)',
                color: selectedCategory === cat ? '#ffffff' : 'var(--text-muted)',
                border: '1px solid',
                borderColor: selectedCategory === cat ? '#3b82f6' : 'var(--border-subtle)',
                transition: 'all 0.15s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SlidersHorizontal size={15} color="var(--text-subtle)" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 10,
              padding: '8px 12px',
              fontSize: '0.85rem',
              color: '#ffffff',
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
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <Store size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
          <h3>No stores found matching your criteria.</h3>
          <p style={{ fontSize: '0.9rem', marginTop: 4 }}>Try adjusting your search terms or category filter.</p>
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
