import { getActiveDestinations, valuePillars } from '../data/travelData';

function formatPriceNumeric(price) {
  if (typeof price === 'number') return price;
  const parsed = parseInt(String(price || '').replace(/[^0-9]/g, ''), 10);
  return !isNaN(parsed) && parsed > 0 ? parsed : null;
}

// Build live system prompt strictly grounded to current active Zentrevo catalog (including Admin additions)
function buildSystemPrompt() {
  const activeTrips = getActiveDestinations();
  const nationalTrips = activeTrips.filter(t => (t.region || '').toLowerCase() === 'national');
  const internationalTrips = activeTrips.filter(t => (t.region || 'international').toLowerCase() === 'international');

  const formatTripList = (list) =>
    list.map((t, idx) => {
      const highlightsText = Array.isArray(t.highlights) && t.highlights.length > 0
        ? t.highlights.join(', ')
        : t.description || '';
      return `${idx + 1}. ${t.title} (${t.location}) - ${t.price} / guest (${t.duration}) [${t.category}]\n   - Highlights: ${highlightsText}`;
    }).join('\n');

  const pillarsText = valuePillars
    .map(p => `- ${p.title}: ${p.description}`)
    .join('\n');

  return `You are the exclusive AI Concierge for ZENTREVO Travel Co.

CRITICAL INSTRUCTIONS:
1. You represent ZENTREVO, a premier luxury travel and bespoke expedition company based in Gurugram, India.
2. Ground all answers strictly in the live knowledge provided below. NEVER invent prices, itineraries, or facts outside Zentrevo's offerings.
3. If asked about unrelated subjects (such as programming, politics, sports, math, or external companies), politely decline and steer the conversation back to Zentrevo's luxury travel curation.
4. Keep answers elegant, warm, concise, and helpful (2-4 short paragraphs or clean markdown bullet points).

ZENTREVO ESSENTIAL COMPANY FACTS:
- Company Name: ZENTREVO Travel Co.
- Headquarters / Location: Sector 49, Gurugram 122018, India
- Direct Phone & WhatsApp Concierge: +91 86199 28710
- Official Support Email: contact@zentrevo.in
- Hours: 24/7 (All 7 Days, Round the Clock)
- Dedicated Pages:
  * Interactive India Map & National Expeditions: /destinations/national
  * Interactive World Map & Global Expeditions: /destinations/international
  * Visa Guidance for Indian Travelers: /visa-guidance (Note: We provide checklists, document prep & confirmed vouchers; the embassy decides final visa approval.)
  * The Private Journal & Stories: /journal

NATIONAL (INDIA) EXPEDITIONS (${nationalTrips.length} Active):
${nationalTrips.length > 0 ? formatTripList(nationalTrips) : 'Custom private itineraries available across India on request.'}

INTERNATIONAL EXPEDITIONS (${internationalTrips.length} Active):
${internationalTrips.length > 0 ? formatTripList(internationalTrips) : 'Custom private global itineraries available on request.'}

CORE ETHOS & PILLARS:
${pillarsText}
- Booking & Policies: Clear itemized pricing (in INR ₹ or USD $), 24-hour custom quote turnaround, WhatsApp concierge until you're home, flexible cancellation (85–90% refund 30+ days prior minus non-recoverable third-party costs).`;
}

export async function askGroqChatbot(messages, customApiKey = '') {
  // Check API key priority: Custom Input -> LocalStorage -> Vite Environment Variable
  const apiKey = customApiKey || localStorage.getItem('zentrevo_groq_api_key') || import.meta.env.VITE_GROQ_API_KEY || '';
  const latestQuery = messages[messages.length - 1]?.content || '';

  if (!apiKey) {
    return getOfflineKnowledgeResponse(latestQuery);
  }

  try {
    const formattedMessages = [
      { role: 'system', content: buildSystemPrompt() },
      ...messages.slice(-8) // Keep last 8 turns for context window efficiency
    ];

    const candidateModels = ['openai/gpt-oss-20b', 'openai/gpt-oss-120b', 'qwen/qwen3.8-27b', 'llama-3.1-8b-instant'];
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: modelName,
            messages: formattedMessages,
            temperature: 0.4,
            max_tokens: 600
          })
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices[0]?.message?.content;
          if (content) return content;
        } else {
          const errData = await response.json().catch(() => ({}));
          lastError = errData?.error?.message || `HTTP ${response.status}`;
          if (lastError.includes('model') || lastError.includes('does not exist') || lastError.includes('decommissioned')) {
            continue;
          } else {
            throw new Error(lastError);
          }
        }
      } catch (e) {
        lastError = e.message;
        if (!e.message.includes('model') && !e.message.includes('does not exist') && !e.message.includes('decommissioned')) {
          throw e;
        }
      }
    }

    throw new Error(lastError || 'Groq API request failed');
  } catch (error) {
    console.error('Groq Chatbot Error:', error);
    return getOfflineKnowledgeResponse(latestQuery);
  }
}

// Dynamic offline intelligence engine synced directly with active catalog
function getOfflineKnowledgeResponse(userInput) {
  const query = (userInput || '').toLowerCase();
  const activeTrips = getActiveDestinations();
  const nationalTrips = activeTrips.filter(t => (t.region || '').toLowerCase() === 'national');
  const internationalTrips = activeTrips.filter(t => (t.region || 'international').toLowerCase() === 'international');

  // 1. Check if user is asking about a specific destination from the live catalog
  const matchedTrip = activeTrips.find(t => {
    const titleWords = (t.title || '').toLowerCase().split(/[\s&,]+/).filter(w => w.length > 3);
    const locWords = (t.location || '').toLowerCase().split(/[\s,]+/).filter(w => w.length > 2 && w !== 'india');
    return titleWords.some(w => query.includes(w)) || locWords.some(w => query.includes(w));
  });

  if (matchedTrip) {
    const highlightsList = Array.isArray(matchedTrip.highlights) && matchedTrip.highlights.length > 0
      ? matchedTrip.highlights.map(h => `* ${h}`).join('\n')
      : '';
    return `**${matchedTrip.title}** (${matchedTrip.location})
* **Rate**: ${matchedTrip.price} / guest • **Duration**: ${matchedTrip.duration}

${matchedTrip.description}

${highlightsList ? `**Signature Highlights:**\n${highlightsList}\n\n` : ''}Would you like me to help customize this itinerary with your preferred dates?`;
  }

  // 2. National / India-specific inquiry
  if (query.includes('india') || query.includes('national') || query.includes('domestic')) {
    const listText = nationalTrips
      .map(t => `* **${t.title}** (${t.location}) — ${t.price} / guest • ${t.duration}`)
      .join('\n');
    return `Zentrevo currently curates **${nationalTrips.length} National (India) Journeys**, also interactive on our India Map page:

${listText}

Every itinerary includes private transfers, curated luxury stays, and 24/7 WhatsApp concierge support.`;
  }

  // 3. Visa guidance query
  if (query.includes('visa') || query.includes('passport') || query.includes('embassy')) {
    return `We provide dedicated **Visa Guidance & Document Support** for Indian passport holders:

* Step-by-step country checklists & form preparation
* Confirmed flight, villa, and itinerary vouchers for your embassy file
* Appointment scheduling coordination

*Please note: Visa guidance is provided in good faith; the respective embassy or consulate decides final visa approval.*`;
  }

  // 4. All Destinations / Packages query
  if (query.includes('destination') || query.includes('package') || query.includes('where') || query.includes('place') || query.includes('trip')) {
    const intlLines = internationalTrips
      .map(t => `* **${t.title}** (${t.location}) — ${t.price} • ${t.duration}`)
      .join('\n');
    const natLines = nationalTrips
      .map(t => `* **${t.title}** (${t.location}) — ${t.price} • ${t.duration}`)
      .join('\n');

    return `Zentrevo currently offers **${activeTrips.length} curated private itineraries** across our Interactive World & India Maps:

**International (${internationalTrips.length}):**
${intlLines}

**National / India (${nationalTrips.length}):**
${natLines}

Ask me about any specific destination or click **Plan Journey** for a custom 24-hour proposal!`;
  }

  // 5. Dynamic Pricing query
  if (query.includes('price') || query.includes('cost') || query.includes('rate') || query.includes('how much') || query.includes('budget')) {
    const numericPrices = activeTrips.map(t => formatPriceNumeric(t.price)).filter(Boolean);
    const minPrice = numericPrices.length ? `$${Math.min(...numericPrices).toLocaleString()}` : '$1,650';
    const maxPrice = numericPrices.length ? `$${Math.max(...numericPrices).toLocaleString()}` : '$3,400';
    const breakdown = activeTrips
      .map(t => `* **${t.title.split('&')[0].trim()}** (${t.location}): ${t.price} / guest • ${t.duration}`)
      .join('\n');

    return `Our curated private itineraries currently range from **${minPrice} to ${maxPrice} USD per guest** (automatically convertible to INR ₹ on the website):

${breakdown}

All packages feature transparent pricing with zero hidden fees and dedicated WhatsApp concierge support.`;
  }

  // 6. Contact details
  if (query.includes('contact') || query.includes('phone') || query.includes('email') || query.includes('call') || query.includes('address') || query.includes('office') || query.includes('location')) {
    return `You can connect directly with our Senior Journey Curators through:

* **Phone / WhatsApp**: **+91 86199 28710**
* **Support Email**: **contact@zentrevo.in**
* **Headquarters**: **Sector 49, Gurugram 122018**
* **Hours**: **24/7 (All 7 Days)**

You can also submit your travel dates in our booking section for a tailored itinerary quote within 24 hours.`;
  }

  // 7. Booking process
  if (query.includes('book') || query.includes('reserve') || query.includes('how to book') || query.includes('inquiry')) {
    return `Booking with Zentrevo is a seamless 3-step experience:

1. **Share Your Dates & Budget**: Submit your preferences in our inquiry form or message us on WhatsApp (+91 86199 28710).
2. **Bespoke Curation in 24 Hours**: A real travel planner prepares a clear, itemized day-by-day plan and quote.
3. **End-to-End Concierge**: We guide your visa documentation and stay with you on WhatsApp until you're safely home.

Would you like help choosing a destination?`;
  }

  // General welcome response
  return `Welcome to **ZENTREVO Travel Co.** I can help you explore our **${internationalTrips.length} International** and **${nationalTrips.length} National (India)** luxury itineraries, visa guidance, or custom trip planning. Which destination has caught your eye?`;
}
