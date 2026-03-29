import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import CampaignList from './pages/campaigns/CampaignList';
import CampaignDetail from './pages/campaigns/CampaignDetail';
import NewCampaignShell from './pages/campaigns/new/NewCampaignShell';
import AnalyticsOverview from './pages/analytics/AnalyticsOverview';
import SettingsGeneral from './pages/settings/SettingsGeneral';
import SettingsRoles from './pages/settings/SettingsRoles';
import UserProfile from './pages/userprofile/UserProfile';
import Login from './pages/auth/Login';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './global.css';

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) return <Navigate to="/campaigns" replace />;
  return children;
};

const RootRedirect = () => {
  const { user } = useAuth();
  return <Navigate to={user ? '/campaigns' : '/login'} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<RootRedirect />} />

            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            <Route
              path="/campaigns"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <CampaignList />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/campaigns/new"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <NewCampaignShell />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/campaigns/:id"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <CampaignDetail />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <AnalyticsOverview />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/general"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <SettingsGeneral />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/roles"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <SettingsRoles />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route path="/settings" element={<Navigate to="/settings/general" replace />} />
            <Route
              path="/user-profile"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <UserProfile />
                  </AppShell>
                </ProtectedRoute>
              }
            />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
