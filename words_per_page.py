"""
inspect_documents.py - inspect documents, check CSV drift, rebuild CSV rows.

This tool WRITES NOTHING. site_navigation.csv stays hand-maintained; this
prints the things you'd otherwise compute by hand.

Change SCAN_MODE below to pick what runs, then run the script. There is one
launch path: whatever SCAN_MODE says. The script always pauses at the end so
the window stays open.

SCAN_MODE options:
    "full"  -> scan every document; unchanged ones are greyed out
    "drift" -> show only documents whose CSV entry is stale or missing
    "all"   -> print one CSV row per document
    "build" -> rebuild the whole CSV

USAGE
    py inspect_documents.py
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
DOCUMENTS_DIR = ROOT / "documents"
SITE_NAVIGATION_CSV = ROOT / "site_navigation.csv"

# Reading speed for the "minutes" estimate. Mirrors WORDS_PER_MINUTE in
# scripts.js. Only used for drift comparison; the frontend recalculates.
WORDS_PER_MINUTE = 180

# Folders to skip entirely (matched by prefix). 
# Example: "books/operation_kaleidoscope/rev1" skips all chapters inside rev1.
HIDDEN_FOLDERS: tuple[str, ...] = (
    "books/operation_kaleidoscope/rev1",
    "books/operation_kaleidoscope/rev2",
    "books/operation_kaleidoscope/rev3",
    "recipes",
)

# Specific files to skip (matched exactly, without the .md extension).
HIDDEN_FILES: tuple[str, ...] = (
    "main/mcupdates", 
    "main/vanitys_personality",
    "tools/vanitys_personality"
)


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

# The new CSV has these columns. `document` and `minutes` are gone;
# the document ID lives inside `href`, and minutes are computed by JS.
CSV_FIELDS = {"category", "icon", "title", "href", "date", "words"}


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


def doc_id_from_href(href: str) -> str:
    """Extract the document ID from an href like '?document=main/index'."""
    m = re.search(r"document=([^&]+)", href)
    return m.group(1) if m else ""


def load_sidebar() -> dict[str, dict[str, str]]:
    """Read site_navigation.csv and return {document_id: row_data}."""
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
            href = row.get("href", "")
            doc_id = doc_id_from_href(href)
            if not doc_id:
                print(
                    f"{C.ORANGE}warning:{C.OFF} "
                    f"{SITE_NAVIGATION_CSV.name}:{line_number} has no "
                    f"document= in href; skipping",
                    file=sys.stderr,
                )
                continue
            if doc_id in out:
                print(
                    f"{C.ORANGE}warning:{C.OFF} duplicate document id "
                    f"'{doc_id}' in {SITE_NAVIGATION_CSV.name}:{line_number}; "
                    f"using the later row",
                    file=sys.stderr,
                )
            out[doc_id] = {
                "category": row["category"],
                "icon":     row["icon"],
                "title":    row["title"],
                "href":     href,
                "date":     row["date"],
                "words":    row["words"],
            }

    return out


# ============================================================================
# Document parsing
# ============================================================================

FIRST_LINE_RE = re.compile(r"^#\s+(\S+)\s+(.+?)\s*$")


def parse_first_line(md: str) -> tuple[str, str] | None:
    """Return (icon, title) from the document's first '# <emoji> <Title>' line."""
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
    """Kept for drift comparison only. Frontend recalculates from words."""
    return 0 if words <= 0 else max(1, round(words / WORDS_PER_MINUTE + 0.4999))


def _today() -> str:
    return _date.today().strftime("%Y.%m.%d")


def git_date(doc_id: str) -> str | None:
    try:
        out = subprocess.run(
            ["git", "log", "-1", "--format=%cs", "--", f"documents/{doc_id}.md"],
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
# Per-document status
# ============================================================================

def doc_status(doc_id: str, sidebar: dict[str, dict]) -> dict:
    """Read one document, compute everything the reports need."""
    path = DOCUMENTS_DIR / f"{doc_id}.md"
    md = path.read_text(encoding="utf-8", errors="replace")

    parsed = parse_first_line(md)
    icon, title = parsed if parsed else ("(no first line)", "(no title)")

    entry = sidebar.get(doc_id)
    words = count_words(md, is_changelog=("changelog" in doc_id))
    mins = read_minutes(words)
    gdate = git_date(doc_id)

    doc_date = (entry or {}).get("date") or gdate or _today()
    category = (entry or {}).get("category", "")
    href = (entry or {}).get("href") or f"?document={doc_id}"

    line = csv_row([
        category, icon, title, href, doc_date, str(words),
    ])

    deltas: list[str] = []
    if entry:
        entry_words = csv_int(entry.get("words"))
        if entry.get("icon") and entry["icon"] != icon:
            deltas.append(f'icon     "{entry["icon"]}" -> "{icon}"')
        if entry.get("title") and entry["title"] != title:
            deltas.append(f'title    "{entry["title"]}" -> "{title}"')
        if entry_words is None:
            deltas.append(f'words    "{entry.get("words") or "(blank)"}" -> {words}')
        elif entry_words != words:
            deltas.append(f"words    {entry_words} -> {words}")
    else:
        deltas.append("no CSV entry")

    return {
        "id": doc_id, "md": md, "icon": icon, "title": title,
        "words": words, "mins": mins, "gdate": gdate, "entry": entry,
        "doc_date": doc_date, "category": category, "href": href,
        "line": line, "deltas": deltas,
    }


# ============================================================================
# Modes
# ============================================================================

def mode_full(ids: list[str], sidebar: dict) -> int:
    """Scan every document. Grey out the ones that match the CSV."""
    print()
    print(rule("="))
    print(f"{C.BOLD}FULL SCAN{C.OFF}  {C.DIM}{len(ids)} documents{C.OFF}")
    print(rule("="))

    drifted = 0
    for doc_id in ids:
        s = doc_status(doc_id, sidebar)
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
            f"  {marker} {name_col}{doc_id:<38}{C.OFF} "
            f"{meta_col}{s['words']:>7,} words{C.OFF} "
            f"{meta_col}{s['mins']:>3} min{C.OFF}"
        )

        if dirty:
            for delta in s["deltas"]:
                print(f"      {C.ORANGE}{delta}{C.OFF}")

    print(rule())
    if drifted == 0:
        print(f"{C.GREEN}all {len(ids)} documents match the CSV{C.OFF}")
    else:
        print(f"{C.ORANGE}{drifted} of {len(ids)} documents drifted{C.OFF}")
    print(rule("="))
    return 0


def mode_drift(ids: list[str], sidebar: dict) -> int:
    """Print only documents whose CSV entry is stale or missing."""
    missing = sorted(set(ids) - set(sidebar.keys()))
    extra = sorted(set(sidebar.keys()) - set(ids))
    drift_count = 0

    for doc_id in ids:
        s = doc_status(doc_id, sidebar)
        if not s["entry"]:
            continue
        if s["deltas"]:
            print(f"\n{C.ORANGE}{doc_id}{C.OFF}")
            for delta in s["deltas"]:
                print(f"  {delta}")
            drift_count += 1

    print()
    print(rule("="))
    if missing:
        print(f"{C.RED}DOCUMENTS WITHOUT A CSV ENTRY ({len(missing)}){C.OFF}")
        for doc_id in missing:
            print(f"  {doc_id}")
    if extra:
        print(f"{C.RED}CSV ROWS WITHOUT A DOCUMENT ({len(extra)}){C.OFF}")
        for doc_id in extra:
            print(f"  {doc_id}")
    if not (missing or extra or drift_count):
        print(f"{C.GREEN}clean: no drift, no orphans{C.OFF}")
    else:
        print(
            f"{C.ORANGE}{drift_count} drifted, "
            f"{len(missing)} missing, {len(extra)} orphaned{C.OFF}"
        )
    print(rule("="))
    return 0


def mode_all(ids: list[str], sidebar: dict) -> int:
    """Print one CSV row per document. Machine-readable."""
    print("category,icon,title,href,date,words")
    for doc_id in ids:
        s = doc_status(doc_id, sidebar)
        print(s["line"])
    return 0


def mode_build(ids: list[str], sidebar: dict) -> int:
    """Rebuild the whole CSV from document markdown, preserving row order."""
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
        "category", "icon", "title", "href", "date", "words",
    ])]

    for row in rows:
        href = row.get("href", "")
        doc_id = doc_id_from_href(href)
        category = row.get("category", "")

        if not doc_id:
            continue

        path = DOCUMENTS_DIR / f"{doc_id}.md"

        if not path.is_file():
            lines.append(csv_row([
                category,
                row.get("icon", ""),
                row.get("title", ""),
                href,
                row.get("date", "?"),
                row.get("words", "0"),
            ]))
            continue

        s = doc_status(doc_id, sidebar)
        lines.append(csv_row([
            category,
            s["icon"],
            s["title"],
            href,
            s["gdate"] or s["doc_date"],
            str(s["words"]),
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

def all_ids() -> list[str]:
    """Every .md under documents/, as a relative path without extension.
    Hidden files and folders are excluded. Sorted for stable output.
    Only scans one folder deep (e.g., main/index.md, books/glitched.md).
    Skips deeply nested folders like books/operation_kaleidoscope/rev1/..."""
    ids: list[str] = []
    
    # */*.md grabs exactly one subfolder deep
    for path in DOCUMENTS_DIR.glob("*/*.md"):
        rel = path.relative_to(DOCUMENTS_DIR).with_suffix("")
        doc_id = rel.as_posix()  # forward slashes on all platforms
        
        # Skip hidden folders
        if any(doc_id.startswith(folder) for folder in HIDDEN_FOLDERS):
            continue
            
        # Skip hidden files
        if doc_id in HIDDEN_FILES:
            continue
            
        ids.append(doc_id)
        
    return sorted(ids)


def main() -> int:
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8", errors="replace")

    if not DOCUMENTS_DIR.is_dir():
        print(
            f"{C.RED}documents directory not found: {DOCUMENTS_DIR}{C.OFF}",
            file=sys.stderr,
        )
        pause()
        return 1

    ids = all_ids()
    if not ids:
        print(f"no .md documents found in {DOCUMENTS_DIR}", file=sys.stderr)
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
        mode_full(ids, sidebar)
    elif SCAN_MODE == "drift":
        mode_drift(ids, sidebar)
    elif SCAN_MODE == "all":
        mode_all(ids, sidebar)
    elif SCAN_MODE == "build":
        mode_build(ids, sidebar)
    else:
        print(f"{C.RED}unknown SCAN_MODE: {SCAN_MODE!r}{C.OFF}", file=sys.stderr)
        print(f"{C.DIM}valid: full, drift, all, build{C.OFF}", file=sys.stderr)
        pause()
        return 1

    pause()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())