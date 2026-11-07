import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  Play, 
  Square, 
  Navigation, 
  MapPin, 
  Clock, 
  Gauge, 
  Lock, 
  Sparkles, 
  History, 
  Check, 
  Radio,
  Calendar,
  CalendarClock,
  Plus,
  Route,
  Fuel,
  Trash2,
  ChevronRight,
  ArrowRight,
  TrendingUp,
  MapPinned,
  ShieldCheck,
  AlertCircle,
  Share2
} from 'lucide-react';
import { GpsTrip, GpsPoint, ProgrammedRoute } from '../../types';
import { DEFAULT_PROGRAMMED_ROUTES } from '../../data/defaults';
import { ProgramRouteModal } from '../modals/ProgramRouteModal';
import { ShareRouteModal } from '../modals/ShareRouteModal';

interface RouteGpsTabProps {
  currentOdometer: number;
  onFinishRide: (distanceKm: number, trip: GpsTrip) => void;
  recentTrips: GpsTrip[];
  programmedRoutes?: ProgrammedRoute[];
  onAddProgrammedRoute?: (route: ProgrammedRoute) => void;
  onDeleteProgrammedRoute?: (id: string) => void;
  bikeId?: string;
  isProMember?: boolean;
  onTogglePro?: () => void;
}

export const RouteGpsTab: React.FC<RouteGpsTabProps> = ({
  currentOdometer,
  onFinishRide,
  recentTrips,
  programmedRoutes: externalProgrammedRoutes,
  onAddProgrammedRoute,
  onDeleteProgrammedRoute,
  bikeId = 'bike-primary',
}) => {
  // Two main options requested by user: 'programar' (Programar ruta GPS) vs 'iniciar' (Iniciar ruta GPS)
  const [activeOption, setActiveOption] = useState<'programar' | 'iniciar'>('programar');

  // Internal fallback state for programmed routes if not provided externally
  const [localProgrammedRoutes, setLocalProgrammedRoutes] = useState<ProgrammedRoute[]>(() => {
    const saved = localStorage.getItem('pitracer_programmed_routes');
    return saved ? JSON.parse(saved) : DEFAULT_PROGRAMMED_ROUTES;
  });

  const routesList = externalProgrammedRoutes ?? localProgrammedRoutes;

  // Selected route to track during live session
  const [activePlannedRoute, setActivePlannedRoute] = useState<ProgrammedRoute | null>(null);

  // Modal for scheduling a route
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);

  // Share route modal state
  const [routeToShare, setRouteToShare] = useState<ProgrammedRoute | null>(null);
  const [tripToShare, setTripToShare] = useState<GpsTrip | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleOpenShareRoute = (route: ProgrammedRoute) => {
    setRouteToShare(route);
    setTripToShare(null);
    setIsShareModalOpen(true);
  };

  const handleOpenShareTrip = (trip: GpsTrip) => {
    setTripToShare(trip);
    setRouteToShare(null);
    setIsShareModalOpen(true);
  };

  // Live tracking state
  const [isTracking, setIsTracking] = useState(false);
  const [useSimulator, setUseSimulator] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [maxSpeed, setMaxSpeed] = useState(0);
  const [points, setPoints] = useState<GpsPoint[]>([]);
  const [finishToast, setFinishToast] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (watchIdRef.current) navigator.geolocation?.clearWatch(watchIdRef.current);
    };
  }, []);

  const handleAddRoute = (newRoute: ProgrammedRoute) => {
    if (onAddProgrammedRoute) {
      onAddProgrammedRoute(newRoute);
    } else {
      const updated = [newRoute, ...localProgrammedRoutes];
      setLocalProgrammedRoutes(updated);
      localStorage.setItem('pitracer_programmed_routes', JSON.stringify(updated));
    }
  };

  const handleDeleteRoute = (id: string) => {
    if (onDeleteProgrammedRoute) {
      onDeleteProgrammedRoute(id);
    } else {
      const updated = localProgrammedRoutes.filter((r) => r.id !== id);
      setLocalProgrammedRoutes(updated);
      localStorage.setItem('pitracer_programmed_routes', JSON.stringify(updated));
    }
    if (activePlannedRoute?.id === id) {
      setActivePlannedRoute(null);
    }
  };

  const handleStartRouteFromProgrammed = (route: ProgrammedRoute) => {
    setActivePlannedRoute(route);
    setActiveOption('iniciar');
    // If not already tracking, auto-prompt to start
  };

  const handleStartTracking = () => {
    setIsTracking(true);
    setElapsedSeconds(0);
    setDistanceKm(0);
    setCurrentSpeed(useSimulator ? 38 : 0);
    setMaxSpeed(useSimulator ? 52 : 0);
    setFinishToast(null);

    // Initial starting point (Caracas / Urban center as baseline)
    const startPoint: GpsPoint = {
      lat: 10.4806,
      lng: -66.9036,
      timestamp: Date.now(),
      speedKmh: useSimulator ? 35 : 0,
    };
    setPoints([startPoint]);

    // Timer interval
    timerRef.current = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);

      if (useSimulator) {
        // Simulate cruising on a bike between 35 and 65 km/h
        const simulatedSpeed = Math.floor(40 + Math.sin(Date.now() / 3000) * 15 + (Math.random() * 6 - 3));
        setCurrentSpeed(simulatedSpeed);
        setMaxSpeed((prev) => Math.max(prev, simulatedSpeed));

        // Add distance (speed in km/h / 3600 per second)
        const kmPerSec = simulatedSpeed / 3600;
        setDistanceKm((prev) => {
          const next = Number((prev + kmPerSec).toFixed(2));
          return next;
        });

        // Add GPS coordinate drift along a scenic curve
        setPoints((prev) => {
          const last = prev[prev.length - 1] || startPoint;
          const newPoint: GpsPoint = {
            lat: last.lat + 0.00015 * Math.cos(prev.length * 0.15),
            lng: last.lng + 0.0002 * Math.sin(prev.length * 0.15),
            timestamp: Date.now(),
            speedKmh: simulatedSpeed,
          };
          return [...prev.slice(-40), newPoint];
        });
      }
    }, 1000);

    // If device geolocation is requested and available
    if (!useSimulator && 'geolocation' in navigator) {
      try {
        watchIdRef.current = navigator.geolocation.watchPosition(
          (pos) => {
            const spd = pos.coords.speed ? Math.round(pos.coords.speed * 3.6) : 0;
            setCurrentSpeed(spd);
            setMaxSpeed((prev) => Math.max(prev, spd));
            const newPt: GpsPoint = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              timestamp: pos.timestamp,
              speedKmh: spd,
            };
            setPoints((prev) => [...prev.slice(-40), newPt]);
          },
          (err) => console.log('Geolocation note:', err.message),
          { enableHighAccuracy: true }
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleStopTracking = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (watchIdRef.current) navigator.geolocation?.clearWatch(watchIdRef.current);

    const finalDistance = distanceKm > 0 ? distanceKm : (activePlannedRoute ? activePlannedRoute.distanceKm : 24.0);
    const avgSpeed = elapsedSeconds > 0 ? Math.round((finalDistance / (elapsedSeconds / 3600))) : 42;

    const newTrip: GpsTrip = {
      id: 'trip-' + Date.now(),
      bikeId,
      date: new Date().toISOString().split('T')[0],
      durationSeconds: elapsedSeconds || 1800,
      distanceKm: finalDistance,
      avgSpeedKmh: avgSpeed || 42,
      maxSpeedKmh: maxSpeed || 58,
      points,
    };

    onFinishRide(finalDistance, newTrip);
    setIsTracking(false);

    setFinishToast(`¡Ruta finalizada! Se sumaron +${finalDistance.toFixed(1)} Km a tu odómetro.`);
    setTimeout(() => setFinishToast(null), 5000);
  };

  // Format seconds to HH:MM:SS
  const formatTime = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const roadTypeLabels: Record<string, { label: string; icon: string; bg: string }> = {
    curvas: { label: 'Curvas de Montaña', icon: '⛰️', bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' },
    autopista: { label: 'Autopista Rápida', icon: '🛣️', bg: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300' },
    mixta: { label: 'Ruta Mixta', icon: '🏙️', bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' },
    offroad: { label: 'Destapado / Tierra', icon: '🏜️', bg: 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300' },
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {finishToast && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white shadow-lg flex items-center justify-between animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5">
            <Check className="w-5 h-5 text-amber-300 shrink-0" />
            <span className="text-sm font-semibold">{finishToast}</span>
          </div>
          <span className="text-xs font-mono font-bold shrink-0">Odómetro: {currentOdometer} Km</span>
        </div>
      )}

      {/* 2 Main Options Selector: Programar Ruta vs Iniciar Ruta GPS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Programar Ruta */}
        <button
          type="button"
          onClick={() => setActiveOption('programar')}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between group relative overflow-hidden ${
            activeOption === 'programar'
              ? 'bg-[#19437D] text-white border-[#19437D] shadow-lg shadow-[#19437D]/25 ring-2 ring-[#19437D]/40'
              : 'bg-white dark:bg-[#182232] text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-800 hover:border-[#19437D]/50 shadow-xs'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className={`p-3 rounded-2xl transition-all ${
              activeOption === 'programar'
                ? 'bg-white/20 text-white shadow-xs'
                : 'bg-[#19437D]/10 text-[#19437D] dark:text-sky-400 group-hover:scale-105'
            }`}>
              <CalendarClock className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-base sm:text-lg leading-tight">
                Programar Ruta
              </div>
              <div className={`text-xs mt-0.5 ${
                activeOption === 'programar' ? 'text-white/75' : 'text-slate-500 dark:text-slate-400'
              }`}>
                Planifica destinos, paradas y salidas
              </div>
            </div>
          </div>
          <ChevronRight className={`w-5 h-5 shrink-0 transition-transform ${
            activeOption === 'programar' ? 'text-white translate-x-1' : 'text-slate-400'
          }`} />
        </button>

        {/* Iniciar Ruta GPS */}
        <button
          type="button"
          onClick={() => setActiveOption('iniciar')}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between group relative overflow-hidden ${
            activeOption === 'iniciar'
              ? 'bg-[#7D5319] text-white border-[#7D5319] shadow-lg shadow-[#7D5319]/25 ring-2 ring-[#7D5319]/40'
              : 'bg-white dark:bg-[#182232] text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-800 hover:border-[#7D5319]/50 shadow-xs'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className={`p-3 rounded-2xl transition-all ${
              activeOption === 'iniciar'
                ? 'bg-white/20 text-white shadow-xs'
                : 'bg-[#7D5319]/10 text-[#7D5319] dark:text-amber-400 group-hover:scale-105'
            }`}>
              <Play className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="font-extrabold text-base sm:text-lg leading-tight flex items-center gap-2">
                <span>Iniciar Ruta GPS</span>
                {isTracking && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-400 text-slate-900 font-extrabold text-[9px] animate-pulse">
                    ● En vivo
                  </span>
                )}
              </div>
              <div className={`text-xs mt-0.5 ${
                activeOption === 'iniciar' ? 'text-white/75' : 'text-slate-500 dark:text-slate-400'
              }`}>
                Grabación en vivo y telemetría
              </div>
            </div>
          </div>
          <ChevronRight className={`w-5 h-5 shrink-0 transition-transform ${
            activeOption === 'iniciar' ? 'text-white translate-x-1' : 'text-slate-400'
          }`} />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VISTA 1: PROGRAMAR RUTA GPS */}
      {/* ========================================================================= */}
      {activeOption === 'programar' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Header Action Bar */}
          <div className="bg-white dark:bg-[#182232] rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#19437D] dark:text-sky-400 mb-1 flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                <span>Rutas y Salidas Programadas</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Planificador de Rutas GPS
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Organiza tus rodadas con anticipación, define paradas de descanso y calcula el combustible necesario antes de salir.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsProgramModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#19437D] hover:bg-[#153766] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Programar Nueva Ruta</span>
            </button>
          </div>

          {/* Quick Stats Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#182232] border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Rutas Listadas</div>
              <div className="text-2xl font-extrabold font-mono text-[#19437D] dark:text-sky-400 mt-0.5">
                {routesList.length}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#182232] border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Km Planificados</div>
              <div className="text-2xl font-extrabold font-mono text-[#7D5319] dark:text-amber-400 mt-0.5">
                {routesList.reduce((acc, r) => acc + r.distanceKm, 0).toFixed(0)} Km
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#182232] border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Gasolina Est.</div>
              <div className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                {routesList.reduce((acc, r) => acc + (r.estimatedFuelLiters || 0), 0).toFixed(1)} L
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#182232] border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Próxima Salida</div>
              <div className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mt-1 truncate">
                {routesList[0]?.scheduledDate || 'Por programar'}
              </div>
            </div>
          </div>

          {/* Programmed Routes Cards */}
          <div className="space-y-4">
            {routesList.length === 0 ? (
              <div className="p-10 rounded-3xl bg-white dark:bg-[#182232] border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <Route className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">
                  No tienes rutas programadas aún
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Comienza programando tu próximo destino o rodada de fin de semana para seguirla en el mapa GPS.
                </p>
                <button
                  type="button"
                  onClick={() => setIsProgramModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#19437D] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Programar primera ruta</span>
                </button>
              </div>
            ) : (
              routesList.map((route) => {
                const roadInfo = route.roadType ? roadTypeLabels[route.roadType] : roadTypeLabels.curvas;
                const isCurrentActive = activePlannedRoute?.id === route.id;

                return (
                  <div
                    key={route.id}
                    className={`bg-white dark:bg-[#182232] rounded-3xl p-5 sm:p-6 shadow-sm border transition-all ${
                      isCurrentActive
                        ? 'border-[#7D5319] ring-2 ring-[#7D5319]/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${roadInfo.bg}`}>
                            <span>{roadInfo.icon}</span>
                            <span>{roadInfo.label}</span>
                          </span>

                          {route.scheduledDate && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2.5 py-0.5 rounded-full">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>{route.scheduledDate} {route.scheduledTime ? `· ${route.scheduledTime}` : ''}</span>
                            </span>
                          )}

                          {isCurrentActive && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#7D5319] text-white">
                              ★ Seleccionada para Iniciar
                            </span>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                          {route.name}
                        </h3>
                      </div>

                      {/* Action to Start Ride, Share, or Delete */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenShareRoute(route)}
                          className="px-3.5 py-2.5 rounded-xl border border-[#19437D]/30 dark:border-sky-500/30 bg-[#19437D]/5 dark:bg-sky-500/10 text-[#19437D] dark:text-sky-300 text-xs font-bold hover:bg-[#19437D]/10 dark:hover:bg-sky-500/20 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                          title="Compartir ruta programada"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Compartir Ruta</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStartRouteFromProgrammed(route)}
                          className="px-4 py-2.5 rounded-xl bg-[#7D5319] hover:bg-[#684312] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Iniciar Esta Ruta GPS</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteRoute(route.id)}
                          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 hover:border-red-300 dark:hover:border-red-900 transition-colors cursor-pointer"
                          aria-label="Eliminar ruta programada"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Origen -> Destino Visual Segment */}
                    <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        {/* Origin */}
                        <div className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Punto de Origen</div>
                            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{route.origin}</div>
                          </div>
                        </div>

                        {/* Destination */}
                        <div className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                            <Navigation className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Destino Final</div>
                            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{route.destination}</div>
                          </div>
                        </div>
                      </div>

                      {/* Distance & Time Metrics Box */}
                      <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 items-center text-center">
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Distancia</div>
                          <div className="text-base sm:text-lg font-bold font-mono text-[#19437D] dark:text-sky-400">
                            {route.distanceKm} Km
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Tiempo Est.</div>
                          <div className="text-base sm:text-lg font-bold font-mono text-slate-800 dark:text-slate-200">
                            {route.estimatedMinutes} min
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Combustible</div>
                          <div className="text-base sm:text-lg font-bold font-mono text-amber-600 dark:text-amber-400">
                            {route.estimatedFuelLiters ? `~${route.estimatedFuelLiters} L` : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Scheduled Stops list */}
                    {route.stops && route.stops.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Paradas Programadas ({route.stops.length})
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {route.stops.map((stop, sIdx) => (
                            <span 
                              key={sIdx}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium"
                            >
                              <span className="w-4 h-4 rounded-full bg-[#19437D] text-white flex items-center justify-center text-[9px] font-bold">
                                {sIdx + 1}
                              </span>
                              <span>{stop}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes & Recommendations */}
                    {route.notes && (
                      <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Recomendación para la rodada: </span>
                          <span>{route.notes}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 2: INICIAR RUTA GPS (TELEMETRÍA EN VIVO Y RASTREO SATELITAL) */}
      {/* ========================================================================= */}
      {activeOption === 'iniciar' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          
          {/* Active Programmed Route Header Pill (if any selected) */}
          {activePlannedRoute && (
            <div className="p-4 rounded-2xl bg-[#7D5319]/10 border border-[#7D5319]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#7D5319] text-white flex items-center justify-center shrink-0">
                  <Route className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#7D5319] dark:text-amber-400">
                    Rodada Programada Activa
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {activePlannedRoute.name}
                  </h4>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-mono">
                    <span>{activePlannedRoute.origin}</span>
                    <ArrowRight className="w-3 h-3" />
                    <span>{activePlannedRoute.destination}</span>
                    <span className="font-bold text-[#7D5319] dark:text-amber-400">({activePlannedRoute.distanceKm} Km meta)</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => handleOpenShareRoute(activePlannedRoute)}
                  className="px-3 py-1.5 rounded-xl bg-[#7D5319] hover:bg-[#684312] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Compartir rodada activa"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Compartir Ruta</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivePlannedRoute(null)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Modo Libre / Desvincular
                </button>
              </div>
            </div>
          )}

          {/* Main GPS Live Tracking Cockpit */}
          <div className="bg-white dark:bg-[#182232] rounded-3xl p-6 md:p-8 shadow-md border border-slate-200 dark:border-slate-800 text-center relative overflow-hidden">
            {/* Visual Accent */}
            <div className="absolute top-0 right-0 left-0 h-28 opacity-15 pointer-events-none overflow-hidden">
              <img
                src="/src/assets/images/pitracer_gps_ride_1792330924658.jpg"
                alt="Scenic Route"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-[#182232]" />
            </div>

            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              {/* Instrument Icon */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#7D5319]/15 flex items-center justify-center text-[#7D5319] dark:text-amber-400 mb-3 shadow-sm">
                <Compass className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>

              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Iniciar Grabación de Ruta GPS
              </h2>

              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                Activa el rastreo GPS satelital para grabar tu velocidad y trayectoria. Al terminar, los kilómetros recorridos se sumarán automáticamente a tu odómetro general.
              </p>

              {/* Active Live Dashboard */}
              {isTracking ? (
                <div className="mt-6 w-full space-y-5 animate-in fade-in duration-300">
                  {/* Telemetry Matrix */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase">Velocímetro</div>
                      <div className="text-3xl font-extrabold font-mono text-[#19437D] dark:text-sky-400 mt-1 tabular-nums">
                        {currentSpeed}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold">KM/H</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase">Distancia</div>
                      <div className="text-3xl font-extrabold font-mono text-[#7D5319] dark:text-amber-400 mt-1 tabular-nums">
                        {distanceKm.toFixed(1)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold">KM</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase">Tiempo</div>
                      <div className="text-xl md:text-2xl font-extrabold font-mono text-slate-800 dark:text-slate-100 mt-2 tabular-nums">
                        {formatTime(elapsedSeconds)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold">TRANSCURRIDO</div>
                    </div>
                  </div>

                  {/* Progress towards programmed goal */}
                  {activePlannedRoute && (
                    <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900 text-left space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-600 dark:text-slate-400">Meta: {activePlannedRoute.destination}</span>
                        <span className="text-[#7D5319] dark:text-amber-400 font-mono">
                          {((distanceKm / activePlannedRoute.distanceKm) * 100).toFixed(0)}% ({distanceKm.toFixed(1)} / {activePlannedRoute.distanceKm} Km)
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#19437D] to-[#7D5319] rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (distanceKm / activePlannedRoute.distanceKm) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Live Route Visualizer (SVG Canvas) */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left relative overflow-hidden">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                        <span className="text-emerald-400 font-bold">Rastreo Satelital Activo</span>
                      </div>
                      <span>Vel. Máx: {maxSpeed} Km/h</span>
                    </div>

                    {/* Animated Graphic Canvas */}
                    <div className="h-32 w-full relative flex items-center justify-center">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100">
                        <defs>
                          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#19437D" />
                            <stop offset="100%" stopColor="#F59E0B" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 10,80 Q 70,10 140,50 T 280,30"
                          fill="none"
                          stroke="url(#routeGradient)"
                          strokeWidth="5"
                          strokeLinecap="round"
                        />
                        {/* Pulsing Motorcycle Rider Marker */}
                        <circle cx="280" cy="30" r="7" fill="#EF4444" className="animate-pulse" />
                        <circle cx="280" cy="30" r="14" fill="#EF4444" opacity="0.3" />
                      </svg>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center justify-between">
                      <span>GPS: {points[points.length - 1]?.lat.toFixed(4) || '10.4806'}, {points[points.length - 1]?.lng.toFixed(4) || '-66.9036'}</span>
                      <span>Odómetro actual: {(currentOdometer + distanceKm).toFixed(1)} Km</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Simulator mode toggle */
                <div className="mt-5 flex flex-col items-center gap-2">
                  <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useSimulator}
                      onChange={(e) => setUseSimulator(e.target.checked)}
                      className="rounded text-[#19437D]"
                    />
                    <span>Modo Simulador de Rodada (Para pruebas sin salir a la autopista)</span>
                  </label>
                </div>
              )}

              {/* Primary Action Button: Iniciar Ruta GPS / Finalizar */}
              <div className="mt-6 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={isTracking ? handleStopTracking : handleStartTracking}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl text-white font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                    isTracking
                      ? 'bg-red-600 hover:bg-red-700 shadow-red-600/30'
                      : 'bg-[#7D5319] hover:bg-[#684312] shadow-[#7D5319]/30'
                  }`}
                >
                  {isTracking ? (
                    <>
                      <Square className="w-5 h-5 fill-current" />
                      <span>Finalizar y Sumar Kilómetros</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-current" />
                      <span>Iniciar Ruta GPS</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Recent Trips Log */}
          <div className="bg-white dark:bg-[#182232] rounded-3xl p-6 md:p-8 shadow-md border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <History className="w-4 h-4 text-[#7D5319] dark:text-amber-400" />
                <span>Historial de Viajes Grabados</span>
              </h3>
              <span className="text-xs text-slate-400">{recentTrips.length} viajes registrados</span>
            </div>

            {recentTrips.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Aún no has grabado rutas. Inicia una rodada para acumular telemetría.
              </div>
            ) : (
              <div className="space-y-3">
                {recentTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#7D5319]/10 text-[#7D5319] dark:text-amber-400 flex items-center justify-center shrink-0">
                        <Navigation className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          Rodada de {trip.distanceKm.toFixed(1)} Km
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          {trip.date} · Duración: {Math.round(trip.durationSeconds / 60)} min · Promedio: {trip.avgSpeedKmh} Km/h
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-sm font-bold font-mono text-[#7D5319] dark:text-amber-400">
                          +{trip.distanceKm.toFixed(1)} Km
                        </span>
                        <div className="text-[11px] text-slate-400">Sumado al odómetro</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenShareTrip(trip)}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-[#7D5319] dark:hover:text-amber-400 transition-colors cursor-pointer"
                        title="Compartir este viaje"
                        aria-label="Compartir viaje"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Program Route Modal Dialog */}
      <ProgramRouteModal
        isOpen={isProgramModalOpen}
        onClose={() => setIsProgramModalOpen(false)}
        onSave={handleAddRoute}
        bikeId={bikeId}
      />

      {/* Share Route Modal Dialog */}
      <ShareRouteModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        route={routeToShare}
        trip={tripToShare}
      />
    </div>
  );
};
