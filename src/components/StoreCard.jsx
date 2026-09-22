import React from 'react';
import { Star, Package, MapPin, ArrowUpRight } from 'lucide-react';

export const StoreCard = ({ store, navigate }) => {
  return (
    <div
      onClick={() => navigate(`/store/${store.id}`)}
      className="glass-card"
      style={{
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative'
      }}
    >
      {/* Mini Banner Header */}
      <div style={{
        height: 100,
        position: 'relative',
        backgroundColor: '#1e293b',
        overflow: 'hidden'
      }}>
        <img
          src={store.banner}
          alt={store.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.75)'
          }}
        />
        <span style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#ffffff',
          fontSize: '0.72rem',
          fontWeight: 600,
          padding: '3px 8px',
          borderRadius: 20
        }}>
          {store.category}
        </span>
      </div>

      {/* Profile & Info */}
      <div style={{
        padding: '0 16px 16px',
        marginTop: -26,
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between'
      }}>
        <div>
          {/* Logo */}
          <div style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            overflow: 'hidden',
            border: '3px solid var(--bg-surface)',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.4)',
            marginBottom: 10,
            backgroundColor: '#0f172a'
          }}>
            <img
              src={store.logo}
              alt={store.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
              {store.name}
            </h3>
            <ArrowUpRight size={18} color="var(--text-subtle)" />
          </div>

          <p style={{
            fontSize: '0.82rem',
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
            <MapPin size={13} />
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
          borderTop: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Star size={13} fill="#fbbf24" strokeWidth={0} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fbbf24' }}>
              {store.rating}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
              ({store.reviewsCount})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Package size={14} />
            <span>{store.productsCount} products</span>
          </div>
        </div>
      </div>
    </div>
  );
};
