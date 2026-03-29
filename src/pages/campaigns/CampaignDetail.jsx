import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Badge, { StatusBadge } from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import { getCampaign } from '../../api/campaigns';
import { getCampaignStats } from '../../api/analytics';
import { useToastContext } from '../../context/ToastContext';
import { formatDate, formatNumber } from '../../utils/formatters';
import styles from './CampaignDetail.module.css';

const CHANNEL_BADGE = { Email: 'info', Push: 'purple', SMS: 'amber' };
const TYPE_BADGE = { Transactional: 'gray', Marketing: 'success' };

const TREND_7D = [
  { date: 'Jan 9',  sent: 420, delivered: 385, opened: 108, clicked: 28 },
  { date: 'Jan 10', sent: 380, delivered: 352, opened: 95,  clicked: 22 },
  { date: 'Jan 11', sent: 510, delivered: 470, opened: 134, clicked: 35 },
  { date: 'Jan 12', sent: 290, delivered: 268, opened: 78,  clicked: 18 },
  { date: 'Jan 13', sent: 445, delivered: 410, opened: 122, clicked: 30 },
  { date: 'Jan 14', sent: 380, delivered: 350, opened: 98,  clicked: 24 },
  { date: 'Jan 15', sent: 520, delivered: 485, opened: 145, clicked: 38 },
];

const TREND_30D = [
  { date: 'Dec 17', sent: 310, delivered: 285, opened: 82,  clicked: 19 },
  { date: 'Dec 18', sent: 420, delivered: 390, opened: 110, clicked: 27 },
  { date: 'Dec 19', sent: 370, delivered: 340, opened: 96,  clicked: 22 },
  { date: 'Dec 20', sent: 480, delivered: 445, opened: 128, clicked: 34 },
  { date: 'Dec 21', sent: 290, delivered: 268, opened: 74,  clicked: 16 },
  { date: 'Dec 22', sent: 350, delivered: 322, opened: 89,  clicked: 21 },
  { date: 'Dec 23', sent: 510, delivered: 472, opened: 136, clicked: 38 },
  { date: 'Dec 24', sent: 260, delivered: 240, opened: 66,  clicked: 14 },
  { date: 'Dec 25', sent: 190, delivered: 175, opened: 48,  clicked: 10 },
  { date: 'Dec 26', sent: 330, delivered: 305, opened: 86,  clicked: 20 },
  { date: 'Dec 27', sent: 455, delivered: 420, opened: 120, clicked: 31 },
  { date: 'Dec 28', sent: 390, delivered: 360, opened: 102, clicked: 26 },
  { date: 'Dec 29', sent: 500, delivered: 462, opened: 132, clicked: 36 },
  { date: 'Dec 30', sent: 340, delivered: 314, opened: 88,  clicked: 22 },
  { date: 'Dec 31', sent: 280, delivered: 258, opened: 70,  clicked: 16 },
  { date: 'Jan 1',  sent: 220, delivered: 202, opened: 54,  clicked: 11 },
  { date: 'Jan 2',  sent: 360, delivered: 332, opened: 93,  clicked: 23 },
  { date: 'Jan 3',  sent: 470, delivered: 435, opened: 124, clicked: 33 },
  { date: 'Jan 4',  sent: 390, delivered: 360, opened: 101, clicked: 26 },
  { date: 'Jan 5',  sent: 430, delivered: 397, opened: 113, clicked: 29 },
  { date: 'Jan 6',  sent: 410, delivered: 378, opened: 107, clicked: 28 },
  { date: 'Jan 7',  sent: 355, delivered: 328, opened: 92,  clicked: 23 },
  { date: 'Jan 8',  sent: 495, delivered: 458, opened: 130, clicked: 35 },
  { date: 'Jan 9',  sent: 420, delivered: 385, opened: 108, clicked: 28 },
  { date: 'Jan 10', sent: 380, delivered: 352, opened: 95,  clicked: 22 },
  { date: 'Jan 11', sent: 510, delivered: 470, opened: 134, clicked: 35 },
  { date: 'Jan 12', sent: 290, delivered: 268, opened: 78,  clicked: 18 },
  { date: 'Jan 13', sent: 445, delivered: 410, opened: 122, clicked: 30 },
  { date: 'Jan 14', sent: 380, delivered: 350, opened: 98,  clicked: 24 },
  { date: 'Jan 15', sent: 520, delivered: 485, opened: 145, clicked: 38 },
];

const LINE_COLORS = { sent: '#378ADD', delivered: '#2DC76D' };

const LineChart = ({ data }) => {
  const W = 900, H = 220, padL = 48, padR = 16, padT = 16, padB = 32;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const maxVal = Math.max(...data.flatMap(d => [d.sent, d.delivered]));
  const minVal = 0;
  const range = maxVal - minVal || 1;

  const xStep = chartW / (data.length - 1);
  const toX = (i) => padL + i * xStep;
  const toY = (v) => padT + chartH - ((v - minVal) / range) * chartH;

  const makePath = (key) =>
    data.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(d[key]).toFixed(1)}`).join(' ');

  const makeArea = (key) => {
    const line = makePath(key);
    const last = data.length - 1;
    return `${line} L${toX(last).toFixed(1)},${(padT + chartH).toFixed(1)} L${padL.toFixed(1)},${(padT + chartH).toFixed(1)} Z`;
  };

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => Math.round(minVal + t * range));

  return (
    <div>
      <div className={styles.chartLegend}>
        {[{ key: 'sent', label: 'Sent' }, { key: 'delivered', label: 'Delivered' }].map(item => (
          <div key={item.key} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: LINE_COLORS[item.key] }} />
            <span className={styles.legendLabel}>{item.label}</span>
          </div>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className={styles.lineChart} aria-hidden="true">
        <defs>
          <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#378ADD" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#378ADD" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="deliveredGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2DC76D" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#2DC76D" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y-axis grid lines + labels */}
        {yTicks.map((tick) => {
          const y = toY(tick);
          return (
            <g key={tick}>
              <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#E5EDE8" strokeWidth="1" />
              <text x={padL - 6} y={y + 4} fontSize="10" fill="#888" textAnchor="end">{tick}</text>
            </g>
          );
        })}

        {/* Area fills */}
        <path d={makeArea('sent')} fill="url(#sentGrad)" />
        <path d={makeArea('delivered')} fill="url(#deliveredGrad)" />

        {/* Lines */}
        <path d={makePath('sent')} fill="none" stroke="#378ADD" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <path d={makePath('delivered')} fill="none" stroke="#2DC76D" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* Dots + tooltips */}
        {data.map((d, i) => (
          <g key={d.date}>
            <circle cx={toX(i)} cy={toY(d.sent)} r="3.5" fill="#378ADD" stroke="white" strokeWidth="1.5">
              <title>Sent: {d.sent}</title>
            </circle>
            <circle cx={toX(i)} cy={toY(d.delivered)} r="3.5" fill="#2DC76D" stroke="white" strokeWidth="1.5">
              <title>Delivered: {d.delivered}</title>
            </circle>
          </g>
        ))}

        {/* X-axis labels */}
        {data.map((d, i) => (
          <text
            key={d.date}
            x={toX(i)}
            y={H - 4}
            fontSize="10"
            fill="#888"
            textAnchor="middle"
          >
            {d.date}
          </text>
        ))}
      </svg>
    </div>
  );
};

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

const TREND_PERIODS = ['Last 7 days', 'Last 30 days'];

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToastContext();

  const [campaign, setCampaign] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [archiveModal, setArchiveModal] = useState(false);
  const [period, setPeriod] = useState('7d');
  const [trendPeriod, setTrendPeriod] = useState('Last 7 days');

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

  const trendData = trendPeriod === 'Last 7 days' ? TREND_7D : TREND_30D;

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

      <div className={styles.sectionCard}>
        <div className={styles.trendHeader}>
          <p className={styles.sectionTitle} style={{ margin: 0 }}>Day-on-Day Performance</p>
          <div className={styles.trendPills}>
            {TREND_PERIODS.map(tp => (
              <button
                key={tp}
                className={`${styles.periodPill} ${trendPeriod === tp ? styles.periodPillActive : ''}`}
                onClick={() => setTrendPeriod(tp)}
              >
                {tp}
              </button>
            ))}
          </div>
        </div>
        <LineChart data={trendData} />
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
