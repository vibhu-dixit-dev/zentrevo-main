import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import StatsBar from './components/StatsBar';
import DestinationsGrid from './components/DestinationsGrid';
import ExperienceSplit from './components/ExperienceSplit';
import VideoStorySection from './components/VideoStorySection';
import BookingInquirySection from './components/BookingInquirySection';
import DetailModal from './components/DetailModal';
import JournalModal from './components/JournalModal';
import Footer from './components/Footer';
import WhatsAppWidget from './components/WhatsAppWidget';
import ChatbotWidget from './components/ChatbotWidget';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';

export default function App() {
  // Admin Session State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('zentrevo_admin_auth') === 'true';
    }
    return false;
  });

  // Route Detection: Supports /admin route and #admin hash
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const isAdminRoute = 
    currentPath.startsWith('/admin') || 
    (typeof window !== 'undefined' && window.location.hash === '#admin');

  // Theme State: 'editorial' (Default) | 'sapphire' (Royal Sapphire & Gold) | 'emerald' (Emerald Luxe)
  const [currentTheme, setCurrentTheme] = useState('editorial');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('all'); // 'all' | 'national' | 'international'
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [selectedJournalArticle, setSelectedJournalArticle] = useState(null);

  const handleSelectTheme = (themeName) => {
    setCurrentTheme(themeName);
  };

  const handleOpenDestination = (destination) => {
    setSelectedDestination(destination);
    setIsDetailModalOpen(true);
  };

  const handleOpenJournal = (article = null) => {
    setSelectedJournalArticle(article);
    setIsJournalModalOpen(true);
  };

  const handleScrollToInquiry = () => {
    const el = document.getElementById('inquiry');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookNowFromModal = (dest) => {
    setIsDetailModalOpen(false);
    handleScrollToInquiry();
  };

  const handleInquireFromJournal = (destinationName) => {
    setIsJournalModalOpen(false);
    handleScrollToInquiry();
  };

  // If user navigated to /admin, check authentication
  if (isAdminRoute) {
    if (!isAdminAuthenticated) {
      return (
        <AdminLogin 
          onLoginSuccess={() => {
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('zentrevo_admin_auth', 'true');
            }
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
        onExit={() => {
          if (typeof window !== 'undefined') {
            window.history.pushState({}, '', '/');
            setCurrentPath('/');
          }
        }}
        onLogout={() => {
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('zentrevo_admin_auth');
          }
          setIsAdminAuthenticated(false);
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

      {/* Booking & Inquiry Form */}
      <BookingInquirySection 
        currentTheme={currentTheme} 
      />

      {/* Footer */}
      <Footer 
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
      />

      {/* Interactive Destination Detail Modal */}
      <DetailModal
        destination={selectedDestination}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onBookNow={handleBookNowFromModal}
        currentTheme={currentTheme}
      />

      {/* Interactive Journal & Article Reader Modal */}
      <JournalModal
        isOpen={isJournalModalOpen}
        onClose={() => setIsJournalModalOpen(false)}
        initialArticle={selectedJournalArticle}
        currentTheme={currentTheme}
        onInquireStory={handleInquireFromJournal}
      />

      {/* 1. Floating WhatsApp Quick-Connect Widget (Bottom-Left) */}
      <WhatsAppWidget />

      {/* 2. Floating AI Concierge Chatbot Widget (Bottom-Right, Theme-Adaptive) */}
      <ChatbotWidget currentTheme={currentTheme} />
    </div>
  );
}
