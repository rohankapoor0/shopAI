// Badge colors for a 0-5 rating: 4-5 green, 2-4 orange, 0-2 red (4.0 is green, 2.0 is orange)
export const getRatingColors = (rating) => {
  if (rating >= 4) return { background: 'var(--success-tint)', color: 'var(--success)', border: '1px solid var(--success-tint)' };
  if (rating >= 2) return { background: 'var(--warning-tint)', color: 'var(--warning-text)', border: '1px solid var(--warning-tint)' };
  return { background: 'var(--error-tint)', color: 'var(--error)', border: '1px solid var(--error-tint)' };
};
