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

// Simplified but recognizable world map paths (Natural Earth projection, scaled to 960x500)
const WORLD_PATHS: Record<string, string> = {
  // North America
  CA: 'M 95,60 L 155,55 L 200,65 L 240,60 L 270,70 L 280,90 L 260,105 L 240,100 L 220,110 L 200,105 L 180,115 L 160,110 L 140,120 L 120,115 L 100,105 L 85,90 L 80,75 Z',
  US: 'M 85,120 L 270,110 L 275,130 L 265,155 L 250,170 L 230,175 L 200,178 L 170,175 L 140,170 L 110,160 L 90,148 L 80,135 Z M 60,155 L 80,150 L 85,165 L 70,168 Z',
  MX: 'M 90,178 L 200,178 L 210,195 L 205,215 L 185,225 L 165,220 L 145,215 L 120,210 L 100,200 L 88,190 Z',
  // Central America & Caribbean
  // South America
  BR: 'M 220,240 L 290,235 L 320,250 L 330,275 L 325,310 L 310,340 L 285,365 L 255,375 L 230,370 L 210,355 L 200,330 L 195,300 L 200,270 L 210,255 Z',
  AR: 'M 210,375 L 255,375 L 265,400 L 255,435 L 240,460 L 220,470 L 205,455 L 198,430 L 200,405 Z',
  CO: 'M 185,235 L 215,235 L 220,255 L 205,265 L 185,260 L 178,248 Z',
  VE: 'M 215,230 L 250,228 L 255,240 L 240,248 L 218,245 Z',
  PE: 'M 185,265 L 215,265 L 220,295 L 210,320 L 190,325 L 175,310 L 172,285 Z',
  CL: 'M 200,330 L 215,330 L 218,380 L 210,420 L 200,455 L 192,455 L 190,415 L 192,375 L 195,345 Z',
  // Europe
  GB: 'M 430,115 L 445,110 L 452,120 L 448,135 L 438,140 L 428,132 L 425,120 Z',
  FR: 'M 445,140 L 470,135 L 478,148 L 472,162 L 455,168 L 440,160 L 438,148 Z',
  DE: 'M 470,125 L 492,120 L 500,132 L 496,148 L 478,152 L 468,142 L 466,130 Z',
  ES: 'M 430,162 L 468,158 L 472,175 L 460,185 L 435,182 L 425,172 Z',
  IT: 'M 472,155 L 488,152 L 495,165 L 490,185 L 480,195 L 472,188 L 468,172 Z',
  PT: 'M 420,162 L 432,160 L 432,178 L 420,180 Z',
  NL: 'M 460,120 L 472,118 L 474,128 L 462,130 Z',
  BE: 'M 455,128 L 468,126 L 470,136 L 456,138 Z',
  PL: 'M 490,118 L 518,115 L 522,130 L 510,138 L 490,135 Z',
  UA: 'M 510,120 L 548,115 L 555,132 L 545,145 L 515,148 L 505,135 Z',
  SE: 'M 472,88 L 488,82 L 495,95 L 490,112 L 475,115 L 468,102 Z',
  NO: 'M 448,80 L 475,72 L 480,85 L 470,95 L 450,98 L 440,88 Z',
  FI: 'M 490,80 L 510,75 L 518,88 L 512,105 L 492,108 L 485,95 Z',
  RO: 'M 510,138 L 535,135 L 540,148 L 528,158 L 510,155 Z',
  // Russia
  RU: 'M 510,65 L 720,55 L 760,70 L 770,95 L 740,115 L 700,120 L 650,118 L 600,115 L 555,112 L 520,108 L 505,90 Z',
  // Middle East
  TR: 'M 530,158 L 575,152 L 585,165 L 575,175 L 535,178 L 522,168 Z',
  SA: 'M 548,178 L 590,172 L 600,188 L 595,210 L 575,220 L 548,215 L 535,200 L 538,185 Z',
  AE: 'M 590,195 L 610,190 L 615,202 L 600,210 L 585,208 Z',
  IR: 'M 580,158 L 625,152 L 635,168 L 625,185 L 595,188 L 578,175 Z',
  IQ: 'M 555,162 L 582,158 L 585,175 L 572,185 L 550,182 Z',
  // Africa
  EG: 'M 520,178 L 548,175 L 550,200 L 522,202 Z',
  NG: 'M 458,235 L 490,232 L 495,255 L 480,268 L 455,265 L 448,250 Z',
  ZA: 'M 490,330 L 525,325 L 530,355 L 515,375 L 490,378 L 472,362 L 470,340 Z',
  ET: 'M 535,238 L 568,232 L 572,255 L 555,268 L 530,262 L 525,248 Z',
  KE: 'M 540,262 L 568,258 L 572,282 L 550,290 L 530,285 Z',
  TZ: 'M 530,285 L 565,280 L 568,305 L 545,315 L 525,308 Z',
  DZ: 'M 440,195 L 490,190 L 495,225 L 465,235 L 438,228 Z',
  MA: 'M 420,185 L 445,182 L 448,205 L 425,210 L 415,198 Z',
  // South Asia
  IN: 'M 618,175 L 668,168 L 685,185 L 688,215 L 678,248 L 655,268 L 628,272 L 608,258 L 598,232 L 600,205 Z',
  PK: 'M 590,162 L 622,158 L 628,178 L 618,198 L 595,195 L 582,178 Z',
  BD: 'M 668,195 L 685,192 L 688,210 L 670,215 Z',
  LK: 'M 648,272 L 658,270 L 660,282 L 648,284 Z',
  // East Asia
  CN: 'M 660,120 L 760,112 L 785,130 L 788,165 L 770,185 L 730,195 L 690,192 L 660,178 L 645,158 L 648,138 Z',
  JP: 'M 790,148 L 808,140 L 818,155 L 810,172 L 795,175 L 782,162 Z',
  KR: 'M 768,158 L 785,155 L 788,170 L 772,175 Z',
  // Southeast Asia
  TH: 'M 700,215 L 722,210 L 728,232 L 718,248 L 700,245 L 692,230 Z',
  VN: 'M 722,210 L 740,205 L 745,235 L 730,255 L 718,248 L 720,228 Z',
  ID: 'M 710,268 L 760,262 L 775,275 L 765,288 L 720,292 L 705,280 Z M 770,270 L 800,265 L 808,278 L 795,288 L 768,285 Z',
  MY: 'M 700,252 L 725,248 L 728,262 L 710,268 L 698,260 Z',
  PH: 'M 760,225 L 778,218 L 785,235 L 775,250 L 758,248 Z',
  SG: 'M 718,268 L 725,266 L 726,272 L 718,273 Z',
  // Australia & Oceania
  AU: 'M 718,320 L 800,312 L 835,328 L 840,360 L 825,390 L 790,405 L 748,408 L 715,392 L 700,365 L 702,338 Z',
  NZ: 'M 848,390 L 862,382 L 868,398 L 858,412 L 845,408 Z M 852,415 L 865,408 L 870,425 L 855,432 Z',
};

// Countries with data - their fill intensity
const COUNTRY_FILL_INTENSITY: Record<string, number> = {
  IN: 0.95,
  US: 0.45,
  GB: 0.38,
  AE: 0.38,
  CA: 0.32,
  AU: 0.28,
  SG: 0.22,
  DE: 0.20,
};

export default function ActiveUsersByCountry() {
  const maxUsers = COUNTRY_DATA[0].users;

  const getCountryFill = (code: string) => {
    const intensity = COUNTRY_FILL_INTENSITY[code];
    if (intensity) {
      // Dark fill for highlighted countries
      const alpha = Math.round(intensity * 255).toString(16).padStart(2, '0');
      return `#1f2937${alpha}`;
    }
    return '#d1d5db';
  };

  const getCountryOpacity = (code: string) => {
    return COUNTRY_FILL_INTENSITY[code] ? 1 : 0.85;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900">Active Users by Country</h3>
          <Info size={13} className="text-gray-400" />
        </div>
      </div>
      <p className="text-xs text-gray-400 mb-4">GA4 · Active users by country · Last 30 days</p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Map - takes 3 cols */}
        <div className="lg:col-span-3 bg-gray-50 rounded-lg overflow-hidden relative" style={{ minHeight: '260px' }}>
          <svg
            viewBox="0 0 960 500"
            className="w-full h-full"
            style={{ minHeight: '260px' }}
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ocean background */}
            <rect width="960" height="500" fill="#f0f4f8" />

            {/* Render all country paths */}
            {Object.entries(WORLD_PATHS).map(([code, path]) => (
              <path
                key={code}
                d={path}
                fill={getCountryFill(code)}
                opacity={getCountryOpacity(code)}
                stroke="#ffffff"
                strokeWidth="0.8"
              />
            ))}

            {/* India marker dot (most active) */}
            <circle cx="648" cy="225" r="6" fill="#111827" opacity="0.95" />
            <circle cx="648" cy="225" r="10" fill="#111827" opacity="0.2" />

            {/* US marker */}
            <circle cx="175" cy="148" r="3.5" fill="#374151" opacity="0.7" />

            {/* Legend */}
            <defs>
              <linearGradient id="legendGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#d1d5db" />
                <stop offset="100%" stopColor="#1f2937" />
              </linearGradient>
            </defs>
            <rect x="760" y="460" width="120" height="8" rx="4" fill="url(#legendGrad)" />
            <text x="757" y="478" fontSize="9" fill="#9ca3af" textAnchor="end">FEWER</text>
            <text x="885" y="478" fontSize="9" fill="#9ca3af" textAnchor="start">MORE</text>
          </svg>
        </div>

        {/* Country list - takes 2 cols */}
        <div className="lg:col-span-2 space-y-2 flex flex-col justify-center">
          <div className="flex justify-between text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            <span>Country</span>
            <span>Active Users</span>
          </div>
          {COUNTRY_DATA.map((country) => (
            <div key={country.code} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-bold text-gray-400 w-5 flex-shrink-0">{country.code}</span>
                <span className="text-sm text-gray-700 truncate">{country.name}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
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
