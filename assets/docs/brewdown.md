# Brewdown

A coffee-flavored Markdown-to-HTML converter. Brewdown extends standard Markdown with media embedding, spoilers, collapsible sections, interactive forms, timestamps, and template variables. No dependencies. One script. Drop it in and go.

---

## Quick Start

Add these two lines to your HTML:

```html
<link rel="stylesheet" href="https://coffeebyte.dev/assets/css/brewdown.css" />
<script src="https://coffeebyte.dev/assets/js/brewdown.js" defer></script>
```

Then write markdown in a div:

```html
<div class="markdown">
# Hello World
This is **Brewdown** in action.
</div>
```

Or load from an external file:

```html
<script data-brewdown="path/to/file.md"></script>
```

Or use inline script tags:

```html
<script type="text/markdown" data-brewdown>
# Hello World
This is **Brewdown** in action.
</script>
```

That's it. Brewdown processes everything on page load.

---

## Text Formatting

```
**bold**
*italic*
~~strikethrough~~
__underline__
`inline code`
```

### Escape Characters

Use `\` before any character to prevent Brewdown from processing it.

```
\*not italic\*
\[not a link\](url)
```

Inside code blocks, a backslash before a backtick escapes it so it displays literally.

---

## Headings

```
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
```

---

## Links

```
[Link Text](https://example.com)
```

External links (http/https, magnet, .pdf) automatically open in a new tab.

---

## Media Embedding

Use image syntax — Brewdown detects the file type by extension and renders the appropriate HTML element.

```
![alt text](photo.jpg)        -> <img>
![alt text](video.mp4)        -> <video controls>
![alt text](song.mp3)         -> <audio controls>
![alt text](document.pdf)     -> opens in new tab
```

**Image:** jpg, jpeg, png, gif, webp, svg, bmp, ico, avif
**Video:** mp4, webm, ogg, mov
**Audio:** mp3, wav, flac, aac, m4a
**Other:** opens in a new tab (browser renders or downloads)

---

## Code Blocks

```
\`\`\`javascript
function hello() {
    console.log("Hello, world!");
}
\`\`\`
```

Works with highlight.js if loaded on the page.

---

## Blockquotes

```
> This is a blockquote.
> It can span multiple lines.
```

---

## Tables

```
| Name   | Role   |
|--------|--------|
| Alice  | Admin  |
| Bob    | User   |
```

---

## Checkboxes

```
[ ] Unchecked
[x] Checked
```

---

## Horizontal Rules

```
---
```

---

## Timestamps

Converts a date to the user's local format with a semantic `<time>` element.

```
@@2026.03.28@@              -> March 28, 2026
@@2026.03.28.14.30@@        -> March 28, 2026 at 2:30 PM
```

---

## Spoilers

Click-to-reveal hidden text.

```
!!This text is hidden until clicked.!!
```

Requires CSS for the `.spoiler` and `.spoiler.revealed` classes.

---

## Collapsible Sections

Wraps content in a `<details>/<summary>` element.

```
>>> Click to expand
Content goes here.
More content.
<<<
```

Supports nesting:

```
>>> Outer
>>> Inner
Nested content.
<<<
<<<
```

---

## Interactive Forms

Wraps content in a form container div for use with JavaScript.

```
:: My Form Title
**Your Name:**
___

**Options:**
[ ] Option A
[ ] Option B
::
```

- `___` (three or more underscores) creates a text input field
- `[ ]` creates an interactive checkbox
- The form div gets class `brewdown-form` and a `data-form-title` attribute

---

## Template Variables

Placeholders that render as `<span>` elements with IDs for JavaScript to target.

```
Server status: {{server-status}}
```

Set the default text before loading:

```html
<script>Brewdown.defaultVar = 'Loading...';</script>
```

---

## HTML Passthrough

Raw HTML lines are passed through as-is.

---

## API

Brewdown exposes a public API for manual use:

```javascript
// Convert markdown string to HTML
const html = Brewdown.brewdown(markdownText);

// With options
const html = Brewdown.brewdown(markdownText, {
    wrapInContainer: true,
    containerClass: 'my-class'
});

// Parse inline formatting only
const html = Brewdown.parseInlineFormatting(text);

// Re-process script tags or markdown divs
Brewdown.processScriptTags();
Brewdown.processMarkdownDivs();

// Set default text for template variables
Brewdown.defaultVar = 'Loading...';
```

---

## CDN Links

```
https://coffeebyte.dev/assets/js/brewdown.js
https://coffeebyte.dev/assets/css/brewdown.css
```

Brewdown is free to use. No attribution required, but appreciated.

---

**Last Updated:** @@2026.03.31@@
**Author:** Coffee Byte Dev (osyra42)
