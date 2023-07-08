const cacheName = 'msedgeimgedit-cache';
const filestoCache = [
    `./`,
    `./index.html`,
    `./manifest.json`,
    `./icon.png`,
    `./script.js`,
    `./style.css`,
    `https://dinoosauro.github.io/image-converter/heic2any.js`,
    'https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Work+Sans&display=swap',
];
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName)
            .then(cache => cache.addAll(filestoCache))
    );
});
self.addEventListener('activate', e => self.clients.claim());
self.addEventListener('fetch', event => {
    const req = event.request;
    if (req.url.indexOf("updatecode") !== -1) return fetch(req); else event.respondWith(networkFirst(req));
});

async function networkFirst(req) {
    try {
        const networkResponse = await fetch(req);
        const cache = await caches.open('msedgeimgedit-cache');
        await cache.delete(req);
        await cache.put(req, networkResponse.clone());
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(req);
        return cachedResponse;
    }
}