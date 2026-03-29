import React from 'react';
import Spinner from './Spinner';
import styles from './Table.module.css';

const Table = ({ columns = [], data = [], emptyState, loading = false }) => {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            {columns.map(col => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {loading ? (
            <tr>
              <td colSpan={columns.length}>
                <div className={styles.loadingWrap}>
                  <Spinner size="md" />
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <div className={styles.emptyWrap}>
                  {emptyState || 'No data available'}
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={row.id || rowIndex}>
                {columns.map(col => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
