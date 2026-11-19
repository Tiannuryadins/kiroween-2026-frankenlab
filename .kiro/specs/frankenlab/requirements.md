# Requirements — FrankenLab (Kiroween 2026, Frankenstein category)

## Introduction

FrankenLab is a dependency-free static web app: a monster laboratory where the user
stitches a monster together from classic monster body parts, brings it to life with a
lightning strike, and shares it via URL. It demonstrates the Frankenstein category by
combining SVG procedural art, WebAudio synthesis, Canvas effects, a seeded PRNG,
URL-hash state encoding, and localStorage persistence in one app.

## Glossary

- **Part**: one body-part option (e.g. Vampire head). Belongs to exactly one **slot**.
- **Slot**: `head`, `torso`, `arms`, `legs`.
- **Monster**: `{ parts: { head, torso, arms, legs }, name, stats, power, seed }`.
- **Stats**: `{ strength, spook, charm }`, each an integer 1–10.
- **Share code**: base64url-encoded JSON of a monster, placed in the URL hash.

## Requirements

### Requirement 1 — Part catalog

**User Story:** As a user, I want to pick body parts from different classic monsters,
so that I can stitch together a unique creature.

#### Acceptance Criteria

1. WHEN the app loads THEN the system SHALL expose exactly 4 slots: `head`, `torso`, `arms`, `legs`.
2. WHEN the catalog is inspected THEN each slot SHALL contain at least 3 part options.
3. WHEN a part option is inspected THEN it SHALL have a non-empty `id`, `name`, `origin`, and `svg` (an SVG fragment string).
4. WHEN part ids are collected across all slots THEN all ids SHALL be unique.
5. WHEN the catalog is rendered THEN each slot SHALL show its options as selectable buttons with the part name visible.

### Requirement 2 — Monster assembly

**User Story:** As a user, I want the selected parts to render as one stitched monster,
so that I can see my creation.

#### Acceptance Criteria

1. WHEN the user selects a part in a slot THEN the system SHALL update the monster preview to show that part's SVG in the matching slot region.
2. WHEN the monster preview renders THEN the four slot SVGs SHALL compose into a single figure (head above torso, arms at the sides, legs below) inside one `<svg>` element.
3. WHEN the app first loads THEN the system SHALL show a default monster (one part per slot) so the slab is never empty.

### Requirement 3 — Deterministic generation

**User Story:** As a user, I want a "Mashup" button that randomly stitches a monster,
so that I can discover surprising combinations — and reproduce them from a seed.

#### Acceptance Criteria

1. WHEN `createRng(seed)` is called twice with the same numeric seed THEN the sequences of numbers produced SHALL be identical.
2. WHEN `randomMonster(rng)` is called THEN the result SHALL contain exactly one part id per slot, a non-empty `name`, stats in range 1–10, and a numeric `power`.
3. WHEN `randomMonster` is called twice with identically-seeded RNGs THEN the results SHALL be deeply equal.
4. WHEN `dailySeed("2026-11-19")` is called THEN it SHALL return the same number on every call with that input, and a different number for a different date string.

### Requirement 4 — Names and stats

**User Story:** As a user, I want my monster to get a procedurally generated name and
stats, so that it feels like a real creature.

#### Acceptance Criteria

1. WHEN `generateName(parts, rng)` is called THEN it SHALL return a non-empty string.
2. WHEN `generateName` is called with the same parts and identically-seeded RNGs THEN it SHALL return the same name.
3. WHEN `rollStats(rng)` is called THEN it SHALL return `{ strength, spook, charm }` with each value an integer between 1 and 10 inclusive.
4. WHEN `computePower(stats)` is called THEN it SHALL return a number equal to the sum of the three stats.

### Requirement 5 — Share via URL

**User Story:** As a user, I want to share my monster with a link, so that someone
opening the link sees the same monster.

#### Acceptance Criteria

1. WHEN `encodeShare(monster)` is called THEN it SHALL return a non-empty URL-safe string (no `+`, `/`, or `=` characters).
2. WHEN `decodeShare(encodeShare(monster))` is called THEN the result SHALL deeply equal the original monster.
3. WHEN `decodeShare` is called with garbage input THEN it SHALL return `null` (never throw).
4. WHEN the app loads with a valid share code in the URL hash THEN it SHALL render that monster instead of the default.

### Requirement 6 — Lab Journal (persistence)

**User Story:** As a user, I want to save monsters to a journal, so that I can keep
my best creations.

#### Acceptance Criteria

1. WHEN the user clicks "Save to Journal" THEN the current monster SHALL be stored in `localStorage` under key `frankenlab.journal` as a JSON array.
2. WHEN the journal is rendered THEN each saved monster SHALL show its name and power, and offer Load and Delete actions.
3. WHEN the user loads a journal entry THEN the slab SHALL render that monster.
4. WHEN the user deletes a journal entry THEN it SHALL disappear from storage and from the list.

### Requirement 7 — Lightning strike (bring it to life)

**User Story:** As a user, I want an "IT'S ALIVE!" button that strikes the monster
with lightning, so that the lab feels alive.

#### Acceptance Criteria

1. WHEN the user clicks "IT'S ALIVE!" THEN the system SHALL play a synthesized thunder/zap sound via WebAudio (no audio files) and flash a lightning bolt on a `<canvas>` overlay.
2. WHEN the lightning strike completes THEN the monster SHALL enter the "alive" state (eyes glow via a CSS class, stats re-rolled once with the same seed + 1).
3. WHEN audio is unavailable (e.g. headless environment) THEN the strike SHALL still complete visually without throwing.

### Requirement 8 — Monster of the Day

**User Story:** As a user, I want a daily monster, so that there is a reason to come back.

#### Acceptance Criteria

1. WHEN the user clicks "Monster of the Day" THEN the system SHALL generate a monster from `dailySeed(today)` and render it.
2. WHEN the same date is used twice THEN the generated monster SHALL be identical.

### Requirement 9 — No-network, no-build operation

**User Story:** As a judge, I want to open the app from a static host with no build
step and no API keys, so that it just works.

#### Acceptance Criteria

1. WHEN the app is served from any static file server THEN `index.html` SHALL load with zero console errors and all local assets SHALL resolve.
2. WHEN the app is opened THEN it SHALL make zero network requests to third-party origins.
3. WHEN `npm test` is run THEN all tests in `tests/` SHALL pass with no dependencies installed (Node built-in test runner only).
