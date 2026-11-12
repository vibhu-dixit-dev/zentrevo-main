const TARGET_LANGUAGES = ['en', 'zh', 'es', 'ar'];

async function translateSingleText(text, targetLang) {
  const clean = String(text || '').trim();
  if (!clean) return '';
  const tl = targetLang === 'zh' ? 'zh-CN' : targetLang;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(clean)}`;

  const res = await fetch(url, {
    headers: { 'User-Agent': 'Zentrevo-Translator/1.0' }
  });
  if (!res.ok) return clean;
  const data = await res.json();
  if (Array.isArray(data?.[0])) {
    return data[0].map((part) => part?.[0] || '').join('') || clean;
  }
  return clean;
}

async function translateWithGoogle(trip) {
  const highlights = Array.isArray(trip.highlights) ? trip.highlights : [];
  const entries = {};

  await Promise.all(
    TARGET_LANGUAGES.map(async (lang) => {
      const [title, location, badge, category, duration, description, ...translatedHighlights] =
        await Promise.all([
          translateSingleText(trip.title, lang),
          translateSingleText(trip.location, lang),
          translateSingleText(trip.badge, lang),
          translateSingleText(trip.category, lang),
          translateSingleText(trip.duration, lang),
          translateSingleText(trip.description, lang),
          ...highlights.map((h) => translateSingleText(h, lang))
        ]);

      entries[lang] = {
        title,
        location,
        badge,
        category,
        duration,
        description,
        highlights: translatedHighlights
      };
    })
  );

  return entries;
}

async function translateWithGroq(trip, apiKey) {
  const payload = {
    title: String(trip.title || ''),
    location: String(trip.location || ''),
    badge: String(trip.badge || ''),
    category: String(trip.category || ''),
    duration: String(trip.duration || ''),
    description: String(trip.description || ''),
    highlights: Array.isArray(trip.highlights) ? trip.highlights : []
  };

  const prompt = `Translate this luxury travel itinerary object into English ("en"), Mandarin Chinese ("zh"), Spanish ("es"), and Arabic ("ar"). Keep proper nouns natural and luxury editorial tone. Return ONLY valid JSON with keys "en", "zh", "es", "ar", each containing keys: title, location, badge, category, duration, description, highlights (array of strings).\n\nInput:\n${JSON.stringify(payload)}`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: 'You are a precise JSON translator. Output strict JSON only.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' }
    })
  });

  if (!res.ok) {
    throw new Error(`Groq translation HTTP ${res.status}`);
  }
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  const parsed = JSON.parse(content);
  for (const lang of TARGET_LANGUAGES) {
    if (!parsed?.[lang]?.title) {
      throw new Error(`Incomplete Groq translation for ${lang}`);
    }
  }
  return parsed;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { trip } = req.body || {};
    if (!trip || !trip.title) {
      return res.status(400).json({ success: false, message: 'Valid trip object with title is required.' });
    }

    const groqKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || '';
    let translations = null;

    if (groqKey) {
      try {
        translations = await translateWithGroq(trip, groqKey);
      } catch (groqErr) {
        console.warn('Groq translate fallback to Google Translate:', groqErr.message);
      }
    }

    if (!translations) {
      translations = await translateWithGoogle(trip);
    }

    return res.status(200).json({
      success: true,
      translations
    });
  } catch (err) {
    console.error('Trip translation error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Translation failed.'
    });
  }
}
