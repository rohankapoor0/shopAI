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
    <div className="animate-fade-in" style={{ maxWidth: 1000, margin: '0 auto', padding: '36px 20px 80px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
          My Orders
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: 4 }}>
          Track recent orders, view fulfillment status, and initiate returns
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          Loading your orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px 30px', textAlign: 'center' }}>
          <Package size={40} style={{ opacity: 0.3, marginBottom: 14 }} />
          <h3>No orders placed yet</h3>
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
            <div key={order.id} className="glass-card" style={{ padding: '22px 24px', overflow: 'hidden' }}>
              {/* Order Top Bar */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                paddingBottom: 16,
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: 16
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>
                    {order.id}
                  </span>
                  <span>•</span>
                  <div
                    onClick={() => navigate(`/store/${order.storeId}`)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--text-main)',
                      cursor: 'pointer'
                    }}
                  >
                    <Store size={13} color="#60a5fa" />
                    <span>{order.storeName}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-subtle)' }}>
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
                      <img src={item.image} alt={item.name} style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#ffffff' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          Qty: {item.quantity} • {formatINR(item.price)} each
                        </div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#ffffff' }}>
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
                borderTop: '1px solid var(--border-subtle)',
                gap: 12
              }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Total: <strong style={{ color: '#ffffff', fontSize: '1.05rem' }}>{formatINR(order.totalAmount)}</strong>
                  <span style={{ marginLeft: 8, color: 'var(--text-subtle)' }}>({order.paymentMethod})</span>
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
                        background: 'rgba(244, 63, 94, 0.1)',
                        color: '#fb7185',
                        border: '1px solid rgba(244, 63, 94, 0.25)',
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
                    style={{ padding: '8px 16px', fontSize: '0.85rem' }}
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
