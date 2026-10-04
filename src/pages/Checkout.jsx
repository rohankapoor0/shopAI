import React, { useState } from 'react';
import {
  CreditCard,
  Smartphone,
  Banknote,
  ArrowLeft,
  Lock
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';
import { customerService } from '../services/customerService';
import confetti from 'canvas-confetti';

export const Checkout = ({ navigate }) => {
  const { cartItems, subtotal, shippingFee, discount, total, clearCart } = useCart();

  // Pre-fill from the signed-in shopper and their default saved address
  const [customer] = useState(() => customerService.getCurrentUser());
  const [formData, setFormData] = useState(() => {
    const addr = customer.addresses?.find(a => a.isDefault) ?? customer.addresses?.[0] ?? {};
    return {
      name: customer.name ?? '',
      email: customer.email ?? '',
      phone: customer.phone ?? '',
      address: addr.address ?? '',
      city: addr.city ?? '',
      state: addr.state ?? '',
      pincode: addr.pincode ?? ''
    };
  });

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [isPlacing, setIsPlacing] = useState(false);
  const [errors, setErrors] = useState({});
  const [orderError, setOrderError] = useState('');

  const REQUIRED_FIELDS = {
    name: 'Full Name',
    email: 'Email Address',
    phone: 'Phone Number',
    address: 'Street Address',
    city: 'City',
    state: 'State',
    pincode: 'PIN Code'
  };

  // Returns { fieldKey: label } for every required field that is blank
  const getMissingFields = () => {
    const values = { ...formData, upiId, cardNumber };
    const required = { ...REQUIRED_FIELDS };
    if (paymentMethod === 'UPI') required.upiId = 'UPI ID';
    if (paymentMethod === 'Card') required.cardNumber = 'Card Number';
    return Object.fromEntries(Object.entries(required).filter(([key]) => !String(values[key] ?? '').trim()));
  };

  const clearError = (key) => {
    if (errors[key]) setErrors(({ [key]: _removed, ...rest }) => rest);
  };

  const updateField = (key, value) => {
    setFormData({ ...formData, [key]: value });
    clearError(key);
  };

  const fieldError = (key) => errors[key] && (
    <div style={{ color: 'var(--error)', fontSize: '0.75rem', fontWeight: 600, marginTop: 4 }}>Required</div>
  );

  const formatINR = (val) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (isPlacing) return;
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      navigate('/products');
      return;
    }

    const missing = getMissingFields();
    if (Object.keys(missing).length > 0) {
      setErrors(missing);
      return;
    }

    setIsPlacing(true);
    setOrderError('');

    try {
      // The Lambda re-prices the cart, checks stock, creates one order per store (splitting shipping and
      // discount by each store's share) and decrements stock, all in one transaction.
      const { orders: newOrders } = await orderService.createOrders({
        items: cartItems.map(item => ({ productId: item.id, quantity: item.quantity })),
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        paymentMethod: paymentMethod === 'UPI' ? `UPI (${upiId})` : paymentMethod === 'Card' ? `Card (•••• ${cardNumber.replace(/\D/g, '').slice(-4)})` : 'Cash on Delivery',
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

      // Navigate before clearing the cart so the empty-cart screen never flashes
      setTimeout(() => {
        navigate(`/order-success?orderId=${newOrders.map(o => o.id).join(',')}`);
        clearCart();
      }, 700);
    } catch (err) {
      console.error(err);
      setOrderError(err.status === 409 ? `Not enough stock: ${err.message}. Update your cart to continue.` : err.message);
      setIsPlacing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ maxWidth: 500, margin: '80px auto', textAlign: 'center', padding: '0 20px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Cart is empty</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: 6, marginBottom: 20 }}>
          Please add items to your cart before checking out.
        </p>
        <button onClick={() => navigate('/products')} className="btn-primary">Browse Catalog</button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: 1180, margin: '0 auto', padding: '36px 24px 80px' }}>
      <button
        onClick={() => navigate('/cart')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          color: 'var(--text-muted)',
          fontSize: '0.88rem',
          marginBottom: 24,
          fontWeight: 600
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <ArrowLeft size={16} />
        <span>Back to cart</span>
      </button>

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
          Simulated Checkout
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: 4 }}>
          Safe sandbox environment • High-trust multi-vendor local simulation
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} noValidate style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 36 }}>
        {/* Left Column: Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* 1. Customer Information */}
          <div className="clean-card" style={{ padding: '24px', borderRadius: 14 }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)' }}>
              1. Customer Information
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
                  aria-invalid={!!errors.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, background: '#ffffff', border: `1px solid ${errors.name ? 'var(--error)' : 'var(--border-strong)'}`, color: 'var(--text-main)' }}
                />
                {fieldError('name')}
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  aria-invalid={!!errors.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, background: '#ffffff', border: `1px solid ${errors.email ? 'var(--error)' : 'var(--border-strong)'}`, color: 'var(--text-main)' }}
                />
                {fieldError('email')}
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  aria-invalid={!!errors.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, background: '#ffffff', border: `1px solid ${errors.phone ? 'var(--error)' : 'var(--border-strong)'}`, color: 'var(--text-main)' }}
                />
                {fieldError('phone')}
              </div>
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="clean-card" style={{ padding: '24px', borderRadius: 14 }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)' }}>
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
                  aria-invalid={!!errors.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, background: '#ffffff', border: `1px solid ${errors.address ? 'var(--error)' : 'var(--border-strong)'}`, color: 'var(--text-main)' }}
                />
                {fieldError('address')}
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
                    aria-invalid={!!errors.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, background: '#ffffff', border: `1px solid ${errors.city ? 'var(--error)' : 'var(--border-strong)'}`, color: 'var(--text-main)' }}
                  />
                  {fieldError('city')}
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    aria-invalid={!!errors.state}
                    onChange={(e) => updateField('state', e.target.value)}
                    style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, background: '#ffffff', border: `1px solid ${errors.state ? 'var(--error)' : 'var(--border-strong)'}`, color: 'var(--text-main)' }}
                  />
                  {fieldError('state')}
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                    PIN Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    aria-invalid={!!errors.pincode}
                    onChange={(e) => updateField('pincode', e.target.value)}
                    style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 8, background: '#ffffff', border: `1px solid ${errors.pincode ? 'var(--error)' : 'var(--border-strong)'}`, color: 'var(--text-main)' }}
                  />
                  {fieldError('pincode')}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="clean-card" style={{ padding: '24px', borderRadius: 14 }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)' }}>
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
                borderColor: paymentMethod === 'UPI' ? 'var(--primary)' : 'var(--border-subtle)',
                background: paymentMethod === 'UPI' ? 'var(--bg-muted)' : '#ffffff',
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'UPI'}
                  onChange={() => setPaymentMethod('UPI')}
                  style={{ accentColor: 'var(--primary)' }}
                />
                <Smartphone size={20} color="var(--primary)" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>UPI / Instant QR</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Google Pay, PhonePe, Paytm, BHIM</div>
                </div>
              </label>

              {paymentMethod === 'UPI' && (
                <div style={{ padding: '0 10px 10px 38px' }}>
                  <input
                    type="text"
                    required
                    aria-invalid={!!errors.upiId}
                    value={upiId}
                    onChange={(e) => { setUpiId(e.target.value); clearError('upiId'); }}
                    placeholder="example@upi"
                    style={{
                      width: '100%',
                      height: 38,
                      padding: '0 12px',
                      background: '#ffffff',
                      border: `1px solid ${errors.upiId ? 'var(--error)' : 'var(--border-strong)'}`,
                      borderRadius: 8,
                      color: 'var(--text-main)',
                      fontSize: '0.85rem'
                    }}
                  />
                  {fieldError('upiId')}
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
                borderColor: paymentMethod === 'Card' ? 'var(--primary)' : 'var(--border-subtle)',
                background: paymentMethod === 'Card' ? 'var(--bg-muted)' : '#ffffff',
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Card'}
                  onChange={() => setPaymentMethod('Card')}
                  style={{ accentColor: 'var(--primary)' }}
                />
                <CreditCard size={20} color="#7c3aed" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>Credit / Debit Card</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Visa, Mastercard, RuPay</div>
                </div>
              </label>

              {paymentMethod === 'Card' && (
                <div style={{ padding: '0 10px 10px 38px' }}>
                  <input
                    type="text"
                    required
                    aria-invalid={!!errors.cardNumber}
                    value={cardNumber}
                    onChange={(e) => { setCardNumber(e.target.value); clearError('cardNumber'); }}
                    placeholder="Card number (simulated)"
                    style={{
                      width: '100%',
                      height: 38,
                      padding: '0 12px',
                      background: '#ffffff',
                      border: `1px solid ${errors.cardNumber ? 'var(--error)' : 'var(--border-strong)'}`,
                      borderRadius: 8,
                      color: 'var(--text-main)',
                      fontSize: '0.85rem'
                    }}
                  />
                  {fieldError('cardNumber')}
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
                borderColor: paymentMethod === 'COD' ? 'var(--primary)' : 'var(--border-subtle)',
                background: paymentMethod === 'COD' ? 'var(--bg-muted)' : '#ffffff',
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  style={{ accentColor: 'var(--primary)' }}
                />
                <Banknote size={20} color="var(--success)" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>Cash on Delivery</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Pay upon doorstep arrival</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Review */}
        <div>
          <div className="clean-card" style={{ padding: '26px', position: 'sticky', top: 96, borderRadius: 16 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 18, color: 'var(--text-main)' }}>
              Items in Order ({cartItems.length})
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxHeight: 240, overflowY: 'auto', marginBottom: 20 }}>
              {cartItems.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <img src={item.image} alt={item.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Qty: {item.quantity} • {formatINR(item.price)}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                    {formatINR(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--bg-muted)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{formatINR(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Delivery</span>
                <span style={{ color: 'var(--success)', fontWeight: 700 }}>{shippingFee === 0 ? 'FREE' : formatINR(shippingFee)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                  <span>Discount</span>
                  <span>- {formatINR(discount)}</span>
                </div>
              )}
              <div style={{ borderTop: '1px solid var(--bg-muted)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>Total to Pay</span>
                <span style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--text-main)' }}>{formatINR(total)}</span>
              </div>
            </div>

            {orderError && (
              <div role="alert" style={{ color: 'var(--error)', fontSize: '0.82rem', fontWeight: 600, marginBottom: 10 }}>
                {orderError}
              </div>
            )}

            {Object.keys(errors).length > 0 && (
              <div role="alert" style={{ color: 'var(--error)', fontSize: '0.82rem', fontWeight: 600, marginBottom: 10 }}>
                Please fill in: {Object.values(errors).join(', ')}
              </div>
            )}

            <button
              type="submit"
              disabled={isPlacing}
              className="btn-cta"
              style={{
                width: '100%',
                height: 48,
                justifyContent: 'center',
                fontSize: '1rem',
                borderRadius: 10,
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
