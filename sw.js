const CACHE_NAME = 'offline-engine-v9';

self.addEventListener('install', e => {
    self.skipWaiting();
    e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(['/', '/index.html'])));
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (key !== CACHE_NAME && key !== 'bible-data-v1') {
                    return caches.delete(key);
                }
            })
        ))
    );
    e.waitUntil(clients.claim());
});

self.addEventListener('fetch', e => {
    e.respondWith(
        fetch(e.request).then(res => {
            return caches.open(CACHE_NAME).then(cache => {
                cache.put(e.request, res.clone());
                return res;
            });
        }).catch(() => caches.match(e.request))
    );
});
