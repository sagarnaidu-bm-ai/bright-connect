import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import { getUserProfile, getUserActivity, getChannelStatus } from '../../api/userProfile';
import { formatDateTime } from '../../utils/formatters';
import styles from './UserProfile.module.css';

/* ── Event type config ── */
const EVENT_BADGE_VARIANT = {
  Sent: 'sent',
  Delivered: 'delivered',
  Opened: 'opened',
  Clicked: 'clicked',
  Failed: 'failed',
  Unsubscribed: 'unsub',
};

const CHANNEL_VARIANT = {
  Email: 'email',
  Push: 'push',
  SMS: 'sms',
};

const EVENT_TYPES = ['All', 'Sent', 'Delivered', 'Opened', 'Clicked', 'Failed', 'Unsubscribed'];
const DATE_RANGES = ['Last 7 days', 'Last 30 days', 'All time'];

/* ── Sub-components ── */

function EventBadge({ type }) {
  return (
    <span className={`${styles.eventBadge} ${styles['eventBadge_' + (EVENT_BADGE_VARIANT[type] || 'gray')]}`}>
      {type}
    </span>
  );
}

function ChannelBadge({ channel }) {
  return (
    <span className={`${styles.channelBadge} ${styles['channelBadge_' + (CHANNEL_VARIANT[channel] || 'gray')]}`}>
      {channel}
    </span>
  );
}

function Avatar({ name }) {
  const initials = name
    ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';
  return <div className={styles.avatar}>{initials}</div>;
}

function StatusBadge({ status }) {
  return (
    <span className={`${styles.statusBadge} ${status === 'Active' ? styles.statusActive : styles.statusInactive}`}>
      {status}
    </span>
  );
}

function UserCard({ user }) {
  return (
    <div className={styles.userCard}>
      <Avatar name={user.name} />
      <div className={styles.userInfo}>
        <p className={styles.userName}>{user.name}</p>
        <p className={styles.userMeta}>{user.email}</p>
        <p className={styles.userMeta}>{user.phone}</p>
      </div>
      <div className={styles.userRight}>
        <span className={styles.uidBadge}>{user.uid}</span>
        <StatusBadge status={user.status} />
      </div>
    </div>
  );
}

function EmptyIllustration() {
  return (
    <div className={styles.emptyState}>
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <rect width="64" height="64" rx="16" fill="var(--bg-card)" />
        <circle cx="32" cy="24" r="10" stroke="var(--border-strong)" strokeWidth="2" fill="none" />
        <path d="M12 54c0-8 9-14 20-14s20 6 20 14" stroke="var(--border-strong)" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
      <p className={styles.emptyTitle}>Search for a user by their Bright UID</p>
      <p className={styles.emptyDesc}>Enter a UID like USR_a1b2c3 above to look up user profile and activity.</p>
    </div>
  );
}

function ErrorCallout({ message }) {
  return (
    <div className={styles.errorCallout}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <circle cx="8" cy="8" r="6.5" stroke="var(--error)" strokeWidth="1.4" />
        <path d="M8 5v3.5M8 10.5v.5" stroke="var(--error)" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      {message}
    </div>
  );
}

function Spinner() {
  return <div className={styles.spinner} />;
}

/* ── Channel icons ── */

const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
    <path d="M2 7l8 5 8-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PushIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 2a1 1 0 0 1 1 1v.5a5 5 0 0 1 4 4.9V12l1.5 2H3.5L5 12V8.4A5 5 0 0 1 9 3.5V3a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M8 14a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const SMSIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 4h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6l-4 3V5a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

const CHANNEL_ICONS = { Email: EmailIcon, Push: PushIcon, SMS: SMSIcon };

function formatChannelDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function ChannelStatusCard({ channels }) {
  return (
    <div className={styles.channelCard}>
      {channels.map((item, idx) => {
        const Icon = CHANNEL_ICONS[item.channel] || EmailIcon;
        const isActive = item.status === 'Active';
        return (
          <React.Fragment key={item.channel}>
            {idx > 0 && <div className={styles.channelDivider} />}
            <div className={styles.channelItem}>
              <span className={styles.channelIcon}>
                <Icon />
              </span>
              <span className={styles.channelName}>{item.channel}</span>
              <span className={`${styles.channelStatus} ${isActive ? styles.channelStatusActive : styles.channelStatusUnsub}`}>
                {isActive ? 'Active' : 'Unsubscribed'}
              </span>
              <span className={styles.channelDate}>
                {isActive
                  ? item.lastSent
                    ? `last sent: ${formatChannelDate(item.lastSent)}`
                    : 'no sends yet'
                  : item.unsubscribedAt
                    ? `unsubscribed: ${formatChannelDate(item.unsubscribedAt)}`
                    : ''}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ── Main component ── */

const UserProfile = () => {
  const [uid, setUid] = useState('');
  const [searching, setSearching] = useState(false);
  const [user, setUser] = useState(null);
  const [activity, setActivity] = useState([]);
  const [channelStatus, setChannelStatus] = useState([]);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [eventFilter, setEventFilter] = useState('All');
  const [dateRange, setDateRange] = useState('Last 7 days');

  const handleSearch = async () => {
    const trimmed = uid.trim();
    if (!trimmed) return;
    setSearching(true);
    setError(null);
    setUser(null);
    setActivity([]);
    setChannelStatus([]);
    setHasSearched(true);
    setEventFilter('All');
    setDateRange('Last 7 days');
    try {
      const [userData, activityData, channelData] = await Promise.all([
        getUserProfile(trimmed),
        getUserActivity(trimmed),
        getChannelStatus(trimmed),
      ]);
      setUser(userData);
      setActivity(activityData);
      setChannelStatus(channelData);
    } catch (err) {
      setError('No user found with this UID. Please check and try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const filteredActivity = useMemo(() => {
    return activity.filter(row => {
      if (eventFilter !== 'All' && row.eventType !== eventFilter) return false;
      return true;
    });
  }, [activity, eventFilter]);

  return (
    <div>
      <PageHeader title="User Profile" />

      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <label className={styles.searchLabel}>Enter Bright UID</label>
          <div className={styles.searchInputRow}>
            <input
              type="text"
              className={styles.searchInput}
              value={uid}
              onChange={e => setUid(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. USR_a1b2c3d4"
            />
            <button
              className={styles.searchBtn}
              onClick={handleSearch}
              disabled={searching || !uid.trim()}
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </div>

      {searching && (
        <div className={styles.spinnerWrap}>
          <Spinner />
        </div>
      )}

      {!searching && !hasSearched && <EmptyIllustration />}

      {!searching && hasSearched && error && <ErrorCallout message={error} />}

      {!searching && user && (
        <>
          <UserCard user={user} />

          {channelStatus.length > 0 && (
            <ChannelStatusCard channels={channelStatus} />
          )}

          <div className={styles.activitySection}>
            <p className={styles.activityTitle}>Activity Log</p>

            <div className={styles.filterRow}>
              <div className={styles.filterGroup}>
                {EVENT_TYPES.map(et => (
                  <button
                    key={et}
                    className={`${styles.filterPill} ${eventFilter === et ? styles.filterPillActive : ''}`}
                    onClick={() => setEventFilter(et)}
                  >
                    {et}
                  </button>
                ))}
              </div>
              <div className={styles.filterGroup}>
                {DATE_RANGES.map(dr => (
                  <button
                    key={dr}
                    className={`${styles.filterPill} ${dateRange === dr ? styles.filterPillActive : ''}`}
                    onClick={() => setDateRange(dr)}
                  >
                    {dr}
                  </button>
                ))}
              </div>
            </div>

            {filteredActivity.length === 0 ? (
              <p className={styles.noActivity}>No events match the selected filter.</p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>Timestamp</th>
                      <th className={styles.th}>Event Type</th>
                      <th className={styles.th}>Campaign</th>
                      <th className={styles.th}>Channel</th>
                      <th className={styles.th}>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredActivity.map(row => (
                      <tr key={row.id} className={styles.tr}>
                        <td className={styles.td}>
                          <span className={styles.timestamp}>{formatDateTime(row.timestamp)}</span>
                        </td>
                        <td className={styles.td}>
                          <EventBadge type={row.eventType} />
                        </td>
                        <td className={styles.td}>
                          <Link to={`/campaigns/${row.campaignId}`} className={styles.campaignLink}>
                            {row.campaign}
                          </Link>
                        </td>
                        <td className={styles.td}>
                          <ChannelBadge channel={row.channel} />
                        </td>
                        <td className={styles.td}>
                          <span className={styles.details}>{row.details}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;
