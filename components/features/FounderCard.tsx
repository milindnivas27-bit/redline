'use client';

import Image from 'next/image';
import { Reveal } from '@/components/animations/Reveal';

export function FounderCard() {
  return (
    <section className="border-t border-[var(--border-light)]">
      <div className="max-w-6xl mx-auto px-6 py-20 sm:py-28">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted-light)] mb-10">
            // BUILT BY
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Photo */}
          <Reveal blur className="md:col-span-4">
            <div className="relative w-full aspect-square rounded-[var(--radius)] overflow-hidden border border-[var(--border-light)] bg-[var(--surface-light)]">
              <Image
                src="/founders/milind.jpeg"
                alt="Milind Nivas"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                priority={false}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 45%)',
                }}
              />
            </div>
          </Reveal>

          {/* Bio */}
          <Reveal blur delay={0.08} className="md:col-span-8">
            <h2 className="font-serif text-3xl sm:text-5xl leading-[1.05] tracking-[-0.03em]">
              Milind Nivas
            </h2>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--accent)]">
              Designer · Engineer · Writer
            </p>

            <p className="mt-8 text-[15px] sm:text-base leading-relaxed text-[var(--text-muted-light)] max-w-2xl">
              Built Redline because fake-news detectors never actually help anyone.
              A score without evidence is noise. This is the tool I wanted to exist
              — one that shows the reasoning, hands you the receipts, and lets you
              decide.
            </p>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-xl">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-subtle-light)]">
                  Role
                </p>
                <p className="mt-1.5 text-sm text-[var(--text-on-light)]">
                  Solo build
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-subtle-light)]">
                  Stack
                </p>
                <p className="mt-1.5 text-sm text-[var(--text-on-light)]">
                  Next.js · FastAPI
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-subtle-light)]">
                  Approach
                </p>
                <p className="mt-1.5 text-sm text-[var(--text-on-light)]">
                  Rule-based
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}