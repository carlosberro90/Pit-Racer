import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  MessageSquare, 
  MapPin, 
  Navigation, 
  Clock, 
  Fuel, 
  Calendar,
  Route as RouteIcon,
  Compass
} from 'lucide-react';
import { ProgrammedRoute, GpsTrip } from '../../types';

interface ShareRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  route?: ProgrammedRoute | null;
  trip?: GpsTrip | null;
}

export const ShareRouteModal: React.FC<ShareRouteModalProps> = ({
  isOpen,
  onClose,
  route,
  trip,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || (!route && !trip)) return null;

  const roadTypeLabels: Record<string, string> = {
    curvas: 'Curvas de Montaña ⛰️',
    autopista: 'Autopista Rápida 🛣️',
    mixta: 'Ruta Mixta 🏙️',
    offroad: 'Destapado / Tierra 🏜️',
  };

  let shareTitle = '';
  let shareText = '';

  if (route) {
    shareTitle = `Ruta GPS: ${route.name}`;
    const stopsList = route.stops && route.stops.length > 0
      ? `• *Paradas Planificadas:*\n${route.stops.map((s, idx) => `  ${idx + 1}. ${s}`).join('\n')}\n`
      : '';
    const dateLine = route.scheduledDate
      ? `• *Fecha:* ${route.scheduledDate} ${route.scheduledTime ? `· ${route.scheduledTime}` : ''}\n`
      : '';
    const fuelLine = route.estimatedFuelLiters
      ? `• *Gasolina Estimada:* ~${route.estimatedFuelLiters} L\n`
      : '';
    const roadLine = route.roadType
      ? `• *Tipo de Vía:* ${roadTypeLabels[route.roadType] || route.roadType}\n`
      : '';
    const notesLine = route.notes
      ? `• *Recomendaciones:* ${route.notes}\n`
      : '';

    shareText = `🗺️ *RUTA GPS PROGRAMADA - PIT RACER*
━━━━━━━━━━━━━━━━━━━
📍 *${route.name}*
🚩 *Origen:* ${route.origin}
🏁 *Destino:* ${route.destination}
📏 *Distancia:* ${route.distanceKm} Km (~${route.estimatedMinutes} min)
${dateLine}${fuelLine}${roadLine}${stopsList}${notesLine}━━━━━━━━━━━━━━━━━━━
🏍️ ¡Únete a la rodada con Pit Racer!`;
  } else if (trip) {
    shareTitle = `Recorrido GPS Realizado: ${trip.distanceKm.toFixed(1)} Km`;
    shareText = `🗺️ *RECORRIDO GPS COMPLETADO - PIT RACER*
━━━━━━━━━━━━━━━━━━━
🏁 *Distancia Recorrida:* ${trip.distanceKm.toFixed(1)} Km
⏱️ *Duración:* ${Math.round(trip.durationSeconds / 60)} min
⚡ *Velocidad Promedio:* ${trip.avgSpeedKmh} Km/h
🚀 *Velocidad Máxima:* ${trip.maxSpeedKmh} Km/h
📅 *Fecha:* ${trip.date}
━━━━━━━━━━━━━━━━━━━
🏍️ Grabado con telemetría Pit Racer`;
  }

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Error copying text:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
        });
        return;
      } catch (err) {
        console.log('Native share cancelled or failed');
      }
    }
    handleCopy();
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full sm:max-w-lg bg-white dark:bg-[#182232] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92dvh] sm:max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-2 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile handle indicator */}
        <div className="sm:hidden w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2" />

        {/* Modal Header */}
        <div className="px-5 py-4 bg-[#7D5319] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">Compartir Ruta GPS</h3>
              <p className="text-[10px] sm:text-[11px] text-amber-100/80">
                {route ? route.name : `Viaje de ${trip?.distanceKm.toFixed(1)} Km`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto overscroll-contain space-y-4 text-left flex-1">
          {/* Visual Route Card */}
          {route && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-black text-base text-slate-900 dark:text-slate-100 leading-tight">
                    {route.name}
                  </h4>
                  {route.scheduledDate && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{route.scheduledDate} {route.scheduledTime ? `· ${route.scheduledTime}` : ''}</span>
                    </div>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Distancia</div>
                  <div className="text-base font-extrabold font-mono text-[#7D5319] dark:text-amber-400">
                    {route.distanceKm} Km
                  </div>
                </div>
              </div>

              {/* Origin & Destination */}
              <div className="py-2 space-y-2 border-y border-slate-200/60 dark:border-slate-800/60 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-slate-500 dark:text-slate-400">Origen:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{route.origin}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                  <span className="text-slate-500 dark:text-slate-400">Destino:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{route.destination}</span>
                </div>
              </div>

              {/* Metrics row */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Tiempo Estimado</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 font-mono">~{route.estimatedMinutes} min</div>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Combustible</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                    {route.estimatedFuelLiters ? `~${route.estimatedFuelLiters} L` : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Formatted Text Preview */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Vista previa del mensaje a compartir
            </label>
            <pre className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed select-all">
              {shareText}
            </pre>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Compartir por WhatsApp</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Texto</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleNativeShare}
                className="py-2.5 px-3 rounded-xl bg-[#7D5319] hover:bg-[#684312] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Share2 className="w-4 h-4" />
                <span>Más Opciones</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
