import React from 'react';
import styles from './Input.module.css';

const Input = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  type = 'text',
  maxLength,
  showCount = false,
  disabled = false,
  name,
  id,
}) => {
  const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className={styles.inputWrap}>
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          className={`${styles.input} ${error ? styles.error : ''}`}
        />
      </div>
      {(error || (showCount && maxLength)) && (
        <div className={styles.footer}>
          {error && <span className={styles.errorText}>{error}</span>}
          {showCount && maxLength && (
            <span className={styles.charCount}>
              {(value || '').length}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Input;
