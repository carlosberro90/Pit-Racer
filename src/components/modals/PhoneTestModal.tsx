import React, { useState } from 'react';
import { Smartphone, X, Copy, Check, ExternalLink, Cloud, ShieldCheck } from 'lucide-react';

interface PhoneTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  sharedUrl?: string;
}

export const PhoneTestModal: React.FC<PhoneTestModalProps> = ({
  isOpen,
  onClose,
  sharedUrl,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Use active URL (ais-dev) which is live and reachable
  const activeUrl = 
    sharedUrl || 
    (typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost') 
      ? window.location.origin 
      : 'https://ais-dev-qknd363l2brz6chez6ad6q-635486922360.us-east1.run.app');

  const handleCopy = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Generate clean QR code URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    activeUrl
  )}&margin=10`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full sm:max-w-md bg-white dark:bg-[#182232] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92dvh] sm:max-h-[85vh] animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-2 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile handle indicator */}
        <div className="sm:hidden w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2 shrink-0" />

        {/* Modal Header */}
        <div className="px-5 py-4 bg-[#19437D] text-white flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-blue-100/80 leading-none mb-1">
                Acceso Móvil
              </div>
              <h3 className="font-extrabold text-base leading-tight">Probar en tu Teléfono</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto overscroll-contain text-center">
          {/* Cloud Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            <Cloud className="w-3.5 h-3.5" />
            <span>Servidor Activo en la Nube & Firestore</span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300">
            Escanea este código QR con la cámara de tu teléfono para abrir Pit Racer en vivo:
          </p>

          {/* QR Code Container */}
          <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 w-fit mx-auto">
            <img
              src={qrCodeUrl}
              alt="QR Code Pit Racer"
              className="w-48 h-48 object-contain mx-auto"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Direct Link & Copy */}
          <div className="space-y-1.5 text-left">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Enlace Activo del Servidor
            </label>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300">
              <span className="truncate flex-1 select-all">{activeUrl}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="px-2.5 py-1.5 rounded-lg bg-[#19437D] text-white font-bold text-[11px] flex items-center gap-1 shrink-0 hover:bg-[#153766] transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          {/* Open link button */}
          <a
            href={activeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-[#19437D] hover:bg-[#153766] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Abrir enlace directamente en el navegador</span>
          </a>

          {/* PWA Tips */}
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-left text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <div className="font-bold text-[#19437D] dark:text-sky-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Instalación Móvil como App</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              En Safari (iPhone): <strong>"Compartir" → "Añadir a pantalla de inicio"</strong>. En Android (Chrome): <strong>Menú (⋮) → "Instalar app"</strong> para disfrutarla a pantalla completa con odómetro y GPS en tiempo real.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
