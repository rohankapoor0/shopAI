import React from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Minus, 
  Plus, 
  ArrowRight, 
  Store, 
  ShieldCheck, 
  Truck 
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Cart = ({ navigate }) => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    subtotal, 
    shippingFee, 
    discount, 
    total 
  } = useCart();

  const formatINR = (val) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);

  if (cartItems.length === 0) {
    return (
      <div className="animate-fade-in" style={{ maxWidth: 580, margin: '80px auto', textAlign: 'center', padding: '0 20px' }}>
        <div className="clean-card" style={{ padding: '60px 32px', borderRadius: 16 }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: '#f4f4f6',
            color: '#09090b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px',
            border: '1px solid #e4e4e7'
          }}>
            <ShoppingBag size={28} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#09090b' }}>
            Your Shopping Cart is Empty
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: 8, marginBottom: 28 }}>
            Looks like you haven't added anything to your cart yet. Explore our curated independent stores and trending items!
          </p>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary"
            style={{ padding: '12px 28px', borderRadius: 10 }}
          >
            <span>Explore Catalog</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#09090b' }}>
          Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
        </h1>
        <button
          onClick={clearCart}
          style={{ fontSize: '0.84rem', color: '#e11d48', fontWeight: 600 }}
        >
          Clear Cart
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
        {/* Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {cartItems.map(item => (
            <div
              key={item.id}
              className="clean-card"
              style={{
                padding: '20px',
                display: 'flex',
                gap: 18,
                alignItems: 'center',
                borderRadius: 14
              }}
            >
              {/* Image */}
              <div style={{
                width: 90,
                height: 90,
                borderRadius: 12,
                overflow: 'hidden',
                backgroundColor: '#f4f4f6',
                flexShrink: 0
              }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Item Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  onClick={() => navigate(`/store/${item.storeId}`)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: '0.76rem',
                    color: '#2563eb',
                    cursor: 'pointer',
                    marginBottom: 4,
                    fontWeight: 600
                  }}
                >
                  <Store size={12} />
                  <span>{item.storeName}</span>
                </div>

                <h3
                  onClick={() => navigate(`/product/${item.id}`)}
                  style={{
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    color: '#09090b',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {item.name}
                </h3>

                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#52525b', marginTop: 4 }}>
                  {formatINR(item.price)} each
                </div>

                {/* Counter & Subtotal */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 12
                }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    border: '1px solid #d1d5db',
                    borderRadius: 8,
                    background: '#ffffff'
                  }}>
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#09090b' }}
                    >
                      <Minus size={13} />
                    </button>
                    <span style={{ width: 34, textAlign: 'center', fontSize: '0.85rem', fontWeight: 700, color: '#09090b' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#09090b' }}
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#09090b' }}>
                      {formatINR(item.price * item.quantity)}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{ color: '#9ca3af', transition: 'color 0.15s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#e11d48'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Card */}
        <div>
          <div className="clean-card" style={{ padding: '28px', position: 'sticky', top: 96, borderRadius: 16 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 20, color: '#09090b' }}>
              Order Summary
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: '0.92rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span style={{ color: '#09090b', fontWeight: 700 }}>{formatINR(subtotal)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>Shipping Fee</span>
                  {shippingFee === 0 && <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>FREE</span>}
                </span>
                <span style={{ color: shippingFee === 0 ? '#059669' : '#09090b', fontWeight: 700 }}>
                  {shippingFee === 0 ? '₹0' : formatINR(shippingFee)}
                </span>
              </div>

              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669' }}>
                  <span>Store Discount</span>
                  <span style={{ fontWeight: 700 }}>- {formatINR(discount)}</span>
                </div>
              )}

              <div style={{
                borderTop: '1px solid #f4f4f6',
                paddingTop: 16,
                marginTop: 6,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline'
              }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#09090b' }}>Grand Total</span>
                <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#09090b' }}>{formatINR(total)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn-primary"
              style={{
                width: '100%',
                height: 48,
                justifyContent: 'center',
                fontSize: '0.98rem',
                borderRadius: 10,
                marginTop: 24
              }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={17} />
            </button>

            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.78rem', color: '#71717a' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={14} color="#059669" />
                <span>Simulated secure multi-vendor checkout</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Truck size={14} color="#2563eb" />
                <span>Dispatches from respective verified merchant hubs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
