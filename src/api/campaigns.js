import { CAMPAIGNS_MOCK } from '../utils/constants';

export const getCampaigns = async (filters = {}) => {
  return Promise.resolve(CAMPAIGNS_MOCK);
};

export const getCampaign = async (id) => {
  const campaign = CAMPAIGNS_MOCK.find(c => c.id === id);
  return Promise.resolve(campaign || null);
};

export const createCampaign = async (data) => {
  return Promise.resolve({ ...data, id: Date.now().toString(), status: 'Draft' });
};

export const updateCampaign = async (id, data) => {
  return Promise.resolve({ id, ...data });
};

export const archiveCampaign = async (id) => {
  return Promise.resolve({ success: true });
};

export const sendTestMessage = async (id, target) => {
  return Promise.resolve({ success: true, target });
};
