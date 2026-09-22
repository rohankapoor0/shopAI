import React from 'react';

export const StatusBadge = ({ status }) => {
  const getBadgeClass = (s) => {
    switch (s?.toLowerCase()) {
      case 'delivered':
      case 'refunded':
      case 'in stock':
      case 'active':
        return 'badge-emerald';
      case 'shipped':
      case 'out for delivery':
      case 'approved':
      case 'pickup scheduled':
        return 'badge-blue';
      case 'placed':
      case 'confirmed':
      case 'packed':
      case 'requested':
      case 'low stock':
        return 'badge-amber';
      case 'cancelled':
      case 'rejected':
      case 'out of stock':
        return 'badge-rose';
      default:
        return 'badge-purple';
    }
  };

  return (
    <span className={`badge ${getBadgeClass(status)}`} style={{ textTransform: 'capitalize' }}>
      ● {status}
    </span>
  );
};
