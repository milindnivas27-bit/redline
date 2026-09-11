'use client';

import { useState, FormEvent } from 'react';
import { ArrowRight, Link2, Type as TypeIcon } from 'lucide-react';
import { Mode } from '@/lib/types';
import samples from '@/data/samples.json';

interface Props {
  onSubmit: (mode: Mode, content: string) => void;
  loading: boolean;
}

export function AnalyzerInput({ onSubmit, loading }: Props) {
  const [mode, setMode] = useState<Mode>('url');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');

  const content = mode === 'url' ? url : text;
  const canSubmit = content.trim().length > 3 && !loading;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit(mode, content.trim());
  }

  function switchMode(next: Mode) {
    setMode(next);
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* ── Toggle ─────────────────────────────── */}
      <div className="flex items-center gap-1 border-b border-[var(--border-light)]">
        {([
          { id: 'url', label: 'URL', Icon: Link2 },
          { id: 'text', label: 'Text', Icon: TypeIcon },
        ] as const).map((t) => {
          const active = mode === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => switchMode(t.id)}
              className={`
                inline-flex items-center gap-2 px-4 h-10 -mb-px
                font-mono text-[11px] uppercase tracking-[0.18em]
                border-b-2 transition-colors
                ${
                  active
                    ? 'border-[var(--accent)] text-[var(--text-on-light)]'
                    : 'border-transparent text-[var(--text-muted-light)] hover:text-[var(--text-on-light)]'
                }
              `}
            >
              <t.Icon className="w-3 h-3" strokeWidth={2} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ── Input ──────────────────────────────── */}
      <div className="mt-6">
        {mode === 'url' ? (
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={samples.urlPlaceholder}
            autoComplete="off"
            spellCheck={false}
            className="
              w-full h-14 px-4 rounded-[var(--radius)]
              bg-[var(--surface-light)] border border-[var(--border-light)]
              text-base text-[var(--text-on-light)] placeholder:text-[var(--text-subtle-light)]
              font-mono tracking-tight
              focus:outline-none focus:border-[var(--accent)]
              transition-colors
            "
          />
        ) : (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={samples.textPlaceholder}
            rows={7}
            className="
              w-full px-4 py-3 rounded-[var(--radius)]
              bg-[var(--surface-light)] border border-[var(--border-light)]
              text-[15px] leading-relaxed text-[var(--text-on-light)] placeholder:text-[var(--text-subtle-light)]
              focus:outline-none focus:border-[var(--accent)]
              transition-colors resize-none
            "
          />
        )}
      </div>

      {/* ── Helper + submit ───────────────────── */}
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-subtle-light)]">
            Try:
          </span>
          {samples.urlSamples.map((s) => (
            <button
              key={s.url}
              type="button"
              onClick={() => {
                setMode('url');
                setUrl(s.url);
              }}
              className="text-[12px] text-[var(--text-muted-light)] hover:text-[var(--accent)] underline underline-offset-4 decoration-[var(--border-light)] transition-colors"
            >
              {s.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setMode('text');
              setText(samples.textSample);
            }}
            className="text-[12px] text-[var(--text-muted-light)] hover:text-[var(--accent)] underline underline-offset-4 decoration-[var(--border-light)] transition-colors"
          >
            Viral forward
          </button>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="
            group inline-flex items-center justify-center gap-2
            h-11 px-6 rounded-full
            bg-[var(--text-on-light)] text-[var(--bg-light)]
            text-[13px] font-medium tracking-tight
            hover:opacity-90 transition-opacity
            disabled:opacity-30 disabled:cursor-not-allowed
          "
        >
          {loading ? 'Analyzing…' : 'Analyze'}
          {!loading && (
            <ArrowRight
              className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
              strokeWidth={2.5}
            />
          )}
        </button>
      </div>
    </form>
  );
}