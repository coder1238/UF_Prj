import React, { createContext, useContext, useState, useEffect } from 'react';
import { WARDS_DATA, TIMELINE_SLICES, ROAD_SEGMENTS, HAZARDS_DATA } from '../data/floodData';

const FloodContext = createContext();

export function FloodProvider({ children }) {
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

  const currentWard = WARDS_DATA.find(w => w.id === selectedWardId) || WARDS_DATA[0];
  const currentTimeline = TIMELINE_SLICES[timelineIndex];

  // Dynamic calculations based on timeline
  const activeRoads = ROAD_SEGMENTS.map(road => {
    // scale depth based on timeline progression
    const factor = timelineIndex === 0 ? 1 : timelineIndex === 1 ? 1.2 : timelineIndex === 2 ? 1.4 : timelineIndex === 3 ? 1.6 : timelineIndex === 4 ? 1.8 : 1.1;
    const adjustedDepth = Math.round(road.currentDepth * factor);
    const isPassable = adjustedDepth <= clearanceThreshold;
    return {
      ...road,
      simulatedDepth: adjustedDepth,
      isPassable
    };
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

