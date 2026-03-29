import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import brightIcon from '../../assets/bright-icon.png';
import styles from './Login.module.css';

const GoogleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      fill="#4285F4"
    />
    <path
      d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      fill="#34A853"
    />
    <path
      d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      fill="#FBBC05"
    />
    <path
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      fill="#EA4335"
    />
  </svg>
);


const CheckIcon = () => (
  <svg
    className={styles.featureCheck}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="8" cy="8" r="7.5" stroke="#17c95f" strokeWidth="1" />
    <path
      d="M5 8.5l2 2 4-4"
      stroke="#17c95f"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
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
  const [loadingSSO, setLoadingSSO] = useState(null); // 'google' | null
  const [loadingForm, setLoadingForm] = useState(false);

  const handleSSOClick = (provider) => {
    setLoadingSSO(provider);
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

    if (!email.trim()) {
      setEmailError('Email is required');
      valid = false;
    } else if (!email.endsWith('@brightmoney.co')) {
      setGlobalError('Only @brightmoney.co accounts are allowed');
      valid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    }

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
      {/* Left brand panel */}
      <div className={styles.leftPanel}>
        <div className={styles.leftContent}>
          <div className={styles.brand}>
            <img src={brightIcon} alt="Bright Connect" className={styles.brandIcon} />
            <span className={styles.brandName}>Bright Connect</span>
          </div>

          <p className={styles.tagline}>Powering every conversation with your users</p>

          <div className={styles.features}>
            {FEATURES.map((f) => (
              <div className={styles.featureItem} key={f}>
                <CheckIcon />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <span className={styles.copyright}>© 2025 Bright Money. Internal use only.</span>
      </div>

      {/* Right form panel */}
      <div className={styles.rightPanel}>
        <div className={styles.formBox}>
          <h1 className={styles.formTitle}>Welcome back</h1>
          <p className={styles.formSubtitle}>Sign in with your Bright account</p>

          {/* SSO Buttons */}
          <div className={styles.ssoButtons}>
            <button
              type="button"
              className={styles.ssoBtn}
              onClick={() => handleSSOClick('google')}
              disabled={isSSO || loadingForm}
            >
              {loadingSSO === 'google' ? (
                <span className={styles.ssoBtnSpinner} />
              ) : (
                <GoogleLogo />
              )}
              Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className={styles.divider}>or</div>

          {/* Email + Password form */}
          <form onSubmit={validateAndSubmit} noValidate>
            <div className={styles.fields}>
              <Input
                label="Work email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError('');
                  setGlobalError('');
                }}
                placeholder="you@brightmoney.co"
                error={emailError}
                disabled={isSSO || loadingForm}
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                placeholder="••••••••"
                error={passwordError}
                disabled={isSSO || loadingForm}
              />
            </div>

            {globalError && (
              <div className={styles.errorMsg}>{globalError}</div>
            )}

            <button type="button" className={styles.forgotLink}>
              Forgot password?
            </button>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSSO || loadingForm}
            >
              {loadingForm && <span className={styles.spinner} />}
              Sign in
            </button>
          </form>

          <p className={styles.bottomNote}>
            Access restricted to @brightmoney.co accounts
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
