import React, { useState } from 'react';
import { Star, ShoppingCart, Store, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getRatingColors } from '../utils/rating';

const inr = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

const cornerTag = {
  position: 'absolute',
  top: 10,
  zIndex: 2,
  fontSize: '0.7rem',
  fontWeight: 700,
  padding: '3px 8px',
  borderRadius: 6
};

export const ProductCard = ({ product, navigate }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="clean-card lift"
      style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer', height: '100%', position: 'relative' }}
    >
      {product.discount && (
        <span style={{ ...cornerTag, left: 10, background: 'var(--sale)', color: '#ffffff', boxShadow: '0 2px 6px rgba(225, 29, 72, 0.3)' }}>
          {product.discount}
        </span>
      )}

      {isLowStock && (
        <span style={{ ...cornerTag, right: 10, background: 'var(--warning-tint)', color: 'var(--warning-text)', border: '1px solid var(--warning-border)' }}>
          Only {product.stock} left
        </span>
      )}
      {isOutOfStock && (
        <span style={{ ...cornerTag, right: 10, background: 'var(--error-tint)', color: 'var(--error)', border: '1px solid var(--error-tint)' }}>
          Out of stock
        </span>
      )}

      <div style={{ position: 'relative', width: '100%', paddingTop: '82%', backgroundColor: 'var(--bg-muted)', overflow: 'hidden' }}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="zoom-img"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: isOutOfStock ? 0.6 : 1 }}
        />
      </div>

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between', gap: 12 }}>
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/store/${product.storeId}`);
            }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', color: 'var(--primary)', marginBottom: 6, fontWeight: 600, padding: 0 }}
          >
            <Store size={13} />
            <span>{product.storeName}</span>
          </button>

          <h3 style={{
            fontSize: '0.96rem',
            fontWeight: 700,
            lineHeight: 1.4,
            color: 'var(--text-main)',
            marginBottom: 8,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {product.name}
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, ...getRatingColors(product.rating), padding: '1px 6px', borderRadius: 4, fontSize: '0.74rem', fontWeight: 700 }}>
              <Star size={11} fill="currentColor" strokeWidth={0} />
              <span>{product.rating}</span>
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>({product.reviewsCount})</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--bg-muted)' }}>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>{inr(product.price)}</div>
            {product.originalPrice && (
              <div style={{ fontSize: '0.76rem', color: 'var(--text-subtle)', textDecoration: 'line-through' }}>{inr(product.originalPrice)}</div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={added ? 'pop' : 'btn-cta'}
            style={{
              width: 38,
              height: 38,
              padding: 0,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ...(added && { background: 'var(--success)', color: '#ffffff' })
            }}
            title={isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            aria-label={isOutOfStock ? 'Out of Stock' : `Add ${product.name} to cart`}
          >
            {added ? <Check size={17} /> : <ShoppingCart size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};
