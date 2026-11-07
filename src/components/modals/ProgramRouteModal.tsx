import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  Route, 
  Fuel, 
  Plus, 
  Trash2, 
  Check, 
  Navigation,
  Compass,
  AlertCircle
} from 'lucide-react';
import { ProgrammedRoute } from '../../types';

interface ProgramRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (route: ProgrammedRoute) => void;
  bikeId: string;
}

export const ProgramRouteModal: React.FC<ProgramRouteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  bikeId,
}) => {
  const [name, setName] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [distanceKm, setDistanceKm] = useState<string>('45');
  const [estimatedMinutes, setEstimatedMinutes] = useState<string>('60');
  const [scheduledDate, setScheduledDate] = useState<string>(
    () => new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [scheduledTime, setScheduledTime] = useState<string>('08:00');
  const [roadType, setRoadType] = useState<'curvas' | 'autopista' | 'mixta' | 'offroad'>('curvas');
  const [estimatedFuelLiters, setEstimatedFuelLiters] = useState<string>('2.5');
  const [notes, setNotes] = useState('');
  
  // Dynamic stops array
  const [stops, setStops] = useState<string[]>(['Gasolinera de salida']);
  const [newStopText, setNewStopText] = useState('');

  if (!isOpen) return null;

  const handleAddStop = () => {
    if (!newStopText.trim()) return;
    setStops([...stops, newStopText.trim()]);
    setNewStopText('');
  };

  const handleRemoveStop = (idx: number) => {
    setStops(stops.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !origin.trim() || !destination.trim()) return;

    const km = parseFloat(distanceKm) || 30;
    const mins = parseInt(estimatedMinutes, 10) || 45;
    const fuel = parseFloat(estimatedFuelLiters) || (km / 35); // Approx 35 km/L baseline

    const newRoute: ProgrammedRoute = {
      id: 'route-' + Date.now(),
      bikeId,
      name: name.trim(),
      origin: origin.trim(),
      destination: destination.trim(),
      distanceKm: km,
      estimatedMinutes: mins,
      scheduledDate: scheduledDate || undefined,
      scheduledTime: scheduledTime || undefined,
      roadType,
      estimatedFuelLiters: Number(fuel.toFixed(1)),
      stops: stops.filter((s) => s.trim().length > 0),
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onSave(newRoute);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-xl bg-white dark:bg-[#182232] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92dvh] sm:max-h-[88vh] animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-2 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile handle indicator */}
        <div className="sm:hidden w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2 shrink-0" />

        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-[#19437D] to-[#153766] text-white flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-white/80 leading-none mb-1">
                Planificador GPS
              </div>
              <h3 className="font-extrabold text-base truncate leading-tight">
                Programar Ruta GPS
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto overscroll-contain p-6 space-y-4.5 text-slate-800 dark:text-slate-100">
          
          {/* Nombre de la Ruta */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Nombre de la Ruta / Rodada *
            </label>
            <div className="relative">
              <Route className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Rodada de Domingo a la Montaña"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#19437D]"
              />
            </div>
          </div>

          {/* Origen y Destino (2 Columnas) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Punto de Partida (Origen) *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                <input
                  type="text"
                  required
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="Ej. Caracas, Plaza Venezuela"
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#19437D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                Destino Final *
              </label>
              <div className="relative">
                <Navigation className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Ej. Colonia Tovar / Playa Los Ángeles"
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#19437D]"
                />
              </div>
            </div>
          </div>

          {/* Distancia y Tiempo Estimado */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Distancia Estimada
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  required
                  value={distanceKm}
                  onChange={(e) => {
                    const km = e.target.value;
                    setDistanceKm(km);
                    // auto calculate estimated fuel (~35 km per liter)
                    if (parseFloat(km) > 0) {
                      setEstimatedFuelLiters((parseFloat(km) / 32).toFixed(1));
                    }
                  }}
                  className="w-full pr-10 pl-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-sm font-mono font-bold focus:outline-hidden focus:ring-2 focus:ring-[#19437D]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  KM
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Tiempo Estimado
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="5"
                  step="5"
                  required
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(e.target.value)}
                  className="w-full pr-12 pl-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-sm font-mono font-bold focus:outline-hidden focus:ring-2 focus:ring-[#19437D]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  MIN
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <Fuel className="w-3.5 h-3.5 text-amber-500" />
                <span>Gasolina Est.</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  value={estimatedFuelLiters}
                  onChange={(e) => setEstimatedFuelLiters(e.target.value)}
                  className="w-full pr-8 pl-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-sm font-mono font-bold focus:outline-hidden focus:ring-2 focus:ring-[#19437D]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  L
                </span>
              </div>
            </div>
          </div>

          {/* Fecha y Hora de Rodada */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Fecha Programada
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#19437D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Hora de Salida
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#19437D]"
              />
            </div>
          </div>

          {/* Tipo de Vía / Terreno */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Tipo de Vía y Terreno
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { key: 'curvas', label: 'Curvas de Montaña', icon: '⛰️' },
                { key: 'autopista', label: 'Autopista Rápida', icon: '🛣️' },
                { key: 'mixta', label: 'Ruta Mixta', icon: '🏙️' },
                { key: 'offroad', label: 'Destapado / Tierra', icon: '🏜️' },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setRoadType(item.key as any)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-1 ${
                    roadType === item.key
                      ? 'border-[#19437D] bg-[#19437D]/10 text-[#19437D] dark:text-sky-300 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="leading-tight">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Paradas Programadas / Puntos de Encuentro */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Paradas y Puntos de Encuentro ({stops.length})
            </label>
            <div className="space-y-2 mb-2">
              {stops.map((stop, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#19437D] text-white flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span className="font-medium">{stop}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveStop(idx)}
                    className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Input to add stop */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newStopText}
                onChange={(e) => setNewStopText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddStop();
                  }
                }}
                placeholder="Agregar parada (ej. Mirador, Bomba de gasolina)..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#19437D]"
              />
              <button
                type="button"
                onClick={handleAddStop}
                className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar</span>
              </button>
            </div>
          </div>

          {/* Notas / Recomendaciones */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Recomendaciones y Notas para la Rodada
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Chequear aceite, llevar impermeable, revisar presión de cauchos..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#19437D] resize-none"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-[#19437D] hover:bg-[#153766] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Guardar Ruta Programada</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
