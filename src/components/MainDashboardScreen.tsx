import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Wrench, 
  Compass, 
  ShieldCheck, 
  User, 
  Star, 
  Sun, 
  Moon, 
  Check, 
  Fuel, 
  Gauge, 
  Sparkles,
  RefreshCw,
  ChevronDown,
  Smartphone,
  Cloud,
  Heart
} from 'lucide-react';
import { Bike, FuelLog, MaintenanceTask, MaintenanceLogEntry, GpsTrip, Mechanic, ProgrammedRoute } from '../types';
import { DEFAULT_TASKS, DEFAULT_FUEL_LOGS, VERIFIED_MECHANICS, DEFAULT_PROGRAMMED_ROUTES } from '../data/defaults';
import { BrandLogo } from './common/BrandLogo';
import { HomeTab } from './tabs/HomeTab';
import { MaintenanceTab } from './tabs/MaintenanceTab';
import { RouteGpsTab } from './tabs/RouteGpsTab';
import { MechanicsTab } from './tabs/MechanicsTab';
import { AccountTab } from './tabs/AccountTab';
import { OdometerModal } from './modals/OdometerModal';
import { FuelModal } from './modals/FuelModal';
import { CompleteServiceModal } from './modals/CompleteServiceModal';
import { PrintReportModal } from './modals/PrintReportModal';
import { PhoneTestModal } from './modals/PhoneTestModal';
import { DonationModal } from './modals/DonationModal';
import { useFirebase } from '../context/FirebaseContext';

interface MainDashboardScreenProps {
  initialBike: Bike;
  isDarkMode: boolean;
  onThemeToggle: () => void;
  onResetApp: () => void;
}

export const MainDashboardScreen: React.FC<MainDashboardScreenProps> = ({
  initialBike,
  isDarkMode,
  onThemeToggle,
  onResetApp,
}) => {
  const [currentBike, setCurrentBike] = useState<Bike>(() => {
    const saved = localStorage.getItem('pitracer_bike');
    return saved ? JSON.parse(saved) : initialBike;
  });

  const [garage, setGarage] = useState<Bike[]>(() => {
    const saved = localStorage.getItem('pitracer_garage');
    return saved ? JSON.parse(saved) : [initialBike];
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentOdometer, setCurrentOdometer] = useState<number>(currentBike.odometer);
  const [isProMember, setIsProMember] = useState<boolean>(() => {
    return localStorage.getItem('pitracer_pro') === 'true';
  });

  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(() => {
    const saved = localStorage.getItem('pitracer_fuel_logs');
    return saved ? JSON.parse(saved) : DEFAULT_FUEL_LOGS;
  });

  const [tasks, setTasks] = useState<MaintenanceTask[]>(() => {
    const saved = localStorage.getItem('pitracer_tasks');
    return saved ? JSON.parse(saved) : DEFAULT_TASKS;
  });

  const [serviceLogs, setServiceLogs] = useState<MaintenanceLogEntry[]>(() => {
    const saved = localStorage.getItem('pitracer_service_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [trips, setTrips] = useState<GpsTrip[]>(() => {
    const saved = localStorage.getItem('pitracer_trips');
    return saved ? JSON.parse(saved) : [];
  });

  const [programmedRoutes, setProgrammedRoutes] = useState<ProgrammedRoute[]>(() => {
    const saved = localStorage.getItem('pitracer_programmed_routes');
    return saved ? JSON.parse(saved) : DEFAULT_PROGRAMMED_ROUTES;
  });

  // SnackBar / Toast state
  const [snackBarMessage, setSnackBarMessage] = useState<string | null>(null);

  // Modals state
  const [isOdometerModalOpen, setIsOdometerModalOpen] = useState(false);
  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);
  const [fuelModalTab, setFuelModalTab] = useState<'register' | 'history'>('register');
  const [selectedTaskForService, setSelectedTaskForService] = useState<MaintenanceTask | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  const handleOpenFuelModal = (tab: 'register' | 'history' = 'register') => {
    setFuelModalTab(tab);
    setIsFuelModalOpen(true);
  };

  const {
    user,
    syncBikeToCloud,
    syncFuelLogToCloud,
    syncTaskToCloud,
    syncServiceLogToCloud,
    syncTripToCloud,
    isCloudSyncing,
  } = useFirebase();

  // Save changes to localStorage and Cloud
  useEffect(() => {
    localStorage.setItem('pitracer_bike', JSON.stringify({ ...currentBike, odometer: currentOdometer }));
    localStorage.setItem('pitracer_pro', isProMember.toString());
    localStorage.setItem('pitracer_fuel_logs', JSON.stringify(fuelLogs));
    localStorage.setItem('pitracer_tasks', JSON.stringify(tasks));
    localStorage.setItem('pitracer_service_logs', JSON.stringify(serviceLogs));
    localStorage.setItem('pitracer_trips', JSON.stringify(trips));
    localStorage.setItem('pitracer_garage', JSON.stringify(garage));
  }, [currentBike, currentOdometer, isProMember, fuelLogs, tasks, serviceLogs, trips, garage]);

  const showSnackBar = (msg: string) => {
    setSnackBarMessage(msg);
    setTimeout(() => setSnackBarMessage(null), 3000);
  };

  const handleUpdateOdometer = (newOdo: number) => {
    setCurrentOdometer(newOdo);
    const updated = { ...currentBike, odometer: newOdo };
    setCurrentBike(updated);
    syncBikeToCloud(updated);
    showSnackBar(`Odómetro actualizado a ${newOdo.toLocaleString()} Km`);
  };

  const handleUpdateBikePhoto = (photoUrl: string | undefined) => {
    const updated = { ...currentBike, photoUrl };
    setCurrentBike(updated);
    setGarage((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    syncBikeToCloud(updated);
    showSnackBar(photoUrl ? '¡Foto de perfil de la moto guardada!' : 'Foto de perfil eliminada');
  };

  const handleSaveFuel = (newLogData: Omit<FuelLog, 'id'>) => {
    const newEntry: FuelLog = {
      ...newLogData,
      id: 'fuel-' + Date.now(),
    };
    setFuelLogs([newEntry, ...fuelLogs]);
    syncFuelLogToCloud(newEntry);
    if (newLogData.odometer > currentOdometer) {
      handleUpdateOdometer(newLogData.odometer);
    }
    showSnackBar(`Tanqueo de $${newLogData.totalUsd.toFixed(2)} USD registrado y sincronizado`);
  };

  const handleSaveServiceLog = (logData: Omit<MaintenanceLogEntry, 'id'>, newOdo: number) => {
    const newEntry: MaintenanceLogEntry = {
      ...logData,
      id: 'srv-' + Date.now(),
    };
    setServiceLogs([newEntry, ...serviceLogs]);
    syncServiceLogToCloud(newEntry);

    // Update the task's last serviced reading
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === logData.taskId) {
          const updatedTask = {
            ...t,
            lastServicedKm: newOdo,
            lastServicedDate: logData.date,
          };
          syncTaskToCloud(updatedTask);
          return updatedTask;
        }
        return t;
      })
    );

    if (newOdo > currentOdometer) {
      handleUpdateOdometer(newOdo);
    }

    showSnackBar(`Servicio "${logData.taskTitle}" completado y respaldado en la nube`);
  };

  const handleAddNewTask = (newTask: MaintenanceTask) => {
    setTasks([...tasks, newTask]);
    showSnackBar(`Servicio "${newTask.title}" añadido exitosamente`);
  };

  const handleUpdateTaskInterval = (taskId: string, newIntervalKm: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, intervalKm: newIntervalKm } : t))
    );
    showSnackBar(`Intervalo ajustado a ${newIntervalKm} Km`);
  };

  const handleFinishGpsRide = (addedKm: number, newTrip: GpsTrip) => {
    const nextOdometer = Math.round(currentOdometer + addedKm);
    setCurrentOdometer(nextOdometer);
    setCurrentBike((prev) => ({ ...prev, odometer: nextOdometer }));
    const updatedTrips = [newTrip, ...trips];
    setTrips(updatedTrips);
    localStorage.setItem('pitracer_trips', JSON.stringify(updatedTrips));
  };

  const handleAddProgrammedRoute = (route: ProgrammedRoute) => {
    const updated = [route, ...programmedRoutes];
    setProgrammedRoutes(updated);
    localStorage.setItem('pitracer_programmed_routes', JSON.stringify(updated));
    showSnackBar(`Ruta "${route.name}" programada con éxito.`);
  };

  const handleDeleteProgrammedRoute = (id: string) => {
    const updated = programmedRoutes.filter((r) => r.id !== id);
    setProgrammedRoutes(updated);
    localStorage.setItem('pitracer_programmed_routes', JSON.stringify(updated));
    showSnackBar('Ruta eliminada de la programación.');
  };

  const handleSelectBikeFromGarage = (b: Bike) => {
    setCurrentBike(b);
    setCurrentOdometer(b.odometer);
    showSnackBar(`Motocicleta cambiada a ${b.brand} ${b.model}`);
  };

  const handleAddBikeToGarage = (b: Bike) => {
    setGarage([...garage, b]);
    setCurrentBike(b);
    setCurrentOdometer(b.odometer);
  };

  // 5 Tab items matching Flutter
  const TABS = [
    { label: 'Panel', icon: LayoutDashboard },
    { label: 'Servicios', icon: Wrench },
    { label: 'Ruta GPS', icon: Compass },
    { label: 'Talleres', icon: ShieldCheck },
    { label: 'Cuenta', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F8] dark:bg-[#10141D] text-slate-800 dark:text-slate-100 flex flex-col transition-colors pb-20 md:pb-8">
      {/* Top AppBar (Matches Flutter: AppBar title 'Pit Racer - Brand Model' + Star Pro toggle + Theme toggle) */}
      <header className="sticky top-0 z-30 bg-[#19437D] dark:bg-[#121C2B] text-white shadow-md transition-colors">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {currentBike.photoUrl ? (
              <div className="relative shrink-0">
                <img
                  src={currentBike.photoUrl}
                  alt={`${currentBike.brand} ${currentBike.model}`}
                  className="w-10 h-10 rounded-2xl object-cover border-2 border-white/20 shadow-xs"
                />
              </div>
            ) : (
              <BrandLogo size={38} variant="white" />
            )}
            <div className="min-w-0">
              <h1 className="text-sm md:text-base font-bold tracking-tight truncate leading-tight">
                {currentBike.brand} {currentBike.model}
              </h1>
              <div className="text-[11px] text-blue-100/80 truncate font-mono">
                {currentOdometer.toLocaleString()} Km · Tanque {currentBike.tankCapacity}L
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-black/15 p-1 rounded-2xl">
            {TABS.map((tab, idx) => {
              const Icon = tab.icon;
              const isActive = currentIndex === idx;
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#19437D] shadow-sm font-bold'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions: Phone Test + PRO Star Button + Theme Toggle */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsPhoneModalOpen(true)}
              className="p-2 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Probar en teléfono móvil (Código QR)"
            >
              <Smartphone className="w-4 h-4 text-emerald-300" />
              <span className="hidden sm:inline text-xs font-bold text-emerald-200">
                Móvil QR
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsDonationModalOpen(true)}
              className="p-2 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Donaciones y apoyo a Pit Racer"
            >
              <Heart className="w-4 h-4 text-rose-300 fill-rose-300/40" />
              <span className="hidden sm:inline text-xs font-bold text-rose-100">
                Donaciones
              </span>
            </button>

            <button
              type="button"
              onClick={onThemeToggle}
              className="p-2 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition-colors"
              title="Cambiar Modo Claro / Oscuro"
              aria-label="Cambiar tema"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* SnackBar / Notification banner (Matches Flutter ScaffoldMessenger) */}
      {snackBarMessage && (
        <div className="fixed top-16 right-4 left-4 sm:left-auto sm:w-96 z-50 p-3.5 rounded-2xl bg-slate-900 text-white shadow-xl border border-slate-700 flex items-center justify-between text-xs font-semibold animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{snackBarMessage}</span>
          </div>
          <button
            onClick={() => setSnackBarMessage(null)}
            className="text-slate-400 hover:text-white text-xs ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Tab Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 lg:p-8">
        {currentIndex === 0 && (
          <HomeTab
            bike={currentBike}
            currentOdometer={currentOdometer}
            tankCapacity={currentBike.tankCapacity}
            fuelLogs={fuelLogs}
            tasks={tasks}
            onOpenOdometerModal={() => setIsOdometerModalOpen(true)}
            onOpenFuelModal={handleOpenFuelModal}
            onNavigateToTab={(idx) => setCurrentIndex(idx)}
            onUpdateBikePhoto={handleUpdateBikePhoto}
          />
        )}

        {currentIndex === 1 && (
          <MaintenanceTab
            tasks={tasks}
            logs={serviceLogs}
            currentOdometer={currentOdometer}
            onOpenCompleteModal={(task) => setSelectedTaskForService(task)}
            onAddTask={handleAddNewTask}
            onUpdateTaskInterval={handleUpdateTaskInterval}
          />
        )}

        {currentIndex === 2 && (
          <RouteGpsTab
            currentOdometer={currentOdometer}
            onFinishRide={handleFinishGpsRide}
            recentTrips={trips}
            programmedRoutes={programmedRoutes}
            onAddProgrammedRoute={handleAddProgrammedRoute}
            onDeleteProgrammedRoute={handleDeleteProgrammedRoute}
            bikeId={currentBike.id}
          />
        )}

        {currentIndex === 3 && <MechanicsTab mechanics={VERIFIED_MECHANICS} />}

        {currentIndex === 4 && (
          <AccountTab
            bike={currentBike}
            garage={garage}
            onSelectBike={handleSelectBikeFromGarage}
            onAddBikeToGarage={handleAddBikeToGarage}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onOpenPhoneModal={() => setIsPhoneModalOpen(true)}
            onResetApp={onResetApp}
            onOpenDonationModal={() => setIsDonationModalOpen(true)}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Matches Flutter BottomNavigationBar) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#121C2B]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-lg px-2 py-1.5">
        <div className="grid grid-cols-5 items-center max-w-md mx-auto">
          {TABS.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = currentIndex === idx;
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
                  isActive
                    ? 'text-[#19437D] dark:text-sky-400 font-bold scale-105'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] tracking-tight leading-none">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Modals */}
      <OdometerModal
        isOpen={isOdometerModalOpen}
        onClose={() => setIsOdometerModalOpen(false)}
        currentOdometer={currentOdometer}
        onSave={handleUpdateOdometer}
      />

      <FuelModal
        isOpen={isFuelModalOpen}
        onClose={() => setIsFuelModalOpen(false)}
        bikeId={currentBike.id}
        currentOdometer={currentOdometer}
        tankCapacity={currentBike.tankCapacity}
        fuelLogs={fuelLogs}
        initialTab={fuelModalTab}
        onSave={handleSaveFuel}
      />

      <CompleteServiceModal
        isOpen={selectedTaskForService !== null}
        onClose={() => setSelectedTaskForService(null)}
        task={selectedTaskForService}
        currentOdometer={currentOdometer}
        onSave={handleSaveServiceLog}
      />

      <PrintReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        bike={currentBike}
        currentOdometer={currentOdometer}
        tankCapacity={currentBike.tankCapacity}
        fuelLogs={fuelLogs}
        tasks={tasks}
        serviceLogs={serviceLogs}
      />

      <PhoneTestModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        sharedUrl={typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost') ? window.location.origin : 'https://ais-dev-qknd363l2brz6chez6ad6q-635486922360.us-east1.run.app'}
      />

      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        onDonationSuccess={() => showSnackBar('¡Muchas gracias por apoyar a Pit Racer!')}
      />
    </div>
  );
};
