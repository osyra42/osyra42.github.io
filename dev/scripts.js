// auth.js
(function() {
    const CORRECT_PASSWORD = "osyra42quest";
    const outputEl = document.getElementById('output');
    const passwordField = document.getElementById('passwordInput');
    
    let unlocked = false;

    function renderLockedMessage() {
        outputEl.innerHTML = `
            <div style="margin-bottom: 1.2rem;">🔐 <strong style="color:#e67e22;">developer gate · locked</strong></div>
            <div style="margin-bottom: 0.8rem;">⚡ JS blocks page content until correct password</div>
            <div style="margin-bottom: 1rem;">⛓️ authentication required to view quest board</div>
            <div style="border-left: 3px solid #2ecc71; padding-left: 1rem; margin-top: 1.2rem;">
                ✦ <span style="color:#b48ead;">for osyra42</span> — developer quests & project coordination<br>
                ✦ raw emoji + markdown-style notes (no parser)<br>
                ✦ assist with: <span style="color:#e5c07b;">tooling · scripts · debug · prototypes</span>
            </div>
            <div style="margin-top: 1.6rem;">
                📜 <span style="color:#98c379;"># dev-quests > osyra42/workspace</span><br>
                🧩 _plain text — no markdown engine_
            </div>
            <div style="margin-top: 1.2rem; color:#2ecc71;">↓ enter password below ↓</div>
        `;
    }

    function unlockContent() {
        if (unlocked) return;
        unlocked = true;
        
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
                - [ ] \`deploy assist\` — staging env<br>
                <br>
                > *emojis only, no markdown engine*<br>
                🌱 〰️ [repo: osyra42/dev-dojo] 〰️ 🐚
            </div>
            <div style="margin-top: 1.2rem; font-size: 0.85rem; color: #6e7b8c;">
                💡 session active — reload will re-lock.
            </div>
        `;
        
        // hide password field after unlock
        const inputLine = document.getElementById('inputLine');
        if (inputLine) inputLine.style.display = 'none';
    }

    function checkPassword(e) {
        if (e.key === 'Enter' && passwordField) {
            if (passwordField.value === CORRECT_PASSWORD) {
                unlockContent();
            } else {
                outputEl.innerHTML += `<div style="color:#e06c75; margin-top:0.8rem;">❌ wrong password — try again</div>`;
                passwordField.value = '';
                // remove error message after 2 seconds but keep locked content
                setTimeout(() => {
                    if (!unlocked) {
                        const errorMsg = outputEl.querySelector('div:last-child');
                        if (errorMsg && errorMsg.style.color === 'rgb(224, 108, 117)') {
                            errorMsg.remove();
                        }
                    }
                }, 1500);
            }
        }
    }

    // initial render — page stays blocked
    renderLockedMessage();
    
    if (passwordField) {
        passwordField.addEventListener('keypress', checkPassword);
        passwordField.focus();
    }
})();