'use client';

import { useEffect, useState, CSSProperties } from 'react';

interface Props {
  value: number;
  duration?: number;
  className?: string;
  style?: CSSProperties;
}

export function CountUp({
  value,
  duration = 900,
  className = '',
  style,
}: Props) {
  const [n, setN] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const step = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return (
    <span className={className} style={style}>
      {n}
    </span>
  );
}