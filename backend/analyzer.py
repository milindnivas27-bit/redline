"""
Redline analyzer engine.
Pure rule-based. No external APIs. No ML. 100% reliable on stage.
Takes text, returns structured signals, claims, and scores.
"""

import re
from typing import List, Dict, Any


# ─────────────────────────────────────────────────────────────
# WORD LISTS
# ─────────────────────────────────────────────────────────────

PANIC_WORDS = [
    "shocking", "breaking", "unbelievable", "stunning", "explosive",
    "bombshell", "you won't believe", "you wont believe", "they don't want",
    "they dont want", "wake up", "exposed", "destroying", "destroyed",
    "devastating", "terrifying", "horrifying", "outrageous", "insane",
    "mind-blowing", "mind blowing", "what happened next", "must see",
    "must read", "share before", "taken down", "censored", "banned",
    "hidden truth", "the truth about", "nobody is talking about",
    "no one is talking about", "secret", "conspiracy", "cover-up",
    "coverup", "scandal", "catastrophe", "apocalypse", "meltdown",
]

URGENCY_WORDS = [
    "right now", "immediately", "urgent", "before it's too late",
    "before its too late", "act now", "hurry", "quickly", "asap",
    "don't wait", "dont wait", "last chance", "final warning",
]

VAGUE_AUTHORITY = [
    "experts say", "experts believe", "scientists say", "scientists have found",
    "studies show", "research shows", "sources say", "sources claim",
    "sources close to", "it is reported", "it has been reported",
    "many people say", "some say", "people are saying", "insiders say",
    "officials say", "analysts say", "critics say", "according to reports",
    "according to sources", "we are hearing", "rumor has it",
]

NAMED_SOURCE_PATTERNS = [
    r"\b(?:Dr|Prof|Professor|Mr|Mrs|Ms|Sir|Lord|Senator|Minister|President|CEO|Director|Secretary)\.?\s+[A-Z][a-z]+",
    r"\bsaid\s+[A-Z][a-z]+\s+[A-Z][a-z]+",       # "said John Smith"
    r"[A-Z][a-z]+\s+[A-Z][a-z]+\s+said",          # "John Smith said"
    r"\baccording to\s+[A-Z][a-z]+",              # "according to Reuters"
    r"\b(?:Reuters|AP|BBC|CNN|NYT|Bloomberg|Forbes|The Guardian|The Hindu|Al Jazeera)\b",
]

HEDGE_WORDS = [
    "allegedly", "reportedly", "apparently", "seemingly", "possibly",
    "probably", "may", "might", "could", "would", "appears to",
    "seems to", "suggests", "indicates", "is believed to", "is thought to",
    "is expected to", "is understood to", "preliminary", "unconfirmed",
    "unverified", "claims", "alleges", "purportedly",
]

ABSOLUTE_WORDS = [
    "definitely", "certainly", "absolutely", "undeniably", "unquestionably",
    "proven", "proves", "proof", "100%", "always", "never", "everyone knows",
    "no doubt", "without a doubt", "obviously", "clearly", "undeniable",
    "fact is", "the fact is", "truth is", "the truth is",
]

OPINION_MARKERS = [
    "i think", "i believe", "i feel", "in my opinion", "it seems to me",
    "we should", "we must", "they should", "you should", "ought to",
    "terrible", "wonderful", "amazing", "awful", "disgusting", "beautiful",
]


# ─────────────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────────────

def _words(text: str) -> List[str]:
    return re.findall(r"\b[\w']+\b", text.lower())


def _sentences(text: str) -> List[str]:
    # Split on . ! ? followed by space + capital or end
    parts = re.split(r"(?<=[.!?])\s+(?=[A-Z\"'])|(?<=[.!?])$", text.strip())
    return [s.strip() for s in parts if s and len(s.strip()) > 15]


def _count_phrases(text_lower: str, phrases: List[str]) -> int:
    total = 0
    for p in phrases:
        total += text_lower.count(p)
    return total


def _clamp(n: float) -> int:
    return int(max(0, min(100, round(n))))


# ─────────────────────────────────────────────────────────────
# SCORERS
# ─────────────────────────────────────────────────────────────

def score_sensationalism(text: str) -> Dict[str, Any]:
    lower = text.lower()
    word_list = _words(text)
    total_words = max(len(word_list), 1)

    # ALL CAPS words (3+ chars, not counting common acronyms)
    caps_words = re.findall(r"\b[A-Z]{3,}\b", text)
    common_acronyms = {"BBC", "CNN", "USA", "UK", "US", "UN", "EU", "AI",
                       "PM", "AM", "CEO", "CFO", "HIV", "DNA", "NASA", "WHO",
                       "WTO", "IMF", "GDP", "NBA", "FBI", "CIA", "MI5", "MI6"}
    caps_words = [w for w in caps_words if w not in common_acronyms]
    caps_ratio = len(caps_words) / total_words

    # Exclamation marks
    excl = text.count("!")
    excl_ratio = excl / max(len(_sentences(text)), 1)

    # Panic + urgency words
    panic_hits = _count_phrases(lower, PANIC_WORDS)
    urgency_hits = _count_phrases(lower, URGENCY_WORDS)

    # Score: weighted sum, clamped
    score = (
        caps_ratio * 100 * 2.0 +
        excl_ratio * 12 +
        panic_hits * 8 +
        urgency_hits * 6
    )

    return {
        "score": _clamp(score),
        "detail": {
            "caps_words": len(caps_words),
            "exclamation_marks": excl,
            "panic_words": panic_hits,
            "urgency_words": urgency_hits,
        }
    }


def score_sourcing(text: str) -> Dict[str, Any]:
    lower = text.lower()

    vague_hits = _count_phrases(lower, VAGUE_AUTHORITY)

    named_hits = 0
    for pat in NAMED_SOURCE_PATTERNS:
        named_hits += len(re.findall(pat, text))

    # Higher score = worse sourcing
    # Vague hits push up, named hits pull down
    raw = vague_hits * 18 - named_hits * 12
    score = _clamp(max(0, raw + 20))  # baseline 20 even if nothing detected

    return {
        "score": score,
        "detail": {
            "vague_attributions": vague_hits,
            "named_sources": named_hits,
        }
    }


def score_hedging(text: str) -> Dict[str, Any]:
    lower = text.lower()
    hedge_hits = _count_phrases(lower, HEDGE_WORDS)
    absolute_hits = _count_phrases(lower, ABSOLUTE_WORDS)

    # Higher score = more absolutist (worse)
    raw = absolute_hits * 12 - hedge_hits * 8
    score = _clamp(max(0, raw + 15))

    return {
        "score": score,
        "detail": {
            "hedge_words": hedge_hits,
            "absolute_words": absolute_hits,
        }
    }


# ─────────────────────────────────────────────────────────────
# CLAIM EXTRACTION
# ─────────────────────────────────────────────────────────────

NUMBER_PATTERN = re.compile(r"\b\d+(?:[.,]\d+)?(?:%|k|m|bn|billion|million|thousand)?\b")
DATE_PATTERN = re.compile(
    r"\b(?:19|20)\d{2}\b|\b(?:January|February|March|April|May|June|July|August|"
    r"September|October|November|December)\b",
    re.IGNORECASE
)


def classify_claim(sentence: str) -> Dict[str, Any]:
    lower = sentence.lower()
    has_number = bool(NUMBER_PATTERN.search(sentence))
    has_date = bool(DATE_PATTERN.search(sentence))
    has_named = any(re.search(p, sentence) for p in NAMED_SOURCE_PATTERNS)
    has_vague = _count_phrases(lower, VAGUE_AUTHORITY) > 0
    has_opinion = _count_phrases(lower, OPINION_MARKERS) > 0

    if has_opinion and not (has_number or has_date):
        verdict = "unfalsifiable"
        reason = "Opinion or value judgment — not a factual claim."
    elif (has_number or has_date) and (has_named or not has_vague):
        verdict = "verifiable"
        reason = "Contains specifics (numbers or dates) that can be checked."
    elif has_vague:
        verdict = "vague"
        reason = "Relies on unnamed authority — no source to check against."
    elif has_number or has_date:
        verdict = "verifiable"
        reason = "Contains concrete data that can be verified."
    else:
        verdict = "vague"
        reason = "General claim without verifiable specifics."

    # Build suggested search strings for verifiable claims
    checks = []
    if verdict == "verifiable":
        # Extract key noun phrases / numbers as a search query
        nums = NUMBER_PATTERN.findall(sentence)
        words = [w for w in re.findall(r"\b[A-Za-z]{4,}\b", sentence)
                 if w.lower() not in {"that", "this", "they", "their", "there",
                                      "which", "with", "from", "have", "been",
                                      "were", "will", "would", "about", "after"}]
        if nums and len(words) >= 3:
            checks.append(f"{' '.join(words[:4])} {nums[0]}")
        if words:
            checks.append(f"{' '.join(words[:5])} fact check")

    return {
        "text": sentence,
        "verdict": verdict,
        "reason": reason,
        "checkWith": checks[:2],
    }


def extract_claims(text: str) -> List[Dict[str, Any]]:
    sentences = _sentences(text)
    # Cap to 8 claims to keep the result page focused
    claims = [classify_claim(s) for s in sentences[:8]]
    # Sort: verifiable first, then vague, then unfalsifiable
    order = {"verifiable": 0, "vague": 1, "unfalsifiable": 2}
    claims.sort(key=lambda c: order.get(c["verdict"], 3))
    return claims


# ─────────────────────────────────────────────────────────────
# VERDICT
# ─────────────────────────────────────────────────────────────

def compute_verdict(sens: int, src: int, hedge: int) -> Dict[str, Any]:
    # Weighted composite, higher = more suspicious
    composite = sens * 0.5 + src * 0.3 + hedge * 0.2

    if composite >= 60:
        return {
            "label": "Reads like viral panic",
            "severity": "warn",
            "summary": "Heavy sensationalism, weak sourcing, and absolutist language. Verify before sharing.",
        }
    elif composite >= 35:
        return {
            "label": "Mixed signals",
            "severity": "info",
            "summary": "Some markers of low-credibility writing. Worth checking the specifics before trusting it.",
        }
    else:
        return {
            "label": "Reads like reported news",
            "severity": "good",
            "summary": "Language, sourcing, and framing resemble standard reporting. Cross-check anyway — always.",
        }


# ─────────────────────────────────────────────────────────────
# SIGNALS (human-readable cards)
# ─────────────────────────────────────────────────────────────

def build_signals(sens: Dict, src: Dict, hedge: Dict) -> List[Dict[str, Any]]:
    signals = []

    sd = sens["detail"]
    if sens["score"] >= 40:
        signals.append({
            "title": "Sensational language detected",
            "detail": f"{sd['caps_words']} all-caps words, {sd['exclamation_marks']} exclamation marks, "
                      f"{sd['panic_words']} panic words, {sd['urgency_words']} urgency phrases.",
            "severity": "warn",
            "savings": None,
        })
    elif sens["score"] >= 15:
        signals.append({
            "title": "Some heightened language",
            "detail": f"{sd['panic_words']} panic words, {sd['urgency_words']} urgency phrases. Not extreme.",
            "severity": "info",
            "savings": None,
        })

    sr = src["detail"]
    if src["score"] >= 60:
        signals.append({
            "title": "Vague attribution",
            "detail": f"{sr['vague_attributions']} unnamed-authority phrases "
                      f"(e.g. \"experts say\"). Only {sr['named_sources']} named sources found.",
            "severity": "warn",
            "savings": None,
        })
    elif sr["named_sources"] >= 2:
        signals.append({
            "title": "Sources are named",
            "detail": f"{sr['named_sources']} named sources identified. This is a positive sign.",
            "severity": "good",
            "savings": None,
        })

    hd = hedge["detail"]
    if hedge["score"] >= 55:
        signals.append({
            "title": "Absolutist framing",
            "detail": f"{hd['absolute_words']} absolute claims vs {hd['hedge_words']} hedged statements. "
                      f"Real reporting usually hedges.",
            "severity": "warn",
            "savings": None,
        })
    elif hedge["score"] <= 15 and hd["hedge_words"] >= 2:
        signals.append({
            "title": "Cautious wording",
            "detail": f"{hd['hedge_words']} hedged statements found — the text avoids overclaiming.",
            "severity": "good",
            "savings": None,
        })

    if not signals:
        signals.append({
            "title": "No strong red flags",
            "detail": "Language and sourcing look neutral. Check the specific claims below.",
            "severity": "good",
            "savings": None,
        })

    return signals


# ─────────────────────────────────────────────────────────────
# MAIN ENTRY
# ─────────────────────────────────────────────────────────────

def analyze(text: str, source_label: str = "pasted text",
            fetched_title: str | None = None) -> Dict[str, Any]:
    text = (text or "").strip()

    # Guard: if someone pastes a JSON wrapper, unwrap it
    if text.startswith("{") and '"content"' in text[:200]:
        import json as _json
        try:
            parsed = _json.loads(text)
            if isinstance(parsed, dict) and "content" in parsed:
                text = str(parsed["content"]).strip()
        except Exception:
            pass
    if len(text) < 20:
        return {
            "scores": {"sensationalism": 0, "sourcing": 0, "hedging": 0},
            "verdict": {
                "label": "Text too short",
                "severity": "info",
                "summary": "Paste at least a paragraph for meaningful analysis.",
            },
            "signals": [{
                "title": "Not enough to analyze",
                "detail": "Give us a sentence or two of real content.",
                "severity": "info",
                "savings": None,
            }],
            "claims": [],
            "meta": {
                "wordCount": len(_words(text)),
                "source": source_label,
                "fetchedTitle": fetched_title,
            },
        }

    sens = score_sensationalism(text)
    src = score_sourcing(text)
    hedge = score_hedging(text)
    claims = extract_claims(text)
    verdict = compute_verdict(sens["score"], src["score"], hedge["score"])
    signals = build_signals(sens, src, hedge)

    return {
        "scores": {
            "sensationalism": sens["score"],
            "sourcing": src["score"],
            "hedging": hedge["score"],
        },
        "verdict": verdict,
        "signals": signals,
        "claims": claims,
        "meta": {
            "wordCount": len(_words(text)),
            "source": source_label,
            "fetchedTitle": fetched_title,
        },
    }