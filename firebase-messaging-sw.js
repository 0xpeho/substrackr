importScripts(
  "https://www.gstatic.com/firebasejs/9.7.0/firebase-app-compat.js");
importScripts(
  "https://www.gstatic.com/firebasejs/9.7.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
    apiKey: "AIzaSyBuqrDoVsueyiLclkJsWo2SVnK4enAgh6Y",
    authDomain: "sub-trakr.firebaseapp.com",
    projectId: "sub-trakr",
    storageBucket: "sub-trakr.appspot.com",
    messagingSenderId: "678568956600",
    appId: "1:678568956600:web:8ca5d110a04d460f3cda4d",
    vapidKey: "BKumJauJcXmuPc4xySLQvYEnGMxTk2piTeGy06LipnVmhsTb01lizq5OTyXr_AaXL4Y1S4ujm9ZV_n6-81rxCgo"

  });
const messaging = firebase.messaging();
