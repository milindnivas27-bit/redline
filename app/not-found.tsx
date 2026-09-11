import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-32">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted-light)] mb-6">
        // 404
      </p>
      <h1 className="font-serif text-5xl sm:text-7xl leading-[0.98] tracking-[-0.04em]">
        This page
        <br />
        doesn&apos;t exist
        <span className="text-[var(--accent)]">.</span>
      </h1>
      <p className="mt-8 text-[15px] text-[var(--text-muted-light)] max-w-lg leading-relaxed">
        Nothing at this URL. The analyzer only lives at two places.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 h-11 px-5 rounded-full bg-[var(--text-on-light)] text-[var(--bg-light)] text-[13px] font-medium tracking-tight hover:opacity-90 transition-opacity"
        >
          Back home
          <ArrowRight
            className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
            strokeWidth={2.5}
          />
        </Link>
        <Link
          href="/analyze"
          className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-[var(--border-light)] text-[13px] font-medium tracking-tight text-[var(--text-on-light)] hover:bg-[var(--text-on-light)]/5 transition-colors"
        >
          Go to analyzer
        </Link>
      </div>
    </div>
  );
}