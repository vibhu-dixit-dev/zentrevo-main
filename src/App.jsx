import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import StatsBar from './components/StatsBar';
import DestinationsGrid from './components/DestinationsGrid';
import ExperienceSplit from './components/ExperienceSplit';
import VideoStorySection from './components/VideoStorySection';
import FAQSection from './components/FAQSection';
import BookingInquirySection from './components/BookingInquirySection';
import DetailModal from './components/DetailModal';
import JournalModal from './components/JournalModal';
import VisaModal from './components/VisaModal';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CancellationRefund from './pages/CancellationRefund';
import Footer from './components/Footer';
import WhatsAppWidget from './components/WhatsAppWidget';
import ChatbotWidget from './components/ChatbotWidget';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
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
  const [currentTheme, setCurrentTheme] = useState('editorial');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('all'); // 'all' | 'national' | 'international'
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [selectedJournalArticle, setSelectedJournalArticle] = useState(null);
  const [isVisaModalOpen, setIsVisaModalOpen] = useState(false);
  const [preselectedDestination, setPreselectedDestination] = useState('');

  const navigateTo = useCallback((path) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Handle opening a destination with individual URL route & dynamic SEO
  const handleOpenDestination = useCallback((destination, pushHistory = true) => {
    if (!destination) return;
    setSelectedDestination(destination);
    setIsDetailModalOpen(true);
    setIsJournalModalOpen(false);
    setIsVisaModalOpen(false);

    const slug = getDestinationSlug(destination);
    const newPath = `/destinations/${slug}`;

    if (pushHistory && typeof window !== 'undefined' && window.location.pathname !== newPath) {
      window.history.pushState({ type: 'destination', slug }, '', newPath);
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
  }, []);

  // Handle closing destination modal & restoring home route
  const handleCloseDestinationModal = useCallback((pushHistory = true) => {
    setIsDetailModalOpen(false);
    setSelectedDestination(null);

    if (pushHistory && typeof window !== 'undefined' && window.location.pathname.startsWith('/destinations/')) {
      window.history.pushState({}, '', '/');
      setCurrentPath('/');
    }
    resetDocumentSeo();
  }, []);

  // Handle opening journal (specific article or full catalog) with individual URL route
  const handleOpenJournal = useCallback((article = null, pushHistory = true) => {
    setSelectedJournalArticle(article);
    setIsJournalModalOpen(true);
    setIsDetailModalOpen(false);
    setIsVisaModalOpen(false);

    if (article) {
      const slug = getBlogSlug(article);
      const newPath = `/journal/${slug}`;
      if (pushHistory && typeof window !== 'undefined' && window.location.pathname !== newPath) {
        window.history.pushState({ type: 'journal', slug }, '', newPath);
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
      }
      updateDocumentSeo({
        title: 'Travel Journal & Stories | Zentrevo',
        description: 'Dispatches, field notes, and insider stories penned by our global expedition directors.',
        canonical: 'https://www.zentrevo.in/journal',
        ogImage: DEFAULT_SEO.ogImage
      });
    }
  }, []);

  // Handle closing journal modal & restoring home route
  const handleCloseJournalModal = useCallback((pushHistory = true) => {
    setIsJournalModalOpen(false);
    setSelectedJournalArticle(null);

    if (pushHistory && typeof window !== 'undefined' && 
       (window.location.pathname.startsWith('/journal') || window.location.pathname.startsWith('/blog'))) {
      window.history.pushState({}, '', '/');
      setCurrentPath('/');
    }
    resetDocumentSeo();
  }, []);

  // Handle opening Visa modal & route
  const handleOpenVisa = useCallback((pushHistory = true) => {
    setIsVisaModalOpen(true);
    setIsDetailModalOpen(false);
    setIsJournalModalOpen(false);

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

  // Handle article change inside the journal modal
  const handleJournalArticleChange = useCallback((newArticle) => {
    if (newArticle) {
      const slug = getBlogSlug(newArticle);
      const newPath = `/journal/${slug}`;
      if (typeof window !== 'undefined' && window.location.pathname !== newPath) {
        window.history.pushState({ type: 'journal', slug }, '', newPath);
        setCurrentPath(newPath);
      }
      updateDocumentSeo({
        title: `${newArticle.title} | Zentrevo Journal`,
        description: newArticle.excerpt || newArticle.pullQuote || DEFAULT_SEO.description,
        canonical: `https://www.zentrevo.in${newPath}`,
        ogImage: newArticle.image
      });
    } else {
      const newPath = '/journal';
      if (typeof window !== 'undefined' && window.location.pathname !== newPath) {
        window.history.pushState({ type: 'journal-index' }, '', newPath);
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

  // Sync route path with state on load & popstate (Back/Forward buttons)
  const syncRouteWithModal = useCallback((path) => {
    if (!path || path === '/' || path.startsWith('/admin')) {
      setIsDetailModalOpen(false);
      setIsJournalModalOpen(false);
      setIsVisaModalOpen(false);
      if (!path.startsWith('/admin')) {
        resetDocumentSeo();
      }
      return;
    }

    // 1. Legal Standalone Pages
    if (path.startsWith('/privacy-policy') || path.startsWith('/terms-of-service') || path.startsWith('/cancellation-and-refund')) {
      setIsDetailModalOpen(false);
      setIsJournalModalOpen(false);
      setIsVisaModalOpen(false);
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
      setIsJournalModalOpen(false);
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
          return;
        }
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
      setIsJournalModalOpen(false);
      setIsVisaModalOpen(false);
      resetDocumentSeo();
      const el = document.getElementById('inquiry');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Fallback: Default home
    setIsDetailModalOpen(false);
    setIsJournalModalOpen(false);
    setIsVisaModalOpen(false);
    resetDocumentSeo();
  }, [handleOpenDestination, handleOpenJournal, handleOpenVisa]);

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname || '/';
      setCurrentPath(path);
      syncRouteWithModal(path);
    };

    // Initial sync on mount to handle direct URLs (e.g. /destinations/bali or /privacy-policy)
    handleLocationChange();

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [syncRouteWithModal]);

  const isAdminRoute = 
    currentPath.startsWith('/admin') || 
    (typeof window !== 'undefined' && window.location.hash === '#admin');

  // Proper Standalone Legal Pages (Not a popup)
  if (currentPath === '/privacy-policy' || currentPath === '/privacy-policy/') {
    return <PrivacyPolicy onNavigateHome={() => navigateTo('/')} currentTheme={currentTheme} />;
  }
  if (currentPath === '/terms-of-service' || currentPath === '/terms-of-service/') {
    return <TermsOfService onNavigateHome={() => navigateTo('/')} currentTheme={currentTheme} />;
  }
  if (currentPath === '/cancellation-and-refund' || currentPath === '/cancellation-and-refund/') {
    return <CancellationRefund onNavigateHome={() => navigateTo('/')} currentTheme={currentTheme} />;
  }

  const handleSelectTheme = (themeName) => {
    setCurrentTheme(themeName);
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
    handleCloseJournalModal(true);
    handleScrollToInquiry();
  };

  // If user navigated to /admin, check authentication
  if (isAdminRoute) {
    if (!isAdminAuthenticated) {
      return (
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
      );
    }

    return (
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
    );
  }

  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';
  const isEditorial = currentTheme === 'editorial';

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
      />

      {/* Hero Section */}
      <HeroSection 
        currentTheme={currentTheme}
        onSelectDestination={handleOpenDestination}
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
      />

      {/* Booking & Inquiry Form */}
      <BookingInquirySection 
        currentTheme={currentTheme}
        preselectedDestination={preselectedDestination}
      />

      {/* Footer */}
      <Footer 
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
        onNavigate={navigateTo}
      />

      {/* Interactive Destination Detail Modal with Route Sync */}
      <DetailModal
        destination={selectedDestination}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDestinationModal}
        onBookNow={handleBookNowFromModal}
        currentTheme={currentTheme}
      />

      {/* Interactive Journal & Article Reader Modal with Route Sync */}
      <JournalModal
        isOpen={isJournalModalOpen}
        onClose={handleCloseJournalModal}
        initialArticle={selectedJournalArticle}
        currentTheme={currentTheme}
        onInquireStory={handleInquireFromJournal}
        onArticleChange={handleJournalArticleChange}
      />

      {/* Dedicated Visa Guidance Modal with Route Sync */}
      <VisaModal
        isOpen={isVisaModalOpen}
        onClose={handleCloseVisaModal}
        onGoAhead={handleVisaGoAhead}
        currentTheme={currentTheme}
      />

      {/* 1. Floating WhatsApp Quick-Connect Widget (Bottom-Left) */}
      <WhatsAppWidget />

      {/* 2. Floating AI Concierge Chatbot Widget (Bottom-Right, Theme-Adaptive) */}
      <ChatbotWidget currentTheme={currentTheme} />
    </div>
  );
}
