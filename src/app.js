// src/app.js — DOM wiring only. All logic lives in monster.js.
// No top-level DOM access that would break a non-browser environment is performed
// here, but this module is browser-only by design (audio.js and DOM).

import {
  SLOTS,
  PARTS,
  createRng,
  randomMonster,
  computePower,
  encodeShare,
  decodeShare,
  monsterOfTheDay,
} from "./monster.js";

import { playThunder, playZap } from "./audio.js";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const JOURNAL_KEY = "frankenlab.journal";

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

/** @type {{ parts: Record<string,string>, name: string, stats: {strength:number,spook:number,charm:number}, power: number, seed?: number }} */
let currentMonster = null;

// ---------------------------------------------------------------------------
// DOM helpers
// ---------------------------------------------------------------------------

function $(id) {
  return document.getElementById(id);
}

// ---------------------------------------------------------------------------
// Render monster into the slab SVG
// ---------------------------------------------------------------------------

function renderSlab(monster) {
  for (const slot of SLOTS) {
    const partId = monster.parts[slot];
    const part = PARTS[slot].find((p) => p.id === partId);
    const group = $(`slot-${slot}`);
    if (group && part) {
      group.innerHTML = part.svg;
    }
  }
}

// ---------------------------------------------------------------------------
// Update name / stats / power display
// ---------------------------------------------------------------------------

function renderMeta(monster) {
  $("monster-name").textContent = monster.name;
  $("stat-strength").textContent = monster.stats.strength;
  $("stat-spook").textContent = monster.stats.spook;
  $("stat-charm").textContent = monster.stats.charm;
  $("monster-power").textContent = monster.power;
}

// ---------------------------------------------------------------------------
// Update part-picker radio selections to reflect current monster
// ---------------------------------------------------------------------------

function syncPickers(monster) {
  for (const slot of SLOTS) {
    const radio = document.querySelector(
      `input[name="picker-${slot}"][value="${monster.parts[slot]}"]`
    );
    if (radio) radio.checked = true;
  }
}

// ---------------------------------------------------------------------------
// Set the current monster and refresh all UI
// ---------------------------------------------------------------------------

function setMonster(monster) {
  currentMonster = monster;
  renderSlab(monster);
  renderMeta(monster);
  syncPickers(monster);
}

// ---------------------------------------------------------------------------
// Build part pickers (called once on init)
// ---------------------------------------------------------------------------

function buildPickers() {
  const container = $("pickers");
  for (const slot of SLOTS) {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "picker-fieldset";

    const legend = document.createElement("legend");
    legend.textContent = slot.charAt(0).toUpperCase() + slot.slice(1);
    fieldset.appendChild(legend);

    const optionsDiv = document.createElement("div");
    optionsDiv.className = "picker-options";

    for (const part of PARTS[slot]) {
      const id = `pick-${slot}-${part.id}`;

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = `picker-${slot}`;
      radio.value = part.id;
      radio.id = id;

      radio.addEventListener("change", () => {
        if (!radio.checked) return;
        // Build a new monster from the current parts, replacing the changed slot.
        const parts = { ...currentMonster.parts, [slot]: part.id };
        const seed = currentMonster.seed ?? (Date.now() % 2 ** 31);
        const rng = createRng(seed);
        // We need a fresh randomMonster-equivalent but with fixed parts + re-generated name/stats.
        // Use randomMonster but then override parts.
        const base = randomMonster(rng, seed);
        const updated = {
          ...base,
          parts,
        };
        // Recompute power in case stats differ.
        updated.power = computePower(updated.stats);
        // Remove alive state when re-picking.
        $("slab").classList.remove("alive");
        setMonster(updated);
      });

      const label = document.createElement("label");
      label.htmlFor = id;
      label.textContent = part.name;

      optionsDiv.appendChild(radio);
      optionsDiv.appendChild(label);
    }

    fieldset.appendChild(optionsDiv);
    container.appendChild(fieldset);
  }
}

// ---------------------------------------------------------------------------
// Default monster — first part per slot
// ---------------------------------------------------------------------------

function defaultMonster() {
  const seed = 1;
  const rng = createRng(seed);
  const monster = randomMonster(rng, seed);
  // Override parts to be the first option in each slot.
  const parts = {};
  for (const slot of SLOTS) {
    parts[slot] = PARTS[slot][0].id;
  }
  monster.parts = parts;
  monster.power = computePower(monster.stats);
  return monster;
}

// ---------------------------------------------------------------------------
// Lightning canvas FX
// ---------------------------------------------------------------------------

function drawLightning() {
  const canvas = $("fx");
  if (!canvas) return;
  const slabEl = $("slab");
  // Size canvas to match the slab's rendered dimensions.
  const rect = slabEl.getBoundingClientRect();
  canvas.width = rect.width || 200;
  canvas.height = rect.height || 320;

  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  // Draw a jagged bolt from top-center to bottom-center.
  function jagged(x1, y1, x2, y2, roughness, depth) {
    if (depth === 0) {
      ctx.lineTo(x2, y2);
      return;
    }
    const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * roughness;
    const my = (y1 + y2) / 2 + (Math.random() - 0.5) * roughness * 0.4;
    jagged(x1, y1, mx, my, roughness / 2, depth - 1);
    jagged(mx, my, x2, y2, roughness / 2, depth - 1);
  }

  ctx.clearRect(0, 0, w, h);

  // Flash background briefly.
  ctx.fillStyle = "rgba(200, 220, 255, 0.18)";
  ctx.fillRect(0, 0, w, h);

  // Main bolt.
  ctx.beginPath();
  ctx.moveTo(w / 2, 0);
  jagged(w / 2, 0, w / 2 + (Math.random() - 0.5) * 40, h, 60, 6);
  ctx.strokeStyle = "#aaddff";
  ctx.lineWidth = 2.5;
  ctx.shadowBlur = 14;
  ctx.shadowColor = "#aaddff";
  ctx.stroke();

  // Secondary thinner bolt.
  ctx.beginPath();
  ctx.moveTo(w / 2 + (Math.random() - 0.5) * 20, 0);
  jagged(w / 2, 0, w / 2 + (Math.random() - 0.5) * 60, h * 0.7, 40, 5);
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1;
  ctx.shadowBlur = 8;
  ctx.shadowColor = "#ffffff";
  ctx.stroke();

  ctx.shadowBlur = 0;

  // Fade out over ~600ms.
  let opacity = 1;
  const start = performance.now();
  const DURATION = 600;

  function fade(now) {
    const elapsed = now - start;
    opacity = 1 - elapsed / DURATION;
    if (opacity <= 0) {
      ctx.clearRect(0, 0, w, h);
      return;
    }
    ctx.clearRect(0, 0, w, h);

    ctx.globalAlpha = opacity;

    ctx.fillStyle = "rgba(200, 220, 255, 0.18)";
    ctx.fillRect(0, 0, w, h);

    // Re-draw both bolts at reduced opacity via globalAlpha.
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    // Reuse last bolt shape by re-seeding — just draw straight fade.
    ctx.strokeStyle = "#aaddff";
    ctx.lineWidth = 2.5;
    ctx.shadowBlur = 14;
    ctx.shadowColor = "#aaddff";
    ctx.stroke();

    ctx.globalAlpha = 1;
    requestAnimationFrame(fade);
  }

  requestAnimationFrame(fade);
}

// ---------------------------------------------------------------------------
// IT'S ALIVE! handler
// ---------------------------------------------------------------------------

function bringAlive() {
  // Play audio (never throws per audio.js contract).
  playZap();
  setTimeout(playThunder, 100);

  // Flash lightning.
  drawLightning();

  // Re-roll stats with seed+1.
  const prevSeed = currentMonster.seed != null ? currentMonster.seed : Date.now() % 2 ** 31;
  const newSeed = (prevSeed + 1) >>> 0;
  const rng = createRng(newSeed);
  const newMonster = randomMonster(rng, newSeed);
  // Keep the same parts (alive brings to life, doesn't swap parts).
  newMonster.parts = { ...currentMonster.parts };
  newMonster.power = computePower(newMonster.stats);

  setMonster(newMonster);

  // Apply alive glow class.
  const slab = $("slab");
  slab.classList.add("alive");
}

// ---------------------------------------------------------------------------
// Journal helpers
// ---------------------------------------------------------------------------

function loadJournal() {
  try {
    return JSON.parse(localStorage.getItem(JOURNAL_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveJournal(entries) {
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
}

function renderJournal() {
  const list = $("journal-list");
  const empty = $("journal-empty");
  const entries = loadJournal();

  list.innerHTML = "";

  if (entries.length === 0) {
    empty.style.display = "";
    return;
  }

  empty.style.display = "none";

  entries.forEach((entry, index) => {
    const li = document.createElement("li");
    li.className = "journal-row";

    const name = document.createElement("span");
    name.className = "journal-row-name";
    name.textContent = entry.name;
    name.title = entry.name;

    const power = document.createElement("span");
    power.className = "journal-row-power";
    power.textContent = `PWR ${entry.power}`;

    const loadBtn = document.createElement("button");
    loadBtn.className = "btn btn-secondary";
    loadBtn.textContent = "Load";
    loadBtn.addEventListener("click", () => {
      $("slab").classList.remove("alive");
      setMonster(entry);
    });

    const delBtn = document.createElement("button");
    delBtn.className = "btn btn-danger";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => {
      const updated = loadJournal();
      updated.splice(index, 1);
      saveJournal(updated);
      renderJournal();
    });

    li.appendChild(name);
    li.appendChild(power);
    li.appendChild(loadBtn);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

// ---------------------------------------------------------------------------
// Button handlers
// ---------------------------------------------------------------------------

function handleMashup() {
  const seed = Date.now() % 2 ** 31;
  const rng = createRng(seed);
  const monster = randomMonster(rng, seed);
  $("slab").classList.remove("alive");
  setMonster(monster);
}

function handleAlive() {
  bringAlive();
}

function handleSaveJournal() {
  if (!currentMonster) return;
  const entries = loadJournal();
  entries.push(currentMonster);
  saveJournal(entries);
  renderJournal();
}

function handleCopyShare() {
  if (!currentMonster) return;
  const code = encodeShare(currentMonster);
  const url = `${location.origin}${location.pathname}#m=${code}`;

  const feedback = $("share-feedback");

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        feedback.textContent = "Link copied!";
        setTimeout(() => { feedback.textContent = ""; }, 2500);
      })
      .catch(() => fallbackCopy(url));
  } else {
    fallbackCopy(url);
  }

  function fallbackCopy(text) {
    // Update the hash so the URL bar shows the share link.
    history.replaceState(null, "", `#m=${code}`);
    feedback.textContent = "Hash updated — copy from the address bar.";
    setTimeout(() => { feedback.textContent = ""; }, 3000);
  }
}

function handleMotd() {
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const monster = monsterOfTheDay(today);
  $("slab").classList.remove("alive");
  setMonster(monster);
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

function init() {
  buildPickers();

  // Determine initial monster.
  let initialMonster = null;

  const hash = location.hash;
  if (hash.startsWith("#m=")) {
    const code = hash.slice(3);
    const decoded = decodeShare(code);
    if (decoded) {
      initialMonster = decoded;
    }
  }

  if (!initialMonster) {
    initialMonster = defaultMonster();
  }

  setMonster(initialMonster);
  renderJournal();

  // Bind buttons.
  $("btn-mashup").addEventListener("click", handleMashup);
  $("btn-alive").addEventListener("click", handleAlive);
  $("btn-save").addEventListener("click", handleSaveJournal);
  $("btn-share").addEventListener("click", handleCopyShare);
  $("btn-motd").addEventListener("click", handleMotd);
}

document.addEventListener("DOMContentLoaded", init);
