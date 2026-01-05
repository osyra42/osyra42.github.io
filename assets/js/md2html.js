// md2html.js - A self-executing Markdown to HTML converter
const Md2Html = (function() {
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function parseInlineFormatting(text) {
        // Bold: **text** or __text__
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/__(.*?)__/g, '<strong>$1</strong>');
        
        // Italic: *text* or _text_
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        text = text.replace(/_(.*?)_/g, '<em>$1</em>');
        
        // Inline code: `code`
        text = text.replace(/`(.*?)`/g, '<code>$1</code>');
        
        // Links: [text](url)
        text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
        
        return text;
    }

    function md2html(markdownText, options = {}) {
        const {
            wrapInContainer = false,
            containerClass = 'md2html-container'
        } = options;

        let htmlContent = '';
        const lines = markdownText.split('\n');
        let inList = false;
        let inBlockquote = false;

        lines.forEach(line => {
            let processedLine = '';

            // Headers
            if (line.startsWith('# ')) {
                processedLine = `<h1>${parseInlineFormatting(line.substring(2))}</h1>`;
            } else if (line.startsWith('## ')) {
                processedLine = `<h2>${parseInlineFormatting(line.substring(3))}</h2>`;
            } else if (line.startsWith('### ')) {
                processedLine = `<h3>${parseInlineFormatting(line.substring(4))}</h3>`;
            } else if (line.startsWith('#### ')) {
                processedLine = `<h4>${parseInlineFormatting(line.substring(5))}</h4>`;
            } else if (line.startsWith('##### ')) {
                processedLine = `<h5>${parseInlineFormatting(line.substring(6))}</h5>`;
            } else if (line.startsWith('###### ')) {
                processedLine = `<h6>${parseInlineFormatting(line.substring(7))}</h6>`;
            }
            // Unordered list
            else if (line.startsWith('- ') || line.startsWith('* ')) {
                if (!inList) {
                    processedLine = `<ul><li>${parseInlineFormatting(line.substring(2))}</li>`;
                    inList = true;
                } else {
                    processedLine = `<li>${parseInlineFormatting(line.substring(2))}</li>`;
                }
            }
            // Blockquotes
            else if (line.startsWith('> ')) {
                if (!inBlockquote) {
                    processedLine = `<blockquote><p>${parseInlineFormatting(line.substring(2))}</p>`;
                    inBlockquote = true;
                } else {
                    processedLine = `<p>${parseInlineFormatting(line.substring(2))}</p>`;
                }
            }
            // Horizontal rule
            else if (line.match(/^[-*_]{3,}$/)) {
                processedLine = '<hr>';
            }
            // Empty line - create empty paragraph for spacing, close lists/blockquotes
            else if (line.trim() === '') {
                if (inList) {
                    processedLine = '</ul>';
                    inList = false;
                } else if (inBlockquote) {
                    processedLine = '</blockquote>';
                    inBlockquote = false;
                } else {
                    processedLine = '<p>&nbsp;</p>';
                }
            }
            // Regular paragraph
            else {
                processedLine = `<p>${parseInlineFormatting(line)}</p>`;
            }

            htmlContent += processedLine + '\n';
        });

        // Close any open lists or blockquotes at the end
        if (inList) htmlContent += '</ul>';
        if (inBlockquote) htmlContent += '</blockquote>';

        if (wrapInContainer) {
            return `<div class="${containerClass}">${htmlContent}</div>`;
        }

        return htmlContent;
    }

    // Auto-execute function to process script tags
    function processScriptTags() {
        // Find all script tags with the data-md2html attribute
        const scripts = document.querySelectorAll('script[data-md2html]');
        
        scripts.forEach(script => {
            const markdownFile = script.getAttribute('data-md2html');
            const wrapInContainer = script.hasAttribute('data-wrap-container');
            const containerClass = script.getAttribute('data-container-class') || 'md2html-container';
            
            if (markdownFile) {
                fetch(markdownFile)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Failed to load markdown file: ${markdownFile}`);
                        }
                        return response.text();
                    })
                    .then(data => {
                        const htmlContent = md2html(data, {
                            wrapInContainer: wrapInContainer,
                            containerClass: containerClass
                        });
                        
                        // Create a container div and replace the script tag
                        const container = document.createElement('div');
                        container.innerHTML = htmlContent;
                        script.parentNode.replaceChild(container, script);
                        
                        console.log(`Markdown content loaded from: ${markdownFile}`);
                    })
                    .catch(error => {
                        console.error('Error loading markdown:', error);
                        // Display error message in place of the script
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'md2html-error';
                        errorDiv.innerHTML = `<p>Error loading content: ${error.message}</p>`;
                        script.parentNode.replaceChild(errorDiv, script);
                    });
            }
        });
    }

    // Process script tags when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processScriptTags);
    } else {
        processScriptTags();
    }

    // Public API
    return {
        md2html,
        parseInlineFormatting,
        processScriptTags // Expose for manual triggering if needed
    };
})();