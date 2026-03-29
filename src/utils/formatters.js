export const formatDate = (dateStr) => {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatNumber = (num) => {
  if (num == null) return '--';
  return num.toLocaleString('en-IN');
};

export const formatPercent = (num) => {
  if (num == null) return '--';
  return `${num.toFixed(1)}%`;
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};
