import { Firestore, getFirestore } from "firebase/firestore";
import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import "firebase/firestore";
import { Auth, getAuth } from "firebase/auth";
import { Functions, getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyCPQxCFAKFagaOOS3AdopO7CEvwYJiBaFk",
  authDomain: "writedown-project.firebaseapp.com",
  projectId: "writedown-project",
  storageBucket: "writedown-project.firebasestorage.app",
  messagingSenderId: "761562019136",
  appId: "1:761562019136:web:7ed74c6e46043525fbb6a5",
};

let firebaseApp: FirebaseApp;
let db: Firestore;
let auth: Auth;
let functions: Functions;
const currentApps = getApps();
if (currentApps.length <= 0) {
  firebaseApp = initializeApp(firebaseConfig);
  db = getFirestore(firebaseApp);
  auth = getAuth(firebaseApp);
  functions = getFunctions(firebaseApp, "us-central1");
} else {
  firebaseApp = currentApps[0];
  db = getFirestore(firebaseApp);
  auth = getAuth(firebaseApp);
  functions = getFunctions(firebaseApp, "us-central1");
}

export { db, auth, firebaseApp, functions };
