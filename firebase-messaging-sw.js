// Service worker Firebase Cloud Messaging.
// Ce fichier DOIT être déployé à la racine de CE site (Pokedoubles Manager),
// nommé exactement "firebase-messaging-sw.js", au même niveau que index.html.

importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging-compat.js');

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
  const title = payload.notification?.title || 'Pokedoubles Manager';
  const options = {
    body: payload.notification?.body || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png'
  };
  self.registration.showNotification(title, options);
});
