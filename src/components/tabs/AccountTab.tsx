import React, { useState } from 'react';
import { 
  User, 
  Star, 
  FileText, 
  ChevronRight, 
  Upload, 
  Image as ImageIcon, 
  Layers, 
  Check, 
  DollarSign, 
  RefreshCw, 
  ShieldCheck, 
  Trash2,
  Plus,
  Bike as BikeIcon,
  Heart,
  Award
} from 'lucide-react';
import { Bike } from '../../types';
import { useFirebase } from '../../context/FirebaseContext';
import { Cloud, Smartphone, LogIn, LogOut } from 'lucide-react';

interface AccountTabProps {
  bike: Bike;
  garage: Bike[];
  onSelectBike: (bike: Bike) => void;
  onAddBikeToGarage: (bike: Bike) => void;
  onOpenReportModal: () => void;
  onOpenPhoneModal: () => void;
  onResetApp: () => void;
  onOpenDonationModal: () => void;
  isProMember?: boolean;
  onTogglePro?: () => void;
}

export const AccountTab: React.FC<AccountTabProps> = ({
  bike,
  garage,
  onSelectBike,
  onAddBikeToGarage,
  onOpenReportModal,
  onOpenPhoneModal,
  onResetApp,
  onOpenDonationModal,
  isProMember,
  onTogglePro,
}) => {
  const { user, signInWithGoogle, logOut, isCloudSyncing } = useFirebase();
  const [pilotName, setPilotName] = useState(user?.displayName || 'Piloto Pit Racer');
  const [isEditingPilot, setIsEditingPilot] = useState(false);
  const [uploadedReceipts, setUploadedReceipts] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New bike form state for PRO members
  const [isAddingBike, setIsAddingBike] = useState(false);
  const [newBikeBrand, setNewBikeBrand] = useState('Bera');
  const [newBikeModel, setNewBikeModel] = useState('BR200');
  const [newBikeOdometer, setNewBikeOdometer] = useState('850');
  const [newBikeTank, setNewBikeTank] = useState('14.0');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const isSupporter = localStorage.getItem('pitracer_supporter') === 'true';
  const supporterName = localStorage.getItem('pitracer_supporter_name') || '';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedReceipts((prev) => [event.target!.result as string, ...prev]);
          showToast('¡Foto de factura guardada en tu archivo digital!');
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleExportPdf = () => {
    onOpenReportModal();
  };

  const handleCreateSecondaryBike = (e: React.FormEvent) => {
    e.preventDefault();

    const created: Bike = {
      id: 'bike-' + Date.now(),
      brand: newBikeBrand,
      model: newBikeModel,
      year: 2025,
      odometer: parseInt(newBikeOdometer, 10) || 0,
      tankCapacity: parseFloat(newBikeTank) || 12.0,
      nickname: `${newBikeBrand} ${newBikeModel}`,
    };

    onAddBikeToGarage(created);
    setIsAddingBike(false);
    showToast(`¡Moto ${created.brand} agregada a tu garaje!`);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-lg flex items-center justify-between animate-in fade-in">
          <span>{toastMessage}</span>
          <Check className="w-4 h-4 text-amber-400" />
        </div>
      )}

      {/* Pilot Avatar and Profile Header (Matches Flutter) */}
      <div className="flex flex-col items-center text-center">
        {/* CircleAvatar: radius 40, backgroundColor brandPrimaryBlue, Icons.person */}
        <div className="w-20 h-20 rounded-full bg-[#19437D] flex items-center justify-center text-white shadow-md mb-3">
          <User className="w-11 h-11" />
        </div>

        {isEditingPilot ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={pilotName}
              onChange={(e) => setPilotName(e.target.value)}
              className="px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-sm font-bold text-center"
            />
            <button
              onClick={() => setIsEditingPilot(false)}
              className="text-xs bg-[#19437D] text-white px-2 py-1 rounded-md"
            >
              Listo
            </button>
          </div>
        ) : (
          <div 
            onClick={() => setIsEditingPilot(true)}
            className="group cursor-pointer flex items-center gap-1.5"
            title="Haz clic para editar nombre"
          >
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {pilotName}
            </h2>
            <span className="text-[11px] text-slate-400 group-hover:text-slate-600">✎</span>
          </div>
        )}

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {user ? `Conectado: ${user.email}` : 'Moneda Base: USD ($) · Pit Racer Rider'}
        </p>
      </div>

      {/* Cloud & Mobile Testing Card */}
      <div className="bg-white dark:bg-[#182232] rounded-3xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>Firebase Cloud Sync</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="text-[11px] text-slate-400">
                {user ? 'Sincronización en la nube activa' : 'Inicia sesión para sincronizar con tu móvil'}
              </div>
            </div>
          </div>

          {user ? (
            <button
              type="button"
              onClick={logOut}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cerrar Sesión
            </button>
          ) : (
            <button
              type="button"
              onClick={signInWithGoogle}
              className="px-3 py-1.5 rounded-lg bg-[#19437D] hover:bg-[#153766] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Conectar Google</span>
            </button>
          )}
        </div>

        {/* Quick Mobile QR trigger */}
        <button
          type="button"
          onClick={onOpenPhoneModal}
          className="w-full py-2.5 px-4 rounded-xl border border-dashed border-[#19437D]/40 bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-50 text-[#19437D] dark:text-sky-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Smartphone className="w-4 h-4 text-emerald-500" />
          <span>Escanear Código QR para abrir en mi teléfono</span>
        </button>
      </div>

      {/* Donations & Community Support Card */}
      <div className="rounded-3xl p-6 shadow-md border bg-gradient-to-br from-white via-rose-50/30 to-white dark:from-[#182232] dark:via-rose-950/15 dark:to-[#182232] border-slate-200 dark:border-slate-800 transition-all">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Donaciones y Apoyo
              </span>
              <div className="text-[10px] text-slate-400">Comunidad 100% Libre</div>
            </div>
          </div>
          <span className="text-xs font-extrabold tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-mono">
            GRATUITO
          </span>
        </div>

        {isSupporter && (
          <div className="mt-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500 shrink-0" />
            <span>¡Gracias{supporterName ? ` ${supporterName}` : ''}! Eres un Donante Aliado de Pit Racer ❤️</span>
          </div>
        )}

        <p className="text-xs text-slate-600 dark:text-slate-300 py-4 leading-relaxed">
          Pit Racer no cobra membresías ni suscripciones. Todas las funciones de control de tu moto están abiertas para todos. Si deseas apoyar el mantenimiento de servidores y nuevas mejoras, puedes realizar una donación voluntaria.
        </p>

        <button
          type="button"
          onClick={onOpenDonationModal}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-[#19437D] to-[#19437D] hover:from-rose-700 hover:to-[#153766] text-white text-sm font-bold shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Heart className="w-4 h-4 fill-white" />
          <span>Hacer una Donación</span>
        </button>
      </div>

      {/* PDF Export ListTile */}
      <div 
        onClick={handleExportPdf}
        className="bg-white dark:bg-[#182232] rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 hover:border-[#19437D]/50 transition-all cursor-pointer flex items-center justify-between group"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#19437D]/10 text-[#19437D] dark:text-sky-400 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-[#19437D] transition-colors">
              Exportar Reporte a PDF
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Historial completo de gastos y mantenimiento
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>

      {/* Multi-Bike Garage Manager */}
      <div className="bg-white dark:bg-[#182232] rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BikeIcon className="w-4 h-4 text-[#19437D]" />
              <span>Garaje de Motos ({garage.length})</span>
            </h3>
            <p className="text-xs text-slate-400">Gestiona varias motos en tu misma cuenta</p>
          </div>

          <button
            onClick={() => setIsAddingBike(true)}
            className="text-xs font-bold text-[#19437D] dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar Moto</span>
          </button>
        </div>

        {/* Garage list */}
        <div className="space-y-2">
          {garage.map((gBike) => {
            const isCurrent = gBike.id === bike.id;
            return (
              <div
                key={gBike.id}
                onClick={() => onSelectBike(gBike)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isCurrent
                    ? 'border-[#19437D] bg-blue-50/50 dark:bg-blue-950/30 ring-1 ring-[#19437D]'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="font-bold text-xs text-slate-800 dark:text-slate-100">
                    {gBike.brand} {gBike.model} ({gBike.year})
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Odómetro: {gBike.odometer.toLocaleString()} Km · Tanque {gBike.tankCapacity}L
                  </div>
                </div>

                {isCurrent ? (
                  <span className="text-[10px] font-bold text-[#19437D] dark:text-sky-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full shadow-xs">
                    Activa
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 hover:text-slate-600">Cambiar</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Inline Add Bike Form */}
        {isAddingBike && (
          <form onSubmit={handleCreateSecondaryBike} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Nueva Motocicleta</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <input
                type="text"
                placeholder="Marca (ej. Bera)"
                value={newBikeBrand}
                onChange={(e) => setNewBikeBrand(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700"
              />
              <input
                type="text"
                placeholder="Modelo (ej. BR200)"
                value={newBikeModel}
                onChange={(e) => setNewBikeModel(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700"
              />
              <input
                type="number"
                placeholder="Odómetro Km"
                value={newBikeOdometer}
                onChange={(e) => setNewBikeOdometer(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 font-mono"
              />
              <input
                type="number"
                placeholder="Tanque Litros"
                value={newBikeTank}
                onChange={(e) => setNewBikeTank(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 font-mono"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsAddingBike(false)}
                className="flex-1 py-1.5 text-xs text-slate-500 rounded-lg hover:bg-slate-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-1.5 text-xs font-bold text-white bg-[#19437D] rounded-lg"
              >
                Guardar Moto
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Invoice Photo Upload (PRO Feature) */}
      <div className="bg-white dark:bg-[#182232] rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#7D5319]" />
              <span>Fotos de Facturas y Recibos</span>
            </h3>
            <p className="text-xs text-slate-400">Respaldo digital de repuestos y servicios</p>
          </div>

          <label className="text-xs font-bold text-[#7D5319] dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Subir Recibo</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        {uploadedReceipts.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {uploadedReceipts.map((src, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <img src={src} alt="Factura" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
            Aún no has subido facturas. Guarda fotos de tus comprobantes de taller aquí.
          </div>
        )}
      </div>

      {/* Official Brand Seal / Badge */}
      <div className="pt-6 pb-2 flex flex-col items-center justify-center text-center space-y-2 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="w-20 h-20 rounded-3xl bg-[#19437D] dark:bg-[#121C2B] p-3 flex items-center justify-center shadow-md">
          <img
            src="/assets/aistudio/pitracer_logo_white.png"
            alt="Pit Racer Official Logo"
            className="w-full h-full object-contain drop-shadow-sm transition-transform hover:scale-105"
          />
        </div>
        <div className="text-xs font-black tracking-wider text-[#19437D] dark:text-sky-300">
          PIT RACER
        </div>
        <p className="text-[11px] text-slate-400">
          Mantenimiento de Moto · by CCS
        </p>
      </div>

      {/* Reset Application Data Button */}
      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={() => {
            if (confirm('¿Restablecer datos iniciales de la motocicleta?')) {
              onResetApp();
            }
          }}
          className="text-xs text-red-500 hover:text-red-600 underline cursor-pointer"
        >
          Restablecer datos y reconfigurar motocicleta
        </button>
      </div>
    </div>
  );
};
