import React, { useState } from 'react';
import { Gauge, X, Plus, Check } from 'lucide-react';

interface OdometerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentOdometer: number;
  onSave: (newOdometer: number) => void;
}

export const OdometerModal: React.FC<OdometerModalProps> = ({
  isOpen,
  onClose,
  currentOdometer,
  onSave,
}) => {
  const [val, setVal] = useState<string>(currentOdometer.toString());

  if (!isOpen) return null;

  const parsedVal = parseInt(val, 10) || currentOdometer;
  const delta = parsedVal - currentOdometer;

  const handleQuickAdd = (km: number) => {
    setVal((parsedVal + km).toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedVal >= 0) {
      onSave(parsedVal);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full sm:max-w-md bg-white dark:bg-[#182232] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90dvh] sm:max-h-[85vh] animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-2 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile handle indicator */}
        <div className="sm:hidden w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2" />

        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-[#19437D] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-white/10 text-white">
              <Gauge className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">Actualizar Odómetro</h3>
              <p className="text-[10px] sm:text-[11px] text-blue-100/80">Kilometraje actual de la moto</p>
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

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Nuevo Kilometraje (Km)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="1"
                required
                autoFocus
                value={val}
                onChange={(e) => setVal(e.target.value)}
                className="w-full pl-4 pr-14 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xl font-bold font-mono text-[#19437D] dark:text-sky-300 focus:outline-none focus:ring-2 focus:ring-[#19437D] transition-all"
              />
              <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400 font-mono">
                KM
              </span>
            </div>
          </div>

          {/* Quick Increment Buttons */}
          <div>
            <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mb-1.5">Sumar recorrido reciente:</div>
            <div className="grid grid-cols-4 gap-2">
              {[15, 30, 50, 100].map((km) => (
                <button
                  key={km}
                  type="button"
                  onClick={() => handleQuickAdd(km)}
                  className="py-1.5 px-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#19437D] bg-slate-50 dark:bg-slate-800/60 text-xs font-mono font-medium text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3 text-[#7D5319] dark:text-amber-400" />
                  <span>{km} Km</span>
                </button>
              ))}
            </div>
          </div>

          {/* Delta Indicator */}
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>Diferencia con el valor previo:</span>
            <span className={`font-mono font-bold ${delta >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'}`}>
              {delta >= 0 ? `+${delta} Km` : `${delta} Km`}
            </span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#19437D] hover:bg-[#153766] text-white text-xs font-bold shadow-md shadow-[#19437D]/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Actualizar Odómetro</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
