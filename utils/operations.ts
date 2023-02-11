// Firebase v9 function to store data in users collection
import { collection, doc, setDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import { db } from "@/lib/firebase";

export const createUser = async (user: User) => {
  // Store user data in users collection
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    photoURL: user.photoURL,
    displayName: user.displayName,
    createdAt: new Date().toISOString(),
  });
};
