import { deleteDoc, doc, getDoc, setDoc, writeBatch } from "firebase/firestore";
import { UserDoc } from "@/types/utils/firebaseOperations";
import { useAuthState } from "react-firebase-hooks/auth";
import { User, UserProfile } from "firebase/auth";
import { db } from "@/lib/firebase";
import { auth } from "@/pages/_app";

export const useUser = () => {
  const [user] = useAuthState(auth);
  /**
   * Create a new user document in firestore with
   * default values
   * @param user
   */
  const createUser = async (user: User) => {
    if (!user) {
      throw new Error("User not found");
    }
    const currentTime = new Date().getTime();
    try {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        photoURL: user.photoURL,
        displayName: user.displayName,
        createdAt: currentTime,
      });
    } catch (error) {
      throw error;
    }
  };

  /**
   * Set username for a user
   * @param userId
   * @param userName
   */
  const setUsername = async (userId: string, userName: string) => {
    if (!userId) {
      throw new Error("User not found");
    }
    const batch = writeBatch(db);
    // Store username->uid mapping
    const usernameRef = doc(db, "usernames", userName);
    batch.set(usernameRef, {
      uid: userId,
    });
    // Store username in user document
    const userRef = doc(db, "users", userId);
    batch.update(userRef, {
      username: userName,
    });
    // Commit batch write
    try {
      await batch.commit();
    } catch (error) {
      // Rollback username->uid mapping
      deleteDoc(usernameRef);
      throw error;
    }
  };

  /**
   * Check if a username is available
   * @param userName
   */
  const checkUsernameValidity = async (userName: string) => {
    if (!userName) return false;
    const usernameDoc = doc(db, "usernames", userName);
    const usernameSnap = await getDoc(usernameDoc);
    return usernameSnap.exists() ? false : true;
  };

  /**
   * Check if a user has a username
   * @param user
   */
  const hasUsername = async (user: User) => {
    if (!user) {
      throw new Error("User not found");
    }
    const userRef = doc(db, "users", user.uid);
    try {
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data() as UserDoc;
      return userData && userData.username ? true : false;
    } catch (error) {
      throw error;
    }
  };

  return { user, createUser, setUsername, checkUsernameValidity, hasUsername };
};

export default useUser;
