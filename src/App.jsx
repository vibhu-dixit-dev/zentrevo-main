import React, { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import StatsBar from './components/StatsBar';
import DestinationsGrid from './components/DestinationsGrid';
import ExperienceSplit from './components/ExperienceSplit';
import VideoStorySection from './components/VideoStorySection';
import FAQSection from './components/FAQSection';
import BookingInquirySection from './components/BookingInquirySection';
import Footer from './components/Footer';
import WhatsAppWidget from './components/WhatsAppWidget';
import ChatbotWidget from './components/ChatbotWidget';
import PwaInstallPrompt from './components/PwaInstallPrompt';

const DetailModal = lazy(() => import('./components/DetailModal'));
const VisaModal = lazy(() => import('./components/VisaModal'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const CancellationRefund = lazy(() => import('./pages/CancellationRefund'));
const NationalDestinationsPage = lazy(() => import('./pages/NationalDestinationsPage'));
const InternationalDestinationsPage = lazy(() => import('./pages/InternationalDestinationsPage'));
const JournalPage = lazy(() => import('./pages/JournalPage'));
const JournalArticlePage = lazy(() => import('./pages/JournalArticlePage'));
const SitemapPage = lazy(() => import('./pages/SitemapPage'));
const ThankYouPage = lazy(() => import('./pages/ThankYouPage'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const AdminLogin = lazy(() => import('./components/AdminLogin'));

function RouteFallback({ currentTheme = 'editorial' }) {
  const isSapphire = currentTheme === 'sapphire';
  const isEmerald = currentTheme === 'emerald';
  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isSapphire
          ? 'bg-[#050a16] text-amber-300'
          : isEmerald
            ? 'bg-[#061813] text-emerald-300'
            : 'bg-[#faf9f6] text-stone-700'
      }`}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-current border-t-transparent animate-spin" />
        <span className="text-xs font-mono uppercase tracking-[0.25em] opacity-80">Zentrevo</span>
      </div>
    </div>
  );
}
import { 
  getDestinationSlug, 
  findDestinationBySlug, 
  getBlogSlug, 
  findArticleBySlug, 
  CLIENT_DESTINATIONS_SEO,
  DEFAULT_SEO,
  updateDocumentSeo, 
  resetDocumentSeo 
} from './lib/seoRoutes';
import { syncDestinationsFromCloud, syncBlogArticlesFromCloud } from './data/travelData';
import { syncCategoriesFromCloud } from './data/categoriesData';

export default function App() {
  // Admin Session State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('zentrevo_admin_auth') === 'true';
    }
    return false;
  });

  const [userRole, setUserRole] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('zentrevo_user_role') || 'admin';
    }
    return 'admin';
  });

  const [userEmail, setUserEmail] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('zentrevo_user_email') || 'contact@zentrevo.in';
    }
    return 'contact@zentrevo.in';
  });

  // Route Detection: Supports /admin route, legal pages, and standard routes
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  // Theme State: 'editorial' (Default) | 'sapphire' (Royal Sapphire & Gold) | 'emerald' (Emerald Luxe)
  const [currentTheme, setCurrentTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('zentrevo_theme');
        if (saved === 'editorial' || saved === 'sapphire' || saved === 'emerald') {
          return saved;
        }
      } catch {}
    }
    return 'editorial';
  });
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('all'); // 'all' | 'national' | 'international'
  const [selectedJournalArticle, setSelectedJournalArticle] = useState(null);
  const [isVisaModalOpen, setIsVisaModalOpen] = useState(false);
  const [preselectedDestination, setPreselectedDestination] = useState('');
  const [preselectedGuests, setPreselectedGuests] = useState('');
  const [preselectedDates, setPreselectedDates] = useState('');
  const [heroSearchFilter, setHeroSearchFilter] = useState(null);
  const destinationReturnPathRef = useRef('/');

  const isDestinationDetailPath = useCallback((path) => {
    if (!path || !path.startsWith('/destinations/')) return false;
    const slug = path.replace(/^\/destinations\/?/, '').replace(/\/$/, '');
    return Boolean(slug) && slug !== 'national' && slug !== 'international';
  }, []);

  const handleHeroSearchFilter = useCallback((filter) => {
    if (!filter) return;
    const hasDestinationChoice = Boolean(filter.destinationId || filter.destinationTitle || filter.destinationLocation || filter.label || filter.query);
    if (hasDestinationChoice) {
      setHeroSearchFilter(filter);
      setSelectedRegion('all');
      if (filter.destinationTitle || filter.destinationLocation || filter.query) {
        setPreselectedDestination(filter.destinationTitle || filter.destinationLocation || filter.query);
      }
    } else {
      setHeroSearchFilter(null);
    }

    if (filter.guests) {
      setPreselectedGuests(filter.guests);
    }
    if (filter.date) {
      setPreselectedDates(filter.date);
    }
  }, []);

  // Handle opening a destination with individual URL route & dynamic SEO
  const handleOpenDestination = useCallback((destination, pushHistory = true) => {
    if (!destination) return;
    setSelectedDestination(destination);
    setIsDetailModalOpen(true);
    setSelectedJournalArticle(null);
    setIsVisaModalOpen(false);

    const slug = getDestinationSlug(destination);
    const newPath = `/destinations/${slug}`;

    if (pushHistory && typeof window !== 'undefined' && window.location.pathname !== newPath) {
      const currentPathname = window.location.pathname || '/';
      // Remember listing page (national/international/home) so close returns there
      if (!isDestinationDetailPath(currentPathname)) {
        destinationReturnPathRef.current = currentPathname;
      }
      window.history.pushState(
        { type: 'destination', slug, returnPath: destinationReturnPathRef.current },
        '',
        newPath
      );
      setCurrentPath(newPath);
    }

    const clientSeo = CLIENT_DESTINATIONS_SEO[slug];
    const pageTitle = clientSeo ? clientSeo.title : `${destination.title} | Zentrevo`;
    const pageDesc = clientSeo ? clientSeo.description : destination.description;

    updateDocumentSeo({
      title: pageTitle,
      description: pageDesc,
      canonical: `https://www.zentrevo.in${newPath}`,
      ogImage: destination.image
    });
  }, [isDestinationDetailPath]);

  // Close destination detail and return to the previous listing path (e.g. /destinations/national)
  const handleCloseDestinationModal = useCallback((pushHistory = true) => {
    setIsDetailModalOpen(false);
    setSelectedDestination(null);

    if (pushHistory && typeof window !== 'undefined' && isDestinationDetailPath(window.location.pathname)) {
      const returnPath = destinationReturnPathRef.current || '/';
      window.history.pushState({}, '', returnPath);
      setCurrentPath(returnPath);
    }
    resetDocumentSeo();
  }, [isDestinationDetailPath]);

  // Navigate to dedicated journal listing or article page (full-page, not modal)
  const handleOpenJournal = useCallback((article = null, pushHistory = true) => {
    setIsDetailModalOpen(false);
    setIsVisaModalOpen(false);
    setSelectedJournalArticle(article || null);

    if (article) {
      const slug = getBlogSlug(article);
      const newPath = `/journal/${slug}`;
      if (pushHistory && typeof window !== 'undefined' && window.location.pathname !== newPath) {
        window.history.pushState({ type: 'journal', slug }, '', newPath);
        setCurrentPath(newPath);
      } else if (!pushHistory) {
        setCurrentPath(newPath);
      }
      updateDocumentSeo({
        title: `${article.title} | Zentrevo Journal`,
        description: article.excerpt || article.pullQuote || DEFAULT_SEO.description,
        canonical: `https://www.zentrevo.in${newPath}`,
        ogImage: article.image
      });
    } else {
      const newPath = '/journal';
      if (pushHistory && typeof window !== 'undefined' && window.location.pathname !== newPath) {
        window.history.pushState({ type: 'journal-index' }, '', newPath);
        setCurrentPath(newPath);
      } else if (!pushHistory) {
        setCurrentPath(newPath);
      }
      updateDocumentSeo({
        title: 'Travel Journal & Stories | Zentrevo',
        description: 'Dispatches, field notes, and insider stories penned by our global expedition directors.',
        canonical: 'https://www.zentrevo.in/journal',
        ogImage: DEFAULT_SEO.ogImage
      });
    }
  }, []);

  // Handle opening Visa modal & route
  const handleOpenVisa = useCallback((pushHistory = true) => {
    setIsVisaModalOpen(true);
    setIsDetailModalOpen(false);
    setSelectedJournalArticle(null);

    if (pushHistory && typeof window !== 'undefined' && window.location.pathname !== '/visa-guidance') {
      window.history.pushState({ type: 'visa' }, '', '/visa-guidance');
      setCurrentPath('/visa-guidance');
    }

    updateDocumentSeo({
      title: 'Visa Help for Indian Travelers | Zentrevo',
      description: 'Know your visa before you book: requirement check, document list and form help for Indian passport holders. The embassy decides approval.',
      canonical: 'https://www.zentrevo.in/visa-guidance',
      ogImage: DEFAULT_SEO.ogImage
    });
  }, []);

  // Handle closing Visa modal
  const handleCloseVisaModal = useCallback((pushHistory = true) => {
    setIsVisaModalOpen(false);
    if (pushHistory && typeof window !== 'undefined' && 
       (window.location.pathname === '/visa-guidance' || window.location.pathname === '/visa-guidance/' || 
        window.location.pathname === '/visa' || window.location.pathname === '/visa/')) {
      window.history.pushState({}, '', '/');
      setCurrentPath('/');
    }
    resetDocumentSeo();
  }, []);

  // Go Ahead on Visa modal: preselects service and smoothly scrolls to contact inquiry form
  const handleVisaGoAhead = useCallback(() => {
    setIsVisaModalOpen(false);
    setPreselectedDestination('Visa Guidance & Document Support');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
      setCurrentPath('/');
    }
    resetDocumentSeo();
    const el = document.getElementById('inquiry');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Sync route path with state on load & popstate (Back/Forward buttons)
  const syncRouteWithModal = useCallback((path) => {
    if (!path || path === '/' || path.startsWith('/admin')) {
      setIsDetailModalOpen(false);
      setSelectedJournalArticle(null);
      setIsVisaModalOpen(false);
      if (!path.startsWith('/admin')) {
        resetDocumentSeo();
      }
      return;
    }

    // 1. Legal Standalone Pages, Sitemap & Thank You Confirmation
    if (
      path.startsWith('/privacy-policy') || 
      path.startsWith('/terms-of-service') || 
      path.startsWith('/cancellation-and-refund') ||
      path.startsWith('/sitemap') ||
      path.startsWith('/thank-you')
    ) {
      setIsDetailModalOpen(false);
      setSelectedJournalArticle(null);
      setIsVisaModalOpen(false);
      if (path.startsWith('/sitemap')) {
        updateDocumentSeo({
          title: 'HTML Sitemap & Navigation Index | Zentrevo Curated Journeys',
          description: 'Comprehensive directory of national domestic tour packages, international bespoke expeditions, travel journals, and visa guidance.',
          canonical: 'https://www.zentrevo.in/sitemap.html',
          ogImage: DEFAULT_SEO.ogImage
        });
      }
      return;
    }

    // 1.5. Dedicated Regional Destination Pages
    if (
      path === '/destinations/national' || path === '/destinations/national/' || 
      path === '/national' || path === '/national/' ||
      path === '/national-tour-packages' || path === '/national-tour-packages/'
    ) {
      setIsDetailModalOpen(false);
      setSelectedJournalArticle(null);
      setIsVisaModalOpen(false);
      updateDocumentSeo({
        title: 'National (Domestic Tours) & Interactive Map of India | Zentrevo',
        description: 'Explore curated domestic expeditions across India: royal palaces in Rajasthan, Himalayan retreats, and serene backwaters.',
        canonical: 'https://www.zentrevo.in/national-tour-packages/',
        ogImage: DEFAULT_SEO.ogImage
      });
      return;
    }

    if (
      path === '/destinations/international' || path === '/destinations/international/' || 
      path === '/international' || path === '/international/' ||
      path === '/international-tour-packages' || path === '/international-tour-packages/'
    ) {
      setIsDetailModalOpen(false);
      setSelectedJournalArticle(null);
      setIsVisaModalOpen(false);
      updateDocumentSeo({
        title: 'International (International Tours) & Curated Escapes | Zentrevo',
        description: 'Bespoke global expeditions across Amalfi Coast cliffs, Kyoto zen sanctuaries, Swiss alpine railways, and Cappadocia balloon valleys.',
        canonical: 'https://www.zentrevo.in/international-tour-packages/',
        ogImage: DEFAULT_SEO.ogImage
      });
      return;
    }

    // 2. Visa Guidance route: /visa-guidance or /visa
    if (path === '/visa-guidance' || path === '/visa-guidance/' || path === '/visa' || path === '/visa/') {
      handleOpenVisa(false);
      return;
    }

    // 3. Destination route: /destinations/:slug
    if (path.startsWith('/destinations/')) {
      const slug = path.replace(/^\/destinations\/?/, '').replace(/\/$/, '');
      if (slug) {
        const dest = findDestinationBySlug(slug);
        if (dest) {
          handleOpenDestination(dest, false);
          return;
        }
      }
    }

    // 4. Destinations index: /destinations
    if (path === '/destinations' || path === '/destinations/') {
      setIsDetailModalOpen(false);
      setSelectedJournalArticle(null);
      setIsVisaModalOpen(false);
      resetDocumentSeo();
      const el = document.getElementById('destinations');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // 5. Journal route: /journal/:slug or /blog/:slug
    if (path.startsWith('/journal/') || path.startsWith('/blog/')) {
      const slug = path.replace(/^\/(journal|blog)\/?/, '').replace(/\/$/, '');
      if (slug) {
        const article = findArticleBySlug(slug);
        if (article) {
          handleOpenJournal(article, false);
        } else {
          setSelectedJournalArticle(null);
          setIsDetailModalOpen(false);
          setIsVisaModalOpen(false);
          updateDocumentSeo({
            title: 'Story Not Found | Zentrevo Journal',
            description: DEFAULT_SEO.description,
            canonical: `https://www.zentrevo.in/journal/${slug}`,
            ogImage: DEFAULT_SEO.ogImage
          });
        }
        return;
      }
    }

    // 6. Journal root catalog: /journal or /blog
    if (path === '/journal' || path === '/journal/' || path === '/blog' || path === '/blog/') {
      handleOpenJournal(null, false);
      return;
    }

    // 7. Contact root: /contact
    if (path === '/contact' || path === '/contact/') {
      setIsDetailModalOpen(false);
      setSelectedJournalArticle(null);
      setIsVisaModalOpen(false);
      resetDocumentSeo();
      const el = document.getElementById('inquiry');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Fallback: Default home
    setIsDetailModalOpen(false);
    setSelectedJournalArticle(null);
    setIsVisaModalOpen(false);
    resetDocumentSeo();
  }, [handleOpenDestination, handleOpenJournal, handleOpenVisa]);

  const navigateTo = useCallback((path) => {
    if (typeof window === 'undefined' || !path) return;
    const [rawPathname, hash] = path.split('#');
    const targetPath = rawPathname || '/';
    const routeChanged = window.location.pathname !== targetPath;

    window.history.pushState({}, '', path);
    setCurrentPath(targetPath);
    syncRouteWithModal(targetPath);

    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, routeChanged ? 150 : 0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [syncRouteWithModal]);

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname || '/';
      setCurrentPath(path);
      syncRouteWithModal(path);
    };

    // Initial sync on mount to handle direct URLs (e.g. /destinations/bali or /privacy-policy)
    handleLocationChange();

    // Fetch authoritative live itinerary catalog and blog stories from Supabase Cloud
    let isMounted = true;
    syncDestinationsFromCloud().then((res) => {
      if (!isMounted) return;
      const path = window.location.pathname || '/';
      if (res?.synced && path.startsWith('/destinations/')) {
        syncRouteWithModal(path);
      }
    });
    syncBlogArticlesFromCloud().then((res) => {
      if (!isMounted) return;
      const path = window.location.pathname || '/';
      if (res?.synced && (path.startsWith('/journal/') || path.startsWith('/blog/'))) {
        syncRouteWithModal(path);
      }
    });
    syncCategoriesFromCloud();

    const handleBlogsUpdated = () => {
      if (!isMounted) return;
      const path = window.location.pathname || '/';
      if (path.startsWith('/journal/') || path.startsWith('/blog/')) {
        syncRouteWithModal(path);
      }
    };

    window.addEventListener('zentrevo_blogs_updated', handleBlogsUpdated);
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      isMounted = false;
      window.removeEventListener('zentrevo_blogs_updated', handleBlogsUpdated);
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [syncRouteWithModal]);

  const isAdminRoute = 
    currentPath.startsWith('/admin') || 
    (typeof window !== 'undefined' && window.location.hash === '#admin');

  // Proper Standalone Legal Pages (Not a popup)
  if (currentPath === '/privacy-policy' || currentPath === '/privacy-policy/') {
    return (
      <Suspense fallback={<RouteFallback currentTheme={currentTheme} />}>
        <PrivacyPolicy onNavigateHome={() => navigateTo('/')} currentTheme={currentTheme} />
      </Suspense>
    );
  }
  if (currentPath === '/terms-of-service' || currentPath === '/terms-of-service/') {
    return (
      <Suspense fallback={<RouteFallback currentTheme={currentTheme} />}>
        <TermsOfService onNavigateHome={() => navigateTo('/')} currentTheme={currentTheme} />
      </Suspense>
    );
  }
  if (currentPath === '/cancellation-and-refund' || currentPath === '/cancellation-and-refund/') {
    return (
      <Suspense fallback={<RouteFallback currentTheme={currentTheme} />}>
        <CancellationRefund onNavigateHome={() => navigateTo('/')} currentTheme={currentTheme} />
      </Suspense>
    );
  }
  if (
    currentPath === '/sitemap.html' || 
    currentPath === '/sitemap.html/' || 
    currentPath === '/sitemap' || 
    currentPath === '/sitemap/'
  ) {
    return (
      <Suspense fallback={<RouteFallback currentTheme={currentTheme} />}>
        <SitemapPage 
          onNavigateHome={() => navigateTo('/')} 
          onNavigate={navigateTo}
          currentTheme={currentTheme} 
        />
      </Suspense>
    );
  }
  if (currentPath === '/thank-you' || currentPath.startsWith('/thank-you')) {
    return (
      <Suspense fallback={<RouteFallback currentTheme={currentTheme} />}>
        <ThankYouPage 
          currentTheme={currentTheme}
          onSelectTheme={handleSelectTheme}
          onNavigateHome={() => navigateTo('/')}
          onNavigate={navigateTo}
          onOpenInquiry={handleScrollToInquiry}
          onOpenJournal={handleOpenJournal}
          onOpenVisa={handleOpenVisa}
        />
      </Suspense>
    );
  }

  const handleSelectTheme = (themeName) => {
    setCurrentTheme(themeName);
    try {
      localStorage.setItem('zentrevo_theme', themeName);
    } catch {}
  };

  const handleScrollToInquiry = () => {
    const el = document.getElementById('inquiry');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookNowFromModal = (dest) => {
    if (dest) {
      setPreselectedDestination(dest.title || dest.location || '');
    }
    handleCloseDestinationModal(true);
    handleScrollToInquiry();
  };

  const handleInquireFromJournal = (destinationName) => {
    if (destinationName) {
      setPreselectedDestination(destinationName);
    }
    setSelectedJournalArticle(null);
    navigateTo('/');
    setTimeout(() => {
      const el = document.getElementById('inquiry');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  // If user navigated to /admin, check authentication
  if (isAdminRoute) {
    if (!isAdminAuthenticated) {
      return (
        <Suspense fallback={<RouteFallback currentTheme="sapphire" />}>
          <AdminLogin 
            onLoginSuccess={({ email, role }) => {
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('zentrevo_admin_auth', 'true');
                sessionStorage.setItem('zentrevo_user_role', role || 'admin');
                sessionStorage.setItem('zentrevo_user_email', email || 'contact@zentrevo.in');
              }
              setUserRole(role || 'admin');
              setUserEmail(email || 'contact@zentrevo.in');
              setIsAdminAuthenticated(true);
            }}
            onExit={() => {
              if (typeof window !== 'undefined') {
                window.history.pushState({}, '', '/');
                setCurrentPath('/');
              }
            }}
          />
        </Suspense>
      );
    }

    return (
      <Suspense fallback={<RouteFallback currentTheme="editorial" />}>
        <AdminDashboard 
          userRole={userRole}
          userEmail={userEmail}
          onExit={() => {
            if (typeof window !== 'undefined') {
              window.history.pushState({}, '', '/');
              setCurrentPath('/');
            }
          }}
          onLogout={() => {
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem('zentrevo_admin_auth');
              sessionStorage.removeItem('zentrevo_user_role');
              sessionStorage.removeItem('zentrevo_user_email');
            }
            setIsAdminAuthenticated(false);
            setUserRole('admin');
            setUserEmail('contact@zentrevo.in');
          }}
        />
      </Suspense>
    );
  }

  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';

  const isNationalRoute = 
    currentPath === '/destinations/national' || 
    currentPath === '/destinations/national/' || 
    currentPath === '/national' || 
    currentPath === '/national/' ||
    currentPath === '/national-tour-packages' || 
    currentPath === '/national-tour-packages/';

  const isInternationalRoute = 
    currentPath === '/destinations/international' || 
    currentPath === '/destinations/international/' || 
    currentPath === '/international' || 
    currentPath === '/international/' ||
    currentPath === '/international-tour-packages' || 
    currentPath === '/international-tour-packages/';

  const isJournalIndexRoute =
    currentPath === '/journal' ||
    currentPath === '/journal/' ||
    currentPath === '/blog' ||
    currentPath === '/blog/';

  const journalArticleSlug = (() => {
    if (currentPath.startsWith('/journal/') || currentPath.startsWith('/blog/')) {
      const slug = currentPath.replace(/^\/(journal|blog)\/?/, '').replace(/\/$/, '');
      return slug || null;
    }
    return null;
  })();

  const isJournalArticleRoute = Boolean(journalArticleSlug);

  if (isJournalArticleRoute) {
    const article = selectedJournalArticle || findArticleBySlug(journalArticleSlug);
    return (
      <div
        className={`min-h-screen transition-colors duration-500 font-sans-clean ${
          isSapphire
            ? 'bg-[#050a16] text-stone-100'
            : isEmerald
              ? 'bg-[#061813] text-stone-100'
              : 'bg-[#faf9f6] text-stone-900'
        }`}
      >
        <Suspense fallback={<RouteFallback currentTheme={currentTheme} />}>
          <JournalArticlePage
            article={article}
            currentTheme={currentTheme}
            onSelectTheme={handleSelectTheme}
            onNavigateHome={() => navigateTo('/')}
            onNavigate={navigateTo}
            onOpenInquiry={handleInquireFromJournal}
            onOpenVisa={handleOpenVisa}
            onSelectArticle={(a) => handleOpenJournal(a, true)}
            onBackToJournal={() => handleOpenJournal(null, true)}
            onInquireStory={handleInquireFromJournal}
          />
        </Suspense>

        {isVisaModalOpen && (
          <Suspense fallback={null}>
            <VisaModal
              isOpen={isVisaModalOpen}
              onClose={handleCloseVisaModal}
              onGoAhead={handleVisaGoAhead}
              currentTheme={currentTheme}
            />
          </Suspense>
        )}

        <WhatsAppWidget />
        <ChatbotWidget currentTheme={currentTheme} />
        <PwaInstallPrompt currentTheme={currentTheme} />
      </div>
    );
  }

  if (isJournalIndexRoute) {
    return (
      <div
        className={`min-h-screen transition-colors duration-500 font-sans-clean ${
          isSapphire
            ? 'bg-[#050a16] text-stone-100'
            : isEmerald
              ? 'bg-[#061813] text-stone-100'
              : 'bg-[#faf9f6] text-stone-900'
        }`}
      >
        <Suspense fallback={<RouteFallback currentTheme={currentTheme} />}>
          <JournalPage
            currentTheme={currentTheme}
            onSelectTheme={handleSelectTheme}
            onNavigateHome={() => navigateTo('/')}
            onNavigate={navigateTo}
            onOpenInquiry={(destName) => {
              if (destName) setPreselectedDestination(destName);
              navigateTo('/');
              setTimeout(() => {
                const el = document.getElementById('inquiry');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 150);
            }}
            onOpenJournal={handleOpenJournal}
            onOpenVisa={handleOpenVisa}
            onSelectArticle={(a) => handleOpenJournal(a, true)}
          />
        </Suspense>

        {isVisaModalOpen && (
          <Suspense fallback={null}>
            <VisaModal
              isOpen={isVisaModalOpen}
              onClose={handleCloseVisaModal}
              onGoAhead={handleVisaGoAhead}
              currentTheme={currentTheme}
            />
          </Suspense>
        )}

        <WhatsAppWidget />
        <ChatbotWidget currentTheme={currentTheme} />
        <PwaInstallPrompt currentTheme={currentTheme} />
      </div>
    );
  }

  if (isNationalRoute) {
    return (
      <div 
        className={`min-h-screen transition-colors duration-500 font-sans-clean ${
          isSapphire
            ? 'bg-[#050a16] text-stone-100'
            : isEmerald 
              ? 'bg-[#061813] text-stone-100' 
              : 'bg-[#faf9f6] text-stone-900'
        }`}
      >
        <Suspense fallback={<RouteFallback currentTheme={currentTheme} />}>
          <NationalDestinationsPage 
            currentTheme={currentTheme}
            onSelectTheme={handleSelectTheme}
            onSelectDestination={handleOpenDestination}
            onNavigateHome={() => navigateTo('/')}
            onNavigate={navigateTo}
            onOpenInquiry={(destName) => {
              if (destName) setPreselectedDestination(destName);
              navigateTo('/');
              setTimeout(() => {
                const el = document.getElementById('inquiry');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 150);
            }}
            onOpenJournal={handleOpenJournal}
            onOpenVisa={handleOpenVisa}
          />
        </Suspense>

        {/* Interactive Destination Detail Modal */}
        {isDetailModalOpen && (
          <Suspense fallback={null}>
            <DetailModal
              destination={selectedDestination}
              isOpen={isDetailModalOpen}
              onClose={handleCloseDestinationModal}
              onBookNow={handleBookNowFromModal}
              currentTheme={currentTheme}
            />
          </Suspense>
        )}

        {/* Dedicated Visa Guidance Modal */}
        {isVisaModalOpen && (
          <Suspense fallback={null}>
            <VisaModal
              isOpen={isVisaModalOpen}
              onClose={handleCloseVisaModal}
              onGoAhead={handleVisaGoAhead}
              currentTheme={currentTheme}
            />
          </Suspense>
        )}

        {/* Floating Widgets */}
        <WhatsAppWidget />
        <ChatbotWidget currentTheme={currentTheme} />
        <PwaInstallPrompt currentTheme={currentTheme} />
      </div>
    );
  }

  if (isInternationalRoute) {
    return (
      <div 
        className={`min-h-screen transition-colors duration-500 font-sans-clean ${
          isSapphire
            ? 'bg-[#050a16] text-stone-100'
            : isEmerald 
              ? 'bg-[#061813] text-stone-100' 
              : 'bg-[#faf9f6] text-stone-900'
        }`}
      >
        <Suspense fallback={<RouteFallback currentTheme={currentTheme} />}>
          <InternationalDestinationsPage 
            currentTheme={currentTheme}
            onSelectTheme={handleSelectTheme}
            onSelectDestination={handleOpenDestination}
            onNavigateHome={() => navigateTo('/')}
            onNavigate={navigateTo}
            onOpenInquiry={(destName) => {
              if (destName) setPreselectedDestination(destName);
              navigateTo('/');
              setTimeout(() => {
                const el = document.getElementById('inquiry');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 150);
            }}
            onOpenJournal={handleOpenJournal}
            onOpenVisa={handleOpenVisa}
          />
        </Suspense>

        {/* Interactive Destination Detail Modal */}
        {isDetailModalOpen && (
          <Suspense fallback={null}>
            <DetailModal
              destination={selectedDestination}
              isOpen={isDetailModalOpen}
              onClose={handleCloseDestinationModal}
              onBookNow={handleBookNowFromModal}
              currentTheme={currentTheme}
            />
          </Suspense>
        )}

        {/* Dedicated Visa Guidance Modal */}
        {isVisaModalOpen && (
          <Suspense fallback={null}>
            <VisaModal
              isOpen={isVisaModalOpen}
              onClose={handleCloseVisaModal}
              onGoAhead={handleVisaGoAhead}
              currentTheme={currentTheme}
            />
          </Suspense>
        )}

        {/* Floating Widgets */}
        <WhatsAppWidget />
        <ChatbotWidget currentTheme={currentTheme} />
        <PwaInstallPrompt currentTheme={currentTheme} />
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen transition-colors duration-500 font-sans-clean ${
        isSapphire
          ? 'bg-[#050a16] text-stone-100'
          : isEmerald 
            ? 'bg-[#061813] text-stone-100' 
            : 'bg-[#faf9f6] text-stone-900'
      }`}
    >
      {/* Main Navigation */}
      <Navbar 
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
        onOpenInquiry={handleScrollToInquiry}
        onSelectRegion={setSelectedRegion}
        onOpenJournal={handleOpenJournal}
        onOpenVisa={handleOpenVisa}
        onNavigate={navigateTo}
      />

      {/* Main Landmark for Accessibility and Assistive Technologies */}
      <main id="main-content">
        {/* Hero Section */}
        <HeroSection 
          currentTheme={currentTheme}
          onSelectDestination={handleOpenDestination}
          onSearchFilter={handleHeroSearchFilter}
          onOpenInquiry={handleScrollToInquiry}
        />

        {/* Statistics & Partner Credibility Bar */}
        <StatsBar 
          currentTheme={currentTheme} 
        />

        {/* Curated Destinations Grid */}
        <DestinationsGrid 
          currentTheme={currentTheme}
          onSelectDestination={handleOpenDestination}
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
          searchFilter={heroSearchFilter}
          onClearSearchFilter={() => setHeroSearchFilter(null)}
        />

        {/* Experience & Core Beliefs Split Section */}
        <ExperienceSplit 
          currentTheme={currentTheme}
          onOpenInquiry={handleScrollToInquiry}
        />

        {/* Video Story Showcase, Testimonials & Journal */}
        <VideoStorySection 
          currentTheme={currentTheme}
          onOpenJournal={handleOpenJournal}
        />

        {/* Frequently Asked Questions (FAQ Section with Schema Alignment) */}
        <FAQSection 
          currentTheme={currentTheme}
          onOpenInquiry={handleScrollToInquiry}
          onNavigate={navigateTo}
        />

        {/* Booking & Inquiry Form */}
        <BookingInquirySection 
          currentTheme={currentTheme}
          preselectedDestination={preselectedDestination}
          preselectedGuests={preselectedGuests}
          preselectedDates={preselectedDates}
        />
      </main>

      {/* Footer */}
      <Footer 
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
        onNavigate={navigateTo}
      />

      {/* Interactive Destination Detail Modal with Route Sync */}
      {isDetailModalOpen && (
        <Suspense fallback={null}>
          <DetailModal
            destination={selectedDestination}
            isOpen={isDetailModalOpen}
            onClose={handleCloseDestinationModal}
            onBookNow={handleBookNowFromModal}
            currentTheme={currentTheme}
          />
        </Suspense>
      )}

      {/* Dedicated Visa Guidance Modal with Route Sync */}
      {isVisaModalOpen && (
        <Suspense fallback={null}>
          <VisaModal
            isOpen={isVisaModalOpen}
            onClose={handleCloseVisaModal}
            onGoAhead={handleVisaGoAhead}
            currentTheme={currentTheme}
          />
        </Suspense>
      )}

      {/* 1. Floating WhatsApp Quick-Connect Widget (Bottom-Left) */}
      <WhatsAppWidget />

      {/* 2. Floating AI Concierge Chatbot Widget (Bottom-Right, Theme-Adaptive) */}
      <ChatbotWidget currentTheme={currentTheme} />

      {/* 3. One-time Mobile PWA Install Prompt */}
      <PwaInstallPrompt currentTheme={currentTheme} />
    </div>
  );
}
