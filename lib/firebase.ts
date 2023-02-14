import { enableIndexedDbPersistence } from "firebase/firestore";
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

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == "failed-precondition") {
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a a time.
    // ...
  } else if (err.code == "unimplemented") {
    // The current browser does not support all of the
    // features required to enable persistence
    // ...
  } else {
    console.log("ENABLED");
  }
});

export { db, firebaseApp };
