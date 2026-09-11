"""
URL → clean text + title.
Uses requests + BeautifulSoup with html.parser (no lxml dependency).
Prints debug info to the server terminal so we can see what's happening.
"""

import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse


HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

TIMEOUT = 15
PARSER = "html.parser"


class ScrapeError(Exception):
    pass


def _clean_url(url: str) -> str:
    url = (url or "").strip()
    if not url:
        raise ScrapeError("No URL provided.")
    if not re.match(r"^https?://", url, re.IGNORECASE):
        url = "https://" + url
    parsed = urlparse(url)
    if not parsed.netloc:
        raise ScrapeError("That doesn't look like a valid URL.")
    return url


def _clean_host(url: str) -> str:
    host = urlparse(url).netloc.lower()
    host = host.split(":")[0]
    if host.startswith("www."):
        host = host[4:]
    return host.rstrip(".")


def _log(msg: str) -> None:
    print(f"[SCRAPER] {msg}", flush=True)


# ─────────────────────────────────────────────────────────────
# Extraction
# ─────────────────────────────────────────────────────────────

def _extract_from_scope(scope) -> str:
    parts = []
    for p in scope.find_all("p"):
        t = p.get_text(" ", strip=True)
        t = re.sub(r"\s+", " ", t).strip()
        if len(t) >= 30:
            parts.append(t)
    return "\n\n".join(parts)


def _extract_body(soup: BeautifulSoup) -> str:
    # Try article tag first
    article = soup.find("article")
    if article:
        text = _extract_from_scope(article)
        if len(text) >= 200:
            _log("extracted from <article>")
            return text

    # Try content selectors
    selectors = [
        "#mw-content-text",       # Wikipedia
        "#mw-content-text .mw-parser-output",
        "main",
        "[role=main]",
        "article",
        "div[class*=article-body]",
        "div[class*=articlebody]",
        "div[class*=article-content]",
        "div[class*=story-body]",
        "div[class*=storybody]",
        "div[class*=post-content]",
        "div[class*=entry-content]",
        "div[class*=article]",
        "div[class*=content]",
        "div[class*=story]",
        "div[class*=body]",
        "div[class*=post]",
    ]
    for sel in selectors:
        try:
            found = soup.select_one(sel)
        except Exception:
            found = None
        if found:
            text = _extract_from_scope(found)
            if len(text) >= 200:
                _log(f"extracted from selector: {sel}")
                return text

    # Fallback — grab every <p> on the page
    _log("selector pass failed, using all <p> tags on page")
    text = _extract_from_scope(soup)
    if len(text) >= 200:
        return text

    # Last resort — full visible text
    _log("p-tag pass failed, using full page text")
    all_text = soup.get_text(" ", strip=True)
    all_text = re.sub(r"\s+", " ", all_text).strip()
    return all_text


# ─────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────

def scrape(url: str) -> dict:
    url = _clean_url(url)
    host = _clean_host(url)
    _log(f"fetching: {url}")

    try:
        resp = requests.get(
            url, headers=HEADERS, timeout=TIMEOUT, allow_redirects=True
        )
    except requests.exceptions.Timeout:
        raise ScrapeError(f"{host} took too long to respond.")
    except requests.exceptions.SSLError:
        raise ScrapeError(f"{host} has an SSL problem.")
    except requests.exceptions.ConnectionError:
        raise ScrapeError(f"Couldn't connect to {host}.")
    except requests.exceptions.TooManyRedirects:
        raise ScrapeError(f"{host} redirected too many times.")
    except requests.exceptions.RequestException:
        raise ScrapeError(f"Couldn't reach {host}.")

    _log(f"status={resp.status_code} bytes={len(resp.text)}")

    if resp.status_code == 403:
        raise ScrapeError(
            f"{host} blocked the request. Paste the article text directly instead."
        )
    if resp.status_code == 404:
        raise ScrapeError(f"Page not found on {host}.")
    if resp.status_code == 429:
        raise ScrapeError(f"{host} is rate-limiting. Try again in a moment.")
    if resp.status_code >= 400:
        raise ScrapeError(f"{host} returned status {resp.status_code}.")

    if not resp.text or len(resp.text) < 200:
        raise ScrapeError(f"{host} returned an empty page.")

    # Parse
    try:
        soup = BeautifulSoup(resp.text, PARSER)
    except Exception as e:
        _log(f"parse error: {e}")
        raise ScrapeError(f"Couldn't parse the HTML from {host}.")

    # Title
    title = None
    title_tag = soup.find("title")
    if title_tag:
        title = title_tag.get_text(strip=True)
        for sep in [" | ", " — ", " – ", " - "]:
            if sep in title and len(title) > 40:
                title = title.split(sep)[0].strip()
                break
    _log(f"title: {title}")

    # Kill script/style only — minimal stripping to avoid killing real content
    for tag in soup(["script", "style", "noscript", "svg", "iframe"]):
        tag.decompose()

    text = _extract_body(soup)
    _log(f"final text length: {len(text)}")

    if len(text) < 200:
        raise ScrapeError(
            f"Couldn't extract enough text from {host}. "
            f"Try pasting the article text directly."
        )

    return {"text": text, "title": title, "host": host}