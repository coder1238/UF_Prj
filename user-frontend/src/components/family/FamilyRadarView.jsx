import React, { useState } from 'react';
import { 
  Compass, Radio, Shield, AlertTriangle, MapPin, 
  Layers, Eye, Navigation, Zap, RefreshCw, Maximize2, Minimize2
} from 'lucide-react';
import { SAFE_PLACES_DATA } from '../../data/safePlacesData';

export default function FamilyRadarView({ 
  members, 
  rendezvousPoint, 
  selectedMemberId, 
  onSelectMember,
  privacyMode = '1km'
}) {
  const [radarFilter, setRadarFilter] = useState('all'); // 'all' | 'risk' | 'shelters'
  const [isSweeping, setIsSweeping] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // Approximate relative canvas coordinates for Mumbai wards/locations
  // Center is roughly Dadar / Central Mumbai
  const memberCoordinates = {
    'fam-1': { x: 260, y: 140, label: 'BKC Basin' },
    'fam-2': { x: 190, y: 260, label: 'Dadar West' },
    'fam-3': { x: 310, y: 280, label: 'Matunga Basin' },
    'fam-4': { x: 140, y: 350, label: 'Worli Ridge' },
    'fam-5': { x: 340, y: 190, label: 'Kurla West' }
  };

  // Safe Havens for radar plotting
  const safeShelters = [
    { id: 'sh-1', name: 'Kokilaben Trauma Center', x: 130, y: 90, elevation: '+18.4m', type: 'hospital' },
    { id: 'sh-2', name: 'Don Bosco High Ground Hall', x: 300, y: 240, elevation: '+14.2m', type: 'school' },
    { id: 'sh-3', name: 'Bandra Reclamation Multi-Deck', x: 170, y: 200, elevation: '+16.5m', type: 'deck' },
    { id: 'sh-4', name: 'Sion Fort Elevated Camp', x: 350, y: 270, elevation: '+22.0m', type: 'fort' }
  ];

  // Flood Hazard Contours (Ponding zones)
  const hazardBasins = [
    { name: 'Hindmata Deep Depression', cx: 280, cy: 300, r: 48, depth: '45cm', color: 'rgba(239, 68, 68, 0.25)' },
    { name: 'Kurla LBS Catchment', cx: 330, cy: 170, r: 42, depth: '38cm', color: 'rgba(239, 68, 68, 0.22)' },
    { name: 'Milan Subway Basin', cx: 160, cy: 120, r: 35, depth: '52cm', color: 'rgba(245, 158, 11, 0.22)' }
  ];

  const getStatusFill = (status) => {
    switch (status) {
      case 'safe': return '#10B981';
      case 'caution': return '#F59E0B';
      case 'danger': default: return '#EF4444';
    }
  };

  return (
    <div className={`bg-slate-950 text-white rounded-3xl border border-slate-800 p-5 sm:p-6 transition-all relative overflow-hidden shadow-2xl ${
      isExpanded ? 'fixed inset-4 z-50 overflow-y-auto' : 'w-full mb-8'
    }`}>
      {/* Background Radial Grid */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#6D4AFF_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Radio className={`w-5 h-5 ${isSweeping ? 'animate-pulse text-purple-400' : 'text-slate-500'}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight text-white">Family Basin Micro-Radar</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                LIVE 1Hz TELEMETRY
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Zero-Track {privacyMode.toUpperCase()} safe bubbles over active Mumbai flood contours
            </p>
          </div>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 flex items-center gap-1 text-xs">
            <button
              onClick={() => setRadarFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                radarFilter === 'all' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Pins
            </button>
            <button
              onClick={() => setRadarFilter('risk')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                radarFilter === 'risk' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              At Risk
            </button>
            <button
              onClick={() => setRadarFilter('shelters')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                radarFilter === 'shelters' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Shelters
            </button>
          </div>

          <button
            onClick={() => setIsSweeping(!isSweeping)}
            title="Toggle Sonar Sweep"
            className={`p-2 rounded-xl border text-xs flex items-center gap-1 transition-all ${
              isSweeping ? 'bg-purple-900/40 border-purple-500/40 text-purple-300' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSweeping ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Minimize' : 'Expand Radar'}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs transition-colors"
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Radar Screen (SVG Interactive Map Canvas) */}
      <div className="relative w-full aspect-[16/10] max-h-[460px] bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
        <svg 
          viewBox="0 0 500 400" 
          className="w-full h-full select-none cursor-crosshair"
        >
          <defs>
            {/* Sonar sweep gradient */}
            <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#6D4AFF" stopOpacity="0.12" />
              <stop offset="70%" stopColor="#6D4AFF" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#6D4AFF" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="sonarBeam" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
            </linearGradient>

            {/* Fuzz filter for Zero-Track privacy */}
            <filter id="fuzzyBubble" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Central Radar Rings */}
          <circle cx="250" cy="200" r="180" fill="url(#radarGlow)" stroke="#334155" strokeWidth="0.8" strokeDasharray="3 3" />
          <circle cx="250" cy="200" r="130" stroke="#334155" strokeWidth="0.8" strokeDasharray="2 2" />
          <circle cx="250" cy="200" r="80" stroke="#334155" strokeWidth="0.8" />
          <circle cx="250" cy="200" r="30" stroke="#475569" strokeWidth="1" />

          {/* Axis crosshairs */}
          <line x1="250" y1="20" x2="250" y2="380" stroke="#334155" strokeWidth="0.8" strokeDasharray="4 4" />
          <line x1="70" y1="200" x2="430" y2="200" stroke="#334155" strokeWidth="0.8" strokeDasharray="4 4" />

          {/* Distance Labels */}
          <text x="255" y="125" fill="#64748B" fontSize="9" fontFamily="monospace">1.0 km</text>
          <text x="255" y="75" fill="#64748B" fontSize="9" fontFamily="monospace">2.5 km</text>
          <text x="255" y="25" fill="#64748B" fontSize="9" fontFamily="monospace">5.0 km</text>
          <text x="410" y="195" fill="#64748B" fontSize="9" fontFamily="monospace">EAST</text>
          <text x="75" y="195" fill="#64748B" fontSize="9" fontFamily="monospace">WEST</text>

          {/* Flood Basin Hazards */}
          {hazardBasins.map((basin, idx) => (
            <g key={idx}>
              <circle 
                cx={basin.cx} 
                cy={basin.cy} 
                r={basin.r} 
                fill={basin.color} 
                stroke="#EF4444" 
                strokeWidth="1" 
                strokeDasharray="2 2"
              />
              <text 
                x={basin.cx} 
                y={basin.cy} 
                fill="#FCA5A5" 
                fontSize="8" 
                textAnchor="middle" 
                fontFamily="monospace"
              >
                {basin.name}
              </text>
              <text 
                x={basin.cx} 
                y={basin.cy + 11} 
                fill="#EF4444" 
                fontSize="9" 
                fontWeight="bold" 
                textAnchor="middle" 
                fontFamily="monospace"
              >
                ▼ {basin.depth}
              </text>
            </g>
          ))}

          {/* Safe Corridor / Extraction Line to Rendezvous */}
          {members.map(member => {
            const coords = memberCoordinates[member.id] || { x: 250, y: 200 };
            const rPoint = rendezvousPoint || safeShelters[1];
            return (
              <g key={`corridor-${member.id}`} opacity={radarFilter === 'shelters' ? 0.3 : 0.6}>
                <line 
                  x1={coords.x} 
                  y1={coords.y} 
                  x2={rPoint.x} 
                  y2={rPoint.y} 
                  stroke={member.status === 'danger' ? '#EF4444' : '#10B981'} 
                  strokeWidth="1.2" 
                  strokeDasharray="3 3"
                />
              </g>
            );
          })}

          {/* Safe Shelters */}
          {(radarFilter === 'all' || radarFilter === 'shelters') && safeShelters.map(shelter => (
            <g key={shelter.id} className="cursor-pointer group">
              <circle cx={shelter.x} cy={shelter.y} r="12" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="1" />
              <rect x={shelter.x - 4} y={shelter.y - 4} width="8" height="8" rx="2" fill="#10B981" />
              <text 
                x={shelter.x} 
                y={shelter.y - 15} 
                fill="#6EE7B7" 
                fontSize="9" 
                fontWeight="bold" 
                textAnchor="middle"
                fontFamily="monospace"
              >
                {shelter.name.split(' ')[0]} ({shelter.elevation})
              </text>
            </g>
          ))}

          {/* Family Member Nodes */}
          {members
            .filter(m => radarFilter === 'all' || (radarFilter === 'risk' && m.status !== 'safe') || radarFilter === 'shelters')
            .map(member => {
              const coords = memberCoordinates[member.id] || { x: 250, y: 200, label: member.ward };
              const isSelected = selectedMemberId === member.id;
              const color = getStatusFill(member.status);
              const bubbleRadius = privacyMode === '500m' ? 22 : privacyMode === 'exact' ? 12 : 36;

              return (
                <g 
                  key={member.id} 
                  className="cursor-pointer group"
                  onClick={() => onSelectMember && onSelectMember(member.id)}
                >
                  {/* Zero-track privacy boundary bubble */}
                  <circle 
                    cx={coords.x} 
                    cy={coords.y} 
                    r={bubbleRadius} 
                    fill={color} 
                    fillOpacity={isSelected ? 0.25 : 0.12} 
                    stroke={color} 
                    strokeWidth={isSelected ? 2 : 1}
                    strokeDasharray="2 2"
                    filter="url(#fuzzyBubble)"
                  />

                  {/* Pulsing ring for caution/danger */}
                  {member.status !== 'safe' && (
                    <circle 
                      cx={coords.x} 
                      cy={coords.y} 
                      r={bubbleRadius + 6} 
                      fill="none" 
                      stroke={color} 
                      strokeWidth="1"
                      className="animate-ping" 
                      style={{ transformOrigin: `${coords.x}px ${coords.y}px`, animationDuration: '2.5s' }}
                    />
                  )}

                  {/* Node icon core */}
                  <circle 
                    cx={coords.x} 
                    cy={coords.y} 
                    r={isSelected ? 10 : 8} 
                    fill={color} 
                    stroke="#FFFFFF" 
                    strokeWidth="2" 
                  />

                  {/* Member Initial */}
                  <text 
                    x={coords.x} 
                    y={coords.y + 3} 
                    fill="#FFFFFF" 
                    fontSize="8" 
                    fontWeight="bold" 
                    textAnchor="middle"
                    pointerEvents="none"
                  >
                    {member.name.charAt(0)}
                  </text>

                  {/* Label badge */}
                  <g transform={`translate(${coords.x}, ${coords.y + (isSelected ? 22 : 18)})`}>
                    <rect 
                      x="-42" 
                      y="-10" 
                      width="84" 
                      height="18" 
                      rx="4" 
                      fill="#0F172A" 
                      stroke={isSelected ? '#6D4AFF' : '#334155'} 
                      strokeWidth={isSelected ? '1.5' : '1'} 
                    />
                    <text 
                      x="0" 
                      y="3" 
                      fill={isSelected ? '#E2E8F0' : '#94A3B8'} 
                      fontSize="9" 
                      fontWeight="bold" 
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {member.name.split(' ')[0]} • {member.localWaterDepth}cm
                    </text>
                  </g>
                </g>
              );
            })}

          {/* Sonar sweep line */}
          {isSweeping && (
            <line 
              x1="250" 
              y1="200" 
              x2="430" 
              y2="100" 
              stroke="#A855F7" 
              strokeWidth="2" 
              strokeOpacity="0.7"
              className="origin-center animate-[spin_6s_linear_infinite]"
              style={{ transformOrigin: '250px 200px' }}
            />
          )}
        </svg>

        {/* Compass Rosette Overlay */}
        <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 text-[11px] font-mono text-slate-300">
          <Compass className="w-4 h-4 text-purple-400 animate-[spin_20s_linear_infinite]" />
          <span>TRUE NORTH</span>
        </div>

        {/* Legend Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 flex items-center gap-4 text-[10px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-300">Safe (&lt;10cm)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-300">Caution (10-25cm)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-slate-300">Basin Risk (&gt;25cm)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-sm" />
            <span className="text-slate-300">Designated Shelter</span>
          </div>
        </div>
      </div>
    </div>
  );
}

