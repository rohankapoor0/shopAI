import React, { useEffect, useState } from 'react';
import { 
  RotateCcw, 
  Search, 
  Check, 
  X, 
  Truck, 
  DollarSign, 
  AlertCircle 
} from 'lucide-react';
import { storeService } from '../../services/storeService';
import { returnService } from '../../services/returnService';
import { StatusBadge } from '../../components/StatusBadge';

export const Returns = () => {
  const [returns, setReturns] = useState([]);
  const [store, setStore] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const returnStatuses = [
    "Requested",
    "Approved",
    "Pickup Scheduled",
    "Returned",
    "Refunded",
    "Rejected"
  ];

  const loadData = async () => {
    const activeId = storeService.getActiveStoreId();
    const current = await storeService.getStoreById(activeId);
    setStore(current);
    if (current) {
      const rets = await returnService.getStoreReturns(current.id);
      setReturns(rets);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (returnId, newStatus) => {
    await returnService.updateReturnStatus(returnId, newStatus);
    loadData();
  };

  const formatINR = (val) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val || 0);

  const filtered = returns.filter(r => {
    const matchesSearch = r.id.toLowerCase().includes(search.toLowerCase()) ||
                          r.orderId.toLowerCase().includes(search.toLowerCase()) ||
                          r.customerName.toLowerCase().includes(search.toLowerCase()) ||
                          r.productName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
          Customer Returns & Refunds
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 2 }}>
          Inspect return claims, approve doorstep pickups, and issue refunds for {store?.name}
        </p>
      </div>

      <div className="glass-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ position: 'relative', width: 280 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input
              type="text"
              placeholder="Search return by ID, order, item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                height: 38,
                paddingLeft: 34,
                borderRadius: 8,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['All', 'Requested', 'Approved', 'Pickup Scheduled', 'Refunded', 'Rejected'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: filterStatus === st ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  color: filterStatus === st ? '#60a5fa' : 'var(--text-muted)',
                  border: '1px solid',
                  borderColor: filterStatus === st ? '#3b82f6' : 'var(--border-subtle)'
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
            <RotateCcw size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
            <h3>No return claims found</h3>
            <p style={{ fontSize: '0.85rem', marginTop: 4 }}>Customers can request returns from their customer order tracking page.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-subtle)', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px' }}>Return ID</th>
                  <th style={{ padding: '10px 12px' }}>Order</th>
                  <th style={{ padding: '10px 12px' }}>Customer</th>
                  <th style={{ padding: '10px 12px' }}>Product</th>
                  <th style={{ padding: '10px 12px' }}>Reason</th>
                  <th style={{ padding: '10px 12px' }}>Status</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Workflow Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(ret => (
                  <tr key={ret.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px', fontWeight: 800, color: '#fb7185', fontFamily: 'var(--font-mono)' }}>
                      {ret.id}
                    </td>
                    <td style={{ padding: '12px', color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>
                      {ret.orderId}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 600, color: '#ffffff' }}>{ret.customerName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{ret.customerEmail}</div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={ret.productImage} alt={ret.productName} style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontWeight: 600 }}>{ret.productName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatINR(ret.amount)}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 600, color: '#ffffff' }}>{ret.reason}</div>
                      {ret.notes && <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>"{ret.notes}"</div>}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <StatusBadge status={ret.status} />
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <select
                        value={ret.status}
                        onChange={(e) => handleUpdateStatus(ret.id, e.target.value)}
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 8,
                          padding: '6px 10px',
                          color: '#ffffff',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          outline: 'none'
                        }}
                      >
                        {returnStatuses.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
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
