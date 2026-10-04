import React, { useEffect, useState } from 'react';
import {
  Users,
  Search
} from 'lucide-react';
import { storeService } from '../../services/storeService';
import { customerService } from '../../services/customerService';

export const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [store, setStore] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      const activeId = storeService.getActiveStoreId();
      const current = await storeService.getStoreById(activeId);
      setStore(current);
      if (current) {
        const custs = await customerService.getStoreCustomers(current.id);
        setCustomers(custs);
      }
    };
    load();
  }, []);

  const formatINR = (val) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val || 0);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          Store Customers
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 2 }}>
          Customers who have purchased products directly from <strong style={{ color: 'var(--text-main)' }}>{store?.name}</strong>
        </p>
      </div>

      <div className="clean-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ position: 'relative', width: 280 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input
              type="text"
              placeholder="Search customer name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                height: 38,
                paddingLeft: 34,
                borderRadius: 8,
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Showing {filtered.length} customers
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
            <Users size={38} style={{ opacity: 0.35, marginBottom: 12 }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>No customers found</h3>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Customer Name</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Email Address</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Phone</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Orders Placed</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Total Spent</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Last Order Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--bg-muted)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-main)' }}>
                      {c.name}
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>
                      {c.email}
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>
                      {c.phone || '+91 98000 00000'}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-main)' }}>
                      {c.ordersCount} orders
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--success)' }}>
                      {formatINR(c.totalSpent)}
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>
                      {c.lastOrder || 'Recent'}
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
