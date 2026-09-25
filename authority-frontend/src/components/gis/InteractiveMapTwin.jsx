import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Map as MapLibreMap, Popup as MapLibrePopup } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useFloodCommand } from '../../context/FloodCommandContext';
import {
  ROAD_CORRIDORS,
  CRITICAL_ASSETS,
  DRAINAGE_NODES,
  RADAR_CELLS,
  CCTV_FEEDS,
  DEM_CONTOURS_GEOJSON,
  WARDS,
} from '../../data/floodData';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  Compass,
  Rotate3d,
  LocateFixed,
  AlertTriangle,
  Radio,
  Map as MapIcon,
  Check,
  Shield,
  Activity,
  Crosshair,
  Ruler,
} from 'lucide-react';

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

// Real Tile Providers (OpenStreetMap, Street/Light, Tactical Dark, Satellite Aerial) - Fast, zero watermark
const BASEMAP_STYLES = {
  osmStandard: {
    id: 'osmStandard',
    name: 'OpenStreetMap Standard',
    style: {
      version: 8,
      sources: {
        'osm-tiles': {
          type: 'raster',
          tiles: [
            'https://tile.openstreetmap.de/{z}/{x}/{y}.png',
            'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          ],
          tileSize: 256,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        },
      },
      layers: [{ id: 'osm-tiles-layer', type: 'raster', source: 'osm-tiles', minzoom: 0, maxzoom: 19 }],
    },
  },
  cartoLight: {
    id: 'cartoLight',
    name: CARTO_API_KEY ? 'Carto Light (GIS)' : 'Street GIS (Esri)',
    style: {
      version: 8,
      sources: {
        'carto-tiles': {
          type: 'raster',
          tiles: getBasemapTiles('light_all', 'World_Street_Map'),
          tileSize: 256,
          attribution: getBasemapAttribution(),
        },
      },
      layers: [{ id: 'carto-tiles-layer', type: 'raster', source: 'carto-tiles', minzoom: 0, maxzoom: 19 }],
    },
  },
  cartoDark: {
    id: 'cartoDark',
    name: CARTO_API_KEY ? 'Dark Tactical (Ops)' : 'Tactical Dark (Esri)',
    style: {
      version: 8,
      sources: {
        'dark-tiles': {
          type: 'raster',
          tiles: getBasemapTiles('dark_all', 'Canvas/World_Dark_Gray_Base'),
          tileSize: 256,
          attribution: getBasemapAttribution(),
        },
      },
      layers: [{ id: 'dark-tiles-layer', type: 'raster', source: 'dark-tiles', minzoom: 0, maxzoom: 19 }],
    },
  },
  satellite: {
    id: 'satellite',
    name: 'Satellite Aerial (Esri)',
    style: {
      version: 8,
      sources: {
        'satellite-tiles': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          ],
          tileSize: 256,
          attribution: '&copy; Esri & Maxar',
        },
      },
      layers: [{ id: 'satellite-tiles-layer', type: 'raster', source: 'satellite-tiles', minzoom: 0, maxzoom: 19 }],
    },
  },
};

// GeoJSON Features for Mumbai Flood Modeling
const MITHI_RIVER_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Mithi River Basin Channel', flow: 'Tidal Outfall to Mahim Bay', velocity: '1.2 m/s' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [72.908, 19.148],
          [72.898, 19.125],
          [72.885, 19.095],
          [72.875, 19.075],
          [72.862, 19.058],
          [72.845, 19.046],
          [72.833, 19.039],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Vakola Nullah Confluence', flow: 'Confluence at BKC', velocity: '0.8 m/s' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [72.865, 19.088],
          [72.862, 19.072],
          [72.864, 19.062],
        ],
      },
    },
  ],
};

const INUNDATION_ZONES_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Sion East Circle Lowland Depressions', depthCm: 43, risk: 'CRITICAL' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [72.855, 19.034],
            [72.868, 19.035],
            [72.869, 19.045],
            [72.858, 19.044],
            [72.855, 19.034],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Kurla West LBS Sump Area', depthCm: 31, risk: 'HIGH' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [72.876, 19.058],
            [72.890, 19.061],
            [72.888, 19.071],
            [72.875, 19.069],
            [72.876, 19.058],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Andheri Subway Inundation Basin', depthCm: 52, risk: 'CRITICAL' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [72.841, 19.115],
            [72.852, 19.116],
            [72.851, 19.124],
            [72.840, 19.123],
            [72.841, 19.115],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Hindmata Dadar Underpass Corridor', depthCm: 29, risk: 'HIGH' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [72.838, 19.010],
            [72.849, 19.011],
            [72.848, 19.019],
            [72.837, 19.018],
            [72.838, 19.010],
          ],
        ],
      },
    },
  ],
};

const PREDICTED_FLOOD_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Predicted +60m Inundation Spread (Sion-Kurla Confluence)', depthCm: 65, horizon: '+60m Peak' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [72.850, 19.028],
            [72.875, 19.030],
            [72.880, 19.055],
            [72.898, 19.065],
            [72.892, 19.078],
            [72.868, 19.075],
            [72.850, 19.045],
            [72.850, 19.028],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Predicted +60m Inundation Spread (Andheri MIDC Basin)', depthCm: 68, horizon: '+60m Peak' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [72.835, 19.110],
            [72.858, 19.112],
            [72.856, 19.130],
            [72.835, 19.128],
            [72.835, 19.110],
          ],
        ],
      },
    },
  ],
};

const ROADS_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { id: 'lbs-marg', name: 'LBS Marg (Kurla-Ghatkopar)', depth: 31, status: 'HIGH RISK', color: '#C58A25' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [72.878, 19.055],
          [72.8835, 19.0645],
          [72.891, 19.082],
          [72.905, 19.098],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { id: 'andheri-subway', name: 'Andheri Subway Underpass', depth: 52, status: 'CRITICAL', color: '#D94A4A' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [72.842, 19.1197],
          [72.8468, 19.1197],
          [72.853, 19.1197],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { id: 'sion-circle', name: 'Sion East Circle Junction', depth: 43, status: 'CRITICAL', color: '#D94A4A' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [72.858, 19.035],
          [72.8619, 19.0392],
          [72.866, 19.045],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { id: 'milan-subway', name: 'Milan Subway Underpass', depth: 48, status: 'CRITICAL', color: '#D94A4A' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [72.838, 19.0883],
          [72.8427, 19.0883],
          [72.848, 19.0883],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { id: 'hindmata', name: 'Hindmata Cinema / Dadar Underpass', depth: 29, status: 'HIGH RISK', color: '#C58A25' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [72.841, 19.010],
          [72.8432, 19.0144],
          [72.845, 19.020],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { id: 'eeh-corridor', name: 'Eastern Express Highway (Clear Alternative)', depth: 4, status: 'SAFE', color: '#3B8F67' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [72.865, 19.030],
          [72.875, 19.055],
          [72.890, 19.085],
          [72.915, 19.125],
        ],
      },
    },
  ],
};

const DRAINAGE_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { id: 'D-204', name: 'Manhole D-204 (Kurla)', status: 'NEAR SURCHARGE', load: '87%' }, geometry: { type: 'Point', coordinates: [72.8835, 19.0645] } },
    { type: 'Feature', properties: { id: 'D-189', name: 'Node D-189 (Sion Circle)', status: 'OVERLOADED', load: '94%' }, geometry: { type: 'Point', coordinates: [72.8619, 19.0392] } },
    { type: 'Feature', properties: { id: 'D-302', name: 'Node D-302 (Andheri MIDC)', status: 'SURCHARGING', load: '100%' }, geometry: { type: 'Point', coordinates: [72.8468, 19.1197] } },
    { type: 'Feature', properties: { id: 'D-112', name: 'Node D-112 (Hindmata Dadar)', status: 'NEAR SURCHARGE', load: '84%' }, geometry: { type: 'Point', coordinates: [72.8432, 19.0144] } },
    { type: 'Feature', properties: { id: 'D-405', name: 'Node D-405 (Milan Subway Sump)', status: 'SURCHARGING', load: '98%' }, geometry: { type: 'Point', coordinates: [72.8427, 19.0883] } },
    { type: 'Feature', properties: { id: 'D-088', name: 'Outfall D-088 (Mahim Creek)', status: 'TIDAL LOCKOUT', load: '92%' }, geometry: { type: 'Point', coordinates: [72.835, 19.040] } },
  ],
};

export default function InteractiveMapTwin({
  height = 'calc(100vh - 240px)',
  showLayerToggle = true,
  onSelectRoad,
  onSelectNode,
  onSelectAsset,
  onSelectCCTV,
  onSelectRescue,
  onSelectCitizenReport,
  splitMode = false,
  splitSide = 'live', // 'live' | 'peak'
  customCenter = [72.868, 19.075],
  customZoom = 12.0,
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedBasemap, setSelectedBasemap] = useState('osmStandard');
  const [is3D, setIs3D] = useState(false);
  const [showLayersDropdown, setShowLayersDropdown] = useState(false);
  const [showBasemapDropdown, setShowBasemapDropdown] = useState(false);
  const basemapRef = useRef(null);
  const layersRef = useRef(null);

  useEffect(() => {
    function handleMapMenuClickOutside(event) {
      if (basemapRef.current && !basemapRef.current.contains(event.target)) {
        setShowBasemapDropdown(false);
      }
      if (layersRef.current && !layersRef.current.contains(event.target)) {
        setShowLayersDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleMapMenuClickOutside);
    return () => document.removeEventListener('mousedown', handleMapMenuClickOutside);
  }, []);

  const {
    nowcastMinutes,
    activeLayers,
    toggleLayer,
    selectedRoad,
    setSelectedRoad,
    selectedNode,
    setSelectedNode,
    selectedAsset,
    setSelectedAsset,
    selectedWard,
    activeMapTool,
    setInspectedPoint,
    rulerPoints,
    setRulerPoints,
    placedBarriers,
    addBarrier,
    rescueFleet,
    citizenReportsList,
    activeSafeRoute,
    mapFocusTarget,
  } = useFloodCommand();

  // Fly to target when mapFocusTarget is triggered
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLoaded || !mapFocusTarget || !mapFocusTarget.coords) return;
    map.flyTo({
      center: mapFocusTarget.coords,
      zoom: mapFocusTarget.zoom || 14.5,
      essential: true,
      duration: 1200,
    });
    if (mapFocusTarget.title) {
      new MapLibrePopup({ closeButton: true, offset: 12 })
        .setLngLat(mapFocusTarget.coords)
        .setHTML(
          `<div style="font-family: inherit; font-size: 12px; padding: 4px;">
            <div style="font-weight: bold; color: #6D4AFF;">📍 ${mapFocusTarget.title}</div>
            <div style="font-size: 11px; color: #706B78; margin-top: 2px;">${mapFocusTarget.subtitle || 'Focus location'}</div>
          </div>`
        )
        .addTo(map);
    }
  }, [mapFocusTarget, isLoaded]);

  // Initialize MapLibre
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new MapLibreMap({
      container: mapContainerRef.current,
      style: (BASEMAP_STYLES[selectedBasemap] || BASEMAP_STYLES.osmStandard || BASEMAP_STYLES.cartoLight)?.style,
      center: customCenter,
      zoom: customZoom,
      pitch: is3D ? 50 : 0,
      bearing: is3D ? -15 : 0,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on('load', () => {
      setIsLoaded(true);
      addAllLayers(map);
    });

    // Interactive Map Click Handler for Tools (Inspect, Ruler, Barrier)
    map.on('click', (e) => {
      const { lng, lat } = e.lngLat;

      if (activeMapTool === 'inspect') {
        // Query DEM and Depth algorithm based on coordinates & sumps
        const distFromMithi = Math.hypot(lng - 72.868, lat - 19.075);
        const estElevation = Math.max(1.8, Math.min(12.5, +(2.2 + distFromMithi * 95).toFixed(1)));
        const estDepth = Math.max(0, Math.min(58, +(48 - (estElevation - 2.0) * 8 + (nowcastMinutes / 60) * 8).toFixed(1)));
        const estVelocity = estDepth > 10 ? '0.54 m/s' : '0.12 m/s';

        setInspectedPoint({
          lng: +lng.toFixed(5),
          lat: +lat.toFixed(5),
          elevation: estElevation,
          depth: estDepth,
          velocity: estVelocity,
          soilSat: '94.2%',
          clearanceTime: estDepth > 30 ? '3.5 hrs' : '1.2 hrs',
          hazardLevel: estDepth > 30 ? 'CRITICAL' : estDepth > 15 ? 'HIGH' : 'LOW RISK',
        });
      } else if (activeMapTool === 'ruler') {
        setRulerPoints((prev) => [...prev, [lng, lat]]);
      } else if (activeMapTool === 'barrier') {
        addBarrier({
          id: `bar-${Date.now()}`,
          name: `Rapid Sandbag Barrier #${placedBarriers.length + 1}`,
          coordinates: [lng, lat],
          heightCm: 60,
          mitigationDeltaCm: -16,
          deployedAt: 'Just now',
          type: 'Polymer High-Tenacity Dike',
        });
      }
    });

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, [selectedBasemap]);

  // Comprehensive GIS Layer Adder
  const addAllLayers = (map) => {
    if (!map || !map.isStyleLoaded()) return;

    // 1. Mithi River Channel
    if (!map.getSource('mithi-river')) {
      map.addSource('mithi-river', { type: 'geojson', data: MITHI_RIVER_GEOJSON });
      map.addLayer({
        id: 'mithi-river-glow',
        type: 'line',
        source: 'mithi-river',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#60A5FA', 'line-width': 9, 'line-opacity': 0.4 },
      });
      map.addLayer({
        id: 'mithi-river-line',
        type: 'line',
        source: 'mithi-river',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#2563EB', 'line-width': 4.5, 'line-opacity': 0.95 },
      });
    }

    // 2. DEM Contours (Topography)
    if (!map.getSource('dem-contours')) {
      map.addSource('dem-contours', { type: 'geojson', data: DEM_CONTOURS_GEOJSON });
      map.addLayer({
        id: 'dem-contours-line',
        type: 'line',
        source: 'dem-contours',
        paint: {
          'line-color': ['get', 'stroke'],
          'line-width': 1.5,
          'line-dasharray': [4, 2],
          'line-opacity': 0.75,
        },
      });
    }

    // 3. Inundation Zones (2D SWE Depth)
    if (!map.getSource('inundation-zones')) {
      map.addSource('inundation-zones', { type: 'geojson', data: INUNDATION_ZONES_GEOJSON });
      map.addLayer({
        id: 'inundation-zones-fill',
        type: 'fill',
        source: 'inundation-zones',
        paint: {
          'fill-color': ['match', ['get', 'risk'], 'CRITICAL', '#D94A4A', 'HIGH', '#C58A25', '#6D4AFF'],
          'fill-opacity': splitSide === 'peak' ? 0.65 : 0.45,
        },
      });
      map.addLayer({
        id: 'inundation-zones-outline',
        type: 'line',
        source: 'inundation-zones',
        paint: {
          'line-color': ['match', ['get', 'risk'], 'CRITICAL', '#B91C1C', 'HIGH', '#B45309', '#4930A8'],
          'line-width': 2,
          'line-dasharray': [2, 1],
        },
      });
    }

    // 4. Predicted Flood Horizon (+60m)
    if (!map.getSource('predicted-flood')) {
      map.addSource('predicted-flood', { type: 'geojson', data: PREDICTED_FLOOD_GEOJSON });
      map.addLayer({
        id: 'predicted-flood-fill',
        type: 'fill',
        source: 'predicted-flood',
        paint: { 'fill-color': '#8B5CF6', 'fill-opacity': 0.3 },
      });
      map.addLayer({
        id: 'predicted-flood-outline',
        type: 'line',
        source: 'predicted-flood',
        paint: { 'line-color': '#7C3AED', 'line-width': 2.5, 'line-dasharray': [3, 2] },
      });
    }

    // 5. Doppler Radar Cells
    const radarGeoJSON = {
      type: 'FeatureCollection',
      features: RADAR_CELLS.map((cell) => ({
        type: 'Feature',
        properties: cell,
        geometry: { type: 'Point', coordinates: [cell.coords[1], cell.coords[0]] },
      })),
    };
    if (!map.getSource('radar-cells')) {
      map.addSource('radar-cells', { type: 'geojson', data: radarGeoJSON });
      map.addLayer({
        id: 'radar-cells-circle',
        type: 'circle',
        source: 'radar-cells',
        paint: {
          'circle-radius': 24,
          'circle-color': '#E11D48',
          'circle-opacity': 0.35,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FB7185',
        },
      });
      map.addLayer({
        id: 'radar-cells-core',
        type: 'circle',
        source: 'radar-cells',
        paint: { 'circle-radius': 9, 'circle-color': '#BE123C', 'circle-stroke-width': 1.5, 'circle-stroke-color': '#FFFFFF' },
      });
    }

    // 6. Roads Network
    if (!map.getSource('roads-network')) {
      map.addSource('roads-network', { type: 'geojson', data: ROADS_GEOJSON });
      map.addLayer({
        id: 'roads-network-casing',
        type: 'line',
        source: 'roads-network',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#FFFFFF', 'line-width': 7, 'line-opacity': 0.8 },
      });
      map.addLayer({
        id: 'roads-network-line',
        type: 'line',
        source: 'roads-network',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': ['get', 'color'], 'line-width': 4.5, 'line-opacity': 0.95 },
      });

      map.on('click', 'roads-network-line', (e) => {
        const feature = e.features[0];
        if (feature) {
          const matched = ROAD_CORRIDORS.find((r) => r.id === feature.properties.id);
          if (matched) {
            setSelectedRoad(matched);
            if (onSelectRoad) onSelectRoad(matched);
          }
          new MapLibrePopup({ closeButton: true, offset: 12 })
            .setLngLat(e.lngLat)
            .setHTML(
              `<div style="font-family: inherit; font-size: 12px; padding: 4px;">
                <div style="font-weight: bold; color: #24212B; margin-bottom: 2px;">${feature.properties.name}</div>
                <div style="font-family: monospace; color: #6D4AFF; font-size: 11px;">Status: <strong>${feature.properties.status}</strong></div>
                <div style="font-size: 11px; color: #706B78; margin-top: 2px;">Simulated Depth: <strong>${feature.properties.depth} cm</strong></div>
              </div>`
            )
            .addTo(map);
        }
      });
      map.on('mouseenter', 'roads-network-line', () => (map.getCanvas().style.cursor = 'pointer'));
      map.on('mouseleave', 'roads-network-line', () => (map.getCanvas().style.cursor = ''));
    }

    // 7. Drainage Network Nodes
    if (!map.getSource('drainage-nodes')) {
      map.addSource('drainage-nodes', { type: 'geojson', data: DRAINAGE_GEOJSON });
      map.addLayer({
        id: 'drainage-nodes-circle',
        type: 'circle',
        source: 'drainage-nodes',
        paint: {
          'circle-radius': 7.5,
          'circle-color': ['match', ['get', 'status'], 'SURCHARGING', '#D94A4A', 'NEAR SURCHARGE', '#C58A25', '#6D4AFF'],
          'circle-stroke-width': 2.5,
          'circle-stroke-color': '#FFFFFF',
        },
      });

      map.on('click', 'drainage-nodes-circle', (e) => {
        const feature = e.features[0];
        if (feature) {
          const matched = DRAINAGE_NODES.find((n) => n.id === feature.properties.id);
          if (matched) {
            setSelectedNode(matched);
            if (onSelectNode) onSelectNode(matched);
          }
          new MapLibrePopup({ closeButton: true, offset: 10 })
            .setLngLat(feature.geometry.coordinates)
            .setHTML(
              `<div style="font-family: inherit; font-size: 12px; padding: 4px;">
                <div style="font-weight: bold; color: #24212B;">${feature.properties.name}</div>
                <div style="font-family: monospace; color: #D94A4A; font-size: 11px; margin-top: 2px;">Status: <strong>${feature.properties.status}</strong></div>
                <div style="font-size: 11px; color: #706B78;">Hydraulic Head Load: <strong>${feature.properties.load}</strong></div>
              </div>`
            )
            .addTo(map);
        }
      });
      map.on('mouseenter', 'drainage-nodes-circle', () => (map.getCanvas().style.cursor = 'pointer'));
      map.on('mouseleave', 'drainage-nodes-circle', () => (map.getCanvas().style.cursor = ''));
    }

    // 8. Critical Infrastructure Assets
    const infraGeoJSON = {
      type: 'FeatureCollection',
      features: CRITICAL_ASSETS.map((asset) => ({
        type: 'Feature',
        properties: asset,
        geometry: { type: 'Point', coordinates: [asset.coordinates[1], asset.coordinates[0]] },
      })),
    };
    if (!map.getSource('critical-infra')) {
      map.addSource('critical-infra', { type: 'geojson', data: infraGeoJSON });
      map.addLayer({
        id: 'critical-infra-circle',
        type: 'circle',
        source: 'critical-infra',
        paint: {
          'circle-radius': 9,
          'circle-color': ['match', ['get', 'exposure'], 'Critical', '#DC2626', 'Moderate', '#F59E0B', '#10B981'],
          'circle-stroke-width': 2.5,
          'circle-stroke-color': '#FFFFFF',
        },
      });

      map.on('click', 'critical-infra-circle', (e) => {
        const feature = e.features[0];
        if (feature) {
          const matched = CRITICAL_ASSETS.find((a) => a.id === feature.properties.id);
          if (matched) {
            setSelectedAsset(matched);
            if (onSelectAsset) onSelectAsset(matched);
          }
          new MapLibrePopup({ closeButton: true, offset: 12 })
            .setLngLat(feature.geometry.coordinates)
            .setHTML(
              `<div style="font-family: inherit; font-size: 12px; padding: 4px;">
                <div style="font-weight: bold; color: #24212B;">${feature.properties.name}</div>
                <div style="font-size: 11px; color: #6D4AFF; font-weight: 600;">${feature.properties.type}</div>
                <div style="font-size: 11px; color: #706B78; margin-top: 2px;">Exposure: <strong>${feature.properties.exposure}</strong> (${feature.properties.predictedDepth}cm)</div>
              </div>`
            )
            .addTo(map);
        }
      });
      map.on('mouseenter', 'critical-infra-circle', () => (map.getCanvas().style.cursor = 'pointer'));
      map.on('mouseleave', 'critical-infra-circle', () => (map.getCanvas().style.cursor = ''));
    }

    // 9. CCTV Feeds
    const cctvGeoJSON = {
      type: 'FeatureCollection',
      features: CCTV_FEEDS.map((cam) => {
        const road = ROAD_CORRIDORS.find((r) => r.ward === cam.ward) || ROAD_CORRIDORS[0];
        return {
          type: 'Feature',
          properties: cam,
          geometry: { type: 'Point', coordinates: [road.coordinates[1] - 0.003, road.coordinates[0] + 0.002] },
        };
      }),
    };
    if (!map.getSource('cctv-points')) {
      map.addSource('cctv-points', { type: 'geojson', data: cctvGeoJSON });
      map.addLayer({
        id: 'cctv-points-circle',
        type: 'circle',
        source: 'cctv-points',
        paint: {
          'circle-radius': 6.5,
          'circle-color': '#0284C7',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FFFFFF',
        },
      });

      map.on('click', 'cctv-points-circle', (e) => {
        const feature = e.features[0];
        if (feature && onSelectCCTV) {
          const matched = CCTV_FEEDS.find((c) => c.id === feature.properties.id);
          if (matched) onSelectCCTV(matched);
        }
      });
      map.on('mouseenter', 'cctv-points-circle', () => (map.getCanvas().style.cursor = 'pointer'));
      map.on('mouseleave', 'cctv-points-circle', () => (map.getCanvas().style.cursor = ''));
    }

    // 10. Citizen Reports
    const citizenGeoJSON = {
      type: 'FeatureCollection',
      features: citizenReportsList.map((rep) => ({
        type: 'Feature',
        properties: rep,
        geometry: { type: 'Point', coordinates: [rep.coordinates[1], rep.coordinates[0]] },
      })),
    };
    if (!map.getSource('citizen-points')) {
      map.addSource('citizen-points', { type: 'geojson', data: citizenGeoJSON });
      map.addLayer({
        id: 'citizen-points-circle',
        type: 'circle',
        source: 'citizen-points',
        paint: {
          'circle-radius': 6,
          'circle-color': '#EA580C',
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#FFFFFF',
        },
      });

      map.on('click', 'citizen-points-circle', (e) => {
        const feature = e.features[0];
        if (feature && onSelectCitizenReport) {
          const matched = citizenReportsList.find((c) => c.id === feature.properties.id);
          if (matched) onSelectCitizenReport(matched);
        }
      });
      map.on('mouseenter', 'citizen-points-circle', () => (map.getCanvas().style.cursor = 'pointer'));
      map.on('mouseleave', 'citizen-points-circle', () => (map.getCanvas().style.cursor = ''));
    }

    // 11. Emergency Rescue Units Fleet
    const rescueGeoJSON = {
      type: 'FeatureCollection',
      features: rescueFleet.map((unit) => ({
        type: 'Feature',
        properties: unit,
        geometry: { type: 'Point', coordinates: [unit.coordinates[1], unit.coordinates[0]] },
      })),
    };
    if (!map.getSource('rescue-fleet-points')) {
      map.addSource('rescue-fleet-points', { type: 'geojson', data: rescueGeoJSON });
      map.addLayer({
        id: 'rescue-fleet-circle',
        type: 'circle',
        source: 'rescue-fleet-points',
        paint: {
          'circle-radius': 8,
          'circle-color': '#059669',
          'circle-stroke-width': 2.5,
          'circle-stroke-color': '#FFFFFF',
        },
      });

      map.on('click', 'rescue-fleet-circle', (e) => {
        const feature = e.features[0];
        if (feature && onSelectRescue) {
          const matched = rescueFleet.find((u) => u.id === feature.properties.id);
          if (matched) onSelectRescue(matched);
        }
      });
      map.on('mouseenter', 'rescue-fleet-circle', () => (map.getCanvas().style.cursor = 'pointer'));
      map.on('mouseleave', 'rescue-fleet-circle', () => (map.getCanvas().style.cursor = ''));
    }

    // 12. Placed Sandbags & Barriers
    const barrierGeoJSON = {
      type: 'FeatureCollection',
      features: placedBarriers.map((bar) => ({
        type: 'Feature',
        properties: bar,
        geometry: { type: 'Point', coordinates: bar.coordinates },
      })),
    };
    if (!map.getSource('placed-barriers')) {
      map.addSource('placed-barriers', { type: 'geojson', data: barrierGeoJSON });
      map.addLayer({
        id: 'placed-barriers-circle',
        type: 'circle',
        source: 'placed-barriers',
        paint: {
          'circle-radius': 9,
          'circle-color': '#F59E0B',
          'circle-stroke-width': 2.5,
          'circle-stroke-color': '#FFFFFF',
        },
      });
    }

    // 13. Safe Emergency Route Polyline
    if (!map.getSource('safe-route-line')) {
      map.addSource('safe-route-line', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: activeSafeRoute
            ? [
                {
                  type: 'Feature',
                  properties: {},
                  geometry: { type: 'LineString', coordinates: activeSafeRoute.coordinates },
                },
              ]
            : [],
        },
      });
      map.addLayer({
        id: 'safe-route-glow',
        type: 'line',
        source: 'safe-route-line',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#10B981', 'line-width': 8, 'line-opacity': 0.5 },
      });
      map.addLayer({
        id: 'safe-route-solid',
        type: 'line',
        source: 'safe-route-line',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#059669', 'line-width': 4.5 },
      });
    }

    // 14. Ruler Measurement Polyline
    if (!map.getSource('ruler-line')) {
      map.addSource('ruler-line', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features:
            rulerPoints.length > 1
              ? [
                  {
                    type: 'Feature',
                    properties: {},
                    geometry: { type: 'LineString', coordinates: rulerPoints },
                  },
                ]
              : [],
        },
      });
      map.addLayer({
        id: 'ruler-line-layer',
        type: 'line',
        source: 'ruler-line',
        paint: { 'line-color': '#E11D48', 'line-width': 3, 'line-dasharray': [2, 2] },
      });
    }
  };

  // Update dynamic sources when state changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLoaded || !map.isStyleLoaded()) return;

    if (map.getSource('placed-barriers')) {
      map.getSource('placed-barriers').setData({
        type: 'FeatureCollection',
        features: placedBarriers.map((bar) => ({
          type: 'Feature',
          properties: bar,
          geometry: { type: 'Point', coordinates: bar.coordinates },
        })),
      });
    }

    if (map.getSource('rescue-fleet-points')) {
      map.getSource('rescue-fleet-points').setData({
        type: 'FeatureCollection',
        features: rescueFleet.map((unit) => ({
          type: 'Feature',
          properties: unit,
          geometry: { type: 'Point', coordinates: [unit.coordinates[1], unit.coordinates[0]] },
        })),
      });
    }

    if (map.getSource('citizen-points')) {
      map.getSource('citizen-points').setData({
        type: 'FeatureCollection',
        features: citizenReportsList.map((rep) => ({
          type: 'Feature',
          properties: rep,
          geometry: { type: 'Point', coordinates: [rep.coordinates[1], rep.coordinates[0]] },
        })),
      });
    }

    if (map.getSource('ruler-line')) {
      map.getSource('ruler-line').setData({
        type: 'FeatureCollection',
        features:
          rulerPoints.length > 1
            ? [{ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: rulerPoints } }]
            : [],
      });
    }

    if (map.getSource('safe-route-line')) {
      map.getSource('safe-route-line').setData({
        type: 'FeatureCollection',
        features: activeSafeRoute
          ? [{ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: activeSafeRoute.coordinates } }]
          : [],
      });
    }
  }, [placedBarriers, rescueFleet, citizenReportsList, rulerPoints, activeSafeRoute, isLoaded]);

  // Reactive layer visibility toggles
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLoaded || !map.isStyleLoaded()) return;

    const setVisibility = (layerId, isVisible) => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', isVisible ? 'visible' : 'none');
      }
    };

    setVisibility('inundation-zones-fill', activeLayers.floodDepth);
    setVisibility('inundation-zones-outline', activeLayers.floodDepth);
    setVisibility('predicted-flood-fill', activeLayers.predictedFlood);
    setVisibility('predicted-flood-outline', activeLayers.predictedFlood);
    setVisibility('roads-network-casing', activeLayers.roads);
    setVisibility('roads-network-line', activeLayers.roads);
    setVisibility('drainage-nodes-circle', activeLayers.drainage);
    setVisibility('mithi-river-glow', activeLayers.surfaceFlow);
    setVisibility('mithi-river-line', activeLayers.surfaceFlow);
    setVisibility('dem-contours-line', activeLayers.dem);
    setVisibility('radar-cells-circle', activeLayers.radar);
    setVisibility('radar-cells-core', activeLayers.radar);
    setVisibility('critical-infra-circle', activeLayers.infrastructure);
    setVisibility('cctv-points-circle', activeLayers.cctv);
    setVisibility('citizen-points-circle', activeLayers.citizenReports);
    setVisibility('rescue-fleet-circle', activeLayers.rescueUnits);
    setVisibility('placed-barriers-circle', activeLayers.sandbags);
  }, [activeLayers, isLoaded]);

  // Fly to selected road
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedRoad || !selectedRoad.coordinates) return;
    map.flyTo({
      center: [selectedRoad.coordinates[1], selectedRoad.coordinates[0]],
      zoom: 13.5,
      essential: true,
      duration: 1200,
    });
  }, [selectedRoad]);

  // Fly to selected ward
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedWard || selectedWard === 'all') return;
    const wardCoordMap = {
      'ward-fn': [72.8619, 19.0392],
      'ward-l': [72.8835, 19.0645],
      'ward-ke': [72.8468, 19.1197],
      'ward-gn': [72.8432, 19.0144],
      'ward-hw': [72.8284, 19.0536],
    };
    if (wardCoordMap[selectedWard]) {
      map.flyTo({
        center: wardCoordMap[selectedWard],
        zoom: 13.8,
        essential: true,
        duration: 1200,
      });
    }
  }, [selectedWard]);

  // Toggle 3D
  const toggle3D = () => {
    const map = mapRef.current;
    if (!map) return;
    const next3D = !is3D;
    setIs3D(next3D);
    map.easeTo({
      pitch: next3D ? 52 : 0,
      bearing: next3D ? -18 : 0,
      duration: 1000,
    });
  };

  const handleResetView = () => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({
      center: [72.868, 19.075],
      zoom: 12.0,
      pitch: is3D ? 50 : 0,
      bearing: is3D ? -15 : 0,
      essential: true,
      duration: 1200,
    });
  };

  // Cursor style based on active tool
  const cursorClass =
    activeMapTool === 'inspect' || activeMapTool === 'ruler'
      ? 'cursor-crosshair'
      : activeMapTool === 'barrier'
      ? 'cursor-copy'
      : 'cursor-grab';

  return (
    <div
      style={{ height }}
      className={`w-full max-h-[65vh] lg:max-h-none bg-[#F5F4FA] border border-border rounded-xl relative overflow-hidden flex flex-col shadow-subtle select-none ${cursorClass}`}
    >
      {/* Map Header Status HUD */}
      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20 flex max-w-[calc(100%-1rem)] flex-wrap items-center gap-1.5 sm:gap-2 pointer-events-none">
        <div className="bg-surface/95 backdrop-blur px-2 sm:px-3 py-1.5 rounded-lg border border-border text-[10px] sm:text-[11px] font-mono text-ink shadow-sm flex flex-wrap items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-status-alert animate-ping" />
          <span className="font-bold">
            {splitMode ? (splitSide === 'live' ? 'CURRENT LIVE (t=0)' : 'PEAK FORECAST (+60m)') : 'MUMBAI METRO // DIGITAL TWIN'}
          </span>
          <span className="text-border">|</span>
          <span className="text-purple font-semibold">
            {nowcastMinutes > 0 ? `+${nowcastMinutes}m NOWCAST` : 'LIVE REALTIME'}
          </span>
        </div>

        {activeMapTool !== 'none' && (
          <div className="bg-purple text-white px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold shadow-elevated flex items-center gap-1.5 pointer-events-auto animate-pulse">
            <Crosshair className="w-3.5 h-3.5" />
            <span>TOOL: {activeMapTool.toUpperCase()} (CLICK ON MAP)</span>
          </div>
        )}
      </div>

      {/* Floating Map Controls (Top Right) */}
      <div className="absolute top-14 right-2 sm:top-3 sm:right-3 z-20 flex max-w-[calc(100%-1rem)] flex-wrap justify-end items-center gap-1 sm:gap-1.5">
        {/* Basemap Switcher */}
        <div ref={basemapRef} className="relative">
          <button
            onClick={() => {
              setShowBasemapDropdown(!showBasemapDropdown);
              setShowLayersDropdown(false);
            }}
            className={`p-2 rounded-xl border text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 ${
              showBasemapDropdown
                ? 'bg-purple-soft text-purple border-purple ring-2 ring-purple/20'
                : 'bg-surface/95 backdrop-blur border-border hover:bg-surface text-ink-secondary hover:text-ink'
            }`}
            title="Change Basemap Provider"
          >
            <MapIcon className="w-4 h-4 text-purple" />
            <span className="hidden sm:inline">{(BASEMAP_STYLES[selectedBasemap] || BASEMAP_STYLES.osmStandard)?.name || 'Basemap'}</span>
          </button>

          {showBasemapDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-surface/98 backdrop-blur-md border border-border rounded-2xl shadow-elevated p-2 z-50 text-xs animate-scaleUp">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase font-bold text-ink-muted px-2 py-1.5 mb-1 border-b border-border/50">
                <span className="flex items-center gap-1.5">
                  <MapIcon className="w-3 h-3 text-purple" />
                  Basemap Provider
                </span>
                <span className="text-[9px] text-ink-secondary">GIS Tiles</span>
              </div>
              <div className="space-y-1">
                {Object.values(BASEMAP_STYLES).map((styleOption) => {
                  const isSelected = selectedBasemap === styleOption.id;
                  return (
                    <button
                      key={styleOption.id}
                      onClick={() => {
                        setSelectedBasemap(styleOption.id);
                        setShowBasemapDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                        isSelected
                          ? 'bg-purple text-white font-bold shadow-subtle'
                          : 'text-ink hover:bg-surface-secondary'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            styleOption.id === 'cartoLight'
                              ? 'bg-amber-400'
                              : styleOption.id === 'cartoDark'
                              ? 'bg-slate-700 border border-slate-500'
                              : styleOption.id === 'satellite'
                              ? 'bg-emerald-500'
                              : 'bg-blue-500'
                          }`}
                        />
                        <span>{styleOption.name}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Layer Toggle Button */}
        {showLayerToggle && (
          <div ref={layersRef} className="relative">
            <button
              onClick={() => {
                setShowLayersDropdown(!showLayersDropdown);
                setShowBasemapDropdown(false);
              }}
              className={`p-2 rounded-xl border text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 ${
                showLayersDropdown
                  ? 'bg-purple-soft text-purple border-purple ring-2 ring-purple/20'
                  : 'bg-surface/95 backdrop-blur border-border hover:bg-surface text-ink-secondary hover:text-ink'
              }`}
            >
              <Layers className="w-4 h-4 text-purple" />
              <span className="hidden sm:inline">
                Layers ({Object.values(activeLayers).filter(Boolean).length})
              </span>
            </button>

            {showLayersDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-surface/98 backdrop-blur-md border border-border rounded-2xl shadow-elevated p-2.5 z-50 text-xs max-h-96 overflow-y-auto animate-scaleUp">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase font-bold text-ink-muted pb-2 border-b border-border/60 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple" />
                    <span>GIS Overlays</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        Object.keys(activeLayers).forEach((k) => {
                          if (!activeLayers[k]) toggleLayer(k);
                        });
                      }}
                      className="text-[9px] font-mono text-purple hover:underline px-1 cursor-pointer"
                    >
                      All On
                    </button>
                    <span className="text-border">|</span>
                    <button
                      onClick={() => {
                        Object.keys(activeLayers).forEach((k) => {
                          if (activeLayers[k]) toggleLayer(k);
                        });
                      }}
                      className="text-[9px] font-mono text-ink-secondary hover:underline px-1 cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  {Object.keys(activeLayers).map((layerKey) => {
                    const isChecked = activeLayers[layerKey];
                    const colorMap = {
                      radar: 'bg-rose-500',
                      floodDepth: 'bg-blue-600',
                      predictedFlood: 'bg-purple',
                      surfaceFlow: 'bg-cyan-500',
                      drainage: 'bg-amber-500',
                      roads: 'bg-indigo-500',
                      dem: 'bg-emerald-500',
                      infrastructure: 'bg-red-600',
                      cctv: 'bg-teal-500',
                    };
                    return (
                      <div
                        key={layerKey}
                        onClick={() => toggleLayer(layerKey)}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-purple-soft/50 text-ink font-semibold'
                            : 'hover:bg-surface-secondary text-ink-secondary'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${colorMap[layerKey] || 'bg-purple'}`} />
                          <span className="capitalize text-xs">
                            {layerKey.replace(/([A-Z])/g, ' $1')}
                          </span>
                        </div>
                        {/* Custom Modern Toggle Switch */}
                        <div
                          className={`w-7 h-4 rounded-full transition-colors relative flex items-center px-0.5 ${
                            isChecked ? 'bg-purple' : 'bg-border'
                          }`}
                        >
                          <div
                            className={`w-3 h-3 rounded-full bg-white transition-transform ${
                              isChecked ? 'translate-x-3' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3D Pitch View Toggle */}
        <button
          onClick={toggle3D}
          className={`p-2 rounded-lg border shadow-sm transition-colors ${
            is3D
              ? 'bg-purple text-white border-purple'
              : 'bg-surface/95 backdrop-blur border-border hover:bg-surface text-ink-secondary hover:text-ink'
          }`}
          title={is3D ? 'Reset to 2D Top-down' : 'Switch to 3D Perspective View'}
        >
          <Rotate3d className="w-4 h-4" />
        </button>

        {/* Zoom In */}
        <button
          onClick={() => mapRef.current?.zoomIn()}
          className="p-2 rounded-lg bg-surface/95 backdrop-blur border border-border hover:bg-surface text-ink-secondary hover:text-ink shadow-sm transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Zoom Out */}
        <button
          onClick={() => mapRef.current?.zoomOut()}
          className="p-2 rounded-lg bg-surface/95 backdrop-blur border border-border hover:bg-surface text-ink-secondary hover:text-ink shadow-sm transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        {/* Center / Reset Extent */}
        <button
          onClick={handleResetView}
          className="p-2 rounded-lg bg-surface/95 backdrop-blur border border-border hover:bg-surface text-ink-secondary hover:text-ink shadow-sm transition-colors"
          title="Reset to Mumbai Metro Extent"
        >
          <LocateFixed className="w-4 h-4" />
        </button>
      </div>

      {/* Real MapLibre Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full flex-1 z-10" />

      {/* Bottom GIS Legend Bar */}
      <div className="absolute bottom-3 left-3 z-20 bg-surface/95 backdrop-blur px-3 py-2 rounded-xl border border-border text-[11px] shadow-sm flex items-center gap-3 select-none pointer-events-auto max-w-full overflow-x-auto">
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="font-mono text-ink-muted uppercase font-bold text-[10px]">
            Depth:
          </span>
          <div className="flex items-center gap-1 font-mono text-[10px]">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#6D4AFF] opacity-80" />
            <span>&lt;10cm</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[10px]">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#C58A25]" />
            <span>10–30cm</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[10px]">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#D94A4A]" />
            <span>&gt;30cm (Impassable)</span>
          </div>
        </div>

        <div className="h-3 w-px bg-border hidden md:block" />

        <div className="hidden md:flex items-center gap-3 text-[10px] font-mono text-ink-secondary flex-shrink-0">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#2563EB]" /> Mithi Drainage
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#D94A4A] ring-1 ring-[#D94A4A]/40" /> Surcharging Node
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#059669]" /> NDRF Rescue
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> Sandbag Dike
          </span>
        </div>
      </div>
    </div>
  );
}
