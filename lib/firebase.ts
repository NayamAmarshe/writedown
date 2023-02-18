import {
  enableIndexedDbPersistence,
  enableMultiTabIndexedDbPersistence,
} from "firebase/firestore";
import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBbfVs3Q1NlARdE5wXZb4DLXonfcwMu2CI",
  authDomain: "writedown-4a984.firebaseapp.com",
  databaseURL: "https://writedown-4a984-default-rtdb.firebaseio.com",
  projectId: "writedown-4a984",
  storageBucket: "writedown-4a984.appspot.com",
  messagingSenderId: "991441150383",
  appId: "1:991441150383:web:73ab73141aee5c3bafcf5a",
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

if (!(db as any)._firestoreClient) {
  enableMultiTabIndexedDbPersistence(db);
}

export { db, firebaseApp };
