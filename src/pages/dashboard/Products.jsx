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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#09090b', letterSpacing: '-0.02em' }}>
            Products
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: 2 }}>
            Manage catalog, pricing, and live inventory status for {store?.name}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-primary"
          style={{ padding: '8px 16px', fontSize: '0.86rem' }}
        >
          <Plus size={16} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filter and Product Table Card */}
      <div className="clean-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ position: 'relative', width: 280 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
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
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                color: '#09090b',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 500 }}>
            Showing {filteredProducts.length} items
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
            <Package size={38} style={{ opacity: 0.35, marginBottom: 12, strokeWidth: 1.5 }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#09090b' }}>No products found</h3>
            <p style={{ fontSize: '0.85rem', marginTop: 4 }}>Add your first item to make it visible on your storefront.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Product</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Category</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Price</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Stock</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Sales</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(prod => (
                  <tr key={prod.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img src={prod.image} alt={prod.name} style={{ width: 42, height: 42, borderRadius: 8, objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                        <div>
                          <div style={{ fontWeight: 600, color: '#09090b' }}>{prod.name}</div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>{prod.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#64748b' }}>{prod.category}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#09090b' }}>{formatINR(prod.price)}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontWeight: 600, color: '#09090b' }}>{prod.stock}</span> units
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <StatusBadge status={prod.status} />
                    </td>
                    <td style={{ padding: '12px 14px', color: '#64748b' }}>{prod.sales || 0}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          onClick={() => navigate(`/product/${prod.id}`)}
                          style={{ padding: 6, color: '#64748b', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, cursor: 'pointer' }}
                          title="View on Storefront"
                        >
                          <ExternalLink size={14} />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          style={{ padding: 6, color: '#2563eb', background: '#eff6ff', border: '1px solid #dbeafe', borderRadius: 6, cursor: 'pointer' }}
                          title="Edit Product"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id)}
                          style={{ padding: 6, color: '#e11d48', background: '#fff1f2', border: '1px solid #ffe4e6', borderRadius: 6, cursor: 'pointer' }}
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
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
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="clean-card animate-fade-in" style={{
            maxWidth: 540,
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: 16,
            padding: '28px',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <button
              onClick={() => setModalOpen(false)}
              style={{ position: 'absolute', top: 20, right: 20, color: '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#09090b', marginBottom: 4 }}>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#64748b', marginBottom: 20 }}>
              Specify title, category, pricing, and initial stock count.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#09090b', display: 'block', marginBottom: 6 }}>
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Pure Linen Casual Shirt"
                  style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, border: '1px solid #e2e8f0', color: '#09090b' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#09090b', display: 'block', marginBottom: 6 }}>
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', height: 42, padding: '0 12px', borderRadius: 8, border: '1px solid #e2e8f0', color: '#09090b' }}
                  >
                    <option value="Fashion">Fashion</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Art & Crafts">Art & Crafts</option>
                    <option value="Organic & Food">Organic & Food</option>
                    <option value="Beauty">Beauty</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#09090b', display: 'block', marginBottom: 6 }}>
                    Price (INR ₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="1499"
                    style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, border: '1px solid #e2e8f0', color: '#09090b' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#09090b', display: 'block', marginBottom: 6 }}>
                    Discount Label
                  </label>
                  <input
                    type="text"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    placeholder="20% OFF"
                    style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, border: '1px solid #e2e8f0', color: '#09090b' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#09090b', display: 'block', marginBottom: 6 }}>
                    Stock Units *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, border: '1px solid #e2e8f0', color: '#09090b' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#09090b', display: 'block', marginBottom: 6 }}>
                  Product Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, border: '1px solid #e2e8f0', color: '#09090b' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#09090b', display: 'block', marginBottom: 6 }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0', color: '#09090b', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary"
                  style={{ padding: '9px 18px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '9px 22px' }}
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
