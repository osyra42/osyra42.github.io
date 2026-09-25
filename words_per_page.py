"""
inspect_paper.py - inspect papers, check CSV drift, rebuild CSV rows.

This tool WRITES NOTHING. site_navigation.csv stays hand-maintained; this
prints the things you'd otherwise compute by hand.

Change SCAN_MODE below to pick what runs, then run the script. There is one
launch path: whatever SCAN_MODE says. The script always pauses at the end so
the window stays open.

SCAN_MODE options:
    "full"  -> scan every paper; unchanged ones are greyed out
    "drift" -> show only papers whose CSV entry is stale or missing
    "all"   -> print one CSV row per paper
    "build" -> rebuild the whole CSV

USAGE
    py inspect_paper.py
"""

from __future__ import annotations

import csv
import html
import re
import subprocess
import sys
from datetime import date as _date
from io import StringIO
from pathlib import Path


# ============================================================================
# CONFIGURATION
# ============================================================================

# What to run when you launch the script. Change this line, save, run.
SCAN_MODE = "full"

# Where the script lives (the website root).
ROOT = Path(__file__).resolve().parent
PAPERS_DIR = ROOT / "papers"
SITE_NAVIGATION_CSV = ROOT / "site_navigation.csv"

# Reading speed for the "minutes" estimate.
WORDS_PER_MINUTE = 220

# Papers that exist in papers/ but are intentionally not listed in the CSV.
HIDDEN: set[str] = {"mcupdates", "vanitys_personality"}


# ============================================================================
# Terminal helpers
# ============================================================================

class C:
    """ANSI colours. Disabled automatically when output is piped."""
    on = sys.stdout.isatty()
    DIM    = "\033[2m" if on else ""
    BOLD   = "\033[1m" if on else ""
    ORANGE = "\033[38;5;173m" if on else ""
    GREEN  = "\033[38;5;108m" if on else ""
    RED    = "\033[38;5;167m" if on else ""
    CYAN   = "\033[38;5;109m" if on else ""
    OFF    = "\033[0m" if on else ""


def rule(char: str = "-", width: int = 74) -> str:
    return C.DIM + char * width + C.OFF


def pause() -> None:
    """Wait for Enter so the window stays open."""
    try:
        input(f"\n{C.DIM}press Enter to exit{C.OFF} ")
    except (EOFError, KeyboardInterrupt):
        print()


# ============================================================================
# CSV helpers
# ============================================================================

CSV_FIELDS = {
    "category", "icon", "title", "href",
    "paper", "date", "words", "minutes",
}


def clean(value: str | None) -> str:
    return (value or "").strip()


def csv_int(value: str | None) -> int | None:
    try:
        return int(clean(value))
    except (TypeError, ValueError):
        return None


def csv_row(values: list[str]) -> str:
    buffer = StringIO()
    writer = csv.writer(buffer, lineterminator="")
    writer.writerow(values)
    return buffer.getvalue()


def load_sidebar() -> dict[str, dict[str, str]]:
    """Read site_navigation.csv and return {paper_slug: row_data}."""
    if not SITE_NAVIGATION_CSV.is_file():
        return {}

    with SITE_NAVIGATION_CSV.open(encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file, skipinitialspace=True)

        fieldnames = {
            clean(name).lower()
            for name in (reader.fieldnames or [])
            if name
        }
        missing = CSV_FIELDS - fieldnames
        if missing:
            expected = ", ".join(sorted(CSV_FIELDS))
            found = ", ".join(sorted(fieldnames)) or "(none)"
            raise ValueError(
                f"{SITE_NAVIGATION_CSV.name} is missing column(s): "
                f"{', '.join(sorted(missing))}. "
                f"Expected: {expected}. Found: {found}."
            )

        out: dict[str, dict[str, str]] = {}
        for line_number, raw_row in enumerate(reader, start=2):
            row = {
                clean(key).lower(): clean(value)
                for key, value in raw_row.items()
                if key is not None
            }
            slug = row["paper"]
            if not slug:
                print(
                    f"{C.ORANGE}warning:{C.OFF} "
                    f"{SITE_NAVIGATION_CSV.name}:{line_number} has no paper slug; skipping",
                    file=sys.stderr,
                )
                continue
            if slug in out:
                print(
                    f"{C.ORANGE}warning:{C.OFF} duplicate paper slug "
                    f"'{slug}' in {SITE_NAVIGATION_CSV.name}:{line_number}; "
                    f"using the later row",
                    file=sys.stderr,
                )
            out[slug] = {
                "category": row["category"],
                "icon":     row["icon"],
                "title":    row["title"],
                "href":     row["href"],
                "paper":    slug,
                "date":     row["date"],
                "words":    row["words"],
                "minutes":  row["minutes"],
            }

    return out


# ============================================================================
# Paper parsing
# ============================================================================

FIRST_LINE_RE = re.compile(r"^#\s+(\S+)\s+(.+?)\s*$")


def parse_first_line(md: str) -> tuple[str, str] | None:
    """Return (icon, title) from the paper's first '# <emoji> <Title>' line."""
    first = md.split("\n", 1)[0]
    m = FIRST_LINE_RE.match(first)
    if not m:
        return None
    return m.group(1), m.group(2)


# ============================================================================
# Word counting
# ============================================================================

FENCED_CODE_RE  = re.compile(r"```.*?```", re.DOTALL)
INLINE_CODE_RE  = re.compile(r"`[^`]*`")
HTML_TAG_RE     = re.compile(r"<[^>]+>")
IMAGE_RE        = re.compile(r"!\[[^\]]*\]\([^)]*\)")
LINK_RE         = re.compile(r"\[([^\]]*)\]\([^)]*\)")
COPY_RE         = re.compile(r"\^\^(.*?)\^\^", re.DOTALL)
TOKEN_RE        = re.compile(r"::[a-z_]+::", re.IGNORECASE)
DATE_TOKEN_RE   = re.compile(r"@@[^@]+@@")
COLLAPSE_RE     = re.compile(r"^\s*(>>>|<<<)", re.MULTILINE)
HEADING_RE      = re.compile(r"^\s{0,3}(#{1,6})\s+(.+)$", re.MULTILINE)
HEADING_HASH_RE = re.compile(r"^\s{0,3}#{1,6}\s+", re.MULTILINE)
TABLE_PIPE_RE   = re.compile(r"^\s*\|[-:\s|]+\|\s*$", re.MULTILINE)
EMPHASIS_RE     = re.compile(r"[*_~]{1,3}")
WORD_RE         = re.compile(r"[A-Za-z0-9][A-Za-z0-9'’-]*")


def count_words(md: str, is_changelog: bool = False) -> int:
    t = html.unescape(md)
    if is_changelog:
        t = re.sub(r"^```[^\n]*\n", "", t, flags=re.MULTILINE)
        t = re.sub(r"^```\s*$", "", t, flags=re.MULTILINE)
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
            cwd=ROOT,
            capture_output=True,
            text=True,
            check=True,
            encoding="utf-8",
        ).stdout.strip()
        return out.replace("-", ".") if out else None
    except (subprocess.CalledProcessError, FileNotFoundError):
        return None


# ============================================================================
# Per-paper status
# ============================================================================

def paper_status(slug: str, sidebar: dict[str, dict]) -> dict:
    """Read one paper, compute everything the reports need."""
    path = PAPERS_DIR / f"{slug}.md"
    md = path.read_text(encoding="utf-8", errors="replace")

    parsed = parse_first_line(md)
    icon, title = parsed if parsed else ("(no first line)", "(no title)")

    entry = sidebar.get(slug)
    words = count_words(md, is_changelog=(slug == "changelog"))
    mins = read_minutes(words)
    gdate = git_date(slug)

    paper_date = (entry or {}).get("date") or gdate or _today()
    category = (entry or {}).get("category", "")
    href = (entry or {}).get("href") or f"?paper={slug}"

    line = csv_row([
        category, icon, title, href, slug, paper_date, str(words), str(mins),
    ])

    deltas: list[str] = []
    if entry:
        entry_words = csv_int(entry.get("words"))
        entry_minutes = csv_int(entry.get("minutes"))
        if entry.get("icon") and entry["icon"] != icon:
            deltas.append(f'icon     "{entry["icon"]}" -> "{icon}"')
        if entry.get("title") and entry["title"] != title:
            deltas.append(f'title    "{entry["title"]}" -> "{title}"')
        if entry_words is None:
            deltas.append(f'words    "{entry.get("words") or "(blank)"}" -> {words}')
        elif entry_words != words:
            deltas.append(f"words    {entry_words} -> {words}")
        if entry_minutes is None:
            deltas.append(f'minutes  "{entry.get("minutes") or "(blank)"}" -> {mins}')
        elif entry_minutes != mins:
            deltas.append(f"minutes  {entry_minutes} -> {mins}")
    else:
        deltas.append("no CSV entry")

    return {
        "slug": slug, "md": md, "icon": icon, "title": title,
        "words": words, "mins": mins, "gdate": gdate, "entry": entry,
        "paper_date": paper_date, "category": category, "href": href,
        "line": line, "deltas": deltas,
    }


# ============================================================================
# Modes
# ============================================================================

def mode_full(slugs: list[str], sidebar: dict) -> int:
    """Scan every paper. Grey out the ones that match the CSV."""
    print()
    print(rule("="))
    print(f"{C.BOLD}FULL SCAN{C.OFF}  {C.DIM}{len(slugs)} papers{C.OFF}")
    print(rule("="))

    drifted = 0
    for slug in slugs:
        s = paper_status(slug, sidebar)
        dirty = bool(s["deltas"])

        if dirty:
            drifted += 1
            marker = f"{C.ORANGE}!{C.OFF}"
            name_col = C.BOLD
            meta_col = C.ORANGE
        else:
            marker = f"{C.GREEN}✓{C.OFF}" if C.on else "ok"
            name_col = C.DIM
            meta_col = C.DIM

        print(
            f"  {marker} {name_col}{slug:<34}{C.OFF} "
            f"{meta_col}{s['words']:>7,} words{C.OFF} "
            f"{meta_col}{s['mins']:>3} min{C.OFF}"
        )

        if dirty:
            for delta in s["deltas"]:
                print(f"      {C.ORANGE}{delta}{C.OFF}")

    print(rule())
    if drifted == 0:
        print(f"{C.GREEN}all {len(slugs)} papers match the CSV{C.OFF}")
    else:
        print(f"{C.ORANGE}{drifted} of {len(slugs)} papers drifted{C.OFF}")
    print(rule("="))
    return 0


def mode_drift(slugs: list[str], sidebar: dict) -> int:
    """Print only papers whose CSV entry is stale or missing."""
    missing = sorted(set(slugs) - HIDDEN - set(sidebar.keys()))
    extra = sorted(set(sidebar.keys()) - set(slugs))
    drift_count = 0

    for slug in slugs:
        s = paper_status(slug, sidebar)
        if not s["entry"]:
            continue
        if s["deltas"]:
            print(f"\n{C.ORANGE}{slug}{C.OFF}")
            for delta in s["deltas"]:
                print(f"  {delta}")
            drift_count += 1

    print()
    print(rule("="))
    if missing:
        print(f"{C.RED}PAPERS WITHOUT A CSV ENTRY ({len(missing)}){C.OFF}")
        for slug in missing:
            print(f"  {slug}")
    if extra:
        print(f"{C.RED}CSV ROWS WITHOUT A PAPER ({len(extra)}){C.OFF}")
        for slug in extra:
            print(f"  {slug}")
    if not (missing or extra or drift_count):
        print(f"{C.GREEN}clean: no drift, no orphans{C.OFF}")
    else:
        print(
            f"{C.ORANGE}{drift_count} drifted, "
            f"{len(missing)} missing, {len(extra)} orphaned{C.OFF}"
        )
    print(rule("="))
    return 0


def mode_all(slugs: list[str], sidebar: dict) -> int:
    """Print one CSV row per paper. Machine-readable."""
    print("category,icon,title,href,paper,date,words,minutes")
    for slug in slugs:
        s = paper_status(slug, sidebar)
        print(s["line"])
    return 0


def mode_build(slugs: list[str], sidebar: dict) -> int:
    """Rebuild the whole CSV from paper markdown, preserving row order."""
    if not SITE_NAVIGATION_CSV.is_file():
        print(f"{C.RED}could not find {SITE_NAVIGATION_CSV.name}{C.OFF}")
        return 1

    with SITE_NAVIGATION_CSV.open(encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file, skipinitialspace=True)
        rows = [
            {
                clean(key).lower(): clean(value)
                for key, value in raw_row.items()
                if key is not None
            }
            for raw_row in reader
        ]

    lines = [csv_row([
        "category", "icon", "title", "href", "paper", "date", "words", "minutes",
    ])]

    for row in rows:
        slug = row.get("paper", "")
        path = PAPERS_DIR / f"{slug}.md"
        category = row.get("category", "")
        href = row.get("href") or f"?paper={slug}"

        if not slug or not path.is_file():
            lines.append(csv_row([
                category,
                row.get("icon", ""),
                row.get("title", ""),
                href,
                slug,
                row.get("date", "?"),
                row.get("words", "0"),
                row.get("minutes", "0"),
            ]))
            continue

        s = paper_status(slug, sidebar)
        lines.append(csv_row([
            category,
            s["icon"],
            s["title"],
            href,
            slug,
            s["gdate"] or s["paper_date"],
            str(s["words"]),
            str(s["mins"]),
        ]))

    block = "\n".join(lines)

    print()
    print(rule("="))
    print(f"{C.CYAN}REBUILT CSV{C.OFF}  {C.DIM}(paste over {SITE_NAVIGATION_CSV.name}){C.OFF}")
    print(rule("="))
    print(block)
    print(rule("="))
    return 0


# ============================================================================
# Entry point
# ============================================================================

def all_slugs() -> list[str]:
    """Every .md in papers/, sorted, hidden ones excluded."""
    return sorted(
        path.stem
        for path in PAPERS_DIR.glob("*.md")
        if path.stem not in HIDDEN
    )


def main() -> int:
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8", errors="replace")

    if not PAPERS_DIR.is_dir():
        print(f"{C.RED}papers directory not found: {PAPERS_DIR}{C.OFF}", file=sys.stderr)
        pause()
        return 1

    slugs = all_slugs()
    if not slugs:
        print(f"no .md papers found in {PAPERS_DIR}", file=sys.stderr)
        pause()
        return 1

    try:
        sidebar = load_sidebar()
    except ValueError as error:
        print(f"{C.RED}error: {error}{C.OFF}", file=sys.stderr)
        pause()
        return 1

    if not sidebar:
        print(
            f"{C.RED}warning: no entries found in {SITE_NAVIGATION_CSV.name}{C.OFF}",
            file=sys.stderr,
        )

    if SCAN_MODE == "full":
        mode_full(slugs, sidebar)
    elif SCAN_MODE == "drift":
        mode_drift(slugs, sidebar)
    elif SCAN_MODE == "all":
        mode_all(slugs, sidebar)
    elif SCAN_MODE == "build":
        mode_build(slugs, sidebar)
    else:
        print(f"{C.RED}unknown SCAN_MODE: {SCAN_MODE!r}{C.OFF}", file=sys.stderr)
        print(f"{C.DIM}valid: full, drift, all, build{C.OFF}", file=sys.stderr)
        pause()
        return 1

    pause()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())