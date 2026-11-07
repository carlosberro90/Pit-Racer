import React from 'react';

interface MotorcycleTireIconProps {
  className?: string;
  size?: number;
}

/**
 * MotorcycleTireIcon
 * Custom SVG icon representing a motorcycle tire (Neumático / Caucho de moto)
 * Features curved tire tread with directional rain sipes, thick sidewall,
 * metal wheel rim, 5 alloy spokes, central axle hub, and tire air valve stem for PSI pressure.
 */
export const MotorcycleTireIcon: React.FC<MotorcycleTireIconProps> = ({
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
      aria-label="Neumático de moto - Presión de neumáticos"
    >
      {/* Outer Motorcycle Tire Tread Contour (Neumático exterior) */}
      <circle cx="12" cy="12" r="9.75" strokeWidth="1.6" fill="currentColor" fillOpacity="0.08" />

      {/* Tire Sidewall Inner Bead Line (Pared lateral del caucho) */}
      <circle cx="12" cy="12" r="7.2" strokeWidth="1.2" strokeOpacity="0.75" />

      {/* Directional Motorcycle Tread Sipes / Grooves (Ranuras de evacuación y labrado deportivo) */}
      {/* Top sipe */}
      <path d="M11.2 3.2 L12 4.6 L12.8 3.2" strokeWidth="1.2" />
      {/* Top-Right sipe */}
      <path d="M17.2 5.0 L16.4 6.4 L17.6 7.1" strokeWidth="1.2" />
      {/* Right sipe */}
      <path d="M20.8 11.2 L19.4 12 L20.8 12.8" strokeWidth="1.2" />
      {/* Bottom-Right sipe */}
      <path d="M17.2 19.0 L16.4 17.6 L17.6 16.9" strokeWidth="1.2" />
      {/* Bottom sipe */}
      <path d="M11.2 20.8 L12 19.4 L12.8 20.8" strokeWidth="1.2" />
      {/* Bottom-Left sipe */}
      <path d="M6.8 19.0 L7.6 17.6 L6.4 16.9" strokeWidth="1.2" />
      {/* Left sipe */}
      <path d="M3.2 11.2 L4.6 12 L3.2 12.8" strokeWidth="1.2" />
      {/* Top-Left sipe */}
      <path d="M6.8 5.0 L7.6 6.4 L6.4 7.1" strokeWidth="1.2" />

      {/* Metal Rim Outer Lip (Pestaña del rin de la moto) */}
      <circle cx="12" cy="12" r="5.2" strokeWidth="1.3" />

      {/* 5 Wheel Alloy Spokes (Rayos o aspas del rin) */}
      <line x1="12" y1="9.8" x2="12" y2="5.5" strokeWidth="1.3" />
      <line x1="13.9" y1="12.6" x2="16.9" y2="13.6" strokeWidth="1.3" />
      <line x1="10.1" y1="12.6" x2="7.1" y2="13.6" strokeWidth="1.3" />
      <line x1="13.2" y1="13.6" x2="15.0" y2="16.2" strokeWidth="1.3" />
      <line x1="10.8" y1="13.6" x2="9.0" y2="16.2" strokeWidth="1.3" />

      {/* Wheel Hub Center (Masa central del eje) */}
      <circle cx="12" cy="12" r="2.2" strokeWidth="1.4" fill="currentColor" fillOpacity="0.2" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" />

      {/* Tire Air Inflation Valve (Válvula de aire / gusanillo para presión PSI) */}
      <path d="M15.4 8.6 L17.2 6.8" strokeWidth="1.5" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  );
};
