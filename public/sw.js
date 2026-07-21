const CACHE_NAME = 'dramaflix-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/favicon.ico',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn('[Service Worker] Pre-caching failed:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only intercept GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip API routes, Next.js internal routes and HMR dev assets
  if (
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/_next') ||
    url.pathname.includes('webpack') ||
    url.pathname.includes('hot-update')
  ) return;

  // ✅ Intercept navigation requests (Network-first with offline fallback)
  // This satisfies Chrome PWA requirements without causing search bar blinking
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cached = await caches.match('/');
        if (cached) return cached;
        // Must always return a valid Response object to prevent TypeError
        return new Response(
          '<html><body><h2>You are offline and the page is not cached yet.</h2></body></html>',
          { headers: { 'Content-Type': 'text/html' } }
        );
      })
    );
    return;
  }

  // Only cache same-origin requests (exclude Firebase, Supabase, YouTube APIs etc.)
  if (url.origin !== self.location.origin) return;

  // Only handle static file extensions (icons, images, fonts)
  const staticExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.webp', '.ico', '.woff', '.woff2', '.ttf'];
  const isStaticAsset = staticExtensions.some(ext => url.pathname.endsWith(ext));
  if (!isStaticAsset) return;

  // Cache-first for static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      }).catch(() => null);
    })
  );
});

