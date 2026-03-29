import React, { useState, useMemo, useCallback } from 'react';
import styles from './Step3What.module.css';

/* ─────────────────────────────── Channel header ─────────────────────────── */

const CHANNEL_ICONS = {
  Email: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="1" y="4" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M1 7l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  Push: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="5" y="1" width="8" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <circle cx="9" cy="13" r="0.8" fill="currentColor"/>
      <path d="M7 4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  SMS: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M3 3h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7l-4 3V5a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
    </svg>
  ),
};

function ChannelHeader({ channel }) {
  return (
    <div className={styles.channelHeader}>
      <span className={styles.channelIcon}>{CHANNEL_ICONS[channel]}</span>
      <span className={styles.channelLabel}>
        Composing for <strong>{channel}</strong>
      </span>
    </div>
  );
}

/* ─────────────────────────────── Variables panel ─────────────────────────── */

function extractVariables(text) {
  if (!text) return [];
  const matches = [];
  const regex = /\{\{(\w+)\}\}/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    matches.push(match[1]);
  }
  return [...new Set(matches)];
}

function VariablesPanel({ content, triggerType, csvColumns }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState('');

  const vars = useMemo(() => extractVariables(content), [content]);
  const csvVars = csvColumns && csvColumns.length > 0 ? csvColumns : [];

  const copyVar = (v) => {
    navigator.clipboard.writeText(v).catch(() => {});
    setCopied(v);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className={styles.varsPanel}>
      <button className={styles.varsPanelToggle} onClick={() => setOpen(v => !v)}>
        <span>Variables</span>
        <span className={styles.varsBadge}>{vars.length}</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div className={styles.varsPanelBody}>
          {triggerType === 'Event-based' && (
            <p className={styles.varsNote}>Variables resolved from event payload at send time.</p>
          )}
          {triggerType === 'Manual / CSV' && csvVars.length > 0 && (
            <p className={styles.varsNote}>Available from your CSV columns: {csvVars.join(', ')}</p>
          )}
          {vars.length === 0 ? (
            <p className={styles.varsEmpty}>No <code>{'{{variables}}'}</code> detected in content yet.</p>
          ) : (
            <div className={styles.varChips}>
              {vars.map(v => (
                <button key={v} className={styles.varChip} onClick={() => copyVar(v)} title="Click to copy">
                  {v}
                  {copied === v && <span className={styles.copiedLabel}>Copied!</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────── Dynamic Variables panel (Email) ─────────────────────────── */

function DynamicVariablesPanel({ content, triggerType, csvColumns, variableMappings, onChange }) {
  const vars = useMemo(() => extractVariables(content), [content]);
  const csvVars = csvColumns && csvColumns.length > 0 ? csvColumns : [];
  const isManualCsv = triggerType === 'Manual / CSV';

  const handleMappingChange = useCallback((varName, value) => {
    const updated = { ...(variableMappings || {}), [varName]: value };
    onChange({ variableMappings: updated });
  }, [variableMappings, onChange]);

  return (
    <div className={styles.dynVarsPanel}>
      <div className={styles.dynVarsHeader}>
        <div className={styles.dynVarsTitleRow}>
          <span className={styles.dynVarsTitle}>Dynamic Variables</span>
          <span className={styles.dynVarsInfoIcon} title="Variables found in your HTML template">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3" />
              <path d="M7 6.5v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              <circle cx="7" cy="4.5" r="0.75" fill="currentColor" />
            </svg>
          </span>
        </div>
        <p className={styles.dynVarsSubtitle}>Map each variable found in your template to an event payload property</p>
      </div>
      <div className={styles.dynVarsBody}>
        {vars.length === 0 ? (
          <p className={styles.dynVarsEmpty}>No <code>{'{{variables}}'}</code> found in your template yet.</p>
        ) : (
          <div className={styles.dynVarRows}>
            {vars.map(varName => (
              <div key={varName} className={styles.dynVarRow}>
                <span className={styles.dynVarChip}>{`{{${varName}}}`}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.dynVarArrow}>
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {isManualCsv ? (
                  <select
                    className={styles.dynVarSelect}
                    value={(variableMappings || {})[varName] || ''}
                    onChange={e => handleMappingChange(varName, e.target.value)}
                  >
                    <option value="">Select CSV column...</option>
                    {csvVars.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className={styles.dynVarInput}
                    placeholder="event payload key, e.g. user.first_name"
                    value={(variableMappings || {})[varName] || ''}
                    onChange={e => handleMappingChange(varName, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────── Email ─────────────────────────── */

const SENDER_OPTIONS = [
  { value: 'bright-team', label: 'Bright Team', email: 'team@bright.com' },
  { value: 'bright-alerts', label: 'Bright Alerts', email: 'alerts@bright.com' },
  { value: 'no-reply', label: 'No Reply', email: 'noreply@bright.com' },
];

function HtmlEditor({ value, onChange }) {
  const lines = (value || '').split('\n');
  return (
    <div className={styles.htmlEditor}>
      <div className={styles.gutterNumbers}>
        {lines.map((_, i) => (
          <span key={i} className={styles.lineNum}>{i + 1}</span>
        ))}
        {lines.length === 0 && <span className={styles.lineNum}>1</span>}
      </div>
      <textarea
        className={styles.htmlTextarea}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder="Paste your HTML here..."
        spellCheck={false}
      />
    </div>
  );
}

function EmailContent({ formData, updateForm, errors }) {
  const [emailTab, setEmailTab] = useState('paste');
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileRef = React.useRef(null);

  const handleHtmlFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => updateForm({ emailBody: e.target.result });
    reader.readAsText(file);
  };

  return (
    <div>
      <div className={styles.fieldCard}>
        <label className={styles.fieldLabel}>
          From Sender <span className={styles.required}>*</span>
        </label>
        <div className={styles.senderSelect}>
          <select
            className={styles.senderSelectEl}
            value={formData.fromSender || ''}
            onChange={e => updateForm({ fromSender: e.target.value })}
          >
            <option value="">Select sender...</option>
            {SENDER_OPTIONS.map(s => (
              <option key={s.value} value={s.value}>{s.label} ({s.email})</option>
            ))}
          </select>
          {formData.fromSender && (() => {
            const s = SENDER_OPTIONS.find(o => o.value === formData.fromSender);
            if (!s) return null;
            const initials = s.label.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
            return (
              <span className={styles.senderInitials}>{initials}</span>
            );
          })()}
        </div>
      </div>

      <div className={styles.fieldCard}>
        <label className={styles.fieldLabel}>
          Subject Line <span className={styles.required}>*</span>
        </label>
        <div className={styles.inputWithCount}>
          <input
            className={`${styles.textInput} ${errors.subject ? styles.inputError : ''}`}
            type="text"
            value={formData.subject || ''}
            onChange={e => updateForm({ subject: e.target.value })}
            placeholder="e.g. Your payment is due soon"
            maxLength={80}
          />
          <span className={styles.charCountBadge}>{(formData.subject || '').length}/80</span>
        </div>
        {errors.subject && <p className={styles.errorText}>{errors.subject}</p>}
      </div>

      <div className={styles.fieldCard}>
        <div className={styles.tabBarRow}>
          <div className={styles.tabBar}>
            <button
              className={`${styles.tab} ${emailTab === 'upload' ? styles.tabActive : ''}`}
              onClick={() => setEmailTab('upload')}
            >
              Upload HTML
            </button>
            <button
              className={`${styles.tab} ${emailTab === 'paste' ? styles.tabActive : ''}`}
              onClick={() => setEmailTab('paste')}
            >
              Paste HTML
            </button>
          </div>
          <button
            className={styles.previewToggleBtn}
            onClick={() => setPreviewOpen(v => !v)}
          >
            {previewOpen ? 'Close Preview' : 'Preview'}
          </button>
        </div>

        {!previewOpen && emailTab === 'upload' && (
          <div
            className={styles.htmlDropzone}
            onClick={() => fileRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); handleHtmlFile(e.dataTransfer.files[0]); }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 8v12M10 14l6-6 6 6" stroke="var(--green-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 24h20" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p className={styles.htmlDropText}>Drop an .html file here</p>
            <p className={styles.htmlDropSub}>or click to browse</p>
            <input ref={fileRef} type="file" accept=".html" style={{ display: 'none' }} onChange={e => handleHtmlFile(e.target.files[0])} />
          </div>
        )}

        {!previewOpen && emailTab === 'paste' && (
          <HtmlEditor
            value={formData.emailBody || ''}
            onChange={val => updateForm({ emailBody: val })}
          />
        )}

        {previewOpen && (
          formData.emailBody ? (
            <iframe
              className={styles.htmlPreviewFrame}
              srcDoc={formData.emailBody}
              sandbox="allow-same-origin"
              title="HTML Preview"
            />
          ) : (
            <div className={styles.htmlPreviewEmpty}>
              Paste or upload HTML to see preview
            </div>
          )
        )}

        {errors.emailBody && <p className={styles.errorText}>{errors.emailBody}</p>}
      </div>

      <DynamicVariablesPanel
        content={formData.emailBody}
        triggerType={formData.triggerType}
        csvColumns={formData.csvColumns}
        variableMappings={formData.variableMappings || {}}
        onChange={updateForm}
      />
    </div>
  );
}

/* ─────────────────────────────── Push ─────────────────────────── */

function PushPhoneMockup({ title, body }) {
  return (
    <div className={styles.phoneMockup}>
      <div className={styles.phoneNotch} />
      <div className={styles.phoneScreen}>
        <div className={styles.pushNotif}>
          <div className={styles.pushNotifTop}>
            <div className={styles.pushAppCircle}>B</div>
            <span className={styles.pushAppLabel}>Bright</span>
            <span className={styles.pushNotifTime}>now</span>
          </div>
          <div className={styles.pushNotifTitle}>{title || 'Notification title'}</div>
          {body && <div className={styles.pushNotifBody}>{body}</div>}
        </div>
      </div>
    </div>
  );
}

function PushContent({ formData, updateForm, errors }) {
  return (
    <div className={styles.pushLayout}>
      <div className={styles.pushForm}>
        <div className={styles.fieldCard}>
          <label className={styles.fieldLabel}>
            Push Title <span className={styles.required}>*</span>
          </label>
          <div className={styles.inputWithCount}>
            <input
              className={`${styles.textInput} ${errors.pushTitle ? styles.inputError : ''}`}
              type="text"
              value={formData.pushTitle || ''}
              onChange={e => updateForm({ pushTitle: e.target.value })}
              placeholder="e.g. Payment Reminder"
              maxLength={50}
            />
            <span className={styles.charCountBadge}>{(formData.pushTitle || '').length}/50</span>
          </div>
          {errors.pushTitle && <p className={styles.errorText}>{errors.pushTitle}</p>}
        </div>

        <div className={styles.fieldCard}>
          <label className={styles.fieldLabel}>
            Message Body <span className={styles.required}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <textarea
              className={`${styles.styledTextarea} ${errors.messageBody ? styles.inputError : ''}`}
              value={formData.messageBody || ''}
              onChange={e => updateForm({ messageBody: e.target.value })}
              placeholder="Hi {{first_name}}, your payment is due soon. Tap to pay."
              maxLength={200}
              rows={4}
            />
            <span className={styles.textareaCount}>{(formData.messageBody || '').length}/200</span>
          </div>
          {errors.messageBody && <p className={styles.errorText}>{errors.messageBody}</p>}
        </div>
      </div>

      <div className={styles.pushPreviewSide}>
        <p className={styles.previewLabel}>Live Preview</p>
        <PushPhoneMockup
          title={formData.pushTitle}
          body={formData.messageBody}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────── SMS ─────────────────────────── */

function getSmsSegments(charCount) {
  if (charCount <= 160) return 1;
  return 1 + Math.ceil((charCount - 160) / 153);
}

function SmsBubble({ text }) {
  if (!text) return null;
  return (
    <div className={styles.smsBubbleWrap}>
      <div className={styles.smsBubble}>{text}</div>
    </div>
  );
}

function SmsContent({ formData, updateForm, errors }) {
  const charCount = (formData.messageBody || '').length;
  const segments = getSmsSegments(charCount);
  const isMultiSms = segments > 1;

  return (
    <div>
      <div className={styles.fieldCard}>
        <label className={styles.fieldLabel}>
          Sender ID <span className={styles.required}>*</span>
        </label>
        <div className={styles.inputWithCount}>
          <input
            className={styles.textInput}
            type="text"
            value={formData.smsSenderId || ''}
            onChange={e => updateForm({ smsSenderId: e.target.value })}
            placeholder="e.g. BRIGHT"
            maxLength={11}
          />
          <span className={styles.charCountBadge}>{(formData.smsSenderId || '').length}/11</span>
        </div>
        <p className={styles.hint}>3–11 alphanumeric characters. Subject to carrier approval.</p>
      </div>

      <div className={styles.fieldCard}>
        <label className={styles.fieldLabel}>
          Message Body <span className={styles.required}>*</span>
        </label>
        <div style={{ position: 'relative' }}>
          <textarea
            className={`${styles.styledTextarea} ${errors.messageBody ? styles.inputError : ''}`}
            value={formData.messageBody || ''}
            onChange={e => updateForm({ messageBody: e.target.value })}
            placeholder="Hi {{first_name}}, your payment of {{amount}} is due on {{due_date}}."
            maxLength={459}
            rows={5}
          />
        </div>
        <div className={styles.smsFooter}>
          {errors.messageBody && <span className={styles.errorText}>{errors.messageBody}</span>}
          <span className={`${styles.smsCounter} ${isMultiSms ? styles.smsCounterWarn : ''}`}>
            {charCount} chars · {segments} SMS
          </span>
        </div>
        {isMultiSms && (
          <p className={styles.smsSegmentNote}>
            Messages over 160 characters are sent as {segments} SMS parts.
          </p>
        )}
      </div>

      <SmsBubble text={formData.messageBody} />

      <VariablesPanel
        content={formData.messageBody}
        triggerType={formData.triggerType}
        csvColumns={formData.csvColumns}
      />
    </div>
  );
}

/* ─────────────────────────────── Main ─────────────────────────── */

const Step3What = ({ formData, updateForm, errors }) => {
  const { channel } = formData;

  if (!channel) {
    return (
      <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
        Please go back and select a channel in Step 1.
      </p>
    );
  }

  return (
    <div>
      <ChannelHeader channel={channel} />
      {channel === 'Email' && <EmailContent formData={formData} updateForm={updateForm} errors={errors} />}
      {channel === 'Push' && <PushContent formData={formData} updateForm={updateForm} errors={errors} />}
      {channel === 'SMS' && <SmsContent formData={formData} updateForm={updateForm} errors={errors} />}
    </div>
  );
};

export default Step3What;
