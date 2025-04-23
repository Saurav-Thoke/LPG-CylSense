// firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDGjeafMtIXgYzEJYXdXWMyTaPc_DUhAuQ",
  authDomain: "lpgcycsense.firebaseapp.com",
  projectId: "lpgcycsense",
  storageBucket: "lpgcycsense.firebasestorage.app",
  messagingSenderId: "1092723237666",
  appId: "1:1092723237666:web:f2917fdacc44ea5fcbfb7b",
//   measurementId: "G-5PCCDL4TYE",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Received background message:', payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/icon.png',
  });
});
