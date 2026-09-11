'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ScrubVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  // Wait for video metadata before enabling scrub
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onReady = () => setReady(true);
    if (v.readyState >= 2) setReady(true);
    else {
      v.addEventListener('loadeddata', onReady);
      v.addEventListener('loadedmetadata', onReady);
    }
    return () => {
      v.removeEventListener('loadeddata', onReady);
      v.removeEventListener('loadedmetadata', onReady);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    // Mobile fallback — play once on enter, don't scrub
    const isMobile =
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 768px)').matches;

    if (isMobile) {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              video.play().catch(() => {});
            } else {
              video.pause();
            }
          });
        },
        { threshold: 0.35 }
      );
      obs.observe(video);
      // reveal both texts
      gsap.set([text1Ref.current, text2Ref.current], { opacity: 1, y: 0 });
      return () => obs.disconnect();
    }

    const duration = video.duration || 6;

    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: '+=200%',
      pin: true,
      scrub: 0.4,
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress;

        // ── Video scrub ─────────────────────────
        const target = p * duration;
        if (Math.abs(video.currentTime - target) > 0.03) {
          try {
            video.currentTime = target;
          } catch {
            /* ignore – mobile Safari sometimes throws */
          }
        }

        // ── Text 1: in (0–0.2), hold (0.2–0.4), out (0.4–0.6) ──
        let t1 = 0;
        if (p <= 0.2) t1 = p / 0.2;
        else if (p <= 0.4) t1 = 1;
        else if (p <= 0.6) t1 = 1 - (p - 0.4) / 0.2;
        else t1 = 0;

        // ── Text 2: in (0.4–0.6), hold (0.6–1) ──
        let t2 = 0;
        if (p <= 0.4) t2 = 0;
        else if (p <= 0.6) t2 = (p - 0.4) / 0.2;
        else t2 = 1;

        gsap.set(text1Ref.current, {
          opacity: t1,
          y: (1 - t1) * 16,
        });
        gsap.set(text2Ref.current, {
          opacity: t2,
          y: (1 - t2) * 16,
        });
      },
    });

    // Ensure initial state
    gsap.set(text1Ref.current, { opacity: 0, y: 16 });
    gsap.set(text2Ref.current, { opacity: 0, y: 16 });

    return () => {
      st.kill();
    };
  }, [ready]);

  return (
    <section
      ref={containerRef}
      className="section-dark relative w-full h-screen overflow-hidden"
    >
      {/* Video */}
      <video
        ref={videoRef}
        src="/video/scrub.mp4"
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        className="absolute inset-0 w-full h-full object-cover opacity-[0.85] select-none pointer-events-none"
      />

      {/* Gradient overlays to blend video into the site */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(8,8,10,0.65) 0%, rgba(8,8,10,0.1) 35%, rgba(8,8,10,0.1) 65%, rgba(8,8,10,0.75) 100%)',
        }}
      />

      {/* Text overlays */}
      <div className="relative h-full flex items-center justify-center px-6">
        <div className="relative w-full max-w-4xl h-[220px]">
          <div
            ref={text1Ref}
            className="absolute inset-0 flex items-center justify-center text-center"
          >
            <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl leading-[1.02] tracking-[-0.04em]">
              We don&apos;t tell you
              <br />
              what to believe.
            </h2>
          </div>
          <div
            ref={text2Ref}
            className="absolute inset-0 flex items-center justify-center text-center"
          >
            <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl leading-[1.02] tracking-[-0.04em]">
              We show you
              <br />
              <span className="text-[var(--accent)]">why to doubt.</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Corner labels — very editorial */}
      <div className="absolute top-6 left-6 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-subtle-dark)] pointer-events-none">
        // SCROLL
      </div>
      <div className="absolute bottom-6 right-6 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-subtle-dark)] pointer-events-none">
        REDLINE
      </div>
    </section>
  );
}