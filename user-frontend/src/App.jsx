import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { FloodProvider } from './context/FloodContext';
import { NavigationProvider } from './context/NavigationContext';
import CitizenSidebar from './components/layout/CitizenSidebar';
import TopHeader from './components/layout/TopHeader';
import OfflineBanner from './components/layout/OfflineBanner';

// 18 Fully Interactive Citizen Pages
import HomeSafetyOverview from './components/pages/01_HomeSafetyOverview';
import LiveFloodMap from './components/pages/02_LiveFloodMap';
import FloodForecast from './components/pages/03_FloodForecast';
import SafeRoute from './components/pages/04_SafeRoute';
import ActiveNavigationHUD from './components/pages/04b_ActiveNavigationHUD';
import LocationRisk from './components/pages/05_LocationRisk';
import ReportFlood from './components/pages/06_ReportFlood';
import SafePlaces from './components/pages/07_SafePlaces';
import AlertCenter from './components/pages/08_AlertCenter';
import PlaceStatusScanner from './components/pages/08b_PlaceStatusScanner';
import MyReports from './components/pages/09_MyReports';
import FamilySafety from './components/pages/10_FamilySafety';
import EmergencyCenter from './components/pages/11_EmergencyCenter';
import FloodSafetyGuide from './components/pages/12_FloodSafetyGuide';
import CommunityFloodMap from './components/pages/13_CommunityFloodMap';
import FloodEventReplay from './components/pages/14_FloodEventReplay';
import ProfileSettings from './components/pages/15_ProfileSettings';
import AIModelTransparency from './components/pages/16_AIModelTransparency';

import { ShieldCheck, PhoneCall, Cpu } from 'lucide-react';
import UrbanFloodLogo from './components/shared/UrbanFloodLogo';
import Landing from './pages/Landing';

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [hasEntered, setHasEntered] = useState(() => {
    try { return window.sessionStorage.getItem('ufi_entered') === 'true'; }
    catch { return false; }
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const enterApp = (path = '/') => {
    try { window.sessionStorage.setItem('ufi_entered', 'true'); } catch { /* Continue for this page view if storage is unavailable. */ }
    setHasEntered(true);
    if (path !== location.pathname) navigate(path);
  };

  if (!hasEntered) return <Landing onEnter={enterApp} />;

  const isHUD = location.pathname === '/hud';

  // In-cab driving HUD mode renders full-screen without sidebar/header clutter
  if (isHUD) {
    return (
      <main className="min-h-screen bg-ink text-white">
        <ActiveNavigationHUD />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-ink flex selection:bg-purple-soft selection:text-purple-deep">
      {/* Left-Side Categorized Navigation Rail (like Authority Frontend) */}
      <CitizenSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Content Workspace (shifted by 288px on lg screens to accommodate sidebar) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all">
        {/* Offline Banner when offline simulation active */}
        <OfflineBanner />

        {/* Top Utility Header */}
        <TopHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Routed Citizen Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Routes>
            <Route path="/" element={<HomeSafetyOverview />} />
            <Route path="/home" element={<HomeSafetyOverview />} />
            <Route path="/live-map" element={<LiveFloodMap />} />
            <Route path="/map" element={<LiveFloodMap />} />
            <Route path="/forecast" element={<FloodForecast />} />
            <Route path="/route" element={<SafeRoute />} />
            <Route path="/hud" element={<ActiveNavigationHUD />} />
            <Route path="/locations" element={<LocationRisk />} />
            <Route path="/location-risk" element={<LocationRisk />} />
            <Route path="/report" element={<ReportFlood />} />
            <Route path="/safe-places" element={<SafePlaces />} />
            <Route path="/alerts" element={<AlertCenter />} />
            <Route path="/scanner" element={<PlaceStatusScanner />} />
            <Route path="/place-scanner" element={<PlaceStatusScanner />} />
            <Route path="/my-reports" element={<MyReports />} />
            <Route path="/family-safety" element={<FamilySafety />} />
            <Route path="/family" element={<FamilySafety />} />
            <Route path="/emergency" element={<EmergencyCenter />} />
            <Route path="/safety-guide" element={<FloodSafetyGuide />} />
            <Route path="/safety-guides" element={<FloodSafetyGuide />} />
            <Route path="/guide" element={<FloodSafetyGuide />} />
            <Route path="/community" element={<CommunityFloodMap />} />
            <Route path="/replay" element={<FloodEventReplay />} />
            <Route path="/profile" element={<ProfileSettings />} />
            <Route path="/settings" element={<ProfileSettings />} />
            <Route path="/models" element={<AIModelTransparency />} />
            <Route path="/ai-models" element={<AIModelTransparency />} />
            <Route path="*" element={<HomeSafetyOverview />} />
          </Routes>
        </main>

        {/* Global Citizen Footer */}
        <footer className="bg-white border-t border-slate-200/80 py-8 px-4 sm:px-6 lg:px-8 mt-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-muted">
            <div className="flex items-center gap-4">
              <UrbanFloodLogo variant="compact" size="sm" showBadge={false} />
              <span className="hidden sm:inline text-slate-300">|</span>
              <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> 15 AI & Hydro Models Online
              </span>
            </div>

            <div className="flex items-center gap-4 text-slate-600">
              <Link to="/models" className="hover:text-purple-primary flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-purple-primary" /> Model Architecture
              </Link>
              <Link to="/emergency" className="hover:text-red-600 text-red-600 font-bold flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5" /> SOS 1916
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <FloodProvider>
        <NavigationProvider>
          <AppLayout />
        </NavigationProvider>
      </FloodProvider>
    </BrowserRouter>
  );
}
