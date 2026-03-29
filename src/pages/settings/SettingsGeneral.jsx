import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Spinner from '../../components/ui/Spinner';
import { getSettings, updateSettings } from '../../api/settings';
import { useToastContext } from '../../context/ToastContext';
import styles from './SettingsGeneral.module.css';

function Toggle({ checked, onChange, id }) {
  return (
    <label className={styles.toggleWrap} htmlFor={id}>
      <span className={styles.toggle}>
        <input
          id={id}
          type="checkbox"
          className={styles.toggleInput}
          checked={checked}
          onChange={e => onChange(e.target.checked)}
        />
        <span className={styles.toggleTrack} />
        <span
          className={styles.toggleThumb}
          style={{ transform: checked ? 'translateX(18px)' : 'translateX(0)' }}
        />
      </span>
    </label>
  );
}

const SettingsGeneral = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToastContext();

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

  const handleSaveUnsubscribe = async () => {
    setSaving(true);
    try {
      await updateSettings({ unsubscribe: settings.unsubscribe });
      showToast('Unsubscribe settings saved.', 'success');
    } catch {
      showToast('Failed to save settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const cappingColumns = [
    { key: 'channel', label: 'Channel', render: (val) => <span style={{ fontWeight: 500 }}>{val}</span> },
    {
      key: 'maxPerDay',
      label: 'Max Per Day',
      render: (val, row) => {
        const idx = settings.frequencyCapping.findIndex(r => r.channel === row.channel);
        return (
          <input
            type="number"
            min={0}
            max={20}
            className={styles.numInput}
            value={val}
            onChange={e => updateCapping(idx, 'maxPerDay', e.target.value)}
          />
        );
      },
    },
    {
      key: 'maxPerWeek',
      label: 'Max Per Week',
      render: (val, row) => {
        const idx = settings.frequencyCapping.findIndex(r => r.channel === row.channel);
        return (
          <input
            type="number"
            min={0}
            max={50}
            className={styles.numInput}
            value={val}
            onChange={e => updateCapping(idx, 'maxPerWeek', e.target.value)}
          />
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
    return (
      <div style={{ position: 'relative', height: 200 }}>
        <Spinner size="lg" centered />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Settings" />

      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionTitle}>Frequency Capping</p>
            <p className={styles.sectionDesc}>
              Limit how many messages a user can receive per channel to avoid over-messaging.
            </p>
          </div>
          <Button size="sm" onClick={handleSaveCapping} disabled={saving}>Save Changes</Button>
        </div>
        <div className={styles.tableCard}>
          <Table columns={cappingColumns} data={settings.frequencyCapping} />
        </div>
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionTitle}>Unsubscribe Handling</p>
            <p className={styles.sectionDesc}>
              Control whether unsubscribe links are automatically appended to outgoing messages.
            </p>
          </div>
          <Button size="sm" onClick={handleSaveUnsubscribe} disabled={saving}>Save Changes</Button>
        </div>

        <div className={styles.toggleRow}>
          <div className={styles.toggleLeft}>
            <span className={styles.toggleLabel}>Email Unsubscribe Link</span>
            <span className={styles.toggleDesc}>Automatically add an unsubscribe footer to all marketing emails</span>
          </div>
          <Toggle
            id="unsub-email"
            checked={settings.unsubscribe.email}
            onChange={val => setSettings(prev => ({ ...prev, unsubscribe: { ...prev.unsubscribe, email: val } }))}
          />
        </div>

        <div className={styles.toggleRow}>
          <div className={styles.toggleLeft}>
            <span className={styles.toggleLabel}>Push Opt-out Handling</span>
            <span className={styles.toggleDesc}>Respect system-level push notification opt-outs for all campaigns</span>
          </div>
          <Toggle
            id="unsub-push"
            checked={settings.unsubscribe.push}
            onChange={val => setSettings(prev => ({ ...prev, unsubscribe: { ...prev.unsubscribe, push: val } }))}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsGeneral;
