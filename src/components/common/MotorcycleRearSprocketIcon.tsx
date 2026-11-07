import React from 'react';

interface MotorcycleRearSprocketIconProps {
  className?: string;
  size?: number;
}

/**
 * MotorcycleRearSprocketIcon
 * Custom SVG icon representing a motorcycle rear drive sprocket (Corona trasera / catalina de moto)
 * Features outer chain teeth, weight-reduction lightening ports, wheel hub bolt circle, and center axle bore.
 */
export const MotorcycleRearSprocketIcon: React.FC<MotorcycleRearSprocketIconProps> = ({
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
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Corona trasera de moto - Kit de arrastre"
    >
      {/* Outer 12 Sprocket Gear Teeth (Dientes de la corona) */}
      <path
        d="M 10.04 3.22 L 10.88 0.86 L 13.12 0.86 L 13.96 3.22 L 14.69 3.41 L 16.60 1.79 L 18.54 2.91 L 18.09 5.38 L 18.62 5.91 L 21.09 5.46 L 22.21 7.40 L 20.59 9.31 L 20.78 10.04 L 23.14 10.88 L 23.14 13.12 L 20.78 13.96 L 20.59 14.69 L 22.21 16.60 L 21.09 18.54 L 18.62 18.09 L 18.09 18.62 L 18.54 21.09 L 16.60 22.21 L 14.69 20.59 L 13.96 20.78 L 13.12 23.14 L 10.88 23.14 L 10.04 20.78 L 9.31 20.59 L 7.40 22.21 L 5.46 21.09 L 5.91 18.62 L 5.38 18.09 L 2.91 18.54 L 1.79 16.60 L 3.41 14.69 L 3.22 13.96 L 0.86 13.12 L 0.86 10.88 L 3.22 10.04 L 3.41 9.31 L 1.79 7.40 L 2.91 5.46 L 5.38 5.91 L 5.91 5.38 L 5.46 2.91 L 7.40 1.79 L 9.31 3.41 Z"
        fill="currentColor"
        fillOpacity="0.12"
      />

      {/* Outer flange ring groove */}
      <circle cx="12" cy="12" r="8.4" strokeWidth="1.1" strokeOpacity="0.7" />

      {/* 5 Lightening Ports / Windows (Ventanas de aligeramiento de peso) */}
      <circle cx="12" cy="6.5" r="1.35" fill="currentColor" fillOpacity="0.3" strokeWidth="1.1" />
      <circle cx="17.2" cy="10.3" r="1.35" fill="currentColor" fillOpacity="0.3" strokeWidth="1.1" />
      <circle cx="15.2" cy="16.5" r="1.35" fill="currentColor" fillOpacity="0.3" strokeWidth="1.1" />
      <circle cx="8.8" cy="16.5" r="1.35" fill="currentColor" fillOpacity="0.3" strokeWidth="1.1" />
      <circle cx="6.8" cy="10.3" r="1.35" fill="currentColor" fillOpacity="0.3" strokeWidth="1.1" />

      {/* Inner Mounting Hub Ring */}
      <circle cx="12" cy="12" r="4.6" strokeWidth="1.2" strokeOpacity="0.8" />

      {/* 4 Mounting Bolt Holes (Pernos de sujeción al portacorona) */}
      <circle cx="12" cy="8.8" r="0.7" fill="currentColor" />
      <circle cx="15.2" cy="12" r="0.7" fill="currentColor" />
      <circle cx="12" cy="15.2" r="0.7" fill="currentColor" />
      <circle cx="8.8" cy="12" r="0.7" fill="currentColor" />

      {/* Center Wheel Axle Bore (Orificio del eje central de la rueda) */}
      <circle cx="12" cy="12" r="2.2" strokeWidth="1.4" fill="none" />
    </svg>
  );
};
