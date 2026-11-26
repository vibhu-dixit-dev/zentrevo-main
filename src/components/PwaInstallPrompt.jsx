import React, { useState, useEffect, useCallback } from 'react';
import { Download, Share, PlusSquare, X, Smartphone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const PWA_SEEN_KEY = 'zentrevo_pwa_prompt_seen';
const PWA_CLIENT_ID_KEY = 'zentrevo_pwa_client_id';
const PWA_INSTALL_TRACKED_KEY = 'zentrevo_pwa_install_tracked';

function isRunningStandalone() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

function detectMobileContext() {
  if (typeof window === 'undefined') return { isMobile: false, isIOS: false };
  const ua = window.navigator.userAgent || '';
  const isIOS =
    /iPhone|iPad|iPod/i.test(ua) ||
    (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
  const isMobile =
    isIOS ||
    /Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua) ||
    window.matchMedia('(max-width: 768px)').matches;
  return { isMobile, isIOS };
}

function detectPlatform() {
  if (typeof window === 'undefined') return 'unknown';
  const ua = window.navigator.userAgent || '';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  if (/Windows/i.test(ua)) return 'windows';
  if (/Macintosh|Mac OS/i.test(ua)) return 'macos';
  if (/Linux/i.test(ua)) return 'linux';
  return 'unknown';
}

function getOrCreateClientId() {
  try {
    let id = localStorage.getItem(PWA_CLIENT_ID_KEY);
    if (!id) {
      id =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `pwa_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(PWA_CLIENT_ID_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

async function trackPwaInstall(source) {
  if (typeof window === 'undefined') return;

  try {
    if (localStorage.getItem(PWA_INSTALL_TRACKED_KEY) === 'true') return;
  } catch {}

  const clientId = getOrCreateClientId();

  try {
    const res = await fetch('/api/pwa-installs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId,
        source,
        platform: detectPlatform(),
        userAgent: window.navigator.userAgent || '',
        installedAt: new Date().toISOString()
      })
    });

    if (res.ok) {
      try {
        localStorage.setItem(PWA_INSTALL_TRACKED_KEY, 'true');
        localStorage.setItem(PWA_SEEN_KEY, 'true');
      } catch {}
    }
  } catch (err) {
    console.warn('PWA install tracking notice:', err?.message || err);
  }
}

export default function PwaInstallPrompt({ currentTheme = 'editorial' }) {
  const { t, isRTL } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOSDevice] = useState(() => detectMobileContext().isIOS);
  const [showManualHint, setShowManualHint] = useState(false);

  const recordInstall = useCallback((source) => {
    trackPwaInstall(source);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // If the site is already opened as an installed app, count once (covers iOS Add to Home Screen)
    if (isRunningStandalone()) {
      recordInstall('standalone_launch');
      return;
    }

    let alreadySeen = false;
    try {
      alreadySeen = localStorage.getItem(PWA_SEEN_KEY) === 'true';
    } catch {}
    if (alreadySeen) return;

    const { isMobile } = detectMobileContext();
    if (!isMobile) return;

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      recordInstall('appinstalled');
      try {
        localStorage.setItem(PWA_SEEN_KEY, 'true');
      } catch {}
      setDeferredPrompt(null);
      setIsVisible(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    const showTimer = window.setTimeout(() => {
      setIsVisible(true);
    }, 1200);

    return () => {
      window.clearTimeout(showTimer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [recordInstall]);

  const dismissPrompt = () => {
    try {
      localStorage.setItem(PWA_SEEN_KEY, 'true');
    } catch {}
    setIsVisible(false);
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      setShowManualHint(true);
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult?.outcome === 'accepted') {
        // Prefer the native appinstalled event; fall back if the browser never fires it
        window.setTimeout(() => {
          try {
            if (localStorage.getItem(PWA_INSTALL_TRACKED_KEY) !== 'true') {
              recordInstall('prompt_accepted');
            }
          } catch {
            recordInstall('prompt_accepted');
          }
        }, 2500);
        dismissPrompt();
      } else {
        dismissPrompt();
      }
    } catch {
      setShowManualHint(true);
    } finally {
      setDeferredPrompt(null);
    }
  };

  if (!isVisible) return null;

  const isSapphire = currentTheme === 'sapphire';
  const isEmerald = currentTheme === 'emerald';
  const isDark = isSapphire || isEmerald;

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      role="dialog"
      aria-label={t('pwa.title', 'Install Zentrevo App')}
      className="fixed inset-x-3 bottom-4 z-50 md:hidden animate-in slide-in-from-bottom-6 fade-in duration-300"
    >
      <div
        className={`rounded-2xl p-4 border shadow-2xl backdrop-blur-xl ${
          isSapphire
            ? 'bg-[#0b1528]/95 border-amber-500/40 text-stone-100 shadow-blue-950/70'
            : isEmerald
              ? 'bg-[#071f18]/95 border-emerald-700/50 text-stone-100 shadow-emerald-950/70'
              : 'bg-white/95 border-stone-200 text-stone-900 shadow-stone-900/20'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-amber-500/30 bg-[#050a16] flex items-center justify-center shadow-sm">
            <img
              src="/pwa-192x192.png"
              alt="Zentrevo"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest ${
                  isSapphire
                    ? 'text-amber-400'
                    : isEmerald
                      ? 'text-emerald-400'
                      : 'text-amber-700'
                }`}
              >
                <Smartphone className="w-3 h-3" />
                <span>{t('pwa.badge', 'Mobile App')}</span>
              </span>

              <button
                type="button"
                onClick={dismissPrompt}
                aria-label="Close install prompt"
                className={`p-1 rounded-full transition-colors cursor-pointer ${
                  isDark
                    ? 'text-stone-400 hover:text-white hover:bg-white/10'
                    : 'text-stone-500 hover:text-stone-950 hover:bg-stone-100'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="font-editorial text-base font-bold leading-snug mt-0.5">
              {t('pwa.title', 'Install Zentrevo App')}
            </h3>
            <p
              className={`text-xs leading-relaxed mt-0.5 ${
                isDark ? 'text-stone-300' : 'text-stone-600'
              }`}
            >
              {t(
                'pwa.subtitle',
                'Instant access to itineraries, live maps & 24/7 concierge right from your home screen.'
              )}
            </p>
          </div>
        </div>

        {isIOSDevice ? (
          <div
            className={`mt-3 rounded-xl p-2.5 text-xs space-y-1.5 border ${
              isDark
                ? 'bg-white/5 border-white/10 text-stone-200'
                : 'bg-stone-50 border-stone-200 text-stone-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Share className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>1. {t('pwa.iosStep1', 'Tap the Share icon at the bottom of Safari')}</span>
            </div>
            <div className="flex items-center gap-2">
              <PlusSquare className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>2. {t('pwa.iosStep2', "Scroll & tap 'Add to Home Screen'")}</span>
            </div>
            <div className="pt-1 flex justify-end">
              <button
                type="button"
                onClick={dismissPrompt}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer ${
                  isSapphire
                    ? 'bg-amber-400 text-stone-950'
                    : isEmerald
                      ? 'bg-emerald-400 text-stone-950'
                      : 'bg-stone-950 text-white'
                }`}
              >
                {t('pwa.gotItBtn', 'Got It')}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            {showManualHint && (
              <p
                className={`text-[11px] px-2.5 py-1.5 rounded-lg border ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-amber-300'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                {t(
                  'pwa.manualHint',
                  "Open your browser menu (⋮) and tap 'Install app' or 'Add to Home screen'."
                )}
              </p>
            )}
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={dismissPrompt}
                className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  isDark
                    ? 'text-stone-300 hover:text-white hover:bg-white/10'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                }`}
              >
                {t('pwa.laterBtn', 'Later')}
              </button>
              <button
                type="button"
                onClick={handleInstallClick}
                className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md transition-transform active:scale-95 cursor-pointer ${
                  isSapphire
                    ? 'bg-amber-400 hover:bg-amber-300 text-stone-950'
                    : isEmerald
                      ? 'bg-emerald-400 hover:bg-emerald-300 text-stone-950'
                      : 'bg-stone-950 hover:bg-stone-800 text-white'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t('pwa.installBtn', 'Install App')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
