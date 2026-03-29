import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Badge, { StatusBadge } from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import { getCampaign } from '../../api/campaigns';
import { getCampaignStats } from '../../api/analytics';
import { useToastContext } from '../../context/ToastContext';
import { formatDate, formatNumber } from '../../utils/formatters';
import styles from './CampaignDetail.module.css';

const CHANNEL_BADGE = { Email: 'info', Push: 'purple', SMS: 'amber' };
const TYPE_BADGE = { Transactional: 'gray', Marketing: 'success' };

const ACTIVITY_LOG = Array.from({ length: 10 }, (_, i) => ({
  id: String(i + 1),
  timestamp: new Date(Date.now() - i * 3600000 * 24).toISOString(),
  event: ['Sent', 'Delivered', 'Opened', 'Clicked', 'Sent', 'Delivered', 'Opened', 'Sent', 'Delivered', 'Clicked'][i],
  recipient: `user${100 + i}@example.com`,
  details: ['Batch send completed', 'Inbox delivery confirmed', 'Email opened', 'Link clicked', 'Batch send completed', 'Inbox delivery confirmed', 'Email opened', 'Batch send completed', 'Inbox delivery confirmed', 'CTA clicked'][i],
}));

const activityColumns = [
  { key: 'timestamp', label: 'Time', render: (val) => <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{formatDate(val)}</span> },
  { key: 'event', label: 'Event', render: (val) => <Badge variant={val === 'Clicked' ? 'success' : val === 'Opened' ? 'info' : 'gray'}>{val}</Badge> },
  { key: 'recipient', label: 'Recipient', render: (val) => <span style={{ fontSize: 13 }}>{val}</span> },
  { key: 'details', label: 'Details', render: (val) => <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{val}</span> },
];

const StatCard = ({ label, value, delta }) => (
  <div className={styles.statCard}>
    <p className={styles.statLabel}>{label}</p>
    <p className={styles.statValue}>{formatNumber(value)}</p>
    {delta != null && (
      <span className={`${styles.statDelta} ${delta < 0 ? styles.statDeltaNeg : ''}`}>
        {delta >= 0 ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 9V3M3 6l3-3 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 3v6M3 6l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {Math.abs(delta)} vs last period
      </span>
    )}
  </div>
);

const PERIOD_STATS = {
  '7d': { sent: 5200, delivered: 4420, opened: 1778, clicked: 421, deltasSent: 120, deltasDelivered: 95, deltasOpened: 43, deltasClicked: 12 },
  '30d': { sent: 18400, delivered: 15980, opened: 6120, clicked: 1340, deltasSent: 380, deltasDelivered: 310, deltasOpened: 95, deltasClicked: 28 },
  'all': { sent: 48200, delivered: 42100, opened: 16300, clicked: 3870, deltasSent: null, deltasDelivered: null, deltasOpened: null, deltasClicked: null },
};

const PERIOD_LABELS = { '7d': 'Last 7 days', '30d': 'Last 30 days', 'all': 'All time' };

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToastContext();

  const [campaign, setCampaign] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [archiveModal, setArchiveModal] = useState(false);
  const [period, setPeriod] = useState('7d');

  useEffect(() => {
    Promise.all([getCampaign(id), getCampaignStats(id)]).then(([c, s]) => {
      setCampaign(c);
      setStats(s);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div style={{ position: 'relative', height: 200 }}>
        <Spinner size="lg" centered />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div>
        <p style={{ color: 'var(--text-muted)' }}>Campaign not found.</p>
        <Button variant="ghost" onClick={() => navigate('/campaigns')}>Back to Campaigns</Button>
      </div>
    );
  }

  const handleToggleStatus = () => {
    const newStatus = campaign.status === 'Active' ? 'Paused' : 'Active';
    setCampaign(prev => ({ ...prev, status: newStatus }));
    showToast(`Campaign ${newStatus === 'Active' ? 'activated' : 'paused'}.`, 'success');
  };

  const handleArchive = () => {
    showToast(`"${campaign.name}" archived.`, 'success');
    setArchiveModal(false);
    navigate('/campaigns');
  };

  return (
    <div>
      <button className={styles.backLink} onClick={() => navigate('/campaigns')}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to Campaigns
      </button>

      <div className={styles.headerRow}>
        <div className={styles.headerLeft}>
          <h1 className={styles.campaignName}>{campaign.name}</h1>
          <div className={styles.badgeRow}>
            <StatusBadge status={campaign.status} />
            <Badge variant={CHANNEL_BADGE[campaign.channel] || 'gray'}>{campaign.channel}</Badge>
            <Badge variant={TYPE_BADGE[campaign.type] || 'gray'}>{campaign.type}</Badge>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button variant="secondary" onClick={() => navigate(`/campaigns/new?edit=${id}`)}>Edit</Button>
          <Button variant="secondary" onClick={handleToggleStatus}>
            {campaign.status === 'Active' ? 'Pause' : 'Activate'}
          </Button>
          <Button variant="danger" onClick={() => setArchiveModal(true)}>Archive</Button>
        </div>
      </div>

      {stats && (
        <>
          <div className={styles.periodRow}>
            <span className={styles.periodLabel}>Showing data for:</span>
            <div className={styles.periodPills}>
              {Object.entries(PERIOD_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  className={`${styles.periodPill} ${period === key ? styles.periodPillActive : ''}`}
                  onClick={() => setPeriod(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.statsGrid}>
            <StatCard label="Sent" value={PERIOD_STATS[period].sent} delta={PERIOD_STATS[period].deltasSent} />
            <StatCard label="Delivered" value={PERIOD_STATS[period].delivered} delta={PERIOD_STATS[period].deltasDelivered} />
            <StatCard label="Opened" value={PERIOD_STATS[period].opened} delta={PERIOD_STATS[period].deltasOpened} />
            <StatCard label="Clicked" value={PERIOD_STATS[period].clicked} delta={PERIOD_STATS[period].deltasClicked} />
          </div>
        </>
      )}

      <div className={styles.sectionCard}>
        <p className={styles.sectionTitle}>Campaign Configuration</p>
        <div className={styles.configGrid}>
          <div className={styles.configItem}>
            <span className={styles.configLabel}>Channel</span>
            <span className={styles.configValue}>{campaign.channel}</span>
          </div>
          <div className={styles.configItem}>
            <span className={styles.configLabel}>Type</span>
            <span className={styles.configValue}>{campaign.type}</span>
          </div>
          <div className={styles.configItem}>
            <span className={styles.configLabel}>Trigger Type</span>
            <span className={styles.configValue}>{campaign.triggerType}</span>
          </div>
          <div className={styles.configItem}>
            <span className={styles.configLabel}>Status</span>
            <span className={styles.configValue}>{campaign.status}</span>
          </div>
          {campaign.eventName && (
            <div className={styles.configItem}>
              <span className={styles.configLabel}>Event Name</span>
              <span className={styles.configValue}>{campaign.eventName}</span>
            </div>
          )}
          {campaign.scheduleType && (
            <div className={styles.configItem}>
              <span className={styles.configLabel}>Schedule Type</span>
              <span className={styles.configValue}>{campaign.scheduleType}</span>
            </div>
          )}
          {campaign.sendDateTime && (
            <div className={styles.configItem}>
              <span className={styles.configLabel}>Send Date</span>
              <span className={styles.configValue}>{formatDate(campaign.sendDateTime)}</span>
            </div>
          )}
          <div className={styles.configItem}>
            <span className={styles.configLabel}>Last Sent</span>
            <span className={styles.configValue}>{formatDate(campaign.lastSent)}</span>
          </div>
        </div>
      </div>

      <div className={styles.sectionCard} style={{ padding: 0 }}>
        <div style={{ padding: '20px 24px 16px' }}>
          <p className={styles.sectionTitle} style={{ margin: 0 }}>Activity Log</p>
        </div>
        <div className={styles.tableCard}>
          <Table columns={activityColumns} data={ACTIVITY_LOG} />
        </div>
      </div>

      <Modal
        isOpen={archiveModal}
        onClose={() => setArchiveModal(false)}
        title="Archive Campaign"
        footer={
          <>
            <Button variant="secondary" onClick={() => setArchiveModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleArchive}>Archive</Button>
          </>
        }
      >
        <p style={{ fontSize: 14, color: 'var(--text-body)', lineHeight: 1.6 }}>
          Are you sure you want to archive <strong>"{campaign.name}"</strong>? This will stop all sends and remove it from the active list.
        </p>
      </Modal>
    </div>
  );
};

export default CampaignDetail;
