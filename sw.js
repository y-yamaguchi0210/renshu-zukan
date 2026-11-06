// 電波がなくても開けるように、アプリ本体とフォントを端末に保存する
const CACHE='renshu-zukan-v4-koka-label';
const FILES=['./','index.html','manifest.json','ball-icon-192.png','ball-icon-512.png','ball-apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);
 const font=u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com';
 if(u.origin!==location.origin&&!font)return;
 e.respondWith(caches.match(e.request,{ignoreSearch:!font}).then(hit=>{
  const net=fetch(e.request).then(r=>{if(r&&(r.ok||r.type==='opaque')){const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c))}return r});
  if(hit){net.catch(()=>{});return hit}
  return net.catch(()=>e.request.mode==='navigate'?caches.match('index.html'):Response.error());
 }));
});
