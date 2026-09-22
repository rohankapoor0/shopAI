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
      backgroundColor: 'rgba(9, 9, 11, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div className="animate-fade-in" style={{
        maxWidth: 520,
        width: '100%',
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 18,
        padding: '28px',
        position: 'relative',
        boxShadow: 'var(--shadow-modal)'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            color: '#71717a',
            padding: 4,
            borderRadius: 6
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#09090b'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#71717a'}
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '16px 8px' }}>
            <div style={{
              width: 58,
              height: 58,
              borderRadius: '50%',
              background: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              border: '1px solid #a7f3d0'
            }}>
              <CheckCircle2 size={32} />
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#09090b', marginBottom: 8 }}>
              Return Request Submitted
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: 24 }}>
              Your request has been routed to <strong>{order.storeName}</strong>. The store will review and trigger a doorstep pickup schedule.
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
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#fff1f2',
                color: '#e11d48',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #fecdd3'
              }}>
                <RotateCcw size={18} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#09090b' }}>
                  Request Return / Refund
                </h2>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Order: <strong>{order.id}</strong> • Fulfilled by {order.storeName}
                </div>
              </div>
            </div>

            {/* Select Product if multiple */}
            {order.items.length > 1 && (
              <div style={{ marginTop: 18, marginBottom: 16 }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>
                  Select Item to Return
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {order.items.map((item, idx) => (
                    <label key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 12px',
                      borderRadius: 10,
                      border: '1px solid',
                      borderColor: selectedProduct.productId === item.productId ? '#09090b' : '#e5e7eb',
                      background: selectedProduct.productId === item.productId ? '#f4f4f6' : '#ffffff',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="radio"
                        name="returnItem"
                        checked={selectedProduct.productId === item.productId}
                        onChange={() => setSelectedProduct(item)}
                        style={{ accentColor: '#09090b' }}
                      />
                      <img src={item.image} alt={item.name} style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} />
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#09090b', flex: 1 }}>{item.name}</div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Reason Selector */}
            <div style={{ marginTop: 18, marginBottom: 16 }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                Reason for Return
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{
                  width: '100%',
                  height: 40,
                  padding: '0 12px',
                  borderRadius: 8,
                  background: '#ffffff',
                  border: '1px solid #d1d5db',
                  color: '#09090b',
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
            <div style={{ marginBottom: 22 }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
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
                  background: '#ffffff',
                  border: '1px solid #d1d5db',
                  color: '#09090b',
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
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
