// Badge colors for a 0-5 rating: 4-5 green, 2-4 orange, 0-2 red (4.0 is green, 2.0 is orange)
export const getRatingColors = (rating) => {
  if (rating >= 4) return { background: '#ecfdf5', color: '#047857', border: '1px solid #d1fae5' };
  if (rating >= 2) return { background: '#fff7ed', color: '#c2410c', border: '1px solid #ffedd5' };
  return { background: '#fef2f2', color: '#b91c1c', border: '1px solid #fee2e2' };
};
