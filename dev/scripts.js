// auth.js
(function() {
    const CORRECT_PASSWORD = "osyra42quest";
    const outputEl = document.getElementById('output');
    const inputLine = document.getElementById('inputLine');
    const passwordField = document.getElementById('passwordInput');

    // block everything until authenticated
    let authenticated = false;

    function renderLockedMessage() {
        outputEl.innerHTML = `
            <div style="margin-bottom: 1.2rem;">🔐 <strong style="color:#e67e22;">developer gate</strong></div>
            <div style="margin-bottom: 0.8rem;">⚡ this page requires a password to load.</div>
            <div style="margin-bottom: 1rem;">⛓️ javascript blocks rendering until valid passphrase.</div>
            <div style="border-left: 3px solid #2ecc71; padding-left: 1rem; margin-top: 1.2rem;">
                ✦ <span style="color:#b48ead;">for osyra42</span> — developer quests & project coordination<br>
                ✦ use <span style="background:#1e2a2a; padding: 0.1rem 0.4rem;">markdown-like</span> notes without a parser (raw emoji + text)<br>
                ✦ assist with: <span style="color:#e5c07b;">tooling · scripts · debug · prototypes</span>
            </div>
            <div style="margin-top: 1.6rem;">
                📜 <span style="color:#98c379;"># dev-quests > osyra42/workspace</span><br>
                🧩 _no external parser — plain emoji/markdown vibe_
            </div>
        `;
        // show password field
        inputLine.style.display = 'flex';
        if (passwordField) passwordField.focus();
    }

    function unlockPage() {
        authenticated = true;
        // full content after authentication — hyper minimal but complete
        outputEl.innerHTML = `
            <div style="margin-bottom: 1rem;">✅ <strong style="color:#2ecc71;">access granted</strong> — welcome, operative.</div>
            <div style="margin-bottom: 0.8rem;">━━━━━━━━━━━━━━━━━━━━━━</div>
            <div>🎯 <span style="color:#f1c40f;">osyra42 · quest board</span></div>
            <div style="margin: 1rem 0 0.5rem 0;">
                🧙 🧰 🌀  <strong>developer assistance zone</strong><br>
                🔧 projects: automation · infra · CLI helpers · refactors
            </div>
            <div style="margin: 0.8rem 0 0.2rem 0;">📌 markdown-ish (no parser, raw):</div>
            <div style="background:#0b0e12; padding: 0.6rem 1rem; margin-top: 0.5rem;">
                # quest: osyra42/tasks<br>
                - [ ] build modular script 🔁<br>
                - [ ] review PR for core lib 🧪<br>
                - [ ] `deploy assist` — staging env<br>
                <br>
                > *emojis only, no markdown engine*<br>
                🌱 〰️ [repo: osyra42/dev-dojo] 〰️ 🐚
            </div>
            <div style="margin-top: 1.2rem; font-size: 0.85rem; color: #6e7b8c;">
                💡 session active — reload will re-lock.
            </div>
        `;
        // remove input line completely after success
        if (inputLine) inputLine.style.display = 'none';
        // remove any leftover blocking UI
        document.body.style.opacity = '1';
    }

    function handlePasswordSubmit(e) {
        if (authenticated) return;
        if (e.key === 'Enter' && passwordField.value.trim() === CORRECT_PASSWORD) {
            unlockPage();
        } else if (e.key === 'Enter') {
            outputEl.innerHTML += `<div style="color:#e06c75; margin-top:0.8rem;">⛔ invalid pass. try again. 🔁</div>`;
            passwordField.value = '';
            // keep blocked state
            const oldOutput = outputEl.innerHTML;
            setTimeout(() => {
                if (!authenticated) outputEl.innerHTML = oldOutput.replace(/<div style="color:#e06c75; margin-top:0.8rem;">⛔ invalid pass. try again. 🔁<\/div>/, '');
            }, 1200);
        }
    }

    // initial load – blocking everything until password
    function init() {
        renderLockedMessage();
        // fully block any accidental content flash
        document.body.style.background = "#0a0c0f";
        if (passwordField) {
            passwordField.addEventListener('keypress', handlePasswordSubmit);
            passwordField.focus();
        }
        // ensure no interactive elements before auth (except password)
    }

    init();
})();