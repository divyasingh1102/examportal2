import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, X, Sparkles, BookOpen, Key, AlertCircle, CheckCircle2, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import {
  PulseAIMessage,
  askGeminiPulseAI,
  getOfflineVerifiedAnswer,
  PulseAIContextData
} from '../services/geminiService';

interface PulseAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const PulseAIModal: React.FC<PulseAIModalProps> = ({ isOpen, onClose, initialQuery = '' }) => {
  const {
    student,
    deadlines,
    courses,
    notices,
    facultyList,
    cardBalance,
    geminiApiKey,
    setGeminiApiKey
  } = useCampus();

  const [query, setQuery] = useState(initialQuery);
  const [messages, setMessages] = useState<PulseAIMessage[]>([
    {
      id: 'welcome',
      sender: 'pulseai',
      text: `Hello ${student.name}! I am PulseAI, your academic intelligence assistant for ${student.term}. I am grounded in your enrolled courses (CS 301, MATH 240, CS 380, CS 210), university examination protocols, faculty office hours, and slip day allowances. Ask me anything about your deliverables or campus policies!`,
      timestamp: 'Just now',
      sourcePolicy: 'Campus Registry Academic Code §4.2'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [inputKey, setInputKey] = useState(geminiApiKey);
  const [keySavedToast, setKeySavedToast] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Sync initialQuery when opened
  useEffect(() => {
    if (isOpen && initialQuery && initialQuery.trim() !== '') {
      handleSend(initialQuery);
    }
  }, [isOpen, initialQuery]);

  const contextData: PulseAIContextData = {
    studentName: student.name,
    studentId: student.id,
    gpa: student.gpa,
    term: student.term,
    enrolledCourses: courses,
    deadlines,
    notices,
    facultyList,
    cardBalance
  };

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    setGeminiApiKey(inputKey.trim());
    setKeySavedToast(true);
    setTimeout(() => {
      setKeySavedToast(false);
      setShowKeyConfig(false);
    }, 1500);
  };

  const handleSend = async (userText?: string) => {
    const textToSend = userText || query;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: PulseAIMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setIsTyping(true);

    const hasKey = geminiApiKey && geminiApiKey.trim() !== '' && geminiApiKey !== 'MY_GEMINI_API_KEY';

    if (hasKey) {
      try {
        const result = await askGeminiPulseAI(
          geminiApiKey,
          textToSend,
          [...messages, userMsg],
          contextData
        );

        const botMsg: PulseAIMessage = {
          id: `msg-ai-${Date.now()}`,
          sender: 'pulseai',
          text: result.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sourcePolicy: result.sourcePolicy || 'Google Gemini 2.5 Flash • Grounded Campus Model'
        };

        setMessages((prev) => [...prev, botMsg]);
      } catch (err: any) {
        console.warn('Gemini query failed, falling back to verified handbook:', err);
        const fallback = getOfflineVerifiedAnswer(textToSend, contextData);

        const errorMsg: PulseAIMessage = {
          id: `msg-ai-${Date.now()}`,
          sender: 'pulseai',
          text: `⚠️ **Notice:** Cloud Gemini API call encountered an error (${err?.message || 'Check API key'}).\n\n**Verified Answer from Campus Handbook:**\n${fallback.text}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sourcePolicy: fallback.sourcePolicy,
          isOfflineFallback: true
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsTyping(false);
      }
    } else {
      // Offline Handbook Mode (Clearly identified without false claims)
      setTimeout(() => {
        const fallback = getOfflineVerifiedAnswer(textToSend, contextData);

        const botMsg: PulseAIMessage = {
          id: `msg-ai-${Date.now()}`,
          sender: 'pulseai',
          text: fallback.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sourcePolicy: `${fallback.sourcePolicy} • (Offline Handbook Mode)`,
          isOfflineFallback: true
        };

        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
      }, 400);
    }
  };

  if (!isOpen) return null;

  const hasConfiguredKey = geminiApiKey && geminiApiKey.trim() !== '' && geminiApiKey !== 'MY_GEMINI_API_KEY';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131b2e]/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#e2e7ff] overflow-hidden flex flex-col h-[650px] max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-[#00236f] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 text-white flex items-center justify-center">
              <Bot className="w-5 h-5 text-[#90a8ff]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">PulseAI Academic Copilot</h3>
                <span
                  className={`w-2 h-2 rounded-full ${hasConfiguredKey ? 'bg-[#10b981] animate-pulse' : 'bg-[#f59e0b]'}`}
                ></span>
              </div>
              <p className="text-xs text-[#90a8ff]">
                {hasConfiguredKey
                  ? 'Grounded via Google Gemini 2.5 Flash'
                  : 'Grounded in Verified University Handbook (Offline Mode)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKeyConfig(!showKeyConfig)}
              title="Configure Gemini API Key"
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                hasConfiguredKey
                  ? 'bg-white/10 hover:bg-white/20 text-[#dbe1ff]'
                  : 'bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>{hasConfiguredKey ? 'API Key Active' : 'Add Gemini Key'}</span>
              {showKeyConfig ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* API Key Configuration Drawer */}
        {showKeyConfig && (
          <form
            onSubmit={handleSaveKey}
            className="p-4 bg-[#f2f3ff] border-b border-[#dae2fd] text-xs space-y-2.5 animate-in slide-in-from-top-2 duration-150"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-[#131b2e] flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-[#0051d5]" />
                  Google Gemini API Configuration
                </p>
                <p className="text-[11px] text-[#444651] mt-0.5">
                  Provide your Gemini API Key to enable open-ended generative answers via{' '}
                  <code className="font-mono bg-white px-1 py-0.5 rounded border border-[#dae2fd]">@google/genai</code>.
                  Keys can also be set in <code className="font-mono bg-white px-1 py-0.5 rounded border border-[#dae2fd]">.env.local</code> as <code className="font-mono">VITE_GEMINI_API_KEY</code>.
                </p>
              </div>
              {hasConfiguredKey && (
                <span className="text-[11px] font-bold text-[#047857] bg-[#d1fae5] px-2 py-0.5 rounded shrink-0">
                  Connected
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="password"
                placeholder="Enter Gemini API Key (AIzaSy...)"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="flex-1 p-2 rounded-lg bg-white border border-[#dae2fd] text-xs text-[#131b2e] focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#0051d5] hover:bg-[#00236f] text-white rounded-lg font-semibold transition-colors"
              >
                Save Key
              </button>
              {hasConfiguredKey && (
                <button
                  type="button"
                  onClick={() => {
                    setInputKey('');
                    setGeminiApiKey('');
                  }}
                  className="px-3 py-2 bg-white text-[#ba1a1a] border border-[#ffdad6] hover:bg-[#ffdad6]/40 rounded-lg font-semibold transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {keySavedToast && (
              <p className="text-[11px] text-[#047857] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> API key updated successfully!
              </p>
            )}
          </form>
        )}

        {/* Suggested Queries */}
        <div className="px-4 py-2.5 bg-[#f8f9ff] border-b border-[#e2e7ff] flex items-center gap-2 overflow-x-auto text-xs">
          <span className="font-bold text-[#757682] uppercase text-[10px] whitespace-nowrap">Suggested:</span>
          <button
            onClick={() => handleSend('Can I submit CS 301 using 1 grace day?')}
            className="px-2.5 py-1 rounded-full bg-white text-[#00236f] hover:bg-[#eaedff] font-medium border border-[#dae2fd] whitespace-nowrap transition-colors"
          >
            CS 301 Grace Days?
          </button>
          <button
            onClick={() => handleSend('What formula sheet is allowed for CS 380 Midterm?')}
            className="px-2.5 py-1 rounded-full bg-white text-[#00236f] hover:bg-[#eaedff] font-medium border border-[#dae2fd] whitespace-nowrap transition-colors"
          >
            CS 380 Formula Sheet?
          </button>
          <button
            onClick={() => handleSend("When are Prof. Marcus Miller's office hours?")}
            className="px-2.5 py-1 rounded-full bg-white text-[#00236f] hover:bg-[#eaedff] font-medium border border-[#dae2fd] whitespace-nowrap transition-colors"
          >
            Prof. Miller Office Hours
          </button>
          <button
            onClick={() => handleSend('What study pods and GPU stations are available in the library?')}
            className="px-2.5 py-1 rounded-full bg-white text-[#00236f] hover:bg-[#eaedff] font-medium border border-[#dae2fd] whitespace-nowrap transition-colors"
          >
            Library Study Pods
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#faf8ff]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm ${
                  msg.sender === 'user'
                    ? 'bg-[#0051d5] text-white rounded-br-xs'
                    : 'bg-white text-[#131b2e] border border-[#e2e7ff] rounded-bl-xs shadow-xs'
                }`}
              >
                <div className="leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                {msg.sourcePolicy && (
                  <div className="mt-2.5 pt-2 border-t border-[#dae2fd] flex items-center justify-between text-[11px] text-[#4059aa] font-medium">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{msg.sourcePolicy}</span>
                    </span>
                    {msg.isOfflineFallback && (
                      <span className="text-[10px] text-[#b45309] bg-[#fffbeb] px-1.5 py-0.5 rounded font-semibold">
                        Offline Policy
                      </span>
                    )}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-[#757682] mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-[#0051d5] bg-white p-3 rounded-xl border border-[#e2e7ff] w-fit shadow-xs animate-pulse">
              <Bot className="w-4 h-4 animate-spin text-[#0051d5]" />
              <span>PulseAI is consulting course policies & academic registry records...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-[#e2e7ff] flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask about slip days, midterm venue, office hours, tuition dates..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isTyping}
            className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-[#f2f3ff] rounded-xl border border-[#dae2fd] focus:outline-none focus:ring-2 focus:ring-[#0051d5]/30 text-[#131b2e]"
          />
          <button
            onClick={() => handleSend()}
            disabled={!query.trim() || isTyping}
            className="p-2.5 rounded-xl bg-[#0051d5] text-white hover:bg-[#00236f] disabled:opacity-40 transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
