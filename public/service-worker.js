'use strict';

/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
     http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

// Names of the two caches used in this version of the service worker.
// Change to v2, etc. when you update any of the local resources, which will
// in turn trigger the install event again.
var PRECACHE = 'precache-v6';
var RUNTIME = 'runtime';

// A list of local resources we always want to be cached.
var PRECACHE_URLS = [
	'/index.html',
  '/',
  '/css/main.css',
  '/js/main.js',
  '/js/jquery.js',
  '/js/bootstrap.js',
  '/images/earth-cache.jpg',
  '/images/canyon-cache.jpg',
  '/pwa.html'
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', function (event) {
  
  console.log(event);

  event.waitUntil(caches.open(PRECACHE).then(function (cache) {
    return cache.addAll(PRECACHE_URLS);
  }).then(self.skipWaiting()));
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', function (event) {
  var currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(caches.keys().then(function (cacheNames) {
    return cacheNames.filter(function (cacheName) {
      return !currentCaches.includes(cacheName);
    });
  }).then(function (cachesToDelete) {
    return Promise.all(cachesToDelete.map(function (cacheToDelete) {
      return caches.delete(cacheToDelete);
    }));
  }).then(function () {
    
    console.log('caces set');

    return self.clients.claim();
  }));
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', function (event) {
  // Skip cross-origin requests, like those for Google Analytics.

  if (event.request.url.indexOf('bootstrap.min.css') != -1) {
    event.respondWith(caches.match('/css/main.css').then(function (cachedResponse) {
        return cachedResponse;
    }));
  }

  if (event.request.url.indexOf('bootstrap.min.js') != -1) {
    event.respondWith(caches.match('/js/bootstrap.js').then(function (cachedResponse) {
        return cachedResponse;
    }));
  }

    if (event.request.url.indexOf('jquery.min.js') != -1) {
    event.respondWith(caches.match('/js/jquery.js').then(function (cachedResponse) {
        return cachedResponse;
    }));
  }

  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(caches.match(event.request).then(function (cachedResponse) {
        return cachedResponse;
    }));
  }
});