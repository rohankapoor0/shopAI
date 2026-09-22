import React, { useState } from 'react';
import { X, RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { returnService } from '../services/returnService';

export const ReturnModal = ({ order, isOpen, onClose, onSuccess }) => {
  if (!isOpen || !order) return null;

  const [selectedProduct, setSelectedProduct] = useState(order.items[0]);
  const [reason, setReason] = useState('Size issue');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reasons = [
    "Damaged product",
    "Wrong product",
    "Product not as described",
    "Size issue",
    "Changed my mind",
    "Other"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await returnService.createReturn({
        orderId: order.id,
        storeId: order.storeId,
        storeName: order.storeName,
        customerId: order.customerId || "CUST-1",
        customerName: order.customerName || "Rohan Kapoor",
        customerEmail: order.customerEmail || "rohan.kapoor@example.com",
        productId: selectedProduct.productId,
        productName: selectedProduct.name,
        productImage: selectedProduct.image,
        amount: selectedProduct.price * selectedProduct.quantity,
        reason: reason,
        notes: notes
      });

      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div className="glass-card animate-fade-in" style={{
        maxWidth: 520,
        width: '100%',
        backgroundColor: '#0f172a',
        border: '1px solid var(--border-strong)',
        borderRadius: 20,
        padding: '28px',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            color: 'var(--text-subtle)',
            padding: 4
          }}
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px 10px' }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <CheckCircle2 size={32} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: 8 }}>
              Return Request Submitted!
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: 24 }}>
              Your return request has been submitted to <strong>{order.storeName}</strong>. The merchant will review and schedule a pickup.
            </p>
            <button
              onClick={onClose}
              className="btn-primary"
              style={{ padding: '10px 24px', width: '100%', justifyContent: 'center' }}
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <RotateCcw size={20} color="#fb7185" />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>
                Request Return / Refund
              </h2>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>
              Order: <strong>{order.id}</strong> • Fulfilled by {order.storeName}
            </p>

            {/* Select Product if multiple */}
            {order.items.length > 1 && (
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>
                  Select Item to Return
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {order.items.map((item, idx) => (
                    <label key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px',
                      borderRadius: 8,
                      border: '1px solid',
                      borderColor: selectedProduct.productId === item.productId ? '#3b82f6' : 'var(--border-subtle)',
                      background: selectedProduct.productId === item.productId ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="radio"
                        name="returnItem"
                        checked={selectedProduct.productId === item.productId}
                        onChange={() => setSelectedProduct(item)}
                        style={{ accentColor: '#3b82f6' }}
                      />
                      <img src={item.image} alt={item.name} style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} />
                      <div style={{ fontSize: '0.85rem', fontWeight: 500, flex: 1 }}>{item.name}</div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Reason Selector */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>
                Reason for Return
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{
                  width: '100%',
                  height: 42,
                  padding: '0 12px',
                  borderRadius: 8,
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              >
                {reasons.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Additional Notes */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>
                Additional Details (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Explain the issue with sizing, defects, etc..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  outline: 'none',
                  resize: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center', background: '#e11d48' }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Return Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
