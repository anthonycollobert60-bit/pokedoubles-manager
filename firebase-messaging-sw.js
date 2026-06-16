/* Firebase Messaging Service Worker - PokeCards Collection
   Remplace firebaseConfig avec les mêmes valeurs que dans index.html.
*/
importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "A_REMPLACER",
  authDomain: "A_REMPLACER.firebaseapp.com",
  projectId: "A_REMPLACER",
  storageBucket: "A_REMPLACER.appspot.com",
  messagingSenderId: "A_REMPLACER",
  appId: "A_REMPLACER"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notification = payload.notification || {};
  const title = notification.title || 'PokeCards Collection';
  const options = {
    body: notification.body || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: payload.data || {}
  };
  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
