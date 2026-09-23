export const SAFE_PLACES_DATA = [
  {
    id: 'sp-1',
    name: 'Kokilaben Dhirubhai Ambani Hospital',
    type: 'hospital',
    category: 'HOSPITAL',
    categoryLabel: 'Hospital & 24/7 Trauma Care',
    ward: 'K-West',
    elevation: '+18.4m MSL',
    elevationMsl: 18.4,
    distance: '2.8 km',
    distanceKm: 2.8,
    travelTimeMins: 11,
    accessibility: 'FULLY ACCESSIBLE',
    statusBadge: 'RECOMMENDED HAVEN',
    routeClear: true,
    totalCapacity: 600,
    availableCapacity: 145,
    generatorBackup: true,
    generatorHours: 96,
    hasMedicalStaff: true,
    maxDepthOnRoute: '0 cm',
    maxWaterOnRoute: 0,
    corridorNotes: 'JP Road Elevated Corridor is 100% free of standing water. Safe for ambulances and light motor vehicles.',
    address: 'Rao Saheb, Achutrao Patwardhan Marg, Four Bungalows, Andheri West',
    phone: '+91 22 3069 6969',
    safeRouteInfo: 'JP Road Elevated Corridor is 100% free of standing water. Safe for all vehicles.',
    maxWaterOnRoute: 0,
    powerStatus: '100% Operational (Dedicated Multi-Tier Diesel Backup)',
    bedAvailability: '18 ICU beds • 45 Ward beds available',
    coordinates: { lat: 19.1311, lng: 72.8252 },
    bearingDeg: 340,
    deskCoordinator: {
      name: 'Dr. Rajesh Sawant',
      role: 'Chief Trauma Disaster Registrar',
      callsign: 'KDAH-TRIAGE-1',
      directExt: '3104'
    },
    supplies: {
      potableWaterLitres: 45000,
      potableWaterHours: 72,
      dryRationKits: 1200,
      infantFormulaKits: 180,
      chargingSockets: 85,
      dryBeddingMats: 250,
      oxygenCylinders: 64,
      lastRestocked: '18 mins ago'
    },
    petFacilities: {
      supported: true,
      enclosureCapacity: 35,
      currentPets: 12,
      vetOnDuty: true,
      rules: 'Designated Basement-1 Dry Animal Enclosure. Leashes & carriers required.'
    },
    parkingDeck: {
      hasElevatedDeck: true,
      rampClearanceM: 2.4,
      totalStalls: 320,
      availableStalls: 92,
      evCharging: true,
      levels: [
        { level: 'Basement -2', status: 'Sump pumps active (dry)', safe: true },
        { level: 'Basement -1', status: '100% Dry & Guarded', safe: true },
        { level: 'Podium 1', status: 'High ground clear', safe: true },
        { level: 'Podium 2', status: 'High ground clear', safe: true }
      ]
    },
    historicalClearance: {
      deluge2005SurgeM: 4.2,
      monsoon2017SurgeM: 2.8,
      forecast2026SurgeM: 1.6,
      safetyBufferM: 14.2,
      verdict: 'Completely immune to 100-year flood crest'
    },
    specialAssistance: {
      wheelchairRamps: true,
      dialysisPriority: true,
      oxygenRecharge: true,
      seniorFloorRooms: true,
      pediatricDesk: true
    },
    communityReports: {
      recentCount: 28,
      crowdDensity: 'MODERATE',
      approachPassability: 'DRY_AND_CLEAR',
      lastReportedMinAgo: 6
    },
    cctvFeeds: [
      { id: 'cam-kda-gate', name: 'Main Trauma Gate Ingress', waterDepthCm: 0, status: 'CLEAR' },
      { id: 'cam-kda-ramp', name: 'Emergency Ramp Elevation', waterDepthCm: 0, status: 'CLEAR' }
    ],
    corridorSteps: [
      { step: 1, text: 'Depart current location onto S.V. Road Connector', distance: '600 m', waterDepth: '0 cm', safe: true },
      { step: 2, text: 'Take elevated J.P. Road flyover toward Four Bungalows', distance: '1.4 km', waterDepth: '0 cm', safe: true },
      { step: 3, text: 'Enter North High-Ground Ingress Gate directly to Triage', distance: '800 m', waterDepth: '0 cm', safe: true }
    ]
  },
  {
    id: 'sp-2',
    name: 'Andheri Sports Complex Relief Shelter',
    type: 'civic_shelter',
    category: 'SHELTER',
    categoryLabel: 'Municipal Disaster Haven',
    ward: 'K-West',
    elevation: '+22.0m MSL',
    elevationMsl: 22.0,
    distance: '1.9 km',
    distanceKm: 1.9,
    travelTimeMins: 8,
    accessibility: 'CAUTION ON INGRESS',
    statusBadge: 'DRY HIGH GROUND',
    routeClear: true,
    totalCapacity: 450,
    availableCapacity: 308,
    generatorBackup: true,
    generatorHours: 72,
    hasMedicalStaff: true,
    maxDepthOnRoute: '3 cm',
    maxWaterOnRoute: 3,
    corridorNotes: 'Avoid Ceasars Road (18cm ponding). Approach via Gilbert Hill Ridge high elevation road.',
    address: 'Veera Desai Road, Gilbert Hill Ridge, Andheri West',
    phone: '+91 22 2673 0300',
    safeRouteInfo: 'Avoid Ceasars Road (18cm ponding). Use Bhavan\'s College approach (dry).',
    maxWaterOnRoute: 0,
    safeRouteInfo: 'Avoid Ceasars Road (18cm ponding). Approach via Gilbert Hill Ridge high elevation road.',
    powerStatus: 'Solar + Generator Active',
    bedAvailability: 'Capacity: 450 • Currently Sheltered: 142 • 308 beds available',
    supplies: 'Clean drinking water, dry rations, first aid station, phone charging banks',
    coordinates: { lat: 19.1245, lng: 72.8310 },
    bearingDeg: 315,
    deskCoordinator: {
      name: 'Ashok V. Kulkarni',
      role: 'BMC Ward K-West Disaster Warden',
      callsign: 'BMC-ASC-HAVEN',
      directExt: '102'
    },
    supplies: {
      potableWaterLitres: 60000,
      potableWaterHours: 96,
      dryRationKits: 2400,
      infantFormulaKits: 310,
      chargingSockets: 140,
      dryBeddingMats: 350,
      oxygenCylinders: 18,
      lastRestocked: '12 mins ago'
    },
    petFacilities: {
      supported: true,
      enclosureCapacity: 50,
      currentPets: 18,
      vetOnDuty: true,
      rules: 'Covered badminton court annex repurposed for pet refuge with municipal vet.'
    },
    parkingDeck: {
      hasElevatedDeck: true,
      rampClearanceM: 2.8,
      totalStalls: 180,
      availableStalls: 65,
      evCharging: false,
      levels: [
        { level: 'Upper Ground Plaza', status: '100% Dry (+22m elevation)', safe: true },
        { level: 'Stilt Parking Area', status: 'Dry, well drained', safe: true }
      ]
    },
    historicalClearance: {
      deluge2005SurgeM: 4.2,
      monsoon2017SurgeM: 2.8,
      forecast2026SurgeM: 1.6,
      safetyBufferM: 17.8,
      verdict: 'Natural basalt ridge plateau - zero historical flooding'
    },
    specialAssistance: {
      wheelchairRamps: true,
      dialysisPriority: false,
      oxygenRecharge: true,
      seniorFloorRooms: true,
      pediatricDesk: true
    },
    communityReports: {
      recentCount: 42,
      crowdDensity: 'LOW',
      approachPassability: 'DRY_AND_CLEAR',
      lastReportedMinAgo: 3
    },
    cctvFeeds: [
      { id: 'cam-asc-gate1', name: 'Veera Desai Gate Ingress', waterDepthCm: 3, status: 'CLEAR' },
      { id: 'cam-asc-concourse', name: 'Main Concourse Shelter', waterDepthCm: 0, status: 'CLEAR' }
    ],
    corridorSteps: [
      { step: 1, text: 'Take Ceasars Road bypass onto Gilbert Hill access link', distance: '500 m', waterDepth: '2 cm', safe: true },
      { step: 2, text: 'Ascend basalt ridge gradient (+8m gain) toward stadium entrance', distance: '900 m', waterDepth: '0 cm', safe: true },
      { step: 3, text: 'Check in at Municipal Disaster Gate 2 for cot allotment', distance: '500 m', waterDepth: '0 cm', safe: true }
    ]
  },
  {
    id: 'sp-3',
    name: 'Cooper Municipal General Hospital',
    type: 'hospital',
    category: 'HOSPITAL',
    categoryLabel: 'Civic Hospital & Emergency Ward',
    ward: 'K-West',
    elevation: '+9.2m MSL',
    elevationMsl: 9.2,
    distance: '3.4 km',
    distanceKm: 3.4,
    travelTimeMins: 24,
    accessibility: 'RESTRICTED ACCESS',
    statusBadge: 'DETOUR REQUIRED',
    routeClear: false,
    totalCapacity: 500,
    availableCapacity: 42,
    generatorBackup: true,
    generatorHours: 48,
    hasMedicalStaff: true,
    maxDepthOnRoute: '34 cm',
    maxWaterOnRoute: 34,
    corridorNotes: 'Direct SV Road approach blocked by 34 cm water at Milan Subway. Detour via Juhu Tara Rd adds +14 mins.',
    address: 'U-15, Bhaktivedanta Swami Marg, Juhu Scheme, Vile Parle West',
    phone: '+91 22 2620 7254',
    safeRouteInfo: 'Direct SV Road approach blocked by 34 cm water at Milan Subway. Detour via Juhu Tara Rd adds +14 mins.',
    maxWaterOnRoute: 34,
    powerStatus: 'Backup Generator Active',
    bedAvailability: 'Emergency Ward accepting ambulance transfers via North Gate only',
    coordinates: { lat: 19.1080, lng: 72.8350 },
    bearingDeg: 210,
    deskCoordinator: {
      name: 'Dr. Sunita Deshmukh',
      role: 'CMO In-Charge Emergency Dept',
      callsign: 'COOPER-HOTLINE',
      directExt: '2001'
    },
    supplies: {
      potableWaterLitres: 25000,
      potableWaterHours: 36,
      dryRationKits: 450,
      infantFormulaKits: 90,
      chargingSockets: 40,
      dryBeddingMats: 80,
      oxygenCylinders: 45,
      lastRestocked: '42 mins ago'
    },
    petFacilities: {
      supported: false,
      enclosureCapacity: 0,
      currentPets: 0,
      vetOnDuty: false,
      rules: 'Strict medical triage only - animals not permitted in hospital buildings.'
    },
    parkingDeck: {
      hasElevatedDeck: false,
      rampClearanceM: 2.1,
      totalStalls: 90,
      availableStalls: 8,
      evCharging: false,
      levels: [
        { level: 'Surface Parking Ground', status: '15cm water puddles near gate', safe: false },
        { level: 'Emergency Ambulance Bay', status: 'Raised concrete bay (dry)', safe: true }
      ]
    },
    historicalClearance: {
      deluge2005SurgeM: 4.2,
      monsoon2017SurgeM: 2.8,
      forecast2026SurgeM: 1.6,
      safetyBufferM: 5.0,
      verdict: 'Moderate elevation - requires active municipal dewatering'
    },
    specialAssistance: {
      wheelchairRamps: true,
      dialysisPriority: true,
      oxygenRecharge: true,
      seniorFloorRooms: false,
      pediatricDesk: true
    },
    communityReports: {
      recentCount: 35,
      crowdDensity: 'CROWDED',
      approachPassability: 'CAUTION_DETOUR',
      lastReportedMinAgo: 8
    },
    cctvFeeds: [
      { id: 'cam-cooper-gate', name: 'Juhu Scheme North Gate', waterDepthCm: 4, status: 'CAUTION' },
      { id: 'cam-milan-subway', name: 'Milan Subway Detour Point', waterDepthCm: 34, status: 'FLOODED' }
    ],
    corridorSteps: [
      { step: 1, text: 'AVOID Milan Subway (34cm standing water - blocked)', distance: '1.1 km', waterDepth: '34 cm', safe: false },
      { step: 2, text: 'Divert onto Juhu Tara Road coastal elevated ridge', distance: '1.6 km', waterDepth: '3 cm', safe: true },
      { step: 3, text: 'Enter Cooper via North Gate ambulance intake corridor', distance: '700 m', waterDepth: '2 cm', safe: true }
    ]
  },
  {
    id: 'sp-4',
    name: 'Bhavan\'s College Cultural Relief Centre',
    type: 'civic_shelter',
    category: 'RELIEF',
    categoryLabel: 'Community Relief & Food Hub',
    ward: 'K-West',
    elevation: '+16.5m MSL',
    elevationMsl: 16.5,
    distance: '1.4 km',
    distanceKm: 1.4,
    travelTimeMins: 6,
    accessibility: 'FULLY ACCESSIBLE',
    statusBadge: 'FOOD & DRY ESSENTIALS',
    routeClear: true,
    totalCapacity: 350,
    availableCapacity: 210,
    generatorBackup: true,
    generatorHours: 60,
    hasMedicalStaff: false,
    maxDepthOnRoute: '0 cm',
    maxWaterOnRoute: 0,
    corridorNotes: 'Direct access via Munshi Nagar elevated campus road. Zero water accumulation.',
    address: 'Munshi Nagar, Andheri West',
    phone: '+91 22 2625 6451',
    safeRouteInfo: 'Direct access via JP Road flyover. Zero water accumulation.',
    maxWaterOnRoute: 0,
    powerStatus: 'Operational',
    supplies: 'Free hot meals, dry clothing packets, emergency infant formula, hygiene kits',
    coordinates: { lat: 19.1230, lng: 72.8375 },
    supplies: {
      potableWaterLitres: 40000,
      potableWaterHours: 80,
      dryRationKits: 3100,
      infantFormulaKits: 220,
      chargingSockets: 110,
      dryBeddingMats: 260,
      oxygenCylinders: 6,
      lastRestocked: '25 mins ago'
    },
    petFacilities: {
      supported: true,
      enclosureCapacity: 25,
      currentPets: 8,
      vetOnDuty: false,
      rules: 'College quadrangle lawn shelter setup for pets with water bowls.'
    },
    parkingDeck: {
      hasElevatedDeck: true,
      rampClearanceM: 2.5,
      totalStalls: 140,
      availableStalls: 75,
      evCharging: false,
      levels: [
        { level: 'Auditorium Ramp Deck', status: '100% Dry (+16.5m)', safe: true },
        { level: 'Staff Elevated Car Park', status: 'Dry and gated', safe: true }
      ]
    },
    historicalClearance: {
      deluge2005SurgeM: 4.2,
      monsoon2017SurgeM: 2.8,
      forecast2026SurgeM: 1.6,
      safetyBufferM: 12.3,
      verdict: 'Campus plateau maintains 12m buffer over worst deluge'
    },
    specialAssistance: {
      wheelchairRamps: true,
      dialysisPriority: false,
      oxygenRecharge: false,
      seniorFloorRooms: true,
      pediatricDesk: true
    },
    communityReports: {
      recentCount: 19,
      crowdDensity: 'LOW',
      approachPassability: 'DRY_AND_CLEAR',
      lastReportedMinAgo: 14
    },
    cctvFeeds: [
      { id: 'cam-bhavan-quad', name: 'Campus Quadrangle Relief Area', waterDepthCm: 0, status: 'CLEAR' },
      { id: 'cam-bhavan-gate', name: 'Munshi Nagar Gate Ingress', waterDepthCm: 0, status: 'CLEAR' }
    ],
    corridorSteps: [
      { step: 1, text: 'Take JP Road elevated flyover toward Munshi Nagar', distance: '800 m', waterDepth: '0 cm', safe: true },
      { step: 2, text: 'Turn into Bhavan’s campus avenue (fully graded drainage)', distance: '600 m', waterDepth: '0 cm', safe: true }
    ]
  },
  {
    id: 'sp-5',
    name: 'BKC Multi-Level Elevated Parking Haven',
    type: 'parking_ramp',
    category: 'PARKING',
    categoryLabel: 'Elevated Vehicle Protection',
    ward: 'H-East',
    elevation: '+15.8m MSL',
    elevationMsl: 15.8,
    distance: '4.2 km',
    distanceKm: 4.2,
    travelTimeMins: 14,
    accessibility: 'FULLY ACCESSIBLE',
    statusBadge: 'VEHICLE REFUGE',
    routeClear: true,
    totalCapacity: 800,
    availableCapacity: 340,
    generatorBackup: true,
    generatorHours: 120,
    hasMedicalStaff: false,
    maxDepthOnRoute: '2 cm',
    maxWaterOnRoute: 2,
    corridorNotes: 'BKC elevated connector ramp clear of all surface water. Levels P2 through P5 dry.',
    address: 'G-Block, Bandra Kurla Complex',
    phone: '+91 22 2659 0000',
    safeRouteInfo: 'Access via BKC Chunabhatti flyover.',
    maxWaterOnRoute: 2,
    powerStatus: 'Full Backup Genset',
    bedAvailability: 'Driver rest lounge and mobile recharge dock available',
    coordinates: { lat: 19.0660, lng: 72.8680 },
    bearingDeg: 145,
    deskCoordinator: {
      name: 'Pravin Shinde',
      role: 'MMRDA Infrastructure Facility Manager',
      callsign: 'MMRDA-BKC-PARK',
      directExt: '551'
    },
    supplies: {
      potableWaterLitres: 30000,
      potableWaterHours: 60,
      dryRationKits: 800,
      infantFormulaKits: 50,
      chargingSockets: 160,
      dryBeddingMats: 120,
      oxygenCylinders: 4,
      lastRestocked: '35 mins ago'
    },
    petFacilities: {
      supported: true,
      enclosureCapacity: 20,
      currentPets: 5,
      vetOnDuty: false,
      rules: 'Pets allowed inside vehicles on upper floors P2-P5.'
    },
    parkingDeck: {
      hasElevatedDeck: true,
      rampClearanceM: 2.6,
      totalStalls: 800,
      availableStalls: 340,
      evCharging: true,
      levels: [
        { level: 'Ground Floor Entry', status: 'Drains running at 70% capacity (2cm water)', safe: true },
        { level: 'Level P1 (+4m)', status: '100% Dry - Car & Two-Wheeler Staging', safe: true },
        { level: 'Level P2 (+8m)', status: '100% Dry - SUV & LMV Refuge', safe: true },
        { level: 'Level P3 (+12m)', status: '100% Dry - Reserved Citizen Vehicle Haven', safe: true },
        { level: 'Level P4 & P5 (+16m)', status: '100% Dry - High-Ground Evacuation Staging', safe: true }
      ]
    },
    historicalClearance: {
      deluge2005SurgeM: 4.2,
      monsoon2017SurgeM: 2.8,
      forecast2026SurgeM: 1.6,
      safetyBufferM: 11.6,
      verdict: 'Engineered structural podium with emergency storm-surge pumps'
    },
    specialAssistance: {
      wheelchairRamps: true,
      dialysisPriority: false,
      oxygenRecharge: false,
      seniorFloorRooms: false,
      pediatricDesk: false
    },
    communityReports: {
      recentCount: 31,
      crowdDensity: 'MODERATE',
      approachPassability: 'DRY_AND_CLEAR',
      lastReportedMinAgo: 5
    },
    cctvFeeds: [
      { id: 'cam-bkc-ramp', name: 'MMRDA Ingress Ramp P1', waterDepthCm: 0, status: 'CLEAR' },
      { id: 'cam-bkc-concourse', name: 'Level P3 Vehicle Refuge Staging', waterDepthCm: 0, status: 'CLEAR' }
    ],
    corridorSteps: [
      { step: 1, text: 'Take BKC Chunabhatti elevated connector flyover', distance: '2.5 km', waterDepth: '0 cm', safe: true },
      { step: 2, text: 'Follow G-Block arterial dry corridor (pumps operational)', distance: '1.2 km', waterDepth: '2 cm', safe: true },
      { step: 3, text: 'Ascend Spiral Ramp A directly to dry floor P2 or P3', distance: '500 m', waterDepth: '0 cm', safe: true }
    ]
  },
  {
    id: 'sp-6',
    name: 'Ghatkopar Metro High-Ground Transit Haven',
    type: 'transit_hub',
    category: 'TRANSIT',
    categoryLabel: 'Elevated Transit Station Concourse',
    ward: 'N-Ward',
    elevation: '+17.2m MSL',
    elevationMsl: 17.2,
    distance: '3.1 km',
    distanceKm: 3.1,
    travelTimeMins: 9,
    accessibility: 'FULLY ACCESSIBLE',
    statusBadge: 'ELEVATED CONCOURSE',
    routeClear: true,
    totalCapacity: 1200,
    availableCapacity: 680,
    generatorBackup: true,
    generatorHours: 96,
    hasMedicalStaff: true,
    maxDepthOnRoute: '4 cm',
    maxWaterOnRoute: 4,
    corridorNotes: 'Metro Line 1 elevated viaduct completely unaffected by ground runoff.',
    address: 'Ghatkopar Railway Colony, Ghatkopar East',
    phone: '+91 22 2500 1122',
    safeRouteInfo: 'Elevated skywalk access dry.',
    maxWaterOnRoute: 4,
    powerStatus: 'Substation Priority Supply',
    bedAvailability: 'Emergency waiting concourse open with civic potable water tanker',
    coordinates: { lat: 19.0860, lng: 72.9080 },
    bearingDeg: 78,
    deskCoordinator: {
      name: 'Deepak Kamble',
      role: 'Metro Station Emergency Controller',
      callsign: 'METRO-L1-GHAT',
      directExt: '108'
    },
    supplies: {
      potableWaterLitres: 55000,
      potableWaterHours: 85,
      dryRationKits: 1800,
      infantFormulaKits: 240,
      chargingSockets: 220,
      dryBeddingMats: 400,
      oxygenCylinders: 12,
      lastRestocked: '10 mins ago'
    },
    petFacilities: {
      supported: true,
      enclosureCapacity: 30,
      currentPets: 11,
      vetOnDuty: false,
      rules: 'Concourse South Annex reserved for pet owners with carrier baskets.'
    },
    parkingDeck: {
      hasElevatedDeck: false,
      rampClearanceM: 2.2,
      totalStalls: 150,
      availableStalls: 20,
      evCharging: false,
      levels: [
        { level: 'Street Concourse Level', status: 'Skywalks dry, street curb 4cm splash', safe: true }
      ]
    },
    historicalClearance: {
      deluge2005SurgeM: 4.2,
      monsoon2017SurgeM: 2.8,
      forecast2026SurgeM: 1.6,
      safetyBufferM: 13.0,
      verdict: 'Elevated Metro superstructure +17m above grade'
    },
    specialAssistance: {
      wheelchairRamps: true,
      dialysisPriority: false,
      oxygenRecharge: true,
      seniorFloorRooms: true,
      pediatricDesk: true
    },
    communityReports: {
      recentCount: 54,
      crowdDensity: 'MODERATE',
      approachPassability: 'DRY_AND_CLEAR',
      lastReportedMinAgo: 2
    },
    cctvFeeds: [
      { id: 'cam-metro-skywalk', name: 'Elevated Skywalk Walkway', waterDepthCm: 0, status: 'CLEAR' },
      { id: 'cam-metro-hall', name: 'Main Concourse Assembly', waterDepthCm: 0, status: 'CLEAR' }
    ],
    corridorSteps: [
      { step: 1, text: 'Access station via elevated pedestrian Skywalk from East concourse', distance: '400 m', waterDepth: '0 cm', safe: true },
      { step: 2, text: 'Bypass ground-level curb overflows onto high concourse deck', distance: '700 m', waterDepth: '0 cm', safe: true },
      { step: 3, text: 'Proceed to Station Level 2 Relief Reception desk', distance: '200 m', waterDepth: '0 cm', safe: true }
    ]
  },
  {
    id: 'sp-7',
    name: 'IIT Bombay Powai High-Ridge Campus Haven',
    type: 'civic_shelter',
    category: 'SHELTER',
    categoryLabel: 'University High-Ground Safe Zone',
    ward: 'S-Ward',
    elevation: '+38.5m MSL',
    elevationMsl: 38.5,
    distance: '5.8 km',
    distanceKm: 5.8,
    travelTimeMins: 18,
    accessibility: 'FULLY ACCESSIBLE',
    statusBadge: 'MAX ELEVATION RIDGE',
    routeClear: true,
    totalCapacity: 950,
    availableCapacity: 580,
    generatorBackup: true,
    generatorHours: 144,
    hasMedicalStaff: true,
    maxDepthOnRoute: '0 cm',
    maxWaterOnRoute: 0,
    corridorNotes: 'JVLR Elevated Expressway approach 100% dry. Natural hillside watershed ensures zero ponding.',
    address: 'Main Gate Road, IIT Area, Powai',
    phone: '+91 22 2576 7777',
    safeRouteInfo: 'Approach via JVLR flyover to IIT Main Gate.',
    powerStatus: 'Captive Solar & Diesel Micro-grid',
    bedAvailability: 'Convocation Hall & SAC indoor arenas open for citizen shelter',
    coordinates: { lat: 19.1334, lng: 72.9133 },
    bearingDeg: 45,
    deskCoordinator: {
      name: 'Col. Vikram Rane',
      role: 'Campus Chief Security & Disaster Officer',
      callsign: 'IITB-EMERG-HQ',
      directExt: '7001'
    },
    supplies: {
      potableWaterLitres: 95000,
      potableWaterHours: 120,
      dryRationKits: 4500,
      infantFormulaKits: 450,
      chargingSockets: 350,
      dryBeddingMats: 600,
      oxygenCylinders: 28,
      lastRestocked: '15 mins ago'
    },
    petFacilities: {
      supported: true,
      enclosureCapacity: 60,
      currentPets: 22,
      vetOnDuty: true,
      rules: 'Dedicated animal welfare facility on campus with veterinary surgeons.'
    },
    parkingDeck: {
      hasElevatedDeck: true,
      rampClearanceM: 3.0,
      totalStalls: 400,
      availableStalls: 210,
      evCharging: true,
      levels: [
        { level: 'Hillside Terrace Parking', status: '100% Dry (+38m MSL)', safe: true },
        { level: 'SAC Lower Stilt Deck', status: 'Completely clear', safe: true }
      ]
    },
    historicalClearance: {
      deluge2005SurgeM: 4.2,
      monsoon2017SurgeM: 2.8,
      forecast2026SurgeM: 1.6,
      safetyBufferM: 34.3,
      verdict: 'Highest elevated haven in Eastern Suburbs - absolute immunity'
    },
    specialAssistance: {
      wheelchairRamps: true,
      dialysisPriority: true,
      oxygenRecharge: true,
      seniorFloorRooms: true,
      pediatricDesk: true
    },
    communityReports: {
      recentCount: 62,
      crowdDensity: 'LOW',
      approachPassability: 'DRY_AND_CLEAR',
      lastReportedMinAgo: 4
    },
    cctvFeeds: [
      { id: 'cam-iit-maingate', name: 'IIT Main Gate Checkpoint', waterDepthCm: 0, status: 'CLEAR' },
      { id: 'cam-iit-convocation', name: 'Convocation Shelter Quad', waterDepthCm: 0, status: 'CLEAR' }
    ],
    corridorSteps: [
      { step: 1, text: 'Take JVLR flyover straight past Hiranandani junction', distance: '3.2 km', waterDepth: '0 cm', safe: true },
      { step: 2, text: 'Ascend Powai hill ridge to IIT Main Gate', distance: '1.8 km', waterDepth: '0 cm', safe: true },
      { step: 3, text: 'Report to Student Activity Centre Registration Point', distance: '800 m', waterDepth: '0 cm', safe: true }
    ]
  },
  {
    id: 'sp-8',
    name: 'KEM Hospital & Seth GS Medical College',
    type: 'hospital',
    category: 'HOSPITAL',
    categoryLabel: 'Level 1 Apex Disaster Trauma Center',
    ward: 'F-South',
    elevation: '+14.2m MSL',
    elevationMsl: 14.2,
    distance: '6.4 km',
    distanceKm: 6.4,
    travelTimeMins: 22,
    accessibility: 'FULLY ACCESSIBLE',
    statusBadge: 'APEX TRAUMA DESK',
    routeClear: true,
    totalCapacity: 850,
    availableCapacity: 112,
    generatorBackup: true,
    generatorHours: 120,
    hasMedicalStaff: true,
    maxDepthOnRoute: '5 cm',
    maxWaterOnRoute: 5,
    corridorNotes: 'Approach via Dr. B.R. Ambedkar Flyover (top deck). Avoid ground Hindmata underbelly.',
    address: 'Acharya Donde Marg, Parel, Mumbai',
    phone: '+91 22 2410 7000',
    safeRouteInfo: 'Use Lalbaug Flyover directly to Donde Marg entrance.',
    powerStatus: 'Substation Priority + Triple Diesel Reserve',
    bedAvailability: '32 ICU beds • Blood Bank full inventory • 80 General Disaster cots',
    coordinates: { lat: 18.9980, lng: 72.8420 },
    bearingDeg: 175,
    deskCoordinator: {
      name: 'Dr. Praveen Bangar',
      role: 'Emergency Medical Services Director',
      callsign: 'KEM-EMS-APEX',
      directExt: '1008'
    },
    supplies: {
      potableWaterLitres: 80000,
      potableWaterHours: 72,
      dryRationKits: 1500,
      infantFormulaKits: 350,
      chargingSockets: 190,
      dryBeddingMats: 200,
      oxygenCylinders: 110,
      lastRestocked: '8 mins ago'
    },
    petFacilities: {
      supported: false,
      enclosureCapacity: 0,
      currentPets: 0,
      vetOnDuty: false,
      rules: 'Level 1 Sterile trauma center. No domestic animals permitted.'
    },
    parkingDeck: {
      hasElevatedDeck: true,
      rampClearanceM: 2.3,
      totalStalls: 220,
      availableStalls: 44,
      evCharging: false,
      levels: [
        { level: 'Ambulance Ramp', status: 'Priority emergency clear', safe: true },
        { level: 'Doctors Multi-Tier Deck P1', status: '100% Dry (+14m)', safe: true }
      ]
    },
    historicalClearance: {
      deluge2005SurgeM: 4.2,
      monsoon2017SurgeM: 2.8,
      forecast2026SurgeM: 1.6,
      safetyBufferM: 10.0,
      verdict: 'Underground holding tanks prevent ingress into hospital perimeter'
    },
    specialAssistance: {
      wheelchairRamps: true,
      dialysisPriority: true,
      oxygenRecharge: true,
      seniorFloorRooms: true,
      pediatricDesk: true
    },
    communityReports: {
      recentCount: 48,
      crowdDensity: 'CROWDED',
      approachPassability: 'CAUTION_DETOUR',
      lastReportedMinAgo: 5
    },
    cctvFeeds: [
      { id: 'cam-kem-er', name: 'Emergency Resuscitation Intake', waterDepthCm: 0, status: 'CLEAR' },
      { id: 'cam-donde-marg', name: 'Acharya Donde Marg Access', waterDepthCm: 5, status: 'CLEAR' }
    ],
    corridorSteps: [
      { step: 1, text: 'Take Eastern Express Highway or Ambedkar Flyover top deck', distance: '4.2 km', waterDepth: '0 cm', safe: true },
      { step: 2, text: 'Take exit ramp onto Acharya Donde Marg (bypass Hindmata surface)', distance: '1.5 km', waterDepth: '5 cm', safe: true },
      { step: 3, text: 'Enter KEM Disaster Trauma Gate 4', distance: '700 m', waterDepth: '0 cm', safe: true }
    ]
  },
  {
    id: 'sp-9',
    name: 'Bandra Fort & Lands End Coastal High-Ground',
    type: 'civic_shelter',
    category: 'RELIEF',
    categoryLabel: 'Rocky Promontory Natural Haven',
    ward: 'H-West',
    elevation: '+26.8m MSL',
    elevationMsl: 26.8,
    distance: '4.8 km',
    distanceKm: 4.8,
    travelTimeMins: 16,
    accessibility: 'PARTIAL ACCESSIBILITY',
    statusBadge: 'ROCKY BLUFF ELEVATION',
    routeClear: true,
    totalCapacity: 400,
    availableCapacity: 285,
    generatorBackup: true,
    generatorHours: 72,
    hasMedicalStaff: false,
    maxDepthOnRoute: '1 cm',
    maxWaterOnRoute: 1,
    corridorNotes: 'Bandra Bandstand coastal ridge road naturally discharges into sea. Zero stagnant water.',
    address: 'Byramji Jeejeebhoy Road, Bandstand, Bandra West',
    phone: '+91 22 2642 1234',
    safeRouteInfo: 'Approach via Perry Road and Carter Road Ridge.',
    powerStatus: 'Civic Mobile Genset Deployed',
    bedAvailability: 'Community hall and Taj Lands End banquet support center activated',
    coordinates: { lat: 19.0430, lng: 72.8180 },
    bearingDeg: 200,
    deskCoordinator: {
      name: 'Capt. Mehul Merchant',
      role: 'Civil Defence Volunteer Corps Commander',
      callsign: 'BANDRA-COAST-1',
      directExt: '404'
    },
    supplies: {
      potableWaterLitres: 35000,
      potableWaterHours: 70,
      dryRationKits: 1600,
      infantFormulaKits: 140,
      chargingSockets: 95,
      dryBeddingMats: 190,
      oxygenCylinders: 8,
      lastRestocked: '30 mins ago'
    },
    petFacilities: {
      supported: true,
      enclosureCapacity: 40,
      currentPets: 14,
      vetOnDuty: true,
      rules: 'Open covered amphitheater annex permits dogs and cats on leash.'
    },
    parkingDeck: {
      hasElevatedDeck: true,
      rampClearanceM: 2.7,
      totalStalls: 160,
      availableStalls: 68,
      evCharging: false,
      levels: [
        { level: 'Lands End Promontory Deck', status: '100% Dry (+26m)', safe: true }
      ]
    },
    historicalClearance: {
      deluge2005SurgeM: 4.2,
      monsoon2017SurgeM: 2.8,
      forecast2026SurgeM: 1.6,
      safetyBufferM: 22.6,
      verdict: 'Coastal bedrock promontory - rapid oceanic runoff'
    },
    specialAssistance: {
      wheelchairRamps: false,
      dialysisPriority: false,
      oxygenRecharge: false,
      seniorFloorRooms: true,
      pediatricDesk: false
    },
    communityReports: {
      recentCount: 16,
      crowdDensity: 'LOW',
      approachPassability: 'DRY_AND_CLEAR',
      lastReportedMinAgo: 18
    },
    cctvFeeds: [
      { id: 'cam-bandstand-road', name: 'Bandstand Sea Ridge Approach', waterDepthCm: 1, status: 'CLEAR' },
      { id: 'cam-lands-end', name: 'Promontory Assembly Ground', waterDepthCm: 0, status: 'CLEAR' }
    ],
    corridorSteps: [
      { step: 1, text: 'Take Carter Road elevated sea-facing ridge', distance: '2.1 km', waterDepth: '0 cm', safe: true },
      { step: 2, text: 'Follow Bandstand cliff road toward Lands End', distance: '1.9 km', waterDepth: '1 cm', safe: true },
      { step: 3, text: 'Arrive at Coastal Relief Assembly Ground', distance: '800 m', waterDepth: '0 cm', safe: true }
    ]
  },
  {
    id: 'sp-10',
    name: 'Sanjay Gandhi National Park Rescue Base (Borivali)',
    type: 'civic_shelter',
    category: 'SHELTER',
    categoryLabel: 'Forest Ridge Foothills Safe Camp',
    ward: 'R-Central',
    elevation: '+44.0m MSL',
    elevationMsl: 44.0,
    distance: '9.2 km',
    distanceKm: 9.2,
    travelTimeMins: 26,
    accessibility: 'FULLY ACCESSIBLE',
    statusBadge: 'FOOTHILL RIDGE HAVEN',
    routeClear: true,
    totalCapacity: 1500,
    availableCapacity: 920,
    generatorBackup: true,
    generatorHours: 168,
    hasMedicalStaff: true,
    maxDepthOnRoute: '0 cm',
    maxWaterOnRoute: 0,
    corridorNotes: 'Western Express Highway elevated flyovers provide clear route right to SGNP main gates.',
    address: 'Western Express Highway, Borivali East',
    phone: '+91 22 2886 0389',
    safeRouteInfo: 'WEH elevated carriageway to Borivali East gate.',
    powerStatus: 'State Forest Micro-grid + 250kVA Generator',
    bedAvailability: 'Nature Information Center & Guest Houses fully staffed',
    coordinates: { lat: 19.2288, lng: 72.8596 },
    bearingDeg: 12,
    deskCoordinator: {
      name: 'Ranger Santosh Gaikwad',
      role: 'Chief Forest Warden & Disaster Coordinator',
      callsign: 'SGNP-BASE-CAMP',
      directExt: '900'
    },
    supplies: {
      potableWaterLitres: 120000,
      potableWaterHours: 140,
      dryRationKits: 6000,
      infantFormulaKits: 500,
      chargingSockets: 400,
      dryBeddingMats: 850,
      oxygenCylinders: 35,
      lastRestocked: '5 mins ago'
    },
    petFacilities: {
      supported: true,
      enclosureCapacity: 120,
      currentPets: 36,
      vetOnDuty: true,
      rules: 'Full wildlife veterinary hospital repurposed for domestic flood pet rescue.'
    },
    parkingDeck: {
      hasElevatedDeck: true,
      rampClearanceM: 3.5,
      totalStalls: 650,
      availableStalls: 390,
      evCharging: true,
      levels: [
        { level: 'Foothill Paved Plaza (+44m)', status: '100% Dry natural slope', safe: true },
        { level: 'Safari Base Upper Deck', status: '100% Dry natural slope', safe: true }
      ]
    },
    historicalClearance: {
      deluge2005SurgeM: 4.2,
      monsoon2017SurgeM: 2.8,
      forecast2026SurgeM: 1.6,
      safetyBufferM: 39.8,
      verdict: 'Highest elevated haven in Greater Mumbai region'
    },
    specialAssistance: {
      wheelchairRamps: true,
      dialysisPriority: true,
      oxygenRecharge: true,
      seniorFloorRooms: true,
      pediatricDesk: true
    },
    communityReports: {
      recentCount: 75,
      crowdDensity: 'LOW',
      approachPassability: 'DRY_AND_CLEAR',
      lastReportedMinAgo: 2
    },
    cctvFeeds: [
      { id: 'cam-sgnp-entry', name: 'SGNP Main Entry Toll Gate', waterDepthCm: 0, status: 'CLEAR' },
      { id: 'cam-sgnp-assembly', name: 'NIC Concourse Evacuation Camp', waterDepthCm: 0, status: 'CLEAR' }
    ],
    corridorSteps: [
      { step: 1, text: 'Take Western Express Highway North flyover sequence', distance: '6.5 km', waterDepth: '0 cm', safe: true },
      { step: 2, text: 'Exit at Borivali East National Park ramp', distance: '1.9 km', waterDepth: '0 cm', safe: true },
      { step: 3, text: 'Enter SGNP Security Gate 1 straight to Base Camp', distance: '800 m', waterDepth: '0 cm', safe: true }
    ]
  }
];

export const safePlacesData = SAFE_PLACES_DATA;
