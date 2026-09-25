// Route Presets, Corridors, Coordinates, Elevation Profiles & Mumbai Hubs

export const MUMBAI_LOCATIONS = [
  { id: 'powai', name: 'Powai (Hiranandani Gardens)', address: 'Central Ave, Hiranandani Gardens, Powai', lat: 19.1197, lng: 72.9056, elevation: 22.4, zone: 'East Suburbs' },
  { id: 'airport-t2', name: 'CSM International Airport (Terminal 2)', address: 'Sahar Elevated Rd, Navpada, Andheri East', lat: 19.0886, lng: 72.8680, elevation: 11.2, zone: 'Airport Hub' },
  { id: 'bkc', name: 'Bandra Kurla Complex (BKC G-Block)', address: 'G Block BKC, Bandra East, Mumbai', lat: 19.0657, lng: 72.8688, elevation: 6.8, zone: 'Central Business' },
  { id: 'dadar-tt', name: 'Dadar TT Circle (Hindmata Basin)', address: 'Dr Babasaheb Ambedkar Rd, Dadar East', lat: 19.0178, lng: 72.8478, elevation: 3.8, zone: 'South-Central' },
  { id: 'andheri-west', name: 'Andheri West Railway Station', address: 'SV Road, Andheri West', lat: 19.1197, lng: 72.8464, elevation: 4.5, zone: 'West Suburbs' },
  { id: 'phoenix-kurla', name: 'Phoenix Marketcity (Kurla West / LBS)', address: 'Lal Bahadur Shastri Marg, Kurla West', lat: 19.0864, lng: 72.8890, elevation: 4.9, zone: 'Mithi Basin' },
  { id: 'thane-majiwada', name: 'Thane Majiwada Flyover Junction', address: 'Eastern Express Highway, Thane West', lat: 19.2132, lng: 72.9781, elevation: 18.0, zone: 'Thane Metro' },
  { id: 'lower-parel', name: 'Lower Parel (One World Center)', address: 'Senapati Bapat Marg, Lower Parel', lat: 19.0016, lng: 72.8302, elevation: 5.1, zone: 'South Mumbai' },
  { id: 'vashi', name: 'Vashi Toll Plaza (Sion-Panvel Hwy)', address: 'Sion-Panvel Express Highway, Navi Mumbai', lat: 19.0632, lng: 72.9912, elevation: 8.5, zone: 'Navi Mumbai' },
  { id: 'juhu-circle', name: 'Juhu Circle / JVPD Scheme', address: 'Gulmohar Rd, JVPD Scheme, Juhu', lat: 19.1128, lng: 72.8286, elevation: 4.2, zone: 'West Coast' }
];

export const ROUTE_CORRIDORS = {
  safer: {
    id: 'safer',
    name: 'Via JVLR & Western Express Flyover',
    subtitle: 'Recommended Safe Route (Elevated Flyover Deck)',
    tag: 'RECOMMENDED SAFE ROUTE',
    tagColor: 'bg-emerald-600 text-white',
    safetyRating: '96% HYDRO-SAFE',
    safetyRatingColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    distanceKm: 11.4,
    estimatedMinutes: 23,
    maxWaterDepthCm: 4,
    flyoverPercentage: 82,
    tollAmount: '₹ 0',
    stallRiskPercentage: 1.2,
    carbonGrams: 1640,
    elevationMinM: 18.2,
    elevationMaxM: 26.5,
    elevationAvgM: 22.8,
    hydroGnnScore: 96,
    scoreBreakdown: {
      elevationProfile: 98,
      drainageCapacity: 95,
      historicFloodRisk: 94,
      emergencyAccess: 97,
      flowVelocitySafety: 96
    },
    description: 'Utilizes elevated flyover corridors throughout JVLR and Western Express Highway. Completely bypasses low-lying Marol and S.V. Road underpasses with zero submersion risk.',
    weatherAlert: 'Clear of drainage backflow. Light drizzle with active runoff chutes.',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    coordinates: [
      [72.9056, 19.1197], // Powai Hiranandani
      [72.8985, 19.1242], // JVLR start
      [72.8850, 19.1285], // JVLR Flyover deck
      [72.8710, 19.1280], // SEEPZ Flyover
      [72.8590, 19.1220], // Western Express interchange
      [72.8550, 19.1080], // WEH Flyover south
      [72.8570, 19.0960], // Sahar elevated connector ramp
      [72.8680, 19.0886]  // CSMT Airport T2 Arrival Deck
    ],
    elevationProfile: [
      { km: 0.0, label: 'Powai Start', roadElevation: 22.4, waterLevel: 0, depth: 0, status: 'dry' },
      { km: 1.8, label: 'JVLR Entry Ramp', roadElevation: 21.0, waterLevel: 1.2, depth: 0, status: 'dry' },
      { km: 3.5, label: 'IIT Flyover Deck', roadElevation: 25.8, waterLevel: 3.0, depth: 0, status: 'elevated' },
      { km: 5.7, label: 'SEEPZ Flyover Crest', roadElevation: 26.5, waterLevel: 4.5, depth: 0, status: 'elevated' },
      { km: 7.9, label: 'WEH High Connector', roadElevation: 24.2, waterLevel: 3.8, depth: 2, status: 'clear' },
      { km: 9.6, label: 'Sahar Elevated Ramp', roadElevation: 21.5, waterLevel: 2.5, depth: 4, status: 'clear' },
      { km: 11.4, label: 'Airport T2 Deck', roadElevation: 18.2, waterLevel: 1.8, depth: 1, status: 'safe' }
    ],
    turns: [
      { step: 1, icon: 'straight', instruction: 'Head west on Central Ave towards JVLR Connector', distance: '1.2 km', roadElev: '22.4m', depth: '0 cm', risk: 'safe' },
      { step: 2, icon: 'ramp-up', instruction: 'Take the elevated ramp onto Jogeshwari-Vikhroli Link Rd (JVLR)', distance: '4.5 km', roadElev: '25.8m', depth: '0 cm', risk: 'safe' },
      { step: 3, icon: 'merge', instruction: 'Merge onto Western Express Highway Flyover Top Deck (Avoid Service Lane)', distance: '3.1 km', roadElev: '24.2m', depth: '2 cm', risk: 'safe' },
      { step: 4, icon: 'ramp-up', instruction: 'Take Sahar Elevated Expressway direct to Airport Departures/Arrivals', distance: '2.4 km', roadElev: '21.5m', depth: '4 cm', risk: 'safe' },
      { step: 5, icon: 'flag', instruction: 'Arrive at CSMT International Airport Terminal 2 (Elevated Deck)', distance: '200 m', roadElev: '18.2m', depth: '1 cm', risk: 'safe' }
    ]
  },

  balanced: {
    id: 'balanced',
    name: 'Via Saki Vihar Road & Marol Military Rd',
    subtitle: 'Balanced Corridor (Surface Arterial with Managed Ponding)',
    tag: 'BALANCED ROUTE',
    tagColor: 'bg-amber-600 text-white',
    safetyRating: '74% HYDRO-SAFE',
    safetyRatingColor: 'bg-amber-100 text-amber-800 border-amber-300',
    distanceKm: 9.2,
    estimatedMinutes: 20,
    maxWaterDepthCm: 16,
    flyoverPercentage: 35,
    tollAmount: '₹ 0',
    stallRiskPercentage: 14.8,
    carbonGrams: 1410,
    elevationMinM: 6.4,
    elevationMaxM: 19.5,
    elevationAvgM: 11.2,
    hydroGnnScore: 74,
    scoreBreakdown: {
      elevationProfile: 72,
      drainageCapacity: 76,
      historicFloodRisk: 68,
      emergencyAccess: 80,
      flowVelocitySafety: 74
    },
    description: 'Direct surface connection via Saki Vihar Road. Water ponding rising at Saki Naka junction curbs. Safe for SUVs and buses, caution required for low-slung sedans.',
    weatherAlert: 'Storm drain surcharge expected in 35 minutes near Saki Naka junction.',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    coordinates: [
      [72.9056, 19.1197], // Powai
      [72.8990, 19.1140], // Saki Vihar Rd North
      [72.8900, 19.1080], // Marol Military Rd
      [72.8830, 19.1020], // Saki Vihar junction
      [72.8750, 19.0960], // Marol Fire Station
      [72.8680, 19.0886]  // Airport T2
    ],
    elevationProfile: [
      { km: 0.0, label: 'Powai Start', roadElevation: 22.4, waterLevel: 0, depth: 0, status: 'dry' },
      { km: 2.1, label: 'Saki Vihar North', roadElevation: 14.2, waterLevel: 1.0, depth: 3, status: 'clear' },
      { km: 4.4, label: 'Military Rd Basin', roadElevation: 9.5, waterLevel: 2.2, depth: 9, status: 'caution' },
      { km: 6.2, label: 'Saki Naka Curb Low Point', roadElevation: 6.4, waterLevel: 3.5, depth: 16, status: 'warning' },
      { km: 7.8, label: 'Marol Bridge Rise', roadElevation: 12.0, waterLevel: 2.8, depth: 6, status: 'clear' },
      { km: 9.2, label: 'Airport T2 Deck', roadElevation: 18.2, waterLevel: 1.8, depth: 1, status: 'safe' }
    ],
    turns: [
      { step: 1, icon: 'left', instruction: 'Turn left onto Saki Vihar Road towards Tungwa Village', distance: '2.1 km', roadElev: '14.2m', depth: '3 cm', risk: 'safe' },
      { step: 2, icon: 'straight', instruction: 'Continue on Marol Military Road (Stay in center crown lane)', distance: '2.3 km', roadElev: '9.5m', depth: '9 cm', risk: 'caution' },
      { step: 3, icon: 'warning', instruction: 'CAUTION: Saki Naka curb ponding (16cm). Avoid right gutter line.', distance: '1.8 km', roadElev: '6.4m', depth: '16 cm', risk: 'warning' },
      { step: 4, icon: 'right', instruction: 'Turn right onto Andheri-Ghatkopar link towards Airport Perimeter', distance: '1.6 km', roadElev: '12.0m', depth: '6 cm', risk: 'safe' },
      { step: 5, icon: 'flag', instruction: 'Arrive at CSMT International Airport Terminal 2', distance: '1.4 km', roadElev: '18.2m', depth: '1 cm', risk: 'safe' }
    ]
  },

  fastest: {
    id: 'fastest',
    name: 'Via Andheri-Kurla Link Road & Subways',
    subtitle: 'Direct Lowland Corridor (High Submergence Hazard)',
    tag: 'FASTEST • HIGH FLOOD HAZARD',
    tagColor: 'bg-rose-600 text-white',
    safetyRating: '38% HAZARDOUS',
    safetyRatingColor: 'bg-rose-100 text-rose-800 border-rose-300',
    distanceKm: 8.1,
    estimatedMinutes: 18,
    maxWaterDepthCm: 34,
    flyoverPercentage: 10,
    tollAmount: '₹ 0',
    stallRiskPercentage: 68.5,
    carbonGrams: 1220,
    elevationMinM: 3.2,
    elevationMaxM: 18.2,
    elevationAvgM: 6.8,
    hydroGnnScore: 38,
    scoreBreakdown: {
      elevationProfile: 28,
      drainageCapacity: 34,
      historicFloodRisk: 22,
      emergencyAccess: 45,
      flowVelocitySafety: 32
    },
    description: 'Impassable for standard sedans, hatchbacks, and two-wheelers. Kurla-Andheri subway underpasses are experiencing rapid inflow (+2cm every 10 min) with severe suction vortexes near culverts.',
    weatherAlert: 'CRITICAL: Subway drainage pumping stations operating at 120% overload.',
    color: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.45)',
    coordinates: [
      [72.9056, 19.1197], // Powai
      [72.8940, 19.1060], // Saki Naka Underpass
      [72.8830, 19.0980], // Kurla link road
      [72.8720, 19.0910], // Metro Pillar low sump
      [72.8680, 19.0886]  // Airport T2
    ],
    elevationProfile: [
      { km: 0.0, label: 'Powai Start', roadElevation: 22.4, waterLevel: 0, depth: 0, status: 'dry' },
      { km: 2.2, label: 'L&T Descent', roadElevation: 11.0, waterLevel: 2.0, depth: 8, status: 'caution' },
      { km: 4.1, label: 'Saki Naka Low Sump', roadElevation: 4.8, waterLevel: 5.2, depth: 24, status: 'danger' },
      { km: 5.9, label: 'Andheri-Kurla Subway Dip', roadElevation: 3.2, waterLevel: 6.5, depth: 34, status: 'critical' },
      { km: 7.2, label: 'Airport Approach Sump', roadElevation: 7.5, waterLevel: 3.8, depth: 14, status: 'warning' },
      { km: 8.1, label: 'Airport T2 Deck', roadElevation: 18.2, waterLevel: 1.8, depth: 1, status: 'safe' }
    ],
    turns: [
      { step: 1, icon: 'straight', instruction: 'Head southwest along Saki Naka Link Road', distance: '2.2 km', roadElev: '11.0m', depth: '8 cm', risk: 'caution' },
      { step: 2, icon: 'danger', instruction: 'CRITICAL: Approaching Saki Naka Sump. Standing water 24cm deep.', distance: '1.9 km', roadElev: '4.8m', depth: '24 cm', risk: 'danger' },
      { step: 3, icon: 'critical', instruction: 'IMPASSABLE: Andheri-Kurla Subway dip flooded to 34cm. High stall hazard.', distance: '1.8 km', roadElev: '3.2m', depth: '34 cm', risk: 'critical' },
      { step: 4, icon: 'straight', instruction: 'Cross airport perimeter road with continuous water drag', distance: '1.3 km', roadElev: '7.5m', depth: '14 cm', risk: 'warning' },
      { step: 5, icon: 'flag', instruction: 'Reach CSMT Airport T2 Arrival via flooded service ramp', distance: '900 m', roadElev: '18.2m', depth: '1 cm', risk: 'safe' }
    ]
  }
};

// Route-adjacent verified Safe Havens & Shelters
export const ROUTE_SAFE_HAVENS = [
  {
    id: 'sh-1',
    name: 'Kokilaben Ambani Hospital Relief Haven',
    type: 'Hospital & Trauma',
    distanceFromRoute: '0.8 km off JVLR',
    elevation: '+18.4m MSL',
    status: 'High Ground • 100% Operational',
    waterDepth: '0 cm',
    capacity: '145 beds available',
    power: 'Triple Generator Backup Active',
    lat: 19.1311,
    lng: 72.8252
  },
  {
    id: 'sh-2',
    name: 'Hiranandani Powai Multi-Level Covered Garage (P3)',
    type: 'Dry Vehicle Staging',
    distanceFromRoute: '0.2 km from Origin',
    elevation: '+28.0m MSL',
    status: 'Covered High Deck • 340 bays',
    waterDepth: '0 cm',
    capacity: '340 vehicle spots',
    power: 'Solar Inverter Active',
    lat: 19.1180,
    lng: 72.9080
  },
  {
    id: 'sh-3',
    name: 'SEEPZ Elevated Metro Station Concourse',
    type: 'Civic Pedestrian Shelter',
    distanceFromRoute: 'Directly on JVLR Flyover',
    elevation: '+26.0m MSL',
    status: 'Pedestrian Skywalk Accessible',
    waterDepth: '0 cm',
    capacity: '800 citizens',
    power: 'Full BMC Grid Connected',
    lat: 19.1240,
    lng: 72.8740
  },
  {
    id: 'sh-4',
    name: 'Airport T2 Multi-Level Car Park (Level 5-7)',
    type: 'Flood-Immune Parking & Staging',
    distanceFromRoute: 'At Destination',
    elevation: '+22.5m MSL',
    status: 'Guaranteed Dry • 1200 spots',
    waterDepth: '0 cm',
    capacity: '420 spots free',
    power: 'Airport Dedicated Tri-Fuel Plant',
    lat: 19.0895,
    lng: 72.8690
  }
];

// Active BMC road closures along the Mumbai network
export const ROUTE_BARRICADES = [
  {
    id: 'bar-1',
    corridorId: 'fastest',
    road: 'Andheri-Kurla Subway Underpass',
    status: 'TOTAL CLOSURE',
    severity: 'CRITICAL',
    reason: 'Water depth 34cm exceeded safe threshold. BMC portable dewatering pumps deployed.',
    detourRecommended: 'Divert immediately to JVLR Elevated Corridor.',
    lat: 19.0940,
    lng: 72.8750
  },
  {
    id: 'bar-2',
    corridorId: 'balanced',
    road: 'Saki Naka Right Carriageway Curb',
    status: 'LANE RESTRICTION',
    severity: 'CAUTION',
    reason: 'Heavy water ponding in curb lane. Light vehicles restricted to center high-crown lane.',
    detourRecommended: 'Stay strictly in left/center lane; do not overtake.',
    lat: 19.1040,
    lng: 72.8840
  }
];

// Live BMC Ultrasonic Sensor Telemetry
export const ROUTE_SENSOR_TELEMETRY = [
  {
    id: 'SENSOR-JVLR-02',
    name: 'JVLR Elevated Ultrasonic Station',
    corridor: 'safer',
    waterDepthCm: 1.2,
    rateOfChange: '+0.2 cm/hr (Steady)',
    surfaceVelocity: '0.04 m/s',
    drainCapacity: '18% Utilized',
    pumpStatus: 'Standby Ready',
    lat: 19.1270,
    lng: 72.8820
  },
  {
    id: 'SENSOR-SN-41',
    name: 'Saki Naka Drain Gauge #41',
    corridor: 'balanced',
    waterDepthCm: 16.4,
    rateOfChange: '+2.1 cm/hr (Rising)',
    surfaceVelocity: '0.34 m/s',
    drainCapacity: '86% Utilized',
    pumpStatus: '2 Pumps Discharging',
    lat: 19.1090,
    lng: 72.8810
  },
  {
    id: 'CCTV-AK-SUBWAY',
    name: 'Andheri-Kurla Sump LiDAR Sensor',
    corridor: 'fastest',
    waterDepthCm: 34.8,
    rateOfChange: '+5.4 cm/hr (Rapid Surcharge)',
    surfaceVelocity: '0.68 m/s',
    drainCapacity: '124% (Overwhelmed)',
    pumpStatus: '4 Heavy Dewatering Trailers En Route',
    lat: 19.0935,
    lng: 72.8745
  }
];

// Tidal Forecast Table for Mumbai Harbour & Mahim Outfall
export const TIDE_FORECAST = [
  { time: '18:00', heightM: 3.10, status: 'Ebb Tide', backflowRisk: 'Low' },
  { time: '19:30', heightM: 3.65, status: 'Rising Tide', backflowRisk: 'Moderate' },
  { time: '21:00', heightM: 4.15, status: 'High Tide Approaching', backflowRisk: 'High' },
  { time: '22:30', heightM: 4.48, status: 'SPRING HIGH TIDE PEAK', backflowRisk: 'CRITICAL (Drain Locking)' },
  { time: '00:00', heightM: 3.80, status: 'Slack Water', backflowRisk: 'High' },
  { time: '01:30', heightM: 2.90, status: 'Receding Tide', backflowRisk: 'Moderate' }
];

