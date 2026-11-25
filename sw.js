/* Service worker del Radar Diario (v4).
   - La app (HTML, JS, íconos) se guarda para abrir rápido y sin conexión.
   - data.json y la página se piden a la red primero, con límite de tiempo;
     si la red tarda o falla, se usa la última copia guardada.
   - Las respuestas redirigidas se "limpian" (Safari en iPhone se niega a abrir
     una página si el service worker le entrega una redirección). */
const SHELL = 'radar-shell-v4';
const DATA = 'radar-data';
const SHELL_FILES = ['./', 'index.html', 'app.js?v=4', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(SHELL)
      .then(c => Promise.all(SHELL_FILES.map(f => c.add(f).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== SHELL && k !== DATA).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(v => { clearTimeout(t); resolve(v); }, err => { clearTimeout(t); reject(err); });
  });
}
async function clean(res) {
  if (!res || !res.redirected) return res;
  const body = await res.blob();
  return new Response(body, { status: res.status, statusText: res.statusText, headers: res.headers });
}

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // fuentes y enlaces externos: directo a la red

  if (url.pathname.endsWith('/data.json')) {
    e.respondWith(
      withTimeout(fetch(e.request, { cache: 'no-store' }), 8000)
        .then(clean)
        .then(res => {
          if (res.ok) { const copy = res.clone(); caches.open(DATA).then(c => c.put('data.json', copy)); }
          return res;
        })
        .catch(() => caches.open(DATA).then(c => c.match('data.json')).then(hit => hit || Response.error()))
    );
    return;
  }

  if (e.request.mode === 'navigate') {
    e.respondWith(
      withTimeout(fetch(e.request), 6000)
        .then(clean)
        .then(res => {
          if (res.ok) { const copy = res.clone(); caches.open(SHELL).then(c => c.put('index.html', copy)); }
          return res;
        })
        .catch(() => caches.match('index.html').then(hit => hit || caches.match('./')).then(hit => hit || Response.error()))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(clean))
  );
});
