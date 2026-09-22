import React, { useState } from 'react';
import { 
  Store, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Upload, 
  Building2, 
  User, 
  MapPin, 
  Globe, 
  CheckCircle2 
} from 'lucide-react';
import { storeService } from '../services/storeService';
import confetti from 'canvas-confetti';

export const StoreRegister = ({ navigate }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdStore, setCreatedStore] = useState(null);

  const [formData, setFormData] = useState({
    name: "Aura Home Living",
    tagline: "Modern handcrafted aesthetic living essentials",
    description: "Designing minimalist stoneware, ambient table lamps, and natural textiles for contemporary spaces.",
    category: "Home",
    logo: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=200&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&auto=format&fit=crop&q=80",
    ownerName: "Rohan Kapoor",
    ownerEmail: "rohan.kapoor@example.com",
    ownerPhone: "+91 98190 44321",
    address: "42, Green Glen Layout, Bellandur",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560103",
    country: "India",
    handle: "aurahome"
  });

  const categories = [
    "Fashion",
    "Electronics",
    "Home",
    "Beauty",
    "Sports",
    "Food",
    "Accessories",
    "Other"
  ];

  const handleCreateStore = async () => {
    setIsSubmitting(true);
    try {
      const newStore = await storeService.createStore(formData);
      setCreatedStore(newStore);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch (e) {}
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: "Store Info" },
    { num: 2, title: "Owner" },
    { num: 3, title: "Location" },
    { num: 4, title: "Handle & URL" },
    { num: 5, title: "Review" }
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: 840, margin: '40px auto 90px', padding: '0 24px' }}>
      {/* If store created successfully */}
      {createdStore ? (
        <div className="clean-card" style={{ padding: '54px 36px', textAlign: 'center', borderRadius: 18 }}>
          <div style={{
            width: 76,
            height: 76,
            borderRadius: '50%',
            background: '#ecfdf5',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            border: '1px solid #a7f3d0'
          }}>
            <CheckCircle2 size={44} />
          </div>

          <span className="badge badge-emerald" style={{ marginBottom: 14 }}>
            Store Registered Successfully
          </span>

          <h1 style={{ fontSize: '2.3rem', fontWeight: 800, color: '#09090b', marginBottom: 10 }}>
            Your store is live!
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: 520, margin: '0 auto 28px' }}>
            <strong>{createdStore.name}</strong> is now listed on ShopAI. You can view your public storefront or manage products and fulfillment from your merchant dashboard.
          </p>

          <div style={{
            background: '#f8fafc',
            border: '1px solid #e5e7eb',
            borderRadius: 14,
            padding: '20px 24px',
            maxWidth: 460,
            margin: '0 auto 32px',
            textAlign: 'left'
          }}>
            <div style={{ fontSize: '0.76rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
              Store Identifier
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#09090b', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
              {createdStore.id}
            </div>

            <div style={{ marginTop: 14, fontSize: '0.76rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
              Live Storefront URL
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#059669', marginTop: 2 }}>
              shopai.com/store/{createdStore.handle}
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
            <button
              onClick={() => navigate(`/store/${createdStore.id}`)}
              className="btn-secondary"
              style={{ padding: '12px 26px', fontSize: '0.95rem', borderRadius: 10 }}
            >
              <Store size={17} />
              <span>Go to Store</span>
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary"
              style={{ padding: '12px 28px', fontSize: '0.95rem', borderRadius: 10 }}
            >
              <span>Open Store Dashboard</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Header */}
          <div style={{ marginBottom: 32, textAlign: 'center' }}>
            <span className="badge badge-neutral" style={{ marginBottom: 10 }}>
              Merchant Onboarding Wizard
            </span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#09090b' }}>
              Create Your Store on ShopAI
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: 4 }}>
              Fill in your brand profile details to get your storefront up and running
            </p>
          </div>

          {/* Stepper Wizard Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 32,
            position: 'relative'
          }}>
            {steps.map((s, idx) => {
              const isPassed = step > s.num;
              const isCurrent = step === s.num;

              return (
                <div key={s.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: isCurrent ? '#09090b' : (isPassed ? '#059669' : '#f4f4f6'),
                    color: isCurrent || isPassed ? '#ffffff' : '#71717a',
                    border: isCurrent || isPassed ? 'none' : '1px solid #d1d5db',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    boxShadow: isCurrent ? '0 2px 8px rgba(0, 0, 0, 0.18)' : 'none',
                    marginBottom: 6,
                    transition: 'all 0.2s ease'
                  }}>
                    {isPassed ? <Check size={16} strokeWidth={3} /> : s.num}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: isCurrent ? 800 : 600,
                    color: isCurrent ? '#09090b' : '#71717a'
                  }}>
                    {s.title}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Step Container Form */}
          <div className="clean-card" style={{ padding: '36px', borderRadius: 16 }}>
            {/* STEP 1: Store Information */}
            {step === 1 && (
              <div className="animate-fade-in">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 6, color: '#09090b' }}>
                  STEP 1 — Store Information
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 24 }}>
                  Establish how your brand will be identified on the marketplace
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                      Store Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData({
                          ...formData,
                          name: val,
                          handle: val.toLowerCase().replace(/[^a-z0-9]/g, '')
                        });
                      }}
                      style={{ width: '100%', height: 44, padding: '0 14px', borderRadius: 8, background: '#ffffff', border: '1px solid #d1d5db', color: '#09090b' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                      Store Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      style={{ width: '100%', height: 44, padding: '0 14px', borderRadius: 8, background: '#ffffff', border: '1px solid #d1d5db', color: '#09090b', outline: 'none' }}
                    >
                      {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      placeholder="e.g. Modern handcrafted aesthetic living essentials"
                      style={{ width: '100%', height: 44, padding: '0 14px', borderRadius: 8, background: '#ffffff', border: '1px solid #d1d5db', color: '#09090b' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                      Store Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 8, background: '#ffffff', border: '1px solid #d1d5db', color: '#09090b', resize: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                        Logo Image URL
                      </label>
                      <input
                        type="text"
                        value={formData.logo}
                        onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                        style={{ width: '100%', height: 44, padding: '0 14px', borderRadius: 8, background: '#ffffff', border: '1px solid #d1d5db', color: '#09090b' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                        Banner Image URL
                      </label>
                      <input
                        type="text"
                        value={formData.banner}
                        onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                        style={{ width: '100%', height: 44, padding: '0 14px', borderRadius: 8, background: '#ffffff', border: '1px solid #d1d5db', color: '#09090b' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Owner Information */}
            {step === 2 && (
              <div className="animate-fade-in">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 6, color: '#09090b' }}>
                  STEP 2 — Owner Information
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 24 }}>
                  Contact coordinates for the business proprietor
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                      Owner Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      style={{ width: '100%', height: 44, padding: '0 14px', borderRadius: 8, background: '#ffffff', border: '1px solid #d1d5db', color: '#09090b' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                      Business Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.ownerEmail}
                      onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                      style={{ width: '100%', height: 44, padding: '0 14px', borderRadius: 8, background: '#ffffff', border: '1px solid #d1d5db', color: '#09090b' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.ownerPhone}
                      onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                      style={{ width: '100%', height: 44, padding: '0 14px', borderRadius: 8, background: '#ffffff', border: '1px solid #d1d5db', color: '#09090b' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Store Location */}
            {step === 3 && (
              <div className="animate-fade-in">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 6, color: '#09090b' }}>
                  STEP 3 — Store Location
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 24 }}>
                  Origin address for dispatch and courier pickups
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                      Warehouse / Workshop Address *
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      style={{ width: '100%', height: 44, padding: '0 14px', borderRadius: 8, background: '#ffffff', border: '1px solid #d1d5db', color: '#09090b' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        style={{ width: '100%', height: 44, padding: '0 14px', borderRadius: 8, background: '#ffffff', border: '1px solid #d1d5db', color: '#09090b' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                        State *
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        style={{ width: '100%', height: 44, padding: '0 14px', borderRadius: 8, background: '#ffffff', border: '1px solid #d1d5db', color: '#09090b' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        style={{ width: '100%', height: 44, padding: '0 14px', borderRadius: 8, background: '#ffffff', border: '1px solid #d1d5db', color: '#09090b' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Store Setup & Handle URL */}
            {step === 4 && (
              <div className="animate-fade-in">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 6, color: '#09090b' }}>
                  STEP 4 — Store Setup & Handle
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 24 }}>
                  Customize your direct store URL on the ShopAI domain
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                      Store Handle Slug *
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{
                        padding: '0 14px',
                        height: 44,
                        display: 'flex',
                        alignItems: 'center',
                        background: '#f4f4f6',
                        border: '1px solid #d1d5db',
                        borderRight: 'none',
                        borderRadius: '8px 0 0 8px',
                        color: '#71717a',
                        fontSize: '0.88rem',
                        fontFamily: 'var(--font-mono)'
                      }}>
                        shopai.com/store/
                      </span>
                      <input
                        type="text"
                        value={formData.handle}
                        onChange={(e) => setFormData({ ...formData, handle: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
                        style={{
                          flex: 1,
                          height: 44,
                          padding: '0 14px',
                          borderRadius: '0 8px 8px 0',
                          background: '#ffffff',
                          border: '1px solid #d1d5db',
                          color: '#09090b',
                          fontFamily: 'var(--font-mono)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Live URL Preview box */}
                  <div style={{
                    marginTop: 10,
                    padding: '16px 20px',
                    borderRadius: 12,
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe'
                  }}>
                    <div style={{ fontSize: '0.76rem', color: '#2563eb', fontWeight: 700, textTransform: 'uppercase' }}>
                      Live Storefront Route
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#09090b', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                      shopai.com/store/{formData.handle || 'yourstore'}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>
                      Shoppers will be able to browse all products from your brand via this direct link.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Review */}
            {step === 5 && (
              <div className="animate-fade-in">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 6, color: '#09090b' }}>
                  STEP 5 — Review & Launch
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 24 }}>
                  Confirm your store configuration before publishing
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 24 }}>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 12, border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 700 }}>Store Information</div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#09090b', marginTop: 4 }}>{formData.name}</div>
                    <div style={{ fontSize: '0.82rem', color: '#2563eb', fontWeight: 600 }}>Category: {formData.category}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>{formData.tagline}</div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 12, border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 700 }}>Owner Details</div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#09090b', marginTop: 4 }}>{formData.ownerName}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{formData.ownerEmail}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{formData.ownerPhone}</div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 12, border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 700 }}>Dispatch Origin</div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#09090b', marginTop: 4 }}>{formData.address}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{formData.city}, {formData.state} - {formData.pincode}</div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 12, border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 700 }}>Storefront Route</div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#059669', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
                      /store/{formData.handle}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 32,
              paddingTop: 24,
              borderTop: '1px solid #f4f4f6'
            }}>
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="btn-secondary"
                  style={{ padding: '10px 20px', borderRadius: 8 }}
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
              ) : <div />}

              {step < 5 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="btn-primary"
                  style={{ padding: '10px 24px', borderRadius: 8 }}
                >
                  <span>Continue</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleCreateStore}
                  className="btn-primary"
                  style={{ padding: '12px 32px', fontSize: '1rem', borderRadius: 8 }}
                >
                  <span>{isSubmitting ? 'Creating Store...' : 'Create Store'}</span>
                  <Sparkles size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
