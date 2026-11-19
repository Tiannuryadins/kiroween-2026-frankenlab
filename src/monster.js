// src/monster.js — pure logic, no DOM, no window, no document

// ---------------------------------------------------------------------------
// Part catalog
// ---------------------------------------------------------------------------

export const SLOTS = ["head", "torso", "arms", "legs"];

export const PARTS = {
  head: [
    {
      id: "vampire",
      name: "Vampire",
      origin: "Transylvania",
      svg: `<g>
        <ellipse cx="50" cy="45" rx="22" ry="26" fill="#c8a0c8"/>
        <rect x="28" y="62" width="44" height="8" rx="4" fill="#1a0a2e"/>
        <polygon points="28,62 22,45 35,55" fill="#1a0a2e"/>
        <polygon points="72,62 78,45 65,55" fill="#1a0a2e"/>
        <ellipse cx="41" cy="42" rx="5" ry="6" fill="#fff"/>
        <ellipse cx="59" cy="42" rx="5" ry="6" fill="#fff"/>
        <ellipse cx="41" cy="43" rx="3" ry="4" fill="#cc0000"/>
        <ellipse cx="59" cy="43" rx="3" ry="4" fill="#cc0000"/>
        <path d="M42,56 Q50,62 58,56" stroke="#c8a0c8" stroke-width="1.5" fill="none"/>
        <line x1="47" y1="60" x2="45" y2="66" stroke="#fff" stroke-width="1.5"/>
        <line x1="53" y1="60" x2="55" y2="66" stroke="#fff" stroke-width="1.5"/>
      </g>`,
    },
    {
      id: "witch",
      name: "Witch",
      origin: "Salem",
      svg: `<g>
        <polygon points="50,4 30,38 70,38" fill="#2d1a00"/>
        <rect x="24" y="36" width="52" height="6" rx="3" fill="#2d1a00"/>
        <ellipse cx="50" cy="58" rx="22" ry="24" fill="#7ab87a"/>
        <ellipse cx="40" cy="54" rx="5" ry="6" fill="#fff"/>
        <ellipse cx="60" cy="54" rx="5" ry="6" fill="#fff"/>
        <ellipse cx="40" cy="55" rx="3" ry="4" fill="#ff9900"/>
        <ellipse cx="60" cy="55" rx="3" ry="4" fill="#ff9900"/>
        <ellipse cx="50" cy="64" rx="5" ry="4" fill="#5a9a5a"/>
        <path d="M42,68 Q50,76 58,68" stroke="#fff" stroke-width="1.5" fill="none"/>
        <circle cx="48" cy="60" r="3" fill="#5a9a5a"/>
      </g>`,
    },
    {
      id: "mummy",
      name: "Mummy",
      origin: "Egypt",
      svg: `<g>
        <ellipse cx="50" cy="48" rx="22" ry="28" fill="#d4c89a"/>
        <line x1="28" y1="30" x2="72" y2="38" stroke="#b8a870" stroke-width="4"/>
        <line x1="28" y1="40" x2="72" y2="46" stroke="#b8a870" stroke-width="4"/>
        <line x1="29" y1="52" x2="71" y2="52" stroke="#b8a870" stroke-width="4"/>
        <line x1="29" y1="62" x2="71" y2="60" stroke="#b8a870" stroke-width="4"/>
        <ellipse cx="40" cy="44" rx="6" ry="5" fill="#b8a870"/>
        <ellipse cx="60" cy="44" rx="6" ry="5" fill="#b8a870"/>
        <ellipse cx="40" cy="44" rx="3" ry="3" fill="#cc4400"/>
        <ellipse cx="60" cy="44" rx="3" ry="3" fill="#cc4400"/>
        <path d="M43,58 Q50,64 57,58" stroke="#b8a870" stroke-width="2" fill="none"/>
      </g>`,
    },
    {
      id: "pumpkin",
      name: "Pumpkin Head",
      origin: "Sleepy Hollow",
      svg: `<g>
        <rect x="46" y="4" width="8" height="14" rx="3" fill="#4a7a1a"/>
        <ellipse cx="50" cy="50" rx="28" ry="32" fill="#e06c00"/>
        <path d="M22,50 Q28,30 50,22 Q72,30 78,50 Q72,70 50,78 Q28,70 22,50 Z" fill="#e07800"/>
        <line x1="34" y1="22" x2="34" y2="78" stroke="#c05a00" stroke-width="2"/>
        <line x1="50" y1="18" x2="50" y2="80" stroke="#c05a00" stroke-width="2"/>
        <line x1="66" y1="22" x2="66" y2="78" stroke="#c05a00" stroke-width="2"/>
        <polygon points="38,38 44,50 32,50" fill="#1a0a00"/>
        <polygon points="62,38 68,50 56,50" fill="#1a0a00"/>
        <path d="M34,60 L38,56 L44,62 L50,56 L56,62 L62,56 L66,60" stroke="#1a0a00" stroke-width="3" fill="none"/>
        <ellipse cx="38" cy="45" rx="5" ry="5" fill="#ffcc00" opacity="0.6"/>
        <ellipse cx="62" cy="45" rx="5" ry="5" fill="#ffcc00" opacity="0.6"/>
      </g>`,
    },
  ],
  torso: [
    {
      id: "zombie",
      name: "Zombie",
      origin: "Haiti",
      svg: `<g>
        <rect x="22" y="82" width="56" height="90" rx="8" fill="#7a9a60"/>
        <line x1="22" y1="110" x2="78" y2="110" stroke="#5a7a40" stroke-width="3"/>
        <line x1="30" y1="82" x2="28" y2="172" stroke="#5a7a40" stroke-width="2"/>
        <line x1="70" y1="82" x2="72" y2="172" stroke="#5a7a40" stroke-width="2"/>
        <ellipse cx="40" cy="124" rx="6" ry="8" fill="#5a7a40"/>
        <ellipse cx="60" cy="124" rx="6" ry="8" fill="#5a7a40"/>
        <path d="M35,145 Q50,138 65,145" stroke="#5a7a40" stroke-width="2" fill="none"/>
        <circle cx="34" cy="98" r="4" fill="#ff4444" opacity="0.7"/>
        <circle cx="50" cy="94" r="3" fill="#ff4444" opacity="0.5"/>
      </g>`,
    },
    {
      id: "golem",
      name: "Golem",
      origin: "Prague",
      svg: `<g>
        <rect x="18" y="82" width="64" height="92" rx="4" fill="#8a7a6a"/>
        <rect x="22" y="86" width="56" height="84" rx="2" fill="#9a8a7a" stroke="#6a5a4a" stroke-width="2"/>
        <rect x="26" y="90" width="20" height="20" rx="2" fill="#6a5a4a"/>
        <rect x="54" y="90" width="20" height="20" rx="2" fill="#6a5a4a"/>
        <rect x="30" y="118" width="40" height="8" rx="2" fill="#6a5a4a"/>
        <rect x="30" y="130" width="40" height="8" rx="2" fill="#6a5a4a"/>
        <rect x="30" y="142" width="40" height="8" rx="2" fill="#6a5a4a"/>
        <circle cx="36" cy="100" r="4" fill="#ffaa00"/>
        <circle cx="64" cy="100" r="4" fill="#ffaa00"/>
        <text x="50" y="168" text-anchor="middle" font-size="10" fill="#ffaa00">אמת</text>
      </g>`,
    },
    {
      id: "ghost",
      name: "Ghost",
      origin: "The Beyond",
      svg: `<g>
        <path d="M20,172 Q20,82 50,80 Q80,82 80,172 Q72,162 64,172 Q56,162 50,172 Q44,162 36,172 Q28,162 20,172 Z" fill="#e8e8f8" opacity="0.9"/>
        <ellipse cx="38" cy="118" rx="8" ry="10" fill="#aaaacc"/>
        <ellipse cx="62" cy="118" rx="8" ry="10" fill="#aaaacc"/>
        <ellipse cx="38" cy="119" rx="5" ry="6" fill="#222244"/>
        <ellipse cx="62" cy="119" rx="5" ry="6" fill="#222244"/>
        <path d="M38,138 Q50,148 62,138" stroke="#aaaacc" stroke-width="2" fill="none"/>
        <ellipse cx="50" cy="90" rx="30" ry="10" fill="#e8e8f8" opacity="0.4"/>
      </g>`,
    },
  ],
  arms: [
    {
      id: "werewolf",
      name: "Werewolf",
      origin: "Black Forest",
      svg: `<g>
        <path d="M0,95 Q10,88 20,100 Q30,115 36,140" stroke="#6a4a2a" stroke-width="14" fill="none" stroke-linecap="round"/>
        <path d="M200,95 Q190,88 180,100 Q170,115 164,140" stroke="#6a4a2a" stroke-width="14" fill="none" stroke-linecap="round"/>
        <path d="M20,100 Q8,96 2,106" stroke="#6a4a2a" stroke-width="10" fill="none" stroke-linecap="round"/>
        <path d="M180,100 Q192,96 198,106" stroke="#6a4a2a" stroke-width="10" fill="none" stroke-linecap="round"/>
        <line x1="30" y1="142" x2="22" y2="154" stroke="#3a2a1a" stroke-width="4" stroke-linecap="round"/>
        <line x1="34" y1="143" x2="30" y2="157" stroke="#3a2a1a" stroke-width="4" stroke-linecap="round"/>
        <line x1="38" y1="143" x2="38" y2="157" stroke="#3a2a1a" stroke-width="4" stroke-linecap="round"/>
        <line x1="170" y1="142" x2="178" y2="154" stroke="#3a2a1a" stroke-width="4" stroke-linecap="round"/>
        <line x1="166" y1="143" x2="170" y2="157" stroke="#3a2a1a" stroke-width="4" stroke-linecap="round"/>
        <line x1="162" y1="143" x2="162" y2="157" stroke="#3a2a1a" stroke-width="4" stroke-linecap="round"/>
      </g>`,
    },
    {
      id: "skeleton",
      name: "Skeleton",
      origin: "The Grave",
      svg: `<g>
        <line x1="10" y1="100" x2="36" y2="160" stroke="#e8e0d0" stroke-width="8" stroke-linecap="round"/>
        <line x1="190" y1="100" x2="164" y2="160" stroke="#e8e0d0" stroke-width="8" stroke-linecap="round"/>
        <ellipse cx="10" cy="100" rx="8" ry="8" fill="#e8e0d0"/>
        <ellipse cx="190" cy="100" rx="8" ry="8" fill="#e8e0d0"/>
        <line x1="10" y1="108" x2="10" y2="130" stroke="#e8e0d0" stroke-width="6"/>
        <line x1="190" y1="108" x2="190" y2="130" stroke="#e8e0d0" stroke-width="6"/>
        <ellipse cx="10" cy="130" rx="6" ry="6" fill="#e8e0d0"/>
        <ellipse cx="190" cy="130" rx="6" ry="6" fill="#e8e0d0"/>
        <line x1="6" y1="156" x2="2" y2="168" stroke="#e8e0d0" stroke-width="4" stroke-linecap="round"/>
        <line x1="13" y1="158" x2="12" y2="170" stroke="#e8e0d0" stroke-width="4" stroke-linecap="round"/>
        <line x1="20" y1="158" x2="22" y2="170" stroke="#e8e0d0" stroke-width="4" stroke-linecap="round"/>
        <line x1="194" y1="156" x2="198" y2="168" stroke="#e8e0d0" stroke-width="4" stroke-linecap="round"/>
        <line x1="187" y1="158" x2="188" y2="170" stroke="#e8e0d0" stroke-width="4" stroke-linecap="round"/>
        <line x1="180" y1="158" x2="178" y2="170" stroke="#e8e0d0" stroke-width="4" stroke-linecap="round"/>
      </g>`,
    },
    {
      id: "robot",
      name: "Retro Robot",
      origin: "The Future",
      svg: `<g>
        <rect x="0" y="92" width="30" height="60" rx="4" fill="#7a8a9a"/>
        <rect x="170" y="92" width="30" height="60" rx="4" fill="#7a8a9a"/>
        <rect x="2" y="96" width="26" height="52" rx="2" fill="#9aaaba" stroke="#5a6a7a" stroke-width="1"/>
        <rect x="172" y="96" width="26" height="52" rx="2" fill="#9aaaba" stroke="#5a6a7a" stroke-width="1"/>
        <rect x="4" y="98" width="10" height="10" rx="1" fill="#00ccff"/>
        <rect x="16" y="98" width="10" height="10" rx="1" fill="#ff4400"/>
        <rect x="4" y="112" width="22" height="4" rx="1" fill="#5a6a7a"/>
        <rect x="4" y="118" width="22" height="4" rx="1" fill="#5a6a7a"/>
        <rect x="174" y="98" width="10" height="10" rx="1" fill="#00ccff"/>
        <rect x="186" y="98" width="10" height="10" rx="1" fill="#ff4400"/>
        <rect x="174" y="112" width="22" height="4" rx="1" fill="#5a6a7a"/>
        <rect x="174" y="118" width="22" height="4" rx="1" fill="#5a6a7a"/>
        <rect x="4" y="140" width="22" height="8" rx="4" fill="#7a8a9a"/>
        <rect x="174" y="140" width="22" height="8" rx="4" fill="#7a8a9a"/>
      </g>`,
    },
  ],
  legs: [
    {
      id: "franken",
      name: "Frankenstein's Monster",
      origin: "Geneva",
      svg: `<g>
        <rect x="28" y="182" width="30" height="80" rx="4" fill="#6a8a6a"/>
        <rect x="58" y="182" width="30" height="80" rx="4" fill="#6a8a6a"/>
        <rect x="30" y="184" width="26" height="76" rx="2" fill="#7a9a7a" stroke="#4a6a4a" stroke-width="1.5"/>
        <rect x="60" y="184" width="26" height="76" rx="2" fill="#7a9a7a" stroke="#4a6a4a" stroke-width="1.5"/>
        <line x1="28" y1="220" x2="58" y2="220" stroke="#4a6a4a" stroke-width="2"/>
        <line x1="58" y1="220" x2="88" y2="220" stroke="#4a6a4a" stroke-width="2"/>
        <rect x="20" y="254" width="38" height="16" rx="6" fill="#3a3a3a"/>
        <rect x="58" y="254" width="38" height="16" rx="6" fill="#3a3a3a"/>
        <rect x="16" y="256" width="12" height="10" rx="2" fill="#4a4a2a"/>
        <rect x="88" y="256" width="12" height="10" rx="2" fill="#4a4a2a"/>
        <line x1="34" y1="196" x2="52" y2="196" stroke="#4a6a4a" stroke-width="2"/>
        <line x1="34" y1="208" x2="52" y2="208" stroke="#4a6a4a" stroke-width="2"/>
        <line x1="64" y1="196" x2="82" y2="196" stroke="#4a6a4a" stroke-width="2"/>
        <line x1="64" y1="208" x2="82" y2="208" stroke="#4a6a4a" stroke-width="2"/>
      </g>`,
    },
    {
      id: "spider",
      name: "Spider",
      origin: "The Dark Web",
      svg: `<g>
        <line x1="50" y1="182" x2="10" y2="240" stroke="#2a1a3a" stroke-width="6" stroke-linecap="round"/>
        <line x1="50" y1="182" x2="30" y2="260" stroke="#2a1a3a" stroke-width="6" stroke-linecap="round"/>
        <line x1="50" y1="182" x2="50" y2="262" stroke="#2a1a3a" stroke-width="6" stroke-linecap="round"/>
        <line x1="50" y1="182" x2="70" y2="260" stroke="#2a1a3a" stroke-width="6" stroke-linecap="round"/>
        <line x1="50" y1="182" x2="90" y2="240" stroke="#2a1a3a" stroke-width="6" stroke-linecap="round"/>
        <line x1="10" y1="240" x2="4" y2="262" stroke="#2a1a3a" stroke-width="4" stroke-linecap="round"/>
        <line x1="30" y1="260" x2="22" y2="276" stroke="#2a1a3a" stroke-width="4" stroke-linecap="round"/>
        <line x1="90" y1="240" x2="96" y2="262" stroke="#2a1a3a" stroke-width="4" stroke-linecap="round"/>
        <line x1="70" y1="260" x2="78" y2="276" stroke="#2a1a3a" stroke-width="4" stroke-linecap="round"/>
        <ellipse cx="50" cy="200" rx="14" ry="20" fill="#3a2a4a"/>
        <ellipse cx="50" cy="200" rx="10" ry="14" fill="#4a3a5a"/>
      </g>`,
    },
    {
      id: "slime",
      name: "Slime",
      origin: "The Bog",
      svg: `<g>
        <path d="M20,182 Q14,210 16,240 Q18,268 30,276 Q50,286 70,276 Q82,268 84,240 Q86,210 80,182 Z" fill="#44cc44" opacity="0.85"/>
        <path d="M22,185 Q16,214 18,242 Q20,268 32,275" stroke="#22aa22" stroke-width="2" fill="none" opacity="0.6"/>
        <circle cx="34" cy="210" r="8" fill="#22aa22" opacity="0.5"/>
        <circle cx="62" cy="232" r="6" fill="#22aa22" opacity="0.4"/>
        <circle cx="44" cy="254" r="10" fill="#22aa22" opacity="0.4"/>
        <ellipse cx="50" cy="278" rx="30" ry="8" fill="#22aa22" opacity="0.6"/>
        <circle cx="40" cy="200" r="3" fill="#88ff88"/>
        <circle cx="58" cy="216" r="2" fill="#88ff88"/>
        <circle cx="36" cy="240" r="4" fill="#88ff88"/>
      </g>`,
    },
  ],
};

// ---------------------------------------------------------------------------
// RNG — mulberry32
// ---------------------------------------------------------------------------

export function createRng(seed) {
  let s = seed >>> 0;
  return function () {
    s += 0x6d2b79f5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    t = (t ^ (t >>> 14)) >>> 0;
    return t / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function pickFrom(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

// ---------------------------------------------------------------------------
// Name generation
// ---------------------------------------------------------------------------

const HEAD_PREFIX = {
  vampire: ["Vamp", "Drac", "Mor", "Vlad", "Noc"],
  witch:   ["Hex", "Mor", "Bel", "Cir", "Hec"],
  mummy:   ["Amen", "Kha", "Osr", "Nef", "Ra"],
  pumpkin: ["Hal", "Jack", "Pum", "Lan", "Tern"],
};

const TORSO_SUFFIX = {
  zombie:  ["ula", "gor", "ax", "bris", "mor"],
  golem:   ["oth", "em", "ros", "stein", "mar"],
  ghost:   ["ara", "ira", "eth", "oan", "asp"],
};

const DEFAULT_PREFIX = ["Grim", "Dark", "Dread", "Foul", "Dire"];
const DEFAULT_SUFFIX = ["ula", "oth", "ax", "or", "is"];

export function generateName(parts, rng) {
  const prefixes = HEAD_PREFIX[parts.head] || DEFAULT_PREFIX;
  const suffixes = TORSO_SUFFIX[parts.torso] || DEFAULT_SUFFIX;
  return pickFrom(rng, prefixes) + pickFrom(rng, suffixes);
}

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

export function rollStats(rng) {
  return {
    strength: Math.floor(rng() * 10) + 1,
    spook:    Math.floor(rng() * 10) + 1,
    charm:    Math.floor(rng() * 10) + 1,
  };
}

export function computePower(stats) {
  return stats.strength + stats.spook + stats.charm;
}

// ---------------------------------------------------------------------------
// Monster assembly
// ---------------------------------------------------------------------------

export function randomMonster(rng, seed) {
  const parts = {};
  for (const slot of SLOTS) {
    parts[slot] = pickFrom(rng, PARTS[slot]).id;
  }
  const name = generateName(parts, rng);
  const stats = rollStats(rng);
  const power = computePower(stats);
  const monster = { parts, name, stats, power };
  if (seed !== undefined) monster.seed = seed;
  return monster;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const ALL_IDS = {};
for (const slot of SLOTS) {
  ALL_IDS[slot] = new Set(PARTS[slot].map((p) => p.id));
}

export function validateMonster(m) {
  if (m == null || typeof m !== "object") return false;
  if (typeof m.name !== "string" || m.name.length === 0) return false;
  if (m.parts == null || typeof m.parts !== "object") return false;
  for (const slot of SLOTS) {
    if (!ALL_IDS[slot].has(m.parts[slot])) return false;
  }
  if (m.stats == null || typeof m.stats !== "object") return false;
  for (const key of ["strength", "spook", "charm"]) {
    const v = m.stats[key];
    if (!Number.isInteger(v) || v < 1 || v > 10) return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Share codec — base64url (no +, /, =)
// ---------------------------------------------------------------------------

export function encodeShare(monster) {
  const json = JSON.stringify(monster);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export function decodeShare(code) {
  try {
    if (typeof code !== "string" || code.length === 0) return null;
    const b64 = code.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const json = new TextDecoder().decode(bytes);
    const m = JSON.parse(json);
    if (!validateMonster(m)) return null;
    return m;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Daily seed — FNV-1a over the date string
// ---------------------------------------------------------------------------

export function dailySeed(dateStr) {
  let h = 2166136261;
  for (let i = 0; i < dateStr.length; i++) {
    h ^= dateStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
    h >>>= 0;
  }
  return h;
}

export function monsterOfTheDay(dateStr) {
  const seed = dailySeed(dateStr);
  return randomMonster(createRng(seed), seed);
}
