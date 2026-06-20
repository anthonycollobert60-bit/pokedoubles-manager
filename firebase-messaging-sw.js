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

const GROUP_DELAY_MS = 1800;
const pendingGroups = {};

function groupKey(data) {
  const type = data.type || "notification";
  const from = data.from || data.actor || data.sender || "";
  return `${type}|${from}`;
}

function groupedTitle(type, count, fallbackTitle) {
  if (count <= 1) return fallbackTitle || "PokeCards Collection";
  if (type === "message" || type === "chat") return `💬 ${count} nouveaux messages`;
  if (type === "report") return `🚨 ${count} nouveaux reports`;
  if (type === "friend_request") return `👥 ${count} demandes d'ami`;
  if (type === "transfer") return `📦 ${count} transferts reçus`;
  return `🔔 ${count} nouvelles notifications`;
}

function groupedBody(type, count, fallbackBody) {
  if (count <= 1) return fallbackBody || "";
  if (type === "message" || type === "chat") return "Ouvre PokeCards pour lire les messages.";
  if (type === "report") return "Ouvre l'onglet Reports pour les consulter.";
  if (type === "friend_request") return "Ouvre PokeCards pour répondre.";
  if (type === "transfer") return "Ouvre PokeCards pour consulter les transferts.";
  return "Ouvre PokeCards pour consulter les notifications.";
}

messaging.onBackgroundMessage((payload) => {
  try {
    const data = payload?.data || {};

    // Si payload.notification existe, Chrome peut afficher automatiquement.
    // La fonction Supabase corrigée doit envoyer uniquement data.
    if (payload?.notification && !data.title && !data.body) return;

    const type = data.type || "notification";
    const key = groupKey(data);

    pendingGroups[key] = pendingGroups[key] || {
      count: 0,
      type,
      title: data.title || payload?.notification?.title || "PokeCards Collection",
      body: data.body || payload?.notification?.body || "",
      data
    };

    pendingGroups[key].count += 1;
    pendingGroups[key].title = data.title || pendingGroups[key].title;
    pendingGroups[key].body = data.body || pendingGroups[key].body;
    pendingGroups[key].data = { ...pendingGroups[key].data, ...data };

    clearTimeout(pendingGroups[key].timer);

    pendingGroups[key].timer = setTimeout(() => {
      const group = pendingGroups[key];
      delete pendingGroups[key];

      self.registration.showNotification(
        groupedTitle(group.type, group.count, group.title),
        {
          body: groupedBody(group.type, group.count, group.body),
          icon: "/icon-192.png?v=20260620",
          badge: "/icon-192.png?v=20260620",
          tag: key,
          renotify: false,
          data: { url: group.data.url || "/", ...group.data }
        }
      );
    }, GROUP_DELAY_MS);
  } catch (err) {
    console.error("Erreur notification background", err);
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification?.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          client.focus();
          if ("navigate" in client) client.navigate(targetUrl);
          return;
        }
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
