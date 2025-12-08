import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-8 w-8", showText = true }) => {
  return (
    <div className="flex items-center gap-3">
      <div className={`relative flex items-center justify-center bg-indigo-600 rounded-lg shadow-md ${className}`}>
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-2/3 h-2/3"
        >
          <path d="M3 21h18" />
          <path d="M5 21V7l8-4 8 4v14" />
          <path d="M9 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
          <path d="M9 21v-5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v5" />
        </svg>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="font-bold text-gray-800 text-lg leading-tight">Hari P.G.</span>
          <span className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">Hostel Manager</span>
        </div>
      )}
    </div>
  );
};