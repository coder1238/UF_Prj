// Comprehensive Data Structures for MCGM Authority Platform System Health & Telemetry

export const SUBSYSTEM_DIAGNOSTICS_DATA = {
  'api-gateway': {
    id: 'api-gateway',
    name: 'Kong API Gateway & Reverse Proxy',
    uptime: '99.89%',
    status: 'HEALTHY',
    version: 'v3.6.1-enterprise',
    p99Latency: '42ms',
    p50Latency: '8ms',
    rps: '1,420 req/s',
    errorRate: '0.004%',
    cpuUsage: 28,
    memUsage: 44,
    activeConnections: 342,
    nodes: ['gw-worker-01 (Worli)', 'gw-worker-02 (Worli)', 'gw-worker-03 (Bandra)'],
    tlsCipher: 'TLS_AES_256_GCM_SHA384 (TLSv1.3)',
    recentLogs: [
      '18:32:40 [INFO] Rate limit checked for client `traffic-police-cad`: 420/5000 req/min',
      '18:32:38 [INFO] Upstream health-check passed for `gis-render-pool-04` (latency: 14ms)',
      '18:32:31 [WARN] Slow upstream handshake detected on legacy SMS provider (210ms)'
    ]
  },
  'spatial-db': {
    id: 'spatial-db',
    name: 'Spatial PostGIS & TimescaleDB Cluster',
    uptime: '99.97%',
    status: 'HEALTHY',
    version: 'PostgreSQL 16.2 / PostGIS 3.4.2 / Timescale 2.14',
    p99Latency: '18ms',
    p50Latency: '3.2ms',
    rps: '890 queries/s',
    errorRate: '0.000%',
    cpuUsage: 52,
    memUsage: 68,
    activeConnections: 42,
    nodes: ['pg-primary-worli', 'pg-replica-worli', 'pg-replica-navimumbai (Hot Standby)'],
    tlsCipher: 'TLS_CHACHA20_POLY1305_SHA256',
    recentLogs: [
      '18:32:41 [INFO] Spatial GiST index scan on `subgrid_inundation_cells` completed (2.4ms)',
      '18:32:20 [INFO] Hypertable chunk compression executed: 1.4M rows archived',
      '18:31:55 [INFO] Auto-vacuum completed on table `telemetry_water_depth_ts`'
    ]
  },
  'gis-engine': {
    id: 'gis-engine',
    name: 'Geospatial Vector Tile & MapLibre Engine',
    uptime: '99.93%',
    status: 'HEALTHY',
    version: 'Tegola 0.15 / Martin MVT Server',
    p99Latency: '18ms',
    p50Latency: '4ms',
    rps: '3,840 tiles/s',
    errorRate: '0.001%',
    cpuUsage: 36,
    memUsage: 58,
    activeConnections: 184,
    nodes: ['tile-renderer-01', 'tile-renderer-02', 'tile-cache-redis-01'],
    tlsCipher: 'TLS_AES_128_GCM_SHA256',
    recentLogs: [
      '18:32:43 [INFO] Cached tile 14/11739/7488 served from Redis L1 cache in 0.8ms',
      '18:32:25 [INFO] Dynamic inundation layer overlay rasterized for Ward F/North in 12ms',
      '18:32:02 [INFO] Spatial bounding box filter applied for 142 drainage outfalls'
    ]
  },
  'gpu-swe': {
    id: 'gpu-swe',
    name: '2D Shallow Water Equations (SWE) CUDA Cluster',
    uptime: '97.80%',
    status: 'DEGRADED',
    version: 'CUDA 12.4 / Hydro-SWE Engine v4.2',
    p99Latency: '420ms',
    p50Latency: '85ms',
    rps: '12 time-steps/s',
    errorRate: '0.012%',
    cpuUsage: 84,
    memUsage: 91,
    activeConnections: 8,
    nodes: ['gpu-rig-alpha (4x H100 80GB)', 'gpu-rig-beta (4x A100 80GB)'],
    tlsCipher: 'NVLink 4.0 / InfiniBand HDR 200G',
    recentLogs: [
      '18:32:44 [WARN] GPU-Rig-Beta GPU-2 VRAM utilization reached 92.4% during 2m mesh simulation',
      '18:32:30 [INFO] Shallow water Riemann solver step +30m converged in 44 iterations',
      '18:31:50 [INFO] Hydrograph boundary conditions injected from Mithi basin AWS stations'
    ]
  },
  'routing-api': {
    id: 'routing-api',
    name: 'Emergency Dispatch & CAD Routing Engine',
    uptime: '99.91%',
    status: 'HEALTHY',
    version: 'Valhalla 3.4 / OSRM Custom Multimodal',
    p99Latency: '38ms',
    p50Latency: '6ms',
    rps: '540 dispatches/s',
    errorRate: '0.002%',
    cpuUsage: 22,
    memUsage: 39,
    activeConnections: 95,
    nodes: ['cad-router-01', 'cad-router-02'],
    tlsCipher: 'TLS_AES_256_GCM_SHA384',
    recentLogs: [
      '18:32:42 [INFO] Emergency Route #ER-904 calculated for KEM Hospital ambulance (avoided Hindmata flooded dip)',
      '18:32:18 [INFO] Dynamic road penalty applied to Dr. Ambedkar Road (+18 min inundation delay)',
      '18:31:40 [INFO] Municipal fire tender vehicle clearance verified for 4.2m underpass'
    ]
  }
};

export const RAW_FEED_PAYLOADS = {
  'Doppler Radar Plume': {
    endpoint: 'wss://radar-telemetry.imd.gov.in/colaba/s-band/stream',
    authType: 'mTLS Client X.509 + MCGM API Key',
    samplePayload: {
      radar_station: 'IMD_COLABA_S_BAND',
      coordinates: [18.8984, 72.8105],
      beam_frequency_ghz: 2.85,
      azimuth_resolution_deg: 0.5,
      elevation_angles: [0.5, 1.5, 2.5, 4.5, 9.0],
      max_range_km: 100,
      timestamp_epoch: 1727029862,
      reflectivity_dbz_grid: {
        grid_dim: [256, 256],
        peak_dbz: 56.4,
        echo_top_km: 12.8,
        qc_filters_applied: ['doppler_dealiasing', 'clutter_filter_gmti']
      }
    }
  },
  'Digital Elevation Model (DEM)': {
    endpoint: 'https://spatial.mcgm.gov.in/geoserver/wms/lidar_dem_5m',
    authType: 'Bearer JWT (Role: Hydro_Admin)',
    samplePayload: {
      dataset: 'Greater_Mumbai_LiDAR_Bare_Earth_2024',
      resolution_meters: 5.0,
      crs: 'EPSG:32643 (UTM Zone 43N)',
      vertical_accuracy_cm: 7.5,
      bounding_box: [18.892, 72.775, 19.271, 73.012],
      total_grid_cells: 17480000,
      last_verified_checksum: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    }
  },
  'Land-Cover & Imperviousness Grid': {
    endpoint: 'https://earth-engine.isro.gov.in/v1/mumbai/impervious_surface',
    authType: 'ISRO GeoPlatform API Key',
    samplePayload: {
      sensor: 'Sentinel-2 Multispectral + Cartosat-3',
      ward_count: 24,
      impervious_mean_pct: 78.4,
      manning_roughness_assigned: true,
      soil_infiltration_model: 'Horton / Green-Ampt',
      last_raster_sync: '2026-09-22T17:00:00Z'
    }
  },
  'Underground Drainage Network Graph': {
    endpoint: 'https://telemetry.mcgm.gov.in/api/v2/swmm/topology/active',
    authType: 'Gov-SSO Mutual PKI Token',
    samplePayload: {
      network_model: 'SWMM_5.2_GREATER_MUMBAI',
      nodes_count: 1428,
      conduits_count: 1682,
      pumping_stations: 6,
      tidal_outfalls: 107,
      surcharged_nodes_detected: 4,
      mean_flow_velocity_mps: 1.82,
      last_hydraulic_step: '18:32:00 IST'
    }
  },
  'Real-Time Road Network & Traffic': {
    endpoint: 'https://traffic.mumbaipolice.gov.in/telematics/live_speeds',
    authType: 'GovNET IP Whitelist + API Secret',
    samplePayload: {
      policing_zones: 5,
      monitored_segments: 2840,
      average_speed_kmh: 18.2,
      flooded_chokepoints_reported: 6,
      signal_coordination_status: 'ADAPTIVE_FLOOD_OVERRIDE_ENABLED',
      ambulance_priority_lanes_active: 3
    }
  },
  'Automated Weather Stations (AWS)': {
    endpoint: 'mqtts://telemetry-iot.mcgm.gov.in:8883/aws/readings',
    authType: 'MQTT TLS v1.3 Client Certs',
    samplePayload: {
      fleet_total: 62,
      fleet_reporting: 62,
      top_intensity_station: 'Santacruz_AWS_04',
      current_rain_rate_mmh: 68.5,
      barometric_pressure_hpa: 998.4,
      wind_gust_kmh: 52.1,
      battery_health_average_pct: 94.2
    }
  },
  'Ultrasonic Water Level Telemetry': {
    endpoint: 'mqtts://telemetry-iot.mcgm.gov.in:8883/hydro/water_depth',
    authType: 'LoRaWAN Gateway Token + MQTT Secret',
    samplePayload: {
      fleet_total: 48,
      fleet_reporting: 46,
      degraded_nodes: [
        { id: 'MITHI_WL_09', location: 'Bandra-Kurla Complex Bridge', issue: 'Weak RSSI (-88 dBm), battery 18%' },
        { id: 'MITHI_WL_14', location: 'Kurla Kranti Nagar Nullah', issue: 'Transient ultrasonic reflection echo' }
      ],
      highest_water_level_m: 3.42,
      danger_threshold_m: 3.80,
      telemetry_sampling_interval: '30s'
    }
  },
  'Historical Inundation Registry': {
    endpoint: 'https://climatology.mcgm.gov.in/archive/floods_2014_2026',
    authType: 'Read-Only Municipal Archive Token',
    samplePayload: {
      dataset_years: '2014-2026',
      monsoon_events_cataloged: 84,
      extreme_events_records: 12,
      matched_analog_year: '2019 July 02 Scenario',
      climatological_correlation: '94.8%'
    }
  }
};

export const INITIAL_QUEUES_DATA = {
  'radar-ingest': {
    id: 'radar-ingest',
    name: 'Doppler Radar Ingest Queue',
    throughput: '12 jobs/s',
    queueDepth: 0,
    status: 'ACTIVE',
    concurrency: 4,
    workersOnline: 4,
    avgJobDuration: '65ms',
    deadLetterQueueCount: 0,
    jobsProcessedToday: 48290,
    recentJobs: [
      { id: 'RAD-9481', status: 'COMPLETED', task: 'Azimuth sweep 1.5° slice interpolation', duration: '62ms' },
      { id: 'RAD-9482', status: 'COMPLETED', task: 'Polar to Cartesian coordinate transform', duration: '58ms' },
      { id: 'RAD-9483', status: 'PROCESSING', task: 'Composite reflectivity mosaic tile generation', duration: '41ms' }
    ]
  },
  'swe-queue': {
    id: 'swe-queue',
    name: '2D SWE GPU Simulation Queue',
    throughput: '1 job / 15s',
    queueDepth: 2,
    status: 'BACKLOGGED',
    concurrency: 2,
    workersOnline: 2,
    avgJobDuration: '14.2s',
    deadLetterQueueCount: 1,
    jobsProcessedToday: 1824,
    recentJobs: [
      { id: 'SWE-201', status: 'RUNNING', task: 'Mithi River Basin 5m SWE forward step (+30m)', duration: '8.4s / 14s' },
      { id: 'SWE-202', status: 'QUEUED', task: 'Milan Subway localized depression flow step (+45m)', duration: 'Waiting' },
      { id: 'SWE-199', status: 'FAILED_DLQ', task: 'Oshiwara basin grid partition out-of-memory error', duration: 'Failed' }
    ]
  },
  'cap-broadcast': {
    id: 'cap-broadcast',
    name: 'CAP Emergency Alert Broadcast Queue',
    throughput: 'Instant (Burst 50k/s)',
    queueDepth: 0,
    status: 'IDLE / READY',
    concurrency: 8,
    workersOnline: 8,
    avgJobDuration: '12ms',
    deadLetterQueueCount: 0,
    jobsProcessedToday: 142,
    recentJobs: [
      { id: 'CAP-789', status: 'COMPLETED', task: 'Telco SMS flash broadcast Ward F/N (142,000 citizens)', duration: '1.2s' },
      { id: 'CAP-790', status: 'COMPLETED', task: 'Digital Variable Message Signs (VMS) update across WEH', duration: '420ms' }
    ]
  }
};

// 20 NEW FEATURES METADATA & DATASETS

export const TWENTY_HEALTH_FEATURES = [
  {
    id: 'cluster-topology',
    title: 'Cluster Node Topology & Hardware Telemetry',
    category: 'Compute & HPC',
    icon: 'Server',
    badge: '5 Nodes Active',
    badgeColor: 'emerald',
    description: 'Inspect Kubernetes control planes, worker nodes, and H100 GPU compute rigs with thermal, NVLink, and pod health.'
  },
  {
    id: 'kafka-pipeline',
    title: 'Kafka & MQTT Streaming Pipeline Inspector',
    category: 'Ingest & Message Bus',
    icon: 'Cpu',
    badge: '4 Topics / 0 Lag',
    badgeColor: 'emerald',
    description: 'Monitor partition consumer lag, telemetry broker message throughput, and dead-letter queue re-submission.'
  },
  {
    id: 'postgis-profiler',
    title: 'PostGIS & TimescaleDB Spatial Query Profiler',
    category: 'Spatial Storage',
    icon: 'Database',
    badge: '18ms p99 Latency',
    badgeColor: 'emerald',
    description: 'Identify slow spatial intersections, monitor active pool connections, and trigger GiST vacuuming.'
  },
  {
    id: 'iot-sensor-fleet',
    title: 'IoT Hydro-Sensor Fleet Diagnostics',
    category: 'Edge Sensors',
    icon: 'Radio',
    badge: '108 / 110 Online',
    badgeColor: 'amber',
    description: 'Battery health, solar charging, 4G/LoRaWAN RSSI telemetry, and remote OTA firmware management for water gauges.'
  },
  {
    id: 'vector-tile-cache',
    title: 'Vector Tile Server & Map Cache Invalidation',
    category: 'GIS Rendering',
    icon: 'Layers',
    badge: '94.2% Hit Ratio',
    badgeColor: 'emerald',
    description: 'Manage Tegola/Martin MVT tile caches, inspect pre-render queues, and execute bounding-box invalidation.'
  },
  {
    id: 'swe-cuda-profiler',
    title: '2D SWE GPU Simulation Engine Profiler',
    category: 'Simulation HPC',
    icon: 'Zap',
    badge: 'CFL: 0.68 (Stable)',
    badgeColor: 'emerald',
    description: 'CUDA kernel compute profiling, numerical stability monitoring, and grid resolution mesh switching.'
  },
  {
    id: 'failover-dr-console',
    title: 'Automated Failover & Disaster Recovery Console',
    category: 'High Availability',
    icon: 'ShieldCheck',
    badge: 'RTO 14s / RPO 1.2s',
    badgeColor: 'emerald',
    description: 'Simulate BMC Worli primary datacenter failover to Navi Mumbai hot-standby secondary disaster recovery site.'
  },
  {
    id: 'network-latency-matrix',
    title: 'Inter-Agency WAN Latency & Geo-DNS Matrix',
    category: 'Networking',
    icon: 'Network',
    badge: 'All Links < 15ms',
    badgeColor: 'emerald',
    description: 'Live latency matrix between BMC EOC, IMD Colaba, Traffic Police HQ, Mantralaya, and Cloud Datacenter.'
  },
  {
    id: 'sensor-drift-detector',
    title: 'Sensor Telemetry Data Drift & ML Anomaly Detector',
    category: 'Data Quality & AI',
    icon: 'AlertCircle',
    badge: '2 Anomalies Flagged',
    badgeColor: 'amber',
    description: 'Statistical anomaly detection detecting stuck water sensors, acoustic echoes, and calibration offsets.'
  },
  {
    id: 'cap-broadcast-gateway',
    title: 'CAP Emergency Broadcast & Coastal Siren Health',
    category: 'Emergency Dispatch',
    icon: 'BellRing',
    badge: '14/14 Sirens Ready',
    badgeColor: 'emerald',
    description: 'Monitor cellular emergency broadcast aggregators and coastal high-decibel acoustic siren IP controllers.'
  },
  {
    id: 'radar-qc-inspector',
    title: 'Doppler Radar S-Band Raw Ingest & Beam QC',
    category: 'Meteorological Ingest',
    icon: 'Radar',
    badge: 'SNR 42 dB (Optimal)',
    badgeColor: 'emerald',
    description: 'Inspect raw Doppler reflectivity Z-factors, beam blockage angles, and dual-polarization correlation filters.'
  },
  {
    id: 'ssl-pki-tracker',
    title: 'SSL/TLS Certificates & Gov-Cloud PKI Tracker',
    category: 'Cybersecurity',
    icon: 'Lock',
    badge: 'Grade A+ / 82d Left',
    badgeColor: 'emerald',
    description: 'Mutual TLS certificate lifecycle monitor for municipal APIs, edge IoT gateways, and database cluster nodes.'
  },
  {
    id: 'api-rate-governor',
    title: 'API Rate Limiter & Token Bucket Governor',
    category: 'Traffic Management',
    icon: 'Sliders',
    badge: '3 Tiers Active',
    badgeColor: 'emerald',
    description: 'Dynamically prioritize emergency responder CAD traffic over public citizen application consumption.'
  },
  {
    id: 'backup-pitr-console',
    title: 'Database Backup & Point-in-Time Recovery (PITR)',
    category: 'Data Durability',
    icon: 'Archive',
    badge: 'Last WAL: 18:32 IST',
    badgeColor: 'emerald',
    description: 'Continuous WAL archiving, hourly immutable S3 snapshots, and SHA-256 backup cryptographic verification.'
  },
  {
    id: 'storage-nvme-array',
    title: 'Storage Volumes & Ceph/NVMe Distributed Disk Array',
    category: 'Storage Infrastructure',
    icon: 'HardDrive',
    badge: '43.3 TB / 72% Used',
    badgeColor: 'emerald',
    description: 'Ceph storage pools for LiDAR point clouds, Doppler archives, raster inundation grids, and CCTV video clips.'
  },
  {
    id: 'synthetic-health-prober',
    title: 'Live Synthetic Health Prober & Heartbeat Suite',
    category: 'Active Monitoring',
    icon: 'Activity',
    badge: '8 Endpoints 200 OK',
    badgeColor: 'emerald',
    description: 'Configure and execute periodic synthetic HTTP/gRPC health probe pings with response waterfall analysis.'
  },
  {
    id: 'incident-postmortem-gen',
    title: 'Incident & Outage Post-Mortem Generator',
    category: 'ITIL Operations',
    icon: 'FileText',
    badge: 'MTTR: 18.4 min',
    badgeColor: 'blue',
    description: 'Automated ISO 20000 post-mortem document builder with root-cause analysis, timeline logs, and PDF/MD export.'
  },
  {
    id: 'sensor-solar-telemetry',
    title: 'Environmental Sensor Power Grid & Solar Microgrid',
    category: 'Edge Power & Green',
    icon: 'SunMedium',
    badge: 'Mean 13.4V / Solar OK',
    badgeColor: 'emerald',
    description: 'Solar irradiance vs battery discharge rates for off-grid remote river and culvert sensors during monsoons.'
  },
  {
    id: 'waf-firewall-telemetry',
    title: 'Security Firewall & WAF Threat Telemetry',
    category: 'Perimeter Defense',
    icon: 'ShieldAlert',
    badge: '1,420 Probes Blocked',
    badgeColor: 'emerald',
    description: 'Inspect live blocked DDoS vectors, SQL injection attempts on GIS endpoints, and geofencing rules.'
  },
  {
    id: 'sha256-audit-chain',
    title: 'Audit Log & Tamper-Evident SHA-256 Event Chain',
    category: 'Compliance & Audit',
    icon: 'FileCode',
    badge: 'Ledger Verified 100%',
    badgeColor: 'emerald',
    description: 'Cryptographically linked immutable operational ledger recording all sluice actions and model overrides.'
  }
];

export const CLUSTER_NODES_DATA = [
  {
    name: 'k8s-master-01 (Worli EOC)',
    role: 'Control Plane',
    cpu: 24,
    mem: 41,
    temp: '44°C',
    status: 'READY',
    pods: 38,
    ip: '10.240.0.10'
  },
  {
    name: 'k8s-worker-01 (Worli EOC)',
    role: 'Ingest & Microservices',
    cpu: 48,
    mem: 62,
    temp: '48°C',
    status: 'READY',
    pods: 64,
    ip: '10.240.0.11'
  },
  {
    name: 'k8s-worker-02 (Bandra SDC)',
    role: 'GIS & Tile Renderer',
    cpu: 56,
    mem: 71,
    temp: '51°C',
    status: 'READY',
    pods: 58,
    ip: '10.240.1.12'
  },
  {
    name: 'gpu-h100-rig-alpha (Worli)',
    role: 'Hydro 2D SWE Simulation',
    cpu: 78,
    mem: 88,
    temp: '68°C',
    status: 'READY',
    pods: 4,
    ip: '10.240.2.20',
    gpuVram: '302 GB / 320 GB (94%)',
    nvlinkSpeed: '900 GB/s'
  },
  {
    name: 'gpu-h100-rig-beta (Navi Mumbai)',
    role: 'Nowcast Deep Learning & Flood AI',
    cpu: 64,
    mem: 76,
    temp: '62°C',
    status: 'READY',
    pods: 4,
    ip: '10.240.3.21',
    gpuVram: '240 GB / 320 GB (75%)',
    nvlinkSpeed: '900 GB/s'
  }
];

export const KAFKA_TOPICS_DATA = [
  {
    topic: 'hydrology.gauges.water_depth',
    partitions: 8,
    throughputMsgSec: 280,
    consumerLag: 0,
    retentionHours: 72,
    health: 'OPTIMAL'
  },
  {
    topic: 'radar.sweep.reflectivity.raw',
    partitions: 16,
    throughputMsgSec: 1240,
    consumerLag: 2,
    retentionHours: 24,
    health: 'OPTIMAL'
  },
  {
    topic: 'cctv.watermark.inference.events',
    partitions: 6,
    throughputMsgSec: 85,
    consumerLag: 0,
    retentionHours: 48,
    health: 'OPTIMAL'
  },
  {
    topic: 'gis.emergency.cad.telematics',
    partitions: 4,
    throughputMsgSec: 140,
    consumerLag: 0,
    retentionHours: 168,
    health: 'OPTIMAL'
  }
];

export const SPATIAL_SLOW_QUERIES = [
  {
    id: 'Q-9812',
    name: 'Dynamic Ward Flood Polygon Clipping',
    sql: 'SELECT ST_Intersection(f.geom, w.geom) FROM active_inundation f JOIN wards w ON ST_Intersects(f.geom, w.geom) WHERE f.depth_cm > 15;',
    durationMs: 44.8,
    status: 'OPTIMAL',
    indexUsed: 'gist_inundation_geom_idx'
  },
  {
    id: 'Q-9813',
    name: 'Surcharged Conduit Proximity Buffer (50m)',
    sql: 'SELECT c.id, ST_Buffer(c.geom, 50) FROM conduits c WHERE c.head_ratio > 0.95;',
    durationMs: 82.1,
    status: 'WARNING',
    indexUsed: 'spgist_conduit_mesh_idx'
  },
  {
    id: 'Q-9814',
    name: 'Nowcast Cloud Centroid Ray Intersection',
    sql: 'SELECT cell_id, ST_Centroid(cell_geom) FROM radar_cloud_cells WHERE dbz_peak >= 45.0;',
    durationMs: 12.3,
    status: 'OPTIMAL',
    indexUsed: 'gist_radar_cells_idx'
  }
];

export const SENSOR_FLEET_SAMPLE = [
  { id: 'MITHI_WL_01', name: 'Mithi Filter Pada Outfall', type: 'Ultrasonic Gauge', battery: 98, solarW: 14.2, rssi: -64, status: 'ONLINE', depthM: 2.14 },
  { id: 'MITHI_WL_09', name: 'BKC Dharavi Bridge Link', type: 'Ultrasonic Gauge', battery: 21, solarW: 2.8, rssi: -88, status: 'DEGRADED', depthM: 3.42 },
  { id: 'MITHI_WL_14', name: 'Kurla Kranti Nagar Dip', type: 'Hydrostatic Pressure', battery: 84, solarW: 11.5, rssi: -72, status: 'ONLINE', depthM: 2.89 },
  { id: 'AWS_SANTACRUZ', name: 'Santacruz IMD Base AWS', type: 'Tipping Bucket & Baro', battery: 100, solarW: 22.0, rssi: -58, status: 'ONLINE', depthM: 0.00 },
  { id: 'AWS_COLABA', name: 'Colaba Observatory AWS', type: 'Optical Disdrometer', battery: 96, solarW: 18.4, rssi: -61, status: 'ONLINE', depthM: 0.00 },
  { id: 'DAHISAR_WL_03', name: 'Dahisar River WEH Bridge', type: 'Radar Gauge', battery: 91, solarW: 15.0, rssi: -66, status: 'ONLINE', depthM: 1.80 },
  { id: 'POISAR_WL_02', name: 'Poisar Nullah Kandivali', type: 'Ultrasonic Gauge', battery: 88, solarW: 13.9, rssi: -69, status: 'ONLINE', depthM: 2.05 },
  { id: 'MILAN_SUB_01', name: 'Milan Subway Low Spot', type: 'Dual Sensor (Laser+Float)', battery: 94, solarW: 16.5, rssi: -63, status: 'ONLINE', depthM: 0.45 }
];

export const NETWORK_LATENCY_DATA = [
  { target: 'BMC Worli Disaster HQ', ip: '10.240.0.1', rttMs: 1.2, jitterMs: 0.3, packetLoss: '0.0%', status: 'OPTIMAL' },
  { target: 'IMD Colaba Doppler Radar Station', ip: '10.241.10.4', rttMs: 8.4, jitterMs: 1.1, packetLoss: '0.0%', status: 'OPTIMAL' },
  { target: 'Mumbai Traffic Police HQ (Worli)', ip: '10.242.4.8', rttMs: 4.8, jitterMs: 0.6, packetLoss: '0.0%', status: 'OPTIMAL' },
  { target: 'Mantralaya State EOC Control Room', ip: '10.244.20.1', rttMs: 6.2, jitterMs: 0.9, packetLoss: '0.0%', status: 'OPTIMAL' },
  { target: 'AWS Cloud ap-south-1 (Mumbai Region)', ip: '13.232.0.1', rttMs: 14.1, jitterMs: 2.4, packetLoss: '0.0%', status: 'OPTIMAL' }
];

export const TAMPER_EVIDENT_AUDIT_LOGS = [
  {
    block: 41829,
    timestamp: '2026-09-22 18:28:14 IST',
    operator: 'Cmdr. R. Verma (Super Admin)',
    action: 'SLUICE_GATE_4_MANUAL_OPEN_OVERRIDE',
    hash: '0x8f2d...49a1',
    prevHash: '0x3c9a...110e',
    status: 'VERIFIED'
  },
  {
    block: 41830,
    timestamp: '2026-09-22 18:30:02 IST',
    operator: 'Dr. M. Iyer (Disaster Officer)',
    action: 'DISPATCH_CAP_ALERT_BROADCAST_WARD_FN',
    hash: '0x5b7e...99c2',
    prevHash: '0x8f2d...49a1',
    status: 'VERIFIED'
  },
  {
    block: 41831,
    timestamp: '2026-09-22 18:31:18 IST',
    operator: 'Er. S. Deshmukh (Drainage Eng)',
    action: 'HYDROLOGIC_ROUGHNESS_PARAM_ADJUSTMENT',
    hash: '0x2a14...78e4',
    prevHash: '0x5b7e...99c2',
    status: 'VERIFIED'
  },
  {
    block: 41832,
    timestamp: '2026-09-22 18:32:05 IST',
    operator: 'System Auto-Governor (AI Engine)',
    action: 'TRAFFIC_PENALTY_INUNDATION_ROAD_DIVERSITY',
    hash: '0x99fe...31ba',
    prevHash: '0x2a14...78e4',
    status: 'VERIFIED'
  }
];

