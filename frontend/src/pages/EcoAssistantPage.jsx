import React, { useState, useRef, useEffect } from 'react';
import { aiService } from '../services/api';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  Leaf,
  Layers,
  Recycle,
  HelpCircle,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const CATEGORIES = [
  {
    title: "Resin Codes (1-7)",
    icon: Layers,
    color: "from-blue-600 to-cyan-700",
    queries: [
      "What is Resin Code #1 (PET)?",
      "Is HDPE (Code #2) safe for drinking water?",
      "Why is PVC (Code #3) called poison plastic?",
      "Can Styrofoam / PS (Code #6) be recycled?"
    ]
  },
  {
    title: "5 R's Hierarchy",
    icon: Recycle,
    color: "from-emerald-600 to-teal-700",
    queries: [
      "What are the 5 R's of waste management?",
      "How do I practice REFUSE in everyday shopping?",
      "What is the difference between Reusing and Repurposing?",
      "Why is recycling considered the last option?"
    ]
  },
  {
    title: "Sustainable Alternatives",
    icon: Leaf,
    color: "from-amber-600 to-emerald-700",
    queries: [
      "What are the best alternatives to single-use carry bags?",
      "Safe alternatives to plastic water bottles",
      "Eco substitutes for plastic cutlery & straws",
      "Alternatives to plastic cling wraps & containers"
    ]
  },
  {
    title: "B.Tech CSP Field Research",
    icon: Award,
    color: "from-purple-600 to-indigo-700",
    queries: [
      "Tell me about the B.Tech CSP Team and guides",
      "What were the field findings at ZPH School Lingamguntla?",
      "How was the school survey conducted on 29 June 2026?",
      "How do student pledges work on this platform?"
    ]
  }
];

const EcoAssistantPage = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "### Welcome to the Eco AI Sustainability Knowledge Engine 🌿\n\nI am your interactive environmental assistant, powered by certified sustainability resources and verified field data from the **B.Tech CSP Team (CSE-DS, Narasaraopet)**.\n\nClick any topic below or type your question about plastic pollution, resin codes, or sustainable habits."
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (queryText) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await aiService.askAssistant(textToSend);
      const botMessage = {
        sender: 'bot',
        text: res.data.answer,
        suggestions: res.data.suggestions || []
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "⚠️ An error occurred while retrieving answer from environmental knowledge engine. Please try again.",
          suggestions: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const parseInline = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-emerald-700 font-bold underline hover:text-emerald-900">$1</a>');
  };

  const renderFormattedMarkdown = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('### ')) {
        return (
          <h3 key={i} className="text-base sm:text-lg font-bold text-emerald-950 mt-3 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{line.replace('### ', '')}</span>
          </h3>
        );
      }
      if (line.startsWith('#### ')) {
        return (
          <h4 key={i} className="text-sm font-bold text-emerald-900 mt-2 mb-1">
            {line.replace('#### ', '')}
          </h4>
        );
      }
      if (line.startsWith('- ')) {
        return (
          <li key={i} className="text-xs sm:text-sm text-slate-700 my-1 ml-4 list-disc" dangerouslySetInnerHTML={{ __html: parseInline(line.substring(2)) }} />
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={i} className="text-xs sm:text-sm text-slate-800 my-1 ml-2 font-medium" dangerouslySetInnerHTML={{ __html: parseInline(line) }} />
        );
      }
      if (line.startsWith('> ')) {
        return (
          <blockquote key={i} className="border-l-4 border-emerald-500 pl-3 py-1 my-2 text-xs sm:text-sm bg-emerald-50/80 text-emerald-900 rounded-r-lg font-medium" dangerouslySetInnerHTML={{ __html: parseInline(line.replace('> ', '')) }} />
        );
      }
      if (!line.trim()) return <div key={i} className="h-2" />;
      return (
        <p key={i} className="text-xs sm:text-sm text-slate-700 my-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: parseInline(line) }} />
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#f7faf8] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-900 text-xs font-bold mb-3">
            <Bot className="w-4 h-4 text-emerald-700" />
            <span>Environmental Knowledge Engine & AI Assistant</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 font-serif tracking-tight">
            Ask the Eco AI Assistant
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Real-time scientific answers on plastic polymers, resin codes, waste segregation, and community research from Narasaraopet & Lingamguntla Agraharam.
          </p>
        </div>

        {/* Quick Topic Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center shadow-xs`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900">{cat.title}</h3>
                  </div>
                  <div className="space-y-1.5">
                    {cat.queries.map((q, qIdx) => (
                      <button
                        key={qIdx}
                        onClick={() => handleSend(q)}
                        className="w-full text-left text-[11px] text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/60 p-1.5 rounded-lg transition-colors flex items-center justify-between group"
                      >
                        <span className="truncate">{q}</span>
                        <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-emerald-600 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Conversation Window */}
        <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden flex flex-col h-[650px]">
          
          {/* Chat Window Banner */}
          <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-extrabold text-sm sm:text-base">Eco AI Conversation</h2>
                <p className="text-[11px] text-emerald-200">Department of CSE (Data Science) Project Initiative</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold bg-emerald-900/40 px-3 py-1.5 rounded-full border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Knowledge Base Active</span>
            </div>
          </div>

          {/* Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#fbfdfc]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-emerald-700 text-white rounded-br-xs text-xs sm:text-sm font-medium'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                  }`}
                >
                  {msg.sender === 'bot' ? renderFormattedMarkdown(msg.text) : msg.text}
                </div>

                {/* Follow up suggestions */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2.5 max-w-[85%]">
                    {msg.suggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSend(sug)}
                        className="text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 hover:text-emerald-950 px-3 py-1.5 rounded-full border border-emerald-200 transition-all text-left shadow-xs"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2.5 p-4 bg-white border border-slate-200 rounded-2xl w-fit">
                <Sparkles className="w-5 h-5 text-emerald-600 animate-spin" />
                <span className="text-xs sm:text-sm text-slate-600 font-medium">Synthesizing environmental data...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Query Input Footer */}
          <div className="p-4 bg-white border-t border-slate-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about resin codes, 5Rs, or alternatives..."
                className="flex-1 text-xs sm:text-sm px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center gap-2 flex-shrink-0"
              >
                <span>Ask AI</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default EcoAssistantPage;

