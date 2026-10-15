/* a bone to pick: keeps images and fonts on the visitor's device after the first view.
   if you ever replace an image but keep its name, change v1 to v2 below so everyone gets the new one. */
const IMG_CACHE="abtp-img-v1", FONT_CACHE="abtp-font-v1";
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys
  .filter(k=>k.startsWith("abtp-")&&k!==IMG_CACHE&&k!==FONT_CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  const req=e.request;if(req.method!=="GET")return;
  const u=new URL(req.url);
  const name=(u.origin===location.origin&&u.pathname.includes("/img/"))?IMG_CACHE:(u.hostname==="fonts.gstatic.com"?FONT_CACHE:null);
  if(!name)return; // everything else (the page itself, the overlay relay) always comes fresh from the network
  e.respondWith(caches.open(name).then(c=>c.match(req).then(hit=>hit||fetch(req).then(res=>{if(res.ok||res.type==="opaque")c.put(req,res.clone());return res;}))));
});
