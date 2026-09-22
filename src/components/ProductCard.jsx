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
      className="clean-card"
      style={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        height: '100%',
        position: 'relative',
        borderRadius: 14,
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 8px 20px -4px rgba(0,0,0,0.08)';
        e.currentTarget.style.borderColor = '#cbd5e1';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
        e.currentTarget.style.borderColor = '#e5e7eb';
      }}
    >
      {/* Discount Badge */}
      {product.discount && (
        <span style={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 2,
          background: '#09090b',
          color: '#ffffff',
          fontSize: '0.7rem',
          fontWeight: 700,
          padding: '2px 8px',
          borderRadius: 6,
          boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
        }}>
          {product.discount}
        </span>
      )}

      {/* Stock warning if low */}
      {product.stock <= 5 && product.stock > 0 && (
        <span style={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 2,
          background: '#fffbeb',
          color: '#b45309',
          border: '1px solid #fde68a',
          fontSize: '0.68rem',
          fontWeight: 700,
          padding: '2px 7px',
          borderRadius: 6
        }}>
          Only {product.stock} left
        </span>
      )}

      {/* Image container */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '82%',
        backgroundColor: '#f4f4f6',
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
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.04)'; }}
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
              gap: 5,
              fontSize: '0.78rem',
              color: '#52525b',
              marginBottom: 6,
              fontWeight: 500
            }}
          >
            <Store size={13} color="#2563eb" />
            <span 
              style={{ textDecoration: 'underline', textDecorationColor: 'transparent', transition: 'all 0.15s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.textDecorationColor = '#2563eb'}
              onMouseLeave={(e) => e.currentTarget.style.textDecorationColor = 'transparent'}
            >
              {product.storeName}
            </span>
          </div>

          {/* Product Title */}
          <h3 style={{
            fontSize: '0.96rem',
            fontWeight: 700,
            lineHeight: 1.4,
            color: '#09090b',
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
              background: '#fffbeb',
              color: '#b45309',
              border: '1px solid #fef3c7',
              padding: '1px 6px',
              borderRadius: 4,
              fontSize: '0.74rem',
              fontWeight: 700
            }}>
              <Star size={11} fill="#b45309" strokeWidth={0} />
              <span>{product.rating}</span>
            </div>
            <span style={{ fontSize: '0.74rem', color: '#71717a' }}>
              ({product.reviewsCount})
            </span>
          </div>
        </div>

        {/* Pricing & Add to Cart button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 10,
          borderTop: '1px solid #f4f4f6'
        }}>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#09090b' }}>
              {formattedPrice}
            </div>
            {formattedOriginal && (
              <div style={{ fontSize: '0.76rem', color: '#a1a1aa', textDecoration: 'line-through' }}>
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
              background: added ? '#059669' : '#09090b',
              color: '#ffffff',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (!added) e.currentTarget.style.background = '#27272a';
            }}
            onMouseLeave={(e) => {
              if (!added) e.currentTarget.style.background = '#09090b';
            }}
            title="Add to Cart"
          >
            {added ? <Check size={17} /> : <ShoppingCart size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};
