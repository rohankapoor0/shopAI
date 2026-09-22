import React from 'react';
import { 
  Store, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Globe, 
  BarChart3, 
  Layers, 
  Users 
} from 'lucide-react';
import { storeService } from '../services/storeService';

export const SellLanding = ({ navigate }) => {
  const activeStoreId = storeService.getActiveStoreId();

  const benefits = [
    {
      icon: Globe,
      title: "Reach More Customers",
      desc: "Instant exposure to shoppers looking for verified independent labels and artisanal creators.",
      color: "#09090b"
    },
    {
      icon: Layers,
      title: "Manage Your Products",
      desc: "Easily publish items, set discounted INR pricing, upload high-res imagery and manage catalogs.",
      color: "#2563eb"
    },
    {
      icon: BarChart3,
      title: "Track Orders & Velocity",
      desc: "Real-time updates across fulfillment stages: Confirmed, Packed, Shipped, to Delivery.",
      color: "#059669"
    },
    {
      icon: Users,
      title: "Manage Inventory & Stock",
      desc: "Never oversell. Automated low-stock thresholds and one-click restock controls.",
      color: "#d97706"
    },
    {
      icon: TrendingUp,
      title: "Grow Your Business",
      desc: "Comprehensive customer analytics, average order values, and repeat buyer metrics.",
      color: "#7c3aed"
    },
    {
      icon: ShieldCheck,
      title: "Automated Return Handling",
      desc: "Streamlined inspection workflow to approve, reject, or schedule pickups for customer returns.",
      color: "#e11d48"
    }
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 90 }}>
      {/* Hero Section */}
      <section style={{
        padding: '76px 24px 84px',
        textAlign: 'center',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '5px 15px',
            background: '#f4f4f5',
            border: '1px solid #e4e4e7',
            borderRadius: 'var(--radius-full)',
            marginBottom: 24
          }}>
            <Sparkles size={14} color="#2563eb" />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#09090b' }}>
              ShopAI Merchant Platform
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: '-0.03em',
            marginBottom: 20,
            color: '#09090b',
            fontFamily: 'var(--font-display)'
          }}>
            Start selling on ShopAI.
          </h1>

          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            color: 'var(--text-muted)',
            maxWidth: 620,
            margin: '0 auto 36px',
            lineHeight: 1.6
          }}>
            Create your store and reach customers everywhere. A Shopify-grade merchant dashboard engineered to scale your independent brand.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
            {activeStoreId ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary"
                style={{ padding: '14px 32px', fontSize: '1rem', borderRadius: 10 }}
              >
                <span>Go to Store Dashboard</span>
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                onClick={() => navigate('/sell/create')}
                className="btn-primary"
                style={{
                  padding: '14px 34px',
                  fontSize: '1.02rem',
                  borderRadius: 10
                }}
              >
                <span>Create Your Store</span>
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px 70px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#09090b' }}>
            Everything You Need to Power Your Online Business
          </h2>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginTop: 6 }}>
            Zero coding required. Complete multi-vendor independence with instant storefront setup.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24
        }}>
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="clean-card"
                style={{ padding: '28px', display: 'flex', gap: 18, alignItems: 'flex-start', borderRadius: 14 }}
              >
                <div style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  backgroundColor: '#f4f4f6',
                  color: b.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#09090b', marginBottom: 6 }}>
                    {b.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                    {b.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Onboarding Flow Preview */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        <div className="clean-card" style={{ padding: '36px', textAlign: 'center', borderRadius: 16 }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#09090b', marginBottom: 10 }}>
            How It Works in 5 Easy Steps
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 28 }}>
            No paperwork or wait times. Your store goes live right here in this prototype.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14 }}>
            {[
              { num: "01", label: "Store Info" },
              { num: "02", label: "Owner Details" },
              { num: "03", label: "Workshop Location" },
              { num: "04", label: "Handle & URL" },
              { num: "05", label: "Instant Launch" }
            ].map(step => (
              <div key={step.num} style={{ background: '#f8fafc', padding: '16px 12px', borderRadius: 12, border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#09090b', fontFamily: 'var(--font-mono)' }}>
                  {step.num}
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#52525b', marginTop: 4 }}>
                  {step.label}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/sell/create')}
            className="btn-primary"
            style={{ marginTop: 32, padding: '12px 30px', fontSize: '0.95rem', borderRadius: 10 }}
          >
            <span>Start Store Registration</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
};
