'use client';
import React from 'react';
import { Info } from 'lucide-react';
import { formatINR } from '@/components/ui/FormatINR';

const COD_DATA = {
  netMarginPct: 60.6,
  orders: 36,
  netSales: 109787,
  shareOfSales: 19.3,
  shareOfOrders: 26.5,
  netSalesVal: 109787,
  cogs: 43210,
  netMargin: 66577,
  rto: 2.8,
};

const PREPAID_DATA = {
  netMarginPct: 64.4,
  orders: 100,
  netSales: 457926,
  shareOfSales: 80.7,
  shareOfOrders: 73.5,
  netSalesVal: 457926,
  cogs: 162910,
  netMargin: 295016,
  rto: 0.0,
};

export default function CodPrepaidCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900">COD vs Prepaid Economics</h3>
          <Info size={13} className="text-gray-400" />
        </div>
        <button className="text-xs text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1">
          Open Order P&amp;L <span className="text-gray-400">›</span>
        </button>
      </div>
      <p className="text-xs text-gray-500 mb-4">Prepaid is 3.8% more profitable than COD</p>

      {/* Two columns */}
      <div className="grid grid-cols-2 gap-3">
        {/* COD */}
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">COD</p>
          <p className="text-2xl font-bold text-gray-900">{COD_DATA?.netMarginPct}%</p>
          <p className="text-xs text-gray-500 mb-3">net margin</p>
          <p className="text-xs text-gray-400">
            {COD_DATA?.orders} orders · {formatINR(COD_DATA?.netSales)} net sales
          </p>
          <div className="flex gap-4 mt-2 mb-3">
            <div>
              <p className="text-xs text-gray-500">Share of sales: <span className="font-semibold text-gray-700">{COD_DATA?.shareOfSales}%</span></p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Share of orders: <span className="font-semibold text-gray-700">{COD_DATA?.shareOfOrders}%</span></p>
            </div>
          </div>
          <div className="space-y-2 border-t border-gray-100 pt-3">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Net Sales</span>
              <span className="font-semibold text-gray-800">{formatINR(COD_DATA?.netSalesVal)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">– COGS</span>
              <span className="font-semibold text-gray-800">{formatINR(COD_DATA?.cogs)}</span>
            </div>
            <div className="flex justify-between text-xs font-semibold border-t border-gray-100 pt-2">
              <span className="text-gray-700">Net margin</span>
              <span className="text-gray-900">{formatINR(COD_DATA?.netMargin)}</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">RTO {COD_DATA?.rto}%</p>
        </div>

        {/* PREPAID */}
        <div className="border border-emerald-200 bg-emerald-50/40 rounded-lg p-4 relative">
          <div className="absolute top-3 right-3">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              HIGHER MARGIN
            </span>
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">PREPAID</p>
          <p className="text-2xl font-bold text-gray-900">{PREPAID_DATA?.netMarginPct}%</p>
          <p className="text-xs text-gray-500 mb-3">net margin</p>
          <p className="text-xs text-gray-400">
            {PREPAID_DATA?.orders} orders · {formatINR(PREPAID_DATA?.netSales)} net sales
          </p>
          <div className="flex gap-4 mt-2 mb-3">
            <div>
              <p className="text-xs text-gray-500">Share of sales: <span className="font-semibold text-emerald-700">{PREPAID_DATA?.shareOfSales}%</span></p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Share of orders: <span className="font-semibold text-emerald-700">{PREPAID_DATA?.shareOfOrders}%</span></p>
            </div>
          </div>
          <div className="space-y-2 border-t border-emerald-100 pt-3">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Net Sales</span>
              <span className="font-semibold text-gray-800">{formatINR(PREPAID_DATA?.netSalesVal)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">– COGS</span>
              <span className="font-semibold text-gray-800">{formatINR(PREPAID_DATA?.cogs)}</span>
            </div>
            <div className="flex justify-between text-xs font-semibold border-t border-emerald-100 pt-2">
              <span className="text-gray-700">Net margin</span>
              <span className="text-gray-900">{formatINR(PREPAID_DATA?.netMargin)}</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">RTO {PREPAID_DATA?.rto}%</p>
        </div>
      </div>
    </div>
  );
}
