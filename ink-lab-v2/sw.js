// Service Worker â€” INK LAB ERP V2
const CACHE = "inklab-v5-live-batches";
const ASSETS = [
    "./index.html","./formulas.html","./batches.html",
    "./stock.html","./drums.html","./style.css",
    "./config.js","./formulas.js","./batches.js",
    "./stock.js","./drums.js","./pdf.js"
];

self.addEventListener("install", e => {
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(()=>{})));
    self.skipWaiting();
});

self.addEventListener("activate", e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", e => {
    // Supabase â€” always network
    if (e.request.url.includes("supabase.co") || e.request.url.includes("googleapis") || e.request.url.includes("cdnjs") || e.request.url.includes("jsdelivr")) {
        return;
    }
    e.respondWith(
        fetch(e.request).then(res => {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
            return res;
        }).catch(() => caches.match(e.request))
    );
});
