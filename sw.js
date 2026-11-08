// Tinebox Loop: the page and its icons from the cache first, so it opens without a connection. Bump VERSION with every build.
const VERSION = 'tinebox-loop-4';
const FILES = ['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{ const u=new URL(e.request.url); if(e.request.method!=='GET'||u.origin!==location.origin) return;
  // the page: network first (so a new build shows up), the cache when offline; everything else: cache first
  if(e.request.mode==='navigate'){ e.respondWith(fetch(e.request).then(r=>{ const c=r.clone(); caches.open(VERSION).then(x=>x.put('index.html',c)); return r; }).catch(()=>caches.match('index.html'))); return; }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))); });
