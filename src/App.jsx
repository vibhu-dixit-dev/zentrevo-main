import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import StatsBar from './components/StatsBar';
import DestinationsGrid from './components/DestinationsGrid';
import ExperienceSplit from './components/ExperienceSplit';
import VideoStorySection from './components/VideoStorySection';
import BookingInquirySection from './components/BookingInquirySection';
import DetailModal from './components/DetailModal';
import Footer from './components/Footer';
import WhatsAppWidget from './components/WhatsAppWidget';
import ChatbotWidget from './components/ChatbotWidget';
import { Compass, Crown } from 'lucide-react';

export default function App() {
  // Theme State: 'editorial' (Default) | 'sapphire' (Royal Sapphire & Gold) | 'emerald' (Emerald Luxe)
  const [currentTheme, setCurrentTheme] = useState('editorial');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleSelectTheme = (themeName) => {
    setCurrentTheme(themeName);
  };

  const handleOpenDestination = (destination) => {
    setSelectedDestination(destination);
    setIsDetailModalOpen(true);
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
      />

      {/* Experience & Core Beliefs Split Section */}
      <ExperienceSplit 
        currentTheme={currentTheme}
        onOpenInquiry={handleScrollToInquiry}
      />

      {/* Video Story Showcase, Testimonials & Journal */}
      <VideoStorySection 
        currentTheme={currentTheme} 
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

      {/* 1. Floating WhatsApp Quick-Connect Widget (Bottom-Left) */}
      <WhatsAppWidget />

      {/* 2. Floating AI Concierge Chatbot Widget (Bottom-Right, Theme-Adaptive) */}
      <ChatbotWidget currentTheme={currentTheme} />

      {/* 3. Centered 3-Theme Switcher Dock (Bottom-Center) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div className={`pointer-events-auto p-1.5 rounded-full shadow-2xl border backdrop-blur-xl flex items-center gap-1 transition-all ${
          isSapphire
            ? 'bg-[#0c1a38]/95 border-amber-500/40 text-white shadow-blue-950/70'
            : isEmerald
              ? 'bg-[#0d2b23]/95 border-emerald-600/50 text-white shadow-emerald-950/60'
              : 'bg-white/95 border-stone-300 text-stone-900 shadow-stone-300/80'
        }`}>
          <div className="hidden sm:block pl-2 pr-1 text-stone-400">
            <Compass className="w-3.5 h-3.5" />
          </div>

          {/* Option 1: Editorial Mono (Default) */}
          <button
            onClick={() => handleSelectTheme('editorial')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isEditorial 
                ? 'bg-stone-950 text-white shadow-md font-bold' 
                : 'text-stone-400 hover:text-stone-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-stone-300"></span>
            <span>Editorial</span>
          </button>

          {/* Option 2: Royal Sapphire & Gold */}
          <button
            onClick={() => handleSelectTheme('sapphire')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isSapphire 
                ? 'bg-amber-400 text-stone-950 shadow-md font-bold' 
                : 'text-stone-400 hover:text-amber-300'
            }`}
          >
            <Crown className="w-3 h-3 text-amber-500" />
            <span>Sapphire</span>
          </button>

          {/* Option 3: Emerald Luxe */}
          <button
            onClick={() => handleSelectTheme('emerald')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isEmerald 
                ? 'bg-emerald-400 text-stone-950 shadow-md font-bold' 
                : 'text-stone-400 hover:text-emerald-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Emerald</span>
          </button>
        </div>
      </div>
    </div>
  );
}
