const BASE = "/smartschool/";
const CACHE = "smartschool-shell-v3";

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll([BASE, BASE + "manifest.json"]))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;

  // Always ask the server for the latest app shell. This prevents old HTML
  // from pointing at JavaScript/CSS hashes removed by a newer deployment.
  if (request.mode === "navigate" || url.pathname === BASE) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(BASE, copy));
          }
          return response;
        })
        .catch(() => caches.match(BASE))
    );
    return;
  }

  // Prefer current deployed files; use cached copies only when offline.
  event.respondWith(
    fetch(request).then((response) => {
      if (response.ok && url.pathname.includes("/assets/")) {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(request, copy));
      }
      return response;
    }).catch(() => caches.match(request))
  );
});
