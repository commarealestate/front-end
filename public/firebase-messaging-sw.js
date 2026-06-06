importScripts('https://www.gstatic.com/firebasejs/10.5.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.5.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDUPTr4GtKdwh2bvuYiNqDt3MtoeckjLc0",
  authDomain: "bhaui-5e1ce.firebaseapp.com",
  projectId: "bhaui-5e1ce",
  storageBucket: "bhaui-5e1ce.firebasestorage.app",
  messagingSenderId: "438893349988",
  appId: "1:438893349988:web:48b677e67c8390c3e0e371",
  measurementId: "G-PF9Q06EBHL"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
// Handle notification click
self.addEventListener('notificationclick', event => {
  const { redirect_url } = event.notification.data;
  event.notification.close();

  if (redirect_url) {
    clients.openWindow(redirect_url);
  }
});