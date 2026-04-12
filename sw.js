const CACHE_NAME = 'offline-engine-v2';

self.addEventListener('install', e => {
    self.skipWaiting();
    e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(['/', '/index.html'])));
});

// This deletes the old v1 cache but keeps your downloaded Bible data safe
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

// Network-First Strategy: Always shows your latest GitHub updates instantly!
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
