import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import brightIcon from '../../assets/bright-icon.png';
import { useAuth } from '../../context/AuthContext';
import styles from './Sidebar.module.css';

const CampaignsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 12h2V7H2v5zM7 12h2V4H7v8zM12 12h2V9h-2v3z" fill="currentColor" />
    <path d="M13.5 2.5L10 5 7 3 3 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 13l3.5-4 3 2.5L12 6l2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="14" cy="8" r="1" fill="currentColor" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4" />
    <path
      d="M8 1.5v1M8 13.5v1M1.5 8h1M13.5 8h1M3.4 3.4l.7.7M11.9 11.9l.7.7M3.4 12.6l.7-.7M11.9 4.1l.7-.7"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

const UserProfileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M2.5 13.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6 2H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3M10 10.5l3-3-3-3M13 7.5H6"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isSettings = location.pathname.startsWith('/settings');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'BU';
    return name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <img src={brightIcon} alt="" className={styles.logoIcon} />
        <span className={styles.logoText}>Bright Connect</span>
      </div>
      <nav className={styles.nav}>
        <NavLink
          to="/campaigns"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive || location.pathname.startsWith('/campaigns') ? styles.navItemActive : ''}`
          }
        >
          <span className={styles.navIcon}>
            <CampaignsIcon />
          </span>
          Campaigns
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
          }
        >
          <span className={styles.navIcon}>
            <AnalyticsIcon />
          </span>
          Analytics
        </NavLink>

        <NavLink
          to="/settings/general"
          className={() =>
            `${styles.navItem} ${isSettings ? styles.navItemActive : ''}`
          }
        >
          <span className={styles.navIcon}>
            <SettingsIcon />
          </span>
          Settings
        </NavLink>

        <NavLink
          to="/user-profile"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
          }
        >
          <span className={styles.navIcon}>
            <UserProfileIcon />
          </span>
          User Profile
        </NavLink>

        {isSettings && (
          <div className={styles.subNav}>
            <NavLink
              to="/settings/general"
              className={({ isActive }) =>
                `${styles.subNavItem} ${isActive ? styles.subNavItemActive : ''}`
              }
            >
              General
            </NavLink>
            <NavLink
              to="/settings/roles"
              className={({ isActive }) =>
                `${styles.subNavItem} ${isActive ? styles.subNavItemActive : ''}`
              }
            >
              Access &amp; Roles
            </NavLink>
          </div>
        )}
      </nav>

      {user && (
        <div className={styles.userSection}>
          <div className={styles.userAvatar}>{getInitials(user.name)}</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user.name}</div>
            <div className={styles.userRole}>{user.role}</div>
          </div>
          <button
            className={styles.logoutBtn}
            onClick={handleLogout}
            title="Sign out"
            aria-label="Sign out"
          >
            <LogoutIcon />
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
