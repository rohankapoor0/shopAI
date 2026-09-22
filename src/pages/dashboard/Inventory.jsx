import React, { useEffect, useState } from 'react';
import { 
  Boxes, 
  AlertTriangle, 
  CheckCircle, 
  Plus, 
  Minus, 
  Search,
  ArrowUpDown
} from 'lucide-react';
import { storeService } from '../../services/storeService';
import { productService } from '../../services/productService';
import { StatusBadge } from '../../components/StatusBadge';

export const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [store, setStore] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const loadData = async () => {
    const activeId = storeService.getActiveStoreId();
    const current = await storeService.getStoreById(activeId);
    setStore(current);
    if (current) {
      const prods = await productService.getProductsByStore(current.id);
      setProducts(prods);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdjustStock = async (prodId, currentStock, delta) => {
    const newStock = Math.max(0, currentStock + delta);
    await productService.updateProduct(prodId, { stock: newStock });
    loadData();
  };

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const lowStockCount = products.filter(p => p.stock <= 5 && p.stock > 0).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Title */}
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
          Inventory Management
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 2 }}>
          Track warehouse stock levels, configure low-stock alerts, and perform quick adjustments
        </p>
      </div>

      {/* Stock Health Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <div className="glass-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(16, 185, 129, 0.12)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Healthy Stock</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
              {products.filter(p => p.stock > 5).length} Items
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Low Stock Warning (≤5)</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24' }}>
              {lowStockCount} Items
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(244, 63, 94, 0.12)', color: '#fb7185', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Boxes size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Out of Stock</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fb7185' }}>
              {outOfStockCount} Items
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ position: 'relative', width: 280 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input
              type="text"
              placeholder="Search inventory by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                height: 38,
                paddingLeft: 34,
                borderRadius: 8,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {['All', 'In Stock', 'Low Stock', 'Out of Stock'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: filterStatus === st ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  color: filterStatus === st ? '#60a5fa' : 'var(--text-muted)',
                  border: '1px solid',
                  borderColor: filterStatus === st ? '#3b82f6' : 'var(--border-subtle)'
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-subtle)', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px' }}>Product</th>
                <th style={{ padding: '10px 12px' }}>Category</th>
                <th style={{ padding: '10px 12px' }}>Stock Units</th>
                <th style={{ padding: '10px 12px' }}>Health Status</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Quick Adjust</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={p.image} alt={p.name} style={{ width: 42, height: 42, borderRadius: 8, objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 600, color: '#ffffff' }}>{p.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{p.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{p.category}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: p.stock <= 5 ? '#fbbf24' : '#ffffff' }}>
                      {p.stock}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <StatusBadge status={p.status} />
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <button
                        onClick={() => handleAdjustStock(p.id, p.stock, -1)}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff'
                        }}
                        title="Reduce stock by 1"
                      >
                        <Minus size={13} />
                      </button>
                      <button
                        onClick={() => handleAdjustStock(p.id, p.stock, 5)}
                        style={{
                          padding: '0 8px',
                          height: 28,
                          borderRadius: 6,
                          background: 'rgba(59, 130, 246, 0.15)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: '#60a5fa'
                        }}
                        title="Restock +5"
                      >
                        <Plus size={12} />
                        <span>5</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
