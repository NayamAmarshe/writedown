import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyCPQxCFAKFagaOOS3AdopO7CEvwYJiBaFk",
  authDomain: "writedown-project.firebaseapp.com",
  projectId: "writedown-project",
  storageBucket: "writedown-project.firebasestorage.app",
  messagingSenderId: "761562019136",
  appId: "1:761562019136:web:7ed74c6e46043525fbb6a5",
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const functions = getFunctions(firebaseApp);

export { db, auth, functions, firebaseApp };
