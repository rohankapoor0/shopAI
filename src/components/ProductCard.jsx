import React, { useState } from 'react';
import { Star, ShoppingCart, Store, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product, navigate }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(product.price);

  const formattedOriginal = product.originalPrice ? new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(product.originalPrice) : null;

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="glass-card"
      style={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        height: '100%',
        position: 'relative'
      }}
    >
      {/* Discount Badge */}
      {product.discount && (
        <span style={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 2,
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#fb7185',
          fontSize: '0.72rem',
          fontWeight: 700,
          padding: '3px 8px',
          borderRadius: 6
        }}>
          {product.discount}
        </span>
      )}

      {/* Stock warning if low */}
      {product.stock <= 5 && product.stock > 0 && (
        <span style={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 2,
          background: 'rgba(245, 158, 11, 0.2)',
          color: '#fbbf24',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          fontSize: '0.7rem',
          fontWeight: 700,
          padding: '3px 8px',
          borderRadius: 6
        }}>
          Only {product.stock} left
        </span>
      )}

      {/* Image container */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '85%',
        backgroundColor: '#1e293b',
        overflow: 'hidden'
      }}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        />
      </div>

      {/* Card Details */}
      <div style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between',
        gap: 12
      }}>
        <div>
          {/* Store Name tag */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/store/${product.storeId}`);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              marginBottom: 6,
              fontWeight: 500
            }}
          >
            <Store size={13} color="#60a5fa" />
            <span style={{ textDecoration: 'underline', textDecorationColor: 'transparent', transition: 'all 0.15s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.textDecorationColor = '#60a5fa'}
                  onMouseLeave={(e) => e.currentTarget.style.textDecorationColor = 'transparent'}>
              {product.storeName}
            </span>
          </div>

          {/* Product Title */}
          <h3 style={{
            fontSize: '0.98rem',
            fontWeight: 600,
            lineHeight: 1.4,
            color: '#f8fafc',
            marginBottom: 8,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {product.name}
          </h3>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#fbbf24',
              padding: '2px 6px',
              borderRadius: 4,
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              <Star size={12} fill="#fbbf24" strokeWidth={0} />
              <span>{product.rating}</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
              ({product.reviewsCount})
            </span>
          </div>
        </div>

        {/* Pricing & Add to Cart button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 8,
          borderTop: '1px solid var(--border-subtle)'
        }}>
          <div>
            <div style={{ fontSize: '1.12rem', fontWeight: 700, color: '#ffffff' }}>
              {formattedPrice}
            </div>
            {formattedOriginal && (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', textDecoration: 'line-through' }}>
                {formattedOriginal}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: added ? '#10b981' : 'rgba(59, 130, 246, 0.15)',
              color: added ? '#ffffff' : '#60a5fa',
              border: added ? '1px solid #10b981' : '1px solid rgba(59, 130, 246, 0.3)',
              transition: 'all 0.2s ease'
            }}
            title="Add to Cart"
          >
            {added ? <Check size={18} /> : <ShoppingCart size={17} />}
          </button>
        </div>
      </div>
    </div>
  );
};
