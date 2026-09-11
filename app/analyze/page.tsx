'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, Loader2, RotateCcw } from 'lucide-react';
import { AnalyzerInput } from '@/components/features/AnalyzerInput';
import { ResultHeader } from '@/components/features/ResultHeader';
import { ScoreCards } from '@/components/features/ScoreCards';
import { SignalList } from '@/components/features/SignalList';
import { ClaimList } from '@/components/features/ClaimList';
import { Mode, AnalysisResult } from '@/lib/types';

export default function AnalyzePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result || error) {
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result, error]);

  async function handleSubmit(mode: Mode, content: string) {
    setLoading(true);
    setError('');
    setResult(null);

    // Local dev → hit your laptop's Python server
    // Production (Vercel) → hit /api/backend/analyze on the same domain
    const isLocal =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1');

    const API_URL = isLocal
      ? 'http://localhost:8000/analyze'
      : '/api/backend/analyze';

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: mode, content }),
      });

      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        throw new Error(detail?.detail || `Server returned ${res.status}`);
      }

      const json: AnalysisResult = await res.json();
      setResult(json);
    } catch (e: unknown) {
      const msg =
        e instanceof Error && e.message
          ? e.message
          : "Couldn't reach the analyzer. Make sure the Python server is running on port 8000.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
      {/* ── Header ──────────────────────────── */}
      <div className="mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[12px] text-[var(--text-muted-light)] hover:text-[var(--text-on-light)] transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
          Back
        </Link>

        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted-light)] mb-5">
          // ANALYZE
        </p>
        <h1 className="font-serif text-4xl sm:text-6xl leading-[1.02] tracking-[-0.035em]">
          What do you
          <br />
          want to check
          <span className="text-[var(--accent)]">?</span>
        </h1>
        <p className="mt-6 text-[15px] leading-relaxed text-[var(--text-muted-light)] max-w-xl">
          Paste a news URL. Switch to text mode for WhatsApp forwards, social
          posts, or any claim you want to check.
        </p>
      </div>

      {/* ── Input ───────────────────────────── */}
      <AnalyzerInput onSubmit={handleSubmit} loading={loading} />

      <div ref={topRef} />

      {/* ── Loading ─────────────────────────── */}
      {loading && (
        <div className="mt-16 flex items-center gap-3 text-[var(--text-muted-light)]">
          <Loader2 className="w-4 h-4 animate-spin text-[var(--accent)]" strokeWidth={2} />
          <span className="font-mono text-[11px] uppercase tracking-[0.18em]">
            Reading the text · scanning for signals
          </span>
        </div>
      )}

      {/* ── Error ───────────────────────────── */}
      {error && !loading && (
        <div className="mt-16 border border-[var(--accent)]/30 bg-[var(--accent-soft)] rounded-[var(--radius)] p-5 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-[var(--accent)] mt-0.5 shrink-0" strokeWidth={2} />
          <div>
            <p className="font-serif text-base tracking-tight text-[var(--text-on-light)]">
              Analysis failed
            </p>
            <p className="mt-1 text-sm text-[var(--text-muted-light)] leading-relaxed">
              {error}
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-subtle-light)]">
              Backend: localhost:8000
            </p>
          </div>
        </div>
      )}

      {/* ── Result ──────────────────────────── */}
      {result && !loading && (
        <>
          <ResultHeader result={result} />
          <ScoreCards result={result} />
          <SignalList result={result} />
          <ClaimList result={result} />

          <div className="mt-20 pt-10 border-t border-[var(--border-light)] flex flex-wrap items-center justify-between gap-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-subtle-light)]">
              // ANALYSIS COMPLETE
            </p>
            <button
              onClick={reset}
              className="group inline-flex items-center gap-2 h-10 px-4 rounded-full border border-[var(--border-light)] text-[13px] tracking-tight text-[var(--text-on-light)] hover:border-[var(--text-on-light)] transition-colors"
            >
              <RotateCcw
                className="w-3.5 h-3.5 transition-transform group-hover:-rotate-90"
                strokeWidth={2}
              />
              Analyze another
            </button>
          </div>
        </>
      )}
    </div>
  );
}