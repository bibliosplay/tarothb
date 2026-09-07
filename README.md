# 🌿 Tarot del Jardín de las Delicias

Mazo de tarot interactivo y original, inspirado en el imaginario de Hieronymus Bosch. Reinterpreta los 22 Arcanos Mayores como criaturas de un jardín imposible, generadas de forma procedural en SVG — **no reproduce ninguna obra existente**, es una relectura simbólica.

Sitio 100% estático, sin frameworks ni build step: HTML, CSS y JavaScript vanilla.

## ✨ Funcionalidades

- **Manual** — explica qué son los Arcanos Mayores, el sentido de las cartas invertidas y cómo leer una tirada.
- **El Mazo** — las 22 cartas navegables, cada una con su criatura, historia y significado al derecho / invertida.
- **Hacer una Tirada** — tres tipos de tirada (1, 3 y 5 cartas), con mezcla aleatoria, revelado carta por carta y notas de lectura generadas al vuelo.
- Arte de las criaturas generado proceduralmente por carta (semilla determinística por `id`), sin imágenes externas.
- Accesible: navegación de pestañas con teclado (flechas / Home / End) siguiendo el patrón ARIA de tablist, modal con foco atrapado y devuelto al cerrarse, `aria-live` en los resultados de lectura, `prefers-reduced-motion` respetado.

## 📁 Estructura

```
.
├── index.html      # Estructura y contenido semántico
├── style.css       # Estilos, tema visual y layouts responsivos
├── script.js       # Lógica: pestañas, mazo, tiradas, modal, arte SVG procedural
├── cards.json      # Datos de las 22 cartas (nombres, criaturas, significados)
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

Todo el contenido de las cartas vive en `cards.json`, bajo `majorArcana`. Cada carta sigue este esquema:

```json
{
  "id": 0,
  "number": "0",
  "name": "El Loco",
  "boschName": "El Peregrino Alado",
  "palette": ["#e8c874", "#4a5d3a", "#1a1410"],
  "creature": "Descripción de la criatura...",
  "keywordsUp": ["comienzos", "inocencia"],
  "keywordsRev": ["imprudencia", "dispersión"],
  "meaningUp": "Significado al derecho...",
  "meaningRev": "Significado invertida..."
}
```

`id` determina la semilla del arte procedural (`script.js → creatureSVG`), así que debe ser único y estable; cambiarlo cambia el diseño de la criatura.

## ⚠️ Aviso

Herramienta de reflexión y entretenimiento. No es un método de predicción exacta ni sustituye asesoramiento profesional en salud, dinero o vínculos.

## 📝 Licencia

Sin licencia definida todavía — agregá un archivo `LICENSE` (por ejemplo MIT) antes de publicar el repo si querés dejar claros los términos de uso y reutilización del código y los textos.
