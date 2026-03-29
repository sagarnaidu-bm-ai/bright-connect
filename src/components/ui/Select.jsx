import React from 'react';
import styles from './Select.module.css';

const Select = ({
  label,
  value,
  onChange,
  options = [],
  error,
  placeholder = 'Select...',
  disabled = false,
  name,
  id,
}) => {
  const selectId = id || name || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label} htmlFor={selectId}>
          {label}
        </label>
      )}
      <div className={styles.selectWrap}>
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`${styles.select} ${error ? styles.error : ''}`}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className={styles.chevron}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};

export default Select;
