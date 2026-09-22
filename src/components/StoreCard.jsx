import React from 'react';
import { Star, Package, MapPin, ArrowUpRight } from 'lucide-react';

export const StoreCard = ({ store, navigate }) => {
  return (
    <div
      onClick={() => navigate(`/store/${store.id}`)}
      className="clean-card"
      style={{
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
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
      {/* Mini Banner Header */}
      <div style={{
        height: 104,
        position: 'relative',
        backgroundColor: '#f1f5f9',
        overflow: 'hidden'
      }}>
        <img
          src={store.banner}
          alt={store.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)'
        }} />
        <span style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          color: '#09090b',
          fontSize: '0.72rem',
          fontWeight: 700,
          padding: '2px 9px',
          borderRadius: 20,
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
        }}>
          {store.category}
        </span>
      </div>

      {/* Profile & Info */}
      <div style={{
        padding: '0 16px 16px',
        marginTop: -24,
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 2
      }}>
        <div>
          {/* Logo */}
          <div style={{
            width: 50,
            height: 50,
            borderRadius: 12,
            overflow: 'hidden',
            border: '3px solid #ffffff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
            marginBottom: 10,
            backgroundColor: '#ffffff'
          }}>
            <img
              src={store.logo}
              alt={store.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#09090b' }}>
              {store.name}
            </h3>
            <ArrowUpRight size={17} color="#9ca3af" />
          </div>

          <p style={{
            fontSize: '0.83rem',
            color: 'var(--text-muted)',
            marginTop: 4,
            lineHeight: 1.45,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {store.tagline || store.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8, fontSize: '0.78rem', color: '#71717a' }}>
            <MapPin size={13} color="#9ca3af" />
            <span>{store.location.city}, {store.location.state}</span>
          </div>
        </div>

        {/* Footer Metrics */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 12,
          marginTop: 14,
          borderTop: '1px solid #f4f4f6'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Star size={13} fill="#b45309" color="#b45309" strokeWidth={0} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#09090b' }}>
              {store.rating}
            </span>
            <span style={{ fontSize: '0.74rem', color: '#71717a' }}>
              ({store.reviewsCount})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: '#52525b', fontWeight: 500 }}>
            <Package size={13} color="#9ca3af" />
            <span>{store.productsCount} products</span>
          </div>
        </div>
      </div>
    </div>
  );
};
