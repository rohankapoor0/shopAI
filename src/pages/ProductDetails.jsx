import React, { useEffect, useState } from 'react';
import { 
  Star, 
  Store, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  Minus, 
  Plus, 
  ShoppingCart, 
  Zap, 
  Check, 
  Share2, 
  ArrowLeft 
} from 'lucide-react';
import { productService } from '../services/productService';
import { storeService } from '../services/storeService';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';

export const ProductDetails = ({ productId, navigate }) => {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [store, setStore] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      const item = await productService.getProductById(productId);
      if (item) {
        setProduct(item);
        const currentStore = await storeService.getStoreById(item.storeId);
        setStore(currentStore);
        const storeProducts = await productService.getProductsByStore(item.storeId);
        setRelatedProducts(storeProducts.filter(p => p.id !== item.id));
      }
      setLoading(false);
      window.scrollTo(0, 0);
    };
    loadDetails();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center', padding: '0 20px' }}>
        <h2>Product Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: 8, marginBottom: 20 }}>
          The requested product does not exist or has been delisted.
        </p>
        <button onClick={() => navigate('/products')} className="btn-primary">
          Back to Catalog
        </button>
      </div>
    );
  }

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
    <div className="animate-fade-in" style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 20px 80px' }}>
      {/* Back button */}
      <button
        onClick={() => navigate('/products')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          color: 'var(--text-muted)',
          fontSize: '0.88rem',
          marginBottom: 24,
          fontWeight: 500
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to products</span>
      </button>

      {/* Main Showcase Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, marginBottom: 64 }}>
        {/* Left: Product Image */}
        <div>
          <div className="glass-card" style={{
            position: 'relative',
            borderRadius: 20,
            overflow: 'hidden',
            backgroundColor: '#1e293b',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)'
          }}>
            {product.discount && (
              <span style={{
                position: 'absolute',
                top: 18,
                left: 18,
                zIndex: 2,
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fb7185',
                fontSize: '0.82rem',
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: 8
              }}>
                {product.discount}
              </span>
            )}
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: '100%',
                height: 480,
                objectFit: 'cover',
                display: 'block'
              }}
            />
          </div>
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Store reference */}
          <div
            onClick={() => navigate(`/store/${product.storeId}`)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              padding: '6px 14px',
              borderRadius: 8,
              background: 'rgba(59, 130, 246, 0.12)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              alignSelf: 'flex-start'
            }}
          >
            <Store size={15} color="#60a5fa" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#60a5fa' }}>
              Sold by {product.storeName}
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.3rem)', fontWeight: 800, lineHeight: 1.25, color: '#ffffff' }}>
            {product.name}
          </h1>

          {/* Ratings & Stock */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#fbbf24',
              padding: '4px 10px',
              borderRadius: 6,
              fontSize: '0.82rem',
              fontWeight: 700
            }}>
              <Star size={14} fill="#fbbf24" strokeWidth={0} />
              <span>{product.rating}</span>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
              ({product.reviewsCount} customer reviews)
            </span>
            <span>•</span>
            <span className={product.stock > 5 ? 'badge badge-emerald' : 'badge badge-amber'}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
            </span>
          </div>

          {/* Pricing */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 4 }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff' }}>
              {formattedPrice}
            </span>
            {formattedOriginal && (
              <span style={{ fontSize: '1.1rem', color: 'var(--text-subtle)', textDecoration: 'line-through' }}>
                {formattedOriginal}
              </span>
            )}
            <span style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 600 }}>
              Inclusive of all taxes
            </span>
          </div>

          {/* Description */}
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.65, fontSize: '0.96rem' }}>
            {product.description}
          </p>

          {/* Key Features bullet list */}
          {product.features && (
            <div style={{
              padding: '16px 20px',
              borderRadius: 12,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: 8 }}>
                Product Highlights
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.88rem', color: '#e2e8f0' }}>
                {product.features.map((feat, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Check size={14} color="#10b981" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity and Actions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', marginTop: 10 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid var(--border-subtle)',
              borderRadius: 10,
              background: 'var(--bg-surface-elevated)',
              overflow: 'hidden'
            }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ width: 40, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}
              >
                <Minus size={15} />
              </button>
              <span style={{ width: 44, textAlign: 'center', fontWeight: 700, fontSize: '0.95rem' }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                style={{ width: 40, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}
              >
                <Plus size={15} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="btn-primary"
              style={{
                flex: '1 1 180px',
                height: 46,
                justifyContent: 'center',
                fontSize: '0.95rem',
                borderRadius: 12
              }}
            >
              <ShoppingCart size={18} />
              <span>{addedMessage ? 'Added to Cart ✓' : 'Add to Cart'}</span>
            </button>

            <button
              onClick={handleBuyNow}
              style={{
                flex: '1 1 180px',
                height: 46,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: '0.95rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
              }}
            >
              <Zap size={18} />
              <span>Buy Now</span>
            </button>
          </div>

          {/* Delivery & Assurance trust perks */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
            marginTop: 16,
            paddingTop: 20,
            borderTop: '1px solid var(--border-subtle)',
            textAlign: 'center'
          }}>
            <div>
              <Truck size={20} color="#60a5fa" style={{ margin: '0 auto 6px' }} />
              <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>Fast Shipping</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Dispatches in 24h</div>
            </div>
            <div>
              <ShieldCheck size={20} color="#34d399" style={{ margin: '0 auto 6px' }} />
              <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>Authentic Item</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Direct from store</div>
            </div>
            <div>
              <RefreshCw size={20} color="#a78bfa" style={{ margin: '0 auto 6px' }} />
              <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>7-Day Returns</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Doorstep pickup</div>
            </div>
          </div>
        </div>
      </div>

      {/* More from this Store */}
      {relatedProducts.length > 0 && (
        <div style={{ marginTop: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                More from {product.storeName}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Discover related products created by this artisan
              </p>
            </div>
            <button
              onClick={() => navigate(`/store/${product.storeId}`)}
              style={{ fontSize: '0.88rem', fontWeight: 600, color: '#60a5fa' }}
            >
              View Storefront →
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 20
          }}>
            {relatedProducts.slice(0, 4).map(p => (
              <ProductCard key={p.id} product={p} navigate={navigate} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
