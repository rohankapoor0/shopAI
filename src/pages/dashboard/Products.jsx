import React, { useEffect, useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Check, 
  X, 
  Upload, 
  Sparkles 
} from 'lucide-react';
import { storeService } from '../../services/storeService';
import { productService } from '../../services/productService';
import { StatusBadge } from '../../components/StatusBadge';

export const Products = ({ navigate }) => {
  const [products, setProducts] = useState([]);
  const [store, setStore] = useState(null);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Fashion',
    price: '',
    discount: '20% OFF',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    description: ''
  });

  const loadProducts = async () => {
    const activeId = storeService.getActiveStoreId();
    const current = await storeService.getStoreById(activeId);
    setStore(current);
    if (current) {
      const items = await productService.getProductsByStore(current.id);
      setProducts(items);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: store?.category || 'Fashion',
      price: '',
      discount: '25% OFF',
      stock: 12,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      description: 'Handcrafted premium quality product with authentic materials.'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      discount: prod.discount || '',
      stock: prod.stock,
      image: prod.image,
      description: prod.description || ''
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to remove this product from your store?")) {
      await productService.deleteProduct(id);
      loadProducts();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!store) return;

    if (editingProduct) {
      await productService.updateProduct(editingProduct.id, {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock)
      });
    } else {
      await productService.addProduct({
        ...formData,
        storeId: store.id,
        storeName: store.name,
        price: Number(formData.price),
        stock: Number(formData.stock)
      });
    }

    setModalOpen(false);
    loadProducts();
  };

  const formatINR = (val) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val || 0);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Products
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 2 }}>
            Manage catalog, pricing, and live inventory status for {store?.name}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-primary"
          style={{ padding: '9px 18px', fontSize: '0.88rem' }}
        >
          <Plus size={16} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filter and Product Table Card */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ position: 'relative', width: 300 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                height: 38,
                paddingLeft: 34,
                paddingRight: 12,
                borderRadius: 8,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing {filteredProducts.length} items
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
            <Package size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
            <h3>No products found</h3>
            <p style={{ fontSize: '0.85rem', marginTop: 4 }}>Add your first item to make it visible on your storefront.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-subtle)', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px' }}>Product</th>
                  <th style={{ padding: '10px 12px' }}>Category</th>
                  <th style={{ padding: '10px 12px' }}>Price</th>
                  <th style={{ padding: '10px 12px' }}>Stock</th>
                  <th style={{ padding: '10px 12px' }}>Status</th>
                  <th style={{ padding: '10px 12px' }}>Sales</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(prod => (
                  <tr key={prod.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img src={prod.image} alt={prod.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontWeight: 600, color: '#ffffff' }}>{prod.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}>{prod.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{prod.category}</td>
                    <td style={{ padding: '12px', fontWeight: 700 }}>{formatINR(prod.price)}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ fontWeight: 600 }}>{prod.stock}</span> units
                    </td>
                    <td style={{ padding: '12px' }}>
                      <StatusBadge status={prod.status} />
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{prod.sales || 0}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 8 }}>
                        <button
                          onClick={() => navigate(`/product/${prod.id}`)}
                          style={{ padding: 6, color: 'var(--text-subtle)', borderRadius: 6 }}
                          title="View on Storefront"
                        >
                          <ExternalLink size={15} />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          style={{ padding: 6, color: '#60a5fa', borderRadius: 6 }}
                          title="Edit Product"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id)}
                          style={{ padding: 6, color: '#fb7185', borderRadius: 6 }}
                          title="Delete Product"
                        >
                          <Trash2 size={15} />
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

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="glass-card animate-fade-in" style={{
            maxWidth: 560,
            width: '100%',
            backgroundColor: '#0f172a',
            border: '1px solid var(--border-strong)',
            borderRadius: 18,
            padding: '28px',
            position: 'relative'
          }}>
            <button
              onClick={() => setModalOpen(false)}
              style={{ position: 'absolute', top: 20, right: 20, color: 'var(--text-subtle)' }}
            >
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', marginBottom: 4 }}>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>
              Updates will immediately reflect in your public store and across search.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#ffffff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                    Price (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 2499"
                    style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#ffffff' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                    Available Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#ffffff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#ffffff', outline: 'none' }}
                  >
                    {['Fashion', 'Electronics', 'Home', 'Beauty', 'Sports', 'Accessories'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                    Discount Badge Tag
                  </label>
                  <input
                    type="text"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    placeholder="e.g. 20% OFF"
                    style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#ffffff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                  Product Image URL
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#ffffff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#ffffff', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  {editingProduct ? 'Save Changes' : 'Publish to Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
