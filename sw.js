/* Service worker del Radar Diario.
   - La app (HTML, JS, íconos) se guarda para abrir rápido y sin conexión.
   - data.json siempre se pide a la red primero; si no hay red, se usa la última copia guardada. */
const SHELL = 'radar-shell-v3';
const DATA = 'radar-data';
const SHELL_FILES = ['./', 'index.html', 'app.js?v=3', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(SHELL_FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== SHELL && k !== DATA).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // fuentes de Google y ligas externas: directo a la red
  if (url.pathname.endsWith('/data.json')) {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' })
        .then(res => { const copy = res.clone(); caches.open(DATA).then(c => c.put('data.json', copy)); return res; })
        .catch(() => caches.open(DATA).then(c => c.match('data.json')))
    );
    return;
  }
  // HTML: red primero (para recibir cambios de diseño), con respaldo guardado
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(res => { const copy = res.clone(); caches.open(SHELL).then(c => c.put('index.html', copy)); return res; })
      .catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request)));
});
