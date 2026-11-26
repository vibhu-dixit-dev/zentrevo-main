export const DEFAULT_CATEGORIES = [
  'Mediterranean',
  'Cultural',
  'Alpine Nature',
  'Luxury Escapes',
  'Trending',
  'Honeymoon',
  'Family Holidays',
  'Adventure',
  'Beach & Islands',
  'Wildlife & Safari',
  'Spiritual & Heritage',
  'Budget Friendly',
  'Group Tours',
  'Weekend Getaways',
  'Visa-Free / Easy Visa'
];

export const CATEGORY_COLORS = {
  'Mediterranean': 'bg-sky-900/90 text-sky-200 border border-sky-700/40',
  'Cultural': 'bg-stone-900/90 text-stone-200 border border-stone-700/40',
  'Alpine Nature': 'bg-emerald-950/90 text-emerald-200 border border-emerald-800/40',
  'Luxury Escapes': 'bg-amber-950/90 text-amber-200 border border-amber-800/40',
  'Trending': 'bg-purple-950/90 text-purple-200 border border-purple-800/40',
  'Honeymoon': 'bg-rose-950/90 text-rose-200 border border-rose-800/40',
  'Family Holidays': 'bg-indigo-950/90 text-indigo-200 border border-indigo-800/40',
  'Adventure': 'bg-orange-950/90 text-orange-200 border border-orange-800/40',
  'Beach & Islands': 'bg-cyan-950/90 text-cyan-200 border border-cyan-800/40',
  'Wildlife & Safari': 'bg-lime-950/90 text-lime-200 border border-lime-800/40',
  'Spiritual & Heritage': 'bg-amber-900/90 text-amber-100 border border-amber-700/40',
  'Budget Friendly': 'bg-teal-950/90 text-teal-200 border border-teal-800/40',
  'Group Tours': 'bg-blue-950/90 text-blue-200 border border-blue-800/40',
  'Weekend Getaways': 'bg-yellow-950/90 text-yellow-200 border border-yellow-800/40',
  'Visa-Free / Easy Visa': 'bg-emerald-900/90 text-emerald-100 border border-emerald-700/40'
};

const STORAGE_KEY = 'zentrevo_package_categories';

export function getActiveCategories() {
  if (typeof window === 'undefined') return [...DEFAULT_CATEGORIES];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return [...DEFAULT_CATEGORIES];
}

export async function saveActiveCategories(categories) {
  if (!Array.isArray(categories) || categories.length === 0) return false;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
      window.dispatchEvent(new CustomEvent('zentrevo_categories_updated', { detail: categories }));
    } catch {}
  }

  // Persist to cloud via /api/categories
  try {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categories })
    });
    return res.ok;
  } catch (err) {
    console.warn('Notice: categories saved locally; cloud sync failed:', err);
    return false;
  }
}

export async function syncCategoriesFromCloud() {
  if (typeof window === 'undefined') return getActiveCategories();
  try {
    const res = await fetch('/api/categories', { cache: 'no-store' });
    if (!res.ok) return getActiveCategories();
    const data = await res.json();
    if (data?.success && Array.isArray(data.categories) && data.categories.length > 0) {
      const serialized = JSON.stringify(data.categories);
      const current = localStorage.getItem(STORAGE_KEY);
      if (serialized !== current) {
        localStorage.setItem(STORAGE_KEY, serialized);
        window.dispatchEvent(new CustomEvent('zentrevo_categories_updated', { detail: data.categories }));
      }
      return data.categories;
    }
  } catch (err) {
    console.warn('Could not sync categories from cloud:', err);
  }
  return getActiveCategories();
}
