import React from 'react';

interface BillSplitLogoProps {
  className?: string;
  size?: number;
}

export const BillSplitLogo: React.FC<BillSplitLogoProps> = ({
  className = 'w-10 h-10',
  size = 40,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 p-2 shadow-lg shadow-emerald-500/20 ring-1 ring-white/20 select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-white"
      >
        {/* Left Half of Split Receipt */}
        <path
          d="M6 5C6 3.89543 6.89543 3 8 3H15.5L13.5 28.5L10 27L8 28.5L6 27V5Z"
          fill="currentColor"
          fillOpacity="0.95"
        />
        {/* Right Half of Split Receipt (offset slightly to signify split!) */}
        <path
          d="M17.5 3.5H24C25.1046 3.5 26 4.39543 26 5.5V27.5L24 26L22 27.5L19.5 26L16 29L17.5 3.5Z"
          fill="currentColor"
          fillOpacity="0.85"
        />
        {/* Receipt lines */}
        <line
          x1="9"
          y1="8"
          x2="13"
          y2="8"
          stroke="#0f172a"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="18.5"
          y1="8"
          x2="23"
          y2="8"
          stroke="#0f172a"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="9"
          y1="12"
          x2="12.5"
          y2="12"
          stroke="#0f172a"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="18"
          y1="12"
          x2="22"
          y2="12"
          stroke="#0f172a"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Split slash beam */}
        <line
          x1="14"
          y1="2"
          x2="17"
          y2="30"
          stroke="#fbbf24"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Center Split Badge */}
        <circle cx="15.5" cy="16" r="3.2" fill="#0f172a" stroke="#fbbf24" strokeWidth="1.2" />
        <path
          d="M14.5 15H16.5M15.5 14V18"
          stroke="#34d399"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
