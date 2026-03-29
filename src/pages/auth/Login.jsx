import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import brightIcon from '../../assets/bright-icon.png';
import styles from './Login.module.css';

const GoogleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
  </svg>
);

const FEATURES = [
  'Campaign builder for Email, Push & SMS',
  'Real-time delivery analytics',
  'User-level activity tracking',
];

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [globalError, setGlobalError] = useState('');
  const [loadingSSO, setLoadingSSO] = useState(null);
  const [loadingForm, setLoadingForm] = useState(false);

  const handleSSOClick = () => {
    setLoadingSSO('google');
    setGlobalError('');
    setTimeout(() => {
      login({ name: 'Bright User', email: 'user@brightmoney.co' });
      navigate('/campaigns');
    }, 1500);
  };

  const validateAndSubmit = (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setGlobalError('');

    let valid = true;
    if (!email.trim()) { setEmailError('Email is required'); valid = false; }
    else if (!email.endsWith('@brightmoney.co')) { setGlobalError('Only @brightmoney.co accounts are allowed'); valid = false; }
    if (!password) { setPasswordError('Password is required'); valid = false; }
    if (!valid) return;

    setLoadingForm(true);
    setTimeout(() => {
      login({ name: 'Bright User', email });
      navigate('/campaigns');
    }, 600);
  };

  const isSSO = loadingSSO !== null;

  return (
    <div className={styles.page}>

      {/* ── Left panel ── */}
      <div className={styles.leftPanel}>

        {/* Top-anchored brand header */}
        <div className={styles.brandHeader}>
          <div className={styles.brandLogo}>
            <img src={brightIcon} alt="Bright Connect" className={styles.brandIcon} />
          </div>
          <div className={styles.brandText}>
            <p className={styles.brandName}>Bright Connect</p>
            <p className={styles.brandSubline}>Powering every conversation with your users</p>
          </div>
        </div>

        {/* Vertically centered body */}
        <div className={styles.leftBody}>
          <p className={styles.tagline}>
            Every <em className={styles.taglineAccent}>conversation</em>,<br />
            perfectly delivered.
          </p>
          <ul className={styles.features}>
            {FEATURES.map(f => (
              <li key={f} className={styles.featureItem}>
                <span className={styles.check}>✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom footer */}
        <div className={styles.leftFooter}>
          © 2025 Bright Money. Internal use only.
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className={styles.rightPanel}>
        <div className={styles.formBox}>
          <h2 className={styles.formTitle}>Welcome back</h2>
          <p className={styles.formSubtitle}>Sign in with your Bright account</p>

          <button
            type="button"
            className={styles.googleBtn}
            onClick={handleSSOClick}
            disabled={isSSO || loadingForm}
          >
            {loadingSSO === 'google' ? (
              <span className={styles.ssoBtnSpinner} />
            ) : (
              <GoogleLogo />
            )}
            Continue with Google
          </button>

          <div className={styles.divider}>or</div>

          <form onSubmit={validateAndSubmit} noValidate>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="email">Work email</label>
              <input
                id="email"
                type="email"
                className={`${styles.fieldInput} ${emailError ? styles.fieldInputError : ''}`}
                value={email}
                onChange={e => { setEmail(e.target.value); setEmailError(''); setGlobalError(''); }}
                placeholder="you@brightmoney.co"
                autoComplete="email"
                disabled={isSSO || loadingForm}
              />
              {emailError && <p className={styles.fieldError}>{emailError}</p>}
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className={`${styles.fieldInput} ${passwordError ? styles.fieldInputError : ''}`}
                value={password}
                onChange={e => { setPassword(e.target.value); setPasswordError(''); }}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={isSSO || loadingForm}
              />
              {passwordError && <p className={styles.fieldError}>{passwordError}</p>}
            </div>

            {globalError && <div className={styles.errorMsg}>{globalError}</div>}

            <button type="button" className={styles.forgotLink}>Forgot password?</button>

            <button type="submit" className={styles.submitBtn} disabled={isSSO || loadingForm}>
              {loadingForm && <span className={styles.spinner} />}
              Sign in
            </button>
          </form>

          <p className={styles.bottomNote}>Access restricted to @brightmoney.co accounts</p>
        </div>
      </div>

    </div>
  );
};

export default Login;
