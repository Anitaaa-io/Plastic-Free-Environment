import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { aiService } from '../services/api';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Maximize2,
  ChevronDown,
  RotateCcw,
  MessageSquare,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

const SUGGESTED_QUERIES = [
  "What is Resin Code #1 (PET)?",
  "Explain the 5 R's of waste management",
  "What are eco alternatives to plastic carry bags?",
  "Tell me about the B.Tech CSP Team & ZPH School visit",
  "How can I report plastic waste in Narasaraopet?"
];

const EcoChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "👋 Hi! I'm your **Eco AI Sustainability Assistant**. Ask me anything about plastic resin codes, 5 R's, sustainable alternatives, or our B.Tech Community Service Project in Narasaraopet!",
      suggestions: SUGGESTED_QUERIES.slice(0, 3)
    }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const response = await aiService.askAssistant(textToSend);
      const botMessage = {
        sender: 'bot',
        text: response.data.answer,
        suggestions: response.data.suggestions || []
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "⚠️ Sorry, I could not connect to the environmental engine right now. Please try asking again in a moment.",
          suggestions: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        sender: 'bot',
        text: "Conversation reset! What environmental topic or project question can I help you explore?",
        suggestions: SUGGESTED_QUERIES.slice(0, 3)
      }
    ]);
  };

  // Helper to format basic markdown-like content (bold, bullet points, headers)
  const formatContent = (text) => {
    return text.split('\n').map((line, i) => {
      // Header ###
      if (line.startsWith('### ')) {
        return (
          <h4 key={i} className="font-bold text-sm text-emerald-950 mt-2 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('#### ')) {
        return (
          <h5 key={i} className="font-bold text-xs text-emerald-900 mt-1 mb-0.5">
            {line.replace('#### ', '')}
          </h5>
        );
      }
      // Bullet point
      if (line.startsWith('- ')) {
        return (
          <div key={i} className="flex gap-1.5 items-start text-xs my-0.5 ml-1">
            <span className="text-emerald-600 font-bold">•</span>
            <span dangerouslySetInnerHTML={{ __html: parseInline(line.substring(2)) }} />
          </div>
        );
      }
      // Numbered list
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={i} className="text-xs my-0.5 ml-1 font-medium text-slate-800">
            <span dangerouslySetInnerHTML={{ __html: parseInline(line) }} />
          </div>
        );
      }
      // Blockquote
      if (line.startsWith('> ')) {
        return (
          <blockquote key={i} className="border-l-2 border-emerald-500 pl-2 py-0.5 my-1 text-xs bg-emerald-50 text-emerald-950 rounded-r">
            <span dangerouslySetInnerHTML={{ __html: parseInline(line.replace('> ', '')) }} />
          </blockquote>
        );
      }
      if (!line.trim()) return <div key={i} className="h-1.5" />;
      return (
        <p key={i} className="text-xs my-0.5 leading-relaxed" dangerouslySetInnerHTML={{ __html: parseInline(line) }} />
      );
    });
  };

  const parseInline = (text) => {
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-emerald-700 underline font-bold hover:text-emerald-900">$1</a>');
    return formatted;
  };

  return (
    <>
      {/* Floating launcher trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-emerald-700 to-teal-600 hover:from-emerald-800 hover:to-teal-700 text-white rounded-full shadow-2xl hover:shadow-emerald-600/30 hover:scale-105 transition-all duration-300 group"
          aria-label="Open Eco AI Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white animate-bounce" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
          </div>
          <span className="text-xs font-bold tracking-wide">Eco AI Chat</span>
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] max-h-[600px] h-[85vh] bg-white rounded-3xl shadow-2xl border border-emerald-100 flex flex-col overflow-hidden animate-slideUp">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-emerald-100 shadow-inner">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
                  <span>Eco AI Assistant</span>
                  <span className="text-[10px] bg-emerald-500/40 px-1.5 py-0.2 rounded font-mono font-medium">CSP</span>
                </h3>
                <p className="text-[11px] text-emerald-200">24/7 Environmental Knowledge Engine</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Reset conversation"
                className="p-1.5 text-emerald-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <Link
                to="/eco-assistant"
                onClick={() => setIsOpen(false)}
                title="Open full page assistant"
                className="p-1.5 text-emerald-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 text-emerald-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fbfdfc]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-emerald-700 text-white rounded-br-xs text-xs font-medium'
                      : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-xs'
                  }`}
                >
                  {msg.sender === 'bot' ? formatContent(msg.text) : msg.text}
                </div>

                {/* Suggestions chips */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                    {msg.suggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSend(sug)}
                        className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 hover:text-emerald-950 px-2.5 py-1 rounded-full border border-emerald-200 transition-all text-left"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-2xl w-fit">
                <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
                <span className="text-xs text-slate-500 font-medium">Consulting eco database...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick topics bar */}
          <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 overflow-x-auto flex gap-1.5 no-scrollbar">
            {SUGGESTED_QUERIES.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap text-[10px] bg-white text-slate-600 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 px-2 py-0.5 rounded-md font-medium transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input box */}
          <div className="p-3 bg-white border-t border-slate-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about resin codes, 5Rs, or alternatives..."
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white rounded-xl shadow-xs transition-colors flex-shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
};

export default EcoChatWidget;

