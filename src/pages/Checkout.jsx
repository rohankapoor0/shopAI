import React, { useState } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  Banknote, 
  ShieldCheck, 
  ArrowLeft, 
  Check, 
  Sparkles,
  Lock,
  Store
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';
import confetti from 'canvas-confetti';

export const Checkout = ({ navigate }) => {
  const { cartItems, subtotal, shippingFee, discount, total, clearCart } = useCart();

  // Pre-fill synthetic customer data
  const [formData, setFormData] = useState({
    name: "Rohan Kapoor",
    email: "rohan.kapoor@example.com",
    phone: "+91 98190 44321",
    address: "Flat 402, Magnolia Enclave, 12th Main Road, Indiranagar",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560038"
  });

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [upiId, setUpiId] = useState("rohan.kapoor@okhdfcbank");
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8921");
  const [isPlacing, setIsPlacing] = useState(false);

  const formatINR = (val) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      navigate('/products');
      return;
    }

    setIsPlacing(true);

    try {
      // Primary store from first item
      const primaryStore = cartItems[0];

      const newOrder = await orderService.createOrder({
        storeId: primaryStore.storeId,
        storeName: primaryStore.storeName,
        customerId: "CUST-1",
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        amount: subtotal,
        totalAmount: total,
        paymentMethod: paymentMethod === 'UPI' ? `UPI (${upiId})` : paymentMethod === 'Card' ? `Card (${cardNumber})` : 'Cash on Delivery',
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        }
      });

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      clearCart();
      setTimeout(() => {
        navigate(`/order-success?orderId=${newOrder.id}`);
      }, 700);
    } catch (err) {
      console.error(err);
      setIsPlacing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ maxWidth: 500, margin: '80px auto', textAlign: 'center', padding: '0 20px' }}>
        <h2>Cart is empty</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: 6, marginBottom: 20 }}>
          Please add items to your cart before checking out.
        </p>
        <button onClick={() => navigate('/products')} className="btn-primary">Browse Catalog</button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: 1180, margin: '0 auto', padding: '32px 20px 80px' }}>
      <button
        onClick={() => navigate('/cart')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          color: 'var(--text-muted)',
          fontSize: '0.88rem',
          marginBottom: 24
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to cart</span>
      </button>

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
          Simulated Checkout
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
          Safe sandbox environment • No real financial transactions are executed
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 36 }}>
        {/* Left Column: Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* 1. Customer Information */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>1. Customer Information</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#ffffff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#ffffff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#ffffff' }}
                />
              </div>
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 16 }}>
              2. Shipping Address
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                  Street Address / Apartment
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#ffffff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#ffffff' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#ffffff' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                    PIN Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#ffffff' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 16 }}>
              3. Payment Method
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* UPI */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 16px',
                borderRadius: 10,
                border: '1px solid',
                borderColor: paymentMethod === 'UPI' ? '#3b82f6' : 'var(--border-subtle)',
                background: paymentMethod === 'UPI' ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'UPI'}
                  onChange={() => setPaymentMethod('UPI')}
                  style={{ accentColor: '#3b82f6' }}
                />
                <Smartphone size={20} color="#60a5fa" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>UPI / QR Code</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Google Pay, PhonePe, Paytm, BHIM</div>
                </div>
              </label>

              {paymentMethod === 'UPI' && (
                <div style={{ padding: '0 10px 10px 38px' }}>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="example@upi"
                    style={{
                      width: '100%',
                      height: 38,
                      padding: '0 12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 8,
                      color: '#ffffff',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              )}

              {/* Credit/Debit Card */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 16px',
                borderRadius: 10,
                border: '1px solid',
                borderColor: paymentMethod === 'Card' ? '#3b82f6' : 'var(--border-subtle)',
                background: paymentMethod === 'Card' ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Card'}
                  onChange={() => setPaymentMethod('Card')}
                  style={{ accentColor: '#3b82f6' }}
                />
                <CreditCard size={20} color="#a78bfa" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>Credit / Debit Card</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Visa, Mastercard, RuPay</div>
                </div>
              </label>

              {paymentMethod === 'Card' && (
                <div style={{ padding: '0 10px 10px 38px' }}>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    style={{
                      width: '100%',
                      height: 38,
                      padding: '0 12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 8,
                      color: '#ffffff',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              )}

              {/* Cash on Delivery */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 16px',
                borderRadius: 10,
                border: '1px solid',
                borderColor: paymentMethod === 'COD' ? '#3b82f6' : 'var(--border-subtle)',
                background: paymentMethod === 'COD' ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  style={{ accentColor: '#3b82f6' }}
                />
                <Banknote size={20} color="#34d399" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>Cash on Delivery</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Pay cash or UPI upon doorstep arrival</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Review */}
        <div>
          <div className="glass-card" style={{ padding: '26px', position: 'sticky', top: 96 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 18, color: '#ffffff' }}>
              Items in Order ({cartItems.length})
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxHeight: 240, overflowY: 'auto', marginBottom: 20 }}>
              {cartItems.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <img src={item.image} alt={item.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Qty: {item.quantity} • {formatINR(item.price)}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                    {formatINR(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>{formatINR(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Delivery</span>
                <span style={{ color: '#34d399', fontWeight: 600 }}>{shippingFee === 0 ? 'FREE' : formatINR(shippingFee)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399' }}>
                  <span>Discount</span>
                  <span>- {formatINR(discount)}</span>
                </div>
              )}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>Total to Pay</span>
                <span style={{ fontWeight: 800, fontSize: '1.4rem', color: '#ffffff' }}>{formatINR(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPlacing}
              className="btn-primary"
              style={{
                width: '100%',
                height: 48,
                justifyContent: 'center',
                fontSize: '1rem',
                borderRadius: 12,
                marginTop: 22
              }}
            >
              <Lock size={16} />
              <span>{isPlacing ? 'Placing Order...' : 'Place Order'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
