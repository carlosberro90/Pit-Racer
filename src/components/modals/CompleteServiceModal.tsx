import React, { useState } from 'react';
import { Wrench, X, Check, Calendar, DollarSign, Building, Gauge, FileText } from 'lucide-react';
import { MaintenanceTask, MaintenanceLogEntry } from '../../types';
import { MotorcycleOilBottleIcon } from '../common/MotorcycleOilBottleIcon';
import { MotorcycleSparkPlugIcon } from '../common/MotorcycleSparkPlugIcon';
import { MotorcycleRearSprocketIcon } from '../common/MotorcycleRearSprocketIcon';
import { MotorcycleTireIcon } from '../common/MotorcycleTireIcon';

interface CompleteServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: MaintenanceTask | null;
  currentOdometer: number;
  onSave: (log: Omit<MaintenanceLogEntry, 'id'>, newOdometer: number) => void;
}

const COMMON_WORKSHOPS = [
  'Taller MotoExpress 24h',
  'Servicios El Pistón',
  'PitStop Racing',
  'Realizado por mí (Bricolaje)',
];

export const CompleteServiceModal: React.FC<CompleteServiceModalProps> = ({
  isOpen,
  onClose,
  task,
  currentOdometer,
  onSave,
}) => {
  if (!isOpen || !task) return null;

  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [odometer, setOdometer] = useState<string>(currentOdometer.toString());
  const [costUsd, setCostUsd] = useState<string>('8.00');
  const [workshopName, setWorkshopName] = useState<string>('Taller MotoExpress 24h');
  const [notes, setNotes] = useState<string>('Mantenimiento preventivo completado según manual de servicio.');

  const parsedOdo = parseInt(odometer, 10) || currentOdometer;
  const nextTargetKm = parsedOdo + task.intervalKm;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedCost = parseFloat(costUsd) || 0;

    onSave(
      {
        bikeId: task.bikeId,
        taskId: task.id,
        taskTitle: task.title,
        date,
        odometer: parsedOdo,
        costUsd: parsedCost,
        workshopName: workshopName.trim() || 'Particular',
        notes: notes.trim(),
      },
      parsedOdo
    );
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full sm:max-w-lg bg-white dark:bg-[#182232] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92dvh] sm:max-h-[85vh] animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-2 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile handle indicator */}
        <div className="sm:hidden w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2 shrink-0" />

        {/* Modal Header with Task Color Accent */}
        <div 
          className="px-5 py-4 text-white flex items-center justify-between shrink-0 shadow-xs"
          style={{ backgroundColor: task.colorHex || '#19437D' }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              {task.iconName === 'oil' || task.title.toLowerCase().includes('aceite') ? (
                <MotorcycleOilBottleIcon className="w-6 h-6 text-white" />
              ) : task.iconName === 'spark' || task.title.toLowerCase().includes('bujia') || task.title.toLowerCase().includes('bujía') ? (
                <MotorcycleSparkPlugIcon className="w-6 h-6 text-white" />
              ) : task.iconName === 'sprocket' || task.iconName === 'chain' || task.title.toLowerCase().includes('arrastre') || task.title.toLowerCase().includes('corona') || task.title.toLowerCase().includes('cadena') ? (
                <MotorcycleRearSprocketIcon className="w-6 h-6 text-white" />
              ) : task.iconName === 'tire' || task.title.toLowerCase().includes('neumat') || task.title.toLowerCase().includes('caucho') || task.title.toLowerCase().includes('presion') || task.title.toLowerCase().includes('presión') ? (
                <MotorcycleTireIcon className="w-6 h-6 text-white" />
              ) : (
                <Wrench className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-white/80 leading-none mb-1">
                Registrar Servicio
              </div>
              <h3 className="font-extrabold text-base truncate leading-tight">
                {task.title}
              </h3>
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

        {/* Scrollable Form Body with Proportional Dimensions */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto overscroll-contain p-5 space-y-4 text-slate-800 dark:text-slate-100">
          
          {/* Row 1: Odómetro y Fecha (2 balanced columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Odometer Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Odómetro del Servicio
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 pointer-events-none text-slate-400">
                  <Gauge className="w-4 h-4 text-[#19437D] dark:text-sky-400" />
                </div>
                <input
                  type="number"
                  step="1"
                  min="0"
                  required
                  value={odometer}
                  onChange={(e) => setOdometer(e.target.value)}
                  className="w-full h-11 pl-10 pr-12 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#19437D] transition-all"
                />
                <span className="absolute right-3.5 text-xs font-bold text-slate-400 font-mono pointer-events-none">
                  KM
                </span>
              </div>
            </div>

            {/* Date Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Fecha de Realización
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#19437D] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Cost in USD */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Costo del Servicio ($ USD)
              </label>
              <span className="text-[11px] text-slate-400">Mano de obra + Repuestos</span>
            </div>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 pointer-events-none text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                $
              </div>
              <input
                type="number"
                step="0.5"
                min="0"
                required
                value={costUsd}
                onChange={(e) => setCostUsd(e.target.value)}
                placeholder="0.00"
                className="w-full h-11 pl-10 pr-16 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-base font-mono font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
              <span className="absolute right-3.5 text-xs font-bold text-slate-400 font-mono pointer-events-none">
                USD
              </span>
            </div>

            {/* Quick Cost Chips */}
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] text-slate-400 font-semibold mr-1">Sugerido:</span>
              {['5', '8', '12', '20', '35'].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setCostUsd(amt + '.00')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                    costUsd === amt + '.00' || costUsd === amt
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>
          </div>

          {/* Row 3: Workshop Name (Full Width for clear legibility) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Taller Mecánico / Especialista
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 pointer-events-none text-slate-400">
                <Building className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={workshopName}
                onChange={(e) => setWorkshopName(e.target.value)}
                placeholder="ej. Taller MotoExpress 24h, Servicios El Pistón"
                className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#19437D] transition-all"
              />
            </div>

            {/* Quick Workshop Suggestions */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {COMMON_WORKSHOPS.map((ws) => (
                <button
                  key={ws}
                  type="button"
                  onClick={() => setWorkshopName(ws)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    workshopName === ws
                      ? 'bg-[#19437D] text-white font-medium shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {ws}
                </button>
              ))}
            </div>
          </div>

          {/* Row 4: Notes / Replaced Parts */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Detalles y Repuestos Utilizados
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ej. Aceite Motul 20W50 mineral, bujía NGK calibrada a 0.7mm, filtro nuevo."
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#19437D] resize-none transition-all leading-relaxed"
            />
          </div>

          {/* Calibrated Telemetry Feedback Banner */}
          <div className="p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
            <Wrench className="w-4 h-4 text-[#19437D] dark:text-sky-400 shrink-0 mt-0.5" />
            <div className="leading-snug">
              Al guardar, el intervalo de <span className="font-bold font-mono text-[#19437D] dark:text-sky-300">+{task.intervalKm.toLocaleString()} Km</span> se reinicia. 
              El próximo servicio vencerá a los <span className="font-bold font-mono text-[#19437D] dark:text-sky-300">{nextTargetKm.toLocaleString()} Km</span>.
            </div>
          </div>

          {/* Action Buttons - Pinned at bottom of form */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="h-11 px-6 rounded-xl bg-[#19437D] hover:bg-[#153766] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#19437D]/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Guardar Mantenimiento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
