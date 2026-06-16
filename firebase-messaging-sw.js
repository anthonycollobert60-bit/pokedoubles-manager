importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDk8RyaXWt4cHLot3puOoAn_wF372pt_Qc",
  authDomain: "pokecards-collection.firebaseapp.com",
  projectId: "pokecards-collection",
  storageBucket: "pokecards-collection.firebasestorage.app",
  messagingSenderId: "890242521469",
  appId: "1:890242521469:web:1d533eadfa41a143d8d414"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notification = payload.notification || {};

  self.registration.showNotification(
    notification.title || "PokeCards Collection",
    {
      body: notification.body || "",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      data: payload.data || {}
    }
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
