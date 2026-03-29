const USERS_MOCK = [
  { id: '1', name: 'Priya Sharma', email: 'priya@bright.com', role: 'Admin', joinedAt: '2023-08-12T00:00:00Z' },
  { id: '2', name: 'Rahul Mehta', email: 'rahul@bright.com', role: 'Creator', joinedAt: '2023-10-05T00:00:00Z' },
  { id: '3', name: 'Ananya Singh', email: 'ananya@bright.com', role: 'Creator', joinedAt: '2024-01-02T00:00:00Z' },
];

const SETTINGS_MOCK = {
  frequencyCapping: [
    { channel: 'Email', maxPerDay: 2, maxPerWeek: 5, appliesTo: 'Marketing only' },
    { channel: 'Push', maxPerDay: 3, maxPerWeek: 10, appliesTo: 'All campaigns' },
    { channel: 'SMS', maxPerDay: 1, maxPerWeek: 3, appliesTo: 'Transactional only' },
  ],
  unsubscribe: {
    email: true,
    push: true,
  },
};

export const getSettings = async () => Promise.resolve(SETTINGS_MOCK);
export const updateSettings = async (data) => Promise.resolve({ ...SETTINGS_MOCK, ...data });
export const getUsers = async () => Promise.resolve(USERS_MOCK);
export const inviteUser = async (email, role) =>
  Promise.resolve({
    id: Date.now().toString(),
    email,
    role,
    name: email.split('@')[0],
    joinedAt: new Date().toISOString(),
  });
export const updateUserRole = async (id, role) => Promise.resolve({ id, role });
export const removeUser = async (id) => Promise.resolve({ success: true });
