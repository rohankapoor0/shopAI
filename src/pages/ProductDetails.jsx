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
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Product Not Found</h2>
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
    <div className="animate-fade-in" style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 80px' }}>
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
          fontWeight: 600
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#09090b'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <ArrowLeft size={16} />
        <span>Back to products</span>
      </button>

      {/* Main Showcase Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 48, marginBottom: 64 }}>
        {/* Left: Product Image */}
        <div>
          <div className="clean-card" style={{
            position: 'relative',
            borderRadius: 18,
            overflow: 'hidden',
            backgroundColor: '#f8fafc',
            border: '1px solid #e5e7eb',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {product.discount && (
              <span style={{
                position: 'absolute',
                top: 16,
                left: 16,
                zIndex: 2,
                background: '#09090b',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: 6
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
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              alignSelf: 'flex-start'
            }}
          >
            <Store size={14} color="#2563eb" />
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#2563eb' }}>
              Sold by {product.storeName}
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.3rem)', fontWeight: 800, lineHeight: 1.2, color: '#09090b' }}>
            {product.name}
          </h1>

          {/* Ratings & Stock */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: '#fffbeb',
              color: '#b45309',
              border: '1px solid #fef3c7',
              padding: '3px 8px',
              borderRadius: 6,
              fontSize: '0.82rem',
              fontWeight: 700
            }}>
              <Star size={13} fill="#b45309" strokeWidth={0} />
              <span>{product.rating}</span>
            </div>
            <span style={{ fontSize: '0.85rem', color: '#71717a' }}>
              ({product.reviewsCount} reviews)
            </span>
            <span>•</span>
            <span className={product.stock > 5 ? 'badge badge-emerald' : 'badge badge-amber'}>
              {product.stock > 0 ? `${product.stock} units available` : 'Out of Stock'}
            </span>
          </div>

          {/* Pricing */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 4 }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#09090b' }}>
              {formattedPrice}
            </span>
            {formattedOriginal && (
              <span style={{ fontSize: '1.1rem', color: '#a1a1aa', textDecoration: 'line-through' }}>
                {formattedOriginal}
              </span>
            )}
            <span style={{ fontSize: '0.84rem', color: '#059669', fontWeight: 600 }}>
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
              background: '#f8fafc',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#9ca3af', marginBottom: 8, letterSpacing: '0.04em' }}>
                Product Highlights
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.88rem', color: '#09090b' }}>
                {product.features.map((feat, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Check size={14} color="#059669" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity and Actions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', marginTop: 8 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #d1d5db',
              borderRadius: 10,
              background: '#ffffff',
              overflow: 'hidden'
            }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ width: 40, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#09090b' }}
              >
                <Minus size={15} />
              </button>
              <span style={{ width: 44, textAlign: 'center', fontWeight: 700, fontSize: '0.95rem', color: '#09090b' }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                style={{ width: 40, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#09090b' }}
              >
                <Plus size={15} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="btn-secondary"
              style={{
                flex: '1 1 170px',
                height: 46,
                justifyContent: 'center',
                fontSize: '0.95rem',
                borderRadius: 10
              }}
            >
              <ShoppingCart size={17} />
              <span>{addedMessage ? 'Added to Cart ✓' : 'Add to Cart'}</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="btn-primary"
              style={{
                flex: '1 1 170px',
                height: 46,
                borderRadius: 10,
                fontWeight: 700,
                fontSize: '0.95rem',
                justifyContent: 'center'
              }}
            >
              <Zap size={17} />
              <span>Buy Now</span>
            </button>
          </div>

          {/* Delivery & Assurance trust perks */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
            marginTop: 12,
            paddingTop: 18,
            borderTop: '1px solid #f4f4f6',
            textAlign: 'center'
          }}>
            <div>
              <Truck size={18} color="#2563eb" style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#09090b' }}>Fast Dispatch</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Within 24h</div>
            </div>
            <div>
              <ShieldCheck size={18} color="#059669" style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#09090b' }}>Verified Maker</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Direct provenance</div>
            </div>
            <div>
              <RefreshCw size={18} color="#7c3aed" style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#09090b' }}>7-Day Returns</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Doorstep pickup</div>
            </div>
          </div>
        </div>
      </div>

      {/* More from this Store */}
      {relatedProducts.length > 0 && (
        <div style={{ marginTop: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#09090b' }}>
                More from {product.storeName}
              </h2>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                Discover related handcrafted products from this creator
              </p>
            </div>
            <button
              onClick={() => navigate(`/store/${product.storeId}`)}
              style={{ fontSize: '0.88rem', fontWeight: 700, color: '#09090b' }}
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
