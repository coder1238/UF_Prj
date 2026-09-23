import React, { useState, useEffect } from 'react';
import { 
  Radio, WifiOff, Share2, Send, Cpu, CheckCircle2, 
  RefreshCw, X, Shield, ArrowRight, Zap 
} from 'lucide-react';
import { emergencyAudio } from './EmergencyAudioSynthesizer';

export default function OfflineMeshSimulatorModal({ isOpen, onClose }) {
  const [meshMessage, setMeshMessage] = useState('SOS: Trapped on 1st Floor, water level rising rapidly. Require rescue raft.');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [hopProgress, setHopProgress] = useState(0); // 0 = idle, 1 = node 1, 2 = node 2, 3 = gateway
  const [packetsSent, setPacketsSent] = useState(3);

  const [nodes, setNodes] = useState([
    { id: 'NODE-K09', name: 'Citizen Peer (Kurla West)', distance: '45m', rssi: '-58 dBm', battery: '82%', hops: 1, status: 'ONLINE' },
    { id: 'NODE-S12', name: 'Ham Radio Relay (Sion Station)', distance: '120m', rssi: '-72 dBm', battery: '95%', hops: 2, status: 'ONLINE' },
    { id: 'NODE-B04', name: 'BMC Disaster LoRa Gateway', distance: '340m', rssi: '-84 dBm', battery: 'AC Mains', hops: 3, status: 'GATEWAY' }
  ]);

  if (!isOpen) return null;

  const handleBroadcast = () => {
    if (!meshMessage.trim()) return;
    setIsBroadcasting(true);
    setHopProgress(1);
    emergencyAudio.playRadioBurst();

    setTimeout(() => {
      setHopProgress(2);
      emergencyAudio.playCountdownBeep(700);
    }, 1200);

    setTimeout(() => {
      setHopProgress(3);
      emergencyAudio.playCountdownBeep(980);
      setIsBroadcasting(false);
      setPacketsSent(prev => prev + 1);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">Feature #04</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 text-[10px] font-mono border border-cyan-800">
                  Zero-Tower Ad-Hoc Protocol
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">Offline P2P Mesh Distress Network</h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          <div className="p-3.5 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-cyan-300">
              <WifiOff className="w-4 h-4 text-cyan-400" />
              <span>Cellular 4G/5G Towers: <strong>DISCONNECTED</strong></span>
            </div>
            <span className="text-emerald-400 font-bold">Mesh Active (868 MHz LoRa)</span>
          </div>

          {/* Active Relays */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-slate-400 font-bold">
              Detected P2P Neighbor Nodes in 500m Vicinity:
            </span>
            <div className="space-y-2">
              {nodes.map((node, i) => (
                <div 
                  key={node.id}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono transition-all ${
                    hopProgress >= (i + 1)
                      ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${node.status === 'GATEWAY' ? 'bg-purple-400' : 'bg-cyan-400'}`} />
                    <span className="font-bold">{node.name}</span>
                    <span className="text-[10px] text-slate-400">({node.distance})</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-slate-400">RSSI: {node.rssi}</span>
                    <span className="text-emerald-400 font-bold">{node.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hop Visualizer */}
          {isBroadcasting && (
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs font-mono text-cyan-400">
                <Zap className="w-4 h-4 animate-bounce" />
                <span>Hopping Packet: Hop {hopProgress} of 3...</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-cyan-500 h-full transition-all duration-500" 
                  style={{ width: `${(hopProgress / 3) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Distress Payload Box */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-slate-400 font-bold">
              Compose Ad-Hoc Distress Packet (Compressed 128-byte frame):
            </label>
            <textarea
              rows={2}
              value={meshMessage}
              onChange={(e) => setMeshMessage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-mono text-slate-400">
              Total Packets Relayed: <strong className="text-cyan-400">{packetsSent}</strong>
            </span>
            <button
              onClick={handleBroadcast}
              disabled={isBroadcasting}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white font-mono font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>{isBroadcasting ? 'Propagating Mesh...' : 'Broadcast Over P2P Mesh'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

