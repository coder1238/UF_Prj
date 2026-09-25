import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WARDS_DATA, TIMELINE_SLICES, ROAD_SEGMENTS, HAZARDS_DATA } from '../data/floodData';
import { getWards } from '../api/wards';
import { getRoads } from '../api/roads';
import { getReports, submitReport } from '../api/reports';
import { useScenarioSocket } from '../api/websocket';

const FloodContext = createContext();

export function FloodProvider({ children }) {
  const [wardsData, setWardsData] = useState(WARDS_DATA);
  const [roadsData, setRoadsData] = useState(ROAD_SEGMENTS);
  const [liveReports, setLiveReports] = useState([]);
  const [isLiveBackend, setIsLiveBackend] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [hasScenarioTick, setHasScenarioTick] = useState(false);
  const [selectedWardId, setSelectedWardId] = useState('ward-l');
  const [timelineIndex, setTimelineIndex] = useState(0); // 0 = NOW, 1 = +30m, 2 = +60m, 3 = +90m, 4 = +120m, 5 = +180m
  const [vehicleType, setVehicleType] = useState('sedan'); // 'sedan' | 'two-wheeler' | 'suv' | 'pedestrian'
  const [clearanceThreshold, setClearanceThreshold] = useState(15); // cm
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [voiceLanguage, setVoiceLanguage] = useState('en'); // 'en' | 'hi' | 'mr'
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');

  const currentWard = wardsData.find(w => w.id === selectedWardId) || wardsData[0] || WARDS_DATA[0];
  const currentTimeline = TIMELINE_SLICES[timelineIndex];

  const mapWard = (ward) => {
    const base = WARDS_DATA.find((item) => item.id === ward.id) || {};
    return {
      ...base,
      ...ward,
      defaultCenter: { lat: ward.lat, lng: ward.lng },
      risk: ward.risk_level,
      currentWater: ward.current_water_cm,
      peakWater: ward.peak_water_cm,
      rainRate: ward.rain_rate_mmhr,
      population: Number(ward.population).toLocaleString('en-US'),
      vulnerableSpots: ward.vulnerable_spots,
    };
  };
  const mapRoad = (road, bases = ROAD_SEGMENTS) => {
    const base = bases.find((item) => item.id === road.id) || {};
    const roadStatus = { open: 'CLEAR', restricted: 'RESTRICTED', flooded: 'CRITICAL', closed: 'CLOSED' }[road.status] || road.status;
    const coords = road.geometry_geojson?.[0];
    return {
      ...base,
      ...road,
      ward: base.ward || road.ward_id,
      status: roadStatus,
      risk: road.risk_level || base.risk,
      currentDepth: road.current_depth_cm ?? base.currentDepth ?? 0,
      coordinates: base.coordinates || (coords ? { lat: coords[1], lng: coords[0] } : undefined),
    };
  };
  const mapReport = (report, wards = wardsData) => {
    const ward = wards.find((item) => item.id === report.ward_id);
    const status = { submitted: 'submitted', under_review: 'submitted', verified: 'in_progress', rejected: 'resolved', resolved: 'resolved' }[report.status] || report.status;
    return {
      id: report.id, title: report.title, category: report.category, severity: report.severity,
      description: report.description, location: report.title, ward: ward?.name || report.ward_id,
      timestamp: report.submitted_at, submittedAt: report.submitted_at,
      isoTimestamp: report.submitted_at, coordinates: { lat: report.lat, lng: report.lng },
      verified: ['verified', 'resolved'].includes(report.status), verificationSource: report.verification_source,
      status, statusColor: status === 'resolved' ? 'green' : status === 'in_progress' ? 'amber' : 'blue',
      depth: 0, initialDepth: 0, estimatedDepth: 0, upvotes: 0, photoUrl: report.photo_url,
    };
  };

  const refetchReports = useCallback(async () => {
    const reports = await getReports();
    setLiveReports(reports);
    const records = reports.map((report) => mapReport(report));
    let publishedRecords = records;
    if (typeof window !== 'undefined') {
      try {
        const key = 'urban_flood_citizen_reports';
        const stored = JSON.parse(window.localStorage.getItem(key) || '[]');
        const storedById = new Map(stored.map((record) => [record.id, record]));
        publishedRecords = [
          ...records.map((record) => {
            const previous = storedById.get(record.id) || {};
            storedById.delete(record.id);
            return { ...previous, ...record, depth: previous.depth || record.depth, initialDepth: previous.initialDepth || previous.depth || record.depth, estimatedDepth: previous.estimatedDepth || previous.depth || record.depth, photoUrl: record.photoUrl || previous.photoUrl };
          }),
          ...storedById.values(),
        ];
        window.localStorage.setItem(key, JSON.stringify(publishedRecords));
      } catch (error) {
        // Private browsing or disabled storage should not prevent API report refreshes.
      }
      window.dispatchEvent(new CustomEvent('urbanflood_reports_updated', { detail: publishedRecords }));
    }
    return reports;
  }, []);

  const submitReportToBackend = useCallback(async (payload) => {
    const result = await submitReport(payload);
    refetchReports().catch(() => console.warn('[FloodContext] Backend unreachable, using local mock data'));
    return result;
  }, [refetchReports]);

  useEffect(() => {
    let active = true;
    Promise.all([getWards(), getRoads()]).then(async ([wards, roads]) => {
      if (!active) return;
      setWardsData(wards.map(mapWard));
      setRoadsData(roads.map((road) => mapRoad(road)));
      setIsLiveBackend(true);
      await refetchReports();
    }).catch(() => {
      if (!active) return;
      console.warn('[FloodContext] Backend unreachable, using local mock data');
      setWardsData(WARDS_DATA);
      setRoadsData(ROAD_SEGMENTS);
      setIsLiveBackend(false);
    });
    return () => { active = false; };
  }, []);

  const handleSocketMessage = useCallback((event) => {
    if (event.type === 'scenario_tick') {
      setHasScenarioTick(true);
      if (Array.isArray(event.wards)) {
        setWardsData((previous) => previous.map((ward) => {
          const update = event.wards.find((item) => item.id === ward.id);
          return update ? { ...ward, risk: update.risk_level, risk_level: update.risk_level, currentWater: update.current_water_cm, current_water_cm: update.current_water_cm, rainRate: update.rain_rate_mmhr, rain_rate_mmhr: update.rain_rate_mmhr } : ward;
        }));
      }
      if (Array.isArray(event.roads_changed)) {
        setRoadsData((previous) => previous.map((road) => {
          const update = event.roads_changed.find((item) => item.id === road.id);
          return update ? mapRoad({ ...road, ...update, risk_level: road.risk_level, current_depth_cm: update.current_depth_cm }) : road;
        }));
      }
      const index = TIMELINE_SLICES.findIndex((slice) => slice.id === (event.step === 0 ? 'now' : `${event.step}m`));
      if (index >= 0) setTimelineIndex(index);
    } else if (event.type === 'report_update') {
      refetchReports().catch(() => console.warn('[FloodContext] Backend unreachable, using local mock data'));
    }
  }, [refetchReports]);
  const handleSocketStatus = useCallback((connected) => setSocketConnected(connected), []);
  useScenarioSocket(handleSocketMessage, handleSocketStatus);

  // Dynamic calculations based on timeline
  const activeRoads = socketConnected && hasScenarioTick
    ? roadsData.map((road) => ({ ...road, simulatedDepth: road.current_depth_cm ?? road.currentDepth, isPassable: (road.current_depth_cm ?? road.currentDepth ?? 0) <= clearanceThreshold }))
    : ROAD_SEGMENTS.map(road => {
      // Preserve the local timeline calculation when the live scenario socket is unavailable.
      const factor = timelineIndex === 0 ? 1 : timelineIndex === 1 ? 1.2 : timelineIndex === 2 ? 1.4 : timelineIndex === 3 ? 1.6 : timelineIndex === 4 ? 1.8 : 1.1;
      const adjustedDepth = Math.round(road.currentDepth * factor);
      const isPassable = adjustedDepth <= clearanceThreshold;
      return { ...road, simulatedDepth: adjustedDepth, isPassable };
    });

  // Speech helper using Web Speech API
  const speakAlert = (text) => {
    if (!isVoiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (voiceLanguage === 'hi') {
        utterance.lang = 'hi-IN';
      } else if (voiceLanguage === 'mr') {
        utterance.lang = 'mr-IN';
      } else {
        utterance.lang = 'en-IN';
      }
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis unavailable:', e);
    }
  };

  // High contrast mode class toggle
  useEffect(() => {
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [isHighContrast]);

  return (
    <FloodContext.Provider value={{
      selectedWardId,
      setSelectedWardId,
      currentWard,
      wards: wardsData,
      roads: roadsData,
      liveReports,
      isLiveBackend,
      refetchReports,
      submitReportToBackend,
      timelineIndex,
      setTimelineIndex,
      currentTimeline,
      timelineSlices: TIMELINE_SLICES,
      activeRoads,
      hazards: HAZARDS_DATA,
      vehicleType,
      setVehicleType,
      clearanceThreshold,
      setClearanceThreshold,
      vehicleClearance: clearanceThreshold,
      setVehicleClearance: setClearanceThreshold,
      isVoiceEnabled,
      setIsVoiceEnabled,
      voiceLanguage,
      setVoiceLanguage,
      isHighContrast,
      setIsHighContrast,
      isLargeText,
      setIsLargeText,
      isReducedMotion,
      setIsReducedMotion,
      isOfflineMode,
      setIsOfflineMode,
      notificationCount,
      setNotificationCount,
      searchQuery,
      setSearchQuery,
      speakAlert
    }}>
      {children}
    </FloodContext.Provider>
  );
}

export function useFlood() {
  const context = useContext(FloodContext);
  if (!context) throw new Error('useFlood must be used within FloodProvider');
  return context;
}
