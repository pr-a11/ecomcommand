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

// Simple SVG world map dots representation
const MAP_DOTS = [
  // India (large)
  { x: 68, y: 52, r: 8, opacity: 1, country: 'IN' },
  // US
  { x: 20, y: 42, r: 3, opacity: 0.6, country: 'US' },
  // UK
  { x: 47, y: 35, r: 2.5, opacity: 0.5, country: 'GB' },
  // UAE
  { x: 60, y: 50, r: 2.5, opacity: 0.5, country: 'AE' },
  // Canada
  { x: 18, y: 35, r: 2, opacity: 0.4, country: 'CA' },
  // Australia
  { x: 82, y: 68, r: 2, opacity: 0.4, country: 'AU' },
  // Singapore
  { x: 78, y: 58, r: 1.5, opacity: 0.35, country: 'SG' },
  // Germany
  { x: 50, y: 33, r: 1.5, opacity: 0.3, country: 'DE' },
];

export default function ActiveUsersByCountry() {
  const maxUsers = COUNTRY_DATA?.[0]?.users ?? 1;

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
        <div className="bg-gray-50 rounded-lg overflow-hidden relative" style={{ minHeight: '180px' }}>
          <svg
            viewBox="0 0 100 80"
            className="w-full h-full"
            style={{ minHeight: '180px' }}
          >
            {/* Simple world outline shapes */}
            {/* North America */}
            <ellipse cx="20" cy="40" rx="14" ry="12" fill="#e5e7eb" opacity="0.8" />
            {/* South America */}
            <ellipse cx="28" cy="60" rx="8" ry="10" fill="#e5e7eb" opacity="0.8" />
            {/* Europe */}
            <ellipse cx="50" cy="33" rx="7" ry="6" fill="#e5e7eb" opacity="0.8" />
            {/* Africa */}
            <ellipse cx="50" cy="55" rx="8" ry="12" fill="#e5e7eb" opacity="0.8" />
            {/* Asia */}
            <ellipse cx="72" cy="42" rx="18" ry="14" fill="#e5e7eb" opacity="0.8" />
            {/* Australia */}
            <ellipse cx="82" cy="66" rx="7" ry="5" fill="#e5e7eb" opacity="0.8" />

            {/* Activity dots */}
            {MAP_DOTS?.map((dot) => (
              <circle
                key={dot?.country}
                cx={dot?.x}
                cy={dot?.y}
                r={dot?.r}
                fill="#1f2937"
                opacity={dot?.opacity}
              />
            ))}
          </svg>
        </div>

        {/* Country list */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            <span>Country</span>
            <span>Active Users</span>
          </div>
          {COUNTRY_DATA?.map((country) => (
            <div key={country?.code} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">{country?.flag}</span>
                <span className="text-sm text-gray-700">{country?.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-20 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-800 rounded-full"
                    style={{ width: `${(country?.users / maxUsers) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-800 tabular-nums w-12 text-right">
                  {country?.users?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
