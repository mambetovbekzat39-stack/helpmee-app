self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('allah99-cache').then(cache => {
            return cache.addAll([
                '.',
                'index.html',
                'style.css',
                'script.js',
                'icon-192.png',
                'icon-512.png',
                'splash.png'
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});
