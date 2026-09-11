# Redline — See what's suspicious before you share

A credibility analyst. Paste a news article or a claim. See what's suspicious, what's vague, and what to verify — before you share it.

## The problem

"Fake" is not a verdict, it's a spectrum. Most misinformation isn't fabricated — it's misleading framing, missing context, or a real quote attributed to the wrong person. A binary fake/real classifier can't see that, and AI detectors hallucinate confidence on unfamiliar articles.

And even when they work, "78% fake" is useless. Nobody knows what to do with a number.

## The approach

Redline surfaces **evidence, not a verdict**. For any article or claim, it tells you:

- **Sensationalism score** — all-caps density, exclamation load, panic-trigger words
- **Sourcing score** — vague authorities ("experts say") vs named sources
- **Absolutism score** — overclaiming vs careful hedging
- **Claim breakdown** — every sentence classified as verifiable / vague / unfalsifiable
- **Verification prompts** — for every verifiable claim, a one-click Google search string

No black box. Every score is rule-based and defensible.

## Stack

- **Frontend:** Next.js 15 + TypeScript + Tailwind CSS
- **Animation:** GSAP (scroll reveals) + Framer Motion
- **Icons:** Lucide React
- **Backend:** Python + FastAPI
- **Scraping:** requests + BeautifulSoup4
- **No external AI APIs. No ML models. 100% rule-based.**

## Running locally

You need **two terminals** — one for Next.js, one for Python.

### Terminal 1 — Frontend
