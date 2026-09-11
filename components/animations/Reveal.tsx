'use client';

import { useEffect, useRef, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  blur?: boolean;
  duration?: number;
  className?: string;
}

export function Reveal({
  children,
  delay = 0,
  y = 24,
  x = 0,
  blur = false,
  duration = 1.0,
  className = '',
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.set(el, { opacity: 0, y, x, filter: blur ? 'blur(8px)' : 'blur(0px)' });

    const tween = gsap.to(el, {
      opacity: 1, y: 0, x: 0, filter: 'blur(0px)',
      duration, delay, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, y, x, blur, duration]);

  return <div ref={ref} className={className}>{children}</div>;
}