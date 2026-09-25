import React from 'react';
import { Link } from 'react-router-dom';

export default function UrbanFloodLogo({ 
  variant = 'full', 
  onClick, 
  size = 'md',
  showBadge = true,
  className = '' 
}) {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const svgSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7'
  };

  return (
    <Link 
      to="/" 
      onClick={onClick}
      className={`inline-flex items-center gap-3 group transition-transform active:scale-95 ${className}`}
    >
      {/* Signature Hydrodynamic Water Wave & Radar Emblem */}
      <div className={`${iconSizes[size] || iconSizes.md} rounded-xl bg-gradient-to-br from-[#6D4AFF] via-[#5835E5] to-[#38256B] flex items-center justify-center text-white shadow-md shadow-[#6D4AFF]/25 group-hover:shadow-lg group-hover:shadow-[#6D4AFF]/35 transition-all shrink-0`}>
        <svg 
          className={`${svgSizes[size] || svgSizes.md}`} 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Water Droplet Contour */}
          <path 
            d="M12 2.5C12 2.5 5 10.2 5 15.2C5 19.066 8.134 22.2 12 22.2C15.866 22.2 19 19.066 19 15.2C19 10.2 12 2.5 12 2.5Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          {/* Inner Fluid Elevation Wave 1 */}
          <path 
            d="M8.5 15.5C9.5 14.5 10.5 14.5 12 15.5C13.5 16.5 14.5 16.5 15.5 15.5" 
            stroke="currentColor" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
          />
          {/* Inner Fluid Elevation Wave 2 */}
          <path 
            d="M7.5 18C9 17 10.5 17 12 18C13.5 19 15 19 16.5 18" 
            stroke="#EEE9FF" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeOpacity="0.8" 
          />
          {/* Center Precision Sensor Beacon */}
          <circle cx="12" cy="11" r="1.75" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Brand Typography */}
      {variant !== 'icon-only' && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-extrabold text-[15px] sm:text-base tracking-tight text-[#18151F] leading-none">
              URBAN FLOOD
            </span>
            <span className="font-bold text-[12px] sm:text-[13px] tracking-wider text-[#6D4AFF] leading-none">
              INTELLIGENCE
            </span>
            {showBadge && (
              <span className="text-[9px] bg-[#EEE9FF] text-[#38256B] px-1.5 py-0.5 rounded font-mono font-bold tracking-wider uppercase border border-[#6D4AFF]/20">
                CITIZEN
              </span>
            )}
          </div>
          {variant === 'full' && (
            <span className="text-[11px] text-[#716C7C] font-medium mt-1 leading-none tracking-normal">
              Know the water before you meet it.
            </span>
          )}
        </div>
      )}
    </Link>
  );
}

