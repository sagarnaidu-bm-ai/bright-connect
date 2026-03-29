export const CAMPAIGNS_MOCK = [
  { id: '10001', name: 'Payment Due Reminder', type: 'Transactional', channel: 'Email', status: 'Active', triggerType: 'Event-based', lastSent: '2024-01-15T10:30:00Z', eventName: 'payment_due', createdAt: '2024-01-01T10:00:00Z' },
  { id: '10002', name: 'Welcome to Bright', type: 'Transactional', channel: 'Push', status: 'Active', triggerType: 'Event-based', lastSent: '2024-01-14T08:00:00Z', eventName: 'signup_completed', createdAt: '2024-01-03T09:00:00Z' },
  { id: '10003', name: 'OTP Verification', type: 'Transactional', channel: 'SMS', status: 'Active', triggerType: 'Event-based', lastSent: '2024-01-15T11:45:00Z', eventName: 'otp_requested', createdAt: '2023-12-20T11:00:00Z' },
  { id: '10004', name: 'Reactivation Campaign', type: 'Marketing', channel: 'Push', status: 'Paused', triggerType: 'Manual / CSV', lastSent: '2024-01-10T14:00:00Z', createdAt: '2023-12-15T08:00:00Z' },
  { id: '10005', name: 'Loan Approval Alert', type: 'Transactional', channel: 'SMS', status: 'Draft', triggerType: 'Event-based', lastSent: null, eventName: 'loan_approved', createdAt: '2024-01-10T16:00:00Z' },
  { id: '10006', name: 'Referral Bonus', type: 'Marketing', channel: 'Email', status: 'Draft', triggerType: 'Manual / CSV', lastSent: null, createdAt: '2024-01-12T13:00:00Z' },
];

export const CHANNEL_TYPES = ['Email', 'Push', 'SMS'];
export const CAMPAIGN_TYPES = ['Transactional', 'Marketing'];
export const TRIGGER_TYPES = ['Event-based', 'Manual / CSV'];
export const CAMPAIGN_STATUSES = ['Draft', 'Active', 'Scheduled', 'Paused'];
