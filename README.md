# FrankenLab — Stitch-Your-Own Monster Laboratory

**Kiroween 2026 hackathon entry — Frankenstein category** ($5.000 category prize,
eligible for Overall 1st $30.000 / 2nd $20.000 / 3rd $10.000 + Best Demo $1.000).

Stitch a monster together from classic monster parts, bring it to life with a
lightning strike, and share it with a link. The chimera: SVG procedural art +
WebAudio synthesis + Canvas lightning + seeded PRNG + URL-hash state encoding +
localStorage persistence — six unrelated technologies stitched into one
dependency-free static app.

## Run

Any static file server works — no build step, no install, no API keys:

```bash
python3 -m http.server 8137
# open http://localhost:8137
```

Or `npm run serve`. Or open `index.html` via any static host (GitHub Pages).

## Test

```bash
npm test   # Node built-in test runner, zero dependencies
```

## Features

- **Stitch Table** — pick head / torso / arms / legs from classic monsters (Vampire,
  Witch, Mummy, Zombie, Golem, Werewolf, Skeleton, Frankenstein's Monster, …).
- **IT'S ALIVE!** — Canvas lightning strike + synthesized thunder/zap (WebAudio, no
  audio files); the monster wakes up and its stats re-roll.
- **Procedural names & stats** — deterministic from a seed (mulberry32), so any
  monster can be reproduced exactly.
- **Monster of the Day** — a daily monster, seeded by date.
- **Share link** — the monster is encoded into the URL hash; opening the link shows
  the same monster.
- **Lab Journal** — save monsters to localStorage, load or delete them later.

## How Kiro was used

- **Spec-driven development with Kiro CLI 3.3.0:** requirements, design, and tasks
  were written first in `.kiro/specs/frankenlab/`, then Kiro CLI implemented the app
  from the spec in non-interactive chat sessions, iterating until `npm test` was green.
- **Steering docs** in `.kiro/steering/` (product, tech, structure) kept the stack
  (vanilla JS, zero dependencies) and conventions consistent.
- **Agent hook** `.kiro/hooks/test-on-save.json` runs `npm test` whenever Kiro
  saves/edits a file under `src/`.
- The plan, spec, steering docs, and test contract were authored by the developer
  before invoking Kiro; Kiro implemented the application code (see `PLAN.md` for the
  honest split of work).

## Status

Fase 1 (19 Nov 2026): scaffold + build. Belum di-push ke GitHub dan belum
di-submit ke Devpost — langkah itu butuh user (lihat `PLAN.md`).
