import { destinations, statistics, valuePillars } from '../data/travelData';

// System prompt grounding the AI strictly to Zentrevo website information
const SYSTEM_PROMPT = `You are the exclusive AI Concierge for ZENTREVO Travel Co.

CRITICAL INSTRUCTIONS:
1. You represent ZENTREVO, a premier luxury travel and bespoke expedition company.
2. Ground all answers strictly in the knowledge provided below. NEVER invent facts outside Zentrevo's offerings.
3. If asked about unrelated subjects (such as programming, politics, sports, math, or external companies), politely and gracefully decline and steer the conversation back to Zentrevo's luxury travel curation.
4. Keep answers elegant, warm, concise, and helpful (2-4 paragraphs maximum, formatted in clean markdown with bullet points when appropriate).

ZENTREVO ESSENTIAL COMPANY FACTS:
- Company Name: ZENTREVO Travel Co.
- Headquarters / Location: Nawa City, Rajasthan, India 341509
- Direct Phone Concierge: +91 86199 28710
- Official Support Email: zentrevo.official@outlook.com
- Hours: 9:00 AM – 8:00 PM EST (7 days a week)
- Experience: Over 25 years of excellence in curating private travel
- Stats: 200+ curated destinations across 48 countries, 20k+ happy adventurers, 98% satisfaction rating

CURATED DESTINATIONS & PACKAGES:
1. Amalfi Coast & Positano Clifftops (Italy) - $2,450 / guest (7 Days / 6 Nights) - Luxury Escapes
   - Private cliffside villa stays, chartered yacht cruises through Capri grottos, lemon grove wine tasting.
2. Kyoto Zen Gardens & Bamboo Groves (Japan) - $3,100 / guest (9 Days / 8 Nights) - Cultural
   - Sunrise meditation with temple monks, private tea ceremony masters, ryokan onsen retreats, kaiseki dining.
3. Swiss Alpine Glacier Express (Switzerland) - $2,890 / guest (6 Days / 5 Nights) - Alpine Nature
   - Panoramic luxury glass rail, Matterhorn helicopter touring, alpine chalets, thermal spa sanctuary.
4. Cappadocia Hot Air Balloon Valley (Turkey) - $1,750 / guest (5 Days / 4 Nights) - Trending
   - VIP sunrise balloon basket flights over fairy chimneys, luxury cave suite with heated plunge pool, Goreme historical guide.
5. Reykjavik & Aurora Borealis Wilderness (Iceland) - $3,400 / guest (8 Days / 7 Nights) - Alpine Nature
   - Super-jeep glacier ice cave descent, private Blue Lagoon retreat, clear-roof northern lights glass cabins.
6. Uluwatu Sunset & Ubud Sanctum (Bali) - $1,980 / guest (7 Days / 6 Nights) - Luxury Escapes
   - Cliffside infinity villas, sacred river wellness sessions, private catamaran sunset sailings.

CORE ETHOS & PILLARS:
- Customer First: Every itinerary tailored with 24/7 dedicated ground concierge.
- Authentic Cultural Depth: Privileged access to private heritage sites and indigenous masters.
- Expert Local Guides: Native certified storytellers and wilderness experts.
- Booking & Inclusions: VIP ground clearance, Tier 1 medical/evac cover, 100% carbon-neutral offset, free cancellation up to 14 days prior to travel.
- Custom Inquiries: Custom proposal dossier prepared within 24 hours of submitting the inquiry form.`;

export async function askGroqChatbot(messages, customApiKey = '') {
  // Check API key priority: Custom Input -> LocalStorage -> Vite Environment Variable
  const apiKey = customApiKey || localStorage.getItem('zentrevo_groq_api_key') || import.meta.env.VITE_GROQ_API_KEY || '';

  if (!apiKey) {
    // Graceful offline fallback with intelligent pre-indexed response
    return getOfflineKnowledgeResponse(messages[messages.length - 1].content);
  }

  try {
    const formattedMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.slice(-8) // Keep last 8 turns for context window efficiency
    ];

    // List of active models for this Groq account
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
          // If model doesn't exist or is decommissioned, try next
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
    // If the API call fails (rate limit or network), fallback gracefully to offline intelligence
    return getOfflineKnowledgeResponse(messages[messages.length - 1].content, error.message);
  }
}

// Fallback intelligence engine when no API key is provided or during network timeouts
function getOfflineKnowledgeResponse(userInput) {
  const query = (userInput || '').toLowerCase();

  if (query.includes('destination') || query.includes('package') || query.includes('where') || query.includes('place')) {
    return `Zentrevo currently offers 6 world-renowned signature luxury itineraries:

* **Amalfi Coast & Positano, Italy** ($2,450 / guest • 7 Days) — Cliffside private villas & Capri yacht charters.
* **Kyoto Temples & Sanctum, Japan** ($3,100 / guest • 9 Days) — Private monk meditation & master tea ceremonies.
* **Swiss Glacier Express, Switzerland** ($2,890 / guest • 6 Days) — First-class panoramic rail & Matterhorn heli-touring.
* **Cappadocia Balloon Valley, Turkey** ($1,750 / guest • 5 Days) — VIP sunrise flight & heated cave suites.
* **Aurora Wilderness, Iceland** ($3,400 / guest • 8 Days) — Blue Lagoon private retreat & northern lights glass cabins.
* **Uluwatu & Ubud, Bali** ($1,980 / guest • 7 Days) — Cliffside infinity villas & sacred jungle healing.

Would you like more details on a specific destination, or shall we arrange a custom proposal?`;
  }

  if (query.includes('price') || query.includes('cost') || query.includes('rate') || query.includes('how much')) {
    return `Our private itineraries range from **$1,750 to $3,400 per guest**, with all private transfers, 5-star accommodations, and 24/7 dedicated ground concierge included:

* **Cappadocia Valley**: $1,750 (5 Days)
* **Bali Luxury Sanctum**: $1,980 (7 Days)
* **Amalfi Coast Villa**: $2,450 (7 Days)
* **Swiss Glacier Rail**: $2,890 (6 Days)
* **Kyoto Heritage**: $3,100 (9 Days)
* **Iceland Aurora Wilderness**: $3,400 (8 Days)

All packages feature flexible cancellation up to 14 days prior to travel.`;
  }

  if (query.includes('contact') || query.includes('phone') || query.includes('email') || query.includes('call') || query.includes('address') || query.includes('office') || query.includes('location')) {
    return `You can connect directly with our Senior Journey Curators through:

* 📞 **Direct Phone / WhatsApp**: **+91 86199 28710**
* ✉️ **Official Support Email**: **zentrevo.official@outlook.com**
* 📍 **Headquarters**: **Nawa City, Rajasthan, India 341509**
* ⏰ **Consultation Hours**: 9:00 AM – 8:00 PM EST (7 days a week)

You can also submit your travel dates in our **"Voyages of Wonder"** section on the site for a full dossier within 24 hours!`;
  }

  if (query.includes('book') || query.includes('reserve') || query.includes('how to book') || query.includes('inquiry')) {
    return `Booking with Zentrevo is a seamless 3-step experience:

1. **Submit Your Vision**: Select your target destination and dates via our booking form or WhatsApp (+91 86199 28710).
2. **Dossier Curation**: A dedicated Senior Journey Curator designs a custom day-by-day proposal within 24 hours.
3. **VIP Hand-off**: All private aviation, villas, VIP airport clearance, and private hosts are locked in.

Would you like me to guide you to the booking section?`;
  }

  // General welcome response
  return `Welcome to **ZENTREVO Travel Co.** I am your private travel concierge. 

I can assist you with:
* In-depth details on our **6 Curated Expeditions** (Amalfi, Kyoto, Switzerland, Cappadocia, Iceland, Bali)
* Custom itinerary planning & pricing
* Instant contact with our team via **+91 86199 28710** or **zentrevo.official@outlook.com**

How may I assist your next journey today?`;
}
