import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Spinner from '../../components/ui/Spinner';
import { getSettings, updateSettings } from '../../api/settings';
import { useToastContext } from '../../context/ToastContext';
import styles from './SettingsGeneral.module.css';

/* ── Sender ID mock data ── */
const INITIAL_SENDERS = [
  { id: 1, channel: 'Email', senderId: 'noreply@brightmoney.co', label: 'No Reply', isDefault: true },
  { id: 2, channel: 'Email', senderId: 'support@brightmoney.co', label: 'Support', isDefault: false },
  { id: 3, channel: 'SMS', senderId: 'BRIGHT', label: 'Bright SMS', isDefault: true },
];

/* ── Download helpers ── */
function downloadCSV(filename, rows) {
  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const UNSUB_MOCK = [
  ['user_id', 'email', 'channel', 'unsubscribed_at'],
  ['USR_a1b2c3', 'arjun@example.com', 'Email', '2024-01-08'],
  ['USR_d4e5f6', 'meera@example.com', 'Email', '2024-01-10'],
  ['USR_g7h8i9', 'vijay@example.com', 'Email', '2024-01-12'],
];

const PUSH_OPTOUT_MOCK = [
  ['user_id', 'email', 'opted_out_at'],
  ['USR_b2c3d4', 'priya@example.com', '2024-01-10'],
  ['USR_j0k1l2', 'karan@example.com', '2024-01-11'],
];


/* ── Sub-components ── */

const SettingsGeneral = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToastContext();

  // Sender IDs
  const [senders, setSenders] = useState(INITIAL_SENDERS);
  const [newSender, setNewSender] = useState({ channel: 'Email', senderId: '', label: '' });
  const [addingRow, setAddingRow] = useState(false);


  useEffect(() => {
    getSettings().then(s => {
      setSettings(s);
      setLoading(false);
    });
  }, []);

  const updateCapping = (index, field, value) => {
    setSettings(prev => {
      const updated = [...prev.frequencyCapping];
      updated[index] = { ...updated[index], [field]: parseInt(value, 10) || 0 };
      return { ...prev, frequencyCapping: updated };
    });
  };

  const handleSaveCapping = async () => {
    setSaving(true);
    try {
      await updateSettings({ frequencyCapping: settings.frequencyCapping });
      showToast('Frequency capping settings saved.', 'success');
    } catch {
      showToast('Failed to save settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSender = () => {
    if (!newSender.senderId.trim() || !newSender.label.trim()) return;
    setSenders(prev => [...prev, { id: Date.now(), ...newSender, isDefault: false }]);
    setNewSender({ channel: 'Email', senderId: '', label: '' });
    setAddingRow(false);
    showToast('Sender ID added.', 'success');
  };

  const handleRemoveSender = (id) => {
    setSenders(prev => prev.filter(s => s.id !== id));
    showToast('Sender ID removed.', 'success');
  };

  const handleSetDefault = (id) => {
    setSenders(prev => prev.map(s => ({ ...s, isDefault: s.id === id ? true : (s.channel === prev.find(x => x.id === id)?.channel ? false : s.isDefault) })));
  };

  const cappingColumns = [
    { key: 'channel', label: 'Channel', render: (val) => <span style={{ fontWeight: 500 }}>{val}</span> },
    {
      key: 'maxPerDay',
      label: 'Max Per Day',
      render: (val, row) => {
        const idx = settings.frequencyCapping.findIndex(r => r.channel === row.channel);
        return (
          <input type="number" min={0} max={20} className={styles.numInput} value={val}
            onChange={e => updateCapping(idx, 'maxPerDay', e.target.value)} />
        );
      },
    },
    {
      key: 'maxPerWeek',
      label: 'Max Per Week',
      render: (val, row) => {
        const idx = settings.frequencyCapping.findIndex(r => r.channel === row.channel);
        return (
          <input type="number" min={0} max={50} className={styles.numInput} value={val}
            onChange={e => updateCapping(idx, 'maxPerWeek', e.target.value)} />
        );
      },
    },
    {
      key: 'appliesTo',
      label: 'Applies To',
      render: (val) => <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{val}</span>,
    },
  ];

  if (loading) {
    return <div style={{ position: 'relative', height: 200 }}><Spinner size="lg" centered /></div>;
  }

  return (
    <div>
      <PageHeader title="Settings" />

      {/* ── Frequency Capping ── */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionTitle}>Frequency Capping</p>
            <p className={styles.sectionDesc}>Limit how many marketing messages a user can receive per channel.</p>
          </div>
          <Button size="sm" onClick={handleSaveCapping} disabled={saving}>Save Changes</Button>
        </div>
        <div className={styles.tableCard}>
          <Table columns={cappingColumns} data={settings.frequencyCapping} />
        </div>
      </div>

      {/* ── Sender IDs ── */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionTitle}>Sender IDs</p>
            <p className={styles.sectionDesc}>Manage email addresses and SMS sender IDs used to send campaigns.</p>
          </div>
          <Button size="sm" onClick={() => setAddingRow(true)} disabled={addingRow}>+ Add Sender</Button>
        </div>

        <div className={styles.tableCard}>
          <table className={styles.senderTable}>
            <thead>
              <tr>
                <th className={styles.senderTh}>Channel</th>
                <th className={styles.senderTh}>Sender ID / Address</th>
                <th className={styles.senderTh}>Label</th>
                <th className={styles.senderTh}>Default</th>
                <th className={styles.senderTh}></th>
              </tr>
            </thead>
            <tbody>
              {senders.map(s => (
                <tr key={s.id} className={styles.senderTr}>
                  <td className={styles.senderTd}>
                    <span className={`${styles.channelPill} ${styles['channelPill_' + s.channel.toLowerCase()]}`}>{s.channel}</span>
                  </td>
                  <td className={styles.senderTd}><span className={styles.senderIdText}>{s.senderId}</span></td>
                  <td className={styles.senderTd}><span className={styles.senderLabel}>{s.label}</span></td>
                  <td className={styles.senderTd}>
                    {s.isDefault
                      ? <span className={styles.defaultBadge}>Default</span>
                      : <button className={styles.setDefaultBtn} onClick={() => handleSetDefault(s.id)}>Set default</button>
                    }
                  </td>
                  <td className={styles.senderTd}>
                    {!s.isDefault && (
                      <button className={styles.removeBtn} onClick={() => handleRemoveSender(s.id)} aria-label="Remove">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {addingRow && (
                <tr className={styles.senderTr}>
                  <td className={styles.senderTd}>
                    <select className={styles.senderSelect} value={newSender.channel}
                      onChange={e => setNewSender(p => ({ ...p, channel: e.target.value }))}>
                      <option>Email</option>
                      <option>SMS</option>
                    </select>
                  </td>
                  <td className={styles.senderTd}>
                    <input className={styles.senderInput} placeholder="e.g. alerts@brightmoney.co or BRIGHT"
                      value={newSender.senderId} onChange={e => setNewSender(p => ({ ...p, senderId: e.target.value }))} />
                  </td>
                  <td className={styles.senderTd}>
                    <input className={styles.senderInput} placeholder="Label"
                      value={newSender.label} onChange={e => setNewSender(p => ({ ...p, label: e.target.value }))} />
                  </td>
                  <td className={styles.senderTd}></td>
                  <td className={styles.senderTd}>
                    <div className={styles.addRowActions}>
                      <button className={styles.saveRowBtn} onClick={handleAddSender}>Add</button>
                      <button className={styles.cancelRowBtn} onClick={() => setAddingRow(false)}>Cancel</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Downloads ── */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionTitle}>Downloads</p>
            <p className={styles.sectionDesc}>Export user lists and activity data as CSV files.</p>
          </div>
        </div>

        <div className={styles.downloadList}>

          {/* Unsubscribe user list */}
          <div className={styles.downloadRow}>
            <div className={styles.downloadInfo}>
              <span className={styles.downloadLabel}>Unsubscribe User List</span>
              <span className={styles.downloadDesc}>All users who have unsubscribed from Email communications.</span>
            </div>
            <Button variant="secondary" size="sm" onClick={() => {
              downloadCSV('unsubscribed_users.csv', UNSUB_MOCK);
              showToast('Downloading unsubscribe list...', 'success');
            }}>
              Download CSV
            </Button>
          </div>

          {/* Push opt-out user list */}
          <div className={styles.downloadRow}>
            <div className={styles.downloadInfo}>
              <span className={styles.downloadLabel}>Push Opt-out User List</span>
              <span className={styles.downloadDesc}>All users who have opted out of Push notifications.</span>
            </div>
            <Button variant="secondary" size="sm" onClick={() => {
              downloadCSV('push_optout_users.csv', PUSH_OPTOUT_MOCK);
              showToast('Downloading push opt-out list...', 'success');
            }}>
              Download CSV
            </Button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default SettingsGeneral;
