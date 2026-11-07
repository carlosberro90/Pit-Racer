import React from 'react';

interface MotorcycleSparkPlugIconProps {
  className?: string;
  size?: number;
}

/**
 * MotorcycleSparkPlugIcon
 * Custom SVG icon representing a motorcycle spark plug (Bujía de moto)
 * with terminal stud, corrugated ceramic insulator ribs, hex nut,
 * seating washer gasket, threaded barrel, and ground electrode with spark gap.
 */
export const MotorcycleSparkPlugIcon: React.FC<MotorcycleSparkPlugIconProps> = ({
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
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Bujía de moto"
    >
      {/* Terminal Stud Connector at top */}
      <rect x="11" y="1.5" width="2" height="2" rx="0.5" fill="currentColor" />

      {/* Ceramic Insulator Body */}
      <path
        d="M10 3.5 H14 V9.5 H10 Z"
        fill="currentColor"
        fillOpacity="0.1"
      />
      {/* Ceramic Insulator Ribs (Corrugations) */}
      <line x1="9" y1="5.2" x2="15" y2="5.2" strokeWidth="1.4" />
      <line x1="9" y1="7.2" x2="15" y2="7.2" strokeWidth="1.4" />

      {/* Hex Nut / Metal Shell */}
      <path
        d="M8 9.5 H16 V13 H8 Z"
        fill="currentColor"
        fillOpacity="0.25"
        strokeWidth="1.6"
      />
      {/* Hex facet line */}
      <line x1="12" y1="9.5" x2="12" y2="13" strokeWidth="1.2" strokeOpacity="0.6" />

      {/* Seating Gasket / Washer Ring */}
      <line x1="8.5" y1="13.5" x2="15.5" y2="13.5" strokeWidth="1.8" />

      {/* Threaded Metal Barrel */}
      <path
        d="M9.5 14 H14.5 V18.5 H9.5 Z"
        fill="currentColor"
        fillOpacity="0.15"
      />
      {/* Screw Thread Grooves */}
      <line x1="9" y1="15.2" x2="15" y2="15.7" strokeWidth="1.2" />
      <line x1="9" y1="16.7" x2="15" y2="17.2" strokeWidth="1.2" />
      <line x1="9" y1="18.1" x2="15" y2="18.6" strokeWidth="1.2" />

      {/* Center Electrode */}
      <line x1="12" y1="18.5" x2="12" y2="21" strokeWidth="1.7" />

      {/* Ground Electrode (L-shape bent around tip with clearance gap) */}
      <path
        d="M14.2 18.5 V22.8 H11.2"
        strokeWidth="1.6"
      />

      {/* Electric Ignition Spark Arc */}
      <path
        d="M10.3 20.8 L11.2 21.4 L10.8 22.1"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
};
