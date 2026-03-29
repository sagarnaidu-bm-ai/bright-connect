import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from '../../../components/ui/StepIndicator';
import Button from '../../../components/ui/Button';
import { useToastContext } from '../../../context/ToastContext';
import { createCampaign } from '../../../api/campaigns';
import Step1Setup from './Step1Setup';
import Step2Who from './Step2Who';
import Step3What from './Step3What';
import Step4When from './Step4When';
import Step5Review from './Step5Review';
import styles from './NewCampaignShell.module.css';

const STEPS = ['Setup', 'Who', 'What', 'When', 'Review & Test'];

const INITIAL_FORM = {
  name: '',
  type: '',
  channel: '',
  triggerType: '',
  // Who
  eventName: '',
  eventFilters: [],
  csvFile: null,
  csvColumns: [],
  columnMapping: {},
  // What
  subject: '',
  fromSender: '',
  emailBody: '',
  messageBody: '',
  smsSenderId: '',
  pushTitle: '',
  // When
  scheduleType: '',
  sendType: '',
  scheduleDate: '',
  scheduleTime: '',
  recurringFrequency: '',
  recurringDays: [],
  recurringMonthDay: '',
  recurringIntervalValue: '',
  recurringIntervalUnit: 'days',
  recurringEndDate: '',
  goalEvent: '',
};

const validateStep = (step, formData) => {
  const errors = {};

  if (step === 0) {
    if (!formData.name.trim()) errors.name = 'Campaign name is required';
    if (!formData.type) errors.type = 'Campaign type is required';
    if (!formData.channel) errors.channel = 'Channel is required';
    if (!formData.triggerType) errors.triggerType = 'Trigger type is required';
    // Block SMS + Marketing combination
    if (formData.channel === 'SMS' && formData.type === 'Marketing') {
      errors.channel = 'SMS is only available for Transactional campaigns.';
    }
  }

  if (step === 1) {
    if (formData.triggerType === 'Event-based' && !formData.eventName?.trim()) {
      errors.eventName = 'At least one event name is required';
    }
    if (formData.triggerType === 'Manual / CSV' && !formData.csvFile) {
      errors.csvFile = 'Please upload a CSV file';
    }
    if (formData.triggerType === 'Manual / CSV' && formData.csvFile) {
      const mapping = formData.columnMapping || {};
      const mappedValues = Object.values(mapping);
      const hasIdentifier = mappedValues.some(v => ['email', 'phone', 'user_id'].includes(v));
      if (!hasIdentifier) {
        errors.columnMapping = 'At least one of Email, Phone, or User ID must be mapped';
      }
    }
  }

  if (step === 2) {
    if (formData.channel === 'Email') {
      if (!formData.subject?.trim()) errors.subject = 'Subject line is required';
      if (!formData.emailBody?.trim()) errors.emailBody = 'Email body is required';
    }
    if (formData.channel === 'SMS' && !formData.messageBody?.trim()) {
      errors.messageBody = 'Message body is required';
    }
    if (formData.channel === 'Push' && !formData.pushTitle?.trim()) {
      errors.pushTitle = 'Push notification title is required';
    }
  }

  if (step === 3) {
    if (!formData.scheduleType) errors.scheduleType = 'Please select a schedule type';
  }

  return errors;
};

const NewCampaignShell = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [direction, setDirection] = useState('forward');

  const navigate = useNavigate();
  const { showToast } = useToastContext();

  const updateForm = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setErrors(prev => {
      const next = { ...prev };
      Object.keys(updates).forEach(k => delete next[k]);
      return next;
    });
  };

  const handleNext = () => {
    const errs = validateStep(step, formData);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setDirection('forward');
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setErrors({});
    setDirection('back');
    setStep(s => Math.max(s - 1, 0));
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      await createCampaign({ ...formData, status: 'Draft' });
      showToast('Campaign saved as draft.', 'success');
      navigate('/campaigns');
    } catch {
      showToast('Failed to save draft.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleActivate = async () => {
    const errs = validateStep(step, formData);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSaving(true);
    try {
      await createCampaign({ ...formData, status: 'Active' });
      showToast('Campaign activated successfully!', 'success');
      navigate('/campaigns');
    } catch {
      showToast('Failed to activate campaign.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const progressPct = Math.round(((step) / (STEPS.length - 1)) * 100);
  const stepProps = { formData, updateForm, errors };

  return (
    <div className={styles.shell}>
      {/* Progress bar */}
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
      </div>

      <h1 className={styles.title}>New Campaign</h1>

      <StepIndicator steps={STEPS} currentStep={step} />

      <div className={styles.card}>
        <div className={`${styles.stepContent} ${direction === 'forward' ? styles.slideForward : styles.slideBack}`} key={step}>
          {step === 0 && <Step1Setup {...stepProps} />}
          {step === 1 && <Step2Who {...stepProps} />}
          {step === 2 && <Step3What {...stepProps} />}
          {step === 3 && <Step4When {...stepProps} />}
          {step === 4 && <Step5Review {...stepProps} onActivate={handleActivate} />}
        </div>

        <div className={styles.actionBar}>
          <Button variant="ghost" onClick={handleSaveDraft} disabled={saving}>
            Save as Draft
          </Button>
          <div className={styles.actionRight}>
            {step > 0 && (
              <Button variant="secondary" onClick={handleBack} disabled={saving}>
                Back
              </Button>
            )}
            {step < STEPS.length - 1 ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button onClick={handleActivate} disabled={saving}>
                {saving ? 'Activating...' : 'Activate Campaign'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCampaignShell;
