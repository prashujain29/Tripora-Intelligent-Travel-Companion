import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Compass,
  ArrowRight,
  Shield,
  Layers,
  ChevronRight
} from 'lucide-react';
import { ChatMessage, Trip, SuggestedAction } from '../types';
import { api } from '../services/api';

export const AssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>('trip-amalfi-01');
  const [isSending, setIsSending] = useState(false);
  const [appliedActionMessage, setAppliedActionMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'Make my itinerary less crowded',
    'Find more affordable activities',
    'Suggest restaurants near an attraction',
    'Adjust the trip for rainy weather',
    'Suggest family-friendly alternatives',
    'Help me stay within my budget',
    'Recommend a scenic weekend getaway',
  ];

  useEffect(() => {
    const init = async () => {
      try {
        const [tripList, chatHistory] = await Promise.all([
          api.getTrips(),
          api.getMessages('trip-amalfi-01').catch(() => []),
        ]);
        setTrips(tripList);
        if (tripList.length > 0) {
          setSelectedTripId(tripList[0].id);
        }
        if (chatHistory.length > 0) {
          setMessages(chatHistory);
        } else {
          // Welcome greeting
          setMessages([
            {
              id: 'init-1',
              role: 'assistant',
              content:
                "Hello! I am Tripora, your intelligent travel companion. I'm ready to assist with custom itinerary adjustments, restaurant recommendations, budget optimizations, or alternative rainy-day plans. What would you like to explore?",
              timestamp: new Date().toISOString(),
              suggested_actions: [],
              is_mock: true,
            },
          ]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    init();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
      trip_id: selectedTripId,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsSending(true);

    try {
      const response = await api.sendMessage(text, selectedTripId);
      setMessages((prev) => [...prev, response]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I encountered an issue processing your travel request. Please try again.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleApplyAction = async (action: SuggestedAction) => {
    if (!selectedTripId) return;
    if (
      window.confirm(
        `Apply this AI recommendation to your itinerary?\n\n"${action.label}"`
      )
    ) {
      try {
        const res = await api.applyAssistantAction(
          selectedTripId,
          action.action_type,
          action.payload
        );
        setAppliedActionMessage(res.message);
        setTimeout(() => setAppliedActionMessage(null), 4000);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const activeTrip = trips.find((t) => t.id === selectedTripId);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Toast Confirmation */}
      {appliedActionMessage && (
        <div className="fixed top-24 right-6 z-50 bg-cobalt text-white px-5 py-3 rounded-2xl shadow-elevated border border-cobalt-400 flex items-center gap-2 text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{appliedActionMessage}</span>
        </div>
      )}

      {/* Header & Trip Context Selector */}
      <div className="p-6 rounded-3xl bg-white border border-charcoal-border shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-cobalt font-bold uppercase tracking-wider">
            <Bot className="w-4 h-4" />
            <span>AI Travel Concierge</span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-charcoal">
            Tripora Assistant
          </h1>
          <p className="text-xs text-charcoal-muted">
            Conversational trip curation, pace balancing, and culinary discovery.
          </p>
        </div>

        {/* Trip Context Dropdown */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-charcoal uppercase tracking-wider">
            Active Trip Context:
          </label>
          <select
            value={selectedTripId}
            onChange={(e) => setSelectedTripId(e.target.value)}
            className="w-full sm:w-64 px-3.5 py-2 rounded-xl border border-charcoal-border bg-warm-100 text-xs font-semibold text-charcoal outline-none focus:ring-2 focus:ring-cobalt"
          >
            {trips.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.destination})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block px-1">
          Suggested Inquiries
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-charcoal-border hover:border-cobalt hover:text-cobalt text-charcoal-light whitespace-nowrap transition-all shadow-sm"
            >
              + {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-3xl border border-charcoal-border shadow-soft p-4 sm:p-6 min-h-[480px] max-h-[600px] overflow-y-auto space-y-6">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 text-white shadow-sm ${
                  isUser ? 'bg-coral' : 'bg-cobalt'
                }`}
              >
                {isUser ? <Compass className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              {/* Message Content Bubble */}
              <div className={`space-y-3 max-w-[85%] sm:max-w-[75%]`}>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-coral text-white rounded-tr-none'
                      : 'bg-warm-100 text-charcoal rounded-tl-none border border-charcoal-border/70'
                  }`}
                >
                  {msg.content}
                </div>

                {/* Suggested Action Cards if returned by Assistant */}
                {!isUser && msg.suggested_actions && msg.suggested_actions.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">
                      Recommended Action:
                    </span>
                    <div className="space-y-2">
                      {msg.suggested_actions.map((act) => (
                        <div
                          key={act.id}
                          className="p-3 rounded-2xl bg-surface-pale border border-cobalt-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-0.5">
                            <span className="font-bold text-cobalt block">{act.label}</span>
                            <span className="text-charcoal-muted block">{act.description}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleApplyAction(act)}
                            className="px-4 py-2 rounded-xl bg-cobalt hover:bg-cobalt-600 text-white font-bold transition-all flex items-center justify-center gap-1.5 flex-shrink-0 self-start sm:self-auto"
                          >
                            <span>Apply to Itinerary</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center gap-3 text-xs text-charcoal-muted p-2">
            <div className="w-8 h-8 rounded-2xl bg-cobalt text-white flex items-center justify-center">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <span>Tripora AI is analyzing and synthesizing suggestions...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Message Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-3 p-2 bg-white rounded-2xl border border-charcoal-border shadow-soft"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={`Ask anything about ${activeTrip ? activeTrip.destination : 'travel'} (e.g. Find quiet spots, adjust budget, recommend restaurants)...`}
          className="w-full px-4 py-2.5 bg-transparent text-sm outline-none font-medium placeholder:text-charcoal-muted text-charcoal"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isSending}
          className="px-5 py-2.5 rounded-xl bg-cobalt hover:bg-cobalt-600 text-white text-xs font-bold shadow-md shadow-cobalt/25 transition-all flex items-center gap-1.5 disabled:opacity-40"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Responsible AI Disclaimer */}
      <div className="p-3.5 rounded-2xl bg-warm-100 border border-charcoal-border/70 flex items-start gap-2.5 text-[11px] text-charcoal-muted">
        <Shield className="w-3.5 h-3.5 text-cobalt flex-shrink-0 mt-0.5" />
        <span>
          <strong>Responsible Travel Advisor:</strong> Tripora does not execute automated financial bookings or confirm live seat reservations. All recommendations are advisory estimations. Please confirm availability with official vendors.
        </span>
      </div>
    </div>
  );
};

