import React from 'react';

interface WasrikLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'emblem' | 'white';
  showSubtitle?: boolean;
  className?: string;
}

export const WasrikLogo: React.FC<WasrikLogoProps> = ({
  size = 'md',
  variant = 'full',
  showSubtitle = true,
  className = '',
}) => {
  const emblemSizes = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-sm sm:text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  // Official Wasrik AI Monogram: Generated 3D Liquid Glass W + AI Crown
  const emblem = (
    <div className={`relative flex items-center justify-center shrink-0 ${emblemSizes[size]} drop-shadow-sm`}>
      <img
        src="/assets/wasrik_ai_icon.jpg"
        alt="Wasrik AI Logo"
        className="w-full h-full rounded-full object-cover shadow-xs border border-white/80 dark:border-slate-700"
        onError={(e) => {
          // Fallback to minimal styling if image load fails
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );

  if (variant === 'emblem') {
    return <div className={`inline-flex items-center ${className}`}>{emblem}</div>;
  }

  const isWhite = variant === 'white';

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none font-sans ${className}`}>
      {emblem}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-black tracking-tight ${textSizes[size]} ${
              isWhite ? 'text-white' : 'text-slate-900 dark:text-white'
            }`}
          >
            WASRIK<span className="text-[#009640]">AI</span>
          </span>
          <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-extrabold tracking-wider ${
            isWhite
              ? 'bg-white/20 text-white border border-white/30'
              : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
          }`}>
            PRO
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`text-[9.5px] font-semibold tracking-wider uppercase mt-1 ${
              isWhite ? 'text-emerald-200/80' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Corporate Compliance &amp; JKN Risk
          </span>
        )}
      </div>
    </div>
  );
};

export default WasrikLogo;