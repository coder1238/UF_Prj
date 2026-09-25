import React from 'react';
import { Droplets } from 'lucide-react';

export default function UrbanFloodCommandLogo({ compact = false, className = '' }) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple to-purple-deep text-white shadow-elevated"><Droplets className="h-6 w-6" strokeWidth={1.8} /></div>
      {!compact && <div className="flex flex-col text-left"><span className="text-sm font-extrabold leading-tight tracking-tight text-ink">URBANFLOOD COMMAND</span><span className="mt-1 text-[11px] font-medium leading-tight text-ink-secondary">Municipal Operations Center</span></div>}
    </div>
  );
}
