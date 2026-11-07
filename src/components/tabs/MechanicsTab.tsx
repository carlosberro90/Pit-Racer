import React, { useState } from 'react';
import { 
  Building2, 
  Wrench, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  ChevronRight,
  Bell,
  X,
  ExternalLink,
  Users
} from 'lucide-react';
import { Mechanic } from '../../types';

interface MechanicsTabProps {
  mechanics?: Mechanic[];
}

export const MechanicsTab: React.FC<MechanicsTabProps> = ({ mechanics = [] }) => {
  const [notifySuccess, setNotifySuccess] = useState<string | null>(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinType, setJoinType] = useState<'taller' | 'mecanico'>('taller');
  const [applicantName, setApplicantName] = useState('');
  const [applicantContact, setApplicantContact] = useState('');
  const [applicantCity, setApplicantCity] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleRegisterInterest = (e: React.FormEvent) => {
    e.preventDefault();
    setNotifySuccess(
      `¡Gracias ${applicantName || 'amigo motero'}! Hemos registrado tu interés para ${
        joinType === 'taller' ? 'Taller Mecánico' : 'Mecánico'
      }. Te contactaremos pronto.`
    );
    setIsJoinModalOpen(false);
    setApplicantName('');
    setApplicantContact('');
    setApplicantCity('');
    setTimeout(() => setNotifySuccess(null), 5000);
  };

  const handleQuickNotify = (type: string) => {
    setNotifySuccess(`¡Notificación activada! Te avisaremos apenas se habilite el módulo de ${type}.`);
    setTimeout(() => setNotifySuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notifySuccess && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white shadow-lg flex items-center justify-between animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">{notifySuccess}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setNotifySuccess(null)}
            className="text-white/80 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Centered Coming Soon Section */}
      <div className="bg-white dark:bg-[#182232] rounded-3xl p-6 sm:p-12 shadow-md border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-1/4 w-72 h-72 bg-amber-500/10 dark:bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Status Pill Badge */}
        <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#19437D]/10 dark:bg-sky-400/15 text-[#19437D] dark:text-sky-300 border border-[#19437D]/20 dark:border-sky-400/30 text-xs font-bold uppercase tracking-widest mb-4">
          <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Módulo en Construcción</span>
        </div>

        {/* Centered 'Próximamente' */}
        <h1 className="relative text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
          Próximamente
        </h1>

        <p className="relative text-xs sm:text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-lg mx-auto mt-2.5 mb-8 leading-relaxed">
          Estamos integrando la red de atención mecánica más completa para motociclistas. Muy pronto podrás acceder a:
        </p>

        {/* Debajo: 'Taller Mecánico' y 'Mecánico' */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
          {/* Card 1: Taller Mecánico */}
          <div className="p-6 sm:p-7 rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 hover:border-[#19437D] dark:hover:border-sky-500 shadow-xs hover:shadow-md transition-all text-center flex flex-col items-center group">
            <div className="w-16 h-16 rounded-2xl bg-[#19437D]/10 dark:bg-sky-400/15 text-[#19437D] dark:text-sky-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
              <Building2 className="w-8 h-8" />
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Taller Mecánico
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Talleres especializados, centros de diagnóstico computarizado, repuestos originales y servicio integral de mantenimiento para tu moto.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4">
              <span className="text-[11px] font-semibold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                Talleres Certificados
              </span>
              <span className="text-[11px] font-semibold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                Precios Transparentes
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleQuickNotify('Taller Mecánico')}
              className="mt-5 w-full py-2.5 px-4 rounded-xl bg-[#19437D] hover:bg-[#153766] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Avisarme al Lanzar</span>
            </button>
          </div>

          {/* Card 2: Mecánico */}
          <div className="p-6 sm:p-7 rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 hover:border-[#7D5319] dark:hover:border-amber-400 shadow-xs hover:shadow-md transition-all text-center flex flex-col items-center group">
            <div className="w-16 h-16 rounded-2xl bg-[#7D5319]/10 dark:bg-amber-400/15 text-[#7D5319] dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
              <Wrench className="w-8 h-8" />
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Mecánico
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Mecánicos profesionales particulares, servicio a domicilio, auxilio vial en carretera y atención personalizada 24/7.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4">
              <span className="text-[11px] font-semibold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                Atención a Domicilio
              </span>
              <span className="text-[11px] font-semibold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                Auxilio Vial 24/7
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleQuickNotify('Mecánico')}
              className="mt-5 w-full py-2.5 px-4 rounded-xl bg-[#7D5319] hover:bg-[#684312] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Avisarme al Lanzar</span>
            </button>
          </div>
        </div>

        {/* Secondary Call to Action: Join as Partner / Workshop */}
        <div className="relative mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 w-full max-w-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              ¿Tienes un taller o eres mecánico de motos?
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Únete a la red oficial de aliados de Pit Racer.
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setJoinType('taller');
              setIsJoinModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer shrink-0"
          >
            Registrar mi Taller o Perfil
          </button>
        </div>
      </div>

      {/* Modal: Registro de Taller o Mecánico */}
      {isJoinModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsJoinModalOpen(false)}
        >
          <div 
            className="w-full max-w-md bg-white dark:bg-[#182232] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 bg-[#19437D] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Registro de Red de Aliados</h3>
                  <p className="text-[10px] text-blue-100/80">Pit Racer Red Mecánica</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsJoinModalOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterInterest} className="p-5 space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  ¿Cómo deseas registrarte?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setJoinType('taller')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      joinType === 'taller'
                        ? 'border-[#19437D] bg-[#19437D]/10 text-[#19437D] dark:text-sky-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Taller Mecánico</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setJoinType('mecanico')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      joinType === 'mecanico'
                        ? 'border-[#7D5319] bg-[#7D5319]/10 text-[#7D5319] dark:text-amber-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Mecánico</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Nombre {joinType === 'taller' ? 'del Taller' : 'del Mecánico'}
                </label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder={joinType === 'taller' ? 'ej. Motos El Veloz C.A.' : 'ej. Carlos Mendoza'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-[#19437D] dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Teléfono / WhatsApp de Contacto
                </label>
                <input
                  type="text"
                  required
                  value={applicantContact}
                  onChange={(e) => setApplicantContact(e.target.value)}
                  placeholder="ej. +58 412 1234567"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-[#19437D] dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Ciudad / Zona
                </label>
                <input
                  type="text"
                  required
                  value={applicantCity}
                  onChange={(e) => setApplicantCity(e.target.value)}
                  placeholder="ej. Caracas, Maracay, Valencia"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-[#19437D] dark:text-slate-100"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#19437D] hover:bg-[#153766] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Enviar Postulación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
