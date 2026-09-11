'use client';

import { AnalysisResult } from '@/lib/types';
import { Search, ExternalLink } from 'lucide-react';

interface Props {
  result: AnalysisResult;
}

const verdictMeta: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  verifiable:    { label: 'Verifiable',    color: '#2dd4bf', bg: 'rgba(45, 212, 191, 0.10)' },
  vague:         { label: 'Vague',         color: '#eab308', bg: 'rgba(234, 179, 8, 0.10)' },
  unfalsifiable: { label: 'Unfalsifiable', color: '#9a9a9f', bg: 'rgba(154, 154, 159, 0.10)' },
};

export function ClaimList({ result }: Props) {
  if (result.claims.length === 0) return null;

  const verifiable = result.claims.filter((c) => c.verdict === 'verifiable').length;
  const vague = result.claims.filter((c) => c.verdict === 'vague').length;

  return (
    <div className="mt-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted-light)]">
          // CLAIMS
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-subtle-light)] tabular-nums">
          {verifiable} verifiable · {vague} vague · {result.claims.length} total
        </p>
      </div>

      <div className="space-y-3">
        {result.claims.map((c, i) => {
          const meta = verdictMeta[c.verdict] || verdictMeta.unfalsifiable;
          return (
            <div
              key={i}
              className="border border-[var(--border-light)] rounded-[var(--radius)] p-5 bg-[var(--surface-light)]"
            >
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.18em] px-2 py-1 rounded"
                  style={{ color: meta.color, backgroundColor: meta.bg }}
                >
                  {meta.label}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-subtle-light)] tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              <p className="font-serif text-base sm:text-lg leading-snug tracking-tight text-[var(--text-on-light)]">
                &ldquo;{c.text.length > 400 ? c.text.slice(0, 400) + '…' : c.text}&rdquo;
              </p>

              <p className="mt-3 text-[13px] leading-relaxed text-[var(--text-muted-light)]">
                {c.reason}
              </p>

              {c.checkWith && c.checkWith.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[var(--border-light)]">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-subtle-light)] mb-2">
                    Verify with
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {c.checkWith.map((q, qi) => (
                      <a
                        key={qi}
                        href={`https://www.google.com/search?q=${encodeURIComponent(q)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 text-[12px] text-[var(--text-muted-light)] hover:text-[var(--accent)] border border-[var(--border-light)] hover:border-[var(--accent)]/40 rounded-full px-3 h-7 transition-colors"
                      >
                        <Search className="w-3 h-3" strokeWidth={2} />
                        <span className="max-w-[220px] truncate">{q}</span>
                        <ExternalLink
                          className="w-2.5 h-2.5 opacity-50"
                          strokeWidth={2.5}
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}