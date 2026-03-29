import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import brightIcon from '../../assets/bright-icon.png';
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

const Sidebar = () => {
  const location = useLocation();
  const isSettings = location.pathname.startsWith('/settings');

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
    </aside>
  );
};

export default Sidebar;
