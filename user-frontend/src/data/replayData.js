// Comprehensive Historical Replay & Hydrodynamic Dataset

export const HISTORICAL_EVENTS = [
  {
    id: 'event-2005',
    name: 'July 2005 Great Mumbai Deluge',
    date: 'July 26, 2005',
    category: 'Extreme Cloudburst & Arabian Sea Surge',
    totalRainfall: '944 mm in 24 hours',
    peakWaterDepth: '145 cm',
    peakRainRate: '190 mm/h',
    highTidePeak: '4.48 m at 15:45 IST',
    subwaysFlooded: 7,
    casualtiesAvoidedNote: 'Benchmark tragedy that catalyzed modern SWD & BRIMSTOWAD reforms',
    timelineSteps: [
      {
        time: '12:00',
        title: 'Monsoon Front Stationary Lock',
        rain: 45,
        depth: 18,
        tide: 2.8,
        roadsClosed: 3,
        pumps: 'Stationary (25%)',
        activeTurbines: 4,
        subwaysFlooded: 1,
        distressCalls: 120,
        economicRate: 15.2,
        tankFill: 10,
        flowVelocity: 0.6,
        cctvStatus: 'Normal visibility',
        note: 'Low-pressure depression becomes quasi-stationary directly over Santacruz & Kurla basin.'
      },
      {
        time: '14:00',
        title: 'Hyper-Convective Core Cloudburst',
        rain: 120,
        depth: 55,
        tide: 3.9,
        roadsClosed: 14,
        pumps: 'Overloaded (60%)',
        activeTurbines: 8,
        subwaysFlooded: 4,
        distressCalls: 840,
        economicRate: 48.0,
        tankFill: 42,
        flowVelocity: 1.4,
        cctvStatus: 'Severe lens rain blur',
        note: 'Rainfall exceeds 2 mm/min. Mithi River swells past danger mark (3.5m) at Kalina and Kurla.'
      },
      {
        time: '15:45',
        title: 'Astronomical High Tide Confluence',
        rain: 190,
        depth: 145,
        tide: 4.48,
        roadsClosed: 28,
        pumps: 'Submerged & Stalled',
        activeTurbines: 2,
        subwaysFlooded: 7,
        distressCalls: 3400,
        economicRate: 185.0,
        tankFill: 100,
        flowVelocity: 2.8,
        cctvStatus: 'Feed disrupted / power cut',
        note: '4.48m sea tide shuts gravity outfall gates completely. Water reverses from Mahim Creek into Sion & Kurla sumps.'
      },
      {
        time: '18:30',
        title: 'Island City Sump Saturation',
        rain: 110,
        depth: 130,
        tide: 3.2,
        roadsClosed: 24,
        pumps: 'Emergency Mobilization',
        activeTurbines: 5,
        subwaysFlooded: 7,
        distressCalls: 2900,
        economicRate: 140.0,
        tankFill: 100,
        flowVelocity: 1.9,
        cctvStatus: 'Partial battery backup',
        note: 'Western & Central railway tracks drowned under 1.2m water at Kurla, Dadar, and Chunabhatti.'
      },
      {
        time: '21:00',
        title: 'Tidal Recession & Slow Outfall Drainage',
        rain: 65,
        depth: 95,
        tide: 1.8,
        roadsClosed: 18,
        pumps: 'Auxiliary Gensets Engaged',
        activeTurbines: 9,
        subwaysFlooded: 6,
        distressCalls: 1650,
        economicRate: 85.0,
        tankFill: 92,
        flowVelocity: 1.2,
        cctvStatus: 'Murky residual flooding',
        note: 'Low tide enables gravity release through Mahim and Worli outfalls; flood level recedes by 35 cm.'
      },
      {
        time: '00:30',
        title: 'Residual Basin Drainage Operations',
        rain: 25,
        depth: 48,
        tide: 1.1,
        roadsClosed: 10,
        pumps: 'High-Volume Dewatering',
        activeTurbines: 12,
        subwaysFlooded: 4,
        distressCalls: 620,
        economicRate: 35.0,
        tankFill: 68,
        flowVelocity: 0.7,
        cctvStatus: 'Restored feeds',
        note: 'Armed forces and municipal dewatering pumps clear arterial corridors; stranded citizens sheltered in civic schools.'
      },
      {
        time: '04:00',
        title: 'Post-Flood Stabilization & Mud Clearance',
        rain: 8,
        depth: 20,
        tide: 2.2,
        roadsClosed: 4,
        pumps: 'Continuous Dewatering',
        activeTurbines: 10,
        subwaysFlooded: 2,
        distressCalls: 210,
        economicRate: 18.0,
        tankFill: 40,
        flowVelocity: 0.3,
        cctvStatus: 'Clear visibility',
        note: 'Siltation clearing operations commence on Western Express Highway and LBS Marg.'
      }
    ]
  },
  {
    id: 'event-2017',
    name: 'August 2017 Severe Inundation (Elphinstone / Parel)',
    date: 'August 29, 2017',
    category: 'Intense Mesoscale Cloudburst',
    totalRainfall: '315 mm in 6 hours',
    peakWaterDepth: '85 cm',
    peakRainRate: '125 mm/h',
    highTidePeak: '3.75 m at 16:30 IST',
    subwaysFlooded: 6,
    casualtiesAvoidedNote: 'Severe transit paralysis prompting construction of the 30-ML Hindmata holding tanks',
    timelineSteps: [
      {
        time: '11:30',
        title: 'Broad Front Rain Initiation',
        rain: 32,
        depth: 10,
        tide: 2.1,
        roadsClosed: 1,
        pumps: 'Standby / Warmup',
        activeTurbines: 4,
        subwaysFlooded: 0,
        distressCalls: 45,
        economicRate: 8.5,
        tankFill: 5,
        flowVelocity: 0.4,
        cctvStatus: 'Clear daylight',
        note: 'Doppler Radar shows dense stationary band anchoring over South-Central Mumbai.'
      },
      {
        time: '13:00',
        title: 'Accelerating Downpour & Sump Filling',
        rain: 78,
        depth: 32,
        tide: 2.9,
        roadsClosed: 6,
        pumps: 'Activated (70%)',
        activeTurbines: 8,
        subwaysFlooded: 3,
        distressCalls: 310,
        economicRate: 26.0,
        tankFill: 35,
        flowVelocity: 0.9,
        cctvStatus: 'Heavy rain streaks',
        note: 'Railway tracks at Matunga & Sion submerge. Traffic on Dr. B.A. Road slows to a crawl.'
      },
      {
        time: '15:15',
        title: 'Flash Sump at Hindmata & Elphinstone',
        rain: 125,
        depth: 85,
        tide: 3.75,
        roadsClosed: 16,
        pumps: 'Maximum Duty',
        activeTurbines: 12,
        subwaysFlooded: 6,
        distressCalls: 1420,
        economicRate: 72.0,
        tankFill: 95,
        flowVelocity: 1.8,
        cctvStatus: 'Water up to car bonnet level',
        note: 'Hindmata bowl flooded to waist height. High tide gates closed at Love Grove & Cleveland Bunder outfalls.'
      },
      {
        time: '17:00',
        title: 'Civic Shelter & Gurdwara Mobilization',
        rain: 60,
        depth: 68,
        tide: 3.4,
        roadsClosed: 14,
        pumps: 'Diesel Backup Running',
        activeTurbines: 11,
        subwaysFlooded: 5,
        distressCalls: 1180,
        economicRate: 58.0,
        tankFill: 88,
        flowVelocity: 1.3,
        cctvStatus: 'Nightfall street lighting',
        note: 'Thousands of commuters stranded in offices given food and shelter by local resident associations.'
      },
      {
        time: '19:30',
        title: 'Storm Band Trajectory Shifts North',
        rain: 22,
        depth: 42,
        tide: 2.2,
        roadsClosed: 8,
        pumps: 'Full Extraction',
        activeTurbines: 10,
        subwaysFlooded: 3,
        distressCalls: 540,
        economicRate: 31.0,
        tankFill: 60,
        flowVelocity: 0.8,
        cctvStatus: 'Water receding gradually',
        note: 'Tide turns low; flap gates swing open. Pumps discharge 45,000 litres/sec into the sea.'
      },
      {
        time: '22:00',
        title: 'Subway Drainage & Carriageway Recovery',
        rain: 6,
        depth: 14,
        tide: 1.4,
        roadsClosed: 2,
        pumps: 'Residual Dewatering',
        activeTurbines: 6,
        subwaysFlooded: 1,
        distressCalls: 110,
        economicRate: 12.0,
        tankFill: 25,
        flowVelocity: 0.3,
        cctvStatus: 'Normal roadway visibility',
        note: 'Hindmata junction reopened to vehicular traffic with caution.'
      }
    ]
  },
  {
    id: 'event-2019',
    name: 'July 2019 Malad & Kurla Sump Breach',
    date: 'July 2, 2019',
    category: 'Concentrated Microburst Inundation',
    totalRainfall: '375 mm in 12 hours',
    peakWaterDepth: '98 cm',
    peakRainRate: '140 mm/h',
    highTidePeak: '4.69 m at 23:45 IST',
    subwaysFlooded: 6,
    casualtiesAvoidedNote: 'Prompted BMC geo-fenced early warning alerts and retaining wall safety audits',
    timelineSteps: [
      {
        time: '20:00',
        title: 'Intense Pre-Midnight Downpour',
        rain: 58,
        depth: 25,
        tide: 3.1,
        roadsClosed: 4,
        pumps: 'Nominal Duty',
        activeTurbines: 6,
        subwaysFlooded: 2,
        distressCalls: 280,
        economicRate: 22.0,
        tankFill: 28,
        flowVelocity: 0.7,
        cctvStatus: 'Night drizzle',
        note: 'Continuous torrential bands hit Western suburbs: Malad, Goregaon, and Andheri.'
      },
      {
        time: '22:15',
        title: 'Microburst Peak over Pishori & Malad East',
        rain: 140,
        depth: 82,
        tide: 4.1,
        roadsClosed: 12,
        pumps: 'Heavy Overload',
        activeTurbines: 10,
        subwaysFlooded: 5,
        distressCalls: 1540,
        economicRate: 88.0,
        tankFill: 85,
        flowVelocity: 2.1,
        cctvStatus: 'Turbulent flow on camera',
        note: 'Runoff pressure breaches section of hill retaining wall; emergency NDRF teams dispatched.'
      },
      {
        time: '23:45',
        title: 'Spring High Tide Surcharge (4.69m)',
        rain: 88,
        depth: 98,
        tide: 4.69,
        roadsClosed: 19,
        pumps: 'Genset Max Capacity',
        activeTurbines: 12,
        subwaysFlooded: 6,
        distressCalls: 2150,
        economicRate: 110.0,
        tankFill: 100,
        flowVelocity: 2.4,
        cctvStatus: 'Full roadway inundation',
        note: 'Highest astronomical tide of the season locks all 45 municipal outfall gates along the shoreline.'
      },
      {
        time: '02:00',
        title: 'Multi-Agency Ingress & Relief Ops',
        rain: 45,
        depth: 72,
        tide: 3.6,
        roadsClosed: 15,
        pumps: 'Continuous Dewatering',
        activeTurbines: 12,
        subwaysFlooded: 5,
        distressCalls: 1400,
        economicRate: 75.0,
        tankFill: 90,
        flowVelocity: 1.5,
        cctvStatus: 'Rescue boat lights visible',
        note: 'Inflatable rescue boats deployed in Kurla Kranti Nagar and Malad East lowlands.'
      },
      {
        time: '04:30',
        title: 'Low Tide Ebb & Runoff Surge',
        rain: 18,
        depth: 36,
        tide: 1.9,
        roadsClosed: 7,
        pumps: 'Full Flow Extraction',
        activeTurbines: 10,
        subwaysFlooded: 3,
        distressCalls: 490,
        economicRate: 34.0,
        tankFill: 55,
        flowVelocity: 0.8,
        cctvStatus: 'Early morning daylight',
        note: 'Rapid tidal drawdown allows gravity channels to empty 18 million cubic meters into Arabian Sea.'
      },
      {
        time: '07:00',
        title: 'Transit Corridor De-watered',
        rain: 5,
        depth: 12,
        tide: 1.2,
        roadsClosed: 2,
        pumps: 'Residual Cleanup',
        activeTurbines: 6,
        subwaysFlooded: 1,
        distressCalls: 95,
        economicRate: 14.0,
        tankFill: 20,
        flowVelocity: 0.2,
        cctvStatus: 'Dry carriageway',
        note: 'Western Railway services restored with 15-minute speed restrictions.'
      }
    ]
  },
  {
    id: 'event-2023',
    name: 'July 2023 Cloudburst (Hindmata & Kurla)',
    date: 'July 19, 2023',
    category: 'Modern Post-Tank Retention Deployment',
    totalRainfall: '242 mm in 4 hours',
    peakWaterDepth: '62 cm',
    peakRainRate: '110 mm/h',
    highTidePeak: '4.30 m at 19:45 IST',
    subwaysFlooded: 4,
    casualtiesAvoidedNote: 'First operational test of the Hindmata 30-ML underground flood retention tanks',
    timelineSteps: [
      {
        time: '17:30',
        title: 'Convective Cell Genesis',
        rain: 15,
        depth: 4,
        tide: 2.4,
        roadsClosed: 0,
        pumps: 'Standby Ready',
        activeTurbines: 4,
        subwaysFlooded: 0,
        distressCalls: 32,
        economicRate: 4.2,
        tankFill: 0,
        flowVelocity: 0.3,
        cctvStatus: 'Normal commute',
        note: 'Dense radar echoes over Thane Creek migrating southwest directly toward Dharavi & Parel.'
      },
      {
        time: '18:15',
        title: 'Sudden Cloudburst Onset',
        rain: 78,
        depth: 22,
        tide: 3.3,
        roadsClosed: 3,
        pumps: 'Activated (50%)',
        activeTurbines: 8,
        subwaysFlooded: 1,
        distressCalls: 210,
        economicRate: 19.5,
        tankFill: 24,
        flowVelocity: 0.8,
        cctvStatus: 'Rain splashing camera lens',
        note: 'Rainfall exceeds 1.3 mm/min; street runoff overwhelms gravity drains in Dadar TT circle.'
      },
      {
        time: '19:00',
        title: 'Peak Basin Inundation & Tank Ingress',
        rain: 110,
        depth: 54,
        tide: 4.1,
        roadsClosed: 8,
        pumps: 'Max Duty (100%)',
        activeTurbines: 12,
        subwaysFlooded: 3,
        distressCalls: 780,
        economicRate: 42.0,
        tankFill: 74,
        flowVelocity: 1.4,
        cctvStatus: 'Heavy ponding at curbs',
        note: 'Hindmata underground holding tanks engage; 18,000 cubic meters diverted beneath Pramod Mahajan Park.'
      },
      {
        time: '19:45',
        title: 'High Tide Confluence (4.3m)',
        rain: 65,
        depth: 62,
        tide: 4.3,
        roadsClosed: 11,
        pumps: 'Outfall Flaps Closed',
        activeTurbines: 10,
        subwaysFlooded: 4,
        distressCalls: 920,
        economicRate: 49.0,
        tankFill: 92,
        flowVelocity: 1.2,
        cctvStatus: 'Holding tanks near full',
        note: '4.3m Arabian Sea tide halts Mahim Creek gravity discharge; retention tanks buffer water until tide turns.'
      },
      {
        time: '20:30',
        title: 'Rain Tapering & High-Volume Dewatering',
        rain: 24,
        depth: 38,
        tide: 3.1,
        roadsClosed: 6,
        pumps: 'Heavy Dewatering',
        activeTurbines: 12,
        subwaysFlooded: 2,
        distressCalls: 440,
        economicRate: 24.0,
        tankFill: 65,
        flowVelocity: 0.7,
        cctvStatus: 'Road surface reappearing',
        note: '12 mobile diesel pumps discharge 1,200 liters/sec from holding tanks into Mahim Bay.'
      },
      {
        time: '22:00',
        title: 'Surface Drain Clearance & Re-opening',
        rain: 5,
        depth: 8,
        tide: 1.8,
        roadsClosed: 1,
        pumps: 'Residual Sweep',
        activeTurbines: 6,
        subwaysFlooded: 0,
        distressCalls: 85,
        economicRate: 7.0,
        tankFill: 20,
        flowVelocity: 0.2,
        cctvStatus: 'Traffic moving smoothly',
        note: 'Dr. B.A. Road and Gandhi Market reopen 4 hours faster than in 2017 thanks to retention buffer.'
      }
    ]
  },
  {
    id: 'event-2020',
    name: 'October 2020 Cyclone Inundation',
    date: 'October 14, 2020',
    category: 'Post-Monsoon Cyclone Rainband',
    totalRainfall: '180 mm in 5 hours',
    peakWaterDepth: '48 cm',
    peakRainRate: '85 mm/h',
    highTidePeak: '3.95 m at 14:10 IST',
    subwaysFlooded: 3,
    casualtiesAvoidedNote: 'Validated dynamic sluice gate automation and early siren broadcasting',
    timelineSteps: [
      {
        time: '12:00',
        title: 'Cyclonic Spiral Band Ingress',
        rain: 28,
        depth: 8,
        tide: 2.6,
        roadsClosed: 1,
        pumps: 'Automated Wakeup',
        activeTurbines: 6,
        subwaysFlooded: 0,
        distressCalls: 40,
        economicRate: 6.0,
        tankFill: 12,
        flowVelocity: 0.4,
        cctvStatus: 'Wind gusts and squall',
        note: 'Arabian Sea cyclonic depression pushes squalls with 55 km/h gusts across coastal wards.'
      },
      {
        time: '13:15',
        title: 'Gale Squall & Storm Water Surcharge',
        rain: 65,
        depth: 28,
        tide: 3.5,
        roadsClosed: 4,
        pumps: 'Turbine Spooling',
        activeTurbines: 9,
        subwaysFlooded: 2,
        distressCalls: 290,
        economicRate: 21.0,
        tankFill: 48,
        flowVelocity: 1.1,
        cctvStatus: 'Heavy chop in Mahim Bay',
        note: 'Tree falls block 3 primary feeder storm culverts in Dadar and Bandra West.'
      },
      {
        time: '14:10',
        title: 'Surge Confluence & Flap Isolation',
        rain: 85,
        depth: 48,
        tide: 3.95,
        roadsClosed: 7,
        pumps: 'Full Dewatering Array',
        activeTurbines: 11,
        subwaysFlooded: 3,
        distressCalls: 620,
        economicRate: 38.0,
        tankFill: 82,
        flowVelocity: 1.3,
        cctvStatus: 'Storm surge spray',
        note: 'Automatic pneumatic seals engage on Cleveland Bunder gates to stop tidal sea intrusion.'
      },
      {
        time: '15:45',
        title: 'Squall Passage Eastward',
        rain: 38,
        depth: 29,
        tide: 3.0,
        roadsClosed: 3,
        pumps: 'Continuous Discharge',
        activeTurbines: 9,
        subwaysFlooded: 1,
        distressCalls: 310,
        economicRate: 18.0,
        tankFill: 54,
        flowVelocity: 0.6,
        cctvStatus: 'Rain diminishing',
        note: 'Cyclonic eye drifts toward Pune; localized pumping drops water by 19 cm in 45 mins.'
      },
      {
        time: '17:30',
        title: 'Basin Re-equilibrium',
        rain: 10,
        depth: 10,
        tide: 1.9,
        roadsClosed: 0,
        pumps: 'Residual Standby',
        activeTurbines: 5,
        subwaysFlooded: 0,
        distressCalls: 65,
        economicRate: 5.5,
        tankFill: 18,
        flowVelocity: 0.2,
        cctvStatus: 'Clear daylight returned',
        note: 'All arterial subways declared safe and reopened for commercial transit.'
      }
    ]
  }
];

// Critical Subways Telemetry
export const SUBWAYS_DATA = [
  {
    id: 'milan-subway',
    name: 'Milan Subway (Santacruz)',
    road: 'Swami Vivekanand Road',
    baseElevation: 2.1, // meters above MSL
    maxCapacityCm: 110,
    pumpRating: '3,000 m³/h',
    gateStatus: 'Automated Hydraulic Barrier',
    vulnerability: 'High (Natural low sump basin)',
    depthMultiplier: 1.35
  },
  {
    id: 'khar-subway',
    name: 'Khar Subway (Khar West)',
    road: '1st Road Link',
    baseElevation: 2.4,
    maxCapacityCm: 90,
    pumpRating: '2,200 m³/h',
    gateStatus: 'Manual Swing Gates',
    vulnerability: 'Severe (Railway bridge depression)',
    depthMultiplier: 1.25
  },
  {
    id: 'andheri-subway',
    name: 'Andheri Subway',
    road: 'Old Nagardas Road',
    baseElevation: 1.9,
    maxCapacityCm: 130,
    pumpRating: '4,500 m³/h',
    gateStatus: 'Pneumatic Stoplog Barriers',
    vulnerability: 'Critical (Frequent flash ponding)',
    depthMultiplier: 1.55
  },
  {
    id: 'hindmata-underpass',
    name: 'Hindmata Flyover Underpass',
    road: 'Dr. Babasaheb Ambedkar Road',
    baseElevation: 2.3,
    maxCapacityCm: 80,
    pumpRating: '6,000 m³/h + 30ML Tanks',
    gateStatus: 'Variable Speed Diverters',
    vulnerability: 'Medium (Buffered by Holding Tanks)',
    depthMultiplier: 0.85
  },
  {
    id: 'dahisar-subway',
    name: 'Dahisar Subway',
    road: 'Dahisar Toll Link',
    baseElevation: 3.1,
    maxCapacityCm: 75,
    pumpRating: '1,800 m³/h',
    gateStatus: 'Mechanical Drop Gates',
    vulnerability: 'Moderate',
    depthMultiplier: 0.95
  }
];

// Major Municipal Pumping Stations Telemetry
export const PUMPING_STATIONS = [
  {
    id: 'britannia',
    name: 'Britannia Pumping Station',
    location: 'Reay Road / Sewri',
    turbines: 6,
    turbineCapacity: '6,000 L/s each',
    totalCapacity: '36,000 L/s',
    outfall: 'Mumbai Harbour Bay',
    fuelReserves: '48 Hours Diesel Genset'
  },
  {
    id: 'love-grove',
    name: 'Love Grove Pumping Station',
    location: 'Worli Naka',
    turbines: 8,
    turbineCapacity: '7,500 L/s each',
    totalCapacity: '60,000 L/s',
    outfall: 'Arabian Sea Shoreline',
    fuelReserves: '72 Hours Diesel Genset'
  },
  {
    id: 'cleveland-bunder',
    name: 'Cleveland Bunder Station',
    location: 'Worli Dairy Creek',
    turbines: 7,
    turbineCapacity: '6,500 L/s each',
    totalCapacity: '45,500 L/s',
    outfall: 'Worli Point Outfall',
    fuelReserves: '60 Hours Diesel Genset'
  },
  {
    id: 'gazdarbandh',
    name: 'Gazdarbandh Station',
    location: 'Khar Danda Creek',
    turbines: 6,
    turbineCapacity: '5,000 L/s each',
    totalCapacity: '30,000 L/s',
    outfall: 'Mahim Bay Channel',
    fuelReserves: '36 Hours Diesel Genset'
  },
  {
    id: 'haji-ali',
    name: 'Haji Ali Pumping Station',
    location: 'Haji Ali Bay',
    turbines: 6,
    turbineCapacity: '5,000 L/s each',
    totalCapacity: '30,000 L/s',
    outfall: 'Arabian Sea Direct',
    fuelReserves: '40 Hours Diesel Genset'
  }
];

// Vehicle Hydrodynamic Stability Ratings
export const VEHICLE_HYDRO_SPECS = [
  {
    id: 'two-wheeler',
    name: 'Two-Wheeler (Motorcycle / Scooter)',
    exhaustHeightCm: 15,
    flotationDepthCm: 25,
    criticalVelocityMs: 0.8,
    icon: 'Bike',
    advice: 'Do NOT attempt to cross flowing water exceeding ankle depth.'
  },
  {
    id: 'hatchback',
    name: 'Compact Hatchback',
    exhaustHeightCm: 22,
    flotationDepthCm: 32,
    criticalVelocityMs: 1.1,
    icon: 'Car',
    advice: 'Engine air intake is vulnerable; high risk of hydrostatic lock.'
  },
  {
    id: 'sedan',
    name: 'Mid-Size Sedan',
    exhaustHeightCm: 28,
    flotationDepthCm: 42,
    criticalVelocityMs: 1.3,
    icon: 'Car',
    advice: 'Float threshold reached quickly due to flat chassis underbody.'
  },
  {
    id: 'suv',
    name: 'Full-Size 4x4 / SUV',
    exhaustHeightCm: 45,
    flotationDepthCm: 65,
    criticalVelocityMs: 1.8,
    icon: 'Truck',
    advice: 'Capable through shallow sumps; beware unseen open manholes.'
  },
  {
    id: 'bus',
    name: 'BEST Municipal Bus / Heavy Truck',
    exhaustHeightCm: 70,
    flotationDepthCm: 110,
    criticalVelocityMs: 2.6,
    icon: 'Bus',
    advice: 'High clearance vehicle used for mass emergency passenger rescue.'
  }
];

// Ward Severity Heatmap Configuration
export const WARDS_HEATMAP = [
  {
    code: 'F/North',
    name: 'F/North Ward (Matunga, Sion, Wadala)',
    catchmentAreaSqKm: 12.8,
    sumpSensitivity: 0.94,
    pumpsCount: 8,
    primaryBottleneck: 'Sion Railway Culverts'
  },
  {
    code: 'G/North',
    name: 'G/North Ward (Dharavi, Dadar, Mahim)',
    catchmentAreaSqKm: 9.1,
    sumpSensitivity: 0.88,
    pumpsCount: 14,
    primaryBottleneck: 'Hindmata Bowl & Mahim Creek Outfall'
  },
  {
    code: 'L Ward',
    name: 'L Ward (Kurla, Sakinaka, Chunabhatti)',
    catchmentAreaSqKm: 15.6,
    sumpSensitivity: 0.96,
    pumpsCount: 10,
    primaryBottleneck: 'Mithi River Surcharge Sump'
  },
  {
    code: 'K/East',
    name: 'K/East Ward (Andheri East, Marol, Chakala)',
    catchmentAreaSqKm: 16.2,
    sumpSensitivity: 0.78,
    pumpsCount: 6,
    primaryBottleneck: 'Andheri Subway Inundation'
  },
  {
    code: 'H/West',
    name: 'H/West Ward (Bandra West, Khar, Santacruz)',
    catchmentAreaSqKm: 11.4,
    sumpSensitivity: 0.72,
    pumpsCount: 9,
    primaryBottleneck: 'Milan & Khar Subways'
  }
];

// Primary Evacuation Arterial Corridors
export const EVACUATION_CORRIDORS = [
  {
    id: 'corridor-1',
    name: 'Dadar TT to Sion Circle (Dr. B.A. Road)',
    lengthKm: 4.2,
    normalTravelMins: 12,
    criticalChokeDepthCm: 35,
    alternativeRoute: 'Eastern Freeway Elevated Corridor',
    elevationProfile: [14, 11, 4, 3, 5, 8, 12] // meters above MSL
  },
  {
    id: 'corridor-2',
    name: 'BKC Connector to CSMI Airport T2',
    lengthKm: 6.8,
    normalTravelMins: 16,
    criticalChokeDepthCm: 45,
    alternativeRoute: 'Santacruz-Chembur Link Road (SCLR Flyover)',
    elevationProfile: [8, 9, 7, 5, 6, 14, 18]
  },
  {
    id: 'corridor-3',
    name: 'Kurla West (LBS Marg) to Chembur Naka',
    lengthKm: 5.5,
    normalTravelMins: 20,
    criticalChokeDepthCm: 30,
    alternativeRoute: 'Eastern Express Highway Bypass',
    elevationProfile: [6, 4, 3, 5, 7, 11, 15]
  },
  {
    id: 'corridor-4',
    name: 'Andheri SV Road to Juhu Tara Road',
    lengthKm: 3.8,
    normalTravelMins: 14,
    criticalChokeDepthCm: 28,
    alternativeRoute: 'Link Road Elevated Metro Corridor Underpass',
    elevationProfile: [5, 4, 2, 3, 6, 8, 7]
  }
];

// Simulated CCTV Hotspots for Historical Replay
export const CCTV_REPLAY_HOTSPOTS = [
  {
    id: 'cctv-hindmata',
    name: 'Hindmata Flyover Junction (CAM-041)',
    location: 'Dadar East, Dr. B.A. Road',
    type: 'PTZ 4K Municipal Telemetry',
    baseWaterMarkCm: 0,
    viewAngle: 'Southbound Carriageway & Sump Sump'
  },
  {
    id: 'cctv-gandhi-mkt',
    name: 'Gandhi Market Sump (CAM-088)',
    location: 'Kings Circle, Matunga',
    type: 'High-Lux Flood Monitor',
    baseWaterMarkCm: 5,
    viewAngle: 'Eastbound Traffic Flume'
  },
  {
    id: 'cctv-milan',
    name: 'Milan Subway West Ingress (CAM-102)',
    location: 'Santacruz West, S.V. Road',
    type: 'Infrared Underpass Sensor Cam',
    baseWaterMarkCm: 10,
    viewAngle: 'Subway Dip & Drop Gate Barrier'
  },
  {
    id: 'cctv-kurla-mithi',
    name: 'Mithi River Bridge Gauge (CAM-019)',
    location: 'Kurla CST Road, Near Kranti Nagar',
    type: 'Hydraulic River Hydrograph Cam',
    baseWaterMarkCm: 15,
    viewAngle: 'River Retaining Wall & Crest Float'
  }
];

