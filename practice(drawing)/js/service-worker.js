
const cacheName = "cacheName_ver" + 1;
const cacheList = ['/project3/','/','/project3/img/','/project3/index.html','/project3/manifest.json']

self.addEventListener("install",function(e){
    console.log("[serviceWorker] installing");
    e.waitUntil(
       caches
        .open(cacheName)
        .then(cache => cache.addAll(cacheList))
        .then(res => console.log("[serviceWorker] installed"))
    )
})

self.addEventListener("activate",function(){
    console.log("[serviceWorker] activated")
})

self.addEventListener("fetch",function(e){
        e.respondWith(
            caches.match(e.request)
                .then(req => {
                    if(req) {return req}
                    fetch(e.request) 
                }).catch(err => console.log("fetch error :" + err))
        )
});

