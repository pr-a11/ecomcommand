'use client';
import React, { useState } from 'react';
import { Menu, Calendar, Sparkles, ChevronDown } from 'lucide-react';

interface TopbarProps {
  onMenuClick: () => void;
}

const dateRanges = [
  { id: 'dr-7', label: 'Last 7 days' },
  { id: 'dr-30', label: 'Last 30 days' },
  { id: 'dr-90', label: 'Last 90 days' },
  { id: 'dr-custom', label: 'Custom range' },
];

export default function Topbar({ onMenuClick }: TopbarProps) {
  const [selectedRange, setSelectedRange] = useState('Last 30 days');
  const [showDropdown, setShowDropdown] = useState(false);

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

      {/* Center spacer on desktop */}
      <div className="hidden lg:flex flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Live sync dot */}
        <div className="flex items-center gap-1.5 mr-1" title="Live · synced 2m ago">
          <span className="w-2 h-2 rounded-full bg-positive animate-pulse-dot" />
          <span className="hidden sm:block text-xs text-muted-foreground font-medium">Live</span>
        </div>

        {/* Date range selector */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted transition-colors text-sm font-medium text-foreground"
          >
            <Calendar size={14} className="text-muted-foreground" />
            <span className="hidden sm:block">{selectedRange}</span>
            <ChevronDown size={14} className="text-muted-foreground" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 top-full mt-1.5 w-44 bg-card border border-border rounded-lg shadow-card-hover z-50 py-1 overflow-hidden">
              {dateRanges.map((range) => (
                <button
                  key={range.id}
                  onClick={() => {
                    setSelectedRange(range.label);
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors ${
                    selectedRange === range.label
                      ? 'text-primary font-semibold' :'text-foreground'
                  }`}
                >
                  {range.label}
                </button>
              ))}
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