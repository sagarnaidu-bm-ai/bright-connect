import React, { useRef } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import styles from './Step2Audience.module.css';

const SCHEDULE_OPTIONS = [
  { value: 'One-time', label: 'One-time', desc: 'Send once at a specific date and time' },
  { value: 'Recurring', label: 'Recurring', desc: 'Send on a repeating schedule' },
  { value: 'Weekly', label: 'Weekly', desc: 'Send every week on selected days' },
];

const RECURRENCE_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const Step2Audience = ({ formData, updateForm, errors }) => {
  const fileRef = useRef(null);
  const { triggerType } = formData;

  if (triggerType === 'Event-based') {
    return (
      <div>
        <div className={styles.section}>
          <Input
            label="Event Name"
            value={formData.eventName}
            onChange={e => updateForm({ eventName: e.target.value })}
            placeholder="e.g. payment_due, signup_completed"
            error={errors.eventName}
          />
          <p className={styles.hint}>Enter the exact event name as sent by your backend. This campaign will trigger whenever this event fires.</p>
        </div>
      </div>
    );
  }

  if (triggerType === 'Time-based') {
    return (
      <div>
        <div className={styles.section}>
          <span className={styles.sectionLabel}>Schedule Type</span>
          <div className={styles.scheduleOptions}>
            {SCHEDULE_OPTIONS.map(opt => (
              <label
                key={opt.value}
                className={`${styles.scheduleCard} ${formData.scheduleType === opt.value ? styles.scheduleCardActive : ''}`}
              >
                <input
                  type="radio"
                  name="scheduleType"
                  value={opt.value}
                  checked={formData.scheduleType === opt.value}
                  onChange={() => updateForm({ scheduleType: opt.value })}
                  className={styles.radioInput}
                />
                <div>
                  <p className={styles.scheduleCardTitle}>{opt.label}</p>
                  <p className={styles.scheduleCardDesc}>{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
          {errors.scheduleType && <p className={styles.errorText}>{errors.scheduleType}</p>}
        </div>

        {formData.scheduleType && (
          <div className={styles.section}>
            <div className={styles.row}>
              <Input
                label="Send Date & Time"
                type="datetime-local"
                value={formData.sendDateTime}
                onChange={e => updateForm({ sendDateTime: e.target.value })}
                error={errors.sendDateTime}
              />
              {(formData.scheduleType === 'Recurring' || formData.scheduleType === 'Weekly') && (
                <Select
                  label="Recurrence"
                  value={formData.recurrence || ''}
                  onChange={e => updateForm({ recurrence: e.target.value })}
                  options={RECURRENCE_OPTIONS}
                  placeholder="Select frequency"
                />
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (triggerType === 'Manual / CSV') {
    return (
      <div>
        <div className={styles.section}>
          <span className={styles.sectionLabel}>Upload Audience CSV</span>
          <div
            className={styles.uploadBox}
            onClick={() => fileRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) updateForm({ csvFile: file });
            }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="var(--bg-card)" />
              <path d="M16 10v12M10 16l6-6 6 6" stroke="var(--green-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={styles.uploadLabel}>
              {formData.csvFile ? formData.csvFile.name : 'Click to upload or drag and drop'}
            </span>
            <span className={styles.uploadSub}>CSV files up to 50MB</span>
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className={styles.fileInput}
              onChange={e => {
                const file = e.target.files[0];
                if (file) updateForm({ csvFile: file });
              }}
            />
          </div>
          <p className={styles.hint}>Your CSV should include columns for user identifier (email/phone/device ID) and any personalization fields.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
        Please complete Step 1 by selecting a trigger type.
      </p>
    </div>
  );
};

export default Step2Audience;
