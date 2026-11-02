import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'dark' | 'light'; // dark means dark bg (white/orange text), light means light bg (navy/orange text)
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  theme = 'light',
}) => {
  // Dimension scales
  const dimensions = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', sub: 'text-[9px]' },
    md: { icon: 'w-9 h-9', text: 'text-2xl', sub: 'text-[10px]' },
    lg: { icon: 'w-11 h-11', text: 'text-3xl', sub: 'text-xs' },
  };

  const currentDim = dimensions[size];
  const mainTextColor = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const subTextColor = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Dynamic Stylized T Arrow / Fast Movement Transport Symbol */}
      <div
        className={`${currentDim.icon} rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-[#0b1329] p-1.5 flex items-center justify-center shadow-md border border-white/10 shrink-0 relative overflow-hidden group-hover:border-orange-500/50 transition-colors`}
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/20 to-transparent pointer-events-none" />
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Top dynamic crossbar with arrow chevron notch */}
          <path
            d="M5 8.5L25.5 8.5L23.5 13.5L8.5 13.5L5 8.5Z"
            fill="#ff6b00"
          />
          {/* Vertical swift stem */}
          <path
            d="M17.5 13.5L12 26.5H7.5L13 13.5H17.5Z"
            fill="#ffffff"
          />
          {/* Forward movement chevron accent */}
          <path
            d="M27.5 11L21.5 21L19 18.5L23.5 11H27.5Z"
            fill="#ff8533"
          />
          {/* Speed dot */}
          <circle cx="23.5" cy="24.5" r="2" fill="#ff6b00" />
        </svg>
      </div>

      {/* Brand Wordmark: Bold, Sporty, Italic Uppercase with Orange Accent */}
      <div className="flex flex-col leading-none">
        <span
          className={`${currentDim.text} font-black italic tracking-wider uppercase font-sans ${mainTextColor} flex items-baseline`}
        >
          TOT<span className="text-[#ff6b00]">ER</span>
        </span>
        <span
          className={`${currentDim.sub} uppercase font-bold tracking-widest ${subTextColor} mt-0.5`}
        >
          Packers &amp; Movers
        </span>
      </div>
    </div>
  );
};
