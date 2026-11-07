import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Coffee, 
  Fuel, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink,
  ShieldCheck,
  Award,
  ArrowRight,
  Info
} from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDonationSuccess?: () => void;
}

type PaymentTab = 'binance' | 'zinli' | 'paypal';

// Official Payment Brand Logos as SVG components
const BinanceLogo: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="10" fill="#181A20" />
    <g transform="translate(6, 6) scale(0.875)">
      <path d="M16 2.5L20.2 6.7L16 10.9L11.8 6.7L16 2.5Z" fill="#F0B90B" />
      <path d="M6.7 11.8L10.9 7.6L15.1 11.8L10.9 16L6.7 11.8Z" fill="#F0B90B" />
      <path d="M21.1 11.8L25.3 7.6L29.5 11.8L25.3 16L21.1 11.8Z" fill="#F0B90B" />
      <path d="M16 21.1L20.2 16.9L24.4 21.1L20.2 25.3L16 21.1Z" fill="#F0B90B" />
      <path d="M7.6 20.2L11.8 16L16 20.2L11.8 24.4L7.6 20.2Z" fill="#F0B90B" />
      <path d="M16 12.8L19.2 16L16 19.2L12.8 16L16 12.8Z" fill="#F0B90B" />
      <path d="M16 29.5L20.2 25.3L16 21.1L11.8 25.3L16 29.5Z" fill="#F0B90B" />
    </g>
  </svg>
);

const ZinliLogo: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="10" fill="#6C28D9" />
    {/* Zinli stylised Z with mint dot */}
    <g transform="translate(8, 7.5)">
      {/* Dynamic white Z shape with smooth curves */}
      <path
        d="M3 3.5C3 2.67 3.67 2 4.5 2H19.5C20.33 2 21 2.67 21 3.5C21 4.14 20.59 4.7 19.98 4.91L7.85 19.5H19.5C20.33 19.5 21 20.17 21 21C21 21.83 20.33 22.5 19.5 22.5H4.5C3.67 22.5 3 21.83 3 21C3 20.36 3.41 19.8 4.02 19.59L16.15 5H4.5C3.67 5 3 4.33 3 3.5Z"
        fill="#FFFFFF"
      />
      {/* Brand neon cyan/mint dot */}
      <circle cx="21" cy="4" r="2.5" fill="#00E599" />
    </g>
  </svg>
);

const PayPalLogo: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="10" fill="#003087" />
    {/* Double overlapping P monogram */}
    <g transform="translate(10, 8)">
      {/* Back P */}
      <path
        d="M5.5 3.5H13.2C16.8 3.5 19.2 5.8 18.5 9.8C17.8 13.8 14.8 16.2 11.2 16.2H8.3L6.8 24.5H2L5.5 3.5Z"
        fill="#0079C1"
      />
      {/* Front P */}
      <path
        d="M9.5 7.5H16.8C20 7.5 22.2 9.5 21.5 13.2C20.8 17 18 19.2 14.6 19.2H11.9L10.5 27H6.2L9.5 7.5Z"
        fill="#00457C"
        fillOpacity="0.5"
      />
      <path
        d="M8.2 9H15.8C18.8 9 20.8 10.8 20.2 14.2C19.5 17.8 17 19.8 13.8 19.8H11.2L9.8 27H6L8.2 9Z"
        fill="#0079C1"
      />
      <path
        d="M11.9 19.2H14.6C18 19.2 20.8 17 21.5 13.2C22.2 9.5 20 7.5 16.8 7.5H13.5L11.9 19.2Z"
        fill="#0079C1"
        fillOpacity="0.75"
      />
    </g>
  </svg>
);

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  onDonationSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<PaymentTab>('binance');
  const [selectedAmount, setSelectedAmount] = useState<number | string>(1);
  const [customAmount, setCustomAmount] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [donorName, setDonorName] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, fieldName: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleRegisterDonation = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('pitracer_supporter', 'true');
    localStorage.setItem('pitracer_supporter_name', donorName.trim() || 'Piloto Solidario');
    setIsConfirmed(true);
    if (onDonationSuccess) {
      onDonationSuccess();
    }
  };

  const currentAmountDisplay = selectedAmount === 'custom' 
    ? (customAmount ? `$${customAmount} USD` : 'Monto libre')
    : `$${selectedAmount} USD`;

  const PAYMENT_OPTIONS = [
    {
      id: 'binance' as PaymentTab,
      name: 'Binance Pay',
      tag: 'Cripto / USDT',
      shortTag: 'USDT',
      Logo: BinanceLogo,
    },
    {
      id: 'zinli' as PaymentTab,
      name: 'Zinli',
      tag: 'Dólares USD',
      shortTag: '$ USD',
      Logo: ZinliLogo,
    },
    {
      id: 'paypal' as PaymentTab,
      name: 'PayPal',
      tag: 'Tarjetas / Saldo',
      shortTag: 'Tarjetas',
      Logo: PayPalLogo,
    },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full sm:max-w-xl bg-white dark:bg-[#182232] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92dvh] sm:max-h-[88vh] flex flex-col animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-2 duration-200 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile handle */}
        <div className="sm:hidden w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2" />

        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-rose-600 via-[#19437D] to-[#19437D] text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-xs">
              <Heart className="w-5 h-5 text-white fill-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg leading-tight">Donaciones a Pit Racer</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-rose-100">
                  Comunidad Libre
                </span>
              </div>
              <p className="text-[11px] text-blue-100/90 mt-0.5">
                100% gratuita para moteros · Sin suscripciones forzosas
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto overscroll-contain space-y-5 flex-1">
          {isConfirmed ? (
            /* Thank-you state */
            <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
                <Heart className="w-10 h-10 fill-rose-500" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  ¡Aporte Registrado con Éxito!
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                  ¡Muchas gracias, {donorName || 'Hermano Motero'}!
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto pt-1 leading-relaxed">
                  Tu donación ayuda a costear servidores, mejorar la telemetría GPS satelital y asegurar que Pit Racer siga siendo una herramienta gratuita para todos los motociclistas.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center justify-center gap-2">
                <Award className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Se ha activado tu insignia de Donante Aliado en tu cuenta</span>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-all cursor-pointer shadow-sm"
                >
                  Regresar a la aplicación
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Motero Solidarity Manifesto Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-slate-100 font-bold">
                    Pit Racer es 100% libre para todos:
                  </strong>{' '}
                  Sin planes pagos ni membresías. Tu donación voluntaria por <strong className="text-slate-800 dark:text-slate-200">Binance Pay</strong>, <strong className="text-slate-800 dark:text-slate-200">Zinli</strong> o <strong className="text-slate-800 dark:text-slate-200">PayPal</strong> ayuda a mantener activos los servidores y el desarrollo para toda la comunidad motera.
                </div>
              </div>

              {/* Suggested Amounts Selection (YouTube Chip Pill Style) */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Selecciona el valor de tu aporte voluntario
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { amount: 1, label: '$1 USD', icon: Coffee },
                    { amount: 3, label: '$3 USD', icon: Heart },
                    { amount: 6, label: '$6 USD', icon: Fuel },
                    { amount: 'custom', label: 'Monto Libre', icon: Sparkles },
                  ].map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = selectedAmount === opt.amount;
                    return (
                      <button
                        key={opt.amount.toString()}
                        type="button"
                        onClick={() => setSelectedAmount(opt.amount as any)}
                        className={`h-10 px-3 rounded-full flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-[#0f0f0f] border-transparent shadow-sm'
                            : 'bg-slate-100 text-slate-700 dark:bg-[#272727] dark:text-white hover:bg-slate-200 dark:hover:bg-[#3f3f3f] border-slate-200/80 dark:border-white/10'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-400 dark:text-rose-600' : 'text-slate-400 dark:text-white/60'}`} />
                        <span className="truncate">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>

                {selectedAmount === 'custom' && (
                  <div className="mt-2.5">
                    <div className="relative">
                      <span className="absolute left-4 top-2.5 text-sm font-bold text-slate-400">$</span>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        placeholder="Ingresa el monto en USD..."
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-full border border-slate-300 dark:border-white/15 bg-white dark:bg-[#272727] text-xs font-mono font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#19437D]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Methods Buttons with Logos (Capsule Pill Design & Texture) */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                  Elige tu Método de Pago
                </label>

                {/* Pill Capsule Action Bar inspired by reference design */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5">
                  {PAYMENT_OPTIONS.map((opt) => {
                    const isActive = activeTab === opt.id;
                    const LogoComponent = opt.Logo;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setActiveTab(opt.id)}
                        className={`group relative flex-1 h-11 px-3.5 sm:px-4 rounded-full flex items-center justify-between gap-2.5 text-xs font-medium transition-all cursor-pointer select-none border ${
                          isActive
                            ? 'bg-slate-900 text-white dark:bg-[#333333] dark:text-white shadow-sm border-slate-900 dark:border-white/30 ring-2 ring-slate-900/10 dark:ring-white/20'
                            : 'bg-slate-100 text-slate-800 dark:bg-[#272727] dark:text-white hover:bg-slate-200 dark:hover:bg-[#3f3f3f] border-slate-200/90 dark:border-white/10'
                        }`}
                      >
                        {/* Left Segment: Logo + Brand Name */}
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="shrink-0 transition-transform group-hover:scale-105">
                            <LogoComponent className="w-5 h-5 rounded-full" />
                          </div>
                          <span className="font-bold text-xs sm:text-[13px] tracking-tight truncate">
                            {opt.name}
                          </span>
                        </div>

                        {/* Segmented Divider & Right Segment (Tag & Indicator) */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div 
                            className={`w-[1px] h-4 ${
                              isActive ? 'bg-slate-400 dark:bg-white/30' : 'bg-slate-300 dark:bg-white/20'
                            }`} 
                          />
                          <span className={`text-[10px] font-semibold tracking-tight ${
                            isActive ? 'text-amber-300 dark:text-sky-300' : 'text-slate-500 dark:text-white/60'
                          }`}>
                            {opt.shortTag}
                          </span>
                          {isActive ? (
                            <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-white/25 flex items-center justify-center text-transparent">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Details Box per Selected Payment Method */}
                <div className="mt-3.5 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3.5">
                  {/* ============================================================== */}
                  {/* BINANCE PAY */}
                  {/* ============================================================== */}
                  {activeTab === 'binance' && (
                    <div className="space-y-3 text-xs animate-in fade-in duration-150">
                      <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <BinanceLogo className="w-6 h-6" />
                          <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                            Binance Pay & Cripto (USDT)
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full font-mono">
                          Sin comisiones
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 space-y-3 font-mono">
                        {/* Binance Pay ID */}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-[10px] text-slate-400 uppercase font-sans font-semibold">
                              Binance Pay ID
                            </div>
                            <div className="font-extrabold text-lg text-amber-600 dark:text-amber-400">
                              196677417
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard('196677417', 'binance-id')}
                            className="px-4 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-[#272727] dark:hover:bg-[#3f3f3f] text-slate-800 dark:text-white border border-slate-200/90 dark:border-white/10 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            {copiedField === 'binance-id' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedField === 'binance-id' ? '¡Copiado!' : 'Copiar Pay ID'}</span>
                          </button>
                        </div>

                        {/* Correo Binance */}
                        <div className="pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <div className="text-[10px] text-slate-400 uppercase font-sans font-semibold">
                              Correo Vinculado a Binance
                            </div>
                            <div className="font-bold text-xs truncate text-slate-800 dark:text-slate-200">
                              carlosberro90@gmail.com
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard('carlosberro90@gmail.com', 'binance-email')}
                            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-[#272727] dark:hover:bg-[#3f3f3f] text-slate-700 dark:text-white flex items-center justify-center border border-slate-200/90 dark:border-white/10 cursor-pointer shrink-0 transition-colors"
                            title="Copiar correo de Binance"
                          >
                            {copiedField === 'binance-email' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        {/* Direct USDT TRC20 Wallet Address */}
                        <div className="pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <div className="text-[10px] text-slate-400 uppercase font-sans font-semibold">
                              Billetera USDT (Red TRC20 / BSC)
                            </div>
                            <div className="font-bold text-xs truncate text-slate-800 dark:text-slate-200">
                              TXqR8zPitRacerDevBikerSupport77
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard('TXqR8zPitRacerDevBikerSupport77', 'usdt-trc20')}
                            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-[#272727] dark:hover:bg-[#3f3f3f] text-slate-700 dark:text-white flex items-center justify-center border border-slate-200/90 dark:border-white/10 cursor-pointer shrink-0 transition-colors"
                            title="Copiar dirección de billetera"
                          >
                            {copiedField === 'usdt-trc20' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <Info className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Abre Binance &gt; Pay &gt; Enviar con Pay ID: <strong>196677417</strong> o correo <strong>carlosberro90@gmail.com</strong>.</span>
                      </div>
                    </div>
                  )}

                  {/* ============================================================== */}
                  {/* ZINLI */}
                  {/* ============================================================== */}
                  {activeTab === 'zinli' && (
                    <div className="space-y-3 text-xs animate-in fade-in duration-150">
                      <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <ZinliLogo className="w-6 h-6" />
                          <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                            Zinli (Billetera Digital en Dólares USD)
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full font-mono">
                          Inmediato · $ USD
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-slate-700 dark:text-slate-300 font-mono">
                        {/* Correo Zinli */}
                        <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                          <div className="min-w-0 pr-2">
                            <div className="text-[10px] text-slate-400 uppercase font-sans font-semibold">
                              Correo Registrado en Zinli
                            </div>
                            <div className="font-bold text-slate-900 dark:text-slate-100 truncate text-xs">
                              carlosberro90@gmail.com
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard('carlosberro90@gmail.com', 'zinli-email')}
                            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-[#272727] dark:hover:bg-[#3f3f3f] text-slate-700 dark:text-white flex items-center justify-center border border-slate-200/90 dark:border-white/10 cursor-pointer shrink-0 transition-colors"
                            title="Copiar correo Zinli"
                          >
                            {copiedField === 'zinli-email' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        {/* Titular */}
                        <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                          <div>
                            <div className="text-[10px] text-slate-400 uppercase font-sans font-semibold">
                              Nombre de la Cuenta Zinli
                            </div>
                            <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                              Carlos Berro (Pit Racer)
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard('Carlos Berro', 'zinli-name')}
                            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-[#272727] dark:hover:bg-[#3f3f3f] text-slate-700 dark:text-white flex items-center justify-center border border-slate-200/90 dark:border-white/10 cursor-pointer shrink-0 transition-colors"
                            title="Copiar nombre titular"
                          >
                            {copiedField === 'zinli-name' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Direct Copy Button */}
                      <button
                        type="button"
                        onClick={() => copyToClipboard('Zinli: carlosberro90@gmail.com | Titular: Carlos Berro', 'all-zinli')}
                        className="w-full py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-[#272727] dark:hover:bg-[#3f3f3f] text-slate-800 dark:text-white border border-slate-200/90 dark:border-white/10 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        {copiedField === 'all-zinli' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>¡Datos de Zinli copiados al portapapeles!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar correo y datos de Zinli</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <Info className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span>Desde tu app Zinli pulsa <strong>Enviar</strong> &gt; ingresa <strong>carlosberro90@gmail.com</strong> y transfiere tu aporte en USD.</span>
                      </div>
                    </div>
                  )}

                  {/* ============================================================== */}
                  {/* PAYPAL */}
                  {/* ============================================================== */}
                  {activeTab === 'paypal' && (
                    <div className="space-y-3 text-xs animate-in fade-in duration-150">
                      <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <PayPalLogo className="w-6 h-6" />
                          <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                            PayPal Internacional & Tarjetas
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full font-mono">
                          Global
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 space-y-3 font-mono">
                        {/* Correo PayPal */}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-[10px] text-slate-400 uppercase font-sans font-semibold">
                              Correo de Cuenta PayPal
                            </div>
                            <div className="font-extrabold text-sm text-blue-600 dark:text-sky-400">
                              carlosberro90@gmail.com
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard('carlosberro90@gmail.com', 'paypal-email')}
                            className="px-4 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-[#272727] dark:hover:bg-[#3f3f3f] text-[#0070BA] dark:text-sky-300 border border-slate-200/90 dark:border-white/10 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            {copiedField === 'paypal-email' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedField === 'paypal-email' ? '¡Copiado!' : 'Copiar Correo'}</span>
                          </button>
                        </div>

                        {/* Enlace Directo PayPal.Me */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-1.5">
                          <div className="min-w-0">
                            <div className="text-[10px] text-slate-400 uppercase font-sans font-semibold">
                              Enlace de Donación Directa
                            </div>
                            <div className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                              paypal.me/carlosberro90
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => copyToClipboard('https://paypal.me/carlosberro90', 'paypal-link')}
                              className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-[#272727] dark:hover:bg-[#3f3f3f] text-[#0070BA] dark:text-sky-300 border border-slate-200/90 dark:border-white/10 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                            >
                              {copiedField === 'paypal-link' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedField === 'paypal-link' ? '¡Copiado!' : 'Copiar Enlace'}</span>
                            </button>
                            <a
                              href="https://paypal.me/carlosberro90"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-[#272727] dark:hover:bg-[#3f3f3f] text-[#0070BA] dark:text-sky-300 flex items-center justify-center border border-slate-200/90 dark:border-white/10 transition-colors"
                              title="Abrir PayPal.Me"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>Envía tu aporte directamente a <strong>carlosberro90@gmail.com</strong> mediante PayPal o tarjeta internacional.</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Form to Confirm Reference */}
              <form onSubmit={handleRegisterDonation} className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    ¿Ya enviaste tu aporte?
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">Opcional</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    placeholder="Tu nombre o apodo motero..."
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="px-4 py-2.5 rounded-full border border-slate-300 dark:border-white/15 bg-white dark:bg-[#272727] text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-[#19437D]"
                  />
                  <input
                    type="text"
                    placeholder="N° de referencia / comprobante..."
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="px-4 py-2.5 rounded-full border border-slate-300 dark:border-white/15 bg-white dark:bg-[#272727] text-xs font-mono text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-[#19437D]"
                  />
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    className="w-full h-11 px-5 rounded-full bg-gradient-to-r from-rose-600 to-[#19437D] hover:from-rose-700 hover:to-[#153766] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>Confirmar Donación ({currentAmountDisplay})</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
