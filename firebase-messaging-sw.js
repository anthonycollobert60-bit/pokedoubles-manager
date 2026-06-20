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
  try {

    // Empêche les doublons
    if (payload && payload.notification) {
      return;
    }

    const data = payload?.data || {};

    self.registration.showNotification(
      data.title || "PokeCards Collection",
      {
        body: data.body || "",
        icon: "/icon-192.png?v=20260620",
        badge: "/icon-192.png?v=20260620",
        tag: data.client_event_id || data.report_id || "pokecards",
        renotify: false,
        data: {
          url: data.url || "/"
        }
      }
    );

  } catch (err) {
    console.error(err);
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification?.data?.url || "/";

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then((clientList) => {

      for (const client of clientList) {
        if ("focus" in client) {
          client.focus();
          if ("navigate" in client) {
            client.navigate(targetUrl);
          }
          return;
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
