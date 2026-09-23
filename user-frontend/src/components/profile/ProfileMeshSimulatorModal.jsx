import React, { useState, useEffect } from 'react';
import { 
  Radio, WifiOff, Share2, Users, Send, CheckCircle2, 
  X, Sparkles, Shield, Cpu, RefreshCw, AlertCircle
} from 'lucide-react';

export default function ProfileMeshSimulatorModal({ isOpen, onClose, userWard, citizenName, speakAlert }) {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastLog, setBroadcastLog] = useState([]);
  const [nearbyNodes, setNearbyNodes] = useState([
    { id: 'node-1', name: 'Citizen-Matunga-402', distanceM: 45, rssi: -62, status: 'Safe', hops: 1 },
    { id: 'node-2', name: 'BMC-Ward-Sensor-L9', distanceM: 110, rssi: -78, status: 'Active Telemetry', hops: 1 },
    { id: 'node-3', name: 'Dadar-Bridge-Repeater', distanceM: 280, rssi: -84, status: 'Relay Active', hops: 2 },
    { id: 'node-4', name: 'Community-Rescue-4x4', distanceM: 340, rssi: -89, status: 'Mobile Node', hops: 2 }
  ]);

  if (!isOpen) return null;

  const handleBroadcastBeacon = () => {
    setIsBroadcasting(true);
    const packet = {
      timestamp: new Date().toLocaleTimeString(),
      origin: citizenName,
      ward: userWard,
      status: 'SAFE / STATUS OK',
      packetId: 'MESH-' + Math.floor(1000 + Math.random() * 9000),
      frequency: '868 MHz LoRa ISM'
    };
    
    speakAlert("Offline emergency mesh packet broadcasted to 4 nearby hops.");
    
    setTimeout(() => {
      setBroadcastLog(prev => [packet, ...prev.slice(0, 4)]);
      setIsBroadcasting(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-ink rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-purple-soft text-purple-primary rounded-2xl">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-ink">Offline P2P Mesh Network Simulator</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                LORA / BLE
              </span>
            </div>
            <p className="text-xs text-muted">
              Peer-to-peer ad-hoc relay when 4G/5G mobile towers collapse during cloudburst events.
            </p>
          </div>
        </div>

        {/* Mesh Status Banner */}
        <div className="p-4 rounded-2xl bg-canvas border border-slate-200/80 mb-5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-muted uppercase font-bold block">Local Ward Mesh Cluster</span>
            <div className="text-sm font-extrabold text-ink flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              {nearbyNodes.length} Active Nodes Discovered in {userWard}
            </div>
          </div>
          <button
            type="button"
            disabled={isBroadcasting}
            onClick={handleBroadcastBeacon}
            className="px-3.5 py-2 bg-purple-primary hover:bg-purple-deep disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            {isBroadcasting ? 'Broadcasting...' : 'Send Mesh Beacon'}
          </button>
        </div>

        {/* Nodes Grid */}
        <div className="space-y-2 mb-5">
          <span className="text-xs font-mono uppercase text-muted font-bold block">Direct Radio Peers (Hops & Signal)</span>
          {nearbyNodes.map(node => (
            <div key={node.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Cpu className="w-4 h-4 text-purple-primary shrink-0" />
                <div>
                  <span className="font-bold text-ink block">{node.name}</span>
                  <span className="text-[10px] font-mono text-slate-500">{node.hops} hop away • {node.status}</span>
                </div>
              </div>
              <div className="text-right font-mono text-[11px]">
                <span className="text-slate-800 font-bold block">{node.distanceM}m</span>
                <span className="text-emerald-600 font-bold">{node.rssi} dBm</span>
              </div>
            </div>
          ))}
        </div>

        {/* Broadcast Packet History */}
        {broadcastLog.length > 0 && (
          <div className="mb-5">
            <span className="text-xs font-mono uppercase text-muted font-bold block mb-1.5">Recent Mesh Packets</span>
            <div className="space-y-1.5">
              {broadcastLog.map((pkt, idx) => (
                <div key={idx} className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-mono text-emerald-900 flex justify-between">
                  <span>[{pkt.timestamp}] {pkt.packetId} ({pkt.origin})</span>
                  <span className="font-bold text-emerald-700">ACK by 4 nodes</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition"
          >
            Close Mesh Monitor
          </button>
        </div>
      </div>
    </div>
  );
}

