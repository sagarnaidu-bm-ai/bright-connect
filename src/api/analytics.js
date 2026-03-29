const DATA_BY_RANGE = {
  'Last 7 days': {
    byChannel: [
      { channel: 'Email', sent: 4200, delivered: 3570, deliveryRate: 85.0, opens: 996,  openRate: 27.9, clicks: 204, clickRate: 5.8 },
      { channel: 'Push',  sent: 5100, delivered: 3672, deliveryRate: 72.0, opens: 661,  openRate: 18.0, clicks: 425, clickRate: 11.6 },
      { channel: 'SMS',   sent: 1850, delivered: 1779, deliveryRate: 96.2, opens: null,  openRate: null, clicks: 118, clickRate: 6.6 },
    ],
    topCampaigns: [
      { id: '10001', name: 'Payment Due Reminder',  channel: 'Email', sent: 1200, openRate: 34.2, clickRate: 8.1 },
      { id: '10002', name: 'Welcome to Bright',     channel: 'Push',  sent: 980,  openRate: 22.4, clickRate: 14.2 },
      { id: '10004', name: 'Reactivation Campaign', channel: 'Push',  sent: 870,  openRate: 19.8, clickRate: 9.4 },
      { id: '10003', name: 'OTP Verification',      channel: 'SMS',   sent: 1850, openRate: null, clickRate: 6.6 },
      { id: '10005', name: 'Loan Approval Alert',   channel: 'SMS',   sent: 640,  openRate: null, clickRate: 7.2 },
    ],
  },
  'Last 30 days': {
    byChannel: [
      { channel: 'Email', sent: 18200, delivered: 15470, deliveryRate: 85.0, opens: 4312, openRate: 27.9, clicks: 890,  clickRate: 5.8 },
      { channel: 'Push',  sent: 22100, delivered: 15912, deliveryRate: 72.0, opens: 2864, openRate: 18.0, clicks: 1840, clickRate: 11.6 },
      { channel: 'SMS',   sent: 8020,  delivered: 7709,  deliveryRate: 96.1, opens: null,  openRate: null, clicks: 510,  clickRate: 6.6 },
    ],
    topCampaigns: [
      { id: '10001', name: 'Payment Due Reminder',  channel: 'Email', sent: 5200, openRate: 34.2, clickRate: 8.1 },
      { id: '10004', name: 'Reactivation Campaign', channel: 'Push',  sent: 4100, openRate: 22.1, clickRate: 9.4 },
      { id: '10002', name: 'Welcome to Bright',     channel: 'Push',  sent: 3800, openRate: 22.4, clickRate: 14.2 },
      { id: '10005', name: 'Loan Approval Alert',   channel: 'SMS',   sent: 3200, openRate: null, clickRate: 7.2 },
      { id: '10003', name: 'OTP Verification',      channel: 'SMS',   sent: 8020, openRate: null, clickRate: 6.6 },
    ],
  },
  'Custom': {
    byChannel: [
      { channel: 'Email', sent: 9800,  delivered: 8330,  deliveryRate: 85.0, opens: 2324, openRate: 27.9, clicks: 480,  clickRate: 5.8 },
      { channel: 'Push',  sent: 11400, delivered: 8208,  deliveryRate: 72.0, opens: 1477, openRate: 18.0, clicks: 950,  clickRate: 11.6 },
      { channel: 'SMS',   sent: 4100,  delivered: 3940,  deliveryRate: 96.1, opens: null,  openRate: null, clicks: 260,  clickRate: 6.6 },
    ],
    topCampaigns: [
      { id: '10001', name: 'Payment Due Reminder',  channel: 'Email', sent: 2800, openRate: 32.1, clickRate: 7.8 },
      { id: '10002', name: 'Welcome to Bright',     channel: 'Push',  sent: 2200, openRate: 21.5, clickRate: 13.1 },
      { id: '10004', name: 'Reactivation Campaign', channel: 'Push',  sent: 1900, openRate: 20.3, clickRate: 9.0 },
      { id: '10003', name: 'OTP Verification',      channel: 'SMS',   sent: 4100, openRate: null, clickRate: 6.3 },
      { id: '10005', name: 'Loan Approval Alert',   channel: 'SMS',   sent: 1600, openRate: null, clickRate: 7.0 },
    ],
  },
};

export const getOverview = async (dateRange) => {
  await new Promise(r => setTimeout(r, 300));
  return Promise.resolve(DATA_BY_RANGE[dateRange] || DATA_BY_RANGE['Last 30 days']);
};

export const getCampaignStats = async (id) => {
  return Promise.resolve({
    sent: 5200,
    delivered: 4420,
    opened: 1778,
    clicked: 421,
    deltasSent: +120,
    deltasDelivered: +95,
    deltasOpened: +43,
    deltasClicked: +12,
  });
};
