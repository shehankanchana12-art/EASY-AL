const CACHE_NAME = "zephyros-os-v1";
const urlsToCache = ["/", "/index.html", "/src/styles/main.css"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("firestore.googleapis.com")) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});
