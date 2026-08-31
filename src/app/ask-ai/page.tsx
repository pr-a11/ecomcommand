'use client';
import React, { useState, useRef, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { usePathname } from 'next/navigation';

interface Message {
  id: number;
  role: 'user' | 'ai';
  text: string;
  chart?: { type: string; data: { label: string; value: number; color: string }[] };
  timestamp: string;
}

const SUGGESTED_QUESTIONS = [
  "What\'s driving the drop in Gross Sales this month?",
  "Which campaign has the best ROAS right now?",
  "Show me top performing products by margin",
  "Predict next month\'s revenue based on trends",
];

const CONVERSATIONS = [
  { id: 1, title: "Gross Sales drop analysis", date: "Today" },
  { id: 2, title: "Campaign ROAS comparison", date: "Yesterday" },
  { id: 3, title: "Inventory reorder suggestions", date: "26 Aug" },
  { id: 4, title: "Customer LTV breakdown", date: "24 Aug" },
  { id: 5, title: "Marketplace returns analysis", date: "22 Aug" },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    role: 'user',
    text: "What's driving the drop in Gross Sales this month?",
    timestamp: '10:24 AM',
  },
  {
    id: 2,
    role: 'ai',
    text: "Based on your data, Gross Sales dropped **10.1%** primarily due to three factors:\n\n1. **Amazon sales down 23%** — BSR ranking dropped from 8,200 to 12,400 for your top SKU (Kundan Necklace)\n2. **Reduced Meta ad spend in Week 2** — Budget was cut by 35%, leading to lower top-of-funnel traffic\n3. **High return rate on Kundan collection** — 14.2% return rate vs 6.8% category average\n\n**Bright spots:** Shopify (+8.2%) and Myntra (+31.8%) are performing well. Recommendation: Increase Meta budget by 15% and review Kundan collection quality control.",
    chart: {
      type: 'bar',
      data: [
        { label: 'Shopify', value: 8.2, color: '#10B981' },
        { label: 'Amazon', value: -23.0, color: '#F97316' },
        { label: 'Flipkart', value: 9.7, color: '#3B82F6' },
        { label: 'Myntra', value: 31.8, color: '#EC4899' },
        { label: 'Eternz', value: 5.4, color: '#14B8A6' },
      ],
    },
    timestamp: '10:24 AM',
  },
  {
    id: 3,
    role: 'user',
    text: "Which campaign has the best ROAS right now?",
    timestamp: '10:26 AM',
  },
  {
    id: 4,
    role: 'ai',
    text: "Your **Wedding Season — Google** campaign is your top performer with **4.8x ROAS** on ₹18,400 spend. Here's the full breakdown:\n\n• Wedding Season (Google): 4.8x ROAS ✅ Scale\n• Diwali Collection (Meta): 4.2x ROAS ✅ Scale\n• Bridal Retargeting (Meta): 3.9x ROAS ✅ Scale\n• Generic Jewellery (Google): 2.1x ROAS ⚠️ Hold\n\n**Recommendation:** Shift 20% budget from Generic Jewellery to Wedding Season campaign for maximum returns.",
    chart: {
      type: 'bar',
      data: [
        { label: 'Wedding Season', value: 4.8, color: '#10B981' },
        { label: 'Diwali Collection', value: 4.2, color: '#10B981' },
        { label: 'Bridal Retargeting', value: 3.9, color: '#10B981' },
        { label: 'Generic Jewellery', value: 2.1, color: '#F59E0B' },
        { label: 'Awareness Meta', value: 1.4, color: '#EF4444' },
      ],
    },
    timestamp: '10:26 AM',
  },
];

const AI_RESPONSES: Record<string, Message> = {
  "Show me top performing products by margin": {
    id: 0,
    role: 'ai',
    text: "Here are your **top 5 products by contribution margin**:\n\n1. **Kundan Layered Necklace** — 72.4% margin (₹1,24,800 revenue)\n2. **Bridal Combo Set** — 68.1% margin (₹98,400 revenue)\n3. **Oxidised Jhumka Earrings** — 65.8% margin (₹76,200 revenue)\n4. **Choker Pearl Necklace** — 63.2% margin (₹52,100 revenue)\n5. **Gold-plated Charm Bracelet** — 61.7% margin (₹38,200 revenue)\n\n**Insight:** Your necklace category consistently outperforms other categories by 8-12% in margin. Consider expanding this range.",
    chart: {
      type: 'bar',
      data: [
        { label: 'Kundan Necklace', value: 72.4, color: '#10B981' },
        { label: 'Bridal Combo', value: 68.1, color: '#10B981' },
        { label: 'Jhumka Earrings', value: 65.8, color: '#10B981' },
        { label: 'Pearl Choker', value: 63.2, color: '#F59E0B' },
        { label: 'Charm Bracelet', value: 61.7, color: '#F59E0B' },
      ],
    },
    timestamp: '',
  },
  "Predict next month's revenue based on trends": {
    id: 0,
    role: 'ai',
    text: "Based on your last 90 days of data and seasonal trends, here's my **September 2024 revenue forecast**:\n\n📈 **Predicted Net Sales: ₹7,12,400** (+21.8% vs August)\n\n**Key drivers:**\n• Navratri season boost expected (+35% on ethnic jewellery)\n• Wedding season peak approaching (Oct-Nov)\n• Myntra Big Fashion Festival (15-20 Sep) — expect 2.5x spike\n\n**Confidence: 78%** based on last 3 years of seasonal data\n\n⚠️ **Risk:** If Meta CPM continues rising (+23% trend), ROAS may compress. Recommend diversifying to Google Shopping.",
    chart: {
      type: 'bar',
      data: [
        { label: 'Jun', value: 4.8, color: '#94A3B8' },
        { label: 'Jul', value: 5.2, color: '#94A3B8' },
        { label: 'Aug', value: 5.85, color: '#94A3B8' },
        { label: 'Sep (Forecast)', value: 7.12, color: '#14B8A6' },
      ],
    },
    timestamp: '',
  },
};

function MiniBarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...data.map((d) => Math.abs(d.value)));
  return (
    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
      <div className="space-y-1.5">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-28 flex-shrink-0 truncate">{item.label}</span>
            <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
              <div
                className="h-4 rounded-full flex items-center justify-end pr-1.5 transition-all"
                style={{ width: `${(Math.abs(item.value) / max) * 100}%`, backgroundColor: item.color }}
              />
            </div>
            <span className="text-xs font-bold w-12 text-right" style={{ color: item.color }}>
              {item.value > 0 ? '+' : ''}{item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatAIText(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    const formatted = line
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/^• /, '&bull; ');
    return <p key={i} className={`text-sm text-gray-700 leading-relaxed ${line === '' ? 'mt-1' : ''}`} dangerouslySetInnerHTML={{ __html: formatted }} />;
  });
}

export default function AskAIPage() {
  const pathname = usePathname();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [credits, setCredits] = useState(47);
  const [activeConv, setActiveConv] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim() || credits <= 0) return;
    const userMsg: Message = { id: Date.now(), role: 'user', text, timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setCredits((c) => c - 1);

    setTimeout(() => {
      setIsTyping(false);
      const aiResponse = AI_RESPONSES[text] || {
        id: Date.now() + 1,
        role: 'ai' as const,
        text: `Great question! Based on your store data, I can see some interesting patterns. Your overall performance shows strong growth in direct channels (Shopify +8.2%) while marketplace performance is mixed. Would you like me to drill down into a specific metric or time period?`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, { ...aiResponse, id: Date.now() + 1, timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1800);
  };

  const hasMessages = messages.length > 0;

  return (
    <AppLayout currentPath={pathname}>
      <div className="flex gap-0 h-[calc(100vh-120px)] -mx-4 lg:-mx-6 xl:-mx-8 2xl:-mx-10 overflow-hidden rounded-xl border border-gray-100 shadow-sm">
        {/* Left Sidebar */}
        <div className="w-64 flex-shrink-0 bg-gray-50 border-r border-gray-100 flex flex-col hidden lg:flex">
          <div className="p-4 border-b border-gray-100">
            <button className="w-full bg-teal-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2">
              <span>✨</span> New Chat
            </button>
          </div>
          <div className="p-3 border-b border-gray-100">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-teal-400"
            />
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-2 mb-2">Recent</p>
            {CONVERSATIONS.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConv(conv.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg mb-0.5 transition-colors ${activeConv === conv.id ? 'bg-teal-50 text-teal-700' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                <p className="text-xs font-medium truncate">{conv.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{conv.date}</p>
              </button>
            ))}
          </div>
          <div className="p-4 border-t border-gray-100">
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-gray-600">Demo Credits</span>
                <span className="text-xs font-bold text-teal-600">{credits} left</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-teal-500 h-1.5 rounded-full transition-all" style={{ width: `${(credits / 50) * 100}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">Resets monthly</p>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center">
              <span className="text-white text-sm">✨</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Eternz AI Analyst</p>
              <p className="text-xs text-emerald-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                Online · Powered by GPT-4
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {!hasMessages && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center mb-4">
                  <span className="text-3xl">✨</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Hello! I'm your AI analyst 👋</h2>
                <p className="text-sm text-gray-500 mb-6">Ask me anything about your store performance</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-left text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl p-3 hover:bg-teal-50 hover:border-teal-200 transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {hasMessages && messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}>
                {msg.role === 'ai' && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs">✨</span>
                  </div>
                )}
                <div className={`max-w-[75%] ${msg.role === 'user' ? 'bg-teal-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5' : 'bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3'}`}>
                  {msg.role === 'user' ? (
                    <p className="text-sm">{msg.text}</p>
                  ) : (
                    <div>
                      {formatAIText(msg.text)}
                      {msg.chart && <MiniBarChart data={msg.chart.data} />}
                    </div>
                  )}
                  <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-teal-200' : 'text-gray-400'}`}>{msg.timestamp}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start gap-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">✨</span>
                </div>
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1 items-center h-5">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions (when chat has messages) */}
          {hasMessages && (
            <div className="px-6 py-2 border-t border-gray-50 flex gap-2 overflow-x-auto">
              {SUGGESTED_QUESTIONS.slice(2).map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="flex-shrink-0 text-xs text-teal-600 bg-teal-50 border border-teal-100 rounded-full px-3 py-1.5 hover:bg-teal-100 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl border border-gray-200 px-4 py-2.5 focus-within:border-teal-400 focus-within:bg-white transition-all">
              <button className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
                📎
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
                placeholder="Ask about your store performance..."
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || credits <= 0}
                className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-lg flex items-center justify-center hover:bg-teal-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">AI responses are based on your mock data. Connect live APIs for real insights.</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
