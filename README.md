# 🌿 Tarot del Jardín de las Delicias

Mazo de tarot interactivo y original de **78 cartas**, inspirado en el imaginario de Hieronymus Bosch. Reinterpreta los 22 Arcanos Mayores y los 56 Arcanos Menores (Copas, Bastos, Espadas y Oros) como criaturas de un jardín imposible, generadas de forma procedural en SVG — **no reproduce ninguna obra existente**, es una relectura simbólica.

Sitio 100% estático, sin frameworks ni build step: HTML, CSS y JavaScript vanilla.

## ✨ Funcionalidades

- **Manual** — explica qué son los Arcanos Mayores y Menores, el sentido de las cartas invertidas y cómo leer una tirada.
- **El Mazo** — las 78 cartas navegables con filtro por palo (Mayores / Copas / Bastos / Espadas / Oros), cada una con su criatura, historia y significado al derecho / invertida.
- **Hacer una Tirada** — elegí entre tirar solo con los 22 Arcanos Mayores o con el mazo completo de 78 cartas, y luego entre tres tipos de tirada (1, 3 y 5 cartas), con mezcla aleatoria, revelado carta por carta y notas de lectura generadas al vuelo.
- Arte de las criaturas generado proceduralmente por carta (semilla determinística por `id`), sin imágenes externas.
- Accesible: navegación de pestañas con teclado (flechas / Home / End) siguiendo el patrón ARIA de tablist, modal con foco atrapado y devuelto al cerrarse, `aria-live` en los resultados de lectura, `prefers-reduced-motion` respetado.

## 🃏 Los cuatro palos

| Palo | Nombre bosquiano | Elemento | Rige |
|---|---|---|---|
| Copas | Copas del Estanque | Agua | Vínculos y vida emocional |
| Bastos | Varas del Vergel | Fuego | Voluntad, creatividad, acción |
| Espadas | Espadas del Aire | Aire | Pensamiento, conflicto, verdad |
| Oros | Frutos de la Tierra | Tierra | Lo material, el trabajo, el cuerpo |

## 📁 Estructura

```
.
├── index.html      # Estructura y contenido semántico
├── style.css       # Estilos, tema visual y layouts responsivos
├── script.js       # Lógica: pestañas, mazo, tiradas, modal, arte SVG procedural
├── cards.json      # Datos de las 78 cartas (mayores + menores) y metadatos de palos
└── README.md
```

No hay dependencias de build. La única dependencia externa es la tipografía (Google Fonts, `Cinzel` + `Crimson Text`) importada por CDN en `style.css`.

## 🚀 Cómo correrlo localmente

`cards.json` se carga vía `fetch`, así que **no alcanza con abrir `index.html` con doble clic** — la mayoría de los navegadores bloquean la lectura de archivos locales por `file://`. Necesitás un servidor estático simple:

```bash
# Opción 1: Python
python3 -m http.server 8000

# Opción 2: Node
npx serve .
```

Luego abrí `http://localhost:8000` en el navegador. También funciona con la extensión "Live Server" de VS Code.

## 🌐 Publicarlo (GitHub Pages)

1. Subí el repo a GitHub.
2. Andá a **Settings → Pages**.
3. Elegí la rama `main` y la carpeta raíz (`/`) como fuente.
4. El sitio queda disponible en `https://<usuario>.github.io/<repo>/`.

## 🧩 Agregar o editar cartas

Todo el contenido vive en `cards.json`. La raíz tiene cuatro claves:

- `meta` — metadatos generales del mazo.
- `majorArcana` — array con los 22 Arcanos Mayores.
- `minorArcana` — array plano con los 56 Arcanos Menores, cada uno con un campo `suit` (`copas` / `bastos` / `espadas` / `oros`).
- `suits` — metadatos de cada palo (`label`, `boschName`, `element`, `theme`), referenciados por el campo `suit` de cada carta menor.

Esquema de una carta (mayor o menor):

```json
{
  "id": 22,
  "arcana": "minor",
  "suit": "copas",
  "number": "As",
  "name": "As de Copas",
  "boschName": "El Cáliz que Rebalsa",
  "palette": ["#7fb8c9", "#2d4a5e", "#10181c"],
  "creature": "Descripción de la criatura...",
  "keywordsUp": ["apertura", "ternura", "comienzo emocional"],
  "keywordsRev": ["emoción contenida", "corazón cerrado", "desborde"],
  "meaningUp": "Significado al derecho...",
  "meaningRev": "Significado invertida..."
}
```

`id` determina la semilla del arte procedural (`script.js → creatureSVG`), así que debe ser único en todo el mazo (0–21 para mayores, 22–77 para menores) y estable; cambiarlo cambia el diseño de la criatura.

## ⚠️ Aviso

Herramienta de reflexión y entretenimiento. No es un método de predicción exacta ni sustituye asesoramiento profesional en salud, dinero o vínculos.

## 📝 Licencia

Sin licencia definida todavía — agregá un archivo `LICENSE` (por ejemplo MIT) antes de publicar el repo si querés dejar claros los términos de uso y reutilización del código y los textos.
