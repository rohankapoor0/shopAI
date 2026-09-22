import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  ShoppingCart, 
  Package, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles, 
  Clock,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { storeService } from '../../services/storeService';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import { customerService } from '../../services/customerService';
import { StatusBadge } from '../../components/StatusBadge';

export const Overview = ({ navigate }) => {
  const [store, setStore] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOverview = async () => {
      const activeId = storeService.getActiveStoreId();
      const current = await storeService.getStoreById(activeId);
      setStore(current);
      if (current) {
        const storeOrders = await orderService.getStoreOrders(current.id);
        setOrders(storeOrders);
        const storeProducts = await productService.getProductsByStore(current.id);
        setProducts(storeProducts);
        const storeCusts = await customerService.getStoreCustomers(current.id);
        setCustomers(storeCusts);
      }
      setLoading(false);
    };
    loadOverview();
  }, []);

  const formatINR = (val) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val || 0);

  if (loading || !store) return <div>Loading dashboard...</div>;

  const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, store.metrics?.totalSales || 0);
  const totalOrdersCount = orders.length > 0 ? orders.length : (store.metrics?.totalOrders || 0);

  // Synthetic Sales Chart Bar Data (Last 7 Days)
  const chartData = [
    { day: "Mon", sales: 18400, height: 45 },
    { day: "Tue", sales: 24900, height: 62 },
    { day: "Wed", sales: 32100, height: 78 },
    { day: "Thu", sales: 28400, height: 68 },
    { day: "Fri", sales: 41200, height: 95 },
    { day: "Sat", sales: 36800, height: 86 },
    { day: "Sun", sales: 29500, height: 72 }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Top Welcome */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Store Overview
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 2 }}>
            Here is what's happening with <strong style={{ color: '#ffffff' }}>{store.name}</strong> today.
          </p>
        </div>

        <button
          onClick={() => navigate('/dashboard/products')}
          className="btn-primary"
          style={{ padding: '9px 18px', fontSize: '0.85rem' }}
        >
          <Package size={15} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 18
      }}>
        {/* Total Sales */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Revenue</span>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(59, 130, 246, 0.12)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff' }}>
            {formatINR(totalSales)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: '0.78rem', color: '#34d399' }}>
            <ArrowUpRight size={14} />
            <span>+14.8% from last week</span>
          </div>
        </div>

        {/* Orders */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Orders</span>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(16, 185, 129, 0.12)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingCart size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff' }}>
            {totalOrdersCount}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: '0.78rem', color: '#34d399' }}>
            <ArrowUpRight size={14} />
            <span>+8 new this week</span>
          </div>
        </div>

        {/* Active Products */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Products</span>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(139, 92, 246, 0.12)', color: '#a78bfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff' }}>
            {products.length}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
            <span>Across {store.category} catalog</span>
          </div>
        </div>

        {/* Customers */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Customers</span>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff' }}>
            {customers.length > 0 ? customers.length : 84}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: '0.78rem', color: '#34d399' }}>
            <ArrowUpRight size={14} />
            <span>92% positive rating</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* Sales Over Time Chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>Sales Over Time</h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Daily revenue volume this week</div>
            </div>
            <span className="badge badge-blue">7 Days</span>
          </div>

          {/* Synthetic SVG/CSS Bar Graph */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 160, paddingTop: 20, gap: 10 }}>
            {chartData.map((d, idx) => (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div
                  style={{
                    width: '100%',
                    maxWidth: 36,
                    height: `${d.height}%`,
                    background: 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)',
                    borderRadius: '6px 6px 0 0',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  title={`₹${d.sales.toLocaleString('en-IN')}`}
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: 8 }}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders Over Time Chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>Fulfillment Efficiency</h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Order lifecycle completion rate</div>
            </div>
            <span className="badge badge-emerald">98.4% On-time</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 6 }}>
                <span style={{ color: 'var(--text-muted)' }}>Orders Delivered</span>
                <span style={{ fontWeight: 700, color: '#ffffff' }}>78%</span>
              </div>
              <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '78%', height: '100%', background: '#10b981' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 6 }}>
                <span style={{ color: 'var(--text-muted)' }}>In-Transit / Out for Delivery</span>
                <span style={{ fontWeight: 700, color: '#ffffff' }}>18%</span>
              </div>
              <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '18%', height: '100%', background: '#3b82f6' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 6 }}>
                <span style={{ color: 'var(--text-muted)' }}>Returns & Exchanges</span>
                <span style={{ fontWeight: 700, color: '#ffffff' }}>4%</span>
              </div>
              <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '4%', height: '100%', background: '#fb7185' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
            Recent Store Orders
          </h3>
          <button
            onClick={() => navigate('/dashboard/orders')}
            style={{ fontSize: '0.82rem', color: '#60a5fa', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <span>Manage all</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No customer orders placed for this store yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-subtle)', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px' }}>Order ID</th>
                  <th style={{ padding: '10px 12px' }}>Customer</th>
                  <th style={{ padding: '10px 12px' }}>Date</th>
                  <th style={{ padding: '10px 12px' }}>Amount</th>
                  <th style={{ padding: '10px 12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px', fontWeight: 700, color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>{o.id}</td>
                    <td style={{ padding: '12px', color: '#ffffff' }}>{o.customerName}</td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{o.date}</td>
                    <td style={{ padding: '12px', fontWeight: 600 }}>{formatINR(o.totalAmount)}</td>
                    <td style={{ padding: '12px' }}>
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
