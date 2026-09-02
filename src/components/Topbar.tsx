'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Menu, Calendar, Sparkles, ChevronDown } from 'lucide-react';
import { useDateRange, DateRange } from '@/contexts/DateRangeContext';

interface TopbarProps {
  onMenuClick: () => void;
}

const PRESET_RANGES: DateRange[] = [
  { id: 'dr-7', label: 'Last 7 days' },
  { id: 'dr-30', label: 'Last 30 days' },
  { id: 'dr-90', label: 'Last 90 days' },
];

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { selectedRange, setSelectedRange } = useDateRange();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setShowCustom(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const applyCustomRange = () => {
    if (!customFrom || !customTo) return;
    const from = new Date(customFrom);
    const to = new Date(customTo);
    if (from > to) return;
    const fmt = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    setSelectedRange({
      id: 'dr-custom',
      label: `${fmt(from)} – ${fmt(to)}`,
      from: customFrom,
      to: customTo,
    });
    setShowDropdown(false);
    setShowCustom(false);
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-14 px-4 lg:px-6 border-b border-border bg-card/95 backdrop-blur-sm flex-shrink-0">
      {/* Left: hamburger (mobile) */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1.5 rounded-lg hover:bg-muted transition-colors"
        aria-label="Open navigation"
      >
        <Menu size={20} className="text-foreground" />
      </button>

      <div className="hidden lg:flex flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Live sync dot */}
        <div className="flex items-center gap-1.5 mr-1" title="Live · synced 2m ago">
          <span className="w-2 h-2 rounded-full bg-positive animate-pulse-dot" />
          <span className="hidden sm:block text-xs text-muted-foreground font-medium">Live</span>
        </div>

        {/* Date range selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => {
              setShowDropdown(!showDropdown);
              setShowCustom(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted transition-colors text-sm font-medium text-foreground"
          >
            <Calendar size={14} className="text-muted-foreground" />
            <span className="hidden sm:block max-w-[140px] truncate">{selectedRange.label}</span>
            <ChevronDown size={14} className="text-muted-foreground" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-1.5 w-56 bg-card border border-border rounded-xl shadow-lg z-50 py-1 overflow-hidden">
              {PRESET_RANGES.map((range) => (
                <button
                  key={range.id}
                  onClick={() => {
                    setSelectedRange(range);
                    setShowDropdown(false);
                    setShowCustom(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors ${
                    selectedRange.id === range.id ? 'text-primary font-semibold' : 'text-foreground'
                  }`}
                >
                  {range.label}
                </button>
              ))}

              <div className="border-t border-border my-1" />

              {/* Custom range toggle */}
              <button
                onClick={() => setShowCustom(!showCustom)}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors flex items-center justify-between ${
                  selectedRange.id === 'dr-custom'
                    ? 'text-primary font-semibold'
                    : 'text-foreground'
                }`}
              >
                <span>Custom range</span>
                <ChevronDown
                  size={13}
                  className={`text-muted-foreground transition-transform ${showCustom ? 'rotate-180' : ''}`}
                />
              </button>

              {showCustom && (
                <div className="px-4 pb-3 space-y-2">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">From</label>
                    <input
                      type="date"
                      value={customFrom}
                      onChange={(e) => setCustomFrom(e.target.value)}
                      className="w-full text-xs border border-border rounded-lg px-2 py-1.5 bg-card text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">To</label>
                    <input
                      type="date"
                      value={customTo}
                      onChange={(e) => setCustomTo(e.target.value)}
                      className="w-full text-xs border border-border rounded-lg px-2 py-1.5 bg-card text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <button
                    onClick={applyCustomRange}
                    disabled={!customFrom || !customTo}
                    className="w-full py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* AI button */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted transition-colors text-sm font-medium text-foreground">
          <Sparkles size={14} className="text-violet-500" />
          <span className="hidden sm:block">AI</span>
        </button>
      </div>
    </header>
  );
}
