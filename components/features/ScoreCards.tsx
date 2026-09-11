'use client';

import { AnalysisResult } from '@/lib/types';
import { CountUp } from '@/components/animations/CountUp';

interface Props {
  result: AnalysisResult;
}

interface ScoreDef {
  key: 'sensationalism' | 'sourcing' | 'hedging';
  label: string;
  description: string;
}

const defs: ScoreDef[] = [
  {
    key: 'sensationalism',
    label: 'Sensationalism',
    description: 'Emotional weight, all-caps, exclamation load.',
  },
  {
    key: 'sourcing',
    label: 'Vague sourcing',
    description: 'Unnamed authorities versus named sources.',
  },
  {
    key: 'hedging',
    label: 'Absolutism',
    description: 'Overclaiming versus careful hedging.',
  },
];

function scoreColor(n: number): string {
  if (n >= 60) return '#ef4444';
  if (n >= 30) return '#eab308';
  return '#2dd4bf';
}

function scoreLabel(n: number): string {
  if (n >= 60) return 'high';
  if (n >= 30) return 'moderate';
  return 'low';
}

export function ScoreCards({ result }: Props) {
  return (
    <div className="mt-16">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted-light)] mb-6">
        // SIGNAL SCORES
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4">
        {defs.map((d) => {
          const n = result.scores[d.key];
          const color = scoreColor(n);
          return (
            <div key={d.key} className="border-t border-[var(--border-light)] pt-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-subtle-light)]">
                {d.label}
              </p>
              <div className="mt-3 flex items-baseline gap-2">
                <CountUp
                  value={n}
                  duration={900}
                  className="font-serif text-4xl tracking-tight tabular-nums"
                  style={{ color }}
                />
                <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted-light)]">
                  {scoreLabel(n)}
                </span>
              </div>
              <div className="mt-3 h-[2px] bg-[var(--border-light)] relative overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full"
                  style={{
                    width: `${n}%`,
                    backgroundColor: color,
                    transition: 'width 900ms cubic-bezier(0.2, 0.7, 0.2, 1)',
                  }}
                />
              </div>
              <p className="mt-3 text-[12px] leading-relaxed text-[var(--text-muted-light)]">
                {d.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}