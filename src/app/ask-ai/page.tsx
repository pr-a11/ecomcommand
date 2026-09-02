'use client';
import React, { useState, useRef, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { usePathname } from 'next/navigation';
import { Send, Plus, Search, MessageSquare, Sparkles, X } from 'lucide-react';

interface Message {
  id: number;
  role: 'user' | 'ai';
  text: string;
  chart?: { type: string; data: { label: string; value: number; color: string }[] };
  timestamp: string;
}

const SUGGESTED_QUESTIONS = [
  { icon: '📊', text: "How's this month's sales vs last month?" },
  { icon: '💰', text: 'Which channel is most profitable right now?' },
  { icon: '↩️', text: 'How are returns and RTO trending?' },
  { icon: '🚀', text: 'What should I fix first to grow next month?' },
];

const CONVERSATIONS = [
  { id: 1, title: 'Gross Sales drop analysis', date: 'Today' },
  { id: 2, title: 'Campaign ROAS comparison', date: 'Yesterday' },
  { id: 3, title: 'Inventory reorder suggestions', date: '26 Aug' },
  { id: 4, title: 'Customer LTV breakdown', date: '24 Aug' },
  { id: 5, title: 'Marketplace returns analysis', date: '22 Aug' },
];

const AI_RESPONSES: Record<string, string> = {
  "How's this month's sales vs last month?":
    "This month's net sales are **₹5,84,721**, up **95.4%** vs last month (₹2,99,300). Shopify leads with +8.2% growth, and Myntra surged +31.8%. Amazon is the only channel down (-23%), primarily due to BSR ranking drops on your Kundan SKU. Overall a strong month — recommend investigating Amazon's ranking issue.",
  'Which channel is most profitable right now?':
    '**Shopify** is your most profitable channel with a **64.4% net margin** on ₹2,86,650 in net sales. Prepaid orders (73.5% of orders) drive higher margins. Myntra follows at 58.7% margin. Amazon has the lowest margin at 52.1% due to higher fees and return rates.',
  'How are returns and RTO trending?':
    "Returns are at **6.8% overall** — slightly above the 5% benchmark. RTO (Return to Origin) is **2.8% on COD orders** and 0% on prepaid. Top return reason is 'Size/Fit' (42%), followed by 'Quality' (28%). Kundan collection has the highest return rate at 14.2% — recommend reviewing product descriptions.",
  'What should I fix first to grow next month?':
    '**Top 3 priorities for next month:**\n\n1. **Fix Amazon BSR** — Your Kundan Necklace dropped from rank 8,200 to 12,400. Optimize listing + run a 7-day deal to recover ranking.\n2. **Increase Meta budget** — You cut spend 37.9% but ROAS held at 5.98x. Reinvesting ₹15,000 could add ₹90,000 in attributed sales.\n3. **Reduce COD share** — COD is 26.5% of orders but has 2.8% RTO. Offering prepaid discounts could save ₹8,000/month in logistics.',
};

function formatAIText(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (!line.trim()) return <div key={i} className="h-2" />;
    const formatted = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    return (
      <p
        key={i}
        className="text-sm text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: formatted }}
      />
    );
  });
}

export default function AskAIPage() {
  const pathname = usePathname();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeConv, setActiveConv] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const responseText =
        AI_RESPONSES[text] ||
        'Based on your store data, I can see some interesting patterns. Your overall performance shows strong growth in direct channels. Would you like me to drill down into a specific metric or time period?';
      const aiMsg: Message = {
        id: Date.now() + 1,
        role: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1600);
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveConv(null);
  };

  const filteredConvs = CONVERSATIONS.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasMessages = messages.length > 0;

  return (
    <AppLayout currentPath={pathname}>
      <div
        className="flex h-[calc(100vh-80px)] -mx-4 lg:-mx-6 xl:-mx-8 2xl:-mx-10 overflow-hidden rounded-xl border border-gray-100 shadow-sm"
        style={{ marginTop: '-8px' }}
      >
        {/* ── Left Sidebar ── */}
        <div className="w-72 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col hidden lg:flex">
          {/* New Chat */}
          <div className="p-4 border-b border-gray-100 flex items-center gap-2">
            <button
              onClick={handleNewChat}
              className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus size={15} />
              New chat
            </button>
          </div>

          {/* Search */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
              <Search size={13} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-xs bg-transparent focus:outline-none text-gray-600 placeholder-gray-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}>
                  <X size={12} className="text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto py-2">
            {filteredConvs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <MessageSquare size={28} className="text-gray-300 mb-3" />
                <p className="text-sm text-gray-400">No conversations yet.</p>
              </div>
            ) : (
              <>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">
                  Recent
                </p>
                {filteredConvs.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConv(conv.id)}
                    className={`w-full text-left px-4 py-2.5 transition-colors ${
                      activeConv === conv.id
                        ? 'bg-gray-100 text-gray-900'
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <p className="text-sm font-medium truncate">{conv.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{conv.date}</p>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>

        {/* ── Main Chat Area ── */}
        <div className="flex-1 flex flex-col bg-white min-w-0">
          {/* Messages / Welcome */}
          <div className="flex-1 overflow-y-auto">
            {!hasMessages ? (
              /* Welcome State */
              <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Hello, Support</h1>
                <p className="text-2xl font-semibold text-gray-500 mb-10">
                  How can I help you today?
                </p>

                {/* Suggestion Cards */}
                <div className="w-full max-w-2xl space-y-2.5">
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q.text)}
                      className="w-full flex items-center gap-3 px-5 py-3.5 bg-white border border-gray-200 rounded-xl text-left hover:border-gray-300 hover:shadow-sm transition-all group"
                    >
                      <Sparkles
                        size={14}
                        className="text-gray-400 flex-shrink-0 group-hover:text-gray-600"
                      />
                      <span className="text-sm text-gray-700 font-medium">{q.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Chat Messages */
              <div className="px-6 py-6 space-y-5 max-w-3xl mx-auto w-full">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'ai' && (
                      <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Sparkles size={13} className="text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-50 border border-gray-100'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <p className="text-sm text-white">{msg.text}</p>
                      ) : (
                        <div className="space-y-1">{formatAIText(msg.text)}</div>
                      )}
                      <p
                        className={`text-xs mt-1.5 ${
                          msg.role === 'user' ? 'text-gray-400' : 'text-gray-400'
                        }`}
                      >
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                      <Sparkles size={13} className="text-white" />
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3">
                      <div className="flex gap-1 items-center h-4">
                        <span
                          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '0ms' }}
                        />
                        <span
                          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '150ms' }}
                        />
                        <span
                          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '300ms' }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* ── Input Bar ── */}
          <div className="border-t border-gray-100 px-6 py-4 bg-white">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-gray-400 focus-within:bg-white transition-all">
                <button className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
                  <Plus size={18} />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(input);
                    }
                  }}
                  placeholder="Ask anything about your business..."
                  className="flex-1 text-sm bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim()}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                    input.trim()
                      ? 'bg-gray-900 text-white hover:bg-gray-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
