'use client';

import { AnalysisResult } from '@/lib/types';
import { FileText, Link2 } from 'lucide-react';

interface Props {
  result: AnalysisResult;
}

const severityColors: Record<string, string> = {
  good: '#2dd4bf',
  info: '#eab308',
  warn: '#ef4444',
};

export function ResultHeader({ result }: Props) {
  const { verdict, meta } = result;
  const color = severityColors[verdict.severity] || '#9a9a9f';
  const isUrl = meta.source !== 'pasted text';

  return (
    <div className="border-t border-[var(--border-light)] pt-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted-light)] mb-6">
        // VERDICT
      </p>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-8 text-[12px] text-[var(--text-muted-light)]">
        <span className="inline-flex items-center gap-1.5">
          {isUrl ? (
            <Link2 className="w-3.5 h-3.5" strokeWidth={2} />
          ) : (
            <FileText className="w-3.5 h-3.5" strokeWidth={2} />
          )}
          <span className="font-mono">{meta.source}</span>
        </span>
        <span className="text-[var(--text-subtle-light)]">·</span>
        <span className="font-mono">{meta.wordCount} words</span>
        {meta.fetchedTitle && (
          <>
            <span className="text-[var(--text-subtle-light)]">·</span>
            <span className="max-w-xl truncate">{meta.fetchedTitle}</span>
          </>
        )}
      </div>

      <div
        className="relative pl-6 sm:pl-8 py-2"
        style={{ borderLeft: `3px solid ${color}` }}
      >
        <h2 className="font-serif text-3xl sm:text-5xl leading-[1.05] tracking-[-0.03em]">
          {verdict.label}
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--text-muted-light)] max-w-2xl">
          {verdict.summary}
        </p>
      </div>
    </div>
  );
}