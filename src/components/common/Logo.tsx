import React from 'react';
import { getAssetUrl } from '../../utils/assetUrl';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'dark' | 'light'; // dark = for dark backgrounds (white text), light = for light backgrounds (navy text)
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  theme = 'light',
}) => {
  // Dimension scales
  const dimensions = {
    sm: {
      image: 'w-8 h-8 sm:w-9 sm:h-9',
      title: 'text-xl sm:text-2xl',
      subtitle: 'text-[9px] sm:text-[10px]',
      gap: 'gap-2 sm:gap-2.5',
    },
    md: {
      image: 'w-10 h-10 sm:w-12 sm:h-12',
      title: 'text-2xl sm:text-3xl',
      subtitle: 'text-[10px] sm:text-[11px]',
      gap: 'gap-2.5 sm:gap-3',
    },
    lg: {
      image: 'w-12 h-12 sm:w-14 sm:h-14',
      title: 'text-3xl sm:text-4xl',
      subtitle: 'text-xs sm:text-sm',
      gap: 'gap-3 sm:gap-3.5',
    },
  };

  const currentDim = dimensions[size];
  const mainTextColor = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const subTextColor = theme === 'dark' ? 'text-slate-300' : 'text-slate-600';

  return (
    <div className={`inline-flex items-center ${currentDim.gap} select-none group ${className}`}>
      {/* Official Toter Moving Logistics Symbol */}
      <img
        src={getAssetUrl('/images/dynamic-t-logistics-logo.png')}
        alt="Toter Logo Symbol"
        className={`${currentDim.image} object-contain rounded-full shrink-0 group-hover:scale-105 transition-transform duration-200 drop-shadow-sm`}
        loading="eager"
      />

      {/* Brand Text: Bold modern TOTER with PACKERS & MOVERS subtitle */}
      <div className="flex flex-col justify-center leading-none">
        <span
          className={`${currentDim.title} font-black italic tracking-wider uppercase font-sans ${mainTextColor} flex items-baseline`}
        >
          TOT<span className="text-[#FF6B00]">ER</span>
        </span>
        <span
          className={`${currentDim.subtitle} uppercase font-extrabold tracking-[0.2em] ${subTextColor} mt-1`}
        >
          PACKERS &amp; MOVERS
        </span>
      </div>
    </div>
  );
};
