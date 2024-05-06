import { deleteDoc, doc, getDoc, writeBatch } from "firebase/firestore";
import { userDocConverter } from "@/utils/firestoreDataConverter";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { UserDocument } from "@/types/utils/firebaseOperations";
import { useAuthState } from "react-firebase-hooks/auth";
import { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import { auth } from "@/lib/firebase";

export const useUser = () => {
  const [user] = useAuthState(auth);

  const [publicUserDetails] = useDocumentData(
    user ? doc(db, "users", user?.uid).withConverter(userDocConverter) : null
  );

  /**
   * Create a new user document in firestore with
   * default values
   * @param user
   */
  const checkUserExists = async (user: User) => {
    const userRef = doc(db, "users", user.uid);
    try {
      const userSnap = await getDoc(userRef);
      return userSnap.exists();
    } catch (error) {
      throw error;
    }
  };

  const createUser = async (user: User) => {
    if (!user) {
      throw new Error("User not found");
    }
    try {
      const batch = writeBatch(db);
      batch.set(doc(db, "users", user.uid), {
        uid: user.uid,
        photoURL: user.photoURL,
        displayName: user.displayName,
      });
      // TODO: Create a {username: uid} doc in usernames collection
      batch.set(doc(db, "users", user.uid, "extras", "private"), {
        email: user.email,
        createdAt: new Date().toISOString(),
      });
      await batch.commit();
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
      const userData = userSnap.data() as UserDocument;
      return userData && userData.username ? true : false;
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    /** The user document with public details */
    publicUserDetails,
    createUser,
    setUsername,
    checkUsernameValidity,
    hasUsername,
    checkUserExists,
  };
};

export default useUser;
