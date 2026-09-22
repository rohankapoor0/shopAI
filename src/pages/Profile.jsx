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
    <div className="animate-fade-in" style={{ maxWidth: 1080, margin: '0 auto', padding: '36px 20px 80px' }}>
      {/* Profile Header Banner */}
      <div className="glass-card" style={{ padding: '28px 32px', marginBottom: 32 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{
              width: 76,
              height: 76,
              borderRadius: '50%',
              overflow: 'hidden',
              backgroundColor: '#1e293b',
              border: '3px solid #3b82f6',
              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)'
            }}>
              <img
                src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
                alt={user.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>
                  {user.name}
                </h1>
                <span className="badge badge-blue">Customer</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 6, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Mail size={14} color="#60a5fa" /> {user.email}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Phone size={14} color="#34d399" /> {user.phone}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => navigate('/sell')} className="btn-sell">
              <span>Open Your Store</span>
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 24, marginTop: 28, borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
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
                color: activeTab === tab.id ? '#ffffff' : 'var(--text-muted)',
                position: 'relative',
                paddingBottom: 6
              }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span style={{ position: 'absolute', bottom: -16, left: 0, right: 0, height: 2, background: '#3b82f6', borderRadius: 2 }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.length === 0 ? (
            <div className="glass-card" style={{ padding: '50px 20px', textAlign: 'center' }}>
              <Package size={36} style={{ opacity: 0.3, marginBottom: 12 }} />
              <h3>No orders yet</h3>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="glass-card" style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div>
                    <span style={{ fontWeight: 800, color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>{order.id}</span>
                    <span style={{ margin: '0 8px', color: 'var(--text-subtle)' }}>•</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{order.date}</span>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                  {order.items.map((it, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={it.image} alt={it.name} style={{ width: 42, height: 42, borderRadius: 8, objectFit: 'cover' }} />
                        <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{it.name} × {it.quantity}</div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{formatINR(it.price * it.quantity)}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Total: <strong style={{ color: '#ffffff' }}>{formatINR(order.totalAmount)}</strong>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {order.status === 'Delivered' && (
                      <button
                        onClick={() => onOpenReturnModal(order)}
                        style={{ fontSize: '0.82rem', color: '#fb7185', fontWeight: 600, padding: '6px 12px', borderRadius: 6, border: '1px solid rgba(244,63,94,0.3)' }}
                      >
                        Return Item
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="btn-primary"
                      style={{ padding: '6px 14px', fontSize: '0.82rem' }}
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
            <div className="glass-card" style={{ padding: '50px 20px', textAlign: 'center' }}>
              <RotateCcw size={36} style={{ opacity: 0.3, marginBottom: 12 }} />
              <h3>No return requests</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 4 }}>
                Eligible orders can be returned within 7 days of delivery.
              </p>
            </div>
          ) : (
            returns.map(ret => (
              <div key={ret.id} className="glass-card" style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div>
                    <span style={{ fontWeight: 800, color: '#fb7185', fontFamily: 'var(--font-mono)' }}>{ret.id}</span>
                    <span style={{ margin: '0 8px', color: 'var(--text-subtle)' }}>•</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Order {ret.orderId}</span>
                  </div>
                  <StatusBadge status={ret.status} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <img src={ret.productImage} alt={ret.productName} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{ret.productName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Store: {ret.storeName} • Refund: <strong>{formatINR(ret.amount)}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: 8, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Reason: <strong style={{ color: '#ffffff' }}>{ret.reason}</strong> {ret.notes && `• "${ret.notes}"`}
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
            <div key={addr.id} className="glass-card" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span className="badge badge-blue">{addr.label}</span>
                {addr.isDefault && <span className="badge badge-emerald">Default</span>}
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 6 }}>{user.name}</div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {addr.address}<br />
                {addr.city}, {addr.state} - {addr.pincode}
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: 12 }}>
                Phone: {addr.phone}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
