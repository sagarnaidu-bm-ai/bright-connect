import React from 'react';
import styles from './Badge.module.css';

const Badge = ({ variant = 'gray', children }) => {
  const variantClass = styles[variant] || styles.gray;
  return (
    <span className={`${styles.badge} ${variantClass}`}>
      {children}
    </span>
  );
};

const STATUS_CONFIG = {
  Active: { color: 'var(--status-active)', label: 'Active' },
  Draft: { color: 'var(--status-draft)', label: 'Draft' },
  Paused: { color: 'var(--status-paused)', label: 'Paused' },
  Scheduled: { color: 'var(--status-scheduled)', label: 'Scheduled' },
};

export const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || { color: 'var(--text-muted)', label: status };
  const isActive = status === 'Active';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 500,
        padding: '2px 10px',
        background: `${config.color}18`,
        color: config.color,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: config.color,
          flexShrink: 0,
          animation: isActive ? 'statusPulse 2s ease-in-out infinite' : 'none',
        }}
      />
      {config.label}
    </span>
  );
};

export default Badge;
