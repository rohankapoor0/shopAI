import React, { useEffect, useState } from 'react';
import {
  Boxes,
  AlertTriangle,
  CheckCircle,
  Plus,
  Minus,
  Search
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
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          Inventory Management
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 2 }}>
          Track warehouse stock levels, monitor alerts, and adjust quantities in real time
        </p>
      </div>

      {/* Stock Health Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div className="clean-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--success-tint)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>Healthy Stock</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {products.filter(p => p.stock > 5).length} Items
            </div>
          </div>
        </div>

        <div className="clean-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--warning-tint)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>Low Stock Warning (≤5)</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--warning)' }}>
              {lowStockCount} Items
            </div>
          </div>
        </div>

        <div className="clean-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--sale-tint)', color: 'var(--sale)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Boxes size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>Out of Stock</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--sale)' }}>
              {outOfStockCount} Items
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="clean-card" style={{ padding: '20px' }}>
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
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
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
                  backgroundColor: filterStatus === st ? 'var(--primary-dark)' : '#ffffff',
                  color: filterStatus === st ? '#ffffff' : 'var(--text-muted)',
                  border: '1px solid',
                  borderColor: filterStatus === st ? 'var(--primary-dark)' : 'var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
            <Boxes size={38} style={{ opacity: 0.35, marginBottom: 12 }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>No inventory items found</h3>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Product</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Category</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Current Units</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Health Status</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 600 }}>Adjust Stock</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(prod => (
                  <tr key={prod.id} style={{ borderBottom: '1px solid var(--bg-muted)' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img src={prod.image} alt={prod.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border-subtle)' }} />
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{prod.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}>{prod.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>{prod.category}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        fontSize: '1rem',
                        fontWeight: 800,
                        color: prod.stock === 0 ? 'var(--sale)' : prod.stock <= 5 ? 'var(--warning)' : 'var(--text-main)'
                      }}>
                        {prod.stock}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: 4 }}>units</span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <StatusBadge status={prod.status} />
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <button
                          onClick={() => handleAdjustStock(prod.id, prod.stock, -1)}
                          disabled={prod.stock === 0}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            border: '1px solid var(--border-subtle)',
                            backgroundColor: '#ffffff',
                            color: 'var(--text-main)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: prod.stock === 0 ? 'not-allowed' : 'pointer',
                            opacity: prod.stock === 0 ? 0.4 : 1
                          }}
                          title="Reduce stock by 1"
                        >
                          <Minus size={14} />
                        </button>
                        <button
                          onClick={() => handleAdjustStock(prod.id, prod.stock, 1)}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            border: '1px solid var(--border-subtle)',
                            backgroundColor: '#ffffff',
                            color: 'var(--text-main)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                          title="Increase stock by 1"
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          onClick={() => handleAdjustStock(prod.id, prod.stock, 10)}
                          style={{
                            padding: '4px 8px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            borderRadius: 6,
                            border: '1px solid var(--border-subtle)',
                            backgroundColor: 'var(--bg-muted)',
                            color: 'var(--text-main)',
                            cursor: 'pointer'
                          }}
                          title="Quick Restock +10"
                        >
                          +10
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
