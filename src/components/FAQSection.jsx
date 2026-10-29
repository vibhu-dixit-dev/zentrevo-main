import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';

export default function FAQSection({ currentTheme, onOpenInquiry }) {
  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';
  const isEditorial = currentTheme === 'editorial';

  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "How does Zentrevo plan custom trips from India?",
      a: "Tell us when, where, and how you like to travel. A real travel planner builds your trip, itemizes clear prices with no surprises, guides your visa step-by-step, and stays with you on WhatsApp until you're safely home. You receive your tailored itinerary and quote within 24 hours."
    },
    {
      q: "Do you guarantee visa approval for Indian passport holders?",
      a: "Visa guidance and document support. The embassy decides approval. We provide document checklists, appointment scheduling guidance, and confirmed travel vouchers in good faith, but we never promise or guarantee visa issuance. Sovereign embassies and consulates alone decide approvals."
    },
    {
      q: "Are prices in Indian Rupees (₹) or US Dollars ($), and what is included?",
      a: "Yes. For travelers in India, our itineraries display transparent pricing in Indian Rupees (₹) per person. For travelers in the US and globally, rates automatically display in US Dollars ($), and you can switch currencies anytime from the top navigation bar. Each itinerary clearly itemizes accommodations, private transfers, daily breakfasts, curated excursions, and 24/7 on-ground concierge support with zero hidden charges."
    },
    {
      q: "Which destinations does Zentrevo specialize in?",
      a: "We curate custom trips from India for Bali, Japan, Switzerland, Italy, Turkey, and Kerala, alongside domestic high-altitude expeditions in Ladakh, Mewar royal retreats in Udaipur, and Kashmir cedar houseboats."
    },
    {
      q: "What is Zentrevo's cancellation and refund policy?",
      a: "Cancellations made 30 or more days prior to travel receive up to an 85% to 90% refund (minus committed third-party flight and hotel non-recoverable booking costs). Approved refunds are returned to your original payment method within 7 to 10 business days."
    }
  ];

  return (
    <section id="faq" className="px-4 sm:px-8 py-16 scroll-mt-24">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border border-amber-500/30 bg-amber-400/10 text-amber-400">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>

          <h2 className={`${isEditorial ? 'font-editorial' : 'font-sans'} text-2xl sm:text-4xl font-bold tracking-tight`}>
            Everything You Need to Know Before Booking
          </h2>
          <p className="text-xs sm:text-sm text-stone-400">
            Clear answers on custom planning, visa support, pricing, and our on-ground concierge.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isSapphire
                    ? 'bg-[#081226]/80 border-amber-500/25 text-stone-100'
                    : isEmerald
                      ? 'bg-emerald-950/40 border-emerald-800/40 text-stone-100'
                      : 'bg-white border-stone-200 text-stone-900 shadow-sm'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-sm sm:text-base leading-snug">
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-amber-400 text-stone-950' : 'bg-black/10 dark:bg-white/10'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-0 text-xs sm:text-sm leading-relaxed opacity-85 border-t border-stone-200/10 mt-1">
                    <p className="pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Pill Banner */}
        <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${
          isSapphire
            ? 'bg-[#050b18] border-slate-700/80 text-stone-300'
            : isEmerald
              ? 'bg-emerald-950/80 border-emerald-800/70 text-stone-300'
              : 'bg-stone-50 border-stone-200 text-stone-700'
        }`}>
          <div className="flex items-center gap-2.5 text-center sm:text-left">
            <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Have a unique itinerary question? Talk directly with a travel planner on WhatsApp.</span>
          </div>

          <button
            type="button"
            onClick={onOpenInquiry}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-bold uppercase text-[11px] tracking-wider transition-all cursor-pointer shrink-0 ${
              isSapphire
                ? 'bg-amber-400 text-stone-950 hover:bg-amber-300'
                : isEmerald
                  ? 'bg-emerald-400 text-stone-950 hover:bg-emerald-300'
                  : 'bg-stone-900 text-white hover:bg-stone-800'
            }`}
          >
            <span>Ask a Planner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
