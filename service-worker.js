// global constants to use relative paths
const APP_PREFIX = 'FoodFest-';     
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

// define files to cache
// didn't include images because of cache limit
const FILES_TO_CACHE = [
    "./index.html",
    "./events.html",
    "./tickets.html",
    "./schedule.html",
    "./assets/css/style.css",
    "./assets/css/bootstrap.css",
    "./assets/css/tickets.css",
    "./dist/app.bundle.js",
    "./dist/events.bundle.js",
    "./dist/tickets.bundle.js",
    "./dist/schedule.bundle.js"
];

self.addEventListener('install', function (e) {
    // e.waitUntil to make browser wait until work is complete before terminating service worker
    // aka service worker won't move on from installing phase until it's finished executing all of its code
    e.waitUntil(
        // caches.open to find specific cache by name
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing cache : ' + CACHE_NAME)
            // then add every file in FILES_TO_CACHE array to the cache
            return cache.addAll(FILES_TO_CACHE)
        })
    )
});

self.addEventListener('activate', function (e) {
    e.waitUntil(
        // .keys to return an array of all cache names, called keyList
        caches.keys().then(function (keyList) {
            // store caches that have the app prefix 
            let cacheKeeplist = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            })

            // add current CACHE_NAME to cacheKeepList array
            cacheKeeplist.push(CACHE_NAME);
            
            // returns Promise that resolves once all old versions of cache are deleted
            return Promise.all(
                keyList.map(function(key, i) {
                    // item will return with a value of -1 if not found keyList, so delete it from the cache
                    if (cacheKeeplist.indexOf(key) === -1) {
                        console.log('deleting cache : ' + keyList[i]);
                        return caches.delete(keyList[i]);
                    }
                })
            );
        })
    );
});


self.addEventListener('fetch', function (e) {
    console.log('fetch request : ' + e.request.url)
    e.respondWith(
        caches.match(e.request).then(function (request) {
            if (request) { // if cache is available, respond with cache
                console.log('responding with cache : ' + e.request.url)
                return request
            } else {       // if there are no cache, try fetching request
                console.log('file is not cached, fetching : ' + e.request.url)
                return fetch(e.request)
            }
            
            // You can omit if/else for console.log & put one line below like this too.
            // return request || fetch(e.request)
        })
    )
})