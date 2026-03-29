import React, { useRef, useState } from 'react';
import styles from './Step2Who.module.css';

/* ─────────────────────────────── Event-based ─────────────────────────── */

const OPERATORS = [
  { value: 'equals', label: 'equals' },
  { value: 'not_equals', label: 'not equals' },
  { value: 'contains', label: 'contains' },
  { value: 'greater_than', label: 'greater than' },
  { value: 'less_than', label: 'less than' },
];

function FilterRow({ row, index, onChange, onRemove }) {
  return (
    <div className={styles.filterRow}>
      <input
        className={styles.filterInput}
        type="text"
        placeholder="property"
        value={row.property}
        onChange={e => onChange(index, 'property', e.target.value)}
      />
      <select
        className={styles.filterSelect}
        value={row.operator}
        onChange={e => onChange(index, 'operator', e.target.value)}
      >
        {OPERATORS.map(op => (
          <option key={op.value} value={op.value}>{op.label}</option>
        ))}
      </select>
      <input
        className={styles.filterInput}
        type="text"
        placeholder="value"
        value={row.value}
        onChange={e => onChange(index, 'value', e.target.value)}
      />
      <button className={styles.removeBtn} onClick={() => onRemove(index)} title="Remove condition">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}

function EventChips({ value, onChange }) {
  const [inputVal, setInputVal] = useState('');

  const addChip = (text) => {
    const trimmed = text.trim().replace(/,+$/, '');
    if (!trimmed) return;
    const existing = value ? value.split(',').map(s => s.trim()).filter(Boolean) : [];
    if (!existing.includes(trimmed)) {
      onChange([...existing, trimmed].join(', '));
    }
    setInputVal('');
  };

  const removeChip = (chip) => {
    const existing = value.split(',').map(s => s.trim()).filter(Boolean);
    onChange(existing.filter(c => c !== chip).join(', '));
  };

  const chips = value ? value.split(',').map(s => s.trim()).filter(Boolean) : [];

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addChip(inputVal);
    } else if (e.key === 'Backspace' && !inputVal && chips.length > 0) {
      removeChip(chips[chips.length - 1]);
    }
  };

  return (
    <div className={styles.chipsBox}>
      {chips.map(chip => (
        <span key={chip} className={styles.chip}>
          {chip}
          <button className={styles.chipRemove} onClick={() => removeChip(chip)} title="Remove">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </span>
      ))}
      <input
        className={styles.chipInput}
        type="text"
        placeholder={chips.length === 0 ? 'e.g. payment_due, loan_approved' : 'add more...'}
        value={inputVal}
        onChange={e => setInputVal(e.target.value)}
        onKeyDown={handleKey}
        onBlur={() => addChip(inputVal)}
      />
    </div>
  );
}

function EventBasedWho({ formData, updateForm, errors }) {
  const [filters, setFilters] = useState(formData.eventFilters || []);

  const syncFilters = (updated) => {
    setFilters(updated);
    updateForm({ eventFilters: updated });
  };

  const addFilter = () => {
    syncFilters([...filters, { property: '', operator: 'equals', value: '' }]);
  };

  const updateFilter = (index, field, val) => {
    const updated = filters.map((f, i) => i === index ? { ...f, [field]: val } : f);
    syncFilters(updated);
  };

  const removeFilter = (index) => {
    syncFilters(filters.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Event Configuration</h3>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>
            Event Name(s) <span className={styles.required}>*</span>
          </label>
          <EventChips
            value={formData.eventName || ''}
            onChange={val => updateForm({ eventName: val })}
          />
          <p className={styles.hint}>Press Enter or comma to add each event name. Campaign fires on any matching event.</p>
          {errors.eventName && <p className={styles.errorText}>{errors.eventName}</p>}
        </div>

        <div className={styles.fieldGroup}>
          <div className={styles.filterHeader}>
            <label className={styles.fieldLabel}>Event Filters</label>
            <button className={styles.addConditionBtn} onClick={addFilter}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Add condition
            </button>
          </div>
          {filters.length === 0 && (
            <p className={styles.emptyFilters}>No conditions added. Campaign will fire on all matching events.</p>
          )}
          {filters.map((row, i) => (
            <FilterRow key={i} row={row} index={i} onChange={updateFilter} onRemove={removeFilter} />
          ))}
        </div>

        <div className={styles.infoBanner}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="8" cy="8" r="6.5" stroke="var(--green-dark)" strokeWidth="1.5"/>
            <path d="M8 7v4M8 5.5v.5" stroke="var(--green-dark)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span>Event names must exactly match what the Bright backend sends in the event payload.</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────── Manual / CSV ─────────────────────────── */

const COLUMN_OPTIONS = [
  { value: '', label: 'Select mapping...' },
  { value: 'first_name', label: 'First Name' },
  { value: 'last_name', label: 'Last Name' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'user_id', label: 'User ID' },
  { value: '__ignore__', label: 'Ignore this column' },
];

function parseCSVHeaders(text) {
  const firstLine = text.split('\n')[0] || '';
  return firstLine.split(',').map(h => h.trim().replace(/^"|"$/g, ''));
}

function countCSVRows(text) {
  const lines = text.split('\n').filter(l => l.trim());
  return Math.max(0, lines.length - 1); // exclude header
}

function ColumnMapper({ headers, mapping, onChange, error }) {
  return (
    <div className={styles.columnMapper}>
      <h4 className={styles.mapperTitle}>Map your columns</h4>
      <p className={styles.mapperSubtitle}>Tell us what each column in your CSV represents</p>
      {headers.map(header => (
        <div key={header} className={styles.mapRow}>
          <span className={styles.csvPill}>{header}</span>
          <span className={styles.mapArrow}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 8h8M9 5l3 3-3 3" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <select
            className={styles.mapSelect}
            value={mapping[header] || ''}
            onChange={e => onChange({ ...mapping, [header]: e.target.value })}
          >
            {COLUMN_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      ))}
      {error && <p className={styles.errorText} style={{ marginTop: 12 }}>{error}</p>}
    </div>
  );
}

function ManualCSVWho({ formData, updateForm, errors }) {
  const fileRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [csvInfo, setCsvInfo] = useState(null);

  const processFile = (file) => {
    if (!file || !file.name.endsWith('.csv')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const headers = parseCSVHeaders(text);
      const rowCount = countCSVRows(text);
      setCsvInfo({ name: file.name, rowCount, headers });
      updateForm({ csvFile: file, csvColumns: headers, columnMapping: {} });
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Upload Audience</h3>

        {!csvInfo ? (
          <div
            className={`${styles.dropzone} ${dragOver ? styles.dropzoneActive : ''}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => {
              e.preventDefault();
              setDragOver(false);
              processFile(e.dataTransfer.files[0]);
            }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className={styles.dropIcon}>
              <rect width="40" height="40" rx="10" fill="var(--bg-card)"/>
              <path d="M20 12v12M14 18l6-6 6 6" stroke="var(--green-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13 28h14" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p className={styles.dropTitle}>Drop your CSV file here</p>
            <p className={styles.dropSub}>or click to browse</p>
            <p className={styles.dropCaption}>Accepts .csv files only</p>
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className={styles.fileInput}
              onChange={e => processFile(e.target.files[0])}
            />
          </div>
        ) : (
          <div className={styles.fileCard}>
            <div className={styles.fileCardIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6z" stroke="var(--green-primary)" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
                <path d="M14 3v6h6" stroke="var(--green-primary)" strokeWidth="1.5"/>
                <path d="M8 13h8M8 16h5" stroke="var(--green-primary)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className={styles.fileCardInfo}>
              <p className={styles.fileName}>{csvInfo.name}</p>
              <p className={styles.fileRows}>{csvInfo.rowCount.toLocaleString()} rows detected</p>
            </div>
            <button
              className={styles.reuploadBtn}
              onClick={() => { setCsvInfo(null); updateForm({ csvFile: null, csvColumns: [], columnMapping: {} }); }}
            >
              Re-upload
            </button>
          </div>
        )}

        {csvInfo && csvInfo.headers.length > 0 && (
          <ColumnMapper
            headers={csvInfo.headers}
            mapping={formData.columnMapping || {}}
            onChange={mapping => updateForm({ columnMapping: mapping })}
            error={errors.columnMapping}
          />
        )}

        {errors.csvFile && <p className={styles.errorText}>{errors.csvFile}</p>}
      </div>
    </div>
  );
}

/* ─────────────────────────────── Main ─────────────────────────── */

const Step2Who = ({ formData, updateForm, errors }) => {
  const { triggerType } = formData;

  if (triggerType === 'Event-based') {
    return <EventBasedWho formData={formData} updateForm={updateForm} errors={errors} />;
  }

  if (triggerType === 'Manual / CSV') {
    return <ManualCSVWho formData={formData} updateForm={updateForm} errors={errors} />;
  }

  return (
    <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
      Please complete Step 1 by selecting a trigger type.
    </p>
  );
};

export default Step2Who;
