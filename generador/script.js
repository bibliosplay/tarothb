/* ============================================================
   Creador de Prompts — Tarot del Jardín de las Delicias
   Genera prompts listos para usar (Midjourney / DALL·E / SD)
   a partir de los 22 Arcanos Mayores y el estilo elegido.
   ============================================================ */

const PAINTERS = [
  {
    id: "bosch",
    name: "Hieronymus Bosch",
    style: "óleo sobre tabla de roble, primitivo flamenco del siglo XV, figuras diminutas y densas, criaturas híbridas y surrealistas, jardín fantástico, esmaltes punteados y veladuras, tonos tierra, esmeralda y ámbar"
  },
  {
    id: "klimt",
    name: "Gustav Klimt",
    style: "modernismo Art Nouveau, fondos de pan de oro, patrones ornamentales, texturas decorativas y remolinos, colores cálidos con verde esmeralda"
  },
  {
    id: "vangogh",
    name: "Vincent van Gogh",
    style: "postimpresionismo, empaste grueso, pinceladas vibrantes y cielos en espiral, color intenso, energía expresiva"
  },
  {
    id: "goya",
    name: "Francisco de Goya",
    style: "romanticismo con claroscuro, tenebrismo dramático, sombras humeantes, matices psicológicos, ocres y tierras sombrías"
  },
  {
    id: "dali",
    name: "Salvador Dalí",
    style: "surrealismo, formas que se derriten, paisajes oníricos vastos, realismo hiperdetallado, técnica clásica precisa, luz irreal"
  },
  {
    id: "kandinsky",
    name: "Wassily Kandinsky",
    style: "arte abstracto, abstracción geométrica, campos de color puro, composición musical, planos y líneas en movimiento"
  },
  {
    id: "hokusai",
    name: "Katsushika Hokusai",
    style: "ukiyo-e japonés, xilografía, campos de color plano, contornos marcados, índigo y bermellón, línea dinámica"
  },
  {
    id: "arcimboldo",
    name: "Giuseppe Arcimboldo",
    style: "manierismo, retrato compuesto, figuras construidas con frutas, flores y animales, virtuosismo caprichoso"
  },
  {
    id: "custom",
    name: "Otro / personalizado",
    style: ""
  }
];

const state = {
  major: [],
  painterId: "bosch",
  custom: "",
  styleKey: null, // clave del estilo con el que se generó la última salida
  prompts: []     // [{ card, prompt }]
};

/* ---------------- Helpers ---------------- */

function escapeText(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function currentStyleText() {
  if (state.painterId === "custom") {
    const c = state.custom.trim();
    return c ? `en la estética, paleta y técnica pictórica de ${c}` : null;
  }
  const p = PAINTERS.find(x => x.id === state.painterId);
  return p ? p.style : null;
}

function currentStyleKey() {
  return state.painterId === "custom"
    ? "custom:" + state.custom.trim().toLowerCase()
    : state.painterId;
}

function buildPrompt(card, styleText) {
  return [
    `${card.number} · ${card.name} — «${card.boschName}», carta de tarot`,
    `Escena: ${card.creature}`,
    `Palabras clave al derecho: ${card.keywordsUp.join(", ")} · invertida: ${card.keywordsRev.join(", ")}`,
    `Estilo: ${styleText}`,
    `Paleta de color: ${card.palette.join(", ")}`,
    `Composición: formato vertical, figura central nítida, fondo con simbolismo, borde ornamental sutil, contraste atmosférico, alta definición`
  ].join("\n");
}

function keywordChips(card) {
  const up = card.keywordsUp.map(k => `<span class="keyword-chip">${escapeText(k)}</span>`).join("");
  const rev = card.keywordsRev.map(k => `<span class="keyword-chip">↔ ${escapeText(k)}</span>`).join("");
  return `${up} ${rev}`;
}

/* ---------------- Data loading ---------------- */

async function loadCards() {
  try {
    const res = await fetch("cards.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    state.major = (data.majorArcana || []).slice();
  } catch (err) {
    console.error("No se pudo cargar cards.json:", err);
    document.getElementById("load-error").hidden = false;
  }
}

/* ---------------- Painter selector ---------------- */

function initPainterSelector() {
  const container = document.getElementById("painter-select");
  container.innerHTML = "";
  PAINTERS.forEach(p => {
    const btn = document.createElement("button");
    btn.className = "painter-chip";
    btn.type = "button";
    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-checked", String(p.id === state.painterId));
    btn.innerHTML = `<strong>${escapeText(p.name)}</strong><span>${escapeText(p.style || "Escribís tu propia técnica o pintor")}</span>`;
    btn.addEventListener("click", () => {
      if (state.painterId === p.id) return;
      state.painterId = p.id;
      container.querySelectorAll(".painter-chip").forEach(b => b.setAttribute("aria-checked", "false"));
      btn.setAttribute("aria-checked", "true");
      const isCustom = p.id === "custom";
      document.getElementById("custom-style").hidden = !isCustom;
      if (isCustom) document.getElementById("custom-input").focus();
      updateGenerateDisabled();
      markStale();
    });
    container.appendChild(btn);
  });
}

function initCustomInput() {
  const input = document.getElementById("custom-input");
  input.addEventListener("input", () => {
    state.custom = input.value;
    updateGenerateDisabled();
    markStale();
  });
}

function updateGenerateDisabled() {
  const styleOk = state.painterId !== "custom" || state.custom.trim().length > 0;
  document.getElementById("generate-btn").disabled = !(state.major.length && styleOk);
}

/* ---------------- Generation ---------------- */

function generate() {
  const styleText = currentStyleText();
  if (!styleText || !state.major.length) return;

  state.styleKey = currentStyleKey();
  state.prompts = state.major.map(card => ({ card, prompt: buildPrompt(card, styleText) }));

  const results = document.getElementById("results");
  results.innerHTML = "";
  results.dataset.stale = "false";

  state.prompts.forEach((item, i) => {
    const article = document.createElement("article");
    article.className = "prompt-card";
    article.innerHTML = `
      <h3>
        <span class="pn">${escapeText(item.card.number)}</span>
        <span>${escapeText(item.card.name)}</span>
        <span class="pne">— ${escapeText(item.card.boschName)}</span>
      </h3>
      <p class="keywords">${keywordChips(item.card)}</p>
      <textarea class="prompt-text" readonly aria-label="Prompt para ${escapeText(item.card.name)}"></textarea>
      <div class="card-foot">
        <button class="copy-one" data-i="${i}" type="button">Copiar prompt</button>
      </div>
    `;
    article.querySelector(".prompt-text").value = item.prompt;
    results.appendChild(article);
  });

  updateOutputButtons();
  setStatus(`${state.major.length} prompts generados en el estilo elegido.`);
}

function markStale() {
  if (!state.styleKey) return;
  state.styleKey = null;
  state.prompts = [];
  const results = document.getElementById("results");
  if (results.children.length) {
    results.dataset.stale = "true";
    setStatus("El estilo cambió — volvé a pulsar «Generar prompts».");
  }
  updateOutputButtons();
}

function updateOutputButtons() {
  const fresh = !!state.styleKey && state.styleKey === currentStyleKey();
  document.getElementById("copy-all-btn").disabled = !(fresh && state.prompts.length);
  document.getElementById("download-btn").disabled = !(fresh && state.prompts.length);
}

/* ---------------- Copy / download ---------------- */

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) { /* fallback below */ }
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch (err) {
    return false;
  }
}

function flashCopied(btn) {
  const prev = btn.textContent;
  btn.textContent = "¡Copiado!";
  btn.classList.add("copied");
  setTimeout(() => {
    btn.textContent = prev;
    btn.classList.remove("copied");
  }, 1400);
}

function initResultsActions() {
  const results = document.getElementById("results");

  results.addEventListener("click", async e => {
    const btn = e.target.closest(".copy-one");
    if (!btn) return;
    if (results.dataset.stale === "true") {
      setStatus("Primero regenerá: el estilo cambió.");
      return;
    }
    const item = state.prompts[parseInt(btn.dataset.i, 10)];
    if (!item) return;
    const ok = await copyText(item.prompt);
    if (ok) flashCopied(btn);
    else setStatus("No se pudo copiar: copiá el texto del recuadro manualmente.");
  });

  document.getElementById("copy-all-btn").addEventListener("click", async () => {
    const all = state.prompts
      .map((item, i) => `=== ${item.card.number} · ${item.card.name} ===\n${item.prompt}`)
      .join("\n\n");
    const ok = await copyText(all);
    setStatus(ok
      ? `${state.prompts.length} prompts copiados.`
      : "No se pudo copiar automáticamente: usá «Descargar .txt».");
  });

  document.getElementById("download-btn").addEventListener("click", () => {
    if (!state.prompts.length) return;
    const painter = PAINTERS.find(p => p.id === state.painterId);
    const label = state.painterId === "custom" ? state.custom.trim() : painter.name;
    const head = [
      "Tarot del Jardín de las Delicias — Prompts de los Arcanos Mayores",
      `Estilo: ${label}`,
      ""
    ];
    const body = state.prompts
      .map((item, i) => `=== ${item.card.number} · ${item.card.name} («${item.card.boschName}») ===\n${item.prompt}`)
      .join("\n\n");
    const blob = new Blob([head.join("\n") + body + "\n"], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prompts_arcanos_${label.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatus("Archivo .txt descargado.");
  });
}

function setStatus(msg) {
  document.getElementById("status").textContent = msg;
}

/* ---------------- Init ---------------- */

async function init() {
  await loadCards();
  if (!state.major.length) return;
  initPainterSelector();
  initCustomInput();
  initResultsActions();
  updateGenerateDisabled();
  document.getElementById("generate-btn").addEventListener("click", generate);
}

document.addEventListener("DOMContentLoaded", init);