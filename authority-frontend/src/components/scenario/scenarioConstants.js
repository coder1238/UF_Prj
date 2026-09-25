// Comprehensive Operational Constants & Hydraulics Dataset for Scenario Lab & Counterfactual Engine
// Mumbai Metropolitan Municipal Region (BMC / MCGM Command Center)

export const BENCHMARK_PRESETS = [
  {
    id: 'preset-2005',
    name: '26 July 2005 Catastrophic Cloudburst',
    badge: 'HISTORICAL EXTREME',
    badgeColor: 'bg-red-500/20 text-red-500 border-red-500/40',
    description: '944mm torrential cloudburst in 24h coupled with 4.85m spring tide locking the Mithi river outfall.',
    params: {
      rainfallIntensity: 140,
      durationMin: 180,
      drainBlockage: 65,
      pumpingCapacity: 45,
      tideLevel: 4.85,
      stormSpeed: 6,
    },
    metrics: {
      roadsCut: 48,
      maxDepthCm: 98.4,
      floodedAreaKm2: 8.6,
      surchargeNodes: 34,
      clearanceHrs: 9.4,
    },
  },
  {
    id: 'preset-tauktae',
    name: 'Cyclone Tauktae High Surge (2021)',
    badge: 'CYCLONIC SURGE',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
    description: 'Very Severe Cyclonic Storm with 110 mm/h convective bands, 4.95m coastal storm tide, and widespread silt backflow.',
    params: {
      rainfallIntensity: 110,
      durationMin: 120,
      drainBlockage: 50,
      pumpingCapacity: 60,
      tideLevel: 4.95,
      stormSpeed: 18,
    },
    metrics: {
      roadsCut: 39,
      maxDepthCm: 76.2,
      floodedAreaKm2: 5.8,
      surchargeNodes: 26,
      clearanceHrs: 6.8,
    },
  },
  {
    id: 'preset-king-tide',
    name: 'Spring King Tide + Convective Burst',
    badge: 'TIDAL LOCKOUT',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
    description: 'Astronomical Perigean King Tide (5.10m MSL) forcing all 6 major sea outfalls shut during 95 mm/h rain burst.',
    params: {
      rainfallIntensity: 95,
      durationMin: 90,
      drainBlockage: 40,
      pumpingCapacity: 50,
      tideLevel: 5.1,
      stormSpeed: 10,
    },
    metrics: {
      roadsCut: 34,
      maxDepthCm: 68.0,
      floodedAreaKm2: 4.9,
      surchargeNodes: 22,
      clearanceHrs: 5.6,
    },
  },
  {
    id: 'preset-subways',
    name: 'Subway Underpass Critical Ingress',
    badge: 'INFRASTRUCTURE STRESS',
    badgeColor: 'bg-amber-500/20 text-amber-500 border-amber-500/40',
    description: 'Localized cloudburst over Western Suburbs with severe silt clogging in Milan, Andheri, and Khar subways.',
    params: {
      rainfallIntensity: 85,
      durationMin: 60,
      drainBlockage: 70,
      pumpingCapacity: 55,
      tideLevel: 3.9,
      stormSpeed: 12,
    },
    metrics: {
      roadsCut: 31,
      maxDepthCm: 64.5,
      floodedAreaKm2: 3.8,
      surchargeNodes: 19,
      clearanceHrs: 4.8,
    },
  },
  {
    id: 'preset-baseline',
    name: 'Operational Baseline (Normal Monsoon Ops)',
    badge: 'CALIBRATED BASELINE',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    description: 'Design 1-in-2 year monsoon rain event with 100% de-silted drains, functioning pump stations, and 2.8m mean tide.',
    params: {
      rainfallIntensity: 50,
      durationMin: 60,
      drainBlockage: 15,
      pumpingCapacity: 95,
      tideLevel: 2.8,
      stormSpeed: 14,
    },
    metrics: {
      roadsCut: 12,
      maxDepthCm: 24.0,
      floodedAreaKm2: 1.4,
      surchargeNodes: 4,
      clearanceHrs: 1.6,
    },
  },
];

// Transects for Cross-Section Profile & Water Surface Profile (WSP)
export const TRANSECT_PROFILES = [
  {
    id: 'transect-hindmata',
    name: 'Hindmata Sump Basin (Ambedkar Rd)',
    chainageKm: 2.4,
    elevationGround: 4.1,
    invertLevel: 1.2,
    baselineDepth: 18.0, // cm
    points: [
      { dist: 0, bed: 4.8, baselineWsp: 4.95, invert: 2.2 },
      { dist: 150, bed: 4.4, baselineWsp: 4.58, invert: 1.8 },
      { dist: 300, bed: 4.1, baselineWsp: 4.28, invert: 1.4 },
      { dist: 450, bed: 3.9, baselineWsp: 4.18, invert: 1.2 }, // Sump center
      { dist: 600, bed: 4.0, baselineWsp: 4.22, invert: 1.3 },
      { dist: 750, bed: 4.3, baselineWsp: 4.45, invert: 1.7 },
      { dist: 900, bed: 4.7, baselineWsp: 4.85, invert: 2.1 },
    ],
  },
  {
    id: 'transect-milan',
    name: 'Milan Subway Underpass',
    chainageKm: 0.8,
    elevationGround: 2.6,
    invertLevel: -0.4,
    baselineDepth: 22.0,
    points: [
      { dist: 0, bed: 5.2, baselineWsp: 5.35, invert: 2.4 },
      { dist: 100, bed: 4.1, baselineWsp: 4.32, invert: 1.6 },
      { dist: 200, bed: 2.9, baselineWsp: 3.12, invert: 0.4 },
      { dist: 300, bed: 2.6, baselineWsp: 2.82, invert: -0.4 }, // Lowest dip
      { dist: 400, bed: 3.2, baselineWsp: 3.42, invert: 0.6 },
      { dist: 500, bed: 4.5, baselineWsp: 4.68, invert: 1.9 },
      { dist: 600, bed: 5.4, baselineWsp: 5.55, invert: 2.5 },
    ],
  },
  {
    id: 'transect-andheri',
    name: 'Andheri Subway Underpass (SV Rd Dip)',
    chainageKm: 0.95,
    elevationGround: 2.4,
    invertLevel: -0.6,
    baselineDepth: 25.0,
    points: [
      { dist: 0, bed: 5.6, baselineWsp: 5.75, invert: 2.8 },
      { dist: 120, bed: 4.2, baselineWsp: 4.45, invert: 1.5 },
      { dist: 240, bed: 2.8, baselineWsp: 3.05, invert: 0.2 },
      { dist: 360, bed: 2.4, baselineWsp: 2.65, invert: -0.6 },
      { dist: 480, bed: 3.4, baselineWsp: 3.65, invert: 0.8 },
      { dist: 600, bed: 4.8, baselineWsp: 5.02, invert: 2.0 },
      { dist: 720, bed: 5.8, baselineWsp: 5.95, invert: 3.0 },
    ],
  },
  {
    id: 'transect-kurla',
    name: 'Kurla Chunabhatti (Mithi River Bank)',
    chainageKm: 3.6,
    elevationGround: 3.2,
    invertLevel: 0.2,
    baselineDepth: 20.0,
    points: [
      { dist: 0, bed: 4.4, baselineWsp: 4.6, invert: 1.8 },
      { dist: 250, bed: 3.8, baselineWsp: 4.0, invert: 1.1 },
      { dist: 500, bed: 3.2, baselineWsp: 3.4, invert: 0.2 },
      { dist: 750, bed: 2.8, baselineWsp: 3.0, invert: -0.2 }, // River embankment
      { dist: 1000, bed: 3.1, baselineWsp: 3.3, invert: 0.1 },
      { dist: 1250, bed: 3.7, baselineWsp: 3.9, invert: 0.9 },
      { dist: 1500, bed: 4.2, baselineWsp: 4.4, invert: 1.6 },
    ],
  },
  {
    id: 'transect-mahim',
    name: 'Mahim Creek Tidal Outfall Flap Gates',
    chainageKm: 1.5,
    elevationGround: 2.8,
    invertLevel: -1.2,
    baselineDepth: 14.0,
    points: [
      { dist: 0, bed: 4.0, baselineWsp: 4.14, invert: 1.2 },
      { dist: 150, bed: 3.4, baselineWsp: 3.54, invert: 0.6 },
      { dist: 300, bed: 2.8, baselineWsp: 2.94, invert: -0.2 },
      { dist: 450, bed: 2.1, baselineWsp: 2.25, invert: -1.2 }, // Flap gates location
      { dist: 600, bed: 1.8, baselineWsp: 2.8, invert: -1.5 }, // Tidal Creek
      { dist: 750, bed: 1.5, baselineWsp: 2.8, invert: -1.8 },
    ],
  },
];

// Ward-by-Ward Comparative Inundation Matrix Data (16 Wards)
export const WARD_SCENARIO_MATRIX = [
  { ward: 'Ward F/N', name: 'Matunga / Sion / Wadala', zone: 'Island City', popRisk: 68000, baseDepth: 22, baseAreaKm2: 0.42, baseSurcharge: 2, shelters: 4, substations: 2, priority: 'CRITICAL' },
  { ward: 'Ward F/S', name: 'Parel / Sewri / Hindmata', zone: 'Island City', popRisk: 54000, baseDepth: 18, baseAreaKm2: 0.35, baseSurcharge: 1, shelters: 3, substations: 2, priority: 'CRITICAL' },
  { ward: 'Ward G/N', name: 'Dadar / Mahim / Dharavi', zone: 'Island City', popRisk: 82000, baseDepth: 16, baseAreaKm2: 0.48, baseSurcharge: 2, shelters: 5, substations: 3, priority: 'CRITICAL' },
  { ward: 'Ward G/S', name: 'Worli / Lower Parel', zone: 'Island City', popRisk: 38000, baseDepth: 12, baseAreaKm2: 0.22, baseSurcharge: 1, shelters: 3, substations: 1, priority: 'HIGH' },
  { ward: 'Ward K/E', name: 'Andheri East / Marol', zone: 'Western Suburbs', popRisk: 72000, baseDepth: 24, baseAreaKm2: 0.52, baseSurcharge: 3, shelters: 4, substations: 2, priority: 'CRITICAL' },
  { ward: 'Ward K/W', name: 'Andheri West / Juhu / Versova', zone: 'Western Suburbs', popRisk: 65000, baseDepth: 20, baseAreaKm2: 0.41, baseSurcharge: 2, shelters: 4, substations: 2, priority: 'HIGH' },
  { ward: 'Ward H/E', name: 'Bandra East / Santacruz East', zone: 'Western Suburbs', popRisk: 49000, baseDepth: 19, baseAreaKm2: 0.31, baseSurcharge: 2, shelters: 3, substations: 1, priority: 'HIGH' },
  { ward: 'Ward H/W', name: 'Bandra West / Khar West', zone: 'Western Suburbs', popRisk: 31000, baseDepth: 14, baseAreaKm2: 0.18, baseSurcharge: 1, shelters: 2, substations: 1, priority: 'MODERATE' },
  { ward: 'Ward L', name: 'Kurla / Chunabhatti / Asalpha', zone: 'Eastern Suburbs', popRisk: 95000, baseDepth: 26, baseAreaKm2: 0.68, baseSurcharge: 4, shelters: 6, substations: 3, priority: 'CRITICAL' },
  { ward: 'Ward M/E', name: 'Govandi / Mankhurd', zone: 'Eastern Suburbs', popRisk: 62000, baseDepth: 17, baseAreaKm2: 0.38, baseSurcharge: 2, shelters: 4, substations: 1, priority: 'HIGH' },
  { ward: 'Ward M/W', name: 'Chembur West / Tilak Nagar', zone: 'Eastern Suburbs', popRisk: 43000, baseDepth: 15, baseAreaKm2: 0.28, baseSurcharge: 1, shelters: 3, substations: 1, priority: 'MODERATE' },
  { ward: 'Ward N', name: 'Ghatkopar / Pant Nagar', zone: 'Eastern Suburbs', popRisk: 46000, baseDepth: 13, baseAreaKm2: 0.24, baseSurcharge: 1, shelters: 3, substations: 1, priority: 'MODERATE' },
  { ward: 'Ward S', name: 'Bhandup / Kanjurmarg', zone: 'Eastern Suburbs', popRisk: 37000, baseDepth: 12, baseAreaKm2: 0.19, baseSurcharge: 1, shelters: 2, substations: 1, priority: 'MODERATE' },
  { ward: 'Ward T', name: 'Mulund / Nahur', zone: 'Eastern Suburbs', popRisk: 28000, baseDepth: 9, baseAreaKm2: 0.12, baseSurcharge: 0, shelters: 2, substations: 1, priority: 'LOW' },
  { ward: 'Ward P/S', name: 'Goregaon South / Chincholi', zone: 'Western Suburbs', popRisk: 34000, baseDepth: 11, baseAreaKm2: 0.16, baseSurcharge: 1, shelters: 2, substations: 1, priority: 'MODERATE' },
  { ward: 'Ward R/S', name: 'Kandivali West / Poisar', zone: 'Western Suburbs', popRisk: 39000, baseDepth: 13, baseAreaKm2: 0.21, baseSurcharge: 1, shelters: 3, substations: 1, priority: 'MODERATE' },
];

// Physical Breach & Failure Points for Injector
export const FAILURE_INJECTOR_ITEMS = [
  {
    id: 'fail-mithi-wall',
    title: 'Mithi River Retaining Wall Breach',
    location: 'Chunabhatti Kurla Segment (Chainage 8.4 km)',
    severity: 'CATASTROPHIC',
    dischargeRate: '145 m³/s overflow',
    impactDesc: 'Rapid bank collapse inundates LBS Marg and Kurla Station tracks within 18 minutes.',
    defaultActive: false,
    deltaDepth: 28.5,
    deltaArea: 1.8,
  },
  {
    id: 'fail-mahim-gate',
    title: 'Mahim Tidal Sluice Flap Jam',
    location: 'Mahim Creek Outfall Flap Gate #04',
    severity: 'SEVERE',
    dischargeRate: 'Backflow 42 m³/s into upstream box drain',
    impactDesc: 'Gate stuck 80% open during high tide causing saltwater intrusion into Dharavi drains.',
    defaultActive: false,
    deltaDepth: 16.2,
    deltaArea: 0.9,
  },
  {
    id: 'fail-substation-trip',
    title: 'Haji Ali Pumping 22kV Feeder Trip',
    location: 'Haji Ali Stormwater Pumping Station',
    severity: 'CRITICAL',
    dischargeRate: '3 out of 6 pumps offline (-18,000 m³/h)',
    impactDesc: 'Loss of 50% pumping head floods Pedder Road junction and Tardeo residential bowl.',
    defaultActive: false,
    deltaDepth: 22.0,
    deltaArea: 1.2,
  },
  {
    id: 'fail-sv-culvert',
    title: 'SV Road Box Culvert Structural Collapse',
    location: 'Near Milan Subway North Ramp',
    severity: 'HIGH',
    dischargeRate: '100% Flow Blockage (Debris choke)',
    impactDesc: 'Complete hydraulic damming; water redirects across Western Railway tracks.',
    defaultActive: false,
    deltaDepth: 19.5,
    deltaArea: 0.7,
  },
  {
    id: 'fail-irla-nullah',
    title: 'Irla Nullah Solid Waste Trash-Rack Blockage',
    location: 'Juhu Tara Bridge Trash Rack',
    severity: 'MODERATE',
    dischargeRate: 'Headloss +0.95m across trash rack',
    impactDesc: 'Plastic accumulation blocks 85% free flow area; causes Juhu scheme backwater inundation.',
    defaultActive: false,
    deltaDepth: 11.0,
    deltaArea: 0.45,
  },
];

// Critical Municipal Infrastructure Nodes for Cascade Tracker
export const INFRASTRUCTURE_NODES = [
  { id: 'infra-01', name: 'Lokmanya Tilak Municipal General Hospital (Sion)', type: 'Hospital', thresholdCm: 25, groundMsl: 4.1, backupPowerHrs: 36, status: 'NORMAL' },
  { id: 'infra-02', name: 'KEM Hospital & Seth GS Medical College (Parel)', type: 'Hospital', thresholdCm: 30, groundMsl: 5.6, backupPowerHrs: 48, status: 'NORMAL' },
  { id: 'infra-03', name: 'Dr. R.N. Cooper Hospital (Juhu)', type: 'Hospital', thresholdCm: 25, groundMsl: 4.8, backupPowerHrs: 24, status: 'NORMAL' },
  { id: 'infra-04', name: 'Kurla Railway Junction (Central + Harbour Lines)', type: 'Rail Transit', thresholdCm: 15, groundMsl: 3.2, backupPowerHrs: 12, status: 'NORMAL' },
  { id: 'infra-05', name: 'Sion Railway Station (Central Main Line)', type: 'Rail Transit', thresholdCm: 18, groundMsl: 3.6, backupPowerHrs: 8, status: 'NORMAL' },
  { id: 'infra-06', name: 'Metro Line 3 Underground Substation (CSMIA Airport)', type: 'Metro Power', thresholdCm: 20, groundMsl: 4.5, backupPowerHrs: 72, status: 'NORMAL' },
  { id: 'infra-07', name: 'Tata Power 110kV Receiving Station (Dharavi)', type: 'Electrical Grid', thresholdCm: 35, groundMsl: 3.8, backupPowerHrs: 120, status: 'NORMAL' },
  { id: 'infra-08', name: 'BEST Sion F/N Substation #12', type: 'Electrical Grid', thresholdCm: 20, groundMsl: 3.7, backupPowerHrs: 18, status: 'NORMAL' },
  { id: 'infra-09', name: 'Bandra-Kurla Complex (BKC) Financial District Gateway', type: 'Economic Hub', thresholdCm: 28, groundMsl: 3.9, backupPowerHrs: 96, status: 'NORMAL' },
  { id: 'infra-10', name: 'Milan Subway Vehicle Underpass', type: 'Arterial Road', thresholdCm: 15, groundMsl: 2.6, backupPowerHrs: 0, status: 'NORMAL' },
  { id: 'infra-11', name: 'Andheri Subway Underpass', type: 'Arterial Road', thresholdCm: 15, groundMsl: 2.4, backupPowerHrs: 0, status: 'NORMAL' },
  { id: 'infra-12', name: 'Love Grove Stormwater Pumping Station (Worli)', type: 'Drainage SCADA', thresholdCm: 45, groundMsl: 3.1, backupPowerHrs: 48, status: 'NORMAL' },
];

// Relief Shelters & Emergency Camps
export const RELIEF_SHELTERS_DATA = [
  { id: 'sh-01', name: 'Sion Municipal Urdu/Marathi Secondary School', ward: 'Ward F/N', capacity: 1200, current: 180, accessRoadElev: 3.6, groundFloorSafety: 'ELEVATED PLINTH (+1.2m)', waterFoodDays: 4, gensetFuelHrs: 48 },
  { id: 'sh-02', name: 'Wadala Municipal Community Hall', ward: 'Ward F/N', capacity: 900, current: 120, accessRoadElev: 4.2, groundFloorSafety: 'SAFE ELEVATED', waterFoodDays: 5, gensetFuelHrs: 36 },
  { id: 'sh-03', name: 'Kurla West Municipal Primary School (Near Station)', ward: 'Ward L', capacity: 1500, current: 420, accessRoadElev: 3.1, groundFloorSafety: 'AT RISK (>30cm water ingress)', waterFoodDays: 3, gensetFuelHrs: 24 },
  { id: 'sh-04', name: 'Bhandup Sports Complex Gymnasium', ward: 'Ward S', capacity: 2000, current: 250, accessRoadElev: 5.8, groundFloorSafety: 'COMPLETELY SAFE', waterFoodDays: 7, gensetFuelHrs: 72 },
  { id: 'sh-05', name: 'Dadar Dr. Antonio D’Silva High School Hall', ward: 'Ward G/N', capacity: 1100, current: 310, accessRoadElev: 4.4, groundFloorSafety: 'SAFE ELEVATED', waterFoodDays: 4, gensetFuelHrs: 40 },
  { id: 'sh-06', name: 'Andheri East Bhavans College Indoor Arena', ward: 'Ward K/E', capacity: 2500, current: 480, accessRoadElev: 6.2, groundFloorSafety: 'HIGH GROUND SAFE', waterFoodDays: 6, gensetFuelHrs: 60 },
  { id: 'sh-07', name: 'Santacruz Municipal Maternity Home Hall', ward: 'Ward H/E', capacity: 800, current: 95, accessRoadElev: 3.8, groundFloorSafety: 'PLINTH +60cm', waterFoodDays: 3, gensetFuelHrs: 30 },
  { id: 'sh-08', name: 'Chembur Subhash Nagar Municipal School', ward: 'Ward M/W', capacity: 1000, current: 140, accessRoadElev: 4.9, groundFloorSafety: 'SAFE ELEVATED', waterFoodDays: 5, gensetFuelHrs: 48 },
];

// Arterial Corridors for Traffic & Mobility Chokepoints
export const MOBILITY_CORRIDORS = [
  { id: 'mob-weh', name: 'Western Express Highway (WEH)', segment: 'Bandra Flyover to Dahisar Check Naka', baselineSpeed: 38, lengthKm: 25.4, bottleneckDip: 'Milan & Domestic Airport Underpass', elevationMsl: 4.2 },
  { id: 'mob-eeh', name: 'Eastern Express Highway (EEH)', segment: 'Sion Circle to Mulund Toll Naka', baselineSpeed: 44, lengthKm: 23.6, bottleneckDip: 'Priyadarshini Circle & Everard Nagar Dip', elevationMsl: 3.8 },
  { id: 'mob-lbs', name: 'Lal Bahadur Shastri (LBS) Marg', segment: 'Sion to Thane border', baselineSpeed: 22, lengthKm: 21.0, bottleneckDip: 'Kurla West Phoenix Mall / Kamani Junction', elevationMsl: 3.3 },
  { id: 'mob-sv', name: 'Swami Vivekanand (SV) Road', segment: 'Bandra to Dahisar', baselineSpeed: 18, lengthKm: 26.5, bottleneckDip: 'Andheri Subway Cross & Milan Subway Ingress', elevationMsl: 2.7 },
  { id: 'mob-bkc', name: 'BKC Connector & Kalanagar Flyover', segment: 'EEH to Bandra Kurla Complex', baselineSpeed: 35, lengthKm: 4.8, bottleneckDip: 'Mithi River Bridge Ingress', elevationMsl: 3.6 },
];

// Critical Municipal Landmarks for Virtual Gauge Depth Telemetry
export const LANDMARK_GAUGES = [
  { id: 'gauge-sion', name: 'Sion Circle Flyover Dip', ward: 'Ward F/N', groundMsl: 3.4, alertDepthCm: 35, coords: [72.862, 19.043], baselineDepth: 22.0 },
  { id: 'gauge-hindmata', name: 'Hindmata Flyover Underbelly', ward: 'Ward F/S', groundMsl: 3.8, alertDepthCm: 30, coords: [72.842, 19.011], baselineDepth: 18.5 },
  { id: 'gauge-milan', name: 'Milan Subway Low Dip', ward: 'Ward H/W', groundMsl: 2.4, alertDepthCm: 25, coords: [72.839, 19.088], baselineDepth: 26.0 },
  { id: 'gauge-andheri', name: 'Andheri Subway West End', ward: 'Ward K/W', groundMsl: 2.2, alertDepthCm: 25, coords: [72.844, 19.119], baselineDepth: 28.0 },
  { id: 'gauge-kurla', name: 'Kurla Kranti Nagar Nullah Edge', ward: 'Ward L', groundMsl: 3.0, alertDepthCm: 40, coords: [72.879, 19.068], baselineDepth: 24.5 },
  { id: 'gauge-dharavi', name: 'Dharavi T-Junction Box Drain', ward: 'Ward G/N', groundMsl: 3.2, alertDepthCm: 30, coords: [72.855, 19.048], baselineDepth: 21.0 },
  { id: 'gauge-bkc', name: 'BKC Bharat Diamond Bourse Dip', ward: 'Ward H/E', groundMsl: 3.9, alertDepthCm: 35, coords: [72.868, 19.065], baselineDepth: 14.0 },
];

// Counterfactual "What-If" Interventions Available for Injection
export const WHAT_IF_INTERVENTIONS = [
  {
    id: 'wi-pump-boost',
    title: 'Deploy High-Volume Mobile Trailer Pumps (4x 2,500 m³/h)',
    category: 'DEWATERING',
    targetArea: 'Milan & Andheri Subways',
    depthReductionCm: 14.5,
    clearanceReductionHrs: 1.8,
    costLakhs: 35,
    icon: 'Waves',
    active: false,
  },
  {
    id: 'wi-flood-barrier',
    title: 'Deploy Rapid Inflatable Demountable Barriers',
    category: 'CONTAINMENT',
    targetArea: 'Ambedkar Road & Hindmata Cinema',
    depthReductionCm: 9.0,
    clearanceReductionHrs: 0.9,
    costLakhs: 18,
    icon: 'Shield',
    active: false,
  },
  {
    id: 'wi-sluice-prerelease',
    title: 'Tidal Flap Gates Controlled Low-Tide Pre-Release',
    category: 'TIDAL MANAGEMENT',
    targetArea: 'Mahim & Irla Outfalls',
    depthReductionCm: 12.0,
    clearanceReductionHrs: 1.4,
    costLakhs: 8,
    icon: 'RotateCcw',
    active: false,
  },
  {
    id: 'wi-holding-tank',
    title: 'Pramod Mahajan Dadar Underground Sump Max Suction',
    category: 'HOLDING RESERVOIR',
    targetArea: 'Dadar G/N & F/S Basin',
    depthReductionCm: 16.0,
    clearanceReductionHrs: 2.2,
    costLakhs: 12,
    icon: 'Cpu',
    active: false,
  },
  {
    id: 'wi-desilt-rapid',
    title: 'Super-Sucker Emergency Desilting of Box Culvert Inlets',
    category: 'DRAIN CLEARANCE',
    targetArea: 'Kurla LBS Marg & Asalpha Nullah',
    depthReductionCm: 11.5,
    clearanceReductionHrs: 1.5,
    costLakhs: 25,
    icon: 'Activity',
    active: false,
  },
];

// Hydraulic Solver Config Default Parameters
export const HYDRAULIC_SOLVER_DEFAULTS = {
  gridResolutionM: 5, // 2m, 5m, 10m
  timeStepSec: 0.5,
  courantNumber: 0.42,
  manningN: 0.025, // Roughness coefficient
  infiltrationMethod: 'Horton (fc=5mm/h)',
  wettingDryingThresholdM: 0.005,
  gpuThreads: 1024,
  maxIterations: 500,
};

