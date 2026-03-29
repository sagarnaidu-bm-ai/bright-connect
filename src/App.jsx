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
import { ToastProvider } from './context/ToastContext';
import './global.css';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/campaigns" replace />} />
          <Route path="/campaigns" element={<AppShell><CampaignList /></AppShell>} />
          <Route path="/campaigns/new" element={<AppShell><NewCampaignShell /></AppShell>} />
          <Route path="/campaigns/:id" element={<AppShell><CampaignDetail /></AppShell>} />
          <Route path="/analytics" element={<AppShell><AnalyticsOverview /></AppShell>} />
          <Route path="/settings/general" element={<AppShell><SettingsGeneral /></AppShell>} />
          <Route path="/settings/roles" element={<AppShell><SettingsRoles /></AppShell>} />
          <Route path="/settings" element={<Navigate to="/settings/general" replace />} />
          <Route path="/user-profile" element={<AppShell><UserProfile /></AppShell>} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
