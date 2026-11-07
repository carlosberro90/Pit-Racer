import React, { useState, useMemo } from 'react';
import { 
  Fuel, 
  X, 
  Calendar, 
  Check, 
  Info, 
  Gauge, 
  TrendingUp, 
  History, 
  Zap, 
  ChevronRight, 
  Sparkles,
  ArrowRight,
  DollarSign
} from 'lucide-react';
import { FuelLog } from '../../types';
import { 
  calculateFuelAutonomyHistory, 
  calculateLiveRefillProjection, 
  calculateGlobalFuelStats,
  FuelRefillWithAutonomy 
} from '../../utils/fuelCalculations';

interface FuelModalProps {
  isOpen: boolean;
  onClose: () => void;
  bikeId: string;
  currentOdometer: number;
  tankCapacity: number;
  fuelLogs: FuelLog[];
  onSave: (log: Omit<FuelLog, 'id'>) => void;
  initialTab?: 'register' | 'history';
}

export const FuelModal: React.FC<FuelModalProps> = ({
  isOpen,
  onClose,
  bikeId,
  currentOdometer,
  tankCapacity,
  fuelLogs,
  onSave,
  initialTab = 'register',
}) => {
  const [activeTab, setActiveTab] = useState<'register' | 'history'>(initialTab);
  const [liters, setLiters] = useState<string>('4.5');
  const [pricePerLiter, setPricePerLiter] = useState<string>('1.10');
  const [totalUsd, setTotalUsd] = useState<string>('4.95');
  const [odometer, setOdometer] = useState<string>(currentOdometer.toString());
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isFullTank, setIsFullTank] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('Tanqueo estación de servicio');

  // Compute historical autonomy for all existing logs
  const logsWithAutonomy = useMemo(() => {
    return calculateFuelAutonomyHistory(fuelLogs, tankCapacity);
  }, [fuelLogs, tankCapacity]);

  // Compute global summary metrics
  const globalStats = useMemo(() => {
    return calculateGlobalFuelStats(logsWithAutonomy, tankCapacity);
  }, [logsWithAutonomy, tankCapacity]);

  // Find most recent previous refill for comparison
  const latestLog = useMemo(() => {
    if (!fuelLogs || fuelLogs.length === 0) return null;
    return [...fuelLogs].sort((a, b) => b.odometer - a.odometer)[0];
  }, [fuelLogs]);

  // Live calculation for the form inputs
  const liveProjection = useMemo(() => {
    const parsedOdo = parseInt(odometer, 10) || currentOdometer;
    const parsedLiters = parseFloat(liters) || 0;
    const parsedTotal = parseFloat(totalUsd) || 0;

    return calculateLiveRefillProjection(
      parsedOdo,
      parsedLiters,
      parsedTotal,
      latestLog,
      tankCapacity
    );
  }, [odometer, liters, totalUsd, latestLog, currentOdometer, tankCapacity]);

  if (!isOpen) return null;

  const handleLitersChange = (val: string) => {
    setLiters(val);
    const parsedLiters = parseFloat(val) || 0;
    const parsedPrice = parseFloat(pricePerLiter) || 0;
    if (parsedLiters > 0 && parsedPrice > 0) {
      setTotalUsd((parsedLiters * parsedPrice).toFixed(2));
    }
  };

  const handlePriceChange = (val: string) => {
    setPricePerLiter(val);
    const parsedLiters = parseFloat(liters) || 0;
    const parsedPrice = parseFloat(val) || 0;
    if (parsedLiters > 0 && parsedPrice > 0) {
      setTotalUsd((parsedLiters * parsedPrice).toFixed(2));
    }
  };

  const handleTotalChange = (val: string) => {
    setTotalUsd(val);
    const parsedTotal = parseFloat(val) || 0;
    const parsedPrice = parseFloat(pricePerLiter) || 1.10;
    if (parsedTotal > 0 && parsedPrice > 0) {
      setLiters((parsedTotal / parsedPrice).toFixed(2));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedLiters = parseFloat(liters) || 0;
    const parsedTotal = parseFloat(totalUsd) || 0;
    const parsedPrice = parseFloat(pricePerLiter) || 1.10;
    const parsedOdo = parseInt(odometer, 10) || currentOdometer;

    if (parsedLiters <= 0 || parsedTotal <= 0) return;

    onSave({
      bikeId,
      date,
      liters: parsedLiters,
      pricePerLiterUsd: parsedPrice,
      totalUsd: parsedTotal,
      odometer: parsedOdo,
      isFullTank,
      notes: notes.trim(),
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full sm:max-w-xl bg-white dark:bg-[#182232] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[94dvh] sm:max-h-[90vh] animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-2 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile handle indicator */}
        <div className="sm:hidden w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2 shrink-0" />

        {/* Header with Brand Styling */}
        <div className="px-5 py-4 bg-[#7D5319] text-white flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Fuel className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-100/80 leading-none mb-1">
                Combustible & Telemetría
              </div>
              <h3 className="font-extrabold text-base leading-tight">
                {activeTab === 'register' ? 'Registrar Tanqueo' : 'Histórico de Autonomía'}
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

        {/* Tab Selector: Registrar vs Histórico */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/60 p-1.5 gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-white dark:bg-[#182232] text-[#7D5319] dark:text-amber-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Fuel className="w-4 h-4" />
            <span>Registrar Carga</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-white dark:bg-[#182232] text-[#7D5319] dark:text-amber-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Histórico de Autonomía</span>
            {logsWithAutonomy.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-[#7D5319] dark:text-amber-300">
                {logsWithAutonomy.length}
              </span>
            )}
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 text-slate-800 dark:text-slate-100">
          {activeTab === 'register' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Row 1: Litros y Precio por Litro */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Litros Cargados
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      step="0.01"
                      min="0.1"
                      max="50"
                      required
                      value={liters}
                      onChange={(e) => handleLitersChange(e.target.value)}
                      className="w-full h-11 pl-3.5 pr-8 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#7D5319] transition-all"
                    />
                    <span className="absolute right-3 text-xs text-slate-400 font-bold pointer-events-none">L</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Precio / Litro
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs text-slate-400 font-bold pointer-events-none">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      value={pricePerLiter}
                      onChange={(e) => handlePriceChange(e.target.value)}
                      className="w-full h-11 pl-7 pr-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#7D5319] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Total USD y Odómetro actual */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Total Pagado (USD)
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs text-[#7D5319] dark:text-amber-400 font-bold pointer-events-none">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.1"
                      required
                      value={totalUsd}
                      onChange={(e) => handleTotalChange(e.target.value)}
                      className="w-full h-11 pl-7 pr-12 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-mono font-bold text-[#7D5319] dark:text-amber-400 focus:outline-none focus:ring-2 focus:ring-[#7D5319] transition-all"
                    />
                    <span className="absolute right-2.5 text-[11px] font-bold text-slate-400 font-mono pointer-events-none">USD</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Odómetro al Tanquear
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      step="1"
                      min="0"
                      required
                      value={odometer}
                      onChange={(e) => setOdometer(e.target.value)}
                      className="w-full h-11 pl-3.5 pr-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-[#7D5319] transition-all"
                    />
                    <span className="absolute right-3 text-xs text-slate-400 font-bold pointer-events-none">KM</span>
                  </div>
                </div>
              </div>

              {/* LIVE AUTONOMY CALCULATION CARD (Solves user requirement) */}
              <div className="rounded-2xl border border-amber-300/60 dark:border-amber-600/40 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-4 space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#7D5319] text-white flex items-center justify-center shadow-xs">
                      <Zap className="w-4 h-4 text-amber-200" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block leading-tight">
                        Cálculo de Autonomía de esta Recarga
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {latestLog ? `Última recarga: ${latestLog.odometer.toLocaleString()} Km` : 'Referencia inicial de tanque'}
                      </span>
                    </div>
                  </div>

                  {liveProjection.isValid && liveProjection.autonomyTankKm && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-black font-mono bg-[#7D5319] text-white shadow-xs">
                      ~{liveProjection.autonomyTankKm} Km Autonomía
                    </span>
                  )}
                </div>

                {liveProjection.isValid && liveProjection.deltaKm !== null ? (
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                    <div className="p-2 rounded-xl bg-white/70 dark:bg-slate-800/80 border border-amber-200/50 dark:border-amber-900/40">
                      <div className="text-[10px] text-slate-400 font-medium">Recorrido</div>
                      <div className="text-sm font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                        +{liveProjection.deltaKm} Km
                      </div>
                      <div className="text-[9px] text-slate-400">entre recargas</div>
                    </div>

                    <div className="p-2 rounded-xl bg-white/70 dark:bg-slate-800/80 border border-amber-200/50 dark:border-amber-900/40">
                      <div className="text-[10px] text-slate-400 font-medium">Rendimiento</div>
                      <div className="text-sm font-extrabold font-mono text-[#7D5319] dark:text-amber-300">
                        {liveProjection.kmPerLiter} Km/L
                      </div>
                      <div className="text-[9px] text-slate-400">{liveProjection.litersPer100Km} L/100km</div>
                    </div>

                    <div className="p-2 rounded-xl bg-white/70 dark:bg-slate-800/80 border border-amber-200/50 dark:border-amber-900/40">
                      <div className="text-[10px] text-slate-400 font-medium">Costo / Km</div>
                      <div className="text-sm font-extrabold font-mono text-[#19437D] dark:text-sky-400">
                        ${liveProjection.costPerKm}
                      </div>
                      <div className="text-[9px] text-slate-400">USD por Km</div>
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-[11px] text-amber-800 dark:text-amber-200 flex items-center gap-2">
                    <Info className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>{liveProjection.message}</span>
                  </div>
                )}
              </div>

              {/* Row 3: Fecha & Tanque Lleno checkbox */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Fecha del Tanqueo
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#7D5319] transition-all"
                    />
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  </div>
                </div>

                <div className="sm:pt-5">
                  <label className="flex items-center gap-3 h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={isFullTank}
                      onChange={(e) => setIsFullTank(e.target.checked)}
                      className="w-4 h-4 text-[#7D5319] rounded focus:ring-[#7D5319]"
                    />
                    <div className="text-xs leading-none">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">Tanque Lleno</span>
                      <span className="text-slate-400 text-[10px]">Permite calcular autonomía exacta</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Row 4: Notas / Estación */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Estación de Servicio / Notas
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="ej. Estación PDV Central, 95 octanos"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#7D5319] transition-all"
                />
              </div>

              {/* Quick History Preview Section */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-[#7D5319] dark:text-amber-400" />
                    <span>Últimas Recargas Registradas</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('history')}
                    className="text-xs font-semibold text-[#7D5319] dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Ver histórico completo</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {logsWithAutonomy.slice(0, 2).map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          <span>{item.date}</span>
                          {item.deltaKm && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-semibold">
                              +{item.deltaKm} Km
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {item.odometer.toLocaleString()} Km · {item.liters.toFixed(1)} L · ${item.totalUsd.toFixed(2)} USD
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-black text-[#7D5319] dark:text-amber-400">
                          ~{item.autonomyTankKm} Km
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {item.kmPerLiter ? `${item.kmPerLiter} Km/L` : 'Autonomía base'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
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
                  className="h-11 px-6 rounded-xl bg-[#7D5319] hover:bg-[#684312] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#7D5319]/25 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar y Calcular Autonomía</span>
                </button>
              </div>
            </form>
          ) : (
            /* HISTORIC TAB: Dedicated view for recharge history & motorcycle autonomy */
            <div className="space-y-4">
              
              {/* Summary KPIs Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-[#7D5319]/15 to-[#7D5319]/5 border border-[#7D5319]/20 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                    Autonomía Prom.
                  </div>
                  <div className="text-lg font-black font-mono text-[#7D5319] dark:text-amber-400 mt-0.5">
                    ~{globalStats.averageAutonomyTankKm} Km
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono">tanque {tankCapacity} L</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                    Rendimiento
                  </div>
                  <div className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {globalStats.averageKmPerLiter} <span className="text-xs">Km/L</span>
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono">promedio global</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                    Km Evaluados
                  </div>
                  <div className="text-lg font-black font-mono text-[#19437D] dark:text-sky-400 mt-0.5">
                    {globalStats.totalKmTracked} <span className="text-xs">Km</span>
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono">{globalStats.totalLiters.toFixed(1)} L total</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                    Costo / Km
                  </div>
                  <div className="text-lg font-black font-mono text-slate-800 dark:text-slate-200 mt-0.5">
                    ${globalStats.averageCostPerKm}
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono">USD gastado/Km</div>
                </div>
              </div>

              {/* Explanatory callout */}
              <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-900/30 flex items-start gap-2.5 text-xs text-sky-800 dark:text-sky-300">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed">
                  La <strong>autonomía por recarga</strong> refleja la distancia proyectada que tu motocicleta puede recorrer con un tanque completo ({tankCapacity} L) según el consumo real medido entre cada parada de gasolina.
                </span>
              </div>

              {/* Full Detailed Fuel Logs List with Autonomy Cards */}
              <div className="space-y-3">
                {logsWithAutonomy.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-400">
                    No hay recargas registradas aún. Haz clic en "Registrar Carga" para comenzar.
                  </div>
                ) : (
                  logsWithAutonomy.map((item, index) => {
                    const hasCalculation = item.kmPerLiter !== null && item.deltaKm !== null;
                    const efficiencyBadgeColor = 
                      item.efficiencyRating === 'excellent' 
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                        : item.efficiencyRating === 'good'
                        ? 'bg-amber-500/15 text-[#7D5319] dark:text-amber-300 border-amber-500/30'
                        : 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30';

                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-3 hover:border-[#7D5319]/50 transition-all"
                      >
                        {/* Header of the item card */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-[#7D5319] text-white flex items-center justify-center shrink-0 shadow-xs">
                              <Fuel className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                <span>Recarga #{logsWithAutonomy.length - index}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${efficiencyBadgeColor}`}>
                                  {item.isFullTank ? 'Tanque Lleno' : 'Carga Parcial'}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                {item.date} {item.notes && `· ${item.notes}`}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm font-black font-mono text-slate-900 dark:text-slate-100">
                              ${item.totalUsd.toFixed(2)} USD
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {item.liters.toFixed(1)} L @ ${item.pricePerLiterUsd.toFixed(2)}/L
                            </div>
                          </div>
                        </div>

                        {/* Autonomy Badge & Details Grid */}
                        <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800/80">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                              <Zap className="w-3.5 h-3.5 text-[#7D5319] dark:text-amber-400" />
                              <span>Autonomía de la Moto:</span>
                            </span>
                            <span className="text-sm font-black font-mono text-[#7D5319] dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20">
                              ~{item.autonomyTankKm} Km
                            </span>
                          </div>

                          {hasCalculation ? (
                            <div className="grid grid-cols-3 gap-2 bg-white dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                              <div>
                                <span className="text-[10px] text-slate-400 block">Recorrido</span>
                                <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">
                                  +{item.deltaKm} Km
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 block">Rendimiento</span>
                                <span className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200">
                                  {item.kmPerLiter} Km/L
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 block">Costo / Km</span>
                                <span className="text-xs font-bold font-mono text-[#19437D] dark:text-sky-400">
                                  ${item.costPerKm}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-[11px] text-slate-500 dark:text-slate-400 text-center">
                              Primer registro inicial de odómetro ({item.odometer.toLocaleString()} Km). Autonomía base calculada a 38.5 Km/L.
                            </div>
                          )}

                          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono px-1">
                            <span>Odómetro: {item.odometer.toLocaleString()} Km</span>
                            {item.litersPer100Km && (
                              <span>Consumo: {item.litersPer100Km} L/100km</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Bottom return to form button */}
              <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-11 px-5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="h-11 px-6 rounded-xl bg-[#7D5319] hover:bg-[#684312] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#7D5319]/25 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Fuel className="w-4 h-4" />
                  <span>Registrar Nueva Carga</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
