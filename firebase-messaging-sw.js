/* Firebase Messaging Service Worker - PokeCards Collection */
importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDk8RyaXWt4cHLot3puOoAn_wF372pt_Qc",
  authDomain: "pokecards-collection.firebaseapp.com",
  projectId: "pokecards-collection",
  storageBucket: "pokecards-collection.firebasestorage.app",
  messagingSenderId: "890242521469",
  appId: "1:890242521469:web:1d533eadfa41a143d8d414"
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
