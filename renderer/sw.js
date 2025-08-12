const CACHE_NAME = 'rpi-5inch-showcase-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/base.css',
  '/styles/home.css',
  '/styles/about.css',
  '/styles/games.css',
  '/styles/game.css',
  '/styles/memory.css',
  '/styles/pingpong.css',
  '/styles/snake.css',
  '/styles/stl.css',
  '/styles/touch.css',
  '/styles/visuals.css',
  '/styles/scroll.css',
  '/styles/settings.css',
  '/styles/info.css',
  '/assets/Matrix.png',
  '/assets/fonts/',
  '/screens/',
  '/assets/cad1.stl',
  '/assets/cad2.stl',
  '/assets/cad3.stl'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
