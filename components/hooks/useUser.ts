import { deleteDoc, doc, getDoc, setDoc, writeBatch } from "firebase/firestore";
import { userDocConverter } from "@/utils/firestoreDataConverter";
import { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import { useCallback } from "react";

// type UseUserProps = {};

export const useUser = () => {
  const batch = writeBatch(db);
  const createUser = async (user: User) => {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      photoURL: user.photoURL,
      displayName: user.displayName,
      createdAt: new Date().toISOString(),
    });
  };

  const setUsername = async (user: User, userName: string) => {
    const usernameDoc = doc(db, "usernames", userName);
    batch.set(usernameDoc, {
      uid: user.uid,
    });
    const userDoc = doc(db, "users", user.uid);
    batch.update(userDoc, {
      username: userName,
    });

    try {
      await batch.commit();
    } catch (error) {
      deleteDoc(usernameDoc);

      throw error;
    }
  };

  const checkUsernameValidity = async (userName: string) => {
    const usernameDoc = doc(db, "usernames", userName);
    const existingUsername = await getDoc(usernameDoc);
    if (existingUsername.exists()) {
      return false;
    }
    return true;
  };

  const hasUsername = async (user: User) => {
    const userDoc = doc(db, "users", user.uid);
    const userData = await getDoc(userDoc);
    if (userData.exists() && userData.get("username") !== undefined) {
      return true;
    }
    return false;
  };

  return { createUser, setUsername, checkUsernameValidity, hasUsername };
};

export default useUser;
