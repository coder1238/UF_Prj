import React from 'react';
import { Link } from 'react-router-dom';

export default function HydroSenseLogo({ 
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

  return (
    <Link 
      to="/" 
      onClick={onClick}
      className={`inline-flex items-center gap-3 group transition-transform active:scale-95 ${className}`}
    >
      <img
        src="/branding/hydrosense-icon.png"
        alt=""
        aria-hidden="true"
        className={`${iconSizes[size] || iconSizes.md} object-contain shrink-0`}
      />

      {/* Brand Typography */}
      {variant !== 'icon-only' && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-extrabold text-[15px] sm:text-base tracking-tight text-[#0877BD] leading-none">
              HydroSense
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
