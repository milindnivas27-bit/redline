'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/analyze', label: 'Analyze' },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--bg-light)]/85 border-b border-[var(--border-light)]">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
          <span className="font-serif text-[19px] tracking-tight font-medium">
            Redline
          </span>
        </Link>

        <nav className="flex items-center gap-7">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`text-[13px] tracking-tight transition-colors ${
                  active
                    ? 'text-[var(--text-on-light)]'
                    : 'text-[var(--text-muted-light)] hover:text-[var(--text-on-light)]'
                }`}
              >
                {l.label}
              </Link>
            );
          })}

          <Link
            href="/analyze"
            className="group inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-[var(--text-on-light)] text-[var(--bg-light)] text-[12px] font-medium tracking-tight hover:opacity-90 transition-opacity"
          >
            Analyze
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
          </Link>
        </nav>
      </div>
    </header>
  );
}