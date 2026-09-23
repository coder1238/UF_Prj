import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ROAD_CORRIDORS,
  CRITICAL_ASSETS,
  DRAINAGE_NODES,
  INCIDENTS,
  CITIZEN_REPORTS,
  RESCUE_UNITS,
  PUMPING_STATIONS,
  TIDAL_STATION,
  VMS_SIGNS,
  DEPOT_INVENTORY,
  EVACUATION_SHELTERS,
  INTER_AGENCIES,
  INITIAL_COMMAND_LOGS,
} from '../data/floodData';

const FloodCommandContext = createContext();

export function FloodCommandProvider({ children }) {
  // Active Navigation Module ID (01 to 18)
  const [activeModule, setActiveModule] = useState('01-command');

  // Operational Filters & Scenarios
  const [selectedWard, setSelectedWard] = useState('all');
  const [nowcastMinutes, setNowcastMinutes] = useState(0); // 0 to 180 min
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1x, 2x, 5x

  // Selected Entities
  const [selectedRoad, setSelectedRoad] = useState(ROAD_CORRIDORS[0]);
  const [selectedNode, setSelectedNode] = useState(DRAINAGE_NODES[0]);
  const [selectedIncident, setSelectedIncident] = useState(INCIDENTS[0]);
  const [selectedAsset, setSelectedAsset] = useState(CRITICAL_ASSETS[0]);

  // Active Map GIS Layers
  const [activeLayers, setActiveLayers] = useState({
    radar: true,
    floodDepth: true,
    predictedFlood: true,
    surfaceFlow: true,
    drainage: true,
    roads: true,
    dem: true,
    infrastructure: true,
    cctv: true,
    citizenReports: true,
    rescueUnits: true,
    sandbags: true,
  });

  const toggleLayer = (layerKey) => {
    setActiveLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const setAllLayers = (enable) => {
    setActiveLayers((prev) => {
      const updated = {};
      Object.keys(prev).forEach((k) => {
        updated[k] = enable;
      });
      return updated;
    });
  };

  // Map Operational Cursor Tools: 'none' | 'inspect' | 'ruler' | 'barrier'
  const [activeMapTool, setActiveMapTool] = useState('none');
  const [inspectedPoint, setInspectedPoint] = useState(null);
  const [rulerPoints, setRulerPoints] = useState([]);
  const [placedBarriers, setPlacedBarriers] = useState([
    {
      id: 'bar-01',
      name: 'Rapid Sandbag Dike #1',
      coordinates: [72.8468, 19.1197],
      heightCm: 60,
      mitigationDeltaCm: -18,
      deployedAt: '18:24 IST',
      type: 'Heavy Sandbags (200 units)',
    },
  ]);

  const addBarrier = (barrier) => {
    setPlacedBarriers((prev) => [barrier, ...prev]);
  };

  const removeBarrier = (id) => {
    setPlacedBarriers((prev) => prev.filter((b) => b.id !== id));
  };

  // Rescue Unit Dispatch State
  const [rescueFleet, setRescueFleet] = useState(RESCUE_UNITS);
  const dispatchRescueUnit = (unitId, destination, mission) => {
    setRescueFleet((prev) =>
      prev.map((unit) =>
        unit.id === unitId
          ? {
              ...unit,
              status: `DISPATCHED: ${mission}`,
              speed: '28 km/h',
            }
          : unit
      )
    );
  };

  // Citizen Reports Queue State
  const [citizenReportsList, setCitizenReportsList] = useState(CITIZEN_REPORTS);
  const verifyCitizenReport = (reportId, newStatus) => {
    setCitizenReportsList((prev) =>
      prev.map((rep) => (rep.id === reportId ? { ...rep, status: newStatus } : rep))
    );
  };

  // Pumping Station Boost State
  const [pumpingStationsList, setPumpingStationsList] = useState(PUMPING_STATIONS);
  const boostPumpingStation = (stationId) => {
    setPumpingStationsList((prev) =>
      prev.map((st) =>
        st.id === stationId
          ? {
              ...st,
              status: 'EMERGENCY OVERDRIVE (115% BOOST)',
              pumpsRunning: st.totalPumps,
              dischargeRate: `${parseInt(st.dischargeRate) + 6000} m³/hr`,
            }
          : st
      )
    );
  };

  // Sluice Gate Overrides
  const [sluiceGatesList, setSluiceGatesList] = useState(TIDAL_STATION.sluiceGates);
  const toggleSluiceGate = (gateId) => {
    setSluiceGatesList((prev) =>
      prev.map((gate) =>
        gate.id === gateId
          ? {
              ...gate,
              status: gate.status.includes('OPEN') ? 'MANUALLY SHUT' : 'EMERGENCY BYPASS OPEN',
              autoOverride: !gate.autoOverride,
              flapAngleDeg: gate.flapAngleDeg > 20 ? 0 : 85,
            }
          : gate
      )
    );
  };

  // Safe Emergency Routing
  const [activeSafeRoute, setActiveSafeRoute] = useState(null);

  // Scenario Simulator Parameters
  const [scenarioParams, setScenarioParams] = useState({
    rainfallIntensity: 80, // mm/hr
    durationMin: 90, // min
    drainBlockage: 35, // %
    pumpingCapacity: 70, // %
    tideLevel: 4.45, // m MSL
    stormSpeed: 8, // km/h
  });

  // Active Interventions (Intervention Lab from project 16298242105309405643)
  const [activeInterventions, setActiveInterventions] = useState([
    'int-sluice-02', // Mahim Tidal Bypass is active by default
    'int-basin-04',  // Dadar Holding Pond active
  ]);

  const toggleIntervention = (id) => {
    setActiveInterventions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Incident Dispatches & Barricade orders
  const [incidentList, setIncidentList] = useState(INCIDENTS);
  const dispatchIncident = (incidentId, actionDescription) => {
    setIncidentList((prev) =>
      prev.map((inc) =>
        inc.id === incidentId
          ? {
              ...inc,
              status: 'CREW DEPLOYED / EN ROUTE',
              timeline: [
                ...inc.timeline,
                { time: 'Just now', text: `Action Dispatched: ${actionDescription}` },
              ],
            }
          : inc
      )
    );
  };

  const addIncident = (newIncident) => {
    setIncidentList((prev) => [newIncident, ...prev]);
    setSelectedIncident(newIncident);
  };

  const updateIncident = (incidentId, partialUpdates) => {
    setIncidentList((prev) =>
      prev.map((inc) => (inc.id === incidentId ? { ...inc, ...partialUpdates } : inc))
    );
    setSelectedIncident((prev) => (prev?.id === incidentId ? { ...prev, ...partialUpdates } : prev));
  };

  const resolveIncident = (incidentId, resolutionNotes = 'Incident resolved and roadway reopened') => {
    const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
    setIncidentList((prev) =>
      prev.map((inc) =>
        inc.id === incidentId
          ? {
              ...inc,
              status: 'RESOLVED / ALL CLEAR',
              depth: 0,
              timeline: [
                ...inc.timeline,
                { time: timeStr, text: `Resolution Confirmed: ${resolutionNotes}` },
              ],
            }
          : inc
      )
    );
    setSelectedIncident((prev) =>
      prev?.id === incidentId
        ? {
            ...prev,
            status: 'RESOLVED / ALL CLEAR',
            depth: 0,
            timeline: [
              ...prev.timeline,
              { time: timeStr, text: `Resolution Confirmed: ${resolutionNotes}` },
            ],
          }
        : prev
    );
  };

  const addIncidentTimelineEvent = (incidentId, eventText) => {
    const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
    setIncidentList((prev) =>
      prev.map((inc) =>
        inc.id === incidentId
          ? {
              ...inc,
              timeline: [...inc.timeline, { time: timeStr, text: eventText }],
            }
          : inc
      )
    );
    setSelectedIncident((prev) =>
      prev?.id === incidentId
        ? {
            ...prev,
            timeline: [...prev.timeline, { time: timeStr, text: eventText }],
          }
        : prev
    );
  };

  const batchUpdateIncidents = (incidentIds, updates) => {
    setIncidentList((prev) =>
      prev.map((inc) => (incidentIds.includes(inc.id) ? { ...inc, ...updates } : inc))
    );
  };

  // Broadcast Alerts Queue
  const [alertsList, setAlertsList] = useState([
    {
      id: 'AL-0841',
      title: 'FLASH FLOOD INUNDATION WARNING: ANDHERI, KURLA & SION',
      wards: ['Ward K/E', 'Ward L', 'Ward F/N'],
      status: 'PUBLISHED - ACTIVE',
      timestamp: '18:05 IST',
      audienceReach: '480,000 citizens',
      depthRange: '20–35 cm',
      channels: ['Cell Broadcast', 'VMS 24 Screens', 'Citizen App'],
    },
    {
      id: 'AL-0840',
      title: 'DRAINAGE SURCHARGE ADVISORY: DADAR & MATUNGA',
      wards: ['Ward G/N', 'Ward F/N'],
      status: 'APPROVED - STAGED',
      timestamp: '17:40 IST',
      audienceReach: '240,000 citizens',
      depthRange: '15–25 cm',
      channels: ['Citizen App', 'Traffic VMS'],
    },
  ]);

  const publishAlert = (newAlert) => {
    setAlertsList((prev) => [newAlert, ...prev]);
  };

  const revokeAlert = (alertId, reason = 'Waters receded - All Clear') => {
    setAlertsList((prev) =>
      prev.map((al) =>
        al.id === alertId
          ? {
              ...al,
              status: 'REVOKED - ALL CLEAR',
              revokedAt: 'Just now',
              revocationReason: reason,
            }
          : al
      )
    );
  };

  const retransmitAlert = (alertId) => {
    setAlertsList((prev) =>
      prev.map((al) =>
        al.id === alertId
          ? {
              ...al,
              status: 'RETRANSMITTED - ACTIVE',
              timestamp: 'Retransmitted just now',
              retransmitCount: (al.retransmitCount || 0) + 1,
            }
          : al
      )
    );
  };

  // Portal View Switcher: Authority vs JalDrishti Citizen View
  const [isCitizenView, setIsCitizenView] = useState(false);

  // 1. Municipal Threat Escalation Level (Condition Green to Code Violet)
  const [threatLevel, setThreatLevel] = useState('LEVEL-4');

  // 2. VMS Traffic Sign Controllers
  const [vmsSigns, setVmsSigns] = useState(VMS_SIGNS);
  const updateVmsSign = (signId, newText, newStatus = 'ACTIVE / OVERRIDDEN') => {
    setVmsSigns((prev) =>
      prev.map((s) =>
        s.id === signId
          ? { ...s, currentText: newText, status: newStatus, lastSync: 'Just now' }
          : s
      )
    );
  };

  // 3. Central Municipal Depots & Supply Inventory
  const [depotInventory, setDepotInventory] = useState(DEPOT_INVENTORY);
  const requestSupplyTransfer = (depotId, itemName, quantity) => {
    setDepotInventory((prev) =>
      prev.map((depot) =>
        depot.id === depotId
          ? {
              ...depot,
              items: depot.items.map((item) =>
                item.name === itemName
                  ? {
                      ...item,
                      currentStock: item.currentStock + quantity,
                      status: item.currentStock + quantity >= item.minThreshold ? 'SUFFICIENT' : 'TRANSFERRED',
                    }
                  : item
              ),
            }
          : depot
      )
    );
  };

  // 4. Evacuation Shelters & Relief Camps
  const [evacuationShelters, setEvacuationShelters] = useState(EVACUATION_SHELTERS);
  const updateShelterOccupancy = (shelterId, countDelta) => {
    setEvacuationShelters((prev) =>
      prev.map((sh) =>
        sh.id === shelterId
          ? {
              ...sh,
              currentOccupants: Math.max(0, Math.min(sh.totalCapacity, sh.currentOccupants + countDelta)),
              status:
                sh.currentOccupants + countDelta >= sh.totalCapacity
                  ? 'AT CAPACITY (FULL)'
                  : 'ACTIVE / RECEIVING',
            }
          : sh
      )
    );
  };

  // 5. Inter-Agency Task Force Desk
  const [interAgencies, setInterAgencies] = useState(INTER_AGENCIES);
  const toggleAgencyStatus = (agencyId, nextReadiness) => {
    setInterAgencies((prev) =>
      prev.map((ag) => (ag.id === agencyId ? { ...ag, readiness: nextReadiness } : ag))
    );
  };

  // 6. Chronological Shift Commander Operational Logbook
  const [commandLogs, setCommandLogs] = useState(INITIAL_COMMAND_LOGS);
  const addCommandLog = (entry) => {
    const newEntry = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      officer: entry.officer || 'Cmdr. Duty Officer (Ops Desk)',
      type: entry.type || 'OPERATIONAL_ORDER',
      details: entry.details,
      status: entry.status || 'EXECUTED',
    };
    setCommandLogs((prev) => [newEntry, ...prev]);
  };

  // 7. Emergency Audio Siren Alert System (Web Audio API Synthesizer)
  const [isSirenActive, setIsSirenActive] = useState(false);
  const toggleSiren = () => {
    setIsSirenActive((prev) => {
      const next = !prev;
      if (next && typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(440, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.4);
          osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.8);
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.2);
        } catch {
          // ignore if user hasn't interacted yet
        }
      }
      return next;
    });
  };

  // 8. Map Camera Fly-to & Focus Target
  const [mapFocusTarget, setMapFocusTarget] = useState(null);

  // 9. Mobile Dewatering Pumps Fleet (8 squads)
  const [mobilePumpsList, setMobilePumpsList] = useState([
    { id: 'PUMP-SQUAD-01', name: '500HP Turbo Dewatering Pump #01', location: 'Sion Circle Underbelly', status: 'ACTIVE DEWATERING', capacity: '1,800 m³/hr', fuel: '84%', assignedTo: 'Ward F/N' },
    { id: 'PUMP-SQUAD-02', name: '500HP Turbo Dewatering Pump #02', location: 'Andheri Subway Ingress', status: 'DEPLOYED RUNNING', capacity: '2,200 m³/hr', fuel: '79%', assignedTo: 'Ward K/E' },
    { id: 'PUMP-SQUAD-03', name: '350HP High-Head Pump #03', location: 'Milan Subway West Ramp', status: 'ACTIVE PUMPING', capacity: '1,400 m³/hr', fuel: '92%', assignedTo: 'Ward H/E' },
    { id: 'PUMP-SQUAD-04', name: '500HP Submersible Unit #04', location: 'Kurla West Station Road', status: 'EN ROUTE (ETA 5m)', capacity: '1,900 m³/hr', fuel: '95%', assignedTo: 'Ward L' },
    { id: 'PUMP-SQUAD-05', name: '300HP Trailer Pump #05', location: 'Hindmata Flyover Pit', status: 'ACTIVE PUMPING', capacity: '1,200 m³/hr', fuel: '68%', assignedTo: 'Ward G/N' },
    { id: 'PUMP-SQUAD-06', name: 'Heavy Sludge Pump #06', location: 'Dadar Western Rly Underpass', status: 'STANDBY READY', capacity: '1,600 m³/hr', fuel: '100%', assignedTo: 'Ward G/N' },
    { id: 'PUMP-SQUAD-07', name: 'Rapid Response Unit #07', location: 'Kanjurmarg Gandhi Nagar', status: 'EN ROUTE (ETA 8m)', capacity: '1,500 m³/hr', fuel: '88%', assignedTo: 'Ward S' },
    { id: 'PUMP-SQUAD-08', name: 'Coastal Reserve Pump #08', location: 'Mahim Bay Auxiliary Gate', status: 'STANDBY READY', capacity: '2,500 m³/hr', fuel: '96%', assignedTo: 'Disaster Pool' },
  ]);

  const dispatchMobilePump = (pumpId, targetLocation, assignedWard) => {
    setMobilePumpsList((prev) =>
      prev.map((p) =>
        p.id === pumpId
          ? {
              ...p,
              location: targetLocation,
              assignedTo: assignedWard || p.assignedTo,
              status: 'DEPLOYED & OPERATING',
              fuel: `${Math.max(40, parseInt(p.fuel) - 5)}%`,
            }
          : p
      )
    );
  };

  // Playback timer for 0-3h nowcast scrub animation
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setNowcastMinutes((prev) => {
          if (prev >= 180) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 15;
        });
      }, 1800 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  return (
    <FloodCommandContext.Provider
      value={{
        activeModule,
        setActiveModule,
        selectedWard,
        setSelectedWard,
        nowcastMinutes,
        setNowcastMinutes,
        isPlaying,
        setIsPlaying,
        playbackSpeed,
        setPlaybackSpeed,
        selectedRoad,
        setSelectedRoad,
        selectedNode,
        setSelectedNode,
        selectedIncident,
        setSelectedIncident,
        selectedAsset,
        setSelectedAsset,
        activeLayers,
        setActiveLayers,
        toggleLayer,
        setAllLayers,
        activeMapTool,
        setActiveMapTool,
        inspectedPoint,
        setInspectedPoint,
        rulerPoints,
        setRulerPoints,
        placedBarriers,
        addBarrier,
        removeBarrier,
        rescueFleet,
        dispatchRescueUnit,
        citizenReportsList,
        verifyCitizenReport,
        pumpingStationsList,
        boostPumpingStation,
        sluiceGatesList,
        toggleSluiceGate,
        activeSafeRoute,
        setActiveSafeRoute,
        scenarioParams,
        setScenarioParams,
        activeInterventions,
        toggleIntervention,
        incidentList,
        dispatchIncident,
        addIncident,
        updateIncident,
        resolveIncident,
        addIncidentTimelineEvent,
        batchUpdateIncidents,
        alertsList,
        publishAlert,
        revokeAlert,
        retransmitAlert,
        isCitizenView,
        setIsCitizenView,
        threatLevel,
        setThreatLevel,
        vmsSigns,
        updateVmsSign,
        depotInventory,
        requestSupplyTransfer,
        evacuationShelters,
        updateShelterOccupancy,
        interAgencies,
        toggleAgencyStatus,
        commandLogs,
        addCommandLog,
        isSirenActive,
        toggleSiren,
        mapFocusTarget,
        setMapFocusTarget,
        mobilePumpsList,
        dispatchMobilePump,
      }}
    >
      {children}
    </FloodCommandContext.Provider>
  );
}

export function useFloodCommand() {
  const context = useContext(FloodCommandContext);
  if (!context) {
    throw new Error('useFloodCommand must be used within a FloodCommandProvider');
  }
  return context;
}


