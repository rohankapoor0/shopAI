import React, { useEffect, useState } from 'react';
import { 
  Check, 
  Clock, 
  Truck, 
  MapPin, 
  Store, 
  RotateCcw, 
  ArrowLeft, 
  Package,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { StatusBadge } from '../components/StatusBadge';

export const OrderTracking = ({ orderId, navigate, onOpenReturnModal }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
      setLoading(false);
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading order tracking details...
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ maxWidth: 500, margin: '80px auto', textAlign: 'center', padding: '0 20px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Order Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: 6, marginBottom: 20 }}>
          Could not locate tracking records for {orderId}.
        </p>
        <button onClick={() => navigate('/orders')} className="btn-primary">View My Orders</button>
      </div>
    );
  }

  const formatINR = (val) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val || 0);

  const stages = [
    { title: "Order Placed", desc: "Received by system" },
    { title: "Confirmed", desc: "Accepted by merchant" },
    { title: "Packed", desc: "Package sealed & labeled" },
    { title: "Shipped", desc: "Handed to courier" },
    { title: "Out for Delivery", desc: "On vehicle for delivery" },
    { title: "Delivered", desc: "Delivered to doorstep" }
  ];

  const currentStageIndex = stages.findIndex(s => s.title.toLowerCase() === order.status.toLowerCase());
  const effectiveIndex = currentStageIndex === -1 ? (order.status === 'Cancelled' ? -1 : 0) : currentStageIndex;

  return (
    <div className="animate-fade-in" style={{ maxWidth: 960, margin: '0 auto', padding: '36px 24px 80px' }}>
      <button
        onClick={() => navigate('/orders')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          color: 'var(--text-muted)',
          fontSize: '0.88rem',
          marginBottom: 24,
          fontWeight: 600
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#09090b'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <ArrowLeft size={16} />
        <span>Back to orders</span>
      </button>

      {/* Header Info */}
      <div className="clean-card" style={{ padding: '24px 28px', marginBottom: 28, borderRadius: 16 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#09090b', fontFamily: 'var(--font-mono)' }}>
                {order.id}
              </h1>
              <StatusBadge status={order.status} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span onClick={() => navigate(`/store/${order.storeId}`)} style={{ color: '#2563eb', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                <Store size={14} /> {order.storeName}
              </span>
              <span>•</span>
              <span>Placed: {order.date}</span>
              <span>•</span>
              <span style={{ color: '#059669', fontWeight: 600 }}>Est: {order.expectedDelivery}</span>
            </div>
          </div>

          {order.status === 'Delivered' && (
            <button
              onClick={() => onOpenReturnModal(order)}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: '0.84rem',
                fontWeight: 600,
                background: '#fff1f2',
                color: '#e11d48',
                border: '1px solid #fecdd3',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <RotateCcw size={14} />
              <span>Return / Replace Item</span>
            </button>
          )}
        </div>
      </div>

      {/* Visual Tracking Stepper */}
      <div className="clean-card" style={{ padding: '36px 28px', marginBottom: 28, borderRadius: 16 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 32, color: '#09090b' }}>
          Fulfillment Timeline
        </h2>

        {/* Stepper Progress Horizontal Container */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {/* Connecting Track Line */}
          <div style={{
            position: 'absolute',
            top: 18,
            left: 24,
            right: 24,
            height: 3,
            background: '#e5e7eb',
            zIndex: 1
          }}>
            <div style={{
              height: '100%',
              width: `${(Math.max(0, effectiveIndex) / (stages.length - 1)) * 100}%`,
              background: '#09090b',
              transition: 'width 0.4s ease'
            }} />
          </div>

          {/* Stepper Nodes */}
          {stages.map((stage, idx) => {
            const isCompleted = idx <= effectiveIndex;
            const isCurrent = idx === effectiveIndex;

            return (
              <div
                key={stage.title}
                style={{
                  position: 'relative',
                  zIndex: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  width: 96
                }}
              >
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isCompleted ? (isCurrent ? '#09090b' : '#059669') : '#ffffff',
                  border: isCompleted ? 'none' : '2px solid #d1d5db',
                  color: isCompleted ? '#ffffff' : '#9ca3af',
                  boxShadow: isCurrent ? '0 0 12px rgba(0, 0, 0, 0.2)' : 'none',
                  transition: 'all 0.3s ease',
                  marginBottom: 10
                }}>
                  {isCompleted ? <Check size={17} strokeWidth={2.5} /> : <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#d1d5db' }} />}
                </div>

                <div style={{
                  fontSize: '0.78rem',
                  fontWeight: isCurrent ? 800 : (isCompleted ? 700 : 500),
                  color: isCompleted ? '#09090b' : '#71717a',
                  lineHeight: 1.3
                }}>
                  {stage.title}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  {stage.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Details Breakdown: Items & Delivery Address */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
        {/* Products in this shipment */}
        <div className="clean-card" style={{ padding: '24px', borderRadius: 14 }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: 16, color: '#09090b' }}>
            Package Contents ({order.items.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {order.items.map((it, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img src={it.image} alt={it.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', backgroundColor: '#f4f4f6' }} />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#09090b' }}>{it.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Qty: {it.quantity}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#09090b' }}>
                  {formatINR(it.price * it.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #f4f4f6', paddingTop: 14, marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Order Total:</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#09090b' }}>{formatINR(order.totalAmount)}</span>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="clean-card" style={{ padding: '24px', borderRadius: 14 }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, color: '#09090b' }}>
            <MapPin size={16} color="#2563eb" />
            <span>Delivery Destination</span>
          </h3>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            <div style={{ fontWeight: 700, color: '#09090b', marginBottom: 2 }}>
              {order.customerName}
            </div>
            <div>{order.shippingAddress?.address}</div>
            <div>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</div>
            <div style={{ marginTop: 8, color: '#71717a', fontSize: '0.8rem' }}>
              Contact: {order.customerPhone}
            </div>
          </div>

          <div style={{ marginTop: 24, padding: '14px', borderRadius: 10, background: '#f8fafc', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '0.76rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
              Payment Method
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: 2, color: '#09090b' }}>
              {order.paymentMethod}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
