'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/animations/Reveal';
import { ScrambleText } from '@/components/animations/ScrambleText';
import { Magnetic } from '@/components/ui/Magnetic';
import { FounderCard } from '@/components/features/FounderCard';

const signals = [
  {
    n: '01',
    title: 'Sensationalism',
    desc: 'ALL CAPS density, exclamation load, panic-trigger words.',
  },
  {
    n: '02',
    title: 'Vague sourcing',
    desc: '"Experts say" with no names. Numbers with no origin.',
  },
  {
    n: '03',
    title: 'Unfalsifiable claims',
    desc: 'Opinion dressed as fact. Statements no source could verify.',
  },
  {
    n: '04',
    title: 'Verification prompts',
    desc: 'For every claim, we hand you the search string to check it.',
  },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const children = el.querySelectorAll('[data-hero]');
    gsap.fromTo(
      children,
      { opacity: 0, y: 16, filter: 'blur(6px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
      }
    );
  }, []);

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 sm:pt-32 sm:pb-32">
        <div ref={heroRef}>
          <p
            data-hero
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted-light)] mb-10"
          >
            // REDLINE — CREDIBILITY ANALYST
          </p>

          <h1
            data-hero
            className="font-serif text-[13vw] sm:text-[8.5rem] leading-[0.92] tracking-[-0.04em]"
          >
            <ScrambleText
              as="span"
              text="See what's"
              duration={1100}
              delay={150}
              className="text-[var(--text-muted-light)]"
            />
            <br />
            <ScrambleText
              as="span"
              text="suspicious"
              duration={1300}
              delay={320}
            />
            <span className="text-[var(--accent)]">.</span>
          </h1>

          <div
            data-hero
            className="mt-14 grid grid-cols-1 md:grid-cols-12 gap-8 items-end"
          >
            <p className="md:col-span-6 text-base sm:text-lg leading-relaxed text-[var(--text-muted-light)]">
              Most fake-news detectors hand you a fake score. Redline hands you
              evidence — what to doubt, and what to check. No black box.
            </p>

            <div className="md:col-span-6 flex flex-wrap gap-3 md:justify-end">
              <Magnetic>
                <Link
                  href="/analyze"
                  className="group inline-flex items-center gap-2 h-11 px-5 rounded-full bg-[var(--text-on-light)] text-[var(--bg-light)] text-[13px] font-medium tracking-tight hover:opacity-90 transition-opacity"
                >
                  Analyze a link
                  <ArrowRight
                    className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={2.5}
                  />
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  href="#how"
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-[var(--border-light)] text-[13px] font-medium tracking-tight text-[var(--text-on-light)] hover:bg-[var(--text-on-light)]/5 transition-colors"
                >
                  How it works
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM ──────────────────────────────────── */}
      <section className="section-dark">
        <div className="max-w-6xl mx-auto px-6 py-24 sm:py-32">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--text-subtle-dark)] mb-10">
              // THE PROBLEM
            </p>
          </Reveal>

          <Reveal blur>
            <h2 className="font-serif text-3xl sm:text-5xl leading-[1.05] tracking-[-0.03em] max-w-4xl">
              &ldquo;Fake&rdquo; isn&apos;t a verdict. It&apos;s a spectrum —
              and binary detectors get it wrong.
            </h2>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl">
            <Reveal delay={0.05}>
              <p className="text-sm leading-relaxed text-[var(--text-muted-dark)]">
                Most misinformation isn&apos;t fabricated. It&apos;s misleading
                framing, missing context, or a real quote from a wrong person.
                A binary classifier can&apos;t see that.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="text-sm leading-relaxed text-[var(--text-muted-dark)]">
                AI detectors hallucinate confidence. Ask GPT to score an
                unfamiliar real article and it will say &ldquo;87% fake&rdquo;
                without blinking.
              </p>
            </Reveal>
            <Reveal delay={0.19}>
              <p className="text-sm leading-relaxed text-[var(--text-muted-dark)]">
                And &ldquo;78% fake&rdquo; is useless. Nobody knows what to do
                with a number. Redline gives you actions, not scores.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section id="how" className="max-w-6xl mx-auto px-6 py-24 sm:py-32">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted-light)] mb-10">
            // THE SIGNALS WE LOOK FOR
          </p>
        </Reveal>

        <Reveal blur delay={0.05}>
          <h2 className="font-serif text-3xl sm:text-5xl leading-[1.05] tracking-[-0.03em] max-w-3xl">
            Four things we surface on every article.
          </h2>
        </Reveal>

        <div className="mt-16">
          {signals.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.06} y={16}>
              <div className="editorial-row grid grid-cols-12 gap-6 py-6 items-baseline">
                <span className="col-span-2 sm:col-span-1 font-mono text-[11px] text-[var(--accent)] tracking-widest">
                  {s.n}
                </span>
                <h3 className="col-span-10 sm:col-span-4 font-serif text-xl sm:text-2xl tracking-tight">
                  {s.title}
                </h3>
                <p className="col-span-12 sm:col-span-7 text-sm leading-relaxed text-[var(--text-muted-light)]">
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="section-dark relative overflow-hidden">
        <div
          aria-hidden
          className="outline-text absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[28rem] sm:text-[40rem] text-[var(--text-on-dark)]/10 whitespace-nowrap"
        >
          VERIFY
        </div>

        <div className="max-w-6xl mx-auto px-6 py-28 sm:py-36 relative">
          <Reveal blur>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--text-subtle-dark)] mb-8">
              // READY WHEN YOU ARE
            </p>
            <h2 className="font-serif text-4xl sm:text-6xl leading-[1.02] tracking-[-0.035em] max-w-4xl">
              Paste a link.
              <br />
              See the red flags.
              <br />
              <span className="text-[var(--text-muted-dark)]">
                Check before you share.
              </span>
            </h2>

            <div className="mt-12">
              <Magnetic strength={0.45}>
                <Link
                  href="/analyze"
                  className="group inline-flex items-center gap-2 h-11 px-5 rounded-full bg-[var(--accent)] text-white text-[13px] font-medium tracking-tight hover:opacity-90 transition-opacity"
                >
                  Start analyzing
                  <ArrowUpRight
                    className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={2.5}
                  />
                </Link>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOUNDER ──────────────────────────────────── */}
      <FounderCard />
    </div>
  );
}