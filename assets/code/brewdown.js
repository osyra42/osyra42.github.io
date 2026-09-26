// brewdown.js
// Markdown-to-HTML converter for Coffee Byte Dev.
//
// ============================================================================
// Emit Contract
// ----------------------------------------------------------------------------
// 1. Block tags carry semantic meaning: <h1>–<h6>, <p>, <blockquote>, <pre>,
//    <details>, <hr>. A heading is never emitted as <p>.
//
// 2. Every block also carries a class describing its role: "header",
//    "paragraph", "blank", "blockquote", "code", "collapsible", "media-gallery".
//    CSS targets classes first, tags second.
//
// 3. Every element with class="header" MUST have an id. The id is the slug
//    of the heading text, generated at emit time, deduplicated. There is no
//    code path that emits class="header" without an id.
//
// 4. Inline formatting emits <span> elements with classes (bold, italic,
//    strike, underline, spoiler, copy, link, code, ...). Inline formatting
//    never mutates the enclosing block's tag or classes.
//
// 5. Attributes that carry state (data-copy, data-href, data-src,
//    data-checked) live on spans. Behavior is hydrated after render.
//
// 6. Blank lines emit <p class="blank"></p>. Whitespace is structural.
//
// 7. Whitespace is preserved verbatim. Trailing spaces, consecutive blank
//    lines, and indentation in the source are emitted as-is. The parser
//    never trims, collapses, or normalizes whitespace. If the rendered
//    output has odd spacing, the source has odd spacing.
// ============================================================================

const Brewdown = (function () {

    let _tocEntries = null;
    let _usedSlugs = null;

    // ------------------------------------------------------------------------
    // Utilities
    // ------------------------------------------------------------------------

    function isExternalUrl(url) {
        return /^https?:\/\//i.test(url) || url.endsWith('.pdf');
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function slugify(text) {
        return String(text).toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') || 'section';
    }

    function uniqueSlug(base) {
        let slug = base;
        let n = 2;
        while (_usedSlugs.has(slug)) {
            slug = `${base}-${n++}`;
        }
        _usedSlugs.add(slug);
        return slug;
    }

    // ------------------------------------------------------------------------
    // Inline formatting
    // ------------------------------------------------------------------------
    // Each format emits a <span> with classes/attributes. No format ever
    // touches the enclosing block. Inline code is protected first.

    function parseInlineFormatting(text) {
        // Protect inline code
        const codeBlocks = [];
        text = text.replace(/`([^`]+?)`/g, function (_, code) {
            codeBlocks.push('<span class="code">' + escapeHtml(code) + '</span>');
            return `\x00CODE${codeBlocks.length - 1}\x00`;
        });

        // Styling formats
        text = text.replace(/\*\*(.+?)\*\*/g, '<span class="bold">$1</span>');
        text = text.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g,
                            '<span class="italic">$1</span>');
        text = text.replace(/__(.+?)__/g, '<span class="underline">$1</span>');
        text = text.replace(/~~(.+?)~~/g, '<span class="strike">$1</span>');

        // Stateful formats
        text = text.replace(/!!(.+?)!!/g,
            '<span class="spoiler" onclick="this.classList.toggle(\'revealed\')">$1</span>');
        text = text.replace(/\^\^(.+?)\^\^/g, function (_, content) {
            const safe = escapeHtml(content);
            return `<span class="copy" data-copy="${safe}" onclick="navigator.clipboard.writeText(this.dataset.copy);var e=this,o=e.textContent;e.textContent='Copied!';setTimeout(function(){e.textContent=o},500)">${safe}</span>`;
        });

        // Checkboxes
        text = text.replace(/\[x\]/gi, '<span class="checkbox" data-checked="true"></span>');
        text = text.replace(/\[ \]/g, '<span class="checkbox" data-checked="false"></span>');

        // Media
        text = text.replace(/!\[(.*?)\]\((.*?)\)/g, function (_, alt, url) {
            const ext = url.split('.').pop().split(/[?#]/)[0].toLowerCase();
            const img = ['jpg','jpeg','png','gif','webp','svg','bmp','ico','avif'];
            const vid = ['mp4','webm','ogg','mov'];
            const aud = ['mp3','wav','flac','aac','m4a'];
            const safeAlt = escapeHtml(alt);
            if (img.includes(ext))
                return `<span class="media" data-type="image" data-src="${url}" data-alt="${safeAlt}"></span>`;
            if (vid.includes(ext))
                return `<span class="media" data-type="video" data-src="${url}" data-alt="${safeAlt}"></span>`;
            if (aud.includes(ext))
                return `<span class="media" data-type="audio" data-src="${url}" data-alt="${safeAlt}"></span>`;
            const isZip = /\.zip(\?|#|$)/i.test(url);
            const badge = isZip ? '💾 ' : '🔗 ';
            return `<span class="file" data-href="${url}">${badge}${safeAlt || url}</span>`;
        });

        // Links
        text = text.replace(/\[(.*?)\]\((.*?)\)/g, function (_, linkText, url) {
            const external = isExternalUrl(url);
            const isZip = /\.zip(\?|#|$)/i.test(url);
            let badge = '';
            if (external) badge += '🔗 ';
            if (isZip) badge += '💾 ';
            const cls = 'link' + (external ? ' external' : '') + (isZip ? ' zip' : '');
            return `<span class="${cls}" data-href="${url}">${badge}${linkText}</span>`;
        });

        // Restore inline code
        text = text.replace(/\x00CODE(\d+)\x00/g, function (_, i) {
            return codeBlocks[parseInt(i)];
        });

        return text;
    }

    // ------------------------------------------------------------------------
    // TOC
    // ------------------------------------------------------------------------

    function renderToc(entries) {
        if (!entries || entries.length === 0) return '';
        const lines = entries.map(e => {
            const indent = e.level <= 1 ? '' : '  '.repeat(e.level - 1);
            return `${indent}<a href="#${e.slug}">${escapeHtml(e.text)}</a>`;
        });
        return `<pre class="brewdown-toc" data-brewdown-toc><strong>TABLE OF CONTENTS</strong><hr>${lines.join('\n')}</pre>`;
    }

    // ------------------------------------------------------------------------
    // Main parser
    // ------------------------------------------------------------------------

    function brewdown(markdownText, options = {}) {
        const {
            wrapInContainer = false,
            containerClass = 'brewdown-container'
        } = options;

        _tocEntries = [];
        _usedSlugs = new Set();
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
            if (tableRows.length === 0) { inTable = false; return; }
            let html = '<div class="table-wrap"><table class="table">\n';
            const indexCols = new Set();
            tableRows.forEach((row, i) => {
                const cells = row.split('|').slice(1, -1);
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
            const indent = inCodeBlock ? 0 : rawLine.match(/^(\s*)/)[1].length;
            const line = inCodeBlock ? rawLine.replace(baseIndentRe, '') : rawLine.trimStart();

            // ---- Fenced code blocks ----------------------------------------
            if (line.startsWith('```')) {
                if (!inCodeBlock) {
                    closeOpenBlocks();
                    inCodeBlock = true;
                    codeBlockContent = '';
                    codeBlockLang = line.trim().substring(3).trim();
                    baseIndentRe = /^/;
                } else {
                    const langClass = codeBlockLang ? ` class="language-${codeBlockLang}"` : '';
                    htmlContent += `<pre class="code-block"><code${langClass}>${escapeHtml(codeBlockContent)}</code></pre>\n`;
                    inCodeBlock = false;
                    codeBlockContent = '';
                    codeBlockLang = '';
                }
                return;
            }

            if (inCodeBlock) {
                if (!codeBlockContent && rawLine.trim()) {
                    const baseIndent = rawLine.match(/^(\s*)/)[1];
                    baseIndentRe = baseIndent ? new RegExp('^' + baseIndent) : /^/;
                }
                codeBlockContent += (codeBlockContent ? '\n' : '') + line;
                return;
            }

            // ---- Tables -----------------------------------------------------
            if (line.startsWith('|') && line.endsWith('|')) {
                if (!inTable) { closeOpenBlocks(); inTable = true; }
                tableRows.push(line);
                return;
            } else if (inTable) {
                flushTable();
            }

            // ---- Collapsibles ----------------------------------------------
            if (line.startsWith('>>>')) {
                closeOpenBlocks();
                const title = line.substring(3).trim() || 'Details';
                const slug = uniqueSlug(slugify(title));
                htmlContent += `<details class="collapsible" id="${slug}"><summary>${parseInlineFormatting(title)}</summary>\n`;
                detailsDepth++;
                return;
            }
            if (line === '<<<') {
                closeOpenBlocks();
                if (detailsDepth > 0) {
                    htmlContent += '</details>\n';
                    detailsDepth--;
                }
                return;
            }

            // ---- TOC marker -------------------------------------------------
            if (line.trim() === '::toc::') {
                closeOpenBlocks();
                htmlContent += '\x00BREWDOWN_TOC\x00\n';
                return;
            }

            // ---- Headings ---------------------------------------------------
            const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
            if (headerMatch) {
                closeOpenBlocks();
                const level = headerMatch[1].length;
                const headerText = headerMatch[2];
                const id = uniqueSlug(slugify(headerText));
                const inner = parseInlineFormatting(headerText);
                htmlContent += `<h${level} class="header" id="${id}">${inner}</h${level}>\n`;
                if (_tocEntries && level >= 1 && level <= 3) {
                    _tocEntries.push({ level, text: headerText, slug: id });
                }
                return;
            }

            // ---- Blockquotes ------------------------------------------------
            if (line.startsWith('> ') || line === '>') {
                const content = line === '>' ? '' : line.substring(2);
                if (!inBlockquote) {
                    htmlContent += '<blockquote class="blockquote">\n';
                    inBlockquote = true;
                }
                if (content) {
                    htmlContent += `<p class="paragraph">${parseInlineFormatting(content)}</p>\n`;
                }
                return;
            }

            // ---- Horizontal rule --------------------------------------------
            if (line.match(/^[-*]{3,}$/)) {
                closeOpenBlocks();
                htmlContent += '<hr class="divider">\n';
                return;
            }

            // ---- Blank line -------------------------------------------------
            if (rawLine.trim() === '') {
                if (inBlockquote) {
                    htmlContent += '</blockquote>\n';
                    inBlockquote = false;
                } else {
                    htmlContent += '<p class="blank"></p>\n';
                }
                return;
            }

            // ---- Media-only line (gallery) ---------------------------------
            if (line.match(/^!\[.*?\]\(.*?\)$/)) {
                if (!inGallery) {
                    htmlContent += '<div class="media-gallery">\n';
                    inGallery = true;
                }
                htmlContent += parseInlineFormatting(line) + '\n';
                return;
            }

            // ---- Paragraph --------------------------------------------------
            closeOpenBlocks();
            const rendered = parseInlineFormatting(line);
            const cls = indent > 0 ? 'paragraph indented' : 'paragraph';
            const style = indent > 0 ? ` style="margin-left:${indent}ch"` : '';
            htmlContent += `<p class="${cls}"${style}>${rendered}</p>\n`;
        });

        // Close anything left open
        if (inCodeBlock) {
            const langClass = codeBlockLang ? ` class="language-${codeBlockLang}"` : '';
            htmlContent += `<pre class="code-block"><code${langClass}>${escapeHtml(codeBlockContent)}</code></pre>\n`;
        }
        if (inBlockquote) htmlContent += '</blockquote>\n';
        if (inTable) flushTable();
        while (detailsDepth > 0) { htmlContent += '</details>\n'; detailsDepth--; }

        // Inject TOC
        const tocHtml = renderToc(_tocEntries);
        htmlContent = htmlContent.replace(/\x00BREWDOWN_TOC\x00/g, tocHtml);
        _tocEntries = null;
        _usedSlugs = null;

        if (wrapInContainer) {
            return `<div class="${containerClass}">${htmlContent}</div>`;
        }
        return htmlContent;
    }

    // ------------------------------------------------------------------------
    // Hydration — spans → real elements
    // ------------------------------------------------------------------------

    function hydrateSpans(root) {
        // Links
        root.querySelectorAll('span.link').forEach(span => {
            const a = document.createElement('a');
            a.href = span.dataset.href;
            if (span.classList.contains('external') || span.classList.contains('zip')) {
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
            }
            if (span.classList.contains('zip')) a.title = 'Click to save';
            else if (span.classList.contains('external')) a.title = 'Click to follow external link';
            while (span.firstChild) a.appendChild(span.firstChild);
            span.replaceWith(a);
        });

        // Files
        root.querySelectorAll('span.file').forEach(span => {
            const a = document.createElement('a');
            a.href = span.dataset.href;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.title = 'Click to save';
            while (span.firstChild) a.appendChild(span.firstChild);
            span.replaceWith(a);
        });

        // Media
        root.querySelectorAll('span.media').forEach(span => {
            const type = span.dataset.type;
            const src = span.dataset.src;
            const alt = span.dataset.alt || '';
            const a = document.createElement('a');
            a.href = src;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.className = 'media-link';
            a.title = 'Click to open';

            let el;
            if (type === 'image') {
                el = document.createElement('img');
                el.src = src; el.alt = alt;
            } else if (type === 'video') {
                el = document.createElement('video');
                el.src = src; el.controls = true; el.title = alt;
            } else {
                el = document.createElement('audio');
                el.src = src; el.controls = true; el.title = alt;
            }
            a.appendChild(el);
            span.replaceWith(a);
        });

        // Checkboxes
        root.querySelectorAll('span.checkbox').forEach(span => {
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = span.dataset.checked === 'true';
            span.replaceWith(input);
        });
    }

    // ------------------------------------------------------------------------
    // DOM integration
    // ------------------------------------------------------------------------

    function processScriptTags(root) {
        const scope = root || document.querySelector('main') || document;
        const scripts = scope.querySelectorAll('script[data-brewdown]');
        const pending = [];

        scripts.forEach(script => {
            const markdownFile = script.getAttribute('data-brewdown');
            const wrapInContainer = script.hasAttribute('data-wrap-container');
            const containerClass = script.getAttribute('data-container-class') || 'brewdown-container';

            if (markdownFile) {
                pending.push(fetch(markdownFile)
                    .then(response => {
                        if (!response.ok) throw new Error(`Failed to load markdown file: ${markdownFile}`);
                        return response.text();
                    })
                    .then(data => {
                        const htmlContent = brewdown(data, { wrapInContainer, containerClass });
                        const container = document.createElement('div');
                        container.className = 'brewdown-rendered';
                        container.innerHTML = htmlContent;
                        hydrateSpans(container);
                        if (typeof hljs !== 'undefined') {
                            container.querySelectorAll('pre code[class]').forEach(b => hljs.highlightElement(b));
                        }
                        script.parentNode.replaceChild(container, script);
                    })
                    .catch(error => {
                        console.error('Error loading markdown:', error);
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'brewdown-error';
                        errorDiv.innerHTML = `<p>Error loading content: ${error.message}</p>`;
                        script.parentNode.replaceChild(errorDiv, script);
                    }));
            } else {
                const inlineMarkdown = script.textContent;
                if (inlineMarkdown.trim()) {
                    const htmlContent = brewdown(inlineMarkdown, { wrapInContainer, containerClass });
                    const container = document.createElement('div');
                    container.className = 'brewdown-rendered';
                    container.innerHTML = htmlContent;
                    hydrateSpans(container);
                    script.parentNode.replaceChild(container, script);
                }
            }
        });

        return Promise.all(pending);
    }

    function processBrewdownDivs(root) {
        const scope = root || document.querySelector('main') || document;
        const divs = scope.querySelectorAll('div.brewdown');

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
                hydrateSpans(div);
                div.classList.remove('brewdown');
                div.classList.add('brewdown-rendered');
            }
        });
    }

    function rebuildToc(root) {
        const scope = root || document.querySelector('main');
        if (!scope) return;
        const toc = scope.querySelector('pre.brewdown-toc[data-brewdown-toc]');
        if (!toc) return;

        const entries = [];
        scope.querySelectorAll('.header[id]').forEach(el => {
            if (toc.contains(el)) return;
            const level = parseInt(el.tagName[1]) || 1;
            entries.push({ level, text: el.textContent.trim(), slug: el.id });
        });

        const html = renderToc(entries);
        if (html) toc.outerHTML = html;
    }

    function processAll() {
        const root = document.querySelector('main');
        if (!root) return;
        processBrewdownDivs(root);
        const included = processScriptTags(root);
        if (typeof hljs !== 'undefined') {
            root.querySelectorAll('pre code').forEach(b => hljs.highlightElement(b));
        }
        included.then(() => rebuildToc(root));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processAll);
    } else {
        processAll();
    }

    return { brewdown, processScriptTags, processBrewdownDivs, rebuildToc, hydrateSpans };
})();