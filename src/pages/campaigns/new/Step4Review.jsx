import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import { sendTestMessage } from '../../../api/campaigns';
import { useToastContext } from '../../../context/ToastContext';
import styles from './Step4Review.module.css';

function ReviewItem({ label, value, empty = '--' }) {
  return (
    <div className={styles.item}>
      <span className={styles.itemLabel}>{label}</span>
      <span className={`${styles.itemValue} ${!value ? styles.itemEmpty : ''}`}>
        {value || empty}
      </span>
    </div>
  );
}

const CheckItem = ({ done, text }) => (
  <div className={styles.checkItem}>
    <span className={styles.checkIcon}>
      {done ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" fill="var(--green-primary)" />
          <path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="var(--border-strong)" strokeWidth="1.5" fill="none" />
        </svg>
      )}
    </span>
    <span style={{ color: done ? 'var(--text-body)' : 'var(--text-muted)' }}>{text}</span>
  </div>
);

const Step4Review = ({ formData }) => {
  const [testTarget, setTestTarget] = useState('');
  const [sending, setSending] = useState(false);
  const { showToast } = useToastContext();

  const handleSendTest = async () => {
    if (!testTarget.trim()) {
      showToast('Please enter a test recipient.', 'error');
      return;
    }
    setSending(true);
    try {
      await sendTestMessage('preview', testTarget);
      showToast(`Test message sent to ${testTarget}!`, 'success');
      setTestTarget('');
    } catch {
      showToast('Failed to send test message.', 'error');
    } finally {
      setSending(false);
    }
  };

  const hasName = !!formData.name.trim();
  const hasChannel = !!formData.channel;
  const hasContent = !!(formData.subject || formData.messageBody || formData.pushTitle);
  const hasAudience = !!(formData.triggerType);

  const testPlaceholder = formData.channel === 'Email'
    ? 'test@example.com'
    : formData.channel === 'SMS'
    ? '+91 98765 43210'
    : 'Device token or user ID';

  return (
    <div>
      <div className={styles.checklist}>
        <CheckItem done={hasName} text="Campaign name set" />
        <CheckItem done={hasChannel} text="Channel & type selected" />
        <CheckItem done={hasAudience} text="Audience & trigger configured" />
        <CheckItem done={hasContent} text="Content written" />
      </div>

      <div className={styles.grid}>
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Campaign Setup</p>
          <ReviewItem label="Name" value={formData.name} />
          <ReviewItem label="Type" value={formData.type} />
          <ReviewItem label="Channel" value={formData.channel} />
          <ReviewItem label="Trigger" value={formData.triggerType} />
        </div>

        <div className={styles.section}>
          <p className={styles.sectionTitle}>Audience</p>
          {formData.triggerType === 'Event-based' && (
            <ReviewItem label="Event Name" value={formData.eventName} />
          )}
          {formData.triggerType === 'Time-based' && (
            <>
              <ReviewItem label="Schedule Type" value={formData.scheduleType} />
              <ReviewItem label="Send Date/Time" value={formData.sendDateTime} />
            </>
          )}
          {formData.triggerType === 'Manual / CSV' && (
            <ReviewItem label="CSV File" value={formData.csvFile?.name} />
          )}
          {!formData.triggerType && (
            <ReviewItem label="Trigger type" value="" />
          )}
        </div>

        {formData.channel === 'Email' && (
          <>
            <div className={styles.section}>
              <p className={styles.sectionTitle}>Email Details</p>
              <ReviewItem label="From" value={formData.fromSender} />
              <ReviewItem label="Subject" value={formData.subject} />
              <ReviewItem label="Preview Text" value={formData.previewText} />
            </div>
            <div className={`${styles.section} ${styles.previewSection}`}>
              <p className={styles.sectionTitle}>Email Body Preview</p>
              <div className={styles.contentPreview}>
                {formData.emailBody || <span style={{ color: 'var(--text-disabled)' }}>No content written yet</span>}
              </div>
            </div>
          </>
        )}

        {formData.channel === 'SMS' && (
          <div className={`${styles.section} ${styles.previewSection}`}>
            <p className={styles.sectionTitle}>SMS Message</p>
            <ReviewItem label="Sender ID" value={formData.smsSenderId} />
            <div className={styles.contentPreview} style={{ marginTop: 8 }}>
              {formData.messageBody || <span style={{ color: 'var(--text-disabled)' }}>No message written yet</span>}
            </div>
          </div>
        )}

        {formData.channel === 'Push' && (
          <div className={`${styles.section} ${styles.previewSection}`}>
            <p className={styles.sectionTitle}>Push Notification</p>
            <ReviewItem label="Title" value={formData.pushTitle} />
            <ReviewItem label="Body" value={formData.messageBody} />
            <ReviewItem label="Deep Link" value={formData.deepLink} />
          </div>
        )}
      </div>

      <div className={styles.testCard}>
        <div className={styles.testCardLeft}>
          <p className={styles.testCardTitle}>Send a Test Message</p>
          <p className={styles.testCardDesc}>
            Verify your content before going live. Enter a recipient to send a preview.
          </p>
        </div>
        <div className={styles.testRow}>
          <input
            type="text"
            className={styles.testInput}
            value={testTarget}
            onChange={e => setTestTarget(e.target.value)}
            placeholder={testPlaceholder}
          />
          <Button variant="secondary" size="sm" onClick={handleSendTest} disabled={sending}>
            {sending ? 'Sending...' : 'Send Test'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step4Review;
