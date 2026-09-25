"""word_counter.py - recursive word count for a folder tree.

Counts words in every .md file, rolls totals up through every parent folder.

USAGE
    py word_counter.py
    py word_counter.py papers
    py word_counter.py papers --detail
    py word_counter.py --no-pause
"""

from __future__ import annotations

import argparse
import html
import re
import sys
from pathlib import Path


# ============================================================================
# Configuration
# ============================================================================

# Where to start walking when no path is given on the command line.
#   None  -> the folder this script lives in
#   "."   -> the current working directory
#   "papers"  -> a subfolder of the current working directory
DEFAULT_PATH: str | None = None

# File extensions to count.
EXTENSIONS = {".md"}

# Skip these folder names anywhere in the tree.
SKIP_DIRS = {".git", ".venv", "venv", "__pycache__", "node_modules"}


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
HEADING_HASH_RE = re.compile(r"^\s{0,3}#{1,6}\s+", re.MULTILINE)
TABLE_PIPE_RE   = re.compile(r"^\s*\|[-:\s|]+\|\s*$", re.MULTILINE)
EMPHASIS_RE     = re.compile(r"[*_~]{1,3}")
WORD_RE         = re.compile(r"[A-Za-z0-9][A-Za-z0-9'’-]*")


def count_words(md: str, is_changelog: bool = False) -> int:
    t = html.unescape(md)

    if is_changelog:
        # Unwrap fenced blocks: keep content, drop fences and language tags.
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


# ============================================================================
# Colours (auto-off when piped)
# ============================================================================

class C:
    _on = sys.stdout.isatty()
    DIM    = "\033[2m" if _on else ""
    BOLD   = "\033[1m" if _on else ""
    CYAN   = "\033[38;5;109m" if _on else ""
    RED    = "\033[38;5;167m" if _on else ""
    OFF    = "\033[0m" if _on else ""


def rule(char: str = "-", width: int = 74) -> str:
    return C.DIM + char * width + C.OFF


# ============================================================================
# Walking
# ============================================================================

def walk(path: Path) -> tuple[int, list]:
    """Return (total_words, children) for a directory, recursively.

    children is a list of (kind, name, words, subtree) where kind is
    "file" or "dir". subtree is None for files.
    """
    total = 0
    children = []

    for entry in sorted(path.iterdir(), key=lambda p: (p.is_file(), p.name)):
        if entry.name in SKIP_DIRS:
            continue

        if entry.is_dir():
            sub_total, sub_children = walk(entry)
            total += sub_total
            children.append(("dir", entry.name, sub_total, sub_children))

        elif entry.suffix.lower() in EXTENSIONS:
            try:
                text = entry.read_text(encoding="utf-8", errors="replace")
            except OSError as e:
                print(f"{C.RED}warning: could not read {entry}: {e}{C.OFF}",
                      file=sys.stderr)
                continue
            words = count_words(text)
            total += words
            children.append(("file", entry.name, words, None))

    return total, children


def print_tree(children, indent: int = 0, detail: bool = False,
               root_total: int = 0) -> None:
    for kind, name, words, subtree in children:
        pad = "  " * indent
        if kind == "dir":
            pct = f"  {words / root_total * 100:5.1f}%" if root_total else ""
            print(f"{pad}{C.CYAN}{name}/{C.OFF}  "
                  f"{C.BOLD}{words:,}{C.OFF}{C.DIM}{pct}{C.OFF}")
            print_tree(subtree, indent + 1, detail, root_total)
        else:
            if detail:
                print(f"{pad}{name}  {C.DIM}{words:,}{C.OFF}")


# ============================================================================
# Entry point
# ============================================================================

def pause() -> None:
    try:
        input(f"\n{C.DIM}press Enter to exit{C.OFF} ")
    except (EOFError, KeyboardInterrupt):
        print()


def resolve_target(user_path: str | None) -> Path:
    if user_path:
        return Path(user_path).expanduser().resolve()
    if DEFAULT_PATH:
        return Path(DEFAULT_PATH).expanduser().resolve()
    return Path(__file__).resolve().parent


def main() -> int:
    ap = argparse.ArgumentParser(description="Recursive word count.")
    ap.add_argument("path", nargs="?",
                    help="directory to walk (overrides DEFAULT_PATH)")
    ap.add_argument("--detail", action="store_true",
                    help="also show per-file counts")
    ap.add_argument("--no-pause", action="store_true",
                    help="skip the pause at the end (for scripting)")
    args = ap.parse_args()

    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8", errors="replace")

    target = resolve_target(args.path)
    if not target.is_dir():
        print(f"{C.RED}not a directory: {target}{C.OFF}", file=sys.stderr)
        if not args.no_pause:
            pause()
        return 1

    total, children = walk(target)

    print()
    print(rule("="))
    print(f"{C.BOLD}{target}{C.OFF}")
    print(rule("="))
    print_tree(children, indent=0, detail=args.detail, root_total=total)
    print(rule())
    print(f"{C.BOLD}TOTAL{C.OFF}  {total:,} words")
    print(rule("="))

    if not args.no_pause:
        pause()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())