const CACHE_NAME = 'eno-rocks-shell-v1';
const PRECACHE = [
    '/',
    '/index.html',
    '/manifest.webmanifest',
    '/eno-landing.css',
    '/shared/css/eno-menu.css',
    '/shared/js/eno-nav-config.js',
    '/shared/js/eno-site-nav.js',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => cache.addAll(PRECACHE))
            .then(() => self.skipWaiting()),
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
            )
            .then(() => self.clients.claim()),
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
        return;
    }

    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cached) => {
            const network = fetch(event.request)
                .then((response) => {
                    if (response.ok && url.pathname.startsWith('/shared/')) {
                        const copy = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
                    }
                    return response;
                })
                .catch(() => cached);

            if (url.pathname === '/' || url.pathname === '/index.html') {
                return cached ?? network;
            }

            return network.catch(() => cached);
        }),
    );
});
