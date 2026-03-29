import React from 'react';
import Sidebar from './Sidebar';
import styles from './AppShell.module.css';

const AppShell = ({ children }) => {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <main className={styles.main}>
        <div className={styles.inner}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppShell;
