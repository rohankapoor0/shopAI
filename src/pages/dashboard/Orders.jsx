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
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#09090b', letterSpacing: '-0.02em' }}>
          Store Orders
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: 2 }}>
          Manage fulfillment stages for customers purchasing from <strong style={{ color: '#09090b' }}>{store?.name}</strong>. Status changes update customer order tracking in real-time.
        </p>
      </div>

      {/* Orders Table Container */}
      <div className="clean-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ position: 'relative', width: 280 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
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
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                color: '#09090b',
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
                  backgroundColor: filterStatus === st ? '#18181b' : '#ffffff',
                  color: filterStatus === st ? '#ffffff' : '#64748b',
                  border: '1px solid',
                  borderColor: filterStatus === st ? '#18181b' : '#e2e8f0',
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
          <div style={{ textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
            <ShoppingCart size={38} style={{ opacity: 0.35, marginBottom: 12 }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#09090b' }}>No orders match your filter</h3>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Order ID</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Customer</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Items</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Total</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 600 }}>Fulfillment Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#09090b', fontFamily: 'var(--font-mono)' }}>
                      <button
                        onClick={() => setSelectedOrder(o)}
                        style={{ color: '#09090b', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}
                      >
                        {o.id}
                      </button>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 600, color: '#09090b' }}>{o.customerName}</div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{o.customerEmail}</div>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#475569' }}>
                      {o.items.map(it => `${it.name} (x${it.quantity})`).join(', ')}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#09090b' }}>
                      {formatINR(o.totalAmount)}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#64748b' }}>
                      {o.date}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <StatusBadge status={o.status} />
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: 8,
                          padding: '6px 10px',
                          color: '#09090b',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        {statuses.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Slide-over Modal */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="clean-card animate-fade-in" style={{
            maxWidth: 580,
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: 16,
            padding: '28px',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <button
              onClick={() => setSelectedOrder(null)}
              style={{ position: 'absolute', top: 20, right: 20, color: '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#09090b' }}>
                Order #{selectedOrder.id}
              </h2>
              <StatusBadge status={selectedOrder.status} />
            </div>

            <p style={{ fontSize: '0.84rem', color: '#64748b', marginBottom: 20 }}>
              Placed on {selectedOrder.date} by {selectedOrder.customerName}
            </p>

            <div style={{ padding: '14px', borderRadius: 10, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: 20 }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
                Delivery Address
              </div>
              <div style={{ fontSize: '0.88rem', color: '#09090b', fontWeight: 500 }}>
                {selectedOrder.shippingAddress?.address || '124 Indiranagar, 100ft Road'}, {selectedOrder.shippingAddress?.city || 'Bangalore'}, {selectedOrder.shippingAddress?.pincode || '560038'}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>
                Purchased Items
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={it.image} alt={it.name} style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 600, color: '#09090b', fontSize: '0.88rem' }}>{it.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Qty: {it.quantity}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, color: '#09090b' }}>
                      {formatINR(it.price * it.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: 16, marginBottom: 20 }}>
              <span style={{ fontWeight: 700, color: '#09090b' }}>Total Paid</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#09090b' }}>
                {formatINR(selectedOrder.totalAmount)}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                onClick={() => navigate(`/orders/${selectedOrder.id}`)}
                className="btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.84rem' }}
              >
                <ExternalLink size={14} />
                <span>Customer Tracking View</span>
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.84rem' }}
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
