(function () {
  var currentScript = document.currentScript;
  var baseDir = currentScript && currentScript.src ? currentScript.src.replace(/[^/]*$/, '') : '';

  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = baseDir + 'biblio-nav.css';
  document.head.appendChild(link);

  var DESTINOS = [
    { id: 'inicio',     href: 'https://bibliosplay.github.io/',            texto: 'Todos los mazos' },
    { id: 'varotarot',  href: 'https://bibliosplay.github.io/tarotvaro/',   texto: 'Tarot Varo' },
    { id: 'tarotbosch', href: 'https://bibliosplay.github.io/tarothb/',     texto: 'Tarot Bosch' },
    { id: 'espejo',     href: 'https://bibliosplay.github.io/espejo/',      texto: 'Espejo del Alma' }
  ];

  var actual = document.body.getAttribute('data-biblio') || '';
  if (!actual) {
    var path = location.pathname.replace(/\/$/, '');
    if (path.indexOf('/tarotvaro/') === 0 || path.indexOf('/tarotvaro') === 0) actual = 'varotarot';
    else if (path.indexOf('/tarothb') === 0) actual = 'tarotbosch';
    else if (path.indexOf('/espejo') === 0) actual = 'espejo';
    else actual = 'inicio';
  }

  var enlaces = DESTINOS.map(function (d) {
    var attrs = 'href="' + d.href + '"';
    if (d.id === actual) attrs += ' aria-current="page"';
    return '<a class="biblio-nav__link" ' + attrs + '>' + d.texto + '</a>';
  }).join('');

  var nav = document.createElement('nav');
  nav.className = 'biblio-nav';
  nav.setAttribute('aria-label', 'Mazos de la Biblioteca Splay');
  nav.innerHTML =
    '<a class="biblio-nav__brand" href="https://bibliosplay.github.io/" title="Inicio de la Biblioteca Splay">' +
      '<span class="biblio-nav__marca" aria-hidden="true">&#9670;</span>' +
      '<span class="biblio-nav__nombre">Biblioteca Splay</span>' +
    '</a>' +
    '<div class="biblio-nav__links">' + enlaces + '</div>';

  var primero = document.body.firstChild;
  document.body.insertBefore(nav, primero);
})();