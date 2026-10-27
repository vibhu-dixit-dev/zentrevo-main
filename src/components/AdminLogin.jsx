import React, { useState } from 'react';
import { 
  Compass, 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound, 
  Globe2,
  ExternalLink,
  HelpCircle,
  X
} from 'lucide-react';
import DreamscapeCanvas from './DreamscapeCanvas';

export default function AdminLogin({ onLoginSuccess, onExit }) {
  const [email, setEmail] = useState('contact@zentrevo.in');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [brandHovered, setBrandHovered] = useState(false);

  // Authenticate Admin Form
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your administrator email.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your secret access key.');
      return;
    }

    setIsLoading(true);

    // Realistic authentication delay and verification
    setTimeout(() => {
      // Valid credentials for demo & production:
      // Accepts demo password or official admin keys
      const validPass = password.toLowerCase().trim();
      if (
        validPass === 'admin' || 
        validPass === 'zentrevo' || 
        validPass === 'zentrevo2026' || 
        validPass === 'concierge' ||
        validPass === 'secret'
      ) {
        setSuccessMessage('Access granted. Entering the Zentrevo Console...');
        setTimeout(() => {
          setIsLoading(false);
          if (onLoginSuccess) {
            onLoginSuccess({ email, rememberMe });
          }
        }, 650);
      } else {
        setIsLoading(false);
        setErrorMessage('Invalid access credentials. Please verify your secret key.');
      }
    }, 850);
  };

  // One-click demo passkey autofill for seamless client preview
  const handleQuickDemo = () => {
    setEmail('contact@zentrevo.in');
    setPassword('zentrevo2026');
    setErrorMessage('');
    setSuccessMessage('Demo passkey injected. Click "Enter Expedition Console" to sign in.');
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col lg:flex-row bg-[#030712] text-stone-100 overflow-x-hidden font-sans-clean select-none">
      
      {/* ─────────────────────────────────────────────────────────────────────────
          LEFT HERO / VISUAL AREA (60-64% Desktop Viewport)
          Houses the Living Dreamscape Canvas & Parallax Atmosphere
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="relative w-full lg:w-[60%] xl:w-[64%] min-h-[280px] sm:min-h-[340px] lg:h-screen flex flex-col justify-between p-5 sm:p-8 lg:p-10 xl:p-14 overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10 shrink-0">
        
        {/* Living 60fps Dreamscape Background */}
        <DreamscapeCanvas />

        {/* Ambient Radial Vignette for Contrast */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#030712]/80 via-transparent to-[#030712]/50 z-0" />
        <div className="absolute inset-0 pointer-events-none bg-radial from-transparent via-transparent to-[#030712]/60 z-0" />

        {/* Top Header: Brand Identity & Telemetry */}
        <header className="relative z-10 flex items-center justify-between gap-3">
          <div 
            className="flex items-center gap-3 group cursor-pointer transition-transform duration-300"
            onMouseEnter={() => setBrandHovered(true)}
            onMouseLeave={() => setBrandHovered(false)}
            onClick={onExit}
            title="Return to Public Website"
          >
            <div className="relative">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-amber-300/25 via-teal-400/20 to-sky-400/25 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-lg shadow-teal-500/10 group-hover:border-amber-300/60 group-hover:shadow-amber-400/20 transition-all duration-500 shrink-0">
                <Compass className="w-5 h-5 text-amber-200 group-hover:rotate-90 transition-transform duration-700 ease-out" />
              </div>
              {/* Dynamic Wave of Light on Brand Hover */}
              {brandHovered && (
                <span className="absolute -inset-2 rounded-full bg-teal-400/20 blur-md animate-ping pointer-events-none" />
              )}
            </div>

            <div>
              <span className="font-editorial text-xl sm:text-2xl tracking-[0.2em] uppercase font-bold text-transparent bg-clip-text bg-gradient-to-r from-stone-100 via-amber-100 to-stone-300 block leading-tight">
                Zentrevo
              </span>
              <span className="block text-[8px] sm:text-[9px] tracking-[0.35em] uppercase text-teal-300/80 font-mono">
                Expedition Core • v2.4
              </span>
            </div>
          </div>

          {/* Active Live Status Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-stone-900/70 backdrop-blur-md border border-white/10 text-[10px] sm:text-[11px] font-mono text-stone-300 shadow-xl shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-stone-300">Live</span>
            <span className="text-stone-600 hidden xs:inline">|</span>
            <span className="text-amber-200/80 hidden xs:inline">60 FPS</span>
          </div>
        </header>

        {/* Bottom Bar: Coordinates & Telemetry */}
        <footer className="relative z-10 flex items-center justify-between pt-3 sm:pt-4 border-t border-white/10 text-[10px] sm:text-[11px] font-mono text-stone-400 mt-auto">
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="flex items-center gap-1.5 text-stone-300">
              <Globe2 className="w-3.5 h-3.5 text-teal-400" />
              <span>24°14'N 77°42'W</span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="text-stone-400 hidden sm:inline">Atmospheric Parallax</span>
          </div>

          <button 
            type="button"
            onClick={onExit}
            className="flex items-center gap-1.5 text-amber-200/90 hover:text-amber-100 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Public Site</span>
          </button>
        </footer>

      </section>


      {/* ─────────────────────────────────────────────────────────────────────────
          RIGHT LOGIN AREA (36-40% Desktop Viewport)
          Luxury Obsidian Glass Panel with Accessible, Non-blocking Controls
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="relative w-full lg:w-[40%] xl:w-[36%] min-h-[500px] lg:h-screen flex flex-col justify-between items-center p-6 sm:p-8 lg:p-8 xl:p-12 z-20 bg-[#050b16]/95 lg:bg-[#050b16]/85 backdrop-blur-2xl overflow-y-auto">
        
        {/* Subtle Decorative Ambient Lighting Behind Card */}
        <div className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="w-full max-w-sm sm:max-w-md space-y-6 my-auto relative z-10 py-4">

          {/* Form Header */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-teal-400 font-semibold">
                Private Admin Gateway
              </span>
              <button
                type="button"
                onClick={() => setIsHelpModalOpen(true)}
                className="text-stone-400 hover:text-stone-200 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                title="View access assistance"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Help</span>
              </button>
            </div>

            <h2 className="font-editorial text-3xl sm:text-4xl font-medium tracking-tight text-white">
              Welcome back
            </h2>
          </div>

          {/* Status / Error Alerts */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{errorMessage}</p>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{successMessage}</p>
            </div>
          )}

          {/* The Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Address */}
            <div className="space-y-1.5">
              <label 
                htmlFor="admin-email" 
                className="block text-xs font-medium text-stone-300 tracking-wide"
              >
                Administrator Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@zentrevo.in"
                  disabled={isLoading}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900/80 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/40 transition-all font-mono placeholder:text-stone-600 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Secret Access Key / Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="admin-password" 
                  className="block text-xs font-medium text-stone-300 tracking-wide"
                >
                  Secret Access Key
                </label>
                <button
                  type="button"
                  onClick={() => setIsHelpModalOpen(true)}
                  className="text-[11px] text-amber-300/80 hover:text-amber-200 transition-colors cursor-pointer"
                >
                  Forgot key?
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secret key..."
                  disabled={isLoading}
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-stone-900/80 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/40 transition-all font-mono placeholder:text-stone-600 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Session Control */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-400 hover:text-stone-300 transition-colors">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-stone-700 bg-stone-900 text-amber-500 focus:ring-amber-400/30 focus:ring-offset-0 cursor-pointer"
                />
                <span>Remember this terminal session</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-xs tracking-wide uppercase transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 text-stone-950 hover:brightness-110 active:scale-[0.99] shadow-lg shadow-amber-400/10 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-stone-950/20 border-t-stone-950 rounded-full animate-spin" />
                  <span>Authenticating Gateway...</span>
                </>
              ) : (
                <>
                  <span>Enter Expedition Console</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Return to Public Portal link (Mobile visible) */}
          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={onExit}
              className="text-xs text-stone-400 hover:text-stone-200 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Website</span>
            </button>
          </div>

        </div>

        {/* Security & Encryption Certification */}
        <div className="pt-4 pb-2 border-t border-white/5 flex items-center justify-center gap-2 text-[10px] text-stone-500 font-mono w-full">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400/80" />
          <span>256-Bit TLS Protected Administrative Gateway</span>
        </div>

      </section>

      {/* ─────────────────────────────────────────────────────────────────────────
          EMERGENCY CONCIERGE HELP MODAL
      ────────────────────────────────────────────────────────────────────────── */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm rounded-2xl bg-stone-900 border border-stone-700/80 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-300 font-mono text-xs uppercase tracking-wider">
                <KeyRound className="w-4 h-4" />
                <span>Concierge Key Recovery</span>
              </div>
              <button
                type="button"
                onClick={() => setIsHelpModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed font-light">
              For administrative access recovery or emergency dossier unlocks, contact the Zentrevo Concierge technical desk:
            </p>

            <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-stone-400">
                <span>Official Contact:</span>
                <span className="text-stone-200 select-all">contact@zentrevo.in</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Preview Passkey:</span>
                <span className="text-amber-300 font-bold select-all">zentrevo2026</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                handleQuickDemo();
                setIsHelpModalOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-300 transition-colors cursor-pointer"
            >
              Autofill & Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
