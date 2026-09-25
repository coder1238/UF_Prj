// Color lookup tables and constants for Doppler Radar products

export const PRODUCT_PALETTES = {
  reflectivity: {
    name: 'Reflectivity (dBZ)',
    unit: 'dBZ',
    min: 10,
    max: 65,
    stops: [
      { val: 10, color: '#4A90E2', label: '10 dBZ (Light Mist)' },
      { val: 25, color: '#2ECC71', label: '25 dBZ (Moderate Rain)' },
      { val: 40, color: '#F1C40F', label: '40 dBZ (Heavy Rain)' },
      { val: 50, color: '#E67E22', label: '50 dBZ (Torrential Downpour)' },
      { val: 60, color: '#E74C3C', label: '60 dBZ (Severe Convective Core)' },
      { val: 65, color: '#9B59B6', label: '65+ dBZ (Cloudburst / Hail)' },
    ],
    gradient: 'from-blue-500 via-green-500 via-yellow-400 via-orange-500 via-red-500 to-purple-600',
  },
  intensity: {
    name: 'Rain Intensity (mm/hr)',
    unit: 'mm/hr',
    min: 2,
    max: 120,
    stops: [
      { val: 5, color: '#3498DB', label: '< 5 mm/hr (Drizzle)' },
      { val: 20, color: '#27AE60', label: '20 mm/hr (Moderate)' },
      { val: 50, color: '#F39C12', label: '50 mm/hr (Heavy Rain)' },
      { val: 80, color: '#D35400', label: '80 mm/hr (Very Heavy)' },
      { val: 100, color: '#C0392B', label: '100+ mm/hr (Cloudburst Warning)' },
    ],
    gradient: 'from-sky-400 via-emerald-500 via-amber-400 via-orange-600 to-rose-700',
  },
  vectors: {
    name: 'Doppler Velocity / TREC (km/h)',
    unit: 'km/h',
    min: -35,
    max: 35,
    stops: [
      { val: -30, color: '#2980B9', label: '-30 km/h (Inbound to Radar)' },
      { val: 0, color: '#95A5A6', label: '0 km/h (Stationary / Shear)' },
      { val: 30, color: '#E74C3C', label: '+30 km/h (Outbound from Radar)' },
    ],
    gradient: 'from-blue-600 via-slate-400 to-red-600',
  },
  zdr: {
    name: 'Differential Reflectivity (ZDR)',
    unit: 'dB',
    min: -0.5,
    max: 4.0,
    stops: [
      { val: 0.0, color: '#7F8C8D', label: '0 dB (Spherical / Hail / Clutter)' },
      { val: 1.5, color: '#2ECC71', label: '1.5 dB (Medium Raindrops)' },
      { val: 3.5, color: '#E67E22', label: '3.5 dB (Oblate Tropical Drops)' },
    ],
    gradient: 'from-gray-500 via-emerald-500 to-amber-500',
  },
  kdp: {
    name: 'Specific Diff. Phase (KDP)',
    unit: '°/km',
    min: 0,
    max: 5.0,
    stops: [
      { val: 0.2, color: '#3498DB', label: '0.2°/km (Light Precip)' },
      { val: 2.0, color: '#F1C40F', label: '2.0°/km (Heavy Rain Column)' },
      { val: 4.5, color: '#8E44AD', label: '4.5°/km (Extreme Torrential Core)' },
    ],
    gradient: 'from-cyan-400 via-yellow-400 to-purple-600',
  },
  vil: {
    name: 'Vertically Integrated Liquid (VIL)',
    unit: 'kg/m²',
    min: 0,
    max: 60,
    stops: [
      { val: 10, color: '#16A085', label: '10 kg/m² (Light Liquid Mass)' },
      { val: 30, color: '#F39C12', label: '30 kg/m² (Saturated Updraft)' },
      { val: 55, color: '#C0392B', label: '55+ kg/m² (Severe Core / Inundation Risk)' },
    ],
    gradient: 'from-teal-400 via-orange-400 to-red-600',
  },
};

// Ground Weather Stations (AWS)
export const AWS_STATIONS = [
  { id: 'aws-colaba', name: 'Colaba IMD HQ', lat: 18.89, lon: 72.81, x: 250, y: 250, rate: 42.5, type: 'IMD-Primary' },
  { id: 'aws-santacruz', name: 'Santacruz Airport', lat: 19.09, lon: 72.85, x: 275, y: 175, rate: 76.2, type: 'IMD-Primary' },
  { id: 'aws-kurla', name: 'Kurla West (LBS Marg)', lat: 19.06, lon: 72.88, x: 295, y: 190, rate: 84.0, type: 'MCGM-AWS' },
  { id: 'aws-vikhroli', name: 'Vikhroli EEH', lat: 19.11, lon: 72.93, x: 325, y: 165, rate: 58.4, type: 'MCGM-AWS' },
  { id: 'aws-powai', name: 'Powai IIT Lake Basin', lat: 19.12, lon: 72.90, x: 310, y: 155, rate: 69.1, type: 'MCGM-AWS' },
  { id: 'aws-borivali', name: 'Borivali National Park', lat: 19.23, lon: 72.86, x: 285, y: 105, rate: 31.8, type: 'MCGM-AWS' },
  { id: 'aws-dadar', name: 'Dadar TT Circle', lat: 19.02, lon: 72.84, x: 270, y: 210, rate: 62.3, type: 'MCGM-AWS' },
  { id: 'aws-chembur', name: 'Chembur Mahul Creek', lat: 19.04, lon: 72.90, x: 305, y: 200, rate: 71.5, type: 'MCGM-AWS' },
];

// Critical Infrastructure Radar Overlay
export const CRITICAL_INFRA_PINS = [
  { id: 'inf-airport', name: 'CSMIA Airport (BOM)', x: 278, y: 178, category: 'Aviation', criticalThreshold: 60 },
  { id: 'inf-bkc', name: 'Bandra-Kurla Complex (BKC)', x: 282, y: 195, category: 'Business Hub', criticalThreshold: 55 },
  { id: 'inf-kurla-subway', name: 'Kurla Railway Subway', x: 298, y: 192, category: 'Transit Sump', criticalThreshold: 45 },
  { id: 'inf-milan-subway', name: 'Milan Subway Underpass', x: 268, y: 182, category: 'Transit Sump', criticalThreshold: 45 },
  { id: 'inf-sion-hospital', name: 'Lokmanya Tilak Sion Hospital', x: 285, y: 202, category: 'Healthcare', criticalThreshold: 50 },
  { id: 'inf-mahim-pump', name: 'Mahim Stormwater Pumping Stn', x: 265, y: 208, category: 'Flood Control', criticalThreshold: 65 },
];

