// Admin & Governance Datasets for Municipal Corporation of Greater Mumbai (MCGM)

export const MCGM_WARDS_DIRECTORY = [
  { id: 'A', name: 'Ward A (Colaba, Fort, Nariman Point)', zone: 'Zone I (South)', population: '185,000', areaSqKm: 12.5, drainageDensityKmPerSqKm: 4.8, avgElevationM: 3.2, hotspotCount: 4, officer: 'Er. A. Kadam', phone: '+91 22 2266 1234', status: 'ACTIVE' },
  { id: 'B', name: 'Ward B (Sandhurst Road, Dongri)', zone: 'Zone I (South)', population: '127,000', areaSqKm: 2.8, drainageDensityKmPerSqKm: 5.2, avgElevationM: 2.9, hotspotCount: 3, officer: 'Er. P. Sawant', phone: '+91 22 2373 5678', status: 'ACTIVE' },
  { id: 'C', name: 'Ward C (Marine Lines, Kalbadevi)', zone: 'Zone I (South)', population: '166,000', areaSqKm: 1.9, drainageDensityKmPerSqKm: 6.1, avgElevationM: 3.1, hotspotCount: 2, officer: 'Er. R. Jain', phone: '+91 22 2201 8901', status: 'ACTIVE' },
  { id: 'D', name: 'Ward D (Grant Road, Malabar Hill)', zone: 'Zone I (South)', population: '346,000', areaSqKm: 8.0, drainageDensityKmPerSqKm: 3.9, avgElevationM: 8.5, hotspotCount: 3, officer: 'Er. V. Shinde', phone: '+91 22 2386 2345', status: 'ACTIVE' },
  { id: 'E', name: 'Ward E (Byculla, Mumbai Central)', zone: 'Zone I (South)', population: '440,000', areaSqKm: 7.4, drainageDensityKmPerSqKm: 5.8, avgElevationM: 2.4, hotspotCount: 6, officer: 'Er. N. More', phone: '+91 22 2308 6789', status: 'ACTIVE' },
  { id: 'F/N', name: 'Ward F/North (Matunga, Sion, Wadala)', zone: 'Zone II (Central-South)', population: '529,000', areaSqKm: 13.7, drainageDensityKmPerSqKm: 6.4, avgElevationM: 1.8, hotspotCount: 9, officer: 'Er. S. Deshmukh', phone: '+91 22 2402 3456', status: 'VULNERABLE' },
  { id: 'F/S', name: 'Ward F/South (Parel, Sewri)', zone: 'Zone II (Central-South)', population: '360,000', areaSqKm: 14.0, drainageDensityKmPerSqKm: 4.2, avgElevationM: 3.6, hotspotCount: 4, officer: 'Er. M. Thorat', phone: '+91 22 2413 7890', status: 'ACTIVE' },
  { id: 'G/N', name: 'Ward G/North (Dadar, Dharavi, Mahim)', zone: 'Zone II (Central-South)', population: '599,000', areaSqKm: 9.1, drainageDensityKmPerSqKm: 7.1, avgElevationM: 1.5, hotspotCount: 11, officer: 'Er. K. Kamble', phone: '+91 22 2439 1234', status: 'CRITICAL' },
  { id: 'G/S', name: 'Ward G/South (Worli, Lower Parel)', zone: 'Zone II (Central-South)', population: '377,000', areaSqKm: 10.0, drainageDensityKmPerSqKm: 4.9, avgElevationM: 3.0, hotspotCount: 5, officer: 'Er. D. Jadhav', phone: '+91 22 2430 4567', status: 'ACTIVE' },
  { id: 'H/E', name: 'Ward H/East (Santacruz East, Bandra East)', zone: 'Zone III (Western Suburbs)', population: '557,000', areaSqKm: 13.5, drainageDensityKmPerSqKm: 5.5, avgElevationM: 2.8, hotspotCount: 7, officer: 'Er. T. Naik', phone: '+91 22 2618 8901', status: 'ACTIVE' },
  { id: 'H/W', name: 'Ward H/West (Bandra West, Khar, Santacruz West)', zone: 'Zone III (Western Suburbs)', population: '307,000', areaSqKm: 11.5, drainageDensityKmPerSqKm: 3.8, avgElevationM: 4.2, hotspotCount: 3, officer: 'Er. B. Rane', phone: '+91 22 2642 2345', status: 'ACTIVE' },
  { id: 'K/E', name: 'Ward K/East (Andheri East, Jogeshwari E)', zone: 'Zone III (Western Suburbs)', population: '823,000', areaSqKm: 24.7, drainageDensityKmPerSqKm: 6.2, avgElevationM: 2.1, hotspotCount: 12, officer: 'Er. H. Bhosle', phone: '+91 22 2684 6789', status: 'CRITICAL' },
  { id: 'K/W', name: 'Ward K/West (Andheri West, Versova, Juhu)', zone: 'Zone III (Western Suburbs)', population: '749,000', areaSqKm: 23.4, drainageDensityKmPerSqKm: 4.7, avgElevationM: 2.5, hotspotCount: 8, officer: 'Er. G. Mhatre', phone: '+91 22 2623 3456', status: 'VULNERABLE' },
  { id: 'L', name: 'Ward L (Kurla, Chunabhatti, Sakinaka)', zone: 'Zone V (Eastern Suburbs)', population: '902,000', areaSqKm: 15.8, drainageDensityKmPerSqKm: 7.6, avgElevationM: 1.4, hotspotCount: 14, officer: 'Er. U. Waghmare', phone: '+91 22 2650 7890', status: 'CRITICAL' },
  { id: 'M/E', name: 'Ward M/East (Govandi, Mankhurd, Shivaji Nagar)', zone: 'Zone V (Eastern Suburbs)', population: '807,000', areaSqKm: 32.5, drainageDensityKmPerSqKm: 4.1, avgElevationM: 2.0, hotspotCount: 7, officer: 'Er. S. Gaikwad', phone: '+91 22 2555 1234', status: 'ACTIVE' },
  { id: 'M/W', name: 'Ward M/West (Chembur, Tilak Nagar)', zone: 'Zone V (Eastern Suburbs)', population: '411,000', areaSqKm: 19.5, drainageDensityKmPerSqKm: 4.5, avgElevationM: 3.4, hotspotCount: 5, officer: 'Er. L. Chavan', phone: '+91 22 2522 4567', status: 'ACTIVE' },
  { id: 'N', name: 'Ward N (Ghatkopar, Vikhroli West)', zone: 'Zone VI (North East)', population: '622,000', areaSqKm: 25.9, drainageDensityKmPerSqKm: 5.1, avgElevationM: 3.8, hotspotCount: 6, officer: 'Er. C. Mane', phone: '+91 22 2501 8901', status: 'ACTIVE' },
  { id: 'P/N', name: 'Ward P/North (Malad West, Malad East)', zone: 'Zone IV (North West)', population: '941,000', areaSqKm: 46.7, drainageDensityKmPerSqKm: 4.3, avgElevationM: 3.2, hotspotCount: 7, officer: 'Er. Y. Salve', phone: '+91 22 2882 2345', status: 'ACTIVE' },
  { id: 'P/S', name: 'Ward P/South (Goregaon West, Goregaon East)', zone: 'Zone IV (North West)', population: '463,000', areaSqKm: 24.4, drainageDensityKmPerSqKm: 4.6, avgElevationM: 4.0, hotspotCount: 5, officer: 'Er. F. Shaikh', phone: '+91 22 2872 6789', status: 'ACTIVE' },
  { id: 'R/C', name: 'Ward R/Central (Borivali, Gorai)', zone: 'Zone VII (Far North)', population: '562,000', areaSqKm: 50.0, drainageDensityKmPerSqKm: 3.5, avgElevationM: 5.2, hotspotCount: 4, officer: 'Er. J. Joshi', phone: '+91 22 2894 3456', status: 'ACTIVE' },
  { id: 'R/N', name: 'Ward R/North (Dahisar East, Dahisar West)', zone: 'Zone VII (Far North)', population: '431,000', areaSqKm: 18.0, drainageDensityKmPerSqKm: 5.0, avgElevationM: 2.2, hotspotCount: 6, officer: 'Er. I. Tambe', phone: '+91 22 2893 7890', status: 'VULNERABLE' },
  { id: 'R/S', name: 'Ward R/South (Kandivali East, Kandivali W)', zone: 'Zone VII (Far North)', population: '691,000', areaSqKm: 17.8, drainageDensityKmPerSqKm: 4.4, avgElevationM: 3.9, hotspotCount: 5, officer: 'Er. Q. Khan', phone: '+91 22 2805 1234', status: 'ACTIVE' },
  { id: 'S', name: 'Ward S (Bhandup, Powai, Kanjurmarg)', zone: 'Zone VI (North East)', population: '743,000', areaSqKm: 64.0, drainageDensityKmPerSqKm: 3.7, avgElevationM: 6.8, hotspotCount: 6, officer: 'Er. W. Dsouza', phone: '+91 22 2594 4567', status: 'ACTIVE' },
  { id: 'T', name: 'Ward T (Mulund, Nahur)', zone: 'Zone VI (North East)', population: '341,000', areaSqKm: 45.4, drainageDensityKmPerSqKm: 3.2, avgElevationM: 7.5, hotspotCount: 3, officer: 'Er. Z. Merchant', phone: '+91 22 2564 8901', status: 'ACTIVE' },
];

export const RIVER_BASINS_DATA = [
  { id: 'mithi', name: 'Mithi River Basin', lengthKm: 17.8, catchmentSqKm: 72.9, origin: 'Vihar Lake spillway', outfall: 'Mahim Bay & Creek', currentLevelM: 2.85, dangerLevelM: 3.80, status: 'ELEVATED FLOW', hflObservedM: 4.45, majorWards: ['Ward L', 'Ward K/E', 'Ward G/N', 'Ward H/E'] },
  { id: 'dahisar', name: 'Dahisar River Basin', lengthKm: 12.0, catchmentSqKm: 34.8, origin: 'Tulsi Lake / SGNP', outfall: 'Gorai Creek', currentLevelM: 1.40, dangerLevelM: 2.70, status: 'NORMAL', hflObservedM: 3.20, majorWards: ['Ward R/N', 'Ward R/C'] },
  { id: 'poisar', name: 'Poisar River Basin', lengthKm: 7.0, catchmentSqKm: 20.2, origin: 'Sanjay Gandhi National Park', outfall: 'Marve Creek', currentLevelM: 1.15, dangerLevelM: 2.40, status: 'NORMAL', hflObservedM: 2.90, majorWards: ['Ward R/S', 'Ward P/N'] },
  { id: 'oshiwara', name: 'Oshiwara River Basin', lengthKm: 10.0, catchmentSqKm: 28.5, origin: 'Aarey Milk Colony', outfall: 'Malad Creek', currentLevelM: 1.95, dangerLevelM: 3.10, status: 'MODERATE RUNOFF', hflObservedM: 3.65, majorWards: ['Ward P/S', 'Ward K/W'] },
  { id: 'mahim', name: 'Mahim / Dadar Creek Tidal Basin', lengthKm: 4.5, catchmentSqKm: 18.0, origin: 'Dharavi Tributaries', outfall: 'Arabian Sea (Bandra Bandstand)', currentLevelM: 3.10, dangerLevelM: 4.20, status: 'HIGH TIDE INFLUENCED', hflObservedM: 4.85, majorWards: ['Ward G/N', 'Ward F/N'] },
];

export const INITIAL_PERSONNEL = [
  { id: 'usr-001', name: 'Cmdr. R. Verma', role: 'Super Admin', auth: 'Hardware YubiKey 2FA', email: 'r.verma@mcgm.gov.in', status: 'ACTIVE', clearance: 'LEVEL 5 (FULL)', dept: 'MCGM Emergency Ops HQ', ward: 'Citywide HQ', phone: '+91 98201 22334', lastLogin: '10 mins ago' },
  { id: 'usr-002', name: 'Er. S. Deshmukh', role: 'Drainage Engineer', auth: 'TOTP Authenticator', email: 's.deshmukh@mcgm.gov.in', status: 'ACTIVE', clearance: 'LEVEL 4 (SCADA)', dept: 'Stormwater Drains (SWD)', ward: 'Ward F/N (Sion/Matunga)', phone: '+91 98202 33445', lastLogin: '25 mins ago' },
  { id: 'usr-003', name: 'Insp. K. Patil', role: 'Traffic Control Officer', auth: 'Gov-SSO / Mobile Push', email: 'k.patil@mumbaipolice.gov.in', status: 'ACTIVE', clearance: 'LEVEL 3 (DISPATCH)', dept: 'Mumbai Traffic Police (MTP)', ward: 'Ward K/E (Andheri Subway)', phone: '+91 98203 44556', lastLogin: '1 hour ago' },
  { id: 'usr-004', name: 'Dr. M. Iyer', role: 'Disaster Officer', auth: 'Gov-SSO / 2FA', email: 'm.iyer@dmc.gov.in', status: 'ACTIVE', clearance: 'LEVEL 4 (BROADCAST)', dept: 'Disaster Management Cell', ward: 'Bandra Relief HQ', phone: '+91 98204 55667', lastLogin: '40 mins ago' },
  { id: 'usr-005', name: 'A. Kulkarni', role: 'GIS Analyst', auth: 'PKI Certificate', email: 'a.kulkarni@gis.mcgm.gov.in', status: 'ACTIVE', clearance: 'LEVEL 3 (GEO-DATA)', dept: 'Hydrology & GIS Mapping', ward: 'Central Geo Hub', phone: '+91 98205 66778', lastLogin: '3 hours ago' },
  { id: 'usr-006', name: 'Sub-Insp. V. Shinde', role: 'Field Commander', auth: 'Mobile Gov-OTP', email: 'v.shinde@ndrf.gov.in', status: 'ON-DUTY', clearance: 'LEVEL 3 (FIELD)', dept: 'NDRF 5th Battalion', ward: 'Ward L (Kurla Zone)', phone: '+91 98206 77889', lastLogin: '5 mins ago' },
  { id: 'usr-007', name: 'Tech. P. Sawant', role: 'SCADA Specialist', auth: 'TOTP Authenticator', email: 'p.sawant@mcgm.gov.in', status: 'ACTIVE', clearance: 'LEVEL 3 (PUMPS)', dept: 'Haji Ali Pumping Station', ward: 'Ward G/S', phone: '+91 98207 88990', lastLogin: '15 mins ago' },
  { id: 'usr-008', name: 'J. Mhatre', role: 'Citizen Desk Operator', auth: 'Gov-SSO', email: 'j.mhatre@mcgm.gov.in', status: 'ACTIVE', clearance: 'LEVEL 2 (CITIZEN)', dept: '1916 Emergency Helpline', ward: 'Citizen Ops', phone: '+91 98208 99001', lastLogin: '2 hours ago' },
];

export const INITIAL_ROLES_MATRIX = [
  { id: 'super_admin', role: 'Super Admin', map: true, sim: true, dispatch: true, alerts: true, models: true, sirens: true, ddl: true, audit: true, userCount: 1, desc: 'Unrestricted municipal command and system root control' },
  { id: 'disaster_officer', role: 'Disaster Officer', map: true, sim: true, dispatch: true, alerts: true, models: false, sirens: true, ddl: false, audit: true, userCount: 3, desc: 'Emergency broadcast, shelter control, and rescue coordination' },
  { id: 'drainage_engineer', role: 'Drainage Engineer', map: true, sim: true, dispatch: true, alerts: false, models: true, sirens: false, ddl: false, audit: true, userCount: 4, desc: 'Pumping stations, sluice gates SCADA, and SWMM hydraulics' },
  { id: 'traffic_control', role: 'Traffic Control', map: true, sim: false, dispatch: true, alerts: false, models: false, sirens: false, ddl: false, audit: false, userCount: 6, desc: 'VMS display signboards, subway closures, and safe mobility routing' },
  { id: 'gis_analyst', role: 'GIS Analyst', map: true, sim: true, dispatch: false, alerts: false, models: true, sirens: false, ddl: true, audit: false, userCount: 2, desc: 'GeoPackage layers, DEM contour calibration, and hydrograph curves' },
  { id: 'field_commander', role: 'Field Commander', map: true, sim: false, dispatch: true, alerts: false, models: false, sirens: false, ddl: false, audit: false, userCount: 8, desc: 'On-ground boat deployment, mobile pump operation, and SOS rescue triage' },
];

export const INITIAL_AUDIT_LEDGER = [
  { id: 'AUD-9014', time: '18:31:05 IST', actor: 'Cmdr. R. Verma (10.14.2.1)', action: 'Alert Broadcast Approved (#AL-0841: Andheri/Kurla/Sion Flash Flood)', ward: 'Ward K/E & Ward L', type: 'ALERT_BROADCAST', hash: '8f92a1c0d481b7e290f61284a56b4f738c82d491a92e34fa618037cb90ef512b', status: 'SUCCESS' },
  { id: 'AUD-9013', time: '18:28:40 IST', actor: 'Er. S. Deshmukh (10.14.5.88)', action: 'Pump Station P-08 Remote Start Command (Emergency Overdrive 115%)', ward: 'Ward L (Kurla)', type: 'PUMP_OVERDRIVE', hash: '5b741e9a223f0c451892de10fa956184c8a1b2d3e4f5061728394a5b6c7d8e9f', status: 'EXECUTED' },
  { id: 'AUD-9012', time: '18:22:15 IST', actor: 'SYSTEM_DAEMON (Internal)', action: 'High Tide Warning Triggered (4.25m MSL Spring Tide Ingress)', ward: 'Mahim Outfall', type: 'TELEMETRY_ALERT', hash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b', status: 'TELEMETRY' },
  { id: 'AUD-9011', time: '18:14:02 IST', actor: 'Insp. K. Patil (10.14.8.12)', action: 'Road Closure Barricade Order Issued (Andheri Subway Ingress)', ward: 'Ward K/E', type: 'ROAD_CLOSURE', hash: '3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f', status: 'DISPATCHED' },
  { id: 'AUD-9010', time: '18:05:22 IST', actor: 'Cmdr. R. Verma (10.14.2.1)', action: 'Municipal Threat Escalated: LEVEL-3 ORANGE to LEVEL-4 RED', ward: 'All 24 Wards', type: 'THREAT_ESCALATION', hash: '99a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8', status: 'SUCCESS' },
  { id: 'AUD-9009', time: '17:52:18 IST', actor: 'A. Kulkarni (10.14.3.45)', action: 'SWMM Digital Elevation Model Synced with 2026 LiDAR Point Cloud', ward: 'Citywide DEM', type: 'GEO_PACKAGE_SYNC', hash: '7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d', status: 'VERIFIED' },
  { id: 'AUD-9008', time: '17:40:00 IST', actor: 'Dr. M. Iyer (10.14.1.20)', action: 'Evacuation Shelter Activated: Dadar BMC High School (Cap: 450)', ward: 'Ward G/N', type: 'SHELTER_OPENED', hash: '4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e', status: 'READY' },
];

export const MULTI_AGENCIES_DATA = [
  { id: 'mtp', name: 'Mumbai Traffic Police (MTP)', lead: 'Jt. CP (Traffic)', protocol: 'REST / Webhook', status: 'HEALTHY', latencyMs: 34, lastSync: '12s ago', endpoints: 14, automatedVMS: true },
  { id: 'ndrf', name: 'NDRF 5th Battalion (Sudumbare/Andheri)', lead: 'Commandant NDRF', protocol: 'mTLS / Secure API', status: 'HEALTHY', latencyMs: 52, lastSync: '4s ago', endpoints: 8, automatedVMS: false },
  { id: 'imd', name: 'IMD Doppler Radar (Colaba & Veravali)', lead: 'Director RMC Mumbai', protocol: 'FTP / GeoTIFF / NetCDF', status: 'HEALTHY', latencyMs: 78, lastSync: '1m ago', endpoints: 4, automatedVMS: false },
  { id: 'dmc', name: 'BMC Disaster Management Control Room', lead: 'Chief Officer DMC', protocol: 'Websocket WSS', status: 'HEALTHY', latencyMs: 18, lastSync: 'Real-time', endpoints: 26, automatedVMS: true },
  { id: 'navy', name: 'Indian Navy Western Command / Coast Guard', lead: 'Naval Officer-in-Charge', protocol: 'Gov-Secure VPN', status: 'STANDBY', latencyMs: 110, lastSync: '5m ago', endpoints: 3, automatedVMS: false },
  { id: 'rail_c', name: 'Central Railway (CR Control CSMT)', lead: 'Sr. Div Operations Mgr', protocol: 'SCADA Link / Modbus', status: 'HEALTHY', latencyMs: 44, lastSync: '22s ago', endpoints: 12, automatedVMS: true },
  { id: 'rail_w', name: 'Western Railway (WR Control Mumbai Central)', lead: 'Sr. Div Operations Mgr', protocol: 'SCADA Link / Modbus', status: 'HEALTHY', latencyMs: 41, lastSync: '18s ago', endpoints: 11, automatedVMS: true },
  { id: 'best', name: 'BEST Undertaking Transit Fleet', lead: 'Chief Transport Mgr', protocol: 'Vehicle GPS Feed (GTFS)', status: 'HEALTHY', latencyMs: 65, lastSync: '8s ago', endpoints: 6, automatedVMS: true },
];

export const TELEMETRY_PIPELINES_DATA = [
  { id: 'pipe-01', protocol: 'MQTT Broker (v5.0 TLS)', endpoint: 'mqtt.flood.mcgm.gov.in:8883', topic: 'mcgm/hydrology/+/waterlevel', pps: 420, dropRate: '0.01%', status: 'CONNECTED', uptime: '99.98%' },
  { id: 'pipe-02', protocol: 'Modbus TCP / Pumping Scada', endpoint: '10.14.100.20:502', topic: 'scada/pumps/registers/all', pps: 180, dropRate: '0.00%', status: 'CONNECTED', uptime: '100.0%' },
  { id: 'pipe-03', protocol: 'LoRaWAN Gateway (865 MHz)', endpoint: 'lora-gw.mcgm.gov.in:1700', topic: 'sensors/rain/gauge/uplink', pps: 64, dropRate: '0.04%', status: 'CONNECTED', uptime: '99.91%' },
  { id: 'pipe-04', protocol: 'CoAP / Piezometers', endpoint: 'coap.mcgm.gov.in:5684', topic: 'groundwater/pore-pressure', pps: 28, dropRate: '0.02%', status: 'CONNECTED', uptime: '99.95%' },
  { id: 'pipe-05', protocol: 'RTSP Video AI Stream', endpoint: 'rtsp.cctv.mumbaipolice.gov.in/live', topic: 'ai/vision/subway/waterdepth', pps: 540, dropRate: '0.08%', status: 'CONNECTED', uptime: '99.85%' },
];

export const SIREN_NETWORK_DATA = [
  { id: 'SRN-01', location: 'Andheri Subway Eastern Ramp', ward: 'Ward K/E', dbLevel: 125, rangeKm: 1.2, powerSource: 'Dual Solar + Grid UPS', status: 'ARMED', lastPing: '1m ago' },
  { id: 'SRN-02', location: 'Milan Subway Western Ingress', ward: 'Ward H/E', dbLevel: 125, rangeKm: 1.2, powerSource: 'Grid UPS', status: 'ARMED', lastPing: '30s ago' },
  { id: 'SRN-03', location: 'Sion Circle Flyover Low Point', ward: 'Ward F/N', dbLevel: 130, rangeKm: 1.5, powerSource: 'Dual Solar + Grid UPS', status: 'ARMED', lastPing: '45s ago' },
  { id: 'SRN-04', location: 'Kurla Kranti Nagar Mithi Bank', ward: 'Ward L', dbLevel: 135, rangeKm: 2.0, powerSource: 'Heavy Diesel UPS', status: 'ARMED', lastPing: '20s ago' },
  { id: 'SRN-05', location: 'Dadar TT Circle / Hindmata', ward: 'Ward G/N', dbLevel: 125, rangeKm: 1.2, powerSource: 'Dual Solar + Grid UPS', status: 'ARMED', lastPing: '1m ago' },
  { id: 'SRN-06', location: 'Mahim Fisherman Colony Creek', ward: 'Ward G/N', dbLevel: 130, rangeKm: 1.8, powerSource: 'Coastal Rugged Solar', status: 'ARMED', lastPing: '2m ago' },
  { id: 'SRN-07', location: 'Dahisar Subway Rly Crossing', ward: 'Ward R/N', dbLevel: 120, rangeKm: 1.0, powerSource: 'Grid UPS', status: 'ARMED', lastPing: '4m ago' },
  { id: 'SRN-08', location: 'Mankhurd T-Junction Low Point', ward: 'Ward M/E', dbLevel: 125, rangeKm: 1.2, powerSource: 'Grid UPS', status: 'ARMED', lastPing: '50s ago' },
];

export const SCADA_RULES_DATA = [
  { id: 'RULE-101', name: 'Mithi River Spillage Prevention Overdrive', condition: 'Water Level > 3.00m MSL AND Tide < 2.80m', action: 'Auto-Open Mahim Sluice Flaps (100%) & Run Pump P-01..P-04', priority: 'CRITICAL (Tier-1)', status: 'ACTIVE', triggeredCount: 14 },
  { id: 'RULE-102', name: 'Andheri Subway Rapid Inundation Lockout', condition: 'Depth > 20cm OR Rain Intensity > 60mm/hr', action: 'Turn VMS to RED BARRICADE & Auto-Close Boom Barriers', priority: 'HIGH (Tier-2)', status: 'ACTIVE', triggeredCount: 6 },
  { id: 'RULE-103', name: 'High-Tide Sea Water Backflow Backpressure Shield', condition: 'Tide Gauge > 4.20m MSL', action: 'Auto-Shut Flap Gates Haji Ali & Love Grove to prevent sea ingress', priority: 'CRITICAL (Tier-1)', status: 'ACTIVE', triggeredCount: 22 },
  { id: 'RULE-104', name: 'Hindmata Deep Storage Tank Auto-Diverter', condition: 'Hindmata Sump Level > 65%', action: 'Start Sump Turbines #1 and #2 discharging to Pramod Mahajan Park Basin', priority: 'MEDIUM (Tier-3)', status: 'ACTIVE', triggeredCount: 31 },
  { id: 'RULE-105', name: 'Sion Railway Culvert De-clogging Rake Trigger', condition: 'Upstream-Downstream Head Delta > 45cm', action: 'Execute 15-minute Automatic Trash Screen Hydraulic Raking Cycle', priority: 'HIGH (Tier-2)', status: 'ACTIVE', triggeredCount: 18 },
];

export const DESILTING_TENDERS_DATA = [
  { id: 'TND-2026-01', contractor: 'M/s Patel Infra Hydro Ltd', scope: 'Major Nullahs - Mithi River Zone I & II', targetTons: 145000, excavatedTons: 138500, percentDone: 95.5, weighbridgeVerified: '100% RFID Slips', penaltyDeduction: '₹0 (On Schedule)', status: 'COMPLIANT' },
  { id: 'TND-2026-02', contractor: 'Apex Geo-Dredgers JV', scope: 'Dahisar & Poisar River Corridors', targetTons: 82000, excavatedTons: 77200, percentDone: 94.1, weighbridgeVerified: '98% RFID Slips', penaltyDeduction: '₹0 (On Schedule)', status: 'COMPLIANT' },
  { id: 'TND-2026-03', contractor: 'Siddhivinayak Coastal Marine', scope: 'Oshiwara River & Malad Creek Dredging', targetTons: 64000, excavatedTons: 58800, percentDone: 91.8, weighbridgeVerified: '96% RFID Slips', penaltyDeduction: '₹4.5 Lakh (Minor Delay)', status: 'FLAGGED' },
  { id: 'TND-2026-04', contractor: 'Kalyan Urban Desilting Corp', scope: 'Minor Nullahs & Roadside V-Drains (City Zone)', targetTons: 95000, excavatedTons: 92400, percentDone: 97.2, weighbridgeVerified: '100% RFID Slips', penaltyDeduction: '₹0 (On Schedule)', status: 'COMPLIANT' },
  { id: 'TND-2026-05', contractor: 'Shree Sai Earthmovers', scope: 'Eastern Suburbs Railway Culverts (Kurla-Bhandup)', targetTons: 48000, excavatedTons: 46100, percentDone: 96.0, weighbridgeVerified: '99% RFID Slips', penaltyDeduction: '₹0 (On Schedule)', status: 'COMPLIANT' },
];

export const API_KEYS_DATA = [
  { id: 'KEY-0891', name: 'MTP Traffic Operations CAD', service: 'Mumbai Traffic Police Integration', scopes: ['read:floods', 'read:hotspots', 'write:barricades'], rateLimit: '3,000 req/min', ipWhitelist: '10.14.8.0/24', created: '2026-01-10', expires: '2026-12-31', status: 'ACTIVE' },
  { id: 'KEY-0892', name: 'BEST Bus Automatic Dispatch', service: 'BEST Smart Fleet Management', scopes: ['read:floods', 'read:safe_routes'], rateLimit: '1,500 req/min', ipWhitelist: '10.14.12.0/24', created: '2026-02-15', expires: '2026-12-31', status: 'ACTIVE' },
  { id: 'KEY-0893', name: 'JalDrishti Citizen Mobile App Gateway', service: 'Public API Proxy CloudFlare', scopes: ['read:live_map', 'read:advisories', 'write:reports'], rateLimit: '25,000 req/min', ipWhitelist: 'CloudFlare Edge CIDR', created: '2026-03-01', expires: '2027-03-01', status: 'ACTIVE' },
  { id: 'KEY-0894', name: 'National Disaster Management Authority (NDMA)', service: 'NDMA National Dashboard Sync', scopes: ['read:all', 'read:audit_ledger'], rateLimit: '600 req/min', ipWhitelist: '164.100.0.0/16 (NIC)', created: '2026-04-12', expires: '2027-04-12', status: 'ACTIVE' },
];

export const PRE_MONSOON_COMPLIANCE_ITEMS = [
  { id: 'CMP-01', title: 'High Court Mandated 100% Nullah Desilting Certification', authority: 'Bombay High Court Monitored Committee', progress: 95.8, status: 'VERIFIED', dueDate: '31st May 2026', officer: 'Chief Engr (SWD)' },
  { id: 'CMP-02', title: 'Railway Underpass & Track Pumping Stations Testing', authority: 'Joint CR-WR-MCGM Flood Coordination', progress: 100, status: 'COMPLETED', dueDate: '25th May 2026', officer: 'Jt. Committee' },
  { id: 'CMP-03', title: 'Hospital & Emergency Facility Sub-Station Plinth Verification', authority: 'MSEDCL / Adani Electricity / BMC Health', progress: 98.4, status: 'VERIFIED', dueDate: '1st June 2026', officer: 'Chief Elect Engr' },
  { id: 'CMP-04', title: 'Mobile Dewatering Pumps Dry Run & Wet Run Certification', authority: 'Mechanical & Electrical Dept (MCGM)', progress: 100, status: 'COMPLETED', dueDate: '20th May 2026', officer: 'Dy. Chief Engr (M&E)' },
  { id: 'CMP-05', title: 'Acoustic Outdoor Siren & Public Address System Test', authority: 'Disaster Management Cell', progress: 96.2, status: 'VERIFIED', dueDate: '28th May 2026', officer: 'Director DMC' },
  { id: 'CMP-06', title: 'Emergency Food, Water & Medical Buffer Stocks in Relief Camps', authority: 'Public Health & Social Welfare Dept', progress: 94.0, status: 'VERIFIED', dueDate: '5th June 2026', officer: 'Medical Officer Health' },
];

