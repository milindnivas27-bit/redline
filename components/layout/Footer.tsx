export function Footer() {
  return (
    <footer className="section-dark border-t border-[var(--border-dark)]">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
          <span className="font-serif text-base tracking-tight">
            Redline
          </span>
        </div>
        <p className="text-[11px] text-[var(--text-muted-dark)] max-w-md leading-relaxed">
          A credibility analyst. We don't tell you what to believe — we show you
          why to doubt and what to verify.
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-subtle-dark)]">
          Built {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}