import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light';
  showSubtitle?: boolean;
}

export const BotanicalLogo: React.FC<LogoProps> = ({ 
  className = '', 
  variant = 'dark',
  showSubtitle = true 
}) => {
  const isLight = variant === 'light';
  
  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 group focus:outline-none ${className}`}>
      {/* Original Geometric Botanical Mark */}
      <div className={`w-9 h-9 rounded-md flex items-center justify-center transition-colors duration-200 ${
        isLight ? 'bg-white/10 text-white' : 'bg-primary text-white'
      }`}>
        <svg 
          viewBox="0 0 28 28" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-5 h-5"
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* Central Stem */}
          <path d="M14 24V4" />
          {/* Left Leaf Curved Vein */}
          <path d="M14 16C9 16 7 11 7 8C11 8 13.5 11 14 13" />
          {/* Right Leaf Curved Vein */}
          <path d="M14 12C18 12 21 8 21 5C17 5 14.5 8 14 10" />
          {/* Root Flairs at bottom */}
          <path d="M11 24C12 22 13 21 14 21C15 21 16 22 17 24" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span className={`font-heading font-extrabold tracking-tight text-xl leading-none ${
          isLight ? 'text-white' : 'text-charcoal'
        }`}>
          ROOTS
        </span>
        {showSubtitle && (
          <span className={`text-[10px] tracking-wider uppercase font-medium mt-0.5 ${
            isLight ? 'text-sage-light' : 'text-muted'
          }`}>
            Afforestation Platform
          </span>
        )}
      </div>
    </Link>
  );
};
