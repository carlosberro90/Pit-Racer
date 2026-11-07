import React, { useMemo, useState, useEffect } from 'react';
import { 
  Gauge, 
  Fuel, 
  Plus, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Zap,
  History,
  Info,
  Share2,
  Camera,
  X,
  Maximize2,
  Download
} from 'lucide-react';
import { Bike, FuelLog, MaintenanceTask } from '../../types';
import { 
  calculateFuelAutonomyHistory, 
  calculateGlobalFuelStats 
} from '../../utils/fuelCalculations';
import { ShareBikeModal } from '../modals/ShareBikeModal';

interface HomeTabProps {
  bike: Bike;
  currentOdometer: number;
  tankCapacity: number;
  fuelLogs: FuelLog[];
  tasks: MaintenanceTask[];
  onOpenOdometerModal: () => void;
  onOpenFuelModal: (tab?: 'register' | 'history') => void;
  onNavigateToTab: (tabIndex: number) => void;
  onUpdateBikePhoto?: (photoUrl: string | undefined) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  bike,
  currentOdometer,
  tankCapacity,
  fuelLogs,
  tasks,
  onOpenOdometerModal,
  onOpenFuelModal,
  onNavigateToTab,
  onUpdateBikePhoto,
}) => {
  const [isShareBikeModalOpen, setIsShareBikeModalOpen] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  // Close fullscreen on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreenOpen(false);
      }
    };
    if (isFullscreenOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreenOpen]);

  // Handle motorcycle profile photo upload with client-side canvas compression
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 800;
        let width = img.width;
        let height = img.height;
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          onUpdateBikePhoto?.(compressedDataUrl);
        } else {
          onUpdateBikePhoto?.(event.target?.result as string);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Compute autonomy metrics for each log
  const logsWithAutonomy = useMemo(() => {
    return calculateFuelAutonomyHistory(fuelLogs, tankCapacity);
  }, [fuelLogs, tankCapacity]);

  // Compute global fuel stats
  const globalStats = useMemo(() => {
    return calculateGlobalFuelStats(logsWithAutonomy, tankCapacity);
  }, [logsWithAutonomy, tankCapacity]);

  // Maintenance health evaluation
  const urgentTasks = tasks.filter((t) => {
    const kmSinceLast = currentOdometer - t.lastServicedKm;
    return kmSinceLast >= t.intervalKm;
  });

  return (
    <div className="space-y-6">
      {/* Motorcycle Profile Header Card */}
      <div className="bg-white dark:bg-[#182232] rounded-3xl p-5 shadow-md border border-slate-200 dark:border-slate-800 transition-all flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Profile Photo Avatar with interactive Click to Fullscreen & Camera upload trigger */}
          <div className="relative shrink-0">
            <div 
              onClick={() => {
                if (bike.photoUrl) {
                  setIsFullscreenOpen(true);
                }
              }}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center relative ${
                bike.photoUrl ? 'cursor-pointer group' : ''
              }`}
              title={bike.photoUrl ? 'Toca para ver la foto en pantalla completa' : 'Subir foto de la moto'}
            >
              {bike.photoUrl ? (
                <>
                  <img
                    src={bike.photoUrl}
                    alt={`${bike.brand} ${bike.model}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Hover overlay indicating click to open in fullscreen */}
                  <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                    <Maximize2 className="w-5 h-5 mb-0.5 drop-shadow" />
                    <span className="text-[9px] font-bold tracking-tight">Ver</span>
                  </div>
                </>
              ) : (
                <label
                  htmlFor="moto-photo-upload"
                  className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 cursor-pointer hover:text-[#19437D] dark:hover:text-sky-300 transition-colors"
                  title="Subir foto de la moto"
                >
                  <Camera className="w-6 h-6 sm:w-7 sm:h-7 opacity-70" />
                  <span className="text-[9px] uppercase font-bold tracking-tight mt-0.5">Subir</span>
                </label>
              )}
            </div>

            {/* Floating Quick Action Badge */}
            <label
              htmlFor="moto-photo-upload"
              className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[#19437D] hover:bg-[#153766] text-white shadow-md cursor-pointer transition-transform hover:scale-110 flex items-center justify-center"
              title="Subir o cambiar foto de la moto"
            >
              <Camera className="w-3.5 h-3.5" />
            </label>
            <input
              id="moto-photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Motorcycle Details */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight truncate">
                {bike.brand} {bike.model}
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-[#19437D]/10 dark:bg-sky-500/15 text-[#19437D] dark:text-sky-300 text-[10px] font-extrabold uppercase font-mono">
                {bike.year}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              Tanque: {tankCapacity}L {bike.color ? `· Color: ${bike.color}` : ''}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              {bike.photoUrl ? 'Toca la foto para verla en pantalla completa' : 'Pulsa el botón o la cámara para subir la foto de tu moto'}
            </p>
          </div>
        </div>

        {/* Actions: Compartir Datos + Subir/Cambiar Foto */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
          <button
            type="button"
            onClick={() => setIsShareBikeModalOpen(true)}
            className="flex-1 sm:flex-none sm:w-36 h-10 inline-flex items-center justify-center gap-2 px-4 rounded-full border border-[#7D5319]/30 dark:border-amber-500/30 bg-[#7D5319]/10 dark:bg-amber-500/10 hover:bg-[#7D5319]/20 dark:hover:bg-amber-500/20 text-[#7D5319] dark:text-amber-400 font-bold text-xs cursor-pointer shadow-xs transition-colors whitespace-nowrap"
            title="Compartir datos y ficha técnica de mi moto"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Compartir Datos</span>
          </button>

          <label
            htmlFor="moto-photo-upload-btn"
            className="flex-1 sm:flex-none sm:w-36 h-10 inline-flex items-center justify-center gap-2 px-4 rounded-full border border-slate-300 dark:border-white/15 bg-slate-100 hover:bg-slate-200 dark:bg-[#272727] dark:hover:bg-[#3f3f3f] text-slate-800 dark:text-white font-bold text-xs cursor-pointer shadow-xs transition-colors whitespace-nowrap text-center"
          >
            <Camera className="w-3.5 h-3.5 text-[#19437D] dark:text-sky-400" />
            <span>{bike.photoUrl ? 'Cambiar Foto' : 'Subir Foto'}</span>
          </label>
          <input
            id="moto-photo-upload-btn"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
      {/* Primary Odometer & Autonomy Card */}
      <div className="bg-white dark:bg-[#182232] rounded-3xl p-6 md:p-8 shadow-md border border-slate-200 dark:border-slate-800 transition-all">
        {/* Centered Odometer Instrument Header */}
        <div className="flex flex-col items-center justify-center text-center pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            <Gauge className="w-3.5 h-3.5 text-[#19437D] dark:text-sky-400" />
            <span>Odómetro Total</span>
          </div>

          <div className="flex items-center justify-center gap-2.5 my-1">
            <span className="text-4xl sm:text-5xl md:text-6xl font-black font-mono tracking-tight text-[#19437D] dark:text-sky-400 tabular-nums leading-none">
              {currentOdometer.toLocaleString()}
            </span>
            <span className="text-lg sm:text-2xl font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider select-none">
              Km
            </span>
          </div>

          <div className="mt-3.5 flex items-center justify-center">
            <button
              type="button"
              onClick={onOpenOdometerModal}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-[#19437D]/30 dark:border-sky-500/40 bg-[#19437D]/10 dark:bg-sky-500/15 text-[#19437D] dark:text-sky-300 font-bold text-xs sm:text-sm hover:bg-[#19437D]/20 dark:hover:bg-sky-500/25 active:scale-[0.98] transition-all cursor-pointer shadow-xs"
            >
              <Gauge className="w-4 h-4 text-[#19437D] dark:text-sky-400" />
              <span>Actualizar Odómetro</span>
            </button>
          </div>
        </div>

        {/* Autonomy row with real evaluated metrics */}
        <div className="pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-slate-600 dark:text-slate-300">Autonomía de la moto: </span>
            <span className="text-base font-extrabold text-[#7D5319] dark:text-amber-400 font-mono flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              ~{globalStats.averageAutonomyTankKm} Km por tanque
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              (rendimiento: {globalStats.averageKmPerLiter} Km/L)
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>Tanque: {tankCapacity} L</span>
            <span aria-hidden="true">·</span>
            <span>{bike.brand} {bike.model}</span>
          </div>
        </div>

        {/* Interactive Gauge Bar */}
        <div className="mt-4 pt-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-mono">
            <span>Reserva</span>
            <span className="text-[#7D5319] dark:text-amber-400 font-bold">Capacidad {tankCapacity} Litros</span>
            <span>Lleno</span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
            <div className="w-[15%] bg-amber-500/70"></div>
            <div className="w-[85%] bg-gradient-to-r from-emerald-500 to-[#19437D]"></div>
          </div>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => onOpenFuelModal('register')}
          className="p-4 rounded-2xl bg-white dark:bg-[#182232] border border-slate-200 dark:border-slate-800 hover:border-[#7D5319] shadow-xs hover:shadow-md transition-all text-left flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#7D5319]/10 text-[#7D5319] dark:text-amber-400 group-hover:scale-105 transition-transform">
              <Fuel className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Combustible</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100">Registrar Tanqueo</div>
            </div>
          </div>
          <Plus className="w-4 h-4 text-slate-400 group-hover:text-[#7D5319] transition-colors" />
        </button>

        <button
          type="button"
          onClick={() => onNavigateToTab(1)}
          className="p-4 rounded-2xl bg-white dark:bg-[#182232] border border-slate-200 dark:border-slate-800 hover:border-[#19437D] shadow-xs hover:shadow-md transition-all text-left flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#19437D]/10 text-[#19437D] dark:text-sky-400 group-hover:scale-105 transition-transform">
              {urgentTasks.length > 0 ? (
                <AlertTriangle className="w-5 h-5 text-red-500" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              )}
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Mantenimiento</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {urgentTasks.length > 0
                  ? `${urgentTasks.length} alertas pendientes`
                  : 'Sistemas al día'}
              </div>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#19437D] transition-colors" />
        </button>

        <button
          type="button"
          onClick={() => onNavigateToTab(2)}
          className="p-4 rounded-2xl bg-white dark:bg-[#182232] border border-slate-200 dark:border-slate-800 hover:border-amber-600 shadow-xs hover:shadow-md transition-all text-left flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-[#7D5319] dark:text-amber-400 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Ruta GPS</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100">Programar o Iniciar</div>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
        </button>
      </div>

      {/* Gastos y Tanqueos Recientes con Autonomía de la Moto */}
      <div className="bg-white dark:bg-[#182232] rounded-3xl p-6 md:p-8 shadow-md border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Histórico de Recargas y Autonomía
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#7D5319]/15 text-[#7D5319] dark:text-amber-300 font-mono">
                {logsWithAutonomy.length} recargas
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Total acumulado: <span className="font-mono font-bold text-[#7D5319] dark:text-amber-400">${globalStats.totalCostUsd.toFixed(2)} USD</span> en {globalStats.totalLiters.toFixed(1)} L · Autonomía prom: <span className="font-bold text-[#7D5319] dark:text-amber-400">~{globalStats.averageAutonomyTankKm} Km</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenFuelModal('history')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <History className="w-3.5 h-3.5 text-[#7D5319] dark:text-amber-400" />
              <span>Ver Histórico Completo</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenFuelModal('register')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#7D5319] hover:bg-[#684312] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar Tanqueo</span>
            </button>
          </div>
        </div>

        {/* Fuel Logs List with per-refill Autonomy */}
        <div className="space-y-3 pt-1">
          {logsWithAutonomy.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">
              No hay tanqueos registrados. Haz clic en "Registrar Tanqueo" para empezar.
            </div>
          ) : (
            logsWithAutonomy.map((item, idx) => {
              const hasCalc = item.kmPerLiter !== null && item.deltaKm !== null;
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-[#7D5319]/40 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#7D5319] flex items-center justify-center text-white shrink-0 shadow-xs">
                        <Fuel className="w-5 h-5 text-amber-200" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          <span>{item.isFullTank ? 'Tanqueo Completo' : 'Carga Parcial'}</span>
                          {hasCalc && (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                              +{item.deltaKm} Km recorridos
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
                          {item.liters.toFixed(1)} Litros @ ${item.pricePerLiterUsd.toFixed(2)}/L · {item.odometer.toLocaleString()} Km
                        </div>
                        {item.notes && (
                          <div className="text-[11px] text-slate-400 truncate mt-0.5">{item.notes}</div>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-base font-black font-mono text-slate-900 dark:text-slate-100 tabular-nums">
                        ${item.totalUsd.toFixed(2)} USD
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">{item.date}</div>
                    </div>
                  </div>

                  {/* Autonomy Badge Bar for this specific refill */}
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 dark:text-slate-400 font-medium text-[11px]">
                        Autonomía con este tanqueo:
                      </span>
                      <span className="font-bold font-mono text-[#7D5319] dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        ~{item.autonomyTankKm} Km
                      </span>
                    </div>

                    {hasCalc ? (
                      <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        <span>Rendimiento: <strong className="text-slate-700 dark:text-slate-200">{item.kmPerLiter} Km/L</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>Costo: <strong className="text-[#19437D] dark:text-sky-400">${item.costPerKm}/Km</strong></span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono">
                        Punto de referencia inicial ({item.odometer.toLocaleString()} Km)
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Share Bike Modal */}
      <ShareBikeModal
        isOpen={isShareBikeModalOpen}
        onClose={() => setIsShareBikeModalOpen(false)}
        bike={bike}
        currentOdometer={currentOdometer}
        tankCapacity={tankCapacity}
        averageKmPerLiter={globalStats.averageKmPerLiter}
        averageAutonomyTankKm={globalStats.averageAutonomyTankKm}
        urgentTasksCount={urgentTasks.length}
      />

      {/* Fullscreen Photo Lightbox Modal */}
      {isFullscreenOpen && bike.photoUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200 select-none"
          onClick={() => setIsFullscreenOpen(false)}
        >
          {/* Top Control Bar */}
          <div 
            className="w-full max-w-5xl mx-auto flex items-center justify-between text-white pb-3 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-base shrink-0">
                🏍️
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-sm sm:text-lg leading-tight truncate text-white">
                  {bike.brand} {bike.model}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Año {bike.year} {bike.color ? `· Color ${bike.color}` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Change photo action */}
              <label
                htmlFor="moto-photo-upload-lightbox"
                className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Cambiar foto de perfil"
              >
                <Camera className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cambiar Foto</span>
              </label>
              <input
                id="moto-photo-upload-lightbox"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  handleFileChange(e);
                  setIsFullscreenOpen(false);
                }}
              />

              {/* Close Fullscreen */}
              <button
                type="button"
                onClick={() => setIsFullscreenOpen(false)}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Cerrar pantalla completa"
                aria-label="Cerrar pantalla completa"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Fullscreen Photo Container */}
          <div 
            className="flex-1 w-full max-w-5xl mx-auto flex items-center justify-center p-2 sm:p-4 min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={bike.photoUrl}
              alt={`${bike.brand} ${bike.model}`}
              className="max-h-[80vh] max-w-full object-contain rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10"
            />
          </div>

          {/* Bottom Hint */}
          <div className="text-[11px] text-slate-400/80 tracking-wide font-medium text-center shrink-0 pt-2">
            Toca en cualquier parte del fondo o presiona ESC para cerrar
          </div>
        </div>
      )}
    </div>
  );
};
