# Tasks — FrankenLab

Implement the app exactly per `requirements.md` and `design.md`.
Do NOT edit `tests/test.mjs` — it is the contract. If a test fails, fix the
implementation in `src/`. Run `npm test` after each meaningful change and keep
iterating until all tests pass.

- [ ] 1. Implement pure logic in `src/monster.js`
  - [ ] 1.1 Export `SLOTS` and `PARTS` catalog: 4 slots, >= 3 options each, unique ids,
    every option has non-empty `id`, `name`, `origin`, `svg` fragment.
  - [ ] 1.2 Implement `createRng` (mulberry32), `pickFrom`, `randomMonster`,
    `generateName`, `rollStats`, `computePower`, `validateMonster`.
  - [ ] 1.3 Implement `encodeShare` / `decodeShare` (base64url, null on garbage, never throw).
  - [ ] 1.4 Implement `dailySeed` (string "YYYY-MM-DD" -> uint32) and `monsterOfTheDay`.
  - [ ] 1.5 Run `npm test` — all monster-logic tests must pass before moving on.

- [ ] 2. Implement audio synthesis in `src/audio.js`
  - [ ] 2.1 `playThunder`, `playZap`, `playCreak` using WebAudio only, lazy AudioContext.
  - [ ] 2.2 All functions no-op silently (never throw) when AudioContext is unavailable.

- [ ] 3. Implement UI in `index.html`, `styles.css`, `src/app.js`
  - [ ] 3.1 Slab `<svg id="slab">` composing the four slot fragments; default monster on load.
  - [ ] 3.2 Part pickers (one fieldset per slot) updating the preview live.
  - [ ] 3.3 Name + stats + power display, updating on every change.
  - [ ] 3.4 Buttons: Mashup, IT'S ALIVE! (canvas lightning + sound + stats re-roll seed+1 +
    `.alive` class), Save to Journal, Copy Share Link, Monster of the Day.
  - [ ] 3.5 Journal list backed by `localStorage["frankenlab.journal"]` with Load/Delete.
  - [ ] 3.6 Load from URL hash `#m=<share code>` when present and valid.
  - [ ] 3.7 `<canvas id="fx">` lightning overlay with fade-out.
  - [ ] 3.8 Dark Halloween lab theme, responsive down to 360px.

- [ ] 4. Verify end to end
  - [ ] 4.1 `npm test` green (full suite).
  - [ ] 4.2 `node --check` on every file in `src/` (syntax valid).
  - [ ] 4.3 Serve with `python3 -m http.server` and `curl` the page + each asset (HTTP 200).
  - [ ] 4.4 Confirm zero external/third-party requests: no `http://` or `https://` asset
    references in `index.html` / `styles.css` / `src/*.js` (except the share-link origin).

- [ ] 5. Finish documentation
  - [ ] 5.1 Complete `README.md`: what it is, how to run (`python3 -m http.server` or any
    static server), how to test (`npm test`), how Kiro was used (specs/hooks/steering),
    category (Frankenstein), and the user-only steps still needed (Devpost, video).
  - [ ] 5.2 Verify `.gitignore` does NOT ignore `.kiro/` (required by the hackathon rules).
