"""
inspect_paper.py - inspect one paper, check for CSV metadata drift, rebuild CSV rows.

This tool WRITES NOTHING. site_navigation.csv stays hand-maintained; this
prints the things you'd otherwise compute by hand.

USAGE
    python tools/inspect_paper.py                     # pick from a menu
    python tools/inspect_paper.py urbex_safety        # inspect directly
    python tools/inspect_paper.py /hi                 # alias for index
    python tools/inspect_paper.py --all               # every paper, one CSV row each
    python tools/inspect_paper.py --drift             # only papers whose CSV entry is stale
    python tools/inspect_paper.py --build             # rebuild the whole CSV
    python tools/inspect_paper.py /drift              # same as --drift
    python tools/inspect_paper.py /build              # same as --build

Slash commands are plain strings starting with "/" - see SLASH_COMMANDS below.

The menu accepts a number, a slug, a slash command, or a partial name
("magnet" finds how_magnets_work directly). Blank input or 'q' quits.
"""


from __future__ import annotations


import argparse
import csv
import html
import re
import subprocess
import sys
from datetime import date as _date
from io import StringIO
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
PAPERS_DIR = ROOT / "papers"
SITE_NAVIGATION_CSV = ROOT / "site_navigation.csv"


WORDS_PER_MINUTE = 220


# Papers that exist in papers/ but are intentionally not listed in the CSV.
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
# Reading site_navigation.csv
# ---------------------------------------------------------------------------


CSV_FIELDS = {
    "category",
    "icon",
    "title",
    "href",
    "paper",
    "date",
    "words",
    "minutes",
}


def clean(value: str | None) -> str:
    """Normalize values and tolerate padding in manually formatted CSV rows."""
    return (value or "").strip()


def csv_int(value: str | None) -> int | None:
    """Return a numeric CSV value, or None when blank or malformed."""
    try:
        return int(clean(value))
    except (TypeError, ValueError):
        return None


def csv_row(values: list[str]) -> str:
    """Return one correctly escaped CSV row."""
    buffer = StringIO()
    writer = csv.writer(buffer, lineterminator="")
    writer.writerow(values)
    return buffer.getvalue()


def load_sidebar() -> dict[str, dict[str, str]]:
    """
    Read site_navigation.csv and return {paper_slug: row_data}.

    The function retains its old name so the reporting code remains concise;
    "sidebar" now means the navigation CSV rather than a <nav> HTML element.
    """
    if not SITE_NAVIGATION_CSV.is_file():
        return {}

    with SITE_NAVIGATION_CSV.open(
        encoding="utf-8-sig",
        newline="",
    ) as file:
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
                    f"{SITE_NAVIGATION_CSV.name}:{line_number} "
                    f"has no paper slug; skipping",
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
                "icon": row["icon"],
                "title": row["title"],
                "href": row["href"],
                "paper": slug,
                "date": row["date"],
                "words": row["words"],
                "minutes": row["minutes"],
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


# ---------------------------------------------------------------------------
# Report: one paper
# ---------------------------------------------------------------------------


def inspect(slug: str, sidebar: dict[str, dict], quiet: bool = False) -> str:
    """Print a full report for one paper. Returns the CSV row to copy."""
    path = PAPERS_DIR / f"{slug}.md"
    md = path.read_text(encoding="utf-8", errors="replace")
    md_first_line = parse_first_line(md)
    md_icon, md_title = (
        md_first_line
        if md_first_line
        else ("(no first line)", "(no title)")
    )

    entry = sidebar.get(slug)

    words = count_words(md, is_changelog=(slug == "changelog"))
    mins = read_minutes(words)
    headings = HEADING_RE.findall(md)
    images = len(IMAGE_RE.findall(md))
    code = len(FENCED_CODE_RE.findall(md))
    gdate = git_date(slug)

    paper_date = (entry or {}).get("date") or gdate or _today()
    category = (entry or {}).get("category", "")
    href = (entry or {}).get("href") or f"?paper={slug}"

    line = csv_row([
        category,
        md_icon,
        md_title,
        href,
        slug,
        paper_date,
        str(words),
        str(mins),
    ])

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
        print(f"\n{C.CYAN}DECLARED IN CSV{C.OFF}")
        print(f"  category {entry['category'] or '(none)'}")
        print(f"  icon     {entry['icon']}")
        print(f"  title    {entry['title']}")
        print(f"  href     {entry['href']}")
        print(f"  date     {entry['date'] or '(none)'}")
        print(f"  words    {entry['words'] or '(none)'}")
        print(f"  minutes  {entry['minutes'] or '(none)'}")
    else:
        print(f"\n{C.RED}NO CSV ENTRY for '{slug}'{C.OFF}")

    print(f"\n{C.CYAN}COUNTED FROM CONTENT{C.OFF}")
    note = (
        "(entire paper counted - changelog)"
        if slug == "changelog"
        else "(prose only; code blocks excluded)"
    )
    print(f"  words    {C.BOLD}{words:,}{C.OFF}   {C.DIM}{note}{C.OFF}")
    print(f"  minutes  {C.BOLD}{mins}{C.OFF}   {C.DIM}at {WORDS_PER_MINUTE} wpm{C.OFF}")
    print(f"  headings {len(headings)}   {C.DIM}H1-H6{C.OFF}")
    print(f"  images   {images}")
    print(f"  code     {code} block(s)")
    print(f"  source   {len(md):,} chars of markdown")

    print(f"\n{C.CYAN}DATES{C.OFF}")
    print(f"  git last commit   {gdate or '(untracked)'}")
    if entry and entry.get("date"):
        current = entry["date"]
        flag = (
            f"   {C.DIM}(differs from git){C.OFF}"
            if gdate and current != gdate
            else ""
        )
        print(f"  CSV               {current}{flag}")
    else:
        print(f"  CSV               {C.DIM}(none){C.OFF}")
        source = "git" if gdate else "today - paper is untracked"
        print(f"  using             {C.BOLD}{paper_date}{C.OFF}   {C.DIM}({source}){C.OFF}")

    if entry:
        deltas: list[str] = []
        entry_words = csv_int(entry.get("words"))
        entry_minutes = csv_int(entry.get("minutes"))

        if entry.get("icon") and entry["icon"] != md_icon:
            deltas.append(f'icon     "{entry["icon"]}" -> "{md_icon}"')

        if entry.get("title") and entry["title"] != md_title:
            deltas.append(f'title    "{entry["title"]}" -> "{md_title}"')

        if entry_words is None:
            deltas.append(
                f'words    "{entry.get("words") or "(blank)"}" -> {words}'
            )
        elif entry_words != words:
            deltas.append(f"words    {entry_words} -> {words}")

        if entry_minutes is None:
            deltas.append(
                f'minutes  "{entry.get("minutes") or "(blank)"}" -> {mins}'
            )
        elif entry_minutes != mins:
            deltas.append(f"minutes  {entry_minutes} -> {mins}")

        if deltas:
            print(f"\n{C.ORANGE}DRIFT (CSV vs. paper){C.OFF}")
            for delta in deltas:
                print(f"  {delta}")
        else:
            print(f"\n{C.GREEN}CSV entry is up to date for this paper{C.OFF}")

    if headings:
        print(f"\n{C.CYAN}OUTLINE{C.OFF}")
        for hashes, text in headings[:14]:
            depth = len(hashes)
            text = EMPHASIS_RE.sub("", text).strip()
            print(f"  {C.DIM}{'  ' * (depth - 1)}{'#' * depth}{C.OFF} {text[:58]}")
        if len(headings) > 14:
            print(f"  {C.DIM}... {len(headings) - 14} more{C.OFF}")

    print(f"\n{C.CYAN}CSV ROW{C.OFF}  {C.DIM}(copy below){C.OFF}")
    print(rule())
    print(line)
    print(rule())
    return line


# ---------------------------------------------------------------------------
# Report: drift across all papers
# ---------------------------------------------------------------------------


def orphans(slugs: list[str], sidebar: dict[str, dict]) -> tuple[list[str], list[str]]:
    """Return (papers not in CSV, CSV rows without papers).

    Papers in HIDDEN are excluded from the missing side.
    """
    md_set = set(slugs) - HIDDEN
    csv_set = set(sidebar.keys())
    return sorted(md_set - csv_set), sorted(csv_set - md_set)


def drift_report(slugs: list[str], sidebar: dict[str, dict]) -> int:
    """
    Walk every paper, compare against the CSV, and print only disagreements.
    Returns the number of problems (0 = all clean).
    """
    missing, extra = orphans(slugs, sidebar)
    drift_count = 0

    for slug in slugs:
        path = PAPERS_DIR / f"{slug}.md"
        md = path.read_text(encoding="utf-8", errors="replace")
        parsed = parse_first_line(md)
        entry = sidebar.get(slug)

        if not entry:
            continue

        if not parsed:
            print(
                f"\n{C.RED}{slug}{C.OFF}  "
                f"{C.DIM}(no first line in papers/{slug}.md){C.OFF}"
            )
            drift_count += 1
            continue

        md_icon, md_title = parsed
        words = count_words(md, is_changelog=(slug == "changelog"))
        mins = read_minutes(words)

        deltas: list[str] = []
        entry_words = csv_int(entry.get("words"))
        entry_minutes = csv_int(entry.get("minutes"))

        if entry.get("icon") and entry["icon"] != md_icon:
            deltas.append(
                f'  icon     CSV "{entry["icon"]}"  ->  paper "{md_icon}"'
            )

        if entry.get("title") and entry["title"] != md_title:
            deltas.append(
                f'  title    CSV "{entry["title"]}"  ->  paper "{md_title}"'
            )

        if entry_words is None:
            deltas.append(
                f'  words    CSV "{entry.get("words") or "(blank)"}"  '
                f"->  paper {words}"
            )
        elif entry_words != words:
            deltas.append(f"  words    CSV {entry_words}  ->  paper {words}")

        if entry_minutes is None:
            deltas.append(
                f'  minutes  CSV "{entry.get("minutes") or "(blank)"}"  '
                f"->  paper {mins}"
            )
        elif entry_minutes != mins:
            deltas.append(f"  minutes  CSV {entry_minutes}  ->  paper {mins}")

        if deltas:
            print(f"\n{C.ORANGE}{slug}{C.OFF}")
            for delta in deltas:
                print(delta)
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
    return drift_count + len(missing) + len(extra)


# ---------------------------------------------------------------------------
# Report: rebuild the whole CSV
# ---------------------------------------------------------------------------


def build_csv(sidebar: dict[str, dict[str, str]]) -> str:
    """
    Rebuild the whole site_navigation.csv content.

    Category and row order come from the current CSV, so nothing is reordered.
    Icon, title, date, words, and minutes are refreshed from paper markdown.
    """
    if not SITE_NAVIGATION_CSV.is_file():
        return ""

    with SITE_NAVIGATION_CSV.open(
        encoding="utf-8-sig",
        newline="",
    ) as file:
        reader = csv.DictReader(file, skipinitialspace=True)

        rows = [
            {
                clean(key).lower(): clean(value)
                for key, value in raw_row.items()
                if key is not None
            }
            for raw_row in reader
        ]

    lines = [
        csv_row([
            "category",
            "icon",
            "title",
            "href",
            "paper",
            "date",
            "words",
            "minutes",
        ])
    ]

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

        md = path.read_text(encoding="utf-8", errors="replace")
        parsed = parse_first_line(md)
        icon, title = parsed if parsed else ("📄", slug)

        words = count_words(md, is_changelog=(slug == "changelog"))
        mins = read_minutes(words)
        gdate = git_date(slug)
        old_entry = sidebar.get(slug) or {}
        paper_date = gdate or old_entry.get("date") or _today()

        lines.append(csv_row([
            category,
            icon,
            title,
            href,
            slug,
            paper_date,
            str(words),
            str(mins),
        ]))

    return "\n".join(lines)


def build_report(sidebar: dict[str, dict], slugs: list[str]) -> int:
    """Print rebuilt CSV content. Returns 0 on success, 1 on failure."""
    block = build_csv(sidebar)
    if not block:
        print(f"{C.RED}could not find {SITE_NAVIGATION_CSV.name}{C.OFF}")
        return 1

    missing, extra = orphans(slugs, sidebar)

    if missing or extra:
        print(f"\n{C.ORANGE}note:{C.OFF}")

        if missing:
            print(
                f"  {len(missing)} paper(s) with no CSV entry: "
                f"{', '.join(missing)}"
            )

        if extra:
            print(
                f"  {len(extra)} CSV row(s) with no paper: "
                f"{', '.join(extra)}"
            )

        print(
            f"{C.DIM}  the rebuilt CSV only includes papers currently "
            f"listed in {SITE_NAVIGATION_CSV.name}{C.OFF}"
        )

    print()
    print(rule("="))
    print(
        f"{C.CYAN}REBUILT CSV{C.OFF}  "
        f"{C.DIM}(paste over {SITE_NAVIGATION_CSV.name}){C.OFF}"
    )
    print(rule("="))
    print(block)
    print(rule("="))
    return 0


# ---------------------------------------------------------------------------
# Paper selection
# ---------------------------------------------------------------------------


def all_slugs() -> list[str]:
    return sorted(path.stem for path in PAPERS_DIR.glob("*.md"))


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
        index = int(q) - 1
        return slugs[index] if 0 <= index < len(slugs) else None

    if q in slugs:
        return q

    matches = [slug for slug in slugs if q in slug]

    if len(matches) == 1:
        return matches[0]

    if len(matches) > 1:
        print(f"\n{C.ORANGE}'{query}' matches {len(matches)} papers:{C.OFF}")
        for slug in matches:
            print(f"  {slug}")
        return None

    print(f"\n{C.RED}no paper matching '{query}'{C.OFF}")
    return None


def show_menu(slugs: list[str]) -> None:
    print(f"\n{C.BOLD}PAPERS{C.OFF}  {C.DIM}({len(slugs)} total){C.OFF}")
    print(rule())

    half = (len(slugs) + 1) // 2

    for index in range(half):
        left = f"{C.DIM}{index + 1:>2}{C.OFF} {slugs[index]}"
        padding = " " * max(0, 34 - len(slugs[index]))

        if index + half < len(slugs):
            right_index = index + half
            right = f"{C.DIM}{right_index + 1:>2}{C.OFF} {slugs[right_index]}"
            print(f"  {left}{padding}{right}")
        else:
            print(f"  {left}")

    print(rule())
    print(f"{C.DIM}commands: {', '.join(sorted(SLASH_COMMANDS))}{C.OFF}")


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------


def main() -> int:
    ap = argparse.ArgumentParser(
        description="Inspect a paper, check CSV drift, or rebuild CSV metadata."
    )
    ap.add_argument(
        "paper",
        nargs="?",
        help="paper slug, /command, or partial match",
    )
    ap.add_argument(
        "--all",
        action="store_true",
        help="print a CSV row for every paper",
    )
    ap.add_argument(
        "--drift",
        action="store_true",
        help="report only papers with CSV metadata drift",
    )
    ap.add_argument(
        "--build",
        action="store_true",
        help="rebuild the whole CSV with fresh metadata",
    )
    args = ap.parse_args()

    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8", errors="replace")

    slugs = all_slugs()
    if not slugs:
        print("no .md papers found in papers/", file=sys.stderr)
        return 1

    try:
        sidebar = load_sidebar()
    except ValueError as error:
        print(f"{C.RED}error: {error}{C.OFF}", file=sys.stderr)
        return 1

    if not sidebar:
        print(
            f"{C.RED}warning: no entries found in "
            f"{SITE_NAVIGATION_CSV.name}{C.OFF}",
            file=sys.stderr,
        )

    if args.all:
        print("category,icon,title,href,paper,date,words,minutes")
        for slug in slugs:
            print(inspect(slug, sidebar, quiet=True))
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
                f"{C.ORANGE}paper{C.OFF} "
                f"{C.DIM}(number, slug, /command, or q to quit){C.OFF} > "
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
