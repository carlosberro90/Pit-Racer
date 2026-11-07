import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Gauge, 
  Fuel, 
  Calendar, 
  Compass, 
  Sparkles,
  Camera,
  Upload,
  X,
  Palette
} from 'lucide-react';
import { Bike } from '../types';
import { BrandLogo } from './common/BrandLogo';

interface InitialBikeFormProps {
  onComplete: (bike: Bike) => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

export const InitialBikeForm: React.FC<InitialBikeFormProps> = ({
  onComplete,
  isDarkMode,
  onThemeToggle,
}) => {
  const [brand, setBrand] = useState('Bera');
  const [model, setModel] = useState('BR200');
  const [year, setYear] = useState('2025');
  const [odometer, setOdometer] = useState('0');
  const [tankCapacity, setTankCapacity] = useState('14.0');
  const [nickname, setNickname] = useState('');
  const [color, setColor] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);

  const parsedTank = parseFloat(tankCapacity) || 14.0;
  const estimatedRange = Math.round(38.5 * parsedTank);

  // Handle optional motorcycle photo upload with canvas compression
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          setPhotoUrl(compressedDataUrl);
        } else {
          setPhotoUrl(event.target?.result as string);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand.trim() || !model.trim()) return;

    const newBike: Bike = {
      id: 'bike-' + Date.now(),
      brand: brand.trim(),
      model: model.trim(),
      year: parseInt(year, 10) || new Date().getFullYear(),
      odometer: parseInt(odometer, 10) || 0,
      tankCapacity: parseFloat(tankCapacity) || 12.0,
      color: color.trim() || undefined,
      nickname: nickname.trim() || `${brand} ${model}`,
      fuelType: 'Gasolina 95 Octanos',
      photoUrl: photoUrl || undefined,
    };

    onComplete(newBike);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] dark:bg-[#10141D] text-slate-800 dark:text-slate-100 flex flex-col transition-colors">
      {/* Top Bar - Compact Header */}
      <header className="sticky top-0 z-30 bg-[#19437D] dark:bg-[#121C2B] text-white shadow-md px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <BrandLogo size={32} variant="white" />
          <div>
            <h1 className="text-sm font-bold tracking-tight leading-tight">Pit Racer</h1>
            <p className="text-[10px] text-blue-100/80">Registro Inicial de la Moto</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onThemeToggle}
          className="p-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Cambiar Modo Claro / Oscuro"
          aria-label="Cambiar tema"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-3 sm:p-6 md:p-8 flex flex-col justify-start sm:justify-center">
        <div className="bg-white dark:bg-[#182232] rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Hero Banner Header - Proportioned for Mobile */}
          <div className="relative h-24 sm:h-36 md:h-44 overflow-hidden bg-slate-900">
            <img
              src="/src/assets/images/pitracer_moto_hero_1792330924010.jpg"
              alt="Pit Racer Motorcycle"
              className="w-full h-full object-cover object-center opacity-85"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent flex flex-col justify-end p-3 sm:p-5">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="bg-[#7D5319] text-white text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider">
                  Configuración
                </span>
                <span className="text-[11px] text-slate-300">Paso 1 de 1</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
                Configura tu Motocicleta
              </h2>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {/* Optional Photo Upload Banner/Card */}
              <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3.5">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 shrink-0 flex items-center justify-center shadow-xs">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Foto de la moto"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                      <Camera className="w-6 h-6 mb-0.5" />
                      <span className="text-[9px] font-semibold uppercase tracking-wider">Sin foto</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                      Foto de Perfil de la Moto
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-200/70 dark:bg-slate-800 px-2 py-0.5 rounded-full font-semibold">
                      Opcional
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
                    Sube una foto para identificar tu moto en la aplicación
                  </p>

                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="initial-moto-photo"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#19437D]/10 dark:bg-sky-500/10 hover:bg-[#19437D]/20 text-[#19437D] dark:text-sky-300 cursor-pointer transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{photoUrl ? 'Cambiar Foto' : 'Subir Foto'}</span>
                    </label>
                    <input
                      id="initial-moto-photo"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                    {photoUrl && (
                      <button
                        type="button"
                        onClick={() => setPhotoUrl(undefined)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-500/10 cursor-pointer transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Quitar</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                {/* Brand */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Marca <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="ej. Toro, Bera"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#19437D]"
                  />
                </div>

                {/* Model */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Modelo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="ej. TR150, SBR"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#19437D]"
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Año
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1980"
                      max="2030"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="2025"
                      className="w-full pl-8 pr-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#19437D]"
                    />
                    <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                {/* Initial Odometer */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Odómetro (Km) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="0"
                      step="1"
                      value={odometer}
                      onChange={(e) => setOdometer(e.target.value)}
                      placeholder="1940"
                      className="w-full pl-8 pr-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-mono font-bold text-[#19437D] dark:text-sky-300 focus:outline-none focus:ring-2 focus:ring-[#19437D]"
                    />
                    <Gauge className="w-3.5 h-3.5 text-[#19437D] dark:text-sky-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                {/* Tank Capacity */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tanque (Litros) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="1"
                      max="40"
                      step="0.5"
                      value={tankCapacity}
                      onChange={(e) => setTankCapacity(e.target.value)}
                      placeholder="12.0"
                      className="w-full pl-8 pr-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#19437D]"
                    />
                    <Fuel className="w-3.5 h-3.5 text-[#7D5319] dark:text-amber-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                {/* Color (Opcional) */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Color <span className="text-[10px] font-normal text-slate-400">(Opcional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="ej. Negro, Rojo, Azul"
                      className="w-full pl-8 pr-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#19437D]"
                    />
                    <Palette className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                  {/* Quick color selector chips */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {['Negro', 'Rojo', 'Azul', 'Blanco', 'Gris'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                          color === c
                            ? 'bg-[#19437D] text-white border-[#19437D] font-bold'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nickname / Alias */}
                <div className="col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Apodo de la Moto <span className="text-[10px] font-normal text-slate-400">(Opcional)</span>
                  </label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="ej. La Furia, El Toro"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#19437D]"
                  />
                </div>
              </div>

              {/* Compact Telemetry Preview Box */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#7D5319]/10 text-[#7D5319] dark:text-amber-400">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Autonomía Teórica:</span>
                    <span className="text-xs sm:text-sm font-bold text-[#7D5319] dark:text-amber-400 font-mono">
                      ~{estimatedRange} Km
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 text-right font-mono">
                  {brand} {model} ({year}) {color.trim() ? `· ${color.trim()}` : ''}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-[#19437D] hover:bg-[#153766] active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-[#19437D]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Iniciar Pit Racer</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-2.5 text-center text-[10px] sm:text-xs text-slate-400 dark:text-slate-500">
        Pit Racer Telemetry Engine · Moneda base USD ($)
      </footer>
    </div>
  );
};
