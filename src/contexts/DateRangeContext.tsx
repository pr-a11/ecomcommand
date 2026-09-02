'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type DateRangeId = 'dr-7' | 'dr-30' | 'dr-90' | 'dr-custom';

export interface DateRange {
  id: DateRangeId;
  label: string;
  from?: string;
  to?: string;
}

interface DateRangeContextType {
  selectedRange: DateRange;
  setSelectedRange: (range: DateRange) => void;
}

const DEFAULT_RANGE: DateRange = { id: 'dr-30', label: 'Last 30 days' };

const DateRangeContext = createContext<DateRangeContextType>({
  selectedRange: DEFAULT_RANGE,
  setSelectedRange: () => {},
});

export function DateRangeProvider({ children }: { children: ReactNode }) {
  const [selectedRange, setSelectedRange] = useState<DateRange>(DEFAULT_RANGE);
  return (
    <DateRangeContext.Provider value={{ selectedRange, setSelectedRange }}>
      {children}
    </DateRangeContext.Provider>
  );
}

export function useDateRange() {
  return useContext(DateRangeContext);
}
