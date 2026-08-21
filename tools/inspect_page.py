#!/usr/bin/env python3
"""
inspect_page.py - inspect one page and print a manifest entry you can copy.

This tool WRITES NOTHING. manifest.js stays hand-maintained; this just does the
tedious part (counting prose, working out read time) and hands you a formatted
line to paste in.

USAGE
    python tools/inspect_page.py                  # pick from a menu
    python tools/inspect_page.py how_magnets_work # inspect directly
    python tools/inspect_page.py --all            # every page, one line each

The menu accepts a number, a filename, or a partial name ("magnet" finds
how_magnets_work.html). Blank input or 'q' quits.
"""

from __future__ import annotations

import argparse
import html
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MANIFEST_JS = ROOT / "assets" / "js" / "manifest.js"

WORDS_PER_MINUTE = 220

# Pages that exist but are never listed in the sidebar.
HIDDEN = {"mcupdates.html", "changelog.html", "vanity_legal.html", "website_legal.html"}


# ---------------------------------------------------------------------------
# Terminal helpers
# ---------------------------------------------------------------------------

class C:
    """ANSI colours. Disabled automatically when output is piped."""
    on = sys.stdout.isatty()
    DIM = "\033[2m" if on else ""
    BOLD = "\033[1m" if on else ""
    ORANGE = "\033[38;5;173m" if on else ""
    GREEN = "\033[38;5;108m" if on else ""
    RED = "\033[38;5;167m" if on else ""
    CYAN = "\033[38;5;109m" if on else ""
    OFF = "\033[0m" if on else ""


def rule(char: str = "-", width: int = 74) -> str:
    return C.DIM + char * width + C.OFF


# ---------------------------------------------------------------------------
# Reading a page
# ---------------------------------------------------------------------------

def js_var(raw: str, name: str) -> str | None:
    m = re.search(rf'\b{name}\s*=\s*"([^"]*)"\s*;', raw)
    return m.group(1) if m else None


DIV_RE = re.compile(
    r'<div\s[^>]*class="[^"]*\bbrewdown\b[^"]*"[^>]*>(.*?)</div>',
    re.DOTALL | re.IGNORECASE,
)
SCRIPT_RE = re.compile(
    r'<script\s[^>]*data-brewdown[^>]*>(.*?)</script>',
    re.DOTALL | re.IGNORECASE,
)
SCRIPT_SRC_RE = re.compile(
    r'<script\s[^>]*data-brewdown\s*=\s*"([^"]+\.md)"[^>]*>\s*</script>',
    re.IGNORECASE,
)


def extract_brewdown(page: Path, raw: str) -> tuple[str, list[str]]:
    """Return (markdown, notes). Handles div-mode, script-mode, and both."""
    parts: list[str] = []
    notes: list[str] = []

    divs = DIV_RE.findall(raw)
    scripts = [m for m in SCRIPT_RE.findall(raw) if m.strip()]
    parts.extend(divs)
    parts.extend(scripts)

    if divs and scripts:
        notes.append("uses BOTH div and script blocks (concatenated)")
    elif scripts:
        notes.append("uses <script data-brewdown> mode")

    for rel in SCRIPT_SRC_RE.findall(raw):
        target = (page.parent / rel).resolve()
        if target.is_file():
            parts.append(target.read_text(encoding="utf-8", errors="replace"))
            notes.append(f"pulled external markdown: {rel}")
        else:
            notes.append(f"MISSING external markdown: {rel}")

    md = "\n\n".join(parts)

    # Some pages (brewdown.html) are hand-written HTML with only a tiny trailing
    # <div class="brewdown">::signature::</div>. Counting that gives 0 words and
    # a useless read time, so fall back to the rendered <main> body instead.
    if len(md.strip()) < 200:
        body = re.search(r"<main\b[^>]*>(.*?)</main>", raw, re.DOTALL | re.IGNORECASE)
        if body:
            md = body.group(1)
            notes.append("hand-written HTML page - counted rendered <main> body")

    return md, notes


# ---------------------------------------------------------------------------
# Counting
# ---------------------------------------------------------------------------

FENCED_CODE_RE = re.compile(r"```.*?```", re.DOTALL)
INLINE_CODE_RE = re.compile(r"`[^`]*`")
HTML_TAG_RE = re.compile(r"<[^>]+>")
IMAGE_RE = re.compile(r"!\[[^\]]*\]\([^)]*\)")
LINK_RE = re.compile(r"\[([^\]]*)\]\([^)]*\)")
COPY_RE = re.compile(r"\^\^(.*?)\^\^", re.DOTALL)
TOKEN_RE = re.compile(r"::[a-z_]+::", re.IGNORECASE)
DATE_TOKEN_RE = re.compile(r"@@[^@]+@@")
COLLAPSE_RE = re.compile(r"^\s*(>>>|<<<)", re.MULTILINE)
HEADING_RE = re.compile(r"^\s{0,3}(#{1,6})\s+(.+)$", re.MULTILINE)
HEADING_HASH_RE = re.compile(r"^\s{0,3}#{1,6}\s+", re.MULTILINE)
TABLE_PIPE_RE = re.compile(r"^\s*\|[-:\s|]+\|\s*$", re.MULTILINE)
EMPHASIS_RE = re.compile(r"[*_~]{1,3}")
WORD_RE = re.compile(r"[A-Za-z0-9][A-Za-z0-9'’-]*")


def count_words(md: str) -> int:
    """Prose words only - code blocks, markup and ::tokens:: are stripped."""
    t = html.unescape(md)
    t = FENCED_CODE_RE.sub(" ", t)
    t = INLINE_CODE_RE.sub(" ", t)
    t = IMAGE_RE.sub(" ", t)
    t = LINK_RE.sub(r"\1", t)
    t = COPY_RE.sub(r"\1", t)
    t = TOKEN_RE.sub(" ", t)
    t = DATE_TOKEN_RE.sub(" ", t)
    t = HTML_TAG_RE.sub(" ", t)
    t = COLLAPSE_RE.sub(" ", t)
    t = HEADING_HASH_RE.sub(" ", t)
    t = TABLE_PIPE_RE.sub(" ", t)
    t = EMPHASIS_RE.sub(" ", t)
    return len(WORD_RE.findall(t))


def read_minutes(words: int) -> int:
    return 0 if words <= 0 else max(1, round(words / WORDS_PER_MINUTE + 0.4999))


def _today() -> str:
    from datetime import date as _d
    return _d.today().strftime("%Y.%m.%d")


def git_date(name: str) -> str | None:
    try:
        out = subprocess.run(
            ["git", "log", "-1", "--format=%cs", "--", name],
            cwd=ROOT, capture_output=True, text=True, check=True, encoding="utf-8",
        ).stdout.strip()
        return out.replace("-", ".") if out else None
    except (subprocess.CalledProcessError, FileNotFoundError):
        return None


def manifest_entry(name: str) -> dict[str, str] | None:
    """Read the page's CURRENT manifest.js entry, if it has one."""
    if not MANIFEST_JS.is_file():
        return None
    raw = MANIFEST_JS.read_text(encoding="utf-8")
    m = re.search(rf'"{re.escape(name)}"\s*:\s*\{{(.*?)\}}', raw, re.DOTALL)
    if not m:
        return None
    body = m.group(1)
    out = {}
    for k in ("title", "icon", "section", "date"):
        v = re.search(rf'\b{k}\s*:\s*"([^"]*)"', body)
        if v:
            out[k] = v.group(1)
    for k in ("words", "minutes"):
        v = re.search(rf'\b{k}\s*:\s*(\d+)', body)
        if v:
            out[k] = v.group(1)
    return out


# ---------------------------------------------------------------------------
# Report
# ---------------------------------------------------------------------------

def inspect(page: Path, quiet: bool = False) -> str:
    """Print a full report for one page. Returns the manifest line."""
    raw = page.read_text(encoding="utf-8", errors="replace")
    name = page.name

    title = js_var(raw, "title") or "(no title var)"
    icon = js_var(raw, "icon") or "📄"
    section = js_var(raw, "section") or "(no section var)"
    image = js_var(raw, "image") or "(none)"

    md, notes = extract_brewdown(page, raw)
    words = count_words(md)
    mins = read_minutes(words)
    headings = HEADING_RE.findall(md)
    images = len(IMAGE_RE.findall(md))
    code = len(FENCED_CODE_RE.findall(md))
    gdate = git_date(name)
    existing = manifest_entry(name)

    # Date for the copy line, in order of preference:
    #   1. whatever manifest.js already says (hand-set values win - git dates
    #      drift when a site-wide sweep touches every file)
    #   2. the git last-commit date, for a page that has one
    #   3. today, for a brand-new untracked page
    date = (existing or {}).get("date") or gdate or _today()

    # The line to copy. Field order matches the existing manifest.js format.
    line = (
        f'    "{name}": {{ title: "{title}", icon: "{icon}", '
        f'section: "{section}", date: "{date}", '
        f'words: {words}, minutes: {mins} }},'
    )

    if quiet:
        return line

    print()
    print(rule("="))
    print(f"{C.BOLD}{icon}  {title}{C.OFF}   {C.DIM}{name}{C.OFF}")
    print(rule("="))

    print(f"\n{C.CYAN}DECLARED IN PAGE{C.OFF}")
    print(f"  title    {title}")
    print(f"  icon     {icon}")
    print(f"  section  {section}")
    print(f"  image    {image}")

    print(f"\n{C.CYAN}COUNTED FROM CONTENT{C.OFF}")
    print(f"  words    {C.BOLD}{words:,}{C.OFF}   {C.DIM}(prose only; code blocks excluded){C.OFF}")
    print(f"  minutes  {C.BOLD}{mins}{C.OFF}   {C.DIM}at {WORDS_PER_MINUTE} wpm{C.OFF}")
    print(f"  headings {len(headings)}   {C.DIM}H1-H6{C.OFF}")
    print(f"  images   {images}")
    print(f"  code     {code} block(s)")
    print(f"  source   {len(md):,} chars of brewdown")

    print(f"\n{C.CYAN}DATES{C.OFF}")
    print(f"  git last commit   {gdate or '(untracked)'}")
    if existing and existing.get("date"):
        cur = existing["date"]
        flag = ""
        if gdate and cur != gdate:
            flag = f"   {C.DIM}(differs from git){C.OFF}"
        print(f"  manifest.js       {cur}{flag}")
    else:
        print(f"  manifest.js       {C.DIM}(no entry yet){C.OFF}")
        src = "git" if gdate else "today - page is untracked"
        print(f"  using             {C.BOLD}{date}{C.OFF}   {C.DIM}({src}){C.OFF}")

    if existing:
        deltas = []
        if existing.get("words") and int(existing["words"]) != words:
            deltas.append(f"words {existing['words']} -> {words}")
        if existing.get("minutes") and int(existing["minutes"]) != mins:
            deltas.append(f"minutes {existing['minutes']} -> {mins}")
        if existing.get("title") and existing["title"] != title:
            deltas.append(f"title \"{existing['title']}\" -> \"{title}\"")
        if deltas:
            print(f"\n{C.ORANGE}CHANGED SINCE MANIFEST{C.OFF}")
            for d in deltas:
                print(f"  {d}")
        else:
            print(f"\n{C.GREEN}manifest.js is up to date for this page{C.OFF}")

    if notes:
        print(f"\n{C.ORANGE}NOTES{C.OFF}")
        for n in notes:
            print(f"  - {n}")

    if headings:
        print(f"\n{C.CYAN}OUTLINE{C.OFF}")
        for hashes, text in headings[:14]:
            depth = len(hashes)
            text = EMPHASIS_RE.sub("", text).strip()
            print(f"  {C.DIM}{'  ' * (depth - 1)}{'#' * depth}{C.OFF} {text[:58]}")
        if len(headings) > 14:
            print(f"  {C.DIM}... {len(headings) - 14} more{C.OFF}")

    print(f"\n{C.CYAN}MANIFEST LINE{C.OFF}  {C.DIM}(copy below){C.OFF}")
    print(rule())
    print(line)
    print(rule())
    return line


# ---------------------------------------------------------------------------
# Page selection
# ---------------------------------------------------------------------------

def all_pages() -> list[Path]:
    return sorted(p for p in ROOT.glob("*.html") if p.name not in HIDDEN)


def resolve(query: str, pages: list[Path]) -> Path | None:
    q = query.strip().lower()
    if not q:
        return None

    if q.isdigit():
        i = int(q) - 1
        return pages[i] if 0 <= i < len(pages) else None

    if not q.endswith(".html"):
        q_html = q + ".html"
    else:
        q_html = q

    for p in pages:
        if p.name.lower() == q_html:
            return p

    matches = [p for p in pages if q.replace(".html", "") in p.stem.lower()]
    if len(matches) == 1:
        return matches[0]
    if len(matches) > 1:
        print(f"\n{C.ORANGE}'{query}' matches {len(matches)} pages:{C.OFF}")
        for p in matches:
            print(f"  {p.name}")
        return None

    print(f"\n{C.RED}no page matching '{query}'{C.OFF}")
    return None


def show_menu(pages: list[Path]) -> None:
    print(f"\n{C.BOLD}PAGES{C.OFF}  {C.DIM}({len(pages)} total){C.OFF}")
    print(rule())
    half = (len(pages) + 1) // 2
    for i in range(half):
        left = f"{C.DIM}{i+1:>2}{C.OFF} {pages[i].stem}"
        pad = " " * max(0, 34 - len(pages[i].stem))
        if i + half < len(pages):
            j = i + half
            right = f"{C.DIM}{j+1:>2}{C.OFF} {pages[j].stem}"
            print(f"  {left}{pad}{right}")
        else:
            print(f"  {left}")
    print(rule())


def main() -> int:
    ap = argparse.ArgumentParser(description="Inspect a page and print a manifest entry.")
    ap.add_argument("page", nargs="?", help="page name or partial match")
    ap.add_argument("--all", action="store_true", help="print a manifest line for every page")
    args = ap.parse_args()

    for s in (sys.stdout, sys.stderr):
        if hasattr(s, "reconfigure"):
            s.reconfigure(encoding="utf-8", errors="replace")

    pages = all_pages()
    if not pages:
        print("no .html pages found", file=sys.stderr)
        return 1

    if args.all:
        print("window.MANIFEST = {")
        for p in pages:
            print(inspect(p, quiet=True))
        print("};")
        return 0

    if args.page:
        page = resolve(args.page, pages)
        if not page:
            return 1
        inspect(page)
        input(f"\n{C.DIM}press Enter to exit{C.OFF} ")
        return 0

    # Interactive loop.
    while True:
        show_menu(pages)
        try:
            choice = input(f"{C.ORANGE}page{C.OFF} {C.DIM}(number, name, or q to quit){C.OFF} > ")
        except (EOFError, KeyboardInterrupt):
            print()
            return 0

        if choice.strip().lower() in ("q", "quit", "exit", ""):
            return 0

        page = resolve(choice, pages)
        if page:
            inspect(page)
            try:
                input(f"\n{C.DIM}press Enter for the menu, Ctrl+C to quit{C.OFF} ")
            except (EOFError, KeyboardInterrupt):
                print()
                return 0


if __name__ == "__main__":
    raise SystemExit(main())
