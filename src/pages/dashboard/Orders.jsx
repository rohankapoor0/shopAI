import React, { useEffect, useState } from 'react';
import { 
  ShoppingCart, 
  Search, 
  ChevronDown, 
  Check, 
  Eye, 
  Truck, 
  X,
  ExternalLink 
} from 'lucide-react';
import { storeService } from '../../services/storeService';
import { orderService } from '../../services/orderService';
import { StatusBadge } from '../../components/StatusBadge';

export const Orders = ({ navigate }) => {
  const [orders, setOrders] = useState([]);
  const [store, setStore] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statuses = [
    "Placed",
    "Confirmed",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled"
  ];

  const loadData = async () => {
    const activeId = storeService.getActiveStoreId();
    const current = await storeService.getStoreById(activeId);
    setStore(current);
    if (current) {
      const ords = await orderService.getStoreOrders(current.id);
      setOrders(ords);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    await orderService.updateOrderStatus(orderId, newStatus);
    loadData();
    if (selectedOrder && selectedOrder.id === orderId) {
      const updated = await orderService.getOrderById(orderId);
      setSelectedOrder(updated);
    }
  };

  const formatINR = (val) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val || 0);

  const filtered = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
                          o.customerName.toLowerCase().includes(search.toLowerCase()) ||
                          o.items.some(it => it.name.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = filterStatus === 'All' || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
          Store Orders
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 2 }}>
          Manage fulfillment stages for customers purchasing from <strong style={{ color: '#ffffff' }}>{store?.name}</strong>. Status changes update customer order tracking in real-time.
        </p>
      </div>

      {/* Orders Table Container */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ position: 'relative', width: 280 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input
              type="text"
              placeholder="Search by ID, customer, item..."
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

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['All', 'Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'].map(st => (
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

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
            <ShoppingCart size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
            <h3>No orders match your filter</h3>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-subtle)', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px' }}>Order ID</th>
                  <th style={{ padding: '10px 12px' }}>Customer</th>
                  <th style={{ padding: '10px 12px' }}>Items</th>
                  <th style={{ padding: '10px 12px' }}>Total</th>
                  <th style={{ padding: '10px 12px' }}>Date</th>
                  <th style={{ padding: '10px 12px' }}>Fulfillment Status</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(ord => (
                  <tr key={ord.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px', fontWeight: 800, color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>
                      {ord.id}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 600, color: '#ffffff' }}>{ord.customerName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{ord.customerEmail}</div>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-main)' }}>
                      {ord.items.map(it => it.name).join(', ')}
                    </td>
                    <td style={{ padding: '12px', fontWeight: 700, color: '#ffffff' }}>
                      {formatINR(ord.totalAmount)}
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>
                      {ord.date}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {/* Interactive Status Selector Dropdown */}
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 8,
                          padding: '6px 10px',
                          color: '#ffffff',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          outline: 'none'
                        }}
                      >
                        {statuses.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 6,
                          background: 'rgba(59, 130, 246, 0.15)',
                          color: '#60a5fa',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <Eye size={13} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inspect Order Modal */}
      {selectedOrder && (
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
            maxWidth: 600,
            width: '100%',
            backgroundColor: '#0f172a',
            border: '1px solid var(--border-strong)',
            borderRadius: 18,
            padding: '28px',
            position: 'relative'
          }}>
            <button
              onClick={() => setSelectedOrder(null)}
              style={{ position: 'absolute', top: 20, right: 20, color: 'var(--text-subtle)' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                {selectedOrder.id}
              </h2>
              <StatusBadge status={selectedOrder.status} />
            </div>

            {/* Quick Status Control within modal */}
            <div style={{ marginBottom: 20, padding: '14px', borderRadius: 10, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#60a5fa', display: 'block', marginBottom: 6 }}>
                Change Fulfillment Status:
              </label>
              <select
                value={selectedOrder.status}
                onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                style={{ width: '100%', height: 40, borderRadius: 8, background: '#1e293b', border: '1px solid var(--border-subtle)', color: '#ffffff', padding: '0 12px', fontSize: '0.9rem' }}
              >
                {statuses.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>
                Recipient & Address
              </div>
              <div style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                <strong>{selectedOrder.customerName}</strong> ({selectedOrder.customerPhone})<br />
                {selectedOrder.shippingAddress?.address}<br />
                {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>
                Order Items
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {selectedOrder.items.map((it, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={it.image} alt={it.name} style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{it.name} × {it.quantity}</span>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{formatINR(it.price * it.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
              <button
                onClick={() => navigate(`/orders/${selectedOrder.id}`)}
                className="btn-secondary"
                style={{ fontSize: '0.82rem' }}
              >
                <ExternalLink size={14} />
                <span>View Customer Tracking View</span>
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="btn-primary"
                style={{ padding: '8px 20px', fontSize: '0.85rem' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
