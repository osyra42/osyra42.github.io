// brewdown.js
// A small Markdown-to-HTML converter for Coffee Byte Dev.


const Brewdown = (function () {

    let _tocEntries = null;

    function isExternalUrl(url) {
        return /^https?:\/\//i.test(url) || url.endsWith('.pdf');
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

        const lines = entries.map(e => {
            const indent = e.level === 0 ? '' : '  '.repeat(Math.max(0, e.level - 1));
            return `${indent}<a href="#${e.slug}">${escapeHtml(e.text)}</a>`;
        });

        return `<pre class="brewdown-toc" data-brewdown-toc><strong>TABLE OF CONTENTS</strong>\n\n${lines.join('\n')}</pre>`;
    }

    function consumeTitle(markdownText) {
        const lines = markdownText.split(/\r?\n/);
        const first = lines[0] || '';
        const match = first.match(/^#\s+(\S+)\s+(.+?)\s*$/);
        if (!match) return markdownText;

        const [, icon, title] = match;
        window.icon  = icon;
        window.title = title;
        document.title = title + ' - Coffee Byte Dev';

        const h1 = document.querySelector('.download-bar h1');
        if (h1) h1.textContent = title;

        return markdownText;
    }

    function parseInlineFormatting(text) {
        // Inline code: `code` (protect content from later rules)
        const codeBlocks = [];
        text = text.replace(/`([^`]+?)`/g, function (_, code) {
            codeBlocks.push('<code>' + escapeHtml(code) + '</code>');
            return `\x00CODE${codeBlocks.length - 1}\x00`;
        });

        // Click-to-copy: ^^text^^
        text = text.replace(/\^\^(.*?)\^\^/g, function (_, content) {
            const handler = "var e=this,o=e.innerHTML;navigator.clipboard.writeText(e.dataset.copy);e.innerHTML='Copied!';setTimeout(function(){e.innerHTML=o},500)";
            return '<span class="copy-text" title="Click to copy this text" data-copy="' + escapeHtml(content) + '" onclick="' + handler + '">📋 ' + content + '</span>';
        });

        // Spoiler: !!text!!
        text = text.replace(/!!(.*?)!!/g,
            '<span class="spoiler" title="Click to reveal" onclick="this.classList.toggle(\'revealed\')">$1</span>');

        // Bold, italic, strikethrough, underline
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        text = text.replace(/~~(.*?)~~/g, '<del>$1</del>');
        text = text.replace(/__([^_]+?)__/g, '<u>$1</u>');

        // Checkboxes (before links)
        text = text.replace(/\[x\]/gi, '<input type="checkbox" checked>');
        text = text.replace(/\[ \]/g, '<input type="checkbox">');

        // Media: ![alt](url)
        text = text.replace(/!\[(.*?)\]\((.*?)\)/g, function (_, alt, url) {
            const ext = url.split('.').pop().split(/[?#]/)[0].toLowerCase();
            if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'avif'].includes(ext)) {
                return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="media-link" title="Click to open"><img src="${url}" alt="${alt}"></a>`;
            }
            if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) {
                return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="media-link" title="Click to open"><video controls src="${url}" title="${alt}"></video></a>`;
            }
            if (['mp3', 'wav', 'flac', 'aac', 'm4a'].includes(ext)) {
                return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="media-link" title="Click to open"><audio controls src="${url}" title="${alt}"></audio></a>`;
            }
            const isZip = /\.zip(\?|#|$)/i.test(url);
            const badge = isZip ? '💾 ' : '🔗 ';
            const titleAttr = isZip ? ' title="Click to save"' : ' title="Click to follow external link"';
            return `<a href="${url}" target="_blank" rel="noopener noreferrer"${titleAttr}>${badge}${alt || url}</a>`;
        });

        // Links: [text](url)
        text = text.replace(/\[(.*?)\]\((.*?)\)/g, function (_, linkText, url) {
            const external = isExternalUrl(url);
            const isZip = /\.zip(\?|#|$)/i.test(url);
            let badge = '';
            if (external) badge += '🔗 ';
            if (isZip) badge += '💾 ';
            let titleAttr = '';
            if (isZip) titleAttr = ' title="Click to save"';
            else if (external) titleAttr = ' title="Click to follow external link"';
            if (external || isZip) {
                return `<a href="${url}" target="_blank" rel="noopener noreferrer"${titleAttr}>${badge}${linkText}</a>`;
            }
            return `<a href="${url}">${linkText}</a>`;
        });

        // Restore inline code
        text = text.replace(/\x00CODE(\d+)\x00/g, function (_, i) {
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
            const indent = inCodeBlock ? 0 : rawLine.match(/^(\s*)/)[1].length;
            const line = inCodeBlock ? rawLine.replace(baseIndentRe, '') : rawLine.trimStart();

            // Fenced code blocks
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
                codeBlockContent += (codeBlockContent ? '\n' : '') + line;
                return;
            }

            // Tables
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

            // Collapsibles
            if (line.startsWith('>>>')) {
                closeOpenBlocks();
                const title = line.substring(3).trim() || 'Details';
                const slug = slugify(title);
                processedLine = `<details id="${slug}"><summary>${parseInlineFormatting(title)}</summary>`;
                detailsDepth++;
                htmlContent += processedLine + '\n';
                return;
            }
            if (line === '<<<') {
                closeOpenBlocks();
                if (detailsDepth > 0) {
                    processedLine = '</details>';
                    detailsDepth--;
                    htmlContent += processedLine + '\n';
                }
                return;
            }

            // TOC marker on its own line
            if (line.trim() === '::toc::') {
                closeOpenBlocks();
                htmlContent += '\x00BREWDOWN_TOC\x00\n';
                return;
            }

            // Headings
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
            // Empty line
            else if (rawLine.trim() === '') {
                if (inBlockquote) {
                    processedLine = '</blockquote>';
                    inBlockquote = false;
                } else {
                    processedLine = '<br>';
                }
            }
            // Media-only line
            else if (line.match(/^!\[.*?\]\(.*?\)$/)) {
                if (!inGallery) {
                    htmlContent += '<div class="media-gallery">\n';
                    inGallery = true;
                }
                processedLine = parseInlineFormatting(line);
            }
            // Paragraph
            else {
                closeOpenBlocks();
                processedLine = `<p>${parseInlineFormatting(line)}</p>`;
            }

            if (indent > 0 && processedLine) {
                processedLine = processedLine.replace(/^(<\w+)/, `$1 style="margin-left:${indent}ch"`);
            }
            htmlContent += processedLine + '\n';
        });

        if (inCodeBlock) {
            const langClass = codeBlockLang ? ` class="language-${codeBlockLang}"` : '';
            htmlContent += `<pre><code${langClass}>${escapeHtml(codeBlockContent)}</code></pre>`;
        }
        if (inBlockquote) htmlContent += '</blockquote>';
        if (inTable) flushTable();
        while (detailsDepth > 0) { htmlContent += '</details>\n'; detailsDepth--; }

        const tocHtml = renderToc(_tocEntries);
        htmlContent = htmlContent.replace(/\x00BREWDOWN_TOC\x00/g, tocHtml);
        _tocEntries = null;

        if (wrapInContainer) {
            return `<div class="${containerClass}">${htmlContent}</div>`;
        }

        return htmlContent;
    }

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
                        if (!response.ok) {
                            throw new Error(`Failed to load markdown file: ${markdownFile}`);
                        }
                        return response.text();
                    })
                    .then(data => {
                        consumeTitle(data);
                        const htmlContent = brewdown(data, {
                            wrapInContainer: wrapInContainer,
                            containerClass: containerClass
                        });

                        const container = document.createElement('div');
                        container.className = 'brewdown-rendered';
                        container.innerHTML = htmlContent;

                        if (typeof hljs !== 'undefined') {
                            container.querySelectorAll('pre code[class]').forEach(block => hljs.highlightElement(block));
                        }

                        if (script.parentNode.closest('.brewdown-rendered')) {
                            script.parentNode.replaceChild(
                                document.createRange().createContextualFragment(container.innerHTML),
                                script
                            );
                        } else {
                            script.parentNode.replaceChild(container, script);
                        }
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
                div.classList.remove('brewdown');
                div.classList.add('brewdown-rendered');
            }
        });
    }

    function processAll() {
        const root = document.querySelector('main');
        if (!root) return;

        processBrewdownDivs(root);
        const included = processScriptTags(root);

        if (typeof hljs !== 'undefined') {
            root.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
        }

        included.then(() => rebuildToc(root));
    }

    function rebuildToc(root) {
        const scope = root || document.querySelector('main');
        if (!scope) return;

        const toc = scope.querySelector('pre.brewdown-toc[data-brewdown-toc]');
        if (!toc) return;

        const entries = [];
        scope.querySelectorAll('h1[id], h2[id], h3[id]').forEach(el => {
            if (toc.contains(el)) return;
            entries.push({
                level: parseInt(el.tagName[1]),
                text: el.textContent.trim(),
                slug: el.id
            });
        });

        const html = renderToc(entries);
        if (html) toc.outerHTML = html;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processAll);
    } else {
        processAll();
    }

    return { brewdown, processScriptTags, processBrewdownDivs, rebuildToc };
})();