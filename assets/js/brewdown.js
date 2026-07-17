// brewdown.js - A coffee-flavored Markdown to HTML converter
const Brewdown = (function() {

    // Default text for {{var}} placeholders.
    // Pages can seed this BEFORE brewdown.js loads by setting `window.brewdownDefaultVar = 'text'`
    // in an inline <script> in the head (necessary because brewdown.js is deferred, so any
    // `Brewdown.defaultVar = …` inline in head would run before Brewdown exists).
    // After load, you can still use `Brewdown.defaultVar = 'text'` from non-deferred code.
    let defaultVar = (typeof window !== 'undefined' && typeof window.brewdownDefaultVar === 'string')
        ? window.brewdownDefaultVar
        : '';

    // TOC entries collected during a brewdown() call. Set to an array at the start of brewdown(),
    // reset to null when finished. parseInlineFormatting checks this before pushing entries.
    let _tocEntries = null;

    function isExternalUrl(url) {
        return /^https?:\/\//i.test(url) || url.startsWith('magnet:') || url.endsWith('.pdf');
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function slugify(text) {
        return text.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    function renderToc(entries) {
        if (!entries || entries.length === 0) return '';
        // Indent by level: labels flush left, H1 flush left, H2 at +2, H3 at +4.
        // Rendered inside <pre> so whitespace shows; no <ul>/<li> = no bullet dots.
        // Auto-prepends a bold "TABLE OF CONTENTS" header so the section is self-labeling.
        const lines = entries.map(e => {
            const indent = e.level === 0 ? '' : '  '.repeat(Math.max(0, e.level - 1));
            return `${indent}<a href="#${e.slug}">${escapeHtml(e.text)}</a>`;
        });
        return `<pre class="brewdown-toc"><strong>TABLE OF CONTENTS</strong>\n\n${lines.join('\n')}</pre>`;
    }

    // Renders the standard page footer from window.SIGNATURE (see assets/js/signature.js).
    // Author / Contact / License come from the central config; Source and Last Updated are
    // derived from the current page filename + the per-page date map. Used by the ::signature::
    // token so the footer lives in ONE place instead of being copy-pasted into every page.
    function renderSignature() {
        const sig = (typeof window !== 'undefined' && window.SIGNATURE) ? window.SIGNATURE : null;
        if (!sig) return '<p>[signature unavailable — signature.js not loaded]</p>';
        let file = (location.pathname.split('/').pop() || 'index.html');
        if (!file) file = 'index.html';
        const domain = sig.domain || 'coffeebyte.dev';
        // Date comes from the central update.js map (window.UPDATES); fall back to any legacy
        // sig.updated entry just in case update.js didn't load.
        const rec = (typeof window !== 'undefined' && window.UPDATES) ? window.UPDATES[file] : null;
        const date = (rec && rec.date) || (sig.updated && sig.updated[file]);
        let dateHtml = 'Unlisted';
        if (date) {
            const p = date.split('.');
            dateHtml = parseTimestamp(date, p[0], p[1], p[2]);
        }
        return '<p>Author: ' + escapeHtml(sig.author || '') + '<br>'
            + 'Source: ' + escapeHtml(domain + '/' + file) + '<br>'
            + 'Contact: ' + escapeHtml(sig.contact || '') + '<br>'
            + 'License: ' + escapeHtml(sig.license || '') + '<br>'
            + 'Last Updated: ' + dateHtml + '</p>'
            + '<p>Always check ' + escapeHtml(domain) + ' for the current version.</p>';
    }

    function parseTimestamp(match, yyyy, mm, dd, hh, min) {
        const date = new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd),
            hh ? parseInt(hh) : 0, min ? parseInt(min) : 0);
        if (isNaN(date.getTime())) return match;
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        if (hh) { options.hour = '2-digit'; options.minute = '2-digit'; }
        return '<time datetime="' + date.toISOString() + '">' + date.toLocaleString(undefined, options) + '</time>';
    }

    function parseInlineFormatting(text) {
        // Inline code: ```code``` or `code` (process first to protect code content)
        const codeBlocks = [];
        text = text.replace(/```(.*?)```/g, function(_, code) {
            codeBlocks.push('<code>' + escapeHtml(code) + '</code>');
            return `\x00CODE${codeBlocks.length - 1}\x00`;
        });
        text = text.replace(/`(.*?)`/g, function(_, code) {
            codeBlocks.push('<code>' + escapeHtml(code) + '</code>');
            return `\x00CODE${codeBlocks.length - 1}\x00`;
        });

        // Escape characters: \X → placeholder, restored at end
        const escapes = [];
        text = text.replace(/\\(.)/g, function(_, ch) {
            escapes.push(ch);
            return `\x00ESC${escapes.length - 1}\x00`;
        });

        // Timestamp: @@YYYY.MM.DD@@ or @@YYYY.MM.DD.HH.MM@@ → local time
        text = text.replace(/@@(\d{4})\.(\d{2})\.(\d{2})(?:\.(\d{2})\.(\d{2}))?@@/g, parseTimestamp);

        // Spoiler: !!text!! → click to reveal
        text = text.replace(/!!(.*?)!!/g, '<span class="spoiler" title="Click to reveal" onclick="this.classList.toggle(\'revealed\')">$1</span>');

        // Click-to-copy: ^^text^^ → click to copy, prepends 📋, flashes "Copied!" for 500ms
        text = text.replace(/\^\^(.*?)\^\^/g, function(_, content) {
            const handler = "var e=this,o=e.innerHTML;navigator.clipboard.writeText(e.dataset.copy);e.innerHTML='Copied!';setTimeout(function(){e.innerHTML=o},500)";
            return '<span class="copy-text" title="Click to copy this text" data-copy="' + escapeHtml(content) + '" onclick="' + handler + '">📋 ' + content + '</span>';
        });

        // Tooltip: ??text|tip?? → hover (or tap) for a short definition. Emits [data-tooltip],
        // driven by the shared bubble in scripts.js. The text half is left raw so later rules
        // still see it — ??[label](url)|tip?? renders a working link inside the tooltip, giving
        // hover-for-definition plus click-to-navigate from one token.
        text = text.replace(/\?\?([^?|]+?)\|([^?]+?)\?\?/g, function(_, content, tip) {
            return '<span class="tooltip-term" tabindex="0" data-tooltip="' + escapeHtml(tip.trim()) + '">' + content + '</span>';
        });

        // TOC: ::toc:: spawns the table of contents at that position. ::label:: creates an
        // explicit TOC anchor wrapping the label text. Headers (H2-H3) auto-collect into the
        // TOC during block processing; this handles the inline pair syntax.
        text = text.replace(/::([^:\n]+?)::/g, function(_, content) {
            const trimmed = content.trim();
            if (trimmed.toLowerCase() === 'toc') {
                return '\x00BREWDOWN_TOC\x00';
            }
            const slug = slugify(trimmed);
            if (_tocEntries) _tocEntries.push({ level: 0, text: trimmed, slug });
            return `<span id="${slug}" class="toc-anchor">${trimmed}</span>`;
        });

        // Bold: **text**
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Italic: *text*
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // Strikethrough: ~~text~~
        text = text.replace(/~~(.*?)~~/g, '<del>$1</del>');

        // Underline: __text__
        text = text.replace(/__([^_]+?)__/g, '<u>$1</u>');

        // Fill-in blank: ___ (3+ underscores). Optional placeholder follows with no spaces;
        // underscores inside the placeholder render as spaces (e.g. ___for_example → placeholder="for example").
        text = text.replace(/_{3,}(\S*)/g, function(_, ph) {
            const display = ph.replace(/_/g, ' ');
            const placeholderAttr = display ? ` placeholder="${escapeHtml(display)}"` : '';
            return `<input type="text" style="border:none;border-bottom:2px solid currentColor;min-width:100px;font:inherit;background:transparent;color:inherit;"${placeholderAttr}>`;
        });

        // Checkboxes: [x] checked, [ ] unchecked — must come before links
        text = text.replace(/\[x\]/gi, '<input type="checkbox" checked>');
        text = text.replace(/\[ \]/g, '<input type="checkbox">');

        // Media: ![alt](url) — detects type by extension, must come before links
        text = text.replace(/!\[(.*?)\]\((.*?)\)/g, function(_, alt, url) {
            const ext = url.split('.').pop().split(/[?#]/)[0].toLowerCase();
            if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'avif'].includes(ext)) {
                return `<a href="${url}" target="_blank" class="media-link" title="Click to open"><img src="${url}" alt="${alt}"></a>`;
            }
            if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) {
                return `<a href="${url}" target="_blank" class="media-link" title="Click to open"><video controls src="${url}" title="${alt}"></video></a>`;
            }
            if (['mp3', 'wav', 'flac', 'aac', 'm4a'].includes(ext)) {
                return `<a href="${url}" target="_blank" class="media-link" title="Click to open"><audio controls src="${url}" title="${alt}"></audio></a>`;
            }
            const isMagnet = url.startsWith('magnet:');
            const isZip = /\.zip(\?|#|$)/i.test(url);
            let badge = isMagnet ? '' : '🔗 ';
            if (isZip) badge += '💾 ';
            let titleAttr = '';
            if (isZip) titleAttr = ' title="Click to save"';
            else if (!isMagnet) titleAttr = ' title="Click to follow external link"';
            return `<a href="${url}" target="_blank"${titleAttr}>${badge}${alt || url}</a>`;
        });

        // Links: [text](url) — external links open in new tab and get 🔗 prefix (except magnet:); .zip links get 💾 prefix
        text = text.replace(/\[(.*?)\]\((.*?)\)/g, function(_, linkText, url) {
            const external = isExternalUrl(url);
            const isMagnet = url.startsWith('magnet:');
            const isZip = /\.zip(\?|#|$)/i.test(url);
            let badge = '';
            if (external && !isMagnet) badge += '🔗 ';
            if (isZip) badge += '💾 ';
            let titleAttr = '';
            if (isZip) titleAttr = ' title="Click to save"';
            else if (external && !isMagnet) titleAttr = ' title="Click to follow external link"';
            if (external || isZip) {
                return `<a href="${url}" target="_blank"${titleAttr}>${badge}${linkText}</a>`;
            }
            return `<a href="${url}">${linkText}</a>`;
        });

        // Auto-link bare URLs and magnet links (only after whitespace or start of string)
        text = text.replace(/(^|\s)((?:https?:\/\/|magnet:\?)[^\s<]+)/g, function(_, ws, url) {
            const isMagnet = url.startsWith('magnet:');
            const isZip = /\.zip(\?|#|$)/i.test(url);
            let badge = isMagnet ? '' : '🔗 ';
            if (isZip) badge += '💾 ';
            let titleAttr = '';
            if (isZip) titleAttr = ' title="Click to save"';
            else if (!isMagnet) titleAttr = ' title="Click to follow external link"';
            return `${ws}<a href="${url}" target="_blank"${titleAttr}>${badge}${url}</a>`;
        });

        // Template variables: {{name}} → <span id="name">default text</span>
        text = text.replace(/\{\{(\w[\w-]*)\}\}/g, function(match, name) {
            return `<span id="${name}">${defaultVar}</span>`;
        });

        // Restore escaped characters
        text = text.replace(/\x00ESC(\d+)\x00/g, function(_, i) {
            return escapeHtml(escapes[parseInt(i)]);
        });

        // Restore inline code blocks
        text = text.replace(/\x00CODE(\d+)\x00/g, function(_, i) {
            return codeBlocks[parseInt(i)];
        });

        return text;
    }

    function brewdown(markdownText, options = {}) {
        const {
            wrapInContainer = false,
            containerClass = 'brewdown-container'
        } = options;

        _tocEntries = [];
        let htmlContent = '';
        const lines = markdownText.trim().split(/\r?\n/);
        let inBlockquote = false;
        let inCodeBlock = false;
        let codeBlockContent = '';
        let codeBlockLang = '';
        let baseIndentRe = /^/;
        let inTable = false;
        let tableRows = [];
        let inGallery = false;
        let detailsDepth = 0;
        function closeOpenBlocks() {
            if (inBlockquote) { htmlContent += '</blockquote>\n'; inBlockquote = false; }
            if (inGallery) { htmlContent += '</div>\n'; inGallery = false; }
            if (inTable) { flushTable(); }
        }

        function flushTable() {
            if (tableRows.length === 0) return;
            let html = '<div class="table-wrap"><table>\n';
            const indexCols = new Set();
            tableRows.forEach((row, i) => {
                const cells = row.split('|').slice(1, -1);
                // Skip separator row (e.g. |---|---|)
                if (i === 1 && cells.every(c => c.trim().match(/^[-:]+$/))) return;
                const tag = i === 0 ? 'th' : 'td';
                html += '<tr>';
                cells.forEach((cell, colIdx) => {
                    const trimmed = cell.trim();
                    if (i === 0 && trimmed === '#') indexCols.add(colIdx);
                    const cls = indexCols.has(colIdx) ? ' class="col-index"' : '';
                    html += `<${tag}${cls}>${parseInlineFormatting(trimmed)}</${tag}>`;
                });
                html += '</tr>\n';
            });
            html += '</table></div>\n';
            htmlContent += html;
            tableRows = [];
            inTable = false;
        }

        lines.forEach(rawLine => {
            let processedLine = '';
            // Count leading spaces for indentation, then trim for pattern matching
            const indent = inCodeBlock ? 0 : rawLine.match(/^(\s*)/)[1].length;
            const line = inCodeBlock ? rawLine.replace(baseIndentRe, '') : rawLine.trimStart();

            // Fenced code blocks: ```
            if (line.startsWith('```')) {
                if (!inCodeBlock) {
                    closeOpenBlocks();
                    inCodeBlock = true;
                    codeBlockContent = '';
                    codeBlockLang = line.trim().substring(3).trim();
                    baseIndentRe = /^/;
                } else {
                    const langClass = codeBlockLang ? ` class="language-${codeBlockLang}"` : '';
                    processedLine = `<pre><code${langClass}>${escapeHtml(codeBlockContent)}</code></pre>`;
                    inCodeBlock = false;
                    codeBlockContent = '';
                    codeBlockLang = '';
                }
                if (inCodeBlock) return;
                htmlContent += processedLine + '\n';
                return;
            }

            if (inCodeBlock) {
                if (!codeBlockContent && rawLine.trim()) {
                    const baseIndent = rawLine.match(/^(\s*)/)[1];
                    baseIndentRe = baseIndent ? new RegExp('^' + baseIndent) : /^/;
                }
                codeBlockContent += (codeBlockContent ? '\n' : '') + line.replace(/\\`/g, '`');
                return;
            }

            // Table rows: | cell | cell |
            if (line.startsWith('|') && line.endsWith('|')) {
                if (!inTable) {
                    closeOpenBlocks();
                    inTable = true;
                }
                tableRows.push(line);
                return;
            } else if (inTable) {
                flushTable();
            }

            // Collapsible open: >>> Title — gives <details> an id (so links can scroll to it),
            // but does NOT add to TOC. Collapsibles are often UI affordances ("Click to view"),
            // not section headers, so auto-listing them clutters the TOC. Use a header or
            // ::label:: above the collapsible if you want a TOC entry that scrolls to it.
            if (line.startsWith('>>>')) {
                closeOpenBlocks();
                const title = line.substring(3).trim() || 'Details';
                const slug = slugify(title);
                processedLine = `<details id="${slug}"><summary>${parseInlineFormatting(title)}</summary>`;
                detailsDepth++;
                htmlContent += processedLine + '\n';
                return;
            }
            // Collapsible close: <<<
            if (line === '<<<') {
                closeOpenBlocks();
                if (detailsDepth > 0) {
                    processedLine = '</details>';
                    detailsDepth--;
                    htmlContent += processedLine + '\n';
                }
                return;
            }

            // TOC marker on its own line — emit as block placeholder (no <p> wrap)
            if (line.trim() === '::toc::') {
                closeOpenBlocks();
                htmlContent += '\x00BREWDOWN_TOC\x00\n';
                return;
            }

            // Signature marker on its own line — emit as block placeholder (no <p> wrap)
            if (line.trim() === '::signature::') {
                closeOpenBlocks();
                htmlContent += '\x00BREWDOWN_SIG\x00\n';
                return;
            }

            // Headers — # to ###### get id="slug-of-text"; H1/H2/H3 auto-collect into TOC
            const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
            if (headerMatch) {
                closeOpenBlocks();
                const level = headerMatch[1].length;
                const headerText = headerMatch[2];
                const slug = slugify(headerText);
                if (_tocEntries && level >= 1 && level <= 3) {
                    _tocEntries.push({ level, text: headerText, slug });
                }
                processedLine = `<h${level} id="${slug}">${parseInlineFormatting(headerText)}</h${level}>`;
            }
            // Blockquotes
            else if (line.startsWith('> ') || line === '>') {
                const content = line === '>' ? '' : line.substring(2);
                if (!inBlockquote) {
                    processedLine = content
                        ? `<blockquote><p>${parseInlineFormatting(content)}</p>`
                        : '<blockquote>';
                    inBlockquote = true;
                } else if (content) {
                    processedLine = `<p>${parseInlineFormatting(content)}</p>`;
                }
            }
            // Horizontal rule
            else if (line.match(/^[-*]{3,}$/)) {
                closeOpenBlocks();
                processedLine = '<hr>';
            }
            // Empty line - close open blocks or add spacing
            else if (rawLine.trim() === '') {
                if (inBlockquote) {
                    processedLine = '</blockquote>';
                    inBlockquote = false;
                } else {
                    processedLine = '<br>';
                }
            }
            // HTML passthrough: lines starting with < are passed through as-is
            else if (line.match(/^<[a-zA-Z\/]/)) {
                closeOpenBlocks();
                processedLine = line;
            }
            // Media-only line: ![alt](url)
            else if (line.match(/^!\[.*?\]\(.*?\)$/)) {
                if (!inGallery) {
                    htmlContent += '<div class="media-gallery">\n';
                    inGallery = true;
                }
                processedLine = parseInlineFormatting(line);
            }
            // Regular paragraph
            else {
                closeOpenBlocks();
                processedLine = `<p>${parseInlineFormatting(line)}</p>`;
            }

            if (indent > 0 && processedLine) {
                processedLine = processedLine.replace(/^(<\w+)/, `$1 style="margin-left:${indent}ch"`);
            }
            htmlContent += processedLine + '\n';
        });

        // Close any open elements at the end
        if (inCodeBlock) {
            const langClass = codeBlockLang ? ` class="language-${codeBlockLang}"` : '';
            htmlContent += `<pre><code${langClass}>${escapeHtml(codeBlockContent)}</code></pre>`;
        }
        if (inBlockquote) htmlContent += '</blockquote>';
        if (inTable) flushTable();
        while (detailsDepth > 0) { htmlContent += '</details>\n'; detailsDepth--; }

        // Final TOC pass: replace ::toc:: placeholder with rendered TOC. Opt-in only —
        // pages must explicitly write ::toc:: to get one (no auto-prepend), so pages with
        // lots of incidental headers don't sprout unwanted TOCs.
        const tocHtml = renderToc(_tocEntries);
        htmlContent = htmlContent.replace(/\x00BREWDOWN_TOC\x00/g, tocHtml);
        _tocEntries = null;

        // Signature pass: replace ::signature:: placeholder with the rendered footer.
        htmlContent = htmlContent.replace(/\x00BREWDOWN_SIG\x00/g, renderSignature());

        if (wrapInContainer) {
            return `<div class="${containerClass}">${htmlContent}</div>`;
        }

        return htmlContent;
    }

    // Auto-execute function to process script tags
    function processScriptTags() {
        // Find all script tags with the data-brewdown attribute
        const scripts = document.querySelectorAll('script[data-brewdown]');

        scripts.forEach(script => {
            const markdownFile = script.getAttribute('data-brewdown');
            const wrapInContainer = script.hasAttribute('data-wrap-container');
            const containerClass = script.getAttribute('data-container-class') || 'brewdown-container';

            if (markdownFile) {
                // Fetch and parse from file
                fetch(markdownFile)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Failed to load markdown file: ${markdownFile}`);
                        }
                        return response.text();
                    })
                    .then(data => {
                        const htmlContent = brewdown(data, {
                            wrapInContainer: wrapInContainer,
                            containerClass: containerClass
                        });

                        const container = document.createElement('div');
                        container.className = 'brewdown-rendered';
                        container.innerHTML = htmlContent;
                        script.parentNode.replaceChild(container, script);

                        // Apply syntax highlighting after external content loads
                        if (typeof hljs !== 'undefined') {
                            container.querySelectorAll('pre code[class]').forEach(block => hljs.highlightElement(block));
                        }
                    })
                    .catch(error => {
                        console.error('Error loading markdown:', error);
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'brewdown-error';
                        errorDiv.innerHTML = `<p>Error loading content: ${error.message}</p>`;
                        script.parentNode.replaceChild(errorDiv, script);
                    });
            } else {
                // Parse inline content from the script tag
                const inlineMarkdown = script.textContent;
                if (inlineMarkdown.trim()) {
                    const htmlContent = brewdown(inlineMarkdown, {
                        wrapInContainer: wrapInContainer,
                        containerClass: containerClass
                    });

                    const container = document.createElement('div');
                    container.className = 'brewdown-rendered';
                    container.innerHTML = htmlContent;
                    script.parentNode.replaceChild(container, script);
                }
            }
        });
    }

    // Process div.brewdown elements by converting their text content to HTML.
    // Child <script data-brewdown> elements are preserved through rendering: each is captured
    // as a placeholder element that passes through brewdown as HTML, then restored to the
    // original script's outerHTML before the div is updated. A second pass of
    // processScriptTags() in processAll() then handles those preserved scripts.
    function processBrewdownDivs() {
        const divs = document.querySelectorAll('div.brewdown');

        divs.forEach(div => {
            const scripts = [];
            let markdownText = '';

            div.childNodes.forEach(child => {
                if (child.nodeType === Node.TEXT_NODE) {
                    markdownText += child.textContent;
                } else if (child.nodeType === Node.ELEMENT_NODE &&
                           child.tagName === 'SCRIPT' &&
                           child.hasAttribute('data-brewdown')) {
                    scripts.push(child.outerHTML);
                    // No leading/trailing \n — surrounding text nodes already carry whitespace.
                    // Extra newlines would create blank lines that brewdown turns into <br>.
                    markdownText += `<brewdown-embed-placeholder data-i="${scripts.length - 1}"></brewdown-embed-placeholder>`;
                } else if (child.nodeType === Node.ELEMENT_NODE) {
                    markdownText += child.outerHTML;
                }
            });

            if (markdownText.trim()) {
                let html = brewdown(markdownText);
                html = html.replace(/<brewdown-embed-placeholder data-i="(\d+)"><\/brewdown-embed-placeholder>/g,
                    (_, i) => scripts[parseInt(i)]);
                div.innerHTML = html;
                div.classList.remove('brewdown');
                div.classList.add('brewdown-rendered');
            }
        });
    }

    // Tooltip runtime — the site's single tooltip system. Any element with [data-tooltip]
    // shows a styled bubble on hover/focus, whether it came from the ??text|tip?? token or
    // was authored directly in HTML/JS (e.g. sidebar theme swatches). Instant (no native
    // title delay) and works for elements added later (event delegation). Styling lives in
    // brewdown.css (.tooltip / .tooltip-term).
    (function () {
        let tip = null;

        function getTip() {
            if (!tip) {
                tip = document.createElement('div');
                tip.className = 'tooltip';
                tip.setAttribute('role', 'tooltip');
                document.body.appendChild(tip);
            }
            return tip;
        }

        function show(el) {
            const text = el.getAttribute('data-tooltip');
            if (!text) return;
            const t = getTip();
            t.textContent = text;
            // Measure first (made displayable via .tooltip styles), then position.
            const r = el.getBoundingClientRect();
            const tr = t.getBoundingClientRect();
            let left = r.left + r.width / 2 - tr.width / 2;
            let top = r.top - tr.height - 8;
            if (top < 6) top = r.bottom + 8;               // flip below if no room above
            left = Math.max(6, Math.min(left, window.innerWidth - tr.width - 6));
            t.style.left = (left + window.scrollX) + 'px';
            t.style.top = (top + window.scrollY) + 'px';
            t.classList.add('tooltip--visible');
        }

        function hide() {
            if (tip) tip.classList.remove('tooltip--visible');
        }

        document.addEventListener('mouseover', e => {
            const el = e.target.closest('[data-tooltip]');
            if (el) show(el);
        });
        document.addEventListener('mouseout', e => {
            if (e.target.closest('[data-tooltip]')) hide();
        });
        document.addEventListener('focusin', e => {
            const el = e.target.closest('[data-tooltip]');
            if (el) show(el);
        });
        document.addEventListener('focusout', hide);
        window.addEventListener('scroll', hide, true);
    })();

    // Process all Brewdown sources when DOM is ready.
    // Order matters: divs first so embedded <script data-brewdown> tags become live DOM nodes
    // via innerHTML; then processScriptTags() picks them up alongside top-level scripts.
    function processAll() {
        processBrewdownDivs();
        processScriptTags();
        // Apply syntax highlighting if highlight.js is loaded
        if (typeof hljs !== 'undefined') {
            hljs.highlightAll();
        }
    }

    // Run processAll as soon as the script executes so other DOMContentLoaded
    // listeners (e.g. ping handlers in minecraft.html) find rendered DOM.
    // This relies on highlight.min.js being loaded BEFORE brewdown.js — see CLAUDE.md.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processAll);
    } else {
        processAll();
    }

    // Public API
    const api = {
        brewdown,
        parseInlineFormatting,
        processScriptTags,
        processBrewdownDivs
    };
    Object.defineProperty(api, 'defaultVar', {
        get() { return defaultVar; },
        set(v) { defaultVar = v; }
    });
    return api;
})();