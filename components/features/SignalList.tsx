'use client';

import { AnalysisResult } from '@/lib/types';

interface Props {
  result: AnalysisResult;
}

const severityColor: Record<string, string> = {
  good: '#2dd4bf',
  info: '#eab308',
  warn: '#ef4444',
};

const severityLabel: Record<string, string> = {
  good: 'positive',
  info: 'note',
  warn: 'flag',
};

export function SignalList({ result }: Props) {
  if (result.signals.length === 0) return null;

  return (
    <div className="mt-16">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted-light)] mb-6">
        // WHAT WE FOUND
      </p>

      <div>
        {result.signals.map((s, i) => {
          const color = severityColor[s.severity] || '#9a9a9f';
          return (
            <div
              key={i}
              className="editorial-row grid grid-cols-12 gap-4 py-5 items-baseline"
            >
              <span
                className="col-span-3 sm:col-span-2 font-mono text-[10px] uppercase tracking-[0.18em]"
                style={{ color }}
              >
                {severityLabel[s.severity] || 'note'}
              </span>
              <h3 className="col-span-9 sm:col-span-4 font-serif text-lg sm:text-xl tracking-tight">
                {s.title}
              </h3>
              <p className="col-span-12 sm:col-span-6 text-sm leading-relaxed text-[var(--text-muted-light)]">
                {s.detail}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}