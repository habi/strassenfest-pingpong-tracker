// firebase-config.example.js
//
// 1. Copy this file to firebase-config.js
// 2. Fill in your Firebase project credentials
//    (Firebase Console → Project Settings → Your apps → SDK setup)
//
// firebase-config.js is listed in .gitignore so your credentials
// are never accidentally committed to version control.

const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL:       "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};
