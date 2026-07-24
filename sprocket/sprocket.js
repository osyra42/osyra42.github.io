// sprocket.js
(function () {
  const STORAGE_KEY = 'sprocket-checklist';

  let state = {};
  try {
    state = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch (e) {
    state = {};
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function checkboxKey(checkbox) {
    const details = checkbox.closest('details');
    const dropdown = details ? details.querySelector('summary').textContent.trim() : '';

    let heading = '';
    let el = checkbox.closest('li') || checkbox;
    let current = el.parentElement;
    while (current) {
      let prev = current.previousElementSibling;
      while (prev) {
        if (prev.tagName && /^H[1-6]$/.test(prev.tagName)) {
          heading = prev.textContent.trim();
          break;
        }
        prev = prev.previousElementSibling;
      }
      if (heading) break;
      current = current.parentElement;
    }

    const label = (checkbox.parentElement.textContent || '').trim();
    return dropdown + '|' + heading + '|' + label;
  }

  const bound = new WeakSet();

  function hookCheckboxes(root) {
    const scope = root && root.querySelectorAll ? root : document;
    const checkboxes = scope.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function (cb) {
      if (bound.has(cb)) return;
      bound.add(cb);
      const key = checkboxKey(cb);
      if (state[key]) cb.checked = true;
      cb.addEventListener('change', function () {
        const k = checkboxKey(cb);
        if (cb.checked) state[k] = true;
        else delete state[k];
        saveState();
      });
    });
  }

  // ---- Copy visible content as plain text -------------------------------
  // Walks the rendered DOM and emits a plain-text version of everything the
  // user can actually see. Collapsed <details> are skipped entirely (their
  // closed contents aren't "visible"); open ones contribute their summary as
  // a header plus their body. Headings, checkboxes, and tables are rendered
  // in a readable text form.
  function collectText(node, lines, depth) {
    for (const child of node.children) {
      const tag = child.tagName;

      if (tag === 'DETAILS') {
        const summary = child.querySelector(':scope > summary');
        // Prefix collapsible titles with an arrow mirroring the GUI's markers:
        // "v" when open (expanded, ▾), ">" when closed (collapsed, ▸).
        if (summary) {
          const marker = child.open ? 'v' : '>';
          lines.push('\n' + '  '.repeat(depth) + marker + ' ' + summary.textContent.trim());
        }
        // Only descend into OPEN details - closed ones aren't visible.
        if (child.open) collectText(child, lines, depth + 1);
        continue;
      }

      if (tag === 'SUMMARY') continue; // handled by its parent <details>

      if (/^H[1-6]$/.test(tag)) {
        lines.push('\n' + '  '.repeat(depth) + child.textContent.trim());
        continue;
      }

      if (tag === 'HR') {
        lines.push('  '.repeat(depth) + '----------');
        continue;
      }

      if (tag === 'TABLE') {
        collectTable(child, lines, depth);
        continue;
      }

      // A .table-wrap div holds a table; descend to reach it.
      if (child.classList && child.classList.contains('table-wrap')) {
        collectText(child, lines, depth);
        continue;
      }

      if (tag === 'P') {
        const cb = child.querySelector('input[type="checkbox"]');
        const text = child.textContent.trim();
        if (cb) {
          const box = cb.checked ? '[x]' : '[ ]';
          lines.push('  '.repeat(depth) + box + (text ? ' ' + text : ''));
        } else if (text) {
          lines.push('  '.repeat(depth) + text);
        }
        continue;
      }

      // Any other container: recurse so nested content isn't lost.
      if (child.children.length) collectText(child, lines, depth);
    }
  }

  function collectTable(table, lines, depth) {
    const pad = '  '.repeat(depth);
    for (const tr of table.querySelectorAll('tr')) {
      const cells = Array.from(tr.querySelectorAll('th, td')).map(c => c.textContent.trim());
      lines.push(pad + cells.join(' | '));
    }
  }

  function buildCopyText() {
    const main = document.querySelector('main');
    if (!main) return '';
    const lines = [];
    // Skip the footer (info/QR) - it's site chrome, not work content.
    for (const child of main.children) {
      if (child.tagName === 'FOOTER') continue;
      if (child.classList && child.classList.contains('sprocket-header')) {
        const h1 = child.querySelector('h1');
        if (h1) lines.push(h1.textContent.trim());
        continue;
      }
      collectText({ children: [child] }, lines, 0);
    }
    // Collapse 3+ blank lines down to a single blank line.
    return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
  }

  function flashButton(btn, msg) {
    const original = btn.textContent;
    btn.textContent = msg;
    setTimeout(function () { btn.textContent = original; }, 1500);
  }

  function hookCopyButton() {
    const btn = document.getElementById('copy-all');
    if (!btn) return;
    btn.addEventListener('click', async function () {
      const text = buildCopyText();
      try {
        await navigator.clipboard.writeText(text);
        flashButton(btn, '✓ Copied');
      } catch (e) {
        // Fallback for older browsers / non-secure contexts.
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        let ok = false;
        try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
        document.body.removeChild(ta);
        flashButton(btn, ok ? '✓ Copied' : '✗ Failed');
      }
    });
  }

  function init() {
    hookCheckboxes(document);
    hookCopyButton();

    const main = document.querySelector('main') || document.body;
    const observer = new MutationObserver(function (mutations) {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType === 1) hookCheckboxes(node);
        }
      }
    });
    observer.observe(main, { childList: true, subtree: true });

    const clearBtn = document.getElementById('clear-all');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        localStorage.removeItem(STORAGE_KEY);
        state = {};
        document.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
          cb.checked = false;
        });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
