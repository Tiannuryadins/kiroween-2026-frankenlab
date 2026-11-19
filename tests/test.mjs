import test from "node:test";
import assert from "node:assert/strict";
import {
  SLOTS,
  PARTS,
  createRng,
  pickFrom,
  randomMonster,
  generateName,
  rollStats,
  computePower,
  validateMonster,
  encodeShare,
  decodeShare,
  dailySeed,
  monsterOfTheDay,
} from "../src/monster.js";

// --- Catalog integrity -------------------------------------------------------

test("catalog: exactly 4 slots", () => {
  assert.deepEqual([...SLOTS].sort(), ["arms", "head", "legs", "torso"]);
});

test("catalog: every slot has >= 3 options with id, name, origin, svg", () => {
  for (const slot of SLOTS) {
    assert.ok(Array.isArray(PARTS[slot]), `${slot} must be an array`);
    assert.ok(PARTS[slot].length >= 3, `${slot} needs >= 3 options`);
    for (const part of PARTS[slot]) {
      assert.equal(typeof part.id, "string");
      assert.ok(part.id.length > 0, `${slot} part id must be non-empty`);
      assert.ok(part.name.length > 0, `${part.id} name must be non-empty`);
      assert.ok(part.origin.length > 0, `${part.id} origin must be non-empty`);
      assert.ok(part.svg.length > 0, `${part.id} svg must be non-empty`);
      assert.ok(part.svg.includes("<"), `${part.id} svg must contain markup`);
    }
  }
});

test("catalog: part ids are unique across all slots", () => {
  const ids = SLOTS.flatMap((s) => PARTS[s].map((p) => p.id));
  assert.equal(new Set(ids).size, ids.length);
});

// --- RNG determinism ---------------------------------------------------------

test("rng: same seed gives identical sequence", () => {
  const a = createRng(42);
  const b = createRng(42);
  const seqA = [a(), a(), a(), a(), a()];
  const seqB = [b(), b(), b(), b(), b()];
  assert.deepEqual(seqA, seqB);
});

test("rng: different seeds give different sequences", () => {
  const a = createRng(1);
  const b = createRng(2);
  assert.notDeepEqual([a(), a(), a()], [b(), b(), b()]);
});

test("rng: values are in [0, 1)", () => {
  const rng = createRng(7);
  for (let i = 0; i < 1000; i++) {
    const v = rng();
    assert.ok(v >= 0 && v < 1, `rng value ${v} out of range`);
  }
});

test("pickFrom: picks an element of the array", () => {
  const rng = createRng(99);
  const arr = ["a", "b", "c"];
  for (let i = 0; i < 20; i++) assert.ok(arr.includes(pickFrom(rng, arr)));
});

// --- Monster generation ------------------------------------------------------

test("randomMonster: shape is complete and valid", () => {
  const m = randomMonster(createRng(1234), 1234);
  assert.deepEqual(Object.keys(m.parts).sort(), ["arms", "head", "legs", "torso"]);
  for (const slot of SLOTS) {
    assert.ok(PARTS[slot].some((p) => p.id === m.parts[slot]), `${slot} part must exist`);
  }
  assert.equal(typeof m.name, "string");
  assert.ok(m.name.length > 0);
  assert.deepEqual(Object.keys(m.stats).sort(), ["charm", "spook", "strength"]);
  for (const v of Object.values(m.stats)) {
    assert.ok(Number.isInteger(v) && v >= 1 && v <= 10);
  }
  assert.equal(m.power, computePower(m.stats));
  assert.equal(m.seed, 1234);
  assert.equal(validateMonster(m), true);
});

test("randomMonster: deterministic for identical seeds", () => {
  const a = randomMonster(createRng(555), 555);
  const b = randomMonster(createRng(555), 555);
  assert.deepEqual(a, b);
});

test("randomMonster: different seeds usually differ", () => {
  const a = randomMonster(createRng(11), 11);
  const b = randomMonster(createRng(22), 22);
  assert.notDeepEqual(a, b);
});

// --- Names and stats ---------------------------------------------------------

test("generateName: non-empty and deterministic", () => {
  const parts = { head: "vampire", torso: "zombie", arms: "werewolf", legs: "franken" };
  const a = generateName(parts, createRng(5));
  const b = generateName(parts, createRng(5));
  assert.ok(a.length > 0);
  assert.equal(a, b);
});

test("rollStats: each stat is an integer 1..10", () => {
  const rng = createRng(77);
  for (let i = 0; i < 50; i++) {
    const s = rollStats(rng);
    for (const v of Object.values(s)) {
      assert.ok(Number.isInteger(v) && v >= 1 && v <= 10);
    }
  }
});

test("computePower: equals the sum of the three stats", () => {
  assert.equal(computePower({ strength: 4, spook: 7, charm: 2 }), 13);
  assert.equal(computePower({ strength: 10, spook: 10, charm: 10 }), 30);
});

test("validateMonster: rejects malformed monsters", () => {
  const good = randomMonster(createRng(3), 3);
  assert.equal(validateMonster(good), true);
  assert.equal(validateMonster(null), false);
  assert.equal(validateMonster({}), false);
  assert.equal(validateMonster({ ...good, parts: { ...good.parts, head: "nope" } }), false);
  assert.equal(
    validateMonster({ ...good, stats: { strength: 0, spook: 5, charm: 5 } }),
    false
  );
  assert.equal(validateMonster({ ...good, name: "" }), false);
});

// --- Share codec -------------------------------------------------------------

test("share: encode/decode round-trip", () => {
  const m = randomMonster(createRng(2026), 2026);
  const code = encodeShare(m);
  assert.equal(typeof code, "string");
  assert.ok(code.length > 0);
  assert.deepEqual(decodeShare(code), m);
});

test("share: code is URL-safe (no + / =)", () => {
  for (let seed = 1; seed <= 20; seed++) {
    const code = encodeShare(randomMonster(createRng(seed), seed));
    assert.ok(!code.includes("+"), code);
    assert.ok(!code.includes("/"), code);
    assert.ok(!code.includes("="), code);
  }
});

test("share: decodeShare returns null on garbage, never throws", () => {
  for (const bad of ["", "!!!", "not-json", "e30=", "%%%", "a".repeat(5000)]) {
    assert.equal(decodeShare(bad), null, JSON.stringify(bad));
  }
});

// --- Daily monster -----------------------------------------------------------

test("dailySeed: stable per date, differs across dates", () => {
  assert.equal(dailySeed("2026-11-19"), dailySeed("2026-11-19"));
  assert.notEqual(dailySeed("2026-11-19"), dailySeed("2026-11-20"));
  assert.ok(Number.isInteger(dailySeed("2026-11-19")));
});

test("monsterOfTheDay: deterministic per date", () => {
  const a = monsterOfTheDay("2026-11-19");
  const b = monsterOfTheDay("2026-11-19");
  assert.deepEqual(a, b);
  assert.equal(validateMonster(a), true);
  assert.notDeepEqual(a, monsterOfTheDay("2026-11-20"));
});
