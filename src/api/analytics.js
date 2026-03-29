export const getOverview = async (dateRange) => {
  return Promise.resolve({
    sent: 48320,
    delivered: 44891,
    opened: 12480,
    clicked: 3240,
    deliveryRate: 92.9,
    openRate: 27.8,
    clickRate: 7.2,
    byChannel: [
      { channel: 'Email', sent: 18200, delivered: 15470, deliveryRate: 85.0, opens: 4312, openRate: 27.9, clicks: 890, clickRate: 5.8 },
      { channel: 'Push', sent: 22100, delivered: 15912, deliveryRate: 72.0, opens: 2864, openRate: 18.0, clicks: 1840, clickRate: 11.6 },
      { channel: 'SMS', sent: 8020, delivered: 7709, deliveryRate: 96.1, opens: null, openRate: null, clicks: 510, clickRate: 6.6 },
    ],
    topCampaigns: [
      { id: '10001', name: 'Payment Due Reminder', channel: 'Email', sent: 5200, openRate: 34.2, clickRate: 8.1 },
      { id: '10004', name: 'Reactivation Campaign', channel: 'Push', sent: 4100, openRate: 22.1, clickRate: 9.4 },
      { id: '10002', name: 'Welcome to Bright', channel: 'Push', sent: 3800, openRate: 22.4, clickRate: 14.2 },
      { id: '10005', name: 'Loan Approval Alert', channel: 'SMS', sent: 3200, openRate: null, clickRate: 7.2 },
      { id: '10003', name: 'OTP Verification', channel: 'SMS', sent: 8020, openRate: null, clickRate: 6.6 },
    ],
  });
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
