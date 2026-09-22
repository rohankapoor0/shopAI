import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  ShoppingCart, 
  Package, 
  Users, 
  ArrowUpRight, 
  Sparkles, 
  Clock,
  CheckCircle2,
  ChevronRight,
  Plus
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

  if (loading || !store) return <div style={{ padding: 40, color: '#64748b' }}>Loading dashboard...</div>;

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
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Welcome */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#09090b', letterSpacing: '-0.02em' }}>
            Store Overview
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: 2 }}>
            Here is what is happening with <strong style={{ color: '#09090b' }}>{store.name}</strong> today.
          </p>
        </div>

        <button
          onClick={() => navigate('/dashboard/products')}
          className="btn-primary"
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <Plus size={15} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: 16
      }}>
        {/* Total Sales */}
        <div className="clean-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Total Revenue</span>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#09090b', letterSpacing: '-0.02em' }}>
            {formatINR(totalSales)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>
            <ArrowUpRight size={14} />
            <span>+14.8% from last week</span>
          </div>
        </div>

        {/* Orders */}
        <div className="clean-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Total Orders</span>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingCart size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#09090b', letterSpacing: '-0.02em' }}>
            {totalOrdersCount}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>
            <ArrowUpRight size={14} />
            <span>+8 new this week</span>
          </div>
        </div>

        {/* Active Products */}
        <div className="clean-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Active Products</span>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#09090b', letterSpacing: '-0.02em' }}>
            {products.length}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, fontSize: '0.78rem', color: '#64748b' }}>
            <span>Across {store.category} catalog</span>
          </div>
        </div>

        {/* Customers */}
        <div className="clean-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Total Customers</span>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#09090b', letterSpacing: '-0.02em' }}>
            {customers.length > 0 ? customers.length : 84}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>
            <ArrowUpRight size={14} />
            <span>92% positive reviews</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* Sales Over Time Chart */}
        <div className="clean-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#09090b' }}>Sales Over Time</h3>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Daily revenue volume this week</div>
            </div>
            <span className="badge badge-blue">7 Days</span>
          </div>

          {/* Bar Graph */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 160, paddingTop: 20, gap: 10 }}>
            {chartData.map((d, idx) => (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div
                  style={{
                    width: '100%',
                    maxWidth: 36,
                    height: `${d.height}%`,
                    background: '#18181b',
                    borderRadius: '4px 4px 0 0',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  title={`₹${d.sales.toLocaleString('en-IN')}`}
                />
                <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 8, fontWeight: 500 }}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fulfillment Efficiency */}
        <div className="clean-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#09090b' }}>Fulfillment Efficiency</h3>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Order lifecycle completion rate</div>
            </div>
            <span className="badge badge-emerald">98.4% On-time</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 6 }}>
                <span style={{ color: '#475569', fontWeight: 500 }}>Orders Delivered</span>
                <span style={{ fontWeight: 700, color: '#09090b' }}>78%</span>
              </div>
              <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '78%', height: '100%', background: '#10b981' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 6 }}>
                <span style={{ color: '#475569', fontWeight: 500 }}>In-Transit / Out for Delivery</span>
                <span style={{ fontWeight: 700, color: '#09090b' }}>18%</span>
              </div>
              <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '18%', height: '100%', background: '#2563eb' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 6 }}>
                <span style={{ color: '#475569', fontWeight: 500 }}>Returns & Claims</span>
                <span style={{ fontWeight: 700, color: '#09090b' }}>4%</span>
              </div>
              <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '4%', height: '100%', background: '#f43f5e' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="clean-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#09090b' }}>
            Recent Store Orders
          </h3>
          <button
            onClick={() => navigate('/dashboard/orders')}
            style={{ fontSize: '0.82rem', color: '#18181b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            <span>Manage all</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px', color: '#64748b', fontSize: '0.88rem' }}>
            No customer orders placed for this store yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Order ID</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Customer</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Amount</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#09090b', fontFamily: 'var(--font-mono)' }}>{o.id}</td>
                    <td style={{ padding: '12px 14px', color: '#09090b', fontWeight: 500 }}>{o.customerName}</td>
                    <td style={{ padding: '12px 14px', color: '#64748b' }}>{o.date}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 700 }}>{formatINR(o.totalAmount)}</td>
                    <td style={{ padding: '12px 14px' }}>
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
