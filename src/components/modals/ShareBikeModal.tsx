import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  MessageSquare, 
  Gauge, 
  Fuel, 
  Zap, 
  Wrench,
  Bike as BikeIcon,
  ShieldCheck
} from 'lucide-react';
import { Bike } from '../../types';

interface ShareBikeModalProps {
  isOpen: boolean;
  onClose: () => void;
  bike: Bike;
  currentOdometer: number;
  tankCapacity: number;
  averageKmPerLiter?: number;
  averageAutonomyTankKm?: number;
  urgentTasksCount?: number;
}

export const ShareBikeModal: React.FC<ShareBikeModalProps> = ({
  isOpen,
  onClose,
  bike,
  currentOdometer,
  tankCapacity,
  averageKmPerLiter = 35.0,
  averageAutonomyTankKm = 490,
  urgentTasksCount = 0,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const healthStatus = urgentTasksCount === 0 
    ? '✅ Sistemas al día (Sin alertas pendientes)' 
    : `⚠️ ${urgentTasksCount} servicios pendientes de revisión`;

  const shareText = `🏍️ *DATOS DE MI MOTO - PIT RACER*
━━━━━━━━━━━━━━━━━━━
• *Motocicleta:* ${bike.brand} ${bike.model} (${bike.year})
${bike.nickname ? `• *Apodo:* ${bike.nickname}\n` : ''}${bike.color ? `• *Color:* ${bike.color}\n` : ''}• *Odómetro Total:* ${currentOdometer.toLocaleString()} Km
• *Tanque:* ${tankCapacity} Litros
• *Rendimiento:* ~${averageKmPerLiter} Km/L
• *Autonomía:* ~${averageAutonomyTankKm} Km por tanque lleno
• *Estado Mecánico:* ${healthStatus}
━━━━━━━━━━━━━━━━━━━
🏁 Control y telemetría con Pit Racer`;

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
          title: `Datos de mi moto - ${bike.brand} ${bike.model}`,
          text: shareText,
        });
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to copy
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
        <div className="px-5 py-4 bg-[#19437D] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">Compartir Datos de mi Moto</h3>
              <p className="text-[10px] sm:text-[11px] text-blue-100/80">{bike.brand} {bike.model} ({bike.year})</p>
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
          {/* Visual Specs Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-2xl overflow-hidden bg-[#19437D]/10 text-[#19437D] dark:text-sky-300 flex items-center justify-center font-black border border-slate-200 dark:border-slate-700 shrink-0">
                  {bike.photoUrl ? (
                    <img
                      src={bike.photoUrl}
                      alt={`${bike.brand} ${bike.model}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BikeIcon className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h4 className="font-black text-base text-slate-900 dark:text-slate-100">
                    {bike.brand} {bike.model}
                  </h4>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Año {bike.year} {bike.color ? `· Color ${bike.color}` : ''}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Odómetro</div>
                <div className="text-base font-extrabold font-mono text-[#19437D] dark:text-sky-400">
                  {currentOdometer.toLocaleString()} Km
                </div>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
                <Fuel className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Capacidad Tanque</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{tankCapacity} Litros</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Autonomía Est.</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">~{averageAutonomyTankKm} Km</div>
                </div>
              </div>
            </div>

            {/* Health summary */}
            <div className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              urgentTasksCount === 0
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60'
            }`}>
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{healthStatus}</span>
            </div>
          </div>

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
                    <span>Copiar Ficha</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleNativeShare}
                className="py-2.5 px-3 rounded-xl bg-[#19437D] hover:bg-[#153766] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
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
