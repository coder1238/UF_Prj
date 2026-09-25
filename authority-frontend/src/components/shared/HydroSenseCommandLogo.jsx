import React from 'react';
export default function HydroSenseCommandLogo({ compact = false, className = '' }) {
  if (!compact) return <img src="/branding/hydrosense-logo-full.png" alt="HydroSense" className={`h-32 w-32 object-contain ${className}`} />;
  return <div className={`inline-flex items-center gap-2.5 ${className}`}><img src="/branding/hydrosense-icon.png" alt="" aria-hidden="true" className="h-10 w-10 object-contain" /><span className="text-sm font-extrabold tracking-tight text-ink">HydroSense</span></div>;
}
