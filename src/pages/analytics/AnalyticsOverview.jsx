import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import { getOverview } from '../../api/analytics';
import { formatNumber, formatPercent } from '../../utils/formatters';
import styles from './AnalyticsOverview.module.css';

const DATE_RANGES = ['Last 7 days', 'Last 30 days', 'Custom'];
const CHANNEL_BADGE = { Email: 'info', Push: 'purple', SMS: 'amber' };

const MetricCard = ({ label, value, rate, rateLabel }) => (
  <div className={styles.metricCard}>
    <p className={styles.metricLabel}>{label}</p>
    <p className={styles.metricValue}>{formatNumber(value)}</p>
    {rate != null && (
      <p className={styles.metricRate}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 9l3-3 2 2 3-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {formatPercent(rate)} {rateLabel}
      </p>
    )}
  </div>
);

const channelColumns = [
  { key: 'channel', label: 'Channel', render: (val) => <Badge variant={CHANNEL_BADGE[val] || 'gray'}>{val}</Badge> },
  { key: 'sent', label: 'Sent', render: (val) => <span className={styles.rateCell}>{formatNumber(val)}</span> },
  { key: 'delivered', label: 'Delivered', render: (val) => <span className={styles.rateCell}>{formatNumber(val)}</span> },
  { key: 'deliveryRate', label: 'Delivery Rate', render: (val) => <span className={styles.rateCell}>{formatPercent(val)}</span> },
  { key: 'opens', label: 'Opens', render: (val) => val != null ? <span className={styles.rateCell}>{formatNumber(val)}</span> : <span className={styles.naText}>N/A</span> },
  { key: 'openRate', label: 'Open Rate', render: (val) => val != null ? <span className={styles.rateCell}>{formatPercent(val)}</span> : <span className={styles.naText}>N/A</span> },
  { key: 'clicks', label: 'Clicks', render: (val) => <span className={styles.rateCell}>{formatNumber(val)}</span> },
  { key: 'clickRate', label: 'Click Rate', render: (val) => <span className={styles.rateCell}>{formatPercent(val)}</span> },
];

const topCampaignColumns = [
  { key: 'name', label: 'Campaign', render: (val) => <span style={{ fontWeight: 500 }}>{val}</span> },
  { key: 'channel', label: 'Channel', render: (val) => <Badge variant={CHANNEL_BADGE[val] || 'gray'}>{val}</Badge> },
  { key: 'sent', label: 'Sent', render: (val) => <span className={styles.rateCell}>{formatNumber(val)}</span> },
  {
    key: 'openRate',
    label: 'Open Rate',
    render: (val) => val != null ? <span className={styles.rateCell}>{formatPercent(val)}</span> : <span className={styles.naText}>N/A</span>,
  },
  { key: 'clickRate', label: 'Click Rate', render: (val) => <span className={styles.rateCell}>{formatPercent(val)}</span> },
];

const AnalyticsOverview = () => {
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getOverview(dateRange).then(d => {
      setData(d);
      setLoading(false);
    });
  }, [dateRange]);

  return (
    <div>
      <PageHeader
        title="Analytics"
        actions={
          <div className={styles.dateToggle}>
            {DATE_RANGES.map(r => (
              <button
                key={r}
                className={`${styles.dateBtn} ${dateRange === r ? styles.dateBtnActive : ''}`}
                onClick={() => setDateRange(r)}
              >
                {r}
              </button>
            ))}
          </div>
        }
      />

      {loading ? (
        <div style={{ position: 'relative', height: 200 }}>
          <Spinner size="lg" centered />
        </div>
      ) : (
        <>
          <div className={styles.metricsGrid}>
            <MetricCard label="Messages Sent" value={data.sent} />
            <MetricCard label="Delivered" value={data.delivered} rate={data.deliveryRate} rateLabel="delivery rate" />
            <MetricCard label="Opened" value={data.opened} rate={data.openRate} rateLabel="open rate" />
            <MetricCard label="Clicked" value={data.clicked} rate={data.clickRate} rateLabel="click rate" />
          </div>

          <p className={styles.sectionTitle}>Channel Breakdown</p>
          <div className={styles.tableCard}>
            <Table columns={channelColumns} data={data.byChannel} />
          </div>

          <p className={styles.sectionTitle}>Top Performing Campaigns</p>
          <div className={styles.tableCard}>
            <Table columns={topCampaignColumns} data={data.topCampaigns} />
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsOverview;
