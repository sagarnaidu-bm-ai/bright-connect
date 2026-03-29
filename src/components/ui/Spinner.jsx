import React from 'react';
import styles from './Spinner.module.css';

const Spinner = ({ size = 'md', centered = false }) => {
  const sizeClass = styles[size] || styles.md;

  return (
    <span
      className={`${styles.spinner} ${sizeClass} ${centered ? styles.centered : ''}`}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Spinner;
