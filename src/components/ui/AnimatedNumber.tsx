'use client';
import React, { useEffect, useRef, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  formatter?: (v: number) => string;
  className?: string;
}

export default function AnimatedNumber({
  value,
  duration = 800,
  formatter = (v) => v.toLocaleString('en-IN'),
  className = '',
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);
  const startTime = useRef<number | null>(null);
  const startValue = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    startValue.current = display;
    startTime.current = null;

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue.current + (value - startValue.current) * eased;
      setDisplay(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplay(value);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span className={`tabular-nums ${className}`}>{formatter(display)}</span>;
}
