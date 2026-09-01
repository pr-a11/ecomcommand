'use client';
import React from 'react';
import { Info, Settings2 } from 'lucide-react';

const COUNTRY_DATA = [
  { code: 'IN', flag: '🇮🇳', name: 'India', users: 4576 },
  { code: 'US', flag: '🇺🇸', name: 'United States', users: 186 },
  { code: 'GB', flag: '🇬🇧', name: 'United Kingdom', users: 106 },
  { code: 'AE', flag: '🇦🇪', name: 'United Arab Emirates', users: 106 },
  { code: 'CA', flag: '🇨🇦', name: 'Canada', users: 64 },
  { code: 'AU', flag: '🇦🇺', name: 'Australia', users: 64 },
  { code: 'SG', flag: '🇸🇬', name: 'Singapore', users: 53 },
  { code: 'DE', flag: '🇩🇪', name: 'Germany', users: 43 },
];

// Intensity map
const INTENSITY: Record<string, number> = {
  IN: 1.0,
  US: 0.42,
  GB: 0.35,
  AE: 0.35,
  CA: 0.28,
  AU: 0.25,
  SG: 0.20,
  DE: 0.18,
};

function getCountryFill(code: string): string {
  const intensity = INTENSITY[code];
  if (intensity) {
    const r = Math.round(209 - intensity * 180);
    const g = Math.round(213 - intensity * 195);
    const b = Math.round(219 - intensity * 185);
    return `rgb(${r},${g},${b})`;
  }
  return '#dde1e7';
}

// Simplified but recognizable world map paths (Natural Earth simplified)
// viewBox 0 0 960 500
const LAND_PATHS = [
  // North America - Canada
  { code: 'CA', d: 'M 68,42 L 88,38 L 120,35 L 155,32 L 185,30 L 215,28 L 240,30 L 258,35 L 268,42 L 272,50 L 265,58 L 248,62 L 228,65 L 205,68 L 182,70 L 158,72 L 135,70 L 112,65 L 92,60 L 75,52 Z M 52,55 L 68,50 L 72,62 L 58,68 L 45,62 Z M 30,48 L 52,44 L 55,55 L 38,60 L 25,55 Z' },
  // USA
  { code: 'US', d: 'M 72,72 L 265,65 L 272,75 L 270,90 L 262,102 L 245,112 L 222,118 L 195,122 L 165,124 L 138,122 L 112,116 L 90,108 L 76,96 Z M 42,108 L 72,102 L 76,115 L 62,122 L 45,118 Z' },
  // Mexico
  { code: 'MX', d: 'M 76,124 L 195,120 L 205,132 L 200,148 L 182,158 L 158,162 L 132,158 L 108,150 L 88,140 Z' },
  // Central America
  { code: 'GT', d: 'M 148,162 L 168,160 L 172,172 L 152,175 Z' },
  { code: 'HN', d: 'M 168,162 L 188,160 L 190,172 L 170,175 Z' },
  // Caribbean
  { code: 'CU', d: 'M 188,148 L 218,145 L 222,155 L 192,158 Z' },
  // Colombia
  { code: 'CO', d: 'M 162,178 L 198,175 L 205,192 L 195,208 L 172,212 L 158,200 Z' },
  // Venezuela
  { code: 'VE', d: 'M 198,175 L 238,172 L 242,185 L 225,195 L 200,192 Z' },
  // Brazil - large
  { code: 'BR', d: 'M 205,208 L 295,200 L 328,212 L 342,235 L 345,268 L 335,302 L 315,328 L 285,348 L 252,358 L 222,352 L 202,335 L 192,308 L 188,278 L 195,248 L 205,225 Z' },
  // Peru
  { code: 'PE', d: 'M 162,212 L 200,208 L 208,238 L 198,268 L 178,278 L 162,262 L 158,238 Z' },
  // Argentina
  { code: 'AR', d: 'M 202,338 L 248,335 L 258,365 L 248,402 L 232,432 L 215,440 L 198,425 L 192,398 L 195,368 Z' },
  // Chile
  { code: 'CL', d: 'M 192,278 L 210,275 L 218,340 L 210,402 L 198,432 L 185,428 L 182,398 L 188,340 Z' },
  // UK
  { code: 'GB', d: 'M 418,92 L 432,88 L 440,98 L 435,112 L 422,118 L 412,108 Z' },
  // Ireland
  { code: 'IE', d: 'M 405,95 L 418,92 L 420,105 L 408,108 Z' },
  // France
  { code: 'FR', d: 'M 432,118 L 462,112 L 470,125 L 465,140 L 448,148 L 430,142 Z' },
  // Spain
  { code: 'ES', d: 'M 415,142 L 462,138 L 468,155 L 452,165 L 425,165 L 412,155 Z' },
  // Portugal
  { code: 'PT', d: 'M 405,142 L 418,140 L 420,158 L 406,162 Z' },
  // Germany
  { code: 'DE', d: 'M 458,100 L 485,95 L 492,108 L 488,122 L 468,128 L 452,120 Z' },
  // Netherlands
  { code: 'NL', d: 'M 448,95 L 462,92 L 465,105 L 450,108 Z' },
  // Belgium
  { code: 'BE', d: 'M 440,108 L 455,105 L 458,118 L 442,120 Z' },
  // Switzerland
  { code: 'CH', d: 'M 455,128 L 472,125 L 475,138 L 458,140 Z' },
  // Italy
  { code: 'IT', d: 'M 462,130 L 482,128 L 490,142 L 485,162 L 472,175 L 460,168 L 455,150 Z' },
  // Poland
  { code: 'PL', d: 'M 485,92 L 518,88 L 522,102 L 510,112 L 485,108 Z' },
  // Ukraine
  { code: 'UA', d: 'M 510,98 L 552,92 L 558,108 L 542,120 L 510,118 Z' },
  // Sweden
  { code: 'SE', d: 'M 462,65 L 480,58 L 488,72 L 482,95 L 465,98 L 455,82 Z' },
  // Norway
  { code: 'NO', d: 'M 435,55 L 468,48 L 475,62 L 465,78 L 438,82 L 425,68 Z' },
  // Finland
  { code: 'FI', d: 'M 482,55 L 508,48 L 515,62 L 508,88 L 485,92 L 475,75 Z' },
  // Romania
  { code: 'RO', d: 'M 505,118 L 535,112 L 540,128 L 525,138 L 505,135 Z' },
  // Russia - very large
  { code: 'RU', d: 'M 508,42 L 620,32 L 720,28 L 800,32 L 840,42 L 845,58 L 820,72 L 775,80 L 720,85 L 660,88 L 600,88 L 548,85 L 515,78 L 505,62 Z' },
  // Turkey
  { code: 'TR', d: 'M 525,138 L 578,130 L 590,142 L 578,155 L 528,158 L 515,148 Z' },
  // Saudi Arabia
  { code: 'SA', d: 'M 542,158 L 598,150 L 612,168 L 605,198 L 578,210 L 548,205 L 530,188 Z' },
  // UAE
  { code: 'AE', d: 'M 598,178 L 622,172 L 628,188 L 608,198 L 590,195 Z' },
  // Iran
  { code: 'IR', d: 'M 578,138 L 632,130 L 645,148 L 635,168 L 600,172 L 575,158 Z' },
  // Iraq
  { code: 'IQ', d: 'M 548,142 L 580,138 L 585,158 L 568,168 L 542,162 Z' },
  // Egypt
  { code: 'EG', d: 'M 515,162 L 548,158 L 552,185 L 518,190 Z' },
  // Libya
  { code: 'LY', d: 'M 462,172 L 518,165 L 522,198 L 488,208 L 458,205 Z' },
  // Algeria
  { code: 'DZ', d: 'M 418,168 L 465,162 L 468,205 L 435,215 L 412,208 Z' },
  // Morocco
  { code: 'MA', d: 'M 405,162 L 422,158 L 425,182 L 408,188 L 398,178 Z' },
  // Nigeria
  { code: 'NG', d: 'M 448,218 L 488,212 L 495,238 L 478,252 L 448,248 L 438,235 Z' },
  // Ethiopia
  { code: 'ET', d: 'M 532,222 L 568,215 L 575,238 L 558,252 L 528,248 L 522,235 Z' },
  // Kenya
  { code: 'KE', d: 'M 535,248 L 568,242 L 572,268 L 548,278 L 525,272 Z' },
  // Tanzania
  { code: 'TZ', d: 'M 525,272 L 562,265 L 568,292 L 542,302 L 518,298 Z' },
  // South Africa
  { code: 'ZA', d: 'M 482,312 L 522,308 L 528,342 L 512,362 L 482,368 L 462,350 L 458,328 Z' },
  // Sudan
  { code: 'SD', d: 'M 518,192 L 555,185 L 558,218 L 535,228 L 512,222 Z' },
  // Congo
  { code: 'CD', d: 'M 485,248 L 532,242 L 538,278 L 515,292 L 482,285 L 475,265 Z' },
  // Pakistan
  { code: 'PK', d: 'M 588,142 L 628,135 L 635,155 L 622,172 L 590,168 L 578,155 Z' },
  // India - prominent, heavily shaded
  { code: 'IN', d: 'M 622,155 L 678,148 L 698,165 L 702,198 L 690,235 L 665,258 L 632,265 L 608,250 L 595,222 L 598,195 L 608,172 Z' },
  // Bangladesh
  { code: 'BD', d: 'M 678,178 L 698,175 L 700,198 L 678,202 Z' },
  // Sri Lanka
  { code: 'LK', d: 'M 648,262 L 662,258 L 665,272 L 650,278 Z' },
  // Nepal
  { code: 'NP', d: 'M 638,152 L 672,148 L 675,160 L 638,162 Z' },
  // China - large
  { code: 'CN', d: 'M 658,100 L 775,90 L 800,108 L 805,145 L 785,168 L 742,182 L 698,178 L 662,162 L 645,142 L 648,120 Z' },
  // Japan
  { code: 'JP', d: 'M 800,118 L 822,110 L 832,128 L 825,148 L 805,152 L 792,138 Z' },
  // South Korea
  { code: 'KR', d: 'M 775,138 L 795,135 L 798,152 L 778,158 Z' },
  // Mongolia
  { code: 'MN', d: 'M 658,88 L 768,80 L 778,95 L 660,102 Z' },
  // Thailand
  { code: 'TH', d: 'M 702,198 L 728,192 L 735,215 L 722,235 L 700,232 L 692,215 Z' },
  // Vietnam
  { code: 'VN', d: 'M 728,192 L 748,188 L 755,218 L 738,242 L 722,238 L 725,215 Z' },
  // Indonesia - two main islands
  { code: 'ID', d: 'M 712,258 L 768,250 L 782,262 L 772,278 L 722,282 L 708,268 Z M 778,258 L 812,252 L 818,268 L 802,278 L 775,275 Z' },
  // Malaysia
  { code: 'MY', d: 'M 700,248 L 728,242 L 732,258 L 710,265 L 695,255 Z' },
  // Philippines
  { code: 'PH', d: 'M 765,208 L 788,200 L 795,220 L 782,242 L 762,238 Z' },
  // Myanmar
  { code: 'MM', d: 'M 682,178 L 705,172 L 710,198 L 700,222 L 678,218 L 672,198 Z' },
  // Australia - large
  { code: 'AU', d: 'M 718,305 L 808,298 L 848,315 L 858,352 L 842,388 L 802,405 L 755,408 L 715,392 L 695,362 L 698,330 Z' },
  // New Zealand
  { code: 'NZ', d: 'M 858,378 L 875,368 L 882,388 L 868,408 L 852,402 Z M 862,412 L 878,405 L 885,425 L 868,435 Z' },
  // Greenland
  { code: 'GL', d: 'M 285,18 L 340,12 L 368,18 L 372,35 L 355,48 L 325,52 L 295,48 L 278,35 Z' },
  // Iceland
  { code: 'IS', d: 'M 378,68 L 402,62 L 408,75 L 395,85 L 375,82 Z' },
  // Kazakhstan
  { code: 'KZ', d: 'M 555,88 L 658,80 L 665,100 L 650,115 L 590,118 L 555,108 Z' },
  // Uzbekistan
  { code: 'UZ', d: 'M 590,112 L 635,108 L 638,125 L 618,132 L 590,128 Z' },
  // Afghanistan
  { code: 'AF', d: 'M 590,125 L 635,118 L 642,138 L 622,148 L 590,142 Z' },
];

export default function ActiveUsersByCountry() {
  const maxUsers = COUNTRY_DATA[0].users;

  return (
    <div className="bs-chart-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <h3 className="bs-chart-title">Active Users by Country</h3>
          <Info size={12} className="text-gray-300" />
        </div>
        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          <Settings2 size={13} className="text-gray-400" />
        </button>
      </div>
      <p className="bs-chart-subtitle mb-3">GA4 · Active users by country · Last 30 days</p>

      <div className="flex flex-col gap-4">
        {/* World Map SVG */}
        <div className="bg-gray-50 rounded-lg overflow-hidden" style={{ height: '200px' }}>
          <svg
            viewBox="0 0 960 460"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Ocean background */}
            <rect width="960" height="460" fill="#eef2f7" />

            {/* All country paths */}
            {LAND_PATHS.map(({ code, d }) => (
              <path
                key={code}
                d={d}
                fill={getCountryFill(code)}
                stroke="#ffffff"
                strokeWidth="0.8"
              />
            ))}

            {/* India pulse marker - prominent */}
            <circle cx="650" cy="210" r="7" fill="#111827" opacity="0.95" />
            <circle cx="650" cy="210" r="13" fill="#111827" opacity="0.18" />
            <circle cx="650" cy="210" r="20" fill="#111827" opacity="0.07" />

            {/* US marker */}
            <circle cx="178" cy="100" r="4" fill="#374151" opacity="0.55" />

            {/* UK marker */}
            <circle cx="426" cy="102" r="3" fill="#374151" opacity="0.45" />

            {/* UAE marker */}
            <circle cx="610" cy="185" r="3" fill="#374151" opacity="0.45" />

            {/* Legend gradient */}
            <defs>
              <linearGradient id="mapLegendGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#dde1e7" />
                <stop offset="100%" stopColor="#111827" />
              </linearGradient>
            </defs>
            <rect x="760" y="432" width="130" height="7" rx="3.5" fill="url(#mapLegendGrad)" />
            <text x="756" y="448" fontSize="9" fill="#9ca3af" textAnchor="end">FEWER</text>
            <text x="895" y="448" fontSize="9" fill="#9ca3af" textAnchor="start">MORE</text>
          </svg>
        </div>

        {/* Country list */}
        <div>
          <div className="flex justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 pb-1.5 border-b border-gray-100">
            <span>Country</span>
            <span>Active Users</span>
          </div>
          <div className="space-y-2">
            {COUNTRY_DATA.map((country) => (
              <div key={country.code} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-bold text-gray-400 w-5 flex-shrink-0">{country.code}</span>
                  <span className="text-sm text-gray-700 truncate">{country.name}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-20 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gray-800"
                      style={{ width: `${(country.users / maxUsers) * 100}%` }}
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
    </div>
  );
}
