#!/usr/bin/env python3
"""
inspect_paper.py - inspect one paper, check for sidebar drift, rebuild the nav.

This tool WRITES NOTHING. index.html stays hand-maintained; this prints the
things you'd otherwise compute by hand.

USAGE
    python tools/inspect_paper.py                  # pick from a menu
    python tools/inspect_paper.py urbex_safety     # inspect directly
    python tools/inspect_paper.py /hi              # alias for index
    python tools/inspect_paper.py --all            # every paper, one sidebar line each
    python tools/inspect_paper.py --drift          # only papers whose sidebar entry is stale
    python tools/inspect_paper.py --build          # rebuild the whole <nav> block
    python tools/inspect_paper.py /drift           # same as --drift
    python tools/inspect_paper.py /build           # same as --build

Slash commands are plain strings starting with "/" - see SLASH_COMMANDS below.

The menu accepts a number, a slug, a slash command, or a partial name
("magnet" finds how_magnets_work directly). Blank input or 'q' quits.
"""

from __future__ import annotations

import argparse
import html
import re
import subprocess
import sys
from datetime import date as _date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAPERS_DIR = ROOT / "papers"
INDEX_HTML = ROOT / "index.html"

WORDS_PER_MINUTE = 220

# Papers that exist in papers/ but are intentionally not linked in the sidebar.
# The drift report ignores them.
HIDDEN: set[str] = {"mcupdates", "vanitys_personality"}

# Slash commands accepted by resolve(). A value that looks like a slug is
# returned as-is and inspected. A value wrapped in __x__ is a sentinel the
# caller handles specially (a mode, not a paper).
SLASH_COMMANDS: dict[str, str] = {
    "/hi":    "index",
    "/home":  "index",
    "/drift": "__drift__",
    "/build": "__build__",
}


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
# Reading the sidebar in index.html
# ---------------------------------------------------------------------------

SIDEBAR_LINK_RE = re.compile(
    r'<a\s+href="\?paper=(?P<slug>[a-z0-9_]+)"'
    r'(?P<attrs>[^>]*)>'
    r'(?P<text>.*?)'
    r'</a>',
    re.IGNORECASE | re.DOTALL,
)

SECTION_RE = re.compile(
    r'<h3>\s*<span class="sec-name">(?P<name>[^<]*)</span>.*?</h3>\s*'
    r'<ul>(?P<body>.*?)</ul>',
    re.DOTALL,
)

LI_RE = re.compile(r'<li>\s*(?P<inner>.*?)\s*</li>', re.DOTALL)


def attr(attrs: str, name: str) -> str | None:
    m = re.search(rf'\b{name}\s*=\s*"([^"]*)"', attrs)
    return m.group(1) if m else None


def load_sidebar() -> dict[str, dict]:
    """
    Parse index.html and return {slug: {date, words, minutes, text, icon, title}}.

    The text inside the <a> is "ICON TITLE" (e.g. "🏚️ How to Urbex Safely").
    We split it into the first token (icon) and the rest (title).
    """
    if not INDEX_HTML.is_file():
        return {}

    raw = INDEX_HTML.read_text(encoding="utf-8", errors="replace")
    nav = re.search(r"<nav\b[^>]*\bsidebar-nav\b[^>]*>(.*?)</nav>",
                    raw, re.DOTALL | re.IGNORECASE)
    if not nav:
        return {}

    out: dict[str, dict] = {}
    for m in SIDEBAR_LINK_RE.finditer(nav.group(1)):
        slug = m.group("slug")
        attrs = m.group("attrs") or ""
        text = re.sub(r"\s+", " ", m.group("text")).strip()

        parts = text.split(" ", 1)
        icon = parts[0] if parts else ""
        title = parts[1] if len(parts) > 1 else ""

        out[slug] = {
            "date":    attr(attrs, "data-date"),
            "words":   attr(attrs, "data-words"),
            "minutes": attr(attrs, "data-minutes"),
            "text":    text,
            "icon":    icon,
            "title":   title,
        }
    return out


# ---------------------------------------------------------------------------
# Reading a paper
# ---------------------------------------------------------------------------

FIRST_LINE_RE = re.compile(r"^#\s+(\S+)\s+(.+?)\s*$")


def parse_first_line(md: str) -> tuple[str, str] | None:
    """Return (icon, title) from the paper's first "# <emoji> <Title>" line."""
    first = md.split("\n", 1)[0]
    m = FIRST_LINE_RE.match(first)
    if not m:
        return None
    return m.group(1), m.group(2)


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


def count_words(md: str, is_changelog: bool = False) -> int:
    t = html.unescape(md)

    if is_changelog:
        # Unwrap fenced blocks: drop the ``` fences and language tags, keep
        # the content. Then INLINE_CODE_RE won't chew the fences apart.
        t = re.sub(r"^```[^\n]*\n", "", t, flags=re.MULTILINE)  # opening fence line
        t = re.sub(r"^```\s*$", "", t, flags=re.MULTILINE)      # closing fence line
    else:
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
    return _date.today().strftime("%Y.%m.%d")


def git_date(slug: str) -> str | None:
    try:
        out = subprocess.run(
            ["git", "log", "-1", "--format=%cs", "--", f"papers/{slug}.md"],
            cwd=ROOT, capture_output=True, text=True, check=True, encoding="utf-8",
        ).stdout.strip()
        return out.replace("-", ".") if out else None
    except (subprocess.CalledProcessError, FileNotFoundError):
        return None


# ---------------------------------------------------------------------------
# Report: one paper
# ---------------------------------------------------------------------------

def inspect(slug: str, sidebar: dict[str, dict], quiet: bool = False) -> str:
    """Print a full report for one paper. Returns the sidebar line to copy."""
    path = PAPERS_DIR / f"{slug}.md"
    md = path.read_text(encoding="utf-8", errors="replace")
    md_first_line = parse_first_line(md)
    md_icon, md_title = md_first_line if md_first_line else ("(no first line)", "(no title)")

    entry = sidebar.get(slug)

    words = count_words(md, is_changelog=(slug == "changelog"))
    mins = read_minutes(words)
    headings = HEADING_RE.findall(md)
    images = len(IMAGE_RE.findall(md))
    code = len(FENCED_CODE_RE.findall(md))
    gdate = git_date(slug)

    date = (entry or {}).get("date") or gdate or _today()

    line = (
        f'        <li><a href="?paper={slug}"'
        f'{" " + "data-date=\"" + date + "\"" if date else ""}'
        f' data-words="{words}" data-minutes="{mins}">'
        f'{md_icon} {md_title}</a></li>'
    )

    if quiet:
        return line

    print()
    print(rule("="))
    print(f"{C.BOLD}{md_icon}  {md_title}{C.OFF}   {C.DIM}papers/{slug}.md{C.OFF}")
    print(rule("="))

    print(f"\n{C.CYAN}DECLARED IN PAPER (first line){C.OFF}")
    print(f"  icon     {md_icon}")
    print(f"  title    {md_title}")

    if entry:
        print(f"\n{C.CYAN}DECLARED IN SIDEBAR{C.OFF}")
        print(f"  icon     {entry['icon']}")
        print(f"  title    {entry['title']}")
        print(f"  date     {entry['date'] or '(none)'}")
        print(f"  words    {entry['words'] or '(none)'}")
        print(f"  minutes  {entry['minutes'] or '(none)'}")
    else:
        print(f"\n{C.RED}NO SIDEBAR ENTRY for '{slug}'{C.OFF}")

    print(f"\n{C.CYAN}COUNTED FROM CONTENT{C.OFF}")
    note = "(entire paper counted - changelog)" if slug == "changelog" \
           else "(prose only; code blocks excluded)"
    print(f"  words    {C.BOLD}{words:,}{C.OFF}   {C.DIM}{note}{C.OFF}")
    print(f"  minutes  {C.BOLD}{mins}{C.OFF}   {C.DIM}at {WORDS_PER_MINUTE} wpm{C.OFF}")
    print(f"  headings {len(headings)}   {C.DIM}H1-H6{C.OFF}")
    print(f"  images   {images}")
    print(f"  code     {code} block(s)")
    print(f"  source   {len(md):,} chars of markdown")

    print(f"\n{C.CYAN}DATES{C.OFF}")
    print(f"  git last commit   {gdate or '(untracked)'}")
    if entry and entry.get("date"):
        cur = entry["date"]
        flag = f"   {C.DIM}(differs from git){C.OFF}" if (gdate and cur != gdate) else ""
        print(f"  sidebar           {cur}{flag}")
    else:
        print(f"  sidebar           {C.DIM}(none){C.OFF}")
        src = "git" if gdate else "today - paper is untracked"
        print(f"  using             {C.BOLD}{date}{C.OFF}   {C.DIM}({src}){C.OFF}")

    if entry:
        deltas: list[str] = []
        if entry.get("icon") and entry["icon"] != md_icon:
            deltas.append(f'icon     "{entry["icon"]}" -> "{md_icon}"')
        if entry.get("title") and entry["title"] != md_title:
            deltas.append(f'title    "{entry["title"]}" -> "{md_title}"')
        if entry.get("words") and int(entry["words"]) != words:
            deltas.append(f'words    {entry["words"]} -> {words}')
        if entry.get("minutes") and int(entry["minutes"]) != mins:
            deltas.append(f'minutes  {entry["minutes"]} -> {mins}')
        if deltas:
            print(f"\n{C.ORANGE}DRIFT (sidebar vs. paper){C.OFF}")
            for d in deltas:
                print(f"  {d}")
        else:
            print(f"\n{C.GREEN}sidebar is up to date for this paper{C.OFF}")

    if headings:
        print(f"\n{C.CYAN}OUTLINE{C.OFF}")
        for hashes, text in headings[:14]:
            depth = len(hashes)
            text = EMPHASIS_RE.sub("", text).strip()
            print(f"  {C.DIM}{'  ' * (depth - 1)}{'#' * depth}{C.OFF} {text[:58]}")
        if len(headings) > 14:
            print(f"  {C.DIM}... {len(headings) - 14} more{C.OFF}")

    print(f"\n{C.CYAN}SIDEBAR LINE{C.OFF}  {C.DIM}(copy below){C.OFF}")
    print(rule())
    print(line)
    print(rule())
    return line


# ---------------------------------------------------------------------------
# Report: drift across all papers
# ---------------------------------------------------------------------------

def orphans(slugs: list[str], sidebar: dict[str, dict]) -> tuple[list[str], list[str]]:
    """Return (papers not in sidebar, sidebar links not in papers).
    Papers in HIDDEN are excluded from the 'missing' side."""
    md_set = set(slugs) - HIDDEN
    sb_set = set(sidebar.keys())
    return sorted(md_set - sb_set), sorted(sb_set - md_set)


def drift_report(slugs: list[str], sidebar: dict[str, dict]) -> int:
    """
    Walk every paper, compare against the sidebar, and print only the ones
    that disagree. Returns the number of problems (0 = all clean).
    """
    missing, extra = orphans(slugs, sidebar)
    drift_count = 0

    for slug in slugs:
        path = PAPERS_DIR / f"{slug}.md"
        md = path.read_text(encoding="utf-8", errors="replace")
        parsed = parse_first_line(md)
        entry = sidebar.get(slug)

        if not entry:
            continue  # already reported by orphans() (or in HIDDEN)

        if not parsed:
            print(f"\n{C.RED}{slug}{C.OFF}  {C.DIM}(no first line in papers/{slug}.md){C.OFF}")
            drift_count += 1
            continue

        md_icon, md_title = parsed
        words = count_words(md, is_changelog=(slug == "changelog"))
        mins = read_minutes(words)

        deltas: list[str] = []
        if entry.get("icon") and entry["icon"] != md_icon:
            deltas.append(f'  icon     sidebar "{entry["icon"]}"  ->  paper "{md_icon}"')
        if entry.get("title") and entry["title"] != md_title:
            deltas.append(f'  title    sidebar "{entry["title"]}"  ->  paper "{md_title}"')
        if entry.get("words") and int(entry["words"]) != words:
            deltas.append(f'  words    sidebar {entry["words"]}  ->  paper {words}')
        if entry.get("minutes") and int(entry["minutes"]) != mins:
            deltas.append(f'  minutes  sidebar {entry["minutes"]}  ->  paper {mins}')

        if deltas:
            print(f"\n{C.ORANGE}{slug}{C.OFF}")
            for d in deltas:
                print(d)
            drift_count += 1

    print()
    print(rule("="))
    if missing:
        print(f"{C.RED}PAPERS WITHOUT A SIDEBAR ENTRY ({len(missing)}){C.OFF}")
        for s in missing:
            print(f"  {s}")
    if extra:
        print(f"{C.RED}SIDEBAR LINKS WITHOUT A PAPER ({len(extra)}){C.OFF}")
        for s in extra:
            print(f"  {s}")
    if not (missing or extra or drift_count):
        print(f"{C.GREEN}clean: no drift, no orphans{C.OFF}")
    else:
        print(f"{C.ORANGE}{drift_count} drifted, "
              f"{len(missing)} missing, {len(extra)} orphaned{C.OFF}")
    print(rule("="))

    return drift_count + len(missing) + len(extra)


# ---------------------------------------------------------------------------
# Report: rebuild the whole <nav> block
# ---------------------------------------------------------------------------

def build_nav(sidebar: dict[str, dict]) -> str:
    """
    Rebuild the whole <nav class="sidebar-nav"> block.

    Section order and paper order come from the current sidebar in index.html,
    so nothing is reordered - only the numbers, dates and icon/title are
    refreshed from each paper's markdown.
    """
    if not INDEX_HTML.is_file():
        return ""

    raw = INDEX_HTML.read_text(encoding="utf-8", errors="replace")
    nav_match = re.search(
        r'(<nav\b[^>]*\bsidebar-nav\b[^>]*>)(.*?)(</nav>)',
        raw, re.DOTALL | re.IGNORECASE,
    )
    if not nav_match:
        return ""
    nav_open, nav_body, nav_close = nav_match.groups()

    out_lines: list[str] = [nav_open]

    for sec in SECTION_RE.finditer(nav_body):
        name = sec.group("name")
        body = sec.group("body")

        slugs_in_order: list[str] = []
        for li in LI_RE.finditer(body):
            href = re.search(r'href="\?paper=([a-z0-9_]+)"', li.group("inner"))
            if href:
                slugs_in_order.append(href.group(1))

        new_items: list[str] = []
        for slug in slugs_in_order:
            path = PAPERS_DIR / f"{slug}.md"
            if not path.is_file():
                new_items.append(
                    f'        <li><a href="?paper={slug}" '
                    f'data-date="?" data-words="0" data-minutes="0">'
                    f'(missing) {slug}</a></li>'
                )
                continue

            md = path.read_text(encoding="utf-8", errors="replace")
            parsed = parse_first_line(md)
            icon, title = parsed if parsed else ("📄", slug)
            words = count_words(md, is_changelog=(slug == "changelog"))
            mins = read_minutes(words)

            # Date preference: git last-commit on the paper, else the old
            # sidebar value, else today. --build refreshes dates too.
            gdate = git_date(slug)
            date = gdate or (sidebar.get(slug) or {}).get("date") or _today()

            new_items.append(
                f'        <li><a href="?paper={slug}" '
                f'data-date="{date}" '
                f'data-words="{words}" '
                f'data-minutes="{mins}">'
                f'{icon} {title}</a></li>'
            )

        count = f"{len(new_items):02d}"
        out_lines.append(
            f'      <h3><span class="sec-name">{name}</span>'
            f'<span class="sec-rule"></span>'
            f'<span class="sec-count">{count}</span></h3>'
        )
        out_lines.append('      <ul>')
        out_lines.extend(new_items)
        out_lines.append('      </ul>')

    out_lines.append('    ' + nav_close)
    return '\n'.join(out_lines)


def build_report(sidebar: dict[str, dict], slugs: list[str]) -> int:
    """Print the rebuilt <nav> block. Returns 0 on success, 1 on failure."""
    block = build_nav(sidebar)
    if not block:
        print(f'{C.RED}could not find a <nav class="sidebar-nav"> in index.html{C.OFF}')
        return 1

    missing, extra = orphans(slugs, sidebar)
    if missing or extra:
        print(f"\n{C.ORANGE}note:{C.OFF}")
        if missing:
            print(f"  {len(missing)} paper(s) with no sidebar entry: {', '.join(missing)}")
        if extra:
            print(f"  {len(extra)} sidebar link(s) with no paper: {', '.join(extra)}")
        print(f"{C.DIM}  the built nav only includes papers currently linked in index.html{C.OFF}")

    print()
    print(rule("="))
    print(f"{C.CYAN}REBUILT <nav> BLOCK{C.OFF}  {C.DIM}(paste over the old one in index.html){C.OFF}")
    print(rule("="))
    print(block)
    print(rule("="))
    return 0


# ---------------------------------------------------------------------------
# Paper selection
# ---------------------------------------------------------------------------

def all_slugs() -> list[str]:
    return sorted(p.stem for p in PAPERS_DIR.glob("*.md"))


def resolve(query: str, slugs: list[str]) -> str | None:
    """
    Turn a user query into a slug. Handles numbers, slugs, partial matches,
    and slash commands. Returns a slug, a sentinel string, or None.
    """
    q = query.strip().lower()
    if not q:
        return None

    if q.startswith("/"):
        if q in SLASH_COMMANDS:
            return SLASH_COMMANDS[q]
        print(f"\n{C.RED}unknown command '{query}'{C.OFF}")
        print(f"{C.DIM}available: {', '.join(sorted(SLASH_COMMANDS))}{C.OFF}")
        return None

    if q.isdigit():
        i = int(q) - 1
        return slugs[i] if 0 <= i < len(slugs) else None

    if q in slugs:
        return q

    matches = [s for s in slugs if q in s]
    if len(matches) == 1:
        return matches[0]
    if len(matches) > 1:
        print(f"\n{C.ORANGE}'{query}' matches {len(matches)} papers:{C.OFF}")
        for s in matches:
            print(f"  {s}")
        return None

    print(f"\n{C.RED}no paper matching '{query}'{C.OFF}")
    return None


def show_menu(slugs: list[str]) -> None:
    print(f"\n{C.BOLD}PAPERS{C.OFF}  {C.DIM}({len(slugs)} total){C.OFF}")
    print(rule())
    half = (len(slugs) + 1) // 2
    for i in range(half):
        left = f"{C.DIM}{i+1:>2}{C.OFF} {slugs[i]}"
        pad = " " * max(0, 34 - len(slugs[i]))
        if i + half < len(slugs):
            j = i + half
            right = f"{C.DIM}{j+1:>2}{C.OFF} {slugs[j]}"
            print(f"  {left}{pad}{right}")
        else:
            print(f"  {left}")
    print(rule())
    print(f"{C.DIM}commands: {', '.join(sorted(SLASH_COMMANDS))}{C.OFF}")


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main() -> int:
    ap = argparse.ArgumentParser(
        description="Inspect a paper, check for sidebar drift, or rebuild the nav."
    )
    ap.add_argument("paper", nargs="?", help="paper slug, /command, or partial match")
    ap.add_argument("--all", action="store_true",
                    help="print a sidebar line for every paper")
    ap.add_argument("--drift", action="store_true",
                    help="report only papers with drift")
    ap.add_argument("--build", action="store_true",
                    help="rebuild the whole sidebar <nav> block with fresh numbers")
    args = ap.parse_args()

    for s in (sys.stdout, sys.stderr):
        if hasattr(s, "reconfigure"):
            s.reconfigure(encoding="utf-8", errors="replace")

    slugs = all_slugs()
    if not slugs:
        print("no .md papers found in papers/", file=sys.stderr)
        return 1

    sidebar = load_sidebar()
    if not sidebar:
        print(f"{C.RED}warning: no sidebar entries found in index.html{C.OFF}",
              file=sys.stderr)

    if args.all:
        print("<!-- sidebar entries -->")
        for s in slugs:
            print(inspect(s, sidebar, quiet=True))
        return 0

    if args.drift:
        return 1 if drift_report(slugs, sidebar) else 0

    if args.build:
        return build_report(sidebar, slugs)

    if args.paper:
        target = resolve(args.paper, slugs)
        if not target:
            return 1
        if target == "__drift__":
            return 1 if drift_report(slugs, sidebar) else 0
        if target == "__build__":
            return build_report(sidebar, slugs)
        inspect(target, sidebar)
        try:
            input(f"\n{C.DIM}press Enter to exit{C.OFF} ")
        except (EOFError, KeyboardInterrupt):
            print()
        return 0

    # Interactive loop.
    while True:
        show_menu(slugs)
        try:
            choice = input(
                f"{C.ORANGE}paper{C.OFF} {C.DIM}(number, slug, /command, or q to quit){C.OFF} > "
            )
        except (EOFError, KeyboardInterrupt):
            print()
            return 0

        if choice.strip().lower() in ("q", "quit", "exit", ""):
            return 0

        target = resolve(choice, slugs)
        if not target:
            continue

        if target == "__drift__":
            drift_report(slugs, sidebar)
        elif target == "__build__":
            build_report(sidebar, slugs)
        else:
            inspect(target, sidebar)

        try:
            input(f"\n{C.DIM}press Enter for the menu, Ctrl+C to quit{C.OFF} ")
        except (EOFError, KeyboardInterrupt):
            print()
            return 0


if __name__ == "__main__":
    raise SystemExit(main())