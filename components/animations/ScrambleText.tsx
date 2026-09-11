'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  text: string;
  duration?: number;
  delay?: number;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p' | 'div';
}

const CHARS = '!<>-_\\/[]{}—=+*^?#$%&@';

export function ScrambleText({
  text,
  duration = 1300,
  delay = 0,
  className = '',
  as: Tag = 'span',
}: Props) {
  const [display, setDisplay] = useState(text);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const totalChars = text.length;
    const startTime = performance.now() + delay;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      if (elapsed < 0) {
        frameRef.current = requestAnimationFrame(tick);
        return;
      }

      const progress = Math.min(elapsed / duration, 1);
      const revealedCount = Math.floor(progress * totalChars);
      const out: string[] = [];

      for (let i = 0; i < totalChars; i++) {
        const ch = text[i];
        if (ch === ' ' || ch === '\n') {
          out.push(ch);
          continue;
        }
        if (i < revealedCount) {
          out.push(ch);
        } else if (i < revealedCount + 5) {
          out.push(CHARS[Math.floor(Math.random() * CHARS.length)]);
        } else {
          out.push(ch);
        }
      }

      setDisplay(out.join(''));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [text, duration, delay]);

  return <Tag className={className}>{display}</Tag>;
}