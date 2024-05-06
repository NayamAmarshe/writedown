import { Firestore, getFirestore } from "firebase/firestore";
import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import "firebase/firestore";
import { Auth, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBbfVs3Q1NlARdE5wXZb4DLXonfcwMu2CI",
  authDomain: "writedown-4a984.firebaseapp.com",
  databaseURL: "https://writedown-4a984-default-rtdb.firebaseio.com",
  projectId: "writedown-4a984",
  storageBucket: "writedown-4a984.appspot.com",
  messagingSenderId: "991441150383",
  appId: "1:991441150383:web:73ab73141aee5c3bafcf5a",
};
let firebaseApp: FirebaseApp;
let db: Firestore;
let auth: Auth;
const currentApps = getApps();
if (currentApps.length <= 0) {
  firebaseApp = initializeApp(firebaseConfig);
  db = getFirestore(firebaseApp);
  auth = getAuth(firebaseApp);
} else {
  firebaseApp = currentApps[0];
  db = getFirestore(firebaseApp);
  auth = getAuth(firebaseApp);
}

export { db, auth, firebaseApp };
