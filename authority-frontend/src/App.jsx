import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { FloodCommandProvider } from './context/FloodCommandContext';
import NavigationRail from './components/layout/NavigationRail';
import TopUtilityBar from './components/layout/TopUtilityBar';

// 18 Fully Interactive Operational Modules
import CommandCenter from './pages/01_CommandCenter';
import LiveFloodMap from './pages/02_LiveFloodMap';
import RainfallNowcast from './pages/03_RainfallNowcast';
import DrainageNetwork from './pages/04_DrainageNetwork';
import SurfaceFlow from './pages/05_SurfaceFlow';
import FloodHotspots from './pages/06_FloodHotspots';
import CriticalInfrastructure from './pages/07_CriticalInfrastructure';
import IncidentManagement from './pages/08_IncidentManagement';
import FloodAwareMobility from './pages/09_FloodAwareMobility';
import AlertsWarnings from './pages/10_AlertsWarnings';
import ScenarioSimulator from './pages/11_ScenarioSimulator';
import HistoricalAnalytics from './pages/12_HistoricalAnalytics';
import ModelIntelligence from './pages/13_ModelIntelligence';
import DataSystemHealth from './pages/14_DataSystemHealth';
import AuthorityAdmin from './pages/15_AuthorityAdmin';
import InterventionLab from './pages/16_InterventionLab';
import CCTVSensorAssimilation from './pages/17_CCTVSensorAssimilation';
import CitizenPortalView from './pages/18_CitizenPortalView';

function AppShell() {
  const location = useLocation();
  const isCitizenView = location.pathname === '/citizen-view';

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-canvas text-ink font-sans antialiased">
      {/* Permanent Left Navigation Rail */}
      <NavigationRail />

      {/* Main Operational Viewport */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Global Top Utility Bar (Hidden in citizen view for distraction-free citizen companion) */}
        {!isCitizenView && <TopUtilityBar />}

        {/* Dynamic Route Content */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <Routes>
            <Route path="/" element={<Navigate to="/command" replace />} />
            <Route path="/command" element={<CommandCenter />} />
            <Route path="/live-map" element={<LiveFloodMap />} />
            <Route path="/nowcast" element={<RainfallNowcast />} />
            <Route path="/drainage" element={<DrainageNetwork />} />
            <Route path="/surface-flow" element={<SurfaceFlow />} />
            <Route path="/hotspots" element={<FloodHotspots />} />
            <Route path="/infrastructure" element={<CriticalInfrastructure />} />
            <Route path="/incidents" element={<IncidentManagement />} />
            <Route path="/mobility" element={<FloodAwareMobility />} />
            <Route path="/alerts" element={<AlertsWarnings />} />
            <Route path="/scenario-lab" element={<ScenarioSimulator />} />
            <Route path="/historical" element={<HistoricalAnalytics />} />
            <Route path="/models" element={<ModelIntelligence />} />
            <Route path="/system-health" element={<DataSystemHealth />} />
            <Route path="/admin" element={<AuthorityAdmin />} />
            <Route path="/intervention-lab" element={<InterventionLab />} />
            <Route path="/cctv-vision" element={<CCTVSensorAssimilation />} />
            <Route path="/citizen-view" element={<CitizenPortalView />} />
            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/command" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <FloodCommandProvider>
        <AppShell />
      </FloodCommandProvider>
    </BrowserRouter>
  );
}
