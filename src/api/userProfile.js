const MOCK_USERS = {
  'USR_a1b2c3': { name: 'Arjun Patel', email: 'arjun@example.com', phone: '+91 98765 43210', uid: 'USR_a1b2c3', status: 'Active' },
  'USR_b2c3d4': { name: 'Priya Nair', email: 'priya.n@example.com', phone: '+91 87654 32109', uid: 'USR_b2c3d4', status: 'Active' },
};

const MOCK_ACTIVITY = [
  { id: 1, timestamp: '2024-01-15T10:32:00Z', eventType: 'Delivered', campaign: 'Payment Due Reminder', campaignId: '10001', channel: 'Email', details: 'Delivered to arjun@example.com' },
  { id: 2, timestamp: '2024-01-15T10:30:00Z', eventType: 'Sent', campaign: 'Payment Due Reminder', campaignId: '10001', channel: 'Email', details: 'Sent via SendGrid' },
  { id: 3, timestamp: '2024-01-14T09:15:00Z', eventType: 'Clicked', campaign: 'Referral Bonus', campaignId: '10006', channel: 'Email', details: 'Clicked CTA button' },
  { id: 4, timestamp: '2024-01-14T09:00:00Z', eventType: 'Opened', campaign: 'Referral Bonus', campaignId: '10006', channel: 'Email', details: 'Opened on mobile' },
  { id: 5, timestamp: '2024-01-13T14:20:00Z', eventType: 'Delivered', campaign: 'Welcome to Bright', campaignId: '10002', channel: 'Push', details: 'Delivered to device token' },
  { id: 6, timestamp: '2024-01-13T14:18:00Z', eventType: 'Sent', campaign: 'Welcome to Bright', campaignId: '10002', channel: 'Push', details: 'Sent via FCM' },
  { id: 7, timestamp: '2024-01-12T11:00:00Z', eventType: 'Delivered', campaign: 'OTP Verification', campaignId: '10003', channel: 'SMS', details: 'Delivered to +91 98765 43210' },
  { id: 8, timestamp: '2024-01-12T10:59:00Z', eventType: 'Sent', campaign: 'OTP Verification', campaignId: '10003', channel: 'SMS', details: 'Sent via Twilio' },
  { id: 9, timestamp: '2024-01-10T16:45:00Z', eventType: 'Failed', campaign: 'Reactivation Campaign', campaignId: '10004', channel: 'Push', details: 'Invalid device token' },
  { id: 10, timestamp: '2024-01-10T16:44:00Z', eventType: 'Sent', campaign: 'Reactivation Campaign', campaignId: '10004', channel: 'Push', details: 'Sent via FCM' },
  { id: 11, timestamp: '2024-01-08T08:00:00Z', eventType: 'Unsubscribed', campaign: 'Referral Bonus', campaignId: '10006', channel: 'Email', details: 'User clicked unsubscribe link' },
  { id: 12, timestamp: '2024-01-08T07:58:00Z', eventType: 'Opened', campaign: 'Referral Bonus', campaignId: '10006', channel: 'Email', details: 'Opened on desktop' },
  { id: 13, timestamp: '2024-01-08T07:55:00Z', eventType: 'Delivered', campaign: 'Referral Bonus', campaignId: '10006', channel: 'Email', details: 'Delivered to arjun@example.com' },
  { id: 14, timestamp: '2024-01-07T12:30:00Z', eventType: 'Clicked', campaign: 'Loan Approval Alert', campaignId: '10005', channel: 'SMS', details: 'Clicked referral link' },
  { id: 15, timestamp: '2024-01-01T09:00:00Z', eventType: 'Delivered', campaign: 'Payment Due Reminder', campaignId: '10001', channel: 'Email', details: 'Delivered to arjun@example.com' },
];

export const getUserProfile = async (uid) => {
  await new Promise(r => setTimeout(r, 400));
  const user = MOCK_USERS[uid];
  if (!user) throw new Error('User not found');
  return user;
};

export const getUserActivity = async (uid, filters = {}) => {
  await new Promise(r => setTimeout(r, 300));
  return MOCK_ACTIVITY;
};

const CHANNEL_STATUS = {
  'USR_a1b2c3': [
    { channel: 'Email', status: 'Active', lastSent: '2024-01-15T10:30:00Z' },
    { channel: 'Push', status: 'Active', lastSent: '2024-01-13T14:18:00Z' },
    { channel: 'SMS', status: 'Unsubscribed', unsubscribedAt: '2024-01-08T07:58:00Z' },
  ],
  'USR_b2c3d4': [
    { channel: 'Email', status: 'Active', lastSent: '2024-01-14T09:00:00Z' },
    { channel: 'Push', status: 'Unsubscribed', unsubscribedAt: '2024-01-10T16:44:00Z' },
    { channel: 'SMS', status: 'Active', lastSent: '2024-01-12T10:59:00Z' },
  ],
};

export const getChannelStatus = async (uid) => {
  await new Promise(r => setTimeout(r, 200));
  return CHANNEL_STATUS[uid] || [
    { channel: 'Email', status: 'Active', lastSent: null },
    { channel: 'Push', status: 'Active', lastSent: null },
    { channel: 'SMS', status: 'Active', lastSent: null },
  ];
};
