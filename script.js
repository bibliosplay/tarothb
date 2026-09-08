/* ============================================================
   Tarot del Jardín de las Delicias — script.js
   ============================================================ */

const state = {
  major: [],
  minor: [],
  suits: {},
  deckMode: "major", // "major" (22) or "full" (78)
  deckFilter: "all",  // "all" | "copas" | "bastos" | "espadas" | "oros"
  activeSpreadId: null,
  currentDraw: [] // { card, reversed, revealed }
};

function activeDeck() {
  return state.deckMode === "full" ? state.major.concat(state.minor) : state.major;
}

const SPREADS = [
  {
    id: "uno",
    layout: "uno",
    title: "Un Vistazo",
    count: 1,
    description: "Una sola carta para una pregunta puntual o para tomarle el pulso al día.",
    slots: [
      { label: "El Mensaje", role: "Lo que necesitas ver ahora mismo." }
    ]
  },
  {
    id: "tres",
    layout: "tres",
    title: "El Tríptico del Jardín",
    count: 3,
    description: "Inspirada en la estructura de tres paneles del Bosco: raíz, presente y consecuencia.",
    slots: [
      { label: "Edén · Raíz", role: "El origen de la situación: lo que la sembró." },
      { label: "El Jardín · Presente", role: "Dónde estás parado ahora mismo, con todo su enredo." },
      { label: "El Infierno · Consecuencia", role: "Hacia dónde va esto si sigue su curso actual." }
    ]
  },
  {
    id: "cruz",
    layout: "cruz",
    title: "La Cruz del Jardín",
    count: 5,
    description: "Una lectura de cinco cartas para explorar un asunto en profundidad, con sus fuerzas visibles y ocultas.",
    slots: [
      { label: "El Centro", role: "El corazón del asunto." },
      { label: "El Obstáculo", role: "Lo que se interpone o pesa." },
      { label: "Lo Consciente", role: "Lo que ya sabes o reconoces." },
      { label: "Lo Oculto", role: "Lo que actúa desde abajo, sin que lo nombres aún." },
      { label: "El Resultado", role: "Hacia dónde apunta esto si lo dejas madurar." }
    ]
  }
];

/* ---------------- Seeded procedural creature art ---------------- */

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Builds a small abstract "Bosch-esque" creature glyph as an SVG string,
// deterministically shaped from the card id + palette (no reproduction of
// any real artwork — purely original procedural silhouettes).
function creatureSVG(card, { small = false } = {}) {
  const rnd = mulberry32(card.id * 97 + 13);
  const [c1, c2, c3] = card.palette;
  const w = 200, h = 260;
  const cx = w / 2, cy = h / 2 + 10;

  const bodyRX = 34 + rnd() * 14;
  const bodyRY = 46 + rnd() * 16;
  const tilt = (rnd() - 0.5) * 24;

  const legCount = 2 + Math.floor(rnd() * 2);
  let legs = "";
  for (let i = 0; i < legCount; i++) {
    const spread = (i - (legCount - 1) / 2) * (18 + rnd() * 10);
    const lx = cx + spread;
    const ly = cy + bodyRY - 6;
    const footY = ly + 34 + rnd() * 20;
    legs += `<path d="M${lx},${ly} Q${lx + (rnd()-0.5)*20},${(ly+footY)/2} ${lx + (rnd()-0.5)*14},${footY}" stroke="${c2}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  }

  const wingSide = rnd() > 0.4;
  let wings = "";
  if (wingSide) {
    const wr = 30 + rnd() * 20;
    wings = `
      <path d="M${cx - bodyRX + 4},${cy - 6} q-${wr},-${wr*0.6} -${wr*1.4},${wr*0.3} q${wr*0.7},${wr*0.5} ${wr*0.3},${wr*0.9} q${wr*0.6},-${wr*0.2} ${wr*0.8},-${wr*0.9}z"
            fill="${c3}" opacity="0.75"/>
      <path d="M${cx + bodyRX - 4},${cy - 6} q${wr},-${wr*0.6} ${wr*1.4},${wr*0.3} q-${wr*0.7},${wr*0.5} -${wr*0.3},${wr*0.9} q-${wr*0.6},-${wr*0.2} -${wr*0.8},-${wr*0.9}z"
            fill="${c3}" opacity="0.75"/>`;
  }

  const hasTail = rnd() > 0.35;
  const tail = hasTail
    ? `<path d="M${cx},${cy + bodyRY - 10} q${(rnd()-0.5)*60},${30 + rnd()*20} ${(rnd()-0.5)*50},${60 + rnd()*20}"
          stroke="${c2}" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.85"/>`
    : "";

  const hasHorn = rnd() > 0.5;
  const horn = hasHorn
    ? `<path d="M${cx - 8},${cy - bodyRY + 8} L${cx - 4},${cy - bodyRY - 22} L${cx + 2},${cy - bodyRY + 6}z" fill="${c3}"/>`
    : "";

  const headwearType = rnd();
  let headwear = "";
  if (headwearType > 0.66) {
    // funnel / cone hat
    headwear = `<path d="M${cx - 16},${cy - bodyRY + 4} L${cx},${cy - bodyRY - 46} L${cx + 16},${cy - bodyRY + 4}z" fill="${c2}" opacity="0.9"/>`;
  } else if (headwearType > 0.33) {
    // halo / ring
    headwear = `<ellipse cx="${cx}" cy="${cy - bodyRY - 4}" rx="22" ry="7" fill="none" stroke="${c3}" stroke-width="3" opacity="0.8"/>`;
  }

  const eyeCount = rnd() > 0.75 ? 3 : 1;
  let eyes = "";
  for (let i = 0; i < eyeCount; i++) {
    const ex = cx + (i - (eyeCount - 1) / 2) * 16;
    eyes += `<circle cx="${ex}" cy="${cy - 8}" r="3.6" fill="${c1}"/>`;
  }

  const orbCount = 2 + Math.floor(rnd() * 4);
  let orbs = "";
  for (let i = 0; i < orbCount; i++) {
    const ox = 14 + rnd() * (w - 28);
    const oy = 14 + rnd() * (h - 28);
    const or_ = 2 + rnd() * 4;
    orbs += `<circle cx="${ox}" cy="${oy}" r="${or_}" fill="${c1}" opacity="${0.15 + rnd() * 0.25}"/>`;
  }

  return `
  <svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeAttr(card.boschName)}">
    <defs>
      <radialGradient id="bg${card.id}" cx="50%" cy="35%" r="75%">
        <stop offset="0%" stop-color="${c1}" stop-opacity="0.18"/>
        <stop offset="100%" stop-color="${c3}" stop-opacity="0.06"/>
      </radialGradient>
    </defs>
    <rect x="0" y="0" width="${w}" height="${h}" fill="url(#bg${card.id})"/>
    ${orbs}
    <g transform="rotate(${tilt} ${cx} ${cy})">
      ${wings}
      ${legs}
      ${tail}
      <ellipse cx="${cx}" cy="${cy}" rx="${bodyRX}" ry="${bodyRY}" fill="${c2}" stroke="${c1}" stroke-width="2"/>
      <ellipse cx="${cx}" cy="${cy - bodyRY*0.55}" rx="${bodyRX*0.55}" ry="${bodyRY*0.4}" fill="${c1}" opacity="0.9"/>
      ${horn}
      ${headwear}
      ${eyes}
    </g>
  </svg>`;
}

function backGlyphSVG() {
  return `
  <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g fill="none" stroke="#d9a63e" stroke-width="1.4" opacity="0.9">
      <circle cx="60" cy="60" r="46"/>
      <circle cx="60" cy="60" r="30"/>
      <path d="M60 14 L60 106 M14 60 L106 60"/>
      <path d="M28 28 L92 92 M92 28 L28 92"/>
      <circle cx="60" cy="60" r="8" fill="#d9a63e" stroke="none" opacity="0.8"/>
    </g>
  </svg>`;
}

// Los Arcanos Mayores se ilustran con imágenes reales en images/{id}.{ext}
// (id 0–21, coincide con el id de la carta). Se prueban varias extensiones
// por si subiste .png, .jpeg o .webp en vez de .jpg. Si ninguna carga,
// se vuelve al arte procedural SVG de creatureSVG().
const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

function majorImageCandidates(card) {
  return card.arcana === "major"
    ? IMAGE_EXTENSIONS.map(ext => `images/${card.id}.${ext}`)
    : [];
}

function cardArtMarkup(card, alt = "") {
  const candidates = majorImageCandidates(card);
  if (!candidates.length) return creatureSVG(card);
  const altAttr = alt ? `alt="${escapeAttr(alt)}"` : 'alt=""';
  return `<img class="card-art-img" src="${escapeAttr(candidates[0])}" ${altAttr} loading="lazy" decoding="async" data-fallback="${card.id}" data-try-index="0">`;
}

function attachArtFallbacks(scope) {
  scope.querySelectorAll("img[data-fallback]").forEach(img => {
    const card = state.major.find(c => c.id === parseInt(img.dataset.fallback, 10));
    if (!card) return;
    const candidates = majorImageCandidates(card);
    img.addEventListener("error", () => {
      const nextIndex = parseInt(img.dataset.tryIndex, 10) + 1;
      if (nextIndex < candidates.length) {
        img.dataset.tryIndex = String(nextIndex);
        img.src = candidates[nextIndex];
        return;
      }
      const host = img.closest(".card-art, .modal-art");
      if (host && !host.dataset.fallbackApplied) {
        host.dataset.fallbackApplied = "1";
        host.innerHTML = creatureSVG(card);
      }
    });
  });
}

function escapeAttr(str) {
  return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
function escapeHTML(str) {
  return escapeAttr(str).replace(/>/g, "&gt;");
}

/* ---------------- Data loading ---------------- */

async function loadCards() {
  try {
    const res = await fetch("cards.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    state.major = data.majorArcana || [];
    state.minor = data.minorArcana || [];
    state.suits = data.suits || {};
  } catch (err) {
    console.error("No se pudo cargar cards.json:", err);
    document.getElementById("load-error").hidden = false;
  }
}

/* ---------------- Tabs ---------------- */

function initTabs() {
  const buttons = Array.from(document.querySelectorAll(".tab-btn"));

  function activateTab(btn, { focus = false } = {}) {
    buttons.forEach(b => {
      const isActive = b === btn;
      b.setAttribute("aria-selected", String(isActive));
      b.tabIndex = isActive ? 0 : -1;
    });
    document.querySelectorAll(".panel").forEach(p => p.classList.remove("is-active"));
    document.getElementById(btn.dataset.panel).classList.add("is-active");
    if (focus) btn.focus();
  }

  buttons.forEach((btn, i) => {
    btn.addEventListener("click", () => activateTab(btn));
    btn.addEventListener("keydown", e => {
      let targetIndex = null;
      if (e.key === "ArrowRight") targetIndex = (i + 1) % buttons.length;
      else if (e.key === "ArrowLeft") targetIndex = (i - 1 + buttons.length) % buttons.length;
      else if (e.key === "Home") targetIndex = 0;
      else if (e.key === "End") targetIndex = buttons.length - 1;
      if (targetIndex === null) return;
      e.preventDefault();
      activateTab(buttons[targetIndex], { focus: true });
    });
  });
}

/* ---------------- Deck encyclopedia ---------------- */

function renderDeckGrid() {
  const grid = document.getElementById("deck-grid");
  grid.innerHTML = "";

  const groups = [];
  if (state.deckFilter === "all" || state.deckFilter === "mayores") {
    groups.push({ heading: "Los 22 Arcanos Mayores", cards: state.major });
  }
  ["copas", "bastos", "espadas", "oros"].forEach(suitKey => {
    if (state.deckFilter !== "all" && state.deckFilter !== suitKey) return;
    const suitCards = state.minor.filter(c => c.suit === suitKey);
    if (!suitCards.length) return;
    const meta = state.suits[suitKey];
    const heading = meta ? `${meta.label} — ${meta.boschName}` : suitKey;
    groups.push({ heading, cards: suitCards });
  });

  groups.forEach(group => {
    const h3 = document.createElement("h3");
    h3.className = "deck-group-heading";
    h3.textContent = group.heading;
    grid.appendChild(h3);

    const row = document.createElement("div");
    row.className = "deck-grid-row";
    group.cards.forEach(card => {
      const btn = document.createElement("button");
      btn.className = "card";
      btn.setAttribute("aria-label", `Ver ${card.name} — ${card.boschName}`);
      btn.innerHTML = cardFaceMarkup(card, false);
      btn.addEventListener("click", () => openModal(card, btn));
      row.appendChild(btn);
    });
    attachArtFallbacks(row);
    grid.appendChild(row);
  });
}

function initDeckFilters() {
  const container = document.getElementById("deck-filters");
  if (!container) return;
  const options = [
    { key: "all", label: "Todo el mazo" },
    { key: "mayores", label: "Mayores" },
    { key: "copas", label: "Copas" },
    { key: "bastos", label: "Bastos" },
    { key: "espadas", label: "Espadas" },
    { key: "oros", label: "Oros" }
  ];
  container.setAttribute("role", "radiogroup");
  container.setAttribute("aria-label", "Filtrar el mazo");
  container.innerHTML = "";
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "filter-chip";
    btn.type = "button";
    btn.textContent = opt.label;
    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-checked", String(opt.key === state.deckFilter));
    btn.addEventListener("click", () => {
      state.deckFilter = opt.key;
      container.querySelectorAll(".filter-chip").forEach(b => b.setAttribute("aria-checked", "false"));
      btn.setAttribute("aria-checked", "true");
      renderDeckGrid();
    });
    container.appendChild(btn);
  });
}

function cardFaceMarkup(card, reversed) {
  return `
    <span class="card-inner" aria-hidden="true">
      <span class="card-face card-back">
        <span class="glyph">${backGlyphSVG()}</span>
      </span>
      <span class="card-face card-front">
        <span class="card-art">${cardArtMarkup(card)}</span>
        <span class="card-label">
          <span class="card-number">${card.number}${reversed ? " · invertida" : ""}</span>
          <span class="card-name">${escapeHTML(card.boschName)}</span>
        </span>
      </span>
    </span>`;
}

/* ---------------- Modal ---------------- */

let modalTriggerEl = null;

function openModal(card, triggerEl = null) {
  modalTriggerEl = triggerEl || document.activeElement;
  const backdrop = document.getElementById("modal-backdrop");
  const body = document.getElementById("modal-body");
  const suitMeta = card.suit ? state.suits[card.suit] : null;
  const subtitle = suitMeta
    ? `${escapeHTML(card.boschName)} · ${escapeHTML(suitMeta.label)}`
    : escapeHTML(card.boschName);
  body.innerHTML = `
    <button class="modal-close" id="modal-close" aria-label="Cerrar">✕</button>
    <div class="modal-top">
      <div class="modal-art">${cardArtMarkup(card, `Ilustración de ${card.boschName}`)}</div>
      <div>
        <h2>${escapeHTML(card.number)} · ${escapeHTML(card.name)}</h2>
        <p class="modal-sub">${subtitle}</p>
        <div>
          ${card.keywordsUp.map(k => `<span class="keyword-chip">${escapeHTML(k)}</span>`).join("")}
        </div>
      </div>
    </div>
    <p>${escapeHTML(card.creature)}</p>
    <div class="meaning-block up">
      <h3>Al derecho</h3>
      <p>${escapeHTML(card.meaningUp)}</p>
    </div>
    <div class="meaning-block rev">
      <h3>Invertida</h3>
      <p>${escapeHTML(card.meaningRev)}</p>
    </div>
  `;
  backdrop.classList.add("is-open");
  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.body.style.overflow = "hidden";
  attachArtFallbacks(body);
  document.getElementById("modal-close").focus();
  document.addEventListener("keydown", trapModalFocus);
}

function closeModal() {
  const backdrop = document.getElementById("modal-backdrop");
  if (!backdrop.classList.contains("is-open")) return;
  backdrop.classList.remove("is-open");
  document.body.style.overflow = "";
  document.removeEventListener("keydown", trapModalFocus);
  if (modalTriggerEl && typeof modalTriggerEl.focus === "function") {
    modalTriggerEl.focus();
  }
  modalTriggerEl = null;
}

function trapModalFocus(e) {
  if (e.key !== "Tab") return;
  const modal = document.getElementById("modal-body");
  const focusable = modal.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

/* ---------------- Spreads ---------------- */

function initSpreadSelector() {
  const container = document.getElementById("spread-select");
  container.setAttribute("role", "radiogroup");
  container.setAttribute("aria-label", "Tipos de tirada");
  container.innerHTML = "";
  SPREADS.forEach(spread => {
    const btn = document.createElement("button");
    btn.className = "spread-card";
    btn.type = "button";
    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-checked", "false");
    btn.innerHTML = `
      <span class="spread-count">${spread.count} carta${spread.count > 1 ? "s" : ""}</span>
      <h3>${escapeHTML(spread.title)}</h3>
      <p>${escapeHTML(spread.description)}</p>
    `;
    btn.addEventListener("click", () => selectSpread(spread.id));
    container.appendChild(btn);
  });
}

function selectSpread(id) {
  state.activeSpreadId = id;
  document.querySelectorAll(".spread-card").forEach((btn, i) => {
    btn.setAttribute("aria-checked", String(SPREADS[i].id === id));
  });
  document.getElementById("draw-btn").disabled = false;
  document.getElementById("spread-table").innerHTML = "";
  document.getElementById("reading-notes").innerHTML = "";
  buildEmptySlots(id);
}

function buildEmptySlots(id) {
  const spread = SPREADS.find(s => s.id === id);
  const table = document.getElementById("spread-table");
  table.dataset.layout = spread.layout;
  table.innerHTML = "";
  spread.slots.forEach(slot => {
    const wrap = document.createElement("div");
    wrap.className = "slot";
    wrap.innerHTML = `
      <span class="card empty">
        <span class="card-inner">
          <span class="card-face card-back"><span class="glyph">${backGlyphSVG()}</span></span>
          <span class="card-face card-front"></span>
        </span>
      </span>
      <span class="slot-label">${escapeHTML(slot.label)}</span>
    `;
    table.appendChild(wrap);
  });
}

function shuffledDeck() {
  const arr = activeDeck().slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function drawSpread() {
  const spread = SPREADS.find(s => s.id === state.activeSpreadId);
  if (!spread) return;

  const deck = shuffledDeck();
  state.currentDraw = deck.slice(0, spread.count).map(card => ({
    card,
    reversed: Math.random() < 0.28,
    revealed: false
  }));

  const table = document.getElementById("spread-table");
  table.innerHTML = "";
  spread.slots.forEach((slot, i) => {
    const draw = state.currentDraw[i];
    const wrap = document.createElement("div");
    wrap.className = "slot";

    const cardBtn = document.createElement("button");
    cardBtn.className = "card";
    cardBtn.setAttribute("aria-label", `Revelar carta: ${slot.label}`);
    cardBtn.innerHTML = cardFaceMarkup(draw.card, draw.reversed);
    attachArtFallbacks(cardBtn);

    cardBtn.addEventListener("click", () => {
      if (draw.revealed) {
        openModal(draw.card, cardBtn);
        return;
      }
      draw.revealed = true;
      cardBtn.classList.add(draw.reversed ? "is-reversed" : "is-flipped");
      cardBtn.setAttribute("aria-label", `${slot.label}: ${draw.card.boschName}${draw.reversed ? " (invertida)" : ""}. Tocar para ver el detalle.`);
      renderReadingNotes();
    });

    wrap.appendChild(cardBtn);
    const label = document.createElement("span");
    label.className = "slot-label";
    label.textContent = slot.label;
    wrap.appendChild(label);
    table.appendChild(wrap);
  });

  const notesEl = document.getElementById("reading-notes");
  notesEl.innerHTML = questionMarkup() +
    `<p class="section-lede" style="margin-top:0;">Toca cada carta para revelarla, en el orden que prefieras.</p>`;

  const firstCard = table.querySelector(".slot .card");
  if (firstCard) firstCard.focus({ preventScroll: true });
}

function questionMarkup() {
  const q = document.getElementById("question-input").value.trim();
  return q ? `<p class="reading-question">Pregunta / intención: “${escapeHTML(q)}”</p>` : "";
}

function renderReadingNotes() {
  const spread = SPREADS.find(s => s.id === state.activeSpreadId);
  const notes = document.getElementById("reading-notes");

  notes.innerHTML = questionMarkup();
  spread.slots.forEach((slot, i) => {
    const draw = state.currentDraw[i];
    if (!draw.revealed) return;
    const meaning = draw.reversed ? draw.card.meaningRev : draw.card.meaningUp;
    const keywords = draw.reversed ? draw.card.keywordsRev : draw.card.keywordsUp;

    const div = document.createElement("div");
    div.className = "reading-card";
    div.innerHTML = `
      <span class="rc-orientation ${draw.reversed ? "rev" : "up"}">${draw.reversed ? "Invertida" : "Al derecho"}</span>
      <h4>${slot.label} — ${escapeHTML(draw.card.boschName)}</h4>
      <p class="rc-role">${escapeHTML(slot.role)}</p>
      <p>${escapeHTML(meaning)}</p>
      <p class="rc-keywords">${keywords.map(k => `<span class="keyword-chip">${escapeHTML(k)}</span>`).join("")}</p>
    `;
    notes.appendChild(div);
  });

  const allRevealed = state.currentDraw.length && state.currentDraw.every(d => d.revealed);
  if (allRevealed) {
    const closing = document.createElement("p");
    closing.className = "section-lede";
    closing.textContent = "Lee las cartas en conjunto, no de forma aislada: la conversación entre ellas suele decir más que cada una por separado.";
    notes.appendChild(closing);
  }
}

function initDeckModeToggle() {
  const container = document.getElementById("deck-mode-select");
  if (!container) return;
  const options = [
    { key: "major", label: "Arcanos Mayores", hint: "22 cartas — grandes fuerzas y encrucijadas de fondo." },
    { key: "full", label: "Mazo Completo", hint: "78 cartas — incluye Copas, Bastos, Espadas y Oros, para lecturas más detalladas." }
  ];
  container.setAttribute("role", "radiogroup");
  container.setAttribute("aria-label", "Tamaño del mazo");
  container.innerHTML = "";
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "deck-mode-chip";
    btn.type = "button";
    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-checked", String(opt.key === state.deckMode));
    btn.innerHTML = `<strong>${escapeHTML(opt.label)}</strong><span>${escapeHTML(opt.hint)}</span>`;
    btn.addEventListener("click", () => {
      if (state.deckMode === opt.key) return;
      state.deckMode = opt.key;
      container.querySelectorAll(".deck-mode-chip").forEach(b => b.setAttribute("aria-checked", "false"));
      btn.setAttribute("aria-checked", "true");
      // Reset current spread selection since the pool changed
      document.getElementById("draw-btn").disabled = true;
      document.getElementById("spread-table").innerHTML = "";
      document.getElementById("reading-notes").innerHTML = "";
      document.querySelectorAll(".spread-card").forEach(b => b.setAttribute("aria-checked", "false"));
      state.activeSpreadId = null;
    });
    container.appendChild(btn);
  });
}

/* ---------------- Init ---------------- */

async function init() {
  await loadCards();
  if (!state.major.length) return;
  initTabs();
  initDeckFilters();
  renderDeckGrid();
  initSpreadSelector();
  initDeckModeToggle();

  document.getElementById("draw-btn").addEventListener("click", drawSpread);
  document.getElementById("modal-backdrop").addEventListener("click", e => {
    if (e.target.id === "modal-backdrop") closeModal();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
  });
}

document.addEventListener("DOMContentLoaded", init);
