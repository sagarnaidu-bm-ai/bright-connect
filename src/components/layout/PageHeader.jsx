import React from 'react';
import styles from './PageHeader.module.css';

const PageHeader = ({ title, actions }) => {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
};

export default PageHeader;
