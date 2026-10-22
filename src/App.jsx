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
import { Compass } from 'lucide-react';

export default function App() {
  // Theme State: Defaulted to 'editorial' (Travelio & Travel Editorial Mono) as requested
  const [currentTheme, setCurrentTheme] = useState('editorial');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const toggleTheme = () => {
    setCurrentTheme((prev) => (prev === 'editorial' ? 'emerald' : 'editorial'));
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

  return (
    <div 
      className={`min-h-screen transition-colors duration-500 font-sans-clean ${
        isEmerald 
          ? 'bg-[#061813] text-stone-100' 
          : 'bg-[#faf9f6] text-stone-900'
      }`}
    >
      {/* Main Navigation */}
      <Navbar 
        currentTheme={currentTheme}
        onToggleTheme={toggleTheme}
        onOpenInquiry={handleScrollToInquiry}
      />

      {/* Hero Section (incorporates Template 1, 2, and 3) */}
      <HeroSection 
        currentTheme={currentTheme}
        onSelectDestination={handleOpenDestination}
        onOpenInquiry={handleScrollToInquiry}
      />

      {/* Statistics & Partner Credibility Bar (Template 2) */}
      <StatsBar 
        currentTheme={currentTheme} 
      />

      {/* Curated Destinations Grid (Template 1 & 2) */}
      <DestinationsGrid 
        currentTheme={currentTheme}
        onSelectDestination={handleOpenDestination}
      />

      {/* Experience & Core Beliefs Split Section (Template 1 & 2) */}
      <ExperienceSplit 
        currentTheme={currentTheme}
        onOpenInquiry={handleScrollToInquiry}
      />

      {/* Video Story Showcase, Testimonials & Journal (Template 1 & 2) */}
      <VideoStorySection 
        currentTheme={currentTheme} 
      />

      {/* Booking & Inquiry Form (Template 2 "Voyages of Wonder") */}
      <BookingInquirySection 
        currentTheme={currentTheme} 
      />

      {/* Footer */}
      <Footer 
        currentTheme={currentTheme}
        onToggleTheme={toggleTheme}
      />

      {/* Interactive Destination Detail Modal */}
      <DetailModal
        destination={selectedDestination}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onBookNow={handleBookNowFromModal}
        currentTheme={currentTheme}
      />

      {/* Floating Theme Switcher Dock (Client UX Helper) */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className={`p-1.5 rounded-full shadow-2xl border backdrop-blur-xl flex items-center gap-1 transition-all ${
          isEmerald
            ? 'bg-[#0d2b23]/95 border-emerald-600/50 text-white shadow-emerald-950/60'
            : 'bg-white/95 border-stone-300 text-stone-900 shadow-stone-300/80'
        }`}>
          <div className="pl-2 pr-1 text-stone-400">
            <Compass className="w-3.5 h-3.5" />
          </div>

          <button
            onClick={() => setCurrentTheme('editorial')}
            className={`px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              !isEmerald 
                ? 'bg-stone-950 text-white shadow-md font-bold' 
                : 'text-emerald-300/80 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-stone-300"></span>
            <span>Editorial Mono</span>
          </button>

          <button
            onClick={() => setCurrentTheme('emerald')}
            className={`px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isEmerald 
                ? 'bg-emerald-400 text-stone-950 shadow-md font-bold' 
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Emerald Luxe</span>
          </button>
        </div>
      </div>
    </div>
  );
}
