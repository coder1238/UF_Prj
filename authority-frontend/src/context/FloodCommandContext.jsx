import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
import { getWards } from '../api/wards';
import { getRoads } from '../api/roads';
import { getIncidents } from '../api/incidents';
import { getAlerts } from '../api/alerts';
import { getShelters } from '../api/shelters';
import { getTeams } from '../api/teams';
import { getReports, verifyReport as verifyBackendReport } from '../api/reports';
import { login as loginRequest, setSessionToken } from '../api/auth';
import { activateScenario as activateBackendScenario, resetScenario as resetBackendScenario } from '../api/scenario';
import { useScenarioSocket } from '../api/websocket';

const FloodCommandContext = createContext();

const wardShortName = (id = '') => ({
  'ward-l': 'Ward L', 'ward-k-west': 'Ward K-West', 'ward-k-east': 'Ward K-East',
  'ward-h-west': 'Ward H-West', 'ward-g-north': 'Ward G-North', 'ward-f-north': 'Ward F-North', 'ward-a': 'Ward A',
}[id] || id);

function mapAuthorityReport(report) {
  const status = ({ submitted: 'PENDING VERIFICATION', under_review: 'UNDER REVIEW', verified: 'OFFICIALLY VERIFIED & SQUAD EN ROUTE', rejected: 'REJECTED', resolved: 'RESOLVED BY FIELD PUMPING' })[report.status] || report.status;
  return { id: report.id, title: report.title, location: report.title, ward: wardShortName(report.ward_id), user: report.reporter_name || 'Citizen reporter', timestamp: report.submitted_at, reportedDepth: 'Not provided', comment: report.description, votes: 0, status, severity: report.severity, coordinates: [report.lat, report.lng] };
}

function mapAuthorityIncident(incident, reports = [], base = []) {
  const report = reports.find((item) => item.id === incident.report_id);
  const original = base.find((item) => item.id === incident.id || item.id === incident.report_id) || {};
  const severity = typeof incident.severity === 'number' ? (incident.severity >= 5 ? 'Critical' : incident.severity >= 4 ? 'High' : incident.severity >= 3 ? 'Moderate' : 'Low') : incident.severity;
  const status = ({ open: 'TRIAGE QUEUE', assigned: 'CREW DEPLOYED / EN ROUTE', in_progress: 'CREW DEPLOYED / EN ROUTE', resolved: 'RESOLVED / ALL CLEAR' })[incident.status] || incident.status;
  return { ...original, id: incident.id, reportId: incident.report_id, title: report?.title || original.title || incident.category, location: report?.title || original.location || 'Mumbai ward incident', ward: wardShortName(report?.ward_id), severity, status, depth: original.depth || 0, peopleAffected: incident.people_affected, priorityScore: incident.priority_score, priorityBreakdown: incident.priority_breakdown, coordinates: report ? [report.lat, report.lng] : original.coordinates || [19.05, 72.85], timeline: original.timeline || [] };
}

function mapAuthorityAlert(alert) {
  const severity = String(alert.severity || '').toLowerCase();
  const title = severity === 'critical' ? `FLASH FLOOD WARNING: ${alert.title}` : severity === 'high' ? `FLOOD WATCH: ${alert.title}` : `RAIN ADVISORY: ${alert.title}`;
  return { id: alert.id, title, message: alert.message, wards: alert.ward_id ? [wardShortName(alert.ward_id)] : ['Citywide'], status: 'PUBLISHED - ACTIVE', timestamp: alert.issued_at, audienceReach: 'Ward residents', channels: ['Citizen App'], source: alert.source, severity };
}

function mapAuthorityShelter(shelter) {
  return { id: shelter.id, name: shelter.name, ward: wardShortName(shelter.ward_id), type: shelter.type, currentOccupants: shelter.total_capacity - shelter.available_capacity, totalCapacity: shelter.total_capacity, status: 'ACTIVE / RECEIVING', hasPowerBackup: shelter.has_power_backup, hasMedicalStaff: shelter.has_medical_staff, coordinates: [shelter.lat, shelter.lng] };
}

function mapAuthorityTeam(team) {
  return { id: team.id, name: team.name, type: team.team_type, capacity: team.capacity, status: String(team.availability || 'available').toUpperCase(), coordinates: [team.current_lat, team.current_lng], equipment: team.equipment };
}

export function FloodCommandProvider({ children }) {
  const [authToken, setAuthToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLiveBackend, setIsLiveBackend] = useState(false);
  const [backendWards, setBackendWards] = useState(null);
  const [backendRoads, setBackendRoads] = useState(null);
  const [backendTeams, setBackendTeams] = useState(null);
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
  const verifyCitizenReport = async (reportId, newStatus) => {
    setCitizenReportsList((prev) =>
      prev.map((rep) => (rep.id === reportId ? { ...rep, status: newStatus } : rep))
    );
    try {
      const action = String(newStatus).toLowerCase().includes('reject') ? 'reject' : String(newStatus).toLowerCase().includes('escalat') ? 'escalate' : 'verify';
      await verifyBackendReport(reportId, action, authToken);
    } catch (error) {
      console.warn('[FloodCommandContext] Backend unreachable, using local mock data');
    }
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

  const refreshAuthorityReports = useCallback(async () => {
    const [reports, incidents] = await Promise.all([getReports(), getIncidents()]);
    setCitizenReportsList(reports.map(mapAuthorityReport));
    const mappedIncidents = incidents.map((incident) => mapAuthorityIncident(incident, reports, INCIDENTS));
    setIncidentList(mappedIncidents);
    setSelectedIncident((previous) => mappedIncidents.find((incident) => incident.id === previous?.id) || mappedIncidents[0] || previous);
    return reports;
  }, []);

  const login = useCallback(async (username, password) => {
    try {
      const result = await loginRequest(username, password);
      setAuthToken(result.access_token);
      setSessionToken(result.access_token);
      setCurrentUser(result.user);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message || 'Unable to sign in' };
    }
  }, []);

  const logout = useCallback(() => {
    setAuthToken(null);
    setSessionToken(null);
    setCurrentUser(null);
  }, []);

  const activateScenario = useCallback(async () => {
    if (!authToken) throw new Error('Sign in to activate the scenario');
    const result = await activateBackendScenario(authToken);
    setNowcastMinutes(0);
    setIsPlaying(false);
    return result;
  }, [authToken]);

  const resetScenario = useCallback(async () => {
    if (!authToken) throw new Error('Sign in to reset the scenario');
    const result = await resetBackendScenario(authToken);
    setNowcastMinutes(0);
    setIsPlaying(false);
    const [wards, roads] = await Promise.all([getWards(), getRoads()]);
    setBackendWards(wards);
    setBackendRoads(roads);
    return result;
  }, [authToken]);

  const handleBackendMessage = useCallback((event) => {
    if (event.type === 'scenario_tick') {
      setNowcastMinutes(event.step || 0);
      setIsPlaying(false);
      setScenarioParams((previous) => ({ ...previous, rainfallIntensity: event.rainfall_intensity_mmhr ?? previous.rainfallIntensity }));
      if (Array.isArray(event.wards)) setBackendWards((previous) => (previous || []).map((ward) => {
        const update = event.wards.find((item) => item.id === ward.id);
        return update ? { ...ward, ...update } : ward;
      }));
      if (Array.isArray(event.roads_changed)) {
        setBackendRoads((previous) => (previous || []).map((road) => {
          const update = event.roads_changed.find((item) => item.id === road.id);
          return update ? { ...road, ...update } : road;
        }));
        setSelectedRoad((previous) => {
          const update = event.roads_changed.find((item) => item.id === previous?.id);
          if (!update) return previous;
          const status = { open: 'OPEN / CLEAR', restricted: 'CAUTION', flooded: 'CRITICAL', closed: 'CRITICAL' }[update.status] || update.status;
          return { ...previous, status, currentDepth: update.current_depth_cm ?? previous.currentDepth };
        });
      }
    } else if (event.type === 'report_update') {
      refreshAuthorityReports().catch(() => console.warn('[FloodCommandContext] Backend unreachable, using local mock data'));
    } else if (event.type === 'incident_update') {
      getIncidents().then((items) => {
        const mappedIncidents = items.map((item) => mapAuthorityIncident(item, [], INCIDENTS));
        setIncidentList(mappedIncidents);
        setSelectedIncident((previous) => mappedIncidents.find((incident) => incident.id === previous?.id) || mappedIncidents[0] || previous);
      })
        .catch(() => console.warn('[FloodCommandContext] Backend unreachable, using local mock data'));
    }
  }, [refreshAuthorityReports]);
  useScenarioSocket(handleBackendMessage);

  useEffect(() => {
    let active = true;
    Promise.all([getWards(), getRoads(), getIncidents(), getAlerts(), getShelters(), getTeams(), getReports()])
      .then(([wards, roads, incidents, alerts, shelters, teams, reports]) => {
        if (!active) return;
        setBackendWards(wards);
        setBackendRoads(roads);
        setBackendTeams(teams);
        setIsLiveBackend(true);
        const mappedIncidents = incidents.map((incident) => mapAuthorityIncident(incident, reports, INCIDENTS));
        setIncidentList(mappedIncidents);
        setSelectedIncident((previous) => mappedIncidents.find((incident) => incident.id === previous?.id) || mappedIncidents[0] || previous);
        setCitizenReportsList(reports.map(mapAuthorityReport));
        setAlertsList(alerts.map(mapAuthorityAlert));
        setEvacuationShelters(shelters.map(mapAuthorityShelter));
        setRescueFleet(teams.map(mapAuthorityTeam));
        if (roads.length) {
          const road = roads[0];
          const normalizedName = road.name.toLowerCase().replace(/[^a-z0-9]/g, '');
          const base = ROAD_CORRIDORS.find((item) => item.id === road.id)
            || ROAD_CORRIDORS.find((item) => normalizedName.includes(item.name.split('(')[0].toLowerCase().replace(/[^a-z0-9]/g, '')))
            || ROAD_CORRIDORS.find((item) => normalizedName.includes('subway') && item.name.toLowerCase().includes('subway'))
            || ROAD_CORRIDORS[0] || {};
          const state = { open: 'OPEN / CLEAR', restricted: 'CAUTION', flooded: 'CRITICAL', closed: 'CRITICAL' }[road.status] || road.status;
          setSelectedRoad({ ...base, ...road, ward: wardShortName(road.ward_id), status: state, currentDepth: road.current_depth_cm, coordinates: road.geometry_geojson?.[0] ? [road.geometry_geojson[0][1], road.geometry_geojson[0][0]] : base.coordinates });
        }
      })
      .catch(() => {
        if (!active) return;
        console.warn('[FloodCommandContext] Backend unreachable, using local mock data');
        setIsLiveBackend(false);
      });
    return () => { active = false; };
  }, []);

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
        authToken,
        currentUser,
        login,
        logout,
        isLiveBackend,
        wardsData: backendWards,
        roadsData: backendRoads,
        teamsData: backendTeams,
        activateScenario,
        resetScenario,
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
