import React from 'react';
import { Printer, X, Download, ShieldCheck, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { Bike, FuelLog, MaintenanceTask, MaintenanceLogEntry } from '../../types';
import { BrandLogo } from '../common/BrandLogo';
import { calculateFuelAutonomyHistory } from '../../utils/fuelCalculations';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  bike: Bike;
  currentOdometer: number;
  tankCapacity: number;
  fuelLogs: FuelLog[];
  tasks: MaintenanceTask[];
  serviceLogs: MaintenanceLogEntry[];
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
  bike,
  currentOdometer,
  tankCapacity,
  fuelLogs,
  tasks,
  serviceLogs,
}) => {
  if (!isOpen) return null;

  const totalFuelUsd = fuelLogs.reduce((acc, curr) => acc + curr.totalUsd, 0);
  const totalFuelLiters = fuelLogs.reduce((acc, curr) => acc + curr.liters, 0);
  const totalServiceUsd = serviceLogs.reduce((acc, curr) => acc + curr.costUsd, 0);
  const totalExpenditure = totalFuelUsd + totalServiceUsd;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full sm:max-w-3xl bg-white text-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[92dvh] sm:max-h-[88vh] flex flex-col animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-2 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Action Bar (Hidden in Print) */}
        <div className="no-print px-4 sm:px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-xs sm:text-sm">Reporte Técnico Pit Racer</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-[#19437D] hover:bg-[#153766] text-white text-xs font-bold transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimir / Guardar como PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document (Scrollable) */}
        <div className="p-4 sm:p-8 md:p-10 space-y-6 bg-white flex-1 overflow-y-auto overscroll-contain">
          {/* Document Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-2xl bg-[#19437D] p-2 flex items-center justify-center shrink-0 shadow-xs">
                <img
                  src="/assets/aistudio/pitracer_logo_white.png"
                  alt="Pit Racer Logo"
                  className="h-full w-auto object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-[#19437D] leading-none">
                  PIT RACER
                </h1>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#7D5319] mt-0.5">
                  Mantenimiento de Moto · by CCS
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Ficha Técnica y Reporte Histórico Certificado
                </p>
              </div>
            </div>

            <div className="text-right text-xs">
              <div className="font-bold text-slate-900">Fecha de Emisión:</div>
              <div className="text-slate-600 font-mono">{new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div className="text-[11px] text-slate-400">ID: PR-DOC-{Date.now().toString().slice(-6)}</div>
            </div>
          </div>

          {/* Vehicle Profile Section */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase">Vehículo</div>
              <div className="text-base font-bold text-slate-900">{bike.brand} {bike.model}</div>
              <div className="text-xs text-slate-500">Año {bike.year}</div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase">Odómetro Actual</div>
              <div className="text-base font-extrabold text-[#19437D] font-mono">{currentOdometer.toLocaleString()} Km</div>
              <div className="text-xs text-slate-500">Lectura verificada</div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase">Capacidad Tanque</div>
              <div className="text-base font-bold text-slate-900 font-mono">{tankCapacity} Litros</div>
              <div className="text-xs text-slate-500">Autonomía ~{Math.round(38.5 * tankCapacity)} Km</div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase">Gasto Total Acumulado</div>
              <div className="text-base font-extrabold text-[#7D5319] font-mono">${totalExpenditure.toFixed(2)} USD</div>
              <div className="text-xs text-slate-500">Combustible + Mantenimiento</div>
            </div>
          </div>

          {/* Maintenance Status Matrix */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1">
              Estado de Sistemas y Mantenimiento Preventivo
            </h3>
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-2">Componente / Tarea</th>
                  <th className="py-2">Intervalo</th>
                  <th className="py-2">Último Servicio</th>
                  <th className="py-2">Recorrido</th>
                  <th className="py-2 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tasks.map((t) => {
                  const kmTraveled = Math.max(0, currentOdometer - t.lastServicedKm);
                  const isDue = kmTraveled >= t.intervalKm;
                  return (
                    <tr key={t.id}>
                      <td className="py-2 font-semibold text-slate-800">{t.title}</td>
                      <td className="py-2 font-mono text-slate-600">{t.intervalKm} Km</td>
                      <td className="py-2 font-mono text-slate-600">{t.lastServicedKm} Km</td>
                      <td className="py-2 font-mono text-slate-600">{kmTraveled} Km</td>
                      <td className="py-2 text-right">
                        <span className={`font-bold ${isDue ? 'text-red-600' : 'text-emerald-700'}`}>
                          {isDue ? 'Mantenimiento Requerido' : 'Conforme / Al día'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Recent Repairs / Services Log */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1">
              Historial de Servicios y Reparaciones
            </h3>
            {serviceLogs.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">Sin intervenciones mayores registradas a la fecha.</p>
            ) : (
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-2">Fecha</th>
                    <th className="py-2">Servicio</th>
                    <th className="py-2">Odómetro</th>
                    <th className="py-2">Taller / Mecánico</th>
                    <th className="py-2 text-right">Costo ($ USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {serviceLogs.map((l) => (
                    <tr key={l.id}>
                      <td className="py-2 font-mono text-slate-600">{l.date}</td>
                      <td className="py-2 font-semibold text-slate-800">{l.taskTitle}</td>
                      <td className="py-2 font-mono text-slate-600">{l.odometer.toLocaleString()} Km</td>
                      <td className="py-2 text-slate-600">{l.workshopName || 'Particular'}</td>
                      <td className="py-2 text-right font-mono font-bold text-slate-800">${l.costUsd.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Fuel Consumption Summary */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1">
              Registro de Abastecimiento de Combustible y Autonomía
            </h3>
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-2">Fecha</th>
                  <th className="py-2">Litros</th>
                  <th className="py-2">Odómetro</th>
                  <th className="py-2">Autonomía Moto</th>
                  <th className="py-2">Rendimiento</th>
                  <th className="py-2 text-right">Total ($ USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {calculateFuelAutonomyHistory(fuelLogs, tankCapacity).slice(0, 6).map((f) => (
                  <tr key={f.id}>
                    <td className="py-2 font-mono text-slate-600">{f.date}</td>
                    <td className="py-2 font-mono text-slate-600">{f.liters.toFixed(1)} L</td>
                    <td className="py-2 font-mono text-slate-600">{f.odometer.toLocaleString()} Km</td>
                    <td className="py-2 font-mono font-bold text-[#7D5319]">
                      ~{f.autonomyTankKm} Km
                    </td>
                    <td className="py-2 font-mono text-slate-600">
                      {f.kmPerLiter ? `${f.kmPerLiter} Km/L` : 'Base inicial'}
                    </td>
                    <td className="py-2 text-right font-mono font-bold text-slate-800">${f.totalUsd.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Document Footer */}
          <div className="pt-6 border-t border-slate-200 text-center text-[10px] text-slate-400">
            Documento emitido por la aplicación Pit Racer · Sistema de Gestión de Mantenimiento de Motocicletas.
          </div>
        </div>
      </div>
    </div>
  );
};
