// Service worker Firebase Cloud Messaging — VERSION DIAGNOSTIC.
// Ce fichier capture toute erreur au démarrage et l'affiche comme une
// notification système, pour pouvoir la lire sans ordinateur.

self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(self.clients.claim()); });

try {
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
} catch (err) {
  // On affiche l'erreur réelle en notification pour pouvoir la lire
  // directement sur le téléphone, sans console de développement.
  self.registration.showNotification('⚠️ Erreur SW Firebase', {
    body: String(err && (err.stack || err.message || err)).slice(0, 250),
    requireInteraction: true
  }).catch(()=>{});
}
