import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Crown, Compass } from 'lucide-react';
import { askGroqChatbot } from '../services/groqService';

export default function ChatbotWidget({ currentTheme }) {
  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';
  const isEditorial = currentTheme === 'editorial';

  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Chat conversation state
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Welcome to ZENTREVO. I am your private AI Journey Concierge. I can answer any questions about our curated destinations, bespoke itineraries, pricing, and private concierge services. How may I assist your voyage today?"
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Theme-specific persona title & icon
  const getPersonaDetails = () => {
    if (isSapphire) {
      return {
        name: "Imperial Concierge",
        role: "Royal Sovereign Butler & Advisor",
        Icon: Crown,
        tagColor: "bg-amber-400 text-stone-950",
        headerBg: "bg-[#091530] border-amber-500/30",
        aiBubbleBg: "bg-[#0a1838] border-amber-500/20 text-stone-100",
        userBubbleBg: "bg-amber-400 text-stone-950 font-medium",
        sendBtn: "bg-amber-400 hover:bg-amber-300 text-stone-950"
      };
    }
    if (isEmerald) {
      return {
        name: "Eco-Luxe Expedition Guide",
        role: "Sanctuary & Adventure Host",
        Icon: Compass,
        tagColor: "bg-emerald-400 text-stone-950",
        headerBg: "bg-[#0a241d] border-emerald-700/50",
        aiBubbleBg: "bg-[#0d2b23] border-emerald-800/40 text-stone-100",
        userBubbleBg: "bg-emerald-400 text-stone-950 font-medium",
        sendBtn: "bg-emerald-400 hover:bg-emerald-300 text-stone-950"
      };
    }
    return {
      name: "Zentrevo Curator",
      role: "Editorial Travel Specialist",
      Icon: Sparkles,
      tagColor: "bg-stone-900 text-white",
      headerBg: "bg-white border-stone-200",
      aiBubbleBg: "bg-stone-100 border-stone-200 text-stone-900",
      userBubbleBg: "bg-stone-950 text-white font-medium",
      sendBtn: "bg-stone-950 hover:bg-stone-800 text-white"
    };
  };

  const persona = getPersonaDetails();
  const IconComponent = persona.Icon;

  const handleSendMessage = async (customQuery = null) => {
    const textToSend = customQuery || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const newMessages = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await askGroqChatbot(newMessages);
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I apologize, but I could not connect with our concierge servers at this moment. Please call our team at +91 86199 28710 or email contact@zentrevo.in."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "What destinations do you offer?",
    "How much is the Swiss Glacier Express?",
    "How do I book a custom trip?",
    "What are your official contact details?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Trigger Button with Theme-Adaptive Icon */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`group relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer border ${
            isSapphire
              ? 'bg-[#0a142c] border-amber-500/40 text-amber-400 shadow-blue-950/80 hover:shadow-amber-500/30'
              : isEmerald
                ? 'bg-[#0d2b23] border-emerald-600/50 text-emerald-300 shadow-emerald-950/70 hover:shadow-emerald-500/30'
                : 'bg-white border-stone-300 text-stone-900 shadow-xl hover:shadow-stone-400/50'
          }`}
          aria-label="Open Zentrevo AI Concierge"
          title={`Chat with ${persona.name}`}
        >
          {/* Theme-Adaptive Icon */}
          <IconComponent className="w-6 h-6 transition-transform group-hover:rotate-12 duration-300 relative z-10" />

          {/* Active status pip */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-stone-900" />
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className={`w-[92vw] sm:w-[390px] h-[460px] max-h-[72vh] rounded-3xl shadow-2xl border flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 ${
          isSapphire
            ? 'bg-[#060d1c] border-amber-500/35 text-stone-100 shadow-blue-950/80'
            : isEmerald
              ? 'bg-[#081f18] border-emerald-800/60 text-stone-100 shadow-emerald-950/70'
              : 'bg-white border-stone-200 text-stone-900 shadow-stone-300/80'
        }`}>
          
          {/* Header */}
          <div className={`p-4 border-b flex items-center justify-between shrink-0 ${persona.headerBg}`}>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${persona.tagColor}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold tracking-wide">{persona.name}</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                    Online
                  </span>
                </div>
                <p className="text-[11px] opacity-70">{persona.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 text-stone-400 hover:text-stone-100 transition-colors cursor-pointer"
                aria-label="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Message Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl whitespace-pre-line leading-relaxed shadow-sm border ${
                    msg.role === 'user'
                      ? `${persona.userBubbleBg} rounded-tr-sm`
                      : `${persona.aiBubbleBg} rounded-tl-sm`
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-stone-400 text-xs pt-1">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>{persona.name} is crafting your response...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 border-t border-stone-200/10 flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className={`px-3 py-1 rounded-full text-[10px] font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                  isSapphire
                    ? 'bg-[#091530] border-amber-500/25 text-stone-300 hover:text-amber-300 hover:border-amber-400'
                    : isEmerald
                      ? 'bg-[#0a241d] border-emerald-700/40 text-stone-300 hover:text-emerald-300 hover:border-emerald-500'
                      : 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200 hover:text-stone-900'
                }`}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Row */}
          <div className={`p-3 border-t shrink-0 ${persona.headerBg}`}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Ask ${persona.name} anything about Zentrevo...`}
                disabled={isLoading}
                className={`flex-1 px-4 py-2.5 rounded-2xl text-xs border focus:outline-none transition-all ${
                  isSapphire
                    ? 'bg-[#060d1c] border-slate-700 text-white focus:border-amber-400'
                    : isEmerald
                      ? 'bg-[#061813] border-emerald-800 text-white focus:border-emerald-400'
                      : 'bg-stone-100 border-stone-300 text-stone-900 focus:border-stone-800'
                }`}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${persona.sendBtn}`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
}
