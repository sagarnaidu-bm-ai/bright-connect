import React from 'react';
import Input from '../../../components/ui/Input';
import styles from './Step3Content.module.css';

const EmailContent = ({ formData, updateForm, errors }) => (
  <div>
    <div className={styles.row}>
      <Input
        label="From Sender Name"
        value={formData.fromSender}
        onChange={e => updateForm({ fromSender: e.target.value })}
        placeholder="e.g. Bright Team"
      />
      <Input
        label="Reply-To Email"
        type="email"
        value={formData.replyTo || ''}
        onChange={e => updateForm({ replyTo: e.target.value })}
        placeholder="noreply@bright.com"
      />
    </div>
    <div className={styles.section}>
      <Input
        label="Subject Line"
        value={formData.subject}
        onChange={e => updateForm({ subject: e.target.value })}
        placeholder="e.g. Your payment is due soon"
        maxLength={80}
        showCount
        error={errors.subject}
      />
    </div>
    <div className={styles.section}>
      <Input
        label="Preview Text"
        value={formData.previewText || ''}
        onChange={e => updateForm({ previewText: e.target.value })}
        placeholder="Short preview shown in inbox..."
        maxLength={120}
        showCount
      />
    </div>
    <div className={styles.section}>
      <label className={styles.label}>Email Body</label>
      <textarea
        className={`${styles.textarea} ${errors.emailBody ? styles.error : ''}`}
        value={formData.emailBody}
        onChange={e => updateForm({ emailBody: e.target.value })}
        placeholder="Write your email content here. Use {{first_name}}, {{amount}}, etc. for personalization..."
        rows={8}
      />
      <div className={styles.textareaFooter}>
        {errors.emailBody && <span className={styles.errorText}>{errors.emailBody}</span>}
      </div>
      <p className={styles.hint}>
        Personalization tokens: <code>{'{{first_name}}'}</code>, <code>{'{{amount}}'}</code>, <code>{'{{due_date}}'}</code>
      </p>
    </div>
  </div>
);

const SMSContent = ({ formData, updateForm, errors }) => (
  <div>
    <div className={styles.section}>
      <Input
        label="SMS Sender ID"
        value={formData.smsSenderId}
        onChange={e => updateForm({ smsSenderId: e.target.value })}
        placeholder="e.g. BRIGHT"
        maxLength={11}
      />
      <p className={styles.hint}>Sender ID must be 3–11 alphanumeric characters. Subject to carrier approval.</p>
    </div>
    <div className={styles.section}>
      <label className={styles.label}>Message Body</label>
      <textarea
        className={`${styles.textarea} ${errors.messageBody ? styles.error : ''}`}
        value={formData.messageBody}
        onChange={e => updateForm({ messageBody: e.target.value })}
        placeholder="Hi {{first_name}}, your payment of {{amount}} is due on {{due_date}}. Pay now: {{link}}"
        maxLength={320}
        rows={5}
      />
      <div className={styles.textareaFooter}>
        {errors.messageBody && <span className={styles.errorText}>{errors.messageBody}</span>}
        <span className={styles.charCount}>{(formData.messageBody || '').length}/320</span>
      </div>
      <p className={styles.hint}>Standard SMS is 160 characters. Messages over 160 chars are split into multiple SMS.</p>
    </div>
    {formData.messageBody && (
      <div className={styles.section}>
        <span className={styles.previewLabel}>Preview</span>
        <div className={styles.previewBox}>{formData.messageBody}</div>
      </div>
    )}
  </div>
);

const PushContent = ({ formData, updateForm, errors }) => (
  <div>
    <div className={styles.section}>
      <Input
        label="Notification Title"
        value={formData.pushTitle}
        onChange={e => updateForm({ pushTitle: e.target.value })}
        placeholder="e.g. Payment Reminder"
        maxLength={65}
        showCount
        error={errors.pushTitle}
      />
    </div>
    <div className={styles.section}>
      <label className={styles.label}>Notification Body</label>
      <textarea
        className={styles.textarea}
        value={formData.messageBody}
        onChange={e => updateForm({ messageBody: e.target.value })}
        placeholder="Hi {{first_name}}, your payment of {{amount}} is due soon. Tap to pay."
        maxLength={200}
        rows={4}
      />
      <div className={styles.textareaFooter}>
        <span className={styles.charCount}>{(formData.messageBody || '').length}/200</span>
      </div>
    </div>
    <div className={styles.section}>
      <Input
        label="Deep Link URL (optional)"
        value={formData.deepLink || ''}
        onChange={e => updateForm({ deepLink: e.target.value })}
        placeholder="bright://payments or https://..."
      />
    </div>
    {(formData.pushTitle || formData.messageBody) && (
      <div className={styles.section}>
        <span className={styles.previewLabel}>Push Preview</span>
        <div className={styles.pushMock}>
          <div className={styles.pushAppName}>Bright App</div>
          <div className={styles.pushTitle}>{formData.pushTitle || 'Notification Title'}</div>
          {formData.messageBody && (
            <div className={styles.pushBody}>{formData.messageBody}</div>
          )}
        </div>
      </div>
    )}
  </div>
);

const Step3Content = ({ formData, updateForm, errors }) => {
  const { channel } = formData;

  if (channel === 'Email') return <EmailContent formData={formData} updateForm={updateForm} errors={errors} />;
  if (channel === 'SMS') return <SMSContent formData={formData} updateForm={updateForm} errors={errors} />;
  if (channel === 'Push') return <PushContent formData={formData} updateForm={updateForm} errors={errors} />;

  return (
    <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
      Please go back and select a channel in Step 1.
    </p>
  );
};

export default Step3Content;
