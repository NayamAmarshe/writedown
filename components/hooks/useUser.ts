import { deleteDoc, doc, setDoc, writeBatch } from "firebase/firestore";
import { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import { useCallback } from "react";

// type UseUserProps = {};

export const useUser = () => {
  const batch = writeBatch(db);
  const createUser = async (user: User, userName: string) => {
    const usernameDoc = doc(db, "usernames", userName);
    batch.set(usernameDoc, {
      uid: user.uid,
    });

    const userDoc = doc(db, "users", user.uid);
    batch.set(userDoc, {
      uid: user.uid,
      username: userName,
      email: user.email,
      photoURL: user.photoURL,
      displayName: user.displayName,
      createdAt: new Date().toISOString(),
    });

    try {
      await batch.commit();
    } catch (error) {
      deleteDoc(userDoc);
      deleteDoc(usernameDoc);

      throw error;
    }
  };

  return { createUser };
};

export default useUser;
