export const DEFAULT_PARTNERS = [
  {
    id: 1001,
    name: 'Taj Hotels',
    tagline: 'Heritage Luxury Stays',
    logo: 'https://logo.clearbit.com/tajhotels.com',
    website: 'https://www.tajhotels.com',
    active: true
  },
  {
    id: 1002,
    name: 'Emirates',
    tagline: 'Premium Global Flights',
    logo: 'https://logo.clearbit.com/emirates.com',
    website: 'https://www.emirates.com',
    active: true
  },
  {
    id: 1003,
    name: 'IndiGo',
    tagline: 'Pan-India Connectivity',
    logo: 'https://logo.clearbit.com/goindigo.in',
    website: 'https://www.goindigo.in',
    active: true
  },
  {
    id: 1004,
    name: 'Booking.com',
    tagline: 'Worldwide Stays Network',
    logo: 'https://logo.clearbit.com/booking.com',
    website: 'https://www.booking.com',
    active: true
  },
  {
    id: 1005,
    name: 'Agoda',
    tagline: 'Asia Stay Partners',
    logo: 'https://logo.clearbit.com/agoda.com',
    website: 'https://www.agoda.com',
    active: true
  },
  {
    id: 1006,
    name: 'Hertz',
    tagline: 'Private Fleet Transfers',
    logo: 'https://logo.clearbit.com/hertz.com',
    website: 'https://www.hertz.com',
    active: true
  },
  {
    id: 1007,
    name: 'MakeMyTrip',
    tagline: 'India Travel Network',
    logo: 'https://logo.clearbit.com/makemytrip.com',
    website: 'https://www.makemytrip.com',
    active: true
  },
  {
    id: 1008,
    name: 'Airbnb',
    tagline: 'Boutique Homes & Villas',
    logo: 'https://logo.clearbit.com/airbnb.com',
    website: 'https://www.airbnb.com',
    active: true
  }
];

const STORAGE_KEY = 'zentrevo_active_partners';
const CLOUD_SYNC_KEY = 'zentrevo_partners_cloud_synced';

export const getActivePartners = () => {
  if (typeof window === 'undefined') return DEFAULT_PARTNERS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Unable to load active partners from localStorage:', e);
  }
  return DEFAULT_PARTNERS;
};

export const syncPartnersFromCloud = async () => {
  if (typeof window === 'undefined') {
    return { synced: false, partners: DEFAULT_PARTNERS };
  }
  try {
    const res = await fetch('/api/partners', { cache: 'no-store' });
    if (!res.ok) {
      return { synced: false, partners: getActivePartners() };
    }
    const data = await res.json();
    if (!data?.success) {
      return { synced: false, partners: getActivePartners() };
    }

    if (Array.isArray(data.partners) && data.partners.length > 0) {
      const serialized = JSON.stringify(data.partners);
      const current = localStorage.getItem(STORAGE_KEY);
      localStorage.setItem(CLOUD_SYNC_KEY, 'true');

      if (current !== serialized) {
        localStorage.setItem(STORAGE_KEY, serialized);
        window.dispatchEvent(new CustomEvent('zentrevo_partners_updated', { detail: data.partners }));
      }
      return {
        synced: true,
        customized: !!data.customized,
        source: data.source,
        partners: data.partners
      };
    }

    if (localStorage.getItem(CLOUD_SYNC_KEY) === 'true' && localStorage.getItem(STORAGE_KEY)) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(CLOUD_SYNC_KEY);
      window.dispatchEvent(new CustomEvent('zentrevo_partners_updated', { detail: DEFAULT_PARTNERS }));
    }

    return {
      synced: true,
      customized: false,
      source: data.source,
      partners: getActivePartners()
    };
  } catch (e) {
    console.warn('Cloud partners sync notice:', e?.message || e);
    return { synced: false, partners: getActivePartners() };
  }
};

export const saveActivePartners = async (newPartners) => {
  if (typeof window === 'undefined') return { localSaved: false, cloudSaved: false };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPartners));
    window.dispatchEvent(new CustomEvent('zentrevo_partners_updated', { detail: newPartners }));
  } catch (e) {
    console.error('Failed to save active partners locally:', e);
  }

  try {
    const res = await fetch('/api/partners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partners: newPartners })
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) {
      try { localStorage.setItem(CLOUD_SYNC_KEY, 'true'); } catch {}
      return { localSaved: true, cloudSaved: true, source: data.source };
    }
    return { localSaved: true, cloudSaved: false, message: data.message };
  } catch (e) {
    console.warn('Cloud partners persist fallback to local cache:', e?.message || e);
    return { localSaved: true, cloudSaved: false, message: e?.message };
  }
};

export const resetActivePartners = async () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(CLOUD_SYNC_KEY);
      window.dispatchEvent(new CustomEvent('zentrevo_partners_updated', { detail: DEFAULT_PARTNERS }));
    } catch {}
  }
  try {
    const res = await fetch('/api/partners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reset' })
    });
    const data = await res.json().catch(() => ({}));
    return { localReset: true, cloudReset: !!(res.ok && data.success), source: data.source };
  } catch (e) {
    return { localReset: true, cloudReset: false, message: e?.message };
  }
};
