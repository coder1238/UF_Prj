import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Map, NavigationControl, GeolocateControl, Marker, Popup, LngLatBounds } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  MapPin, 
  AlertTriangle, 
  ShieldCheck, 
  Maximize2, 
  Minimize2, 
  Crosshair, 
  Navigation as NavigationIcon,
  Car,
  LifeBuoy,
  Building,
  Radio,
  Eye,
  Info
} from 'lucide-react';
import { ROUTE_CORRIDORS, ROUTE_SAFE_HAVENS, ROUTE_BARRICADES, ROUTE_SENSOR_TELEMETRY } from '../../../data/routePresetsData';

// 4 High-Reliability Basemap Tile Styles
const TILE_STYLES = {
  carto: {
    name: 'Carto Clean',
    label: 'Clean Day',
    style: {
      version: 8,
      sources: {
        'carto-tiles': {
          type: 'raster',
          tiles: ['https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'],
          tileSize: 256,
          attribution: '&copy; OpenStreetMap &copy; CARTO'
        }
      },
      layers: [{ id: 'carto-tiles-layer', type: 'raster', source: 'carto-tiles', minzoom: 0, maxzoom: 19 }]
    }
  },
  dark: {
    name: 'Dark Matter',
    label: 'Night Ops',
    style: {
      version: 8,
      sources: {
        'dark-tiles': {
          type: 'raster',
          tiles: ['https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png'],
          tileSize: 256,
          attribution: '&copy; OpenStreetMap &copy; CARTO Dark'
        }
      },
      layers: [{ id: 'dark-tiles-layer', type: 'raster', source: 'dark-tiles', minzoom: 0, maxzoom: 19 }]
    }
  },
  satellite: {
    name: 'Satellite',
    label: 'Esri Satellite',
    style: {
      version: 8,
      sources: {
        'sat-tiles': {
          type: 'raster',
          tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{x}/{y}'],
          tileSize: 256,
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed'
        }
      },
      layers: [{ id: 'sat-tiles-layer', type: 'raster', source: 'sat-tiles', minzoom: 0, maxzoom: 19 }]
    }
  },
  topo: {
    name: 'Topographic',
    label: 'Terrain Relief',
    style: {
      version: 8,
      sources: {
        'topo-tiles': {
          type: 'raster',
          tiles: ['https://tile.opentopomap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '&copy; OpenTopoMap contributors'
        }
      },
      layers: [{ id: 'topo-tiles-layer', type: 'raster', source: 'topo-tiles', minzoom: 0, maxzoom: 17 }]
    }
  }
};

// Interpolate vehicle position and heading along polyline coordinates given 0..1 progress
function interpolateRoutePosition(coords, progress) {
  if (!coords || coords.length === 0) return { lng: 72.88, lat: 19.11, bearing: 0 };
  if (coords.length === 1 || progress <= 0) return { lng: coords[0][0], lat: coords[0][1], bearing: 0 };
  if (progress >= 1) {
    const last = coords[coords.length - 1];
    const prev = coords[coords.length - 2];
    const bearing = calculateBearing(prev[1], prev[0], last[1], last[0]);
    return { lng: last[0], lat: last[1], bearing };
  }

  const totalSegments = coords.length - 1;
  const scaledProgress = progress * totalSegments;
  const segIndex = Math.min(Math.floor(scaledProgress), totalSegments - 1);
  const segFraction = scaledProgress - segIndex;

  const p1 = coords[segIndex];
  const p2 = coords[segIndex + 1];

  const lng = p1[0] + (p2[0] - p1[0]) * segFraction;
  const lat = p1[1] + (p2[1] - p1[1]) * segFraction;
  const bearing = calculateBearing(p1[1], p1[0], p2[1], p2[0]);

  return { lng, lat, bearing };
}

function calculateBearing(lat1, lon1, lat2, lon2) {
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const y = Math.sin(dLon) * Math.cos(lat2 * Math.PI / 180);
  const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
            Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLon);
  const brng = Math.atan2(y, x) * 180 / Math.PI;
  return (brng + 360) % 360;
}

export default function SafeRouteMap({
  selectedRouteId = 'safer',
  onSelectRoute = () => {},
  originLoc = null,
  destLoc = null,
  waypoints = [],
  simulatedProgress = 0,
  isSimulating = false,
  scrubbedKm = null,
  onHoverInspection = () => {},
  showShelters = true,
  showBarricades = true,
  showSensors = true,
  focusCoord = null,
  height = 'h-[500px]'
}) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const vehicleMarkerRef = useRef(null);
  const popupRef = useRef(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeTileStyle, setActiveTileStyle] = useState('carto');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredPointInfo, setHoveredPointInfo] = useState(null);
  const [is3DMode, setIs3DMode] = useState(false);

  // Markers refs to clean up between renders
  const markersRef = useRef([]);

  // Active corridor definition
  const activeCorridor = ROUTE_CORRIDORS[selectedRouteId] || ROUTE_CORRIDORS.safer;

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current) return;

    const initialCenter = [72.880, 19.110];

    const map = new Map({
      container: mapContainer.current,
      style: TILE_STYLES[activeTileStyle].style,
      center: initialCenter,
      zoom: 12.2,
      minZoom: 9.0,
      maxZoom: 18.0,
      pitch: is3DMode ? 52 : 0,
      bearing: is3DMode ? -15 : 0,
      attributionControl: true
    });

    map.addControl(new NavigationControl({ visualizePitch: true }), 'top-right');
    map.addControl(new GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: false }), 'top-right');

    map.on('load', () => {
      setMapLoaded(true);
      mapRef.current = map;

      // 1. Add GeoJSON Sources for all 3 corridors
      Object.keys(ROUTE_CORRIDORS).forEach(routeKey => {
        const corridor = ROUTE_CORRIDORS[routeKey];
        map.addSource(`route-source-${routeKey}`, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: { id: corridor.id, name: corridor.name, color: corridor.color },
            geometry: {
              type: 'LineString',
              coordinates: corridor.coordinates
            }
          }
        });

        // Background / Glow halo layer
        map.addLayer({
          id: `route-halo-${routeKey}`,
          type: 'line',
          source: `route-source-${routeKey}`,
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': corridor.color,
            'line-width': routeKey === selectedRouteId ? 14 : 0,
            'line-opacity': routeKey === selectedRouteId ? 0.35 : 0.0
          }
        });

        // Main polyline layer
        map.addLayer({
          id: `route-line-${routeKey}`,
          type: 'line',
          source: `route-source-${routeKey}`,
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': corridor.color,
            'line-width': routeKey === selectedRouteId ? 7 : 4,
            'line-opacity': routeKey === selectedRouteId ? 0.98 : 0.45,
            'line-dasharray': routeKey === 'fastest' ? [2, 2] : [1, 0]
          }
        });

        // Clickable hit-area for route selection
        map.on('click', `route-line-${routeKey}`, () => {
          onSelectRoute(routeKey);
        });

        map.on('mouseenter', `route-line-${routeKey}`, () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', `route-line-${routeKey}`, () => {
          map.getCanvas().style.cursor = '';
        });
      });

      // Fit bounds to the active corridor initially
      fitActiveCorridor(map, activeCorridor.coordinates);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [activeTileStyle]);

  // Handle corridor selection style updates on map layers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    Object.keys(ROUTE_CORRIDORS).forEach(routeKey => {
      const isSelected = routeKey === selectedRouteId;
      const corridor = ROUTE_CORRIDORS[routeKey];

      if (map.getLayer(`route-halo-${routeKey}`)) {
        map.setPaintProperty(`route-halo-${routeKey}`, 'line-width', isSelected ? 16 : 0);
        map.setPaintProperty(`route-halo-${routeKey}`, 'line-opacity', isSelected ? 0.38 : 0.0);
      }
      if (map.getLayer(`route-line-${routeKey}`)) {
        map.setPaintProperty(`route-line-${routeKey}`, 'line-width', isSelected ? 7 : 4);
        map.setPaintProperty(`route-line-${routeKey}`, 'line-opacity', isSelected ? 0.98 : 0.45);
      }
    });

    fitActiveCorridor(map, activeCorridor.coordinates);
  }, [selectedRouteId, mapLoaded]);

  // Fit bounds helper
  const fitActiveCorridor = (map, coords) => {
    if (!map || !coords || coords.length === 0) return;
    try {
      const bounds = coords.reduce((acc, coord) => {
        return acc.extend(coord);
      }, new LngLatBounds(coords[0], coords[0]));

      map.fitBounds(bounds, {
        padding: { top: 70, bottom: 70, left: 70, right: 70 },
        duration: 900
      });
    } catch (e) {
      console.warn('fitBounds error:', e);
    }
  };

  // Fly to focus coordinate if specified (e.g. from turn clicked)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !focusCoord) return;
    map.flyTo({
      center: [focusCoord.lng, focusCoord.lat],
      zoom: 14.5,
      pitch: 45,
      duration: 1200
    });
  }, [focusCoord]);

  // Toggle 3D Perspective Mode
  const toggle3DMode = () => {
    const map = mapRef.current;
    if (!map) return;
    const next3D = !is3DMode;
    setIs3DMode(next3D);
    map.easeTo({
      pitch: next3D ? 54 : 0,
      bearing: next3D ? -20 : 0,
      duration: 1000
    });
  };

  // Update HTML Markers (Origin, Destination, Waypoints, Hazards, Shelters, Barricades, Sensors)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const coords = activeCorridor.coordinates;
    const startCoord = coords[0];
    const endCoord = coords[coords.length - 1];

    // 1. Origin Marker
    const originEl = document.createElement('div');
    originEl.className = 'route-origin-pin flex items-center justify-center cursor-pointer';
    originEl.innerHTML = `
      <div class="relative flex items-center justify-center">
        <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-emerald-400 opacity-75"></span>
        <div class="relative bg-emerald-600 text-white p-2 rounded-full shadow-lg border-2 border-white flex items-center justify-center">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="currentColor"/></svg>
        </div>
        <div class="absolute -bottom-6 bg-emerald-900 text-white font-mono text-[9px] px-1.5 py-0.5 rounded shadow whitespace-nowrap font-bold">
          START
        </div>
      </div>
    `;
    const originMarker = new Marker({ element: originEl })
      .setLngLat(startCoord)
      .setPopup(new Popup({ offset: 25 }).setHTML(`
        <div class="p-2 text-xs font-sans">
          <strong class="text-emerald-700 block text-sm font-bold">Start: ${originLoc?.name || 'Powai Hiranandani'}</strong>
          <span class="text-slate-500 font-mono text-[10px]">MSL Elevation: +22.4m • 0cm Water</span>
        </div>
      `))
      .addTo(map);
    markersRef.current.push(originMarker);

    // 2. Destination Marker
    const destEl = document.createElement('div');
    destEl.className = 'route-dest-pin flex items-center justify-center cursor-pointer';
    destEl.innerHTML = `
      <div class="relative flex items-center justify-center">
        <div class="relative bg-purple-700 text-white p-2 rounded-xl shadow-xl border-2 border-white flex items-center justify-center">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
        </div>
        <div class="absolute -bottom-6 bg-purple-950 text-white font-mono text-[9px] px-1.5 py-0.5 rounded shadow whitespace-nowrap font-bold">
          DESTINATION
        </div>
      </div>
    `;
    const destMarker = new Marker({ element: destEl })
      .setLngLat(endCoord)
      .setPopup(new Popup({ offset: 25 }).setHTML(`
        <div class="p-2 text-xs font-sans">
          <strong class="text-purple-800 block text-sm font-bold">Destination: ${destLoc?.name || 'CSMT Airport T2'}</strong>
          <span class="text-slate-500 font-mono text-[10px]">Arrival Deck • Elevation: +18.2m MSL</span>
        </div>
      `))
      .addTo(map);
    markersRef.current.push(destMarker);

    // 3. User Intermediate Waypoints (if any)
    waypoints.forEach((wp, idx) => {
      const wpEl = document.createElement('div');
      wpEl.className = 'route-wp-pin flex items-center justify-center cursor-pointer';
      wpEl.innerHTML = `
        <div class="bg-blue-600 text-white text-[10px] font-bold w-6 h-6 rounded-full border-2 border-white shadow flex items-center justify-center">
          ${idx + 1}
        </div>
      `;
      const wpMarker = new Marker({ element: wpEl })
        .setLngLat([wp.lng, wp.lat])
        .setPopup(new Popup({ offset: 15 }).setHTML(`
          <div class="p-2 text-xs">
            <strong class="text-blue-700 block font-bold">Stop #${idx + 1}: ${wp.name}</strong>
            <span class="text-slate-500 text-[10px] font-mono">${wp.address || 'Corridor Pitstop'}</span>
          </div>
        `))
        .addTo(map);
      markersRef.current.push(wpMarker);
    });

    // 4. Safe Shelters & Havens along corridor
    if (showShelters) {
      ROUTE_SAFE_HAVENS.forEach(haven => {
        const havenEl = document.createElement('div');
        havenEl.className = 'haven-pin cursor-pointer transform hover:scale-110 transition';
        havenEl.innerHTML = `
          <div class="bg-emerald-50 text-emerald-800 border-2 border-emerald-600 rounded-lg p-1 shadow-md flex items-center gap-1 font-mono text-[10px] font-bold">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>${haven.elevation}</span>
          </div>
        `;
        const havenMarker = new Marker({ element: havenEl })
          .setLngLat([haven.lng, haven.lat])
          .setPopup(new Popup({ offset: 20 }).setHTML(`
            <div class="p-2 text-xs font-sans max-w-[200px]">
              <span class="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold rounded">HIGH GROUND HAVEN</span>
              <strong class="block text-slate-800 font-bold mt-1">${haven.name}</strong>
              <div class="text-[11px] text-slate-600 mt-1">${haven.type} • ${haven.elevation}</div>
              <div class="text-[10px] text-emerald-700 font-medium mt-0.5">${haven.status}</div>
              <div class="text-[10px] text-slate-500 mt-0.5">${haven.capacity}</div>
            </div>
          `))
          .addTo(map);
        markersRef.current.push(havenMarker);
      });
    }

    // 5. Active Barricades / BMC Closures
    if (showBarricades) {
      ROUTE_BARRICADES.forEach(bar => {
        const barEl = document.createElement('div');
        barEl.className = 'barricade-pin cursor-pointer transform hover:scale-110 transition';
        barEl.innerHTML = `
          <div class="bg-rose-600 text-white rounded-lg p-1 border-2 border-white shadow-lg flex items-center justify-center animate-bounce">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </div>
        `;
        const barMarker = new Marker({ element: barEl })
          .setLngLat([bar.lng, bar.lat])
          .setPopup(new Popup({ offset: 20 }).setHTML(`
            <div class="p-2 text-xs font-sans max-w-[220px]">
              <span class="px-1.5 py-0.5 bg-rose-100 text-rose-800 text-[9px] font-mono font-bold rounded">${bar.status}</span>
              <strong class="block text-slate-900 font-bold mt-1">${bar.road}</strong>
              <p class="text-[10px] text-rose-700 mt-1 leading-snug">${bar.reason}</p>
              <div class="text-[9px] bg-slate-100 p-1 rounded font-mono text-slate-700 mt-1">Detour: ${bar.detourRecommended}</div>
            </div>
          `))
          .addTo(map);
        markersRef.current.push(barMarker);
      });
    }

    // 6. Ultrasonic Sensor Telemetry Pins
    if (showSensors) {
      ROUTE_SENSOR_TELEMETRY.forEach(sensor => {
        const sEl = document.createElement('div');
        sEl.className = 'sensor-pin cursor-pointer';
        sEl.innerHTML = `
          <div class="bg-purple-900 text-purple-200 border border-purple-400 rounded-full px-1.5 py-0.5 text-[9px] font-mono shadow flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            <span>${sensor.waterDepthCm}cm</span>
          </div>
        `;
        const sMarker = new Marker({ element: sEl })
          .setLngLat([sensor.lng, sensor.lat])
          .setPopup(new Popup({ offset: 15 }).setHTML(`
            <div class="p-2 text-xs font-sans">
              <span class="text-[9px] font-mono uppercase text-purple-800 font-bold">BMC ULTRASONIC DRAIN SENSOR</span>
              <strong class="block font-bold text-slate-800">${sensor.name}</strong>
              <div class="text-xs font-mono font-bold text-purple-900 mt-1">Water Depth: ${sensor.waterDepthCm} cm</div>
              <div class="text-[10px] text-slate-500 font-mono">Velocity: ${sensor.surfaceVelocity} • Drain: ${sensor.drainCapacity}</div>
            </div>
          `))
          .addTo(map);
        markersRef.current.push(sMarker);
      });
    }

    // 7. Vehicle Simulation Marker
    const vehicleEl = document.createElement('div');
    vehicleEl.className = 'simulated-vehicle-pin relative flex items-center justify-center';
    vehicleEl.innerHTML = `
      <div class="relative flex items-center justify-center">
        <span class="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-primary-soft opacity-75"></span>
        <div id="vehicle-car-icon" class="relative bg-ink text-white p-2 rounded-full shadow-2xl border-2 border-primary flex items-center justify-center transition-transform duration-300">
          <svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z"/><circle cx="7.5" cy="14.5" r="1.5"/><circle cx="16.5" cy="14.5" r="1.5"/></svg>
        </div>
        <div class="absolute -top-6 bg-ink text-white font-mono text-[9px] px-1.5 py-0.5 rounded shadow whitespace-nowrap">
          IN-TRANSIT
        </div>
      </div>
    `;

    const initialPos = interpolateRoutePosition(coords, simulatedProgress);
    const vehicleMarker = new Marker({ element: vehicleEl })
      .setLngLat([initialPos.lng, initialPos.lat])
      .addTo(map);
    vehicleMarkerRef.current = vehicleMarker;

  }, [activeCorridor, originLoc, destLoc, waypoints, showShelters, showBarricades, showSensors, mapLoaded]);

  // Synchronize Vehicle Position during simulation
  useEffect(() => {
    if (!vehicleMarkerRef.current || !activeCorridor) return;
    const coords = activeCorridor.coordinates;
    const pos = interpolateRoutePosition(coords, simulatedProgress);
    vehicleMarkerRef.current.setLngLat([pos.lng, pos.lat]);

    // Rotate the car icon towards heading bearing
    const iconEl = document.getElementById('vehicle-car-icon');
    if (iconEl) {
      iconEl.style.transform = `rotate(${pos.bearing}deg)`;
    }

    // If simulating, pan map along smoothly
    const map = mapRef.current;
    if (map && isSimulating) {
      map.easeTo({
        center: [pos.lng, pos.lat],
        duration: 300,
        pitch: is3DMode ? 52 : 0
      });
    }
  }, [simulatedProgress, activeCorridor, isSimulating, is3DMode]);

  // Handle Scrubbed Km from Elevation Profile
  useEffect(() => {
    const map = mapRef.current;
    if (!map || scrubbedKm === null || !activeCorridor) return;
    const totalKm = activeCorridor.distanceKm;
    const progress = Math.min(1, Math.max(0, scrubbedKm / totalKm));
    const pos = interpolateRoutePosition(activeCorridor.coordinates, progress);
    
    // Position a hover ring on the map
    setHoveredPointInfo({
      lng: pos.lng,
      lat: pos.lat,
      km: scrubbedKm.toFixed(1),
      elevation: activeCorridor.elevationProfile.find(p => Math.abs(p.km - scrubbedKm) < 1.5)?.roadElevation || 22.0
    });
  }, [scrubbedKm, activeCorridor]);

  return (
    <div className={`relative w-full ${height} rounded-2xl overflow-hidden border border-border shadow-card bg-surface-secondary flex flex-col`}>
      {/* Top Floating Controls Bar */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2 pointer-events-auto">
        {/* Route Selector Pills on Map */}
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-lg border border-border/80 flex items-center gap-1 font-mono text-[11px]">
          {['safer', 'balanced', 'fastest'].map(rk => {
            const isSel = selectedRouteId === rk;
            const corr = ROUTE_CORRIDORS[rk];
            return (
              <button
                key={rk}
                onClick={() => onSelectRoute(rk)}
                className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  isSel 
                    ? 'bg-ink text-white shadow-sm' 
                    : 'text-ink-secondary hover:text-ink hover:bg-canvas'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: corr.color }}></span>
                <span className="capitalize">{rk}</span>
                <span className="text-[10px] opacity-75 font-normal">({corr.distanceKm}km)</span>
              </button>
            );
          })}
        </div>

        {/* 3D / 2D Perspective Toggle */}
        <button
          onClick={toggle3DMode}
          className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold shadow-md transition flex items-center gap-1.5 backdrop-blur-md border ${
            is3DMode 
              ? 'bg-primary text-white border-primary' 
              : 'bg-white/95 text-ink-secondary hover:text-ink border-border/80'
          }`}
          title="Toggle 3D Road Pitch"
        >
          <span>{is3DMode ? '3D View' : '2D Plan'}</span>
        </button>
      </div>

      {/* Top-Right Basemap Style Selector */}
      <div className="absolute top-3 right-14 z-10 flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-lg border border-border/80 text-[11px] font-mono">
        {Object.keys(TILE_STYLES).map(styleKey => (
          <button
            key={styleKey}
            onClick={() => setActiveTileStyle(styleKey)}
            className={`px-2 py-1 rounded-lg font-medium transition ${
              activeTileStyle === styleKey
                ? 'bg-primary-soft text-primary-deep font-bold'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            {TILE_STYLES[styleKey].label}
          </button>
        ))}
      </div>

      {/* Recenter & Fit Bounds Button */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={() => fitActiveCorridor(mapRef.current, activeCorridor.coordinates)}
          className="p-2.5 bg-white text-ink rounded-xl shadow-lg border border-border/80 hover:bg-canvas transition flex items-center justify-center"
          title="Fit Route Corridor"
        >
          <Crosshair className="w-4 h-4 text-primary" />
        </button>

        <button
          onClick={() => {
            const map = mapRef.current;
            if (map) map.resetNorthPitch({ duration: 800 });
          }}
          className="p-2.5 bg-white text-ink rounded-xl shadow-lg border border-border/80 hover:bg-canvas transition flex items-center justify-center"
          title="Reset North Orientation"
        >
          <RotateCcw className="w-4 h-4 text-ink-secondary" />
        </button>
      </div>

      {/* Floating Active Corridor Legend Bar (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-border/90 max-w-sm">
        <div className="flex items-center justify-between gap-3 mb-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: activeCorridor.color }}></span>
            <span className="font-extrabold text-xs text-ink truncate">{activeCorridor.name}</span>
          </div>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${activeCorridor.safetyRatingColor}`}>
            {activeCorridor.safetyRating}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 font-mono text-[11px] text-ink-secondary mt-2 pt-2 border-t border-border">
          <div>
            <span className="text-[9px] text-ink-muted block uppercase">ETA</span>
            <span className="font-extrabold text-xs text-ink">{activeCorridor.estimatedMinutes} min</span>
          </div>
          <div>
            <span className="text-[9px] text-ink-muted block uppercase">DISTANCE</span>
            <span className="font-bold text-xs text-ink">{activeCorridor.distanceKm} km</span>
          </div>
          <div>
            <span className="text-[9px] text-ink-muted block uppercase">MAX WATER</span>
            <span className={`font-extrabold text-xs ${activeCorridor.maxWaterDepthCm > 15 ? 'text-rose-600' : 'text-emerald-700'}`}>
              {activeCorridor.maxWaterDepthCm} cm
            </span>
          </div>
        </div>
      </div>

      {/* Map Container DOM element */}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}

