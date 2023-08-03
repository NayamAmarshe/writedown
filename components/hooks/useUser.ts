import { doc, writeBatch } from "firebase/firestore";
import { User } from "firebase/auth";
import { db } from "@/lib/firebase";

// type UseUserProps = {};

export const useUser = () => {
  const createUser = async (user: User) => {
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
  };

  return { createUser };
};

export default useUser;
