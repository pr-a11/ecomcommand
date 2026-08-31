'use client';
import React from 'react';
import { Info } from 'lucide-react';

const COUNTRY_DATA = [
  { code: 'IN', flag: '🇮🇳', name: 'India', users: 5231 },
  { code: 'US', flag: '🇺🇸', name: 'United States', users: 213 },
  { code: 'GB', flag: '🇬🇧', name: 'United Kingdom', users: 122 },
  { code: 'AE', flag: '🇦🇪', name: 'United Arab Emirates', users: 122 },
  { code: 'CA', flag: '🇨🇦', name: 'Canada', users: 73 },
  { code: 'AU', flag: '🇦🇺', name: 'Australia', users: 48 },
  { code: 'SG', flag: '🇸🇬', name: 'Singapore', users: 31 },
  { code: 'DE', flag: '🇩🇪', name: 'Germany', users: 24 },
];

// Country highlight data: approximate SVG path positions for a simplified world map
// Using a simplified world map with country shapes
const COUNTRY_HIGHLIGHTS: Record<string, { cx: number; cy: number; rx: number; ry: number; opacity: number }> = {
  IN: { cx: 650, cy: 310, rx: 38, ry: 42, opacity: 0.9 },
  US: { cx: 175, cy: 230, rx: 70, ry: 45, opacity: 0.55 },
  GB: { cx: 460, cy: 175, rx: 14, ry: 16, opacity: 0.45 },
  AE: { cx: 590, cy: 295, rx: 14, ry: 12, opacity: 0.45 },
  CA: { cx: 165, cy: 165, rx: 75, ry: 38, opacity: 0.38 },
  AU: { cx: 760, cy: 400, rx: 45, ry: 32, opacity: 0.35 },
  SG: { cx: 730, cy: 345, rx: 8, ry: 7, opacity: 0.3 },
  DE: { cx: 480, cy: 180, rx: 12, ry: 12, opacity: 0.28 },
};

export default function ActiveUsersByCountry() {
  const maxUsers = COUNTRY_DATA[0].users;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900">Active Users by Country</h3>
          <Info size={13} className="text-gray-400" />
        </div>
      </div>
      <p className="text-xs text-gray-400 mb-4">GA4 · Active users by country · Last 30 days</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Map */}
        <div className="bg-gray-50 rounded-lg overflow-hidden relative flex items-center justify-center" style={{ minHeight: '200px' }}>
          <svg
            viewBox="0 0 960 500"
            className="w-full h-full"
            style={{ minHeight: '200px' }}
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ocean background */}
            <rect width="960" height="500" fill="#f0f4f8" rx="8" />

            {/* Simplified continent shapes */}
            {/* North America */}
            <path d="M80,100 L280,90 L310,130 L300,200 L270,260 L240,300 L200,320 L160,300 L120,260 L90,200 Z" fill="#d1d5db" opacity="0.85" />
            {/* Greenland */}
            <ellipse cx="270" cy="80" rx="35" ry="28" fill="#d1d5db" opacity="0.7" />
            {/* South America */}
            <path d="M220,330 L290,320 L310,360 L300,420 L270,460 L240,470 L210,450 L195,400 L200,360 Z" fill="#d1d5db" opacity="0.85" />
            {/* Europe */}
            <path d="M430,130 L510,120 L530,150 L520,190 L490,210 L450,205 L420,185 L415,155 Z" fill="#d1d5db" opacity="0.85" />
            {/* Africa */}
            <path d="M440,220 L520,210 L545,250 L550,320 L530,390 L490,420 L450,410 L420,370 L415,300 L420,250 Z" fill="#d1d5db" opacity="0.85" />
            {/* Asia (large) */}
            <path d="M530,100 L820,90 L860,130 L870,200 L840,270 L780,310 L700,320 L630,300 L580,260 L540,220 L520,170 Z" fill="#d1d5db" opacity="0.85" />
            {/* Southeast Asia */}
            <ellipse cx="740" cy="340" rx="30" ry="20" fill="#d1d5db" opacity="0.75" />
            {/* Australia */}
            <path d="M720,370 L820,360 L850,390 L840,430 L790,450 L730,440 L700,415 L705,385 Z" fill="#d1d5db" opacity="0.85" />
            {/* Japan */}
            <ellipse cx="840" cy="200" rx="14" ry="22" fill="#d1d5db" opacity="0.7" />

            {/* Country highlights based on user data */}
            {COUNTRY_DATA.map((country) => {
              const h = COUNTRY_HIGHLIGHTS[country.code];
              if (!h) return null;
              const intensity = 0.2 + (country.users / maxUsers) * 0.75;
              return (
                <ellipse
                  key={country.code}
                  cx={h.cx}
                  cy={h.cy}
                  rx={h.rx}
                  ry={h.ry}
                  fill="#1f2937"
                  opacity={intensity}
                />
              );
            })}

            {/* India dot marker */}
            <circle cx="650" cy="310" r="5" fill="#111827" opacity="0.9" />
            {/* US dot */}
            <circle cx="175" cy="230" r="3.5" fill="#374151" opacity="0.7" />
          </svg>
        </div>

        {/* Country list */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            <span>Country</span>
            <span>Active Users</span>
          </div>
          {COUNTRY_DATA.map((country) => (
            <div key={country.code} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">{country.flag}</span>
                <span className="text-sm text-gray-700">{country.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-20 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(country.users / maxUsers) * 100}%`,
                      backgroundColor: '#1f2937',
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-800 tabular-nums w-12 text-right">
                  {country.users.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
