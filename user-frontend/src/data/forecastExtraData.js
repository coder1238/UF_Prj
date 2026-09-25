// Rich dummy dataset specifically for Mumbai 0-3h Forecast Nowcasting System

// 1. Ward-specific Hydrograph Curves (Rainfall mm/h, Depth cm, P10/P50/P90, Runoff)
export const WARD_HYDROGRAPHS = {
  'ward-l': {
    wardName: 'Ward L — Kurla & Kalina Basin',
    points: [
      { time: '20:30', slice: 'NOW', rain: 22, depth: 8, p10: 5, p50: 8, p90: 12, runoffCoeff: 0.72 },
      { time: '21:00', slice: '+30m', rain: 35, depth: 16, p10: 12, p50: 16, p90: 21, runoffCoeff: 0.81 },
      { time: '21:30', slice: '+60m', rain: 48, depth: 27, p10: 22, p50: 27, p90: 34, runoffCoeff: 0.88 },
      { time: '22:00', slice: '+90m', rain: 62, depth: 39, p10: 33, p50: 39, p90: 46, runoffCoeff: 0.94 },
      { time: '22:30', slice: '+120m', rain: 52, depth: 35, p10: 28, p50: 35, p90: 42, runoffCoeff: 0.89 },
      { time: '23:30', slice: '+180m', rain: 24, depth: 20, p10: 14, p50: 20, p90: 26, runoffCoeff: 0.70 }
    ],
    catchmentAreaKm2: 24.5,
    criticalSpillway: 'Mithi River S-Bend at Kranti Nagar',
    gravityOutfallStatus: 'BLOCKED_BY_TIDE'
  },
  'ward-k-west': {
    wardName: 'Ward K-West — Andheri West & Juhu',
    points: [
      { time: '20:30', slice: 'NOW', rain: 28, depth: 12, p10: 8, p50: 12, p90: 17, runoffCoeff: 0.76 },
      { time: '21:00', slice: '+30m', rain: 44, depth: 22, p10: 18, p50: 22, p90: 28, runoffCoeff: 0.85 },
      { time: '21:30', slice: '+60m', rain: 56, depth: 34, p10: 29, p50: 34, p90: 41, runoffCoeff: 0.91 },
      { time: '22:00', slice: '+90m', rain: 68, depth: 45, p10: 39, p50: 45, p90: 53, runoffCoeff: 0.96 },
      { time: '22:30', slice: '+120m', rain: 40, depth: 38, p10: 31, p50: 38, p90: 45, runoffCoeff: 0.88 },
      { time: '23:30', slice: '+180m', rain: 18, depth: 22, p10: 15, p50: 22, p90: 29, runoffCoeff: 0.65 }
    ],
    catchmentAreaKm2: 21.0,
    criticalSpillway: 'Irla Nullah Outfall at Juhu Beach',
    gravityOutfallStatus: 'RESTRICTED'
  },
  'ward-k-east': {
    wardName: 'Ward K-East — Andheri East & Saki Naka',
    points: [
      { time: '20:30', slice: 'NOW', rain: 18, depth: 6, p10: 4, p50: 6, p90: 10, runoffCoeff: 0.68 },
      { time: '21:00', slice: '+30m', rain: 30, depth: 14, p10: 10, p50: 14, p90: 19, runoffCoeff: 0.77 },
      { time: '21:30', slice: '+60m', rain: 45, depth: 24, p10: 19, p50: 24, p90: 31, runoffCoeff: 0.84 },
      { time: '22:00', slice: '+90m', rain: 54, depth: 36, p10: 30, p50: 36, p90: 43, runoffCoeff: 0.90 },
      { time: '22:30', slice: '+120m', rain: 36, depth: 30, p10: 24, p50: 30, p90: 37, runoffCoeff: 0.82 },
      { time: '23:30', slice: '+180m', rain: 15, depth: 16, p10: 10, p50: 16, p90: 22, runoffCoeff: 0.60 }
    ],
    catchmentAreaKm2: 28.2,
    criticalSpillway: 'Pawai Culvert into Mithi Tributary',
    gravityOutfallStatus: 'PARTIAL_FLOW'
  },
  'ward-h-west': {
    wardName: 'Ward H-West — Bandra West & Khar',
    points: [
      { time: '20:30', slice: 'NOW', rain: 14, depth: 3, p10: 1, p50: 3, p90: 6, runoffCoeff: 0.62 },
      { time: '21:00', slice: '+30m', rain: 22, depth: 7, p10: 4, p50: 7, p90: 11, runoffCoeff: 0.70 },
      { time: '21:30', slice: '+60m', rain: 32, depth: 12, p10: 8, p50: 12, p90: 17, runoffCoeff: 0.76 },
      { time: '22:00', slice: '+90m', rain: 38, depth: 16, p10: 12, p50: 16, p90: 22, runoffCoeff: 0.81 },
      { time: '22:30', slice: '+120m', rain: 28, depth: 13, p10: 9, p50: 13, p90: 18, runoffCoeff: 0.73 },
      { time: '23:30', slice: '+180m', rain: 12, depth: 6, p10: 3, p50: 6, p90: 10, runoffCoeff: 0.55 }
    ],
    catchmentAreaKm2: 12.8,
    criticalSpillway: 'Gazdarbandh Tidal Sluice Gate',
    gravityOutfallStatus: 'PUMPING_DISCHARGE'
  },
  'ward-f-north': {
    wardName: 'Ward F-North — Sion & Matunga / Hindmata',
    points: [
      { time: '20:30', slice: 'NOW', rain: 26, depth: 14, p10: 10, p50: 14, p90: 19, runoffCoeff: 0.80 },
      { time: '21:00', slice: '+30m', rain: 42, depth: 25, p10: 20, p50: 25, p90: 31, runoffCoeff: 0.88 },
      { time: '21:30', slice: '+60m', rain: 58, depth: 36, p10: 30, p50: 36, p90: 44, runoffCoeff: 0.93 },
      { time: '22:00', slice: '+90m', rain: 66, depth: 46, p10: 40, p50: 46, p90: 54, runoffCoeff: 0.97 },
      { time: '22:30', slice: '+120m', rain: 44, depth: 40, p10: 33, p50: 40, p90: 48, runoffCoeff: 0.89 },
      { time: '23:30', slice: '+180m', rain: 20, depth: 25, p10: 18, p50: 25, p90: 32, runoffCoeff: 0.72 }
    ],
    catchmentAreaKm2: 18.4,
    criticalSpillway: 'Britannia Sluice & Pramod Mahajan Holding Tanks',
    gravityOutfallStatus: 'HOLDING_TANKS_ACTIVE'
  },
  'ward-g-north': {
    wardName: 'Ward G-North — Mahim & Dharavi Outfall',
    points: [
      { time: '20:30', slice: 'NOW', rain: 20, depth: 7, p10: 4, p50: 7, p90: 11, runoffCoeff: 0.70 },
      { time: '21:00', slice: '+30m', rain: 32, depth: 15, p10: 11, p50: 15, p90: 20, runoffCoeff: 0.79 },
      { time: '21:30', slice: '+60m', rain: 44, depth: 22, p10: 17, p50: 22, p90: 28, runoffCoeff: 0.85 },
      { time: '22:00', slice: '+90m', rain: 52, depth: 26, p10: 20, p50: 26, p90: 33, runoffCoeff: 0.90 },
      { time: '22:30', slice: '+120m', rain: 35, depth: 22, p10: 16, p50: 22, p90: 28, runoffCoeff: 0.80 },
      { time: '23:30', slice: '+180m', rain: 16, depth: 12, p10: 8, p50: 12, p90: 17, runoffCoeff: 0.62 }
    ],
    catchmentAreaKm2: 15.6,
    criticalSpillway: 'Mahim Bay Tidal Creek',
    gravityOutfallStatus: 'BLOCKED_BY_TIDE'
  },
  'ward-a': {
    wardName: 'Ward A — Fort & South Coast',
    points: [
      { time: '20:30', slice: 'NOW', rain: 10, depth: 1, p10: 0, p50: 1, p90: 3, runoffCoeff: 0.50 },
      { time: '21:00', slice: '+30m', rain: 16, depth: 3, p10: 1, p50: 3, p90: 5, runoffCoeff: 0.58 },
      { time: '21:30', slice: '+60m', rain: 22, depth: 4, p10: 2, p50: 4, p90: 7, runoffCoeff: 0.63 },
      { time: '22:00', slice: '+90m', rain: 25, depth: 5, p10: 3, p50: 5, p90: 8, runoffCoeff: 0.67 },
      { time: '22:30', slice: '+120m', rain: 18, depth: 4, p10: 2, p50: 4, p90: 6, runoffCoeff: 0.60 },
      { time: '23:30', slice: '+180m', rain: 8, depth: 2, p10: 0, p50: 2, p90: 4, runoffCoeff: 0.45 }
    ],
    catchmentAreaKm2: 11.2,
    criticalSpillway: 'Colaba Outfall into Arabian Sea',
    gravityOutfallStatus: 'FREE_DISCHARGE'
  }
};

// 2. Critical Mumbai Underpasses & Subways (Feature 7)
export const CRITICAL_SUBWAYS_DATA = [
  {
    id: 'sub-milan',
    name: 'Milan Subway Underpass',
    ward: 'Ward K-West',
    carriageway: 'SV Road / Santacruz West',
    coordinates: { lat: 19.0825, lng: 72.8410 },
    currentDepthCm: 35,
    forecastPeakDepthCm: 48,
    peakTimeETA: '+45 min',
    barrierStatus: 'DEPLOYED_CLOSED',
    activePumps: '2 of 3 Active (1,800 L/min)',
    waterVelocity: '0.65 m/s',
    riskLevel: 'CRITICAL',
    bypassRoute: 'Use Milan Flyover Top Deck (Clear)',
    cameraFeed: 'CCTV-K114'
  },
  {
    id: 'sub-andheri',
    name: 'Andheri Subway (SV Rd Sump)',
    ward: 'Ward K-West',
    carriageway: 'Andheri Station West Approach',
    coordinates: { lat: 19.1136, lng: 72.8697 },
    currentDepthCm: 38,
    forecastPeakDepthCm: 52,
    peakTimeETA: '+35 min',
    barrierStatus: 'DEPLOYED_CLOSED',
    activePumps: '3 of 4 Active (2,400 L/min)',
    waterVelocity: '0.72 m/s',
    riskLevel: 'CRITICAL',
    bypassRoute: 'Divert to Gokhale Bridge (Open)',
    cameraFeed: 'CCTV-AND-01'
  },
  {
    id: 'sub-khar',
    name: 'Khar Subway Underpass',
    ward: 'Ward H-West',
    carriageway: 'S.V. Road to Linking Road Link',
    coordinates: { lat: 19.0680, lng: 72.8390 },
    currentDepthCm: 18,
    forecastPeakDepthCm: 29,
    peakTimeETA: '+60 min',
    barrierStatus: 'FLASHING_CAUTION',
    activePumps: '1 of 2 Active (900 L/min)',
    waterVelocity: '0.35 m/s',
    riskLevel: 'HIGH',
    bypassRoute: 'Use Khar Danda Elevated Road',
    cameraFeed: 'CCTV-KHAR-02'
  },
  {
    id: 'sub-malad',
    name: 'Malad Subway (Western Rly Span)',
    ward: 'Ward P-North',
    carriageway: 'Malad Station East-West connector',
    coordinates: { lat: 19.1860, lng: 72.8490 },
    currentDepthCm: 22,
    forecastPeakDepthCm: 33,
    peakTimeETA: '+50 min',
    barrierStatus: 'RESTRICTED_ACCESS',
    activePumps: '2 of 2 Active (1,500 L/min)',
    waterVelocity: '0.40 m/s',
    riskLevel: 'HIGH',
    bypassRoute: 'Use Chincholi Bunder Flyover',
    cameraFeed: 'CCTV-MLD-01'
  },
  {
    id: 'sub-dahisar',
    name: 'Dahisar River Culvert Subway',
    ward: 'Ward R-North',
    carriageway: 'WEH Dahisar Toll Plazas Link',
    coordinates: { lat: 19.2550, lng: 72.8590 },
    currentDepthCm: 12,
    forecastPeakDepthCm: 20,
    peakTimeETA: '+75 min',
    barrierStatus: 'OPEN_CAUTION',
    activePumps: '1 of 1 Active (600 L/min)',
    waterVelocity: '0.22 m/s',
    riskLevel: 'MODERATE',
    bypassRoute: 'Direct WEH Main Highway',
    cameraFeed: 'CCTV-DAH-03'
  }
];

// 3. IoT Ultrasonic Stormwater Surcharge Sensors (Dummy Data for Map)
export const IOT_SURCHARGE_SENSORS = [
  {
    id: 'sensor-iot-01',
    code: 'IOT-KUR-01',
    name: 'LBS Marg Mithi Culvert Ultrasonic Sensor',
    ward: 'Ward L',
    coordinates: { lat: 19.0695, lng: 72.8785 },
    currentLevelCm: 24,
    freeboardCm: 16,
    batteryPercent: 94,
    transmissionRate: 'Every 30s',
    trend: 'RISING_FAST (+3cm / 10m)',
    thresholdAlert: 'WARNING_LEVEL',
    tempC: 26.4
  },
  {
    id: 'sensor-iot-02',
    code: 'IOT-HND-04',
    name: 'Hindmata Flyover Holding Tank Ultrasonic Sensor',
    ward: 'Ward F-North',
    coordinates: { lat: 19.0135, lng: 72.8435 },
    currentLevelCm: 32,
    freeboardCm: 8,
    batteryPercent: 88,
    transmissionRate: 'Every 30s',
    trend: 'RISING_STEADY (+2cm / 10m)',
    thresholdAlert: 'CRITICAL_SPILLWAY',
    tempC: 27.1
  },
  {
    id: 'sensor-iot-03',
    code: 'IOT-MIL-02',
    name: 'Milan Sump Lowest Datum Depth Gauge',
    ward: 'Ward K-West',
    coordinates: { lat: 19.0820, lng: 72.8415 },
    currentLevelCm: 35,
    freeboardCm: 5,
    batteryPercent: 96,
    transmissionRate: 'Every 15s',
    trend: 'SURCHARGE_DETECTED',
    thresholdAlert: 'FLOODED_CLOSURE',
    tempC: 26.8
  },
  {
    id: 'sensor-iot-04',
    code: 'IOT-SN-09',
    name: 'Saki Naka Asalpha Gutter Pressure Transducer',
    ward: 'Ward K-East',
    coordinates: { lat: 19.1110, lng: 72.8845 },
    currentLevelCm: 16,
    freeboardCm: 24,
    batteryPercent: 91,
    transmissionRate: 'Every 60s',
    trend: 'SLOW_RISE (+1cm / 10m)',
    thresholdAlert: 'NORMAL_CAUTION',
    tempC: 27.0
  },
  {
    id: 'sensor-iot-05',
    code: 'IOT-MHM-03',
    name: 'Mahim Causeway Tidal Creek Crest Gauge',
    ward: 'Ward G-North',
    coordinates: { lat: 19.0430, lng: 72.8480 },
    currentLevelCm: 14,
    freeboardCm: 26,
    batteryPercent: 99,
    transmissionRate: 'Every 30s',
    trend: 'TIDAL_INFLUX (+4cm / 10m)',
    thresholdAlert: 'SPRING_TIDE_RISK',
    tempC: 27.8
  }
];

// 4. Surface Runoff Hydraulic Flow Direction Vectors (GeoJSON LineStrings)
export const RUNOFF_VECTORS_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'flow-kurla-mithi',
        velocity: '0.62 m/s',
        source: 'Kalina Ridge',
        sink: 'Mithi River Basin',
        hazard: 'HIGH_SHEAR'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [72.8680, 19.0780],
          [72.8730, 19.0720],
          [72.8780, 19.0670],
          [72.8820, 19.0630]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'flow-hindmata-dadar',
        velocity: '0.54 m/s',
        source: 'Parel High Ground',
        sink: 'Hindmata Sump Basin',
        hazard: 'DEPRESSION_PONDING'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [72.8400, 19.0040],
          [72.8420, 19.0100],
          [72.8450, 19.0160],
          [72.8480, 19.0200]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'flow-andheri-irla',
        velocity: '0.78 m/s',
        source: 'Andheri Station East Slopes',
        sink: 'Irla Nullah Drainage Canal',
        hazard: 'RAPID_DISCHARGE'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [72.8550, 19.1180],
          [72.8480, 19.1150],
          [72.8400, 19.1110],
          [72.8320, 19.1060]
        ]
      }
    }
  ]
};

// 5. Critical Infrastructure Ingress Matrix (Feature 15)
export const CRITICAL_INFRASTRUCTURE_DATA = [
  {
    id: 'inf-hosp-1',
    name: 'Cooper Municipal General Hospital',
    type: 'Emergency Tertiary Hospital',
    ward: 'Ward K-West',
    location: 'JVPD Scheme, Vile Parle West',
    coordinates: { lat: 19.1080, lng: 72.8360 },
    floodRisk: 'LOW',
    waterIngressStatus: 'DRY_SANDBAGGED',
    ambulanceAccess: '100% Passable via Juhu Tara Rd',
    emergencyGenerator: 'Operational (Rooftop elevated)',
    bedCapacityAvailable: 142
  },
  {
    id: 'inf-hosp-2',
    name: 'Lokmanya Tilak Municipal General Hospital (Sion)',
    type: 'Apex Trauma & Disaster Center',
    ward: 'Ward F-North',
    location: 'Sion West',
    coordinates: { lat: 19.0360, lng: 72.8600 },
    floodRisk: 'HIGH_CAUTION',
    waterIngressStatus: 'GATE_WATER_18CM',
    ambulanceAccess: 'Diverted via East Wing Elevated Ramp',
    emergencyGenerator: 'Pumping active in basement sub-station',
    bedCapacityAvailable: 88
  },
  {
    id: 'inf-metro-1',
    name: 'Metro Line 3 (Aqua Line) - BKC Underground Concourse',
    type: 'Subterranean Rapid Transit',
    ward: 'Ward L',
    location: 'BKC G-Block',
    coordinates: { lat: 19.0640, lng: 72.8680 },
    floodRisk: 'PROTECTED',
    waterIngressStatus: 'FLOODGATES_SEALED',
    ambulanceAccess: 'Elevated pedestrian footbridges open',
    emergencyGenerator: 'High-speed automated sump pumps operational',
    bedCapacityAvailable: 'Transit Normal'
  },
  {
    id: 'inf-power-1',
    name: 'BEST Substation #14 - Milan Carriageway',
    type: 'Electrical Feeder Grid',
    ward: 'Ward K-West',
    location: 'Milan Subway South Berm',
    coordinates: { lat: 19.0815, lng: 72.8420 },
    floodRisk: 'CRITICAL',
    waterIngressStatus: 'ISOLATED_POWER_SHUTOFF',
    ambulanceAccess: '15m Exclusion Perimeter enforced',
    emergencyGenerator: 'Backup line switched to high feeder',
    bedCapacityAvailable: 'Hazard Active'
  }
];

// 6. 32-Member Ensemble Physics Decomposition (Feature 6 & 17)
export const ENSEMBLE_DETAILS = {
  totalMembers: 32,
  confidencePercent: 89.4,
  spreadVarianceCm: '±3.8 cm',
  leadTimeHours: 3,
  modelsIncluded: [
    { name: 'GNN-SWMM Hybrid (Graph Neural Net + Hydrodynamic 2D-SWE)', weight: 35, spreadCm: '±2.1' },
    { name: 'DGMR Doppler Radar Generative Diffusion', weight: 25, spreadCm: '±3.2' },
    { name: 'WRF-Hydro High-Res Catchment Solver (100m)', weight: 25, spreadCm: '±3.9' },
    { name: 'PySTEPS Lagrangian Advective Ensemble', weight: 15, spreadCm: '±4.6' }
  ],
  uncertaintyContributors: [
    { factor: 'Radar Z-R Reflectivity Calibration', varianceCm: 1.8, description: 'Doppler attenuation in intense cloudburst cores' },
    { factor: "Drainage Surcharge & Manning's Roughness", varianceCm: 1.2, description: 'Debris blockage dynamic variability in urban sumps' },
    { factor: 'Tidal Boundary Surge Lockout Timing', varianceCm: 0.9, description: 'Slight lunar gravitational timing shift at Mahim Outfall' },
    { factor: 'Vehicular Wave Displacement', varianceCm: 0.4, description: 'Heavy truck wakes displacing gutter crests' }
  ]
};

// 7. Historical Mumbai Deluge Analog Matches (Feature 18)
export const HISTORICAL_ANALOG_EVENTS = [
  {
    id: 'analog-2017',
    date: '29 August 2017',
    title: 'Severe Convective Convergence Cloudburst',
    similarityScore: 84,
    peakRecordedRain: '79 mm/h',
    peakFloodingCm: '42 cm (LBS & Milan)',
    outcomeSummary: 'High tide of 4.3m locked drainage for 2.5 hours. Pumping stations prevented 2005-scale inundation.',
    keyMitigation: 'Keep away from railway subways between 21:00 and 22:30.'
  },
  {
    id: 'analog-2019',
    date: '4 July 2019',
    title: 'Offshore Trough Prolonged Monsoon Surge',
    similarityScore: 78,
    peakRecordedRain: '68 mm/h',
    peakFloodingCm: '38 cm (Hindmata & Sion)',
    outcomeSummary: 'Gradual water accumulation over 3 hours. Holding tanks successfully contained 60% of runoff.',
    keyMitigation: 'Early arterial diversions via Eastern & Western Expressways.'
  },
  {
    id: 'analog-2005',
    date: '26 July 2005 (Extreme Baseline)',
    title: 'Historic Mesoscale Precipitation Vortex',
    similarityScore: 32,
    peakRecordedRain: '140 mm/h',
    peakFloodingCm: '110 cm (Catastrophic)',
    outcomeSummary: 'Current forecast does NOT show 2005 vortex characteristics. Modern automated pumps operational.',
    keyMitigation: 'Current conditions are manageable with timely travel adjustments.'
  }
];

// 8. Crowdsourced Ground Reports Seed Data (Feature 12)
export const SEED_GROUND_REPORTS = [
  {
    id: 'rep-1',
    author: 'Sunil Patil (BMC Citizen Scout)',
    location: 'LBS Marg near Phoenix Marketcity Gate 2',
    ward: 'Ward L',
    timeAgo: '4 min ago',
    depthCm: 26,
    statusText: 'Water rising up to tire hubs. Sedans turning back; SUVs cautiously passing.',
    verified: true,
    verificationBadge: 'BMC Verified Scout',
    upvotes: 47,
    hasImage: true,
    userUpvoted: false
  },
  {
    id: 'rep-2',
    author: 'Neha Deshmukh (Resident)',
    location: 'Milan Subway East Descent Ramp',
    ward: 'Ward K-West',
    timeAgo: '11 min ago',
    depthCm: 36,
    statusText: 'Barricade down! Red flashing beacons active. Police diverting toward flyover.',
    verified: true,
    verificationBadge: 'Traffic Police Synced',
    upvotes: 63,
    hasImage: false,
    userUpvoted: true
  },
  {
    id: 'rep-3',
    author: 'Amitabh Sen (Auto Driver)',
    location: 'Sion Circle Underpass Carriageway',
    ward: 'Ward F-North',
    timeAgo: '18 min ago',
    depthCm: 28,
    statusText: 'Water half-way across low lane. Middle lane dry enough for buses.',
    verified: true,
    verificationBadge: 'Community Upvoted',
    upvotes: 35,
    hasImage: false,
    userUpvoted: false
  }
];

