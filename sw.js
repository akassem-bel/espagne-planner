const C='espagne-lux-v26';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  var url=new URL(e.request.url);
  var isDoc=e.request.mode==='navigate'||e.request.destination==='document'||url.pathname.endsWith('/')||/index\.html?$/.test(url.pathname);
  if(isDoc){e.respondWith(fetch(e.request).then(function(resp){var cp=resp.clone();caches.open(C).then(function(c){c.put(e.request,cp);});return resp;}).catch(function(){return caches.match(e.request).then(function(r){return r||caches.match('./index.html');});}));return;}
  e.respondWith(caches.match(e.request).then(function(r){return r||fetch(e.request).then(function(resp){var cp=resp.clone();caches.open(C).then(function(c){c.put(e.request,cp);});return resp;});}));
});
