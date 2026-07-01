// dev.js — drives the dev notes hub.
// Loads a markdown file, renders it through Brewdown, and swaps content on nav click.
// To add a new note: drop a .md file in this folder and add an entry to DOCS below.

const DOCS = [
    { file: "notes/media-mimic.md", title: "Media Mimic", icon: "🎬" },
    { file: "notes/minecraft.md",   title: "Minecraft",   icon: "⛏️" },
];

// URL-hash slug for a doc: bare filename without folder or .md extension.
const slugOf = doc => doc.file.split("/").pop().replace(/\.md$/, "");

const nav = document.getElementById("dev-nav");
const content = document.getElementById("dev-content");

function renderDoc(md) {
    const html = Brewdown.brewdown(md);
    content.innerHTML = html;
    if (typeof hljs !== "undefined") {
        content.querySelectorAll("pre code").forEach(b => hljs.highlightElement(b));
    }
    content.scrollTop = 0;
    window.scrollTo(0, 0);
}

function loadDoc(doc, btn) {
    nav.querySelectorAll("button").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
    location.hash = slugOf(doc);

    fetch(doc.file)
        .then(r => {
            if (!r.ok) throw new Error(`Failed to load ${doc.file} (${r.status})`);
            return r.text();
        })
        .then(renderDoc)
        .catch(err => {
            content.innerHTML = `<p class="dev-error">Error loading content: ${err.message}</p>`;
        });
}

function buildNav() {
    DOCS.forEach(doc => {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.innerHTML = `<span>${doc.icon}</span> ${doc.title}`;
        btn.addEventListener("click", () => loadDoc(doc, btn));
        li.appendChild(btn);
        nav.appendChild(li);

        doc._btn = btn;
    });
}

function init() {
    buildNav();
    // Open the doc named in the URL hash, else the first one.
    const wanted = location.hash.replace(/^#/, "");
    const match = DOCS.find(d => slugOf(d) === wanted);
    const doc = match || DOCS[0];
    if (doc) loadDoc(doc, doc._btn);
}

document.addEventListener("DOMContentLoaded", init);
