# Tech — FrankenLab

- Vanilla HTML/CSS/JavaScript (ES modules). Zero dependencies, zero build step.
- Node 24 built-in test runner only (`node --test`); no test frameworks, no npm install.
- `src/monster.js` is pure logic: no DOM, no `window`, no `document` at top level, so
  Node can import it directly in tests.
- `src/audio.js` uses WebAudio synthesis only (no audio files); lazy AudioContext;
  every exported function must never throw when audio is unavailable.
- `src/app.js` is DOM wiring only; all decisions live in `monster.js`.
- Static hosting (GitHub Pages). Entry point: `index.html` at repo root.
- No secrets, no API keys, no environment variables, no third-party requests.
