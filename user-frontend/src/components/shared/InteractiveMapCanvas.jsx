import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Map, NavigationControl, GeolocateControl, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useFlood } from '../../context/FloodContext';
import { useNavigation } from '../../context/NavigationContext';
import { 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  RotateCcw, 
  Layers, 
  MapPin, 
  AlertTriangle, 
  ShieldCheck, 
  Radio, 
  Video, 
  Navigation as NavigationIcon,
  Maximize2,
  CheckCircle2,
  Info,
  Waves,
  Camera,
  Ruler,
  ShieldAlert,
  Flame,
  X,
  Crosshair,
  Download,
  Share2,
  Eye,
  Sliders,
  Play,
  Pause,
  CloudRain
} from 'lucide-react';
import { 
  ROAD_SEGMENTS, 
  HAZARDS_DATA, 
  WARDS_DATA, 
  CCTV_CAMERAS_DATA, 
  PUMPING_STATIONS_DATA, 
  COMMUNITY_MAP_PINS, 
  VEHICLE_PROFILES 
} from '../../data/floodData';
import { SAFE_PLACES_DATA } from '../../data/safePlacesData';
import { 
  IOT_SURCHARGE_SENSORS, 
  RUNOFF_VECTORS_GEOJSON, 
  CRITICAL_SUBWAYS_DATA 
} from '../../data/forecastExtraData';

// 5 High-Quality Map Tile Styles
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
    label: 'Night / Dark Ops',
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
  osm: {
    name: 'OpenStreetMap',
    label: 'OSM Standard',
    style: {
      version: 8,
      sources: {
        'osm-tiles': {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '&copy; OpenStreetMap contributors'
        }
      },
      layers: [{ id: 'osm-tiles-layer', type: 'raster', source: 'osm-tiles', minzoom: 0, maxzoom: 19 }]
    }
  },
  satellite: {
    name: 'Satellite Hybrid',
    label: 'Esri Satellite',
    style: {
      version: 8,
      sources: {
        'sat-tiles': {
          type: 'raster',
          tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
          tileSize: 256,
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS'
        }
      },
      layers: [{ id: 'sat-tiles-layer', type: 'raster', source: 'sat-tiles', minzoom: 0, maxzoom: 19 }]
    }
  },
  topo: {
    name: 'Topographic Relief',
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

// Realistic GeoJSON coordinates for Mumbai Micro-Catchments
const MUMBAI_FLOOD_ZONES_BASE = [
  {
    id: 'zone-hindmata',
    name: 'Hindmata & Gandhi Market Low Basin',
    ward: 'F-North',
    coordinates: [
      [72.8390, 19.0080],
      [72.8465, 19.0110],
      [72.8480, 19.0180],
      [72.8430, 19.0210],
      [72.8385, 19.0150],
      [72.8390, 19.0080]
    ],
    baseDepth: 28,
    peakDepth: 46,
    risk: 'CRITICAL',
    arrivalMin: 32,
    sensorId: 'SENSOR-HND-01'
  },
  {
    id: 'zone-kurla',
    name: 'Kurla West (L.B.S. Marg / Mithi River Basin)',
    ward: 'Ward L',
    coordinates: [
      [72.8710, 19.0620],
      [72.8830, 19.0660],
      [72.8850, 19.0740],
      [72.8760, 19.0760],
      [72.8690, 19.0690],
      [72.8710, 19.0620]
    ],
    baseDepth: 24,
    peakDepth: 39,
    risk: 'HIGH',
    arrivalMin: 40,
    sensorId: 'CCTV-L09'
  },
  {
    id: 'zone-milan',
    name: 'Milan Subway & SV Road Underpass Sump',
    ward: 'Ward K-West',
    coordinates: [
      [72.8380, 19.0790],
      [72.8440, 19.0810],
      [72.8460, 19.0860],
      [72.8400, 19.0880],
      [72.8360, 19.0830],
      [72.8380, 19.0790]
    ],
    baseDepth: 35,
    peakDepth: 48,
    risk: 'CRITICAL',
    arrivalMin: 22,
    sensorId: 'CCTV-K114'
  },
  {
    id: 'zone-kings-circle',
    name: 'King’s Circle & Sion Underbridge Culvert',
    ward: 'F-North',
    coordinates: [
      [72.8520, 19.0250],
      [72.8610, 19.0280],
      [72.8620, 19.0340],
      [72.8550, 19.0370],
      [72.8500, 19.0310],
      [72.8520, 19.0250]
    ],
    baseDepth: 26,
    peakDepth: 38,
    risk: 'HIGH',
    arrivalMin: 45,
    sensorId: 'CCTV-SION-04'
  },
  {
    id: 'zone-sakinaka',
    name: 'Saki Naka Junction Micro-Catchment',
    ward: 'Ward K-East',
    coordinates: [
      [72.8780, 19.1080],
      [72.8880, 19.1120],
      [72.8910, 19.1190],
      [72.8830, 19.1220],
      [72.8760, 19.1140],
      [72.8780, 19.1080]
    ],
    baseDepth: 16,
    peakDepth: 24,
    risk: 'MODERATE',
    arrivalMin: 55,
    sensorId: 'SENSOR-SN-41'
  },
  {
    id: 'zone-andheri-subway',
    name: 'Andheri Subway SV Road Sump',
    ward: 'Ward K-West',
    coordinates: [
      [72.8420, 19.1150],
      [72.8480, 19.1170],
      [72.8500, 19.1230],
      [72.8440, 19.1250],
      [72.8390, 19.1200],
      [72.8420, 19.1150]
    ],
    baseDepth: 38,
    peakDepth: 52,
    risk: 'CRITICAL',
    arrivalMin: 18,
    sensorId: 'CCTV-AND-01'
  }
];

// Arterial Road Geometry (Linestrings across Mumbai)
const MUMBAI_ROADS_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'rd-weh',
        name: 'Western Express Highway (Elevated Flyovers)',
        status: 'CLEAR',
        depth: 0,
        risk: 'SAFE',
        recommendation: 'Elevated carriageway completely dry. Recommended corridor.'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [72.8480, 19.0480],
          [72.8510, 19.0720],
          [72.8540, 19.1050],
          [72.8570, 19.1350],
          [72.8610, 19.1680]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'rd-bkc-connector',
        name: 'BKC Elevated Flyover Connector',
        status: 'CLEAR',
        depth: 0,
        risk: 'SAFE',
        recommendation: 'Direct dry access to Bandra Kurla Complex. High elevation (+14m MSL).'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [72.8560, 19.0550],
          [72.8650, 19.0620],
          [72.8740, 19.0670],
          [72.8790, 19.0690]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'rd-lbs',
        name: 'Lal Bahadur Shastri (L.B.S.) Marg Kurla',
        status: 'RESTRICTED',
        depth: 24,
        risk: 'HIGH',
        recommendation: 'Sedans will stall. Heavy commercial and high-clearance vehicles only.'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [72.8700, 19.0580],
          [72.8750, 19.0650],
          [72.8800, 19.0720],
          [72.8860, 19.0830],
          [72.8920, 19.0980]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'rd-milan',
        name: 'Milan Subway Service Carriageway',
        status: 'CLOSED',
        depth: 35,
        risk: 'CRITICAL',
        recommendation: 'Completely flooded. Mandatory diversion via Milan Flyover.'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [72.8360, 19.0780],
          [72.8410, 19.0825],
          [72.8460, 19.0870]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'rd-sakinaka',
        name: 'Saki Naka Junction (Andheri-Kurla Rd)',
        status: 'CAUTION',
        depth: 16,
        risk: 'MODERATE',
        recommendation: 'Drive in central high camber lanes. Low curb lanes flooded.'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [72.8740, 19.1060],
          [72.8790, 19.1100],
          [72.8830, 19.1130],
          [72.8910, 19.1180]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'rd-jvlr',
        name: 'JVLR Elevated Connector (Powai - SEEPZ)',
        status: 'CLEAR',
        depth: 0,
        risk: 'SAFE',
        recommendation: 'High-elevation corridor (+24m datum). Recommended bypass for airport travelers.'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [72.8620, 19.1240],
          [72.8710, 19.1280],
          [72.8850, 19.1310],
          [72.9020, 19.1340]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'rd-perry',
        name: 'Perry Road (via Carter Road Ridge, Bandra)',
        status: 'CLEAR',
        depth: 2,
        risk: 'SAFE',
        recommendation: 'Well-drained coastal ridge. Completely safe approach to Bandra 14th Rd.'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [72.8240, 19.0560],
          [72.8270, 19.0600],
          [72.8310, 19.0640]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'rd-ambedkar',
        name: 'Dr. B.R. Ambedkar Road (Hindmata Stretch)',
        status: 'RESTRICTED',
        depth: 32,
        risk: 'CRITICAL',
        recommendation: 'Underground holding tanks active. Use Hindmata Flyover top deck only.'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [72.8390, 19.0020],
          [72.8425, 19.0125],
          [72.8470, 19.0230],
          [72.8510, 19.0340]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'rd-sion-circle',
        name: 'Sion Circle & King’s Circle Flyover Underbelly',
        status: 'RESTRICTED',
        depth: 26,
        risk: 'HIGH',
        recommendation: 'Water accumulating near railway bridge. Divert via Eastern Express Highway.'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [72.8480, 19.0220],
          [72.8530, 19.0290],
          [72.8570, 19.0350]
        ]
      }
    }
  ]
};

export default function InteractiveMapCanvas({ 
  onSelectRoad, 
  selectedRoadId,
  showRoutes = false,
  highlightCorridor = null,
  compact = false,
  height = "h-[580px]",
  onSelectHazard,
  onSelectSafePlace,
  selectedLayer = 'all',
  depthSurcharge = 0,
  selectedVehicle = 'sedan',
  focusTarget = null,
  isPinDropperMode = false,
  onMapPinDrop = null,
  isMeasuringMode = false,
  onMeasurementUpdate = null,
  safeCorridorTarget = null,
  isDopplerActive = false,
  onOpenCCTVModal = null,
  showRunoffVectors = false,
  showIoTSensors = false,
  showSubwayBadges = false,
  onSelectSubway = null,
  onSelectIoTSensor = null
}) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const measurePointsRef = useRef([]);

  const { timelineIndex, currentTimeline, currentWard } = useFlood();
  const { navigateTo } = useNavigation();

  const [activeTileStyle, setActiveTileStyle] = useState('carto');
  const [is3D, setIs3D] = useState(false);
  const [activeLayers, setActiveLayers] = useState({
    floodPolygons: true,
    roads: true,
    hazards: true,
    safePlaces: true,
    cctv: true,
    pumpingStations: true,
    communityPins: true,
    exclusionRadii: true,
    runoffVectors: showRunoffVectors,
    iotSensors: showIoTSensors,
    subwayBadges: showSubwayBadges
  });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [measurementDistance, setMeasurementDistance] = useState(0);

  // Vehicle ground clearance threshold
  const vehicleConfig = VEHICLE_PROFILES[selectedVehicle] || VEHICLE_PROFILES.sedan;
  const vehicleClearanceCm = vehicleConfig.clearanceCm;

  // Timeline curve multiplier
  const depthMultiplier = useMemo(() => {
    const curve = [1.0, 1.25, 1.6, 2.0, 2.35, 1.7];
    return curve[timelineIndex] || 1.0;
  }, [timelineIndex]);

  // Compute GeoJSON Features for Flood Basins based on timeline + surcharge
  const floodGeoJSON = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: MUMBAI_FLOOD_ZONES_BASE.map(zone => {
        const computedDepth = Math.max(0, Math.round(zone.baseDepth * depthMultiplier + depthSurcharge));
        let color = '#217A52'; // Safe
        let riskLabel = 'LOW';
        let opacity = 0.45;

        if (computedDepth > 30) {
          color = '#7A1F35'; // Critical
          riskLabel = 'CRITICAL';
          opacity = 0.75;
        } else if (computedDepth > 20) {
          color = '#B42318'; // High
          riskLabel = 'HIGH';
          opacity = 0.65;
        } else if (computedDepth > 10) {
          color = '#B7791F'; // Moderate
          riskLabel = 'MODERATE';
          opacity = 0.55;
        }

        return {
          type: 'Feature',
          properties: {
            id: zone.id,
            name: zone.name,
            ward: zone.ward,
            depth: computedDepth,
            risk: riskLabel,
            fillColor: color,
            fillOpacity: opacity,
            arrivalMin: Math.max(8, Math.round(zone.arrivalMin / depthMultiplier)),
            sensorId: zone.sensorId
          },
          geometry: {
            type: 'Polygon',
            coordinates: [zone.coordinates]
          }
        };
      })
    };
  }, [depthMultiplier, depthSurcharge]);

  // Dynamic Road GeoJSON styled by vehicle passability
  const roadsGeoJSON = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: MUMBAI_ROADS_GEOJSON.features.map(f => {
        const baseRoad = ROAD_SEGMENTS.find(r => r.id === f.properties.id) || {
          currentDepth: f.properties.depth,
          name: f.properties.name,
          recommendation: f.properties.recommendation
        };

        const simulatedRoadDepth = Math.max(0, Math.round(baseRoad.currentDepth * depthMultiplier + depthSurcharge));
        const isPassableForVehicle = simulatedRoadDepth <= vehicleClearanceCm;
        const isSelected = selectedRoadId === f.properties.id;

        let roadColor = '#10B981'; // Passable Green
        let statusLabel = 'PASSABLE';

        if (simulatedRoadDepth > vehicleClearanceCm * 1.5) {
          roadColor = '#DC2626'; // Impassable / Red
          statusLabel = 'IMPASSABLE';
        } else if (!isPassableForVehicle) {
          roadColor = '#EA580C'; // Stall Risk / Amber-Orange
          statusLabel = 'STALL RISK';
        } else if (simulatedRoadDepth > 5) {
          roadColor = '#3B82F6'; // Caution / Low Water
          statusLabel = 'CAUTION';
        }

        return {
          ...f,
          properties: {
            ...f.properties,
            depth: simulatedRoadDepth,
            isPassable: isPassableForVehicle,
            statusLabel,
            color: roadColor,
            isSelected,
            lineWidth: isSelected ? 8 : (isPassableForVehicle ? 5 : 4)
          }
        };
      })
    };
  }, [depthMultiplier, depthSurcharge, vehicleClearanceCm, selectedRoadId]);

  // Safe Corridor GeoJSON (vector from Ward to Haven)
  const safeCorridorGeoJSON = useMemo(() => {
    if (!safeCorridorTarget || !currentWard?.defaultCenter) return null;
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            name: `Safe Corridor to ${safeCorridorTarget.name}`,
            elevation: safeCorridorTarget.elevation
          },
          geometry: {
            type: 'LineString',
            coordinates: [
              [currentWard.defaultCenter.lng, currentWard.defaultCenter.lat],
              [(currentWard.defaultCenter.lng + safeCorridorTarget.coordinates.lng) / 2 + 0.005, (currentWard.defaultCenter.lat + safeCorridorTarget.coordinates.lat) / 2 + 0.003],
              [safeCorridorTarget.coordinates.lng, safeCorridorTarget.coordinates.lat]
            ]
          }
        }
      ]
    };
  }, [safeCorridorTarget, currentWard]);

  // Initialize MapLibre GL Map
  useEffect(() => {
    if (!mapContainer.current) return;

    const initialCenter = currentWard?.defaultCenter 
      ? [currentWard.defaultCenter.lng, currentWard.defaultCenter.lat] 
      : [72.8559, 19.0760];

    const map = new Map({
      container: mapContainer.current,
      style: TILE_STYLES[activeTileStyle].style,
      center: initialCenter,
      zoom: 12.4,
      minZoom: 9.5,
      maxZoom: 18,
      pitch: is3D ? 52 : 0,
      bearing: is3D ? -20 : 0,
      attributionControl: true
    });

    map.addControl(new NavigationControl({ visualizePitch: true }), 'top-right');
    map.addControl(new GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true }), 'top-right');

    map.on('load', () => {
      setMapLoaded(true);
      mapRef.current = map;

      // 1. Flood Zones Source & Layers
      map.addSource('flood-zones', { type: 'geojson', data: floodGeoJSON });
      map.addLayer({
        id: 'flood-zones-fill',
        type: 'fill',
        source: 'flood-zones',
        paint: {
          'fill-color': ['get', 'fillColor'],
          'fill-opacity': ['get', 'fillOpacity']
        }
      });
      map.addLayer({
        id: 'flood-zones-line',
        type: 'line',
        source: 'flood-zones',
        paint: {
          'line-color': ['get', 'fillColor'],
          'line-width': 2.5,
          'line-opacity': 0.95
        }
      });

      // 2. Road Network Source & Layer
      map.addSource('mumbai-roads', { type: 'geojson', data: roadsGeoJSON });
      
      // Halo / Selected highlight
      map.addLayer({
        id: 'mumbai-roads-halo',
        type: 'line',
        source: 'mumbai-roads',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#FFFFFF',
          'line-width': ['case', ['get', 'isSelected'], 11, 0],
          'line-opacity': 0.9
        }
      });

      map.addLayer({
        id: 'mumbai-roads-line',
        type: 'line',
        source: 'mumbai-roads',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': ['get', 'lineWidth'],
          'line-opacity': 0.9
        }
      });

      // 3. Safe Corridor Layer (if active)
      map.addSource('safe-corridor', {
        type: 'geojson',
        data: safeCorridorGeoJSON || { type: 'FeatureCollection', features: [] }
      });
      map.addLayer({
        id: 'safe-corridor-line',
        type: 'line',
        source: 'safe-corridor',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#10B981',
          'line-width': 6,
          'line-dasharray': [2, 2],
          'line-opacity': 0.95
        }
      });

      // 4. Measuring Tool Source & Layer
      map.addSource('measure-line', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });
      map.addLayer({
        id: 'measure-line-layer',
        type: 'line',
        source: 'measure-line',
        paint: {
          'line-color': '#6366F1',
          'line-width': 4,
          'line-dasharray': [1, 2]
        }
      });

      // 5. Doppler Radar Precipitation Layer (Simulated dynamic canvas/raster)
      map.addSource('doppler-radar', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: { intensity: 'CLOUD_BURST' },
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [72.81, 19.00], [72.90, 19.00], [72.91, 19.14], [72.82, 19.14], [72.81, 19.00]
                ]]
              }
            }
          ]
        }
      });
      map.addLayer({
        id: 'doppler-radar-fill',
        type: 'fill',
        source: 'doppler-radar',
        paint: {
          'fill-color': '#8B5CF6',
          'fill-opacity': isDopplerActive ? 0.25 : 0.0
        }
      });

      // 6. Surface Runoff Hydraulic Flow Vectors
      map.addSource('runoff-vectors', {
        type: 'geojson',
        data: RUNOFF_VECTORS_GEOJSON
      });
      map.addLayer({
        id: 'runoff-vectors-line',
        type: 'line',
        source: 'runoff-vectors',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#06B6D4',
          'line-width': 4.5,
          'line-dasharray': [2, 2],
          'line-opacity': 0.85
        }
      });

      // Click & Hover on Flood Polygons
      map.on('click', 'flood-zones-fill', (e) => {
        if (!e.features || !e.features[0]) return;
        const feat = e.features[0].properties;
        setSelectedFeature({
          type: 'FLOOD_ZONE',
          name: feat.name,
          depth: feat.depth,
          risk: feat.risk,
          ward: feat.ward,
          arrivalMin: feat.arrivalMin,
          sensorId: feat.sensorId
        });
      });

      // Click & Hover on Roads
      map.on('click', 'mumbai-roads-line', (e) => {
        if (!e.features || !e.features[0]) return;
        const feat = e.features[0].properties;
        const matchedRoad = ROAD_SEGMENTS.find(r => r.id === feat.id) || {
          id: feat.id,
          name: feat.name,
          currentDepth: feat.depth,
          status: feat.statusLabel,
          risk: feat.risk,
          recommendation: feat.recommendation
        };

        setSelectedFeature({
          type: 'ROAD',
          ...matchedRoad,
          simulatedDepth: feat.depth,
          isPassable: feat.isPassable
        });

        if (onSelectRoad) onSelectRoad(matchedRoad.id || feat.id);
      });

      // Map Click for Pin Dropper and Measuring Tools
      map.on('click', (e) => {
        if (isPinDropperMode && onMapPinDrop) {
          onMapPinDrop({ lat: e.lngLat.lat, lng: e.lngLat.lng });
          return;
        }

        if (isMeasuringMode) {
          const pt = [e.lngLat.lng, e.lngLat.lat];
          measurePointsRef.current.push(pt);

          // Update measure line GeoJSON
          const source = map.getSource('measure-line');
          if (source && measurePointsRef.current.length > 1) {
            source.setData({
              type: 'FeatureCollection',
              features: [{
                type: 'Feature',
                geometry: { type: 'LineString', coordinates: measurePointsRef.current }
              }]
            });

            // Calculate approximate distance in KM
            let totalKm = 0;
            for (let i = 0; i < measurePointsRef.current.length - 1; i++) {
              const p1 = measurePointsRef.current[i];
              const p2 = measurePointsRef.current[i + 1];
              const dLat = (p2[1] - p1[1]) * 111;
              const dLng = (p2[0] - p1[0]) * 111 * Math.cos(p1[1] * (Math.PI / 180));
              totalKm += Math.sqrt(dLat * dLat + dLng * dLng);
            }
            const distRounded = Math.round(totalKm * 100) / 100;
            setMeasurementDistance(distRounded);
            if (onMeasurementUpdate) onMeasurementUpdate(distRounded);
          }
        }
      });

      // Cursor styles
      map.on('mouseenter', 'flood-zones-fill', () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', 'flood-zones-fill', () => { map.getCanvas().style.cursor = ''; });
      map.on('mouseenter', 'mumbai-roads-line', () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', 'mumbai-roads-line', () => { map.getCanvas().style.cursor = ''; });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [activeTileStyle]);

  // Update Flood Polygons GeoJSON data
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const source = mapRef.current.getSource('flood-zones');
    if (source) source.setData(floodGeoJSON);
  }, [floodGeoJSON, mapLoaded]);

  // Update Roads GeoJSON data
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const source = mapRef.current.getSource('mumbai-roads');
    if (source) source.setData(roadsGeoJSON);
  }, [roadsGeoJSON, mapLoaded]);

  // Update Safe Corridor GeoJSON
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const source = mapRef.current.getSource('safe-corridor');
    if (source) {
      source.setData(safeCorridorGeoJSON || { type: 'FeatureCollection', features: [] });
    }
  }, [safeCorridorGeoJSON, mapLoaded]);

  // Doppler Radar Visibility
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current;
    if (map.getLayer('doppler-radar-fill')) {
      map.setPaintProperty('doppler-radar-fill', 'fill-opacity', isDopplerActive ? 0.35 : 0.0);
    }
  }, [isDopplerActive, mapLoaded]);

  // 3D Pitch / Bearing toggle
  const toggle3D = useCallback(() => {
    if (!mapRef.current) return;
    const nextState = !is3D;
    setIs3D(nextState);
    mapRef.current.easeTo({
      pitch: nextState ? 55 : 0,
      bearing: nextState ? -22 : 0,
      duration: 1200
    });
  }, [is3D]);

  // Layer Visibility Control
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current;

    if (map.getLayer('flood-zones-fill')) {
      map.setLayoutProperty('flood-zones-fill', 'visibility', activeLayers.floodPolygons ? 'visible' : 'none');
      map.setLayoutProperty('flood-zones-line', 'visibility', activeLayers.floodPolygons ? 'visible' : 'none');
    }
    if (map.getLayer('mumbai-roads-line')) {
      map.setLayoutProperty('mumbai-roads-line', 'visibility', activeLayers.roads ? 'visible' : 'none');
      map.setLayoutProperty('mumbai-roads-halo', 'visibility', activeLayers.roads ? 'visible' : 'none');
    }
    if (map.getLayer('runoff-vectors-line')) {
      map.setLayoutProperty('runoff-vectors-line', 'visibility', (activeLayers.runoffVectors || showRunoffVectors) ? 'visible' : 'none');
    }
  }, [activeLayers, mapLoaded, showRunoffVectors]);

  // FlyTo on Focus Target or Ward Change
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    if (focusTarget && focusTarget.lat && focusTarget.lng) {
      mapRef.current.flyTo({
        center: [focusTarget.lng, focusTarget.lat],
        zoom: focusTarget.zoom || 14.5,
        duration: 1600,
        essential: true
      });
      return;
    }

    if (currentWard?.defaultCenter) {
      mapRef.current.flyTo({
        center: [currentWard.defaultCenter.lng, currentWard.defaultCenter.lat],
        zoom: 13.0,
        duration: 1600,
        essential: true
      });
    }
  }, [currentWard, focusTarget, mapLoaded]);

  // FlyTo when selectedRoadId changes
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !selectedRoadId) return;
    const road = ROAD_SEGMENTS.find(r => r.id === selectedRoadId || r.legacyId === selectedRoadId);
    if (road && road.coordinates) {
      mapRef.current.flyTo({
        center: [road.coordinates.lng, road.coordinates.lat],
        zoom: 14.2,
        duration: 1400
      });
    }
  }, [selectedRoadId, mapLoaded]);

  // Reset Measurement tool
  const resetMeasureTool = useCallback(() => {
    measurePointsRef.current = [];
    setMeasurementDistance(0);
    if (mapRef.current) {
      const source = mapRef.current.getSource('measure-line');
      if (source) source.setData({ type: 'FeatureCollection', features: [] });
    }
    if (onMeasurementUpdate) onMeasurementUpdate(0);
  }, [onMeasurementUpdate]);

  // Render Custom HTML Markers for Hazards, Havens, CCTVs, Pumping Stations, Community Pins & Exclusion Radii
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // 1. Hazard Markers with 15m Danger Standoff Radius
    if (activeLayers.hazards) {
      HAZARDS_DATA.forEach(h => {
        const el = document.createElement('div');
        el.className = 'cursor-pointer group flex flex-col items-center relative';
        
        // Pulse ring if critical
        const isCritical = h.severity === 'CRITICAL';
        el.innerHTML = `
          ${isCritical && activeLayers.exclusionRadii ? `
            <div class="absolute -inset-4 rounded-full border border-red-500/60 bg-red-500/20 animate-ping pointer-events-none"></div>
            <div class="absolute -inset-7 rounded-full border border-dashed border-red-500/40 pointer-events-none"></div>
          ` : ''}
          <div class="p-2 rounded-xl ${isCritical ? 'bg-red-600 shadow-red-600/50' : 'bg-amber-600 shadow-amber-600/50'} text-white shadow-lg border-2 border-white transform transition-transform group-hover:scale-125 z-10">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <span class="text-[9px] font-mono font-bold bg-slate-900 text-white px-1.5 py-0.5 rounded shadow mt-1 whitespace-nowrap opacity-90 group-hover:opacity-100 z-10">
            ${h.type.replace('_', ' ')}
          </span>
        `;

        el.addEventListener('click', () => {
          setSelectedFeature({ type: 'HAZARD', ...h });
          if (onSelectHazard) onSelectHazard(h);
        });

        const marker = new Marker({ element: el }).setLngLat([h.coordinates.lng, h.coordinates.lat]).addTo(map);
        markersRef.current.push(marker);
      });
    }

    // 2. Safe Places & Relief Shelters
    if (activeLayers.safePlaces) {
      SAFE_PLACES_DATA.forEach(sp => {
        if (!sp.coordinates) return;
        const el = document.createElement('div');
        el.className = 'cursor-pointer group flex flex-col items-center';
        el.innerHTML = `
          <div class="p-2 rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/40 border-2 border-white transform transition-transform group-hover:scale-125">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <span class="text-[9px] font-mono font-bold bg-white text-emerald-800 border border-emerald-300 px-1.5 py-0.5 rounded shadow mt-1 whitespace-nowrap max-w-[110px] truncate">
            ${sp.name.split(' ')[0]} (${sp.elevation})
          </span>
        `;

        el.addEventListener('click', () => {
          setSelectedFeature({ type: 'SAFE_PLACE', ...sp });
          if (onSelectSafePlace) onSelectSafePlace(sp);
        });

        const marker = new Marker({ element: el }).setLngLat([sp.coordinates.lng, sp.coordinates.lat]).addTo(map);
        markersRef.current.push(marker);
      });
    }

    // 3. Municipal CCTV Cameras
    if (activeLayers.cctv) {
      CCTV_CAMERAS_DATA.forEach(cam => {
        const el = document.createElement('div');
        el.className = 'cursor-pointer group flex flex-col items-center';
        el.innerHTML = `
          <div class="p-1.5 rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-600/40 border-2 border-white transform transition-transform group-hover:scale-125 relative">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
              <circle cx="12" cy="13" r="3"/>
            </svg>
            <span class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 border border-white animate-pulse"></span>
          </div>
          <span class="text-[8px] font-mono font-bold bg-purple-950 text-purple-200 px-1 py-0.2 rounded mt-0.5 whitespace-nowrap">
            ${cam.camCode} (${cam.waterLevelCm}cm)
          </span>
        `;

        el.addEventListener('click', () => {
          setSelectedFeature({ type: 'CCTV', ...cam });
          if (onOpenCCTVModal) onOpenCCTVModal(cam);
        });

        const marker = new Marker({ element: el }).setLngLat([cam.coordinates.lng, cam.coordinates.lat]).addTo(map);
        markersRef.current.push(marker);
      });
    }

    // 4. Stormwater Pumping Stations
    if (activeLayers.pumpingStations) {
      PUMPING_STATIONS_DATA.forEach(pump => {
        const el = document.createElement('div');
        el.className = 'cursor-pointer group flex flex-col items-center';
        el.innerHTML = `
          <div class="p-1.5 rounded-xl bg-cyan-600 text-white shadow-lg shadow-cyan-600/40 border-2 border-white transform transition-transform group-hover:scale-125">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="9"/>
              <path d="M12 3v9l4 4"/>
            </svg>
          </div>
          <span class="text-[8px] font-mono font-bold bg-cyan-950 text-cyan-200 px-1 py-0.2 rounded mt-0.5 whitespace-nowrap">
            ${pump.name.split(' ')[0]} (${pump.runningPumps}/${pump.totalPumps})
          </span>
        `;

        el.addEventListener('click', () => {
          setSelectedFeature({ type: 'PUMP', ...pump });
        });

        const marker = new Marker({ element: el }).setLngLat([pump.coordinates.lng, pump.coordinates.lat]).addTo(map);
        markersRef.current.push(marker);
      });
    }

    // 5. Crowdsourced Community Incident Pins
    if (activeLayers.communityPins) {
      COMMUNITY_MAP_PINS.forEach(cp => {
        const el = document.createElement('div');
        el.className = 'cursor-pointer group flex flex-col items-center';
        el.innerHTML = `
          <div class="p-1.5 rounded-xl bg-indigo-600 text-white shadow-md border-2 border-white transform transition-transform group-hover:scale-125 flex items-center gap-1">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
            </svg>
            <span class="text-[9px] font-bold font-mono">${cp.upvotes}</span>
          </div>
          <span class="text-[8px] font-mono bg-white text-indigo-900 border border-indigo-200 px-1 py-0.2 rounded mt-0.5 max-w-[90px] truncate shadow-xs">
            ${cp.type}
          </span>
        `;

        el.addEventListener('click', () => {
          setSelectedFeature({ type: 'COMMUNITY_PIN', ...cp });
        });

        const marker = new Marker({ element: el }).setLngLat([cp.coordinates.lng, cp.coordinates.lat]).addTo(map);
        markersRef.current.push(marker);
      });
    }

    // 6. IoT Ultrasonic Water Depth Surcharge Sensors
    if (activeLayers.iotSensors || showIoTSensors) {
      IOT_SURCHARGE_SENSORS.forEach(sensor => {
        const el = document.createElement('div');
        el.className = 'cursor-pointer group flex flex-col items-center';
        el.innerHTML = `
          <div class="p-1.5 rounded-xl bg-teal-600 text-white shadow-lg shadow-teal-600/40 border-2 border-white transform transition-transform group-hover:scale-125 relative">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            <span class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-300 border border-white animate-ping"></span>
          </div>
          <span class="text-[8px] font-mono font-bold bg-teal-950 text-teal-200 px-1 py-0.2 rounded mt-0.5 whitespace-nowrap shadow-xs">
            ${sensor.code} (${sensor.currentLevelCm}cm)
          </span>
        `;
        el.addEventListener('click', () => {
          setSelectedFeature({ type: 'IOT_SENSOR', ...sensor });
          if (onSelectIoTSensor) onSelectIoTSensor(sensor);
        });
        const marker = new Marker({ element: el }).setLngLat([sensor.coordinates.lng, sensor.coordinates.lat]).addTo(map);
        markersRef.current.push(marker);
      });
    }

    // 7. Critical Subways & Underpasses
    if (activeLayers.subwayBadges || showSubwayBadges) {
      CRITICAL_SUBWAYS_DATA.forEach(sub => {
        const el = document.createElement('div');
        el.className = 'cursor-pointer group flex flex-col items-center';
        const isClosed = sub.barrierStatus.includes('CLOSED');
        el.innerHTML = `
          <div class="p-1.5 rounded-xl ${isClosed ? 'bg-red-700 shadow-red-700/50' : 'bg-amber-600 shadow-amber-600/50'} text-white shadow-lg border-2 border-white transform transition-transform group-hover:scale-125 relative">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            ${isClosed ? '<span class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-400 border border-white animate-ping"></span>' : ''}
          </div>
          <span class="text-[8px] font-mono font-bold ${isClosed ? 'bg-red-950 text-red-200' : 'bg-amber-950 text-amber-200'} px-1 py-0.2 rounded mt-0.5 whitespace-nowrap shadow-xs">
            ${sub.name.split(' ')[0]} (${sub.currentDepthCm}cm)
          </span>
        `;
        el.addEventListener('click', () => {
          setSelectedFeature({ type: 'SUBWAY', ...sub });
          if (onSelectSubway) onSelectSubway(sub);
        });
        const marker = new Marker({ element: el }).setLngLat([sub.coordinates.lng, sub.coordinates.lat]).addTo(map);
        markersRef.current.push(marker);
      });
    }

  }, [activeLayers, mapLoaded, onOpenCCTVModal, onSelectHazard, onSelectSafePlace, showIoTSensors, showSubwayBadges, onSelectIoTSensor, onSelectSubway]);

  return (
    <div className={`relative w-full ${height} rounded-3xl border border-slate-200 shadow-sm overflow-hidden select-none bg-slate-100`}>
      
      {/* Top Floating Map Info Bar */}
      <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-2 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono font-extrabold text-slate-900 uppercase tracking-wider">
            {TILE_STYLES[activeTileStyle].name}
          </span>
          <span className="text-[10px] font-mono font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
            {currentTimeline.label}
          </span>
        </div>

        <div className="hidden sm:flex bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm items-center gap-2.5 text-[11px] font-mono">
          <span className="text-slate-500">Vehicle: <strong className="text-purple-700">{vehicleConfig.label} ({vehicleClearanceCm}cm)</strong></span>
          {depthSurcharge !== 0 && (
            <>
              <span className="text-slate-300">•</span>
              <span className="text-amber-700 font-bold">Surcharge: +{depthSurcharge}cm</span>
            </>
          )}
        </div>

        {isMeasuringMode && (
          <div className="bg-indigo-600 text-white px-3 py-1.5 rounded-xl shadow-md flex items-center gap-2 text-xs font-mono font-bold animate-pulse">
            <Ruler className="w-3.5 h-3.5" />
            <span>Click map points: {measurementDistance} km</span>
            <button onClick={resetMeasureTool} className="ml-1 text-[10px] underline hover:text-indigo-200">
              Reset
            </button>
          </div>
        )}

        {isPinDropperMode && (
          <div className="bg-amber-600 text-white px-3 py-1.5 rounded-xl shadow-md flex items-center gap-2 text-xs font-mono font-bold animate-bounce">
            <Crosshair className="w-3.5 h-3.5" />
            <span>Click anywhere to report hazard pin</span>
          </div>
        )}
      </div>

      {/* Floating Basemap & 3D Tools (Top Right) */}
      <div className="absolute top-3 right-14 z-20 flex items-center gap-1.5 pointer-events-auto">
        {/* 3D Perspective Tilt Button */}
        <button
          onClick={toggle3D}
          className={`p-2 rounded-xl backdrop-blur-md border text-xs font-mono font-bold transition-all shadow-sm flex items-center gap-1 ${
            is3D ? 'bg-purple-600 text-white border-purple-700' : 'bg-white/95 text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
          title="Toggle 2D / 3D Isometric View"
        >
          <Compass className={`w-3.5 h-3.5 ${is3D ? 'animate-spin' : ''}`} />
          <span className="text-[10px]">{is3D ? '3D Active' : '2D'}</span>
        </button>

        {/* 5 Basemaps Selector */}
        <div className="bg-white/95 backdrop-blur-md p-0.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-0.5 text-[10px] font-mono font-bold">
          {Object.entries(TILE_STYLES).map(([key, styleObj]) => (
            <button
              key={key}
              onClick={() => setActiveTileStyle(key)}
              className={`px-2 py-1 rounded-lg transition-all ${
                activeTileStyle === key ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title={styleObj.name}
            >
              {styleObj.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Actual Map Container */}
      <div 
        ref={mapContainer} 
        className={`w-full h-full ${isPinDropperMode ? 'cursor-crosshair' : ''}`} 
      />

      {/* Layer Toggles Strip (Bottom Center / Left) */}
      <div className="absolute bottom-3 left-3 z-20 flex flex-wrap items-center gap-1.5 pointer-events-auto max-w-[85%] sm:max-w-none">
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200 shadow-md flex flex-wrap items-center gap-1 text-[10px] font-mono font-bold">
          <button
            onClick={() => setActiveLayers(p => ({ ...p, floodPolygons: !p.floodPolygons }))}
            className={`px-2 py-1 rounded-xl transition-all ${
              activeLayers.floodPolygons ? 'bg-red-100 text-red-800' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            🌊 Basins
          </button>
          <button
            onClick={() => setActiveLayers(p => ({ ...p, roads: !p.roads }))}
            className={`px-2 py-1 rounded-xl transition-all ${
              activeLayers.roads ? 'bg-purple-100 text-purple-900' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            🛣️ Arteries
          </button>
          <button
            onClick={() => setActiveLayers(p => ({ ...p, hazards: !p.hazards }))}
            className={`px-2 py-1 rounded-xl transition-all ${
              activeLayers.hazards ? 'bg-amber-100 text-amber-900' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            ⚠️ Hazards
          </button>
          <button
            onClick={() => setActiveLayers(p => ({ ...p, safePlaces: !p.safePlaces }))}
            className={`px-2 py-1 rounded-xl transition-all ${
              activeLayers.safePlaces ? 'bg-emerald-100 text-emerald-900' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            🏥 Havens
          </button>
          <button
            onClick={() => setActiveLayers(p => ({ ...p, cctv: !p.cctv }))}
            className={`px-2 py-1 rounded-xl transition-all ${
              activeLayers.cctv ? 'bg-indigo-100 text-indigo-900' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            📷 CCTV ({CCTV_CAMERAS_DATA.length})
          </button>
          <button
            onClick={() => setActiveLayers(p => ({ ...p, pumpingStations: !p.pumpingStations }))}
            className={`px-2 py-1 rounded-xl transition-all ${
              activeLayers.pumpingStations ? 'bg-cyan-100 text-cyan-900' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            ⚙️ Pumps (6)
          </button>
          <button
            onClick={() => setActiveLayers(p => ({ ...p, communityPins: !p.communityPins }))}
            className={`px-2 py-1 rounded-xl transition-all ${
              activeLayers.communityPins ? 'bg-fuchsia-100 text-fuchsia-900' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            👥 Citizen Pins
          </button>
          <button
            onClick={() => setActiveLayers(p => ({ ...p, exclusionRadii: !p.exclusionRadii }))}
            className={`px-2 py-1 rounded-xl transition-all ${
              activeLayers.exclusionRadii ? 'bg-rose-100 text-rose-900 font-extrabold' : 'text-slate-400 hover:text-slate-700'
            }`}
            title="15m danger exclusion zones around live electrical feeders and open manholes"
          >
            ⭕ 15m Buffer
          </button>
        </div>
      </div>

      {/* Selected Feature Contextual Bottom Card (Interactive Inspect) */}
      {selectedFeature && (
        <div className="absolute bottom-3 right-3 max-w-sm w-full z-30 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200 shadow-xl pointer-events-auto animate-slideUp">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                {selectedFeature.type.replace('_', ' ')} INSPECTION
              </span>
              <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                {selectedFeature.name || selectedFeature.title}
              </h3>
            </div>
            <button 
              onClick={() => setSelectedFeature(null)}
              className="text-xs font-mono p-1 rounded-lg text-slate-400 hover:text-slate-900"
            >
              ✕
            </button>
          </div>

          {selectedFeature.type === 'FLOOD_ZONE' && (
            <div className="space-y-2 mt-2 text-xs">
              <div className="grid grid-cols-3 gap-1.5 text-center font-mono">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-[9px] text-slate-500 block">Depth</span>
                  <span className="text-sm font-bold text-red-600">{selectedFeature.depth} cm</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-[9px] text-slate-500 block">Risk</span>
                  <span className="text-xs font-bold text-purple-700 mt-0.5 block">{selectedFeature.risk}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-[9px] text-slate-500 block">Peak In</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block">+{selectedFeature.arrivalMin}m</span>
                </div>
              </div>
              <button 
                onClick={() => navigateTo('route')}
                className="w-full mt-2 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                Plan Detour Around This Basin
              </button>
            </div>
          )}

          {selectedFeature.type === 'ROAD' && (
            <div className="space-y-2 mt-2 text-xs">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 font-mono flex items-center justify-between">
                <span>Water Level: <strong>{selectedFeature.simulatedDepth || selectedFeature.currentDepth} cm</strong></span>
                <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                  selectedFeature.isPassable ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {selectedFeature.isPassable ? 'PASSABLE' : 'STALL RISK'}
                </span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {selectedFeature.recommendation}
              </p>
              <button 
                onClick={() => navigateTo('hud')}
                className="w-full mt-1 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition"
              >
                <NavigationIcon className="w-3.5 h-3.5" /> Start Turn-by-Turn Guidance
              </button>
            </div>
          )}

          {selectedFeature.type === 'CCTV' && (
            <div className="space-y-2 mt-2 text-xs">
              <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 font-mono text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span>Camera Code:</span>
                  <strong>{selectedFeature.camCode}</strong>
                </div>
                <div className="flex justify-between">
                  <span>AI Water Gauge:</span>
                  <strong className="text-red-700">{selectedFeature.waterLevelCm} cm (Threshold: {selectedFeature.maxThresholdCm}cm)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Velocity:</span>
                  <span>{selectedFeature.flowVelocity}</span>
                </div>
              </div>
              <button 
                onClick={() => onOpenCCTVModal && onOpenCCTVModal(selectedFeature)}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition"
              >
                <Video className="w-3.5 h-3.5" /> View Live Simulated CCTV Stream
              </button>
            </div>
          )}

          {selectedFeature.type === 'PUMP' && (
            <div className="space-y-2 mt-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-900 text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span>Turbines:</span>
                  <strong>{selectedFeature.runningPumps} / {selectedFeature.totalPumps} Active</strong>
                </div>
                <div className="flex justify-between">
                  <span>Discharge Rate:</span>
                  <strong>{selectedFeature.currentDischargeLPS?.toLocaleString()} LPS</strong>
                </div>
                <div className="flex justify-between">
                  <span>Gate Status:</span>
                  <strong className="text-emerald-700">{selectedFeature.gateStatus}</strong>
                </div>
              </div>
              <p className="text-[10px] text-slate-600">
                {selectedFeature.statusText}
              </p>
            </div>
          )}

          {selectedFeature.type === 'COMMUNITY_PIN' && (
            <div className="space-y-2 mt-2 text-xs">
              <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-[11px] font-mono space-y-1">
                <div className="flex justify-between">
                  <span>Reported Depth:</span>
                  <strong>{selectedFeature.depthCm} cm</strong>
                </div>
                <div className="flex justify-between">
                  <span>Reported By:</span>
                  <span>{selectedFeature.reportedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span>Verified Votes:</span>
                  <strong className="text-indigo-700">{selectedFeature.upvotes} Citizens confirmed</strong>
                </div>
              </div>
              <button 
                onClick={() => {
                  selectedFeature.upvotes += 1;
                  setSelectedFeature({ ...selectedFeature });
                }}
                className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition"
              >
                👍 Confirm & Upvote Hazard (+1)
              </button>
            </div>
          )}

          {selectedFeature.type === 'HAZARD' && (
            <div className="space-y-2 mt-2 text-xs">
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-[11px] font-mono leading-relaxed">
                <strong>Safety Warning:</strong> {selectedFeature.instruction}
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                <span>Verified: {selectedFeature.verificationSource}</span>
                <span className="text-red-600 font-bold">{selectedFeature.severity}</span>
              </div>
            </div>
          )}

          {selectedFeature.type === 'SAFE_PLACE' && (
            <div className="space-y-2 mt-2 text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px]">
                <strong>Corridor Approach:</strong> {selectedFeature.corridorNotes || selectedFeature.safeRouteInfo}
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                <span className="text-slate-500">Elevation: <strong>{selectedFeature.elevation}</strong></span>
                <a href={`tel:${selectedFeature.phone}`} className="text-purple-600 font-bold hover:underline">
                  Call Desk
                </a>
              </div>
            </div>
          )}

          {selectedFeature.type === 'IOT_SENSOR' && (
            <div className="space-y-2 mt-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-950 text-[11px] space-y-1.5">
                <div className="flex justify-between">
                  <span>Sensor Code:</span>
                  <strong className="text-teal-800">{selectedFeature.code}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Water Depth:</span>
                  <strong className="text-red-700 font-bold">{selectedFeature.currentLevelCm} cm</strong>
                </div>
                <div className="flex justify-between">
                  <span>Culvert Freeboard:</span>
                  <span>{selectedFeature.freeboardCm} cm remaining</span>
                </div>
                <div className="flex justify-between">
                  <span>Trend Rate:</span>
                  <span className="text-amber-700 font-bold">{selectedFeature.trend}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 pt-1 border-t border-teal-200/60">
                  <span>Battery: {selectedFeature.batteryPercent}%</span>
                  <span>Sync: {selectedFeature.transmissionRate}</span>
                </div>
              </div>
            </div>
          )}

          {selectedFeature.type === 'SUBWAY' && (
            <div className="space-y-2 mt-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-[11px] space-y-1.5">
                <div className="flex justify-between items-center">
                  <span>Current Water:</span>
                  <strong className="text-red-600 text-sm">{selectedFeature.currentDepthCm} cm</strong>
                </div>
                <div className="flex justify-between">
                  <span>Peak Forecast:</span>
                  <strong className="text-purple-700">{selectedFeature.forecastPeakDepthCm} cm ({selectedFeature.peakTimeETA})</strong>
                </div>
                <div className="flex justify-between">
                  <span>Barrier Status:</span>
                  <strong className={selectedFeature.barrierStatus.includes('CLOSED') ? 'text-red-700 font-bold' : 'text-amber-700'}>
                    {selectedFeature.barrierStatus}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Pumps Active:</span>
                  <span>{selectedFeature.activePumps}</span>
                </div>
              </div>
              <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[10px]">
                <strong>Bypass Directive:</strong> {selectedFeature.bypassRoute}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
