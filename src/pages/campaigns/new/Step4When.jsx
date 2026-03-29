import React from 'react';
import styles from './Step4When.module.css';

/* ─── Icons ─── */
const IconCalendar = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="3" y="5" width="22" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M3 11h22" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M9 3v4M19 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <rect x="8" y="15" width="4" height="4" rx="1" fill="currentColor"/>
  </svg>
);

const IconRecurring = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M4 14a10 10 0 0 1 17.1-7.1L23 5M24 14a10 10 0 0 1-17.1 7.1L5 23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M20 2l3 3-3 3M8 26l-3-3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconLightning = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M11 2L4 12h6l-1 6 7-10h-6l1-6z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
  </svg>
);

const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ─── Helpers ─── */
const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const FREQUENCY_OPTIONS = ['Daily', 'Weekly', 'Monthly', 'Custom'];
const INTERVAL_UNITS = [
  { value: 'hours', label: 'hours' },
  { value: 'days', label: 'days' },
  { value: 'weeks', label: 'weeks' },
];

function formatSchedulePreview(formData) {
  const { scheduleDate, scheduleTime } = formData;
  if (!scheduleDate || !scheduleTime) return null;
  const dt = new Date(`${scheduleDate}T${scheduleTime}`);
  if (isNaN(dt)) return null;
  const opts = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
  const datePart = dt.toLocaleDateString('en-IN', opts);
  const timePart = dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase();
  return `Will send on ${datePart} at ${timePart} IST`;
}

function formatRecurringPreview(formData) {
  const { recurringFrequency, scheduleTime, recurringEndDate, recurringDays, recurringMonthDay, recurringIntervalValue, recurringIntervalUnit } = formData;
  if (!recurringFrequency) return null;

  let freq = '';
  if (recurringFrequency === 'Daily') freq = 'every day';
  else if (recurringFrequency === 'Weekly') {
    const days = (recurringDays || []).join(', ');
    freq = `every week${days ? ` on ${days}` : ''}`;
  } else if (recurringFrequency === 'Monthly') {
    freq = `every month${recurringMonthDay ? ` on the ${recurringMonthDay}${getOrdinalSuffix(recurringMonthDay)}` : ''}`;
  } else if (recurringFrequency === 'Custom') {
    freq = `every ${recurringIntervalValue || '?'} ${recurringIntervalUnit || 'days'}`;
  }

  const timePart = scheduleTime ? ` at ${scheduleTime} IST` : '';
  const endPart = recurringEndDate ? `, ending on ${formatEndDate(recurringEndDate)}` : '';
  return `This campaign will send ${freq}${timePart}${endPart}.`;
}

function getOrdinalSuffix(n) {
  const num = parseInt(n, 10);
  if (num >= 11 && num <= 13) return 'th';
  switch (num % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

function formatEndDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

/* ─── One-time section ─── */
function OnetimeSection({ formData, updateForm }) {
  const preview = formatSchedulePreview(formData);

  return (
    <div className={styles.subSection}>
      <div className={styles.subCardRow}>
        <label className={`${styles.subCard} ${formData.sendType === 'now' ? styles.subCardActive : ''}`}>
          <input
            type="radio"
            name="sendType"
            value="now"
            checked={formData.sendType === 'now'}
            onChange={() => updateForm({ sendType: 'now' })}
            className={styles.hiddenRadio}
          />
          <span className={styles.subCardIcon}><IconLightning /></span>
          <span className={styles.subCardTitle}>Send Now</span>
          <span className={styles.subCardDesc}>Trigger immediately when activated</span>
        </label>

        <label className={`${styles.subCard} ${formData.sendType === 'later' ? styles.subCardActive : ''}`}>
          <input
            type="radio"
            name="sendType"
            value="later"
            checked={formData.sendType === 'later'}
            onChange={() => updateForm({ sendType: 'later' })}
            className={styles.hiddenRadio}
          />
          <span className={styles.subCardIcon}><IconClock /></span>
          <span className={styles.subCardTitle}>Schedule for Later</span>
          <span className={styles.subCardDesc}>Choose a specific date and time</span>
        </label>
      </div>

      {formData.sendType === 'later' && (
        <div className={styles.scheduleInputs}>
          <div className={styles.dateTimeRow}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Date</label>
              <input
                type="date"
                className={styles.nativeInput}
                value={formData.scheduleDate || ''}
                onChange={e => updateForm({ scheduleDate: e.target.value })}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Time</label>
              <input
                type="time"
                className={styles.nativeInput}
                value={formData.scheduleTime || ''}
                onChange={e => updateForm({ scheduleTime: e.target.value })}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Timezone</label>
              <div className={styles.readonlyField}>Asia/Kolkata (IST)</div>
            </div>
          </div>
          {preview && (
            <div className={styles.summaryCallout}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="7" cy="7" r="6" stroke="var(--green-dark)" strokeWidth="1.3"/>
                <path d="M7 6v4M7 4.5v.5" stroke="var(--green-dark)" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              {preview}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Recurring section ─── */
function RecurringSection({ formData, updateForm }) {
  const freq = formData.recurringFrequency || '';
  const days = formData.recurringDays || [];
  const preview = formatRecurringPreview(formData);

  const toggleDay = (day) => {
    const next = days.includes(day) ? days.filter(d => d !== day) : [...days, day];
    updateForm({ recurringDays: next });
  };

  return (
    <div className={styles.subSection}>
      <div className={styles.inputGroup} style={{ marginBottom: 16 }}>
        <label className={styles.inputLabel}>Frequency</label>
        <div className={styles.freqPills}>
          {FREQUENCY_OPTIONS.map(opt => (
            <button
              key={opt}
              className={`${styles.freqPill} ${freq === opt ? styles.freqPillActive : ''}`}
              onClick={() => updateForm({ recurringFrequency: opt })}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {freq === 'Weekly' && (
        <div className={styles.inputGroup} style={{ marginBottom: 16 }}>
          <label className={styles.inputLabel}>Day(s) of week</label>
          <div className={styles.dayPills}>
            {DAYS_OF_WEEK.map(day => (
              <button
                key={day}
                className={`${styles.dayPill} ${days.includes(day) ? styles.dayPillActive : ''}`}
                onClick={() => toggleDay(day)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}

      {freq === 'Monthly' && (
        <div className={styles.inputGroup} style={{ marginBottom: 16 }}>
          <label className={styles.inputLabel}>Day of month</label>
          <select
            className={styles.nativeSelect}
            value={formData.recurringMonthDay || ''}
            onChange={e => updateForm({ recurringMonthDay: e.target.value })}
          >
            <option value="">Select day...</option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      )}

      {freq === 'Custom' && (
        <div className={styles.inputGroup} style={{ marginBottom: 16 }}>
          <label className={styles.inputLabel}>Interval</label>
          <div className={styles.customIntervalRow}>
            <input
              type="number"
              className={styles.nativeInput}
              style={{ width: 80 }}
              value={formData.recurringIntervalValue || ''}
              onChange={e => updateForm({ recurringIntervalValue: e.target.value })}
              placeholder="e.g. 3"
              min={1}
            />
            <select
              className={styles.nativeSelect}
              value={formData.recurringIntervalUnit || 'days'}
              onChange={e => updateForm({ recurringIntervalUnit: e.target.value })}
            >
              {INTERVAL_UNITS.map(u => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className={styles.dateTimeRow}>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Send time</label>
          <input
            type="time"
            className={styles.nativeInput}
            value={formData.scheduleTime || ''}
            onChange={e => updateForm({ scheduleTime: e.target.value })}
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Timezone</label>
          <div className={styles.readonlyField}>Asia/Kolkata (IST)</div>
        </div>
      </div>

      <div className={styles.inputGroup} style={{ marginTop: 16 }}>
        <label className={styles.inputLabel}>End date (optional)</label>
        <input
          type="date"
          className={styles.nativeInput}
          style={{ maxWidth: 200 }}
          value={formData.recurringEndDate || ''}
          onChange={e => updateForm({ recurringEndDate: e.target.value })}
        />
        {formData.recurringEndDate && (
          <p className={styles.endDateNote}>Campaign will run until {formatEndDate(formData.recurringEndDate)}</p>
        )}
      </div>

      <div className={styles.inputGroup} style={{ marginTop: 16 }}>
        <label className={styles.inputLabel}>Goal event (optional)</label>
        <input
          type="text"
          className={styles.nativeInput}
          placeholder="e.g. loan_repaid"
          value={formData.goalEvent || ''}
          onChange={e => updateForm({ goalEvent: e.target.value })}
        />
        <p className={styles.hint}>Stop sending once user completes this event.</p>
      </div>

      {preview && (
        <div className={styles.summaryCallout} style={{ marginTop: 20 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="7" cy="7" r="6" stroke="var(--green-dark)" strokeWidth="1.3"/>
            <path d="M7 6v4M7 4.5v.5" stroke="var(--green-dark)" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          {preview}
        </div>
      )}
    </div>
  );
}

/* ─── Main ─── */
const Step4When = ({ formData, updateForm, errors }) => {
  const scheduleType = formData.scheduleType || '';

  return (
    <div>
      <div className={styles.mainCardRow}>
        <label className={`${styles.mainCard} ${scheduleType === 'One-time' ? styles.mainCardActive : ''}`}>
          <input
            type="radio"
            name="scheduleType"
            value="One-time"
            checked={scheduleType === 'One-time'}
            onChange={() => updateForm({ scheduleType: 'One-time', sendType: '', scheduleDate: '', scheduleTime: '' })}
            className={styles.hiddenRadio}
          />
          {scheduleType === 'One-time' && (
            <span className={styles.mainCardCheck}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          )}
          <span className={styles.mainCardIcon}><IconCalendar /></span>
          <span className={styles.mainCardTitle}>One-time</span>
          <span className={styles.mainCardSubtitle}>Send this campaign once</span>
        </label>

        <label className={`${styles.mainCard} ${scheduleType === 'Recurring' ? styles.mainCardActive : ''}`}>
          <input
            type="radio"
            name="scheduleType"
            value="Recurring"
            checked={scheduleType === 'Recurring'}
            onChange={() => updateForm({ scheduleType: 'Recurring', sendType: '', scheduleDate: '', scheduleTime: '' })}
            className={styles.hiddenRadio}
          />
          {scheduleType === 'Recurring' && (
            <span className={styles.mainCardCheck}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          )}
          <span className={styles.mainCardIcon}><IconRecurring /></span>
          <span className={styles.mainCardTitle}>Recurring</span>
          <span className={styles.mainCardSubtitle}>Send on a repeating schedule</span>
        </label>
      </div>

      {errors.scheduleType && <p className={styles.errorText}>{errors.scheduleType}</p>}

      {scheduleType === 'One-time' && (
        <OnetimeSection formData={formData} updateForm={updateForm} />
      )}

      {scheduleType === 'Recurring' && (
        <RecurringSection formData={formData} updateForm={updateForm} />
      )}
    </div>
  );
};

export default Step4When;
