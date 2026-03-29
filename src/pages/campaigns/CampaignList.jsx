import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import Badge, { StatusBadge } from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import { useCampaigns } from '../../hooks/useCampaigns';
import { useToastContext } from '../../context/ToastContext';
import { archiveCampaign } from '../../api/campaigns';
import { CHANNEL_TYPES, CAMPAIGN_TYPES, CAMPAIGN_STATUSES } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import styles from './CampaignList.module.css';

const CHANNEL_BADGE = { Email: 'info', Push: 'purple', SMS: 'amber' };
const TYPE_BADGE = { Transactional: 'gray', Marketing: 'success' };

function FilterPills({ label, options, value, onChange }) {
  return (
    <div className={styles.filterGroup}>
      <span className={styles.filterLabel}>{label}:</span>
      <button
        className={`${styles.pill} ${value === 'All' ? styles.pillActive : ''}`}
        onClick={() => onChange('All')}
      >
        All
      </button>
      {options.map(opt => (
        <button
          key={opt}
          className={`${styles.pill} ${value === opt ? styles.pillActive : ''}`}
          onClick={() => onChange(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function ActionMenu({ campaign, onArchive, onToggleStatus }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className={styles.menuWrap} ref={ref}>
      <button className={styles.moreBtn} onClick={() => setOpen(v => !v)} aria-label="Actions">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="3" r="1.2" fill="currentColor" />
          <circle cx="7" cy="7" r="1.2" fill="currentColor" />
          <circle cx="7" cy="11" r="1.2" fill="currentColor" />
        </svg>
      </button>
      {open && (
        <div className={styles.menu}>
          <button className={styles.menuItem} onClick={() => { navigate(`/campaigns/${campaign.id}`); setOpen(false); }}>
            Edit
          </button>
          <button className={styles.menuItem} onClick={() => { setOpen(false); }}>
            Duplicate
          </button>
          <button
            className={styles.menuItem}
            onClick={() => { onToggleStatus(campaign); setOpen(false); }}
          >
            {campaign.status === 'Active' ? 'Pause' : 'Activate'}
          </button>
          <button
            className={`${styles.menuItem} ${styles.menuItemDanger}`}
            onClick={() => { onArchive(campaign); setOpen(false); }}
          >
            Archive
          </button>
        </div>
      )}
    </div>
  );
}

const EmptyState = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.emptyState}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="var(--bg-card)" />
        <path d="M16 30c0-2 1-3 3-4l3-1 2-5 2 5 3 1c2 1 3 2 3 4v2H16v-2z" fill="var(--border-default)" />
        <ellipse cx="24" cy="18" rx="5" ry="5" fill="var(--border-default)" />
        <path d="M30 24l4 4" stroke="var(--green-primary)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="34" cy="28" r="4" stroke="var(--green-primary)" strokeWidth="2" fill="none" />
      </svg>
      <p className={styles.emptyTitle}>No campaigns yet</p>
      <p className={styles.emptyDesc}>Create your first campaign to get started.</p>
      <Button onClick={() => navigate('/campaigns/new')}>Create Campaign</Button>
    </div>
  );
};

const CampaignList = () => {
  const [nameSearch, setNameSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [archiveModal, setArchiveModal] = useState(null);

  const { campaigns, loading, setCampaigns } = useCampaigns({});
  const { showToast } = useToastContext();
  const navigate = useNavigate();

  const filtered = campaigns.filter(c => {
    if (nameSearch && !c.name.toLowerCase().includes(nameSearch.toLowerCase())) return false;
    if (channelFilter !== 'All' && c.channel !== channelFilter) return false;
    if (typeFilter !== 'All' && c.type !== typeFilter) return false;
    if (statusFilter !== 'All' && c.status !== statusFilter) return false;
    if (dateFrom) {
      const campaignDate = c.createdAt ? c.createdAt.slice(0, 10) : '';
      if (!campaignDate || campaignDate < dateFrom) return false;
    }
    if (dateTo) {
      const campaignDate = c.createdAt ? c.createdAt.slice(0, 10) : '';
      if (!campaignDate || campaignDate > dateTo) return false;
    }
    return true;
  });

  const handleArchive = (campaign) => setArchiveModal(campaign);

  const confirmArchive = async () => {
    await archiveCampaign(archiveModal.id);
    setCampaigns(prev => prev.filter(c => c.id !== archiveModal.id));
    showToast(`"${archiveModal.name}" has been archived.`, 'success');
    setArchiveModal(null);
  };

  const handleToggleStatus = (campaign) => {
    const newStatus = campaign.status === 'Active' ? 'Paused' : 'Active';
    setCampaigns(prev => prev.map(c => c.id === campaign.id ? { ...c, status: newStatus } : c));
    showToast(`Campaign ${newStatus === 'Active' ? 'activated' : 'paused'} successfully.`, 'success');
  };

  const columns = [
    {
      key: 'name',
      label: 'Campaign Name',
      render: (val, row) => (
        <Link to={`/campaigns/${row.id}`} className={styles.nameLink}>{val}</Link>
      ),
    },
    {
      key: 'id',
      label: 'Campaign ID',
      render: (val) => (
        <span className={styles.campaignId}>{val}</span>
      ),
    },
    {
      key: 'channel',
      label: 'Channel',
      render: (val) => <Badge variant={CHANNEL_BADGE[val] || 'gray'}>{val}</Badge>,
    },
    {
      key: 'type',
      label: 'Type',
      render: (val) => <Badge variant={TYPE_BADGE[val] || 'gray'}>{val}</Badge>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'triggerType',
      label: 'Trigger',
      render: (val) => <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{val}</span>,
    },
    {
      key: 'createdAt',
      label: 'Created On',
      render: (val) => <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{formatDate(val)}</span>,
    },
    {
      key: 'actions',
      label: '',
      render: (val, row) => (
        <ActionMenu
          campaign={row}
          onArchive={handleArchive}
          onToggleStatus={handleToggleStatus}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Campaigns"
        actions={
          <Button onClick={() => navigate('/campaigns/new')}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginRight: 4 }}>
              <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            New Campaign
          </Button>
        }
      />

      <div className={styles.filterRow}>
        <input
          type="text"
          className={styles.nameSearchInput}
          placeholder="Search by campaign name..."
          value={nameSearch}
          onChange={e => setNameSearch(e.target.value)}
          aria-label="Search campaigns by name"
        />
        <FilterPills label="Channel" options={CHANNEL_TYPES} value={channelFilter} onChange={setChannelFilter} />
        <FilterPills label="Type" options={CAMPAIGN_TYPES} value={typeFilter} onChange={setTypeFilter} />
        <FilterPills label="Status" options={CAMPAIGN_STATUSES} value={statusFilter} onChange={setStatusFilter} />
      </div>

      <div className={styles.dateFilterRow}>
        <span className={styles.filterLabel}>Created:</span>
        <input
          type="date"
          className={styles.dateInput}
          value={dateFrom}
          onChange={e => setDateFrom(e.target.value)}
          placeholder="From"
          aria-label="Created from date"
        />
        <span className={styles.dateSeparator}>—</span>
        <input
          type="date"
          className={styles.dateInput}
          value={dateTo}
          onChange={e => setDateTo(e.target.value)}
          placeholder="To"
          aria-label="Created to date"
        />
        {(dateFrom || dateTo) && (
          <button
            className={styles.dateClear}
            onClick={() => { setDateFrom(''); setDateTo(''); }}
          >
            Clear
          </button>
        )}
      </div>

      <div className={styles.tableCard}>
        <Table
          columns={columns}
          data={filtered}
          loading={loading}
          emptyState={<EmptyState />}
        />
      </div>

      <Modal
        isOpen={!!archiveModal}
        onClose={() => setArchiveModal(null)}
        title="Archive Campaign"
        footer={
          <>
            <Button variant="secondary" onClick={() => setArchiveModal(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmArchive}>Archive</Button>
          </>
        }
      >
        {archiveModal && (
          <p className={styles.modalText}>
            Are you sure you want to archive{' '}
            <span className={styles.modalCampaignName}>"{archiveModal.name}"</span>?
            This will stop all sends and remove it from the active list. This action cannot be undone.
          </p>
        )}
      </Modal>
    </div>
  );
};

export default CampaignList;
