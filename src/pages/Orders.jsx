import React, { useEffect, useState } from 'react';
import { 
  Package, 
  Store, 
  Calendar, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2, 
  Clock,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { StatusBadge } from '../components/StatusBadge';

export const Orders = ({ navigate, onOpenReturnModal }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const customerOrders = await orderService.getCustomerOrders("CUST-1");
      setOrders(customerOrders);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const formatINR = (val) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);

  return (
    <div className="animate-fade-in" style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px 80px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#09090b' }}>
          My Orders
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: 4 }}>
          Track recent orders, inspect fulfillment progress, and manage return requests
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          Loading your orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="clean-card" style={{ padding: '60px 30px', textAlign: 'center', borderRadius: 16 }}>
          <Package size={40} style={{ opacity: 0.3, marginBottom: 14, margin: '0 auto' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#09090b' }}>No orders placed yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 6, marginBottom: 20 }}>
            Start browsing the marketplace and support independent stores.
          </p>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Explore Marketplace
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {orders.map(order => (
            <div key={order.id} className="clean-card" style={{ padding: '22px 24px', overflow: 'hidden', borderRadius: 16 }}>
              {/* Order Top Bar */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                paddingBottom: 16,
                borderBottom: '1px solid #f4f4f6',
                marginBottom: 16
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#09090b', fontFamily: 'var(--font-mono)' }}>
                    {order.id}
                  </span>
                  <span style={{ color: '#d1d5db' }}>•</span>
                  <div
                    onClick={() => navigate(`/store/${order.storeId}`)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#2563eb',
                      cursor: 'pointer'
                    }}
                  >
                    <Store size={13} color="#2563eb" />
                    <span>{order.storeName}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Placed on {order.date}
                  </span>
                  <StatusBadge status={order.status} />
                </div>
              </div>

              {/* Order Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 18 }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <img src={item.image} alt={item.name} style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover', backgroundColor: '#f4f4f6' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#09090b' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          Qty: {item.quantity} • {formatINR(item.price)} each
                        </div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#09090b' }}>
                      {formatINR(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Actions */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 16,
                borderTop: '1px solid #f4f4f6',
                gap: 12
              }}>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                  Total: <strong style={{ color: '#09090b', fontSize: '1.05rem' }}>{formatINR(order.totalAmount)}</strong>
                  <span style={{ marginLeft: 8, color: '#71717a' }}>({order.paymentMethod})</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {/* Return Item Button */}
                  {order.status === 'Delivered' && (
                    <button
                      onClick={() => onOpenReturnModal(order)}
                      style={{
                        padding: '7px 14px',
                        borderRadius: 8,
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        background: '#fff1f2',
                        color: '#e11d48',
                        border: '1px solid #fecdd3',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <RotateCcw size={13} />
                      <span>Return Item</span>
                    </button>
                  )}

                  {/* Track Order Button */}
                  <button
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="btn-primary"
                    style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: 8 }}
                  >
                    <span>Track Order</span>
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
