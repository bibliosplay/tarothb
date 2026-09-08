/* ============================================================
   Creador de Prompts — Tarot del Jardín de las Delicias
   Inventa 22 cartas (Arcanos Mayores) con conceptos NUEVOS
   y propios del mundo de cada pintor elegido o sugerido.
   ============================================================ */

/* ---- Esencia de cada Arcano: arquetipo + escena base ---- */
const ARCANA = [
  { id: 0,  canon: "0 · El Loco",            role: "El Peregrino",          action: "avanza al filo del vacío sin mirar el vértigo" },
  { id: 1,  canon: "I · El Mago",            role: "El Encantador",         action: "hace girar cuatro objetos a la vez sobre una mesa de feria" },
  { id: 2,  canon: "II · La Sacerdotisa",    role: "La Sibila",             action: "guarda en silencio una respuesta que aún no dice" },
  { id: 3,  canon: "III · La Emperatriz",    role: "La Madre del Crecimiento", action: "hace crecer todo lo que toca, incluso lo que no debería" },
  { id: 4,  canon: "IV · El Emperador",      role: "El Señor del Orden",    action: "impone una estructura firme para que el resto sostenga peso" },
  { id: 5,  canon: "V · El Sumo Sacerdote",  role: "El Maestro del Rito",   action: "oficia frente a una fila atenta con un libro de páginas por escribir" },
  { id: 6,  canon: "VI · Los Enamorados",    role: "Los Dos que Eligen",    action: "ponen el corazón y los valores en la misma balanza" },
  { id: 7,  canon: "VII · El Carro",         role: "El Conductor de Contrarios", action: "guía dos fuerzas opuestas hacia un solo horizonte" },
  { id: 8,  canon: "VIII · La Fuerza",       role: "La Donadora de Calma",  action: "apacigua a la bestia con presencia, no con golpes" },
  { id: 9,  canon: "IX · El Ermitaño",       role: "El Farero de la Linterna", action: "alumbra el propio suelo en medio del ruido" },
  { id: 10, canon: "X · La Rueda de la Fortuna", role: "El Giro de las Horas",  action: "hace girar ciclos que nadie puede detener" },
  { id: 11, canon: "XI · La Justicia",       role: "El Peso Exacto",        action: "pesa acciones y consecuencias sin un gramo de más" },
  { id: 12, canon: "XII · El Colgado",       role: "El Colgado",            action: "observa el mundo invertido sin forcejear por bajar" },
  { id: 13, canon: "XIII · La Muerte",       role: "La Que Siega lo Marchito", action: "libera espacio para lo que todavía no nació" },
  { id: 14, canon: "XIV · La Templanza",     role: "La Mezcladora de Aguas", action: "mezcla dos fuerzas opuestas gota a gota" },
  { id: 15, canon: "XV · El Diablo",         role: "El Señor de las Cadenas", action: "disimula las ataduras como si fueran elección" },
  { id: 16, canon: "XVI · La Torre",         role: "El Derrumbe Necesario", action: "quiebra de golpe una arquitectura de base falsa" },
  { id: 17, canon: "XVII · La Estrella",     role: "La Donadora de Agua Clara", action: "vierte agua clara sobre una tierra que empieza a sanar" },
  { id: 18, canon: "XVIII · La Luna",        role: "La Guardiana de la Niebla", action: "camina entre reflejos e ilusiones sin distinguirlos" },
  { id: 19, canon: "XIX · El Sol",           role: "El Corazón Luminoso",   action: "celebra la claridad sin buscarle sombra" },
  { id: 20, canon: "XX · El Juicio",         role: "La Trompeta del Despertar", action: "despierta a las figuras de su vida anterior" },
  { id: 21, canon: "XXI · El Mundo",         role: "El Abrazo del Ciclo Completo", action: "cierra un ciclo y lo deja listo para volver a empezar" }
];

/* ---- Perfiles de pintores: técnica + mundo + vocabulario ---- */
const PROFILES = [
  {
    id: "bosch", name: "Hieronymus Bosch", menu: true,
    technique: "óleo sobre tabla de roble, primitivo flamenco del siglo XV, figuras diminutas y densas, criaturas híbridas, esmaltes punteados y veladuras",
    titleNouns: ["Vergel de Criaturas", "Estanque de Híbridos", "Huerto de Mariposas", "Jardín de las Delicias"],
    settings: ["un jardín imposible entre estanques", "un vergel de frutos desmesurados", "unas ruinas donde crece la noche", "una mesa de feria al borde del mundo"],
    motifs: ["peces con patas", "aves de pico largo", "frutos que sangran dorado", "demonios de alas de polilla", "huevos translúcidos"],
    flavor: ["bosquiano", "infernal", "vergel", "asombrado"],
    palette: "tonos tierra, esmeralda, ámbar y rojo"
  },
  {
    id: "klimt", name: "Gustav Klimt", menu: true,
    technique: "modernismo Art Nouveau, fondos de pan de oro, mosaicos y ornamentos, textura decorativa y sensual",
    titleNouns: ["Jardín de Pan de Oro", "Mosaico de Amantes", "Beso de Esmalte", "Invernadero Bizantino"],
    settings: ["un invernadero bizantino", "el balcón de un palacio dormido", "un lecho de mosaicos dorados", "un jardín prohibido en bajorrelieve"],
    motifs: ["serpientes de oro entrelazadas", "amantes fundidos en mosaico", "ramas de laurel esmaltadas", "ojos de pavo real", "vórtices ornamentales"],
    flavor: ["dorado", "ornamental", "íntimo", "suntuoso"],
    palette: "ámbar, esmeralda y pan de oro"
  },
  {
    id: "vangogh", name: "Vincent van Gogh", menu: true,
    technique: "postimpresionismo, empaste grueso, pinceladas vibrantes, cielos en espiral y color intenso",
    titleNouns: ["Campo de Estrellas Girantes", "Noche Azulada", "Girasol de Madrugada", "Ciprés en Llamas"],
    settings: ["un campo de trigo bajo un cielo en espiral", "una noche de pinceladas alocadas", "una terraza iluminada a la madrugada", "un huerto de cipreses encendidos"],
    motifs: ["estrellas que giran", "girasoles desbordados", "pinceladas de fuego", "sombras danzarinas", "almas empastadas de color"],
    flavor: ["vibrante", "desbordado", "nocturno", "ardiente"],
    palette: "azul de ultramar, amarillo cromo y turquesa"
  },
  {
    id: "goya", name: "Francisco de Goya", menu: true,
    technique: "romanticismo con claroscuro, tenebrismo dramático, sombras humeantes y matiz psicológico",
    titleNouns: ["Sueño de la Razón", "Prado de Sombras", "Capricho Oscuro", "Aquelarre Difuso"],
    settings: ["una plaza donde la razón duerme", "un patio de sombras alargadas", "una reunión nocturna de capas y faroles", "un corredor donde el miedo respira"],
    motifs: ["búhos y murciélagos", "figuras encapuchadas", "una niña con candil", "bufones de capa negra", "gatos de ojos de brasa"],
    flavor: ["sombrío", "dramático", "quejumbroso", "nocturno"],
    palette: "ocres, ceniza y umber"
  },
  {
    id: "dali", name: "Salvador Dalí", menu: true,
    technique: "surrealismo, formas que se derriten, paisajes oníricos, realismo hiperdetallado y luz irreal",
    titleNouns: ["Reloj Blando", "Paisaje del Tiempo Fundido", "Mar de Cigüeñas", "Desierto de Cristal"],
    settings: ["una llanura de relojes fundidos", "un desierto último al borde del mar", "un cielo de hormigas y horas perfectas", "un espejo que gotea"],
    motifs: ["relojes que se estiran", "elefantes de patas finísimas", "hormigas sobre oro", "llaves flotantes", "sombras que abandonan el cuerpo"],
    flavor: ["onírico", "derretido", "cristalino", "imposible"],
    palette: "azul de ultramar, nácar y ámbar cálido"
  },
  {
    id: "arcimboldo", name: "Giuseppe Arcimboldo", menu: true,
    technique: "manierismo, retrato compuesto, figuras de frutas, flores y animales, virtuosismo caprichoso",
    titleNouns: ["Banquete de Estaciones", "Huerto de un Rostro", "Invierno de Raíces", "Vergel de Retratos"],
    settings: ["un rostro armado entre frutas", "un bosque donde crecen caras", "una mesa de cosecha infinita", "un vergel de espigas y crías"],
    motifs: ["peras y espigas", "pétalos que hacen párpados", "raíces como barba", "aves anidando en el pelo", "frutos que son mejillas"],
    flavor: ["caprichoso", "vegetal", "estacional", "ingenioso"],
    palette: "verdes, ocres y rojos de fruta"
  },
  {
    id: "hokusai", name: "Katsushika Hokusai", menu: true,
    technique: "ukiyo-e japonés, xilografía, campos de color plano, contornos nítidos y línea dinámica",
    titleNouns: ["La Gran Ola Índigo", "Puente de Ciprés", "Montaña de las Nieves Largas", "Viento de Tinta"],
    settings: ["una ola enorme bajo un cielo de tinta", "un puente de ciprés sobre aguas índigo", "un paisaje de nieve y luna", "un barco pequeño en un mar de líneas"],
    motifs: ["olas crestadas de espuma", "cumbres puntiagudas nevadas", "pescadores diminutos", "grullas de papel", "viento dibujado en tinta"],
    flavor: ["nítido", "geométrico", "minucioso", "ligero"],
    palette: "índigo, bermellón y papel crudo"
  },
  {
    id: "kandinsky", name: "Wassily Kandinsky", menu: true,
    technique: "arte abstracto, campos de color puro, geometría y composición musical",
    titleNouns: ["Círculo Sonoro", "Apremio de Formas", "Rapsodia de Color", "Constelación Vibrante"],
    settings: ["un plano de color donde suena música", "un campo geométrico en fuga", "una partitura pintada de color", "un torrente de formas que bailan"],
    motifs: ["círculos concéntricos", "triángulos en movimiento", "líneas que caminan", "colores que chocan", "formas que persiguen notas"],
    flavor: ["rítmico", "abstracto", "luminoso", "sinfónico"],
    palette: "azul, amarillo y rojo puros"
  },
  {
    id: "caravaggio", name: "Caravaggio", menu: false,
    technique: "tenebrismo barroco, luz de vela que nace de la sombra, realismo de carne y dramatismo",
    titleNouns: ["Cena de la Luz", "Fondo de Terciopelo Rojo", "Postura de la Mirada", "Reflejo de Cobre"],
    settings: ["una mesa pobre donde la luz golpea", "una habitación que se hunde en la sombra", "un fondo oscuro de terciopelo roto", "una escena de posada y evangelio"],
    motifs: ["manos que parten el pan", "rostros de barro y sudor", "copas de vino como sangre", "un brazo que señala desde la oscuridad"],
    flavor: ["dramático", "realista", "de vela", "carnal"],
    palette: "negro profundo, carnes cálidas y rojo"
  },
  {
    id: "artemisia", name: "Artemisia Gentileschi", menu: false,
    technique: "barroco de claroscuro con heroínas poderosas, escena teatral y luz dura",
    titleNouns: ["Judith de la Espada", "Triunfo de las Vencedoras", "Salón de las Heroínas", "Rostro Desafiante"],
    settings: ["una escena de tragedia con luz de antorcha", "un taller donde las mujeres mandan", "un corredor de victoria y sangre", "un teatro de sombras y poder"],
    motifs: ["espadas recién usadas", "miradas que no se rinden", "telas que gotean", "lágrimas de rabia"],
    flavor: ["poderoso", "justiciero", "intenso", "heroico"],
    palette: "carmesí, ocre y sombra"
  },
  {
    id: "monet", name: "Claude Monet", menu: false,
    technique: "impresionismo, luz al aire libre, pinceladas sueltas y reflejos en el agua",
    titleNouns: ["Jardín de Lirios", "Estanque de Reflejos", "Puente entre Sombras Verdes", "Alba sobre el Agua"],
    settings: ["un estanque de nenúfares al amanecer", "un jardín de rosas y niebla", "un río de reflejos rotos", "una colina de amapolas"],
    motifs: ["nenúfares flotantes", "reflejos que se disuelven", "niebla lavanda", "puente verde entre cañaverales"],
    flavor: ["luminoso", "evanescente", "acuático", "suave"],
    palette: "verdes de agua, lila y rosa"
  },
  {
    id: "leonardo", name: "Leonardo da Vinci", menu: false,
    technique: "renacimiento, sfumato, transiciones suaves de sombra, anatomía y paisaje lejano",
    titleNouns: ["Valle de la Sombra Suave", "Estudio del Rostro Lejano", "Atanor de la Luz", "Horizonte de Bruma"],
    settings: ["un valle brumoso al fondo de la escena", "un estudio de luz y sombra esfumadas", "un banco de piedra entre cipreses", "un glaciar de montañas lejanas"],
    motifs: ["manos que apuntan al cielo", "plumas y libros de notas", "rocas que se pliegan", "sonrisas a medio definir"],
    flavor: ["sosegado", "científico", "nebuloso", "armónico"],
    palette: "tierras umbrías, azul lejano y blanco hueso"
  },
  {
    id: "frida", name: "Frida Kahlo", menu: false,
    technique: "autorretrato naíf entre naturaleza y dolor, flores, símbolos personales y trajes mexicanos",
    titleNouns: ["Jardín de Cactus y Dolor", "Corazón de Flores", "Vestido de Raíces", "Espejo de Pétalos"],
    settings: ["un patio de flores y cactus", "un desierto de tules y cejas", "una cama entre hierbas y amuletos", "un altar de flores de papel"],
    motifs: ["monos y venados", "colas trenzadas", "flores en el pelo", "corazones expuestos"],
    flavor: ["íntimo", "colorido", "doloroso", "mexicano"],
    palette: "rosa mexicano, verde y azul añil"
  },
  {
    id: "miro", name: "Joan Miró", menu: false,
    technique: "surrealismo abstracto, formas biomórficas, puntos, estrellas y humor cósmico",
    titleNouns: ["Cielo de Puntos", "Constelación de Amebas", "Jardín de Signos", "Espejo de Formas que Juegan"],
    settings: ["un cielo sin horizonte lleno de signos", "un plano de colores puros", "un escenario de puntos y lunas", "un jardín donde las formas juegan"],
    motifs: ["estrellas y lunas", "ojos en las esquinas", "manchas que reptan", "escaleras irreales"],
    flavor: ["lúdico", "abstracto", "cósmico", "ingenuo"],
    palette: "azul, rojo, amarillo y negro"
  },
  {
    id: "magritte", name: "René Magritte", menu: false,
    technique: "surrealismo de lo cotidiano, objetos desplazados, humor seco y cielo dentro de siluetas",
    titleNouns: ["Sombrero de Hombre Nube", "Espejo de lo Extraño", "Lluvia de Palabras", "Ventana a Otro Cielo"],
    settings: ["una habitación donde el objeto ya no es lo que era", "una calle ordenada con un cielo imposible", "una ventana que da a otra ventana", "un bosque de sombreros hongo"],
    motifs: ["sombreros flotantes", "pájaros que son nubes", "una pipa que no es una pipa", "cielos dentro de siluetas"],
    flavor: ["enigmático", "cotidiano", "absurdo", "seco"],
    palette: "azul frío, negro y blanco"
  },
  {
    id: "warhol", name: "Andy Warhol", menu: false,
    technique: "pop art, serigrafía, color plano saturado y repetición en serie",
    titleNouns: ["Sopa de Estrellas", "Constelación de Plata", "Halo Repetido", "Factory de Talismanes"],
    settings: ["una fábrica de luces, metales y espejos", "una galería de repeticiones doradas", "un estudio donde el arte se imprime", "una caja de colores saturados"],
    motifs: ["retratos repetidos en fila", "latas y botellas doradas", "toques de tóner saturado", "sombras de plata"],
    flavor: ["pop", "serigráfico", "saturado", "repetido"],
    palette: "rojo cadmio, amarillo, azul cobalto y plata"
  },
  {
    id: "custom", name: "Otro / personalizado", menu: true,
    technique: "",
    titleNouns: ["Jardín de las Formas", "Bosque de los Encuentros", "Tríptico de la Luz", "Cámara de los Ecos"],
    settings: ["un jardín ordenado y abierto", "un taller entre ventanas altas", "un claro que guarda silencio", "un escenario a media luz"],
    motifs: ["emblemas de cosecha", "aves y ramas entrelazadas", "espejos de fondo", "símbolos tallados en piedra"],
    flavor: ["armónico", "sereno", "de autor", "personal"],
    palette: "tonos de contraste y armonía"
  }
];

/* ---- Estado ---- */
const state = {
  major: [],
  painterId: "bosch",
  custom: "",
  styleKey: null, // painterId(+custom) con el que se generó la salida
  items: []       // [{ def, render, fixed }]
};

/* ---------------- Helpers ---------------- */

function escapeText(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function profileOf() {
  return PROFILES.find(p => p.id === state.painterId) || PROFILES[PROFILES.length - 1];
}

function techniqueOf() {
  const p = profileOf();
  return p.id === "custom" ? (state.custom.trim() || "técnica del pintor elegido") : p.technique;
}

function currentStyleKey() {
  return state.painterId === "custom"
    ? "custom:" + state.custom.trim().toLowerCase()
    : state.painterId;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function sampleN(arr, n) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, Math.min(n, a.length));
}

function keywordChips(up, rev) {
  const upChips = up.map(k => `<span class="keyword-chip">${escapeText(k)}</span>`).join("");
  const revChips = rev.map(k => `<span class="keyword-chip">↔ ${escapeText(k)}</span>`).join("");
  return `${upChips} ${revChips}`;
}

/* ---------------- Compositor de cartas (conceptos nuevos) ---------------- */

function composeItem(def) {
  const card = state.major[def.id];
  const isBosch = state.painterId === "bosch";

  if (isBosch) {
    // Estilo Bosch → mazo original del Jardín de las Delicias
    return {
      def,
      card,
      fixed: true,
      name: card.boschName,
      encounter: card.creature,
      up: card.keywordsUp,
      rev: card.keywordsRev,
      style: techniqueOf(),
      palette: card.palette.join(", ")
    };
  }

  const p = profileOf();
  const title = pick(p.titleNouns);
  const setting = pick(p.settings);
  const [m1, m2] = sampleN(p.motifs, 2);
  const flavor = pick(p.flavor);

  return {
    def,
    card,
    fixed: false,
    name: `${def.role} del ${title}`,
    encounter: `${def.action} en ${setting}, rodeado de ${m1} y ${m2}.`,
    up: [...card.keywordsUp, flavor],
    rev: card.keywordsRev,
    style: techniqueOf(),
    palette: p.palette
  };
}

function buildPrompt(item) {
  return [
    `${item.def.canon} reimaginado — «${item.name}», carta de tarot`,
    `Protagonista: ${item.def.role}`,
    `Escena y concepto nuevos: ${item.encounter}`,
    `Palabras clave al derecho: ${item.up.join(", ")} · invertida: ${item.rev.join(", ")}`,
    `Estilo: ${item.style}`,
    `Paleta: ${item.palette}`,
    `Composición: formato vertical, figura central nítida, fondo con simbolismo, borde ornamental sutil, contraste atmosférico, alta definición`
  ].join("\n");
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

/* ---------------- Selector de pintores + sugerencia ---------------- */

function renderPainterChips() {
  const container = document.getElementById("painter-select");
  container.innerHTML = "";
  PROFILES.filter(p => p.menu).forEach(p => {
    const btn = document.createElement("button");
    btn.className = "painter-chip";
    btn.type = "button";
    btn.setAttribute("role", "radio");
    btn.dataset.id = p.id;
    btn.setAttribute("aria-checked", String(p.id === state.painterId));
    btn.innerHTML = `<strong>${escapeText(p.name)}</strong><span>${escapeText(p.style || "Escribís tu propia técnica o pintor")}</span>`;
    btn.addEventListener("click", () => {
      state.painterId = p.id;
      syncPainterUI();
      updateGenerateDisabled();
      markStale();
    });
    container.appendChild(btn);
  });
}

function syncPainterUI() {
  document.querySelectorAll(".painter-chip").forEach(b => {
    b.setAttribute("aria-checked", String(b.dataset.id === state.painterId));
  });
  const isCustom = state.painterId === "custom";
  document.getElementById("custom-style").hidden = !isCustom;
  updateActiveLabel();
}

function updateActiveLabel() {
  const p = profileOf();
  const label = document.getElementById("active-style");
  label.textContent = p.id === "custom"
    ? (state.custom.trim() ? `Estilo activo: ${state.custom.trim()}` : "Estilo activo: personalizado")
    : `Estilo activo: ${p.name}`;
}

function initCustomInput() {
  const input = document.getElementById("custom-input");
  input.addEventListener("input", () => {
    state.custom = input.value;
    updateActiveLabel();
    updateGenerateDisabled();
    markStale();
  });
}

function initSuggest() {
  document.getElementById("suggest-btn").addEventListener("click", () => {
    const pool = PROFILES.filter(p => p.id !== "custom" && p.id !== state.painterId && p.id !== "bosch");
    const suggested = pick(pool);
    state.painterId = suggested.id;
    syncPainterUI();
    updateGenerateDisabled();
    markStale();
    setStatus(`Sugerido: ${suggested.name}. Pulsá «Generar las 22 cartas».`);
  });
}

function updateGenerateDisabled() {
  const loaded = state.major.length > 0;
  const styleOk = state.painterId !== "custom" || state.custom.trim().length > 0;
  document.getElementById("generate-btn").disabled = !(loaded && styleOk);
}

/* ---------------- Generación y render ---------------- */

function renderItems() {
  const results = document.getElementById("results");
  results.innerHTML = "";
  results.dataset.stale = "false";

  state.items.forEach((item, i) => {
    results.appendChild(buildCardElement(item, i));
  });

  updateOutputButtons();
  setStatus(`${state.items.length} cartas generadas con conceptos nuevos${state.painterId === "bosch" ? " (mazo original del Jardín de las Delicias)" : ""}.`);
}

function buildCardElement(item, i) {
  const article = document.createElement("article");
  article.className = "prompt-card";
  article.innerHTML = `
    <h3>
      <span class="pn">${escapeText(item.def.canon)}</span>
      <span class="nn">«${escapeText(item.name)}»</span>
    </h3>
    <p class="keywords">${keywordChips(item.up, item.rev)}</p>
    <textarea class="prompt-text" readonly aria-label="Prompt para ${escapeText(item.name)}"></textarea>
    <div class="card-foot">
      <div class="card-foot-tools">
        ${item.fixed ? "" : `<button class="regen-one" data-i="${i}" type="button">Otra versión</button>`}
        <button class="copy-one" data-i="${i}" type="button">Copiar prompt</button>
      </div>
    </div>
  `;
  article.querySelector(".prompt-text").value = buildPrompt(item);
  return article;
}

function generate() {
  if (!state.major.length) return;
  if (state.painterId === "custom" && !state.custom.trim()) return;

  state.styleKey = currentStyleKey();
  state.items = ARCANA.map(def => composeItem(def));
  renderItems();
}

function regenerateItem(i) {
  if (state.styleKey !== currentStyleKey()) return;
  state.items[i] = composeItem(state.items[i].def);

  const results = document.getElementById("results");
  const article = buildCardElement(state.items[i], i);
  const all = Array.from(results.querySelectorAll(".prompt-card"));
  if (all[i]) all[i].replaceWith(article);
}

function markStale() {
  if (!state.styleKey) return;
  state.styleKey = null;
  state.items = [];
  updateOutputButtons();
  const results = document.getElementById("results");
  if (results.children.length) {
    results.dataset.stale = "true";
    setStatus("El estilo cambió — volvé a pulsar «Generar las 22 cartas».");
  }
}

function updateOutputButtons() {
  const fresh = !!state.styleKey && state.styleKey === currentStyleKey();
  const has = fresh && state.items.length > 0;
  document.getElementById("variate-btn").disabled = !has;
  document.getElementById("copy-all-btn").disabled = !has;
  document.getElementById("download-btn").disabled = !has;
}

/* ---------------- Copiar / descargar ---------------- */

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) { /* fallback */ }
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

function setStatus(msg) {
  document.getElementById("status").textContent = msg;
}

function initActions() {
  const results = document.getElementById("results");

  results.addEventListener("click", async e => {
    const copyBtn = e.target.closest(".copy-one");
    if (copyBtn) {
      if (results.dataset.stale === "true") {
        setStatus("Primero regenerá: el estilo cambió.");
        return;
      }
      const item = state.items[parseInt(copyBtn.dataset.i, 10)];
      const ok = await copyText(buildPrompt(item));
      if (ok) flashCopied(copyBtn);
      else setStatus("No se pudo copiar: copiá el texto del recuadro manualmente.");
      return;
    }
    const regenBtn = e.target.closest(".regen-one");
    if (regenBtn) regenerateItem(parseInt(regenBtn.dataset.i, 10));
  });

  document.getElementById("variate-btn").addEventListener("click", () => {
    state.items = ARCANA.map(def => composeItem(def));
    renderItems();
  });

  document.getElementById("copy-all-btn").addEventListener("click", async () => {
    const all = state.items
      .map(item => `=== ${item.def.canon} — «${item.name}» ===\n${buildPrompt(item)}`)
      .join("\n\n");
    const ok = await copyText(all);
    setStatus(ok ? `${state.items.length} prompts copiados.` : "No se pudo copiar automáticamente: usá «Descargar .txt».");
  });

  document.getElementById("download-btn").addEventListener("click", () => {
    if (!state.items.length) return;
    const p = profileOf();
    const label = state.painterId === "custom" ? (state.custom.trim() || "personalizado") : p.name;
    const head = [
      "Tarot del Jardín de las Delicias — Cartas nuevas por pintor",
      `Estilo: ${label}`,
      agentNote(),
      ""
    ];
    const body = state.items
      .map(item => `=== ${item.def.canon} — «${item.name}» ===\n${buildPrompt(item)}`)
      .join("\n\n");
    const blob = new Blob([head.join("\n") + body + "\n"], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cartas_estilo_${label.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatus("Archivo .txt descargado.");
  });
}

function agentNote() {
  return "Prompts generados originalmente para crear imágenes; no reproducen obras existentes.";
}

/* ---------------- Init ---------------- */

async function init() {
  await loadCards();
  if (!state.major.length) return;
  renderPainterChips();
  syncPainterUI();
  initCustomInput();
  initSuggest();
  initActions();
  updateGenerateDisabled();
  document.getElementById("generate-btn").addEventListener("click", generate);
}

document.addEventListener("DOMContentLoaded", init);