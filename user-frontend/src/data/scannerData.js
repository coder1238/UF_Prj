// Comprehensive dataset for Mumbai Hubs, Commercial Centers, Transit Terminals, and Subways
export const INITIAL_HUBS_DATA = [
  {
    id: 'p-1',
    name: 'Phoenix Marketcity Mall (Kurla)',
    type: 'commercial',
    ward: 'L-Ward (Kurla)',
    coordinates: { lat: 19.0864, lng: 72.8890 },
    status: 'flooded_entrance',
    statusLabel: 'Entrance Submerged (35 cm)',
    severity: 'critical',
    elevationMSL: 3.4, // meters above sea level
    waterDepth: 35, // cm
    trend: 'rising', // 'rising' | 'stable' | 'receding'
    lastVerified: '2 mins ago',
    trustScore: 94,
    upvotes: 42,
    downvotes: 2,
    basementParking: {
      status: 'Closed (Flood gates locked)',
      floors: [
        { level: 'B1', depth: 42, status: 'Inundated', vehicleSlotsTotal: 350, vehicleSlotsAvailable: 0 },
        { level: 'B2', depth: 15, status: 'Seepage Controlled', vehicleSlotsTotal: 400, vehicleSlotsAvailable: 0 },
        { level: 'B3', depth: 0, status: 'Sealed & Dry', vehicleSlotsTotal: 400, vehicleSlotsAvailable: 0 }
      ],
      sumpPumps: {
        total: 6,
        active: 5,
        flowRateM3Hr: 480,
        rpm: 2850,
        powerSource: 'Dual DG Backup'
      },
      floodGatePressureBar: 2.4, // Hydrostatic seal pressure
      evacuationRemainingMins: 0 // Already evacuated
    },
    retailFloors: 'Upper floors operating on backup DG (Food Court & Multiplex dry)',
    approachRoad: 'LBS Marg impassable for sedans; Kamani junction waterlogged',
    highGroundAccess: 'Elevated connector via Kurla-Kalina Flyover ramp',
    skywalk: {
      available: true,
      name: 'Kurla West Station to LBS Skywalk',
      clearanceElevation: '+6.2m above street',
      status: 'Safe & Dry Footpath'
    },
    cctvFeed: {
      id: 'KL-08',
      name: 'North Entrance Gate #1 (LBS Portal)',
      status: 'Live — Camera #KL-08 Active',
      resolution: '4K UltraHD • 30 FPS',
      aiConfidence: 97.4,
      cameras: [
        { id: 'cam-1', name: 'Gate 1 — Main Ingress Ramp', angle: 'Wide-angle Portal', depthEstimate: 35 },
        { id: 'cam-2', name: 'Basement B1 Drop-off Sump', angle: 'Subterranean Ramp', depthEstimate: 42 },
        { id: 'cam-3', name: 'Pedestrian Skybridge Footing', angle: 'High Angle Exterior', depthEstimate: 18 },
        { id: 'cam-4', name: 'Rear Drainage Culvert / Sump 3', angle: 'Outfall Weir', depthEstimate: 55 }
      ]
    },
    utilities: {
      gridPower: false,
      dgBackup: true,
      elevators: 'Grounded at 1st Floor (Water locks active)',
      escalators: 'Disabled on Ground Floor',
      cleanWater: 'Operational (Rooftop Tanks: 85%)',
      firstAid: 'Medical Post active on Level 2'
    },
    forecast: [
      { time: 'NOW', depth: 35, rainRate: 38 },
      { time: '+30m', depth: 41, rainRate: 44 },
      { time: '+60m', depth: 47, rainRate: 40 },
      { time: '+90m', depth: 38, rainRate: 28 },
      { time: '+120m', depth: 26, rainRate: 19 },
      { time: '+180m', depth: 14, rainRate: 10 }
    ],
    historicalComparison: {
      deluge2005Depth: 120,
      cyclone2021Depth: 55,
      currentRiskVs2005: '-71% depth (due to Mithi flood barrier walls)'
    },
    alternativeHaven: {
      name: 'R-City Mall Ghatkopar (High Ground)',
      distanceKm: 3.8,
      routeClear: true,
      safeApproach: 'Via LBS Elevated Flyover & 90ft Road'
    },
    passability: {
      sedan: false,
      hatchback: false,
      compactSuv: false,
      heavySuv: true,
      twoWheeler: false,
      ev: false,
      pedestrian: false
    }
  },
  {
    id: 'p-2',
    name: 'Bandra Kurla Complex (Diamond Bourse)',
    type: 'office',
    ward: 'H-East (BKC)',
    coordinates: { lat: 19.0657, lng: 72.8688 },
    status: 'operational',
    statusLabel: 'All Gates Dry & Accessible',
    severity: 'safe',
    elevationMSL: 8.9,
    waterDepth: 3,
    trend: 'stable',
    lastVerified: 'Just now',
    trustScore: 99,
    upvotes: 88,
    downvotes: 1,
    basementParking: {
      status: 'Open with storm sumps running',
      floors: [
        { level: 'B1', depth: 0, status: 'Dry & Clear', vehicleSlotsTotal: 600, vehicleSlotsAvailable: 210 },
        { level: 'B2', depth: 0, status: 'Dry & Clear', vehicleSlotsTotal: 600, vehicleSlotsAvailable: 340 },
        { level: 'B3', depth: 0, status: 'Dry & Clear', vehicleSlotsTotal: 800, vehicleSlotsAvailable: 512 }
      ],
      sumpPumps: {
        total: 8,
        active: 3,
        flowRateM3Hr: 650,
        rpm: 3000,
        powerSource: 'Grid + Solar Microgrid'
      },
      floodGatePressureBar: 0.1,
      evacuationRemainingMins: null
    },
    retailFloors: 'Full electrical continuity; corporate offices operating normally',
    approachRoad: 'BKC Elevated Road completely clear; Kalanagar connector flowing smoothly',
    highGroundAccess: 'Direct high-elevation connection from Western Express Highway',
    skywalk: {
      available: true,
      name: 'BKC Elevated Walkway to Bandra Station',
      clearanceElevation: '+7.5m above street',
      status: 'Fully Open & Sheltered'
    },
    cctvFeed: {
      id: 'BKC-14',
      name: 'Plaza Ingress & G-Block Ring',
      status: 'Live — Camera #BKC-14 Active',
      resolution: '4K UltraHD • 30 FPS',
      aiConfidence: 99.1,
      cameras: [
        { id: 'cam-1', name: 'Main Gate — G Block Plaza', angle: 'Paved Perimeter', depthEstimate: 3 },
        { id: 'cam-2', name: 'Basement Parking Ramp B1', angle: 'Ingress Ramp', depthEstimate: 0 },
        { id: 'cam-3', name: 'Mithi River Barrier Sensor #4', angle: 'Embankment View', depthEstimate: 12 },
        { id: 'cam-4', name: 'North Taxi Bay & Helipad', angle: 'Overhead Birdseye', depthEstimate: 2 }
      ]
    },
    utilities: {
      gridPower: true,
      dgBackup: true,
      elevators: '100% Operational (Smart Destination Control)',
      escalators: '100% Operational',
      cleanWater: 'Operational (RO Purification Running)',
      firstAid: '24/7 Paramedic Center on Ground Floor'
    },
    forecast: [
      { time: 'NOW', depth: 3, rainRate: 22 },
      { time: '+30m', depth: 4, rainRate: 26 },
      { time: '+60m', depth: 6, rainRate: 30 },
      { time: '+90m', depth: 5, rainRate: 20 },
      { time: '+120m', depth: 4, rainRate: 15 },
      { time: '+180m', depth: 2, rainRate: 8 }
    ],
    historicalComparison: {
      deluge2005Depth: 85,
      cyclone2021Depth: 18,
      currentRiskVs2005: '-96% depth (elevated podium & flood gates installed)'
    },
    alternativeHaven: null,
    passability: {
      sedan: true,
      hatchback: true,
      compactSuv: true,
      heavySuv: true,
      twoWheeler: true,
      ev: true,
      pedestrian: true
    }
  },
  {
    id: 'p-3',
    name: 'Dadar Western Railway Station',
    type: 'transit',
    ward: 'G-North (Dadar)',
    coordinates: { lat: 19.0178, lng: 72.8436 },
    status: 'caution',
    statusLabel: 'Subway Footbridge Caution (14 cm)',
    severity: 'caution',
    elevationMSL: 4.8,
    waterDepth: 14,
    trend: 'stable',
    lastVerified: '4 mins ago',
    trustScore: 92,
    upvotes: 61,
    downvotes: 4,
    basementParking: {
      status: 'N/A (Pedestrian and Transit Only)',
      floors: [],
      sumpPumps: {
        total: 4,
        active: 3,
        flowRateM3Hr: 320,
        rpm: 2700,
        powerSource: 'Railway Dedicated Feeder'
      },
      floodGatePressureBar: 0.8,
      evacuationRemainingMins: null
    },
    retailFloors: 'Concourse open; Slow lines running with 8–10 min headway caution',
    approachRoad: 'Pritam Hotel junction clear; Swaminarayan Mandir portal has 12–14cm ponding',
    highGroundAccess: 'Tilak Bridge and Senapati Bapat Marg elevated walkways clear',
    skywalk: {
      available: true,
      name: 'Dadar TT to Western Railway Footbridge',
      clearanceElevation: '+8.0m above railway tracks',
      status: 'Operational (High footfall, dry corridor)'
    },
    cctvFeed: {
      id: 'DDR-03',
      name: 'Platform 1 & Footbridge Subway Portal',
      status: 'Live — Camera #DDR-03 Active',
      resolution: '1080p Full HD • 25 FPS',
      aiConfidence: 94.6,
      cameras: [
        { id: 'cam-1', name: 'West Concourse Footbridge Subway', angle: 'Footbridge Ingress', depthEstimate: 14 },
        { id: 'cam-2', name: 'Platform 3/4 Rail Bed Culvert', angle: 'Track Level Sensor', depthEstimate: 9 },
        { id: 'cam-3', name: 'Dadar Flower Market Lane', angle: 'Pedestrian Street View', depthEstimate: 16 },
        { id: 'cam-4', name: 'East Booking Office Entrance', angle: 'Ticket Hall Portal', depthEstimate: 6 }
      ]
    },
    utilities: {
      gridPower: true,
      dgBackup: true,
      elevators: 'Operational for accessibility only',
      escalators: 'Platform 1 & 4 escalators operating',
      cleanWater: 'Operational (Water ATMs functional)',
      firstAid: 'Emergency Railway Medical Booth at PF 1'
    },
    forecast: [
      { time: 'NOW', depth: 14, rainRate: 28 },
      { time: '+30m', depth: 17, rainRate: 34 },
      { time: '+60m', depth: 19, rainRate: 35 },
      { time: '+90m', depth: 15, rainRate: 22 },
      { time: '+120m', depth: 11, rainRate: 15 },
      { time: '+180m', depth: 7, rainRate: 9 }
    ],
    historicalComparison: {
      deluge2005Depth: 95,
      cyclone2021Depth: 35,
      currentRiskVs2005: '-85% depth (high-capacity dewatering pumps installed)'
    },
    alternativeHaven: {
      name: 'Dadar Central Line Elevated Station',
      distanceKm: 0.4,
      routeClear: true,
      safeApproach: 'Via Tilak Bridge upper road'
    },
    passability: {
      sedan: true,
      hatchback: false,
      compactSuv: true,
      heavySuv: true,
      twoWheeler: false,
      ev: true,
      pedestrian: true
    }
  },
  {
    id: 'p-4',
    name: 'Andheri Subway (SV Road Underpass)',
    type: 'transit',
    ward: 'K-West (Andheri)',
    coordinates: { lat: 19.1197, lng: 72.8464 },
    status: 'closed',
    statusLabel: 'Completely Inundated (68 cm)',
    severity: 'critical',
    elevationMSL: 1.8,
    waterDepth: 68,
    trend: 'rising',
    lastVerified: '1 min ago',
    trustScore: 98,
    upvotes: 112,
    downvotes: 1,
    basementParking: {
      status: 'Flooded Underpass Ingress',
      floors: [],
      sumpPumps: {
        total: 4,
        active: 2, // 2 tripped by silt
        flowRateM3Hr: 210,
        rpm: 1900,
        powerSource: 'Mobile BMC Diesel Genset'
      },
      floodGatePressureBar: 3.8,
      evacuationRemainingMins: 0
    },
    retailFloors: 'Closed to all vehicular and pedestrian traffic by Mumbai Traffic Police',
    approachRoad: 'Barricades deployed at both portals; water overflowing to SV Road',
    highGroundAccess: 'Mandatory diversion via Gokhale Flyover or Milan Subway Flyover',
    skywalk: {
      available: true,
      name: 'Andheri Metro-Railway Interchange Skywalk',
      clearanceElevation: '+11.2m above underpass',
      status: '100% Safe Dry Corridor (Metro Running)'
    },
    cctvFeed: {
      id: 'AND-01',
      name: 'Subway West Portal (SV Road Mouth)',
      status: 'Live — Camera #AND-01 Active',
      resolution: '4K UltraHD • 30 FPS',
      aiConfidence: 98.9,
      cameras: [
        { id: 'cam-1', name: 'West Portal Water Gauge Ruler', angle: 'Direct Optical Ruler', depthEstimate: 68 },
        { id: 'cam-2', name: 'East Portal Police Barricade', angle: 'Entry Portal Barricades', depthEstimate: 62 },
        { id: 'cam-3', name: 'Underpass Trough Deepest Point', angle: 'Submersible Enclosure', depthEstimate: 74 },
        { id: 'cam-4', name: 'Mogra Nullah Outfall Sluice', angle: 'Tidal Sluice Gate', depthEstimate: 92 }
      ]
    },
    utilities: {
      gridPower: false,
      dgBackup: true,
      elevators: 'N/A',
      escalators: 'N/A',
      cleanWater: 'N/A',
      firstAid: 'BMC Disaster Management Van stationed at portal'
    },
    forecast: [
      { time: 'NOW', depth: 68, rainRate: 44 },
      { time: '+30m', depth: 76, rainRate: 48 },
      { time: '+60m', depth: 72, rainRate: 42 },
      { time: '+90m', depth: 54, rainRate: 30 },
      { time: '+120m', depth: 38, rainRate: 20 },
      { time: '+180m', depth: 18, rainRate: 10 }
    ],
    historicalComparison: {
      deluge2005Depth: 180,
      cyclone2021Depth: 95,
      currentRiskVs2005: '-62% depth (automatic gates prevent vehicle drowning)'
    },
    alternativeHaven: {
      name: 'Gokhale Bridge Elevated Flyover',
      distanceKm: 0.9,
      routeClear: true,
      safeApproach: 'Take CD Barfiwala Road ramp onto Gokhale Flyover'
    },
    passability: {
      sedan: false,
      hatchback: false,
      compactSuv: false,
      heavySuv: false,
      twoWheeler: false,
      ev: false,
      pedestrian: false
    }
  },
  {
    id: 'p-5',
    name: 'One World Center (Lower Parel)',
    type: 'office',
    ward: 'G-South (Lower Parel)',
    coordinates: { lat: 19.0022, lng: 72.8306 },
    status: 'operational',
    statusLabel: 'Elevated Podium Dry & Accessible',
    severity: 'safe',
    elevationMSL: 7.2,
    waterDepth: 4,
    trend: 'stable',
    lastVerified: '6 mins ago',
    trustScore: 96,
    upvotes: 49,
    downvotes: 2,
    basementParking: {
      status: 'Underground sumps pumped to Senapati Bapat Marg culvert',
      floors: [
        { level: 'B1', depth: 0, status: 'Dry & Clear', vehicleSlotsTotal: 450, vehicleSlotsAvailable: 110 },
        { level: 'B2', depth: 0, status: 'Dry & Clear', vehicleSlotsTotal: 500, vehicleSlotsAvailable: 230 },
        { level: 'B3', depth: 0, status: 'Dry & Clear', vehicleSlotsTotal: 500, vehicleSlotsAvailable: 410 }
      ],
      sumpPumps: {
        total: 6,
        active: 4,
        flowRateM3Hr: 540,
        rpm: 2900,
        powerSource: 'Triple Redundant Genset'
      },
      floodGatePressureBar: 0.2,
      evacuationRemainingMins: null
    },
    retailFloors: 'Offices and dining precinct fully operational; high-speed fiber online',
    approachRoad: 'Lower Parel flyover ramp completely dry; slight puddle near bridge underbelly (6cm)',
    highGroundAccess: 'Direct access via Senapati Bapat Marg elevated carriageway',
    skywalk: {
      available: false,
      name: 'N/A',
      clearanceElevation: 'Podium Level +4.5m',
      status: 'Elevated plaza walkway clear'
    },
    cctvFeed: {
      id: 'LP-05',
      name: 'Tower 1 Drop-off & Podium Ramp',
      status: 'Live — Camera #LP-05 Active',
      resolution: '4K UltraHD • 30 FPS',
      aiConfidence: 98.2,
      cameras: [
        { id: 'cam-1', name: 'Main Gate Drop-off & Security', angle: 'Podium Ingress', depthEstimate: 4 },
        { id: 'cam-2', name: 'Senapati Bapat Marg Junction Drain', angle: 'Street Drainage', depthEstimate: 8 },
        { id: 'cam-3', name: 'Basement Parking Ramp Gate', angle: 'Ramp Sump Seal', depthEstimate: 0 },
        { id: 'cam-4', name: 'Tower 2 Loading Bay', angle: 'Service Corridor', depthEstimate: 2 }
      ]
    },
    utilities: {
      gridPower: true,
      dgBackup: true,
      elevators: '100% Operational',
      escalators: '100% Operational',
      cleanWater: 'Operational (Purification active)',
      firstAid: 'Apollo Clinic on Tower 1 Mezzanine'
    },
    forecast: [
      { time: 'NOW', depth: 4, rainRate: 20 },
      { time: '+30m', depth: 6, rainRate: 25 },
      { time: '+60m', depth: 8, rainRate: 26 },
      { time: '+90m', depth: 5, rainRate: 18 },
      { time: '+120m', depth: 3, rainRate: 12 },
      { time: '+180m', depth: 2, rainRate: 6 }
    ],
    historicalComparison: {
      deluge2005Depth: 65,
      cyclone2021Depth: 22,
      currentRiskVs2005: '-94% depth (podium redesign prevents water logging)'
    },
    alternativeHaven: null,
    passability: {
      sedan: true,
      hatchback: true,
      compactSuv: true,
      heavySuv: true,
      twoWheeler: true,
      ev: true,
      pedestrian: true
    }
  },
  {
    id: 'p-6',
    name: 'Ghatkopar Metro Interchange',
    type: 'transit',
    ward: 'N-Ward (Ghatkopar)',
    coordinates: { lat: 19.0860, lng: 72.9080 },
    status: 'operational',
    statusLabel: 'Line 1 Elevated Station Normal',
    severity: 'safe',
    elevationMSL: 9.5,
    waterDepth: 5,
    trend: 'stable',
    lastVerified: '3 mins ago',
    trustScore: 95,
    upvotes: 74,
    downvotes: 3,
    basementParking: {
      status: 'Elevated multi-level structure dry',
      floors: [
        { level: 'Level 1', depth: 0, status: 'Dry & Clear', vehicleSlotsTotal: 250, vehicleSlotsAvailable: 85 },
        { level: 'Level 2', depth: 0, status: 'Dry & Clear', vehicleSlotsTotal: 300, vehicleSlotsAvailable: 140 }
      ],
      sumpPumps: {
        total: 4,
        active: 2,
        flowRateM3Hr: 280,
        rpm: 2600,
        powerSource: 'Metro Grid + Dedicated Genset'
      },
      floodGatePressureBar: 0.0,
      evacuationRemainingMins: null
    },
    retailFloors: 'Metro services running on standard 4-min headway; ticketing halls dry',
    approachRoad: 'Ground concourse wet but unobstructed; RB Kadam Marg passable',
    highGroundAccess: 'Elevated concourse connect direct to Railway Overbridge',
    skywalk: {
      available: true,
      name: 'Ghatkopar Station to Metro Skybridge',
      clearanceElevation: '+9.4m above road',
      status: 'Dry Covered All-Weather Walkway'
    },
    cctvFeed: {
      id: 'GHT-02',
      name: 'Line 1 Concourse & Railway FOB',
      status: 'Live — Camera #GHT-02 Active',
      resolution: '1080p Full HD • 30 FPS',
      aiConfidence: 96.8,
      cameras: [
        { id: 'cam-1', name: 'Interchange Footbridge Portal', angle: 'Concourse Walkway', depthEstimate: 0 },
        { id: 'cam-2', name: 'West Auto Stand Drop-off', angle: 'Street Level Curbs', depthEstimate: 5 },
        { id: 'cam-3', name: 'East Booking Gate & Stairs', angle: 'Stairwell Base', depthEstimate: 3 },
        { id: 'cam-4', name: 'Metro Substation Yard', angle: 'High Voltage Enclosure', depthEstimate: 0 }
      ]
    },
    utilities: {
      gridPower: true,
      dgBackup: true,
      elevators: '100% Operational',
      escalators: '100% Operational',
      cleanWater: 'Operational (Aqua Guard units functional)',
      firstAid: 'Metro First Aid Station at Concourse level'
    },
    forecast: [
      { time: 'NOW', depth: 5, rainRate: 20 },
      { time: '+30m', depth: 7, rainRate: 24 },
      { time: '+60m', depth: 9, rainRate: 25 },
      { time: '+90m', depth: 6, rainRate: 18 },
      { time: '+120m', depth: 4, rainRate: 12 },
      { time: '+180m', depth: 2, rainRate: 7 }
    ],
    historicalComparison: {
      deluge2005Depth: 80,
      cyclone2021Depth: 25,
      currentRiskVs2005: '-93% depth (elevated transit infrastructure)'
    },
    alternativeHaven: null,
    passability: {
      sedan: true,
      hatchback: true,
      compactSuv: true,
      heavySuv: true,
      twoWheeler: true,
      ev: true,
      pedestrian: true
    }
  },
  {
    id: 'p-7',
    name: 'Hindmata Junction & Flyover Underbelly',
    type: 'transit',
    ward: 'F-North (Sion-Matunga)',
    coordinates: { lat: 19.0125, lng: 72.8420 },
    status: 'caution',
    statusLabel: 'Ponding on Service Lanes (28 cm)',
    severity: 'critical',
    elevationMSL: 2.1,
    waterDepth: 28,
    trend: 'rising',
    lastVerified: '5 mins ago',
    trustScore: 93,
    upvotes: 56,
    downvotes: 3,
    basementParking: {
      status: 'No basement; street level storage sumps running',
      floors: [],
      sumpPumps: {
        total: 8,
        active: 7,
        flowRateM3Hr: 720,
        rpm: 3100,
        powerSource: 'BMC Pramod Mahajan Park Holding Pond Pumps'
      },
      floodGatePressureBar: 1.5,
      evacuationRemainingMins: null
    },
    retailFloors: 'Local commercial shops on high plinths dry; road level stores closed',
    approachRoad: 'Dr. Babasaheb Ambedkar Road service lanes flooded (28 cm); Flyover completely clear',
    highGroundAccess: 'Hindmata Elevated Flyover 100% open for all vehicles',
    skywalk: {
      available: false,
      name: 'N/A',
      clearanceElevation: 'Flyover Deck +7.8m',
      status: 'Flyover footpath passable'
    },
    cctvFeed: {
      id: 'HND-01',
      name: 'Hindmata Cinema Under-Flyover Sump',
      status: 'Live — Camera #HND-01 Active',
      resolution: '1080p Full HD • 30 FPS',
      aiConfidence: 95.2,
      cameras: [
        { id: 'cam-1', name: 'Southbound Service Road Ponding', angle: 'Service Lane', depthEstimate: 28 },
        { id: 'cam-2', name: 'Underground Holding Pond Inflow Sluice', angle: 'Holding Basin', depthEstimate: 45 },
        { id: 'cam-3', name: 'Ambedkar Rd Flyover Ascent Ramp', angle: 'High Ground Ramp', depthEstimate: 0 },
        { id: 'cam-4', name: 'Pritam Hotel Junction Drain', angle: 'Intersection', depthEstimate: 19 }
      ]
    },
    utilities: {
      gridPower: true,
      dgBackup: true,
      elevators: 'N/A',
      escalators: 'N/A',
      cleanWater: 'Operational',
      firstAid: 'KEM Hospital Trauma Center 600m away via high ground'
    },
    forecast: [
      { time: 'NOW', depth: 28, rainRate: 36 },
      { time: '+30m', depth: 33, rainRate: 40 },
      { time: '+60m', depth: 30, rainRate: 32 },
      { time: '+90m', depth: 22, rainRate: 20 },
      { time: '+120m', depth: 15, rainRate: 14 },
      { time: '+180m', depth: 8, rainRate: 8 }
    ],
    historicalComparison: {
      deluge2005Depth: 140,
      cyclone2021Depth: 52,
      currentRiskVs2005: '-80% depth (holding tanks buffer 2.5 crore liters)'
    },
    alternativeHaven: {
      name: 'Hindmata Elevated Flyover Carriageway',
      distanceKm: 0.1,
      routeClear: true,
      safeApproach: 'Ascend flyover ramp before Dadar TT circle'
    },
    passability: {
      sedan: false,
      hatchback: false,
      compactSuv: false,
      heavySuv: true,
      twoWheeler: false,
      ev: false,
      pedestrian: false
    }
  },
  {
    id: 'p-8',
    name: 'Kokilaben Dhirubhai Ambani Hospital (Four Bungalows)',
    type: 'hospital',
    ward: 'K-West (Andheri West)',
    coordinates: { lat: 19.1311, lng: 72.8252 },
    status: 'operational',
    statusLabel: 'Safe Haven • 100% Dry Corridors',
    severity: 'safe',
    elevationMSL: 18.4,
    waterDepth: 0,
    trend: 'stable',
    lastVerified: 'Just now',
    trustScore: 99,
    upvotes: 142,
    downvotes: 0,
    basementParking: {
      status: 'Open and Protected with automatic hydraulic flood flaps',
      floors: [
        { level: 'B1', depth: 0, status: 'Dry & Clear', vehicleSlotsTotal: 300, vehicleSlotsAvailable: 80 },
        { level: 'B2', depth: 0, status: 'Dry & Clear', vehicleSlotsTotal: 300, vehicleSlotsAvailable: 150 }
      ],
      sumpPumps: {
        total: 6,
        active: 2,
        flowRateM3Hr: 400,
        rpm: 2900,
        powerSource: 'Hospital Grade Essential Bus DG'
      },
      floodGatePressureBar: 0.0,
      evacuationRemainingMins: null
    },
    retailFloors: '24/7 Level 1 Trauma Care, ICU, and blood bank fully equipped',
    approachRoad: 'JP Road elevated approach completely dry; clear ambulance corridor active',
    highGroundAccess: 'Gilbert Hill ridge high elevation terrain',
    skywalk: {
      available: false,
      name: 'N/A',
      clearanceElevation: 'Hospital Plinth +18.4m MSL',
      status: 'Surrounding ground naturally elevated'
    },
    cctvFeed: {
      id: 'KDA-01',
      name: 'Emergency Ambulance Bay & Trauma Ramp',
      status: 'Live — Camera #KDA-01 Active',
      resolution: '4K UltraHD • 30 FPS',
      aiConfidence: 99.8,
      cameras: [
        { id: 'cam-1', name: 'Emergency Room Ambulance Bay', angle: 'Ambulance Ingress', depthEstimate: 0 },
        { id: 'cam-2', name: 'Main Entrance Gate & Visitor Drop-off', angle: 'Main Gate', depthEstimate: 0 },
        { id: 'cam-3', name: 'Perimeter Drainage Culvert', angle: 'Storm Outlet', depthEstimate: 2 },
        { id: 'cam-4', name: 'Basement Parking Ramp Hydraulic Flap', angle: 'Basement Ramp', depthEstimate: 0 }
      ]
    },
    utilities: {
      gridPower: true,
      dgBackup: true,
      elevators: '100% Operational (Dedicated Bed Lifts Online)',
      escalators: 'Operational',
      cleanWater: '100% Secure Internal Water Storage',
      firstAid: 'Full Level 1 Trauma Center & Critical Care'
    },
    forecast: [
      { time: 'NOW', depth: 0, rainRate: 15 },
      { time: '+30m', depth: 0, rainRate: 18 },
      { time: '+60m', depth: 1, rainRate: 20 },
      { time: '+90m', depth: 1, rainRate: 16 },
      { time: '+120m', depth: 0, rainRate: 10 },
      { time: '+180m', depth: 0, rainRate: 5 }
    ],
    historicalComparison: {
      deluge2005Depth: 12,
      cyclone2021Depth: 2,
      currentRiskVs2005: '-100% depth (ridge topography prevents flooding)'
    },
    alternativeHaven: null,
    passability: {
      sedan: true,
      hatchback: true,
      compactSuv: true,
      heavySuv: true,
      twoWheeler: true,
      ev: true,
      pedestrian: true
    }
  },
  {
    id: 'p-9',
    name: 'Milan Subway (Santacruz - SV Rd Underpass)',
    type: 'transit',
    ward: 'K-West (Santacruz)',
    coordinates: { lat: 19.0825, lng: 72.8410 },
    status: 'closed',
    statusLabel: 'Subway Flooded (48 cm)',
    severity: 'critical',
    elevationMSL: 3.2,
    waterDepth: 48,
    trend: 'rising',
    lastVerified: '7 mins ago',
    trustScore: 91,
    upvotes: 38,
    downvotes: 2,
    basementParking: {
      status: 'Flooded Subway Basin',
      floors: [],
      sumpPumps: {
        total: 5,
        active: 3,
        flowRateM3Hr: 380,
        rpm: 2750,
        powerSource: 'BMC Standby Diesel Generators'
      },
      floodGatePressureBar: 2.9,
      evacuationRemainingMins: 0
    },
    retailFloors: 'Underpass closed with drop-down barriers and siren warning',
    approachRoad: 'SV Road approaches cordoned off; water accumulation extends 80 meters',
    highGroundAccess: 'Milan Flyover 100% dry and open for cross-rail travel',
    skywalk: {
      available: false,
      name: 'Milan Flyover Pedestrian Lane',
      clearanceElevation: '+12.0m above railway',
      status: 'Elevated sidewalk on flyover open'
    },
    cctvFeed: {
      id: 'MLN-02',
      name: 'Milan Subway East Approach & Trough',
      status: 'Live — Camera #MLN-02 Active',
      resolution: '1080p Full HD • 30 FPS',
      aiConfidence: 97.1,
      cameras: [
        { id: 'cam-1', name: 'East Portal Warning Gate & Siren', angle: 'Warning Signage', depthEstimate: 48 },
        { id: 'cam-2', name: 'Subway Center Water Depth Marker', angle: 'Water Gauge Post', depthEstimate: 54 },
        { id: 'cam-3', name: 'Milan Flyover On-Ramp Approach', angle: 'Flyover Diverter', depthEstimate: 0 },
        { id: 'cam-4', name: 'Storm Drain Sump & Debris Grate', angle: 'Sump Basin', depthEstimate: 62 }
      ]
    },
    utilities: {
      gridPower: false,
      dgBackup: true,
      elevators: 'N/A',
      escalators: 'N/A',
      cleanWater: 'N/A',
      firstAid: 'Police PCR Van on standby at East Gate'
    },
    forecast: [
      { time: 'NOW', depth: 48, rainRate: 35 },
      { time: '+30m', depth: 55, rainRate: 40 },
      { time: '+60m', depth: 51, rainRate: 35 },
      { time: '+90m', depth: 40, rainRate: 25 },
      { time: '+120m', depth: 28, rainRate: 15 },
      { time: '+180m', depth: 12, rainRate: 8 }
    ],
    historicalComparison: {
      deluge2005Depth: 155,
      cyclone2021Depth: 75,
      currentRiskVs2005: '-69% depth'
    },
    alternativeHaven: {
      name: 'Milan Elevated Flyover',
      distanceKm: 0.2,
      routeClear: true,
      safeApproach: 'Use direct entry ramp onto Milan Flyover'
    },
    passability: {
      sedan: false,
      hatchback: false,
      compactSuv: false,
      heavySuv: false,
      twoWheeler: false,
      ev: false,
      pedestrian: false
    }
  },
  {
    id: 'p-10',
    name: 'Inorbit Mall & Mindspace IT Park (Malad)',
    type: 'commercial',
    ward: 'P-North (Malad West)',
    coordinates: { lat: 19.1764, lng: 72.8347 },
    status: 'operational',
    statusLabel: 'Podium Dry • Basement B2 Monitored',
    severity: 'safe',
    elevationMSL: 8.1,
    waterDepth: 6,
    trend: 'stable',
    lastVerified: '8 mins ago',
    trustScore: 97,
    upvotes: 51,
    downvotes: 1,
    basementParking: {
      status: 'Open with automatic flood barriers on stand-by',
      floors: [
        { level: 'B1', depth: 0, status: 'Dry & Clear', vehicleSlotsTotal: 500, vehicleSlotsAvailable: 195 },
        { level: 'B2', depth: 2, status: 'Controlled Drainage', vehicleSlotsTotal: 500, vehicleSlotsAvailable: 310 }
      ],
      sumpPumps: {
        total: 5,
        active: 3,
        flowRateM3Hr: 390,
        rpm: 2800,
        powerSource: 'Campus DG Substation'
      },
      floodGatePressureBar: 0.3,
      evacuationRemainingMins: null
    },
    retailFloors: 'Full retail operations and tech offices running normally',
    approachRoad: 'Link Road clear; minor curb ponding near Mindspace circle (6cm)',
    highGroundAccess: 'Elevated Link Road corridor',
    skywalk: {
      available: false,
      name: 'N/A',
      clearanceElevation: 'Elevated Plaza +5.0m',
      status: 'Inter-building covered walkways dry'
    },
    cctvFeed: {
      id: 'MLD-04',
      name: 'Inorbit Gate 2 & Mindspace Ring Road',
      status: 'Live — Camera #MLD-04 Active',
      resolution: '4K UltraHD • 30 FPS',
      aiConfidence: 98.4,
      cameras: [
        { id: 'cam-1', name: 'Main Drop-off & Valet Porch', angle: 'Valet Ingress', depthEstimate: 6 },
        { id: 'cam-2', name: 'Basement Parking Incline Ramp', angle: 'Ramp Entrance', depthEstimate: 0 },
        { id: 'cam-3', name: 'Mindspace IT Park North Gate', angle: 'Boulevard View', depthEstimate: 4 },
        { id: 'cam-4', name: 'Storm Drain Sluice to Malad Creek', angle: 'Outfall Channel', depthEstimate: 14 }
      ]
    },
    utilities: {
      gridPower: true,
      dgBackup: true,
      elevators: '100% Operational',
      escalators: '100% Operational',
      cleanWater: 'Operational',
      firstAid: 'First Aid Center Level 1'
    },
    forecast: [
      { time: 'NOW', depth: 6, rainRate: 18 },
      { time: '+30m', depth: 8, rainRate: 22 },
      { time: '+60m', depth: 9, rainRate: 24 },
      { time: '+90m', depth: 7, rainRate: 16 },
      { time: '+120m', depth: 4, rainRate: 10 },
      { time: '+180m', depth: 2, rainRate: 5 }
    ],
    historicalComparison: {
      deluge2005Depth: 70,
      cyclone2021Depth: 20,
      currentRiskVs2005: '-91% depth'
    },
    alternativeHaven: null,
    passability: {
      sedan: true,
      hatchback: true,
      compactSuv: true,
      heavySuv: true,
      twoWheeler: true,
      ev: true,
      pedestrian: true
    }
  },
  {
    id: 'p-11',
    name: 'CSMT Heritage Railway Terminus',
    type: 'transit',
    ward: 'A-Ward (Fort/Colaba)',
    coordinates: { lat: 18.9398, lng: 72.8355 },
    status: 'operational',
    statusLabel: 'Normal Operations • 0 cm Water',
    severity: 'safe',
    elevationMSL: 11.2,
    waterDepth: 0,
    trend: 'stable',
    lastVerified: 'Just now',
    trustScore: 99,
    upvotes: 105,
    downvotes: 1,
    basementParking: {
      status: 'Surface parking dry',
      floors: [],
      sumpPumps: {
        total: 4,
        active: 1,
        flowRateM3Hr: 220,
        rpm: 2500,
        powerSource: 'Dual Grid Fed'
      },
      floodGatePressureBar: 0.0,
      evacuationRemainingMins: null
    },
    retailFloors: 'All long-distance and Harbour/Central suburban platforms clear',
    approachRoad: 'DN Road and Mahapalika Marg completely free of water',
    highGroundAccess: 'South Mumbai coastal high elevation rock bed',
    skywalk: {
      available: true,
      name: 'CSMT to BMC HQ & Times of India Skywalk',
      clearanceElevation: '+6.5m above road',
      status: 'Open & Fully Functional'
    },
    cctvFeed: {
      id: 'CSMT-01',
      name: 'Grand Concourse & Suburban Entry',
      status: 'Live — Camera #CSMT-01 Active',
      resolution: '4K UltraHD • 30 FPS',
      aiConfidence: 99.5,
      cameras: [
        { id: 'cam-1', name: 'Suburban Line Star Concourse', angle: 'Heritage Hall', depthEstimate: 0 },
        { id: 'cam-2', name: 'Harbour Line PF 1 & 2 Culvert', angle: 'Track Level', depthEstimate: 0 },
        { id: 'cam-3', name: 'DN Road Taxi Stand Entrance', angle: 'Street Curb', depthEstimate: 0 },
        { id: 'cam-4', name: 'BMC HQ Crossing Footbridge', angle: 'Overhead Portal', depthEstimate: 0 }
      ]
    },
    utilities: {
      gridPower: true,
      dgBackup: true,
      elevators: '100% Operational',
      escalators: '100% Operational',
      cleanWater: 'Operational (Filtered Water Dispensers Active)',
      firstAid: 'Central Railway Divisional Hospital Clinic'
    },
    forecast: [
      { time: 'NOW', depth: 0, rainRate: 12 },
      { time: '+30m', depth: 1, rainRate: 15 },
      { time: '+60m', depth: 1, rainRate: 14 },
      { time: '+90m', depth: 0, rainRate: 8 },
      { time: '+120m', depth: 0, rainRate: 5 },
      { time: '+180m', depth: 0, rainRate: 2 }
    ],
    historicalComparison: {
      deluge2005Depth: 25,
      cyclone2021Depth: 4,
      currentRiskVs2005: '-100% depth'
    },
    alternativeHaven: null,
    passability: {
      sedan: true,
      hatchback: true,
      compactSuv: true,
      heavySuv: true,
      twoWheeler: true,
      ev: true,
      pedestrian: true
    }
  },
  {
    id: 'p-12',
    name: 'Sion Circle & Gandhi Market Ingress',
    type: 'transit',
    ward: 'F-North (Sion)',
    coordinates: { lat: 19.0370, lng: 72.8625 },
    status: 'closed',
    statusLabel: 'Waterlogged Depot & Circle (52 cm)',
    severity: 'critical',
    elevationMSL: 2.4,
    waterDepth: 52,
    trend: 'rising',
    lastVerified: '2 mins ago',
    trustScore: 94,
    upvotes: 68,
    downvotes: 2,
    basementParking: {
      status: 'Street flooding overflowing into basements',
      floors: [
        { level: 'B1', depth: 38, status: 'Inundated', vehicleSlotsTotal: 150, vehicleSlotsAvailable: 0 }
      ],
      sumpPumps: {
        total: 6,
        active: 4,
        flowRateM3Hr: 520,
        rpm: 2900,
        powerSource: 'Standby BMC Generator'
      },
      floodGatePressureBar: 3.2,
      evacuationRemainingMins: 0
    },
    retailFloors: 'Gandhi Market retail shops closed; shopkeepers relocated stock to upper lofts',
    approachRoad: 'Dr. Ambedkar Road north-bound completely stalled; BEST buses diverted',
    highGroundAccess: 'Sion Flyover and Eastern Express Highway ramps dry',
    skywalk: {
      available: false,
      name: 'N/A',
      clearanceElevation: 'Sion Flyover +8.5m',
      status: 'Use Sion Flyover walkway'
    },
    cctvFeed: {
      id: 'SION-03',
      name: 'Gandhi Market Water Measuring Station',
      status: 'Live — Camera #SION-03 Active',
      resolution: '1080p Full HD • 30 FPS',
      aiConfidence: 97.6,
      cameras: [
        { id: 'cam-1', name: 'Gandhi Market Main Gate Water Ruler', angle: 'Depth Ruler', depthEstimate: 52 },
        { id: 'cam-2', name: 'BEST Depot Ingress Depot Road', angle: 'Bus Yard', depthEstimate: 46 },
        { id: 'cam-3', name: 'Sion Circle Under-Flyover Sump', angle: 'Storm Pump', depthEstimate: 58 },
        { id: 'cam-4', name: 'Sion Railway Station West Approach', angle: 'Pedestrian Lane', depthEstimate: 34 }
      ]
    },
    utilities: {
      gridPower: false,
      dgBackup: true,
      elevators: 'N/A',
      escalators: 'N/A',
      cleanWater: 'Contaminated surface runoff — Drink bottled only',
      firstAid: 'Sion Hospital Trauma Center via Flyover route'
    },
    forecast: [
      { time: 'NOW', depth: 52, rainRate: 42 },
      { time: '+30m', depth: 59, rainRate: 46 },
      { time: '+60m', depth: 54, rainRate: 38 },
      { time: '+90m', depth: 42, rainRate: 26 },
      { time: '+120m', depth: 29, rainRate: 16 },
      { time: '+180m', depth: 15, rainRate: 8 }
    ],
    historicalComparison: {
      deluge2005Depth: 160,
      cyclone2021Depth: 82,
      currentRiskVs2005: '-67% depth'
    },
    alternativeHaven: {
      name: 'Sion Flyover & Eastern Express Highway',
      distanceKm: 0.3,
      routeClear: true,
      safeApproach: 'Ascend Sion Flyover at Maheshwari Udyan'
    },
    passability: {
      sedan: false,
      hatchback: false,
      compactSuv: false,
      heavySuv: false,
      twoWheeler: false,
      ev: false,
      pedestrian: false
    }
  }
];

// Scenario stress-test modifiers
export const SCENARIOS = [
  {
    id: 'current',
    name: 'Real-Time Monsoon Sensors',
    description: 'Current live readings calibrated against BMC Doppler & IoT depth poles.',
    multiplier: 1.0,
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  {
    id: 'cloudburst',
    name: 'Cloudburst Surge (65mm/hr)',
    description: 'Simulates sudden tropical convective cell deluge over central suburban belt.',
    multiplier: 1.65,
    badgeColor: 'bg-red-100 text-red-800 border-red-200'
  },
  {
    id: 'high_tide',
    name: 'High Tide Confluence (4.85m)',
    description: 'Mithi River outfall gates shut at Mahim Creek; storm drains backing up.',
    multiplier: 1.35,
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  {
    id: 'drain_trip',
    name: 'Pumping Station Power Trip',
    description: 'Simulates tripping of major dewatering pumps in low-lying subway pockets.',
    multiplier: 1.85,
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200'
  },
  {
    id: 'clear',
    name: 'Post-Rain Ebb & Recession',
    description: 'Rain stopped, tidal outfalls opened, pumps draining standing water.',
    multiplier: 0.3,
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  }
];

// Vehicle profile clearances in cm
export const VEHICLE_CLEARANCES = {
  pedestrian: { name: 'Pedestrian', clearance: 15, exhaustHeight: null, icon: 'Footprints' },
  twoWheeler: { name: 'Two-Wheeler (Scooter/Bike)', clearance: 12, exhaustHeight: 18, icon: 'Bike' },
  hatchback: { name: 'Compact Hatchback', clearance: 14, exhaustHeight: 20, icon: 'Car' },
  sedan: { name: 'Standard Sedan', clearance: 16, exhaustHeight: 22, icon: 'Car' },
  ev: { name: 'Electric Vehicle (EV)', clearance: 18, batterySealedTo: 28, icon: 'Zap' },
  compactSuv: { name: 'Compact SUV', clearance: 20, exhaustHeight: 28, icon: 'Shield' },
  heavySuv: { name: '4x4 / Heavy SUV', clearance: 26, exhaustHeight: 38, icon: 'Truck' }
};

