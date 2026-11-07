import React from 'react';

interface MotorcycleOilBottleIconProps {
  className?: string;
  size?: number;
}

/**
 * MotorcycleOilBottleIcon
 * Custom SVG icon representing a 1-Liter motorcycle engine oil bottle / container
 * (Envase de aceite de motor 4T para moto con tapa rosca, asa ergonómica,
 * visor de nivel y gota de lubricante).
 */
export const MotorcycleOilBottleIcon: React.FC<MotorcycleOilBottleIconProps> = ({
  className = 'w-5 h-5',
  size = 20,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Envase de aceite de moto"
    >
      {/* Bottle Cap with ribs */}
      <rect x="7" y="2" width="5" height="2.8" rx="0.6" fill="currentColor" fillOpacity="0.25" />
      <line x1="9.5" y1="2" x2="9.5" y2="4.8" strokeWidth="1.2" />

      {/* Neck */}
      <path d="M7.5 4.8 H11.5 V6.2 H7.5 Z" />

      {/* Main Motorcycle Oil Bottle Body */}
      <path
        d="M7.5 6.2 L4.8 8.8 C4.3 9.3 4 10 4 10.7 V20 C4 21.1 4.9 22 6 22 H18 C19.1 22 20 21.1 20 20 V11.5 C20 10.4 19.3 9.4 18.2 9 L11.5 6.2"
        fill="currentColor"
        fillOpacity="0.08"
      />

      {/* Ergonomic handle cutout (typical of 1L / 4T moto oil canisters) */}
      <path
        d="M15 10.2 C16.5 10.6 17.2 11.6 17.2 13.2 C17.2 14.8 16.5 15.6 15 16 C14.2 16 13.5 15.2 13.5 14.2 V12 C13.5 11 14.2 10.2 15 10.2 Z"
        fill="currentColor"
        fillOpacity="0.15"
      />

      {/* Level measurement gauge ticks on side */}
      <line x1="6.5" y1="12" x2="8" y2="12" strokeWidth="1.4" />
      <line x1="6.5" y1="14.5" x2="8.5" y2="14.5" strokeWidth="1.4" />
      <line x1="6.5" y1="17" x2="8" y2="17" strokeWidth="1.4" />

      {/* Oil Drop Emblem on Front Label */}
      <path
        d="M10.8 12.8 C10.8 12.8 9.3 14.6 9.3 15.8 C9.3 16.9 10.2 17.8 11.3 17.8 C12.4 17.8 13.3 16.9 13.3 15.8 C13.3 14.6 11.8 12.8 11.8 12.8 C11.6 12.5 11 12.5 10.8 12.8 Z"
        fill="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
};
