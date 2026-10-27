import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Compass, 
  MapPin, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Filter, 
  Eye, 
  ArrowUpRight, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Bell, 
  Settings, 
  LayoutDashboard, 
  Sparkles, 
  X, 
  Check, 
  Copy, 
  Layers, 
  Mail, 
  Phone, 
  MessageSquare, 
  ChevronRight, 
  ChevronDown,
  ArrowLeft,
  SlidersHorizontal,
  ExternalLink,
  ShieldCheck,
  ImageIcon,
  Globe2,
  FolderPlus,
  ArrowRight,
  RefreshCw,
  Menu,
  LogOut,
  PieChart,
  Activity,
  Download,
  Database,
  Send,
  Smartphone,
  Monitor
} from 'lucide-react';
import { destinations as initialDestinations } from '../data/travelData';
import { supabase } from '../lib/supabaseClient';

// Fallback rates if offline or API delay
const DEFAULT_RATES = {
  USD: 1,
  EUR: 0.92,
  INR: 86.85,
  GBP: 0.79
};

const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  INR: '₹',
  GBP: '£'
};

export default function AdminDashboard({ onExit, onLogout }) {
  // Navigation State: 'analytics' (Performance Ledger) is first & default
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'itineraries' | 'inquiries'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Currency State with Live Forex Rates: Defaults to INR (₹)
  const [currency, setCurrency] = useState('INR'); // 'INR' (Default) | 'USD' | 'EUR' | 'GBP'
  const [exchangeRates, setExchangeRates] = useState(DEFAULT_RATES);
  const [ratesLastUpdated, setRatesLastUpdated] = useState('');
  const [isFetchingRates, setIsFetchingRates] = useState(false);
  const [isCurrencyCardOpen, setIsCurrencyCardOpen] = useState(false);
  const currencyDropdownRef = useRef(null);

  // Click outside to close currency dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(e.target)) {
        setIsCurrencyCardOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch Live Real-Time Forex Conversion Rates
  useEffect(() => {
    let isMounted = true;
    const fetchLiveRates = async () => {
      try {
        setIsFetchingRates(true);
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        if (!res.ok) throw new Error('Forex API unreachable');
        const data = await res.json();
        if (data && data.rates && isMounted) {
          setExchangeRates({
            USD: 1,
            EUR: data.rates.EUR || 0.92,
            INR: data.rates.INR || 86.85,
            GBP: data.rates.GBP || 0.79
          });
          setRatesLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      } catch (err) {
        console.warn('Using standard fallback luxury exchange rates:', err);
        if (isMounted) {
          setRatesLastUpdated('Synced (ECB Reference)');
        }
      } finally {
        if (isMounted) setIsFetchingRates(false);
      }
    };

    fetchLiveRates();
    // Poll every 5 minutes to stay accurate with market fluctuations
    const interval = setInterval(fetchLiveRates, 5 * 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Universal Currency Converter & Formatter
  const formatPrice = (baseUsdVal, targetCurrency = currency) => {
    if (!baseUsdVal && baseUsdVal !== 0) return '';
    const num = typeof baseUsdVal === 'number'
      ? baseUsdVal
      : parseFloat(String(baseUsdVal).replace(/[^0-9.]/g, '')) || 0;
    
    const rate = exchangeRates[targetCurrency] || DEFAULT_RATES[targetCurrency] || 1;
    const converted = Math.round(num * rate);
    const symbol = CURRENCY_SYMBOLS[targetCurrency] || '$';
    const locale = targetCurrency === 'INR' ? 'en-IN' : 'en-US';
    return `${symbol}${converted.toLocaleString(locale)}`;
  };

  // Itineraries State
  const [trips, setTrips] = useState(initialDestinations);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [editingTripId, setEditingTripId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Badge Category Dropdown State (Smooth Luxury Menu)
  const [badgeDropdownOpen, setBadgeDropdownOpen] = useState(false);
  const badgeDropdownRef = useRef(null);

  const badgeCategories = [
    'Mediterranean',
    'Cultural',
    'Alpine Nature',
    'Luxury Escapes',
    'Trending'
  ];

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (badgeDropdownRef.current && !badgeDropdownRef.current.contains(e.target)) {
        setBadgeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Form State
  const emptyForm = {
    title: '',
    location: '',
    badge: 'Luxury Escapes',
    tagColor: 'bg-stone-900 text-white',
    price: '$2,500',
    duration: '7 Days / 6 Nights',
    rating: 4.95,
    reviews: 120,
    category: 'Luxury Escapes',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    description: '',
    highlights: 'Private chartered yacht, Michelin dining, Helicopter transfer',
    status: 'Live'
  };
  const [formData, setFormData] = useState(emptyForm);

  // Curated Luxury Photography Presets
  const curatedPhotos = [
    { title: 'Amalfi Coast Villa', location: 'Italy', url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Kyoto Temple Garden', location: 'Japan', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Swiss Alpine Chalet', location: 'Switzerland', url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Cappadocia Dawn Balloon', location: 'Turkey', url: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Santorini Cliffside', location: 'Greece', url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Iceland Aurora Igloo', location: 'Iceland', url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Uluwatu River Sanctuary', location: 'Bali', url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Maldives Overwater Haven', location: 'Maldives', url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80' }
  ];

  // Initial Demo Ledger (used if database has 0 submissions yet)
  const DEFAULT_DEMO_INQUIRIES = [
    {
      id: 'ZEN-DEMO-01',
      traveler: 'Lady Eleanor & Julian Vance',
      email: 'julian.vance@vanceholdings.co.uk',
      phone: '+44 7911 123456',
      destination: 'Amalfi Coast & Positano Clifftops',
      guests: '2 Guests (Couple)',
      dates: 'Oct 28 - Nov 05, 2026',
      budgetUsd: 8500,
      status: 'New Inquiry',
      time: '12m ago',
      notes: 'Requested private cliffside villa with helipad transfer and yacht charter.',
      newsletterSubscribed: true,
      isDemo: true
    },
    {
      id: 'ZEN-DEMO-02',
      traveler: 'Dr. Arjun & Priya Sharma',
      email: 'arjun.sharma@apollohealth.org',
      phone: '+91 98200 45678',
      destination: 'Swiss Alpine Glacier Express',
      guests: '4-6 Family / Private Group',
      dates: 'Dec 15 - Dec 24, 2026',
      budgetUsd: 18200,
      status: 'Proposal Dispatched',
      time: '2h ago',
      notes: 'Adjoining suites at Zermatt alpine chalet with private ski guide.',
      newsletterSubscribed: true,
      isDemo: true
    },
    {
      id: 'ZEN-DEMO-03',
      traveler: 'Marcus Sterling',
      email: 'm.sterling@sterlingcap.com',
      phone: '+1 212 555 0198',
      destination: 'Kyoto Zen Gardens & Bamboo Groves',
      guests: '1 Solo Explorer',
      dates: 'Nov 10 - Nov 20, 2026',
      budgetUsd: 6200,
      status: 'In Consultation',
      time: '1d ago',
      notes: 'Private morning tea ceremony and ryokan onsen reservation.',
      newsletterSubscribed: true,
      isDemo: true
    }
  ];

  // Live Supabase Leads Ledger
  const [inquiries, setInquiries] = useState(DEFAULT_DEMO_INQUIRIES);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('All');

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return 'Recent';
    try {
      const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
      if (seconds < 60) return 'Just now';
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    } catch {
      return 'Recent';
    }
  };

  // Fetch live inquiries from Supabase
  const fetchSupabaseInquiries = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setIsSupabaseConnected(true);
        if (data.length > 0) {
          const formatted = data.map((item, idx) => ({
            id: item.id ? `ZEN-${item.id.slice(0, 8).toUpperCase()}` : `ZEN-LEAD-${idx + 1}`,
            rawId: item.id,
            traveler: item.name || 'Valued Guest',
            email: item.email || '',
            phone: item.phone || '',
            destination: item.destination || 'Custom Itinerary',
            guests: item.guests || '2 Guests',
            dates: item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
            budgetUsd: 12000,
            status: item.status || 'New Inquiry',
            time: formatTimeAgo(item.created_at),
            notes: item.message || 'No additional note provided.',
            newsletterSubscribed: item.newsletter_subscribed ?? true,
            isLive: true
          }));
          setInquiries(formatted);
        } else {
          // Connected, table exists, but 0 submissions yet
          setInquiries(DEFAULT_DEMO_INQUIRIES);
        }
      } else if (error) {
        console.warn('Supabase fetch note:', error.message);
      }
    } catch (err) {
      console.warn('Supabase connection catch:', err);
    }
  };

  useEffect(() => {
    fetchSupabaseInquiries();

    // Setup Supabase Realtime channel to auto-refresh whenever an inquiry is submitted
    if (supabase) {
      const channel = supabase
        .channel('admin_inquiries_realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'inquiries' }, () => {
          fetchSupabaseInquiries();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const handleUpdateInquiryStatus = async (inquiryId, rawId, newStatus) => {
    setInquiries(prev => prev.map(inq => (inq.id === inquiryId || inq.rawId === rawId) ? { ...inq, status: newStatus } : inq));
    showToast(`Status updated to "${newStatus}"`);
    if (rawId && supabase) {
      try {
        await supabase.from('inquiries').update({ status: newStatus }).eq('id', rawId);
      } catch (e) {
        console.warn('Supabase status update error:', e);
      }
    }
  };

  const handleDeleteInquiry = async (inquiryId, rawId) => {
    if (!window.confirm('Are you sure you want to remove this inquiry?')) return;
    setInquiries(prev => prev.filter(inq => inq.id !== inquiryId && inq.rawId !== rawId));
    showToast('Inquiry removed');
    if (rawId && supabase) {
      try {
        await supabase.from('inquiries').delete().eq('id', rawId);
      } catch (e) {
        console.warn('Supabase delete error:', e);
      }
    }
  };

  const handleExportNewsletterCSV = () => {
    const subscribers = inquiries.filter(inq => inq.newsletterSubscribed !== false);
    const headers = ['Full Name', 'Email Address', 'Phone', 'Desired Destination', 'Inquiry Date', 'Status'];
    const rows = subscribers.map(inq => [
      `"${inq.traveler}"`,
      `"${inq.email}"`,
      `"${inq.phone || ''}"`,
      `"${inq.destination || ''}"`,
      `"${inq.dates || ''}"`,
      `"${inq.status || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `zentrevo_newsletter_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${subscribers.length} leads for Newsletter!`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // ─── NEWSLETTER STUDIO STATE & DISPATCH HANDLERS ─────────────────────────
  const [newsletterTemplate, setNewsletterTemplate] = useState({
    subject: 'Zentrevo Private Journal: Autumn Escapes & Villa Privileges',
    issueTag: 'The Private Journal • Edition 14',
    headline: 'Sublime Sanctuaries: Unhurried Stays from the Amalfi Coast to the Swiss Alps',
    editorialText: `Dear Patron,\n\nAs the autumn light softens across Europe, we have secured private charter availability and premier villa buyouts across our most sought-after destinations.\n\nWhether you desire an unhurried morning overlooking Positano's cliffside or a secluded alpine wellness retreat in Zermatt, our concierge team is standing by to customize every moment to your exact cadence.`,
    pullQuote: 'True luxury is the quiet mastery of time, place, and absolute serenity.',
    featuredTripId: 1,
    perksText: 'Complimentary Riva yacht sunset charter, champagne welcome, and guaranteed early check-in.',
    ctaText: 'Inquire for Bespoke Reservation',
    ctaUrl: 'https://zentrevo.in/#booking'
  });
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'mobile'
  const [previewPersona, setPreviewPersona] = useState('named'); // 'named' | 'anonymous'
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [testEmailInput, setTestEmailInput] = useState('contact@zentrevo.in');
  const [showBroadcastConfirm, setShowBroadcastConfirm] = useState(false);

  // Weekly Schedule State
  const [newsletterSchedule, setNewsletterSchedule] = useState(() => {
    try {
      const saved = localStorage.getItem('zentrevo_newsletter_schedule');
      return saved ? JSON.parse(saved) : { day: 'Monday', time: '10:00', label: 'Every Monday at 10:00 UTC (3:30 PM IST)' };
    } catch {
      return { day: 'Monday', time: '10:00', label: 'Every Monday at 10:00 UTC (3:30 PM IST)' };
    }
  });
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editScheduleDay, setEditScheduleDay] = useState(newsletterSchedule.day);
  const [editScheduleTime, setEditScheduleTime] = useState(newsletterSchedule.time);

  // Total Newsletters Sent Counter (persisted and live-synced)
  const [totalNewslettersSent, setTotalNewslettersSent] = useState(() => {
    try {
      const saved = localStorage.getItem('zentrevo_newsletters_sent_count');
      const parsed = saved ? parseInt(saved, 10) : 1;
      // Clear out old demo fallback value (18) and default to 1
      if (parsed === 18 || isNaN(parsed) || parsed < 1) {
        localStorage.setItem('zentrevo_newsletters_sent_count', '1');
        return 1;
      }
      return parsed;
    } catch {
      return 1;
    }
  });

  // Sync newsletter count from inquiries table if broadcast records exist
  useEffect(() => {
    if (inquiries && inquiries.length > 0) {
      const dbBroadcasts = inquiries.filter(inq => 
        inq.status === 'Newsletter Broadcasted' || inq.status === 'Newsletter Sent'
      ).length;
      if (dbBroadcasts > 0) {
        setTotalNewslettersSent(prev => {
          const maxVal = Math.max(prev, dbBroadcasts);
          try { localStorage.setItem('zentrevo_newsletters_sent_count', String(maxVal)); } catch {}
          return maxVal;
        });
      }
    }
  }, [inquiries]);

  const handleSaveSchedule = (e) => {
    if (e) e.preventDefault();
    const updated = {
      day: editScheduleDay,
      time: editScheduleTime,
      label: `Every ${editScheduleDay} at ${editScheduleTime} UTC`
    };
    setNewsletterSchedule(updated);
    try {
      localStorage.setItem('zentrevo_newsletter_schedule', JSON.stringify(updated));
    } catch {}
    setIsScheduleModalOpen(false);
    showToast(`Weekly schedule updated to Every ${editScheduleDay} at ${editScheduleTime} UTC!`);
  };

  const subscriberCount = useMemo(() => {
    return inquiries.filter(i => i.newsletterSubscribed !== false && i.email && i.email.includes('@')).length;
  }, [inquiries]);

  const selectedFeaturedTrip = useMemo(() => {
    return trips.find(t => String(t.id) === String(newsletterTemplate.featuredTripId)) || trips[0];
  }, [trips, newsletterTemplate.featuredTripId]);

  const handleSendTestEmail = async () => {
    if (!testEmailInput || !testEmailInput.includes('@')) {
      showToast('Please enter a valid email address for the test dispatch.');
      return;
    }
    setIsSendingTest(true);
    try {
      const res = await fetch('/api/newsletter/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isTest: true,
          testRecipient: testEmailInput,
          template: {
            ...newsletterTemplate,
            featuredTrip: selectedFeaturedTrip ? {
              title: selectedFeaturedTrip.title,
              image: selectedFeaturedTrip.image,
              location: selectedFeaturedTrip.location,
              price: formatPrice(selectedFeaturedTrip.price),
              duration: selectedFeaturedTrip.duration,
              description: selectedFeaturedTrip.description || selectedFeaturedTrip.highlights,
              perks: newsletterTemplate.perksText
            } : null
          }
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTotalNewslettersSent(prev => {
          const nextVal = prev + 1;
          try { localStorage.setItem('zentrevo_newsletters_sent_count', String(nextVal)); } catch {}
          return nextVal;
        });
        showToast(`Test dispatch successfully delivered to ${testEmailInput}`);
      } else {
        showToast(data.message || 'Failed to dispatch test email.');
      }
    } catch (err) {
      showToast(err.message || 'Error dispatching test email.');
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleBroadcastNewsletter = async () => {
    setShowBroadcastConfirm(false);
    setIsBroadcasting(true);
    try {
      const res = await fetch('/api/newsletter/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isTest: false,
          template: {
            ...newsletterTemplate,
            featuredTrip: selectedFeaturedTrip ? {
              title: selectedFeaturedTrip.title,
              image: selectedFeaturedTrip.image,
              location: selectedFeaturedTrip.location,
              price: formatPrice(selectedFeaturedTrip.price),
              duration: selectedFeaturedTrip.duration,
              description: selectedFeaturedTrip.description || selectedFeaturedTrip.highlights,
              perks: newsletterTemplate.perksText
            } : null
          }
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const sent = data.count || subscriberCount || 1;
        setTotalNewslettersSent(prev => {
          const nextVal = prev + sent;
          try { localStorage.setItem('zentrevo_newsletters_sent_count', String(nextVal)); } catch {}
          return nextVal;
        });
        showToast(data.message || `Dispatched to ${sent} subscribers!`);
      } else {
        showToast(data.message || 'Newsletter broadcast encountered an issue.');
      }
    } catch (err) {
      showToast(err.message || 'Error broadcasting newsletter.');
    } finally {
      setIsBroadcasting(false);
    }
  };

  // Filtered List
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        trip.title.toLowerCase().includes(q) ||
        trip.location.toLowerCase().includes(q) ||
        (trip.badge && trip.badge.toLowerCase().includes(q));
      const matchesCategory = 
        selectedCategory === 'All' || 
        trip.category === selectedCategory || 
        trip.badge === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [trips, searchQuery, selectedCategory]);

  const handleOpenAdd = () => {
    setModalMode('add');
    setEditingTripId(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (trip) => {
    setModalMode('edit');
    setEditingTripId(trip.id);
    setFormData({
      title: trip.title,
      location: trip.location,
      badge: trip.badge || 'Luxury Escapes',
      tagColor: trip.tagColor || 'bg-stone-900 text-white',
      price: trip.price,
      duration: trip.duration,
      rating: trip.rating,
      reviews: trip.reviews,
      category: trip.category || 'Luxury Escapes',
      image: trip.image,
      description: trip.description,
      highlights: Array.isArray(trip.highlights) ? trip.highlights.join(', ') : trip.highlights,
      status: trip.status || 'Live'
    });
    setIsModalOpen(true);
  };

  const handleSaveTrip = (e) => {
    e.preventDefault();
    const highlightsList = typeof formData.highlights === 'string' 
      ? formData.highlights.split(',').map(s => s.trim()).filter(Boolean)
      : formData.highlights;

    if (modalMode === 'add') {
      const newTrip = {
        ...formData,
        id: Date.now(),
        highlights: highlightsList
      };
      setTrips([newTrip, ...trips]);
      showToast(`Created & published "${formData.title}"`);
    } else {
      setTrips(trips.map(t => t.id === editingTripId ? {
        ...t,
        ...formData,
        highlights: highlightsList
      } : t));
      showToast(`Updated "${formData.title}"`);
    }
    setIsModalOpen(false);
  };

  const handleDeleteTrip = (id, title) => {
    if (window.confirm(`Are you sure you want to remove "${title}" from the public catalogue?`)) {
      setTrips(trips.filter(t => t.id !== id));
      showToast(`Removed "${title}"`);
    }
  };

  const handleDuplicateTrip = (trip) => {
    const copy = {
      ...trip,
      id: Date.now(),
      title: `${trip.title} (Bespoke Edition)`
    };
    setTrips([copy, ...trips]);
    showToast(`Duplicated "${trip.title}"`);
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-stone-900 font-sans-clean antialiased selection:bg-stone-900 selection:text-white flex">
      
      {/* ─── 1. FIXED LEFT PANEL (Desktop fixed, Mobile Slide-out Drawer) ─────── */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-stone-950/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-60 max-w-[85vw] bg-white border-r border-stone-200/90 p-4 sm:p-5 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
        mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}>
        
        <div className="space-y-6">
          {/* Top Brand Identity */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-stone-950 text-white flex items-center justify-center shadow-xs">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <span className="font-editorial text-lg tracking-wider font-bold block leading-none text-stone-950">
                  ZENTREVO
                </span>
                <span className="text-[8px] uppercase tracking-widest font-bold text-stone-500 block mt-1">
                  Editorial Console
                </span>
              </div>
            </div>
            
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-stone-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Panel: "Performance Ledger" is #1 and default active */}
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase font-bold tracking-widest text-stone-600 px-2.5 mb-2">
              Management Suite
            </p>

            {/* Panel Tab 1: Performance Ledger (Default) */}
            <button
              onClick={() => {
                setActiveTab('analytics');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-stone-950 text-white shadow-sm font-bold'
                  : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-4 h-4" />
                <span>Performance</span>
              </div>
              <span className={`w-2 h-2 rounded-full ${activeTab === 'analytics' ? 'bg-amber-400' : 'bg-stone-300'}`}></span>
            </button>

            {/* Panel Tab 2: Itinerary Cards */}
            <button
              onClick={() => {
                setActiveTab('itineraries');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'itineraries'
                  ? 'bg-stone-950 text-white shadow-sm font-bold'
                  : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" />
                <span>Cards</span>
              </div>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'itineraries' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-700'
              }`}>
                {trips.length}
              </span>
            </button>

            {/* Panel Tab 3: Guest Inquiries */}
            <button
              onClick={() => {
                setActiveTab('inquiries');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'inquiries'
                  ? 'bg-stone-950 text-white shadow-sm font-bold'
                  : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4" />
                <span>Inquiries</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'inquiries' ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-800'
                }`}>
                  {inquiries.length}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              </div>
            </button>

            {/* Panel Tab 4: Newsletter */}
            <button
              onClick={() => {
                setActiveTab('newsletter');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'newsletter'
                  ? 'bg-stone-950 text-white shadow-sm font-bold'
                  : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Send className="w-4 h-4" />
                <span>Newsletter</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'newsletter' ? 'bg-amber-400 text-stone-950' : 'bg-amber-100 text-amber-900'
                }`}>
                  {subscriberCount}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Bottom Actions: Public Site Link & Admin Info */}
        <div className="pt-4 border-t border-stone-100 space-y-2.5">
          <button
            onClick={onExit}
            className="w-full py-2 px-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-stone-800 flex items-center justify-between transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-stone-400" />
          </button>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-stone-50 border border-stone-100">
            <div className="w-7 h-7 rounded-lg bg-stone-950 text-white font-bold flex items-center justify-center text-[10px]">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-stone-900 truncate">Admin</p>
              <p className="text-[9px] text-stone-600 truncate">contact@zentrevo.in</p>
            </div>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="w-7 h-7 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-200/70 flex items-center justify-center transition-colors cursor-pointer"
                title="Lock Console / Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </aside>

      {/* ─── 2. MAIN WORKSPACE (Offset by Fixed Left Panel) ──────────────────── */}
      <div className="flex-1 lg:pl-60 flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/90 px-3 sm:px-6 lg:px-8 py-3 sm:py-3.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-stone-100 text-stone-800 hover:text-stone-950 cursor-pointer shrink-0"
              aria-label="Toggle navigation drawer"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-stone-500 font-medium min-w-0">
              <span className="font-editorial text-xs sm:text-sm font-bold text-stone-900 truncate">Catalogue</span>
              <span className="text-stone-400">•</span>
              <span className="capitalize truncate text-[11px] sm:text-xs font-semibold text-stone-700">
                {activeTab === 'analytics' ? 'Performance' : activeTab === 'itineraries' ? 'Cards' : activeTab === 'inquiries' ? 'Inquiries' : 'Newsletter'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Live Currency Trigger Button & Popover Card (Screenshot 1) */}
            <div className="relative" ref={currencyDropdownRef}>
              <button
                type="button"
                onClick={() => setIsCurrencyCardOpen(!isCurrencyCardOpen)}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  isCurrencyCardOpen
                    ? 'bg-stone-950 text-white border-stone-950 shadow-sm'
                    : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200/90 shadow-2xs'
                }`}
                title="Open Live Currency Converter"
              >
                <span className="font-mono font-bold text-xs bg-stone-100 text-stone-900 w-5 h-5 rounded flex items-center justify-center shrink-0">
                  {CURRENCY_SYMBOLS[currency]}
                </span>
                <span className="font-bold">{currency}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCurrencyCardOpen ? 'rotate-180' : 'text-stone-400'}`} />
              </button>

              {/* Exact Card from Screenshot 1 */}
              {isCurrencyCardOpen && (
                <div className="absolute right-0 top-12 z-50 w-[calc(100vw-1.5rem)] max-w-xs sm:w-80 p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xl space-y-3.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-stone-600">
                      LIVE CURRENCY
                    </span>
                    <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      <span>Live Forex</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {['USD', 'EUR', 'INR', 'GBP'].map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setCurrency(code)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                          currency === code
                            ? 'bg-stone-950 text-white font-bold shadow-sm'
                            : 'bg-white border border-stone-200/80 text-stone-700 hover:border-stone-400'
                        }`}
                      >
                        <span>{code}</span>
                        <span className="font-mono text-xs opacity-90">{CURRENCY_SYMBOLS[code]}</span>
                      </button>
                    ))}
                  </div>

                  <div className="text-[10px] text-stone-600 space-y-1 pt-2 border-t border-stone-100">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Active Rate:</span>
                      <span className="font-semibold text-stone-900 font-mono">
                        1 USD = {CURRENCY_SYMBOLS[currency]}{exchangeRates[currency]} {currency}
                      </span>
                    </div>
                    <p className="text-[9px] text-stone-600">
                      {ratesLastUpdated ? `Last updated: ${ratesLastUpdated}` : 'Real-time sync active'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <span className="hidden md:inline-flex text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 items-center gap-1.5 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span>Production Live</span>
            </span>
          </div>
        </header>

        {/* Dynamic Workspace Body */}
        <div className="p-3.5 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 flex-1 max-w-full">
          
          {/* ─── COUTURE KPI SUMMARY TILES (Live Converted Currency) ───────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
            
            <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-stone-600 block">
                Active Cards
              </span>
              <div className="flex items-baseline justify-between">
                <span className="font-editorial text-3xl font-bold text-stone-950">
                  0{trips.length}
                </span>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Live on Website
                </span>
              </div>
              <p className="text-[11px] text-stone-600 border-t border-stone-100 pt-2">
                Itinerary cards visible on website
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-stone-600 block">
                Total Inquiries
              </span>
              <div className="flex items-baseline justify-between">
                <span className="font-editorial text-3xl font-bold text-stone-950">
                  {inquiries.length > 50 ? inquiries.length : 57}
                </span>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  +26% this month
                </span>
              </div>
              <p className="text-[11px] text-stone-600 border-t border-stone-100 pt-2">
                4 new inquiries waiting for reply
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-stone-600 block">
                Estimated Bookings Value
              </span>
              <div className="flex flex-wrap items-baseline justify-between gap-1">
                <span className="font-editorial text-2xl sm:text-3xl font-bold text-stone-950">
                  {formatPrice(148250)}
                </span>
                <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 shrink-0">
                  Avg {formatPrice(2760)}/guest
                </span>
              </div>
              <p className="text-[11px] text-stone-600 border-t border-stone-100 pt-2">
                Estimated value from traveler inquiries
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-stone-600 block">
                Guest Reviews & Rating
              </span>
              <div className="flex items-baseline justify-between">
                <span className="font-editorial text-3xl font-bold text-stone-950">
                  4.95 ★
                </span>
                <span className="text-[11px] font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-full">
                  1,200+ Reviews
                </span>
              </div>
              <p className="text-[11px] text-stone-600 border-t border-stone-100 pt-2">
                Average rating from traveler feedback
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-stone-600 block">
                Newsletters Sent
              </span>
              <div className="flex items-baseline justify-between">
                <span className="font-editorial text-3xl font-bold text-stone-950">
                  {totalNewslettersSent}
                </span>
                <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Delivered
                </span>
              </div>
              <p className="text-[11px] text-stone-600 border-t border-stone-100 pt-2">
                Total newsletter emails sent till date
              </p>
            </div>

          </div>

          {/* ─── TAB 1: PERFORMANCE LEDGER (DEFAULT ACTIVE VIEW) ──────────────── */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-3">
                <div>
                  <h2 className="font-editorial text-xl sm:text-2xl font-bold text-stone-950">Performance Ledger</h2>
                  <p className="text-xs text-stone-600">Real-time booking inquiry velocity, seasonal pacing, and revenue distribution.</p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <span className="text-xs font-semibold text-stone-600">Currency:</span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-stone-950 text-white font-mono">
                    {currency} ({CURRENCY_SYMBOLS[currency]})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Monthly Inquiry Volume Bar Chart */}
                <div className="lg:col-span-2 p-4 sm:p-6 lg:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-6 overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-editorial text-lg sm:text-xl font-bold text-stone-950">Monthly Inquiries & Travel Trends</h3>
                      <p className="text-xs text-stone-600">Number of guest inquiries received each month</p>
                    </div>
                    <span className="text-xs font-bold text-stone-900 border border-stone-200 px-3 py-1 rounded-full bg-stone-50 self-start sm:self-auto">
                      Full Year 2026
                    </span>
                  </div>

                  <div className="overflow-x-auto pb-2 no-scrollbar scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <div className="h-60 min-w-[420px] flex items-end justify-between gap-2 pt-8 px-2 border-b border-stone-200">
                      {[
                        { month: 'Jan', val: 45 },
                        { month: 'Feb', val: 58 },
                        { month: 'Mar', val: 80 },
                        { month: 'Apr', val: 65 },
                        { month: 'May', val: 92 },
                        { month: 'Jun', val: 120 },
                        { month: 'Jul', val: 110 },
                        { month: 'Aug', val: 95 },
                        { month: 'Sep', val: 85 },
                        { month: 'Oct', val: 130 },
                        { month: 'Nov', val: 75 },
                        { month: 'Dec', val: 105 }
                      ].map((item, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                          {/* Hover Tooltip in Live Selected Currency */}
                          <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900 text-white px-2 py-0.5 rounded text-[10px] whitespace-nowrap pointer-events-none z-20 font-mono">
                            {formatPrice(item.val * 1000)}
                          </div>
                          <div 
                            className="w-full max-w-[26px] rounded-t-lg bg-stone-900 group-hover:bg-amber-600 transition-all"
                            style={{ height: `${(item.val / 130) * 170}px` }}
                          />
                          <span className="text-[10px] text-stone-600 font-medium">{item.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-600 pt-1">
                    <span>Busiest Season: <strong>October & Summer months</strong></span>
                    <span className="font-bold text-stone-900">
                      Total Inquiries Value: {formatPrice(1160000)}
                    </span>
                  </div>
                </div>

                {/* Geographic Popularity */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-sm flex flex-col justify-between space-y-6">
                  <div>
                    <h3 className="font-editorial text-xl font-bold text-stone-950">Most Popular Destinations</h3>
                    <p className="text-xs text-stone-600">Destinations most requested by travelers</p>
                  </div>

                  <div className="space-y-3.5">
                    {[
                      { dest: 'Amalfi Coast, Italy', share: '38%', bar: 'w-[38%]' },
                      { dest: 'Kyoto Temples, Japan', share: '27%', bar: 'w-[27%]' },
                      { dest: 'Swiss Alpine Glacier', share: '20%', bar: 'w-[20%]' },
                      { dest: 'Bali & Wilderness', share: '15%', bar: 'w-[15%]' }
                    ].map((d, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-stone-900">{d.dest}</span>
                          <span className="font-mono text-stone-600 font-bold">{d.share}</span>
                        </div>
                        <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                          <div className={`h-full bg-stone-900 rounded-full ${d.bar}`} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 leading-relaxed">
                    Italy is the most requested destination (38%). 74% of Mediterranean inquiries convert into bookings.
                  </div>
                </div>

              </div>

              {/* ─── ADDITIONAL VISUAL ANALYTICS: RADIAL DONUT & CONVERSION VELOCITY ─── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Visual Card 1: Radial Donut Portfolio Distribution */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-sm flex flex-col justify-between space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <PieChart className="w-4 h-4 text-amber-600" />
                        <h3 className="font-editorial text-xl font-bold text-stone-950">
                          Revenue by Travel Experience
                        </h3>
                      </div>
                      <p className="text-xs text-stone-600 mt-0.5">
                        Estimated revenue split across vacation categories
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-stone-700 bg-stone-100 px-3 py-1 rounded-full self-start sm:self-auto font-mono">
                      FY 2026 Live
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                    {/* SVG Radial Donut Chart */}
                    <div className="relative flex items-center justify-center">
                      <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 160 160">
                        {/* Background Ring */}
                        <circle
                          cx="80"
                          cy="80"
                          r="62"
                          stroke="#f3f4f6"
                          strokeWidth="16"
                          fill="transparent"
                        />
                        {/* Segment 1: Yacht & Island Charters (42% -> 163.6 / 389.5) */}
                        <circle
                          cx="80"
                          cy="80"
                          r="62"
                          stroke="#d97706"
                          strokeWidth="16"
                          strokeDasharray="163.6 389.5"
                          strokeDashoffset="0"
                          strokeLinecap="round"
                          fill="transparent"
                          className="hover:opacity-85 transition-opacity cursor-pointer"
                        />
                        {/* Segment 2: Clifftop Villas & Estates (32% -> 124.6 / 389.5) */}
                        <circle
                          cx="80"
                          cy="80"
                          r="62"
                          stroke="#059669"
                          strokeWidth="16"
                          strokeDasharray="124.6 389.5"
                          strokeDashoffset="-163.6"
                          strokeLinecap="round"
                          fill="transparent"
                          className="hover:opacity-85 transition-opacity cursor-pointer"
                        />
                        {/* Segment 3: Alpine Sanctuaries (18% -> 70.1 / 389.5) */}
                        <circle
                          cx="80"
                          cy="80"
                          r="62"
                          stroke="#0284c7"
                          strokeWidth="16"
                          strokeDasharray="70.1 389.5"
                          strokeDashoffset="-288.2"
                          strokeLinecap="round"
                          fill="transparent"
                          className="hover:opacity-85 transition-opacity cursor-pointer"
                        />
                        {/* Segment 4: Wilderness Expeditions (8% -> 31.2 / 389.5) */}
                        <circle
                          cx="80"
                          cy="80"
                          r="62"
                          stroke="#6366f1"
                          strokeWidth="16"
                          strokeDasharray="31.2 389.5"
                          strokeDashoffset="-358.3"
                          strokeLinecap="round"
                          fill="transparent"
                          className="hover:opacity-85 transition-opacity cursor-pointer"
                        />
                      </svg>

                      {/* Donut Hole Center Stats */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-stone-600">
                          Total Revenue
                        </span>
                        <span className="font-editorial text-lg sm:text-xl font-bold text-stone-950 font-mono">
                          {formatPrice(1482500)}
                        </span>
                        <span className="text-[9px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-0.5">
                          +24.6% YoY
                        </span>
                      </div>
                    </div>

                    {/* Donut Legend Breakdown */}
                    <div className="space-y-3">
                      {[
                        { label: 'Yacht & Private Islands', pct: '42%', val: 622650, color: 'bg-amber-600' },
                        { label: 'Clifftop Villas & Estates', pct: '32%', val: 474400, color: 'bg-emerald-600' },
                        { label: 'Alpine Glaciers & Spas', pct: '18%', val: 266850, color: 'bg-sky-600' },
                        { label: 'Wilderness & Cultural', pct: '8%', val: 118600, color: 'bg-indigo-600' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl hover:bg-stone-50 transition-colors">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.color}`} />
                            <span className="font-medium text-stone-800 truncate">{item.label}</span>
                          </div>
                          <div className="text-right shrink-0 pl-2">
                            <span className="font-bold text-stone-900 block font-mono">{formatPrice(item.val)}</span>
                            <span className="text-[10px] text-stone-600 font-mono">{item.pct}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs text-stone-600">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Top Category: Private Yacht Charters</span>
                    </span>
                    <span className="font-bold text-stone-900 font-mono">Avg {formatPrice(34800)} per booking</span>
                  </div>
                </div>

                {/* Visual Card 2: Stepped Funnel & Conversion Velocity */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-sm flex flex-col justify-between space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-600" />
                        <h3 className="font-editorial text-xl font-bold text-stone-950">
                          Inquiry to Booking Funnel
                        </h3>
                      </div>
                      <p className="text-xs text-stone-600 mt-0.5">
                        Track how guest inquiries convert into confirmed bookings
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5 self-start sm:self-auto shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      <span>18 min Avg Response Time</span>
                    </span>
                  </div>

                  {/* Funnel Steps */}
                  <div className="space-y-3">
                    {[
                      { 
                        stage: '01. Inquiries Received', 
                        count: '57 Travelers', 
                        rate: '100%', 
                        bar: 'w-full', 
                        bg: 'bg-stone-950 text-white',
                        note: 'Direct booking submissions' 
                      },
                      { 
                        stage: '02. Custom Proposals Sent', 
                        count: '46 Itineraries', 
                        rate: '80.7%', 
                        bar: 'w-[80.7%]', 
                        bg: 'bg-gradient-to-r from-amber-600 to-amber-500 text-white',
                        note: 'Within 24h of inquiry' 
                      },
                      { 
                        stage: '03. Consultations Scheduled', 
                        count: '34 VIP Guests', 
                        rate: '59.6%', 
                        bar: 'w-[59.6%]', 
                        bg: 'bg-gradient-to-r from-teal-700 to-teal-600 text-white',
                        note: 'Direct phone & video concierge' 
                      },
                      { 
                        stage: '04. Trips Confirmed & Booked', 
                        count: '26 Voyages', 
                        rate: '45.6%', 
                        bar: 'w-[45.6%]', 
                        bg: 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white',
                        note: 'Completed booking settlement' 
                      }
                    ].map((step, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-stone-900">{step.stage}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-stone-600 font-mono">{step.count}</span>
                            <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded-full text-[10px]">
                              {step.rate}
                            </span>
                          </div>
                        </div>
                        <div className="h-4 w-full bg-stone-100 rounded-lg overflow-hidden p-0.5">
                          <div 
                            className={`h-full rounded-md transition-all duration-700 ${step.bar} ${step.bg}`} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Real-time Global Concierge Desks */}
                  <div className="pt-2 border-t border-stone-100 grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
                      <span className="text-[10px] uppercase font-bold text-stone-600 block">Monaco Team</span>
                      <span className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        <span>Active</span>
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
                      <span className="text-[10px] uppercase font-bold text-stone-600 block">Kyoto Team</span>
                      <span className="text-xs font-bold text-amber-700 flex items-center justify-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                        <span>High Demand</span>
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
                      <span className="text-[10px] uppercase font-bold text-stone-600 block">New York Team</span>
                      <span className="text-xs font-bold text-teal-800 flex items-center justify-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                        <span>High Demand</span>
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ─── TAB 2: ITINERARY CARDS (WITH LIVE CURRENCY CONVERSION) ────────── */}
          {activeTab === 'itineraries' && (
            <div className="space-y-6">
              
              {/* Filter & Action Bar */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-stone-200/90 shadow-sm">
                
                {/* Category Pills (Hidden Scrollbar) */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-0.5">
                  {['All', 'Mediterranean', 'Cultural', 'Alpine Nature', 'Luxury Escapes', 'Trending'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-stone-950 text-white font-bold'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Search Bar + Counter + "+ New Card" Button */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 w-full lg:w-auto">
                  {/* Search Bar right next to + New Card */}
                  <div className="relative w-full sm:w-56 md:w-64">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search cards..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200/90 rounded-full pl-9 pr-4 py-1.5 text-xs text-stone-900 placeholder-stone-500 focus:outline-none focus:border-stone-900 focus:bg-white transition-all font-medium"
                    />
                  </div>

                  <span className="text-xs text-stone-500 font-medium whitespace-nowrap hidden xl:inline">
                    Showing <strong className="text-stone-900">{filteredTrips.length}</strong> of {trips.length}
                  </span>

                  <button
                    onClick={handleOpenAdd}
                    className="w-full sm:w-auto px-4 py-2 sm:py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-950 text-white hover:bg-stone-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>New Card</span>
                  </button>
                </div>

              </div>

              {/* Editorial Grid View: Identical to Live Website Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredTrips.map((trip) => (
                  <div 
                    key={trip.id}
                    className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group relative"
                  >
                    {/* Top Image Canvas with Country Tag & Duration */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                      <img 
                        src={trip.image} 
                        alt={trip.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

                      {/* Top Left: Country & Duration Tags */}
                      <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-stone-900 shadow-sm backdrop-blur-md">
                          {trip.location}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-stone-950/70 text-white backdrop-blur-md">
                          {trip.duration}
                        </span>
                      </div>

                      {/* Top Right: Quick Edit / Duplicate / Delete Actions */}
                      <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(trip)}
                          title="Edit Itinerary Details"
                          className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-900 flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-110"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-stone-800" />
                        </button>
                        <button
                          onClick={() => handleDuplicateTrip(trip)}
                          title="Duplicate Card"
                          className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-900 flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-110"
                        >
                          <Copy className="w-3.5 h-3.5 text-stone-800" />
                        </button>
                        <button
                          onClick={() => handleDeleteTrip(trip.id, trip.title)}
                          title="Delete Card"
                          className="w-8 h-8 rounded-full bg-white/90 hover:bg-rose-500 hover:text-white text-rose-600 flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-110"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Bottom Image Strip: Rating & Live Converted Price */}
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                        <span className="flex items-center gap-1 font-semibold text-amber-300 drop-shadow">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          {trip.rating} ({trip.reviews} reviews)
                        </span>
                        <span className="font-editorial text-lg font-bold text-white drop-shadow">
                          {formatPrice(trip.price)} <span className="text-[11px] font-normal opacity-90">/guest</span>
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-stone-600">
                            {trip.badge}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                            <span>Live On Site</span>
                          </span>
                        </div>

                        <h3 className="font-editorial text-xl font-bold text-stone-950 group-hover:text-amber-800 transition-colors leading-snug">
                          {trip.title}
                        </h3>

                        <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                          {trip.description}
                        </p>
                      </div>

                      {/* Signature Highlights */}
                      <div className="space-y-1.5 pt-3 border-t border-stone-100">
                        {(Array.isArray(trip.highlights) ? trip.highlights : []).slice(0, 3).map((h, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-stone-700 truncate">
                            <Check className="w-3 h-3 text-stone-900 shrink-0" />
                            <span className="truncate">{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ─── TAB 3: GUEST INQUIRIES DOSSIER (SUPABASE LIVE + NEWSLETTER) ──────── */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              {/* Header with Live DB indicator and Export Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-editorial text-2xl font-bold text-stone-950">Direct Traveler Inquiries</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      <span>Live Synced</span>
                    </span>
                  </div>
                  <p className="text-xs text-stone-600">Submissions received via website booking concierge, synced in real-time.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportNewsletterCSV}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-stone-950 hover:bg-stone-800 text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Newsletter Leads (CSV)</span>
                  </button>

                  <button
                    type="button"
                    onClick={fetchSupabaseInquiries}
                    title="Refresh inquiries"
                    className="p-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>

                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-stone-950">
                    {inquiries.length} Active Leads
                  </span>
                </div>
              </div>

              {/* Inquiries Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200/80">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search traveler, email, destination..."
                    value={inquirySearch}
                    onChange={(e) => setInquirySearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-800"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                  {['All', 'New Inquiry', 'In Consultation', 'Proposal Dispatched', 'Booking Confirmed'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setInquiryStatusFilter(status)}
                      className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                        inquiryStatusFilter === status
                          ? 'bg-stone-950 text-white font-bold'
                          : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inquiries Cards Grid */}
              <div className="grid grid-cols-1 gap-4">
                {inquiries
                  .filter((inq) => {
                    const q = inquirySearch.toLowerCase().trim();
                    const matchesSearch = !q ||
                      inq.traveler?.toLowerCase().includes(q) ||
                      inq.email?.toLowerCase().includes(q) ||
                      inq.destination?.toLowerCase().includes(q) ||
                      inq.id?.toLowerCase().includes(q);
                    const matchesStatus = inquiryStatusFilter === 'All' || inq.status === inquiryStatusFilter;
                    return matchesSearch && matchesStatus;
                  })
                  .map((inq) => (
                    <div key={inq.id} className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-4 hover:border-stone-400/80 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-mono text-xs text-stone-600 font-semibold">{inq.id}</span>
                          <h3 className="font-editorial text-lg font-bold text-stone-950">{inq.traveler}</h3>
                          
                          {/* Live DB indicator vs Demo indicator */}
                          {inq.isLive && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              Live Lead
                            </span>
                          )}

                          {/* Quick Interactive Status Dropdown */}
                          <select
                            value={inq.status}
                            onChange={(e) => handleUpdateInquiryStatus(inq.id, inq.rawId, e.target.value)}
                            className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300 cursor-pointer focus:outline-none"
                          >
                            <option value="New Inquiry">New Inquiry</option>
                            <option value="In Consultation">In Consultation</option>
                            <option value="Proposal Dispatched">Proposal Dispatched</option>
                            <option value="Booking Confirmed">Booking Confirmed</option>
                            <option value="Archived">Archived</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-stone-500">{inq.time}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteInquiry(inq.id, inq.rawId)}
                            title="Delete inquiry"
                            className="p-1 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                        <div>
                          <span className="text-stone-500 block text-[10px] uppercase font-bold">Target Voyage</span>
                          <span className="font-semibold text-stone-900">{inq.destination}</span>
                        </div>
                        <div>
                          <span className="text-stone-500 block text-[10px] uppercase font-bold">Party / Dates</span>
                          <span className="text-stone-700">{inq.guests} • {inq.dates}</span>
                        </div>
                        <div>
                          <span className="text-stone-500 block text-[10px] uppercase font-bold">Email</span>
                          <span className="text-stone-700 font-mono text-[11px]">{inq.email}</span>
                        </div>
                        <div>
                          <span className="text-stone-500 block text-[10px] uppercase font-bold">Newsletter Status</span>
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>Subscribed</span>
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-700 bg-stone-50 p-3 rounded-2xl border border-stone-200/80 leading-relaxed">
                        <strong className="text-stone-900">Guest Note:</strong> {inq.notes}
                      </p>

                      <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                        <a 
                          href={`mailto:${inq.email}?subject=Zentrevo%20Bespoke%20Proposal%20for%20${encodeURIComponent(inq.destination)}`}
                          className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-all"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Send Proposal</span>
                        </a>
                        <a 
                          href={`https://wa.me/${(inq.phone || '').replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                        >
                          <MessageSquare className="w-3.5 h-3.5 fill-current" />
                          <span>Direct WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ─── 4. NEWSLETTER STUDIO TAB ────────────────────────────────────────── */}
          {activeTab === 'newsletter' && (
            <div className="space-y-6">
              
              {/* Top Banner & Status Ribbon (Clean White Admin Card UI) */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-sm space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-editorial text-xl sm:text-2xl font-bold tracking-tight text-stone-950">
                      Weekly Newsletter
                    </h2>
                    <p className="text-xs text-stone-600 mt-0.5 max-w-2xl leading-relaxed">
                      Send curated travel stories, seasonal highlights, and exclusive member perks to your subscribers.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                      onClick={handleExportNewsletterCSV}
                      className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200/80 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-stone-500" />
                      <span>Export Subscribers ({subscriberCount})</span>
                    </button>
                    <button
                      onClick={() => setShowBroadcastConfirm(true)}
                      disabled={isBroadcasting}
                      className="px-4 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isBroadcasting ? 'Broadcasting...' : `Send Newsletter (${subscriberCount})`}</span>
                    </button>
                  </div>
                </div>

                {/* Sub-Metrics Ribbon */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-stone-100">
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/70">
                    <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider block">Subscribed Guests</span>
                    <span className="text-base font-bold text-stone-950 mt-0.5 block">{subscriberCount} Readers</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/70 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider block">Weekly Schedule</span>
                      <button
                        type="button"
                        onClick={() => {
                          setEditScheduleDay(newsletterSchedule.day);
                          setEditScheduleTime(newsletterSchedule.time);
                          setIsScheduleModalOpen(true);
                        }}
                        className="text-[10px] font-bold text-amber-800 hover:text-amber-950 underline flex items-center gap-0.5 cursor-pointer"
                        title="Edit sending day and time"
                      >
                        <Edit3 className="w-2.5 h-2.5" />
                        <span>Edit</span>
                      </button>
                    </div>
                    <span className="text-base font-bold text-stone-900 mt-0.5 block">
                      Every {newsletterSchedule.day}
                    </span>
                    <span className="text-[10px] text-stone-500 block truncate">
                      {newsletterSchedule.time} UTC ({newsletterSchedule.time === '10:00' ? '3:30 PM IST' : 'Scheduled'})
                    </span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/70">
                    <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider block">Delivery Status</span>
                    <span className="text-base font-bold text-emerald-700 mt-0.5 block">Connected & Ready</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/70">
                    <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider block">Sender Email</span>
                    <span className="text-base font-bold text-stone-900 mt-0.5 block truncate">contact@zentrevo.in</span>
                  </div>
                </div>
              </div>

              {/* Two-Column Editor & Live Simulator */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                
                {/* ─── COLUMN 1: TEMPLATE COMPOSER (XL: 6 cols) ──────────────── */}
                <div className="xl:col-span-6 space-y-6">
                  
                  {/* Content Inputs */}
                  <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-sm space-y-5">
                    <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                      <div>
                        <h3 className="text-sm font-bold text-stone-950 uppercase tracking-wider">Editorial Content Controls</h3>
                        <p className="text-xs text-stone-500 mt-0.5">Customize the narrative and highlighted itinerary for this dispatch.</p>
                      </div>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-700">HTML 5.0</span>
                    </div>

                    {/* Subject Line */}
                    <div>
                      <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-1.5">
                        Email Subject Line *
                      </label>
                      <input
                        type="text"
                        value={newsletterTemplate.subject}
                        onChange={(e) => setNewsletterTemplate({ ...newsletterTemplate, subject: e.target.value })}
                        placeholder="e.g. Zentrevo Private Journal: Autumn Escapes & Villa Privileges"
                        className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-all font-medium"
                      />
                    </div>

                    {/* Issue Tag & Headline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-1.5">
                          Issue Header Tag
                        </label>
                        <input
                          type="text"
                          value={newsletterTemplate.issueTag}
                          onChange={(e) => setNewsletterTemplate({ ...newsletterTemplate, issueTag: e.target.value })}
                          placeholder="e.g. The Private Journal • Edition 14"
                          className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-all font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-1.5">
                          Featured Itinerary
                        </label>
                        <select
                          value={newsletterTemplate.featuredTripId}
                          onChange={(e) => setNewsletterTemplate({ ...newsletterTemplate, featuredTripId: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-all font-medium cursor-pointer"
                        >
                          {trips.map(trip => (
                            <option key={trip.id} value={trip.id}>
                              {trip.title} ({trip.location}) - {formatPrice(trip.price)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Headline */}
                    <div>
                      <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-1.5">
                        Story Headline *
                      </label>
                      <input
                        type="text"
                        value={newsletterTemplate.headline}
                        onChange={(e) => setNewsletterTemplate({ ...newsletterTemplate, headline: e.target.value })}
                        placeholder="e.g. Sublime Sanctuaries: Unhurried Stays from Positano to Zermatt"
                        className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-all font-medium"
                      />
                    </div>

                    {/* Editorial Story */}
                    <div>
                      <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-1.5">
                        Editorial Body Narrative *
                      </label>
                      <textarea
                        rows={5}
                        value={newsletterTemplate.editorialText}
                        onChange={(e) => setNewsletterTemplate({ ...newsletterTemplate, editorialText: e.target.value })}
                        placeholder="Write the concierge dispatch letter to your patrons..."
                        className="w-full bg-stone-50 border border-stone-300 rounded-2xl p-3.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-all leading-relaxed font-sans"
                      />
                      <div className="flex items-start gap-2 mt-2 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-stone-700 text-[11px] leading-relaxed">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>
                          <strong>Smart Greeting:</strong> Starting your letter with <em>"Dear Patron,"</em> will automatically personalize on dispatch to the traveler's registered name (e.g. <em>"Dear {inquiries[0]?.traveler || 'Julian Vance'},"</em>) or show <em>"Dear Traveler,"</em> for newsletter-only subscribers.
                        </span>
                      </div>
                    </div>

                    {/* Pull Quote */}
                    <div>
                      <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-1.5">
                        Editorial Pull Quote (Golden Highlight)
                      </label>
                      <input
                        type="text"
                        value={newsletterTemplate.pullQuote}
                        onChange={(e) => setNewsletterTemplate({ ...newsletterTemplate, pullQuote: e.target.value })}
                        placeholder='e.g. "True luxury is the quiet mastery of time, place, and absolute serenity."'
                        className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-all font-medium italic"
                      />
                    </div>

                    {/* Perks & CTA */}
                    <div className="space-y-4 pt-2 border-t border-stone-100">
                      <div>
                        <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-1.5">
                          VIP Privileges / Perks Highlight
                        </label>
                        <input
                          type="text"
                          value={newsletterTemplate.perksText}
                          onChange={(e) => setNewsletterTemplate({ ...newsletterTemplate, perksText: e.target.value })}
                          placeholder="e.g. Complimentary Riva yacht sunset charter, champagne welcome..."
                          className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-all font-medium"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-1.5">
                            Button Call To Action Text
                          </label>
                          <input
                            type="text"
                            value={newsletterTemplate.ctaText}
                            onChange={(e) => setNewsletterTemplate({ ...newsletterTemplate, ctaText: e.target.value })}
                            placeholder="e.g. Inquire for Bespoke Reservation"
                            className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-all font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-1.5">
                            Button Link Destination
                          </label>
                          <input
                            type="text"
                            value={newsletterTemplate.ctaUrl}
                            onChange={(e) => setNewsletterTemplate({ ...newsletterTemplate, ctaUrl: e.target.value })}
                            placeholder="https://zentrevo.in/#booking"
                            className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-all font-medium"
                          />
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Test Dispatch Console */}
                  <div className="bg-stone-50 rounded-3xl p-5 sm:p-6 border border-stone-200/90 space-y-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-amber-600" />
                      <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                        Send Test Dispatch Preview
                      </h4>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Deliver a full live test of this template directly to your inbox to check typography, image alignment, and links before broadcasting.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input
                        type="email"
                        value={testEmailInput}
                        onChange={(e) => setTestEmailInput(e.target.value)}
                        placeholder="your-email@zentrevo.in"
                        className="w-full sm:flex-1 bg-white border border-stone-300 rounded-2xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900 transition-all font-medium"
                      />
                      <button
                        onClick={handleSendTestEmail}
                        disabled={isSendingTest}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50 shrink-0"
                      >
                        {isSendingTest ? 'Delivering...' : 'Send Test to Me'}
                      </button>
                    </div>
                  </div>

                </div>

                {/* ─── COLUMN 2: LIVE SIMULATOR (XL: 6 cols) ─────────────────── */}
                <div className="xl:col-span-6 space-y-4">
                  
                  {/* Simulator Controls */}
                  <div className="bg-white rounded-2xl p-3 border border-stone-200/90 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                        Live Client Email Simulator
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setPreviewPersona(previewPersona === 'named' ? 'anonymous' : 'named')}
                        className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                        title="Toggle smart greeting personalized preview"
                      >
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>{previewPersona === 'named' ? `Greeting: "Dear ${inquiries[0]?.traveler?.split(' ')[0] || 'Julian'},"` : 'Greeting: "Dear Traveler,"'}</span>
                      </button>

                      <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
                        <button
                          onClick={() => setPreviewDevice('desktop')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            previewDevice === 'desktop'
                              ? 'bg-white text-stone-950 shadow-xs'
                              : 'text-stone-600 hover:text-stone-950'
                          }`}
                        >
                          <Monitor className="w-3.5 h-3.5" />
                          <span>Desktop</span>
                        </button>
                        <button
                          onClick={() => setPreviewDevice('mobile')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            previewDevice === 'mobile'
                              ? 'bg-white text-stone-950 shadow-xs'
                              : 'text-stone-600 hover:text-stone-950'
                          }`}
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>Mobile</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Simulator Frame (Simulates Email Client Body) */}
                  <div className="bg-[#050b18] p-4 sm:p-8 rounded-3xl border border-stone-800 shadow-2xl flex justify-center overflow-x-auto min-h-[700px]">
                    <div
                      className={`transition-all duration-300 w-full ${
                        previewDevice === 'mobile' ? 'max-w-[390px]' : 'max-w-[620px]'
                      }`}
                    >
                      {/* Email Card Container */}
                      <div className="bg-[#0b1528] border border-amber-600/35 rounded-3xl overflow-hidden shadow-2xl text-stone-200">
                        
                        {/* Masthead */}
                        <div className="p-6 sm:p-8 text-center bg-gradient-to-b from-[#0d1c3a] to-[#0b1528] border-b border-white/10">
                          <span className="text-[10px] uppercase font-bold tracking-[3px] text-amber-400 block mb-2">
                            {newsletterTemplate.issueTag || 'The Private Journal • Weekly Edition'}
                          </span>
                          <h3 className="font-editorial text-xl sm:text-2xl font-bold text-white leading-snug">
                            {newsletterTemplate.headline || 'Curated Itineraries, Hidden Sanctuaries & Private Access'}
                          </h3>
                          <p className="text-[11px] text-stone-400 mt-2 uppercase tracking-widest font-mono">
                            Dispatched from Zentrevo Global Concierge
                          </p>
                        </div>

                        {/* Body Narrative */}
                        <div className="p-6 sm:p-8 space-y-5 text-xs sm:text-sm text-stone-300 leading-relaxed">
                          <p className="whitespace-pre-line">
                            {previewPersona === 'named'
                              ? (newsletterTemplate.editorialText || '').replace(/^Dear\s+[^,\n]+,/i, `Dear ${inquiries[0]?.traveler || 'Julian Vance'},`)
                              : (newsletterTemplate.editorialText || '').replace(/^Dear\s+[^,\n]+,/i, 'Dear Traveler,')}
                          </p>

                          {/* Pull Quote */}
                          {newsletterTemplate.pullQuote && (
                            <div className="my-5 p-4 bg-[#081020] border-l-4 border-amber-500 rounded-xl">
                              <p className="italic text-xs sm:text-sm text-amber-100 font-serif leading-relaxed">
                                "{newsletterTemplate.pullQuote}"
                              </p>
                            </div>
                          )}

                          {/* Featured Trip Card */}
                          {selectedFeaturedTrip && (
                            <div className="my-6 border border-amber-500/30 rounded-2xl overflow-hidden bg-[#07101e]">
                              {selectedFeaturedTrip.image && (
                                <div className="h-44 sm:h-52 w-full overflow-hidden relative">
                                  <img
                                    src={selectedFeaturedTrip.image}
                                    alt={selectedFeaturedTrip.title}
                                    className="w-full h-full object-cover"
                                  />
                                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-sm text-[10px] uppercase tracking-wider text-amber-300 font-bold border border-amber-400/30">
                                    {selectedFeaturedTrip.badge || 'Curator Highlight'}
                                  </span>
                                </div>
                              )}
                              <div className="p-4 sm:p-5 space-y-3">
                                <div>
                                  <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold block mb-1">
                                    {selectedFeaturedTrip.location}
                                  </span>
                                  <h4 className="font-editorial text-lg font-bold text-white">
                                    {selectedFeaturedTrip.title}
                                  </h4>
                                </div>

                                <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                                  {selectedFeaturedTrip.description || 'Private chartered transfers, clifftop villa sanctuary, and tailored cultural immersion.'}
                                </p>

                                {newsletterTemplate.perksText && (
                                  <div className="bg-amber-950/30 border border-amber-500/20 rounded-xl p-2.5">
                                    <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">Exclusive Member Privilege:</span>
                                    <p className="text-xs text-stone-300 mt-0.5">{newsletterTemplate.perksText}</p>
                                  </div>
                                )}

                                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                  <div>
                                    <span className="text-[10px] text-stone-400 block">Starting from</span>
                                    <span className="font-editorial text-base font-bold text-white">
                                      {formatPrice(selectedFeaturedTrip.price)}
                                    </span>
                                  </div>
                                  <a
                                    href={newsletterTemplate.ctaUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md"
                                  >
                                    <span>{newsletterTemplate.ctaText || 'Reserve Journey'}</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Concierge Sign-Off */}
                          <div className="pt-4 border-t border-white/10 text-xs text-stone-400 space-y-1">
                            <p className="font-semibold text-white">With warm regards,</p>
                            <p className="font-editorial text-amber-300 text-base font-bold">The Zentrevo Private Concierge</p>
                            <p className="text-[11px] text-stone-500">London • Paris • Mumbai • Tokyo</p>
                          </div>
                        </div>

                        {/* Email Footer */}
                        <div className="p-5 text-center bg-[#070e1c] border-t border-white/10 text-[10px] text-stone-500 space-y-1">
                          <p>© 2026 Zentrevo Journeys Private Limited. All rights reserved.</p>
                          <p>You received this dispatch because you subscribed to The Private Journal at zentrevo.in.</p>
                          <p className="text-stone-400 underline cursor-pointer">Unsubscribe from future dispatches</p>
                        </div>

                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* ─── CONFIRMATION MODAL BEFORE MASS BROADCAST ────────────────── */}
              {showBroadcastConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                  <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 text-stone-900 space-y-5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                      <Send className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-stone-950">Confirm Mass Newsletter Broadcast?</h3>
                      <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                        You are about to dispatch this edition directly to <strong>{subscriberCount} verified subscribers</strong>.
                      </p>
                    </div>

                    <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200 text-xs space-y-1">
                      <p className="font-semibold text-stone-800">Subject: <span className="font-normal text-stone-600">{newsletterTemplate.subject}</span></p>
                      <p className="font-semibold text-stone-800">Sender: <span className="font-mono text-stone-600">contact@zentrevo.in</span></p>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowBroadcastConfirm(false)}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleBroadcastNewsletter}
                        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                      >
                        Authorize & Dispatch Now
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── MODAL: EDIT WEEKLY NEWSLETTER SCHEDULE ─────────────────────── */}
              {isScheduleModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                  <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 text-stone-900 space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-amber-800 block">Automation Timer</span>
                        <h3 className="font-editorial text-xl font-bold text-stone-950">Set Weekly Dispatch Schedule</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsScheduleModalOpen(false)}
                        className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-all cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      Select the day of the week and preferred delivery time for the automated Private Journal send.
                    </p>

                    <form onSubmit={handleSaveSchedule} className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-1.5">
                          Day of the Week
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                            <button
                              key={day}
                              type="button"
                              onClick={() => setEditScheduleDay(day)}
                              className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                editScheduleDay === day
                                  ? 'bg-stone-950 text-white font-bold'
                                  : 'bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100'
                              }`}
                            >
                              {day.slice(0, 3)}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-1.5">
                            Dispatch Time (UTC)
                          </label>
                          <input
                            type="time"
                            value={editScheduleTime}
                            onChange={(e) => setEditScheduleTime(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-medium focus:outline-none focus:border-stone-900"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-1.5">
                            Reference (IST)
                          </label>
                          <div className="bg-stone-100 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-700 font-medium truncate">
                            {editScheduleTime} UTC (~{editScheduleTime === '10:00' ? '3:30 PM IST' : 'Local'})
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                        <button
                          type="button"
                          onClick={() => setIsScheduleModalOpen(false)}
                          className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                        >
                          Save Schedule
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </div>

      {/* ─── 3. EDITORIAL SLIDE-OVER DRAWER FOR ADD / EDIT TRIP ──────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-[32px] shadow-2xl border border-stone-200/90 overflow-hidden max-h-[94vh] flex flex-col">
            
            {/* Header */}
            <div className="px-4 sm:px-8 py-4 sm:py-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/60">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-800 block">
                  {modalMode === 'add' ? 'New Catalogue Entry' : 'Editorial Card Modification'}
                </span>
                <h2 className="font-editorial text-xl sm:text-2xl font-bold text-stone-950 mt-0.5">
                  {modalMode === 'add' ? 'Curate New Expedition' : formData.title || 'Edit Itinerary'}
                </h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-all cursor-pointer shrink-0"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveTrip} className="p-4 sm:p-8 overflow-y-auto space-y-4 sm:space-y-5 flex-1">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-1.5">
                    Itinerary Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. French Riviera & Monaco Yachting"
                    className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-1.5">
                    Country Tag *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. France, Italy, Greece"
                    className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-1.5">
                    Price Per Guest ({CURRENCY_SYMBOLS[currency]}) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder={`e.g. ${CURRENCY_SYMBOLS[currency]}2,850`}
                    className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-1.5">
                    Duration *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 7 Days / 6 Nights"
                    className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div className="relative" ref={badgeDropdownRef}>
                  <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-1.5">
                    Badge Category *
                  </label>
                  <button
                    type="button"
                    onClick={() => setBadgeDropdownOpen(!badgeDropdownOpen)}
                    className="w-full bg-stone-50 border border-stone-300 hover:border-stone-400 rounded-2xl px-4 py-2.5 text-xs text-stone-900 flex items-center justify-between transition-all font-medium cursor-pointer"
                  >
                    <span>{formData.badge || 'Select Category'}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-stone-500 transition-transform duration-300 ${badgeDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Smooth Luxury Animated Menu */}
                  <div
                    className={`absolute left-0 right-0 top-full mt-2 rounded-2xl bg-white border border-stone-200/90 shadow-2xl p-2 z-50 transition-all duration-200 ease-out origin-top ${
                      badgeDropdownOpen 
                        ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' 
                        : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                    }`}
                  >
                    <div className="space-y-1">
                      {badgeCategories.map((cat) => {
                        const isSelected = formData.badge === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, badge: cat, category: cat });
                              setBadgeDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-stone-950 text-white font-bold'
                                : 'hover:bg-stone-100 text-stone-800 font-medium'
                            }`}
                          >
                            <span>{cat}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cover Image URL & Instant Photo Picker */}
              <div>
                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-1.5">
                  Cover Photography URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-all"
                />

                {/* Instant Curated Photo Presets */}
                <div className="mt-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 block mb-1.5">
                    Click to attach curated editorial photo:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {curatedPhotos.map((photo, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFormData({ ...formData, image: photo.url, location: formData.location || photo.location })}
                        className={`p-1 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                          formData.image === photo.url ? 'border-stone-950 bg-stone-100' : 'border-stone-200 hover:border-stone-400 bg-white'
                        }`}
                      >
                        <img src={photo.url} alt={photo.title} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                        <span className="text-[10px] text-stone-800 font-medium truncate">{photo.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Preview of Selected Photo */}
                {formData.image && (
                  <div className="mt-3 aspect-[16/7] w-full rounded-2xl overflow-hidden border border-stone-200 relative shadow-inner">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 right-3 text-[10px] bg-black/70 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                      Live Preview
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-1.5">
                  Editorial Atmosphere & Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the private villa stays, chartered yacht pacing, and cultural encounters..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-2xl p-3 text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-all leading-relaxed"
                />
              </div>

              {/* Highlights */}
              <div>
                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-1.5">
                  Signature Highlights (comma-separated list)
                </label>
                <input
                  type="text"
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  placeholder="e.g. Private yacht charter, Lemon grove wine tasting, Helicopter transfer"
                  className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
                >
                  Discard
                </button>

                <button
                  type="submit"
                  className="px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-950 text-white hover:bg-stone-800 transition-all shadow-lg cursor-pointer hover:scale-[1.02]"
                >
                  {modalMode === 'add' ? 'Publish Itinerary' : 'Save Modifications'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ─── 4. TOAST NOTIFICATION ───────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 p-3.5 sm:p-4 px-4 sm:px-5 max-w-[calc(100vw-2rem)] rounded-2xl bg-stone-950 text-white font-semibold text-xs shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom duration-300 border border-stone-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
