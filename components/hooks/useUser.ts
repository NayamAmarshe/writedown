import { deleteDoc, doc, getDoc, setDoc, writeBatch } from "firebase/firestore";
import { UserDoc } from "@/types/utils/firebaseOperations";
import { User, UserProfile } from "firebase/auth";
import { db } from "@/lib/firebase";

export const useUser = () => {
  const batch = writeBatch(db);
  const createUser = async (user: User) => {
    const currentTime = new Date().getTime();

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      photoURL: user.photoURL,
      displayName: user.displayName,
      createdAt: currentTime,
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
    if (!user) {
      throw new Error("User not found");
    }
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data() as UserDoc;

    if (
      userData &&
      (userData.username !== undefined || userData.username !== userData.uid)
    ) {
      return true;
    }
    return false;
  };

  return { createUser, setUsername, checkUsernameValidity, hasUsername };
};

export default useUser;
