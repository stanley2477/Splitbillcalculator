const CACHE_NAME = "split-bill-calculator-v1";

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/favicon.png"
];

/* =====================================================
   INSTALL
===================================================== */

self.addEventListener("install", event => {

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();

});


/* =====================================================
   ACTIVATE
===================================================== */

self.addEventListener("activate", event => {

  event.waitUntil(
    caches.keys().then(cacheNames => {

      return Promise.all(

        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))

      );

    })
  );

  self.clients.claim();

});


/* =====================================================
   FETCH
===================================================== */

self.addEventListener("fetch", event => {

  event.respondWith(

    fetch(event.request)

      .catch(() => caches.match(event.request))

  );

});


/* =====================================================
   FIREBASE CLOUD MESSAGING
===================================================== */

importScripts(
  "https://www.gstatic.com/firebasejs/12.0.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging-compat.js"
);


/* =====================================================
   FIREBASE CONFIG
===================================================== */

firebase.initializeApp({

  apiKey: "AIzaSyCIhYhOdSTiWxcj3czn09KmEP6xSmi_Sc",

  authDomain:
    "split-bill-calculator-aad6b.firebaseapp.com",

  projectId:
    "split-bill-calculator-aad6b",

  storageBucket:
    "split-bill-calculator-aad6b.firebasestorage.app",

  messagingSenderId:
    "398787092388",

  appId:
    "1:398787092388:web:d5955869f846aa28eaab31"

});


const messaging =
  firebase.messaging();


/* =====================================================
   BACKGROUND NOTIFICATIONS
===================================================== */

messaging.onBackgroundMessage(
  function(payload) {

    console.log(
      "Firebase background message received:",
      payload
    );

    const notificationTitle =
      payload.notification?.title ||
      "Split Bill Calculator";

    const notificationOptions = {

      body:
        payload.notification?.body ||
        "Split Bill Calculator is ready whenever you need it.",

      icon: "/favicon.png",

      badge: "/favicon.png"

    };


    self.registration.showNotification(

      notificationTitle,

      notificationOptions

    );

  }
);