import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Spinner from '../../components/ui/Spinner';
import { getUsers, inviteUser, updateUserRole, removeUser } from '../../api/settings';
import { useToastContext } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatters';
import styles from './SettingsRoles.module.css';

const ROLE_OPTIONS = [
  { value: 'Admin', label: 'Admin' },
  { value: 'Creator', label: 'Creator' },
  { value: 'Viewer', label: 'Viewer' },
];

const ROLE_BADGE = { Admin: 'success', Creator: 'info', Viewer: 'gray' };

const PERMISSIONS = [
  { name: 'View Campaigns', admin: true, creator: true, viewer: true },
  { name: 'Create & Edit Campaigns', admin: true, creator: true, viewer: false },
  { name: 'Activate / Pause Campaigns', admin: true, creator: true, viewer: false },
  { name: 'Archive Campaigns', admin: true, creator: false, viewer: false },
  { name: 'View Analytics', admin: true, creator: true, viewer: true },
  { name: 'Export Data', admin: true, creator: false, viewer: false },
  { name: 'Manage Settings', admin: true, creator: false, viewer: false },
  { name: 'Invite & Manage Users', admin: true, creator: false, viewer: false },
];

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 8l3 3 5-5" stroke="var(--green-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CrossIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M5 5l6 6M11 5l-6 6" stroke="var(--text-disabled)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const RoleSelect = ({ value, onChange }) => (
  <div className={styles.roleSelectWrap}>
    <select className={styles.roleSelect} value={value} onChange={e => onChange(e.target.value)}>
      {ROLE_OPTIONS.map(r => (
        <option key={r.value} value={r.value}>{r.label}</option>
      ))}
    </select>
    <span className={styles.roleSelectChevron}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2.5 4.5l4.5 4.5 4.5-4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  </div>
);

const SettingsRoles = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteModal, setInviteModal] = useState(false);
  const [removeModal, setRemoveModal] = useState(null);
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'Creator' });
  const [inviteErrors, setInviteErrors] = useState({});
  const [inviting, setInviting] = useState(false);
  const { showToast } = useToastContext();

  useEffect(() => {
    getUsers().then(u => {
      setUsers(u);
      setLoading(false);
    });
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    await updateUserRole(userId, newRole);
    showToast('User role updated.', 'success');
  };

  const handleRemove = async () => {
    await removeUser(removeModal.id);
    setUsers(prev => prev.filter(u => u.id !== removeModal.id));
    showToast(`${removeModal.name} removed.`, 'success');
    setRemoveModal(null);
  };

  const handleInvite = async () => {
    const errs = {};
    if (!inviteForm.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteForm.email)) errs.email = 'Invalid email address';
    if (Object.keys(errs).length > 0) {
      setInviteErrors(errs);
      return;
    }
    setInviting(true);
    try {
      const newUser = await inviteUser(inviteForm.email, inviteForm.role);
      setUsers(prev => [...prev, newUser]);
      showToast(`Invitation sent to ${inviteForm.email}.`, 'success');
      setInviteModal(false);
      setInviteForm({ email: '', role: 'Creator' });
      setInviteErrors({});
    } catch {
      showToast('Failed to send invitation.', 'error');
    } finally {
      setInviting(false);
    }
  };

  const userColumns = [
    {
      key: 'name',
      label: 'User',
      render: (val, row) => (
        <div>
          <div className={styles.userName}>{val}</div>
          <div className={styles.userEmail}>{row.email}</div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (val) => <Badge variant={ROLE_BADGE[val] || 'gray'}>{val}</Badge>,
    },
    {
      key: 'joinedAt',
      label: 'Joined',
      render: (val) => <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{formatDate(val)}</span>,
    },
    {
      key: 'id',
      label: 'Actions',
      render: (val, row) => (
        <div className={styles.actionCell}>
          <RoleSelect value={row.role} onChange={newRole => handleRoleChange(row.id, newRole)} />
          <button className={styles.removeBtn} onClick={() => setRemoveModal(row)}>Remove</button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ position: 'relative', height: 200 }}>
        <Spinner size="lg" centered />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Access & Roles"
        actions={
          <Button onClick={() => setInviteModal(true)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginRight: 4 }}>
              <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Invite User
          </Button>
        }
      />

      <div className={styles.tableCard}>
        <Table columns={userColumns} data={users} />
      </div>

      <p className={styles.matrixTitle}>Permission Matrix</p>
      <div className={styles.matrixCard}>
        <div className={styles.permHeader}>
          <span>Permission</span>
          <span>Admin</span>
          <span>Creator / Viewer</span>
        </div>
        {PERMISSIONS.map(perm => (
          <div key={perm.name} className={styles.permRow}>
            <span className={styles.permName}>{perm.name}</span>
            <span>{perm.admin ? <CheckIcon /> : <CrossIcon />}</span>
            <span>{perm.creator ? <CheckIcon /> : <CrossIcon />}</span>
          </div>
        ))}
      </div>

      <Modal
        isOpen={inviteModal}
        onClose={() => { setInviteModal(false); setInviteErrors({}); setInviteForm({ email: '', role: 'Creator' }); }}
        title="Invite Team Member"
        footer={
          <>
            <Button variant="secondary" onClick={() => setInviteModal(false)}>Cancel</Button>
            <Button onClick={handleInvite} disabled={inviting}>
              {inviting ? 'Sending...' : 'Send Invitation'}
            </Button>
          </>
        }
      >
        <div className={styles.inviteForm}>
          <Input
            label="Email Address"
            type="email"
            value={inviteForm.email}
            onChange={e => {
              setInviteForm(prev => ({ ...prev, email: e.target.value }));
              setInviteErrors(prev => ({ ...prev, email: '' }));
            }}
            placeholder="colleague@company.com"
            error={inviteErrors.email}
          />
          <Select
            label="Role"
            value={inviteForm.role}
            onChange={e => setInviteForm(prev => ({ ...prev, role: e.target.value }))}
            options={ROLE_OPTIONS}
          />
          <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            <strong>Admin</strong> — Full access including settings and user management.<br />
            <strong>Creator</strong> — Can create, edit, and send campaigns. No settings access.<br />
            <strong>Viewer</strong> — Read-only access to campaigns and analytics.
          </p>
        </div>
      </Modal>

      <Modal
        isOpen={!!removeModal}
        onClose={() => setRemoveModal(null)}
        title="Remove Team Member"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRemoveModal(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleRemove}>Remove User</Button>
          </>
        }
      >
        {removeModal && (
          <p style={{ fontSize: 14, color: 'var(--text-body)', lineHeight: 1.6 }}>
            Are you sure you want to remove <strong>{removeModal.name}</strong> ({removeModal.email}) from the team? They will lose all access immediately.
          </p>
        )}
      </Modal>
    </div>
  );
};

export default SettingsRoles;
