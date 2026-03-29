import React from 'react';
import styles from './Button.module.css';

const Button = ({
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  children,
  type = 'button',
  className = '',
}) => {
  const sizeClass = size === 'sm' ? styles.sm : size === 'lg' ? styles.lg : '';
  const variantClass = styles[variant] || styles.primary;

  return (
    <button
      type={type}
      className={`${styles.button} ${variantClass} ${sizeClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
