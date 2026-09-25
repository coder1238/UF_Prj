import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Map, NavigationControl, GeolocateControl, Marker, Popup } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { 
  ZoomIn, ZoomOut, Compass, Maximize2, Minimize2, MapPin, 
  Layers, Radio, Home, HeartHandshake, Eye, EyeOff, Sliders,
  CheckCircle2, AlertTriangle, AlertOctagon, Droplets, Ruler,
  Navigation, Crosshair, RefreshCw, Sparkles, X
} from 'lucide-react';
import { GNN_RUNOFF_ZONES_GEOJSON } from '../../data/communityData';

const CARTO_API_KEY = import.meta.env.VITE_CARTO_API_KEY?.trim();

// Generates tile URLs: uses CARTO if user provided an API key; otherwise falls back to free high-reliability Esri basemaps
const getBasemapTiles = (cartoType, esriService) => {
  if (CARTO_API_KEY) {
    const hosts = ['a', 'b', 'c', 'd'];
    return hosts.map((h) =>
      `https://${h}.basemaps.cartocdn.com/${cartoType}/{z}/{x}/{y}.png?key=${CARTO_API_KEY}`
    );
  }
  return [`https://server.arcgisonline.com/ArcGIS/rest/services/${esriService}/MapServer/tile/{z}/{y}/{x}`];
};

const getBasemapAttribution = () => {
  if (CARTO_API_KEY) {
    return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
  }
  return '&copy; <a href="https://www.esri.com/">Esri</a>, HERE, Garmin, USGS, NGA';
};

// 4 High-Resolution Map Tile Basemap Styles (Fast, zero watermark)
const BASEMAP_STYLES = {
  osm: {
    id: 'osm',
    name: 'OSM Standard',
    tiles: [
      'https://tile.openstreetmap.de/{z}/{x}/{y}.png',
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
    ],
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  carto: {
    id: 'carto',
    name: CARTO_API_KEY ? 'Carto Clean' : 'Street Map',
    tiles: getBasemapTiles('rastertiles/voyager', 'World_Street_Map'),
    attribution: getBasemapAttribution()
  },
  dark: {
    id: 'dark',
    name: CARTO_API_KEY ? 'Tactical Dark' : 'Dark Matter',
    tiles: getBasemapTiles('dark_all', 'Canvas/World_Dark_Gray_Base'),
    attribution: getBasemapAttribution()
  },
  satellite: {
    id: 'satellite',
    name: 'Satellite Recon',
    tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
    attribution: '&copy; Esri World Imagery'
  }
};

// Calculate Haversine distance between two [lng, lat] points
function calculateDistanceMeters(p1, p2) {
  const R = 6371e3; // metres
  const φ1 = (p1[1] * Math.PI) / 180;
  const φ2 = (p2[1] * Math.PI) / 180;
  const Δφ = ((p2[1] - p1[1]) * Math.PI) / 180;
  const Δλ = ((p2[0] - p1[0]) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export default function CommunityMapCanvas({
  reports = [],
  iotSensors = [],
  aidRequests = [],
  shelters = [],
  selectedReport = null,
  onSelectReport = () => {},
  onSelectSensor = () => {},
  onCorroborate = () => {},
  mapLayers = {
    crowdsourced: true,
    iotSensors: true,
    gnnModel: true,
    aidPosts: true,
    shelters: true,
    heatmap: false
  },
  onToggleLayer = () => {},
  isPinDropActive = false,
  onCancelPinDrop = () => {},
  onMapPinDrop = () => {},
  centerCoordinates = null
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const measureMarkersRef = useRef([]);

  const [activeBasemap, setActiveBasemap] = useState('osm');
  const [mapPitch, setMapPitch] = useState(0);
  const [mapBearing, setMapBearing] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activePopupInfo, setActivePopupInfo] = useState(null);

  // Distance measurement mode state
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measurePoints, setMeasurePoints] = useState([]);
  const [measureResult, setMeasureResult] = useState(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initialCenter = centerCoordinates 
      ? [centerCoordinates.lng, centerCoordinates.lat] 
      : [72.8550, 19.0650];

    const map = new Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'basemap-tiles': {
            type: 'raster',
            tiles: (BASEMAP_STYLES[activeBasemap] || BASEMAP_STYLES.osm || BASEMAP_STYLES.carto)?.tiles,
            tileSize: 256,
            attribution: (BASEMAP_STYLES[activeBasemap] || BASEMAP_STYLES.osm || BASEMAP_STYLES.carto)?.attribution
          }
        },
        layers: [
          {
            id: 'basemap-layer',
            type: 'raster',
            source: 'basemap-tiles',
            minzoom: 0,
            maxzoom: 20
          }
        ]
      },
      center: initialCenter,
      zoom: 12.8,
      pitch: 0,
      bearing: 0,
      antialias: true
    });

    mapInstanceRef.current = map;

    map.on('rotate', () => {
      setMapBearing(Math.round(map.getBearing()));
    });
    map.on('pitch', () => {
      setMapPitch(Math.round(map.getPitch()));
    });

    map.on('load', () => {
      // Add GNN Runoff Vector Source & Fill Layer
      if (!map.getSource('gnn-runoff-mesh')) {
        map.addSource('gnn-runoff-mesh', {
          type: 'geojson',
          data: GNN_RUNOFF_ZONES_GEOJSON
        });

        map.addLayer({
          id: 'gnn-runoff-fill',
          type: 'fill',
          source: 'gnn-runoff-mesh',
          paint: {
            'fill-color': '#6D4AFF',
            'fill-opacity': mapLayers.gnnModel ? 0.28 : 0.0
          }
        });

        map.addLayer({
          id: 'gnn-runoff-outline',
          type: 'line',
          source: 'gnn-runoff-mesh',
          paint: {
            'line-color': '#4624C4',
            'line-width': 2.5,
            'line-dasharray': [2, 1],
            'line-opacity': mapLayers.gnnModel ? 0.8 : 0.0
          }
        });
      }

      // Add Heatmap Source & Layer for Crowdsource Density
      const heatmapFeatures = reports.map(r => ({
        type: 'Feature',
        properties: { depth: r.depth || 10 },
        geometry: { type: 'Point', coordinates: [r.coordinates.lng, r.coordinates.lat] }
      }));

      if (!map.getSource('reports-heatmap-src')) {
        map.addSource('reports-heatmap-src', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: heatmapFeatures }
        });

        map.addLayer({
          id: 'reports-heatmap-layer',
          type: 'heatmap',
          source: 'reports-heatmap-src',
          maxzoom: 17,
          paint: {
            'heatmap-weight': ['interpolate', ['linear'], ['get', 'depth'], 0, 0.2, 50, 1],
            'heatmap-intensity': 1.4,
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0, 'rgba(109,74,255,0)',
              0.2, 'rgba(56,189,248,0.5)',
              0.4, 'rgba(250,204,21,0.7)',
              0.7, 'rgba(249,115,22,0.85)',
              1, 'rgba(239,68,68,0.95)'
            ],
            'heatmap-radius': 35,
            'heatmap-opacity': mapLayers.heatmap ? 0.85 : 0.0
          }
        });
      }
    });

    // Map Click Handler (For Pin Drop or Measurement)
    map.on('click', (e) => {
      const { lng, lat } = e.lngLat;

      if (isPinDropActive) {
        onMapPinDrop({ lat: Number(lat.toFixed(5)), lng: Number(lng.toFixed(5)) });
        return;
      }

      if (isMeasuring) {
        setMeasurePoints(prev => {
          const updated = [...prev, [lng, lat]];
          if (updated.length === 2) {
            const dist = calculateDistanceMeters(updated[0], updated[1]);
            setMeasureResult(dist);
          } else if (updated.length > 2) {
            setMeasureResult(null);
            return [[lng, lat]];
          }
          return updated;
        });
      }
    });

    return () => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      map.remove();
    };
  }, []);

  // Update Basemap Tiles when selected
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const source = map.getSource('basemap-tiles');
    const newTiles = (BASEMAP_STYLES[activeBasemap] || BASEMAP_STYLES.osm || BASEMAP_STYLES.carto)?.tiles;
    if (source && source.setTiles && newTiles) {
      source.setTiles(newTiles);
    }
  }, [activeBasemap]);

  // Update GNN and Heatmap layer visibility
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !map.isStyleLoaded()) return;

    if (map.getLayer('gnn-runoff-fill')) {
      map.setPaintProperty('gnn-runoff-fill', 'fill-opacity', mapLayers.gnnModel ? 0.28 : 0);
      map.setPaintProperty('gnn-runoff-outline', 'line-opacity', mapLayers.gnnModel ? 0.8 : 0);
    }

    if (map.getLayer('reports-heatmap-layer')) {
      map.setPaintProperty('reports-heatmap-layer', 'heatmap-opacity', mapLayers.heatmap ? 0.85 : 0);
    }

    const heatSrc = map.getSource('reports-heatmap-src');
    if (heatSrc) {
      heatSrc.setData({
        type: 'FeatureCollection',
        features: reports.map(r => ({
          type: 'Feature',
          properties: { depth: r.depth || 10 },
          geometry: { type: 'Point', coordinates: [r.coordinates.lng, r.coordinates.lat] }
        }))
      });
    }
  }, [mapLayers, reports]);

  // Fly camera to selected report or centerCoordinates
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (centerCoordinates) {
      map.flyTo({
        center: [centerCoordinates.lng, centerCoordinates.lat],
        zoom: 14.5,
        speed: 1.2,
        curve: 1.4
      });
    } else if (selectedReport) {
      map.flyTo({
        center: [selectedReport.coordinates.lng, selectedReport.coordinates.lat],
        zoom: 15.2,
        speed: 1.2,
        curve: 1.4
      });
    }
  }, [centerCoordinates, selectedReport]);

  // Render Dynamic HTML Custom Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // 1. Citizen Observation Markers
    if (mapLayers.crowdsourced) {
      reports.forEach(report => {
        const el = document.createElement('div');
        el.className = 'group cursor-pointer relative';

        const isSelected = selectedReport?.id === report.id;
        const depth = report.depth || 0;
        const isCritical = depth > 30 || report.category === 'Open Manhole';

        // Color coding by severity
        let colorBg = 'bg-amber-500';
        let ringColor = 'ring-amber-300';
        let pulseClass = '';

        if (report.category === 'Receding / Cleared') {
          colorBg = 'bg-emerald-500';
          ringColor = 'ring-emerald-300';
        } else if (depth > 35 || report.category === 'Open Manhole' || report.category === 'Electrical Hazard') {
          colorBg = 'bg-red-600';
          ringColor = 'ring-red-300';
          pulseClass = 'animate-ping opacity-60';
        } else if (depth >= 18) {
          colorBg = 'bg-amber-500';
          ringColor = 'ring-amber-300';
        } else {
          colorBg = 'bg-yellow-500';
          ringColor = 'ring-yellow-300';
        }

        el.innerHTML = `
          <div class="relative flex items-center justify-center">
            ${isCritical ? `<div class="absolute -inset-1 rounded-full ${colorBg} ${pulseClass}"></div>` : ''}
            <div class="w-8 h-8 rounded-full ${colorBg} text-white flex items-center justify-center shadow-lg ring-2 ${ringColor} ${isSelected ? 'scale-125 ring-4 ring-purple-primary shadow-purple-500/50' : 'hover:scale-110'} transition-transform">
              <span class="text-[10px] font-mono font-black">${depth > 0 ? depth : '!'}</span>
            </div>
            <div class="absolute -bottom-4 whitespace-nowrap bg-ink/90 text-white text-[9px] font-mono px-1.5 py-0.5 rounded shadow opacity-90">
              ${report.id}
            </div>
          </div>
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          onSelectReport(report);
          setActivePopupInfo({
            type: 'report',
            data: report,
            coordinates: [report.coordinates.lng, report.coordinates.lat]
          });
        });

        const marker = new Marker({ element: el })
          .setLngLat([report.coordinates.lng, report.coordinates.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    // 2. IoT Ultrasonic Depth Sensor Markers
    if (mapLayers.iotSensors) {
      iotSensors.forEach(sensor => {
        const el = document.createElement('div');
        el.className = 'group cursor-pointer relative';

        el.innerHTML = `
          <div class="relative flex items-center justify-center">
            <div class="absolute -inset-1.5 rounded-full bg-cyan-400 animate-pulse opacity-40"></div>
            <div class="w-7 h-7 rounded-lg bg-cyan-600 text-white flex items-center justify-center shadow-md ring-2 ring-cyan-200 hover:scale-115 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/>
              </svg>
            </div>
            <div class="absolute -top-3.5 bg-cyan-900 text-cyan-100 text-[8px] font-mono font-bold px-1 rounded shadow">
              ${sensor.currentDepthCm}cm
            </div>
          </div>
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          onSelectSensor(sensor);
          setActivePopupInfo({
            type: 'sensor',
            data: sensor,
            coordinates: [sensor.coordinates.lng, sensor.coordinates.lat]
          });
        });

        const marker = new Marker({ element: el })
          .setLngLat([sensor.coordinates.lng, sensor.coordinates.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    // 3. Mutual Aid SOS Posts Markers
    if (mapLayers.aidPosts) {
      aidRequests.forEach(aid => {
        const el = document.createElement('div');
        el.className = 'group cursor-pointer relative';

        el.innerHTML = `
          <div class="relative flex items-center justify-center">
            <div class="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md ring-2 ring-emerald-200 hover:scale-115 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="m11 17 2 2a1 1 0 0 0 1.4 0l4.3-4.3a1 1 0 0 0 0-1.4l-2-2a1 1 0 0 0-1.4 0l-4.3 4.3a1 1 0 0 0 0 1.4Z"/><path d="m18 10 3-3a1 1 0 0 0 0-1.4l-2.6-2.6a1 1 0 0 0-1.4 0l-3 3"/><path d="m14 14 3-3"/><path d="M10 18l-3 3a1 1 0 0 1-1.4 0l-2.6-2.6a1 1 0 0 1 0-1.4l3-3"/><path d="m10 10-3-3"/>
              </svg>
            </div>
          </div>
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          setActivePopupInfo({
            type: 'aid',
            data: aid,
            coordinates: [aid.coordinates.lng, aid.coordinates.lat]
          });
        });

        const marker = new Marker({ element: el })
          .setLngLat([aid.coordinates.lng, aid.coordinates.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    // 4. Safe Shelters Markers
    if (mapLayers.shelters) {
      shelters.forEach(shelter => {
        const el = document.createElement('div');
        el.className = 'group cursor-pointer relative';

        el.innerHTML = `
          <div class="relative flex items-center justify-center">
            <div class="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-md ring-2 ring-indigo-200 hover:scale-115 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
          </div>
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          setActivePopupInfo({
            type: 'shelter',
            data: shelter,
            coordinates: [shelter.coordinates.lng, shelter.coordinates.lat]
          });
        });

        const marker = new Marker({ element: el })
          .setLngLat([shelter.coordinates.lng, shelter.coordinates.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    }
  }, [reports, iotSensors, aidRequests, shelters, mapLayers, selectedReport]);

  // Handle Measurement Markers & Dynamic Line
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    measureMarkersRef.current.forEach(m => m.remove());
    measureMarkersRef.current = [];

    measurePoints.forEach((pt, idx) => {
      const el = document.createElement('div');
      el.className = 'w-5 h-5 rounded-full bg-purple-primary text-white text-[10px] font-bold flex items-center justify-center shadow-lg ring-2 ring-white';
      el.innerText = idx === 0 ? 'A' : 'B';

      const marker = new Marker({ element: el })
        .setLngLat(pt)
        .addTo(map);

      measureMarkersRef.current.push(marker);
    });

    // Update measure line GeoJSON
    if (map.isStyleLoaded()) {
      const lineData = measurePoints.length === 2 ? {
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: measurePoints }
      } : { type: 'FeatureCollection', features: [] };

      if (!map.getSource('measure-line-src')) {
        map.addSource('measure-line-src', { type: 'geojson', data: lineData });
        map.addLayer({
          id: 'measure-line-layer',
          type: 'line',
          source: 'measure-line-src',
          paint: {
            'line-color': '#6D4AFF',
            'line-width': 3,
            'line-dasharray': [2, 2]
          }
        });
      } else {
        map.getSource('measure-line-src').setData(lineData);
      }
    }
  }, [measurePoints]);

  // Tilt controls
  const handleTogglePitch = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const nextPitch = mapPitch > 30 ? 0 : 55;
    map.easeTo({ pitch: nextPitch, duration: 600 });
  };

  // Reset compass/bearing
  const handleResetBearing = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.easeTo({ bearing: 0, pitch: 0, duration: 600 });
  };

  // Geolocate user
  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const map = mapInstanceRef.current;
        if (!map) return;
        const coords = { lng: pos.coords.longitude, lat: pos.coords.latitude };
        map.flyTo({ center: [coords.lng, coords.lat], zoom: 15, duration: 1000 });
      },
      () => {
        // Fallback to central Mumbai
        const map = mapInstanceRef.current;
        if (map) map.flyTo({ center: [72.8550, 19.0650], zoom: 13 });
      }
    );
  };

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-900 transition-all ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[540px] w-full'}`}>
      
      {/* Map Container */}
      <div 
        ref={mapContainerRef} 
        className={`w-full h-full ${isPinDropActive ? 'cursor-crosshair' : ''}`} 
      />

      {/* Pin-Drop Active Banner */}
      {isPinDropActive && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-purple-primary text-white px-5 py-2.5 rounded-full shadow-xl border border-purple-300/40 flex items-center gap-3 animate-bounce">
          <Crosshair className="w-4 h-4 animate-spin text-purple-200" />
          <span className="text-xs font-semibold">Click anywhere on the map to log flood observation</span>
          <button 
            onClick={onCancelPinDrop}
            className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Measurement Mode Active Banner */}
      {isMeasuring && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-slate-900/95 text-white px-4 py-2 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 text-xs font-mono">
          <Ruler className="w-4 h-4 text-purple-400" />
          <span>
            {measurePoints.length === 0 && 'Click Point A (Hazard/Start)'}
            {measurePoints.length === 1 && 'Click Point B (Shelter/End)'}
            {measurePoints.length === 2 && `Direct Distance: ${measureResult >= 1000 ? (measureResult / 1000).toFixed(2) + ' km' : measureResult + ' meters'}`}
          </span>
          <button 
            onClick={() => {
              setIsMeasuring(false);
              setMeasurePoints([]);
              setMeasureResult(null);
            }}
            className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 ml-2"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Top Left: Basemap Style Switcher */}
      <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/80 shadow-md flex items-center gap-1">
        {Object.values(BASEMAP_STYLES).map(style => (
          <button
            key={style.id}
            onClick={() => setActiveBasemap(style.id)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-semibold transition-all ${
              activeBasemap === style.id
                ? 'bg-purple-primary text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {style.name}
          </button>
        ))}
      </div>

      {/* Top Right: Map Tools & Layer Toggles */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 items-end">
        {/* Quick Action Tools */}
        <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/80 shadow-md flex items-center gap-1">
          <button
            onClick={() => {
              const map = mapInstanceRef.current;
              if (map) map.zoomIn({ duration: 300 });
            }}
            title="Zoom In"
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              const map = mapInstanceRef.current;
              if (map) map.zoomOut({ duration: 300 });
            }}
            title="Zoom Out"
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleTogglePitch}
            title={mapPitch > 30 ? "2D Flat View" : "3D Oblique View"}
            className={`px-2 py-1 rounded-xl text-[11px] font-mono font-bold transition-all ${
              mapPitch > 30 ? 'bg-purple-50 text-purple-primary border border-purple-200' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            3D
          </button>
          <button
            onClick={handleResetBearing}
            title="Reset North Compass"
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Compass className={`w-4 h-4 transition-transform duration-300 ${mapBearing !== 0 ? 'text-purple-primary -rotate-45' : ''}`} />
          </button>
          <button
            onClick={handleGeolocate}
            title="Find My Location"
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Crosshair className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setIsMeasuring(!isMeasuring);
              setMeasurePoints([]);
              setMeasureResult(null);
            }}
            title="Measure Distance"
            className={`p-2 rounded-xl transition-colors ${
              isMeasuring ? 'bg-purple-primary text-white' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Ruler className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Map"}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Layer Visibility Quick Badges */}
        <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-200/80 shadow-md flex items-center gap-3 text-xs font-mono">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={mapLayers.crowdsourced}
              onChange={e => onToggleLayer('crowdsourced', e.target.checked)}
              className="accent-purple-primary rounded"
            />
            <span className="font-semibold text-ink text-[11px]">Crowd ({reports.length})</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={mapLayers.iotSensors}
              onChange={e => onToggleLayer('iotSensors', e.target.checked)}
              className="accent-cyan-600 rounded"
            />
            <span className="font-semibold text-cyan-800 text-[11px]">IoT Sensors ({iotSensors.length})</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={mapLayers.gnnModel}
              onChange={e => onToggleLayer('gnnModel', e.target.checked)}
              className="accent-purple-primary rounded"
            />
            <span className="font-semibold text-purple-700 text-[11px]">GNN Mesh</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={mapLayers.aidPosts}
              onChange={e => onToggleLayer('aidPosts', e.target.checked)}
              className="accent-emerald-600 rounded"
            />
            <span className="font-semibold text-emerald-800 text-[11px]">Aid SOS ({aidRequests.length})</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={mapLayers.shelters}
              onChange={e => onToggleLayer('shelters', e.target.checked)}
              className="accent-indigo-600 rounded"
            />
            <span className="font-semibold text-indigo-800 text-[11px]">Shelters ({shelters.length})</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer border-l border-slate-200 pl-2">
            <input
              type="checkbox"
              checked={mapLayers.heatmap}
              onChange={e => onToggleLayer('heatmap', e.target.checked)}
              className="accent-red-600 rounded"
            />
            <span className="font-bold text-red-600 text-[11px]">Heatmap</span>
          </label>
        </div>
      </div>

      {/* Bottom Center: Map Legend & Spatial Convergence Indicator */}
      <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none flex items-center justify-between">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200/80 shadow-md flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-slate-700 text-[11px]">Severe &gt;30cm</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-700 text-[11px]">15–30cm Caution</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span className="text-slate-700 text-[11px]">&lt;15cm Minor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
            <span className="text-cyan-800 text-[11px]">IoT Ultrasound</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-purple-500/40 border border-purple-600" />
            <span className="text-purple-800 text-[11px]">GNN Runoff Vector</span>
          </div>
        </div>

        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-slate-800 shadow-md text-[11px] font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Telemetry Convergence: <strong>97.8%</strong> Alignment</span>
        </div>
      </div>

      {/* Interactive Selected Marker Bottom Sheet / Modal Overlay */}
      {activePopupInfo && (
        <div className="absolute top-16 left-4 max-w-sm w-full z-30 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200 shadow-xl transition-all animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-purple-primary">
                {activePopupInfo.type === 'report' && `Citizen Hazard Pin • ${activePopupInfo.data.id}`}
                {activePopupInfo.type === 'sensor' && `IoT Ultrasonic Gauge • ${activePopupInfo.data.id}`}
                {activePopupInfo.type === 'aid' && `Mutual Aid SOS • ${activePopupInfo.data.id}`}
                {activePopupInfo.type === 'shelter' && `Safe Evacuation Haven • ${activePopupInfo.data.id}`}
              </span>
              <h4 className="text-sm font-bold text-ink leading-tight">
                {activePopupInfo.data.title || activePopupInfo.data.name}
              </h4>
            </div>
            <button 
              onClick={() => setActivePopupInfo(null)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-muted mb-2 line-clamp-2">
            {activePopupInfo.data.description || activePopupInfo.data.location}
          </p>

          {activePopupInfo.type === 'report' && (
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between font-mono">
                <span className="text-muted">Water Depth:</span>
                <span className="font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  {activePopupInfo.data.depth} cm
                </span>
              </div>
              <div className="flex items-center justify-between font-mono text-[11px] text-muted">
                <span>Agreement: {activePopupInfo.data.agreementPct}%</span>
                <span>Scout: {activePopupInfo.data.scoutName}</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    onCorroborate(activePopupInfo.data.id);
                    setActivePopupInfo(null);
                  }}
                  className="flex-1 py-1.5 bg-purple-primary hover:bg-purple-deep text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Corroborate (+1)
                </button>
                <button
                  onClick={() => {
                    onSelectReport(activePopupInfo.data);
                    setActivePopupInfo(null);
                  }}
                  className="px-3 py-1.5 bg-canvas border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          )}

          {activePopupInfo.type === 'sensor' && (
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-muted">Current Depth:</span>
                <span className="font-bold text-cyan-700">{activePopupInfo.data.currentDepthCm} cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Battery & Signal:</span>
                <span className="font-bold text-emerald-700">{activePopupInfo.data.batteryPct}% • {activePopupInfo.data.rssiSignalDbm} dBm</span>
              </div>
            </div>
          )}

          {activePopupInfo.type === 'shelter' && (
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex justify-between font-mono">
                <span className="text-muted">Occupancy:</span>
                <span className="font-bold text-indigo-700">{activePopupInfo.data.currentOccupants} / {activePopupInfo.data.capacity}</span>
              </div>
              <div className="text-[11px] text-muted font-mono">
                Elevation: {activePopupInfo.data.elevationMeters}m AMSL (Dry ground guaranteed)
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
