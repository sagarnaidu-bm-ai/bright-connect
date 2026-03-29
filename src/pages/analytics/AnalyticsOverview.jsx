import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { getOverview } from '../../api/analytics';
import { formatNumber, formatPercent } from '../../utils/formatters';
import styles from './AnalyticsOverview.module.css';

const DATE_RANGES = ['Last 7 days', 'Last 30 days', 'Custom'];
const CHANNEL_BADGE = { Email: 'info', Push: 'purple', SMS: 'amber' };

const SORT_OPTIONS = [
  { value: 'openRate', label: 'Sort by: Open Rate' },
  { value: 'clickRate', label: 'Sort by: Click Rate' },
  { value: 'sent', label: 'Sort by: Sent (High to Low)' },
  { value: 'name', label: 'Sort by: Name (A-Z)' },
];

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

const downloadUserList = (campaign) => {
  const csvContent = [
    ['user_id', 'email', 'event', 'channel', 'status', 'timestamp'],
    ['USR_a1b2c3', 'arjun@example.com', 'Delivered', campaign.channel, 'Delivered', '2024-01-15 10:30'],
    ['USR_b2c3d4', 'priya@example.com', 'Opened', campaign.channel, 'Opened', '2024-01-15 11:00'],
    ['USR_c3d4e5', 'rahul@example.com', 'Clicked', campaign.channel, 'Clicked', '2024-01-15 11:30'],
  ].map(row => row.join(',')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${campaign.name.replace(/\s+/g, '_')}_users.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const AnalyticsOverview = () => {
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('openRate');
  const [nameSearch, setNameSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    getOverview(dateRange).then(d => {
      setData(d);
      setLoading(false);
    });
  }, [dateRange]);

  const sortedFilteredCampaigns = useMemo(() => {
    if (!data) return [];
    let list = data.topCampaigns.filter(c =>
      c.name.toLowerCase().includes(nameSearch.toLowerCase())
    );
    list = [...list].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'sent') return (b.sent || 0) - (a.sent || 0);
      if (sortBy === 'clickRate') return (b.clickRate || 0) - (a.clickRate || 0);
      // openRate default
      return (b.openRate || 0) - (a.openRate || 0);
    });
    return list;
  }, [data, sortBy, nameSearch]);

  const campaignColumns = [
    {
      key: 'name',
      label: 'Campaign',
      render: (val, row) => (
        <Link to={`/campaigns/${row.id}`} className={styles.campaignNameLink}>
          {val}
        </Link>
      ),
    },
    { key: 'channel', label: 'Channel', render: (val) => <Badge variant={CHANNEL_BADGE[val] || 'gray'}>{val}</Badge> },
    { key: 'sent', label: 'Sent', render: (val) => <span className={styles.rateCell}>{formatNumber(val)}</span> },
    {
      key: 'openRate',
      label: 'Open Rate',
      render: (val) => val != null ? <span className={styles.rateCell}>{formatPercent(val)}</span> : <span className={styles.naText}>N/A</span>,
    },
    { key: 'clickRate', label: 'Click Rate', render: (val) => <span className={styles.rateCell}>{formatPercent(val)}</span> },
    {
      key: 'id',
      label: 'Actions',
      render: (val, row) => (
        <Button variant="secondary" size="sm" onClick={() => downloadUserList(row)}>
          Download
        </Button>
      ),
    },
  ];

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
          <p className={styles.sectionTitle}>Channel Breakdown</p>
          <div className={styles.tableCard}>
            <Table columns={channelColumns} data={data.byChannel} />
          </div>

          <div className={styles.campaignSectionHeader}>
            <p className={styles.sectionTitle} style={{ margin: 0 }}>Campaign Performance</p>
            <select
              className={styles.sortSelect}
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className={styles.campaignSearch}>
            <input
              type="text"
              className={styles.campaignSearchInput}
              placeholder="Search campaigns..."
              value={nameSearch}
              onChange={e => setNameSearch(e.target.value)}
            />
          </div>

          <div className={styles.tableCard}>
            <Table columns={campaignColumns} data={sortedFilteredCampaigns} />
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsOverview;
