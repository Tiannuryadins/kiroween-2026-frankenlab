# Design — FrankenLab

## Overview

A single-page static app. No framework, no build step, no backend, no API keys.
ES modules loaded directly by the browser; the pure logic module is also imported by
the Node test suite. The "chimera" is the combination of six unrelated technologies
in one file set: SVG procedural art, WebAudio synthesis, Canvas FX, seeded PRNG,
URL-hash state encoding, and localStorage persistence.

## Architecture

```
index.html          UI shell: slab <svg>, part pickers, buttons, journal list, <canvas> overlay
styles.css          Halloween theme (dark lab, green/purple, glowing accents)
src/monster.js      PURE LOGIC (no DOM, no window): catalog, RNG, names, stats, share codec
src/audio.js        WebAudio synth: thunder (filtered noise), zap (sawtooth sweep), creak
src/app.js          DOM wiring only: renders catalog, slab, journal; handles events
tests/test.mjs      node:test suite importing ../src/monster.js (contract, do not weaken)
```

`src/monster.js` must have **zero top-level references to `window`/`document`** so Node
can import it. `src/audio.js` must also avoid top-level `window` access (create the
`AudioContext` lazily inside functions); all audio functions must no-op safely when
`AudioContext` is unavailable.

## Components

### Part catalog (`PARTS` in monster.js)

```js
export const SLOTS = ["head", "torso", "arms", "legs"];
export const PARTS = {
  head:  [ { id, name, origin, svg }, ... ],  // >= 3 options
  torso: [ ... ],
  arms:  [ ... ],
  legs:  [ ... ],
};
```

Suggested parts (implementer may adjust names, but keep >= 3 per slot and unique ids):
- head: `vampire` (Vampire), `witch` (Witch), `mummy` (Mummy), `pumpkin` (Pumpkin Head)
- torso: `zombie` (Zombie), `golem` (Golem), `ghost` (Ghost)
- arms: `werewolf` (Werewolf), `skeleton` (Skeleton), `robot` (Retro Robot)
- legs: `franken` (Frankenstein's Monster), `spider` (Spider), `slime` (Slime)

Each `svg` is a fragment (inner SVG markup) drawn in a 100x100 viewBox region for its
slot. The app composes the four fragments into one `<svg viewBox="0 0 200 320">`:
head region y 0–80, torso y 80–180, arms x 0–40 & 160–200 / y 90–170, legs y 180–320.
Keep the drawing simple but recognizable (shapes + a couple of colors per part).

### Pure logic API (`src/monster.js`)

```js
export function createRng(seed)            // mulberry32; returns () => float in [0,1)
export function pickFrom(rng, arr)         // one element, uniformly
export function randomMonster(rng)         // { parts:{head,torso,arms,legs}, name, stats, power, seed }
export function generateName(parts, rng)   // non-empty string; uses part names + syllables
export function rollStats(rng)             // { strength, spook, charm } ints 1..10
export function computePower(stats)        // strength + spook + charm
export function validateMonster(m)         // boolean; checks shape + known part ids + stat ranges
export function encodeShare(monster)       // base64url(JSON) — no + / =
export function decodeShare(code)          // monster object or null (never throws)
export function dailySeed(dateStr)         // "YYYY-MM-DD" -> uint32 seed (FNV-1a or equivalent)
export function monsterOfTheDay(dateStr)   // randomMonster(createRng(dailySeed(dateStr)))
```

`randomMonster` must set `monster.seed` to the seed that reproduces it: implement as
`randomMonster(rng, seed)` where `seed` is optional; when provided, store it. The app
passes an explicit seed (e.g. `Date.now() % 2**31`) so "IT'S ALIVE!" can re-roll with
`seed + 1`. Name generation: combine a prefix syllable drawn from the head part and a
suffix drawn from the torso part (or similar deterministic scheme) — must be stable for
identical inputs.

### Audio (`src/audio.js`)

```js
export function playThunder()  // brown-noise burst through lowpass filter, ~1.2s
export function playZap()      // sawtooth 1200->80 Hz sweep + noise crackle, ~0.4s
export function playCreak()    // optional: slow detuned sines, ~0.8s
```

All functions: if `typeof AudioContext === "undefined"` (or creation throws), return
silently. Never throw. No audio files.

### UI (`src/app.js` + `index.html` + `styles.css`)

- Header: title "FrankenLab", subtitle, "Monster of the Day" button.
- Slab section: `<svg id="slab">` monster preview, name + stats display, power score.
- Controls: "Mashup" (random), "IT'S ALIVE!" (lightning + sound + re-roll stats with
  seed+1 + `.alive` class on slab for glowing eyes), "Save to Journal", "Copy Share Link".
- Part pickers: one fieldset per slot, radio-style buttons with part names.
- Journal section: list from `localStorage["frankenlab.journal"]`, each row shows name +
  power + Load / Delete buttons.
- `<canvas id="fx">` absolutely positioned over the slab for the lightning bolt flash
  (draw a jagged polyline, fade out over ~600ms).
- On load: if `location.hash` starts with `#m=` and decodes validly, render that
  monster; else render the default monster (first part of each slot).
- Copy Share Link: writes `${location.origin}${location.pathname}#m=${encodeShare(monster)}`
  to clipboard, falls back to selecting the URL text if clipboard is unavailable.
- Theme: dark laboratory, deep purple/green, glowing accents, readable contrast,
  responsive (works at 360px wide).

## Testing

- `tests/test.mjs` uses only `node:test` + `node:assert/strict` (Node 24 built-ins).
- It imports `../src/monster.js` and asserts: catalog integrity, RNG determinism,
  randomMonster shape + determinism, name determinism, stat ranges, power sum,
  share round-trip + URL-safety + invalid input returns null, dailySeed stability.
- The test file is the contract: implementation must satisfy it; do not edit tests to
  make them pass — fix the implementation instead.
- Run with `npm test` (`node --test tests/`). Zero dependencies.

## Deployment

Static hosting (GitHub Pages). Serve the repo root; entry point `index.html`.
No build step, no environment variables, no secrets.
