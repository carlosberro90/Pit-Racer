import React, { useState } from 'react';

export const OFFICIAL_LOGO_URL = '/assets/aistudio/pitracer_logo_white.png';
export const OFFICIAL_LOGO_WHITE_URL = '/assets/aistudio/pitracer_logo_white.png';
export const OFFICIAL_LOGO_BLACK_URL = '/assets/aistudio/pitracer_logo_transparent.png';
export const ORIGINAL_ATTACHMENT_URL = '/assets/aistudio/Gemini_Generated_Image_2osoca2osoca2oso_a821df55.jpg';

interface BrandLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  variant?: 'white' | 'dark' | 'black' | 'auto';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 40,
  showText = false,
  variant = 'white',
}) => {
  const [hasError, setHasError] = useState(false);

  // The official logo is white by default as requested
  const logoSrc = (variant === 'dark' || variant === 'black')
    ? OFFICIAL_LOGO_BLACK_URL 
    : OFFICIAL_LOGO_WHITE_URL;

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {!hasError ? (
        <div className="relative shrink-0 flex items-center justify-center">
          <img
            src={logoSrc}
            alt="Pit Racer"
            onError={() => setHasError(true)}
            style={{ height: size, width: 'auto', maxHeight: size }}
            className="object-contain select-none transition-transform hover:scale-105 drop-shadow-[0_1px_3px_rgba(255,255,255,0.25)]"
          />
        </div>
      ) : (
        <div 
          className="relative flex items-center justify-center rounded-xl bg-[#19437D] shadow-sm shrink-0 p-1.5"
          style={{ width: size, height: size }}
        >
          {/* Fallback Monogram Vector */}
          <span className="text-white font-black italic tracking-tighter text-sm">
            PR
          </span>
        </div>
      )}

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-lg tracking-tight text-white dark:text-sky-300">
              PIT RACER
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded">
              CCS
            </span>
          </div>
          <span className="text-[10px] text-blue-100/80 font-medium">
            Mantenimiento de Moto
          </span>
        </div>
      )}
    </div>
  );
};
