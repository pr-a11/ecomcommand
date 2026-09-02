'use client';
import React, { useState, useEffect } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import { Users } from 'lucide-react';

export default function LiveActiveUsersCard() {
  // Backend integration point: connect to GA4 Realtime API
  const [count, setCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    // Simulate live counter fluctuation with mock data
    const mockValues = [0, 2, 1, 3, 0, 1, 2, 4, 3, 1, 0, 2];
    let idx = 0;

    setLastUpdated(new Date()?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));

    const interval = setInterval(() => {
      idx = (idx + 1) % mockValues?.length;
      setCount(mockValues?.[idx]);
      setLastUpdated(
        new Date()?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="chart-card h-full flex flex-col">
      <SectionHeader icon={<Users size={14} />} label="Live Active Users" />
      <p className="text-xs text-muted-foreground mb-4">GA4 · Real-time · refreshes every 60s</p>

      <div className="flex flex-col items-center justify-center flex-1 gap-4 py-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-muted flex items-center justify-center">
            <span className="text-4xl font-800 tabular-nums text-foreground">{count}</span>
          </div>
          {count > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-positive animate-pulse-dot" />
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${count > 0 ? 'bg-positive' : 'bg-muted-foreground'}`}
          />
          <span className="text-xs font-600 text-muted-foreground uppercase tracking-wider">
            {count > 0 ? 'LIVE' : 'QUIET'}
          </span>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Users browsing your store right now
        </p>

        {lastUpdated && <p className="text-xs text-muted-foreground/60">Updated {lastUpdated}</p>}
      </div>
    </div>
  );
}
