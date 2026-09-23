import React from 'react';
import { useFlood } from '../../context/FloodContext';
import { WifiOff, ShieldCheck, Download, PhoneCall } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';

export default function OfflineBanner() {
  const { isOfflineMode, setIsOfflineMode } = useFlood();
  const { setActivePage } = useNavigation();

  if (!isOfflineMode) return null;

  return (
    <div className="bg-amber-500 text-white px-4 py-2.5 shadow-md border-b border-amber-600 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-black/20">
            <WifiOff className="w-4 h-4 text-white" />
          </div>
          <div>
            <strong className="font-bold">LOW-CONNECTIVITY / OFFLINE CACHE MODE ACTIVE: </strong>
            <span className="opacity-95">Last synchronized 2m ago. Essential flood vectors, emergency helplines & safe routes remain 100% available offline.</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => setActivePage('emergency')}
            className="px-2.5 py-1 rounded bg-white text-amber-900 font-bold hover:bg-amber-50 transition shadow-sm"
          >
            Emergency Hub
          </button>
          <button 
            onClick={() => setIsOfflineMode(false)}
            className="px-2.5 py-1 rounded bg-black/20 hover:bg-black/30 font-semibold transition"
          >
            Reconnect
          </button>
        </div>
      </div>
    </div>
  );
}

