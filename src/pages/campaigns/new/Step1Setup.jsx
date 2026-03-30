import React from 'react';
import Input from '../../../components/ui/Input';
import { CAMPAIGN_TYPES, CHANNEL_TYPES, TRIGGER_TYPES } from '../../../utils/constants';
import styles from './Step1Setup.module.css';

const CHANNEL_META = {
  Email: {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="5" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M2 8l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    desc: 'Deliver rich HTML messages to your users\' inboxes',
  },
  Push: {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="6" y="2" width="10" height="17" rx="2.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <circle cx="11" cy="16" r="1" fill="currentColor"/>
        <path d="M9 5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    desc: 'Send real-time notifications to mobile and web apps',
  },
  SMS: {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M4 4h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8l-4 3V6a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
        <path d="M8 10h6M8 13h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    desc: 'Send text messages directly to users\' phones',
    note: 'Available for Transactional campaigns only',
  },
};

const CAMPAIGN_TYPE_META = {
  Transactional: {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 3v4M11 15v4M4.22 4.22l2.83 2.83M14.95 14.95l2.83 2.83M3 11h4M15 11h4M4.22 17.78l2.83-2.83M14.95 7.05l2.83-2.83" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    desc: 'Time-sensitive messages triggered by user actions',
  },
  Marketing: {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M3 8.5L11 3l8 5.5V19H3V8.5z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
        <path d="M8 19v-6h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    desc: 'Promotional campaigns to engage your user base',
  },
};

const TRIGGER_META = {
  'Event-based': {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M13 3L5 13h6l-2 6 8-10h-6l2-6z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      </svg>
    ),
    desc: 'Fires automatically when a specific event occurs in your system',
  },
  'Manual / CSV': {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M13 3H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9l-5-6z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
        <path d="M13 3v6h6M8 13h6M8 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    desc: 'Upload a list of users via CSV for a one-off send',
  },
};

function EnhancedRadioCardGroup({ label, options, value, onChange, error, name, metaMap, required, extras, threeCol, disabledOptions = [] }) {
  return (
    <div className={styles.section}>
      <span className={styles.sectionLabel}>
        {label}
        {required && <span className={styles.requiredAsterisk}>*</span>}
      </span>
      <div className={threeCol ? styles.radioGridThree : styles.radioGrid}>
        {options.map(opt => {
          const meta = metaMap?.[opt] || {};
          const isActive = value === opt;
          const isDisabled = disabledOptions.includes(opt);
          return (
            <label
              key={opt}
              className={`${styles.radioCard} ${isActive ? styles.radioCardActive : ''} ${isDisabled ? styles.radioCardDisabled : ''}`}
              title={isDisabled ? meta.disabledNote || `Not available` : undefined}
            >
              <input
                type="radio"
                name={name}
                value={opt}
                checked={isActive}
                onChange={() => !isDisabled && onChange(opt)}
                className={styles.radioInput}
                disabled={isDisabled}
              />
              {isActive && !isDisabled && (
                <span className={styles.radioCheckmark}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              )}
              {meta.icon && (
                <span className={`${styles.radioIcon} ${isActive && !isDisabled ? styles.radioIconActive : ''}`}>
                  {meta.icon}
                </span>
              )}
              <span className={styles.radioTitle}>{opt}</span>
              {meta.desc && <span className={styles.radioDesc}>{meta.desc}</span>}
              {isDisabled
                ? <span className={styles.radioDisabledNote}>Not available for Marketing campaigns</span>
                : meta.note && <span className={styles.radioNote}>{meta.note}</span>
              }
              {!isDisabled && extras?.[opt]}
            </label>
          );
        })}
      </div>
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}

const Step1Setup = ({ formData, updateForm, errors }) => {
  const handleTypeChange = (val) => {
    const updates = { type: val };
    if (val === 'Marketing' && formData.channel === 'SMS') {
      updates.channel = '';
    }
    updateForm(updates);
  };

  return (
    <div>
      <div className={styles.fieldCard}>
        <Input
          label="Campaign Name"
          value={formData.name}
          onChange={e => updateForm({ name: e.target.value })}
          placeholder="e.g. Welcome Email Series"
          maxLength={80}
          showCount
          error={errors.name}
        />
      </div>

      <div className={styles.fieldCard}>
        <EnhancedRadioCardGroup
          label="Campaign Type"
          name="type"
          options={CAMPAIGN_TYPES}
          value={formData.type}
          onChange={handleTypeChange}
          error={errors.type}
          metaMap={CAMPAIGN_TYPE_META}
          required
        />
      </div>

      <div className={styles.fieldCard}>
        <EnhancedRadioCardGroup
          label="Channel"
          name="channel"
          options={CHANNEL_TYPES}
          value={formData.channel}
          onChange={val => updateForm({ channel: val })}
          error={errors.channel}
          metaMap={CHANNEL_META}
          required
          threeCol
          disabledOptions={formData.type === 'Marketing' ? ['SMS'] : []}
        />
      </div>

      <div className={styles.fieldCard}>
        <EnhancedRadioCardGroup
          label="Trigger Type"
          name="triggerType"
          options={TRIGGER_TYPES}
          value={formData.triggerType}
          onChange={val => updateForm({ triggerType: val })}
          error={errors.triggerType}
          metaMap={TRIGGER_META}
          required
        />
      </div>
    </div>
  );
};

export default Step1Setup;
