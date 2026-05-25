const CACHE_NAME = 'himekura-board-v2';
const ASSETS = [
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;700;800&family=DM+Mono:ital@0;1&display=swap'
];

// Installation : Mise en cache des ressources critiques
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    .then(() => self.skipWaiting()) // Force le SW à s'activer immédiatement
  );
});

// Activation : Nettoyage des anciens caches pour éviter les bugs de mise à jour
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // Prend le contrôle direct des pages ouvertes
  );
});

// Stratégie Fetch : Cache en priorité, réseau si absent
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
