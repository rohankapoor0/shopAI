import React, { useEffect, useState } from 'react';
import { 
  User, 
  MapPin, 
  Package, 
  RotateCcw, 
  Phone, 
  Mail, 
  Plus, 
  ShieldCheck, 
  Store,
  ChevronRight
} from 'lucide-react';
import { customerService } from '../services/customerService';
import { orderService } from '../services/orderService';
import { returnService } from '../services/returnService';
import { StatusBadge } from '../components/StatusBadge';

export const Profile = ({ navigate, onOpenReturnModal }) => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    const load = async () => {
      const u = customerService.getCurrentUser();
      setUser(u);
      const o = await orderService.getCustomerOrders(u.id);
      setOrders(o);
      const r = await returnService.getCustomerReturns(u.id);
      setReturns(r);
    };
    load();
  }, []);

  const formatINR = (val) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val || 0);

  if (!user) return null;

  return (
    <div className="animate-fade-in" style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Profile Header Banner */}
      <div className="clean-card" style={{ padding: '28px 32px', marginBottom: 32, borderRadius: 16 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{
              width: 74,
              height: 74,
              borderRadius: '50%',
              overflow: 'hidden',
              backgroundColor: '#f4f4f6',
              border: '2px solid #09090b',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}>
              <img
                src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
                alt={user.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#09090b' }}>
                  {user.name}
                </h1>
                <span className="badge badge-neutral">Customer</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 6, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Mail size={14} color="#2563eb" /> {user.email}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Phone size={14} color="#059669" /> {user.phone}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => navigate('/sell')} className="btn-primary" style={{ padding: '9px 18px', fontSize: '0.86rem' }}>
              <span>Open Your Store</span>
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 28, marginTop: 28, borderTop: '1px solid #f4f4f6', paddingTop: 16 }}>
          {[
            { id: 'orders', label: `My Orders (${orders.length})` },
            { id: 'returns', label: `Return Requests (${returns.length})` },
            { id: 'addresses', label: 'Saved Addresses' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                fontSize: '0.92rem',
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? '#09090b' : '#52525b',
                position: 'relative',
                paddingBottom: 6
              }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span style={{ position: 'absolute', bottom: -16, left: 0, right: 0, height: 2, background: '#09090b', borderRadius: 2 }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.length === 0 ? (
            <div className="clean-card" style={{ padding: '50px 20px', textAlign: 'center', borderRadius: 14 }}>
              <Package size={36} style={{ opacity: 0.3, marginBottom: 12, margin: '0 auto' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#09090b' }}>No orders yet</h3>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="clean-card" style={{ padding: '20px 24px', borderRadius: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div>
                    <span style={{ fontWeight: 800, color: '#09090b', fontFamily: 'var(--font-mono)' }}>{order.id}</span>
                    <span style={{ margin: '0 8px', color: '#d1d5db' }}>•</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{order.date}</span>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                  {order.items.map((it, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={it.image} alt={it.name} style={{ width: 42, height: 42, borderRadius: 8, objectFit: 'cover' }} />
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#09090b' }}>{it.name} × {it.quantity}</div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#09090b' }}>{formatINR(it.price * it.quantity)}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f4f4f6', paddingTop: 14 }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Total: <strong style={{ color: '#09090b' }}>{formatINR(order.totalAmount)}</strong>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {order.status === 'Delivered' && (
                      <button
                        onClick={() => onOpenReturnModal(order)}
                        style={{ fontSize: '0.82rem', color: '#e11d48', fontWeight: 600, padding: '6px 12px', borderRadius: 6, border: '1px solid #fecdd3', background: '#fff1f2' }}
                      >
                        Return Item
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="btn-secondary"
                      style={{ padding: '6px 14px', fontSize: '0.82rem', borderRadius: 6 }}
                    >
                      Track Order
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Returns */}
      {activeTab === 'returns' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {returns.length === 0 ? (
            <div className="clean-card" style={{ padding: '50px 20px', textAlign: 'center', borderRadius: 14 }}>
              <RotateCcw size={36} style={{ opacity: 0.3, marginBottom: 12, margin: '0 auto' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#09090b' }}>No return requests</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 4 }}>
                Eligible orders can be returned within 7 days of delivery.
              </p>
            </div>
          ) : (
            returns.map(ret => (
              <div key={ret.id} className="clean-card" style={{ padding: '20px 24px', borderRadius: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div>
                    <span style={{ fontWeight: 800, color: '#e11d48', fontFamily: 'var(--font-mono)' }}>{ret.id}</span>
                    <span style={{ margin: '0 8px', color: '#d1d5db' }}>•</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Order {ret.orderId}</span>
                  </div>
                  <StatusBadge status={ret.status} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <img src={ret.productImage} alt={ret.productName} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#09090b' }}>{ret.productName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Store: {ret.storeName} • Refund: <strong>{formatINR(ret.amount)}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #e5e7eb', padding: '10px 14px', borderRadius: 8, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Reason: <strong style={{ color: '#09090b' }}>{ret.reason}</strong> {ret.notes && `• "${ret.notes}"`}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {user.addresses?.map(addr => (
            <div key={addr.id} className="clean-card" style={{ padding: '22px', borderRadius: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span className="badge badge-blue">{addr.label}</span>
                {addr.isDefault && <span className="badge badge-emerald">Default</span>}
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#09090b', marginBottom: 6 }}>{user.name}</div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {addr.address}<br />
                {addr.city}, {addr.state} - {addr.pincode}
              </p>
              <div style={{ fontSize: '0.8rem', color: '#71717a', marginTop: 12 }}>
                Phone: {addr.phone}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
