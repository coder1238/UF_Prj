import React, { createContext, useContext, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavigationContext = createContext();

export const NAV_ITEMS = [
  { id: 'home', path: '/', label: 'Home', badge: null },
  { id: 'live-map', path: '/live-map', label: 'Live Map', badge: 'LIVE' },
  { id: 'forecast', path: '/forecast', label: 'Forecast', badge: '0-3h' },
  { id: 'route', path: '/route', label: 'Safe Route', badge: null },
  { id: 'hud', path: '/hud', label: 'Drive HUD', badge: 'NEW' },
  { id: 'location-risk', path: '/locations', label: 'My Locations', badge: null },
  { id: 'safe-places', path: '/safe-places', label: 'Safe Places', badge: null },
  { id: 'alerts', path: '/alerts', label: 'Alerts', badge: '4' },
  { id: 'report', path: '/report', label: 'Report Hazard', badge: null },
  { id: 'emergency', path: '/emergency', label: 'SOS 1916', badge: 'CRITICAL', isEmergency: true }
];

export const MORE_NAV_ITEMS = [
  { id: 'scanner', path: '/scanner', label: 'Nearby Place Scanner' },
  { id: 'community', path: '/community', label: 'Community Sensor Map' },
  { id: 'my-reports', path: '/my-reports', label: 'My Incident Reports' },
  { id: 'family-safety', path: '/family-safety', label: 'Family Safety Circle' },
  { id: 'safety-guide', path: '/safety-guide', label: 'Flood Survival Physics' },
  { id: 'replay', path: '/replay', label: 'Historical Cloudburst Replay' },
  { id: 'ai-models', path: '/models', label: '15-Model AI Transparency' },
  { id: 'profile', path: '/profile', label: 'Vehicle Clearance & Profile' }
];

// Map of canonical IDs / aliases to URL paths
const PATH_MAP = {
  'home': '/',
  '/': '/',
  'live-map': '/live-map',
  'map': '/live-map',
  '/live-map': '/live-map',
  '/map': '/live-map',
  'forecast': '/forecast',
  '/forecast': '/forecast',
  'route': '/route',
  '/route': '/route',
  'hud': '/hud',
  '/hud': '/hud',
  'nav-hud': '/hud',
  '/nav-hud': '/hud',
  'location-risk': '/locations',
  'locations': '/locations',
  '/locations': '/locations',
  '/location-risk': '/locations',
  'report': '/report',
  '/report': '/report',
  'safe-places': '/safe-places',
  '/safe-places': '/safe-places',
  'alerts': '/alerts',
  '/alerts': '/alerts',
  'scanner': '/scanner',
  'place-scanner': '/scanner',
  '/scanner': '/scanner',
  '/place-scanner': '/scanner',
  'my-reports': '/my-reports',
  '/my-reports': '/my-reports',
  'family-safety': '/family-safety',
  'family': '/family-safety',
  '/family-safety': '/family-safety',
  '/family': '/family-safety',
  'emergency': '/emergency',
  '/emergency': '/emergency',
  'safety-guide': '/safety-guide',
  'safety-guides': '/safety-guide',
  'guide': '/safety-guide',
  '/safety-guide': '/safety-guide',
  '/safety-guides': '/safety-guide',
  '/guide': '/safety-guide',
  'community': '/community',
  '/community': '/community',
  'replay': '/replay',
  '/replay': '/replay',
  'profile': '/profile',
  'settings': '/profile',
  '/profile': '/profile',
  '/settings': '/profile',
  'ai-models': '/models',
  'models': '/models',
  '/models': '/models',
  '/ai-models': '/models'
};

export function NavigationProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Derive current page ID from pathname
  const currentPage = useMemo(() => {
    const path = location.pathname.toLowerCase();
    if (path === '/' || path === '/home') return 'home';
    if (path === '/live-map' || path === '/map') return 'live-map';
    if (path === '/forecast') return 'forecast';
    if (path === '/route') return 'route';
    if (path === '/hud') return 'hud';
    if (path === '/locations' || path === '/location-risk') return 'location-risk';
    if (path === '/report') return 'report';
    if (path === '/safe-places') return 'safe-places';
    if (path === '/alerts') return 'alerts';
    if (path === '/scanner' || path === '/place-scanner') return 'scanner';
    if (path === '/my-reports') return 'my-reports';
    if (path === '/family-safety' || path === '/family') return 'family-safety';
    if (path === '/emergency') return 'emergency';
    if (path === '/safety-guide' || path === '/safety-guides' || path === '/guide') return 'safety-guide';
    if (path === '/community') return 'community';
    if (path === '/replay') return 'replay';
    if (path === '/profile' || path === '/settings') return 'profile';
    if (path === '/models' || path === '/ai-models') return 'ai-models';
    return 'home';
  }, [location.pathname]);

  const navigateTo = (target) => {
    const dest = PATH_MAP[target] || (target.startsWith('/') ? target : `/${target}`);
    navigate(dest);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <NavigationContext.Provider value={{
      currentPage,
      activePage: currentPage,
      setCurrentPage: navigateTo,
      setActivePage: navigateTo,
      navigateTo,
      currentPath: location.pathname,
      navItems: NAV_ITEMS,
      moreNavItems: MORE_NAV_ITEMS
    }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) throw new Error('useNavigation must be used within NavigationProvider');
  return context;
}
