'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { usePathname } from 'next/navigation';

const reportTemplates = [
  {
    id: 1,
    icon: '📊',
    title: 'Monthly Performance Report',
    desc: 'Sales, orders, revenue & channel breakdown',
    lastGenerated: '1 Aug 2024',
    category: 'Sales',
  },
  {
    id: 2,
    icon: '🎯',
    title: 'Channel Attribution Report',
    desc: 'Multi-touch attribution across all channels',
    lastGenerated: '28 Jul 2024',
    category: 'Marketing',
  },
  {
    id: 3,
    icon: '💰',
    title: 'Campaign ROI Report',
    desc: 'Ad spend, ROAS & campaign performance',
    lastGenerated: '25 Jul 2024',
    category: 'Marketing',
  },
  {
    id: 4,
    icon: '📦',
    title: 'Inventory Health Report',
    desc: 'Stock levels, turnover & reorder analysis',
    lastGenerated: '20 Jul 2024',
    category: 'Operations',
  },
  {
    id: 5,
    icon: '👥',
    title: 'Customer Cohort Report',
    desc: 'Retention, LTV & cohort analysis',
    lastGenerated: '15 Jul 2024',
    category: 'Customers',
  },
  {
    id: 6,
    icon: '🛒',
    title: 'Marketplace Performance',
    desc: 'Amazon, Flipkart & Myntra deep dive',
    lastGenerated: '10 Jul 2024',
    category: 'Sales',
  },
  {
    id: 7,
    icon: '📈',
    title: 'Financial P&L Report',
    desc: 'Revenue, costs, margins & profitability',
    lastGenerated: '5 Jul 2024',
    category: 'Finance',
  },
  {
    id: 8,
    icon: '🚚',
    title: 'Operations SLA Report',
    desc: 'Courier performance & delivery metrics',
    lastGenerated: '1 Jul 2024',
    category: 'Operations',
  },
];

const scheduledReports = [
  {
    name: 'Weekly Performance Summary',
    frequency: 'Every Monday',
    recipients: 'team@eternz.com',
    format: 'PDF',
    active: true,
  },
  {
    name: 'Monthly P&L Report',
    frequency: '1st of month',
    recipients: 'cfo@eternz.com',
    format: 'Excel',
    active: true,
  },
  {
    name: 'Daily Orders Digest',
    frequency: 'Daily 9 AM',
    recipients: 'ops@eternz.com',
    format: 'Email',
    active: false,
  },
];

const recentReports = [
  {
    name: 'Monthly Performance — August 2024',
    type: 'Sales',
    generated: '1 Aug 2024',
    size: '2.4 MB',
  },
  { name: 'Campaign ROI — July 2024', type: 'Marketing', generated: '28 Jul 2024', size: '1.8 MB' },
  {
    name: 'Inventory Health — Q2 2024',
    type: 'Operations',
    generated: '20 Jul 2024',
    size: '3.1 MB',
  },
  { name: 'Customer Cohort Analysis', type: 'Customers', generated: '15 Jul 2024', size: '4.2 MB' },
  { name: 'Financial P&L — July 2024', type: 'Finance', generated: '5 Jul 2024', size: '1.6 MB' },
];

const CATEGORY_COLORS: Record<string, string> = {
  Sales: 'bg-gray-100 text-gray-700',
  Marketing: 'bg-pink-100 text-pink-700',
  Operations: 'bg-blue-100 text-blue-700',
  Customers: 'bg-purple-100 text-purple-700',
  Finance: 'bg-amber-100 text-amber-700',
};

const METRICS = [
  'Gross Sales',
  'Net Sales',
  'Orders',
  'AOV',
  'ROAS',
  'Contribution Margin',
  'Return Rate',
  'New Customers',
];
const CHART_TYPES = ['Line Chart', 'Bar Chart', 'Pie Chart', 'Table', 'Scorecard'];
const GROUPINGS = ['Daily', 'Weekly', 'Monthly', 'By Channel', 'By Product'];

export default function ReportsPage() {
  const pathname = usePathname();
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['Gross Sales', 'Net Sales']);
  const [selectedChart, setSelectedChart] = useState('Line Chart');
  const [selectedGrouping, setSelectedGrouping] = useState('Monthly');
  const [generating, setGenerating] = useState<number | null>(null);

  const toggleMetric = (m: string) => {
    setSelectedMetrics((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  const handleGenerate = (id: number) => {
    setGenerating(id);
    setTimeout(() => setGenerating(null), 2000);
  };

  return (
    <AppLayout currentPath={pathname}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Generate, schedule & download analytics reports
          </p>
        </div>

        {/* Report Templates */}
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-3">Report Templates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportTemplates.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{report.icon}</span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[report.category]}`}
                  >
                    {report.category}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{report.title}</h3>
                <p className="text-xs text-gray-500 mb-3 flex-1">{report.desc}</p>
                <p className="text-xs text-gray-400 mb-3">Last: {report.lastGenerated}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleGenerate(report.id)}
                    className={`flex-1 text-xs font-semibold py-1.5 rounded-lg transition-all ${generating === report.id ? 'bg-teal-100 text-teal-600' : 'bg-teal-600 text-white hover:bg-teal-700'}`}
                  >
                    {generating === report.id ? '⏳ Generating...' : 'Generate'}
                  </button>
                  <button className="flex-1 text-xs font-semibold py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                    Schedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Report Builder */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Custom Report Builder</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Metrics */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Select Metrics
              </p>
              <div className="flex flex-wrap gap-2">
                {METRICS.map((m) => (
                  <button
                    key={m}
                    onClick={() => toggleMetric(m)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${selectedMetrics.includes(m) ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart Type */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Chart Type
              </p>
              <div className="space-y-1.5">
                {CHART_TYPES.map((ct) => (
                  <label key={ct} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="chartType"
                      value={ct}
                      checked={selectedChart === ct}
                      onChange={() => setSelectedChart(ct)}
                      className="accent-teal-600"
                    />
                    <span className="text-sm text-gray-700">{ct}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Grouping & Date */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Grouping
              </p>
              <div className="space-y-1.5 mb-4">
                {GROUPINGS.map((g) => (
                  <label key={g} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="grouping"
                      value={g}
                      checked={selectedGrouping === g}
                      onChange={() => setSelectedGrouping(g)}
                      className="accent-teal-600"
                    />
                    <span className="text-sm text-gray-700">{g}</span>
                  </label>
                ))}
              </div>
              <button className="w-full bg-teal-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-teal-700 transition-colors">
                Build Report →
              </button>
            </div>
          </div>

          {/* Preview */}
          {selectedMetrics.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <p className="text-xs text-gray-400 text-center">
                Preview:{' '}
                <span className="font-semibold text-gray-600">{selectedMetrics.join(', ')}</span> as{' '}
                <span className="font-semibold text-gray-600">{selectedChart}</span> grouped by{' '}
                <span className="font-semibold text-gray-600">{selectedGrouping}</span>
              </p>
            </div>
          )}
        </div>

        {/* Scheduled Reports */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-900">Scheduled Reports</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {scheduledReports.map((report, i) => (
              <div
                key={i}
                className="px-5 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${report.active ? 'bg-gray-900' : 'bg-gray-300'}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{report.name}</p>
                  <p className="text-xs text-gray-400">
                    {report.frequency} · {report.recipients}
                  </p>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded">
                  {report.format}
                </span>
                <button
                  className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${report.active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {report.active ? 'Pause' : 'Resume'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-900">Recent Reports</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  {['Report Name', 'Type', 'Generated', 'Size', 'Download'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 px-5 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentReports.map((report, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-sm font-medium text-gray-900">{report.name}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[report.type]}`}
                      >
                        {report.type}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">{report.generated}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{report.size}</td>
                    <td className="px-5 py-3">
                      <button className="text-xs text-teal-600 font-semibold hover:text-teal-800 transition-colors flex items-center gap-1">
                        ↓ Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
