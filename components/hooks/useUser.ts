import { doc, setDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import { useCallback } from "react";

// type UseUserProps = {};

export const useUser = () => {
  const createUser = async (user: User) => {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      photoURL: user.photoURL,
      displayName: user.displayName,
      createdAt: new Date().toISOString(),
    });
  };

  return { createUser };
};

export default useUser;
