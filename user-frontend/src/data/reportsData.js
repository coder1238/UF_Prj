// Mock and persistent data store for citizen reports
export const INITIAL_REPORTS = [
  {
    id: 'FLD-2048',
    title: 'Waterlogging & Impassable Underpass',
    category: 'Subway Trap',
    severity: 'critical',
    location: 'SV Road, Under Milan Subway, Santacruz',
    ward: 'Ward K-West',
    timestamp: 'Today, 20:15 IST (32 mins ago)',
    submittedAt: 'Today, 20:15 IST (32 mins ago)',
    isoTimestamp: new Date(Date.now() - 32 * 60000).toISOString(),
    coordinates: { lat: 19.0825, lng: 72.8415 },
    verified: true,
    verificationSource: 'Municipal CCTV Camera #K-114 Level Gauge',
    status: 'in_progress', // 'submitted' | 'verified' | 'assigned' | 'in_progress' | 'resolved'
    statusColor: 'amber',
    depth: 34,
    initialDepth: 38,
    estimatedDepth: 34,
    aiConfidence: 94,
    sensorMatchScore: 96,
    sensorId: 'CCTV-K114 & Acoustic-SN7',
    sensorDepth: 33.5,
    rainfallRate: '46 mm/hr (Heavy Downpour)',
    upvotes: 28,
    userUpvoted: false,
    affectedCommutersDiverted: 1420,
    busesRerouted: 6,
    trafficDelaySavedMin: 35,
    photoUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&auto=format&fit=crop&q=60',
    beforePhotoUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=60',
    afterPhotoUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=60',
    exifMetadata: {
      device: 'Sony IMX766 Citizen App Cam (f/1.8)',
      gpsPrecision: '±2.1m precision',
      capturedAt: '20:14:49 IST',
      opticalDepthTag: 'Target water line measured at curb marker'
    },
    assignedOfficer: 'Ward Officer V. Desai (MCGM Stormwater Cell)',
    officerRole: 'Executive Engineer - Stormwater Drain Management',
    officerPhone: '+91 22 2628 5381 (Desk Ref: MCGM-SW-48)',
    officerBadge: 'EE-8491-KW',
    unitAssigned: {
      id: 'DMU-04F',
      name: 'High-Capacity Dewatering Pump Unit #7',
      vehicleReg: 'MH-02-EE-4102',
      crewChief: 'Sub-Inspector M. Kadam',
      crewPhone: '+91 98201 44520',
      crewSize: 5,
      pumpType: 'Twin 2400 LPM Cummins Submersible Diesel Dewatering Pump',
      pumpRpm: 1850,
      dischargeRateLpm: 2400,
      fuelPct: 84,
      drainOutfall: 'Hindmata Box Culvert Outfall (Sea Gate #3)',
      etaMinutes: 4,
      status: 'Active Pumping - 62% Volume Evacuated'
    },
    witnesses: [
      { name: 'Aarav Mehta', tier: 'Level 4 Citizen Scout', time: '20:18 IST', note: 'Water reached tire hubcaps. Traffic police placed barricades.' },
      { name: 'Ravi Salve (BEST Driver #412)', tier: 'Municipal Commuter Scout', time: '20:20 IST', note: 'Bus 201 diverted via Linking Rd flyover.' },
      { name: 'Neha Singhania', tier: 'Resident Observer', time: '20:30 IST', note: 'Dewatering pump actively discharging into stormwater culvert.' }
    ],
    comments: [
      { id: 101, author: 'Citizen Reporter (You)', role: 'Reporter', time: '20:16 IST', text: 'Water level increasing quickly. Hatchbacks turning back around Milan Subway entry.' },
      { id: 102, author: 'MCGM Stormwater Bot', role: 'System', time: '20:24 IST', text: 'Telemetry verified via Sensor CCTV-K114 (34cm level). Incident routed to Ward K-West emergency crew.' },
      { id: 103, author: 'Er. V. Desai', role: 'Ward Officer', time: '20:33 IST', text: 'Unit #7 vehicle MH-02-EE-4102 on site. Pumping started with twin hoses. Target clearance within 45 mins.' }
    ],
    smsSubscribed: true,
    notificationPhone: '+91 98765 43210',
    escalated: false,
    resolutionCertificate: {
      certId: 'MCGM-CERT-2048-RES',
      issuedBy: 'Office of the Executive Engineer (Stormwater Cell), Ward K-West',
      signatory: 'Er. V. Desai, M.E. (Civil)',
      digitalSealHash: '0x8f4c399b1a0304e2',
      targetCompletion: 'Target 21:30 IST',
      closureWaterDepth: 'Target < 8 cm (Normal transit)',
      drainStatus: 'Silt screens cleaned & 48,000 Litres stormwater discharged'
    },
    steps: [
      { name: 'Submitted', time: '20:15 IST', desc: 'Logged via Citizen App with verified GPS EXIF', status: 'COMPLETED' },
      { name: 'Verification', time: '20:18 IST', desc: 'Corroborated with CCTV #K-114 gauge & hydro model (96% match)', status: 'COMPLETED' },
      { name: 'Assigned', time: '20:24 IST', desc: 'Assigned to Ward K-West Rapid Dewatering Emergency Division', status: 'COMPLETED' },
      { name: 'Response Active', time: '20:32 IST', desc: 'Dewatering Unit #7 on site running twin 2,400 LPM pumps', status: 'ACTIVE' },
      { name: 'Resolved / Clearance', time: 'Est. 21:30 IST', desc: 'Water depth clearance target beneath 8 cm; traffic restoration', status: 'PENDING' }
    ]
  },
  {
    id: 'FLD-1982',
    title: 'Open / Dislodged Stormwater Manhole',
    category: 'Open Manhole',
    severity: 'critical',
    location: 'Junction of 14th Road & Khar Danda Rd, Bandra',
    ward: 'Ward H-West',
    timestamp: 'Yesterday, 17:40 IST',
    submittedAt: 'Yesterday, 17:40 IST',
    isoTimestamp: new Date(Date.now() - 28 * 3600000).toISOString(),
    coordinates: { lat: 19.0710, lng: 72.8360 },
    verified: true,
    verificationSource: '3 Citizen Observers & BMC Field Crew Inspection',
    status: 'resolved',
    statusColor: 'green',
    depth: 45,
    initialDepth: 45,
    estimatedDepth: 45,
    aiConfidence: 98,
    sensorMatchScore: 92,
    sensorId: 'SENSOR-H-WEST-09',
    sensorDepth: 44.0,
    rainfallRate: '38 mm/hr (Moderate Runoff)',
    upvotes: 42,
    userUpvoted: true,
    affectedCommutersDiverted: 860,
    busesRerouted: 2,
    trafficDelaySavedMin: 50,
    photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=800&auto=format&fit=crop&q=60',
    beforePhotoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=800&auto=format&fit=crop&q=60',
    afterPhotoUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=60',
    exifMetadata: {
      device: 'Samsung Galaxy Citizen Cam',
      gpsPrecision: '±1.8m accuracy',
      capturedAt: '17:39:12 IST',
      opticalDepthTag: 'Manhole rim displacement > 15 cm detected'
    },
    assignedOfficer: 'Field Supervisor S. Patil (Ward H-West Roads)',
    officerRole: 'Senior Maintenance Engineer - Roads & Surface Drainage',
    officerPhone: '+91 22 2642 2311 (Ext: 204)',
    officerBadge: 'HW-ROADS-552',
    unitAssigned: {
      id: 'BMC-RRD-12',
      name: 'Rapid Asphalt & Manhole Replacement Truck',
      vehicleReg: 'MH-01-DK-9014',
      crewChief: 'Supervisor S. Patil',
      crewPhone: '+91 98192 11094',
      crewSize: 4,
      pumpType: 'Heavy ductile iron cover replacement & pneumatic anchor rig',
      pumpRpm: 0,
      dischargeRateLpm: 0,
      fuelPct: 92,
      drainOutfall: 'Khar Danda Storm Sluice',
      etaMinutes: 0,
      status: 'Mission Complete - Reinforced Composite Grate Installed'
    },
    witnesses: [
      { name: 'Pooja Iyer', tier: 'Level 5 Senior Scout', time: '17:44 IST', note: 'Dangerous vortex around open lid. Immediately warned pedestrians.' },
      { name: 'Kunal Sen', tier: 'Local Resident', time: '17:50 IST', note: 'BMC barricades placed within 10 minutes.' }
    ],
    comments: [
      { id: 201, author: 'Citizen Reporter (You)', role: 'Reporter', time: '17:41 IST', text: 'Dislodged cast iron manhole cover. High suction hazard for two-wheelers.' },
      { id: 202, author: 'Supervisor S. Patil', role: 'Ward Officer', time: '18:18 IST', text: 'Replaced with bolted ductile iron frame and reflective warning cone barrier.' },
      { id: 203, author: 'Pooja Iyer', role: 'Senior Scout', time: '19:30 IST', text: 'Confirmed completely secure and road reopened smoothly.' }
    ],
    smsSubscribed: true,
    notificationPhone: '+91 98765 43210',
    escalated: false,
    resolutionCertificate: {
      certId: 'MCGM-CERT-1982-RES',
      issuedBy: 'Office of the Assistant Commissioner, Ward H-West',
      signatory: 'Er. S. Patil, B.E. (Civil)',
      digitalSealHash: '0x99a2fe14cd9021e1',
      targetCompletion: 'Completed at 19:25 IST',
      closureWaterDepth: '0 cm (Road surface dry & safe)',
      drainStatus: 'Heavy-duty composite manhole cover securely locked and asphalt sealed'
    },
    steps: [
      { name: 'Submitted', time: '17:40 IST', desc: 'Reported with warning photo & GPS pin', status: 'COMPLETED' },
      { name: 'Verification', time: '17:45 IST', desc: 'Corroborated by 3 citizen scouts and Ward dashboard', status: 'COMPLETED' },
      { name: 'Assigned', time: '17:52 IST', desc: 'Assigned to Ward H-West Emergency Road Repair Unit', status: 'COMPLETED' },
      { name: 'Response', time: '18:15 IST', desc: 'Repair crew arrived with replacement composite manhole lid', status: 'COMPLETED' },
      { name: 'Resolved', time: '19:25 IST', desc: 'Manhole secured, frame bolted, and perimeter marked with reflective paint', status: 'COMPLETED' }
    ]
  },
  {
    id: 'FLD-1845',
    title: 'Submerged Electrical Junction Box',
    category: 'Electrical Hazard',
    severity: 'critical',
    location: 'Near Bandra Talao slow carriageway, Bandra West',
    ward: 'Ward H-West',
    timestamp: 'Sep 20, 14:10 IST',
    submittedAt: 'Sep 20, 14:10 IST',
    isoTimestamp: new Date(Date.now() - 68 * 3600000).toISOString(),
    coordinates: { lat: 19.0550, lng: 72.8380 },
    verified: true,
    verificationSource: 'BEST Emergency Response Unit & Acoustic Ground Sensor',
    status: 'resolved',
    statusColor: 'green',
    depth: 22,
    initialDepth: 25,
    estimatedDepth: 22,
    aiConfidence: 96,
    sensorMatchScore: 98,
    sensorId: 'BEST-TELEMETRY-BT4',
    sensorDepth: 21.8,
    rainfallRate: '52 mm/hr (Intense Squall)',
    upvotes: 36,
    userUpvoted: true,
    affectedCommutersDiverted: 2310,
    busesRerouted: 8,
    trafficDelaySavedMin: 45,
    photoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=60',
    beforePhotoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=60',
    afterPhotoUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=60',
    exifMetadata: {
      device: 'Citizen Safety App (Exif Verified)',
      gpsPrecision: '±2.0m precision',
      capturedAt: '14:09:41 IST',
      opticalDepthTag: 'Arc flash signature flagged by Computer Vision model'
    },
    assignedOfficer: 'Er. R. Shinde (BEST Electrical Rapid Response Division)',
    officerRole: 'Senior Distribution Grid Safety Engineer',
    officerPhone: '+91 22 2285 6261 (Control Room)',
    officerBadge: 'BEST-GRID-992',
    unitAssigned: {
      id: 'BEST-ERR-09',
      name: 'High-Voltage Insulation & Isolation Van',
      vehicleReg: 'MH-01-EE-3341',
      crewChief: 'Senior Engineer R. Shinde',
      crewPhone: '+91 98210 55431',
      crewSize: 3,
      pumpType: 'Hydrophobic resin sealing and elevated feeder pedestal rig',
      pumpRpm: 0,
      dischargeRateLpm: 0,
      fuelPct: 88,
      drainOutfall: 'Bandra Talao Overflow Siphon',
      etaMinutes: 0,
      status: 'Mission Complete - Remote Circuit Tripped & Waterproof Enclosure Installed'
    },
    witnesses: [
      { name: 'Dr. Tariq Khan', tier: 'Level 3 Scout', time: '14:12 IST', note: 'Noticed minor sparks near junction base. Warned shopkeepers.' }
    ],
    comments: [
      { id: 301, author: 'Citizen Reporter (You)', role: 'Reporter', time: '14:10 IST', text: 'Live sparking hazard reported in rising water. High electrocution risk!' },
      { id: 302, author: 'BEST Dispatch Central', role: 'System', time: '14:15 IST', text: 'Substation breaker tripped remotely for Bandra Talao feeder sector 4.' },
      { id: 303, author: 'Er. R. Shinde', role: 'BEST Engineer', time: '15:20 IST', text: 'Terminal pillar elevated by 60cm with IP68 waterproof shroud. Re-energized and certified safe.' }
    ],
    smsSubscribed: true,
    notificationPhone: '+91 98765 43210',
    escalated: true,
    resolutionCertificate: {
      certId: 'MCGM-BEST-1845-RES',
      issuedBy: 'BEST Undertaking & MCGM Disaster Cell Joint Protocol',
      signatory: 'Er. R. Shinde, M.Tech (Electrical)',
      digitalSealHash: '0x33b81109a1ff0042',
      targetCompletion: 'Completed at 15:20 IST',
      closureWaterDepth: 'Water receded to 0 cm',
      drainStatus: 'Circuit insulated, zero ground fault leakage verified'
    },
    steps: [
      { name: 'Submitted', time: '14:10 IST', desc: 'Live sparking hazard reported in rising water', status: 'COMPLETED' },
      { name: 'Verification', time: '14:13 IST', desc: 'Urgent priority classification; GNN electrocution risk triggered', status: 'COMPLETED' },
      { name: 'Assigned', time: '14:15 IST', desc: 'Substation breaker tripped remotely by BEST Grid SCADA', status: 'COMPLETED' },
      { name: 'Response', time: '14:35 IST', desc: 'Engineers waterproofed and elevated terminal pillar by 60 cm', status: 'COMPLETED' },
      { name: 'Resolved', time: '15:20 IST', desc: 'Circuit insulated, tested with megger, and verified 100% safe', status: 'COMPLETED' }
    ]
  },
  {
    id: 'FLD-2104',
    title: 'Nullah Overflow & Silt Ingress',
    category: 'Nullah Breach',
    severity: 'high',
    location: 'Near Kurla CST Road Bridge, Ward L',
    ward: 'Ward L',
    timestamp: 'Today, 21:05 IST (10 mins ago)',
    submittedAt: 'Today, 21:05 IST (10 mins ago)',
    isoTimestamp: new Date(Date.now() - 10 * 60000).toISOString(),
    coordinates: { lat: 19.0682, lng: 72.8791 },
    verified: true,
    verificationSource: 'Acoustic Water Depth Sensor SENSOR-KL-22',
    status: 'assigned',
    statusColor: 'amber',
    depth: 42,
    initialDepth: 42,
    estimatedDepth: 42,
    aiConfidence: 91,
    sensorMatchScore: 95,
    sensorId: 'SENSOR-KL-22',
    sensorDepth: 41.6,
    rainfallRate: '58 mm/hr (Severe Cloudburst)',
    upvotes: 14,
    userUpvoted: false,
    affectedCommutersDiverted: 1100,
    busesRerouted: 4,
    trafficDelaySavedMin: 40,
    photoUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=60',
    beforePhotoUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=60',
    afterPhotoUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=60',
    exifMetadata: {
      device: 'Citizen iPhone 14 Pro Cam',
      gpsPrecision: '±2.8m precision',
      capturedAt: '21:04:15 IST',
      opticalDepthTag: 'Mithi river tributary backflow detected'
    },
    assignedOfficer: 'Assistant Engineer N. Parab (Ward L Drainage Cell)',
    officerRole: 'Ward Drainage & Desilting Superintendent',
    officerPhone: '+91 22 2650 1481 (Control Desk)',
    officerBadge: 'L-DRAIN-771',
    unitAssigned: {
      id: 'DMU-08A',
      name: 'Mobile Amphibious Desilting & Trash Skimmer',
      vehicleReg: 'MH-03-CB-6612',
      crewChief: 'Operator K. Jadhav',
      crewPhone: '+91 98334 99182',
      crewSize: 4,
      pumpType: 'High-lift trash evacuation and hydraulic silt grabber',
      pumpRpm: 1600,
      dischargeRateLpm: 3200,
      fuelPct: 76,
      drainOutfall: 'Mithi River Estuary Tidal Gate',
      etaMinutes: 11,
      status: 'En Route to Site - Police Escort Provided'
    },
    witnesses: [
      { name: 'Kavita Salvi', tier: 'Level 2 Scout', time: '21:08 IST', note: 'Trash screen choked with plastic debris. Water spilling on road.' }
    ],
    comments: [
      { id: 401, author: 'Citizen Reporter (You)', role: 'Reporter', time: '21:05 IST', text: 'Nullah overflowing onto CST Road. Current is swift.' },
      { id: 402, author: 'Ward L Drainage Bot', role: 'System', time: '21:08 IST', text: 'Desilting skimmer MH-03-CB-6612 dispatched from Kurla bus depot yard.' }
    ],
    smsSubscribed: true,
    notificationPhone: '+91 98765 43210',
    escalated: false,
    resolutionCertificate: {
      certId: 'MCGM-CERT-2104-PEND',
      issuedBy: 'Ward L Disaster Management Operations',
      signatory: 'Er. N. Parab, B.E.',
      digitalSealHash: '0x44fa7701e882a991',
      targetCompletion: 'Target 22:15 IST',
      closureWaterDepth: 'Current depth 42 cm',
      drainStatus: 'Desilting skimmer en route'
    },
    steps: [
      { name: 'Submitted', time: '21:05 IST', desc: 'Logged with high severity tag via citizen app', status: 'COMPLETED' },
      { name: 'Verification', time: '21:07 IST', desc: 'Sensor SENSOR-KL-22 matched 41.6cm reading', status: 'COMPLETED' },
      { name: 'Assigned', time: '21:09 IST', desc: 'Unit DMU-08A mobilized with hydraulic trash skimmer', status: 'ACTIVE' },
      { name: 'Response Pumping', time: 'ETA 21:20 IST', desc: 'Clearance of culvert screens and 3200 LPM discharge', status: 'PENDING' },
      { name: 'Resolved', time: 'Target 22:15 IST', desc: 'Safe water recession and road lane reopening', status: 'PENDING' }
    ]
  },
  {
    id: 'FLD-2115',
    title: 'Waterlogging Outside Metro Rail Station Entry',
    category: 'Waterlogging',
    severity: 'moderate',
    location: 'Andheri Kurla Road, Near Chakala Metro Gate 2',
    ward: 'Ward K-East',
    timestamp: 'Today, 21:18 IST (2 mins ago)',
    submittedAt: 'Today, 21:18 IST (2 mins ago)',
    isoTimestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    coordinates: { lat: 19.1115, lng: 72.8620 },
    verified: true,
    verificationSource: 'Civic CCTV Node #CH-04 & Pedestrian Sensor',
    status: 'submitted',
    statusColor: 'purple',
    depth: 18,
    initialDepth: 18,
    estimatedDepth: 18,
    aiConfidence: 89,
    sensorMatchScore: 94,
    sensorId: 'CCTV-CH-04',
    sensorDepth: 17.5,
    rainfallRate: '34 mm/hr (Moderate Rainfall)',
    upvotes: 7,
    userUpvoted: false,
    affectedCommutersDiverted: 540,
    busesRerouted: 1,
    trafficDelaySavedMin: 15,
    photoUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&auto=format&fit=crop&q=60',
    beforePhotoUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&auto=format&fit=crop&q=60',
    afterPhotoUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=60',
    exifMetadata: {
      device: 'Citizen App Android',
      gpsPrecision: '±3.1m accuracy',
      capturedAt: '21:17:30 IST',
      opticalDepthTag: 'Ponding across pedestrian tactile paving'
    },
    assignedOfficer: 'Supervisor M. Shaikh (Ward K-East Maintenance)',
    officerRole: 'Ward Roadway Inspector',
    officerPhone: '+91 22 2684 0103',
    officerBadge: 'KE-INSP-302',
    unitAssigned: {
      id: 'DMU-02B',
      name: 'Rapid Response Silt Clearer & Sucker Machine',
      vehicleReg: 'MH-02-AB-1109',
      crewChief: 'Supervisor M. Shaikh',
      crewPhone: '+91 98112 00412',
      crewSize: 3,
      pumpType: 'Suction tanker 1500 LPM',
      pumpRpm: 1200,
      dischargeRateLpm: 1500,
      fuelPct: 90,
      drainOutfall: 'Chakala Nullah Storm Conduit',
      etaMinutes: 16,
      status: 'Queued for Deployment in Ward Dispatch Center'
    },
    witnesses: [
      { name: 'Deepak Joshi', tier: 'Level 1 Scout', time: '21:19 IST', note: 'Foot passengers getting feet wet trying to reach metro staircase.' }
    ],
    comments: [
      { id: 501, author: 'Citizen Reporter (You)', role: 'Reporter', time: '21:18 IST', text: '18 cm water buildup at Metro Gate 2 entry curb. Pedestrian ramp impassable.' }
    ],
    smsSubscribed: false,
    notificationPhone: '',
    escalated: false,
    resolutionCertificate: {
      certId: 'MCGM-CERT-2115-PEND',
      issuedBy: 'Ward K-East Civic Operations',
      signatory: 'Supervisor M. Shaikh',
      digitalSealHash: '0x12a9bc441209ff01',
      targetCompletion: 'Target 22:30 IST',
      closureWaterDepth: '18 cm',
      drainStatus: 'Initial intake logged'
    },
    steps: [
      { name: 'Submitted', time: '21:18 IST', desc: 'Observation logged with GPS coordinates', status: 'ACTIVE' },
      { name: 'Verification', time: 'Queued', desc: 'Correlating with Metro CCTV cameras', status: 'PENDING' },
      { name: 'Assigned', time: 'Pending', desc: 'Awaiting ward engineer dispatch approval', status: 'PENDING' },
      { name: 'Response', time: 'Pending', desc: 'Suction unit dispatch', status: 'PENDING' },
      { name: 'Resolved', time: 'Pending', desc: 'Clearance verification', status: 'PENDING' }
    ]
  }
];

export const STORAGE_KEY = 'urban_flood_citizen_reports';

// Safe LocalStorage helpers with automatic seeding
export function getStoredReports() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return INITIAL_REPORTS;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REPORTS));
      return INITIAL_REPORTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure existing items have needed fields
      return parsed.map(r => ({
        ...r,
        unitAssigned: r.unitAssigned || INITIAL_REPORTS[0].unitAssigned,
        witnesses: r.witnesses || INITIAL_REPORTS[0].witnesses,
        comments: r.comments || INITIAL_REPORTS[0].comments,
        exifMetadata: r.exifMetadata || INITIAL_REPORTS[0].exifMetadata,
        resolutionCertificate: r.resolutionCertificate || INITIAL_REPORTS[0].resolutionCertificate
      }));
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REPORTS));
    return INITIAL_REPORTS;
  } catch (err) {
    console.warn('Error reading reports from localStorage:', err);
    return INITIAL_REPORTS;
  }
}

export function saveStoredReports(reports) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    // Dispatch custom event for intra-tab updates
    window.dispatchEvent(new CustomEvent('urbanflood_reports_updated', { detail: reports }));
  } catch (err) {
    console.error('Error saving reports to localStorage:', err);
  }
}

export function resetStoredReports() {
  if (typeof window === 'undefined' || !window.localStorage) return INITIAL_REPORTS;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REPORTS));
    window.dispatchEvent(new CustomEvent('urbanflood_reports_updated', { detail: INITIAL_REPORTS }));
    return INITIAL_REPORTS;
  } catch (err) {
    console.error('Error resetting reports in localStorage:', err);
    return INITIAL_REPORTS;
  }
}

export function addReportToStorage(newReportData) {
  const current = getStoredReports();
  const ticketId = newReportData.id || `FLD-${Math.floor(1000 + Math.random() * 9000)}`;
  
  const createdReport = {
    id: ticketId,
    title: newReportData.title || `Citizen Flood Report (${newReportData.location || 'Unknown Road'})`,
    category: newReportData.category || (newReportData.selectedHazards?.includes('manhole') ? 'Open Manhole' : 'Waterlogging'),
    severity: newReportData.depth > 50 ? 'critical' : newReportData.depth > 25 ? 'high' : 'moderate',
    location: newReportData.location || 'Ward F-North Incident Site',
    ward: newReportData.ward || 'Ward F-North',
    timestamp: 'Just now (1 min ago)',
    submittedAt: 'Just now (1 min ago)',
    isoTimestamp: new Date().toISOString(),
    coordinates: newReportData.coordinates || { lat: 19.0270, lng: 72.8550 },
    verified: true,
    verificationSource: 'Acoustic Ultrasonic Gauge & Citizen Multi-Spectral Photo',
    status: 'assigned',
    statusColor: 'amber',
    depth: Number(newReportData.depth) || 25,
    initialDepth: Number(newReportData.depth) || 25,
    estimatedDepth: Number(newReportData.depth) || 25,
    aiConfidence: 93,
    sensorMatchScore: 95,
    sensorId: 'SENSOR-AUTO-DETECT-01',
    sensorDepth: Number(newReportData.depth) || 25,
    rainfallRate: '40 mm/hr (Heavy Rain)',
    upvotes: 1,
    userUpvoted: true,
    affectedCommutersDiverted: 420,
    busesRerouted: 2,
    trafficDelaySavedMin: 20,
    photoUrl: newReportData.photoUrl || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=60',
    beforePhotoUrl: newReportData.photoUrl || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=60',
    afterPhotoUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=60',
    exifMetadata: {
      device: 'Citizen Device (Camera EXIF)',
      gpsPrecision: '±2.5m precision',
      capturedAt: 'Just now',
      opticalDepthTag: `Water level measured ~${newReportData.depth || 25} cm`
    },
    assignedOfficer: 'Ward Emergency Officer (MCGM Rapid Cell)',
    officerRole: 'Disaster Cell Response Superintendent',
    officerPhone: '+91 22 2269 4725 (Emergency Desk)',
    officerBadge: 'MCGM-DM-2026',
    unitAssigned: {
      id: 'DMU-05X',
      name: 'High-Flow Mobile Dewatering Pumping Unit',
      vehicleReg: 'MH-01-CP-8801',
      crewChief: 'Officer R. Koli',
      crewPhone: '+91 98200 12345',
      crewSize: 4,
      pumpType: 'Submersible 2200 LPM Dewatering Rig',
      pumpRpm: 1750,
      dischargeRateLpm: 2200,
      fuelPct: 85,
      drainOutfall: 'Local Stormwater Outfall Siphon',
      etaMinutes: 10,
      status: 'Assigned - En route to site'
    },
    witnesses: [
      { name: 'Self (Reporter)', tier: 'Active Contributor', time: 'Just now', note: 'Primary incident reporter' }
    ],
    comments: [
      { id: Date.now(), author: 'Citizen Reporter (You)', role: 'Reporter', time: 'Just now', text: newReportData.userComment || 'Logged water accumulation and roadway hazard.' }
    ],
    smsSubscribed: true,
    notificationPhone: '+91 98765 43210',
    escalated: false,
    resolutionCertificate: {
      certId: `MCGM-CERT-${ticketId}-PEND`,
      issuedBy: 'MCGM Stormwater Cell & Emergency Control',
      signatory: 'Ward Duty Officer',
      digitalSealHash: '0x' + Math.random().toString(16).substr(2, 16),
      targetCompletion: 'Under active resolution',
      closureWaterDepth: `${newReportData.depth || 25} cm`,
      drainStatus: 'Initial intake logged'
    },
    steps: [
      { name: 'Submitted', time: 'Just now', desc: 'GPS and photo certified via Citizen App', status: 'COMPLETED' },
      { name: 'Verification', time: 'Just now', desc: 'Matched with nearest acoustic gauge & GNN model', status: 'COMPLETED' },
      { name: 'Assigned', time: 'Just now', desc: 'Dispatched to nearest Ward Mobile Dewatering Unit', status: 'ACTIVE' },
      { name: 'Response Pumping', time: 'ETA 10 min', desc: 'Arrival on scene and high-volume extraction', status: 'PENDING' },
      { name: 'Resolved', time: 'Target 60 min', desc: 'Water cleared beneath safety threshold', status: 'PENDING' }
    ]
  };

  const updated = [createdReport, ...current];
  saveStoredReports(updated);
  return createdReport;
}

export const COMMUNITY_OBSERVATIONS = [
  {
    id: 'CMD-4091',
    title: 'Kurla West (L.B.S. Marg Subway)',
    location: 'Kurla West (L.B.S. Marg Subway)',
    type: 'Waterlogging',
    timestamp: '12m ago (20:34 IST)',
    timeAgo: '12m ago (20:34 IST)',
    depth: 32,
    modelDepth: 32,
    scoutDepth: 30,
    sensorDepth: 31.4,
    sensorId: 'CCTV-K09 Automated Level Gauge',
    agreementPct: 98,
    scoutName: 'Aarav Mehta',
    trustTier: 'Level 4 Citizen Scout (24 verified reports)',
    upvotes: 18,
    userConfirmed: false,
    verified: true,
    description: 'Rapid stormwater buildup over 30 cm under rail bridge. Cars turning back.',
    hazards: ['Fast Current', 'Subway Trap'],
    status: 'VERIFIED_MATCH',
    coordinates: { lat: 19.0682, lng: 72.8791 }
  },
  {
    id: 'CMD-4085',
    title: 'Saki Naka Junction Under Metro Station',
    location: 'Saki Naka Junction Under Metro Station',
    type: 'Waterlogging',
    timestamp: '28m ago (20:18 IST)',
    timeAgo: '28m ago (20:18 IST)',
    depth: 16,
    modelDepth: 16,
    scoutDepth: 15,
    sensorDepth: 16.2,
    sensorId: 'SENSOR-SN-41',
    agreementPct: 96,
    scoutName: 'Rohan Deshmukh',
    trustTier: 'Level 2 Scout (8 reports)',
    upvotes: 9,
    userConfirmed: false,
    verified: true,
    description: 'Slow drain runoff accumulation. Two wheelers need caution.',
    hazards: ['Ponding'],
    status: 'VERIFIED_MATCH',
    coordinates: { lat: 19.1020, lng: 72.8870 }
  },
  {
    id: 'CMD-4078',
    title: 'SVT Road / Andheri West Open Cover',
    location: 'SVT Road / Andheri West',
    type: 'Open Manhole',
    timestamp: '42m ago (20:04 IST)',
    timeAgo: '42m ago (20:04 IST)',
    depth: 12,
    modelDepth: 0,
    scoutDepth: 0,
    sensorDepth: 0,
    sensorId: 'BMC Field Scout Pin',
    agreementPct: 100,
    scoutName: 'Pooja Iyer',
    trustTier: 'Level 5 Senior Scout (42 reports)',
    upvotes: 31,
    userConfirmed: true,
    verified: true,
    description: 'Severe suction vortex around dislodged sewer cover. BMC barricades placed.',
    hazards: ['Open Manhole', 'Suction Risk'],
    status: 'CORDONED_VERIFIED',
    coordinates: { lat: 19.1190, lng: 72.8460 }
  }
];

export const myReportsData = INITIAL_REPORTS;
export const communityReports = COMMUNITY_OBSERVATIONS;
