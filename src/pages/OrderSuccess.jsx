import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  Package, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  ShoppingBag,
  Store
} from 'lucide-react';
import { orderService } from '../services/orderService';

export const OrderSuccess = ({ orderId, navigate }) => {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (orderId) {
        const o = await orderService.getOrderById(orderId);
        setOrder(o);
      }
    };
    fetchOrder();
  }, [orderId]);

  const formatINR = (val) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val || 0);

  return (
    <div className="animate-fade-in" style={{ maxWidth: 700, margin: '60px auto 100px', padding: '0 20px' }}>
      <div className="glass-card" style={{ padding: '40px 32px', textAlign: 'center' }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.15)',
          color: '#10b981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: '0 0 25px rgba(16, 185, 129, 0.25)'
        }}>
          <CheckCircle2 size={42} />
        </div>

        <span className="badge badge-emerald" style={{ marginBottom: 12 }}>
          Order Confirmed
        </span>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 8 }}>
          Order placed successfully!
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: 480, margin: '0 auto 24px' }}>
          Thank you for shopping on ShopAI. Your simulated order has been registered and routed to the merchant.
        </p>

        {order ? (
          <div style={{
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 16,
            padding: '24px',
            textAlign: 'left',
            marginBottom: 28
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 14, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Order ID
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>
                  {order.id}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Total Amount
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                  {formatINR(order.totalAmount)}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--text-subtle)', display: 'block', fontSize: '0.75rem' }}>Store</span>
                <span style={{ fontWeight: 600 }}>{order.storeName}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-subtle)', display: 'block', fontSize: '0.75rem' }}>Estimated Delivery</span>
                <span style={{ fontWeight: 600, color: '#34d399' }}>{order.expectedDelivery}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-subtle)', display: 'block', fontSize: '0.75rem' }}>Delivery Address</span>
                <span style={{ fontWeight: 600 }}>{order.shippingAddress?.city}, {order.shippingAddress?.state}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-subtle)', display: 'block', fontSize: '0.75rem' }}>Payment Method</span>
                <span style={{ fontWeight: 600 }}>{order.paymentMethod}</span>
              </div>
            </div>

            {/* Items list */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 14, marginTop: 14 }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginBottom: 8, fontWeight: 600 }}>
                Ordered Items ({order.items.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {order.items.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <img src={it.image} alt={it.name} style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }} />
                      <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{it.name} × {it.quantity}</span>
                    </div>
                    <span style={{ fontWeight: 700 }}>{formatINR(it.price * it.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '20px', color: 'var(--text-muted)' }}>Loading order data...</div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
          <button
            onClick={() => navigate(`/orders/${orderId || ''}`)}
            className="btn-primary"
            style={{ padding: '12px 28px', fontSize: '0.95rem' }}
          >
            <Package size={17} />
            <span>Track This Order</span>
          </button>

          <button
            onClick={() => navigate('/products')}
            className="btn-secondary"
            style={{ padding: '12px 24px', fontSize: '0.95rem' }}
          >
            <ShoppingBag size={17} />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>
    </div>
  );
};
